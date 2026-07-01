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
      '/compare': 'http://localhost:5000',
      '/results': 'http://localhost:5000',
      '/health': 'http://localhost:5000',
    }
  }
})
