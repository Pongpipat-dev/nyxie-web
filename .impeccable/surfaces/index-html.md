---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Nyxie site (all routes)

Scope: the whole public site plus admin. Visitor mode: Operate (find, judge and download a pack); home leans discovery but uses the same shell.

Audience and job: Minecraft players on Java/Bedrock, mostly Thai, choosing a pack that fits their version and PC. Admins add packs, check reports and moderate comments.

Constraints: static HTML/CSS/JS ES modules, no build step; Supabase for auth and data; TH/EN UI; packs seeded as labelled samples.

Memorable moment: set your setup once, and every row tells you whether the pack fits.

## Direction contract

THESIS: The category standard (dark marketplace shell, filter sidebar, ranked list rows) played straight at Modrinth's level of craft. It refuses the neon gamer glow and the pixel-font Minecraft costume.

OWN-WORLD: Night-ink ground #0e1116, raised panels #161a22 and #1d222c, hairlines #262c38. Text is #e8ebf2 with muted #9aa3b5. One violet accent #8f8cff for actions, selection and focus. Fit states: green #34d399, amber #fbbf24, red #f87171. Anuphan at 400–700 throughout, with tabular figures for scores and counts. 10px radii, flat panels, shadows only on floating menus. A mirrored light theme.

STORY: Set your setup once (edition, version, PC), then search everything or browse a type. Read the fit pill and Nyxie score on each row, open a pack and check the test facts, then download through the creator's page.

FIRST VIEWPORT: A 64px top bar with the logo, the four type links, Top 10 and Tutorials, then the global search centred in the space between the nav and the right-hand controls (amended after the finish review: the six nav links plus the logo need about 580px, more than half the content width, so a page-centred search would overlap the nav), then the setup chip and sign-in. List pages have a 260px filter sidebar and a main column of 112px rows: thumbnail, name and creator, summary, tags, fit pill, score, then downloads and a Download button on the right. Home opens on search plus a setup prompt, then "Best for your setup" rows.

FORM: The standing exit (category canon) chosen by the user, with Modrinth as the craft bar. seed:587205b2263e78fc. Signature move: the fit pill, driven live by My Setup.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
