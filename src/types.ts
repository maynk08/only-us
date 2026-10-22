export type Sender = 'me' | 'partner'

export interface Person {
  id: string
  name: string
  initial: string
  /** IANA time zone, e.g. "Asia/Kolkata" */
  timeZone: string
}

export interface Couple {
  me: Person
  partner: Person
  /** Local date the relationship started, YYYY-MM-DD; null until set. */
  togetherSince: string | null
}

interface MessageBase {
  id: string
  sender: Sender
  /** ISO 8601, always UTC */
  sentAt: string
  seenAt?: string
  reactions?: string[]
  /** Only on my own messages that haven't reached the server yet. */
  status?: 'sending' | 'failed'
}

export type MessageContent =
  | { kind: 'text'; text: string }
  | { kind: 'voice'; durationSec: number }
  | { kind: 'hug'; heldMs: number }
  | { kind: 'nudge' }
  | { kind: 'sticker'; stickerId: string }

export type Message = MessageBase & MessageContent

/** A row of public.messages (see supabase/migrations). */
export interface MessageRow {
  id: string
  sender_id: string
  kind: string
  body: string | null
  meta: Record<string, unknown>
  reply_to: string | null
  created_at: string
  seen_at: string | null
}
