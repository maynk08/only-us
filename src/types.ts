export type Sender = 'me' | 'partner'

export interface Person {
  name: string
  initial: string
  /** IANA time zone, e.g. "Asia/Kolkata" */
  timeZone: string
}

export interface Couple {
  me: Person
  partner: Person
  /** Local date the relationship started, YYYY-MM-DD */
  togetherSince: string
}

interface MessageBase {
  id: string
  sender: Sender
  /** ISO 8601, always UTC */
  sentAt: string
  seenAt?: string
  reactions?: string[]
}

export type MessageContent =
  | { kind: 'text'; text: string }
  | { kind: 'voice'; durationSec: number }
  | { kind: 'hug'; heldMs: number }
  | { kind: 'sticker'; stickerId: string }

export type Message = MessageBase & MessageContent
