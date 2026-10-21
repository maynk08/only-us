import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { HugCharacter } from './HugCharacter'
import { HEART_PATH } from './icons'

const MIN_HOLD_MS = 300
const FULL_HOLD_MS = 8000
const RING_RADIUS = 92
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

interface HugOrbProps {
  onHug: (heldMs: number) => void
}

/** Press and hold to hug; the ring fills the longer you hold. */
export function HugOrb({ onHug }: HugOrbProps) {
  const [progress, setProgress] = useState(0)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef(0)

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  // Timing uses event and animation-frame timestamps, which share the
  // performance.now() clock.
  const tick = (frameTime: number) => {
    if (startRef.current === null) return
    setProgress(Math.min((frameTime - startRef.current) / FULL_HOLD_MS, 1))
    frameRef.current = requestAnimationFrame(tick)
  }

  const begin = (eventTime: number) => {
    if (startRef.current !== null) return
    startRef.current = eventTime
    navigator.vibrate?.(12)
    frameRef.current = requestAnimationFrame(tick)
  }

  const end = (eventTime: number, send: boolean) => {
    if (startRef.current === null) return
    const held = eventTime - startRef.current
    startRef.current = null
    cancelAnimationFrame(frameRef.current)
    setProgress(0)
    if (send && held >= MIN_HOLD_MS) {
      navigator.vibrate?.([20, 60, 30])
      onHug(Math.min(held, FULL_HOLD_MS))
    }
  }

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    begin(e.timeStamp)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault()
      begin(e.timeStamp)
    }
  }

  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') end(e.timeStamp, true)
  }

  const holding = progress > 0

  return (
    <div className="glass glass-lg relative flex h-[196px] w-[196px] items-center justify-center rounded-full">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 -rotate-90" viewBox="0 0 196 196">
        <circle
          cx="98"
          cy="98"
          r={RING_RADIUS}
          fill="none"
          stroke="var(--rose)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH * (1 - progress)}
          opacity={holding ? 0.9 : 0}
        />
      </svg>

      <button
        type="button"
        aria-label="Hold to send a hug"
        onPointerDown={onPointerDown}
        onPointerUp={(e) => end(e.timeStamp, true)}
        onPointerCancel={(e) => end(e.timeStamp, false)}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onContextMenu={(e) => e.preventDefault()}
        className="orb flex h-[150px] w-[150px] touch-none flex-col items-center justify-center rounded-full select-none transition-transform duration-200"
        style={{
          animation: holding ? undefined : 'orb-breath 2.6s ease-in-out infinite',
          transform: holding ? 'scale(0.95)' : undefined,
        }}
      >
        <span className="-mt-1.5">
          <HugCharacter size={78} withHeart />
        </span>
        <span className="-mt-1 text-[13px] font-semibold tracking-wide">
          {holding ? `${((progress * FULL_HOLD_MS) / 1000).toFixed(1)}s` : 'Hold to hug'}
        </span>
      </button>

      <FloatingHeart className="top-[18px] right-[22px]" size={16} color="var(--blush)" />
      <FloatingHeart className="top-[46px] left-4" size={11} color="var(--peach)" delay="1.4s" />
    </div>
  )
}

export function FloatingHeart({
  className,
  size,
  color,
  delay = '0s',
}: {
  className: string
  size: number
  color: string
  delay?: string
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute ${className}`}
      style={{ animation: `drift 3.2s ease-out ${delay} infinite`, opacity: 0 }}
    >
      <path d={HEART_PATH} fill={color} />
    </svg>
  )
}
