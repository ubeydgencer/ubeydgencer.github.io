#!/usr/bin/env python3
"""
Blog yazılarının sesli sürümü.

Her Türkçe yazının metnini (başlık, ara başlıklar, paragraflar) antalia-mini
ile seslendirir, assets/audio/<yazı>.mp3 olarak yazar ve yazının HTML'ine
dinleme oynatıcısını + JSON-LD'ye AudioObject'i ekler. Oynatıcı bloğunu ve
JSON-LD'deki audio alanını bu script sahiplenir; elle düzenlenmez.

Ses yalnızca okunan metin (ya da ses ayarları) değiştiğinde yeniden üretilir:
metnin özeti oynatıcıdaki data-tts özniteliğinde durur. Böylece her push'ta
aynı MP3 yeniden commit edilip git geçmişini şişirmez.

  python3 scripts/tts.py                 değişenleri seslendir, HTML'i güncelle
  python3 scripts/tts.py --check         yazma; bayat ses varsa çıkış 1
  python3 scripts/tts.py --force <ad>    o yazıyı (ya da hepsini: --force all) yeniden üret

Kurulum: pip install -r scripts/requirements-tts.txt  (Python 3.10+)

Model: antalia-mini, Apache-2.0 · https://huggingface.co/cloud0day3/antalia-mini
İngilizce yazılar seslendirilmez: model yalnızca Türkçe.
"""

import argparse
import hashlib
import json
import re
import sys
import time
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent
BLOG = ROOT / "blog"
AUDIO = ROOT / "assets" / "audio"
SOZLUK = Path(__file__).resolve().parent / "tts-sozluk.json"
SITE = "https://ubeydgencer.com"
MODEL_URL = "https://huggingface.co/cloud0day3/antalia-mini"

# Bunlardan biri değişirse bütün sesler yeniden üretilir (özete girerler).
AYAR = {
    "model": "antalia-mini",
    "sample_rate": 24000,  # konuşma için yeterli; 48 kHz dosyayı iki katına çıkarıyor
    "seed": 7,             # aynı metin + aynı seed = aynı ses
    "mp3_quality": 0.7,    # libsndfile VBR; 6 dk ≈ 1,6 MB, Xing başlığı var (ileri sarma doğru)
    "pause_title": 0.9,    # sn — başlıktan sonra
    "pause_head": 0.5,     # ara başlıktan sonra
    "pause_para": 0.35,    # paragraftan sonra
}

BAS = "<!-- dinle: scripts/tts.py yazar, elle düzenleme -->"
SON = "<!-- /dinle -->"
BLOK_RE = re.compile(r"[ \t]*" + re.escape(BAS) + r".*?" + re.escape(SON) + r"\n?", re.S)


def sozluk():
    """Modelin yanlış okuduğu kelimeler → okunuşları. Örn. {"Render": "Rendır"}."""
    if not SOZLUK.exists():
        return {}
    return json.loads(SOZLUK.read_text(encoding="utf-8"))


def parcalar(html, kelimeler):
    """Okunacak metin, sırasıyla: [(metin, sonrasındaki sessizlik sn), ...]"""
    art = BeautifulSoup(html, "html.parser").select_one("article")
    h1 = art.select_one("h1")
    out = [(h1.get_text(" ", strip=True), AYAR["pause_title"])]
    for el in art.select("h2.head, .prose p, .prose li"):
        if el.name == "h2":
            if el.small:
                el.small.decompose()  # §3 gibi bölüm numaraları okunmaz
            out.append((el.get_text(" ", strip=True).rstrip(".") + ".", AYAR["pause_head"]))
        elif el.name == "li" and el.find("p"):
            continue  # paragraflı madde: paragrafları ayrıca okunuyor
        else:
            out.append((el.get_text(" ", strip=True), AYAR["pause_para"]))

    temiz = []
    for metin, ara in out:
        metin = re.sub(r"\s+", " ", metin).strip()
        for yanlis, dogru in kelimeler.items():
            metin = re.sub(rf"(?<!\w){re.escape(yanlis)}(?!\w)", dogru, metin)
        if metin:
            temiz.append((metin, ara))
    return temiz


def ozet(parts, surum):
    veri = json.dumps({"ayar": AYAR, "surum": surum, "metin": parts}, ensure_ascii=False)
    return hashlib.sha256(veri.encode()).hexdigest()[:12]


def sure_metni(sn):
    sn = round(sn)
    return f"{sn // 60}:{sn % 60:02d}"


def iso_sure(sn):
    sn = round(sn)
    return f"PT{sn // 60}M{sn % 60}S"


