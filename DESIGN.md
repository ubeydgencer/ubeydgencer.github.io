---
name: Ubeyd Gencer — Referans Kılavuzu
description: A boxed-software reference manual — full-saturation divider board under a milk-acetate leaf whose alpha is solved at runtime for a fixed reading luminance.
colors:
  h-yellow: "#E9A81C"
  h-orange: "#B94F14"
  h-grass: "#3C7429"
  h-teal: "#0F7176"
  h-ultra: "#1C4A9E"
  h-violet: "#64499A"
  h-sienna: "#78381D"
  h-vermilion: "#C42208"
  leaf: "rgb(246 241 230)"
  leaf-dark: "rgb(20 18 16)"
  ink: "#17150F"
  ink-dark: "#EFE9DA"
  ink-2: "#57503F"
  ink-2-dark: "#A79C84"
  rule: "#ADA189"
  rule-dark: "#45403A"
  rule-strong: "#8A7E68"
  rule-strong-dark: "#6B6355"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 9vw, 5.75rem)"
    lineHeight: 0.94
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 76, 'wght' 800"
  display-sm:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 6vw, 3.5rem)"
    lineHeight: 0.94
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 76, 'wght' 800"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    lineHeight: 1.25
    letterSpacing: "-0.005em"
    fontVariation: "'wdth' 90, 'wght' 700"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.75rem"
    lineHeight: 1.35
    letterSpacing: "0.12em"
    fontVariation: "'wdth' 88, 'wght' 700"
  subtitle:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontVariation: "'wdth' 90, 'wght' 600"
  body:
    fontFamily: "EB Garamond, Georgia, 'Times New Roman', serif"
    fontSize: "1.0625rem"
    lineHeight: 1.5294
    fontWeight: 400
  lede:
    fontFamily: "EB Garamond, Georgia, 'Times New Roman', serif"
    fontSize: "1.1875rem"
    lineHeight: 1.5
    fontWeight: 400
  label:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.625rem"
    letterSpacing: "0.14em"
    fontWeight: 400
    fontFeature: "tabular-nums"
  label-sm:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.5625rem"
    letterSpacing: "0.14em"
    fontWeight: 400
    fontFeature: "tabular-nums"
  spine:
    fontFamily: "Azeret Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.5625rem"
    letterSpacing: "0.22em"
    fontWeight: 400
rounded:
  hairline: "1px"
  slip: "2px"
  tab: "3px"
  leaf: "1px 3px 3px 1px"
  punch: "50%"
spacing:
  gutter: "clamp(1.25rem, 3.2vw, 2.75rem)"
  board-gutter: "clamp(0.5rem, 2.4vw, 2.25rem)"
  rail-w: "clamp(2.25rem, 4.4vw, 3.25rem)"
  bind-w: "clamp(1.75rem, 3.4vw, 2.75rem)"
  leaf-margin: "clamp(1.25rem, 3.5vh, 2.75rem)"
  leaf-pad-y: "clamp(1.5rem, 4vw, 3.25rem)"
  leaf-pad-x: "clamp(1.25rem, 3.5vw, 3rem)"
  row-gap: "clamp(1.75rem, 4vh, 3rem)"
components:
  tab:
    backgroundColor: "{colors.h-orange}"
    textColor: "#ffffff"
    typography: "{typography.label-sm}"
    rounded: "0 3px 3px 0"
    padding: "0.75rem 0"
    width: "100%"
  tab-current:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    rounded: "0 3px 3px 0"
    padding: "0.75rem 0"
  tab-yellow:
    backgroundColor: "{colors.h-yellow}"
    textColor: "{colors.ink}"
  lever-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.hairline}"
    padding: "0.4rem 0.7rem"
  lever-button-pressed:
    backgroundColor: "{colors.h-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hairline}"
    padding: "0.4rem 0.7rem"
  ctl:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.slip}"
    padding: "0.34rem 0.55rem"
  panel:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    rounded: "{rounded.slip}"
    padding: "0.85rem 1rem 0.35rem"
  window:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    rounded: "{rounded.slip}"
    padding: "0.75rem 0.75rem 0.75rem 1.65rem"
  window-thumb:
    backgroundColor: "{colors.leaf}"
    rounded: "{rounded.slip}"
    padding: "0.4rem 0.4rem 0.4rem 1.05rem"
  errata:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.hairline}"
    padding: "0.24rem 0.5rem 0.26rem"
  jump:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0 0 0.12rem"
  spec-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.label-sm}"
    padding: "0 0 0.1rem"
  mark:
    backgroundColor: "{colors.leaf}"
    rounded: "{rounded.hairline}"
    padding: "1px"
    size: "1.05rem"
