/* Cytogent — the film: how it works, played like a short video.
   Four chapters (Write, Sign, Work, Result). The chapter is written to data-ch on the figure; CSS shows that chapter
   and plays its animations from the start. The timeline fills like a video's, and a chapter can be clicked to jump.
   It plays while it is on screen, holds while it is off screen or the tab is hidden, and loops. Pause stays paused.
   With reduced motion it does not start by itself, and the chapters show finished. No libraries, no network. */
(function () {
  'use strict';
  var d = document;
  var LEN = [6500, 7500, 8000, 7500];   // ms per chapter: long enough to read each one
  var TOTAL = LEN.reduce(function (a, b) { return a + b; }, 0);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function track(name, params) { if (typeof window.cgTrack === 'function') { window.cgTrack(name, params); } }
  function clock(ms) { var s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }

  function init(root) {
    if (root._film) { return; }
    root._film = true;
    var chBtns = $$('.film__ch', root), fills = chBtns.map(function (b) { return b.querySelector('b'); });
    var playBtn = root.querySelector('.film__play'), time = root.querySelector('.film__time');
    var ch = 0, t = 0, playing = !reduce, inView = false, last = 0, raf = 0, done = false;

    function running() { return playing && inView && !d.hidden; }

    function paint() {
      fills.forEach(function (f, i) {
        f.style.transform = 'scaleX(' + (i < ch ? 1 : i > ch ? 0 : Math.min(1, t / LEN[ch])) + ')';
      });
      var before = LEN.slice(0, ch).reduce(function (a, b) { return a + b; }, 0);
      time.textContent = clock(before + t) + ' / ' + clock(TOTAL);
    }

    /* show chapter i from its start: a reflow between the two writes restarts its CSS animations */
    function go(i) {
      ch = i; t = 0;
      root.removeAttribute('data-ch');
      void root.offsetWidth;
      root.setAttribute('data-ch', String(i));
      chBtns.forEach(function (b, k) {
        if (k === i) { b.setAttribute('aria-current', 'step'); } else { b.removeAttribute('aria-current'); }
      });
      paint();
    }

    function sync() {
      root.classList.toggle('is-held', !running());
      root.classList.toggle('is-paused', !playing);
      playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      window.cancelAnimationFrame(raf);
      if (running()) { last = 0; raf = window.requestAnimationFrame(tick); }
    }

    function tick(now) {
      if (last) { t += Math.min(now - last, 100); }   // a long frame gap (tab switch) never skips a chapter
      last = now;
      if (t >= LEN[ch]) {
        if (ch === LEN.length - 1 && !done) { done = true; track('demo_complete', {}); }
        go((ch + 1) % LEN.length);
      }
      paint();
      raf = window.requestAnimationFrame(tick);
    }

    playBtn.addEventListener('click', function () {
      playing = !playing;
      track(playing ? 'demo_play' : 'demo_pause', { step: ch + 1 });
      sync();
    });
    chBtns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        go(i);
        if (!playing) { playing = true; }
        track('demo_step', { step: i + 1 });
        sync();
      });
    });
    d.addEventListener('visibilitychange', sync);

    root.setAttribute('data-live', '');
    go(0);
    sync();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { inView = e.isIntersecting && e.intersectionRatio >= 0.5; });
        sync();
      }, { threshold: [0, 0.25, 0.5, 0.75, 1] }).observe(root.querySelector('.film__screen'));
    } else { inView = true; sync(); }
  }

  function mount(scope) { $$('[data-film]', scope || d).forEach(init); }
  window.CytogentFilm = { mount: mount };
})();
