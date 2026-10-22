import { useEffect } from 'react'

interface ToastProps {
  message: string | null
  onDone: () => void
}

export function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDone, 2200)
    return () => clearTimeout(timer)
  }, [message, onDone])

  if (!message) return null
  return (
    <div
      role="status"
      className="glass glass-lg fixed top-5 left-1/2 z-20 -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap"
      style={{ animation: 'rise-in 220ms ease-out' }}
    >
      {message}
    </div>
  )
}