---

# Design System: Ubeyd Gencer — Referans Kılavuzu

## Overview

**Creative North Star: "The Acetate Leaf Manual"**

This is a boxed-software reference manual rendered in a browser. The page ground is a
divider board printed at full saturation — no tints, no mixing — and a milk-acetate leaf
floats on it carrying every word of the reading field. The board is never decoration: it
shows on all four sides of the leaf, so the section's hue is a page-scale commitment
rather than an accent. The left edge is a real binding: two punched holes and a vertical
spine imprint carrying the name, the manual title and the version. The right edge is the
fore edge, where a stepped tab rail gives one tab per section, each tab's height
proportional to that section's extent.

The two themes are the same object under different light. Light is acetate over board
under room light. Dark is the identical board dimmed to 38% under a smoked acetate — the
hue survives, the illumination does not. Nothing about the layout, the grid, the tab
proportions or the type changes between them; only the light does.

The system refuses easing. Every transition in the stylesheet is `var(--step)
var(--hinge)` — 90ms at `steps(2, end)`, two frames, no interpolation. A binder hinge
does not ease. This is a deliberate override of ordinary ease-out guidance and it is the
motion grammar of the whole world; a cubic-bezier anywhere in this codebase is a foreign
body. Depth is likewise material, not effect: one soft offset shadow under the leaf, one
edge-light gradient along its fore edge, inset shadows in the punched holes. Nothing
glows, nothing lifts on hover.

**Key Characteristics:**
- Full-saturation board hue as page ground, visible on all four sides of the leaf
- Runtime-solved leaf alpha holding a fixed reading luminance on every board hue, in both themes
- Real binding furniture: punched holes, vertical spine imprint, stepped fore-edge tab rail
- No easing anywhere — 90ms `steps(2, end)` on every transition
- Three self-hosted variable faces (Archivo / EB Garamond / Azeret Mono), 136 KB total
- Every state carries a word as well as a mark; colour is never the sole signal
- Foreign imagery enters only through punched windows and bordered specimen plates

## Colors

Seven full-saturation divider-board hues, held at their printed values and never mixed
with each other; a vermilion held out of the wheel entirely; and a neutral stack of ink,
secondary ink and two rule weights that flips wholesale between themes.

### Primary

The board hues. Three of the seven currently take a whole page (`<html data-board>`
selects one of `yellow` / `orange` / `teal`, and only those three exist in the solver's
hue table). The remaining four are subsection tones applied via a `.t-*` class.

- **Chrome Yellow** (`{colors.h-yellow}`): Section 1, Introduction. Also the one hue that
  takes dark ink — see the Literal Dark Ink Rule.
- **Oxide Orange** (`{colors.h-orange}`): Section 2, Projects. Also the "Açsa Otomotiv"
  tab tone on every page.
- **Deep Teal** (`{colors.h-teal}`): Section 3, Bookmarks.
- **Grass** (`{colors.h-grass}`), **Ultramarine** (`{colors.h-ultra}`), **Violet**
  (`{colors.h-violet}`), **Sienna** (`{colors.h-sienna}`): subsection tones only. They
  colour a group heading (`.head.t-*`), the 3px reveal bar on an index row's left edge
  (`.entry::before` on hover / focus-within), and nothing else.

### Secondary

- **Errata Vermilion** (`{colors.h-vermilion}`): the held-out hue. It appears in exactly
  one component, `.errata`, and inside that component only as an 8% wash behind the leaf
  colour, a 55%-alpha border, and a solid 0.34rem square marker. It is never a fill, never
  a section tone, never a link colour. A full vermilion field read as a column of alarms
  in a list of working software; the slip is now edge and mark only.

### Neutral

- **Acetate Leaf** (`{colors.leaf}` light / `{colors.leaf-dark}` dark): the reading field's
  own colour, composited over the board at a runtime-solved alpha.
- **Ink** (`{colors.ink}` light / `{colors.ink-dark}` dark): body text, headings, entry
  names, all primary type.
