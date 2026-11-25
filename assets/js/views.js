import { html, raw, icon, thumb, fitOf, fitPill, scoreLabel, typeLabel, TYPES, md, esc } from "./ui.js";
import { t, fmtDate, fmtDay, fmtNum, timeAgo, langName } from "./i18n.js";
import { state, published, packBySlug, isAdmin } from "./store.js";
import { modrinthRef } from "./mrviews.js";

// ---------- Shared pieces ----------
const href = (p) => `#/pack/${p.slug}`;
export const tags = (p, max = 4) => {
  const a = [...(p.versions || []).slice(0, 2), p.platform === "both" ? t("plat.both") : t("ed." + p.platform)];
  if (p.resolution) a.push(p.resolution);
  if (p.style) a.push(p.style);
  return html`<ul class="tags">${a.slice(0, max).map((x) => html`<li>${x}</li>`)}</ul>`;
};
const sampleBadge = (p) => p.is_sample ? html`<span class="badge" title="${t("sampleTip")}">${t("sample")}</span>`
  : p.score == null && !p.checked_at ? html`<span class="badge badge-warn" title="${t("untestedTip")}">${t("untested")}</span>` : "";
const bmBtn = (p) => html`<button type="button" class="ibtn bm${state.bookmarks.has(p.id) ? " on" : ""}" data-act="bookmark" data-id="${p.id}" aria-pressed="${state.bookmarks.has(p.id)}" aria-label="${t("bookmark")}: ${p.name}" title="${t("bookmark")}">${icon("bookmark")}</button>`;
const score = (p) => html`<div class="score" title="${t("score")}"><b>${scoreLabel(p.score)}</b><small>/10</small></div>`;

export function row(p, { rank } = {}) {
  const f = fitOf(p, state.setup);
  return html`<article class="row${f ? " has-fit" : ""}">
    ${rank ? html`<span class="rank" aria-label="#${rank}">${rank}</span>` : ""}
    <a class="row-th" href="${href(p)}" tabindex="-1" aria-hidden="true"><img src="${thumb(p)}" alt=""${p.thumbnail_url ? raw(' loading="lazy"') : ""} width="84" height="84"></a>
    <div class="row-main">
      <h3><a href="${href(p)}">${p.name}</a> ${sampleBadge(p)}</h3>
      <p class="row-by">${t("by", { c: p.creator || "—" })} · ${t("type1." + p.type)}</p>
      <p class="row-sum">${p.summary}</p>
      ${tags(p)}
    </div>
    <div class="row-side">
      <div class="row-meta">${f ? fitPill(f) : html`<button type="button" class="fit fit-none" data-act="setup" title="${t("setupLead")}">${icon("cpu")}<span>${t("checkFit")}</span></button>`}${score(p)}</div>
      <div class="row-act">
        ${p.checked_at ? html`<span class="row-chk" title="${t("checked")}">${icon("check")}<span class="chk-l">${t("checkedLbl")}</span>${fmtDay(p.checked_at)}</span>` : ""}
        ${p.downloads ? html`<span class="dl-n" title="${t("downloads")}">${icon("download")}${fmtNum(p.downloads)}</span>` : ""}
        ${state.user ? bmBtn(p) : ""}
        <button type="button" class="btn btn-pri btn-sm" data-act="download" data-id="${p.id}">${t("download")}</button>
      </div>
    </div>
  </article>`;
}
export const rows = (list, opts) => html`<div class="rows">${list.map((p, i) => row(p, opts?.ranked ? { rank: i + 1 } : {}))}</div>`;

const empty = (title, body, action = "") => html`<div class="empty">${icon("search", "empty-i")}<h3>${title}</h3><p>${body}</p>${action}</div>`;
const sectionHead = (title, link, label) => html`<div class="sec-h"><h2>${title}</h2>${link ? html`<a class="lnk" href="${link}">${label || t("viewAll")} ${icon("right")}</a>` : ""}</div>`;

