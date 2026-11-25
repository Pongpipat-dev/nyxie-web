# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

- Static HTML, CSS and JavaScript ES modules with no build step: `index.html`, `assets/css/`, `assets/js/`. Path routing with the History API (`/`, `/resource-packs`, `/pack/<slug>`, `/search?q=`, `/admin`, …); the host must serve the site at a domain root.
- `node scripts/build.mjs` (with `SITE_URL`) writes `dist/`: a prerendered HTML file per public page, `sitemap.xml`, `robots.txt`, `404.html` and `_redirects`. Packs without a team review (score or test date plus the review text), empty tutorials and browser-only routes (search, Modrinth, account, admin) are noindex.
- **Supabase** (project `nyxie`, ref `tztoxyryicyupucgrigr`, region ap-southeast-1, free plan) handles auth (email and password), the Postgres data with row-level security, and the `pack-images` storage bucket.
- `supabase-js` loads from the jsDelivr CDN at a pinned version.
- Hosting target not decided.

## Users

- **Minecraft players** on Java and Bedrock, mostly Thai, who want a texture pack, shader, mod or map that works for their version and PC. They don't want to gamble on random downloads.
- **Nyxie team / admins**, who add and edit packs, record test results, handle broken-link reports, moderate comments, and edit tutorials and policy pages.

## Product Purpose

Nyxie is an independent site for discovering and reviewing Minecraft resources. The team installs and tests every pack before listing it, then gives it a Nyxie score out of 10. Downloads always go to the creator's original page. Success means a player finds a pack that fits their setup and trusts the recommendation enough to download it.

## Positioning

Tested by the Nyxie team, and checked against your setup. Every pack shows its version, platform, performance weight, requirements, license and the date it was last checked. My Setup then tells each player whether the pack will run well on their machine.

## Operating Context

- **My Setup:** a player picks edition, Minecraft version and PC power once. Every list, search result and pack page then shows a fit verdict: fits, heavy for your PC, or won't run. The setup is stored on the device and synced to the profile when signed in.
- **Global search** covers every type and tutorial, with results grouped by type.
- Browse by type (Resource Packs, Shaders, Mods, Maps). Filter by version, platform, resolution, style, category and "fits my setup". Sort by score, popularity or recently checked.
- **Pack page:** Nyxie team review (review text, pros and cons, test PC, version and settings, FPS without and with the pack), gallery, optional before/after compare, score, specs, install steps, a download that goes through a leave-site notice to the creator's page, likes, bookmarks, comments and "report a problem".
- Also: Top 10, Tutorials, Saved packs, policy pages (About, Contact, Privacy, Cookies, Terms, Download Safety).
- **Admin:** packs CRUD with image upload, reports queue, comment moderation, tutorials, pages and user roles.
- Removed on 2026-11-21 at the user's request: the Tools page, the Blog, the hero background picker, and the placeholder AdSense setup and cookie banner (the ad ID was a dummy).

## Capabilities and Constraints

- UI languages: Thai and English. Japanese and Chinese strings from v1 were dropped. Pack content is single-language.
- Light and dark theme.
- Roles: `user`, `admin`. Only admins can change roles; the first admin is promoted by SQL in the Supabase dashboard.
- Deleting your own account needs a server function (service role); it is not built yet.

## Brand Commitments

- Name: **Nyxie**. The user chose to start the visual identity fresh (2026-11-21), and nothing from the v1 look is binding.
- Visual direction: the **category standard for mod and pack sites, executed impeccably**, with **Modrinth** as the craft bar (quality level, not a look to copy).
- Contact: nyxieofficial.work@gmail.com. Socials: YouTube, Instagram, TikTok and Threads (`@Nyxie_mc` / `@nyxie_mc`) and Facebook (`nyxie.mcf`). The X account URL is unknown; v1 pointed it at Facebook.
- Required disclaimer: "An independent Minecraft content discovery and review website. Not affiliated with, endorsed by, or connected to Mojang Studios or Microsoft."
- Voice: plain, helpful and honest about limits.

## Evidence on Hand

- The 12 seeded packs and 5 tutorials are **sample data** (`is_sample = true`) with generated pixel thumbnails and no real download links. The UI labels them as samples. Admins replace or delete them.
- Likes, downloads and comments start at zero. Do not invent counts, testimonials or reviews.

## Product Principles

- **Trust comes from showing the testing.** Score, last-checked date, performance weight and requirements sit next to every download.
- **Fit before taste.** Compatibility with the player's setup is visible everywhere a pack appears.
- **Send players to the creator.** Nyxie links to original pages and never rehosts files.
- **Thai and English are equal.** Every UI string exists in both.

## Accessibility & Inclusion

Keyboard-operable controls with visible focus, labelled form controls, WCAG AA contrast in both themes, and reduced motion respected.
