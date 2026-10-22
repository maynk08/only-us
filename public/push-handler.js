/* Push notifications — loaded into the generated service worker via
 * workbox.importScripts (see vite.config.ts). Payload shape: worker/push.ts. */

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { title: 'only us', body: event.data ? event.data.text() : '' }
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      // The app is open and on screen: it already shows the message or the
      // hug pop-up, so don't add a system notification on top.
      if (windows.some((w) => w.visibilityState === 'visible')) return

      return self.registration.showNotification(data.title || 'only us', {
        body: data.body || '',
        tag: data.tag || 'only-us',
        renotify: true,
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-96.png',
        // Android 8+ uses the channel's vibration instead; older ones honour this.
        vibrate: data.kind === 'hug' ? [40, 80, 40, 80, 160] : [60, 60, 60],
        data: { url: data.url || '/' },
      })
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = new URL(event.notification.data?.url || '/', self.location.origin).href

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async (windows) => {
      const existing = windows.find((w) => new URL(w.url).origin === self.location.origin)
      if (existing) {
        await existing.focus()
        return existing.navigate(url).catch(() => undefined)
      }
      return self.clients.openWindow(url)
    }),
  )
})
