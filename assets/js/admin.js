import { html, raw, icon, thumb, toast, scoreLabel, typeLabel, TYPES, $ } from "./ui.js";
import { t, fmtDate, getLang, timeAgo } from "./i18n.js";
import { sb, state, loadCatalog } from "./store.js";
import * as MR from "./modrinth.js";

// Admin UI copy (admins only; kept compact and bilingual).
const A = (th, en) => (getLang() === "th" ? th : en);
const TABS = [
  ["dashboard", () => A("แดชบอร์ด", "Dashboard"), "dashboard"],
  ["packs", () => A("แพ็ก", "Packs"), "download"],
  ["reports", () => A("รายงานปัญหา", "Reports"), "flag"],
  ["comments", () => A("ความคิดเห็น", "Comments"), "chat"],
  ["tutorials", () => A("บทสอน", "Tutorials"), "book"],
  ["pages", () => A("หน้าข้อมูล", "Pages"), "edit"],
  ["users", () => A("ผู้ใช้", "Users"), "user"],
];
const PAGE_SLUGS = ["about", "contact", "privacy", "cookies", "terms", "download-safety"];
const slugify = (s) => String(s).toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "item-" + Date.now();
const go = (h) => { history.pushState(null, "", h); window.dispatchEvent(new Event("nyxie:route")); };

// The pack list is split by type: /admin/packs/<type> lists one type, /admin/packs lists all.
const isType = (s) => TYPES.includes(s);
// Type a pack page belongs to: the list's type, or the edited pack's type, or ?type= on "new".
function packTypeOf(sub) {
  if (isType(sub)) return sub;
  if (sub === "new") { const q = new URLSearchParams(location.search).get("type"); return isType(q) ? q : null; }
  return state.packs.find((x) => String(x.id) === String(sub))?.type || null;
}
const packsHref = (ty) => "/admin/packs" + (ty ? "/" + ty : "");

function shell(tab, body, counts = {}, sub) {
  const curType = tab === "packs" ? packTypeOf(sub) : null;
  const n = (ty) => state.packs.filter((p) => p.type === ty).length;
  return html`<div class="page-h"><h1>${icon("shield")} ${t("admin")}</h1></div>
  <div class="adm">
    <nav class="adm-nav" aria-label="${t("admin")}">${TABS.map(([k, l, ic]) => html`<a href="/admin/${k}"${tab === k && !curType ? raw(' aria-current="page"') : ""}>${icon(ic)}<span>${l()}</span>${counts[k] ? html`<b class="count-b">${counts[k]}</b>` : k === "packs" ? html`<small class="adm-n">${state.packs.length}</small>` : ""}</a>
      ${k === "packs" ? html`<div class="adm-sub">${TYPES.map((ty) => html`<a href="${packsHref(ty)}"${curType === ty ? raw(' aria-current="page"') : ""}><span>${typeLabel(ty)}</span><small class="adm-n">${n(ty)}</small></a>`)}</div>` : ""}`)}</nav>
    <section class="adm-main">${body}</section>
  </div>`;
}

export async function adminView(tab = "dashboard", sub) {
  const { count: openReports } = await sb.from("reports").select("id", { count: "exact", head: true }).eq("status", "open");
  const counts = { reports: openReports || 0 };
  let body;
  if (tab === "dashboard") body = await dashboardTab(openReports || 0);
  else if (tab === "packs") body = !sub || isType(sub) ? packsTable(sub) : await packForm(sub);
  else if (tab === "reports") body = await reportsTab();
  else if (tab === "comments") body = await commentsTab();
  else if (tab === "tutorials") body = sub ? tutorialForm(sub) : tutorialsTab();
  else if (tab === "pages") body = await pagesTab(sub || "about");
  else if (tab === "users") body = await usersTab();
  else body = await dashboardTab(openReports || 0);
  return { title: t("admin"), body: shell(tab, body, counts, sub), mount };
}

