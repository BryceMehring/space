import html, { makeHtmlAttributes } from '@rollup/plugin-html';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import url from '@rollup/plugin-url';
import serve from 'rollup-plugin-serve';
import { terser } from "rollup-plugin-terser";
import OffMainThread from '@surma/rollup-plugin-off-main-thread';
import Vue from 'rollup-plugin-vue';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import template from 'lodash/template';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild';

const prodBuild = process.env.BUILD === 'production';
const publicPath = prodBuild ? 'https://www.brycemehring.com/multiverse/' : '';
const fileName = prodBuild ? '[name]-[hash].js' : '[name].js';
const assetFileName = prodBuild ? '[name]-[hash][extname]' : '[name][extname]';

const compiledIndex = template(readFileSync('./assets/index.html').toString());

const buildTemplate = ({ attributes, bundle, files, publicPath, title }) => {
  const htmlAttributes = makeHtmlAttributes(attributes.html);
  const scriptAttributes = makeHtmlAttributes(attributes.script);
  const linkAttributes = makeHtmlAttributes(attributes.link);

  const scripts = (files.js || [])
    .filter(({ fileName}) => !fileName.includes('worker'))
    .map(({ fileName }) => `<script src="${publicPath}${fileName}"${scriptAttributes}></script>`)
    .join('\n');

  const links = (files.css || [])
    .map(({ fileName }) => `<link href="${publicPath}${fileName}" rel="stylesheet"${linkAttributes}>`)
    .join('\n');

  return compiledIndex({
    htmlAttributes,
    title,
    links,
    scripts,
  });
}

const output = {
  dir: 'dist',
  format: 'es',
  sourcemap: true,
  entryFileNames: fileName,
  chunkFileNames: fileName,
};

const envVariables = {
  'process.env.NODE_ENV':  process.env.BUILD,
  '__VUE_OPTIONS_API__': true,
  '__VUE_PROD_DEVTOOLS__': false
};

for (const key of Object.keys(envVariables)) {
  envVariables[key] = JSON.stringify(envVariables[key])
}

export default {
  input: 'source/app.ts',
  output,
  plugins: [
    nodeResolve(),
    alias({
      resolve: ['.ts'],
      entries: [{
        find: '@stylesheet',
        replacement: resolve('./assets/stylesheets/'),
      }, {
        find: '@image',
        replacement: resolve('./assets/images/'),
      }]
    }),
    Vue(),
    esbuild(),
    replace(envVariables),
    postcss({ extract: true, minimize: prodBuild }),
    url({ fileName: assetFileName }),
    html({
      template: buildTemplate,
      publicPath,
      title: 'Space',
    }),
    OffMainThread({ silenceESMWorkerWarning: true }),
    prodBuild && terser(),
    process.env.WATCH && serve({
      open: true,
      contentBase: output.dir,
    }),
  ],
}
