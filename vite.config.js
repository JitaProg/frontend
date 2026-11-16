import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Evita que els artefactes de `npm run build` provoquin recàrregues
      // completes mentre el servidor de desenvolupament està actiu.
      ignored: ['**/dist/**'],
    },
  },
})
