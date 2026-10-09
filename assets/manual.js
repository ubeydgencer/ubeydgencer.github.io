/* ============================================================
   UBEYD GENCER — REFERANS KILAVUZU · etkileşim katmanı
   Yaprak alfası head'deki önyükleyicide çözülür (boyamadan önce).
   Burada: tema menteşesi, filtre kolu, ray klavye gezinimi, dinleme şeridi.
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
    /* Payda da buradan yazılır; HTML'e elle yazılırsa proje eklendiğinde
       bayatlıyor ve "27 / 24" gibi tutarsız bir sayaç çıkıyordu. */
    var total = document.querySelector('[data-total]');
    if (total) total.textContent = String(entries.length);

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

  /* ---- 4. Dinleme şeridi -----------------------------------------------
     Blok scripts/tts.py'den gelir. Ses yalnız "Dinle"ye basılınca iner
     (preload=none). Hız tercihi ve yazıda kalınan yer localStorage'da;
     erişilemezse sessizce yok sayılır. */

  var listen = document.querySelector('[data-listen]');
  if (listen) {
    var audio = listen.querySelector('[data-audio]');
    var play = listen.querySelector('[data-play]');
    var label = listen.querySelector('[data-label]');
    var seek = listen.querySelector('[data-seek]');
    var now = listen.querySelector('[data-now]');
    var rateBtn = listen.querySelector('[data-rate]');
    var RATES = [1, 1.25, 1.5];
    var posKey = 'listen:' + audio.getAttribute('src');
    var total = Number(seek.max);
    var dragging = false;
    var lastSave = 0;

    var store = function (k, v) {
      try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, String(v)); } catch (err) {}
    };
    var read = function (k) {
      try { return localStorage.getItem(k); } catch (err) { return null; }
    };
    var clock = function (s) {
      s = Math.max(0, Math.floor(s));
      return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    };

    var setState = function (st) {
      listen.dataset.state = st;
      var playing = st === 'playing';
      label.textContent = st === 'loading' ? 'Yükleniyor'
        : st === 'error' ? 'Ses açılamadı'
        : playing ? 'Duraklat'
        : audio.currentTime > 0 && !audio.ended ? 'Devam et' : 'Dinle';
      play.setAttribute('aria-label', playing ? 'Duraklat' : 'Yazıyı dinle');
    };

    var paint = function (t) {
      if (!dragging) seek.value = String(Math.floor(t));
      seek.style.setProperty('--p', (total ? (t / total) * 100 : 0) + '%');
      now.textContent = clock(t);
      seek.setAttribute('aria-valuetext', clock(t) + ' / ' + clock(total));
    };

    var setRate = function (r) {
      audio.playbackRate = r;
      audio.defaultPlaybackRate = r;
      rateBtn.textContent = String(r).replace('.', ',') + '×';
      rateBtn.setAttribute('aria-label', 'Oynatma hızı: ' + rateBtn.textContent);
    };

    var savedRate = Number(read('listen-rate'));
    setRate(RATES.indexOf(savedRate) >= 0 ? savedRate : 1);

    // Önceki ziyarette kalınan yer: ses inmeden çubuk ve sayaç gösterir
    var resume = Number(read(posKey)) || 0;
    if (resume > 5 && resume < total - 5) {
      paint(resume);
      label.textContent = 'Devam et';
    } else {
      resume = 0;
    }

    play.addEventListener('click', function () {
      if (!audio.paused) { audio.pause(); return; }
      if (resume) { audio.currentTime = resume; resume = 0; }
      if (audio.readyState < 3) setState('loading');
      audio.play().catch(function () { setState('error'); });
    });

    rateBtn.addEventListener('click', function () {
      var r = RATES[(RATES.indexOf(audio.playbackRate) + 1) % RATES.length] || 1;
      setRate(r);
      store('listen-rate', r);
    });

    seek.addEventListener('input', function () {
      dragging = true;
      paint(Number(seek.value));
    });
    seek.addEventListener('change', function () {
      dragging = false;
      resume = 0;
      audio.currentTime = Number(seek.value);
      store(posKey, Math.floor(audio.currentTime));
    });

    audio.addEventListener('playing', function () { setState('playing'); });
    audio.addEventListener('waiting', function () { setState('loading'); });
    audio.addEventListener('pause', function () {
      setState('paused');
      store(posKey, Math.floor(audio.currentTime));
    });
    audio.addEventListener('ended', function () {
      store(posKey, null);
      paint(0);
      setState('paused');
    });
    audio.addEventListener('error', function () { setState('error'); });
    audio.addEventListener('ratechange', function () {
      // Bazı tarayıcılar yükleme sırasında hızı 1'e döndürüyor
      if (audio.playbackRate !== audio.defaultPlaybackRate) audio.playbackRate = audio.defaultPlaybackRate;
    });
    audio.addEventListener('timeupdate', function () {
      paint(audio.currentTime);
      if (Date.now() - lastSave > 5000) {
        lastSave = Date.now();
        store(posKey, Math.floor(audio.currentTime));
      }
    });

    // Kilit ekranı / bildirim merkezi kumandaları
    if ('mediaSession' in navigator) {
      var h1 = document.querySelector('h1');
      navigator.mediaSession.metadata = new MediaMetadata({
        title: h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : document.title,
        artist: 'Ubeyd Gencer',
        album: 'Blog · sesli sürüm',
        artwork: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }]
      });
      var jump = function (d) {
        audio.currentTime = Math.min(Math.max(0, audio.currentTime + d), audio.duration || total);
      };
      var handlers = {
        play: function () { play.click(); },
        pause: function () { audio.pause(); },
        seekbackward: function (e) { jump(-(e.seekOffset || 15)); },
        seekforward: function (e) { jump(e.seekOffset || 15); },
        seekto: function (e) { audio.currentTime = e.seekTime; }
      };
      Object.keys(handlers).forEach(function (k) {
        try { navigator.mediaSession.setActionHandler(k, handlers[k]); } catch (err) {}
      });
    }
  }
})();