- **Secondary Ink** (`{colors.ink-2}` light / `{colors.ink-2-dark}` dark): the machine
  voice — refs, spec tags, state labels, captions, folio.
- **Rule** (`{colors.rule}` light / `{colors.rule-dark}` dark): light hairlines between
  index rows, table rows, TOC rows, and the specimen-plate border.
- **Strong Rule** (`{colors.rule-strong}` light / `{colors.rule-strong-dark}` dark): the
  heavier hairline — folio underline, colophon top rule, panel border, lever border, jump
  underline, dotted TOC leader, and the scrollbar thumb.

### The leaf alpha solver

An inline script in every page's `<head>` — before first paint, before the stylesheet can
matter — binary-searches sRGB source-over compositing of the acetate over that page's
board hue until the resulting reading field's relative luminance lands in a fixed band,
then publishes the answer as `--leaf-a` on `<html>`. `manual.js` re-runs it through
`window.solveLeaf()` on every theme change.

Constants, verbatim from the code:

| Constant | Value |
| --- | --- |
| Hue table `H` | `yellow [233,168,28]`, `orange [185,79,20]`, `teal [15,113,118]` |
| Dark dim factor | `0.38` applied per channel to the board |
| Solver leaf source | light `[246,241,230]`, dark `[20,18,16]` |
| Luminance target | light `0.735`, dark `0.014` |
| Reachability pad | `(max − min) × 0.08` on the two endpoint luminances |
| Bisection | 22 iterations over `[0, 1]` |
| Alpha clamp | `[0.2, 0.97]`, published to 4 decimals |

Two clamps, both load-bearing. The **target clamp** squeezes the requested luminance into
`[min + pad, max − pad]` of the reachable range between board luminance and leaf
luminance; without it an out-of-range target solves to alpha 0 and the dark theme's leaf
vanishes entirely. The **alpha clamp** keeps the sheet a sheet: below 0.2 the acetate
stops reading as a material, above 0.97 it stops reading as acetate. On the three shipped
hues the target clamp never fires — it is a guard for hues added later, and adding a
board hue is exactly when it will start to matter.

In dark theme the solver also writes the dimmed board back as an inline `--board-face`;
in light theme it removes that inline property and lets the `html[data-board]` rule stand.

Solved values and the contrast they buy, measured against the shipped `--ink` / `--ink-2`:

| Board | Theme | Solved `--leaf-a` | Composited field | Body | Secondary |
| --- | --- | --- | --- | --- | --- |
| yellow | light | 0.7209 | `#F2DDAE` | 13.7:1 | 6.0:1 |
| orange | light | 0.8687 | `#EEDCCA` | 13.7:1 | 6.0:1 |
| teal | light | 0.8743 | `#D9E1D8` | 13.7:1 | 6.0:1 |
| yellow | dark | 0.7307 | `#2B2312` | 12.8:1 | 5.7:1 |
| orange | dark | 0.4063 | `#341C0D` | 13.2:1 | 5.9:1 |
| teal | dark | 0.3142 | `#0C2525` | 13.3:1 | 5.9:1 |

The point of the mechanism is the flatness of those last two columns: three unrelated
board hues, two themes, and the reading field lands within half a stop of the same
contrast every time. The CSS fallbacks (`--leaf-a: 0.92` light, `0.86` dark) exist only
for a no-JS render and are nowhere near the solved values for orange and teal dark —
treat them as a legibility floor, not as design values.

### Named Rules

**The Errata Reserve Rule.** Vermilion (`{colors.h-vermilion}`) appears in `.errata` and
nowhere else. If a new surface needs a warning colour, it does not get one — it gets an
errata slip or it gets words.

**The Literal Dark Ink Rule.** `--on-tone` for `.t-yellow` is the literal `#17150F`, never
`var(--ink)`. White on chrome yellow measures 2.08:1; `--ink` flips with the theme but a
subsection tone does not (it is only filtered), so `var(--ink)` would put light text on
yellow in dark theme. The sibling `--on-board` for `html[data-board="yellow"]` *is*
`var(--ink)`, and correctly so: the board itself dims with the theme, so the ink must flip
with it.

**The Solved Leaf Rule.** Never hand-pick `--leaf-a`. Adding a board hue means adding it to
the solver's `H` table and letting the bisection answer; a literal alpha that looks right
on one hue is wrong on the next.

