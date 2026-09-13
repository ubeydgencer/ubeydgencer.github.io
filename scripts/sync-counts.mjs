#!/usr/bin/env node
/**
 * Sitedeki bütün sayaçların tek kaynağı.
 *
 * Gerçeği içerikten sayar (kaç proje, kaçı canlı, kaç yer imi, kaç yazı)
 * ve bu sayıyı gösteren her yeri yeniden yazar. Elle tutulan sayaç kalmasın
 * diye var: proje ya da yazı eklendiğinde on ayrı yerde sayı güncellemek
 * gerekiyordu ve biri mutlaka unutuluyordu.
 *
 *   node scripts/sync-counts.mjs           yaz
 *   node scripts/sync-counts.mjs --check   yazma, tutarsızlık varsa çıkış 1
 *
 * Yeni bir sayaç eklersen SAYAÇLAR listesine bir satır ekle; başka yeri
 * değiştirmen gerekmez.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const QUIET = process.argv.includes('--quiet');

const oku = (f) => readFile(path.join(ROOT, f), 'utf8');
const say = (s, re) => (s.match(re) || []).length;

/* ─────────── 1. Gerçeği içerikten say ─────────── */

const projects = await oku('projects.html');
const bookmarks = await oku('bookmarks.html');
const blog = await oku('blog/index.html');
const home = await oku('index.html');

const bi = home.indexOf('Bağlantılar<small>');
const G = {
  proje: say(projects, /entry__name/g),
  canli: say(projects, /data-state="live"/g),
  wip: say(projects, /data-state="wip"/g),
  yerimi: say(bookmarks, /toc__num/g),
  yazi: say(blog, /class="entry"/g),
  baglanti: say(home.slice(bi, home.indexOf('</ul>', bi)), /<li>/g),
};

/* ─────────── 2. Sayacın bulunduğu her yer ─────────── */

const S = (dosya, etiket, re, deger) => ({ dosya, etiket, re, deger: String(deger) });

