---
name: Nyxie
description: Tested Minecraft packs, checked against your setup.
colors:
  night-ink: "#0e1116"
  panel: "#161a22"
  panel-raised: "#1d222c"
  panel-high: "#242a36"
  hairline: "#262c38"
  hairline-strong: "#333b4b"
  text: "#e8ebf2"
  muted: "#9aa3b5"
  faint: "#7a8398"
  violet: "#8f8cff"
  violet-hover: "#a8a6ff"
  fit-green: "#34d399"
  fit-amber: "#fbbf24"
  fit-red: "#f87171"
  light-ground: "#f5f6f9"
  light-panel: "#ffffff"
  light-panel-raised: "#f0f2f6"
  light-panel-high: "#e6e9f0"
  light-hairline: "#e2e5ec"
  light-hairline-strong: "#cfd4df"
  light-text: "#151922"
  light-muted: "#545d70"
  light-faint: "#6b7487"
  light-violet: "#5550e0"
  light-violet-hover: "#4540cc"
  light-fit-green: "#0b8a5f"
  light-fit-amber: "#a8670a"
  light-fit-red: "#cc3b3b"
typography:
  display:
    fontFamily: "Anuphan, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(28px, 3.6vw, 40px)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Anuphan, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(26px, 3vw, 32px)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Anuphan, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Anuphan, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Anuphan, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.06em"
  score:
    fontFamily: "Anuphan, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
rounded:
  tag: "5px"
  sm: "7px"
  md: "10px"
  pill: "99px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "28px"
  section: "40px"
components:
  button-primary:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.night-ink}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.violet-hover}"
  button-secondary:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.panel-high}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
  button-small:
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "34px"
  input:
    backgroundColor: "{colors.night-ink}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "40px"
  pack-row:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.md}"
    padding: "10px 14px 10px 12px"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.md}"
    padding: "20px"
  filter-sidebar:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.md}"
    padding: "16px"
    width: "260px"
  tag:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.muted}"
    rounded: "{rounded.tag}"
    padding: "0 8px"
    height: "22px"
  fit-pill:
    rounded: "{rounded.pill}"
    padding: "0 10px 0 8px"
    height: "26px"
  chip:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0 10px 0 12px"
    height: "30px"
  setup-chip:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "36px"
  top-bar:
    height: "64px"
---

# Design System: Nyxie

## Overview

**Creative North Star: "The Tested Shelf"**

Nyxie is the category standard for mod and pack sites played straight: a dark marketplace shell, a filter sidebar, and ranked list rows, held to Modrinth's level of craft. Every surface is a flat panel on night ink, separated by hairlines rather than shadows. The density is that of a working catalog: rows carry a thumbnail, name and creator, summary, tags, the fit verdict, the score and the download, and nothing decorative competes with them.

Colour is spent on meaning. One violet carries actions, selection and focus; green, amber and red are reserved for the fit verdict and its echoes (setup set, errors, warnings). The one place the world's subject shows through is the pack thumbnail itself: generated 16x16 pixel art rendered crisp at any size. The chrome never imitates Minecraft; it refuses both the neon gamer glow and the pixel-font costume.

A mirrored light theme swaps every token one for one, keeping roles, radii and structure identical.

**Key Characteristics:**
- Night-ink ground with two raised panel tones and hairline borders; flat at rest.
- A single violet accent for action, selection and focus.
- The fit pill as the signature: a green/amber/red verdict driven live by My Setup, dashed "Check fit" when no setup is saved.
- One family, Anuphan, at 400 to 700, with tabular figures for every score and count.
- Pixel-art thumbnails as the only place Minecraft's look appears.

## Colors

A cool, near-neutral night palette with one violet voice and three semantic verdict colours, each paired with a 13–14% tint for its soft background.

### Primary
- **Night Violet** (violet; light theme light-violet): primary buttons, links, active filter counts, selected options, focus rings, the top-3 rank numerals, score meters, and text selection. Hover moves to the brighter violet-hover (darker in light theme). Ink on violet is night-ink in dark, white in light.

### Semantic (fit states)
- **Fits Green** (fit-green): the "fits" pill, the saved-setup check, the "fits my setup" switch when on, published status, last-checked check marks.
- **Heavy Amber** (fit-amber): the "heavy for your PC" pill and warning notes and toasts.
- **Won't-Run Red** (fit-red): the "won't run" pill, errors, destructive hovers, the reports count in admin.