**The Full-Saturation Rule.** Board hues ship at their printed values. They are not tinted,
shaded or mixed with each other. The only sanctioned modulations are the solver's uniform
0.38 dim in dark theme and the documented `color-mix` recipes (punch holes at 62% board /
38% black, window ground at 12% board, panel ground at 6% board).

## Typography

**Display Font:** Archivo (variable, `wdth` 62–125 / `wght` 400–900), with system-ui
**Body Font:** EB Garamond (variable, `wght` 400–700), with Georgia and Times New Roman
**Label/Mono Font:** Azeret Mono (variable, `wght` 400–600), with ui-monospace and Menlo

All three are self-hosted from `/assets/fonts/`, subset to the site's actual character set,
136 KB total (Archivo 77 KB, EB Garamond 36 KB, Azeret Mono 22 KB). Archivo and EB Garamond
are preloaded; all three use `font-display: swap`. There is no third-party font request.

**Character:** A grotesque compressed hard against a Renaissance oldstyle, with a
typewriter-adjacent mono holding the third voice. Archivo does the manual's shouting —
the cover word and the tracked caps of section heads. Garamond does the reading. Azeret
does not speak: it reports.

### Hierarchy

- **Display** (`wdth` 76 / `wght` 800, `clamp(2.75rem, 9vw, 5.75rem)`, 0.94, `-0.025em`,
  uppercase, `text-wrap: balance`): one per page, the cover word. `.display--sm`
  (`clamp(2rem, 6vw, 3.5rem)`) is the same face at section-title scale for pages 2 and 3.
  At ≤760px the display re-clamps to `clamp(2.25rem, 11.5vw, 3.25rem)`.
- **Headline** (`wdth` 90 / `wght` 700, 1.0625rem, 1.25, `-0.005em`): index entry names.
  Sentence case, not uppercase — these are proper nouns and product names.
- **Title** (`wdth` 88 / `wght` 700, 0.75rem, 0.12em, uppercase): section heads, hanging in
  the margin column. Carries a `<small>` mono sub-line at 0.5625rem / 0.16em in secondary
  ink for the section reference number and record count.
- **Subtitle** (`wdth` 90 / `wght` 600, 0.9375rem): TOC entry names.
- **Body** (EB Garamond, 17px / 26px — 1.0625rem at 1.5294, measure 62ch): every reading
  paragraph. Paragraph spacing is 0.8125rem, not a full line. `.lede` steps to 1.1875rem /
  1.5 for the opening passage.
- **Label** (Azeret Mono, 0.625rem, 0.14em, uppercase, tabular numerals): the machine voice
  — folio strip, colophon, captions, jump links, control buttons, skip link.
- **Label small** (Azeret Mono, 0.5625rem): the denser machine registers — spec-tags,
  state labels, errata slips, lever buttons, spine, section sub-lines, table row heads.
- **Spine** (Azeret Mono, 0.5625rem, 0.22em, uppercase, `writing-mode: vertical-rl`
  rotated 180°): the binding imprint. It is text, not ornament — name, manual title,
  version — and it is coloured by mixing 12% board into ink (20% in dark), never by opacity.

### Named Rules

**The Machine Voice Rule.** Azeret Mono is confined to machine content: codes, reference
numbers, versions, domains, measurements, tabular data, state labels, UI controls. A
sentence a person would say out loud is never set in mono, and a code is never set in
Garamond.

**The Turkish Uppercase Rule.** Under `lang="tr"`, `text-transform: uppercase` maps ASCII
`i` to `İ` — `logitech.com` becomes `LOGİTECH.COM`. Domains are therefore never
uppercased: `.toc__val` and `.jump` deliberately omit `text-transform` while every other
mono register carries it. ASCII technology names inside Turkish pages are tagged
`lang="en"` on the element (71 `.spec-tag` instances on `projects.html` do this) so casing
and hyphenation resolve in English.

**The Hanging Head Rule.** Section heads live in the margin column, not above the content.
They are set in tracked caps at 0.75rem and hang left of the reading field; only below
1180px does the margin narrow, and only below 760px does the head drop above its content
with a rule under it.

## Layout

**The `.sheet` grid.** The reading field is a five-track grid: a `margin` column of
`minmax(0, 9.5rem)` that section heads hang in, then four `col` tracks of
`minmax(0, 1fr)`. Column gap is `{spacing.gutter}`; row gap is `{spacing.row-gap}`; items
align to `start`. By default every child spans `col 1 / -1` — the four content columns
— while `.head` takes the margin column and `.full` spans all five.