export function setupSummary() {
  const s = state.setup;
  return s ? `${t("ed." + s.edition)} ${s.version} · ${t("pc." + s.pc)}` : t("setupSet");
}

// ---------- Home ----------
export function home() {
  const all = published(), s = state.setup;
  const fits = s ? all.filter((p) => fitOf(p, s)?.k === "ok") : [];
  const best = (s ? fits : all).slice().sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 5);
  const shown = new Set(best.map((p) => p.id));
  const recent = all.filter((p) => !shown.has(p.id)).sort((a, b) => String(b.checked_at || "").localeCompare(String(a.checked_at || ""))).slice(0, 4);
  const counts = Object.fromEntries(TYPES.map((ty) => [ty, all.filter((p) => p.type === ty).length]));
  return {
    title: "",
    body: html`
    <section class="intro">
      <div class="intro-txt">
        <h1>${t("homeT")}</h1>
        <p class="lead">${t("homeP")}</p>
        <form class="big-search" role="search" data-form="search">
          ${icon("search")}<input name="q" type="search" placeholder="${t("searchPh")}" aria-label="${t("searchBtn")}" autocomplete="off">
          <button class="btn btn-pri">${t("searchBtn")}</button>
        </form>
      </div>
      <aside class="setup-card">
        <div class="setup-card-h">${icon("cpu")}<h2>${t("setupTitle")}</h2></div>
        ${s ? html`
          <p class="setup-now">${setupSummary()}</p>
          <p class="setup-count"><b>${fits.length}</b> ${t("fitsCount", { n: "", t: all.length }).replace(/^\s*/, "")}</p>
          <button type="button" class="btn btn-sec" data-act="setup">${t("setupEdit")}</button>`
        : html`<p class="muted">${t("setupLead")}</p><button type="button" class="btn btn-pri" data-act="setup">${t("setupSet")}</button>`}
      </aside>
    </section>
    <nav class="types" aria-label="${t("browse")}">
      ${TYPES.map((ty) => html`<a class="type-l" href="#/${ty}"><span>${typeLabel(ty)}</span><small>${t("packsN", { n: counts[ty] })}</small></a>`)}
    </nav>
    <section class="sec">${sectionHead(s ? t("bestForYou") : t("topRated"), s ? "#/resource-packs?fit=1" : "#/top")}${best.length ? rows(best) : empty(t("noResults"), t("noResultsP"))}</section>
    <div class="split">
      <section class="sec">${sectionHead(t("recentlyChecked"), "#/resource-packs?sort=checked")}${rows(recent)}</section>
      <section class="sec">${sectionHead(t("tutorials"), "#/tutorials")}
        <ul class="tut-list">${state.tutorials.filter((x) => x.published).slice(0, 5).map((x) => html`<li><a href="#/tutorials/${x.slug}">${icon("book")}<span><b>${x.title}</b><small>${x.summary}</small></span></a></li>`)}</ul>
      </section>
    </div>`,
  };
}

// ---------- Lists ----------
const VERSIONS = () => [...new Set(published().flatMap((p) => p.versions || []))].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
const uniq = (list, k) => [...new Set(list.map((p) => p[k]).filter(Boolean))].sort();
const PAGE = 20;

const arr = (q, k) => (q.get(k) || "").split(",").filter(Boolean);
export const MULTI = ["ver", "plat", "res", "perf", "style", "cat"];
export function readFilters(q) {
  return {
    ver: arr(q, "ver"), plat: arr(q, "plat"), res: arr(q, "res"), style: arr(q, "style"),
    cat: arr(q, "cat"), perf: arr(q, "perf"), fit: q.get("fit") === "1", sort: q.get("sort") || "score", page: Math.max(1, +q.get("page") || 1),
  };
}
function applyFilters(list, F) {
  let a = list.filter((p) =>
    (!F.ver.length || F.ver.some((v) => (p.versions || []).includes(v))) && (!F.plat.length || p.platform === "both" || F.plat.includes(p.platform)) &&
    (!F.res.length || F.res.includes(p.resolution)) && (!F.style.length || F.style.includes(p.style)) && (!F.cat.length || F.cat.includes(p.category)) && (!F.perf.length || F.perf.includes(p.perf)) &&
    (!F.fit || !state.setup || fitOf(p, state.setup)?.k === "ok"));
  const by = { score: (x, y) => (y.score ?? 0) - (x.score ?? 0), popular: (x, y) => y.downloads + y.views / 10 - (x.downloads + x.views / 10), checked: (x, y) => String(y.checked_at || "").localeCompare(String(x.checked_at || "")), name: (x, y) => x.name.localeCompare(y.name) };
  return a.sort(by[F.sort] || by.score);
}