// ---------- Dashboard ----------
// Packs only store running totals for views/downloads (no daily history), so this page
// shows current totals, a per-type breakdown and what needs attention, not trends.
// Bookmarks are left out: RLS lets each user read only their own, so a count would be wrong.
const num = (n) => (+n || 0).toLocaleString(getLang() === "en" ? "en-US" : getLang());
async function dashboardTab(openReports) {
  const week = new Date(Date.now() - 7 * 864e5).toISOString();
  const count = (q) => q.then((r) => r.count ?? 0, () => 0);
  const head = { count: "exact", head: true };
  const [users, usersNew, comments, commentsNew, likes] = await Promise.all([
    count(sb.from("profiles").select("id", head)),
    count(sb.from("profiles").select("id", head).gte("created_at", week)),
    count(sb.from("comments").select("id", head)),
    count(sb.from("comments").select("id", head).gte("created_at", week)),
    count(sb.from("likes").select("pack_id", head)),
  ]);
  const packs = state.packs;
  const pub = packs.filter((p) => p.status === "published");
  const sum = (arr, k) => arr.reduce((s, p) => s + (+p[k] || 0), 0);
  const downloads = sum(packs, "downloads"), views = sum(packs, "views");

  const tile = (label, value, sub, href) => html`<a class="kpi" href="${href}"><span class="kpi-l">${label}</span><b class="kpi-v">${num(value)}</b>${sub ? html`<span class="kpi-s">${sub}</span>` : ""}</a>`;

  // Downloads per type: one series, one hue, bars share a single scale.
  const byType = TYPES.map((ty) => { const ps = packs.filter((p) => p.type === ty); return { ty, n: ps.length, dl: sum(ps, "downloads") }; });
  const maxDl = Math.max(1, ...byType.map((x) => x.dl));

  const top = pub.slice().sort((a, b) => (b.downloads || 0) - (a.downloads || 0) || (b.views || 0) - (a.views || 0)).slice(0, 5);

  const todo = [
    openReports && { href: "/admin/reports", ic: "flag", bad: true, text: A(`รายงานปัญหาที่ยังไม่แก้ ${openReports} รายการ`, `${openReports} open report${openReports > 1 ? "s" : ""}`) },
    ...packs.filter((p) => p.link_broken).map((p) => ({ href: `/admin/packs/${p.id}`, ic: "alert", bad: true, text: A(`ลิงก์ดาวน์โหลดเสีย: ${p.name}`, `Broken download link: ${p.name}`) })),
    ...packs.filter((p) => p.status === "draft").map((p) => ({ href: `/admin/packs/${p.id}`, ic: "edit", text: A(`ฉบับร่างยังไม่เผยแพร่: ${p.name}`, `Unpublished draft: ${p.name}`) })),
    ...pub.filter((p) => !p.source_url && !p.is_sample).map((p) => ({ href: `/admin/packs/${p.id}`, ic: "download", text: A(`ยังไม่มีลิงก์ดาวน์โหลด: ${p.name}`, `No download link: ${p.name}`) })),
  ].filter(Boolean);

  return html`<div class="adm-h"><h2>${A("แดชบอร์ด", "Dashboard")}</h2></div>
  <div class="kpis">
    ${tile(A("แพ็กที่เผยแพร่", "Published packs"), pub.length, A(`ฉบับร่าง ${packs.length - pub.length}`, `${packs.length - pub.length} draft${packs.length - pub.length === 1 ? "" : "s"}`), "/admin/packs")}
    ${tile(A("ดาวน์โหลดรวม", "Total downloads"), downloads, A("ไปหน้าผู้สร้าง", "to creator pages"), "/admin/packs")}
    ${tile(A("ยอดดูรวม", "Total views"), views, A("หน้ารายละเอียดแพ็ก", "pack detail pages"), "/admin/packs")}
    ${tile(A("ผู้ใช้", "Users"), users, A(`+${num(usersNew)} คนใน 7 วันที่ผ่านมา`, `+${num(usersNew)} in the last 7 days`), "/admin/users")}
    ${tile(A("ความคิดเห็น", "Comments"), comments, A(`+${num(commentsNew)} ใน 7 วันที่ผ่านมา`, `+${num(commentsNew)} in the last 7 days`), "/admin/comments")}
    ${tile(A("ถูกใจ", "Likes"), likes, "", "/admin/packs")}
  </div>

  <div class="dash-grid">
    <section class="panel">
      <h2>${A("ดาวน์โหลดตามประเภท", "Downloads by type")}</h2>
      <ul class="bars">${byType.map((x) => html`<li title="${typeLabel(x.ty)}: ${num(x.dl)} ${t("downloads")} · ${t("packsN", { n: x.n })}">
        <span class="bars-l">${typeLabel(x.ty)} <small class="muted">${t("packsN", { n: x.n })}</small></span>
        <span class="bars-t"><span class="bars-f" style="width:${x.dl ? Math.max(2, (x.dl / maxDl) * 100) : 0}%"></span></span>
        <b class="bars-v">${num(x.dl)}</b></li>`)}</ul>
    </section>

    <section class="panel">
      <h2>${A("ต้องจัดการ", "Needs attention")}</h2>
      ${todo.length ? html`<ul class="todo">${todo.slice(0, 8).map((x) => html`<li><a href="${x.href}" class="${x.bad ? "todo-bad" : ""}">${icon(x.ic)}<span>${x.text}</span>${icon("right", "todo-go")}</a></li>`)}</ul>
        ${todo.length > 8 ? html`<p class="small muted">${A(`และอีก ${todo.length - 8} รายการ`, `and ${todo.length - 8} more`)}</p>` : ""}`
        : html`<p class="muted">${icon("check")} ${A("ไม่มีอะไรค้าง เรียบร้อยดี", "Nothing waiting. All clear.")}</p>`}
    </section>
  </div>

  <section class="panel">
    <h2>${A("แพ็กยอดนิยม", "Top packs")}</h2>
    ${top.length ? html`<div class="tbl-w"><table class="tbl">
      <thead><tr><th>${A("ชื่อ", "Name")}</th><th>${A("ประเภท", "Type")}</th><th class="num">${t("score")}</th><th class="num">${A("ดาวน์โหลด", "Downloads")}</th><th class="num">${A("ยอดดู", "Views")}</th></tr></thead>
      <tbody>${top.map((p) => html`<tr><td><div class="tbl-name"><img src="${thumb(p)}" alt="" width="32" height="32"><a href="/pack/${p.slug}">${p.name}</a></div></td>
        <td>${typeLabel(p.type)}</td><td class="num">${scoreLabel(p.score)}</td><td class="num">${num(p.downloads)}</td><td class="num">${num(p.views)}</td></tr>`)}</tbody></table></div>`
      : html`<p class="muted">${A("ยังไม่มีแพ็กที่เผยแพร่", "No published packs yet")}</p>`}
  </section>`;
}

