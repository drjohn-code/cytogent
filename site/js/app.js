/* Cytogent — page behaviour. Transform and opacity only.
   Everything that belongs to the page body lives in mount(scope), so the single-file preview can swap pages
   and mount again. The nav and the scroll listener are set up once. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  /* ---------- navigation (once) ---------- */
  $$('[data-menu]').forEach(function (item) {
    var btn = $('.nav__link', item), menu = $('.nav__menu', item);
    if (!btn || !menu) { return; }
    function close() { item.dataset.open = 'false'; menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    function open() {
      $$('[data-menu]').forEach(function (o) { if (o !== item) { o.dataset.open = 'false'; var m = $('.nav__menu', o); if (m) { m.hidden = true; } var b = $('.nav__link', o); if (b) { b.setAttribute('aria-expanded', 'false'); } } });
      item.dataset.open = 'true'; menu.hidden = false; btn.setAttribute('aria-expanded', 'true');
    }
    btn.addEventListener('click', function (e) { e.preventDefault(); if (menu.hidden) { open(); } else { close(); } });
    // hover opens; leaving closes after a short grace period, so a pointer on its way to the list keeps it open
    var timer = 0;
    function hoverable() { return window.matchMedia('(min-width:1080px) and (hover:hover)').matches; }
    item.addEventListener('mouseenter', function () { clearTimeout(timer); if (hoverable()) { open(); } });
    item.addEventListener('mouseleave', function () { if (!hoverable()) { return; } clearTimeout(timer); timer = setTimeout(close, 220); });
    menu.addEventListener('mouseenter', function () { clearTimeout(timer); });
    item.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); btn.focus(); } });
    d.addEventListener('click', function (e) { if (!item.contains(e.target)) { close(); } });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) { close(); } });
  });
  /* the phone menu: opens as a full-height panel, locks the page behind it, Escape or a link closes it */
  var burger = $('#burger'), sheet = $('#sheet'), header = $('.nav');
  function setSheet(open, refocus) {
    if (!burger || !sheet || sheet.hidden === !open) { return; }
    sheet.hidden = !open;
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) { sheet.scrollTop = 0; } else if (refocus) { burger.focus(); }
  }
  function closeSheet() { setSheet(false, false); }
  if (burger && sheet) {
    burger.addEventListener('click', function () { setSheet(sheet.hidden, false); });
    sheet.addEventListener('click', function (e) { if (e.target.closest('a')) { closeSheet(); } });
    d.addEventListener('keydown', function (e) {
      if (sheet.hidden) { return; }
      if (e.key === 'Escape') { setSheet(false, true); return; }
      if (e.key !== 'Tab') { return; }
      // keep the keyboard inside the bar and the menu while it is open
      var f = $$('a[href], button, summary', header).filter(function (el) { return el.offsetParent !== null || el === burger; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    var wide = window.matchMedia('(min-width:1080px)'), onWide = function (m) { if (m.matches) { closeSheet(); } };
    if (wide.addEventListener) { wide.addEventListener('change', onWide); } else if (wide.addListener) { wide.addListener(onWide); }
  }

  /* ---------- scroll jobs (once) ---------- */
  var scrollJobs = [], ticking = false;
  function onScroll() { var vh = window.innerHeight; for (var i = 0; i < scrollJobs.length; i++) { scrollJobs[i](vh); } ticking = false; }
  function queue() { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });

  /* ---------- reveal on scroll ----------
     Only elements below the first screen start hidden, and a failsafe clears everything after 2.2s,
     so the page is never parked invisible. */
  function reveal(scope) {
    var rv = $$('.rv', scope);
    function showAll() { rv.forEach(function (el) { el.dataset.in = 'true'; el.removeAttribute('data-pending'); $$('[data-rv-item]', el).forEach(function (i) { i.dataset.in = 'true'; i.removeAttribute('data-pending'); }); }); }
    if (!rv.length || reduce || !('IntersectionObserver' in window)) { showAll(); return; }
    var vh0 = window.innerHeight;
    rv.forEach(function (el) {
      var below = el.getBoundingClientRect().top > vh0 * 0.92;
      if (below) { el.dataset.pending = 'true'; } else { el.dataset.in = 'true'; }
      $$('[data-rv-item]', el).forEach(function (i) { if (below) { i.dataset.pending = 'true'; } else { i.dataset.in = 'true'; } });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        var items = $$('[data-rv-item]', e.target), list = items.length ? items : [e.target];
        list.forEach(function (el, i) { setTimeout(function () { el.dataset.in = 'true'; el.removeAttribute('data-pending'); }, i * 70); });
        e.target.dataset.in = 'true'; e.target.removeAttribute('data-pending');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    rv.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 2200);
  }

  /* ---------- heroes ---------- */
  function heroes(scope) {
    var C = window.CytogentCell; if (!C) { return; }
    // home: the cell explodes behind a normal screen
    var home = $('.heroscene', scope); if (home) { C.initHeroScene(home); }
    // inner pages: one part of the same cell, on a fixed stage the next section slides over
    $$('.phero', scope).forEach(function (sec) {
      var canvas = $('.phero__canvas', sec), stage = $('.phero__stage', sec);
      if (!canvas) { return; }
      C.CellView(canvas, { view: sec.dataset.view, anim: sec.dataset.anim, zoom: +sec.dataset.zoom || undefined, fill: +sec.dataset.fill || 0.44, phase: 1.3, static: reduce, labelMin: window.innerWidth >= 720 ? 0.34 : 0 });
      if (reduce) { sec.classList.add('phero--static'); return; }
      scrollJobs.push(function () {
        var r = sec.getBoundingClientRect(), p = clamp(1 - r.bottom / Math.max(1, r.bottom + window.scrollY));
        canvas.style.transform = 'scale(' + (1 + 0.14 * p).toFixed(4) + ')';
        canvas.style.opacity = (1 - 0.8 * p).toFixed(3);
        stage.hidden = p >= 0.999;
      });
    });
  }

  /* ---------- diagrams: attach each canvas as it approaches ---------- */
  var byId = {}, byCanvas = [];
  // canvases that already have a diagram; kept in memory, not as an attribute, so copied page HTML never carries it
  var liveCanvases = typeof WeakSet === 'function' ? new WeakSet() : null, liveList = [];
  function isLive(c) { return liveCanvases ? liveCanvases.has(c) : liveList.indexOf(c) >= 0; }
  function attachCv(c) {
    if (isLive(c) || !window.CytogentDiagrams) { return; }
    if (liveCanvases) { liveCanvases.add(c); } else { liveList.push(c); }
    var cfg = null; try { cfg = c.dataset.cfg ? JSON.parse(c.dataset.cfg) : null; } catch (e) { cfg = null; }
    var inst = window.CytogentDiagrams.attach(c, { kind: c.dataset.kind, phase: +c.dataset.phase || 0, cfg: cfg });
    byCanvas.push({ el: c, inst: inst });
    if (c.id) { byId[c.id] = inst; }
    var layer = c.closest('.story__layer');
    if (layer && layer.dataset.on !== 'true' && inst.pause) { inst.pause(); }
  }
  function diagrams(scope) {
    var cvs = $$('canvas.dg', scope);
    if (!cvs.length) { return; }
    if ('IntersectionObserver' in window && !reduce) {
      var cio = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { attachCv(e.target); cio.unobserve(e.target); } }); }, { rootMargin: '360px 0px' });
      cvs.forEach(function (c) { cio.observe(c); });
    } else { cvs.forEach(attachCv); }
  }

  /* ---------- numbered steps: the line fills as you read; a linked diagram follows ---------- */
  function steps(scope) {
    $$('.steps', scope).forEach(function (list) {
      var items = $$('.step', list), drive = list.dataset.drive;
      if (reduce) { items.forEach(function (s) { s.dataset.on = 'true'; }); return; }
      scrollJobs.push(function (vh) {
        var total = 0;
        items.forEach(function (s) {
          var r = s.getBoundingClientRect(), p = clamp((vh * 0.78 - r.top) / Math.max(1, r.height));
          s.style.setProperty('--fill', (p * 100).toFixed(1) + '%'); s.dataset.on = p > 0.18 ? 'true' : 'false'; total += p;
        });
        if (drive) {
          if (!byId[drive]) { var c = d.getElementById(drive); if (c) { attachCv(c); } }
          if (byId[drive]) { byId[drive].setProgress(Math.min(0.999, Math.max(0.001, total / items.length))); }
        }
      });
    });
  }

  /* ---------- home: the scroll story ---------- */
  function story(scope) {
    var st = $('#story', scope); if (!st) { return; }
    if (reduce) { $$('.sstep', st).forEach(function (s) { s.dataset.on = 'true'; }); $$('.story__layer', st).forEach(function (l) { l.dataset.on = 'true'; }); return; }
    var sSteps = $$('.sstep', st), layers = $$('.story__layer', st), current = -1;
    scrollJobs.push(function (vh) {
      var best = 0;
      sSteps.forEach(function (s, i) { if (s.getBoundingClientRect().top < vh * 0.55) { best = i; } });
      sSteps.forEach(function (s, i) { s.dataset.on = i === best ? 'true' : 'false'; });
      if (best === current) { return; }
      current = best;
      layers.forEach(function (l, i) {
        l.dataset.on = i === best ? 'true' : 'false';
        var c = l.querySelector('canvas.dg');
        if (c) { if (i === best) { attachCv(c); } byCanvas.forEach(function (o) { if (o.el === c && o.inst.pause) { if (i === best) { o.inst.resume(); } else { o.inst.pause(); } } }); }
      });
    });
  }

  /* ---------- request access form ---------- */
  function param(name) { var m = (window.location.search + '&' + window.location.hash).match(new RegExp('[?&]' + name + '=([a-z]+)')); return m ? m[1] : ''; }
  function form(scope) {
    var f = $('#access-form', scope); if (!f || f._ready) { return; }
    f._ready = true;
    var TYPES = ['individual', 'institute', 'hospital'], consentStep = $('#step-consent', f);
    function stepOf(v) { return $('#step-' + v, f); }
    function showType(v) { TYPES.forEach(function (t) { stepOf(t).hidden = t !== v; }); consentStep.hidden = !v; }
    $$('input[name="type"]', f).forEach(function (rd) {
      rd.addEventListener('change', function () { showType(rd.value); });
    });
    // Institute is chosen by default; ?type= picks another one
    var pre = param('type'); if (TYPES.indexOf(pre) < 0) { pre = (f.querySelector('input[name="type"]:checked') || {}).value || 'institute'; }
    $('#type-' + pre, f).checked = true; showType(pre);
    function setInvalid(ctrl, msg) {
      var fld = ctrl.closest('.field'); if (!fld) { return; }
      var err = $('.err', fld);
      if (!err) { err = d.createElement('span'); err.className = 'err'; err.id = ctrl.id + '-error'; fld.appendChild(err); }
      err.textContent = msg; err.hidden = !msg; fld.dataset.invalid = msg ? 'true' : 'false';
      if (msg) { ctrl.setAttribute('aria-invalid', 'true'); ctrl.setAttribute('aria-describedby', err.id); } else { ctrl.removeAttribute('aria-invalid'); ctrl.removeAttribute('aria-describedby'); }
    }
    function message(ctrl) {
      var v = ctrl.validity;
      if (v.valueMissing) { return ctrl.tagName === 'SELECT' ? 'Choose one option.' : 'This field is required.'; }
      if (v.typeMismatch && ctrl.type === 'email') { return 'Enter a valid email address.'; }
      if (v.typeMismatch && ctrl.type === 'url') { return 'Enter a full address starting with https://'; }
      if (v.patternMismatch) { return 'Use the format 0000-0000-0000-0000.'; }
      return 'Check this field.';
    }
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var type = (f.querySelector('input[name="type"]:checked') || {}).value;
      if (!type) { $('#type-individual', f).focus(); return; }
      var bad = [];
      $$('input, select, textarea', stepOf(type)).forEach(function (c) { if (c.type === 'checkbox') { return; } var ok = c.checkValidity(); setInvalid(c, ok ? '' : message(c)); if (!ok) { bad.push(c); } });
      var consent = $('#consent', f), ce = $('#consent-error', f); ce.hidden = consent.checked; if (!consent.checked) { bad.push(consent); }
      if (bad.length) { bad[0].focus(); $('#form-status', f).textContent = 'Please check the highlighted fields.'; return; }
      // No endpoint is wired yet. Collect the answers here and POST them to an endpoint owned by WelloWork AB.
      var data = {}; new FormData(f).forEach(function (v, k) { data[k] = data[k] ? [].concat(data[k], v) : v; });
      try { console.info('[cytogent] access request (not sent: no endpoint configured)', data); } catch (err) {}
      f.hidden = true; var ok = $('#access-success', scope); ok.hidden = false; ok.focus();
    });
    $$('input, select, textarea', f).forEach(function (c) { c.addEventListener('input', function () { if (c.getAttribute('aria-invalid')) { setInvalid(c, c.checkValidity() ? '' : message(c)); } }); });
  }

  function mount(scope) {
    scope = scope || d;
    scrollJobs = []; byId = {}; byCanvas = [];
    closeSheet();
    reveal(scope); heroes(scope); diagrams(scope); steps(scope); story(scope); form(scope);
    onScroll();
  }
  window.CytogentApp = { mount: mount };
  mount(d);
})();