function filterGroup(key, label, options, F, fmt = (x) => x, collapsed = false) {
  if (!options.length) return "";
  const on = F[key];
  return html`<details class="fg"${!collapsed || on.length ? raw(" open") : ""}><summary>${label}${on.length ? html`<span class="count-b">${on.length}</span>` : ""}${icon("chevron")}</summary>
    <div class="fg-b">${options.map((o) => html`<label class="opt"><input type="checkbox" value="${o}" data-multi="${key}"${on.includes(o) ? raw(" checked") : ""}><span>${fmt(o)}</span></label>`)}</div>
  </details>`;
}

export function filtersPanel(type, F) {
  const base = published().filter((p) => p.type === type);
  return html`
    ${state.setup
      ? html`<label class="switch"><input type="checkbox" data-filter="fit"${F.fit ? raw(" checked") : ""}><span class="sw" aria-hidden="true"></span><span>${t("fitsOnly")}<small>${setupSummary()}</small></span></label>`
      : html`<button type="button" class="setup-nudge" data-act="setup">${icon("cpu")}<span><b>${t("setupSet")}</b><small>${t("setupLead")}</small></span></button>`}
    ${filterGroup("ver", t("version"), VERSIONS(), F)}
    ${filterGroup("plat", t("platform"), ["java", "bedrock"], F, (x) => t("ed." + x))}
    ${type === "resource-packs" ? filterGroup("res", t("resolution"), uniq(base, "resolution").sort((a, b) => parseInt(a) - parseInt(b)), F) : ""}
    ${filterGroup("perf", t("perf"), ["light", "medium", "heavy"], F, (x) => t("perf." + x))}
    ${filterGroup("style", t("style"), uniq(base, "style"), F, undefined, true)}
    ${filterGroup("cat", t("category"), uniq(base, "category"), F, undefined, true)}`;
}

export function listResults(type, F) {
  const base = published().filter((p) => p.type === type), list = applyFilters(base, F);
  const pages = Math.max(1, Math.ceil(list.length / PAGE)), pg = Math.min(F.page, pages), view = list.slice((pg - 1) * PAGE, pg * PAGE);
  const active = MULTI.flatMap((k) => F[k].map((v) => [k, v]));
  const chipLabel = (k, v) => k === "plat" ? t("ed." + v) : k === "perf" ? t("perf." + v) : v;
  return html`
    <div class="res-bar">
      <p class="count">${t("resultsN", { n: list.length })}${state.setup ? html` · <span class="muted">${t("fitsCount", { n: base.filter((p) => fitOf(p, state.setup)?.k === "ok").length, t: base.length })}</span>` : ""}</p>
      <label class="sort">${t("sortBy")}<select data-filter="sort">${["score", "popular", "checked", "name"].map((s) => html`<option value="${s}"${F.sort === s ? raw(" selected") : ""}>${t("sort." + s)}</option>`)}</select></label>
    </div>
    ${active.length || F.fit ? html`<div class="chips">${F.fit ? html`<button type="button" class="chip" data-clear="fit">${t("fitsOnly")} ${icon("x")}</button>` : ""}${active.map(([k, v]) => html`<button type="button" class="chip" data-clear="${k}:${v}">${chipLabel(k, v)} ${icon("x")}</button>`)}<button type="button" class="lnk" data-clear="all">${t("clearAll")}</button></div>` : ""}
    ${view.length ? rows(view) : empty(t("noResults"), t("noResultsP"), html`<button type="button" class="btn btn-sec" data-clear="all">${t("clearAll")}</button>`)}
    ${pages > 1 ? html`<nav class="pager" aria-label="pagination">
      <button type="button" class="btn btn-sec btn-sm" data-page="${pg - 1}"${pg < 2 ? raw(" disabled") : ""}>${icon("left")} ${t("prev")}</button>
      <span>${pg} / ${pages}</span>
      <button type="button" class="btn btn-sec btn-sm" data-page="${pg + 1}"${pg >= pages ? raw(" disabled") : ""}>${t("next")} ${icon("right")}</button></nav>` : ""}`;
}

