import { html, raw, icon, logo, $, $$, toast, openDialog, closeDialog, dlgHead, thumb, typeLabel, TYPES, fitOf, fitPill, scoreLabel } from "./ui.js";
import { t, getLang, setLang, langName, LANGS } from "./i18n.js";
import { sb, state, boot, onChange, emit, isAdmin, saveSetup, published, packById, toggleBookmark, likeInfo, toggleLike, loadComments, recordView, recordDownload, loadCatalog } from "./store.js";
import * as V from "./views.js";
import { SOCIALS, CONTACT_EMAIL } from "./config.js";
import "./lightbox.js";
import { oauthButtons, startOAuth, restoreOAuthRoute } from "./oauth.js";

let adminMod = null; // loaded on demand
const pagesCache = new Map();

// ---------- Routing ----------
function parse() {
  const h = location.hash.replace(/^#/, "") || "/";
  const [path, qs] = h.split("?");
  return { parts: path.split("/").filter(Boolean), q: new URLSearchParams(qs || ""), path };
}
const go = (h) => { if (location.hash !== h) location.hash = h; else render(); };

async function render() {
  const main = $("#main");
  if (!state.ready) return;
  const { parts, q } = parse();
  const [a, b, c] = parts;
  let view;
  if (!a) view = V.home();
  else if (TYPES.includes(a)) view = V.list(a, V.readFilters(q));
  else if (a === "pack" && b) view = V.detail(b);
  else if (a === "search") view = V.search(q.get("q") || "");
  else if (a === "top") view = V.top10();
  else if (a === "tutorials") view = b ? V.tutorial(b) : V.tutorials();
  else if (a === "saved") view = V.saved();
  else if (a === "account") view = V.account();
  else if (a === "p" && b) {
    if (!pagesCache.has(b)) { const { data } = await sb.from("pages").select("*").eq("slug", b).maybeSingle(); pagesCache.set(b, data); }
    view = pagesCache.get(b) || ["about", "contact", "privacy", "cookies", "terms", "download-safety"].includes(b) ? V.infoPage(b, pagesCache.get(b)) : V.notFound();
  } else if (a === "admin") {
    if (!state.user) view = V.gate();
    else if (!isAdmin()) view = V.notFound();
    else { adminMod ||= await import("./admin.js"); view = await adminMod.adminView(b, c); }
  } else view = V.notFound();

  main.innerHTML = String(view.body);
  document.title = view.title ? `${view.title} · Nyxie` : "Nyxie: Minecraft packs tested for your setup";
  header();
  if (view.pack) mountDetail(view.pack);
  if (view.mount) view.mount(main);
}

function rerenderKeepScroll() { const y = scrollY; render().then(() => scrollTo(0, y)); }

// ---------- Header / footer ----------
function header() {
  const { parts } = parse(), cur = parts[0] || "";
  const u = state.user, pr = state.profile;
  const nav = [...TYPES.map((ty) => [ty, typeLabel(ty)]), ["top", t("top10")], ["tutorials", t("tutorials")]];
  $("#top").innerHTML = String(html`
    <div class="top-in">
      <a class="brand" href="#/" aria-label="Nyxie home">${logo()}<span>Nyxie</span></a>
      <nav class="nav" aria-label="Main">${nav.map(([k, l]) => html`<a href="#/${k}"${cur === k ? raw(' aria-current="page"') : ""}>${l}</a>`)}</nav>
      <form class="hsearch" role="search" data-form="search" autocomplete="off">
        ${icon("search")}<input name="q" type="search" placeholder="${t("searchShort")}" aria-label="${t("searchBtn")}" aria-controls="hs-pop" aria-expanded="false" data-hsearch><kbd aria-hidden="true">/</kbd>
        <div class="hs-pop" id="hs-pop" role="listbox" hidden></div>
      </form>
      <div class="top-r">
        <a class="ibtn msearch" href="#/search" aria-label="${t("searchBtn")}">${icon("search")}</a>
        <button type="button" class="setup-chip${state.setup ? " set" : ""}" data-act="setup" title="${t("setupTitle")}">${icon("cpu")}<span>${V.setupSummary()}</span></button>
        ${u ? html`<div class="menu-w"><button type="button" class="avatar-btn" data-act="usermenu" aria-haspopup="menu" aria-expanded="false" aria-label="${t("account")}">${pr?.avatar_url ? html`<img src="${pr.avatar_url}" alt="">` : (pr?.display_name || u.email || "?").slice(0, 1).toUpperCase()}</button>
              <div class="menu" role="menu" hidden>
                <p class="menu-h"><b>${pr?.display_name || ""}</b><small>${u.email}</small></p>
                <a role="menuitem" href="#/saved">${icon("bookmark")} ${t("saved")}</a>
                <a role="menuitem" href="#/account">${icon("user")} ${t("account")}</a>
                ${isAdmin() ? html`<a role="menuitem" href="#/admin">${icon("shield")} ${t("admin")}</a>` : ""}
                <button type="button" role="menuitem" data-act="signout">${t("signOut")}</button>
              </div></div>`
            : html`<button type="button" class="btn btn-sec btn-sm" data-act="signin">${t("signIn")}</button>`}
        <button type="button" class="ibtn menu-btn" data-act="drawer" aria-label="${t("menu")}" aria-expanded="false">${icon("menu")}</button>
      </div>
    </div>
    <div class="drawer" hidden>
      <nav aria-label="Main">${nav.map(([k, l]) => html`<a href="#/${k}"${cur === k ? raw(' aria-current="page"') : ""}>${l}</a>`)}</nav>
      <div class="row-btns"><button type="button" class="btn btn-sec btn-sm" data-act="lang">${icon("globe")} ${langName()}</button><button type="button" class="btn btn-sec btn-sm" data-act="theme">${themeIcon()} ${themeLabel()}</button></div>
    </div>`);
}
const themeIcon = () => document.documentElement.dataset.theme === "dark" ? icon("sun") : icon("moon");
const themeLabel = () => document.documentElement.dataset.theme === "dark" ? t("themeLight") : t("themeDark");

function footer() {
  const col = (title, links) => html`<div><h2>${title}</h2><ul>${links.map(([h, l]) => html`<li><a href="${h}">${l}</a></li>`)}</ul></div>`;
  $("#foot").innerHTML = String(html`<div class="foot-in">
    <div class="foot-brand"><a class="brand" href="#/">${logo()}<span>Nyxie</span></a><p>${t("footTag")}</p>
      <ul class="socials">${SOCIALS.map(([n, u]) => html`<li><a href="${u}" target="_blank" rel="noopener">${n}</a></li>`)}</ul></div>
    ${col(t("browse"), [...TYPES.map((ty) => ["#/" + ty, typeLabel(ty)]), ["#/top", t("top10")], ["#/tutorials", t("tutorials")]])}
    ${col("Nyxie", [["#/p/about", t("page.about")], ["#/p/contact", t("page.contact")], ["#/p/download-safety", t("page.download-safety")], ["mailto:" + CONTACT_EMAIL, CONTACT_EMAIL]])}
    ${col(t("legal"), [["#/p/terms", t("page.terms")], ["#/p/privacy", t("page.privacy")], ["#/p/cookies", t("page.cookies")]])}
    <div class="foot-set"><button type="button" class="btn btn-sec btn-sm" data-act="lang">${icon("globe")} ${langName()}</button><button type="button" class="btn btn-sec btn-sm" data-act="theme">${themeIcon()} ${themeLabel()}</button></div>
  </div><p class="foot-legal">© 2026 Nyxie · ${t("disclaimer")}</p>`);
}

// ---------- Detail mount: likes + comments ----------
async function mountDetail(p) {
  recordView(p);
  try {
    const li = await likeInfo(p.id), btn = $("#like-btn");
    if (btn) { btn.dataset.mine = li.mine ? "1" : ""; btn.classList.toggle("on", li.mine); btn.setAttribute("aria-pressed", li.mine); btn.querySelector("span").textContent = li.mine ? t("liked") : t("like"); $("#like-n").textContent = li.count || ""; }
  } catch (e) {}
  refreshComments(p);
}
async function refreshComments(p) {
  const box = $("#comments"); if (!box) return;
  try { box.innerHTML = String(V.commentsBlock(p, await loadComments(p.id))); }
  catch (e) { box.innerHTML = String(html`<h2>${t("comments")}</h2><p class="note note-bad">${t("errLoad")}</p>`); }
}

// ---------- Dialogs ----------
const VERS = () => { const s = new Set(["1.21", "1.20", "1.19", "1.18", "1.16"]); published().forEach((p) => (p.versions || []).forEach((v) => s.add(v))); return [...s].sort((a, b) => b.localeCompare(a, undefined, { numeric: true })); };
function setupDialog() {
  const s = state.setup || { edition: "java", version: VERS()[0], pc: "mid" };
  openDialog(html`${dlgHead(t("setupTitle"))}<p class="muted">${t("setupLead")}</p>
    <form class="form" data-form="setup">
      <fieldset class="seg-f"><legend>${t("edition")}</legend><div class="seg">${["java", "bedrock"].map((e) => html`<label><input type="radio" name="edition" value="${e}"${s.edition === e ? raw(" checked") : ""}><span>${t("ed." + e)}</span></label>`)}</div></fieldset>
      <label>${t("version")}<select name="version">${VERS().map((v) => html`<option${s.version === v ? raw(" selected") : ""}>${v}</option>`)}</select></label>
      <fieldset class="pc-f"><legend>${t("pc")}</legend>${["low", "mid", "high"].map((k) => html`<label class="pc-o"><input type="radio" name="pc" value="${k}"${s.pc === k ? raw(" checked") : ""}><span><b>${t("pc." + k)}</b><small>${t("pcHint." + k)}</small></span></label>`)}</fieldset>
      <div class="dlg-f">${state.setup ? html`<button type="button" class="btn btn-ghost" data-act="setup-clear">${t("clear")}</button>` : ""}<button class="btn btn-pri">${t("save")}</button></div>
    </form>`, { label: t("setupTitle") });
}

const FLAG = (cc) => `https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/${cc}.svg`;
function langDialog() {
  const cur = getLang();
  openDialog(html`${dlgHead(t("language"))}
    <ul class="lang-list" role="listbox" aria-label="${t("language")}">${LANGS.map(([code, native, en, cc]) => html`<li>
      <button type="button" class="lang-opt${code === cur ? " on" : ""}" role="option" aria-selected="${code === cur}" data-act="set-lang" data-l="${code}" lang="${code}"${code === cur ? raw(" autofocus") : ""}>
        <img src="${FLAG(cc)}" alt="" width="20" height="15" loading="lazy"><b>${native}</b>${en ? html`<small lang="en">${en}</small>` : ""}${code === cur ? icon("check", "lang-ck") : ""}
      </button></li>`)}</ul>`, { label: t("language") });
}

function authDialog(mode = "in") {
  const up = mode === "up";
  openDialog(html`${dlgHead(up ? t("signUp") : mode === "reset" ? t("resetT") : t("signIn"))}
    <form class="form" data-form="auth" data-mode="${mode}">
      ${mode !== "reset" ? oauthButtons() : ""}
      ${up ? html`<label>${t("displayName")}<input name="name" maxlength="40" required autocomplete="nickname" autofocus></label>` : ""}
      <label>${t("email")}<input name="email" type="email" required autocomplete="email"${up ? "" : raw(" autofocus")}></label>
      ${mode !== "reset" ? html`<label>${t("password")}<input name="pw" type="password" minlength="${up ? 8 : 1}" required autocomplete="${up ? "new-password" : "current-password"}">${up ? html`<small>${t("pwMin")}</small>` : ""}</label>` : ""}
      <p class="form-err" role="alert" hidden></p>
      <button class="btn btn-pri btn-block">${up ? t("signUp") : mode === "reset" ? t("resetSend") : t("signIn")}</button>
      <p class="form-alt">${mode === "in" ? html`<button type="button" class="lnk" data-act="auth-reset">${t("forgot")}</button> · ${t("noAccount")} <button type="button" class="lnk" data-act="auth-up">${t("signUp")}</button>`
        : html`${t("haveAccount")} <button type="button" class="lnk" data-act="signin">${t("signIn")}</button>`}</p>
    </form>`, { label: t("signIn") });
}

function leaveDialog(p) {
  if (!p.source_url) { toast(t("noLink"), "warn"); return; }
  let host = ""; try { host = new URL(p.source_url).host; } catch (e) {}
  openDialog(html`${dlgHead(t("leaveT"))}<p>${t("leaveP")}</p><p class="leave-host">${icon("external")} <b>${host}</b></p>
    <div class="dlg-f"><button type="button" class="btn btn-ghost" data-act="close-dlg">${t("cancel")}</button>
    <a class="btn btn-pri" href="${p.source_url}" target="_blank" rel="noopener noreferrer" data-act="leave-go" data-id="${p.id}">${t("leaveGo")} ${icon("external")}</a></div>`, { label: t("leaveT") });
}

function reportDialog(p) {
  openDialog(html`${dlgHead(t("reportT"))}<p class="muted">${p.name}</p>
    <form class="form" data-form="report" data-id="${p.id}">
      <fieldset class="pc-f">${["broken-link", "wrong-info", "unsafe", "other"].map((r, i) => html`<label class="pc-o"><input type="radio" name="reason" value="${r}"${i === 0 ? raw(" checked") : ""}><span><b>${t("reason." + r)}</b></span></label>`)}</fieldset>
      <label>${t("note")}<textarea name="note" rows="3" maxlength="500"></textarea></label>
      <div class="dlg-f"><button class="btn btn-pri">${t("send")}</button></div>
    </form>`, { label: t("reportT") });
}

// ---------- Header search popover ----------
let hsIdx = -1;
function hsRender(input) {
  const pop = input.form.querySelector(".hs-pop"), q = input.value.trim();
  if (!q) { pop.hidden = true; input.setAttribute("aria-expanded", "false"); return; }
  const { packs, tuts } = V.searchItems(q);
  const items = [...packs.slice(0, 6).map((p) => ({ h: "#/pack/" + p.slug, p })), ...tuts.slice(0, 2).map((x) => ({ h: "#/tutorials/" + x.slug, x }))];
  hsIdx = -1;
  pop.innerHTML = String(html`${items.map((it, i) => it.p
      ? html`<a role="option" id="hs-${i}" href="${it.h}" class="hs-i"><img src="${thumb(it.p)}" alt="" width="36" height="36"><span><b>${it.p.name}</b><small>${typeLabel(it.p.type)} · ${it.p.creator}</small></span>${fitPill(fitOf(it.p, state.setup))}<em>${scoreLabel(it.p.score)}</em></a>`
      : html`<a role="option" id="hs-${i}" href="${it.h}" class="hs-i">${icon("book")}<span><b>${it.x.title}</b><small>${t("tutorials")}</small></span></a>`)}
    <a class="hs-all" href="#/search?q=${encodeURIComponent(q)}">${icon("search")} ${t("searchAll", { q })}</a>`);
  pop.hidden = false; input.setAttribute("aria-expanded", "true");
}
const hsClose = () => $$(".hs-pop").forEach((p) => { p.hidden = true; p.closest("form").querySelector("input").setAttribute("aria-expanded", "false"); });

// ---------- List filter updates (URL is the state) ----------
function setQuery(mut) {
  const { path, q } = parse();
  mut(q);
  if (!q.has("page") || q.get("page") === "1") q.delete("page");
  const s = q.toString();
  history.replaceState(null, "", "#" + path + (s ? "?" + s : ""));
  const type = parse().parts[0];
  const F = V.readFilters(parse().q);
  $("#results").innerHTML = String(V.listResults(type, F));
  const side = $("#filters"); if (side) side.innerHTML = String(V.filtersPanel(type, F));
}

// ---------- Events ----------
document.addEventListener("click", async (ev) => {
  const el = ev.target.closest("[data-act],[data-clear],[data-page]");
  // close floating menus when clicking elsewhere
  if (!ev.target.closest(".menu-w")) $$(".menu").forEach((m) => { m.hidden = true; m.previousElementSibling?.setAttribute("aria-expanded", "false"); });
  if (!ev.target.closest(".hsearch")) hsClose();
  if (!el) return;
  if (el.dataset.clear) {
    const k = el.dataset.clear;
    setQuery((q) => {
      if (k === "all") ["ver", "plat", "res", "perf", "style", "cat", "fit", "page"].forEach((x) => q.delete(x));
      else if (k.includes(":")) { const i = k.indexOf(":"), key = k.slice(0, i), v = k.slice(i + 1); const rest = (q.get(key) || "").split(",").filter((x) => x && x !== v); rest.length ? q.set(key, rest.join(",")) : q.delete(key); }
      else q.delete(k);
      q.delete("page");
    });
    return;
  }
  if (el.dataset.page) { setQuery((q) => q.set("page", el.dataset.page)); $("#main").scrollIntoView({ block: "start" }); return; }
  const act = el.dataset.act, id = +el.dataset.id, p = id ? packById(id) : null;
  switch (act) {
    case "close-dlg": closeDialog(); break;
    case "setup": setupDialog(); break;
    case "setup-clear": await saveSetup(null); closeDialog(); break;
    case "signin": authDialog("in"); break;
    case "auth-up": authDialog("up"); break;
    case "auth-reset": authDialog("reset"); break;
    case "oauth": {
      const e = el.closest("form")?.querySelector(".form-err");
      el.classList.add("busy"); el.disabled = true;
      const msg = await startOAuth(el.dataset.p);
      if (msg) { el.classList.remove("busy"); el.disabled = false; if (e) { e.textContent = msg; e.hidden = false; } else toast(msg, "bad"); }
      break;
    }
    case "signout": await sb.auth.signOut(); toast(t("signedOut")); go("#/"); break;
    case "theme": {
      const n = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = n; try { localStorage.setItem("nyxie.theme", n); } catch (e) {}
      $('meta[name="theme-color"]').content = n === "dark" ? "#0e1116" : "#f6f7fa";
      footer(); rerenderKeepScroll(); break;
    }
    case "lang": langDialog(); break;
    case "set-lang": { const l = el.dataset.l; closeDialog(); if (l !== getLang()) { await setLang(l); footer(); rerenderKeepScroll(); } break; }
    case "usermenu": { const m = el.nextElementSibling; m.hidden = !m.hidden; el.setAttribute("aria-expanded", !m.hidden); if (!m.hidden) m.querySelector("a,button")?.focus(); break; }
    case "drawer": { const d = $(".drawer"); d.hidden = !d.hidden; el.setAttribute("aria-expanded", !d.hidden); break; }
    case "filters": {
      const side = $("#filters"); if (!side) break;
      const type = parse().parts[0];
      openDialog(html`${dlgHead(t("filters"))}<div class="side side-dlg">${V.filtersPanel(type, V.readFilters(parse().q))}</div><div class="dlg-f"><button type="button" class="btn btn-pri btn-block" data-act="close-dlg">${t("showResults", { n: $("#results .count")?.textContent?.match(/\d+/)?.[0] ?? "" })}</button></div>`, { label: t("filters") });
      break;
    }
    case "download": if (p) leaveDialog(p); break;
    case "leave-go": if (p) { recordDownload(p); setTimeout(closeDialog, 50); } break;
    case "report": if (p) reportDialog(p); break;
    case "bookmark":
      if (!state.user) { authDialog("in"); break; }
      try {
        const on = await toggleBookmark(p);
        $$(`[data-act="bookmark"][data-id="${id}"]`).forEach((b) => { b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); const s = b.querySelector("span"); if (s) s.textContent = on ? t("bookmarked") : t("bookmark"); });
        toast(on ? t("saved_") : t("bookmark") + " ✕");
      } catch (e) { toast(t("errGeneric"), "bad"); }
      break;
    case "like": {
      if (!state.user) { authDialog("in"); break; }
      const mine = el.dataset.mine === "1";
      try {
        await toggleLike(id, mine);
        const n = $("#like-n"), c = (+n.textContent || 0) + (mine ? -1 : 1);
        n.textContent = c || ""; el.dataset.mine = mine ? "" : "1"; el.classList.toggle("on", !mine); el.setAttribute("aria-pressed", !mine);
        el.querySelector("span").textContent = mine ? t("like") : t("liked");
      } catch (e) { toast(t("errGeneric"), "bad"); }
      break;
    }
    case "c-del": {
      if (!confirm(t("confirmDel"))) break;
      const { error } = await sb.from("comments").delete().eq("id", id);
      if (error) toast(t("errGeneric"), "bad"); else refreshComments(V_current());
      break;
    }
    case "c-edit": {
      const body = $(`[data-body="${id}"]`); if (!body || body.querySelector("form")) break;
      const old = body.textContent;
      body.innerHTML = String(html`<form class="cm-form" data-form="c-edit" data-id="${id}"><textarea name="body" rows="3" maxlength="1000" required>${old}</textarea><div class="row-btns"><button class="btn btn-pri btn-sm">${t("save")}</button><button type="button" class="btn btn-ghost btn-sm" data-act="c-cancel">${t("cancel")}</button></div></form>`);
      body.querySelector("textarea").focus(); break;
    }
    case "c-cancel": refreshComments(V_current()); break;
    case "c-reply": {
      const li = $(`#c${id} .cm-b`); if (!li || li.querySelector("[data-form=c-reply]")) break;
      li.insertAdjacentHTML("beforeend", String(html`<form class="cm-form" data-form="c-reply" data-id="${id}"><textarea name="body" rows="2" maxlength="1000" required placeholder="${t("reply")}…"></textarea><div class="row-btns"><button class="btn btn-pri btn-sm">${t("reply")}</button><button type="button" class="btn btn-ghost btn-sm" data-act="c-cancel">${t("cancel")}</button></div></form>`));
      li.querySelector("textarea").focus(); break;
    }
  }
});
const V_current = () => { const { parts } = parse(); return parts[0] === "pack" ? state.packs.find((x) => x.slug === parts[1]) : null; };

