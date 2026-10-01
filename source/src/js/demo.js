/* Cytogent — the live brief demo.
   A small state machine over real HTML: which example is shown, and which of five steps it is on
   (1 Write, 2 Ask, 3 Brief, 4 Work, 5 File). The step is written to data-step on the demo, and CSS shows what belongs to it.
   Autoplay runs while the panel is on screen, pauses on hover, focus or a hidden tab, and stops for good at the first click.
   No libraries, no network. */
(function () {
  'use strict';
  var d = document, STEPS = ['write', 'ask', 'brief', 'work', 'file'], LAST = STEPS.length;
  var STEP_MS = 3500, HOLD_MS = 6000, KEEP = 3;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function track(name, params) { if (typeof window.cgTrack === 'function') { window.cgTrack(name, params); } }

  function init(root) {
    if (root._demo) { return; }
    root._demo = true;
    var panels = $$('.dpanel', root), tabs = $$('[role="tab"]', root), stepBtns = $$('.dstep', root);
    var cur = 0, step = 1, timer = 0, inView = false, hover = false, focusIn = false;
    var user = false;   // the visitor has clicked: the endless loop is over
    var once = false;   // the visitor picked an example: play it through to the file, one time

    function example() { return panels[cur].getAttribute('data-example'); }

    /* the feed: on a phone only the last three messages show; the earlier ones fold under "Show all" */
    function feed() {
      var p = panels[cur], box = p.querySelector('.dfeed__scroll'), more = p.querySelector('.dmore');
      var shown = $$('.msg', p).filter(function (m) { return +m.getAttribute('data-at') <= step; });
      $$('.msg', p).forEach(function (m) { m.classList.remove('is-old'); });
      shown.slice(0, Math.max(0, shown.length - KEEP)).forEach(function (m) { m.classList.add('is-old'); });
      // like a chat, the newest message stays in view
      var clipped = false;
      if (box) { box.scrollTop = box.scrollHeight; clipped = box.scrollTop > 2; box.classList.toggle('is-clipped', clipped); }
      if (more) {
        var n = Math.max(0, shown.length - KEEP);
        more.hidden = root.classList.contains('is-expanded') || !(clipped || n > 0);
        more.textContent = 'Show all' + (n ? ' (' + n + ' earlier)' : '');
      }
    }

    function setStep(n) {
      step = n;
      root.setAttribute('data-step', String(n));
      stepBtns.forEach(function (b) {
        var k = +b.getAttribute('data-step');
        b.classList.toggle('is-done', k <= n);
        if (k === n) { b.setAttribute('aria-current', 'step'); } else { b.removeAttribute('aria-current'); }
      });
      feed();
    }

    function select(i) {
      cur = i;
      panels.forEach(function (p, k) { if (tabs.length) { p.hidden = k !== i; } });
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === i ? 'true' : 'false');
        if (k === i) { t.removeAttribute('tabindex'); } else { t.setAttribute('tabindex', '-1'); }
      });
    }

    /* autoplay */
    function stop() { window.clearTimeout(timer); timer = 0; }
    function schedule() {
      stop();
      if (reduce || !root.isConnected || (user && !once)) { return; }
      if (!inView || hover || focusIn || d.hidden) { return; }
      if (once && step === LAST) { return; }
      timer = window.setTimeout(advance, step === LAST ? HOLD_MS : STEP_MS);
    }
    function advance() {
      if (step < LAST) {
        setStep(step + 1);
        if (once && step === LAST) { once = false; track('demo_complete', { example: example() }); }
      } else {
        if (panels.length > 1) { select((cur + 1) % panels.length); }
        setStep(1);
      }
      schedule();
    }

    /* the visitor takes over */
    function takeOver() {
      user = true; once = false; stop();
      // from now on a screen reader hears new feed messages
      $$('.feed', root).forEach(function (f) { f.setAttribute('aria-live', 'polite'); });
    }
    function pick(i, focus) {
      takeOver();
      select(i);
      if (focus) { tabs[i].focus(); }
      track('demo_select_example', { example: example() });
      if (reduce) { setStep(LAST); track('demo_complete', { example: example() }); return; }
      setStep(1); once = true; schedule();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { pick(i, false); });
      t.addEventListener('keydown', function (e) {
        var n = tabs.length, to = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { to = (i + 1) % n; }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { to = (i + n - 1) % n; }
        else if (e.key === 'Home') { to = 0; }
        else if (e.key === 'End') { to = n - 1; }
        if (to < 0) { return; }
        e.preventDefault(); pick(to, true);
      });
    });
    stepBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var n = +b.getAttribute('data-step');
        takeOver(); setStep(n);
        track('demo_step', { example: example(), step: STEPS[n - 1] });
        if (n === LAST) { track('demo_complete', { example: example() }); }
      });
    });
    $$('.dmore', root).forEach(function (m) {
      m.addEventListener('click', function () { takeOver(); root.classList.add('is-expanded'); feed(); });
    });

    /* pause while the visitor reads: pointer or keyboard inside the framed panel */
    $$('.dframe', root).forEach(function (f) {
      f.addEventListener('mouseenter', function () { hover = true; stop(); });
      f.addEventListener('mouseleave', function () { hover = false; schedule(); });
      f.addEventListener('focusin', function () { focusIn = true; stop(); });
      f.addEventListener('focusout', function () { focusIn = false; schedule(); });
    });
    d.addEventListener('visibilitychange', schedule);
    window.addEventListener('resize', function () { if (root.isConnected) { feed(); } }, { passive: true });

    root.setAttribute('data-live', '');
    select(0);
    if (reduce) {
      // no motion: the first example at its last step, with the whole feed open; tabs and steps still work
      root.classList.add('is-expanded'); setStep(LAST);
      return;
    }
    setStep(1);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        // 40% of the panel on screen; a panel taller than the screen counts once it fills most of it
        es.forEach(function (e) {
          var vh = e.rootBounds ? e.rootBounds.height : window.innerHeight;
          inView = e.isIntersecting && (e.intersectionRatio >= 0.4 || e.intersectionRect.height >= vh * 0.6);
        });
        schedule();
      }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1] }).observe(root);
    }
  }

  function mount(scope) { $$('[data-demo]', scope || d).forEach(init); }
  window.CytogentDemo = { mount: mount };
})();