export function list(type, F) {
  return {
    title: typeLabel(type),
    body: html`<div class="page-h"><h1>${typeLabel(type)}</h1><button type="button" class="btn btn-sec btn-sm show-m" data-act="filters">${icon("sliders")} ${t("filters")}</button></div>
    <div class="layout">
      <aside class="side" id="filters" aria-label="${t("filters")}">${filtersPanel(type, F)}</aside>
      <div id="results">${listResults(type, F)}</div>
    </div>`,
  };
}

// ---------- Detail ----------
export function detail(slug) {
  const p = packBySlug(slug);
  if (!p || (p.status !== "published" && !isAdmin())) return notFound();
  const f = fitOf(p, state.setup);
  const imgs = (p.images || []).filter(Boolean);
  const facts = [
    [t("checked"), fmtDate(p.checked_at)], [t("versions"), (p.versions || []).join(", ") || "—"],
    [t("platform"), p.platform === "both" ? t("plat.both") : t("ed." + p.platform)], [t("perf"), t("perf." + p.perf)],
    p.resolution ? [t("resolution"), p.resolution] : null, [t("requirements"), p.requirements || "—"],
    [t("fileSize"), p.file_size || "—"], [t("license"), p.license || "—"], [t("creator"), p.creator || "—"],
  ].filter(Boolean);
  return {
    title: p.name,
    body: html`
    <nav class="crumbs" aria-label="breadcrumb"><a href="#/${p.type}">${icon("left")} ${typeLabel(p.type)}</a></nav>
    <header class="det-h">
      <img class="det-th" src="${thumb(p)}" alt="" width="120" height="120">
      <div class="det-id">
        <h1>${p.name} ${sampleBadge(p)}</h1>
        <p class="row-by">${t("by", { c: p.creator || "—" })} · ${t("type1." + p.type)}</p>
        <p class="lead">${p.summary}</p>
        ${tags(p, 6)}
      </div>
      <div class="det-act">
        <button type="button" class="btn btn-pri btn-lg" data-act="download" data-id="${p.id}">${icon("download")} ${t("download")}</button>
        <div class="det-act2">
          <button type="button" class="btn btn-sec" data-act="like" data-id="${p.id}" id="like-btn" aria-pressed="false">${icon("heart")} <span>${t("like")}</span> <b id="like-n"></b></button>
          ${state.user ? html`<button type="button" class="btn btn-sec bm2${state.bookmarks.has(p.id) ? " on" : ""}" data-act="bookmark" data-id="${p.id}" aria-pressed="${state.bookmarks.has(p.id)}">${icon("bookmark")} <span>${state.bookmarks.has(p.id) ? t("bookmarked") : t("bookmark")}</span></button>` : ""}
          <button type="button" class="ibtn" data-act="report" data-id="${p.id}" title="${t("report")}" aria-label="${t("report")}">${icon("flag")}</button>
        </div>
        <p class="dl-n">${p.downloads ? html`${icon("download")}${fmtNum(p.downloads)} ${t("downloads")} · ` : ""}${icon("eye")}${fmtNum(p.views)} ${t("views")}</p>
      </div>
    </header>
    ${p.link_broken ? html`<p class="note note-warn">${icon("alert")} ${t("brokenLink")}</p>` : ""}
    <div class="det-grid">
      <div class="det-main">
        ${p.before_url && p.after_url ? html`<section class="panel"><h2>${t("compare")}</h2>
          <div class="ba" style="--p:50%"><img src="${p.before_url}" alt="${t("before")}"><img class="ba-after" src="${p.after_url}" alt="${t("after")}"><input type="range" min="0" max="100" value="50" data-act="ba" aria-label="${t("compare")}"><span class="ba-l">${t("before")}</span><span class="ba-r">${t("after")}</span></div></section>` : ""}
        ${imgs.length ? html`<section class="panel"><h2>${t("gallery")}</h2><div class="gal" data-name="${p.name}">${imgs.map((u, i) => html`<a href="${u}" target="_blank" rel="noopener" data-lbi><img src="${u}" alt="${p.name} ${i + 1}" loading="lazy"></a>`)}</div></section>` : ""}
        ${modrinthRef(p) ? html`<section class="panel" id="mr-versions" aria-live="polite"><h2>${t("mr.files")}</h2><div class="boot"><span class="spin" aria-hidden="true"></span></div></section>` : ""}
        <section class="panel"><h2>${t("testFacts")}</h2><dl class="facts facts-2">${facts.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl></section>
        ${p.description ? html`<section class="panel prose"><h2>${t("description")}</h2>${md(p.description)}</section>` : ""}
        ${p.install_steps ? html`<section class="panel prose"><h2>${t("install")}</h2>${md(p.install_steps)}</section>` : ""}
        <section class="panel" id="comments" aria-live="polite"><h2>${t("comments")}</h2><div class="boot"><span class="spin" aria-hidden="true"></span></div></section>
      </div>
      <aside class="det-side">
        <section class="panel score-panel">
          <div class="score-big"><b>${scoreLabel(p.score)}</b><span>/10</span></div>
          <p>${t("score")}</p>
          <div class="meter" style="--w:${(+p.score || 0) * 10}%"><i></i></div>
        </section>
        <section class="panel fp fp-${f ? f.k : "none"}"><h2>${icon("cpu")} ${t("setupTitle")}</h2>
          ${f ? html`${fitPill(f, true)}<p>${f.why}</p><button type="button" class="lnk" data-act="setup">${setupSummary()} · ${t("setupEdit")}</button>`
              : html`<p class="muted">${t("setupLead")}</p><button type="button" class="btn btn-sec btn-sm" data-act="setup">${icon("cpu")} ${t("setupSet")}</button>`}
        </section>
        ${isAdmin() ? html`<a class="btn btn-sec" href="#/admin/packs/${p.id}">${icon("edit")} ${t("edit")}</a>` : ""}
      </aside>
    </div>`,
    pack: p,
  };
}

