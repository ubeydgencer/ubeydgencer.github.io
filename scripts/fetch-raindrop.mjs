#!/usr/bin/env node
/**
 * Raindrop.io'dan yer imlerini çekip bookmarks.html ve en/bookmarks.html
 * içindeki işaretli bölümü yeniden yazar.
 *
 * Token tarayıcıya gitmez: bu script yalnızca derleme sırasında çalışır
 * (GitHub Actions'ta RAINDROP_TOKEN secret'ı, yerelde .env dosyası).
 *
 * Kullanım:
 *   RAINDROP_TOKEN=xxx node scripts/fetch-raindrop.mjs
 *   node scripts/fetch-raindrop.mjs --list     # hesaptaki koleksiyonları listele
 *   node scripts/fetch-raindrop.mjs --dry-run  # dosyaya yazmadan çıktıyı göster
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* ----------------------------------------------------------------------
 * AYAR — Raindrop'taki koleksiyon adlarını değiştirdiysen burayı güncelle.
 * `title` Raindrop'taki adla birebir eşleşmeli (büyük/küçük harf önemsiz).
 * `tr` / `en` sayfadaki bölüm başlığı, `tone` ise renk şeridi.
 * Ton seçenekleri: t-yellow, t-orange, t-teal, t-grass, t-sienna, t-violet, t-ultra
 * -------------------------------------------------------------------- */
const COLLECTIONS = [
  { title: 'Bookmark',  tr: 'Yer İmleri',    en: 'Bookmarks', tone: 't-ultra'  },
  { title: 'Product',   tr: 'Ürünler',       en: 'Products',  tone: 't-grass'  },
  { title: 'Wish List', tr: 'İstek Listesi', en: 'Wish List', tone: 't-orange' },
];

const SECTION = 3;          // Yer İmleri kılavuzda 3. bölüm
const API = 'https://api.raindrop.io/rest/v1';
const START = '<!-- raindrop:start -->';
const END = '<!-- raindrop:end -->';

const args = new Set(process.argv.slice(2));
const LIST_ONLY = args.has('--list');
const DRY_RUN = args.has('--dry-run');

/* .env dosyasını oku (yerel çalıştırma için; Actions'ta env zaten dolu) */
async function loadDotEnv() {
  const file = path.join(ROOT, '.env');
  if (!existsSync(file)) return;
  const text = await readFile(file, 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, '');
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}

/**
 * Token'ın kendisini değil, yalnızca biçimini anlatır — log'a sızmaz.
 * Dikkat: Raindrop'ta test token, Client ID ve Client Secret'ın üçü de
 * UUID biçiminde. Yani biçim doğru olması doğru değeri kopyaladığını
 * göstermez; ayırt etmenin tek yolu API'ye sormak.
 */
function describeToken(t) {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (t !== t.trim()) return "başında/sonunda boşluk veya satır sonu var — secret'ı yeniden yapıştır";
  if (uuid.test(t)) return `UUID (${t.length} karakter) — ama Client Secret de böyle görünür, bu ayırt etmez`;
  return `UUID değil (${t.length} karakter) — test token beklenen biçimde değil`;
}