Each appears as text on its own soft tint (the colour at 13% alpha in dark, about 10% in light) and never as a solid fill, except the warning and error toasts.

### Neutral
- **Night Ink** (night-ink): page ground, input fields, segmented-control wells.
- **Panel** (panel): rows, sidebar, panels, menus, dialogs, footer.
- **Raised Panel** (panel-raised): hover fills, secondary buttons, tags, current nav item.
- **High Panel** (panel-high): badges, count bubbles, meter tracks, selected segment.
- **Hairline** (hairline) and **Strong Hairline** (hairline-strong): resting borders and dividers; the stronger one for inputs, hover borders, menus and dashed prompts.
- **Text** (text), **Muted** (muted), **Faint** (faint): body copy, secondary meta, placeholders and search icons.

### Named Rules
**The One Violet Rule.** Violet is the only non-semantic hue in the chrome. It marks what you can act on or what is selected; it is never a decorative fill, gradient or glow.

**The Verdict Colours Rule.** Green, amber and red mean fits, heavy and won't run (and by extension ok, warning, error). They are never used as category or decoration colours.

## Typography

**Display Font:** Anuphan (with system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Anuphan (same stack)
**Label/Mono Font:** Anuphan for labels; ui-monospace, Cascadia Code, Consolas only for inline code in prose.

**Character:** A single Thai-and-Latin sans at four weights. Hierarchy comes from size and weight steps, not from a second family, so Thai and English sit equally on every surface.

### Hierarchy
- **Display** (700, clamp(28px, 3.6vw, 40px), 1.25, -0.02em): the home intro heading only, max 20ch.
- **Headline** (700, clamp(26px, 3vw, 32px) on list pages, up to 34px on the pack page, 36px on articles): page titles.
- **Title** (700, 17–20px): section heads at 20px, row and empty-state titles at 17px, panel heads at 16px, dialog heads at 19px.
- **Body** (400, 15px, 1.55): default copy. Prose runs 15.5px at 1.7 with a 72ch article measure; leads are 16–16.5px muted at 60ch.
- **Label** (700, 12px, 0.06em, uppercase): filter group summaries, table column heads and footer column heads only.
- **Score** (700, 22px in rows, 48px on the pack page, tight negative tracking, tabular figures) with a muted "/10".

### Named Rules
**The Tabular Figures Rule.** Every score, count, rank, download number and date-in-a-row uses tabular numerals so columns of rows align.

**The Weight Ceiling Rule.** Weights stop at 700; UI text sits at 500–600, body at 400.

## Layout

A centred 1240px container with a fluid gutter of clamp(16px, 3vw, 32px). The 64px top bar is sticky with a translucent night-ink backdrop and a hairline underneath; it holds the logo, the type links, Top 10 and Tutorials, a centred search (max 340px) with a "/" hint, the setup chip and the account control.

List pages use a 260px filter sidebar beside a fluid main column with 28px between them. The main column is a results bar (count plus sort), removable filter chips, then a 10px-gap stack of pack rows. The pack page runs a 120px thumbnail header, then a main column with a sticky 320px side column for score, fit and facts. Admin uses a 220px sticky nav beside its tables.

Spacing works on a small rhythm of 6, 8, 12, 16 and 28px within components, with 40px between page sections and 64px at the foot of main.

Breakpoints: at 1180px the nav tightens; at 1020px the nav collapses into a drawer and two-column layouts stack (the pack page side column moves above the content as a two-up grid); at 860px the filter sidebar hides behind a Filters button; at 680px the top bar drops to 58px, search becomes an icon, rows drop to a 64px thumbnail with the side cluster moved under a hairline, and summaries clamp to two lines.

## Elevation & Depth

Flat by default. Depth comes from tonal layering (night ink, panel, raised panel, high panel) and hairline borders. Hover is a border step and a slight panel lift in tone, never a shadow.

### Shadow Vocabulary
- **Pop** (`box-shadow: 0 12px 32px rgb(0 0 0 / .45), 0 2px 6px rgb(0 0 0 / .3)`; light theme `0 12px 32px rgb(20 25 40 / .16), 0 2px 6px rgb(20 25 40 / .08)`): search results popover, account menu, dialogs and toasts.

### Named Rules
**The Floating-Only Shadow Rule.** A shadow means the element floats above the page (menu, popover, dialog, toast). Rows, panels, cards and buttons never carry one.

## Shapes

Gently rounded, consistent corners: 10px for every container (rows, panels, sidebar, dialogs, menus, thumbnails, galleries), 7px for controls (buttons, inputs, nav items, menu items, filter options), 5px for tags and badges, fully round (99px) for pills, chips, the setup chip and count bubbles, and circles for avatars. Focus outlines round at 4px. Borders are always 1px hairlines; dashed hairlines mark an invitation to act (setup chip with no setup, "Check fit" pill, setup nudge, empty states). Pixel thumbnails render with crisp edges inside their rounded frame.

## Components

### Buttons
Compact and solid; the action reads before the decoration.
- **Shape:** gently rounded (7px), 40px tall, 600 weight at 14.5px, 8px icon gap.
- **Primary:** violet fill with ink text; the row Download and every main action.
- **Hover / Focus:** primary brightens to violet-hover; secondary steps from raised to high panel with a stronger hairline; all buttons press down 1px on active; focus is a 2px violet outline at 2px offset.
- **Secondary:** raised panel with hairline border; toggled state (like, bookmark) turns violet text on violet tint.
- **Ghost:** transparent, muted text, raised panel on hover.
- **Sizes:** small 34px (rows), large 48px; square icon buttons 36px.

### Chips
- **Filter chips:** 30px pills on panel with a strong hairline and an x icon; hover turns the border and icon red to signal removal.
- **Tags:** 22px, 5px corners, raised panel, muted 12.5px 600 text: version, platform, resolution, style.
- **Badges:** 20px, 11.5px 600, high panel; a violet-tint variant for emphasis and a red-tint variant for problems.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** panel on night ink.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px hairline; strong hairline on hover.
- **Internal Padding:** 20px panels, 16px sidebar, 22px dialogs and the setup card.

### Inputs / Fields
- **Style:** night-ink fill, 1px strong hairline, 7px corners, 40px minimum height, faint placeholder; custom chevron on selects.
- **Focus:** border turns violet with a 3px violet-tint ring.
- **Checkboxes and radios:** native, 16px, violet accent colour.
- **Segmented control:** two-up well on night ink; the selected segment lifts to high panel.
- **Switch:** 36x20 track, turning fit-green when on.

### Navigation
- **Top bar links:** 14px 600 muted, 7px corners; hover lifts to panel, current page sits on raised panel in full text colour.
- **Setup chip:** dashed muted pill reading "Set your setup" until saved, then a solid hairline pill on panel with a green check.
- **Search popover:** panel, strong hairline, pop shadow; 36px thumbnail rows with fit pill and score, then a violet "all results" link.
- **Mobile:** nav moves to a drawer under the bar; current item on raised panel.

### Pack Row (signature)
The core list unit. A 10px-cornered panel row in three columns: an 84px pixel thumbnail, the main stack (17px 700 title that turns violet on hover, muted "by creator · type" line, one-line summary, tags), and a right cluster at least 210px wide with the fit pill and score on top and last-checked, downloads, bookmark and a small primary Download below. The whole row is the link to the pack. Ranked lists add a 34px rank column, with ranks 1 to 3 in violet.

### Fit Pill (signature)
A 26px pill (30px on the pack page) with a check, alert or x icon and a short verdict, coloured fits green, heavy amber or won't-run red on its own soft tint. With no saved setup it becomes a dashed, muted "Check fit" button that opens the setup dialog; on the pack page the fit panel takes a border tinted toward the verdict colour.

### Filter Sidebar
A 260px panel of collapsible groups. Each group head is the uppercase label style with a violet count bubble for active selections and a chevron that rotates closed. Options are checkbox rows (multi-select) with a raised-panel hover; the "fits my setup" switch and a dashed setup nudge sit above the groups.

## Do's and Don'ts

### Do:
- **Do** keep every container flat on night ink with a 1px hairline and 10px corners.
- **Do** spend violet only on actions, selection, links and focus.
- **Do** show the fit pill (or the dashed "Check fit" pill) wherever a pack appears.
- **Do** set scores, counts, ranks and dates in tabular figures.
- **Do** mirror every new token in the light theme under the same role.
- **Do** use dashed hairlines only for an invitation to act or an empty state.

### Don't:
- **Don't** add shadows to rows, panels or buttons; shadows belong to menus, popovers, dialogs and toasts.
- **Don't** use green, amber or red for anything but fit and status meaning.
- **Don't** add neon glows, gradients on chrome, or pixel and blocky display fonts; the Minecraft look stays inside the thumbnails.
- **Don't** introduce a second type family for headings.
- **Don't** put uppercase tracked labels above headings; the label style is for filter groups, table heads and footer heads only.