export function commentsBlock(p, list) {
  const top = list.filter((c) => !c.parent_id), kids = (id) => list.filter((c) => c.parent_id === id);
  const one = (c, child = false) => {
    const mine = state.user && c.user_id === state.user.id, team = c.profiles?.role === "admin";
    const name = c.profiles?.display_name || "—";
    return html`<li class="cm${child ? " cm-r" : ""}" id="c${c.id}">
      <span class="av" aria-hidden="true">${c.profiles?.avatar_url ? html`<img src="${c.profiles.avatar_url}" alt="">` : name.slice(0, 1).toUpperCase()}</span>
      <div class="cm-b">
        <p class="cm-h"><b>${name}</b>${team ? html`<span class="badge badge-acc">${t("teamReply")}</span>` : ""}<time datetime="${c.created_at}">${timeAgo(c.created_at)}</time>${c.edited_at ? html`<small>· ${t("edited")}</small>` : ""}</p>
        <p class="cm-t" data-body="${c.id}">${c.body}</p>
        <p class="cm-a">
          ${isAdmin() && !child ? html`<button type="button" class="lnk" data-act="c-reply" data-id="${c.id}">${t("reply")}</button>` : ""}
          ${mine ? html`<button type="button" class="lnk" data-act="c-edit" data-id="${c.id}">${t("edit")}</button>` : ""}
          ${mine || isAdmin() ? html`<button type="button" class="lnk lnk-bad" data-act="c-del" data-id="${c.id}">${t("del")}</button>` : ""}
        </p>
        ${kids(c.id).length ? html`<ul class="cms">${kids(c.id).map((k) => one(k, true))}</ul>` : ""}
      </div></li>`;
  };
  return html`<h2>${t("comments")} <span class="count-b">${list.length}</span></h2>
    ${state.user
      ? html`<form class="cm-form" data-form="comment" data-pack="${p.id}"><textarea name="body" rows="3" maxlength="1000" required placeholder="${t("commentPh")}" aria-label="${t("commentPh")}"></textarea><button class="btn btn-pri btn-sm">${t("post")}</button></form>`
      : html`<p class="muted"><button type="button" class="lnk" data-act="signin">${t("signInToComment")}</button></p>`}
    ${top.length ? html`<ul class="cms">${top.map((c) => one(c))}</ul>` : html`<p class="muted cm-empty">${t("noComments")}</p>`}`;
}