// ---------- Packs ----------
function packsTable(ty) {
  const rows = state.packs.filter((p) => !ty || p.type === ty).sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
  const add = ty ? A(`เพิ่ม ${typeLabel(ty)}`, `Add ${t("type1." + ty).toLowerCase()}`) : A("เพิ่มแพ็ก", "Add pack");
  return html`<div class="adm-h"><h2>${ty ? typeLabel(ty) : A("แพ็กทั้งหมด", "All packs")} <span class="count-b">${rows.length}</span></h2><a class="btn btn-pri btn-sm" href="/admin/packs/new${ty ? "?type=" + ty : ""}">${icon("plus")} ${add}</a></div>
  ${rows.length ? html`<div class="tbl-w"><table class="tbl">
    <thead><tr><th>${A("ชื่อ", "Name")}</th>${ty ? "" : html`<th>${A("ประเภท", "Type")}</th>`}<th>${A("สถานะ", "Status")}</th><th class="num">${t("score")}</th><th>${t("checked")}</th><th class="num">${t("downloads")}</th><th><span class="sr">${A("จัดการ", "Actions")}</span></th></tr></thead>
    <tbody>${rows.map((p) => html`<tr>
      <td><div class="tbl-name"><img src="${thumb(p)}" alt="" width="32" height="32"><a href="/pack/${p.slug}">${p.name}</a>${p.is_sample ? html`<span class="badge">${t("sample")}</span>` : ""}${p.link_broken ? html`<span class="badge badge-bad">${A("ลิงก์เสีย", "Broken link")}</span>` : ""}</div></td>
      ${ty ? "" : html`<td><a href="${packsHref(p.type)}">${typeLabel(p.type)}</a></td>`}
      <td><span class="st st-${p.status}">${p.status === "published" ? A("เผยแพร่", "Published") : A("ฉบับร่าง", "Draft")}</span></td>
      <td class="num">${scoreLabel(p.score)}</td><td>${fmtDate(p.checked_at)}</td><td class="num">${p.downloads}</td>
      <td class="tbl-act"><a class="ibtn" href="/admin/packs/${p.id}" aria-label="${t("edit")} ${p.name}">${icon("edit")}</a><button type="button" class="ibtn ibtn-bad" data-adm="del-pack" data-id="${p.id}" aria-label="${t("del")} ${p.name}">${icon("trash")}</button></td>
    </tr>`)}</tbody></table></div>`
  : html`<div class="empty">${icon("download", "empty-i")}<h3>${A(`ยังไม่มี ${typeLabel(ty)}`, `No ${typeLabel(ty)} yet`)}</h3></div>`}`;
}

const field = (label, input, hint = "") => html`<label class="fl">${label}${input}${hint ? html`<small>${hint}</small>` : ""}</label>`;
const sel = (name, opts, v, fmt = (x) => x) => html`<select name="${name}">${opts.map((o) => html`<option value="${o}"${o === v ? raw(" selected") : ""}>${fmt(o)}</option>`)}</select>`;

