#!/usr/bin/env node
// Giriş, projeler ve blogun iki dilindeki bütün HTTP(S) dış bağlantıları kapsar.
// Eşleme yereldir; Dub API'sine ya da yönetim panelinin kimlik bilgilerine ihtiyaç yoktur.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://ubyd.link';
const OWN_HOSTS = new Set(['ubeydgencer.com', 'www.ubeydgencer.com']);
const SHORT_HOSTS = new Set(['ubyd.link', 'admin.ubyd.link']);
const ATTRIBUTE = /\s+([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
// Script, stil ve yorumlar tek parça tutulur: içlerindeki HTML örnekleri bağlantı değildir.
const TOKEN = /<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script\s*>|<style\b[^>]*>[\s\S]*?<\/style\s*>|<[^>"']*(?:"[^"]*"[^>"']*|'[^']*'[^>"']*)*>/gi;

const decode = (text) => text.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (whole, entity) => {
  if (entity[0] === '#') {
    const n = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : whole;
  }
  return { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[entity.toLowerCase()];
});
const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function externalUrl(value) {
  const url = new URL(value, 'https://ubeydgencer.com/');
  if (!['https:', 'http:'].includes(url.protocol) || OWN_HOSTS.has(url.hostname)) return null;
  return url;
}

export function validateManifest(data) {
  const map = new Map();
  const keys = new Set();
  for (const [target, entry] of Object.entries(data)) {
    const url = externalUrl(target);
    if (!url || url.href !== target || url.username || url.password || SHORT_HOSTS.has(url.hostname)) {
      throw new Error(`Eşlemede geçersiz hedef: ${target}`);
    }
    if (!/^[a-z0-9][a-z0-9_-]*$/.test(entry.key) || keys.has(entry.key) || entry.shortLink !== `${ORIGIN}/${entry.key}`) {
      throw new Error(`Eşlemede geçersiz veya tekrarlanan kısa ad: ${target}`);
    }
    keys.add(entry.key);
    map.set(target, entry);
  }
  return map;
}

export function rewriteHtml(html, map) {
  const missing = new Set();
  const destinations = new Set();
  let count = 0;
  let inBody = false;
  const output = html.replace(TOKEN, (tag) => {
    if (/^<body(?:\s|>)/i.test(tag)) inBody = true;
    if (/^<\/body\s*>/i.test(tag)) inBody = false;
    if (!inBody || !/^<a(?:\s|>)/i.test(tag)) return tag;
    const attrs = new Map();
    for (const m of tag.matchAll(ATTRIBUTE)) {
      const name = m[1].toLowerCase();
      if (attrs.has(name)) throw new Error(`Tekrarlanan bağlantı özniteliği: ${name}`);
      attrs.set(name, { value: decode(m[2] ?? m[3] ?? m[4] ?? ''), raw: m[0], index: m.index });
    }
    const href = attrs.get('href');
    if (!href) return tag;
    const url = externalUrl(href.value);
    if (!url) return tag;
    const original = attrs.get('data-dest');
    const entryForShort = [...map.entries()].find(([, entry]) => entry.shortLink === url.href);
    const target = SHORT_HOSTS.has(url.hostname)
      ? (original ? externalUrl(original.value)?.href : entryForShort?.[0])
      : url.href;
    if (!target || SHORT_HOSTS.has(new URL(target).hostname)) throw new Error(`Asıl hedefi bulunamayan kısa link: ${href.value}`);
    if (original && externalUrl(original.value)?.href !== target) throw new Error(`href / data-dest uyuşmuyor: ${href.value}`);
    count++;
    destinations.add(target);
    const entry = map.get(target);
    if (!entry) { missing.add(target); return tag; }
    const replacement = ` href="${entry.shortLink}"${original ? '' : ` data-dest="${escape(target)}"`}`;
    return tag.slice(0, href.index) + replacement + tag.slice(href.index + href.raw.length);
  });
  return { output, missing, destinations, count };
}

async function htmlFiles() {
  const files = ['index.html', 'en/index.html', 'projects.html', 'en/projects.html'];
  for (const dir of ['blog', 'en/blog']) {
    for (const name of await readdir(join(ROOT, dir))) if (name.endsWith('.html')) files.push(`${dir}/${name}`);
  }
  return files.sort();
}

async function main() {
  const args = new Set(process.argv.slice(2));
  if ([...args].some((arg) => !['--check', '--plan', '--verify'].includes(arg)) || (args.has('--plan') && args.size > 1)) {
    throw new Error('Kullanım: node scripts/short-links.mjs [--check] [--verify] veya --plan');
  }
  const map = validateManifest(JSON.parse(await readFile(join(ROOT, 'scripts/short-links.json'), 'utf8')));
  const changes = [];
  const missing = new Set();
  const destinations = new Set();
  let count = 0;
  const files = await htmlFiles();
  for (const file of files) {
    const html = await readFile(join(ROOT, file), 'utf8');
    const result = rewriteHtml(html, map);
    count += result.count;
    for (const target of result.missing) missing.add(target);
    for (const target of result.destinations) destinations.add(target);
    if (html !== result.output) changes.push({ file, output: result.output });
  }
  if (args.has('--plan')) {
    // Panelin CSV içe aktarmasına uygundur. Önerilen kısa ad istenirse değiştirilebilir.
    const csv = (value) => `"${value.replace(/"/g, '""')}"`;
    console.log('slug,url,tags,comments');
    for (const target of [...missing].sort()) {
      const key = `site-${createHash('sha256').update(target).digest('hex').slice(0, 12)}`;
      console.log([key, target, 'ubeydgencer.com', 'ubeydgencer.com dış bağlantısı'].map(csv).join(','));
    }
    return;
  }
  if (missing.size) throw new Error(`Önce panelde oluşturup short-links.json'a ekleyin (${missing.size} hedef):\n${[...missing].sort().join('\n')}\nCSV için: node scripts/short-links.mjs --plan`);
  if (args.has('--verify')) {
    for (const target of destinations) {
      const entry = map.get(target);
      const response = await fetch(entry.shortLink, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(10_000) });
      const location = response.headers.get('location');
      if (response.status !== 302 || !location || new URL(location).href !== target) {
        throw new Error(`Canlı hedef uyuşmuyor: ${entry.shortLink} → ${response.status} ${response.headers.get('location')}`);
      }
    }
    console.log(`${destinations.size} canlı yönlendirme doğrulandı (HEAD; tıklama sayılmaz).`);
  }
  if (args.has('--check')) {
    if (changes.length) throw new Error(`Kısa linke çevrilmemiş bağlantılar var: ${changes.map((c) => c.file).join(', ')}`);
  } else {
    for (const { file, output } of changes) {
      await writeFile(join(ROOT, file), output);
      console.log(`~ ${file}`);
    }
  }
  console.log(`${files.length} sayfa · ${count} dış bağlantı · ${destinations.size} hedef · ${changes.length} ${args.has('--check') ? 'bekleyen' : 'güncellenen'} dosya`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