// ---------- Search ----------
export function searchItems(q) {
  const n = q.trim().toLowerCase();
  if (!n) return { packs: [], tuts: [] };
  const words = n.split(/\s+/);
  const hay = (p) => [p.name, p.summary, p.creator, p.style, p.category, p.resolution, ...(p.versions || []), t("type." + p.type)].join(" ").toLowerCase();
  const packs = published().filter((p) => words.every((w) => hay(p).includes(w)))
    .sort((a, b) => (b.name.toLowerCase().startsWith(n) - a.name.toLowerCase().startsWith(n)) || (b.score ?? 0) - (a.score ?? 0));
  const tuts = state.tutorials.filter((x) => x.published && words.every((w) => (x.title + " " + x.summary).toLowerCase().includes(w)));
  return { packs, tuts };
}
export function search(q) {
  const mount = (root) => { if (!q) root.querySelector(".big-search input")?.focus(); };
  const { packs, tuts } = searchItems(q);
  const groups = TYPES.map((ty) => [ty, packs.filter((p) => p.type === ty)]).filter(([, a]) => a.length);
  return {
    mount, title: t("searchT"),
    body: html`<div class="page-h"><h1>${q ? t("searchFor", { q }) : t("searchT")}</h1></div>
    <form class="big-search slim" role="search" data-form="search">${icon("search")}<input name="q" type="search" value="${q}" placeholder="${t("searchPh")}" aria-label="${t("searchBtn")}" autocomplete="off"><button class="btn btn-pri">${t("searchBtn")}</button></form>
    ${!q ? empty(t("typeQuery"), t("searchEmptyP"))
      : !packs.length && !tuts.length ? empty(t("searchEmpty", { q }), t("searchEmptyP"))
      : html`${groups.map(([ty, a]) => html`<section class="sec">${sectionHead(`${typeLabel(ty)} · ${a.length}`)}${rows(a)}</section>`)}
        ${tuts.length ? html`<section class="sec">${sectionHead(`${t("tutorials")} · ${tuts.length}`)}<ul class="tut-list">${tuts.map((x) => html`<li><a href="#/tutorials/${x.slug}">${icon("book")}<span><b>${x.title}</b><small>${x.summary}</small></span></a></li>`)}</ul></section>` : ""}`}`,
  };
}

