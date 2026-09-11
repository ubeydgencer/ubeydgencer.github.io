# ubeydgencer.com

[Türkçe](README.md) · **English**

My personal site. Not a conversion funnel but a permanent digital home — who I am, what I've shipped, and where to reach me, in one place.

🔗 **[ubeydgencer.com](https://ubeydgencer.com)**

![No build step](https://img.shields.io/badge/build-none-1C4A9E?style=flat-square)
![Zero dependencies](https://img.shields.io/badge/dependencies-0-3C7429?style=flat-square)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-live-E9A81C?style=flat-square)
![TR + EN](https://img.shields.io/badge/lang-TR_+_EN-0F7176?style=flat-square)

---

## What it is

Hand-written static HTML. No framework, no compiler, no `node_modules`. Push to `main` = deploy.

The design is built as a **reference manual**: a fully saturated divider-board ground, a milky acetate leaf on top whose alpha is solved at runtime, a punched binding edge, vertical spine lettering, and a tab rail sized in proportion to each section. It deliberately rejects the centered-single-column-plus-round-social-buttons layout.

## Structure

```
├── index.html              1 · Intro
├── projects.html           2 · Projects      (24 projects, 4 categories)
├── bookmarks.html          3 · Bookmarks     ← synced from Raindrop.io
├── blog/                   4 · Blog
├── en/                     English version — an equal, not a translation
│   ├── index.html
│   ├── projects.html
│   ├── bookmarks.html
│   └── blog/
├── assets/
│   ├── manual.css          29 KB · one stylesheet shared by every page
│   ├── manual.js           3.9 KB · theme hinge and tab rail
│   └── fonts/              136 KB · self-hosted variable woff2
├── scripts/
│   └── fetch-raindrop.mjs  bookmark sync
└── .github/workflows/
    └── raindrop.yml        runs daily
```

## Design system

| | |
|---|---|
| **Type** | Archivo (condensed heavy display) · EB Garamond 17/26 at 62ch (body) · Azeret Mono (machine voice) |
| **Color** | Seven divider tones — yellow `#E9A81C`, orange `#B94F14`, grass `#3C7429`, teal `#0F7176`, ultra `#1C4A9E`, violet `#64499A`, sienna `#78381D`. Vermilion `#C42208` is reserved for the errata strip alone. |
| **Motion** | No easing. Every transition is 90ms on `steps(2, end)` — a two-frame hinge. |
| **Theme** | Follows the OS `prefers-color-scheme` with a manual toggle, preference in `localStorage`. The leaf alpha is solved in `<head>` before paint, so the first frame lands on the right color. |

Fonts are subset to the characters the site actually uses; there are no third-party font requests.

## Bookmarks come from Raindrop

The three sections on `bookmarks.html` aren't written by hand. They're pulled daily from the `Bookmark`, `Product`, and `Wish List` collections in my [Raindrop.io](https://raindrop.io) account.

What matters is **where it runs**: the script executes inside GitHub Actions, never in the browser. The token lives in the `RAINDROP_TOKEN` secret and never reaches the published page. The output is still plain static HTML — readable with JS disabled, with SEO intact.

```bash
node scripts/fetch-raindrop.mjs --list      # list collections on the account
node scripts/fetch-raindrop.mjs --dry-run   # print output without writing
node scripts/fetch-raindrop.mjs             # update bookmarks.html
```

Copy `.env.example` to `.env` for the token. If a bookmark's title looks wrong, fix it in Raindrop itself — editing the HTML won't hold, the next sync overwrites it.

## Running locally

There's no build step, so any static server will do:

```bash
python3 -m http.server 4000
```

One caveat: the clean URLs in production (`/projects`, `/bookmarks`) rely on GitHub Pages hiding the `.html` extension. Locally you need to include it.

## SEO and machine readability

Every page carries a canonical link, `hreflang` (TR/EN/x-default), Open Graph, Twitter Card, and JSON-LD. On top of that:

- [`sitemap.xml`](sitemap.xml) — 11 URLs with language alternates
- [`llms.txt`](llms.txt) — the canonical project list, written for language models
- [`robots.txt`](robots.txt) — explicit allow for GPTBot, Claude-Web, PerplexityBot, and anthropic-ai

When a project is added, `projects.html`, `llms.txt`, and `sitemap.xml` are updated together. That three-way sync is a standing rule.

## Contact

[ubeydgencer.com](https://ubeydgencer.com) · [GitHub](https://github.com/ubeydgencer) · [LinkedIn](https://linkedin.com/in/mubeyd) · [Twitter](https://twitter.com/UbeydGencer)
