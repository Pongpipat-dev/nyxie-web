// Static build for hosting: copies the site to dist/ and writes a real HTML file for every
// public page, so crawlers (Google, AdSense review) see a title, description and content
// without running JavaScript. The SPA boots on top and replaces <main> as usual.
//
//   SITE_URL=https://nyxie.example node scripts/build.mjs [--index-untested]
//
// Packs the team has not tested and reviewed yet (score or test date, plus its own review) are copies of the creator's
// Modrinth listing, so they get noindex and stay out of the sitemap unless --index-untested.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "dist");
const SITE = (process.env.SITE_URL || "").replace(/\/$/, "");
const INDEX_UNTESTED = process.argv.includes("--index-untested");
if (!SITE) console.warn("! SITE_URL is not set: canonical links and the sitemap will use http://localhost:5173");
const BASE = SITE || "http://localhost:5173";

// The browser modules expect a DOM and storage at import time; give them just enough.
globalThis.document = { documentElement: { dataset: {} } };
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
const imp = (f) => import(pathToFileURL(path.join(ROOT, "assets/js", f)).href);
const { html, raw, esc, md, TYPES, typeLabel, reviewed, reviewBlock } = await imp("ui.js");
const { t, fmtDate } = await imp("i18n.js");
const { SUPABASE_URL, SUPABASE_KEY } = await imp("config.js");

async function rest(q) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${q}`, { headers: { apikey: SUPABASE_KEY } });
  if (!r.ok) throw new Error(`${q}: ${r.status} ${await r.text()}`);
  return r.json();
}
const [packs, tutorials, pages] = await Promise.all([
  rest("packs?select=slug,name,type,summary,description,creator,license,versions,platform,perf,resolution,requirements,score,checked_at,updated_at,is_sample,thumbnail_url,review,pros,cons,test_rig,test_setup,fps_base,fps_with&status=eq.published&order=score.desc.nullslast,name"),
  rest("tutorials?select=slug,title,summary,body,updated_at&published=eq.true&order=id"),
  rest("pages?select=slug,title,body,updated_at"),
]);
// reviewed(): tested (score or test date) and written up by the team in its own words.
const indexable = (p) => !p.is_sample && (reviewed(p) || INDEX_UNTESTED);

// ---------- Fresh dist/ with the static files ----------
fs.rmSync(OUT, { recursive: true, force: true });
for (const f of ["assets", "index.html", ".nojekyll"]) fs.cpSync(path.join(ROOT, f), path.join(OUT, f), { recursive: true });
const shell = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

const clip = (s, n = 155) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s; };
const sitemap = [];
function page(route, { title, description, body, noindex = false, image, lastmod }) {
  const url = BASE + route;
  const head = [
    `<title>${esc(title ? `${title} · Nyxie` : "Nyxie: Minecraft packs tested for your setup")}</title>`,
    `<meta name="description" content="${esc(clip(description))}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    noindex ? `<meta name="robots" content="noindex">` : "",
    `<meta property="og:type" content="website"><meta property="og:site_name" content="Nyxie">`,
    `<meta property="og:title" content="${esc(title || "Nyxie")}"><meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:description" content="${esc(clip(description))}">`,
    image ? `<meta property="og:image" content="${esc(image)}">` : "",
  ].filter(Boolean).join("\n");
  const out = shell
    .replace(/<title>[\s\S]*?<\/title>\n<meta name="description"[^>]*>/, head)
    .replace(/<main id="main" tabindex="-1">[\s\S]*?<\/main>/, `<main id="main" tabindex="-1">${body}</main>`);
  const file = path.join(OUT, route === "/" ? "index.html" : route.slice(1) + "/index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  if (!noindex) sitemap.push({ url, lastmod });
}
const link = (href, label) => html`<a href="${href}">${label}</a>`;
const packList = (a) => a.length ? html`<ul>${a.map((p) => html`<li>${link("/pack/" + p.slug, p.name)}${p.summary ? html` · ${p.summary}` : ""}</li>`)}</ul>` : "";
const nav = html`<nav aria-label="Main"><ul>${TYPES.map((ty) => html`<li>${link("/" + ty, typeLabel(ty))}</li>`)}<li>${link("/top", t("top10"))}</li><li>${link("/tutorials", t("tutorials"))}</li></ul></nav>`;
const DESC = "Nyxie: Minecraft resource packs, shaders, mods and maps, tested by our team and checked against your setup. Java and Bedrock.";

// ---------- Pages ----------
page("/", { description: DESC, body: html`<h1>Nyxie</h1><p>${DESC}</p>${nav}<h2>${t("topRated")}</h2>${packList(packs.filter(indexable).slice(0, 12))}` });