async function packForm(id) {
  const isNew = id === "new";
  let p = isNew ? { type: packTypeOf("new") || "resource-packs", status: "draft", platform: "java", perf: "light", versions: [], images: [] } : state.packs.find((x) => String(x.id) === String(id));
  if (!p) return html`<p class="note note-bad">${t("notFound")}</p>`;
  // /admin/packs/new?modrinth=<slug> arrives from a project page on Explore Modrinth.
  const hq = new URLSearchParams(location.search);
  const mrRef = isNew ? MR.parseRef(hq.get("modrinth")) : "";
  let mrNote = "";
  if (mrRef) {
    try { const d = await MR.toPackDraft(mrRef, hq.get("as")); if (d) { p = { ...p, ...d }; mrNote = html`<p class="note note-info">${icon("check")} <span>${A(`กรอกข้อมูลจาก Modrinth แล้ว (${d.name}) ตรวจทาน ให้คะแนน และใส่วันที่ทดสอบก่อนเผยแพร่`, `Filled from Modrinth (${d.name}). Review it, add the score and test date before publishing.`)}</span></p>`; } }
    catch (e) { mrNote = html`<p class="note note-bad">${t("mr.errT")}</p>`; }
  }
  const mrSrc = /modrinth\.com\//i.test(p.source_url || "") ? p.source_url : "";
  const back = isNew && !packTypeOf("new") ? packsHref() : packsHref(p.type);
  return html`<div class="adm-h"><h2>${isNew ? A("เพิ่มแพ็กใหม่", "New pack") : p.name}</h2><a class="lnk" href="${back}">${icon("left")} ${A("กลับไปรายการ", "Back to list")}</a></div>
  ${mrNote}
  <form class="form adm-form" data-form="adm-pack" data-id="${isNew ? "" : p.id}">
    <fieldset class="fg-box mr-import"><legend>${A("นำเข้าจาก Modrinth", "Import from Modrinth")}</legend>
      <div class="mr-import-r">
        ${field(A("ลิงก์หรือ slug ของโปรเจกต์", "Project link or slug"), html`<input id="mr-ref" value="${mrRef || mrSrc}" placeholder="https://modrinth.com/mod/sodium" autocomplete="off">`)}
        <button type="button" class="btn btn-sec" data-adm="mr-fetch">${icon("download")} ${A("ดึงข้อมูล", "Fetch")}</button>
      </div>
      <small class="muted">${A("เติมชื่อ ผู้สร้าง คำอธิบาย เวอร์ชัน ไลเซนส์ ขนาดไฟล์ รูปปก และแกลเลอรีให้อัตโนมัติ คะแนนและผลทดสอบยังต้องใส่เอง", "Fills name, creator, description, versions, license, file size, icon and gallery. Score and test results stay yours to enter.")} <a class="lnk" href="/modrinth">${A("ค้นหาใน Modrinth", "Search Modrinth")} ${icon("right")}</a></small>
    </fieldset>
    <div class="fgrid">
      ${field(A("ชื่อแพ็ก", "Name"), html`<input name="name" value="${p.name || ""}" required maxlength="80">`)}
      ${field("Slug", html`<input name="slug" value="${p.slug || ""}" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="${A("สร้างจากชื่ออัตโนมัติ", "auto from name")}">`, A("ใช้ในลิงก์ เช่น faithful-plus", "Used in the URL, e.g. faithful-plus"))}
      ${field(A("ประเภท", "Type"), sel("type", TYPES, p.type, typeLabel))}
      ${field(A("สถานะ", "Status"), sel("status", ["draft", "published"], p.status, (x) => x === "published" ? A("เผยแพร่", "Published") : A("ฉบับร่าง", "Draft")))}
      ${field(t("creator"), html`<input name="creator" value="${p.creator || ""}" maxlength="80">`)}
      ${field(A("ลิงก์ดาวน์โหลด (หน้าผู้สร้าง)", "Download link (creator's page)"), html`<input name="source_url" type="url" value="${p.source_url || ""}" placeholder="https://">`)}
      ${field(t("score"), html`<input name="score" type="number" min="0" max="10" step="0.1" value="${p.score ?? ""}">`)}
      ${field(t("checked"), html`<input name="checked_at" type="date" value="${p.checked_at || ""}">`)}
      ${field(t("versions"), html`<input name="versions" value="${(p.versions || []).join(", ")}" placeholder="1.21, 1.20">`, A("คั่นด้วยจุลภาค", "Comma separated"))}
      ${field(t("platform"), sel("platform", ["java", "bedrock", "both"], p.platform, (x) => x === "both" ? t("plat.both") : t("ed." + x)))}
      ${field(t("perf"), sel("perf", ["light", "medium", "heavy"], p.perf, (x) => t("perf." + x)), A("ใช้คำนวณว่าเข้ากับสเปกคอมไหม: เบา=ทุกเครื่อง, ปานกลาง=สเปกกลางขึ้นไป, หนัก=สเปกแรง", "Drives the fit check: light = any PC, medium = mid-range+, heavy = high-end"))}
      ${field(t("resolution"), html`<input name="resolution" value="${p.resolution || ""}" placeholder="16x">`)}
      ${field(t("style"), html`<input name="style" value="${p.style || ""}" placeholder="Vanilla">`)}
      ${field(t("category"), html`<input name="category" value="${p.category || ""}" placeholder="Survival">`)}
      ${field(t("requirements"), html`<input name="requirements" value="${p.requirements || ""}" placeholder="Requires Fabric">`)}
      ${field(t("license"), html`<input name="license" value="${p.license || ""}">`)}
      ${field(t("fileSize"), html`<input name="file_size" value="${p.file_size || ""}" placeholder="12 MB">`)}
    </div>
    ${field(A("คำอธิบายสั้น", "Summary"), html`<input name="summary" value="${p.summary || ""}" maxlength="200">`)}
    ${field(t("description"), html`<textarea name="description" rows="6" maxlength="8000">${p.description || ""}</textarea>`, A("รองรับ ## หัวข้อ, - รายการ, **ตัวหนา**, [ลิงก์](https://…)", "Supports ## headings, - lists, **bold**, [links](https://…)"))}
    ${field(t("install"), html`<textarea name="install_steps" rows="5" maxlength="4000" placeholder="1. ...">${p.install_steps || ""}</textarea>`)}
    <fieldset class="fg-box"><legend>${A("รีวิวของทีม Nyxie", "Nyxie team review")}</legend>
      <p class="small muted">${A("เขียนจากการทดสอบจริงด้วยคำพูดของทีมเอง ห้ามคัดลอกคำอธิบายของผู้สร้าง หน้าแพ็กจะเข้า Google ก็ต่อเมื่อมีคะแนนหรือวันที่ทดสอบ และมีบทรีวิวนี้แล้ว", "Write it from your own test, in your own words. Don't copy the creator's description. A pack page is indexed by Google only once it has a score or test date and this review.")}</p>
      ${field(A("บทรีวิว", "Review"), html`<textarea name="review" rows="8" maxlength="20000" placeholder="${A("ลองใช้กับโลกเซอร์ไวเวิลแล้วเป็นยังไง เด่นตรงไหน เหมาะกับใคร…", "How it played in a survival world, what stands out, who it suits…")}">${p.review || ""}</textarea>`, A("รองรับ ## หัวข้อ, - รายการ, **ตัวหนา**", "Supports ## headings, - lists, **bold**"))}
      <div class="fgrid">
        ${field(A("ข้อดี", "Pros"), html`<textarea name="pros" rows="4" placeholder="${A("บรรทัดละข้อ", "One per line")}">${(p.pros || []).join("\n")}</textarea>`)}
        ${field(A("ข้อเสีย", "Cons"), html`<textarea name="cons" rows="4" placeholder="${A("บรรทัดละข้อ", "One per line")}">${(p.cons || []).join("\n")}</textarea>`)}
        ${field(A("เครื่องที่ใช้ทดสอบ", "Test PC"), html`<input name="test_rig" value="${p.test_rig || ""}" maxlength="200" placeholder="Ryzen 5 5600 / RTX 3060 / 16 GB">`)}
        ${field(A("เวอร์ชันและการตั้งค่า", "Version and settings"), html`<input name="test_setup" value="${p.test_setup || ""}" maxlength="200" placeholder="1.21.4 · Fabric + Sodium · 12 chunks">`)}
        ${field(A("FPS ก่อนใส่ (เฉลี่ย)", "FPS without (average)"), html`<input name="fps_base" type="number" min="0" max="5000" step="1" value="${p.fps_base ?? ""}">`)}
        ${field(A("FPS หลังใส่ (เฉลี่ย)", "FPS with (average)"), html`<input name="fps_with" type="number" min="0" max="5000" step="1" value="${p.fps_with ?? ""}">`, A("วัดในฉากเดียวกันทั้งสองครั้ง", "Measure the same scene both times"))}
      </div>
    </fieldset>
    <fieldset class="fg-box"><legend>${A("รูปภาพ", "Images")}</legend>
      <div class="img-row">
        <img class="img-prev" id="th-prev" src="${thumb(p.slug ? p : { ...p, slug: "new" })}" alt="" width="72" height="72">
        ${field(A("รูปปก (URL)", "Thumbnail URL"), html`<input name="thumbnail_url" id="f-thumb" type="url" value="${p.thumbnail_url || ""}" placeholder="https://">`, A("เว้นว่างไว้เพื่อใช้ภาพพิกเซลอัตโนมัติ", "Leave empty to use the generated pixel thumbnail"))}
        <label class="btn btn-sec btn-sm upl">${icon("upload")} ${A("อัปโหลด", "Upload")}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-upload="f-thumb" hidden></label>
      </div>
      ${field(t("gallery"), html`<textarea name="images" id="f-imgs" rows="3" placeholder="https://… (${A("บรรทัดละรูป", "one per line")})">${(p.images || []).join("\n")}</textarea>`)}
      <label class="btn btn-sec btn-sm upl">${icon("upload")} ${A("อัปโหลดภาพตัวอย่าง", "Upload screenshot")}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-upload="f-imgs" hidden></label>
      <div class="fgrid">${field(t("before") + " (URL)", html`<input name="before_url" type="url" value="${p.before_url || ""}">`)}${field(t("after") + " (URL)", html`<input name="after_url" type="url" value="${p.after_url || ""}">`)}</div>
    </fieldset>
    <div class="checks">
      <label class="chk"><input type="checkbox" name="is_sample"${p.is_sample ? raw(" checked") : ""}> ${A("เป็นข้อมูลตัวอย่าง (แสดงป้าย “ตัวอย่าง”)", "Sample data (shows a “Sample” badge)")}</label>
      <label class="chk"><input type="checkbox" name="link_broken"${p.link_broken ? raw(" checked") : ""}> ${A("ลิงก์เสีย (แสดงคำเตือนในหน้าแพ็ก)", "Link broken (shows a warning on the pack page)")}</label>
    </div>
    <div class="form-bar"><a class="btn btn-ghost" href="${back}">${t("cancel")}</a><button class="btn btn-pri">${t("save")}</button></div>
  </form>`;
}

