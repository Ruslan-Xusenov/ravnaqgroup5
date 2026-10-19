import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.woff2': 'font/woff2',
  '.png': 'image/png', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8' };
const port = Number(process.env.PORT || 4173);
http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const name = decodeURIComponent(url.pathname) === '/' ? '/index.html' : decodeURIComponent(url.pathname);
    const file = path.resolve(root, `.${name}`);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    const type = mime[path.extname(file)] || 'application/octet-stream';
    let content;
    let encoding;
    const accepted = req.headers['accept-encoding'] || '';
    if (/\.(html|js|css)$/.test(name)) {
      for (const [candidate, extension] of [['br', '.br'], ['gzip', '.gz']]) {
        if (accepted.includes(candidate)) {
          try { content = await readFile(file + extension); encoding = candidate; break; } catch {}
        }
      }
    }
    content ??= await readFile(file);
    res.setHeader('Content-Type', type);
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('Cache-Control', name.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable' : 'no-cache');
    if (encoding) res.setHeader('Content-Encoding', encoding);
    res.setHeader('Content-Length', content.length);
    res.writeHead(200);
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}`));
