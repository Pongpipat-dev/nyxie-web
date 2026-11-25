// Explore Modrinth: live search and project pages backed by the Modrinth API.
// Everything here is Modrinth's data, not Nyxie test results, and the page says so.
import { html, raw, icon, md, $ } from "./ui.js";
import { t, fmtDate, fmtNum, timeAgo } from "./i18n.js";
import { state, published, isAdmin } from "./store.js";
import * as MR from "./modrinth.js";

const PAGE = 20;
const LOADERS_BY_TYPE = {
  mod: ["fabric", "forge", "neoforge", "quilt"],
  modpack: ["fabric", "forge", "neoforge", "quilt"],
  shader: ["iris", "optifine", "canvas", "vanilla"],
  plugin: ["paper", "spigot", "bukkit", "purpur", "folia", "velocity"],
  resourcepack: [], datapack: [],
};
const typeName = (ty) => t("mr.type." + ty);
const spin = () => html`<div class="boot"><span class="spin" aria-hidden="true"></span></div>`;
const failed = (retry = true) => html`<div class="empty">${icon("alert", "empty-i")}<h3>${t("mr.errT")}</h3><p>${t("mr.errP")}</p>${retry ? html`<button type="button" class="btn btn-sec" data-mr="retry">${t("mr.retry")}</button>` : ""}</div>`;
const extLink = (href, label, cls = "btn btn-sec") => html`<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer">${label} ${icon("external")}</a>`;

// Nyxie pack whose download link points at this Modrinth project, if the team has reviewed it.
function nyxiePackFor(slug, id) {
  const re = new RegExp(`modrinth\\.com/[a-z]+/(${[slug, id].filter(Boolean).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?:[/?#]|$)`, "i");
  return published().find((p) => re.test(p.source_url || ""));
}
const testedBadge = (p) => p ? html`<a class="badge badge-acc mr-tested" href="#/pack/${p.slug}" title="${t("mr.testedTip")}">${icon("check")} ${t("mr.tested")}</a>` : "";

// The player's Java version from My Setup, used to pre-filter versions.
const setupVersion = () => (state.setup?.edition === "java" ? state.setup.version : "");

// ---------- Explore ----------
function readQ(q) {
  const type = MR.MR_TYPES.includes(q.get("type")) ? q.get("type") : "mod";
  const loader = (LOADERS_BY_TYPE[type] || []).includes(q.get("loader")) ? q.get("loader") : "";
  return { q: q.get("q") || "", type, ver: q.get("ver") || "", loader, sort: MR.SORTS.includes(q.get("sort")) ? q.get("sort") : "relevance", page: Math.max(1, +q.get("page") || 1) };
}
const toHash = (F) => {
  const q = new URLSearchParams();
  if (F.q) q.set("q", F.q);
  if (F.type !== "mod") q.set("type", F.type);
  if (F.ver) q.set("ver", F.ver);
  if (F.loader) q.set("loader", F.loader);
  if (F.sort !== "relevance") q.set("sort", F.sort);
  if (F.page > 1) q.set("page", F.page);
  const s = q.toString();
  return "#/modrinth" + (s ? "?" + s : "");
};