const SAYAÇLAR = [
  // Ana sayfa künyeleri
  S('index.html', 'künye proje', /(<td>)\d+( proje · )\d+( canlı, )\d+( geliştirmede<\/td>)/,
    `$1${G.proje}$2${G.canli}$3${G.wip}$4`),
  S('index.html', 'künye yer imi', /(Yer imi<\/th><td>)\d+( kayıt)/, `$1${G.yerimi}$2`),
  S('index.html', 'künye yazı', /(Yazı<\/th><td>)\d+( kayıt)/, `$1${G.yazi}$2`),
  S('index.html', 'bağlantı başlığı', /(Bağlantılar<small>1\.2 · )\d+( kayıt)/, `$1${G.baglanti}$2`),

  S('en/index.html', 'künye proje', /(<td>)\d+( projects · )\d+( live, )\d+( in progress<\/td>)/,
    `$1${G.proje}$2${G.canli}$3${G.wip}$4`),
  S('en/index.html', 'künye yer imi', /(Bookmarks<\/th><td>)\d+( entries)/, `$1${G.yerimi}$2`),
  S('en/index.html', 'künye yazı', /(Posts<\/th><td>)\d+( entr)/, `$1${G.yazi}$2`),
  S('en/index.html', 'bağlantı başlığı', /(<small>1\.2 · )\d+( entries)/, `$1${G.baglanti}$2`),

  // Blog dizinleri
  S('blog/index.html', 'yazı sayısı', /(4\.1 · )\d+( kayıt)/, `$1${G.yazi}$2`),
  S('en/blog/index.html', 'yazı sayısı', /(4\.1 · )\d+( entries)/, `$1${G.yazi}$2`),

  // llms.txt
  S('llms.txt', 'proje başlığı', /(## Projeler \()\d+( — )\d+( canlı, )\d+( geliştirmede\))/,
    `$1${G.proje}$2${G.canli}$3${G.wip}$4`),
  S('llms.txt', 'blog başlığı', /(## Blog \()\d+( yazı \/ )\d+( posts\))/, `$1${G.yazi}$2${G.yazi}$3`),
];

/* ─────────── 3. Sayfa içi otomatik sayaçlar ─────────── */
/* Bölüm başlıkları ve tally/total, o sayfanın kendi içeriğinden sayılır. */

const SAYFALAR = ['projects.html', 'en/projects.html', 'bookmarks.html', 'en/bookmarks.html',
                  'blog/index.html', 'en/blog/index.html'];

function sayfaIciDuzelt(dosya, html) {
  const notlar = [];

  // Bölüm başlıkları: "· N birim" ve "· <span data-count>N</span>"
  const heads = [...html.matchAll(/<h2 class="head[^>]*>(.*?)<small>(.*?)<\/small><\/h2>/gs)];
  for (let i = heads.length - 1; i >= 0; i--) {
    const [tam, ad, kucuk] = heads[i];
    const bas = heads[i].index;
    const son = i + 1 < heads.length ? heads[i + 1].index : html.length;
    const gercek = say(html.slice(bas, son), /entry__name|toc__num/g);
    if (!gercek) continue;

    const yeniKucuk = kucuk
      .replace(/(·\s*<span data-count>)\d+(<\/span>)/, `$1${gercek}$2`)
      .replace(/(·\s*)\d+(\s)/, `$1${gercek}$2`);
    if (yeniKucuk === kucuk) continue;

    const yeniTam = `<h2 class="head${tam.slice(tam.indexOf('class="head') + 11, tam.indexOf('>'))}>${ad}<small>${yeniKucuk}</small></h2>`;
    html = html.slice(0, bas) + yeniTam + html.slice(bas + tam.length);
    notlar.push(`bölüm "${ad.replace(/<[^>]*>/g, '').trim()}" → ${gercek}`);
  }

  // Filtre sayacı
  const entries = say(html, /entry__name/g);
  for (const [attr, deger] of [['data-tally', entries], ['data-total', entries]]) {
    const re = new RegExp(`(<span ${attr}>)\\d+(</span>)`);
    if (re.test(html)) {
      const yeni = html.replace(re, `$1${deger}$2`);
      if (yeni !== html) { notlar.push(`${attr} → ${deger}`); html = yeni; }
    }
  }
  // Payda sabit metin kalmışsa uyar
  if (/data-tally>\d+<\/span>\s*\/\s*\d+/.test(html)) {
    notlar.push('UYARI: payda sabit metin, <span data-total> olmalı');
  }
  return { html, notlar };
}

/* ─────────── 4. Uygula ─────────── */

const degisen = [];
const sorun = [];

// Sayfa içi
for (const dosya of SAYFALAR) {
  const eski = await oku(dosya);
  const { html, notlar } = sayfaIciDuzelt(dosya, eski);
  const uyarilar = notlar.filter((n) => n.startsWith('UYARI'));
  const duzeltmeler = notlar.filter((n) => !n.startsWith('UYARI'));
  uyarilar.forEach((u) => sorun.push(`${dosya} · ${u}`));
  if (html !== eski) {
    degisen.push(`${dosya}: ${duzeltmeler.join(', ')}`);
    if (!CHECK) await writeFile(path.join(ROOT, dosya), html);
  }
}

// Adlı sayaçlar
const gruplu = new Map();
for (const s of SAYAÇLAR) {
  if (!gruplu.has(s.dosya)) gruplu.set(s.dosya, []);
  gruplu.get(s.dosya).push(s);
}
for (const [dosya, liste] of gruplu) {
  let html = await oku(dosya);
  const eski = html;
  const yerel = [];
  for (const { etiket, re, deger } of liste) {
    if (!re.test(html)) { sorun.push(`${dosya} · "${etiket}" deseni bulunamadı`); continue; }
    const yeni = html.replace(re, deger);
    if (yeni !== html) { yerel.push(etiket); html = yeni; }
  }
  if (html !== eski) {
    degisen.push(`${dosya}: ${yerel.join(', ')}`);
    if (!CHECK) await writeFile(path.join(ROOT, dosya), html);
  }
}

/* ─────────── 5. Tutarlılık kontrolleri (yazılamayan, yalnız bildirilen) ─────────── */

const enProjects = await oku('en/projects.html');
const enBlog = await oku('en/blog/index.html');
if (say(enProjects, /entry__name/g) !== G.proje)
  sorun.push(`en/projects.html ${say(enProjects, /entry__name/g)} proje içeriyor, TR ${G.proje} — bir proje iki dile de eklenmemiş`);
if (say(enBlog, /class="entry"/g) !== G.yazi)
  sorun.push(`en/blog/index.html ${say(enBlog, /class="entry"/g)} yazı içeriyor, TR ${G.yazi}`);

const llms = await oku('llms.txt');
const madde = say(llms, /^- \*\*/gm);
if (madde !== G.proje + G.yazi)
  sorun.push(`llms.txt ${madde} madde içeriyor, ${G.proje + G.yazi} olmalı (${G.proje} proje + ${G.yazi} yazı)`);

const sitemap = await oku('sitemap.xml');
for (const m of sitemap.matchAll(/<loc>https:\/\/ubeydgencer\.com\/(.*?)<\/loc>/g)) {
  const loc = m[1];
  const adaylar = [loc || 'index.html', `${loc}.html`, `${loc}index.html`, `${loc.replace(/\/$/, '')}/index.html`];
  if (!adaylar.some((c) => existsSync(path.join(ROOT, c)))) sorun.push(`sitemap · /${loc} için dosya yok`);
}

/* ─────────── 6. Rapor ─────────── */

if (!QUIET) {
  console.log(`Gerçek: ${G.proje} proje (${G.canli} canlı, ${G.wip} geliştirmede) · ${G.yerimi} yer imi · ${G.yazi} yazı · ${G.baglanti} bağlantı\n`);
}

if (degisen.length) {
  console.log(CHECK ? 'BAYAT SAYAÇ:' : 'Güncellendi:');
  degisen.forEach((d) => console.log(`  ${CHECK ? '✗' : '·'} ${d}`));
}
if (sorun.length) {
  if (degisen.length) console.log();
  console.log('Elle bakılmalı:');
  sorun.forEach((s) => console.log(`  ✗ ${s}`));
}
if (!degisen.length && !sorun.length && !QUIET) console.log('Bütün sayaçlar tutarlı.');

process.exit((CHECK && degisen.length) || sorun.length ? 1 : 0);
