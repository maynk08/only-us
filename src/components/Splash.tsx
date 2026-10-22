import { HugCharacter } from './HugCharacter'

export function Splash() {
  return (
    <div role="status" aria-label="Loading" className="flex h-dvh items-center justify-center">
      <div
        className="orb flex h-24 w-24 items-center justify-center rounded-full"
        style={{ animation: 'orb-breath 2.6s ease-in-out infinite' }}
      >
        <HugCharacter size={56} />
      </div>
    </div>
  )
}
