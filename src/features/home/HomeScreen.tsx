import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '../../components/Avatar'
import { HugOrb } from '../../components/HugOrb'
import { ImageIcon, MoonIcon, SparkleIcon, SunIcon } from '../../components/icons'
import { Toast } from '../../components/Toast'
import { useCouple, useMessages } from '../../data/context'
import { NotificationsCard } from '../notifications/NotificationsCard'
import { useTheme } from '../../lib/theme'
import { daysSince, formatClock, formatLongDate, isSameLocalDay } from '../../lib/time'
import { useNow } from '../../lib/useNow'

export function HomeScreen() {
  const now = useNow()
  const { theme, toggle } = useTheme()
  const { couple, partnerOnline } = useCouple()
  const { messages, send } = useMessages()
  const [toast, setToast] = useState<string | null>(null)
  const clearToast = useCallback(() => setToast(null), [])

  const { me, partner, togetherSince } = couple
  const hugsToday = messages.filter((m) => m.kind === 'hug' && isSameLocalDay(m.sentAt, now)).length

  const sendHug = (heldMs: number) => {
    send({ kind: 'hug', heldMs })
    setToast(`Hug sent · ${(heldMs / 1000).toFixed(1)}s`)
  }

  const sendNudge = () => {
    send({ kind: 'nudge' })
    setToast(`Sent to ${partner.name}`)
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Toast message={toast} onDone={clearToast} />

      <header className="flex items-center justify-between">
        <div className="glass flex h-12 items-center gap-2.5 rounded-full pr-4 pl-1.5">
          <div className="flex">
            <Avatar initial={me.initial} size={36} tone="sand" />
            <Avatar initial={partner.initial} size={36} className="-ml-2.5" />
          </div>
          <span className="text-sm font-semibold">
            {partnerOnline ? "You're both here" : `${partner.name} is away`}
          </span>
          <span
            className={`h-2 w-2 rounded-full ${partnerOnline ? 'bg-online' : 'bg-faint'}`}
            style={partnerOnline ? { boxShadow: '0 0 10px var(--online)' } : undefined}
          />
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === 'light' ? 'Switch to dusk mode' : 'Switch to light mode'}
          className="glass flex h-12 w-12 items-center justify-center rounded-full text-text"
        >
          {theme === 'light' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
        </button>
      </header>

      <NotificationsCard />

      <section className="glass glass-lg flex flex-col gap-1.5 rounded-[32px] px-[22px] pt-5 pb-[18px]">
        <div className="flex items-center justify-between text-muted">
          <span className="text-[11px] font-semibold tracking-[2px] uppercase">Together for</span>
          {togetherSince && <span className="text-xs">since {formatLongDate(togetherSince)}</span>}
        </div>
        <p className="font-serif text-[60px] leading-[1.05] font-light tracking-[-1px]">
          {togetherSince ? daysSince(togetherSince, now) : '—'} <span className="text-accent italic">days</span>
        </p>
        <div
          className="my-2 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--text-faint), transparent)' }}
        />
        <dl className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-xs text-muted">Time there</dt>
            <dd className="font-serif text-xl">{formatClock(now, partner.timeZone)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">Hugs today</dt>
            <dd className="font-serif text-xl">{hugsToday}</dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col items-center gap-3 pt-1">
        <HugOrb onHug={sendHug} />
        <p className="text-[13px] text-muted">The longer you hold, the tighter the hug</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={sendNudge}
          className="glass flex h-16 items-center gap-2 rounded-[22px] px-2.5 text-left text-[13.5px] font-semibold whitespace-nowrap text-text"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-well">
            <SparkleIcon size={18} />
          </span>
          Thinking of you
        </button>
        <Link
          to="/story"
          className="glass flex h-16 items-center gap-2 rounded-[22px] px-2.5 text-[13.5px] font-semibold whitespace-nowrap text-text no-underline"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-well">
            <ImageIcon size={18} />
          </span>
          On this day
        </Link>
      </section>
    </div>
  )
}
