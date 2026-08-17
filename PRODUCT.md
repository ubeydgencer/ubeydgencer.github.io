# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Birincil ziyaretçi kimliği doğrulanmış olarak: **sitenin sahibi adına, siteyi bulan herkes.** Ubeyd Gencer bu siteyi bir dönüşüm hunisi olarak değil, kalıcı bir dijital ev olarak tutuyor — kimseyi işe alım veya satın alma kararına itmeye çalışmıyor.

Pratikte gelen kişi: adı bir yerde geçtiği için (Twitter, GitHub, Product Hunt, Medium, LinkedIn, bir proje sitesinin altındaki imza) "bu kim, ne yapıyor" diye bakan biri. Bu ziyaretçi hızlı bakar, birkaç saniyede bir yargıya varır ve ya bir linke tıklar ya da çıkar.

Başarı: **doğru temsil edilmek.** Ziyaretçi siteden ayrılırken Ubeyd'in ne yaptığı, neyi sevk ettiği ve nereden ulaşılacağı konusunda yanlış bir izlenim taşımıyorsa site işini yapmıştır.

## Product Purpose

Üç işi olan tek bir kişisel site:

1. **Kimlik çıpası** — arandığında çıkan, sahibinin kontrolündeki kanonik kaynak. JSON-LD `Person`, `sameAs` bağlantıları ve `llms.txt` bunun için var; site aynı zamanda arama motorlarına ve dil modellerine hitap ediyor.
2. **Link merkezi** — dağınık profillerin (GitHub, Twitter, LinkedIn, Instagram, Medium, Product Hunt) tek toplanma noktası.
3. **İş vitrini** — 22 gerçek projenin, çoğu canlı URL'li, kategorili dökümü.

## Positioning

Rakip bir ürün değil, bir kişinin kaydı. Komşu bir portfolyonun dürüstçe kopyalayamayacağı şey **kapsamın gerçekliği**: aynı kişide otomotiv sektörü iç araçları (depo takip, izin hesaplama, filo muayene takibi, teklif hazırlama), üç ayrı İkas e-ticaret mağazası, üç dilli bir haber sitesi (Haramain News), yerel AI ile çalışan bir macOS masaüstü uygulaması (Toparla), bir ESP32 + Telegram IoT otomasyonu (İnterkom Bot) ve bir köy dijital arşivi (Ulukale) yan yana duruyor.

Bu bir "full-stack developer" etiketi değil; **gerçekten sevk edilmiş, birbiriyle akraba olmayan işlerin genişliği.** Site bunu iddia etmek yerine göstermeli.

## Operating Context

- GitHub Pages üzerinde barındırılıyor; `main` dalına push = yayın. Başka deploy adımı yok.
- Cloudflare DNS, custom domain `ubeydgencer.com` (`CNAME` dosyasıyla).
- `.nojekyll` mevcut — Jekyll işleme devre dışı.
- Repoda bir Hugo iskeleti (`config.toml`, `themes/ananke`, `archetypes`, `resources`) duruyor ama **kullanılmıyor**; yayınlanan sayfalar elle yazılmış statik HTML.
- Google Analytics ölçümü aktif: `G-SCQFS30M5E`.
- Temiz URL'ler (`/projects`, `/bookmarks`) GitHub Pages'in `.html` uzantısını gizlemesine dayanıyor — yerel önizlemenin bunu taklit etmesi gerekir.

## Capabilities and Constraints

**Teknik**
- Sıfır bağımlılık, build adımı yok. Altı sayfa tek bir paylaşılan `assets/manual.css` ve `assets/manual.js` kullanır; tema ve yaprak alfası her sayfanın `<head>` bloğundaki küçük bir önyükleyicide, boyamadan önce çözülür. Paylaşılan dosyalar üçlü kopyayı bitirir ve sayfalar arası önbelleğe girer; build adımsızlık korunur.
- Sunucu tarafı yok. Form, veritabanı, kimlik doğrulama mümkün değil.
- Altı yayın sayfası: Türkçe `index.html` (`/`), `projects.html` (`/projects`), `bookmarks.html` (`/bookmarks`); İngilizce `en/index.html` (`/en/`), `en/projects.html` (`/en/projects`), `en/bookmarks.html` (`/en/bookmarks`).
- Dark/light tema: OS `prefers-color-scheme` takibi + manuel toggle, tercih `localStorage`'da. Mevcut davranış korunacak.
- Dış bağımlılıklar: Google favicon servisi (yer imi satırlarında) ve gtag. **Yazı yüzleri artık self-host**: Archivo, EB Garamond ve Azeret Mono, sitede fiilen kullanılan karaktere indirgenmiş değişken woff2 olarak `assets/fonts/` altında, toplam 136 KB. Üçüncü taraf font isteği yok.

**Dil (kullanıcı kararı)**
- Site **Türkçe + İngilizce** olacak. İngilizce ikinci sınıf bir çeviri değil, eşdeğer sürüm.
- Bu; dil seçici, `hreflang` bağlantıları, her iki dilde meta/OG etiketleri ve iki dilde yazılmış içerik demek. Build adımı olmadığı için dil yapısı statik dosyalarla çözülecek.
- Şu anki tüm içerik Türkçe; İngilizce metinler bu iş kapsamında yazılacak.

**İçerik senkronu**
- Bir proje eklendiğinde/değiştiğinde `projects.html`, `llms.txt` ve `sitemap.xml` birlikte güncellenmeli. Bu üçlü senkron kalıcı bir kuraldır.

