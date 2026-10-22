import { useEffect, useState, type ReactNode } from 'react'
import { Splash } from '../../components/Splash'
import { CoupleProvider } from '../../data/CoupleProvider'
import { MessagesProvider } from '../../data/MessagesProvider'
import { supabase } from '../../lib/supabase'
import { LoginScreen } from './LoginScreen'
import { SessionContext, type SessionState } from './session'

/** Shows the login screen until there is a session, then loads our data and the app. */
export function AuthGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ session: null, loading: true })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setState({ session: data.session, loading: false }))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setState({ session, loading: false }))
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = state.session?.user.id

  return (
    <SessionContext.Provider value={state}>
      {state.loading ? (
        <Splash />
      ) : userId ? (
        <CoupleProvider key={userId} userId={userId}>
          <MessagesProvider>{children}</MessagesProvider>
        </CoupleProvider>
      ) : (
        <LoginScreen />
      )}
    </SessionContext.Provider>
  )
}
