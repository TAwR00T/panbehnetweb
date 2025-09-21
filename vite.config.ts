import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This proxy is for the DEVELOPMENT environment ONLY.
    // In production, Nginx will handle this routing.
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Target the local backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
