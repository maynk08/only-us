import { buildPushPayload, type VapidKeys } from '@block65/webcrypto-web-push'

export interface PushEnv {
  SUPABASE_URL: string
  SUPABASE_PUBLISHABLE_KEY: string
  VAPID_PUBLIC_KEY: string
  VAPID_PRIVATE_KEY: string
}

interface MessageRow {
  id: string
  kind: string
  body: string | null
  meta: Record<string, unknown>
}

interface SubscriptionRow {
  endpoint: string
  p256dh: string
  auth: string
}

/** What the service worker shows. Keep in sync with public/push-handler.js. */
interface NotificationPayload {
  title: string
  body: string
  tag: string
  kind: string
  url: string
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

/** GET /api/push/key — the public VAPID key the browser subscribes with. */
export function handlePushKey(env: PushEnv): Response {
  if (!env.VAPID_PUBLIC_KEY) return json({ error: 'Push is not configured' }, 503)
  return json({ publicKey: env.VAPID_PUBLIC_KEY })
}

/**
 * POST /api/push { messageId } — called by the sender's app after a message is
 * saved. Uses the sender's own login for every Supabase call, so Row Level
 * Security decides what it can see; no service key lives in the Worker.
 */
export async function handlePush(request: Request, env: PushEnv): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return json({ error: 'Push is not configured' }, 503)

  const authorization = request.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'Not signed in' }, 401)

  const { messageId } = (await request.json().catch(() => ({}))) as { messageId?: unknown }
  if (typeof messageId !== 'string' || !/^[0-9a-f-]{36}$/i.test(messageId)) {
    return json({ error: 'Bad message id' }, 400)
  }

  const supabase = (path: string, init: RequestInit = {}) =>
    fetch(`${env.SUPABASE_URL}${path}`, {
      ...init,
      headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY, authorization, ...init.headers },
    })

  const userResponse = await supabase('/auth/v1/user')
  if (!userResponse.ok) return json({ error: 'Not signed in' }, 401)
  const { id: userId } = (await userResponse.json()) as { id: string }

  const [messages, profiles, subscriptions] = await Promise.all([
    supabase(`/rest/v1/messages?id=eq.${messageId}&sender_id=eq.${userId}&select=id,kind,body,meta`).then((r) =>
      r.ok ? (r.json() as Promise<MessageRow[]>) : [],
    ),
    supabase(`/rest/v1/profiles?id=eq.${userId}&select=display_name`).then((r) =>
      r.ok ? (r.json() as Promise<{ display_name: string }[]>) : [],
    ),
    supabase(`/rest/v1/push_subscriptions?user_id=neq.${userId}&select=endpoint,p256dh,auth`).then((r) =>
      r.ok ? (r.json() as Promise<SubscriptionRow[]>) : [],
    ),
  ])

  const message = messages[0]
  if (!message) return json({ error: 'Message not found' }, 404)

  const payload = describe(message, profiles[0]?.display_name ?? 'only us')
  const vapid: VapidKeys = {
    subject: new URL(request.url).origin,
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
  }

  const results = await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        const pushRequest = await buildPushPayload(
          // A day is plenty: older hugs aren't worth delivering late.
          { data: { ...payload }, options: { ttl: 60 * 60 * 24, urgency: 'high' } },
          {
            endpoint: subscription.endpoint,
            expirationTime: null,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
          },
          vapid,
        )
        const response = await fetch(subscription.endpoint, pushRequest)
        if (response.status === 404 || response.status === 410) {
          // The device unsubscribed or reinstalled; forget it.
          await supabase(`/rest/v1/push_subscriptions?endpoint=eq.${encodeURIComponent(subscription.endpoint)}`, {
            method: 'DELETE',
          })
        }
        return response.status
      } catch {
        return 0
      }
    }),
  )

  return json({ devices: results.length, statuses: results })
}

export function describe(message: MessageRow, senderName: string): NotificationPayload {
  const base = { tag: `msg-${message.id}`, kind: message.kind, url: '/chat' }
  switch (message.kind) {
    case 'hug': {
      const seconds = Math.max(1, Math.round(Number(message.meta?.heldMs) / 1000) || 1)
      return { ...base, title: `A hug from ${senderName}`, body: `Held for ${seconds}s`, url: '/' }
    }
    case 'nudge':
      return { ...base, title: `${senderName} is thinking of you`, body: 'Tap to say hi', url: '/' }
    case 'text': {
      const text = message.body ?? ''
      // One notification per chat, replaced by the newest message.
      return { ...base, tag: 'chat', title: senderName, body: text.length > 140 ? `${text.slice(0, 139)}…` : text }
    }
    case 'voice':
      return { ...base, tag: 'chat', title: senderName, body: 'Voice note' }
    case 'photo':
      return { ...base, tag: 'chat', title: senderName, body: 'Photo' }
    case 'sticker':
      return { ...base, tag: 'chat', title: senderName, body: 'Sticker' }
    default:
      return { ...base, tag: 'chat', title: senderName, body: 'New message' }
  }
}
