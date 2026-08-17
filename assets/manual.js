/* ============================================================
   UBEYD GENCER — REFERANS KILAVUZU · etkileşim katmanı
   Yaprak alfası head'deki önyükleyicide çözülür (boyamadan önce).
   Burada: tema menteşesi, filtre kolu, ray klavye gezinimi.
   Yumuşama yok — her değişim 90ms iki kare adım.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- 1. Tema menteşesi -------------------------------------------------
     Devralınan davranış korunur: OS tercihi izlenir, manuel seçim
     localStorage'a yazılır, OS değişince manuel seçim düşer. */

  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var toggle = document.getElementById('themeHinge');

  function apply(isDark) {
    root.classList.toggle('dark', isDark);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(isDark));
      var on = toggle.querySelector('[data-mode="dark"]');
      var off = toggle.querySelector('[data-mode="light"]');
      if (on) on.classList.toggle('ctl__off', !isDark);
      if (off) off.classList.toggle('ctl__off', isDark);
    }
    if (window.solveLeaf) window.solveLeaf();
  }

  apply(root.classList.contains('dark'));

  mq.addEventListener('change', function (e) {
    try { localStorage.removeItem('theme'); } catch (err) {}
    apply(e.matches);
  });

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = !root.classList.contains('dark');
      apply(next);
      try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch (err) {}
    });
  }

  /* ---- 2. Filtre kolu: tek kontrol, tüm alan ----------------------------
     Bir kol tüm sayfayı yeniden dizer; bölüm başlıkları boşalınca kapanır,
     sayaçlar ve ray hacmi aynı hamlede güncellenir. */

  var lever = document.querySelector('[data-lever]');

  if (lever) {
    var entries = Array.prototype.slice.call(document.querySelectorAll('.entry[data-state]'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('[data-group]'));
    var tally = document.querySelector('[data-tally]');

    var deal = function (want) {
      entries.forEach(function (el) {
        el.hidden = want !== 'all' && el.dataset.state !== want;
      });

      groups.forEach(function (g) {
        var live = g.querySelectorAll('.entry:not([hidden])').length;
        /* Başlık kenar sütununda ayrı bir kardeş olduğu için bölümle
           birlikte kapanmalı; sayaç da onun içinde yaşıyor. */
        var head = g.previousElementSibling;
        g.hidden = live === 0;
        if (head && head.hasAttribute('data-group-head')) {
          head.hidden = live === 0;
          var c = head.querySelector('[data-count]');
          if (c) c.textContent = String(live);
        }
      });

      if (tally) {
        tally.textContent = String(entries.filter(function (el) { return !el.hidden; }).length);
      }
    };

    lever.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-want]');
      if (!btn) return;
      lever.querySelectorAll('button[data-want]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      deal(btn.dataset.want);
    });
  }

  /* ---- 3. Ray: ok tuşlarıyla bölüm gezinimi ----------------------------- */

  var rail = document.querySelector('.rail');
  if (rail) {
    var tabs = Array.prototype.slice.call(rail.querySelectorAll('.tab'));
    rail.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = tabs[i + 1];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = tabs[i - 1];
      if (next) { e.preventDefault(); next.focus(); }
    });
  }
})();
