import type { Couple, Message } from '../types'

// Placeholder data until the backend exists. Names and dates get replaced by
// real profile data in phase 1.
export const couple: Couple = {
  me: { name: 'You', initial: 'Y', timeZone: 'Asia/Kolkata' },
  partner: { name: 'Her', initial: 'H', timeZone: 'Asia/Karachi' },
  togetherSince: '2024-09-05',
}

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString()

export const initialMessages: Message[] = [
  { id: 'm1', sender: 'partner', kind: 'text', text: 'khana khaya?', sentAt: minutesAgo(9) },
  { id: 'm2', sender: 'me', kind: 'text', text: 'haan abhi. tum?', sentAt: minutesAgo(7), seenAt: minutesAgo(6) },
  { id: 'm3', sender: 'me', kind: 'voice', durationSec: 14, sentAt: minutesAgo(7), seenAt: minutesAgo(6) },
  { id: 'm4', sender: 'partner', kind: 'hug', heldMs: 6000, sentAt: minutesAgo(5) },
  { id: 'm5', sender: 'partner', kind: 'sticker', stickerId: 'placeholder', sentAt: minutesAgo(4) },
  {
    id: 'm6',
    sender: 'partner',
    kind: 'text',
    text: 'so sleepy… call in 5?',
    sentAt: minutesAgo(3),
    reactions: ['love'],
  },
]