for (const ty of TYPES) {
  const a = packs.filter((p) => p.type === ty);
  page("/" + ty, { title: typeLabel(ty), description: `${typeLabel(ty)} for Minecraft on Nyxie: ${a.slice(0, 6).map((p) => p.name).join(", ")}`,
    body: html`<h1>${typeLabel(ty)}</h1>${packList(a.filter(indexable))}`, noindex: !a.some(indexable) });
}
const top = packs.filter((p) => p.score != null && !p.is_sample).slice(0, 10);
page("/top", { title: t("top10"), description: "The ten highest scoring Minecraft packs tested by the Nyxie team.", body: html`<h1>${t("top10")}</h1>${packList(top)}`, noindex: !top.length });

for (const p of packs) {
  const facts = [[t("checked"), p.checked_at ? fmtDate(p.checked_at) : "—"], [t("versions"), (p.versions || []).join(", ") || "—"],
    [t("requirements"), p.requirements || "—"], [t("license"), p.license || "—"], [t("creator"), p.creator || "—"]];
  page("/pack/" + p.slug, {
    // A reviewed pack is described by the team's own words, not the creator's summary.
    title: p.name, description: reviewed(p) ? p.review.replace(/[#*`>\[\]()-]/g, " ") : p.summary || p.description,
    image: p.thumbnail_url, lastmod: p.updated_at, noindex: !indexable(p),
    body: html`<nav class="crumbs">${link("/" + p.type, typeLabel(p.type))}</nav>
      <article><h1>${p.name}</h1><p class="lead">${p.summary}</p>
      ${p.score != null ? html`<p>Nyxie score: <b>${p.score}</b>/10</p>` : ""}
      ${reviewBlock(p)}
      <dl>${facts.map(([k, v]) => html`<dt>${k}</dt><dd>${v}</dd>`)}</dl>
      ${p.description ? html`<h2>${p.review?.trim() ? t("rv.fromCreator") : t("description")}</h2>${md(p.description)}` : ""}</article>`,
  });
}

page("/tutorials", { title: t("tutorialsT"), description: t("tutorialsP"), body: html`<h1>${t("tutorialsT")}</h1><ul>${tutorials.map((x) => html`<li>${link("/tutorials/" + x.slug, x.title)} · ${x.summary}</li>`)}</ul>` });
for (const x of tutorials) page("/tutorials/" + x.slug, { title: x.title, description: x.summary, lastmod: x.updated_at, noindex: !x.body?.trim(),
  body: html`<article class="article prose"><h1>${x.title}</h1><p class="lead">${x.summary}</p>${md(x.body)}</article>` });
for (const pg of pages) page("/p/" + pg.slug, { title: pg.title, description: clip(pg.body?.replace(/[#*`>\-\[\]()]/g, " ")), lastmod: pg.updated_at,
  body: html`<article class="article prose"><h1>${pg.title}</h1>${md(pg.body)}</article>` });

// Fallback for routes that only exist in the browser (search, Modrinth explore, account, admin).
fs.writeFileSync(path.join(OUT, "404.html"), shell.replace("<title>", '<meta name="robots" content="noindex">\n<title>'));
// Netlify and Cloudflare Pages: serve the app for those routes with a 200.
fs.writeFileSync(path.join(OUT, "_redirects"), ["/search", "/search/*", "/modrinth", "/modrinth/*", "/saved", "/account", "/admin", "/admin/*"].map((r) => `${r} /index.html 200`).join("\n") + "\n");

fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nDisallow: /admin\nDisallow: /account\nDisallow: /saved\n\nSitemap: ${BASE}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map((s) =>
  `  <url><loc>${esc(s.url)}</loc>${s.lastmod ? `<lastmod>${s.lastmod.slice(0, 10)}</lastmod>` : ""}</url>`).join("\n")}\n</urlset>\n`);

const noidx = packs.filter((p) => !indexable(p)).length;
const thin = [...tutorials.map((x) => ["/tutorials/" + x.slug, x.body]), ...pages.map((p) => ["/p/" + p.slug, p.body])].filter(([, b]) => (b || "").trim().length < 300);
if (thin.length) console.warn("! Empty or very short (under 300 characters), write these before applying for AdSense:\n  " + thin.map(([r, b]) => `${r} (${(b || "").trim().length})`).join("\n  "));
console.log(`dist/ built: ${packs.length} pack pages (${packs.length - noidx} indexable, ${noidx} noindex), ${tutorials.length} tutorials, ${pages.length} info pages, ${sitemap.length} URLs in sitemap.xml`);
