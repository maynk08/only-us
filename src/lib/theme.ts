import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dusk'

const STORAGE_KEY = 'only-us:theme'
const THEME_COLOR: Record<Theme, string> = { light: '#fff8f4', dusk: '#2a0e1b' }

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dusk' ? 'dusk' : 'light'
  } catch {
    return 'light'
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
}

/** Light is the default; the choice is remembered per device. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'light' ? 'dusk' : 'light')), [])

  return { theme, toggle }
}
