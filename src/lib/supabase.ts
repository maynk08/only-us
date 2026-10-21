import { createClient } from '@supabase/supabase-js'

// Every request goes to our own origin under /supabase — the Cloudflare Worker
// in production, the Vite proxy in development — never to supabase.co directly.
export const supabase = createClient(`${location.origin}/supabase`, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})

/** "her" → "her@example.com"; full email addresses pass through unchanged. */
export function loginNameToEmail(name: string): string {
  const trimmed = name.trim().toLowerCase()
  return trimmed.includes('@') ? trimmed : `${trimmed}@${import.meta.env.VITE_LOGIN_EMAIL_DOMAIN}`
}
