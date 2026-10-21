import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Avatar } from '../../components/Avatar'
import { HugCharacter } from '../../components/HugCharacter'
import { BackIcon } from '../../components/icons'
import { couple, initialMessages } from '../../data/mock'
import { formatClock } from '../../lib/time'
import { useNow } from '../../lib/useNow'
import type { Message, MessageContent } from '../../types'
import { Composer } from './Composer'
import { MessageBubble } from './MessageBubble'

export function ChatScreen() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  const now = useNow()

  const append = (content: MessageContent) =>
    setMessages((list) => [
      ...list,
      { ...content, id: crypto.randomUUID(), sender: 'me', sentAt: new Date().toISOString() },
    ])

  const lastSeenMine = [...messages].reverse().find((m) => m.sender === 'me' && m.seenAt && m.kind !== 'hug')

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between px-4 pt-[calc(16px+env(safe-area-inset-top))] pb-2.5">
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate('/')}
          className="glass flex h-12 w-12 items-center justify-center rounded-full text-text"
        >
          <BackIcon />
        </button>
        <div className="glass flex h-[52px] items-center gap-2.5 rounded-full pr-[18px] pl-1.5">
          <Avatar initial={couple.partner.initial} online />
          <div className="flex flex-col">
            <span className="font-serif text-[17px] leading-tight font-medium">{couple.partner.name}</span>
            <span className="text-[11px] text-muted">Here now · {formatClock(now, couple.partner.timeZone)}</span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Send a hug"
          onClick={() => append({ kind: 'hug', heldMs: 2000 })}
          className="orb flex h-12 w-12 items-center justify-center rounded-full"
        >
          <span className="-mt-0.5">
            <HugCharacter size={34} withCheeks={false} />
          </span>
        </button>
      </header>

      <main aria-label="Messages" className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 pt-2 pb-3">
        <span className="mt-auto self-center py-1 pb-2 font-serif text-sm text-muted italic">Tonight</span>
        {messages.map((message, i) => {
          const prev = messages[i - 1]
          const joinsPrevious = !!prev && prev.sender === message.sender && prev.kind !== 'hug'
          return (
            <div key={message.id} className="contents">
              <MessageBubble message={message} joinsPrevious={joinsPrevious} />
              {message === lastSeenMine && (
                <span className="self-end pr-1.5 text-[11px] text-muted">Seen {formatClock(message.seenAt!)}</span>
              )}
            </div>
          )
        })}
        <TypingIndicator />
        <div ref={endRef} />
      </main>

      <Composer onSend={(text) => append({ kind: 'text', text })} />
    </div>
  )
}

function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label="Typing"
      className="bubble-theirs flex gap-[5px] self-start rounded-[20px] px-4 py-[13px]"
    >
      {[0, 0.15, 0.3].map((delay) => (
        <span
          key={delay}
          className="h-[7px] w-[7px] rounded-full bg-text"
          style={{ animation: `typing-dot 1.2s ease-in-out ${delay}s infinite` }}
        />
      ))}
    </div>
  )
}
