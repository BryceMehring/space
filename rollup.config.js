import html, { makeHtmlAttributes } from '@rollup/plugin-html';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import alias from '@rollup/plugin-alias';
import url from '@rollup/plugin-url';
import serve from 'rollup-plugin-serve';
import { terser } from "rollup-plugin-terser";
import path from 'path';
import OffMainThread from '@brycemehring/rollup-plugin-off-main-thread-es';

const publicPath = process.env.BUILD === 'prod' ? 'https://www.brycemehring.com/multiverse/' : '';

const output = {
  dir: 'dist',
  format: 'es',
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
  postcss({ extract: true }),
  url(),
];

if (process.env.BUILD === 'prod') {
  commonPlugins.push(
    terser(),
  );
} else if (process.env.WATCH) {
  commonPlugins.push(
    serve({
      open: true,
      contentBase: output.dir,
    }),
  );
}

const template = ({ attributes, bundle, files, publicPath, title }) => {
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

  return `
    <!DOCTYPE html>
    <html ${htmlAttributes}>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        ${links}
      </head>
      <body>
        <noscript>
          <p class="error">
            <strong>Enable javascript</strong>
          </p>
        </noscript>
        <canvas id="game"></canvas>
        ${scripts}
      </body>
    </html>
  `;
}

export default {
  input: ['source/app.ts'],
  output,
  plugins: [
    ...commonPlugins,
    html({
      template,
      publicPath,
      title: 'Space',
    }),
    OffMainThread({
      include: 'source/app.ts',
    }),
  ]
};