function hitRow(h, tab) {
  const to = `#/modrinth/${h.slug}${tab && tab !== h.project_type ? "?as=" + tab : ""}`;
  const nx = nyxiePackFor(h.slug, h.project_id);
  const cats = (h.display_categories || h.categories || []).slice(0, 4);
  return html`<article class="row mr-row">
    <a class="row-th" href="${to}" tabindex="-1" aria-hidden="true">${h.icon_url ? html`<img src="${h.icon_url}" alt="" loading="lazy" width="84" height="84">` : html`<span class="mr-noicon">${icon("download")}</span>`}</a>
    <div class="row-main">
      <h3><a href="${to}">${h.title}</a> ${testedBadge(nx)}</h3>
      <p class="row-by">${t("by", { c: h.organization || h.author || "—" })} · ${typeName(tab || h.project_type)}</p>
      <p class="row-sum">${h.description}</p>
      ${cats.length ? html`<ul class="tags">${cats.map((c) => html`<li>${MR.loaderName(c)}</li>`)}</ul>` : ""}
    </div>
    <div class="row-side">
      <div class="row-meta mr-stats">
        <span title="${t("downloads")}">${icon("download")}${fmtNum(h.downloads)}</span>
        <span title="${t("mr.followers")}">${icon("heart")}${fmtNum(h.follows)}</span>
      </div>
      <div class="row-act">
        <span class="row-chk" title="${t("mr.updated")}">${t("mr.updatedAgo", { t: timeAgo(h.date_modified) })}</span>
        ${extLink(MR.projectUrl(h), "Modrinth", "btn btn-sec btn-sm")}
      </div>
    </div>
  </article>`;
}

async function loadResults(root, F) {
  const box = $("#mr-results", root);
  box.innerHTML = String(spin());
  box.setAttribute("aria-busy", "true");
  try {
    const r = await MR.search({ query: F.q, type: F.type, version: F.ver, loader: F.loader, index: F.sort, offset: (F.page - 1) * PAGE, limit: PAGE });
    const pages = Math.max(1, Math.ceil(Math.min(r.total_hits, 10000) / PAGE));
    box.innerHTML = String(html`
      <p class="count mr-count">${t("mr.resultsN", { n: fmtNum(r.total_hits) })}</p>
      ${r.hits.length ? html`<div class="rows">${r.hits.map((h) => hitRow(h, F.type))}</div>`
        : html`<div class="empty">${icon("search", "empty-i")}<h3>${t("noResults")}</h3><p>${t("mr.noResultsP")}</p></div>`}
      ${pages > 1 ? html`<nav class="pager" aria-label="pagination">
        <button type="button" class="btn btn-sec btn-sm" data-mr-page="${F.page - 1}"${F.page < 2 ? raw(" disabled") : ""}>${icon("left")} ${t("prev")}</button>
        <span>${F.page} / ${fmtNum(pages)}</span>
        <button type="button" class="btn btn-sec btn-sm" data-mr-page="${F.page + 1}"${F.page >= pages ? raw(" disabled") : ""}>${t("next")} ${icon("right")}</button></nav>` : ""}`);
  } catch (e) {
    box.innerHTML = String(failed());
  }
  box.removeAttribute("aria-busy");
}

function filtersHtml(F, vers) {
  const lds = LOADERS_BY_TYPE[F.type] || [];
  const sv = setupVersion();
  return html`
    <form class="form mr-search" role="search" data-mr-form>
      <label>${t("searchBtn")}<span class="mr-q">${icon("search")}<input name="q" type="search" value="${F.q}" placeholder="${t("mr.searchPh", { t: typeName(F.type) })}" autocomplete="off"></span></label>
      <label>${t("version")}<select name="ver" data-mr="ver"><option value="">${t("all")}</option>
        ${vers.map((v) => html`<option value="${v}"${F.ver === v ? raw(" selected") : ""}>${v}${v === sv ? ` · ${t("mr.mySetup")}` : ""}</option>`)}</select></label>
      ${lds.length ? html`<label>${t("mr.loader")}<select name="loader" data-mr="loader"><option value="">${t("all")}</option>
        ${lds.map((l) => html`<option value="${l}"${F.loader === l ? raw(" selected") : ""}>${MR.loaderName(l)}</option>`)}</select></label>` : ""}
      <label>${t("sortBy")}<select name="sort" data-mr="sort">${MR.SORTS.map((s) => html`<option value="${s}"${F.sort === s ? raw(" selected") : ""}>${t("mr.sort." + s)}</option>`)}</select></label>
      <button class="btn btn-pri">${t("searchBtn")}</button>
    </form>`;
}

