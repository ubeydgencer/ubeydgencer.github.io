import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rewriteHtml, validateManifest } from './short-links.mjs';

const target = 'https://example.com/?a=1&b=2#bolum';
const short = 'https://ubyd.link/kaynak';
const map = validateManifest({ [target]: { key: 'kaynak', shortLink: short } });

test('Sorgu, çapa, HTML karakterleri ve bağlantı davranışı korunur; ikinci çalıştırma değişiklik yapmaz', () => {
  const html = `<body><a class="source" href='${target.replace('&', '&amp;')}' target="_blank" rel="noopener">Kaynak</a></body>`;
  const first = rewriteHtml(html, map);
  assert.equal(first.output, `<body><a class="source" href="${short}" data-dest="https://example.com/?a=1&amp;b=2#bolum" target="_blank" rel="noopener">Kaynak</a></body>`);
  assert.equal(rewriteHtml(first.output, map).output, first.output);
  assert.equal(first.count, 1);
});

test('Yalnız gövdedeki gerçek dış bağlantılar değişir; dinleme bloğu da kapsamdadır', () => {
  const html = `<head><a href="${target}">Örnek</a></head><body>
  <!-- <a href="${target}">Yorum</a> -->
  <script>const example = '<a href="${target}">Örnek</a>';</script>
  <a href="/projects">İç</a><a href="https://ubeydgencer.com/blog/">İç</a>
  <a href="mailto:owner@example.com">E-posta</a><a href="tel:+90000">Telefon</a>
  <!-- dinle: scripts/tts.py yazar, elle düzenleme --><a href="${target}">Model</a><!-- /dinle -->
  </body>`;
  const result = rewriteHtml(html, map);
  assert.equal(result.count, 1);
  assert.equal(result.output.split(short).length - 1, 1);
  assert.ok(result.output.includes(`const example = '<a href="${target}">Örnek</a>'`));
});

test('Yeni hedef raporlanır; eşlemesiz kısa link ve tutarsız data-dest hata verir', () => {
  assert.deepEqual([...rewriteHtml('<body><a href="//other.example/path">Yeni</a></body>', map).missing], ['https://other.example/path']);
  assert.throws(() => rewriteHtml('<body><a href="https://ubyd.link/bilinmiyor">Eski</a></body>', map), /Asıl hedefi/);
  assert.throws(() => rewriteHtml(`<body><a href="https://example.com/" data-dest="${target}">Tutarsız</a></body>`, map), /uyuşmuyor/);
  assert.equal(rewriteHtml(`<body><a href="${short}">Bilinen</a></body>`, map).output, `<body><a href="${short}" data-dest="https://example.com/?a=1&amp;b=2#bolum">Bilinen</a></body>`);
});

test('Eşleme başka kısa link kökeni, döngü, kimlik bilgisi ve tekrarlanan kısa adı kabul etmez', () => {
  for (const invalid of [
    { [target]: { key: 'kaynak', shortLink: 'https://other.example/kaynak' } },
    { 'https://ubyd.link/kaynak': { key: 'kaynak', shortLink: short } },
    { 'https://user:password@example.com/': { key: 'kaynak', shortLink: short } },
    { [target]: { key: 'kaynak', shortLink: short }, 'https://other.example/': { key: 'kaynak', shortLink: short } },
  ]) assert.throws(() => validateManifest(invalid));
});
