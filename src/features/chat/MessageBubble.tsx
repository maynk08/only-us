import { FloatingHeart } from '../../components/HugOrb'
import { HugCharacter } from '../../components/HugCharacter'
import { HeartIcon, PlayIcon, SparkleIcon } from '../../components/icons'
import { hugName } from '../../lib/hug'
import { formatClock } from '../../lib/time'
import type { Message } from '../../types'

interface MessageBubbleProps {
  message: Message
  /** Previous message is from the same sender — tightens the joining corner. */
  joinsPrevious: boolean
  partnerName: string
  onRetry: (id: string) => void
}

export function MessageBubble({ message, joinsPrevious, partnerName, onRetry }: MessageBubbleProps) {
  if (message.kind === 'hug') return <HugMoment message={message} partnerName={partnerName} />
  if (message.kind === 'nudge') return <Nudge message={message} partnerName={partnerName} />

  const mine = message.sender === 'me'
  const top = joinsPrevious ? 8 : 22
  const radius = mine ? `22px ${top}px 8px 22px` : `${top}px 22px 22px 8px`
  const time = formatClock(message.sentAt)

  if (message.kind === 'sticker') {
    return (
      <div
        className={`flex h-[108px] w-[108px] items-center justify-center rounded-[26px] border border-dashed text-xs text-muted ${mine ? 'self-end' : 'self-start'}`}
        style={{ borderColor: 'var(--dashed)' }}
      >
        [sticker]
      </div>
    )
  }

  return (
    <div className={`flex max-w-[78%] flex-col ${mine ? 'items-end self-end' : 'items-start self-start'}`}>
      <div
        className={`relative flex items-end gap-2 ${mine ? 'bubble-mine' : 'bubble-theirs'} ${
          message.kind === 'voice' ? 'w-[222px] py-2 pr-3 pl-2' : 'pt-[9px] pr-3 pb-[7px] pl-[15px]'
        }`}
        style={{ borderRadius: radius }}
      >
        {mine && <Gloss radius={radius} />}
        {message.kind === 'text' ? (
          <span dir="auto" className="relative text-[15px] leading-[1.4] break-words">
            {message.text}
          </span>
        ) : (
          <VoiceNote id={message.id} durationSec={message.durationSec} mine={mine} />
        )}
        <span className={`relative pb-px text-[10.5px] whitespace-nowrap ${mine ? 'text-ivory/80' : 'text-muted'}`}>
          {message.status === 'sending' ? 'Sending…' : time}
        </span>
      </div>
      {message.status === 'failed' && (
        <button
          type="button"
          onClick={() => onRetry(message.id)}
          className="mt-1 min-h-8 px-1 text-xs font-semibold text-accent"
        >
          Not sent · Tap to retry
        </button>
      )}
      {message.reactions?.includes('love') && (
        <span
          role="img"
          aria-label="Loved"
          className="bubble-mine -mt-[7px] ml-3.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/85"
        >
          <HeartIcon size={11} />
        </span>
      )}
    </div>
  )
}

/** Glossy highlight across the top of a rose bubble. */
function Gloss({ radius }: { radius: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-px top-px h-1/2"
      style={{
        borderRadius: radius,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0) 90%)',
      }}
    />
  )
}

function VoiceNote({ id, durationSec, mine }: { id: string; durationSec: number; mine: boolean }) {
  // Deterministic pseudo-waveform until real audio analysis exists.
  const seed = [...id].reduce((sum, c) => sum + c.charCodeAt(0), 0)
  const bars = Array.from({ length: 16 }, (_, i) => 6 + Math.round(Math.abs(Math.sin(seed + i * 1.7)) * 16))
  const played = 7
  const label = `0:${String(durationSec).padStart(2, '0')}`

  return (
    <>
      <button
        type="button"
        aria-label={`Play voice note, ${label}`}
        className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          mine ? 'bg-ivory text-rose' : 'orb'
        }`}
      >
        <PlayIcon />
      </button>
      <div aria-hidden="true" className="relative flex h-6 flex-1 items-center gap-0.5">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-sm"
            style={{
              height: h,
              background: mine ? '#ffe3e8' : 'var(--rose)',
              opacity: i < played ? 1 : 0.45,
            }}
          />
        ))}
      </div>
      <span className="relative text-[11px]">{label}</span>
    </>
  )
}

function HugMoment({ message, partnerName }: { message: Extract<Message, { kind: 'hug' }>; partnerName: string }) {
  const fromMe = message.sender === 'me'
  return (
    <div className="glass glass-lg relative my-2 flex items-center gap-3.5 self-center rounded-[30px] py-3 pr-[22px] pl-3">
      <div className="orb flex h-[60px] w-[60px] items-center justify-center rounded-full">
        <span className="-mt-0.5">
          <HugCharacter size={44} withHeart />
        </span>
      </div>
      <div className="flex flex-col">
        <span className="max-w-[210px] font-serif text-[18px] leading-snug italic">
          {fromMe ? `You sent ${hugName(message.heldMs)}` : `${partnerName} sent you ${hugName(message.heldMs)}`}
        </span>
        <span className="text-xs text-muted">
          {formatClock(message.sentAt)}
          {message.status === 'failed' ? ' · not sent' : ''}
        </span>
      </div>
      <FloatingHeart className="top-1.5 right-[18px]" size={12} color="var(--blush)" />
      <FloatingHeart className="top-3 right-10" size={9} color="var(--peach)" delay="1.3s" />
    </div>
  )
}

function Nudge({ message, partnerName }: { message: Message; partnerName: string }) {
  const fromMe = message.sender === 'me'
  return (
    <div className="glass-flat my-1 flex items-center gap-2 self-center rounded-full py-1.5 pr-4 pl-1.5 text-[13px]">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-well text-accent">
        <SparkleIcon size={15} />
      </span>
      <span>
        {fromMe ? `You're thinking of ${partnerName}` : `${partnerName} is thinking of you`}
        <span className="text-muted"> · {formatClock(message.sentAt)}</span>
      </span>
    </div>
  )
}