// ---------- Top 10, tutorials, saved, info, account ----------
export function top10() {
  const a = published().slice().sort((x, y) => (y.score ?? 0) - (x.score ?? 0)).slice(0, 10);
  return { title: t("top10"), body: html`<div class="page-h"><div><h1>${t("top10T")}</h1><p class="muted">${t("top10P")}</p></div></div>${rows(a, { ranked: true })}` };
}
export function tutorials() {
  const a = state.tutorials.filter((x) => x.published || isAdmin());
  return { title: t("tutorialsT"), body: html`<div class="page-h"><div><h1>${t("tutorialsT")}</h1><p class="muted">${t("tutorialsP")}</p></div></div>
    <ul class="tut-list tut-big">${a.map((x) => html`<li><a href="#/tutorials/${x.slug}">${icon("book")}<span><b>${x.title}</b><small>${x.summary}</small></span>${icon("right")}</a></li>`)}</ul>` };
}
export function tutorial(slug) {
  const x = state.tutorials.find((y) => y.slug === slug && (y.published || isAdmin()));
  if (!x) return notFound();
  return { title: x.title, body: html`<nav class="crumbs"><a href="#/tutorials">${icon("left")} ${t("tutorials")}</a></nav>
    <article class="article prose"><h1>${x.title}</h1><p class="lead">${x.summary}</p>${x.body ? md(x.body) : html`<p class="muted">${t("pageEmpty")}</p>`}<p class="muted small">${fmtDate(x.updated_at)}</p></article>` };
}
export function saved() {
  if (!state.user) return gate();
  const a = published().filter((p) => state.bookmarks.has(p.id));
  return { title: t("savedT"), body: html`<div class="page-h"><h1>${t("savedT")}</h1></div>${a.length ? rows(a) : empty(t("savedEmpty"), t("savedEmptyP"))}` };
}
export function gate() {
  return { title: t("needSignIn"), body: html`<div class="empty">${icon("user", "empty-i")}<h3>${t("needSignIn")}</h3><button type="button" class="btn btn-pri" data-act="signin">${t("signIn")}</button></div>` };
}
export function notFound() {
  return { title: t("notFound"), body: html`<div class="empty">${icon("search", "empty-i")}<h3>${t("notFound")}</h3><p>${t("notFoundP")}</p><a class="btn btn-sec" href="#/">${t("home")}</a></div>` };
}
export function infoPage(slug, page) {
  const title = page?.title || t("page." + slug);
  return { title, body: html`<article class="article prose"><h1>${title}</h1>${page?.body ? md(page.body) : html`<p class="muted">${t("pageEmpty")}</p>`}</article>` };
}
export function account() {
  if (!state.user) return gate();
  const pr = state.profile || {};
  return { title: t("accountT"), body: html`<div class="page-h"><h1>${t("accountT")}</h1></div>
  <div class="acct">
    <section class="panel"><h2>${t("profile")}</h2>
      <form class="form" data-form="profile">
        <label>${t("email")}<input value="${state.user.email}" disabled></label>
        <label>${t("displayName")}<input name="display_name" value="${pr.display_name || ""}" maxlength="40" required></label>
        <label>${t("avatarUrl")}<input name="avatar_url" type="url" value="${pr.avatar_url || ""}" placeholder="https://"></label>
        <button class="btn btn-pri">${t("save")}</button>
      </form>
    </section>
    <section class="panel"><h2>${t("setupTitle")}</h2><p>${setupSummary()}</p><button type="button" class="btn btn-sec" data-act="setup">${icon("cpu")} ${state.setup ? t("setupEdit") : t("setupSet")}</button></section>
    <section class="panel"><h2>${t("changePw")}</h2>
      <form class="form" data-form="password"><label>${t("newPassword")}<input name="pw" type="password" minlength="8" autocomplete="new-password" required><small>${t("pwMin")}</small></label><button class="btn btn-sec">${t("changePw")}</button></form>
    </section>
    <section class="panel"><h2>${t("preferences")}</h2><div class="row-btns">
      <button type="button" class="btn btn-sec" data-act="lang">${icon("globe")} ${langName()}</button>
      <button type="button" class="btn btn-sec" data-act="theme">${document.documentElement.dataset.theme === "dark" ? icon("sun") : icon("moon")} ${document.documentElement.dataset.theme === "dark" ? t("themeLight") : t("themeDark")}</button>
      <button type="button" class="btn btn-sec" data-act="signout">${t("signOut")}</button></div></section>
  </div>` };
}