## Brand Commitments

- İsim: **Ubeyd Gencer**. Ünvan: Bilgi İşlem & İş Geliştirme · Açsa Otomotiv. (LinkedIn'de aynı görev "Information Technology Specialist" olarak yazılı; sitede kullanıcının tercih ettiği Türkçe ünvan korunuyor.)
- Domain `ubeydgencer.com` ve mevcut `favicon.svg` kalır.
- Ses tonu: sade, abartısız, birinci tekil şahıs Türkçe. Mevcut biyografi bu tonu tanımlıyor — süperlatif yok, satış dili yok.
- Analytics ölçümü (`G-SCQFS30M5E`) ve SEO altyapısı (JSON-LD, OG, Twitter Card, `robots.txt`, `llms.txt`, `sitemap.xml`) taşınacak; redesign bunları kaybedemez.

## Evidence on Hand

**Kişisel geçmiş (kaynak: kullanıcının kendi LinkedIn profili, 17 Ağustos 2026'da okundu)**
- Açsa Otomotiv · Information Technology Specialist · Eylül 2020 — devam · İstanbul.
- Qufe Silver · Kurucu · Aralık 2016 – Eylül 2020 (3 yıl 10 ay) · perakende (qufesilver.com).
- Motor Aşin Otomotiv A.Ş. · Bilgisayar Teknisyeni · Haziran 2013 – Eylül 2014 · ağ yapılandırma, IP kamera, kurum içi donanım.
- Stajlar: ACEDEMAND IT Consulting (Ağustos 2019), Karya Teknoloji (Haziran 2019 — ağ/sistem kurulum ve bakım).
- Eğitim: Fırat Üniversitesi, Mühendislik Fakültesi — Bilgisayar Mühendisliği, 2013–2020. Anadolu Üniversitesi, Lisans — Yönetim Bilişim Sistemleri, 2016–2020. **İkisi de tamamlanmış.**
- Sertifika: KOSGEB Girişimcilik, Mart 2018.
- Gönüllülük: AFAD (Nisan 2020 — devam) ve TRAC / Türkiye Radyo Amatörleri Cemiyeti (Ağustos 2020 — devam).

**Var:**
- 22 gerçek proje; büyük çoğunluğu canlı ve halka açık URL'li. Kanonik liste `llms.txt` ve `projects.html` içinde, dört kategoride: Açsa Otomotiv (8), E-Ticaret (3), Web Projeleri (7), Uygulamalar & IoT (4). Her projenin durumu (Canlı / Geliştirme) ve teknoloji etiketleri kayıtlı.
- Tek portre fotoğrafı: `ubeydgencer.jpg` (repo kökünde).
- Yer imi koleksiyonu: `bookmarks.html` içinde kategorili gerçek linkler.

- **Proje ekran görüntüleri — üretildi.** Halka açık URL'si olan 14 projenin ekran görüntüsü, 17 Ağustos 2026'da canlı sitelerden headless Chrome ile 1280×800'de çekildi ve `assets/shots/` altına 640×400 webp olarak kondu (toplam 264 KB). Her dosyanın yanında kaynak künyesi var: URL, tarih, yöntem, ve üretilmediği/düzenlenmediği. `acsa-depo` giriş ekranı olarak geldi — uygulama gerçekten auth arkasında olduğu için olduğu gibi bırakıldı.
- Halka açık URL'si olmayan sekiz proje (Personel İzin, Araç Muayene, Açsa Teklif, Kalori, Hediye Ambalaj, Toparla, Trendyol Etiket, İnterkom Bot) ekran görüntüsüz kalır ve bunu vermilyon errata fişiyle dürüstçe söyler. Uydurma mockup veya yer tutucu görsel yok.

**Yok — uydurulmayacak:**
- Müşteri referansı, alıntı veya vaka çalışması yok.
- Metrik, kullanıcı sayısı, gelir rakamı, "X kişi kullanıyor" türü kanıt yok.
- Ödül veya basın çıkışı yok. Tek sertifika KOSGEB Girişimcilik (Mart 2018); sitede öne çıkarılmıyor.
- Kullanılabilir bir fotoğraf arşivi yok. Ubeyd fotoğrafçılığa meraklı, ancak bu iş için görsel vermedi — dolayısıyla fotoğrafçılık siteye görsel malzeme olarak giremez; yalnızca biyografide bir ilgi alanı olarak geçebilir.

## Product Principles

1. **Her iddia bir sevkiyata dayanır.** Sayı, referans, metrik veya ödül uydurulmaz; kanıt yoksa iddia da yoktur.
2. **Temsil doğruluğu, ikna etmekten önce gelir.** Bu bir satış sayfası değil; abartı, sitenin asıl işini bozar.
3. **Sıfır bağımlılık ve build adımsızlık korunur.** Bir çözüm framework gerektiriyorsa, yanlış çözümdür.
4. **Genişlik ana varlıktır.** Birbiriyle akraba olmayan işlerin bir arada duruşu, tek tek projelerden daha güçlü bir gerçektir; tasarım bunu görünür kılmalı.
5. **Türkçe ve İngilizce eşit vatandaştır.** Hiçbir düzen kararı bir dili diğerinin artığı haline getirmez.
6. **Makineler de birer okuyucu.** JSON-LD, `llms.txt` ve semantik markup, görsel katman değiştiğinde bile ayakta kalır.
