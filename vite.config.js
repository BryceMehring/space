import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    modulePreload: false,
  },
  worker: {
    format: 'es',
  },
  resolve: {
    alias: {
      '@image': resolve('./assets/images/'),
    },
  },
});
