import type { Session } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export interface SessionState {
  session: Session | null
  /** True until the stored session has been read on startup. */
  loading: boolean
}

export const SessionContext = createContext<SessionState>({ session: null, loading: true })

export function useSession() {
  return useContext(SessionContext)
}
