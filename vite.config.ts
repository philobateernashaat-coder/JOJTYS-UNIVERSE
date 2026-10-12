import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: projectRoot,

  // Supports assets when hosted under /jojtys-universe/
  base: './',

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },

  server: {
    host: '127.0.0.1',
    port: 5173,
  },

  preview: {
    host: '127.0.0.1',
    port: 4173,
  },

  build: {
    outDir: resolve(projectRoot, 'dist'),
    emptyOutDir: true,
  },
});