import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { HugCharacter } from '../../components/HugCharacter'
import { enablePush, getPushState, refreshPushSubscription, type PushState } from '../../lib/push'

/** Home-screen prompt until notifications are on for this device. */
export function NotificationsCard() {
  const [state, setState] = useState<PushState | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justEnabled, setJustEnabled] = useState(false)

  useEffect(() => {
    getPushState().then(setState)
    refreshPushSubscription()
  }, [])

  if (state === 'on' && justEnabled) {
    return (
      <section role="status" className="glass flex items-center justify-between gap-3 rounded-[26px] px-4 py-3">
        <p className="text-sm font-semibold">Notifications are on</p>
        <Link to="/notifications" className="text-sm font-semibold text-accent">
          Phone tips
        </Link>
      </section>
    )
  }
  if (state === null || state === 'on' || state === 'unsupported') return null

  const turnOn = async () => {
    setBusy(true)
    setError(null)
    try {
      const next = await enablePush()
      setState(next)
      setJustEnabled(next === 'on')
    } catch {
      setError("Couldn't turn them on. Check your connection and try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="glass flex items-center gap-3 rounded-[26px] p-3 pr-4">
      <span className="orb flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
        <HugCharacter size={34} withCheeks={false} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {state === 'denied' ? (
          <>
            <p className="text-sm font-semibold">Notifications are blocked</p>
            <p className="text-xs text-muted">
              Allow them in Chrome: ⋮ → Settings → Site settings → Notifications.{' '}
              <Link to="/notifications" className="font-semibold">
                Help
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold">Get hugs when the app is closed</p>
            {error ? (
              <p role="alert" className="text-xs font-medium text-accent">
                {error}
              </p>
            ) : (
              <p className="text-xs text-muted">Messages and hugs arrive as notifications.</p>
            )}
          </>
        )}
      </div>
      {state === 'off' && (
        <button
          type="button"
          onClick={turnOn}
          disabled={busy}
          className="orb h-11 shrink-0 rounded-full px-4 text-sm font-semibold disabled:opacity-70"
        >
          {busy ? '…' : 'Turn on'}
        </button>
      )}
    </section>
  )
}
