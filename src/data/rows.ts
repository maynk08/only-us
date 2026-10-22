import type { Message, MessageContent, MessageRow } from '../types'

/** Database row → app message. Kinds the app can't show yet return null. */
export function rowToMessage(row: MessageRow, myId: string): Message | null {
  const base = {
    id: row.id,
    sender: row.sender_id === myId ? ('me' as const) : ('partner' as const),
    sentAt: row.created_at,
    seenAt: row.seen_at ?? undefined,
  }
  const meta = row.meta ?? {}
  switch (row.kind) {
    case 'text':
      return { ...base, kind: 'text', text: row.body ?? '' }
    case 'hug':
      return { ...base, kind: 'hug', heldMs: Number(meta.heldMs) || 1000 }
    case 'nudge':
      return { ...base, kind: 'nudge' }
    case 'voice':
      return { ...base, kind: 'voice', durationSec: Number(meta.durationSec) || 0 }
    case 'sticker':
      return { ...base, kind: 'sticker', stickerId: String(meta.stickerId ?? '') }
    default:
      return null
  }
}

type NewMessageRow = Pick<MessageRow, 'id' | 'kind'> & Partial<Pick<MessageRow, 'body' | 'meta'>>

/** App message content → insert payload. sender_id defaults to auth.uid() in the database. */
export function contentToRow(id: string, content: MessageContent): NewMessageRow {
  switch (content.kind) {
    case 'text':
      return { id, kind: 'text', body: content.text }
    case 'hug':
      return { id, kind: 'hug', meta: { heldMs: Math.round(content.heldMs) } }
    case 'nudge':
      return { id, kind: 'nudge' }
    case 'voice':
      return { id, kind: 'voice', meta: { durationSec: content.durationSec } }
    case 'sticker':
      return { id, kind: 'sticker', meta: { stickerId: content.stickerId } }
  }
}

/** Insert or replace by id, keeping the list in time order. */
export function upsertMessage(list: Message[], message: Message): Message[] {
  const index = list.findIndex((m) => m.id === message.id)
  const next = index === -1 ? [...list, message] : list.map((m, i) => (i === index ? message : m))
  return next.sort((a, b) => a.sentAt.localeCompare(b.sentAt))
}
