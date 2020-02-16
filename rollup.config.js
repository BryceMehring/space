import html, { makeHtmlAttributes } from '@rollup/plugin-html';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import url from '@rollup/plugin-url';
import serve from 'rollup-plugin-serve';
import { terser } from "rollup-plugin-terser";
import OffMainThread from '@brycemehring/rollup-plugin-off-main-thread-es';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import template from 'lodash/template';

const prodBuild = process.env.BUILD === 'prod';
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
  preserveModules: true,
  entryFileNames: fileName,
  chunkFileNames: fileName,
};

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
    typescript({
      clean: prodBuild,
    }),
    postcss({ extract: true }),
    url({ fileName: assetFileName }),
    html({
      template: buildTemplate,
      publicPath,
      title: 'Space',
    }),
    OffMainThread({
      include: 'source/app.ts',
    }),
    prodBuild && terser(),
    process.env.WATCH && serve({
      open: true,
      contentBase: output.dir,
    }),
  ],
}
