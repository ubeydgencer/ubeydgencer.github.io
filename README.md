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
├── projects.html           2 · Projeler      proje dizini
├── bookmarks.html          3 · Yer İmleri    ← Raindrop.io'dan otomatik
├── blog/                   4 · Blog
├── en/                     İngilizce sürüm — çeviri değil, eşdeğer
│   ├── index.html
│   ├── projects.html
│   ├── bookmarks.html
│   └── blog/
├── assets/
│   ├── manual.css          29 KB · tüm sayfaların paylaştığı tek stil
│   ├── manual.js           tema menteşesi, sekme rayı, dinleme şeridi
│   ├── audio/              yazıların sesli sürümü ← scripts/tts.py
│   └── fonts/              136 KB · self-host değişken woff2
├── scripts/
│   ├── fetch-raindrop.mjs  yer imi senkronu
│   ├── sync-counts.mjs     içerikten sayaç kontrolü ve güncelleme
│   ├── tts.py              blog seslendirme
│   └── tts-sozluk.json     modelin yanlış okuduğu kelimeler
└── .github/workflows/
    ├── raindrop.yml        günlük yer imi senkronu
    ├── counts.yml          içerik değişince veya elle sayaç senkronu
    └── tts.yml             yazı değişince sesi yeniden üretir
```

## Tasarım sistemi

| | |
|---|---|
| **Yazı** | Archivo (sıkışık ağır başlık) · EB Garamond 17/26 62ch (gövde) · Azeret Mono (makine sesi) |
| **Renk** | Yedi ayraç tonu — sarı `#E9A81C`, turuncu `#B94F14`, çim `#3C7429`, teal `#0F7176`, ultra `#1C4A9E`, menekşe `#64499A`, siena `#78381D`. Vermilyon `#C42208` yalnız errata şeridinde. |
| **Hareket** | Yumuşama yok. Her değişim 90ms, `steps(2, end)` — iki kare menteşe. |
| **Tema** | OS `prefers-color-scheme` takibi + manuel toggle, tercih `localStorage`'da. Yaprak alfası boyamadan önce `<head>`'de çözülür, böylece ilk karede doğru renk basılır. |

Fontlar sitede fiilen kullanılan karaktere indirgenmiş; üçüncü taraf font isteği yok.

`manual.css` ve `manual.js` her sayfada `?v=YYYYMMDD` ile çağrılır. GitHub Pages bu dosyaları 4 saat önbellekte tuttuğu için ikisinden biri değişince sürüm bütün sayfalarda artırılmalı; yoksa yeni HTML eski stille açılır:

```bash
git ls-files '*.html' | xargs sed -i '' -E 's#(/assets/manual\.(css|js))\?v=[0-9]+#\1?v='"$(date +%Y%m%d)"'#g'
```

## Yer imleri Raindrop'tan gelir

`bookmarks.html`'deki üç bölüm elle yazılmıyor. [Raindrop.io](https://raindrop.io) hesabımdaki `Bookmark`, `Product` ve `Wish List` koleksiyonlarından her gün çekiliyor.

Önemli olan **nerede çalıştığı**: script GitHub Actions içinde koşar, tarayıcıda değil. Token `RAINDROP_TOKEN` secret'ında durur ve yayınlanan sayfaya hiç girmez. Sonuç hâlâ düz statik HTML — JS kapalıyken de okunur, SEO'su bozulmaz.

```bash
node scripts/fetch-raindrop.mjs --list      # hesaptaki koleksiyonları göster
node scripts/fetch-raindrop.mjs --dry-run   # dosyaya yazmadan çıktıyı gör
node scripts/fetch-raindrop.mjs             # bookmarks.html'i güncelle
```

Token için `.env.example`'ı `.env` olarak kopyala. Bir yer iminin başlığı bozuksa düzeltme yeri Raindrop'un kendisi — HTML'i elle düzeltmek işe yaramaz, bir sonraki senkronda üzerine yazılır.

## İçerik sayaçlarını doğrulama

Proje, yazı ve yer imi sayıları içerikten türetilir. Node 22 ile proje kökünde şu kontrolü çalıştır:

```bash
node scripts/sync-counts.mjs --check
```

