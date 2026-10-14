#!/usr/bin/env node
// Projeler ve blog sayfalarındaki dış bağlantıları Dub kısa linklerine (ubyd.link) çevirir;
// tıklamalar Dub panelinde sayılır (ülke, şehir, cihaz, tarayıcı, gelinen sayfa — kişi kimliği değil).
//
//   DUB_API_KEY=dub_… node scripts/dub-links.mjs   LINKS'teki eksik kısa linkleri oluştur, HTML'i güncelle
//   node scripts/dub-links.mjs --check             anahtarsız: LINKS'te olup henüz çevrilmemiş bağlantı var mı
//
// Her bağlantının asıl adresi data-dest özniteliğinde kalır; bağlantı metni değişmez. Eşleme
// scripts/dub-links.json'da tutulur (gizli bilgi içermez). Bir adresin kısa linki bir kez oluşur,
// sonraki çalıştırmalar onu yeniden kullanır (PUT /links/upsert). Anahtar dosyaya hiç yazılmaz.
//
// Yalnız LINKS listesindeki adresler kısa linke çevrilir. Dub'ın ücretsiz planı ayda 25 yeni link
// izin verdiği için yeni bir adres kotayı kendiliğinden harcamaz: betik onu "listede yok" diye
// raporlar, takip edilmesi isteniyorsa LINKS'e elle eklenir.
//
// Kapsam: projects.html, en/projects.html, blog/ ve en/blog/. Ana sayfa, yer imleri (Raindrop
// senkronu her gün yeniden yazar) ve gizlilik sayfaları dışarıda; tts.py'nin yazdığı dinleme
// bloğuna, <head>'e ve JSON-LD'ye dokunulmaz.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const MAP_FILE = join(ROOT, 'scripts', 'dub-links.json');
const DOMAIN = 'ubyd.link';
const TAG = 'ubeydgencer.com';
const OWN = /^https?:\/\/(www\.)?ubeydgencer\.com(\/|$)/;
const INCLUDE = /^(en\/)?(projects\.html|blog\/[^/]+\.html)$/;
const DINLE = /<!-- dinle:[\s\S]*?<!-- \/dinle -->/g;

// Takip edilen adresler → kısa ad (ubyd.link/<ad>)
const LINKS = {
  'https://acsa-depo.vercel.app': 'acsa-depo',
  'https://cooltronic.acsagroup.com': 'cooltronic',
  'https://zeliox.acsagroup.com': 'zeliox',
  'https://indelb.acsagroup.com': 'indelb',
  'https://dellapianto.com': 'dellapianto',
  'https://eyesofia.com': 'eyesofia',
  'https://qayyo.com': 'qayyo',
  'https://qayyo-yonetim.onrender.com': 'qayyo-erp',
  'https://haramainnews.com': 'haramain',
  'https://world-cup-26-sja.pages.dev': 'worldcup26',
  'https://ikizyapi.com': 'ikizyapi',
  'https://ulukalekoyu.com': 'ulukale',
  'https://www.kirogluhukuk.com': 'kiroglu',
  'https://gerede-tez.pages.dev': 'gerede-tez',
  'https://www.ugotomotiv.com': 'ugoto',
  'https://play.google.com/store/apps/details?id=com.fragmania': 'fragmania',
  'https://istima.ubeydgencer.com': 'istima',
  'https://chromewebstore.google.com/detail/idnhjopkmlgdhipcfplknfdfpkcehhle': 'istima-chrome',
  'https://github.com/ubeydgencer/istima': 'gh-istima',
  'https://github.com/ubeydgencer/ucusa-hazir': 'gh-ucusa-hazir',
  'https://github.com/ubeydgencer/mil-pusulasi': 'gh-mil-pusulasi',
  'https://github.com/ubeydgencer/flightops-quality': 'gh-flightops',
  'https://yemen.ubeydgencer.com': 'yemen',
  // Kota açılınca eklenebilecek blog kaynakları (şimdilik takipsiz):
  // 'https://huggingface.co/cloud0day3/antalia-mini': 'antalia-mini',
  // 'https://huggingface.co/canberkkkkkk/ema-lightning': 'ema-lightning',
  // 'https://www.aljazeera.com/news/2026/8/24/yemens-houthis-report-attack-on-saudi-ship': 'aljazeera-husi-gemi',
  // 'https://www.aljazeera.com/news/2026/9/10/yemens-houthis-seize-strategic-red-sea-city-of-mocha': 'aljazeera-mocha',
};

