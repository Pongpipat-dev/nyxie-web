// Modrinth API v2 client (https://docs.modrinth.com/api/). Read-only, no key needed.
// The API allows CORS from any origin and 300 requests a minute per IP, so responses
// are cached in memory and a 429 waits for the reset before one retry.
const BASE = "https://api.modrinth.com/v2";
const V3 = "https://api.modrinth.com/v3";
export const SITE = "https://modrinth.com";

const cache = new Map(); // url -> { at, p: Promise }
const TTL = 5 * 60 * 1000;

async function get(url, { ttl = TTL } = {}) {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < ttl) return hit.p;
  const p = (async () => {
    for (let attempt = 0; ; attempt++) {
      const r = await fetch(url, { headers: { Accept: "application/json" } });
      if (r.status === 429 && attempt === 0) {
        const wait = Math.min(10, +r.headers.get("X-Ratelimit-Reset") || 2);
        await new Promise((res) => setTimeout(res, wait * 1000));
        continue;
      }
      if (r.status === 404) return null;
      if (!r.ok) throw new Error(`Modrinth ${r.status}`);
      return r.json();
    }
  })();
  cache.set(url, { at: Date.now(), p });
  p.catch(() => cache.delete(url));
  return p;
}
const qs = (o) => Object.entries(o).filter(([, v]) => v != null && v !== "").map(([k, v]) => `${k}=${encodeURIComponent(typeof v === "string" ? v : JSON.stringify(v))}`).join("&");

// ---------- Project types ----------
// Modrinth project_type -> URL segment on modrinth.com
export const MR_TYPES = ["mod", "modpack", "resourcepack", "shader", "datapack", "plugin"];
// Modrinth type -> Nyxie pack type.
export const toNyxieType = (ty) => ({ resourcepack: "resource-packs", shader: "shaders", modpack: "modpacks", datapack: "datapacks", plugin: "plugins" }[ty] || "mods");
// Nyxie pack type -> Modrinth type, for "find this on Modrinth" links.
export const fromNyxieType = (ty) => ({ "resource-packs": "resourcepack", shaders: "shader", mods: "mod", modpacks: "modpack", datapacks: "datapack", plugins: "plugin", maps: "datapack" }[ty] || "mod");
export const projectUrl = (p) => `${SITE}/${p.project_type || "project"}/${p.slug || p.id || p.project_id}`;

// ---------- Search ----------
// facets: AND of ORs, e.g. [["project_type:mod"], ["versions:1.21.1"], ["categories:fabric"]]
export const SORTS = ["relevance", "downloads", "follows", "newest", "updated"];
export function search({ query = "", type, version, loader, category, index = "relevance", offset = 0, limit = 20 } = {}) {
  const facets = [];
  if (type) facets.push([`project_type:${type}`]);
  if (version) facets.push([`versions:${version}`]);
  if (loader) facets.push([`categories:${loader}`]);
  if (category) facets.push([`categories:${category}`]);
  return get(`${BASE}/search?${qs({ query, index, offset, limit, facets: facets.length ? facets : null })}`);
}

// ---------- Projects ----------
export const project = (idOrSlug) => get(`${BASE}/project/${encodeURIComponent(idOrSlug)}`);
export const projects = (ids) => ids.length ? get(`${BASE}/projects?${qs({ ids })}`) : Promise.resolve([]);
export const members = (idOrSlug) => get(`${BASE}/project/${encodeURIComponent(idOrSlug)}/members`);
export const dependencies = (idOrSlug) => get(`${BASE}/project/${encodeURIComponent(idOrSlug)}/dependencies`);
export const organization = (id) => get(`${V3}/organization/${encodeURIComponent(id)}`, { ttl: 60 * 60 * 1000 });

// Display name of whoever publishes the project: the organization, else the team owner.
export async function creatorOf(p) {
  if (p.organization) { try { const o = await organization(p.organization); if (o?.name) return o.name; } catch (e) {} }
  const m = (await members(p.id).catch(() => null)) || [];
  const owner = m.find((x) => x.is_owner) || m.find((x) => /owner/i.test(x.role)) || m[0];
  return owner?.user?.username || "";
}

// ---------- Versions and files ----------
export const versions = (idOrSlug, { loaders, gameVersions, featured } = {}) =>
  get(`${BASE}/project/${encodeURIComponent(idOrSlug)}/version?${qs({ loaders: loaders?.length ? loaders : null, game_versions: gameVersions?.length ? gameVersions : null, featured })}`);
export const version = (id) => get(`${BASE}/version/${encodeURIComponent(id)}`);
export const primaryFile = (v) => v?.files?.find((f) => f.primary) || v?.files?.[0] || null;

// ---------- Tags ----------
const DAY = 24 * 60 * 60 * 1000;
export const gameVersions = () => get(`${BASE}/tag/game_version`, { ttl: DAY });
export const loaders = () => get(`${BASE}/tag/loader`, { ttl: DAY });
export const categories = () => get(`${BASE}/tag/category`, { ttl: DAY });