Bu komut dosya yazmaz ve token gerektirmez. Bayat sayaç veya tutarlılık sorunu bulursa çıkış kodu `1` döner. Sayaçları güncellemek için:

```bash
node scripts/sync-counts.mjs
git diff
node scripts/sync-counts.mjs --check
```

Script; bölüm başlıklarını, filtre sayaçlarını, ana sayfa künyelerini ve `llms.txt` içindeki sayıları günceller. Türkçe/İngilizce proje ve blog dizinlerinin kayıt sayılarını, `llms.txt` madde sayısını ve sitemap'te listelenen adreslerin yerel dosya karşılıklarını da kontrol eder.

“Elle bakılmalı” çıktısındaki eksik içerik veya bulunamayan desenler ayrıca düzeltilmelidir. Script yeni proje, yazı, çeviri veya sitemap adresi oluşturmaz; iki dilde aynı kayıt sayısının bulunması çeviri içeriğini doğrulamaz.

`.github/workflows/counts.yml`, kapsadığı içerik dosyaları `main` üzerinde değiştiğinde sayaçları yeniden yazar ve fark varsa commit eder; Actions'tan elle de çalıştırılabilir. Raindrop senkronu aynı scripti kendi içinde çağırır.

## Yazıların sesli sürümü

Türkçe blog yazılarının başında bir "Dinle" şeridi var. Ses tarayıcıda üretilmiyor: [antalia-mini](https://huggingface.co/cloud0day3/antalia-mini) (Türkçe TTS, 7,6M parametre, Apache-2.0) ile önceden üretilip `assets/audio/` altına MP3 olarak konuyor. Site yine build'siz ve bağımlılıksız; Python yalnızca seslendirme aşamasında, GitHub Actions'ta çalışıyor.

`blog/*.html` değişince `tts.yml` devreye girer. `scripts/tts.py` metni değişen yazının sesini yeniden üretir, oynatıcı bloğunu (`<!-- dinle -->`) ve JSON-LD'deki `audio` alanını yazar. Metni değişmeyen yazıya dokunmaz; metnin özeti oynatıcının `data-tts` özniteliğinde durur. Oynatıcı bloğu elle düzenlenmez, bir sonraki üretimde üzerine yazılır.

```bash
pip install -r scripts/requirements-tts.txt   # Python 3.10+
python3 scripts/tts.py                        # değişenleri seslendir
python3 scripts/tts.py --check                # bayat ses var mı
python3 scripts/tts.py --force teknoloji-gunlugu   # tek yazıyı yeniden üret
```

Model bir kelimeyi yanlış okuyorsa (yabancı özel isimler, İngilizce kelimeler) düzeltme yeri `scripts/tts-sozluk.json`: `"WIRED": "Vayırd"` gibi. Ses tek, sentetik bir erkek sesi; oynatıcıda bu açıkça yazıyor. İngilizce yazılar seslendirilmez, model yalnız Türkçe.

## Yerelde çalıştırma

Build adımı olmadığı için herhangi bir statik sunucu yeter:

```bash
python3 -m http.server 4000
```

Tek uyarı: yayındaki temiz URL'ler (`/projects`, `/bookmarks`) GitHub Pages'in `.html` uzantısını gizlemesine dayanıyor. Yerelde `.html` uzantısıyla açman gerekir.

## SEO ve makine okunabilirliği

Her sayfada canonical, `hreflang` (TR/EN/x-default), Open Graph, Twitter Card ve JSON-LD var. Ek olarak:

- [`sitemap.xml`](sitemap.xml) — kanonik URL'ler ve dil alternatifleri
- [`llms.txt`](llms.txt) — dil modelleri için kanonik proje listesi
- [`robots.txt`](robots.txt) — GPTBot, Claude-Web, PerplexityBot ve anthropic-ai dahil açık izin

Bir proje eklendiğinde `projects.html`, `llms.txt` ve `sitemap.xml` birlikte güncellenir. Bu üçlü senkron kalıcı bir kuraldır.

## İletişim

[ubeydgencer.com](https://ubeydgencer.com) · [GitHub](https://github.com/ubeydgencer) · [LinkedIn](https://linkedin.com/in/mubeyd) · [Twitter](https://twitter.com/UbeydGencer)
