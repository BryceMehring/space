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
    alias: [
      {
        find: '@stylesheet',
        replacement: resolve('./assets/stylesheets/'),
      }, {
        find: '@image',
        replacement: resolve('./assets/images/'),
      }
    ]
  },
});