// ---------- Reports ----------
async function reportsTab() {
  const { data, error } = await sb.from("reports").select("id,pack_id,reason,note,status,created_at,profiles(display_name)").order("status").order("created_at", { ascending: false }).limit(200);
  if (error) return html`<p class="note note-bad">${t("errLoad")}</p>`;
  if (!data.length) return html`<div class="empty">${icon("flag", "empty-i")}<h3>${A("ยังไม่มีรายงาน", "No reports")}</h3></div>`;
  return html`<div class="adm-h"><h2>${A("รายงานปัญหา", "Reports")}</h2></div><ul class="adm-list">${data.map((r) => {
    const p = state.packs.find((x) => x.id === r.pack_id);
    return html`<li class="adm-item${r.status === "resolved" ? " done" : ""}">
      <div><p><b>${t("reason." + r.reason)}</b> · ${p ? html`<a href="/pack/${p.slug}">${p.name}</a>` : "#" + r.pack_id}</p>
      ${r.note ? html`<p class="muted">${r.note}</p>` : ""}<p class="small muted">${r.profiles?.display_name || A("ไม่ระบุชื่อ", "Anonymous")} · ${timeAgo(r.created_at)}</p></div>
      <div class="row-btns">${p && !p.link_broken && r.reason === "broken-link" ? html`<button type="button" class="btn btn-sec btn-sm" data-adm="mark-broken" data-id="${p.id}">${A("ติดป้ายลิงก์เสีย", "Flag link broken")}</button>` : ""}
      ${r.status === "open" ? html`<button type="button" class="btn btn-pri btn-sm" data-adm="resolve" data-id="${r.id}">${icon("check")} ${A("แก้แล้ว", "Resolve")}</button>` : html`<span class="st st-published">${A("แก้แล้ว", "Resolved")}</span>`}</div>
    </li>`; })}</ul>`;
}

