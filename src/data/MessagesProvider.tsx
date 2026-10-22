import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { Message, MessageContent, MessageRow } from '../types'
import { MessagesContext, useCouple, type MessagesState } from './context'
import { contentToRow, rowToMessage, upsertMessage } from './rows'

const PAGE_SIZE = 200

/**
 * One live feed of messages for the whole app: initial page from the database,
 * then Realtime inserts/updates. Refetches when the connection comes back or
 * the app returns to the foreground, so nothing is missed while asleep.
 */
export function MessagesProvider({ children }: { children: ReactNode }) {
  const { couple } = useCouple()
  const myId = couple.me.id
  const partnerId = couple.partner.id

  const [messages, setMessages] = useState<Message[]>([])
  const [loaded, setLoaded] = useState(false)
  const [incoming, setIncoming] = useState<Message | null>(null)
  const messagesRef = useRef(messages)
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE)
    if (error) return
    const fresh = (data as MessageRow[])
      .reverse()
      .map((row) => rowToMessage(row, myId))
      .filter((m): m is Message => m !== null)
    const freshIds = new Set(fresh.map((m) => m.id))
    const newest = fresh.at(-1)?.sentAt ?? ''
    // Keep my unsent/failed messages, and anything Realtime delivered after this page was read.
    setMessages((current) =>
      [...fresh, ...current.filter((m) => !freshIds.has(m.id) && (m.status || m.sentAt > newest))].sort((a, b) =>
        a.sentAt.localeCompare(b.sentAt),
      ),
    )
    setLoaded(true)
  }, [myId])

  useEffect(() => {
    const feed = supabase
      .channel('messages-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, ({ new: row }) => {
        const message = rowToMessage(row as MessageRow, myId)
        if (!message) return
        setMessages((list) => upsertMessage(list, message))
        if (message.sender === 'partner' && (message.kind === 'hug' || message.kind === 'nudge')) {
          setIncoming(message)
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, ({ new: row }) => {
        const message = rowToMessage(row as MessageRow, myId)
        if (message) setMessages((list) => upsertMessage(list, message))
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, ({ old }) => {
        setMessages((list) => list.filter((m) => m.id !== (old as Partial<MessageRow>).id))
      })
      // Reload on every (re)subscribe to fill any gap while disconnected.
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') load()
      })
    // Don't wait for Realtime: if it can't connect, the chat must still load.
    // oxlint-disable-next-line react/set-state-in-effect -- load() sets state only after the network round trip
    load()

    const onVisible = () => {
      if (document.visibilityState === 'visible') load()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      supabase.removeChannel(feed)
    }
  }, [myId, load])

  const insert = useCallback(async (id: string, content: MessageContent) => {
    const { error } = await supabase.from('messages').insert(contentToRow(id, content))
    setMessages((list) =>
      list.map((m) => (m.id === id ? ({ ...m, status: error ? 'failed' : undefined } as Message) : m)),
    )
  }, [])

  const send = useCallback(
    (content: MessageContent) => {
      const id = crypto.randomUUID()
      const optimistic = {
        ...content,
        id,
        sender: 'me',
        sentAt: new Date().toISOString(),
        status: 'sending',
      } as Message
      setMessages((list) => [...list, optimistic])
      insert(id, content)
    },
    [insert],
  )

  const retry = useCallback(
    (id: string) => {
      const failed = messagesRef.current.find((m) => m.id === id && m.status === 'failed')
      if (!failed) return
      setMessages((list) => list.map((m) => (m.id === id ? ({ ...m, status: 'sending' } as Message) : m)))
      insert(id, failed)
    },
    [insert],
  )

  const markSeen = useCallback(() => {
    const unseen = messagesRef.current.some((m) => m.sender === 'partner' && !m.seenAt)
    if (!unseen) return
    const seenAt = new Date().toISOString()
    // Mark locally first so this doesn't repeat; Realtime confirms it for the sender.
    setMessages((list) => list.map((m) => (m.sender === 'partner' && !m.seenAt ? { ...m, seenAt } : m)))
    supabase
      .from('messages')
      .update({ seen_at: seenAt })
      .eq('sender_id', partnerId)
      .is('seen_at', null)
      .then(() => undefined)
  }, [partnerId])

  const clearIncoming = useCallback(() => setIncoming(null), [])

  const value = useMemo<MessagesState>(
    () => ({ messages, loaded, send, retry, markSeen, incoming, clearIncoming }),
    [messages, loaded, send, retry, markSeen, incoming, clearIncoming],
  )

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
}
