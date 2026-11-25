// Tiny static file server for previewing the site locally.
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, ".."), port = +process.env.PORT || 5173;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".otf": "font/otf", ".ttf": "font/ttf", ".woff2": "font/woff2" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const f = path.join(root, p);
  if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (err, buf) => {
    // App routes like /pack/slug have no file: serve the app shell, as the host's rewrite would.
    if (err && !path.extname(p)) return fs.readFile(path.join(root, "index.html"), (e2, b2) => { res.writeHead(200, { "Content-Type": types[".html"], "Cache-Control": "no-store" }); res.end(b2); });
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(buf);
  });
}).listen(port, "127.0.0.1", () => console.log("Serving on http://localhost:" + port));
