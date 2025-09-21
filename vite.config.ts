import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This proxy is for the DEVELOPMENT environment ONLY.
    // In production, Nginx will handle this routing.
    proxy: {
      '/api/marzban': {
        target: 'http://localhost:3001', // Target the local backend server for Marzban
        changeOrigin: true,
        secure: false,
      },
      // Proxy for WordPress content API
      '/api/wp': {
        // IMPORTANT: Replace with your actual WordPress admin URL for development
        target: process.env.VITE_WORDPRESS_API_URL || 'http://admin.panbeh.vpn', 
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/wp/, '/wp-json'),
      }
    },
  },
})