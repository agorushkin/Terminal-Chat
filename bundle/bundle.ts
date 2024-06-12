import { bundle } from 'x/emit';

const html = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=<device-width>, initial-scale=1.0">
    <title>Document</title>
  </head>

  <body>
    <script type="module">{{code}}</script>
  </body>

  </html>
  `;

const emit = await bundle('./client/ui/app.tsx', {
  importMap: './deno.json',
  compilerOptions: {
    jsxFactory: 'h',
    jsxFragmentFactory: 'Fragment',
    jsxImportSource: 'https://esm.sh/preact',
  },
  minify: true,
});

Deno.writeTextFile(
  './bundle/dist/app.html',
  html.replace('{{code}}', emit.code),
);
