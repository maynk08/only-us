import { Fragment, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Avatar } from '../../components/Avatar'
import { HugCharacter } from '../../components/HugCharacter'
import { BackIcon } from '../../components/icons'
import { useCouple, useMessages } from '../../data/context'
import { formatClock, formatDayLabel, isSameLocalDay } from '../../lib/time'
import { useNow } from '../../lib/useNow'
import { Composer } from './Composer'
import { MessageBubble } from './MessageBubble'

export function ChatScreen() {
  const navigate = useNavigate()
  const now = useNow()
  const { couple, partnerOnline, partnerTyping, sendTyping } = useCouple()
  const { messages, loaded, send, retry, markSeen } = useMessages()
  const endRef = useRef<HTMLDivElement>(null)
  const partner = couple.partner

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, partnerTyping])

  // Reading the chat marks the partner's messages as seen — decided from the
  // messages this screen is showing, so a new arrival is marked straight away.
  const hasUnseen = messages.some((m) => m.sender === 'partner' && !m.seenAt)
  useEffect(() => {
    if (!hasUnseen) return
    if (document.visibilityState === 'visible') markSeen()
    const onVisible = () => document.visibilityState === 'visible' && markSeen()
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [hasUnseen, markSeen])

  const lastSeenMine = messages.findLast((m) => m.sender === 'me' && m.seenAt && m.kind !== 'hug')
  const status = partnerTyping
    ? 'typing…'
    : `${partnerOnline ? 'Here now' : 'Away'} · ${formatClock(now, partner.timeZone)} there`

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
          <Avatar initial={partner.initial} online={partnerOnline} />
          <div className="flex flex-col">
            <span className="font-serif text-[17px] leading-tight font-medium">{partner.name}</span>
            <span className="text-[11px] text-muted" aria-live="polite">
              {status}
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Send a hug"
          onClick={() => send({ kind: 'hug', heldMs: 2000 })}
          className="orb flex h-12 w-12 items-center justify-center rounded-full"
        >
          <span className="-mt-0.5">
            <HugCharacter size={34} withCheeks={false} />
          </span>
        </button>
      </header>

      <main aria-label="Messages" className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-4 pt-2 pb-3">
        <div className="mt-auto" />
        {loaded && messages.length === 0 && (
          <p className="self-center py-6 text-center text-sm text-muted">No messages yet. Say hello.</p>
        )}
        {messages.map((message, i) => {
          const prev = messages[i - 1]
          const newDay = !prev || !isSameLocalDay(prev.sentAt, message.sentAt)
          const joinsPrevious =
            !newDay && !!prev && prev.sender === message.sender && prev.kind !== 'hug' && prev.kind !== 'nudge'
          return (
            <Fragment key={message.id}>
              {newDay && (
                <span className="self-center py-1 pb-2 font-serif text-sm text-muted italic">
                  {formatDayLabel(message.sentAt, now)}
                </span>
              )}
              <MessageBubble
                message={message}
                joinsPrevious={joinsPrevious}
                partnerName={partner.name}
                onRetry={retry}
              />
              {message === lastSeenMine && (
                <span className="self-end pr-1.5 text-[11px] text-muted">Seen {formatClock(message.seenAt!)}</span>
              )}
            </Fragment>
          )
        })}
        {partnerTyping && <TypingIndicator />}
        <div ref={endRef} />
      </main>

      <Composer onSend={(text) => send({ kind: 'text', text })} onTyping={sendTyping} />
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
