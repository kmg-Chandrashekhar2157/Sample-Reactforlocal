import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The frontend talks to the .NET API over CORS using VITE_API_BASE_URL
// (see .env.development). The commented-out proxy below is the alternative
// if you would rather keep everything same-origin during development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5147',
    //     changeOrigin: true,
    //   },
    // },
  },
})