def blok(ad, h, sn):
    src = f"/assets/audio/{ad}.mp3"
    return f"""    {BAS}
    <div class="listen" data-listen data-tts="{h}">
      <div class="listen__bar">
        <button type="button" class="listen__play" data-play aria-label="Yazıyı dinle">
          <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true"><path class="listen__i-play" d="M2 1v8l7-4z"/><path class="listen__i-pause" d="M2 1h2v8H2zM6 1h2v8H6z"/></svg>
          <span data-label>Dinle</span>
        </button>
        <input class="listen__seek" data-seek type="range" min="0" max="{round(sn)}" step="1" value="0" aria-label="Konum" aria-valuetext="0:00 / {sure_metni(sn)}" />
        <span class="listen__time machine"><span data-now>0:00</span> / {sure_metni(sn)}</span>
        <button type="button" class="listen__rate" data-rate aria-label="Oynatma hızı: 1×">1×</button>
      </div>
      <p class="listen__note machine">Sentetik ses · <a href="{MODEL_URL}" rel="noopener">antalia-mini</a> ile okundu</p>
      <audio preload="none" src="{src}" data-audio></audio>
    </div>
    {SON}
"""


def oynaticiyi_yaz(html, ad, h, sn):
    yeni = blok(ad, h, sn)
    if BLOK_RE.search(html):
        return BLOK_RE.sub(lambda _: yeni, html, count=1)
    # İlk kez: başlık bloğunun (<div class="full">…</div>) hemen arkasına
    bas = html.index('<div class="full">', html.index("<article"))
    son = html.index("</div>", bas) + len("</div>\n")
    return html[:son] + "\n" + yeni + html[son:]


def jsonld_yaz(html, ad, sn):
    m = next(m for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
             if json.loads(m.group(1)).get("@type") == "BlogPosting")
    veri = json.loads(m.group(1))
    veri["audio"] = {
        "@type": "AudioObject",
        "name": f"{veri['headline']} (sesli sürüm, sentetik ses)",
        "contentUrl": f"{SITE}/assets/audio/{ad}.mp3",
        "encodingFormat": "audio/mpeg",
        "duration": iso_sure(sn),
        "inLanguage": "tr",
    }
    yeni = json.dumps(veri, ensure_ascii=False, separators=(",", ":"))
    return html[: m.start(1)] + yeni + html[m.end(1) :]


def seslendir(tts, parts, hedef):
    import numpy as np
    import soundfile as sf

    sr = AYAR["sample_rate"]
    parca = []
    for metin, ara in parts:
        parca.append(tts.say(metin, seed=AYAR["seed"]).audio)
        parca.append(np.zeros(int(sr * ara), dtype=np.float32))
    ses = np.concatenate(parca[:-1])  # sondaki sessizlik gereksiz
    hedef.parent.mkdir(parents=True, exist_ok=True)
    sf.write(hedef, ses, sr, format="MP3", bitrate_mode="VARIABLE",
             compression_level=AYAR["mp3_quality"])
    return len(ses) / sr


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--force", metavar="AD")
    a = ap.parse_args()

    try:
        from importlib.metadata import version
        surum = version("antalia-mini")
    except Exception:
        surum = "?"

    kelimeler = sozluk()
    yazilar = sorted(p for p in BLOG.glob("*.html") if p.name != "index.html")
    tts = None
    bayat = []

    for p in yazilar:
        ad = p.stem
        html = p.read_text(encoding="utf-8")
        parts = parcalar(html, kelimeler)
        h = ozet(parts, surum)
        mp3 = AUDIO / f"{ad}.mp3"
        guncel = f'data-tts="{h}"' in html and mp3.exists()
        if guncel and a.force not in (ad, "all"):
            continue

        bayat.append(ad)
        if a.check:
            continue

        if tts is None:
            from antalia_mini import Antalia
            tts = Antalia(sample_rate=AYAR["sample_rate"])
        t0 = time.time()
        sn = seslendir(tts, parts, mp3)
        html = jsonld_yaz(oynaticiyi_yaz(html, ad, h, sn), ad, sn)
        p.write_text(html, encoding="utf-8")
        kb = mp3.stat().st_size / 1024
        print(f"  · {ad}: {sure_metni(sn)} ses, {kb:,.0f} KB, {time.time() - t0:.0f} sn")

    if a.check:
        if bayat:
            print("BAYAT SES:\n" + "\n".join(f"  ✗ {b}" for b in bayat))
            sys.exit(1)
        print("Bütün sesler güncel.")
    elif not bayat:
        print("Bütün sesler zaten güncel.")


if __name__ == "__main__":
    main()