export function explore(q) {
  let F = readQ(q);
  const tabs = html`<nav class="mr-tabs" aria-label="${t("mr.types")}">${MR.MR_TYPES.map((ty) => html`<a href="${toHash({ ...F, type: ty, loader: "", page: 1 })}"${F.type === ty ? raw(' aria-current="page"') : ""}>${typeName(ty)}</a>`)}</nav>`;
  const mount = async (root) => {
    const side = $("#mr-filters", root);
    let vers = [];
    const paint = () => { side.innerHTML = String(filtersHtml(F, vers)); };
    paint();
    MR.gameVersions().then((all) => { vers = all.filter((v) => v.version_type === "release").map((v) => v.version).slice(0, 60); if (F.ver && !vers.includes(F.ver)) vers.unshift(F.ver); paint(); }).catch(() => {});
    // Filters update the URL in place (no full re-render) so focus stays on the control.
    const update = (patch) => { F = { ...F, ...patch }; history.replaceState(null, "", toHash(F)); loadResults(root, F); };
    side.addEventListener("submit", (ev) => { ev.preventDefault(); ev.stopPropagation(); update({ q: new FormData(ev.target).get("q").trim(), page: 1 }); });
    side.addEventListener("change", (ev) => { const k = ev.target.dataset.mr; if (k) update({ [k]: ev.target.value, page: 1 }); });
    root.addEventListener("click", (ev) => {
      const pg = ev.target.closest("[data-mr-page]");
      if (pg) { update({ page: +pg.dataset.mrPage }); $(".mr-tabs", root)?.scrollIntoView({ block: "start" }); return; }
      if (ev.target.closest('[data-mr="retry"]')) loadResults(root, F);
    });
    loadResults(root, F);
  };
  return {
    title: t("mr.title"), mount,
    body: html`<div class="page-h"><div><h1>${t("mr.title")}</h1><p class="muted">${t("mr.lead")}</p></div></div>
      <p class="note note-info">${icon("alert")} <span>${t("mr.notTested")}</span></p>
      ${tabs}
      <div class="layout">
        <aside class="side" id="mr-filters" aria-label="${t("filters")}"></aside>
        <div id="mr-results" aria-live="polite"></div>
      </div>`,
  };
}

// ---------- Project page ----------
// Modrinth bodies are Markdown mixed with HTML. md() escapes HTML, so tags and inline
// images are stripped first; the full page is one click away on Modrinth.
const cleanBody = (s) => String(s || "").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[\s*\]\([^)]*\)/g, "").replace(/\n{3,}/g, "\n\n").trim();
const sideLabel = (v) => ({ required: t("mr.side.required"), optional: t("mr.side.optional"), unsupported: t("mr.side.unsupported") }[v] || "—");
const verRange = (list) => { const r = MR.releaseVersions(list); return r.length ? (r.length === 1 ? r[0] : `${r[0]} – ${r[r.length - 1]}`) : "—"; };

function versionsTable(list, shown) {
  if (!list.length) return html`<div class="empty">${icon("search", "empty-i")}<h3>${t("mr.noVersions")}</h3><p>${t("mr.noVersionsP")}</p></div>`;
  return html`<div class="tbl-w"><table class="tbl mr-vt">
    <thead><tr><th>${t("mr.version")}</th><th>${t("versions")}</th><th>${t("mr.loader")}</th><th>${t("mr.published")}</th><th class="num">${t("downloads")}</th><th><span class="sr">${t("mr.file")}</span></th></tr></thead>
    <tbody>${list.slice(0, shown).map((v) => {
      const f = MR.primaryFile(v), gv = MR.releaseVersions(v.game_versions);
      return html`<tr>
        <td><b>${v.version_number}</b>${v.version_type !== "release" ? html` <span class="badge${v.version_type === "alpha" ? " badge-bad" : ""}">${t("mr.vt." + v.version_type)}</span>` : ""}<small class="mr-vname">${v.name}</small></td>
        <td>${gv.length > 3 ? `${gv[0]} – ${gv[gv.length - 1]}` : (gv.join(", ") || v.game_versions.slice(0, 3).join(", "))}</td>
        <td>${v.loaders.map(MR.loaderName).join(", ")}</td>
        <td>${fmtDate(v.date_published)}</td>
        <td class="num">${fmtNum(v.downloads)}</td>
        <td class="tbl-act">${f ? html`<a class="btn btn-sec btn-sm" href="${f.url}" rel="noopener noreferrer" title="${f.filename}">${icon("download")} ${MR.fmtBytes(f.size)}</a>` : ""}</td>
      </tr>`;
    })}</tbody></table></div>
    ${list.length > shown ? html`<p class="mr-more"><button type="button" class="btn btn-sec btn-sm" data-mr="more">${t("mr.showMore", { n: list.length - shown })}</button></p>` : ""}`;
}

