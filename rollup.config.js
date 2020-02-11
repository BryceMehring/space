import html from '@rollup/plugin-html';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import url from '@rollup/plugin-url';
import serve from 'rollup-plugin-serve';
import { terser } from "rollup-plugin-terser";
import path from 'path';

const output = {
  dir: 'dist',
  format: 'esm',
  sourcemap: true,
  entryFileNames: '[name]-[hash].js',
};

const commonPlugins = [
  resolve(),
  alias({
    resolve: ['.ts'],
    entries: [{
      find: '@stylesheet',
      replacement: path.resolve('./assets/stylesheets/'),
    }, {
      find: '@image',
      replacement: path.resolve('./assets/images/'),
    }]
  }),
  typescript(),
  postcss(),
  url(),
];

const workerPlugins = [];

if (process.env.BUILD === 'prod') {
  commonPlugins.push(
    terser(),
  );
} else if (process.env.WATCH) {
  workerPlugins.push(
    serve({
      open: true,
      contentBase: output.dir,
    }),
  );
}

module.exports = [{
  input: 'source/app.ts',
  output,
  plugins: [
    ...commonPlugins,
    html({
      title: 'Space',
    }),
  ]
}, {
  input: 'source/space/space.worker.ts',
  output: {
    ...output,
    entryFileNames: '[name].js',
  },
  plugins: [
    ...commonPlugins,
    ...workerPlugins,
  ]
}];
