#!/usr/bin/env node
/**
 * Sitedeki her sayısal iddiayı gerçek DOM sayımıyla karşılaştırır.
 *
 * Neden var: sayaçlar elle tutulduğu için proje/yazı eklendiğinde bayatlıyor
 * ve tarayan kişi hangi sayaçların var olduğunu hatırlamak zorunda kalıyor.
 * Bu script hatırlamaya dayanmaz — sayfaları tarar, "N kayıt / N proje /
 * N / N" kalıbındaki her sayıyı bulur ve karşılığını sayar.
 *
 * Kullanım:  node scripts/audit-counts.mjs
 * Çıkış kodu 1 ise tutarsızlık var.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFile(path.join(ROOT, f), 'utf8');

const count = (s, re) => (s.match(re) || []).length;

const sorunlar = [];
const kontroller = [];

function bak(dosya, etiket, bulunan, beklenen) {
  const ok = bulunan === beklenen;
  kontroller.push({ dosya, etiket, bulunan, beklenen, ok });
  if (!ok) sorunlar.push(`${dosya} · ${etiket}: ${bulunan} yazıyor, ${beklenen} olmalı`);
}

/**
 * Bir sayfadaki her bölüm başlığı sayacı. İki biçim var ve ikisi de
 * denetlenmeli: düz metin ("3.1 · 9 kayıt") ve öznitelikli
 * ("2.3 · <span data-count>9</span>"). İkincisi gözden kaçmıştı.
 */
