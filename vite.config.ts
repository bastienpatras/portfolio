import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { dpeMatcher } from './server/dpe-matcher';

export default defineConfig({
  plugins: [react(), dpeMatcher()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
