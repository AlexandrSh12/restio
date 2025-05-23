import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.151.221:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