function bolumSayaclari(dosya, html) {
  const heads = [...html.matchAll(/<h2 class="head[^>]*>(.*?)<small>(.*?)<\/small><\/h2>/gs)];
  for (let i = 0; i < heads.length; i++) {
    const kucuk = heads[i][2];
    const m = kucuk.match(/·\s*(?:<span data-count>)?(\d+)/);
    if (!m) continue;
    const bas = heads[i].index;
    const son = i + 1 < heads.length ? heads[i + 1].index : html.length;
    const seg = html.slice(bas, son);
    const gercek = count(seg, /entry__name|toc__num/g);
    const ad = heads[i][1].replace(/<[^>]*>/g, '').trim();
    if (gercek) bak(dosya, `bölüm "${ad}"`, Number(m[1]), gercek);
  }
}

const isler = [
  ['projects.html', 'tr'],
  ['en/projects.html', 'en'],
  ['bookmarks.html', 'tr'],
  ['en/bookmarks.html', 'en'],
  ['blog/index.html', 'tr'],
  ['en/blog/index.html', 'en'],
];

const gercek = {};

for (const [dosya] of isler) {
  const html = await read(dosya);
  bolumSayaclari(dosya, html);
  // data-count öznitelikleri
  const groups = [...html.matchAll(/<span data-count>(\d+)<\/span>/g)];
  if (groups.length) {
    const heads = [...html.matchAll(/<h2 class="head[^>]*>(.*?)<small>/g)];
    void heads;
  }
  // tally / total çifti
  const tally = html.match(/<span data-tally>(\d+)<\/span>/);
  const total = html.match(/<span data-total>(\d+)<\/span>/);
  const entries = count(html, /entry__name/g);
  if (tally) bak(dosya, 'data-tally', Number(tally[1]), entries);
  if (total) bak(dosya, 'data-total', Number(total[1]), entries);
  // Paydası hâlâ sabit metinse yakala
  const sabit = html.match(/data-tally>\d+<\/span>\s*\/\s*(\d+)/);
  if (sabit) sorunlar.push(`${dosya} · payda sabit metin (${sabit[1]}) — <span data-total> olmalı`);

  if (dosya === 'projects.html') {
    gercek.proje = entries;
    gercek.canli = count(html, /data-state="live"/g);
    gercek.wip = count(html, /data-state="wip"/g);
  }
  if (dosya === 'en/projects.html') gercek.enProje = entries;
  if (dosya === 'bookmarks.html') gercek.yerimi = count(html, /toc__num/g);
  if (dosya === 'blog/index.html') gercek.yazi = count(html, /class="entry"/g);
  if (dosya === 'en/blog/index.html') gercek.enYazi = count(html, /class="entry"/g);
}

/* İki dilin proje ve yazı sayısı eşit olmalı */
bak('en/projects.html', 'TR ile eşit proje sayısı', gercek.enProje, gercek.proje);
bak('en/blog/index.html', 'TR ile eşit yazı sayısı', gercek.enYazi, gercek.yazi);

/* Ana sayfa künyeleri */
const anasayfalar = [
  ['index.html', [
    [/(\d+) proje · (\d+) canlı, (\d+) geliştirmede/, ['proje', 'canlı', 'geliştirmede'], [gercek.proje, gercek.canli, gercek.wip]],
    [/Yer imi<\/th><td>(\d+) kayıt/, ['yer imi'], [gercek.yerimi]],
    [/Yazı<\/th><td>(\d+) kayıt/, ['yazı'], [gercek.yazi]],
    [/Bağlantılar<small>1\.2 · (\d+) kayıt/, ['bağlantı'], [null]],
  ]],
  ['en/index.html', [
    [/(\d+) projects · (\d+) live, (\d+) in progress/, ['projects', 'live', 'in progress'], [gercek.proje, gercek.canli, gercek.wip]],
    [/Bookmarks<\/th><td>(\d+) entries/, ['bookmarks'], [gercek.yerimi]],
    [/Posts<\/th><td>(\d+) entr/, ['posts'], [gercek.yazi]],
    [/<small>1\.2 · (\d+) entries/, ['links'], [null]],
  ]],
];

for (const [dosya, testler] of anasayfalar) {
  const html = await read(dosya);
  // Bağlantı sayısı sayfanın kendisinden
  const bi = html.search(/(Bağlantılar|<small>1\.2)/);
  const seg = html.slice(bi, html.indexOf('</ul>', bi));
  const baglanti = count(seg, /<li>/g);

  for (const [re, adlar, beklenenler] of testler) {
    const m = html.match(re);
    if (!m) { sorunlar.push(`${dosya} · desen bulunamadı: ${re}`); continue; }
    adlar.forEach((ad, i) => {
      const bek = beklenenler[i] === null ? baglanti : beklenenler[i];
      bak(dosya, ad, Number(m[i + 1]), bek);
    });
  }
}

/* llms.txt */
const llms = await read('llms.txt');
const mp = llms.match(/## Projeler \((\d+) — (\d+) canlı, (\d+) geliştirmede\)/);
if (mp) {
  bak('llms.txt', 'proje', Number(mp[1]), gercek.proje);
  bak('llms.txt', 'canlı', Number(mp[2]), gercek.canli);
  bak('llms.txt', 'geliştirmede', Number(mp[3]), gercek.wip);
} else sorunlar.push('llms.txt · proje başlığı bulunamadı');

const mb = llms.match(/## Blog \((\d+) yazı \/ (\d+) posts\)/);
if (mb) {
  bak('llms.txt', 'blog yazı', Number(mb[1]), gercek.yazi);
  bak('llms.txt', 'blog posts', Number(mb[2]), gercek.yazi);
} else sorunlar.push('llms.txt · blog başlığı bulunamadı');

const blogSatir = count(llms, /^- \*\*/gm);
bak('llms.txt', 'madde sayısı (proje + yazı)', blogSatir, gercek.proje + gercek.yazi);

/* sitemap: her URL'in dosyası var mı */
const sm = await read('sitemap.xml');
const locs = [...sm.matchAll(/<loc>https:\/\/ubeydgencer\.com\/(.*?)<\/loc>/g)].map((m) => m[1]);
const { existsSync } = await import('node:fs');
for (const loc of locs) {
  const adaylar = [loc || 'index.html', `${loc}.html`, `${loc}index.html`, `${loc.replace(/\/$/, '')}/index.html`];
  if (!adaylar.some((c) => existsSync(path.join(ROOT, c)))) sorunlar.push(`sitemap · /${loc} için dosya yok`);
}

/* Rapor */
console.log(`Gerçek: ${gercek.proje} proje (${gercek.canli} canlı, ${gercek.wip} geliştirmede) · ${gercek.yerimi} yer imi · ${gercek.yazi} yazı\n`);
for (const k of kontroller) {
  console.log(`  ${k.ok ? '✓' : '✗'} ${k.dosya.padEnd(20)} ${k.etiket.padEnd(34)} ${k.bulunan}${k.ok ? '' : ` → ${k.beklenen}`}`);
}
console.log();
if (sorunlar.length) {
  console.log(`${sorunlar.length} SORUN:`);
  sorunlar.forEach((s) => console.log(`  ✗ ${s}`));
  process.exit(1);
}
console.log(`${kontroller.length} kontrol, hepsi tutarlı.`);
