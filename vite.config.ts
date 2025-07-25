import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true
  },
  optimizeDeps: {
    include: ['@radix-ui/themes', '@radix-ui/react-icons', 'lucide-react']
  },
  css: {
    postcss: './postcss.config.cjs'
  }
})