export function projectPage(slug, as) {
  as = MR.MR_TYPES.includes(as) ? as : "";
  const mount = async (root) => {
    const box = $("#mr-proj", root);
    let p;
    try { p = await MR.project(slug); } catch (e) { box.innerHTML = String(failed(false)); return; }
    if (!p) { box.innerHTML = String(html`<div class="empty">${icon("search", "empty-i")}<h3>${t("notFound")}</h3><p>${t("notFoundP")}</p><a class="btn btn-sec" href="#/modrinth">${t("mr.title")}</a></div>`); return; }
    document.title = `${p.title} · Nyxie`;
    const nx = nyxiePackFor(p.slug, p.id);
    const imgs = (p.gallery || []).slice().sort((a, b) => (b.featured - a.featured) || (a.ordering - b.ordering));
    const links = [[p.source_url, t("mr.source")], [p.issues_url, t("mr.issues")], [p.wiki_url, t("mr.wiki")], [p.discord_url, "Discord"]].filter(([u]) => u);
    const lds = (p.loaders || []).filter((l) => MR.LOADER_SET.has(l));
    const facts = [
      [t("downloads"), fmtNum(p.downloads)], [t("mr.followers"), fmtNum(p.followers)],
      [t("versions"), verRange(p.game_versions)], [t("mr.loader"), lds.map(MR.loaderName).join(", ") || "—"],
      [t("mr.client"), sideLabel(p.client_side)], [t("mr.server"), sideLabel(p.server_side)],
      [t("license"), p.license?.name || p.license?.id?.replace(/^LicenseRef-/, "") || "—"], [t("mr.published"), fmtDate(p.published)], [t("mr.updated"), fmtDate(p.updated)],
    ];
    box.innerHTML = String(html`
      <header class="det-h">
        ${p.icon_url ? html`<img class="det-th mr-icon" src="${p.icon_url}" alt="" width="120" height="120">` : html`<span class="det-th mr-noicon">${icon("download")}</span>`}
        <div class="det-id">
          <h1>${p.title} ${testedBadge(nx)}</h1>
          <p class="row-by"><span id="mr-creator">${t("by", { c: "…" })}</span> · ${typeName(as || p.project_type)}</p>
          <p class="lead">${p.description}</p>
          <ul class="tags">${(p.categories || []).map((c) => html`<li>${MR.loaderName(c)}</li>`)}</ul>
        </div>
        <div class="det-act">
          ${nx ? html`<a class="btn btn-pri btn-lg" href="#/pack/${nx.slug}">${icon("shield")} ${t("mr.readReview")}</a>${extLink(MR.projectUrl({ ...p, project_type: as || p.project_type }), t("mr.openOn"))}`
               : extLink(MR.projectUrl({ ...p, project_type: as || p.project_type }), t("mr.openOn"), "btn btn-pri btn-lg")}
          ${isAdmin() ? html`<a class="btn btn-sec" href="#/admin/packs/new?modrinth=${encodeURIComponent(p.slug)}${as ? "&as=" + as : ""}">${icon("plus")} ${nx ? t("mr.importAgain") : t("mr.import")}</a>` : ""}
          ${links.length ? html`<p class="mr-links">${links.map(([u, l]) => html`<a class="lnk" href="${u}" target="_blank" rel="noopener noreferrer">${l} ${icon("external")}</a>`)}</p>` : ""}
        </div>
      </header>
      ${nx ? "" : html`<p class="note note-info">${icon("alert")} <span>${t("mr.notTested")}</span></p>`}
      <div class="det-grid">
        <div class="det-main">
          <section class="panel" id="mr-versions"><h2>${t("mr.files")}</h2>${spin()}</section>
          ${imgs.length ? html`<section class="panel"><h2>${t("gallery")}</h2><div class="gal" data-name="${p.title}">${imgs.map((g, i) => html`<a href="${g.raw_url || g.url}" target="_blank" rel="noopener" data-lbi><img src="${g.url}" alt="${g.title || `${p.title} ${i + 1}`}" loading="lazy"></a>`)}</div></section>` : ""}
          ${p.body ? html`<section class="panel prose"><h2>${t("description")}</h2>${md(cleanBody(p.body))}<p>${extLink(MR.projectUrl(p), t("mr.readFull"), "lnk")}</p></section>` : ""}
        </div>
        <aside class="det-side">
          <section class="panel"><h2>${t("mr.facts")}</h2><dl class="facts">${facts.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl></section>
        </aside>
      </div>`);
    MR.creatorOf(p).then((c) => { const el = $("#mr-creator", root); if (el) el.textContent = t("by", { c: c || "—" }); }).catch(() => {});
    mountVersions(root, p);
  };
  return { title: t("mr.title"), mount, body: html`<nav class="crumbs" aria-label="breadcrumb"><a href="#/modrinth">${icon("left")} ${t("mr.title")}</a></nav><div id="mr-proj" aria-live="polite">${spin()}</div>` };
}

