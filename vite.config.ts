import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: process.env.DOCKER !== 'true' && process.env.CI !== 'true',
    host: true, // Permet d'exposer le serveur sur toutes les interfaces réseau (nécessaire pour Docker)
  },
  build: {
    outDir: 'build',
  },
  define: {
    'process.env': process.env,
  },
});
