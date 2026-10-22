import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      // Mirrors the Cloudflare Worker: /supabase/* → the Supabase project.
      proxy: {
        '/supabase': {
          target: env.SUPABASE_URL,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/supabase/, ''),
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'only us',
          short_name: 'only us',
          description: 'A private space for two.',
          start_url: '/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#fff8f4',
          theme_color: '#fff8f4',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
          // Only the Latin font files are precached; other subsets load (and get
          // cached) the first time a message actually needs them.
          globIgnores: ['**/*-{vietnamese,latin-ext}-*.woff2'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/(supabase|api)\//],
          // Push + notification-click handlers live in a plain file next to the app.
          importScripts: ['push-handler.js'],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'font',
              handler: 'CacheFirst',
              options: { cacheName: 'fonts', expiration: { maxEntries: 30 } },
            },
          ],
        },
      }),
    ],
  }
})
