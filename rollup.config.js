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
  postcss(),
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

  const scripts = Object.keys(bundle)
    .filter((item) => !item.includes('worker'))
    .map((item) => `<script src="${item}" ${scriptAttributes}></script>`);

  return `
  <!DOCTYPE html>
  <html ${htmlAttributes}>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
    </head>
    <body>
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
      title: 'Space',
    }),
    OffMainThread({
      include: 'source/app.ts',
    }),
  ]
};
