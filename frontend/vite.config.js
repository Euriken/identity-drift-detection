import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/compare': 'http://localhost:5001',
      '/results': 'http://localhost:5001',
      '/health':  'http://localhost:5001',
    }
  }
})
