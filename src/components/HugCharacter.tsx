interface HugCharacterProps {
  size: number
  /** Little heart that floats up above the pair. */
  withHeart?: boolean
  /** Rosy cheeks — hidden at very small sizes where they turn to noise. */
  withCheeks?: boolean
  animated?: boolean
}

/**
 * The hug mark: two round characters leaning into each other. Drawn for rose
 * (orb) backgrounds, so its colours are fixed rather than theme tokens.
 */
export function HugCharacter({ size, withHeart = false, withCheeks = true, animated = true }: HugCharacterProps) {
  const eyeWidth = size < 40 ? 2 : 1.7
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="overflow-visible">
      {withHeart && (
        <path
          d="M32 18s-5.5-3.4-7.2-6.8A3.9 3.9 0 0 1 32 7.9a3.9 3.9 0 0 1 7.2 3.3C37.5 14.6 32 18 32 18z"
          fill="#ffc9d4"
          style={
            animated
              ? { animation: 'heart-float 2.6s ease-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }
              : undefined
          }
        />
      )}
      <g
        style={
          animated
            ? {
                animation: 'hug-squeeze 2.6s ease-in-out infinite',
                transformBox: 'fill-box',
                transformOrigin: '50% 100%',
              }
            : undefined
        }
      >
        <g transform="rotate(-7 40 55)">
          <ellipse cx="40" cy="40" rx="13" ry="15" fill="#ffdce3" />
          <path
            d="M40.5 38.5q1.8-1.8 3.6 0M46.5 38.5q1.8-1.8 3.6 0"
            stroke="#6e2236"
            strokeWidth={eyeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {withCheeks && <ellipse cx="50.5" cy="43" rx="2.4" ry="1.5" fill="#f07c98" />}
        </g>
        <g transform="rotate(7 24 55)">
          <ellipse cx="24" cy="40" rx="13" ry="15" fill="#fff8f5" />
          <path
            d="M22 38.5q1.8-1.8 3.6 0M28.5 38.5q1.8-1.8 3.6 0"
            stroke="#6e2236"
            strokeWidth={eyeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {withCheeks && (
            <>
              <ellipse cx="20.5" cy="43" rx="2.4" ry="1.5" fill="#f07c98" />
              <ellipse cx="33" cy="43" rx="2.2" ry="1.4" fill="#f07c98" />
            </>
          )}
        </g>
        <path
          d="M34 46.5c3.6 1.6 8.2 1 11.6-2.4"
          stroke="#fff8f5"
          strokeWidth={4.5}
          fill="none"
          strokeLinecap="round"
        />
        <path d="M31 48c-2.8 1.4-6.4 1.3-9.2-.3" stroke="#ffdce3" strokeWidth={4.5} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}
