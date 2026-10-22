const clockFormatters = new Map<string, Intl.DateTimeFormat>()

function clockFormatter(timeZone?: string) {
  const key = timeZone ?? 'local'
  let formatter = clockFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone,
    })
    clockFormatters.set(key, formatter)
  }
  return formatter
}

/** "11:42 pm" — in the given time zone, or the device's when omitted. */
export function formatClock(date: Date | string, timeZone?: string): string {
  const value = typeof date === 'string' ? new Date(date) : date
  return clockFormatter(timeZone).format(value).toLowerCase()
}

/** Whole days since a local YYYY-MM-DD date (day one counts as 1). */
export function daysSince(localDate: string, now: Date = new Date()): number {
  const [y, m, d] = localDate.split('-').map(Number)
  const start = Date.UTC(y, m - 1, d)
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor((today - start) / 86_400_000) + 1
}

export function formatLongDate(localDate: string): string {
  const [y, m, d] = localDate.split('-').map(Number)
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(y, m - 1, d),
  )
}

export function isSameLocalDay(a: Date | string, b: Date | string): boolean {
  const x = new Date(a)
  const y = new Date(b)
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate()
}

/** "Today", "Yesterday" or "21 Oct" — for date separators in the chat. */
export function formatDayLabel(iso: string, now: Date = new Date()): string {
  if (isSameLocalDay(iso, now)) return 'Today'
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (isSameLocalDay(iso, yesterday)) return 'Yesterday'
  const sameYear = new Date(iso).getFullYear() === now.getFullYear()
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: sameYear ? undefined : 'numeric',
  }).format(new Date(iso))
}
