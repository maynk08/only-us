/**
 * Soft colour fields behind the glass, plus film grain so the gradients don't
 * band. Radial gradients instead of filter: blur() — same look, far cheaper on
 * low-end GPUs.
 */
const blobs = [
  { color: 'var(--blob-1)', style: { top: '-14%', left: '-34%', width: '120%', height: '56%' } },
  { color: 'var(--blob-2)', style: { top: '2%', right: '-36%', width: '90%', height: '42%' } },
  { color: 'var(--blob-3)', style: { top: '40%', left: '-30%', width: '100%', height: '46%' } },
  { color: 'var(--blob-4)', style: { bottom: '-18%', right: '-34%', width: '110%', height: '52%' } },
  { color: 'var(--blob-5)', style: { bottom: '10%', left: '-24%', width: '72%', height: '34%' } },
]

export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      {blobs.map(({ color, style }, i) => (
        <div
          key={i}
          className="absolute"
          style={{ ...style, background: `radial-gradient(closest-side, ${color}, transparent)` }}
        />
      ))}
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 'var(--grain-opacity)', mixBlendMode: 'var(--grain-blend)' as 'overlay' }}
      >
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  )
}