async function mountVersions(root, p) {
  const box = $("#mr-versions", root);
  let all;
  try { all = await MR.versions(p.id); } catch (e) { box.innerHTML = String(html`<h2>${t("mr.files")}</h2>${failed(false)}`); return; }
  const gvs = MR.releaseVersions([...new Set(all.flatMap((v) => v.game_versions))]).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
  const lds = [...new Set(all.flatMap((v) => v.loaders))];
  const sv = setupVersion();
  let F = { gv: gvs.includes(sv) ? sv : "", ld: "", shown: 10 };
  const paint = () => {
    const list = all.filter((v) => (!F.gv || v.game_versions.includes(F.gv)) && (!F.ld || v.loaders.includes(F.ld)));
    box.innerHTML = String(html`<div class="mr-vh"><h2>${t("mr.files")} <span class="count-b">${list.length}</span></h2>
      <div class="mr-vf">
        <label><span class="sr">${t("version")}</span><select data-mrv="gv"><option value="">${t("mr.allVersions")}</option>${gvs.map((v) => html`<option value="${v}"${F.gv === v ? raw(" selected") : ""}>${v}${v === sv ? ` · ${t("mr.mySetup")}` : ""}</option>`)}</select></label>
        ${lds.length > 1 ? html`<label><span class="sr">${t("mr.loader")}</span><select data-mrv="ld"><option value="">${t("mr.allLoaders")}</option>${lds.map((l) => html`<option value="${l}"${F.ld === l ? raw(" selected") : ""}>${MR.loaderName(l)}</option>`)}</select></label>` : ""}
      </div></div>
      ${sv && !gvs.includes(sv) && state.setup ? html`<p class="note note-warn">${icon("alert")} ${t("mr.noSetupVersion", { v: sv })}</p>` : ""}
      ${versionsTable(list, F.shown)}`);
  };
  box.addEventListener("change", (ev) => { const k = ev.target.dataset.mrv; if (!k) return; F = { ...F, [k]: ev.target.value, shown: 10 }; paint(); $(`[data-mrv="${k}"]`, box)?.focus(); });
  box.addEventListener("click", (ev) => { if (ev.target.closest('[data-mr="more"]')) { F.shown += 20; paint(); } });
  paint();
}