// ---------- Helpers ----------
// Accepts a modrinth.com URL, a slug or a project ID and returns the slug/ID part.
export function parseRef(input) {
  const s = String(input || "").trim();
  if (!s) return "";
  const m = s.match(/modrinth\.com\/(?:mod|modpack|resourcepack|shader|datapack|plugin|project)\/([^/?#\s]+)/i);
  if (m) return decodeURIComponent(m[1]);
  return /^[\w.-]+$/.test(s) ? s : "";
}
// Project type named in a modrinth.com URL ("…/plugin/x" -> "plugin"), else "".
export function typeFromUrl(input) {
  const m = String(input || "").match(/modrinth\.com\/(mod|modpack|resourcepack|shader|datapack|plugin)\//i);
  return m ? m[1].toLowerCase() : "";
}
// Loaders that matter for each type, used for the "Requires …" line.
const PLUGIN_LOADERS = new Set(["bukkit", "spigot", "paper", "purpur", "folia", "sponge", "bungeecord", "velocity", "waterfall"]);
const SHADER_LOADERS = new Set(["iris", "optifine", "canvas"]);
const loadersFor = (ty, list) => (list || []).filter((l) => !["minecraft", "vanilla", "datapack"].includes(l) &&
  (ty === "plugin" ? PLUGIN_LOADERS.has(l) : ty === "shader" ? SHADER_LOADERS.has(l) : ty === "mod" || ty === "modpack" ? !PLUGIN_LOADERS.has(l) && !SHADER_LOADERS.has(l) : false));

// "1.21.4" -> "1.21", "26.1.2" -> "26.1"; snapshots and pre-releases are dropped.
export function majorVersions(list) {
  const rel = (list || []).filter((v) => /^\d+\.\d+(\.\d+)?$/.test(v));
  return [...new Set(rel.map((v) => v.split(".").slice(0, 2).join(".")))].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
}
export const releaseVersions = (list) => (list || []).filter((v) => /^\d+\.\d+(\.\d+)?$/.test(v));

export function fmtBytes(n) {
  n = +n || 0;
  if (n >= 1024 ** 3) return (n / 1024 ** 3).toFixed(1) + " GB";
  if (n >= 1024 ** 2) return (n / 1024 ** 2).toFixed(1) + " MB";
  if (n >= 1024) return Math.round(n / 1024) + " KB";
  return n + " B";
}
const LOADER_NAMES = { neoforge: "NeoForge", liteloader: "LiteLoader", modloader: "ModLoader", bukkit: "Bukkit", bungeecord: "BungeeCord", velocity: "Velocity", waterfall: "Waterfall", minecraft: "Vanilla", datapack: "Data pack", iris: "Iris", optifine: "OptiFine", canvas: "Canvas", vanilla: "Vanilla" };
export const loaderName = (l) => LOADER_NAMES[l] || String(l).replace(/(^|[-_])(\w)/g, (m, s, c) => (s ? " " : "") + c.toUpperCase());
export const LOADER_SET = new Set(["fabric", "forge", "neoforge", "quilt", "liteloader", "modloader", "rift", "babric", "bukkit", "spigot", "paper", "purpur", "folia", "sponge", "bungeecord", "velocity", "waterfall", "iris", "optifine", "canvas", "vanilla", "minecraft", "datapack"]);

// Modrinth bodies mix Markdown with HTML; Nyxie's md() escapes HTML, so tags, comments and
// inline images are stripped.
export const cleanBody = (s) => String(s || "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[\s*\]\([^)]*\)/g, "").replace(/\n{3,}/g, "\n\n").trim();
// Nyxie slugs are lowercase words joined by single hyphens.
export const toSlug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
// Performance weight estimated from the creator's own tags until the team tests it.
function perfOf(ty, cats, res) {
  if (ty === "shader") return cats.some((c) => /^(high|screenshot)$/.test(c)) ? "heavy" : cats.some((c) => /^(potato|low)$/.test(c)) ? "light" : "medium";
  if (ty === "resourcepack") { const n = parseInt(res) || 16; return n >= 128 ? "heavy" : n >= 64 ? "medium" : "light"; }
  if (ty === "modpack") return "medium";
  return "light";
}

// Pack fields for the Nyxie admin form, filled from a Modrinth project.
// One Modrinth project can be several types at once (a mod that is also a plugin and a
// data pack) but the API reports only one, so the type comes from `hint` (the Explore
// tab the admin came from) or the URL segment when given.
export async function toPackDraft(ref, hint) {
  const id = parseRef(ref);
  if (!id) return null;
  const p = await project(id);
  if (!p) return null;
  const [creator, vers] = await Promise.all([creatorOf(p).catch(() => ""), versions(p.id).catch(() => [])]);
  const latest = (vers || [])[0], file = primaryFile(latest);
  const ty = MR_TYPES.includes(hint) ? hint : typeFromUrl(ref) || p.project_type;
  const lds = loadersFor(ty, p.loaders);
  const lic = p.license || {};
  const cats = [...(p.categories || []), ...(p.additional_categories || [])];
  const res = cats.filter((c) => /^\d+x(\+|-|$)/i.test(c)).sort((a, b) => parseInt(a) - parseInt(b))[0] || "";
  const cat = cats.find((c) => !LOADER_SET.has(c) && !/^\d+x/i.test(c) && !/^(low|medium|high|screenshot|potato)$/i.test(c)) || "";
  return {
    name: String(p.title).slice(0, 80),
    slug: toSlug(p.slug),
    type: toNyxieType(ty),
    creator: String(creator).slice(0, 80),
    source_url: projectUrl({ ...p, project_type: ty }),
    versions: majorVersions(p.game_versions),
    platform: "java",
    category: cat ? loaderName(cat) : "",
    resolution: res.replace(/[+-].*$/, ""),
    perf: perfOf(ty, cats, res),
    requirements: lds.length ? `Requires ${lds.map(loaderName).join(" / ")}` : "",
    license: lic.name || (lic.id && !/^LicenseRef-/i.test(lic.id) ? lic.id : lic.id?.replace(/^LicenseRef-/i, "").replace(/-/g, " ")) || "",
    file_size: file ? fmtBytes(file.size) : "",
    summary: (p.description || "").slice(0, 200),
    description: cleanBody(p.body).slice(0, 8000),
    thumbnail_url: p.icon_url || "",
    images: (p.gallery || []).sort((a, b) => (b.featured - a.featured) || (a.ordering - b.ordering)).map((g) => g.raw_url || g.url).slice(0, 12),
  };
}
