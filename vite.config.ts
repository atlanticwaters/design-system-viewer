import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/design-system-viewer/',
  resolve: {
    alias: {
      '@tokens': path.resolve(__dirname, 'tokens'),
    },
  },
  // Allow access to the tokens folder at project root
  server: {
    fs: {
      allow: ['..', 'tokens'],
    },
  },
})
