import { createContext, useContext } from 'react'
import type { Couple, Message, MessageContent } from '../types'

export interface CoupleState {
  couple: Couple
  partnerOnline: boolean
  partnerTyping: boolean
  /** Tell the partner whether I'm typing (throttle on the caller side). */
  sendTyping: (typing: boolean) => void
}

export interface MessagesState {
  messages: Message[]
  /** True once the first page has loaded from the server. */
  loaded: boolean
  send: (content: MessageContent) => void
  retry: (id: string) => void
  /** Mark everything the partner sent as seen. */
  markSeen: () => void
  /** Latest hug or nudge from the partner that arrived live, for a pop-up. */
  incoming: Message | null
  clearIncoming: () => void
}

export const CoupleContext = createContext<CoupleState | null>(null)
export const MessagesContext = createContext<MessagesState | null>(null)

export function useCouple(): CoupleState {
  const value = useContext(CoupleContext)
  if (!value) throw new Error('useCouple must be used inside <CoupleProvider>')
  return value
}

export function useMessages(): MessagesState {
  const value = useContext(MessagesContext)
  if (!value) throw new Error('useMessages must be used inside <MessagesProvider>')
  return value
}