async function api(pathname, token) {
  const res = await fetch(`${API}${pathname}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    /* Raindrop'un kendi mesajı sebebi söylüyor; token içermez, log'a güvenli. */
    const body = await res.text().catch(() => '');
    throw new Error(
      'Token geçersiz veya süresi dolmuş (401).\n' +
        `  Raindrop yanıtı: ${body.slice(0, 300) || '(boş)'}\n` +
        `  İstek: ${pathname}\n` +
        `  Token biçimi: ${describeToken(token)}\n\n` +
        '  En sık sebep: Client Secret kopyalanmış oluyor. O da UUID biçiminde\n' +
        '  olduğu için gözle ayırt edilmiyor ama API kabul etmiyor.\n\n' +
        '  Doğrusu: app.raindrop.io/settings/integrations → uygulamanı aç →\n' +
        '  sayfayı en alta kaydır → "Create test token" butonu.\n' +
        '  Client ID / Client Secret alanları DEĞİL.',
    );
  }
  if (res.status === 429) throw new Error('Raindrop hız sınırı aşıldı (429). Biraz bekleyip tekrar dene.');
  if (!res.ok) throw new Error(`Raindrop ${res.status} ${res.statusText} — ${pathname}`);
  return res.json();
}

/** Kök ve alt koleksiyonların tamamı */
async function allCollections(token) {
  const [root, children] = await Promise.all([
    api('/collections', token),
    api('/collections/childrens', token),
  ]);
  return [...(root.items || []), ...(children.items || [])];
}

/** Bir koleksiyondaki tüm yer imleri (sayfa sayfa; perpage üst sınırı 50) */
async function allRaindrops(id, token) {
  const out = [];
  for (let page = 0; page < 40; page++) {
    const data = await api(`/raindrops/${id}?perpage=50&page=${page}&sort=-created`, token);
    const items = data.items || [];
    out.push(...items);
    if (out.length >= (data.count ?? data.total ?? 0) || items.length < 50) break;
  }
  return out;
}

const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function hostOf(link) {
  try {
    return new URL(link).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function renderSection(group, items, index, lang) {
  const label = lang === 'en' ? group.en : group.tr;
  const unit = lang === 'en' ? (items.length === 1 ? 'entry' : 'entries') : 'kayıt';
  const num = `${SECTION}.${index + 1}`;

  const rows = items
    .map((item, i) => {
      const host = hostOf(item.link);
      const favicon = host
        ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&amp;sz=64`
        : '';
      const mark = favicon
        ? `\n            <img class="mark" src="${favicon}" alt="" width="16" height="16" loading="lazy" referrerpolicy="no-referrer" />`
        : '';
      return `          <li><a href="${escapeHtml(item.link)}" target="_blank" rel="noopener">
            <span class="toc__num">${num}.${i + 1}</span>${mark}
            <span class="toc__name">${escapeHtml(item.title || host || item.link)}</span>
            <span class="toc__lead" aria-hidden="true"></span>
            <span class="toc__val">${escapeHtml(host)}</span>
          </a></li>`;
    })
    .join('\n');

  return `    <h2 class="head ${group.tone}">${escapeHtml(label)}<small>${num} · ${items.length} ${unit}</small></h2>
    <section class="${group.tone}">
      <ul class="toc">
${rows}
      </ul>
    </section>`;
}

function patch(html, block, file) {
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start === -1 || end === -1) {
    throw new Error(`${file} içinde ${START} / ${END} işaretleri bulunamadı.`);
  }
  return html.slice(0, start + START.length) + '\n' + block + '\n    ' + html.slice(end);
}