// ---------- Comments ----------
async function commentsTab() {
  const { data, error } = await sb.from("comments").select("id,pack_id,body,created_at,profiles(display_name)").order("created_at", { ascending: false }).limit(100);
  if (error) return html`<p class="note note-bad">${t("errLoad")}</p>`;
  if (!data.length) return html`<div class="empty">${icon("chat", "empty-i")}<h3>${t("noComments")}</h3></div>`;
  return html`<div class="adm-h"><h2>${A("ความคิดเห็นล่าสุด", "Latest comments")}</h2></div><ul class="adm-list">${data.map((c) => {
    const p = state.packs.find((x) => x.id === c.pack_id);
    return html`<li class="adm-item"><div><p><b>${c.profiles?.display_name || "—"}</b> · ${p ? html`<a href="/pack/${p.slug}">${p.name}</a>` : ""} · <span class="muted">${timeAgo(c.created_at)}</span></p><p>${c.body}</p></div>
      <button type="button" class="ibtn ibtn-bad" data-adm="del-comment" data-id="${c.id}" aria-label="${t("del")}">${icon("trash")}</button></li>`; })}</ul>`;
}

// ---------- Tutorials ----------
function tutorialsTab() {
  return html`<div class="adm-h"><h2>${A("บทสอน", "Tutorials")}</h2><a class="btn btn-pri btn-sm" href="/admin/tutorials/new">${icon("plus")} ${A("เพิ่มบทสอน", "Add tutorial")}</a></div>
  <ul class="adm-list">${state.tutorials.map((x) => html`<li class="adm-item"><div><p><b>${x.title}</b> ${x.published ? "" : html`<span class="st st-draft">${A("ฉบับร่าง", "Draft")}</span>`}</p><p class="muted">${x.summary}</p></div>
    <div class="row-btns"><a class="ibtn" href="/admin/tutorials/${x.id}" aria-label="${t("edit")}">${icon("edit")}</a><button type="button" class="ibtn ibtn-bad" data-adm="del-tut" data-id="${x.id}" aria-label="${t("del")}">${icon("trash")}</button></div></li>`)}</ul>`;
}
function tutorialForm(id) {
  const isNew = id === "new", x = isNew ? { published: false } : state.tutorials.find((y) => String(y.id) === String(id));
  if (!x) return html`<p class="note note-bad">${t("notFound")}</p>`;
  return html`<div class="adm-h"><h2>${isNew ? A("บทสอนใหม่", "New tutorial") : x.title}</h2><a class="lnk" href="/admin/tutorials">${icon("left")} ${A("กลับ", "Back")}</a></div>
  <form class="form adm-form" data-form="adm-tut" data-id="${isNew ? "" : x.id}">
    ${field(A("ชื่อเรื่อง", "Title"), html`<input name="title" value="${x.title || ""}" required maxlength="120">`)}
    ${field("Slug", html`<input name="slug" value="${x.slug || ""}" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="${A("สร้างจากชื่ออัตโนมัติ", "auto from title")}">`)}
    ${field(A("คำอธิบายสั้น", "Summary"), html`<input name="summary" value="${x.summary || ""}" maxlength="200">`)}
    ${field(A("เนื้อหา", "Body"), html`<textarea name="body" rows="14">${x.body || ""}</textarea>`, A("รองรับ ## หัวข้อ, 1. ขั้นตอน, - รายการ, **ตัวหนา**, `โค้ด`", "Supports ## headings, 1. steps, - lists, **bold**, `code`"))}
    <label class="chk"><input type="checkbox" name="published"${x.published ? raw(" checked") : ""}> ${A("เผยแพร่", "Published")}</label>
    <div class="form-bar"><a class="btn btn-ghost" href="/admin/tutorials">${t("cancel")}</a><button class="btn btn-pri">${t("save")}</button></div>
  </form>`;
}