**The `.fold` grid.** The first viewport uses a separate three-track grid so the
particulars panel can sit in the right column: `margin` `minmax(0, 9.5rem)`, `main`
`minmax(0, 1fr)`, `side` `minmax(15rem, 19rem)`. The title spans `main / side`, the bio
takes `main`, and `.fold__side` takes `side` across two rows. This holds only at ≥1181px.

**Board margins.** `body` is padded by `calc(var(--rail-w) + var(--board-gutter))` on the
right and `calc(var(--bind-w) + var(--board-gutter))` on the left, and the leaf carries a
block margin of `{spacing.leaf-margin}`. The board therefore shows on all four sides of the
leaf at every width.

**Fixed furniture.** `.binding` (left, `{spacing.bind-w}`, z-index 3), `.rail` (right,
`{spacing.rail-w}`, z-index 4) and `.controls` (top-right, inset by `--rail-w`, z-index 5)
are `position: fixed`. The leaf sits at z-index 2 above the grain layer at z-index 0.

**Breakpoints.** Three, all `max-width`:

- **≤1180px** — `.sheet` collapses 4 content columns to 2 and the margin narrows to 7rem.
  `.fold` drops to two tracks and the particulars panel moves under the bio. The index
  row drops from three columns to two and `.entry__side` becomes a horizontal wrap under
  the description; contact-print windows are capped at 14rem / 12.6rem image width so the
  thumbnail cannot crush the index's density.
- **≤760px** — `.sheet` collapses to a single column and heads move above their content
  with a strong rule beneath. `--rail-w` fixes to 3rem and `--bind-w` to 1.15rem. The rail
  never leaves the fore edge: 3rem minus the 0.2rem tab offset preserves a 44.8px target.
  The TOC's dotted leader is dropped and the domain wraps to its own line.
- **≤420px** — the specification table breaks to block layout, row head above row value.

**Rhythm.** Spacing is clamp-driven rather than stepped: gutters, board margins, leaf
padding and row gaps all interpolate on viewport. Fixed values appear only at component
scale (0.35rem, 0.5rem, 0.75rem, 0.9rem).

### Named Rules

**The Four Margins Rule.** The board is visible on all four sides of the leaf at every
width. Never let the leaf bleed to an edge; the tone is the page-scale commitment and a
leaf that touches the viewport edge destroys it.

**The Fore-Edge Rule.** The tab rail stays on the fore edge at every width — it is the
manual's identity. Under pressure the leaf narrows; the rail does not become a hamburger,
a top bar, or a drawer.

**The Proportional Tab Rule.** Tab height is content extent, not label length.
`.rail li` consumes `flex: var(--extent, 1) 1 0` and every `<li>` writes its own
`--extent` inline (currently 1 / 3.1 / 2.4 for Introduction / Projects / Bookmarks). Add a
section and you must give it an extent, or the rail silently falls back to equal thirds.

## Elevation & Depth

Depth is material, not effect. There is no elevation scale and there are no hover lifts.
Four devices carry the whole model:

1. **The leaf's offset shadow** — one soft shadow readable on all four sides, plus a
   hairline ring. A hard block shadow was explicitly rejected: it is not this world's
   material, and the right edge is covered by the rail anyway.
2. **The fore-edge light** — a `90deg` white gradient across the leaf's leading 1.1rem.
   This is the only native tell that the sheet is acetate rather than paper.
3. **Inset punch shadows** — punched holes, live-state marks and window holes are all
   recessed by the same inset formula, never by a border.
4. **The grain layer** — a fixed, single-layer fractal-noise SVG over the whole board at
   0.5 opacity `multiply` in light and 0.28 `screen` in dark. Fixed, one layer, cheap.

### Shadow Vocabulary

- **Leaf, light** (`box-shadow: 0 3px 14px rgb(0 0 0 / 0.20), 0 0 0 1px rgb(0 0 0 / 0.05)`):
  the reading field over the board.
- **Leaf, dark** (`box-shadow: 0 3px 16px rgb(0 0 0 / 0.45), 0 0 0 1px rgb(255 255 255 / 0.05)`):
  same object, deeper cast, light hairline instead of dark.
