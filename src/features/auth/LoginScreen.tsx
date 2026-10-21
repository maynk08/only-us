import { useState, type FormEvent } from 'react'
import { HugCharacter } from '../../components/HugCharacter'
import { loginNameToEmail, supabase } from '../../lib/supabase'

export function LoginScreen() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email: loginNameToEmail(name), password })
    setBusy(false)
    if (!error) return // AuthGate switches to the app on the auth state change.
    setError(
      error.status === 400 || error.code === 'invalid_credentials'
        ? "That name and password don't match."
        : "Can't reach the server right now. Check your connection and try again.",
    )
  }

  return (
    <main className="relative mx-auto flex h-dvh max-w-[420px] flex-col justify-center gap-8 px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="orb flex h-28 w-28 items-center justify-center rounded-full"
          style={{ animation: 'orb-breath 2.6s ease-in-out infinite' }}
        >
          <span className="-mt-1">
            <HugCharacter size={66} withHeart />
          </span>
        </div>
        <div>
          <h1 className="font-serif text-[44px] leading-tight font-light">
            only <span className="text-accent italic">us</span>
          </h1>
          <p className="text-sm text-muted">A private space for two.</p>
        </div>
      </div>

      <form onSubmit={submit} className="glass glass-lg flex flex-col gap-4 rounded-[32px] p-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-[1.5px] text-muted uppercase">Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            className="glass-flat h-12 rounded-2xl px-4 text-[15px] text-text outline-none focus:ring-2 focus:ring-rose/40"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold tracking-[1.5px] text-muted uppercase">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="glass-flat h-12 rounded-2xl px-4 text-[15px] text-text outline-none focus:ring-2 focus:ring-rose/40"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm font-medium text-accent">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="orb mt-1 h-[52px] rounded-full text-[15px] font-semibold tracking-wide disabled:opacity-70"
        >
          {busy ? 'Opening…' : 'Come in'}
        </button>
      </form>
    </main>
  )
}