// ---------- Pages ----------
async function pagesTab(slug) {
  if (!PAGE_SLUGS.includes(slug)) slug = "about";
  const { data } = await sb.from("pages").select("*").eq("slug", slug).maybeSingle();
  const pg = data || { slug, title: t("page." + slug), body: "" };
  return html`<div class="adm-h"><h2>${A("หน้าข้อมูล", "Pages")}</h2></div>
  <nav class="seg-nav">${PAGE_SLUGS.map((s) => html`<a href="/admin/pages/${s}"${s === slug ? raw(' aria-current="page"') : ""}>${t("page." + s)}</a>`)}</nav>
  <form class="form adm-form" data-form="adm-page" data-slug="${slug}">
    <p class="small muted">${A("เขียน ## หัวข้อ (ขึ้นในสารบัญด้านข้าง), - รายการ, 1. ขั้นตอน, **ตัวหนา**, [ลิงก์](https://…) และ > กล่องข้อความเน้น วันที่อัปเดตล่าสุดแสดงให้อัตโนมัติ ไม่ต้องพิมพ์เอง", "Use ## headings (listed in the side contents), - lists, 1. steps, **bold**, [links](https://…) and > for a highlighted note. The last-updated date is shown automatically.")}</p>
    <div class="fgrid fgrid-lang">
      <fieldset class="fg-box"><legend>ภาษาไทย</legend>
        ${field(A("หัวข้อ", "Title"), html`<input name="title" value="${pg.title}" required>`)}
        ${field(A("เนื้อหา", "Body"), html`<textarea name="body" rows="22">${pg.body}</textarea>`)}
      </fieldset>
      <fieldset class="fg-box"><legend>English</legend>
        ${field(A("หัวข้อ", "Title"), html`<input name="title_en" value="${pg.title_en || ""}">`)}
        ${field(A("เนื้อหา", "Body"), html`<textarea name="body_en" rows="22">${pg.body_en || ""}</textarea>`, A("เว้นว่างได้ หน้าจะใช้ภาษาไทยแทน", "Optional. The Thai version is shown when empty."))}
      </fieldset>
    </div>
    <div class="form-bar"><a class="btn btn-ghost" href="/p/${slug}" target="_blank">${icon("eye")} ${A("ดูหน้า", "View page")}</a><button class="btn btn-pri">${t("save")}</button></div>
  </form>`;
}

// ---------- Users ----------
async function usersTab() {
  const { data, error } = await sb.from("profiles").select("id,display_name,role,created_at").order("created_at", { ascending: false }).limit(500);
  if (error) return html`<p class="note note-bad">${t("errLoad")}</p>`;
  return html`<div class="adm-h"><h2>${A("ผู้ใช้", "Users")} <span class="count-b">${data.length}</span></h2></div>
  <div class="tbl-w"><table class="tbl"><thead><tr><th>${t("displayName")}</th><th>${A("สมัครเมื่อ", "Joined")}</th><th>${A("สิทธิ์", "Role")}</th></tr></thead>
  <tbody>${data.map((u) => html`<tr><td>${u.display_name || "—"}${u.id === state.user.id ? html` <span class="badge">${A("คุณ", "you")}</span>` : ""}</td><td>${fmtDate(u.created_at)}</td>
    <td>${u.id === state.user.id ? u.role : html`<select data-role="${u.id}" aria-label="${A("สิทธิ์", "Role")}">${["user", "admin"].map((r) => html`<option${u.role === r ? raw(" selected") : ""}>${r}</option>`)}</select>`}</td></tr>`)}</tbody></table></div>`;
}

// ---------- Modrinth import ----------
async function fillFromModrinth(btn) {
  const f = btn.closest("form"), ref = MR.parseRef($("#mr-ref")?.value);
  if (!ref) { toast(A("ใส่ลิงก์ modrinth.com หรือ slug ของโปรเจกต์", "Enter a modrinth.com link or project slug"), "bad"); $("#mr-ref")?.focus(); return; }
  const editing = !!f.dataset.id;
  if (editing && !confirm(A("แทนที่ข้อมูลในฟอร์มด้วยข้อมูลจาก Modrinth? คะแนนและวันที่ทดสอบจะไม่ถูกแตะ", "Replace the form fields with Modrinth data? Score and test date are left alone."))) return;
  btn.disabled = true;
  try {
    const d = await MR.toPackDraft($("#mr-ref").value, MR.typeFromUrl($("#mr-ref").value));
    if (!d) { toast(A("ไม่พบโปรเจกต์นี้บน Modrinth", "No such project on Modrinth"), "bad"); return; }
    for (const [k, v] of Object.entries(d)) {
      const el = f.elements[k]; if (!el || v === "" || v == null) continue;
      if (k === "slug" && editing) continue; // keep existing URLs stable
      el.value = Array.isArray(v) ? v.join(k === "images" ? "\n" : ", ") : v;
    }
    const pv = $("#th-prev"); if (pv && d.thumbnail_url) pv.src = d.thumbnail_url;
    toast(A(`ดึงข้อมูล ${d.name} แล้ว ตรวจทานก่อนบันทึก`, `Fetched ${d.name}. Review before saving.`));
  } catch (e) { toast(t("mr.errT"), "bad"); }
  finally { btn.disabled = false; }
}