- **Punch** (`box-shadow: inset 0 1px 1.5px rgb(0 0 0 / 0.45), 0 1px 0 rgb(255 255 255 / 0.14)`
  over `color-mix(in srgb, var(--board-face) 62%, #000 38%)`): the binding hole and the
  live-state mark, sharing one formula exactly.
- **Window hole** (`inset 0 1px 1px rgb(0 0 0 / 0.5)` over `color-mix(in srgb, var(--board-face) 60%, #000 40%)`):
  the smaller holes punched into a `.window`.
- **Active tab dimple** (`inset 0 1px 2px rgb(0 0 0 / 0.55)` over `var(--board-face)`): the
  hole in the current tab.

### Named Rules

**The No-Easing Rule.** Every transition in this system is `var(--step) var(--hinge)` —
90ms, `steps(2, end)`. No cubic-bezier, no ease-out, no spring, anywhere. Under
`prefers-reduced-motion: reduce`, `--step` becomes 1ms and animations are forced to 1ms /
1 iteration.

**The Four Properties Rule.** Only four properties are ever transitioned in this build:
`translate` (tab pull), `filter` (dark tab dimming), `opacity` (the entry reveal bar),
`background` / `color` (lever and control buttons), and `border-color` (jump underline).
Nothing transitions size, position or shadow. Filtering the projects list re-deals rows
with `hidden` — a hinge step, never a fade.

**The Punch-Not-Glow Rule.** A recess is an inset shadow over a darkened board mix. A live
state is a hole, not an LED. Painting the live mark at full board value broke this once —
it stopped matching the site's own punch grammar and read as a light source in dark theme.

## Shapes

Corners are nearly square. The radius scale tops out at 3px and exists to make edges look
die-cut rather than drawn: `{rounded.hairline}` for insets and small chips,
`{rounded.slip}` for panels, windows and controls, `{rounded.tab}` on the outer corners of
a tab. The leaf itself is asymmetric — `{rounded.leaf}` — sharper at the bound edge, softer
at the fore edge, which is how a bound sheet actually cuts.

Two silhouettes recur and they carry meaning:

- **The circle** is always a punched hole (`{rounded.punch}`): binding holes, live-state
  marks, window holes, the current tab's dimple. A circle in this system is never a
  button, an avatar, or a bullet.
- **The clipped corner** is a half-hinge: the in-progress state mark is a
  `polygon(0 0, 100% 0, 100% 55%, 55% 100%, 0 100%)` clip over a −45° 2px/1px repeating
  hatch, framed by a strong-rule hairline.

Boxes are drawn with 1px hairlines in rule or strong-rule, never with fills. The
technology credit (`.spec-tag`) is a bottom-ruled caption, not a pill — this system has no
chips or badges with filled grounds. The one exception is the lever's pressed button,
which takes the board colour as a fill because it reports the board-scale state of the
page.

### Named Rules

**The Punched Window Rule.** Foreign imagery enters only through a punched window.
`.window` is the plate (`.window--plate` caps the image at 30rem); `.window--thumb` is the
contact-print scale used in index rows, with the holes and padding tightened and an 8:5
top-anchored crop. Bookmark favicons sit on `.mark`, a bordered specimen plate on an opaque
leaf ground. An `<img>` never floats free on the leaf.

**The Hairline Rule.** Structure is 1px hairlines, not fills and not shadows. `--rule` for
repeating separators inside a list or table, `--rule-strong` for a boundary that closes a
region (folio, colophon, panel, lever).

## Components

### Tabs (the fore-edge rail)

The signature component. Character: a stepped index tab die-cut into the fore edge.

- **Shape:** square at the bound side, `{rounded.tab}` at the outer corners; full rail width.
- **Height:** `flex: var(--extent, 1) 1 0` on the `<li>` — proportional to section extent,
  set inline per section.
- **Type:** Archivo `wdth` 84 / `wght` 700, 0.5625rem, 0.1em, uppercase, `white-space:
  nowrap`, `writing-mode: vertical-rl`. The size is set by the longest label the rail has
  to carry ("1 · INTRODUCTION"), not by taste.
- **Color:** `background: var(--tone)`, `color: var(--on-tone, #fff)` — the tone comes from
  the `.t-*` class on the tab itself.
- **Default / hover:** translated out of the edge by `--tab-x: 0.5rem`, pulling in to
  `0.15rem` on hover. Only `translate` moves; layout never reflows. The rail clips the
  overhang with `overflow: hidden`.