async function main() {
  await loadDotEnv();
  const token = process.env.RAINDROP_TOKEN;

  if (!token) {
    console.error(
      'HATA: RAINDROP_TOKEN yok.\n\n' +
        '  Yerelde  : proje kökünde .env dosyası aç, içine RAINDROP_TOKEN=... yaz\n' +
        '  Actions  : repo ayarlarında Settings → Secrets → Actions → RAINDROP_TOKEN\n\n' +
        'Token: https://app.raindrop.io/settings/integrations → uygulama oluştur → Test token',
    );
    process.exit(1);
  }

  const collections = await allCollections(token);

  if (LIST_ONLY) {
    console.log('Hesaptaki koleksiyonlar:\n');
    for (const c of collections) {
      console.log(`  ${String(c.count).padStart(4)} kayıt  ·  ${c.title}   (id: ${c._id})`);
    }
    return;
  }

  const byTitle = new Map(collections.map((c) => [c.title.trim().toLowerCase(), c]));
  const missing = [];
  const found = [];

  for (const group of COLLECTIONS) {
    const hit = byTitle.get(group.title.trim().toLowerCase());
    if (!hit) missing.push(group.title);
    else found.push({ group, collection: hit });
  }

  if (missing.length) {
    console.error(
      `HATA: Şu koleksiyonlar hesapta bulunamadı: ${missing.join(', ')}\n` +
        `Mevcut adlar: ${collections.map((c) => c.title).join(', ')}\n\n` +
        'scripts/fetch-raindrop.mjs içindeki COLLECTIONS listesini düzelt.',
    );
    process.exit(1);
  }

  const data = [];
  for (const { group, collection } of found) {
    const items = await allRaindrops(collection._id, token);
    console.log(`${group.title}: ${items.length} kayıt`);
    data.push({ group, items });
  }

  const total = data.reduce((n, d) => n + d.items.length, 0);

  for (const [file, lang] of [['bookmarks.html', 'tr'], ['en/bookmarks.html', 'en']]) {
    const full = path.join(ROOT, file);
    const html = await readFile(full, 'utf8');
    const block = data.map((d, i) => renderSection(d.group, d.items, i, lang)).join('\n\n');
    const next = patch(html, block, file);
    if (DRY_RUN) {
      console.log(`\n--- ${file} (dry-run) ---\n${block.slice(0, 1200)}\n…`);
      continue;
    }
    if (next === html) {
      console.log(`${file}: değişiklik yok`);
      continue;
    }
    await writeFile(full, next);
    console.log(`${file}: güncellendi`);
  }

  /* Ana sayfa künyesindeki yer imi sayacı. Elle tutulursa her senkronda
     bayatlıyor; kaynağı burası olduğu için buradan yazılır. */
  if (!DRY_RUN) {
    for (const [file, re] of [
      ['index.html', /(<th scope="row">Yer imi<\/th><td>)\d+( kayıt<\/td>)/],
      ['en/index.html', /(<th scope="row">Bookmarks<\/th><td>)\d+( entries<\/td>)/],
    ]) {
      const full = path.join(ROOT, file);
      const html = await readFile(full, 'utf8');
      if (!re.test(html)) {
        console.warn(`UYARI: ${file} içinde yer imi sayacı bulunamadı, atlandı.`);
        continue;
      }
      const next = html.replace(re, `$1${total}$2`);
      if (next !== html) {
        await writeFile(full, next);
        console.log(`${file}: yer imi sayacı ${total}`);
      }
    }
  }

  /* sitemap.xml — yalnızca iki yer imi sayfasının lastmod'u */
  if (!DRY_RUN) {
    const file = path.join(ROOT, 'sitemap.xml');
    let xml = await readFile(file, 'utf8');
    const today = new Date().toISOString().slice(0, 10);
    for (const loc of ['https://ubeydgencer.com/bookmarks', 'https://ubeydgencer.com/en/bookmarks']) {
      const re = new RegExp(
        `(<loc>${loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>[\\s\\S]*?<lastmod>)(.*?)(</lastmod>)`,
      );
      xml = xml.replace(re, `$1${today}$3`);
    }
    await writeFile(file, xml);
    console.log(`sitemap.xml: lastmod ${today}`);
  }

  /* Ham veri — llms.txt veya başka bir yerde lazım olursa diye */
  if (!DRY_RUN) {
    const json = {
      updated: new Date().toISOString(),
      total,
      collections: data.map((d) => ({
        title: d.group.title,
        count: d.items.length,
        items: d.items.map((i) => ({
          title: i.title,
          link: i.link,
          domain: hostOf(i.link),
          created: i.created,
        })),
      })),
    };
    await writeFile(path.join(ROOT, 'assets/bookmarks.json'), JSON.stringify(json, null, 2) + '\n');
    console.log(`assets/bookmarks.json: ${total} kayıt yazıldı`);
  }
}

main().catch((err) => {
  console.error(`HATA: ${err.message}`);
  process.exit(1);
});
