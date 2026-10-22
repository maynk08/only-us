/**
 * Words for a hug, from how long it was held (max 8 s). Shared by the app and
 * the Worker so notifications and the chat say the same thing.
 */
export function hugName(heldMs: number): string {
  if (heldMs < 1500) return 'a quick hug'
  if (heldMs < 4000) return 'a warm hug'
  if (heldMs < 7000) return 'a long hug'
  return 'the tightest hug'
}