- **Current** (`[aria-current="page"]`): `--tab-x: 0`, and the fill becomes the leaf colour
  rather than the board — painted on the board it would land on the exact pixel value of
  the ground and the section you are standing in would lose its sign. A punched dimple
  is drawn by `span::before` as an `inline-block` inside an `inline-flex` span, with
  `margin-inline-end: 0.55rem`. It sits **in the inline flow deliberately**: as an
  absolutely-positioned `::after` it overlapped the numeral on the longest label, and
  because an `::after` contributes nothing to scroll geometry, a
  `scrollHeight == clientHeight` check could not see the collision. In flow, the overlap
  is impossible rather than merely avoided.
- **Dark:** `filter: brightness(0.72)` on inactive tabs; the current tab explicitly resets
  both `filter` and `color`, because the `html.dark .tab` selector at (0,2,1) would
  otherwise drag it back to `--on-tone`.
- **Keyboard:** arrow keys (both axes) move focus between tabs, handled on the rail.

### Buttons (controls and the lever)

There is no generic button in this system. Two specific ones exist.

- **`.ctl`** — theme hinge and language switch, fixed top-right inside the rail offset.
  Leaf ground, strong-rule hairline border, `{rounded.slip}`, mono 0.5625rem tracked caps,
  0.34rem × 0.55rem padding. Hover raises the leaf to full opacity. The theme hinge holds
  both a sun and a moon SVG and dims the inactive one to 0.38 opacity via `.ctl__off`.
- **`.lever button`** — the filter control. Transparent ground, secondary ink, no border of
  its own (the `.lever` wrapper carries a strong-rule box with 3px padding and 3px gaps).
  Pressed (`[aria-pressed="true"]`) it takes `var(--board-face)` as a fill with
  `var(--on-board)` text: dark ink on yellow, white on orange and teal.

**The One Lever Rule.** A single control re-deals the whole field. Pressing a lever button
hides non-matching `.entry` rows, closes any group whose visible count reaches zero
*together with its margin-column head*, and updates both the per-group count and the page
tally in the same move. There is no per-group filter and no multi-select.

### Cards / Containers

This system has no cards. Three ruled containers stand in:

- **`.panel`** — the particulars panel. Strong-rule 1px border, `{rounded.slip}`, ground is
  6% board mixed into the leaf. Its head is a flex row: Archivo tracked caps on the left,
  a mono reference number on the right, separated from the body by a strong-rule underline.
- **`.window`** — the punched image window. Rule hairline, `{rounded.slip}`, ground is 12%
  board mixed into the *opaque* leaf, with two punched holes at 22% from top and bottom on
  the left. Caption is a two-part flex row of machine labels that never wrap mid-name.
- **`.errata`** — the correction slip. Inline-flex, hairline radius, 8% vermilion wash over
  the leaf, 55%-alpha vermilion border, and a solid 0.34rem vermilion square before the
  words. Used for records with no public link ("Bağlantı yok" / "No public link") and for
  internal tools ("Dahili araç" / "Internal tool").

### Navigation

Two navigation surfaces beyond the rail:

- **`.toc`** — the manual's table of contents, used for links and bookmarks. Each row is a
  baseline-aligned flex line: mono reference number, brand SVG or `.mark` specimen plate,
  Archivo `wdth` 90 / `wght` 600 name, a dotted strong-rule leader that flexes to fill, and
  a mono domain in secondary ink. Rule hairline under each row. Hover underlines only the
  name. Below 760px the leader is dropped and the domain wraps to its own indented line.
- **`.jump`** — the outbound link. Mono 0.625rem, inline-flex with a 0.7rem SVG, a
  strong-rule bottom border that goes to full ink on hover. The only transitioned property
  is `border-color`.

### Index Rows

The projects list. Character: a ruled register entry, not a card.

- **Shape:** a three-column grid — 3.25rem ref / `minmax(0, 1fr)` body / `minmax(9rem, 12rem)`
  side — with a rule hairline below and `align-items: start`. (Baseline alignment was
  wrong here: a window in the side column pushed the first baseline below the image and
  dragged the whole row down.)
- **Reveal:** a 3px bar in the group's `--tone`, 0.75rem outside the left edge, fading in on
  hover *or* `focus-within`. It is the only opacity transition in the system.