// ---------- Behaviour ----------
let bound = false;
function mount() {
  if (bound) return; bound = true;
  document.addEventListener("click", async (ev) => {
    const b = ev.target.closest("[data-adm]"); if (!b) return;
    const id = +b.dataset.id, act = b.dataset.adm;
    if (act === "mr-fetch") { await fillFromModrinth(b); return; }
    const run = async (q, msg) => { const { error } = await q; if (error) { toast(t("errGeneric"), "bad"); return false; } if (msg) toast(msg); return true; };
    if (act === "del-pack" && confirm(t("confirmDel")) && await run(sb.from("packs").delete().eq("id", id), A("ลบแล้ว", "Deleted"))) { await loadCatalog(); refresh(); }
    if (act === "resolve" && await run(sb.from("reports").update({ status: "resolved" }).eq("id", id))) refresh();
    if (act === "mark-broken" && await run(sb.from("packs").update({ link_broken: true }).eq("id", id), A("ติดป้ายแล้ว", "Flagged"))) { await loadCatalog(); refresh(); }
    if (act === "del-comment" && confirm(t("confirmDel")) && await run(sb.from("comments").delete().eq("id", id))) refresh();
    if (act === "del-tut" && confirm(t("confirmDel")) && await run(sb.from("tutorials").delete().eq("id", id))) { await loadCatalog(); refresh(); }
  });
  document.addEventListener("change", async (ev) => {
    const el = ev.target;
    if (el.dataset.role) {
      const { error } = await sb.from("profiles").update({ role: el.value }).eq("id", el.dataset.role);
      toast(error ? t("errGeneric") : t("saved_"), error ? "bad" : "ok");
    }
    if (el.dataset.upload) {
      const f = el.files?.[0]; if (!f) return;
      if (f.size > 3 * 1024 * 1024) { toast(A("ไฟล์ใหญ่เกิน 3 MB", "File is larger than 3 MB"), "bad"); return; }
      const slug = slugify($("[name=slug]")?.value || $("[name=name]")?.value || "pack");
      const path = `${slug}/${Date.now()}.${(f.name.split(".").pop() || "png").toLowerCase()}`;
      toast(A("กำลังอัปโหลด…", "Uploading…"));
      const { error } = await sb.storage.from("pack-images").upload(path, f, { contentType: f.type, upsert: false });
      if (error) { toast(t("errGeneric"), "bad"); return; }
      const url = sb.storage.from("pack-images").getPublicUrl(path).data.publicUrl;
      const target = document.getElementById(el.dataset.upload);
      if (target.tagName === "TEXTAREA") target.value = (target.value.trim() ? target.value.trim() + "\n" : "") + url;
      else { target.value = url; const pv = $("#th-prev"); if (pv) pv.src = url; }
      el.value = ""; toast(A("อัปโหลดแล้ว", "Uploaded"));
    }
  });
}
const refresh = () => window.dispatchEvent(new Event("nyxie:route"));

export async function onSubmit(kind, f, fd) {
  const s = (k) => String(fd.get(k) ?? "").trim();
  const lines = (k) => s(k).split(/\s*\n\s*/).map((x) => x.replace(/^[-*•]\s*/, "").slice(0, 200)).filter(Boolean).slice(0, 12);
  if (kind === "adm-pack") {
    const row = {
      name: s("name"), slug: s("slug") || slugify(s("name")), type: s("type"), status: s("status"), creator: s("creator"), source_url: s("source_url"),
      score: s("score") === "" ? null : +s("score"), checked_at: s("checked_at") || null, versions: s("versions").split(/[,\s]+/).filter(Boolean),
      platform: s("platform"), perf: s("perf"), resolution: s("resolution") || null, style: s("style") || null, category: s("category") || null,
      requirements: s("requirements"), license: s("license"), file_size: s("file_size"), summary: s("summary"), description: s("description"),
      install_steps: s("install_steps"), thumbnail_url: s("thumbnail_url") || null, images: s("images").split(/\s*\n\s*/).filter(Boolean),
      review: s("review"), pros: lines("pros"), cons: lines("cons"), test_rig: s("test_rig"), test_setup: s("test_setup"),
      fps_base: s("fps_base") === "" ? null : Math.round(+s("fps_base")), fps_with: s("fps_with") === "" ? null : Math.round(+s("fps_with")),
      before_url: s("before_url") || null, after_url: s("after_url") || null, is_sample: fd.get("is_sample") === "on", link_broken: fd.get("link_broken") === "on",
    };
    const id = f.dataset.id;
    const { data, error } = id ? await sb.from("packs").update(row).eq("id", +id).select("id").single() : await sb.from("packs").insert(row).select("id").single();
    if (error) { toast(error.code === "23505" ? A("Slug นี้ถูกใช้แล้ว", "That slug is already used") : error.message, "bad"); return; }
    await loadCatalog(); toast(t("saved_")); go(packsHref(row.type));
    return data;
  }
  if (kind === "adm-tut") {
    const row = { title: s("title"), slug: s("slug") || slugify(s("title")), summary: s("summary"), body: String(fd.get("body") || ""), published: fd.get("published") === "on" };
    const id = f.dataset.id;
    const { error } = id ? await sb.from("tutorials").update(row).eq("id", +id) : await sb.from("tutorials").insert(row);
    if (error) { toast(error.code === "23505" ? A("Slug นี้ถูกใช้แล้ว", "That slug is already used") : error.message, "bad"); return; }
    await loadCatalog(); toast(t("saved_")); go("/admin/tutorials");
  }
  if (kind === "adm-page") {
    const { error } = await sb.from("pages").upsert({ slug: f.dataset.slug, title: s("title"), body: String(fd.get("body") || ""), title_en: s("title_en"), body_en: String(fd.get("body_en") || "") });
    if (error) { toast(error.message, "bad"); return; }
    toast(t("saved_"));
  }
}
