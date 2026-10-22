import { useEffect } from 'react'
import { HugCharacter } from '../../components/HugCharacter'
import { SparkleIcon } from '../../components/icons'
import { useCouple, useMessages } from '../../data/context'

const SHOW_MS = 3500

/**
 * A hug or "thinking of you" that arrives while the app is open pops up on any
 * screen. (When the app is closed, push notifications take over — phase 4.)
 */
export function IncomingMoments() {
  const { couple } = useCouple()
  const { incoming, clearIncoming } = useMessages()

  useEffect(() => {
    if (!incoming) return
    navigator.vibrate?.(incoming.kind === 'hug' ? [40, 80, 40, 80, 120] : [30, 60, 30])
    const timer = setTimeout(clearIncoming, SHOW_MS)
    return () => clearTimeout(timer)
  }, [incoming, clearIncoming])

  if (!incoming) return null
  const name = couple.partner.name
  const isHug = incoming.kind === 'hug'

  return (
    <button
      type="button"
      onClick={clearIncoming}
      className="glass glass-lg fixed top-[calc(16px+env(safe-area-inset-top))] left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full py-2 pr-6 pl-2 text-left text-text"
      style={{ animation: 'rise-in 260ms ease-out' }}
    >
      <span className="orb flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
        {isHug ? <HugCharacter size={36} withHeart /> : <SparkleIcon size={20} />}
      </span>
      <span className="flex flex-col">
        <span className="font-serif text-[17px] italic">
          {isHug ? `A hug from ${name}` : `${name} is thinking of you`}
        </span>
        {isHug && incoming.kind === 'hug' && (
          <span className="text-xs text-muted">held for {Math.max(1, Math.round(incoming.heldMs / 1000))}s</span>
        )}
      </span>
    </button>
  )
}