- **Contents:** mono ref, Archivo entry name, Garamond description capped at the 62ch
  measure and tinted with 18% board, a wrap of bottom-ruled spec-tags, and a side stack of
  contact-print window, state, and jump or errata.

### State Marks

- **Live** — a punched hole, sharing the binding punch's exact colour formula and inset
  shadow, followed by the word "Canlı" / "Live".
- **In progress** — a half-hinged hatched corner with a strong-rule border, followed by
  "Geliştirme" / "In progress".
- **No public link** — an errata slip with its vermilion square, carrying the words.

**The Word-And-Mark Rule.** Every state carries a word as well as a mark. The mark is
`aria-hidden`; the word is the accessible name. Colour and shape are never the sole signal.

### Browser Surfaces

The system themes the chrome as deliberately as the page:

- `::selection` — board fill with `--on-board` text; in dark, board fill with `--ink`.
- `:focus-visible` — 2px solid `color-mix(in srgb, var(--board-face) 32%, var(--ink) 68%)`,
  2px offset, 1px radius. The ring keeps the board's hue but takes its **value** from the
  ink: drawn in the pure board tone it measured 1.56:1 against the chrome-yellow reading
  field, so a keyboard user could not see where focus was. No dark-theme override is
  needed — `--ink` already flips, so the mix flips with it.
- Scrollbar — `scrollbar-color: var(--rule-strong) var(--board)` plus a WebKit thumb of
  45% board / 55% black with a 3px board border and a 99px radius.
- `accent-color: var(--board-face)` on `:root`.
- `.skip` — a mono skip link parked off-canvas, landing at 0.5rem/0.5rem on focus with a
  full-opacity leaf ground and a solid ink border.
- Print — board, grain, rail, binding, controls and lever all drop; the leaf loses its
  shadow, margin and padding and prints on white.

## Do's and Don'ts

### Do:

- **Do** add a board hue by adding it to the solver's `H` table in every page's `<head>`
  *and* to the `html[data-board]` rule with an `--on-board` value, then let the bisection
  publish `--leaf-a`.
- **Do** give every new rail section an inline `--extent` proportional to its content;
  without it the tab silently falls back to `flex: 1`.
- **Do** write `var(--step) var(--hinge)` for every transition — 90ms, `steps(2, end)`.
- **Do** confine Azeret Mono to machine content: codes, refs, versions, domains,
  measurements, tabular data, state labels, controls.
- **Do** set body copy in EB Garamond at 17/26 against the 62ch `--measure`.
- **Do** tag ASCII technology names inside Turkish pages with `lang="en"`.
- **Do** pair every state mark with its word, and mark the glyph `aria-hidden="true"`.
- **Do** frame any foreign image in a `.window` or a `.mark` specimen plate.
- **Do** draw structure with 1px `--rule` / `--rule-strong` hairlines.
- **Do** use `color-mix(in srgb, var(--board-face) …)` when a surface needs to acknowledge
  the section tone — 62%/38% black for a punch, 12% for a window ground, 6% for a panel.
- **Do** keep the board visible on all four sides of the leaf at every width.

### Don't:

- **Don't** use vermilion (`{colors.h-vermilion}`) anywhere but `.errata`.
- **Don't** write `--on-tone: var(--ink)` for `.t-yellow`. It must be the literal `#17150F`;
  tones do not flip with the theme, and white on chrome yellow is 2.08:1.
- **Don't** hand-pick `--leaf-a`. The CSS fallbacks (0.92 / 0.86) are a no-JS floor, not
  design values.
- **Don't** introduce an easing curve, a spring, a fade, or a duration other than
  `--step`. No cubic-bezier belongs in this codebase.
- **Don't** uppercase a domain. Under `lang="tr"`, `text-transform: uppercase` turns ASCII
  `i` into `İ`.
- **Don't** put a hard offset block shadow on the leaf or any other surface; this world's
  shadow is soft and singular.
- **Don't** paint the current tab in the board colour — it lands on the ground's exact
  pixel value and the current section loses its sign. Paint it in the leaf.
- **Don't** paint the live-state mark at full board value; use the binding punch's
  62%/38% formula so it reads as a hole rather than an LED.
- **Don't** collapse the rail into a hamburger, top bar, or drawer at any width.
- **Don't** add filled chips, badges, pills, or cards. Credits are bottom-ruled captions
  and containers are hairline boxes.
- **Don't** let a circle mean anything but a punched hole.
- **Don't** signal state with colour alone.
