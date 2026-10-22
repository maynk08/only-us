import { useEffect } from 'react'
import { HugCharacter } from '../../components/HugCharacter'
import { SparkleIcon } from '../../components/icons'
import { useCouple, useMessages } from '../../data/context'
import { hugName } from '../../lib/hug'

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
      className="glass glass-lg fixed inset-x-4 top-[calc(16px+env(safe-area-inset-top))] z-30 mx-auto flex w-fit max-w-[440px] items-center gap-3 rounded-full py-2 pr-6 pl-2 text-left text-text"
      style={{
        animation: 'rise-in 260ms ease-out',
        // Mostly opaque: it floats over busy content like the header.
        background:
          'linear-gradient(160deg, color-mix(in srgb, var(--bg) 94%, transparent), color-mix(in srgb, var(--bg) 84%, transparent)) padding-box, var(--glass-edge) border-box',
      }}
    >
      <span className="orb flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
        {isHug ? <HugCharacter size={36} withHeart /> : <SparkleIcon size={20} />}
      </span>
      <span className="flex flex-col">
        <span className="font-serif text-[17px] italic">
          {incoming.kind === 'hug' ? `${name} sent you ${hugName(incoming.heldMs)}` : `${name} is thinking of you`}
        </span>
      </span>
    </button>
  )
}
