import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'client', 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './server'),
      '@client': path.resolve(__dirname, './client'),
    },
  },
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
})
