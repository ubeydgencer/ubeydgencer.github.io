# ubeydgencer.com

**Türkçe** · [English](README.en.md)

Kişisel sitem. Bir dönüşüm hunisi değil, kalıcı bir dijital ev — kim olduğumu, ne sevk ettiğimi ve nereden ulaşılacağını tek yerde tutuyor.

🔗 **[ubeydgencer.com](https://ubeydgencer.com)**

![Build adımı yok](https://img.shields.io/badge/build-yok-1C4A9E?style=flat-square)
![Bağımlılık yok](https://img.shields.io/badge/bağımlılık-0-3C7429?style=flat-square)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-canlı-E9A81C?style=flat-square)
![TR + EN](https://img.shields.io/badge/dil-TR_+_EN-0F7176?style=flat-square)

---

## Nedir

Elle yazılmış statik HTML. Framework yok, derleyici yok, `node_modules` yok. `main` dalına push = yayın.

Tasarım bir **referans kılavuzu** olarak kurulu: tam doygun ayraç kartonu zemin, üstünde alfası çalışma zamanında çözülen süt asetat yaprak, delikli cilt kenarı, dikey sırt yazısı ve hacimle orantılı sekme rayı. Ortalanmış tek sütun + yuvarlak sosyal buton düzenini bilerek reddediyor.

## Yapı

```
├── index.html              1 · Giriş
├── projects.html           2 · Projeler      (24 proje, 4 kategori)
├── bookmarks.html          3 · Yer İmleri    ← Raindrop.io'dan otomatik
├── blog/                   4 · Blog
├── en/                     İngilizce sürüm — çeviri değil, eşdeğer
│   ├── index.html
│   ├── projects.html
│   ├── bookmarks.html
│   └── blog/
├── assets/
│   ├── manual.css          29 KB · tüm sayfaların paylaştığı tek stil
│   ├── manual.js           3.9 KB · tema menteşesi ve sekme rayı
│   └── fonts/              136 KB · self-host değişken woff2
├── scripts/
│   └── fetch-raindrop.mjs  yer imi senkronu
└── .github/workflows/
    └── raindrop.yml        günlük çalışır
```

## Tasarım sistemi

| | |
|---|---|
| **Yazı** | Archivo (sıkışık ağır başlık) · EB Garamond 17/26 62ch (gövde) · Azeret Mono (makine sesi) |
| **Renk** | Yedi ayraç tonu — sarı `#E9A81C`, turuncu `#B94F14`, çim `#3C7429`, teal `#0F7176`, ultra `#1C4A9E`, menekşe `#64499A`, siena `#78381D`. Vermilyon `#C42208` yalnız errata şeridinde. |
| **Hareket** | Yumuşama yok. Her değişim 90ms, `steps(2, end)` — iki kare menteşe. |
| **Tema** | OS `prefers-color-scheme` takibi + manuel toggle, tercih `localStorage`'da. Yaprak alfası boyamadan önce `<head>`'de çözülür, böylece ilk karede doğru renk basılır. |

Fontlar sitede fiilen kullanılan karaktere indirgenmiş; üçüncü taraf font isteği yok.

## Yer imleri Raindrop'tan gelir

`bookmarks.html`'deki üç bölüm elle yazılmıyor. [Raindrop.io](https://raindrop.io) hesabımdaki `Bookmark`, `Product` ve `Wish List` koleksiyonlarından her gün çekiliyor.

Önemli olan **nerede çalıştığı**: script GitHub Actions içinde koşar, tarayıcıda değil. Token `RAINDROP_TOKEN` secret'ında durur ve yayınlanan sayfaya hiç girmez. Sonuç hâlâ düz statik HTML — JS kapalıyken de okunur, SEO'su bozulmaz.

```bash
node scripts/fetch-raindrop.mjs --list      # hesaptaki koleksiyonları göster
node scripts/fetch-raindrop.mjs --dry-run   # dosyaya yazmadan çıktıyı gör
node scripts/fetch-raindrop.mjs             # bookmarks.html'i güncelle
```

Token için `.env.example`'ı `.env` olarak kopyala. Bir yer iminin başlığı bozuksa düzeltme yeri Raindrop'un kendisi — HTML'i elle düzeltmek işe yaramaz, bir sonraki senkronda üzerine yazılır.

## Yerelde çalıştırma

Build adımı olmadığı için herhangi bir statik sunucu yeter:

```bash
python3 -m http.server 4000
```

Tek uyarı: yayındaki temiz URL'ler (`/projects`, `/bookmarks`) GitHub Pages'in `.html` uzantısını gizlemesine dayanıyor. Yerelde `.html` uzantısıyla açman gerekir.

## SEO ve makine okunabilirliği

Her sayfada canonical, `hreflang` (TR/EN/x-default), Open Graph, Twitter Card ve JSON-LD var. Ek olarak:

- [`sitemap.xml`](sitemap.xml) — 11 URL, dil alternatifleriyle
- [`llms.txt`](llms.txt) — dil modelleri için kanonik proje listesi
- [`robots.txt`](robots.txt) — GPTBot, Claude-Web, PerplexityBot ve anthropic-ai dahil açık izin

Bir proje eklendiğinde `projects.html`, `llms.txt` ve `sitemap.xml` birlikte güncellenir. Bu üçlü senkron kalıcı bir kuraldır.

## İletişim

[ubeydgencer.com](https://ubeydgencer.com) · [GitHub](https://github.com/ubeydgencer) · [LinkedIn](https://linkedin.com/in/mubeyd) · [Twitter](https://twitter.com/UbeydGencer)
