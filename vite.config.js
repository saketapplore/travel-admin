import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    }
  },
  server: {
    // Allow the dev server to be reached via tunnels (ngrok, etc.). A leading
    // dot whitelists a domain and all its subdomains.
    allowedHosts: ['.ngrok-free.dev', '.ngrok.app', '.ngrok.io', 'localhost'],
    proxy: {
      '/api': {
        // target: 'https://martha-insightful-genevie.ngrok-free.dev',
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: false
  }
});
