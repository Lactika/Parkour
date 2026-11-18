import * as esbuild from 'esbuild';
import fs from 'node:fs';

const result = await esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  write: false
});

const rawBundle = result.outputFiles[0].text;
// Prevent any accidental </script> inside string literals from closing the HTML script tag
const safeBundle = rawBundle.replace(/<\/script>/gi, '<\\/script>');

const template = fs.readFileSync('src/template.html', 'utf8');
const finalHtml = template.split('/*__BUNDLE_HERE__*/').join(safeBundle);

fs.writeFileSync('index.html', finalHtml, 'utf8');
console.log(`Built index.html (${(Buffer.byteLength(finalHtml) / 1024).toFixed(1)} KB)`);
