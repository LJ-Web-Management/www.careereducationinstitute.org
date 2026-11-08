// Tiny static server for previewing dist/ locally (mimics GitHub Pages clean URLs).
// Listens on 127.0.0.1 only; set HOST=0.0.0.0 to preview from another device on your network.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '127.0.0.1';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
const isFile = (f) => { try { return fs.statSync(f).isFile(); } catch { return false; } };
const isDir = (f) => { try { return fs.statSync(f).isDirectory(); } catch { return false; } };
const notFound = (res) => { res.writeHead(404, { 'Content-Type': types['.html'] }); fs.createReadStream(path.join(DIST, '404.html')).on('error', () => res.end()).pipe(res); };

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); } // malformed %-encoding
  if (p.includes('\0')) { res.writeHead(400); return res.end(); }
  let file = path.join(DIST, p);
  // Only files inside dist/ (a plain prefix check would also let "/..%2fdist-old/" reach a sibling folder)
  if (file !== DIST && !file.startsWith(DIST + path.sep)) { res.writeHead(403); return res.end(); }
  if (isDir(file)) {
    // Redirect to the same path with a trailing slash; one leading slash only, so "//host" can't become an off-site link
    if (!p.endsWith('/')) { res.writeHead(301, { Location: encodeURI('/' + p.replace(/^\/+/, '') + '/') }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  if (!isFile(file)) return notFound(res);
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
  fs.createReadStream(file).on('error', () => res.end()).pipe(res);
}).listen(PORT, HOST, () => console.log(`Serving dist/ at http://${['127.0.0.1', '0.0.0.0', '::'].includes(HOST) ? 'localhost' : HOST}:${PORT}`));
