import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
        proxy: {
          '/api': { // The path that will be proxied
            target: 'https://python-production-2bac.up.railway.app', // The address of your backend server
            changeOrigin: true, // Changes the origin of the request to match the target URL
            // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: rewrites the path
            // secure: false, // Optional: disables SSL verification for local development
            // ws: true, // Optional: proxy websockets
          },
        },
      },
})
