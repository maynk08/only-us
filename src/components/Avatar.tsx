interface AvatarProps {
  initial: string
  size?: number
  tone?: 'blush' | 'sand'
  online?: boolean
  className?: string
}

export function Avatar({ initial, size = 40, tone = 'blush', online = false, className = '' }: AvatarProps) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <div
        className="flex h-full w-full items-center justify-center rounded-full font-semibold text-rose-deep"
        style={{ background: tone === 'blush' ? 'var(--blush)' : 'var(--sand)', fontSize: size * 0.38 }}
      >
        {initial}
      </div>
      {online && (
        <span
          className="absolute -right-px -bottom-px h-3 w-3 rounded-full bg-online"
          style={{ boxShadow: '0 0 8px var(--online)' }}
        />
      )}
    </div>
  )
}
