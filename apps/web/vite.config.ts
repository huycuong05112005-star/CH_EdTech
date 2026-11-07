import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false,
      },
      '/actuator': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false,
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

