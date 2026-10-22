import { supabase } from './supabase'

export type PushState = 'unsupported' | 'denied' | 'off' | 'on'

function supported() {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=')
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
}

async function saveSubscription(subscription: PushSubscription) {
  const { endpoint, keys } = subscription.toJSON()
  if (!endpoint || !keys?.p256dh || !keys.auth) throw new Error('Incomplete push subscription')
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({ endpoint, p256dh: keys.p256dh, auth: keys.auth }, { onConflict: 'endpoint' })
  if (error) throw error
}

export async function getPushState(): Promise<PushState> {
  if (!supported()) return 'unsupported'
  if (Notification.permission === 'denied') return 'denied'
  if (Notification.permission !== 'granted') return 'off'
  const registration = await navigator.serviceWorker.getRegistration()
  const subscription = await registration?.pushManager.getSubscription()
  return subscription ? 'on' : 'off'
}

/** Ask for permission, subscribe this device and save it. Must run from a tap. */
export async function enablePush(): Promise<PushState> {
  if (!supported()) return 'unsupported'
  const permission = await Notification.requestPermission()
  if (permission === 'denied') return 'denied'
  if (permission !== 'granted') return 'off'

  const response = await fetch('/api/push/key')
  if (!response.ok) throw new Error('Push is not configured on the server yet')
  const { publicKey } = (await response.json()) as { publicKey: string }

  const registration = await navigator.serviceWorker.ready
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlToBytes(publicKey),
    }))
  await saveSubscription(subscription)
  return 'on'
}

/** Re-save this device's subscription on startup; browsers can rotate it. */
export async function refreshPushSubscription() {
  if (!supported() || Notification.permission !== 'granted') return
  const registration = await navigator.serviceWorker.getRegistration()
  const subscription = await registration?.pushManager.getSubscription()
  if (subscription) await saveSubscription(subscription).catch(() => undefined)
}

/** Ask the Worker to notify the other person about a message I just saved. */
export async function notifyPartner(messageId: string) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) return
  await fetch('/api/push', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ messageId }),
    // Still delivered if the app is closed right after sending.
    keepalive: true,
  }).catch(() => undefined)
}
