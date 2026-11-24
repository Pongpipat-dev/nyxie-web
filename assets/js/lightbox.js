// Screenshot lightbox: full-screen viewer with prev/next, counter, keyboard and swipe.
import { html, icon } from "./ui.js";
import { t } from "./i18n.js";

let box = null, imgs = [], idx = 0, alt = "";

function build() {
  box = document.createElement("dialog");
  box.className = "lb";
  box.innerHTML = String(html`
    <div class="lb-count" aria-live="polite"></div>
    <button type="button" class="lb-btn lb-x" data-lb="close" aria-label="${t("close")}">${icon("x")}</button>
    <button type="button" class="lb-btn lb-prev" data-lb="prev" aria-label="${t("prev")}">${icon("left")}</button>
    <figure class="lb-fig"><img class="lb-img" alt=""></figure>
    <button type="button" class="lb-btn lb-next" data-lb="next" aria-label="${t("next")}">${icon("right")}</button>`);
  document.body.append(box);

  box.addEventListener("click", (ev) => {
    const b = ev.target.closest("[data-lb]");
    if (b) return b.dataset.lb === "close" ? box.close() : go(b.dataset.lb === "next" ? 1 : -1);
    // Click on the dark area around the image closes the viewer.
    if (!ev.target.closest(".lb-img")) box.close();
  });
  box.addEventListener("keydown", (ev) => {
    if (ev.key === "ArrowRight") { ev.preventDefault(); go(1); }
    else if (ev.key === "ArrowLeft") { ev.preventDefault(); go(-1); }
  });
  let x0 = null;
  box.addEventListener("touchstart", (ev) => { x0 = ev.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", (ev) => {
    if (x0 === null) return;
    const dx = ev.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  });
  box.addEventListener("close", () => { document.documentElement.style.overflow = ""; });
}

function show() {
  const img = box.querySelector(".lb-img");
  img.src = imgs[idx];
  img.alt = `${alt} ${idx + 1}`;
  box.querySelector(".lb-count").textContent = `${idx + 1}/${imgs.length}`;
  const many = imgs.length > 1;
  box.querySelector(".lb-prev").hidden = !many;
  box.querySelector(".lb-next").hidden = !many;
  // Warm the neighbours so swiping feels instant.
  if (many) [1, -1].forEach((d) => { new Image().src = imgs[(idx + d + imgs.length) % imgs.length]; });
}

function go(d) { idx = (idx + d + imgs.length) % imgs.length; show(); }

export function openLightbox(list, start = 0, label = "") {
  if (!list.length) return;
  if (!box) build();
  imgs = list; idx = start; alt = label;
  show();
  document.documentElement.style.overflow = "hidden";
  if (!box.open) box.showModal();
  box.querySelector(imgs.length > 1 ? ".lb-next" : ".lb-x").focus();
}

// Any gallery link marked data-lbi opens the viewer instead of a new tab.
document.addEventListener("click", (ev) => {
  const a = ev.target.closest("a[data-lbi]");
  if (!a || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button !== 0) return;
  const gal = a.closest(".gal");
  const links = [...gal.querySelectorAll("a[data-lbi]")];
  ev.preventDefault();
  openLightbox(links.map((l) => l.getAttribute("href")), links.indexOf(a), gal.dataset.name || "");
});