const check = process.argv.includes('--check');
const token = process.env.DUB_API_KEY;
if (!check && !token) {
  console.error('DUB_API_KEY ortam değişkeni gerekli (ya da --check ile çalıştır).');
  process.exit(2);
}

async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await htmlFiles(p));
    else if (INCLUDE.test(relative(ROOT, p))) out.push(p);
  }
  return out;
}

// <a … href="dış adres" …>: henüz kısa linke çevrilmemiş (data-dest taşımayan) dış bağlantılar
const ANCHOR = /<a\b([^>]*?)\bhref="(https?:\/\/[^"]+)"([^>]*)>/g;
function external(tagAttrs, href) {
  return !OWN.test(href) && !href.startsWith(`https://${DOMAIN}/`) && !/\bdata-dest=/.test(tagAttrs);
}

/** HTML'in yalnız gövdesinde, dinleme bloğu dışında kalan kısımlarına fn uygula. */
function inBody(html, fn) {
  const start = html.indexOf('<body');
  if (start < 0) return html;
  const head = html.slice(0, start);
  let body = html.slice(start);
  const blocks = [];
  body = body.replace(DINLE, (m) => `\u0000${blocks.push(m) - 1}\u0000`);
  body = fn(body);
  body = body.replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[Number(i)]);
  return head + body;
}

async function api(path, body, method = body ? 'POST' : 'GET') {
  const res = await fetch(`https://api.dub.co${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status} ${JSON.stringify(data).slice(0, 300)}`);
  return data;
}

async function tagId() {
  const tags = await api('/tags');
  const hit = tags.find((t) => t.name === TAG);
  return hit ? hit.id : (await api('/tags', { name: TAG, color: 'blue' })).id;
}

const map = JSON.parse(await readFile(MAP_FILE, 'utf8').catch(() => '{}'));
const files = await htmlFiles(ROOT);

// 1. Takipsiz dış bağlantıları topla
const pending = new Map();
for (const f of files) {
  const html = await readFile(f, 'utf8');
  inBody(html, (body) => {
    for (const m of body.matchAll(ANCHOR)) {
      if (external(m[1] + m[3], m[2])) {
        if (!pending.has(m[2])) pending.set(m[2], new Set());
        pending.get(m[2]).add(relative(ROOT, f));
      }
    }
    return body;
  });
}

const listed = [...pending.keys()].filter((u) => LINKS[u]);
const unlisted = [...pending.keys()].filter((u) => !LINKS[u]);
if (unlisted.length) {
  console.log(`Listede olmadığı için takipsiz ${unlisted.length} dış bağlantı:`);
  for (const u of unlisted) console.log(`  ${u}  (${[...pending.get(u)].join(', ')})`);
}
if (check) {
  if (!listed.length) { console.log('LINKS listesindeki bütün bağlantılar kısa linkli.'); process.exit(0); }
  console.log(`Kısa linke çevrilmemiş ${listed.length} bağlantı:`);
  for (const u of listed) console.log(`  ${u}${map[u] ? ' (eşlemede var)' : ''}`);
  process.exit(1);
}

// 2. Eksik kısa linkleri oluştur (upsert: aynı adres için var olanı döndürür)
let tag;
for (const url of listed) {
  if (map[url]) continue;
  tag ??= await tagId();
  const key = LINKS[url];
  const link = await api('/links/upsert', { url, domain: DOMAIN, key, tagIds: [tag], comments: 'ubeydgencer.com dış bağlantısı' }, 'PUT');
  map[url] = { key: link.key, shortLink: link.shortLink, id: link.id };
  console.log(`+ ${link.shortLink}  →  ${url}`);
}
const sorted = Object.fromEntries(Object.entries(map).sort(([, a], [, b]) => a.key.localeCompare(b.key)));
await writeFile(MAP_FILE, JSON.stringify(sorted, null, 1) + '\n');

// 3. HTML'i güncelle
let changed = 0;
for (const f of files) {
  const html = await readFile(f, 'utf8');
  const out = inBody(html, (body) => body.replace(ANCHOR, (whole, pre, href, post) => {
    if (!external(pre + post, href) || !map[href]) return whole;
    return `<a${pre}href="${map[href].shortLink}" data-dest="${href}"${post}>`;
  }));
  if (out !== html) { await writeFile(f, out); changed++; console.log(`~ ${relative(ROOT, f)}`); }
}
console.log(`${Object.keys(map).length} kısa link · ${changed} dosya güncellendi`);
