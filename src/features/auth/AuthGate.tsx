import { useEffect, useState, type ReactNode } from 'react'
import { HugCharacter } from '../../components/HugCharacter'
import { supabase } from '../../lib/supabase'
import { LoginScreen } from './LoginScreen'
import { SessionContext, type SessionState } from './session'

/** Shows the login screen until there is a session, then the app. */
export function AuthGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ session: null, loading: true })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setState({ session: data.session, loading: false }))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setState({ session, loading: false }))
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <SessionContext.Provider value={state}>
      {state.loading ? <Splash /> : state.session ? children : <LoginScreen />}
    </SessionContext.Provider>
  )
}

function Splash() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <div
        className="orb flex h-24 w-24 items-center justify-center rounded-full"
        style={{ animation: 'orb-breath 2.6s ease-in-out infinite' }}
      >
        <HugCharacter size={56} />
      </div>
    </div>
  )
}
