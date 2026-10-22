import type { RealtimeChannel } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Splash } from '../components/Splash'
import { supabase } from '../lib/supabase'
import type { Couple, Person } from '../types'
import { CoupleContext, type CoupleState } from './context'

const TYPING_TIMEOUT_MS = 5000

interface ProfileRow {
  id: string
  display_name: string
  time_zone: string
}

function toPerson(row: ProfileRow): Person {
  return {
    id: row.id,
    name: row.display_name,
    initial: row.display_name.charAt(0).toUpperCase() || '?',
    timeZone: row.time_zone,
  }
}

/** Loads both profiles and the shared settings, and keeps presence + typing live. */
export function CoupleProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [couple, setCouple] = useState<Couple | null>(null)
  const [failed, setFailed] = useState(false)
  const [partnerOnline, setPartnerOnline] = useState(false)
  const [partnerTyping, setPartnerTyping] = useState(false)
  const [room, setRoom] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      supabase.from('profiles').select('id, display_name, time_zone'),
      supabase.from('couple').select('together_since').maybeSingle(),
    ]).then(([profiles, settings]) => {
      if (cancelled) return
      const rows = (profiles.data ?? []) as ProfileRow[]
      const me = rows.find((p) => p.id === userId)
      const partner = rows.find((p) => p.id !== userId)
      if (profiles.error || !me || !partner) {
        setFailed(true)
        return
      }
      setCouple({ me: toPerson(me), partner: toPerson(partner), togetherSince: settings.data?.together_since ?? null })
    })
    return () => {
      cancelled = true
    }
  }, [userId])

  const partnerId = couple?.partner.id
  useEffect(() => {
    if (!partnerId) return
    let typingTimer: ReturnType<typeof setTimeout> | undefined

    const room = supabase.channel('room', { config: { presence: { key: userId } } })

    const announce = () => {
      if (document.visibilityState === 'visible') room.track({ since: new Date().toISOString() })
      else room.untrack()
    }

    room
      .on('presence', { event: 'sync' }, () => setPartnerOnline(partnerId in room.presenceState()))
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload?.from !== partnerId) return
        clearTimeout(typingTimer)
        setPartnerTyping(Boolean(payload.typing))
        if (payload.typing) typingTimer = setTimeout(() => setPartnerTyping(false), TYPING_TIMEOUT_MS)
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRoom(room)
          announce()
        }
      })

    document.addEventListener('visibilitychange', announce)
    return () => {
      document.removeEventListener('visibilitychange', announce)
      clearTimeout(typingTimer)
      setRoom(null)
      supabase.removeChannel(room)
    }
  }, [userId, partnerId])

  const sendTyping = useCallback(
    (typing: boolean) => {
      room?.send({ type: 'broadcast', event: 'typing', payload: { from: userId, typing } })
    },
    [room, userId],
  )

  const value = useMemo<CoupleState | null>(
    () => (couple ? { couple, partnerOnline, partnerTyping, sendTyping } : null),
    [couple, partnerOnline, partnerTyping, sendTyping],
  )

  if (failed) return <NotSetUp />
  if (!value) return <Splash />
  return <CoupleContext.Provider value={value}>{children}</CoupleContext.Provider>
}

function NotSetUp() {
  return (
    <main className="mx-auto flex h-dvh max-w-[420px] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-3xl font-light">Almost there</h1>
      <p className="text-sm text-muted">
        This account isn't set up yet, or the connection failed. Check your internet, then try again.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => location.reload()}
          className="orb h-12 rounded-full px-6 text-sm font-semibold"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="glass h-12 rounded-full px-6 text-sm font-semibold text-text"
        >
          Sign out
        </button>
      </div>
    </main>
  )
}
