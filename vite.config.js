import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Match the auth router without proxying other user routes (e.g. logout-all).
const authPaths = ['login', 'refresh', 'logout', 'me']
  .map((path) => path.replace(/[a-z]/g, (c) => `[${c}${c.toUpperCase()}]`))
  .join('|')
const generation = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '^/api/users/register(?:\\?|$)': 'http://127.0.0.1:3000',
      [`^/[aA][pP][iI]/[uU][sS][eE][rR][sS]/(?:${authPaths})/?(?:\\?|$)`]: 'http://127.0.0.1:3000',
      [`^/api/users/session/${generation}/(?:login|refresh|logout)(?:\\?|$)`]: 'http://127.0.0.1:3000',
      '^/api/products(?:\\?|$)': {
        target: 'http://127.0.0.1:3000',
        bypass: (request) => (request.method === 'GET' ? undefined : false),
      },
      '^/api/categories(?:\\?|$)': {
        target: 'http://127.0.0.1:3000',
        bypass: (request) => (request.method === 'GET' ? undefined : false),
      },
    },
    watch: {
      // Evita que els artefactes de `npm run build` provoquin recàrregues
      // completes mentre el servidor de desenvolupament està actiu.
      ignored: ['**/dist/**'],
    },
  },
})
