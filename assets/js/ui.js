import { t } from "./i18n.js";

// ---------- Safe HTML templating ----------
// html`...` escapes every interpolated value unless it is itself the result of html`` or raw().
class Safe { constructor(s) { this.s = s; } toString() { return this.s; } }
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ESC[c]);
const val = (v) => v == null || v === false ? "" : v instanceof Safe ? v.s : Array.isArray(v) ? v.map(val).join("") : esc(v);
export const html = (strs, ...vals) => new Safe(strs.reduce((o, s, i) => o + s + (i < vals.length ? val(vals[i]) : ""), ""));
export const raw = (s) => new Safe(String(s));

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ---------- Icons (one 24px stroke family) ----------
const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  download: '<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/>',
  bookmark: '<path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alert: '<path d="M12 4 2.8 19.5h18.4L12 4Z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  external: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  chat: '<path d="M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3V6a1 1 0 0 1 1-1Z"/>',
  upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/>',
  dashboard: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="4" rx="1.5"/><rect x="13" y="10" width="7" height="10" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
};
export const icon = (n, cls = "") => raw(`<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ""}</svg>`);

export const logo = () => raw(`<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="var(--accent)"/><circle cx="19.5" cy="13" r="9" fill="var(--bg)"/><rect x="7" y="19" width="6" height="6" rx="1.2" fill="var(--bg)"/></svg>`);

// ---------- Generated pixel thumbnails (for packs with no image yet) ----------
function rng(seed) { let s = 0; for (const c of String(seed)) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const PAL = {
  "resource-packs": [[104, 170, 78], [126, 186, 92], [121, 85, 58], [99, 69, 46], [140, 101, 70]],
  shaders: [[255, 196, 120], [250, 150, 110], [110, 120, 200], [70, 80, 150], [40, 50, 100]],
  mods: [[120, 124, 130], [100, 104, 110], [140, 144, 150], [90, 200, 220], [230, 90, 80]],
};
// Resource-pack block faces: grass, snow, sand, planks, stone bricks, cherry
const RP = [
  { top: 4, a: [[104, 170, 78], [126, 186, 92]], b: [[121, 85, 58], [99, 69, 46], [140, 101, 70]] },
  { top: 5, a: [[238, 244, 248], [214, 226, 236]], b: [[121, 85, 58], [99, 69, 46], [140, 101, 70]] },
  { top: 0, a: [], b: [[219, 204, 150], [206, 189, 132], [229, 216, 166]] },
  { top: 0, a: [], b: [[162, 120, 72], [150, 110, 64], [176, 132, 80], [128, 92, 54]] },
  { top: 0, a: [], b: [[124, 124, 128], [110, 110, 116], [138, 138, 142], [96, 96, 100]] },
  { top: 5, a: [[236, 160, 196], [246, 184, 212]], b: [[88, 52, 60], [104, 62, 70], [76, 44, 52]] },
];
const rgb = (c, d = 0) => `rgb(${c.map((v) => Math.max(0, Math.min(255, v + d))).join(",")})`;
const thumbCache = new Map();
export function thumb(p) {
  if (p.thumbnail_url) return p.thumbnail_url;
  const key = p.slug + p.type;
  if (thumbCache.has(key)) return thumbCache.get(key);
  const r = rng(p.slug), pal = PAL[p.type] || PAL["resource-packs"], N = 16, variant = Math.floor(rng(p.slug + "v")() * RP.length);
  let o = "";
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const j = Math.round((r() - 0.5) * 26);
    let c;
    if (p.type === "resource-packs") { const v = RP[variant]; c = v.top && y < v.top + (r() < 0.3 ? 1 : 0) ? v.a[r() < 0.5 ? 0 : 1] : v.b[Math.floor(r() * v.b.length)]; }
    else if (p.type === "shaders") { const band = Math.min(4, Math.floor((y / N) * 5 + r() * 0.6)); c = pal[band]; if (Math.hypot(x - 11, y - 5) < 2.6) c = [255, 236, 180]; }
    else { c = pal[Math.floor(r() * 3)]; if (r() < 0.07) c = pal[3 + Math.floor(r() * 2)]; }
    o += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${rgb(c, j)}"/>`;
  }
  const url = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges">${o}</svg>`);
  thumbCache.set(key, url);
  return url;
}

// ---------- My Setup fit ----------
const PC_RANK = { low: 0, mid: 1, high: 2 }, PERF_RANK = { light: 0, medium: 1, heavy: 2 }, PERF_NEEDS = ["low", "mid", "high"];
export function fitOf(p, setup) {
  if (!setup || !setup.edition || !setup.version || !setup.pc) return null;
  if (p.platform !== "both" && p.platform !== setup.edition) return { k: "no", why: t("why.platform", { p: t("ed." + p.platform) }) };
  if (p.versions?.length && !p.versions.includes(setup.version)) return { k: "no", why: t("why.version", { v: p.versions.join(", ") }) };
  if ((PERF_RANK[p.perf] ?? 0) > PC_RANK[setup.pc]) return { k: "heavy", why: t("why.perf", { pc: t("pc." + PERF_NEEDS[PERF_RANK[p.perf]]) }) };
  return { k: "ok", why: t("why.ok", { ed: t("ed." + setup.edition), v: setup.version, pc: t("pc." + setup.pc) }) };
}
export const fitPill = (f, long = false) => f
  ? html`<span class="fit fit-${f.k}" title="${f.why}">${icon(f.k === "ok" ? "check" : f.k === "heavy" ? "alert" : "x")}<span>${long ? t("fit." + f.k) : t("fitShort." + f.k)}</span></span>`
  : "";