document.addEventListener("input", (ev) => {
  const el = ev.target;
  if (el.matches("[data-hsearch]")) hsRender(el);
  if (el.matches('[data-act="ba"]')) el.parentElement.style.setProperty("--p", el.value + "%");
});
document.addEventListener("change", (ev) => {
  const el = ev.target;
  if (el.dataset.multi) {
    const k = el.dataset.multi, v = el.value;
    setQuery((q) => { const s = new Set((q.get(k) || "").split(",").filter(Boolean)); el.checked ? s.add(v) : s.delete(v); s.size ? q.set(k, [...s].join(",")) : q.delete(k); q.delete("page"); });
    const again = $(`[data-multi="${k}"][value="${CSS.escape(v)}"]`); again && again.focus();
    return;
  }
  if (!el.dataset.filter) return;
  const k = el.dataset.filter, v = el.type === "checkbox" ? (el.checked ? "1" : "") : el.value;
  setQuery((q) => { v ? q.set(k, v) : q.delete(k); q.delete("page"); });
  // keep focus on the equivalent control after re-render
  const again = $(`[data-filter="${k}"]${el.type === "radio" ? `[value="${CSS.escape(el.value)}"]` : ""}`);
  again && again.focus();
});

document.addEventListener("keydown", (ev) => {
  const inField = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
  if (ev.key === "/" && !inField && !ev.ctrlKey && !ev.metaKey) { const i = $("[data-hsearch]"); if (i && i.offsetParent) { ev.preventDefault(); i.focus(); } }
  if (ev.key === "Escape") { hsClose(); $$(".menu").forEach((m) => (m.hidden = true)); }
  const inp = ev.target.closest?.("[data-hsearch]");
  if (inp && (ev.key === "ArrowDown" || ev.key === "ArrowUp")) {
    const opts = $$(".hs-pop:not([hidden]) a"); if (!opts.length) return;
    ev.preventDefault(); hsIdx = (hsIdx + (ev.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length;
    opts.forEach((o, i) => o.classList.toggle("act", i === hsIdx)); inp.setAttribute("aria-activedescendant", opts[hsIdx].id || "");
  }
  if (inp && ev.key === "Enter" && hsIdx >= 0) { const o = $$(".hs-pop:not([hidden]) a")[hsIdx]; if (o) { ev.preventDefault(); location.hash = o.getAttribute("href"); inp.blur(); hsClose(); } }
});

document.addEventListener("submit", async (ev) => {
  const f = ev.target, kind = f.dataset.form; if (!kind) return;
  ev.preventDefault();
  const fd = new FormData(f), btn = f.querySelector("button:not([type=button])");
  const busy = (on) => { if (btn) { btn.disabled = on; btn.classList.toggle("busy", on); } };
  const err = (m) => { const e = f.querySelector(".form-err"); if (e) { e.textContent = m; e.hidden = false; } else toast(m, "bad"); };
  try {
    busy(true);
    if (kind === "search") { const q = String(fd.get("q") || "").trim(); hsClose(); f.querySelector("input").blur(); go("#/search" + (q ? "?q=" + encodeURIComponent(q) : "")); }
    else if (kind === "setup") { await saveSetup({ edition: fd.get("edition"), version: fd.get("version"), pc: fd.get("pc") }); closeDialog(); toast(t("saved_")); }
    else if (kind === "auth") {
      const mode = f.dataset.mode, email = String(fd.get("email")).trim(), pw = String(fd.get("pw") || "");
      if (mode === "in") {
        const { error } = await sb.auth.signInWithPassword({ email, password: pw });
        if (error) return err(error.message.includes("Email not confirmed") ? t("checkEmail") : t("errAuth"));
        closeDialog(); toast(t("welcome", { n: email.split("@")[0] }));
      } else if (mode === "up") {
        const { data, error } = await sb.auth.signUp({ email, password: pw, options: { data: { display_name: String(fd.get("name")).trim() }, emailRedirectTo: location.origin + location.pathname } });
        if (error) return err(error.message);
        if (!data.session) openDialog(html`${dlgHead(t("signUp"))}<p>${t("checkEmail")}</p><div class="dlg-f"><button type="button" class="btn btn-pri" data-act="close-dlg">OK</button></div>`);
        else closeDialog();
      } else {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname + "#/account" });
        if (error) return err(error.message);
        closeDialog(); toast(t("resetSent"));
      }
    }
    else if (kind === "report") {
      const { error } = await sb.from("reports").insert({ pack_id: +f.dataset.id, user_id: state.user?.id ?? null, reason: fd.get("reason"), note: String(fd.get("note") || "").trim() });
      if (error) throw error; closeDialog(); toast(t("reportThanks"));
    }
    else if (kind === "comment" || kind === "c-reply") {
      const body = String(fd.get("body")).trim(); if (!body) return;
      const p = V_current();
      const row = { pack_id: p.id, user_id: state.user.id, body };
      if (kind === "c-reply") row.parent_id = +f.dataset.id;
      const { error } = await sb.from("comments").insert(row);
      if (error) throw error; refreshComments(p);
    }
    else if (kind === "c-edit") {
      const { error } = await sb.from("comments").update({ body: String(fd.get("body")).trim(), edited_at: new Date().toISOString() }).eq("id", +f.dataset.id);
      if (error) throw error; refreshComments(V_current());
    }
    else if (kind === "profile") {
      const upd = { display_name: String(fd.get("display_name")).trim(), avatar_url: String(fd.get("avatar_url")).trim() || null };
      const { error } = await sb.from("profiles").update(upd).eq("id", state.user.id);
      if (error) throw error; Object.assign(state.profile, upd); header(); toast(t("saved_"));
    }
    else if (kind === "password") {
      const { error } = await sb.auth.updateUser({ password: String(fd.get("pw")) });
      if (error) return err(error.message); f.reset(); toast(t("pwChanged"));
    }
    else if (adminMod && adminMod.onSubmit) { await adminMod.onSubmit(kind, f, fd); if (kind === "adm-page") pagesCache.delete(f.dataset.slug); }
  } catch (e) { console.error(e); err(t("errGeneric")); }
  finally { busy(false); }
});

$("#dlg").addEventListener("click", (ev) => { if (ev.target === ev.currentTarget) closeDialog(); }); // backdrop click

// ---------- Start ----------
window.addEventListener("hashchange", () => { $(".drawer") && ($(".drawer").hidden = true); closeDialog(); render().then(() => { scrollTo(0, 0); $("#main").focus({ preventScroll: true }); }); });
onChange(() => { footer(); render(); });

(async () => {
  footer();
  try { await boot(); restoreOAuthRoute(!!state.user); }
  catch (e) {
    console.error(e);
    $("#main").innerHTML = String(html`<div class="empty">${icon("alert", "empty-i")}<h3>${t("errLoad")}</h3><button type="button" class="btn btn-pri" onclick="location.reload()">${t("retry")}</button></div>`);
    return;
  }
  render();
})();

export { render, header, go, loadCatalog, emit };
