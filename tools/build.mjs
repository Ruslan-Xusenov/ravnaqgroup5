import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync, brotliCompressSync, constants } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => readFile(path.join(root, name), 'utf8');
const hash = value => createHash('sha256').update(value).digest('hex').slice(0, 12);
const css = await transform(await read('style.css'), {
  loader: 'css', minify: true, target: ['safari15', 'chrome100'], legalComments: 'none'
});
const js = await transform(await read('script.js'), {
  loader: 'js', minify: true, target: 'es2020', legalComments: 'none'
});
const appPath = `assets/perf/app.${hash(js.code)}.js`;
await mkdir(path.join(root, 'assets/perf'), { recursive: true });
await writeFile(path.join(root, appPath), js.code);
await writeFile(path.join(root, 'script.min.js'), js.code);

let html = await read('index.html');
// index.html remains editable. Only generated CSS/application references are rebuilt.
if (!/<style(?:\s[^>]*)?>[\s\S]*?<\/style>/.test(html)) {
  throw new Error('Expected the inline stylesheet in index.html');
}
html = html.replace(/<style(?:\s[^>]*)?>[\s\S]*?<\/style>/,
  () => `<style id="critical-css">${css.code.trim()}</style>`);
html = html.replace(/\s*<script id="site-app"[^>]*><\/script>/g, '');
// Migration from the previous generated inline application. Inline defer never deferred it.
html = html.replace(/\s*<script defer>[\s\S]*?<\/script>/g, '');
html = html.replace('</head>', `  <script id="site-app" src="${appPath}" defer></script>\n</head>`);
html = html.replace(/<noscript>\s*<link[^>]*fonts\.googleapis\.com[^>]*>\s*<\/noscript>/g, '');
html = html.replace(/\s*<link[^>]*href="https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>/g, '');
html = html.replace(/assets\/benefit_check\.(?:png|webp)/g, 'assets/perf/benefit-check-52.e0e9b9695a.webp');
html = html.replace(/<picture>\s*<source srcset="assets\/saodat_emblem_transparent\.webp"[\s\S]*?<\/picture>/,
  '<img src="assets/perf/saodat-emblem-108.3f595ca001.webp" alt="Saodat Shahri Logotipi" class="header-logo-img" width="89" height="108" loading="eager" decoding="async">');
await writeFile(path.join(root, 'index.html'), html);

const assets = new Set([appPath]);
for (const source of [html, js.code]) {
  for (const match of source.matchAll(/(?:["'(])((?:assets\/)[^\s"'<>);]+)/g)) {
    assets.add(match[1]);
  }
}
const dist = path.join(root, 'dist');
await mkdir(dist, { recursive: true });
await writeFile(path.join(dist, 'index.html'), html);
for (const asset of assets) {
  const destination = path.resolve(dist, asset);
  if (!destination.startsWith(dist + path.sep)) throw new Error('Invalid asset path');
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(path.join(root, asset), destination);
}
for (const license of ['OFL-Montserrat.txt', 'OFL-Inter.txt', 'OFL-Bebas-Neue.txt']) {
  await copyFile(path.join(root, 'assets/perf', license), path.join(dist, 'assets/perf', license));
}
// Keep compressed sidecars byte-for-byte consistent with the source they represent.
for (const [name, content] of [['index.html', html], [appPath, js.code]]) {
  const gzip = gzipSync(content, { level: 9 });
  const brotli = brotliCompressSync(content, {
    params: { [constants.BROTLI_PARAM_QUALITY]: 11 }
  });
  for (const base of [root, dist]) {
    await writeFile(path.join(base, `${name}.gz`), gzip);
    await writeFile(path.join(base, `${name}.br`), brotli);
  }
}
const summary = { htmlBytes: Buffer.byteLength(html), htmlGzipBytes: gzipSync(html).length,
  appBytes: Buffer.byteLength(js.code), assetFiles: [...assets].sort() };
await writeFile(path.join(dist, 'build-manifest.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
