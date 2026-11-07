import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' http://localhost:8085 ws://localhost:5175 ws://localhost:8085 http://localhost:5175; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false,
      },
      '/ws-geometry': {
        target: 'http://localhost:8085',
        ws: true,
        changeOrigin: true,
      }
    }
  },
  build: {
    sourcemap: false, // Security rule: Never expose source maps publicly in production
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand', 'i18next', 'react-i18next'],
        }
      }
    }
  }
});

