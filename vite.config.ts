import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    modulePreload: false,
    minify: 'terser',
    target: 'esnext',
  },
  worker: {
    format: 'es',
  },
  resolve: {
    alias: {
      '@stylesheet': resolve('./assets/stylesheets/'),
      '@image': resolve('./assets/images/'),
    },
  },
});
