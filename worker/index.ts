/**
 * Cloudflare Worker: serves the built app, proxies Supabase under /supabase/*
 * so the phones only ever talk to our own domain (some ISPs have blocked
 * supabase.co before — see docs/ARCHITECTURE.md), and sends push
 * notifications under /api/push.
 */

import { handlePush, handlePushKey, type PushEnv } from './push'

interface Env extends PushEnv {
  ASSETS: Fetcher
}

const PREFIX = '/supabase'
const SUPABASE_SERVICES = ['/auth/v1/', '/rest/v1/', '/realtime/v1/', '/storage/v1/', '/functions/v1/']

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname.startsWith(`${PREFIX}/`)) return proxyToSupabase(request, url, env)
    if (url.pathname === '/api/push/key') return handlePushKey(env)
    if (url.pathname === '/api/push') return handlePush(request, env)
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>

async function proxyToSupabase(request: Request, url: URL, env: Env): Promise<Response> {
  const path = url.pathname.slice(PREFIX.length)
  if (!SUPABASE_SERVICES.some((service) => path.startsWith(service))) {
    return new Response('Not found', { status: 404 })
  }

  const target = new URL(path + url.search, env.SUPABASE_URL)
  // Copying the incoming request keeps method, headers, body and the
  // WebSocket upgrade (Realtime) intact; only the destination changes.
  const upstream = new Request(target, request)
  upstream.headers.delete('cookie')
  try {
    return await fetch(upstream)
  } catch {
    return new Response('Supabase is unreachable', { status: 502 })
  }
}