// ---------- Toasts ----------
export function toast(msg, kind = "ok") {
  const box = $("#toasts"); if (!box) return;
  const el = document.createElement("div");
  el.className = "toast toast-" + kind; el.textContent = msg;
  box.append(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 260); }, 3200);
}

// ---------- Dialog ----------
export function openDialog(content, { wide = false, label = "" } = {}) {
  const d = $("#dlg");
  d.className = "dlg" + (wide ? " dlg-wide" : "");
  d.setAttribute("aria-label", label);
  d.innerHTML = String(content);
  if (!d.open) d.showModal();
  // An explicit [autofocus] wins even when other controls (e.g. social sign-in) come first.
  const f = d.querySelector("[autofocus]") || d.querySelector("input, select, textarea, button:not(.dlg-x)");
  f && f.focus();
  return d;
}
export function closeDialog() { const d = $("#dlg"); if (d.open) d.close(); }
export const dlgHead = (title) => html`<div class="dlg-h"><h2>${title}</h2><button type="button" class="ibtn dlg-x" data-act="close-dlg" aria-label="${t("close")}">${icon("x")}</button></div>`;

export const scoreLabel = (s) => (s == null ? "—" : (+s).toFixed(1));
export const typeLabel = (type) => t("type." + type);

// A pack counts as reviewed once the team has tested it (score or test date) and written its own
// review. Only reviewed packs are indexed: the rest are copies of the creator's listing.
export const reviewed = (p) => !p.is_sample && (p.score != null || !!p.checked_at) && !!String(p.review || "").trim();
const hasReviewData = (p) => !!(String(p.review || "").trim() || p.pros?.length || p.cons?.length || p.test_rig || p.test_setup || p.fps_base != null || p.fps_with != null);
export function fpsChange(p) {
  if (p.fps_base == null || p.fps_with == null) return "";
  const pct = p.fps_base ? Math.round(((p.fps_with - p.fps_base) / p.fps_base) * 100) : 0;
  return `${p.fps_base} → ${p.fps_with} FPS (${pct > 0 ? "+" : pct < 0 ? "−" : "±"}${Math.abs(pct)}%)`;
}
export function reviewBlock(p) {
  if (!hasReviewData(p)) return "";
  const fps = fpsChange(p) || (p.fps_with != null ? `${p.fps_with} FPS` : "");
  const facts = [[t("rv.rig"), p.test_rig], [t("rv.setup"), p.test_setup], [t("rv.fps"), fps]].filter(([, v]) => v);
  const list = (cls, ic, title, items) => items?.length ? html`<div class="pc ${cls}"><h3>${icon(ic)} ${title}</h3><ul>${items.map((x) => html`<li>${x}</li>`)}</ul></div>` : "";
  return html`<section class="panel review" id="review"><h2>${icon("shield")} ${t("rv.title")}</h2>
    ${String(p.review || "").trim() ? html`<div class="prose">${md(p.review)}</div>` : ""}
    ${p.pros?.length || p.cons?.length ? html`<div class="pcs">${list("pc-pro", "check", t("rv.pros"), p.pros)}${list("pc-con", "x", t("rv.cons"), p.cons)}</div>` : ""}
    ${facts.length ? html`<dl class="facts facts-2 rv-facts">${facts.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>` : ""}
  </section>`;
}
// ---------- Results per page ----------
// The choice is kept on the device so every list opens with it; a ?n= in the URL wins.
export const PER_OPTIONS = [10, 20, 50];
export function perPage(q) {
  const fromUrl = +q?.get?.("n");
  if (PER_OPTIONS.includes(fromUrl)) return fromUrl;
  try { const s = +localStorage.getItem("nyxie.per"); if (PER_OPTIONS.includes(s)) return s; } catch (e) {}
  return 20;
}
export function savePerPage(n) { try { localStorage.setItem("nyxie.per", String(n)); } catch (e) {} }
export const perPicker = (n) => html`<div class="per" role="group" aria-label="${t("perPage")}"><span>${t("show")}</span>${PER_OPTIONS.map((x) => html`<button type="button" class="per-b" data-per="${x}" aria-pressed="${x === n}">${x}</button>`)}</div>`;

export const TYPES = ["resource-packs", "shaders", "mods"];

// Minimal, safe markdown: escapes first, then ## headings, lists, bold, links, paragraphs.
export function md(src) {
  const lines = esc(src || "").split(/\r?\n/);
  let out = "", list = null;
  const inline = (s) => s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\[([^\]]+)\]\((\/[^\s)]*)\)/g, '<a href="$2">$1</a>'); // same-site link, opens in place
  const flush = () => { if (list) { out += `</${list}>`; list = null; } };
  for (const l of lines) {
    let m;
    if ((m = l.match(/^#{2,3}\s+(.*)/))) { flush(); out += `<h3>${inline(m[1])}</h3>`; }
    // "> " lines become one highlighted note (esc() has turned ">" into "&gt;").
    else if ((m = l.match(/^\s*&gt;\s?(.*)/))) { if (list !== "blockquote") { flush(); out += '<blockquote class="note-box">'; list = "blockquote"; } if (m[1].trim()) out += `<p>${inline(m[1])}</p>`; }
    else if ((m = l.match(/^\s*[-*]\s+(.*)/))) { if (list !== "ul") { flush(); out += "<ul>"; list = "ul"; } out += `<li>${inline(m[1])}</li>`; }
    else if ((m = l.match(/^\s*\d+[.)]\s+(.*)/))) { if (list !== "ol") { flush(); out += "<ol>"; list = "ol"; } out += `<li>${inline(m[1])}</li>`; }
    else if (!l.trim()) flush();
    else { flush(); out += `<p>${inline(l)}</p>`; }
  }
  flush();
  return raw(out);
}
