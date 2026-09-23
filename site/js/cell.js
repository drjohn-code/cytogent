/* Cytogent — one cell, many views.
   The molecular cell from v1, restructured so its layout (where every organelle sits) is fixed by the seed alone.
   That lets every canvas on the page look at the SAME cell: the hero shows all of it; the other sections zoom
   into its nucleus, a mitochondrion, the ribosomes on the ER, the Golgi, the membrane — and animate what that
   part does. Canvas 2D. One RAF loop gated by IntersectionObserver. No imports, no network. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var TAU = Math.PI * 2;
  var reducedMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var RM = function () { return reducedMQ.matches; };
  function clamp(t, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return t < a ? a : t > b ? b : t; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { t = clamp(t); return t * t * (3 - 2 * t); }
  function rng(seed) { var s = (seed >>> 0) || 7; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  var isSmall = function () { return window.innerWidth < 720; };
  var P = { violet: '#7B61FF', magenta: '#FF4D9D', amber: '#FFB020', cyan: '#35C9F2', blue: '#4F7BFF', teal: '#2EE6C5', orange: '#FF7A3D', gold: '#FFD166', lilac: '#B39DFF', rose: '#FF8FC2', indigo: '#5B4BFF', lime: '#A8E05F', mint: '#7CF2D2', paper: '#ECF0FF', navy: '#1A2A6C' };
  var WARM = [P.amber, P.orange, P.gold, P.magenta, P.rose];
  var COOL = [P.violet, P.blue, P.cyan, P.teal, P.lilac, P.indigo];
  var ALL = WARM.concat(COOL, [P.lime, P.mint]);
  var DARK = '#05060e';
  var SEED = 20260921;

  /* ---------- canvas helpers ---------- */
  function fit(canvas, cap) {
    var dpr = Math.min(window.devicePixelRatio || 1, cap || 2);
    var w = canvas.clientWidth || 300, h = canvas.clientHeight || 150;
    var W = Math.max(1, Math.round(w * dpr)), H = Math.max(1, Math.round(h * dpr));
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    var ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h, dpr: dpr };
  }
  var spriteCache = {};
  function glow(color) {
    if (spriteCache[color]) return spriteCache[color];
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var g = c.getContext('2d'); var grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, color); grd.addColorStop(0.35, color + '99'); grd.addColorStop(1, color + '00');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    spriteCache[color] = c; return c;
  }
  function dots(ctx, pts, alpha) {
    var groups = {};
    for (var i = 0; i < pts.length; i++) { var p = pts[i]; (groups[p.c] || (groups[p.c] = [])).push(p); }
    ctx.globalAlpha = alpha === undefined ? 1 : alpha;
    for (var c in groups) {
      var list = groups[c]; ctx.fillStyle = c; ctx.beginPath();
      for (var j = 0; j < list.length; j++) { var q = list[j]; ctx.moveTo(q.x + q.r, q.y); ctx.arc(q.x, q.y, q.r, 0, TAU); }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function glows(ctx, pts, alpha, mult) {
    ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = alpha;
    for (var i = 0; i < pts.length; i++) { var p = pts[i], s = p.r * (mult || 7); ctx.drawImage(glow(p.c), p.x - s / 2, p.y - s / 2, s, s); }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length) % arr.length]; }
  function inDisk(cx, cy, R, r) { var a = r() * TAU, d = Math.sqrt(r()) * R; return { x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d }; }
  function ground(ctx, w, h, cx, cy, R) {
    ctx.fillStyle = DARK; ctx.fillRect(0, 0, w, h);
    var g = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R * 2.8); g.addColorStop(0, '#2a1d6e'); g.addColorStop(0.45, '#12102e'); g.addColorStop(1, DARK);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  function bloom(layer) {
    var out = [];
    [3, 7].forEach(function (f) { var c = document.createElement('canvas'); c.width = Math.max(2, Math.round(layer.width / f)); c.height = Math.max(2, Math.round(layer.height / f)); var g = c.getContext('2d'); g.drawImage(layer, 0, 0, c.width, c.height); out.push(c); });
    return out;
  }
  function drawBloom(ctx, layer, bl, x, y, s, sharp, soft, sh) {
    sh = sh === undefined ? s : sh;
    ctx.globalAlpha = sharp; ctx.drawImage(layer, x, y, s, sh);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = soft * 0.55; ctx.drawImage(bl[0], x, y, s, sh);
    ctx.globalAlpha = soft * 0.45; ctx.drawImage(bl[1], x, y, s, sh);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- one RAF loop, visibility gated ---------- */
  var tickers = [], running = false, last = 0;
  function loop(now) {
    if (document.hidden) { running = false; return; }
    var t = now / 1000; var dt = Math.min(0.05, t - last || 0.016); last = t;
    var any = false;
    // a canvas that left the page (the preview swaps pages) stops being drawn
    tickers = tickers.filter(function (k) { if (k.el.isConnected) return true; if (k.io) k.io.disconnect(); return false; });
    for (var i = 0; i < tickers.length; i++) { var k = tickers[i]; if (k.visible && !k.paused) { any = true; try { k.tick(t, dt); } catch (e) { k.paused = true; if (window.console) console.error(e); } } }
    if (any) requestAnimationFrame(loop); else running = false;
  }
  function wake() { if (!running && !RM()) { running = true; requestAnimationFrame(loop); } }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) wake(); });
  function register(el, tick, opts) {
    var k = { el: el, tick: tick, visible: false, paused: false };
    tickers.push(k);
    var io = new IntersectionObserver(function (entries) { entries.forEach(function (e) { k.visible = e.isIntersecting; if (k.visible) wake(); }); }, { rootMargin: (opts && opts.margin) || '80px 0px' });
    io.observe(el); k.io = io;
    return k;
  }

  /* ---------- the cell's layout: fixed by the seed, in units of its radius ---------- */
  var layoutCache = {};
  function layoutCell(seed) {
    if (layoutCache[seed]) return layoutCache[seed];
    var r = rng(seed), L = {};
    L.nucleus = { x: -0.16, y: 0.08, r: 0.32 };
    L.clusters = []; for (var i = 0; i < 9; i++) { var a = r() * TAU, d = r() * 0.7; L.clusters.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, s: 0.12 + r() * 0.16, pal: i % 3 }); }
    L.filaments = []; for (i = 0; i < 13; i++) { var a0 = r() * TAU, a1 = a0 + Math.PI * (0.5 + r()); L.filaments.push({ p0: [Math.cos(a0) * 0.9, Math.sin(a0) * 0.9], p1: [(r() - 0.5), (r() - 0.5)], p2: [(r() - 0.5), (r() - 0.5)], p3: [Math.cos(a1) * 0.9, Math.sin(a1) * 0.9], n: 40 + Math.floor(r() * 40), c: i % 2 ? P.gold : (i % 3 ? P.teal : P.lilac) }); }
    L.mito = []; for (i = 0; i < 4; i++) { var ma = r() * TAU, md = 0.42 + r() * 0.4, mx = Math.cos(ma) * md, my = Math.sin(ma) * md; if (Math.hypot(mx - L.nucleus.x, my - L.nucleus.y) < L.nucleus.r + 0.16) { mx = Math.cos(ma + Math.PI) * md; my = Math.sin(ma + Math.PI) * md; } L.mito.push({ x: mx, y: my, rx: 0.13 + r() * 0.06, rot: r() * TAU }); L.mito[i].ry = L.mito[i].rx * 0.42; }
    L.vesicles = []; for (i = 0; i < 9; i++) { var va = r() * TAU, vd = 0.3 + r() * 0.55; L.vesicles.push({ x: Math.cos(va) * vd, y: Math.sin(va) * vd, r: 0.035 + r() * 0.05, c: pick(r, [P.cyan, P.rose, P.gold, P.mint, P.lilac]), filled: r() < 0.6 }); }
    var ga = Math.atan2(-L.nucleus.y, -L.nucleus.x) + (r() - 0.5) * 0.8; L.golgi = { a: ga, x: Math.cos(ga) * 0.52, y: Math.sin(ga) * 0.52, rot: ga + Math.PI, r: 0.2 };
    L.er = { a: Math.atan2(-L.nucleus.y, -L.nucleus.x) + Math.PI * 0.55 };
    L.chromatin = []; for (i = 0; i < 5; i++) { var ca0 = r() * TAU, cl = 0.5 + r() * 0.6; L.chromatin.push({ sx: Math.cos(ca0) * 0.5, sy: Math.sin(ca0) * 0.5, len: cl, dir: r() * TAU, c: i % 2 ? P.magenta : P.rose }); }
    L.receptors = []; for (i = 0; i < 14; i++) { L.receptors.push({ a: r() * TAU, c: pick(r, [P.magenta, P.cyan, P.gold]) }); }
    L.nucleolus = { x: L.nucleus.x + L.nucleus.r * 0.25, y: L.nucleus.y - L.nucleus.r * 0.2, r: L.nucleus.r * 0.16 };
    // the ribosome-rich ER sits on one side of the nucleus
    var ea = L.er.a; L.ribo = { x: L.nucleus.x + Math.cos(ea) * L.nucleus.r * 1.4, y: L.nucleus.y + Math.sin(ea) * L.nucleus.r * 1.4, r: L.nucleus.r * 0.55 };
    layoutCache[seed] = L; return L;
  }

  /* ---------- the painter: layout from the seed, detail from a second stream ---------- */
  // Paints the cell into ctx at (cx, cy) radius R. density scales particle counts, ds scales particle size.
  function paintCell(ctx, cx, cy, R, seed, density, ds) {
    var L = layoutCell(seed || SEED), r = rng((seed || SEED) * 3 + 11); density = density || 1; ds = ds || 1;
    var core = [], halo = [];
    var atlas = { center: { x: cx, y: cy, r: R }, mito: [], vesicles: [], receptors: [], chromatin: [] };
    function add(x, y, rad, c, withGlow) { core.push({ x: x, y: y, r: rad * ds, c: c }); if (withGlow) halo.push({ x: x, y: y, r: rad * ds, c: c }); }
    function X(nx) { return cx + nx * R; } function Y(ny) { return cy + ny * R; }
    var g = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.1, R * 0.1, cx, cy, R);
    g.addColorStop(0, '#1c1448'); g.addColorStop(0.7, '#120c33'); g.addColorStop(1, '#0a0722');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    var nx = X(L.nucleus.x), ny = Y(L.nucleus.y), nr = L.nucleus.r * R;
    atlas.nucleus = { x: nx, y: ny, r: nr };
    // interior scatter: clusters + uniform
    var pals = [WARM, COOL, [P.magenta, P.rose, P.lilac, P.gold]];
    var nI = Math.round(4200 * density);
    for (var i = 0; i < nI; i++) {
      var x, y, col;
      if (r() < 0.62) { var c = pick(r, L.clusters); var u = r() * TAU, v = Math.sqrt(-2 * Math.log(1 - r() * 0.999)) * 0.6; x = X(c.x) + Math.cos(u) * v * c.s * R; y = Y(c.y) + Math.sin(u) * v * c.s * R; col = pick(r, pals[c.pal]); }
      else { var aa = r() * TAU, dd = Math.sqrt(r()) * R * 0.96; x = cx + Math.cos(aa) * dd; y = cy + Math.sin(aa) * dd; col = pick(r, ALL); }
      var rad = 0.7 + r() * 1.3; if (r() < 0.06) rad += 1.4;
      var wg = r() < 0.28;
      if (Math.hypot(x - cx, y - cy) > R * 0.965) continue;
      if (Math.hypot(x - nx, y - ny) < nr * 0.96) continue;   // the nucleus keeps its own texture
      add(x, y, rad, col, wg);
    }
    // cytoskeleton
    L.filaments.forEach(function (f, fi) {
      if (fi >= Math.round(13 * Math.min(1, density))) return;
      var p0 = [X(f.p0[0]), Y(f.p0[1])], p1 = [X(f.p1[0]), Y(f.p1[1])], p2 = [X(f.p2[0]), Y(f.p2[1])], p3 = [X(f.p3[0]), Y(f.p3[1])];
      var n = Math.round(f.n * Math.max(1, R / 300));
      for (var k = 0; k <= n; k++) { var t = k / n, mt = 1 - t; var bx = mt * mt * mt * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t * p3[0]; var by = mt * mt * mt * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t * p3[1]; var jx = (r() - 0.5) * 1.5, jy = (r() - 0.5) * 1.5; if (Math.hypot(bx - cx, by - cy) < R * 0.95) add(bx + jx, by + jy, 1.05, f.c, k % 6 === 0); }
    });
    // mitochondria: bead ellipses with cristae
    L.mito.forEach(function (m) {
      var mx = X(m.x), my = Y(m.y), rx = m.rx * R, ry = m.ry * R, rot = m.rot;
      atlas.mito.push({ x: mx, y: my, rx: rx, ry: ry, rot: rot });
      var beads = Math.round(rx * 1.9);
      for (var k = 0; k < beads; k++) { var th = k / beads * TAU; var ex = Math.cos(th) * rx, ey = Math.sin(th) * ry; add(mx + ex * Math.cos(rot) - ey * Math.sin(rot), my + ex * Math.sin(rot) + ey * Math.cos(rot), 1.4, k % 5 === 0 ? P.gold : P.orange, k % 4 === 0); }
      var rows = Math.max(3, Math.round(3 * Math.max(1, R / 300)));
      for (k = 1; k < 6; k++) { var cxr = -rx * 0.75 + k * rx * 0.3; for (var mm = -rows; mm <= rows; mm++) { var cyr = mm * ry * (0.66 / rows); add(mx + cxr * Math.cos(rot) - cyr * Math.sin(rot), my + cxr * Math.sin(rot) + cyr * Math.cos(rot), 0.9, P.amber, false); } }
    });
    // vesicles
    L.vesicles.forEach(function (vv) {
      var vx = X(vv.x), vy = Y(vv.y), vr = vv.r * R, vc = vv.c;
      atlas.vesicles.push({ x: vx, y: vy, r: vr, c: vc });
      var vb = Math.round(vr * 1.6);
      for (var k = 0; k < vb; k++) { var th = k / vb * TAU; add(vx + Math.cos(th) * vr, vy + Math.sin(th) * vr, 1.2, vc, k % 3 === 0); }
      if (vv.filled) for (k = 0; k < vr * 0.9; k++) { var ia = r() * TAU, id = r() * vr * 0.7; add(vx + Math.cos(ia) * id, vy + Math.sin(ia) * id, 0.8, vc, false); }
    });
    // golgi: stacked arcs, placed opposite the nucleus
    var gx = X(L.golgi.x), gy = Y(L.golgi.y), grot = L.golgi.rot;
    atlas.golgi = { x: gx - Math.cos(grot) * R * 0.08, y: gy - Math.sin(grot) * R * 0.08, r: R * 0.2, rot: grot, arcs: [] };
    for (i = 0; i < 4; i++) { var arcR = R * (0.12 + i * 0.035); var nb = Math.round(arcR * 1.5); var arc = []; for (var k = 0; k < nb; k++) { var th = -0.9 + k / nb * 1.8; var ax = Math.cos(th) * arcR - arcR * 0.6, ay = Math.sin(th) * arcR; var px = gx + ax * Math.cos(grot) - ay * Math.sin(grot), py = gy + ax * Math.sin(grot) + ay * Math.cos(grot); add(px, py, 1.1, P.teal, k % 5 === 0); if (k % 3 === 0) arc.push([px, py]); } atlas.golgi.arcs.push(arc); }
    // rough ER: wavy sheets around one side of the nucleus, studded with ribosomes
    var ea = L.er.a; var riboPts = [];
    for (i = 0; i < 3; i++) { var er = nr * (1.22 + i * 0.16); var nb2 = Math.round(er * 1.9); for (k = 0; k < nb2; k++) { th = ea - 0.9 + k / nb2 * 1.8; var wob = Math.sin(k * 0.5 * (300 / Math.max(300, R)) + i) * R * 0.012; px = nx + Math.cos(th) * (er + wob); py = ny + Math.sin(th) * (er + wob); if (Math.hypot(px - cx, py - cy) > R * 0.94) continue; add(px, py, 1.0, i % 2 ? P.lilac : P.blue, false); if (k % 4 === 0) { add(px + (r() - 0.5) * 2, py + (r() - 0.5) * 2, 1.7, P.magenta, true); riboPts.push([px, py]); } } }
    atlas.ribo = { x: X(L.ribo.x), y: Y(L.ribo.y), r: L.ribo.r * R, pts: riboPts };
    // nucleus
    var ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr); ng.addColorStop(0, '#3a2480'); ng.addColorStop(1, '#170f3a');
    ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(nx, ny, nr, 0, TAU); ctx.fill();
    var nInner = Math.round(300 * density);
    for (i = 0; i < nInner; i++) { var na = r() * TAU, nd = Math.sqrt(r()) * nr * 0.92; add(nx + Math.cos(na) * nd, ny + Math.sin(na) * nd, 0.7 + r() * 0.8, pick(r, [P.lilac, P.violet, P.indigo, P.magenta]), false); }
    L.chromatin.forEach(function (ch) {
      var sx = nx + ch.sx * nr, sy = ny + ch.sy * nr, dir = ch.dir, step = 3.2 * Math.max(1, R / 300), cn = Math.round(ch.len * nr / step), line = [];
      for (var k = 0; k < cn; k++) { var qx = sx + Math.cos(dir + Math.sin(k * 0.6 * (300 / Math.max(300, R))) * 0.8) * k * step, qy = sy + Math.sin(dir + Math.sin(k * 0.6 * (300 / Math.max(300, R))) * 0.8) * k * step; if (Math.hypot(qx - nx, qy - ny) < nr * 0.88) { add(qx, qy, 1.3, ch.c, k % 4 === 0); line.push([qx, qy]); } }
      atlas.chromatin.push(line);
    });
    var nlx = X(L.nucleolus.x), nly = Y(L.nucleolus.y), nlr = L.nucleolus.r * R; atlas.nucleolus = { x: nlx, y: nly, r: nlr };
    for (k = 0; k < Math.round(40 * Math.max(1, density)); k++) { var oa = r() * TAU, od = r() * nlr; add(nlx + Math.cos(oa) * od, nly + Math.sin(oa) * od, 1.1, P.gold, k % 8 === 0); }
    for (var ring = 0; ring < 2; ring++) { var rr = nr * (1 - ring * 0.05); var nb3 = Math.round(rr * 2.2); for (k = 0; k < nb3; k++) { th = k / nb3 * TAU + ring * 0.05; add(nx + Math.cos(th) * (rr + (r() - 0.5) * 1.6), ny + Math.sin(th) * (rr + (r() - 0.5) * 1.6), 1.3 + r() * 0.7, ring ? P.violet : P.lilac, k % 6 === 0); } }
    // membrane: bilayer
    for (ring = 0; ring < 2; ring++) {
      var mr = R * (1 - ring * 0.034); var nbm = Math.round(mr * 2.4);
      for (k = 0; k < nbm; k++) { th = k / nbm * TAU + ring * 0.011; var jr = (r() - 0.5) * 2.2; var mcol = ring ? pick(r, [P.blue, P.lilac, P.indigo]) : (r() < 0.12 ? P.magenta : pick(r, [P.violet, P.indigo, P.blue])); add(cx + Math.cos(th) * (mr + jr), cy + Math.sin(th) * (mr + jr), 1.5 + r() * 1.1, mcol, k % 3 === 0); }
    }
    // membrane proteins / receptors
    L.receptors.forEach(function (rc) { var th = rc.a; atlas.receptors.push({ x: cx + Math.cos(th) * R, y: cy + Math.sin(th) * R, a: th, c: rc.c }); for (var k = 0; k < 5; k++) { var pr = R * (0.99 + k * 0.022); add(cx + Math.cos(th) * pr, cy + Math.sin(th) * pr, 1.6 - k * 0.15, rc.c, k < 2); } });
    // outer fuzz
    var nZ = Math.round(1500 * density);
    for (i = 0; i < nZ; i++) { th = r() * TAU; var fz = R * (1.02 + Math.pow(r(), 2.2) * 0.16); add(cx + Math.cos(th) * fz, cy + Math.sin(th) * fz, 0.6 + r() * 0.9, pick(r, [P.violet, P.blue, P.lilac, P.indigo]), false); }
    glows(ctx, halo, 0.7 / Math.sqrt(Math.max(1, density)), 8);
    dots(ctx, core, 0.96);
    return { core: core, halo: halo, atlas: atlas };
  }
  function cellLayer(R, seed, density, dpr) {
    var size = Math.ceil(R * 2.5); var layer = document.createElement('canvas'); layer.width = layer.height = Math.ceil(size * dpr);
    var lc = layer.getContext('2d'); lc.setTransform(dpr, 0, 0, dpr, 0, 0);
    var res = paintCell(lc, size / 2, size / 2, R, seed, density);
    return { layer: layer, bloom: bloom(layer), size: size, R: R, atlas: res.atlas, core: res.core };
  }
  function liveDust(n, R, seed) { var r = rng(seed), out = []; for (var i = 0; i < n; i++) { var a = r() * TAU, d = Math.sqrt(r()) * R * 0.93; out.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, vx: (r() - 0.5) * 6, vy: (r() - 0.5) * 6, r: 0.9 + r() * 1.4, c: pick(r, ALL), ph: r() * TAU }); } return out; }
  function stepDust(live, R, t, dt) { var pts = []; for (var i = 0; i < live.length; i++) { var p = live[i]; p.x += (p.vx + Math.sin(t * 0.6 + p.ph) * 4) * dt; p.y += (p.vy + Math.cos(t * 0.5 + p.ph) * 4) * dt; if (Math.hypot(p.x, p.y) > R * 0.94) { p.x *= 0.98; p.y *= 0.98; p.vx *= -1; p.vy *= -1; } pts.push({ x: p.x, y: p.y, r: p.r, c: p.c }); } return pts; }

  /* ---------- hero scene (v1): the cell at rest, then it loosens into dust that drifts away ---------- */
  function initHeroScene(section, opts) {
    var forceStatic = !!(opts && opts.static);
    var isStatic = function () { return RM() || forceStatic; };
    var canvas = $('canvas.hero__canvas', section); var stage = $('.hero__stage', section); var scrim = $('.hero__scrim', section);
    var geo, cell, live, dust = [], target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, p = 0;
    var small = false;
    function build() {
      var f = fit(canvas, 1.5); var w = f.w, h = f.h; small = isSmall();
      var R = small ? Math.min(w * 0.4, h * 0.22) : Math.min(w * 0.29, h * 0.42);
      var cx = small ? w * 0.5 : w * 0.72, cy = small ? h * 0.26 : h * 0.47;
      cell = cellLayer(R, SEED, small ? 0.6 : 1, f.dpr);
      geo = { w: w, h: h, R: R, cx: cx, cy: cy, dpr: f.dpr };
      var bg = document.createElement('canvas'); bg.width = Math.ceil(w * f.dpr / 2); bg.height = Math.ceil(h * f.dpr / 2);
      var bc = bg.getContext('2d'); bc.setTransform(f.dpr / 2, 0, 0, f.dpr / 2, 0, 0); ground(bc, w, h, cx, cy, R);
      var r = rng(99), dd = [];
      for (var i = 0; i < 700; i++) { var x = r() * w, y = r() * h; if (Math.hypot(x - cx, y - cy) < R * 1.15) continue; dd.push({ x: x, y: y, r: 0.6 + r() * 1.2, c: pick(r, [P.violet, P.blue, P.lilac, P.indigo, P.cyan]) }); }
      dots(bc, dd, 0.5); geo.bg = bg;
      live = liveDust(small ? 90 : 200, R, 5);
      var r2 = rng(31); var core = cell.core; var want = small ? 1200 : 2200; var step = Math.max(1, Math.floor(core.length / want)); dust = [];
      var off = cell.size / 2;
      for (i = 0; i < core.length && dust.length < want; i += step) {
        var q = core[i]; var px = cx + (q.x - off), py = cy + (q.y - off);
        // each grain loosens outward along its own angle, then keeps drifting up and away until it is gone
        var ang = Math.atan2(py - cy, px - cx) + (r2() - 0.5) * 1.2; var dist = R * (0.5 + r2() * 1.7);
        var sx = cx + Math.cos(ang) * dist, sy = cy + Math.sin(ang) * dist - h * 0.08;
        var fx = cx + Math.cos(ang) * dist * 1.9, fy = cy + Math.sin(ang) * dist * 1.6 - h * 0.34;
        dust.push({ x0: px, y0: py, x1: sx, y1: sy, x2: fx, y2: fy, r: Math.max(0.9, q.r * 0.9), c: q.c, ph: r2() * TAU });
      }
      draw(0, 0);
    }
    function draw(t, dt) {
      var ctx = canvas.getContext('2d'); var w = geo.w, h = geo.h, R = geo.R, cx = geo.cx, cy = geo.cy;
      ctx.setTransform(geo.dpr, 0, 0, geo.dpr, 0, 0);
      ctx.drawImage(geo.bg, cur.x * 0.3, cur.y * 0.3, w, h);
      // p runs 0 → 1 while the hero scrolls out of view: loosen, scatter, then drift away as the next section covers it
      var rest = smooth(p / 0.1), dis = smooth((p - 0.06) / 0.34), far = smooth((p - 0.34) / 0.66), gone = smooth((p - 0.55) / 0.45);
      var bitmapAlpha = 1 - smooth((p - 0.04) / 0.26); var softAlpha = 1 - smooth((p - 0.08) / 0.32);
      var zoom = (1 + Math.sin(t * 0.21) * 0.006) * (1 + 0.05 * rest + 0.22 * dis);
      if (bitmapAlpha > 0 || softAlpha > 0) {
        ctx.save(); ctx.translate(cx + cur.x, cy + cur.y); ctx.rotate(Math.sin(t * 0.07) * 0.012); ctx.scale(zoom, zoom);
        var s = cell.size; drawBloom(ctx, cell.layer, cell.bloom, -s / 2, -s / 2, s, 0.86 * bitmapAlpha, 0.72 * softAlpha);
        ctx.globalCompositeOperation = 'lighter'; var sx = Math.cos(t * 0.11) * R * 0.5, sy = Math.sin(t * 0.09) * R * 0.5;
        var g = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.9); g.addColorStop(0, 'rgba(123,97,255,' + (0.1 * bitmapAlpha) + ')'); g.addColorStop(1, 'rgba(123,97,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        var lp = stepDust(live, R, t, dt); glows(ctx, lp, 0.5 * bitmapAlpha, 6); dots(ctx, lp, 0.9 * bitmapAlpha);
        ctx.restore();
      }
      var dustAlpha = smooth((p - 0.02) / 0.1) * (1 - 0.75 * gone);
      if (dustAlpha > 0) {
        var pts = [], hl = []; var wob = 7 * dis + 1.2;
        for (var i = 0; i < dust.length; i++) {
          var d = dust[i];
          var x0 = cx + cur.x + (d.x0 - cx) * zoom, y0 = cy + cur.y + (d.y0 - cy) * zoom;
          var x = lerp(lerp(x0, d.x1, dis), d.x2, far) + Math.sin(t * 1.1 + d.ph) * wob, y = lerp(lerp(y0, d.y1, dis), d.y2, far) + Math.cos(t * 0.9 + d.ph) * wob;
          var q = { x: x, y: y, r: d.r * (1 + 0.3 * dis), c: d.c }; pts.push(q); if (i % 5 === 0) hl.push(q);
        }
        glows(ctx, hl, 0.55 * dustAlpha, 7); dots(ctx, pts, 0.95 * dustAlpha);
      }
      if (scrim) scrim.style.opacity = (1 - smooth((p - 0.35) / 0.4)).toFixed(3);
      if (stage) stage.hidden = p >= 0.999; // the stage is fixed; once the next section covers it, stop painting it
    }
    // 0 when the page is at the top, 1 when the hero's bottom edge reaches the top of the viewport
    function progress() { var r = section.getBoundingClientRect(); return clamp(1 - r.bottom / Math.max(1, r.bottom + window.scrollY)); }
    build();
    new ResizeObserver(function () { build(); }).observe(canvas);
    if (isStatic()) { section.classList.add('heroscene--static'); return; }
    window.addEventListener('pointermove', function (e) { if (isSmall()) return; target.x = (e.clientX / window.innerWidth - 0.5) * 18; target.y = (e.clientY / window.innerHeight - 0.5) * 12; }, { passive: true });
    p = progress();
    register(section, function (t, dt) { var tp = progress(); p += (tp - p) * 0.16; if (Math.abs(tp - p) < 0.0005) p = tp; var damp = 1 - smooth(p / 0.3); cur.x += (target.x * damp - cur.x) * 0.04; cur.y += (target.y * damp - cur.y) * 0.04; draw(t, dt); }, { margin: '0px' });
  }

  /* ---------- CellView: a camera on one part of the same cell, with an animation of what that part does ---------- */
  function viewSpec(L, name) {
    // where the camera looks (units of R) and how close
    var m0 = L.mito[0], v = L.vesicles;
    var vc = { x: (v[0].x + v[1].x + v[2].x) / 3, y: (v[0].y + v[1].y + v[2].y) / 3 };
    var rc = L.receptors[3];
    var rx = Math.cos(rc.a), ry = Math.sin(rc.a);
    var specs = {
      signal: { x: (rx * 0.9 + L.nucleus.x) / 2, y: (ry * 0.9 + L.nucleus.y) / 2, zoom: 1.75 },
      whole: { x: 0, y: 0, zoom: 1 },
      nucleus: { x: L.nucleus.x, y: L.nucleus.y, zoom: 2.5 },
      chromatin: { x: L.nucleus.x + 0.05, y: L.nucleus.y - 0.04, zoom: 3.4 },
      mito: { x: m0.x, y: m0.y, zoom: 4.2 },
      ribo: { x: L.ribo.x, y: L.ribo.y, zoom: 3.2 },
      golgi: { x: L.golgi.x - Math.cos(L.golgi.rot) * 0.08, y: L.golgi.y - Math.sin(L.golgi.rot) * 0.08, zoom: 3.4 },
      membrane: { x: Math.cos(rc.a) * 0.92, y: Math.sin(rc.a) * 0.92, zoom: 3.2 },
      receptor: { x: Math.cos(rc.a) * 0.86, y: Math.sin(rc.a) * 0.86, zoom: 2.2 },
      vesicles: { x: vc.x, y: vc.y, zoom: 2.6 },
      half: { x: 0.2, y: 0, zoom: 1.6 }
    };
    return specs[name] || specs.whole;
  }

  function CellView(canvas, opts) {
    opts = opts || {};
    var seed = opts.seed || SEED, L = layoutCell(seed);
    var anim = opts.anim || 'breathe';
    var geo = null, atlas = null, layer = null, bl = null, state = { progress: 0, hover: 0, t0: 0 };
    var spec = viewSpec(L, opts.view || 'whole');
    if (opts.zoom) spec = { x: spec.x, y: spec.y, zoom: opts.zoom };
    var r = rng(seed + 77);
    // animation state
    var sparks = [], chain = [], gateParticles = [];
    function build() {
      var f = fit(canvas, 1.5); var w = f.w, h = f.h;
      var R0 = Math.min(w, h) * (opts.fill || 0.44), R = R0 * spec.zoom;
      var cx = w / 2 - spec.x * R, cy = h / 2 - spec.y * R;
      layer = document.createElement('canvas'); layer.width = Math.ceil(w * f.dpr); layer.height = Math.ceil(h * f.dpr);
      var lc = layer.getContext('2d'); lc.setTransform(f.dpr, 0, 0, f.dpr, 0, 0);
      ground(lc, w, h, cx, cy, R);
      var rr = rng(seed + 5), dd = [];
      for (var i = 0; i < 260; i++) { var x = rr() * w, y = rr() * h; if (Math.hypot(x - cx, y - cy) < R * 1.15) continue; dd.push({ x: x, y: y, r: 0.6 + rr() * 1.2, c: pick(rr, [P.violet, P.blue, P.lilac, P.indigo, P.cyan]) }); }
      dots(lc, dd, 0.5);
      // particles per screen area stay constant whatever the zoom: density follows the cell's on-screen size
      var dens = clamp(Math.pow(R / 300, 2), 0.35, 2.6), ds = 0.85 + (spec.zoom - 1) * 0.22;
      var res = paintCell(lc, cx, cy, R, seed, dens, ds);
      atlas = res.atlas; bl = bloom(layer);
      geo = { w: w, h: h, R: R, cx: cx, cy: cy, dpr: f.dpr };
      sparks = []; chain = []; gateParticles = [];
      draw(0, 0.016);
    }
    // ---- overlay helpers
    function packet(ctx, x, y, rad, c, a) { glows(ctx, [{ x: x, y: y, r: rad, c: c }], a === undefined ? 0.9 : a, 9); dots(ctx, [{ x: x, y: y, r: rad * 0.55, c: P.paper }], a === undefined ? 1 : a); }
    function ringAt(ctx, x, y, rad, a, c) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = c || 'rgba(236,240,255,0.85)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, rad, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(a * 1.3)); ctx.stroke(); ctx.restore(); }
    function membranePoint(a, k) { return { x: geo.cx + Math.cos(a) * geo.R * (k || 1), y: geo.cy + Math.sin(a) * geo.R * (k || 1) }; }

    var ANIMS = {
      breathe: function () {},
      // a signal lands on a receptor, runs along the membrane, then in to the nucleus
      signal: function (ctx, t) {
        var rc = atlas.receptors[3], n = atlas.nucleus;
        var u = state.progress > 0 ? state.progress : (t * 0.14) % 1;
        var a0 = rc.a, a1 = rc.a + 0.9;
        var pathPts = [];
        for (var i = 0; i <= 12; i++) { var q = membranePoint(a0 + (a1 - a0) * i / 12, 0.985); pathPts.push(q); }
        var inner = membranePoint(a1, 0.985), mid = { x: (inner.x + n.x) / 2 + (inner.y - n.y) * 0.25, y: (inner.y + n.y) / 2 - (inner.x - n.x) * 0.25 };
        ctx.save(); ctx.strokeStyle = 'rgba(236,240,255,0.28)'; ctx.lineWidth = 1; ctx.setLineDash([2, 6]); ctx.beginPath();
        pathPts.forEach(function (q, i) { if (i) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.quadraticCurveTo(mid.x, mid.y, n.x, n.y); ctx.stroke(); ctx.restore();
        var px, py;
        if (u < 0.5) { var k = u / 0.5 * 12, i0 = Math.min(11, Math.floor(k)), f = k - i0; px = lerp(pathPts[i0].x, pathPts[i0 + 1].x, f); py = lerp(pathPts[i0].y, pathPts[i0 + 1].y, f); }
        else { var s = (u - 0.5) / 0.5, ms = 1 - s; px = ms * ms * inner.x + 2 * ms * s * mid.x + s * s * n.x; py = ms * ms * inner.y + 2 * ms * s * mid.y + s * s * n.y; }
        ringAt(ctx, rc.x, rc.y, 14 + Math.sin(t * 2) * 2, u > 0.02 ? 0.9 : 0.4, 'rgba(255,77,157,0.9)');
        packet(ctx, px, py, 3.2, u < 0.5 ? P.magenta : P.cyan);
        var arrive = smooth((u - 0.92) / 0.08); if (arrive > 0) { glows(ctx, [{ x: n.x, y: n.y, r: n.r * 0.12, c: P.cyan }], 0.7 * arrive, 8); ringAt(ctx, n.x, n.y, n.r * 1.06, arrive, 'rgba(53,201,242,0.9)'); }
      },
      // reading the archive: glowing readers travel along the chromatin threads
      read: function (ctx, t) {
        var lines = atlas.chromatin.filter(function (l) { return l.length > 6; });
        var pts = [];
        lines.forEach(function (line, li) { var u = ((t * 0.09 + li * 0.23) % 1) * (line.length - 1), i0 = Math.floor(u), f = u - i0; var a = line[i0], b = line[Math.min(line.length - 1, i0 + 1)]; var x = lerp(a[0], b[0], f), y = lerp(a[1], b[1], f); pts.push({ x: x, y: y, r: 2.6, c: li % 2 ? P.cyan : P.gold }); for (var k = 1; k < 5; k++) { var j = Math.max(0, i0 - k); pts.push({ x: line[j][0], y: line[j][1], r: 1.6 - k * 0.25, c: li % 2 ? P.cyan : P.gold }); } });
        glows(ctx, pts, 0.75, 8); dots(ctx, pts, 0.9);
        var nl = atlas.nucleolus; glows(ctx, [{ x: nl.x, y: nl.y, r: nl.r * 0.5, c: P.gold }], 0.25 + 0.15 * Math.sin(t * 0.8), 6);
      },
      // energy: a wave runs along the cristae, sparks leave the tips
      pulse: function (ctx, t, dt) {
        var m = atlas.mito[0]; var cr = Math.cos(m.rot), sr = Math.sin(m.rot);
        var u = (t * 0.35) % 1.4; var wx = -m.rx + u * 2 * m.rx;
        ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.rot); ctx.globalCompositeOperation = 'lighter';
        var g = ctx.createLinearGradient(wx - m.rx * 0.25, 0, wx + m.rx * 0.25, 0); g.addColorStop(0, 'rgba(255,176,32,0)'); g.addColorStop(0.5, 'rgba(255,209,102,0.55)'); g.addColorStop(1, 'rgba(255,176,32,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, m.rx, m.ry, 0, 0, TAU); ctx.fill(); ctx.restore();
        if (sparks.length < 40 && Math.random() < 0.35) { var side = Math.random() < 0.5 ? 1 : -1; var a = m.rot + (Math.random() - 0.5) * 0.9 + (side < 0 ? Math.PI : 0); sparks.push({ x: m.x + cr * m.rx * side, y: m.y + sr * m.rx * side, vx: Math.cos(a) * (30 + Math.random() * 40), vy: Math.sin(a) * (30 + Math.random() * 40), life: 1, c: Math.random() < 0.5 ? P.gold : P.amber }); }
        var live = [];
        sparks.forEach(function (s) { s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 8 * dt; s.life -= dt * 0.7; if (s.life > 0) live.push(s); });
        sparks = live; var pts = sparks.map(function (s) { return { x: s.x, y: s.y, r: 1.2 + s.life * 1.6, c: s.c }; });
        glows(ctx, pts, 0.7, 7); dots(ctx, pts, 0.9);
      },
      // building: amino acids gather at the ribosomes and grow into a chain that drifts away
      build: function (ctx, t, dt) {
        var rp = atlas.ribo.pts; if (!rp.length) return;
        var cyc = (t * 0.16) % 1; var n = Math.floor(cyc * 26);
        var anchor = rp[Math.floor(rp.length * 0.5)];
        var pts = [];
        for (var i = 0; i < n; i++) { var ph = i * 0.55; var x = anchor[0] + Math.cos(ph) * 6 + i * 4.2 * Math.cos(0.4), y = anchor[1] - i * 4.2 * Math.sin(0.4) + Math.sin(ph) * 6 - cyc * 26; pts.push({ x: x, y: y, r: 2.1, c: i % 3 === 0 ? P.cyan : (i % 3 === 1 ? P.mint : P.lilac) }); }
        // incoming residues
        for (i = 0; i < 6; i++) { var u = (t * 0.5 + i * 0.17) % 1; var sx = anchor[0] + Math.cos(i * 1.1) * 60, sy = anchor[1] + Math.sin(i * 1.1) * 60; pts.push({ x: lerp(sx, anchor[0], u), y: lerp(sy, anchor[1], u), r: 1.6, c: P.gold }); }
        rp.forEach(function (q, i) { if (i % 3 === 0) pts.push({ x: q[0], y: q[1], r: 1.8 + Math.sin(t * 3 + i) * 0.5, c: P.magenta }); });
        glows(ctx, pts, 0.7, 7); dots(ctx, pts, 0.95);
        if (pts.length > 1 && n > 1) { ctx.save(); ctx.strokeStyle = 'rgba(236,240,255,0.5)'; ctx.lineWidth = 1; ctx.beginPath(); for (i = 0; i < n; i++) { if (i) ctx.lineTo(pts[i].x, pts[i].y); else ctx.moveTo(pts[i].x, pts[i].y); } ctx.stroke(); ctx.restore(); }
      },
      // editing: one thread is cut, the ends glow, then it is repaired
      cut: function (ctx, t) {
        var line = atlas.chromatin.filter(function (l) { return l.length > 8; })[0]; if (!line) return;
        var cyc = (t * 0.22) % 1; var i0 = Math.floor(line.length * 0.5);
        var open = smooth((cyc - 0.1) / 0.2) * (1 - smooth((cyc - 0.6) / 0.25));
        var a = line[i0 - 1], b = line[i0 + 1];
        if (open > 0) {
          ctx.save(); ctx.fillStyle = '#170f3a'; ctx.globalAlpha = open; ctx.beginPath(); ctx.arc((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 7, 0, TAU); ctx.fill(); ctx.restore();
          var ends = [{ x: a[0], y: a[1], r: 2.4, c: P.magenta }, { x: b[0], y: b[1], r: 2.4, c: P.magenta }]; glows(ctx, ends, open, 9); dots(ctx, ends, open);
          // the guide: a short cyan bar that finds the site
          var gx = (a[0] + b[0]) / 2, gy = (a[1] + b[1]) / 2 - 22 * (1 - smooth((cyc - 0.1) / 0.15)); var gpts = []; for (var k = -3; k <= 3; k++) gpts.push({ x: gx + k * 3, y: gy, r: 1.6, c: P.cyan }); glows(ctx, gpts, 0.8 * open, 7); dots(ctx, gpts, open);
        }
        var heal = smooth((cyc - 0.65) / 0.15) * (1 - smooth((cyc - 0.9) / 0.1)); if (heal > 0) { glows(ctx, [{ x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2, r: 4, c: P.teal }], heal, 10); }
      },
      // packaging: material flows along the Golgi stack and buds off as a vesicle
      pack: function (ctx, t) {
        var g = atlas.golgi; var pts = [];
        g.arcs.forEach(function (arc, ai) { if (arc.length < 3) return; var u = ((t * 0.18 + ai * 0.2) % 1) * (arc.length - 1), i0 = Math.floor(u), f = u - i0; var a = arc[i0], b = arc[Math.min(arc.length - 1, i0 + 1)]; pts.push({ x: lerp(a[0], b[0], f), y: lerp(a[1], b[1], f), r: 2.3, c: ai % 2 ? P.teal : P.mint }); });
        var cyc = (t * 0.18) % 1; var outer = g.arcs[g.arcs.length - 1]; if (outer && outer.length) { var end = outer[outer.length - 1]; var bud = smooth((cyc - 0.5) / 0.5); var bx = end[0] + Math.cos(g.rot + 0.6) * bud * 40, by = end[1] + Math.sin(g.rot + 0.6) * bud * 40; for (var k = 0; k < 10; k++) { var th = k / 10 * TAU; pts.push({ x: bx + Math.cos(th) * 5, y: by + Math.sin(th) * 5, r: 1.2, c: P.gold }); } }
        glows(ctx, pts, 0.7, 7); dots(ctx, pts, 0.95);
      },
      // delivery: a vesicle reaches the membrane and its content leaves the cell
      exit: function (ctx, t) {
        var rc = atlas.receptors[3]; var start = membranePoint(rc.a, 0.62), end = membranePoint(rc.a, 0.985);
        var cyc = (t * 0.2) % 1; var u = smooth(cyc / 0.6); var x = lerp(start.x, end.x, u), y = lerp(start.y, end.y, u);
        var pts = []; var burst = smooth((cyc - 0.6) / 0.4);
        if (burst < 1) { for (var k = 0; k < 12; k++) { var th = k / 12 * TAU; pts.push({ x: x + Math.cos(th) * 8 * (1 - burst * 0.5), y: y + Math.sin(th) * 8 * (1 - burst * 0.5), r: 1.3, c: P.gold }); } }
        if (burst > 0) { for (k = 0; k < 14; k++) { var a = rc.a + (k / 14 - 0.5) * 1.2; var d = geo.R * (0.99 + burst * 0.22) + k % 3 * 3; pts.push({ x: geo.cx + Math.cos(a) * d, y: geo.cy + Math.sin(a) * d, r: 1.8 * (1 - burst * 0.6), c: k % 2 ? P.cyan : P.gold }); } }
        glows(ctx, pts, 0.8, 7); dots(ctx, pts, 0.95);
        ringAt(ctx, end.x, end.y, 12, 0.5 + 0.5 * burst, 'rgba(255,209,102,0.8)');
      },
      // the gate: outside particles are turned back at the membrane, the keyed one passes at the receptor
      gate: function (ctx, t, dt) {
        var rc = atlas.receptors[3];
        var wide = spec.zoom <= 1.2; if (gateParticles.length < (wide ? 36 : 14) && Math.random() < (wide ? 0.3 : 0.1)) { var a = wide ? Math.random() * TAU : rc.a + (Math.random() - 0.5) * 1.4; var keyed = Math.random() < 0.25; if (keyed) a = rc.a; var d = geo.R * 1.45; gateParticles.push({ a: a, d: d, v: 60 + Math.random() * 30, keyed: keyed, life: 1, bounced: false }); }
        var live = [], pts = [];
        gateParticles.forEach(function (q) {
          q.d -= q.v * dt;
          if (!q.keyed && q.d < geo.R * 1.03 && !q.bounced) { q.bounced = true; q.v = -q.v * 0.6; }
          if (q.bounced) { q.life -= dt * 0.8; }
          if (q.keyed && q.d < geo.R * 0.6) { q.life -= dt * 1.5; }
          if (q.life <= 0) return;
          if (q.d < geo.R * 1.6) live.push(q);
          pts.push({ x: geo.cx + Math.cos(q.a) * q.d, y: geo.cy + Math.sin(q.a) * q.d, r: (q.keyed ? 2.6 : 1.9) * q.life, c: q.keyed ? P.cyan : (q.bounced ? P.magenta : P.lilac) });
        });
        gateParticles = live;
        glows(ctx, pts, 0.8, 7); dots(ctx, pts, 0.95);
        ringAt(ctx, rc.x, rc.y, 13 + Math.sin(t * 2) * 1.5, 0.7, 'rgba(53,201,242,0.85)');
      },
      // binding: small molecules arrive from outside, lock onto receptors, then let go
      bind: function (ctx, t) {
        var rc = atlas.receptors[3], sites = [rc.a - 0.32, rc.a, rc.a + 0.3];
        var pts = [], rings = [];
        sites.forEach(function (a, i) {
          var cyc = (t * 0.16 + i * 0.33) % 1, come = smooth(cyc / 0.4), hold = cyc > 0.4 && cyc < 0.8, go = smooth((cyc - 0.8) / 0.2);
          var site = membranePoint(a, 1.0), far = membranePoint(a + 0.25 - i * 0.2, 1.75);
          var x = lerp(far.x, site.x, come), y = lerp(far.y, site.y, come);
          if (go > 0) { x = lerp(site.x, far.x, go * 0.4); y = lerp(site.y, far.y, go * 0.4); }
          var alpha = 1 - go;
          [[0, 0], [7, 3], [-5, 5], [3, -7], [-6, -4]].forEach(function (o, k) { pts.push({ x: x + o[0], y: y + o[1], r: k ? 1.8 : 2.6, c: k ? P.amber : P.gold, a: alpha }); });
          if (hold) rings.push({ x: site.x, y: site.y, a: 0.5 + 0.5 * Math.sin((cyc - 0.4) / 0.4 * Math.PI) });
        });
        glows(ctx, pts, 0.75, 7); dots(ctx, pts, 0.95);
        rings.forEach(function (q) { ringAt(ctx, q.x, q.y, 13, q.a, 'rgba(255,209,102,0.9)'); glows(ctx, [{ x: q.x, y: q.y, r: 5, c: P.gold }], 0.6 * q.a, 9); });
      },
      // proliferation: the cell pinches and becomes two
      divide: function (ctx, t) { /* handled in draw: the layer is drawn twice */ },
      // datasets: three vesicles carry their labels
      labels: function (ctx, t) {
        var vs = atlas.vesicles.slice(0, 3); var tags = ['variants · v3 · CC BY', 'structures · v12 · licensed', 'assays · v7 · internal'];
        ctx.save(); ctx.font = '500 11px "Geist Mono", ui-monospace, monospace'; ctx.textBaseline = 'middle';
        vs.forEach(function (v, i) { if (v.x < geo.w * (opts.labelMin || 0)) return; var a = smooth(((t * 0.25 - i * 0.3) % 3) / 0.6); var lx = v.x + v.r + 18, ly = v.y - 6 + i * 4; ctx.globalAlpha = 0.35 + 0.65 * a; ctx.strokeStyle = 'rgba(236,240,255,0.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(v.x + v.r * 0.9, v.y); ctx.lineTo(lx - 6, ly); ctx.stroke(); ctx.fillStyle = 'rgba(5,6,14,0.75)'; var tw = ctx.measureText(tags[i]).width; ctx.fillRect(lx - 4, ly - 9, tw + 10, 18); ctx.fillStyle = '#ECF0FF'; ctx.fillText(tags[i], lx + 1, ly); ringAt(ctx, v.x, v.y, v.r * 1.25, a, 'rgba(255,209,102,0.85)'); });
        ctx.restore();
      }
    };

    function draw(t, dt) {
      var ctx = canvas.getContext('2d'); var w = geo.w, h = geo.h; ctx.setTransform(geo.dpr, 0, 0, geo.dpr, 0, 0);
      var zoom = 1 + Math.sin(t * 0.21 + (opts.phase || 0)) * 0.008 + state.hover * 0.02;
      var ax = geo.cx, ay = geo.cy;
      if (spec.zoom > 1) { ax = w / 2; ay = h / 2; }
      ctx.fillStyle = DARK; ctx.fillRect(0, 0, w, h);
      if (anim === 'divide') {
        var cyc = (t * 0.1) % 1; var stretch = 1 + smooth(cyc / 0.45) * 0.28 * (1 - smooth((cyc - 0.55) / 0.2)); var split = smooth((cyc - 0.5) / 0.35) * geo.R * 1.15; var fade = 1 - smooth((cyc - 0.92) / 0.08);
        [-1, 1].forEach(function (sgn) {
          ctx.save(); ctx.translate(geo.cx + sgn * split, geo.cy); ctx.scale(stretch * (1 - smooth((cyc - 0.5) / 0.35) * 0.32), 1 - smooth((cyc - 0.5) / 0.35) * 0.32); ctx.translate(-geo.cx, -geo.cy);
          ctx.globalAlpha = fade * (sgn < 0 ? 1 : (split > 2 ? 1 : 0)); ctx.drawImage(layer, 0, 0, w, h); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.4 * fade; ctx.drawImage(bl[0], 0, 0, w, h); ctx.globalCompositeOperation = 'source-over'; ctx.restore();
        });
        ctx.globalAlpha = 1;
        return;
      }
      ctx.save(); ctx.translate(ax, ay); ctx.scale(zoom, zoom); ctx.rotate(Math.sin(t * 0.05 + (opts.phase || 0)) * 0.006); ctx.translate(-ax, -ay);
      drawBloom(ctx, layer, bl, 0, 0, w, 0.9, 0.42, h);
      if (ANIMS[anim]) ANIMS[anim](ctx, t, dt);
      ctx.restore();
    }
    build();
    var api = { setProgress: function (p) { state.progress = p; }, redraw: function () { draw(last, 0.016); }, atlas: function () { return atlas; }, rebuild: build };
    if (RM() || opts.static) { return api; }
    new ResizeObserver(function () { var f = fit(canvas, 1.5); if (f.w !== geo.w || f.h !== geo.h) build(); }).observe(canvas);
    canvas.addEventListener('pointerenter', function () { state.hover = 1; }); canvas.addEventListener('pointerleave', function () { state.hover = 0; });
    api.ticker = register(canvas, function (t, dt) { draw(t, dt); }, { margin: '120px 0px' });
    api.pause = function () { api.ticker.paused = true; };
    api.resume = function () { api.ticker.paused = false; wake(); };
    return api;
  }

  window.CytogentCell = { P: P, WARM: WARM, COOL: COOL, ALL: ALL, SEED: SEED, rng: rng, clamp: clamp, lerp: lerp, smooth: smooth, pick: pick, RM: RM, isSmall: isSmall,
    fit: fit, glow: glow, dots: dots, glows: glows, ground: ground, register: register, wake: wake, lastTime: function () { return last; },
    layoutCell: layoutCell, paintCell: paintCell, cellLayer: cellLayer, drawBloom: drawBloom, initHeroScene: initHeroScene, CellView: CellView, viewSpec: viewSpec };
})();
