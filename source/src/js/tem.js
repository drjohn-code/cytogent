/* Cytogent — procedural electron-micrograph scenes.
   Draws cell ultrastructure the way a transmission electron microscope shows it: trilaminar membranes, a
   nucleus with clumped heterochromatin and a nucleolus, mitochondria with cristae, rough ER studded with
   ribosomes, Golgi stacks, vesicles, film grain. Greyscale first; false colour is applied per structure with
   the 'color' blend mode, exactly like a colourised TEM plate. Every scene renders once to a bitmap; the
   animations on top are cheap (pan, scan line, rings, travelling signals, cross-fades).
   Canvas 2D only. No imports, no network. */
(function () {
  'use strict';
  var TAU = Math.PI * 2;
  var RM = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };
  function rng(seed) { var s = (seed >>> 0) || 7; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function clamp(t, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return t < a ? a : t > b ? b : t; }
  function smooth(t) { t = clamp(t); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length) % arr.length]; }
  function grey(v) { v = Math.round(clamp(v, 0, 255)); return 'rgb(' + v + ',' + v + ',' + v + ')'; }

  // false-colour plate: one hue per structure (the site's imagery palette)
  var HUE = {
    extra: '#2B3A8C', cyto: '#237A88', nuc: '#6A47E8', chrom: '#4A2FB8', nucleolus: '#E23F95',
    mito: '#FF7A2A', er: '#E04F9C', golgi: '#35C9F2', ves: '#FFB020', lys: '#FF4D9D', mem: '#5AD8FF',
    chromo: '#7B61FF', spindle: '#35C9F2', immune: '#FF4D9D', gold: '#C8A15A'
  };

  /* ---------- geometry ---------- */
  function blob(cx, cy, rx, ry, rot, r, wob, n) {
    // an irregular ellipse: radius modulated by three low harmonics
    n = n || 48; wob = wob === undefined ? 0.06 : wob;
    var a1 = r() * TAU, a2 = r() * TAU, a3 = r() * TAU, k1 = 2 + Math.floor(r() * 2), k2 = 3 + Math.floor(r() * 3), k3 = 5 + Math.floor(r() * 4);
    var pts = [], cr = Math.cos(rot), sr = Math.sin(rot);
    for (var i = 0; i < n; i++) {
      var th = i / n * TAU;
      var m = 1 + wob * (Math.sin(th * k1 + a1) * 0.6 + Math.sin(th * k2 + a2) * 0.3 + Math.sin(th * k3 + a3) * 0.15);
      var x = Math.cos(th) * rx * m, y = Math.sin(th) * ry * m;
      pts.push([cx + x * cr - y * sr, cy + x * sr + y * cr]);
    }
    return pts;
  }
  function path(ctx, pts, close) {
    // smooth closed curve through the points (Catmull-Rom → bezier)
    var n = pts.length; ctx.beginPath();
    for (var i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      if (!close && (i === n - 1)) { break; }
      if (!close && i === 0) { p0 = p1; }
      if (!close && i === n - 2) { p3 = p2; }
      if (i === 0) { ctx.moveTo(p1[0], p1[1]); }
      ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
    if (close) { ctx.closePath(); }
  }
  function inside(pts, x, y) {
    var c = false; for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      if (((pts[i][1] > y) !== (pts[j][1] > y)) && (x < (pts[j][0] - pts[i][0]) * (y - pts[i][1]) / (pts[j][1] - pts[i][1]) + pts[i][0])) { c = !c; }
    } return c;
  }
  function offsetPts(pts, k) { var cx = 0, cy = 0; pts.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= pts.length; cy /= pts.length; return pts.map(function (p) { return [cx + (p[0] - cx) * k, cy + (p[1] - cy) * k]; }); }

  /* ---------- surface qualities ---------- */
  var grainTile = null;
  function grain() {
    if (grainTile) { return grainTile; }
    var c = document.createElement('canvas'); c.width = c.height = 256; var g = c.getContext('2d');
    var im = g.createImageData(256, 256), d = im.data, r = rng(4242);
    for (var i = 0; i < d.length; i += 4) { var v = 128 + (r() + r() + r() - 1.5) * 44; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    g.putImageData(im, 0, 0); grainTile = c; return c;
  }
  var mottleTile = null;
  function mottle() {
    if (mottleTile) { return mottleTile; }
    var c = document.createElement('canvas'); c.width = c.height = 48; var g = c.getContext('2d');
    var im = g.createImageData(48, 48), d = im.data, r = rng(777);
    for (var i = 0; i < d.length; i += 4) { var v = 128 + (r() + r() - 1) * 40; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    g.putImageData(im, 0, 0); mottleTile = c; return c;
  }
  function texture(ctx, w, h, amount) {
    amount = amount === undefined ? 1 : amount;
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.55 * amount;
    ctx.imageSmoothingEnabled = true;
    var m = mottle(); for (var y = 0; y < h; y += 240) { for (var x = 0; x < w; x += 240) { ctx.drawImage(m, x, y, 240, 240); } }
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.5 * amount;
    var g = grain(); for (y = 0; y < h; y += 256) { for (x = 0; x < w; x += 256) { ctx.drawImage(g, x, y); } }
    ctx.restore();
  }
  function vignette(ctx, w, h, a) {
    var g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.78);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,' + (a === undefined ? 0.42 : a) + ')');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  function softDark(ctx, x, y, rad, a, v) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, rad); var col = v === undefined ? 30 : v;
    g.addColorStop(0, 'rgba(' + col + ',' + col + ',' + col + ',' + a + ')'); g.addColorStop(1, 'rgba(' + col + ',' + col + ',' + col + ',0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill();
  }
  function membrane(ctx, pts, w, close, dark, light) {
    path(ctx, pts, close !== false);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.lineWidth = w; ctx.strokeStyle = grey(dark === undefined ? 34 : dark); ctx.stroke();
    ctx.lineWidth = w * 0.32; ctx.strokeStyle = grey(light === undefined ? 128 : light); ctx.stroke();
  }
  function dotsIn(ctx, r, pts, n, rad, v, bbox) {
    ctx.fillStyle = grey(v); ctx.beginPath();
    var tries = 0;
    for (var i = 0; i < n && tries < n * 6; tries++) {
      var x = bbox[0] + r() * (bbox[2] - bbox[0]), y = bbox[1] + r() * (bbox[3] - bbox[1]);
      if (!inside(pts, x, y)) { continue; }
      ctx.moveTo(x + rad, y); ctx.arc(x, y, rad * (0.8 + r() * 0.5), 0, TAU); i++;
    }
    ctx.fill();
  }
  function bbox(pts) { var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; pts.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }); return [x0, y0, x1, y1]; }

  /* ---------- organelles (greyscale; each records a region for colouring) ---------- */
  function nucleus(S, cx, cy, rx, ry, rot, opts) {
    var r = S.r, ctx = S.ctx; opts = opts || {};
    var pts = blob(cx, cy, rx, ry, rot, r, 0.05, 56);
    path(ctx, pts, true); ctx.fillStyle = grey(108); ctx.fill();
    ctx.save(); path(ctx, pts, true); ctx.clip();
    // euchromatin: light mottling
    for (var i = 0; i < 30; i++) { var a = r() * TAU, d = r() * 0.8; softDark(ctx, cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, rx * (0.08 + r() * 0.14), 0.22, 150); }
    // heterochromatin: dense clumps along the envelope and a few inside
    var nH = 70 + Math.floor(r() * 30);
    for (i = 0; i < nH; i++) {
      a = r() * TAU; d = 0.66 + r() * 0.34; var s = rx * (0.045 + r() * 0.075);
      softDark(ctx, cx + Math.cos(a) * rx * d * 0.96, cy + Math.sin(a) * ry * d * 0.96, s, 0.8, 26);
    }
    for (i = 0; i < 34; i++) { a = r() * TAU; d = r() * 0.62; softDark(ctx, cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d, rx * (0.05 + r() * 0.09), 0.55, 34); }
    // nucleolus: one dense body, slightly off centre, with a granular core
    var na = r() * TAU, nd = 0.25 + r() * 0.2, nx = cx + Math.cos(na) * rx * nd, ny = cy + Math.sin(na) * ry * nd, nr = Math.min(rx, ry) * (0.2 + r() * 0.08);
    var np = blob(nx, ny, nr, nr * 0.85, r() * TAU, r, 0.08, 24);
    path(ctx, np, true); ctx.fillStyle = grey(48); ctx.fill();
    for (i = 0; i < 26; i++) { a = r() * TAU; d = Math.sqrt(r()) * 0.85; softDark(ctx, nx + Math.cos(a) * nr * d, ny + Math.sin(a) * nr * d, nr * 0.22, 0.35, i % 3 ? 22 : 90); }
    ctx.restore();
    // envelope: double membrane with nuclear pores
    membrane(ctx, pts, 3.4, true, 36, 120);
    ctx.strokeStyle = grey(118); ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    var nP = 10 + Math.floor(r() * 8);
    for (i = 0; i < nP; i++) { var k = Math.floor(r() * pts.length), p = pts[k], q = pts[(k + 1) % pts.length]; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(lerp(p[0], q[0], 0.35), lerp(p[1], q[1], 0.35)); ctx.stroke(); }
    S.regions.push({ pts: pts, hue: opts.hue || HUE.nuc, a: 0.92 });
    S.regions.push({ pts: np, hue: HUE.nucleolus, a: 0.9 });
    S.marks.nucleus = { x: cx, y: cy, r: Math.max(rx, ry) };
    return pts;
  }
  function mito(S, cx, cy, rx, ry, rot, opts) {
    var r = S.r, ctx = S.ctx; opts = opts || {};
    var pts = blob(cx, cy, rx, ry, rot, r, 0.035, 40);
    path(ctx, pts, true); ctx.fillStyle = grey(92); ctx.fill();
    ctx.save(); path(ctx, pts, true); ctx.clip();
    // matrix granules
    var bb = bbox(pts); dotsIn(ctx, r, pts, Math.round(rx * ry / 18), 0.9, 60, bb);
    // cristae: transverse folds, some incomplete, a few longitudinal in long ones
    var n = Math.max(3, Math.round(rx / (ry * 0.42))), cr = Math.cos(rot), sr = Math.sin(rot);
    ctx.lineWidth = 1.7; ctx.lineCap = 'round';
    for (var k = 0; k < n; k++) {
      var lx = -rx * 0.86 + (k + 0.5) / n * rx * 1.72 + (r() - 0.5) * ry * 0.2;
      var full = r() < 0.6, from = full ? -ry * 0.92 : (r() < 0.5 ? -ry * 0.92 : ry * 0.1), to = full ? ry * 0.92 : from + ry * (0.6 + r() * 0.5) * (from < 0 ? 1 : 1);
      if (!full && from > 0) { to = ry * 0.92; from = ry * 0.92 - ry * (0.6 + r() * 0.5); }
      var wob = (r() - 0.5) * ry * 0.5;
      ctx.beginPath();
      for (var t = 0; t <= 1.001; t += 0.1) {
        var ly = lerp(from, to, t), xx = lx + Math.sin(t * Math.PI) * wob + Math.sin(t * 9 + k) * ry * 0.06;
        var X = cx + xx * cr - ly * sr, Y = cy + xx * sr + ly * cr;
        if (t === 0) { ctx.moveTo(X, Y); } else { ctx.lineTo(X, Y); }
      }
      ctx.strokeStyle = grey(40); ctx.stroke();
      ctx.lineWidth = 0.7; ctx.strokeStyle = grey(120); ctx.stroke(); ctx.lineWidth = 1.7;
    }
    ctx.restore();
    membrane(ctx, pts, 2.8, true, 30, 118);
    membrane(ctx, offsetPts(pts, 0.9), 1.4, true, 44, 110);
    S.regions.push({ pts: pts, hue: opts.hue || HUE.mito, a: 0.95 });
    S.marks.mito = S.marks.mito || []; S.marks.mito.push({ x: cx, y: cy, r: rx });
    return pts;
  }
  function rer(S, x, y, len, ang, layers, opts) {
    var r = S.r, ctx = S.ctx; opts = opts || {};
    var ca = Math.cos(ang), sa = Math.sin(ang), gap = opts.gap || 9.5, hull = [];
    for (var L = 0; L < layers; L++) {
      var off = (L - (layers - 1) / 2) * gap, ph = r() * TAU, amp = 2 + r() * 3, line = [];
      var ln = len * (0.8 + r() * 0.3), start = -ln / 2 + (r() - 0.5) * len * 0.2;
      for (var t = 0; t <= 1.001; t += 0.05) {
        var u = start + t * ln, v = off + Math.sin(t * 5.5 + ph) * amp + Math.sin(t * 13 + ph) * amp * 0.3;
        line.push([x + u * ca - v * sa, y + u * sa + v * ca]);
      }
      // lumen (light) then two membranes
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      path(ctx, line, false); ctx.lineWidth = 5.2; ctx.strokeStyle = grey(132); ctx.stroke();
      path(ctx, line, false); ctx.lineWidth = 5.2; ctx.strokeStyle = 'rgba(0,0,0,0)';
      ctx.lineWidth = 1.5; ctx.strokeStyle = grey(38);
      var up = line.map(function (p) { return [p[0] + sa * 2.6, p[1] - ca * 2.6]; }), dn = line.map(function (p) { return [p[0] - sa * 2.6, p[1] + ca * 2.6]; });
      path(ctx, up, false); ctx.stroke(); path(ctx, dn, false); ctx.stroke();
      // ribosomes on the cytoplasmic faces
      ctx.fillStyle = grey(28); ctx.beginPath();
      for (var i = 0; i < line.length; i += 1) {
        if (r() < 0.55) { var p = up[i]; ctx.moveTo(p[0] + 1.5, p[1]); ctx.arc(p[0] + (r() - 0.5) * 2 + sa * 1.4, p[1] - ca * 1.4 + (r() - 0.5) * 2, 1.3 + r() * 0.6, 0, TAU); }
        if (r() < 0.55) { var q = dn[i]; ctx.moveTo(q[0] + 1.5, q[1]); ctx.arc(q[0] + (r() - 0.5) * 2 - sa * 1.4, q[1] + ca * 1.4 + (r() - 0.5) * 2, 1.3 + r() * 0.6, 0, TAU); }
      }
      ctx.fill();
      if (L === 0) { hull = hull.concat(up.map(function (p) { return [p[0] + sa * 4, p[1] - ca * 4]; })); }
      if (L === layers - 1) { hull = hull.concat(dn.slice().reverse().map(function (p) { return [p[0] - sa * 4, p[1] + ca * 4]; })); }
    }
    if (layers === 1) { hull = hull.concat(hull.slice().reverse().map(function (p) { return [p[0] - sa * 8, p[1] + ca * 8]; })); }
    S.regions.push({ pts: hull, hue: opts.hue || HUE.er, a: 0.85, poly: true });
    S.marks.er = { x: x, y: y, r: len * 0.5 };
  }
  function golgi(S, cx, cy, rad, ang, opts) {
    var r = S.r, ctx = S.ctx; opts = opts || {};
    var n = 4 + Math.floor(r() * 3), hull = [];
    for (var k = 0; k < n; k++) {
      var rr = rad * (0.55 + k * 0.16), span = 0.95 - k * 0.06, line = [];
      for (var t = -span; t <= span + 0.001; t += 0.08) { line.push([cx + Math.cos(ang + t) * rr, cy + Math.sin(ang + t) * rr]); }
      ctx.lineCap = 'round';
      path(ctx, line, false); ctx.lineWidth = 4.4; ctx.strokeStyle = grey(128); ctx.stroke();
      path(ctx, line, false); ctx.lineWidth = 1.4; ctx.strokeStyle = grey(38); ctx.stroke();
      var inner = line.map(function (p) { return [cx + (p[0] - cx) * (1 - 3.4 / rr), cy + (p[1] - cy) * (1 - 3.4 / rr)]; });
      path(ctx, inner, false); ctx.stroke();
      if (k === 0) { hull = hull.concat(inner.map(function (p) { return [cx + (p[0] - cx) * 0.9, cy + (p[1] - cy) * 0.9]; })); }
      if (k === n - 1) { hull = hull.concat(line.slice().reverse().map(function (p) { return [cx + (p[0] - cx) * 1.1, cy + (p[1] - cy) * 1.1]; })); }
      // budding vesicles at the rims
      [line[0], line[line.length - 1]].forEach(function (p) { if (r() < 0.7) { vesicle(S, p[0] + (r() - 0.5) * 6, p[1] + (r() - 0.5) * 6, 2.2 + r() * 2, { light: true, hue: HUE.golgi, noregion: true }); } });
    }
    S.regions.push({ pts: hull, hue: opts.hue || HUE.golgi, a: 0.85, poly: true });
    S.marks.golgi = { x: cx + Math.cos(ang) * rad * 0.9, y: cy + Math.sin(ang) * rad * 0.9, r: rad * 0.7 };
  }
  function vesicle(S, cx, cy, rad, opts) {
    var r = S.r, ctx = S.ctx; opts = opts || {};
    var pts = blob(cx, cy, rad, rad * (0.85 + r() * 0.15), r() * TAU, r, 0.05, 20);
    path(ctx, pts, true); ctx.fillStyle = grey(opts.dense ? 46 : (opts.light ? 138 : 122)); ctx.fill();
    if (opts.dense) { ctx.save(); path(ctx, pts, true); ctx.clip(); for (var i = 0; i < 6; i++) { softDark(ctx, cx + (r() - 0.5) * rad, cy + (r() - 0.5) * rad, rad * 0.5, 0.35, 20); } ctx.restore(); }
    membrane(ctx, pts, rad > 6 ? 2.2 : 1.5, true, 36, 116);
    if (!opts.noregion) { S.regions.push({ pts: pts, hue: opts.hue || (opts.dense ? HUE.lys : HUE.ves), a: 0.9 }); }
    S.marks.vesicles = S.marks.vesicles || []; S.marks.vesicles.push({ x: cx, y: cy, r: rad });
    return pts;
  }
  function ribosomes(S, pts, n) { var bb = bbox(pts); dotsIn(S.ctx, S.r, pts, n, 1.25, 30, bb); }
  function filaments(S, pts, n) {
    var r = S.r, ctx = S.ctx, bb = bbox(pts);
    ctx.strokeStyle = 'rgba(40,40,40,0.35)'; ctx.lineWidth = 0.9;
    for (var i = 0; i < n; i++) {
      var x = bb[0] + r() * (bb[2] - bb[0]), y = bb[1] + r() * (bb[3] - bb[1]); if (!inside(pts, x, y)) { continue; }
      var a = r() * TAU, l = 20 + r() * 60; ctx.beginPath(); ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + Math.cos(a + 0.4) * l * 0.5, y + Math.sin(a + 0.4) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
    }
  }
  function cytoplasm(S, pts, v) {
    var ctx = S.ctx; path(ctx, pts, true); ctx.fillStyle = grey(v === undefined ? 116 : v); ctx.fill();
    ctx.save(); path(ctx, pts, true); ctx.clip();
    var r = S.r, bb = bbox(pts);
    for (var i = 0; i < 40; i++) { softDark(ctx, bb[0] + r() * (bb[2] - bb[0]), bb[1] + r() * (bb[3] - bb[1]), 14 + r() * 40, 0.16, r() < 0.5 ? 60 : 160); }
    ctx.restore();
  }
  function extracellular(S, w, h, v) {
    var ctx = S.ctx, r = S.r; ctx.fillStyle = grey(v === undefined ? 152 : v); ctx.fillRect(0, 0, w, h);
    // collagen-like fibrils and debris
    ctx.strokeStyle = 'rgba(70,70,70,0.28)'; ctx.lineWidth = 1.1;
    for (var i = 0; i < 26; i++) { var x = r() * w, y = r() * h, a = r() * TAU, l = 30 + r() * 90; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke(); }
    for (i = 0; i < 60; i++) { softDark(ctx, r() * w, r() * h, 6 + r() * 20, 0.12, r() < 0.5 ? 90 : 190); }
  }

  /* ---------- colouring + finish ---------- */
  function colourise(S, mode) {
    var ctx = S.ctx;
    if (mode === 'bw') { return; }
    ctx.save();
    ctx.globalCompositeOperation = 'color';
    if (mode === 'duotone') {
      ctx.globalAlpha = 0.85; ctx.fillStyle = HUE.gold; ctx.fillRect(0, 0, S.w, S.h);
      ctx.restore(); return;
    }
    S.regions.forEach(function (rg) {
      ctx.globalAlpha = rg.a;
      if (rg.soft) {
        // a soft-edged patch of colour: an ellipse whose hue fades out at the rim
        var g = ctx.createRadialGradient(rg.x, rg.y, 0, rg.x, rg.y, 1);
        g.addColorStop(0, rg.hue); g.addColorStop(0.72, rg.hue); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save(); ctx.translate(rg.x, rg.y); ctx.scale(rg.rx, rg.ry); ctx.translate(-rg.x, -rg.y);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(rg.x, rg.y, 1, 0, TAU); ctx.fill(); ctx.restore();
        return;
      }
      if (rg.poly) { ctx.beginPath(); rg.pts.forEach(function (p, i) { if (i) { ctx.lineTo(p[0], p[1]); } else { ctx.moveTo(p[0], p[1]); } }); ctx.closePath(); }
      else { path(ctx, rg.pts, true); }
      ctx.fillStyle = rg.hue; ctx.fill();
    });
    ctx.restore();
  }
  function finish(S, mode) {
    texture(S.ctx, S.w, S.h, 1);
    if (mode === 'color') {
      // a false-colour plate is punchier than raw grey
      S.ctx.save(); S.ctx.globalCompositeOperation = 'overlay'; S.ctx.globalAlpha = 0.22; S.ctx.fillStyle = '#000'; S.ctx.fillRect(0, 0, S.w, S.h);
      S.ctx.globalCompositeOperation = 'multiply'; S.ctx.globalAlpha = 0.16; S.ctx.fillStyle = '#6a6a6a'; S.ctx.fillRect(0, 0, S.w, S.h); S.ctx.restore();
    } else if (mode === 'bw') {
      S.ctx.save(); S.ctx.globalCompositeOperation = 'multiply'; S.ctx.globalAlpha = 0.28; S.ctx.fillStyle = '#7a7a7a'; S.ctx.fillRect(0, 0, S.w, S.h); S.ctx.restore();
    }
    vignette(S.ctx, S.w, S.h, 0.5);
  }

  /* ---------- scenes ---------- */
  var SCENES = {};

  // a whole cell, the classic plate
  SCENES.cell = function (S, w, h) {
    var r = S.r; extracellular(S, w, h);
    var R = Math.min(w, h) * 0.46, cx = w * 0.5, cy = h * 0.52;
    var cell = blob(cx, cy, R * 1.12, R * 0.95, r() * TAU, r, 0.07, 64);
    cytoplasm(S, cell, 118);
    S.regions.push({ pts: cell, hue: HUE.cyto, a: 0.7 });
    filaments(S, cell, 40);
    var nx = cx - R * 0.18, ny = cy + R * 0.06, nrx = R * 0.42, nry = R * 0.36;
    ribosomes(S, cell, 900);
    rer(S, nx + nrx * 1.15, ny - nry * 0.9, R * 0.62, -0.5, 3);
    rer(S, nx - nrx * 0.4, ny + nry * 1.35, R * 0.5, 0.25, 2);
    golgi(S, cx + R * 0.52, cy - R * 0.32, R * 0.22, -2.4);
    var placed = [];
    for (var i = 0; i < 5; i++) {
      var a = r() * TAU, d = R * (0.5 + r() * 0.4), mx = cx + Math.cos(a) * d, my = cy + Math.sin(a) * d;
      if (Math.hypot(mx - nx, my - ny) < nrx * 1.35 || !inside(cell, mx, my)) { i--; continue; }
      if (placed.some(function (p) { return Math.hypot(p[0] - mx, p[1] - my) < R * 0.3; })) { i--; continue; }
      placed.push([mx, my]);
      mito(S, mx, my, R * (0.14 + r() * 0.08), R * (0.06 + r() * 0.025), r() * TAU);
    }
    for (i = 0; i < 9; i++) { a = r() * TAU; d = R * (0.35 + r() * 0.55); var vx = cx + Math.cos(a) * d, vy = cy + Math.sin(a) * d; if (!inside(cell, vx, vy) || Math.hypot(vx - nx, vy - ny) < nrx * 1.1) { continue; } vesicle(S, vx, vy, R * (0.025 + r() * 0.035), { dense: r() < 0.4 }); }
    nucleus(S, nx, ny, nrx, nry, r() * 0.6 - 0.3);
    membrane(S.ctx, cell, 3.2, true, 30, 122);
    S.marks.cell = { x: cx, y: cy, r: R };
  };

  // a field of mitochondria at higher magnification
  SCENES.mitochondria = function (S, w, h) {
    var r = S.r; var all = [[0, 0], [w, 0], [w, h], [0, h]];
    cytoplasm(S, all, 112); S.regions.push({ pts: all, hue: HUE.cyto, a: 0.75, poly: true });
    ribosomes(S, all, 1400); filaments(S, all, 30);
    rer(S, w * 0.22, h * 0.8, w * 0.42, 0.35, 3); rer(S, w * 0.8, h * 0.2, w * 0.3, -1.1, 2);
    var spots = [[0.25, 0.3, 0.19, 0.25], [0.62, 0.22, 0.15, -0.6], [0.75, 0.62, 0.21, 1.2], [0.36, 0.66, 0.13, -1.9], [0.5, 0.48, 0.1, 0.5]];
    spots.forEach(function (s) { mito(S, w * s[0], h * s[1], Math.min(w, h) * s[2], Math.min(w, h) * s[2] * (0.4 + r() * 0.12), s[3]); });
    for (var i = 0; i < 5; i++) { vesicle(S, r() * w, r() * h, 5 + r() * 9, { dense: r() < 0.5 }); }
  };

  // the plasma membrane in section: outside above, cytoplasm below, vesicles crossing
  SCENES.membrane = function (S, w, h) {
    var r = S.r; extracellular(S, w, h, 156);
    var line = []; for (var t = 0; t <= 1.001; t += 0.04) { line.push([t * w, h * 0.46 + Math.sin(t * 7 + 1) * h * 0.04 + Math.sin(t * 17) * h * 0.015]); }
    var cyto = line.concat([[w, h], [0, h]]);
    S.ctx.beginPath(); cyto.forEach(function (p, i) { if (i) { S.ctx.lineTo(p[0], p[1]); } else { S.ctx.moveTo(p[0], p[1]); } }); S.ctx.closePath(); S.ctx.fillStyle = grey(114); S.ctx.fill();
    S.regions.push({ pts: cyto, hue: HUE.cyto, a: 0.8, poly: true });
    var below = cyto; ribosomes(S, below, 700); filaments(S, below, 26);
    // cortical filaments parallel to the membrane
    S.ctx.strokeStyle = 'rgba(50,50,50,0.4)'; S.ctx.lineWidth = 1;
    for (var k = 1; k < 4; k++) { S.ctx.beginPath(); line.forEach(function (p, i) { var q = [p[0], p[1] + k * 9 + Math.sin(i + k) * 2]; if (i) { S.ctx.lineTo(q[0], q[1]); } else { S.ctx.moveTo(q[0], q[1]); } }); S.ctx.stroke(); }
    mito(S, w * 0.72, h * 0.78, w * 0.13, h * 0.07, 0.3);
    rer(S, w * 0.2, h * 0.8, w * 0.28, 0.2, 2);
    // coated pits and vesicles near the membrane, one microvillus-like fold
    for (var i = 0; i < 6; i++) { var x = w * (0.08 + r() * 0.84), y = h * 0.52 + r() * h * 0.2; vesicle(S, x, y, 5 + r() * 8, { dense: r() < 0.35 }); }
    // a pit: the membrane dips down into a bud
    var px = w * 0.4, base = h * 0.46 + Math.sin(0.4 * 7 + 1) * h * 0.04; var pit = [];
    for (t = 0; t <= 1.001; t += 0.1) { var a = Math.PI + t * Math.PI; pit.push([px + Math.cos(a) * 11, base + 12 + Math.sin(a) * 12]); }
    membrane(S.ctx, pit, 2.6, false, 32, 120);
    S.ctx.fillStyle = grey(26); S.ctx.beginPath(); for (k = 0; k < 8; k++) { var a2 = Math.PI + k / 7 * Math.PI; S.ctx.moveTo(px + Math.cos(a2) * 15, base + 12 + Math.sin(a2) * 15); S.ctx.arc(px + Math.cos(a2) * 15, base + 12 + Math.sin(a2) * 15, 1.6, 0, TAU); } S.ctx.fill();
    membrane(S.ctx, line, 3.4, false, 28, 124);
    // a channel protein: two dense flanks across the membrane
    var chx = w * 0.66, chy = h * 0.46 + Math.sin(0.66 * 7 + 1) * h * 0.04 + Math.sin(0.66 * 17) * h * 0.015;
    S.ctx.fillStyle = grey(30); [-6, 6].forEach(function (dx) { S.ctx.beginPath(); S.ctx.ellipse(chx + dx, chy, 3.2, 7, 0, 0, TAU); S.ctx.fill(); });
    S.marks.channel = { x: chx, y: chy, r: 14 }; S.marks.pit = { x: px, y: base + 12, r: 18 };
    S.marks.line = line;
    S.regions.push({ pts: line.concat(line.slice().reverse().map(function (p) { return [p[0], p[1] - 7]; })), hue: HUE.mem, a: 0.9, poly: true });
  };

  // four frames of a dividing cell, for a time-lapse cross-fade
  SCENES.division = function (S, w, h, frame) {
    var r = S.r; extracellular(S, w, h);
    var R = Math.min(w, h) * 0.34, cx = w * 0.5, cy = h * 0.5, f = frame || 0;
    var cells = [];
    if (f < 3) {
      var stretch = f === 2 ? 1.55 : (f === 1 ? 1.12 : 1), pinch = f === 2 ? 0.38 : 0;
      var pts = []; for (var i = 0; i < 64; i++) { var th = i / 64 * TAU; var m = 1 - pinch * Math.pow(Math.abs(Math.sin(th)), 1.2) * (Math.abs(Math.cos(th)) < 0.35 ? 1 : 0.2); pts.push([cx + Math.cos(th) * R * stretch * m * (1 + 0.04 * Math.sin(th * 3)), cy + Math.sin(th) * R * 0.92 * (1 - pinch * 0.6 * (1 - Math.abs(Math.cos(th)))) * (1 + 0.03 * Math.sin(th * 5 + 1))]); }
      cells.push(pts);
    } else {
      cells.push(blob(cx - R * 0.95, cy, R * 0.86, R * 0.8, 0.2, r, 0.05, 48)); cells.push(blob(cx + R * 0.95, cy, R * 0.84, R * 0.82, -0.3, r, 0.05, 48));
    }
    cells.forEach(function (c, ci) {
      cytoplasm(S, c, 118); S.regions.push({ pts: c, hue: HUE.cyto, a: 0.8 }); ribosomes(S, c, 380); filaments(S, c, 18);
      for (var k = 0; k < 3; k++) { var a = r() * TAU, d = R * (0.5 + r() * 0.3); var mx = (ci === 0 && f === 3 ? cx - R * 0.95 : (f === 3 ? cx + R * 0.95 : cx)) + Math.cos(a) * d * (f === 2 ? 1.3 : 1), my = cy + Math.sin(a) * d * 0.8; if (inside(c, mx, my) && Math.hypot(mx - (f === 3 ? (ci ? cx + R * 0.95 : cx - R * 0.95) : cx), my - cy) > R * 0.42) { mito(S, mx, my, R * 0.14, R * 0.055, r() * TAU); } }
    });
    if (f === 0) { nucleus(S, cx - R * 0.1, cy, R * 0.42, R * 0.38, 0.2); }
    if (f === 1 || f === 2) {
      // condensed chromosomes: dark rods at the plate (f1) or two groups pulled apart (f2)
      S.ctx.fillStyle = grey(28); S.ctx.strokeStyle = grey(28); S.ctx.lineWidth = 3.6; S.ctx.lineCap = 'round';
      var groups = f === 1 ? [[cx, cy]] : [[cx - R * 0.72, cy], [cx + R * 0.72, cy]];
      groups.forEach(function (g) { for (var k = 0; k < 14; k++) { var x = g[0] + (r() - 0.5) * (f === 1 ? R * 0.16 : R * 0.3), y = g[1] + (k - 6.5) * R * 0.09 + (r() - 0.5) * R * 0.05; var l = R * (0.08 + r() * 0.1), an = f === 1 ? (r() - 0.5) * 0.4 : (r() - 0.5) * 1.2; S.ctx.beginPath(); S.ctx.moveTo(x - Math.cos(an) * l, y - Math.sin(an) * l); S.ctx.lineTo(x + Math.cos(an) * l, y + Math.sin(an) * l); S.ctx.stroke(); } });
      // spindle: faint microtubules to two poles
      S.ctx.strokeStyle = 'rgba(60,60,60,0.45)'; S.ctx.lineWidth = 0.9;
      var poles = [[cx - R * (f === 1 ? 0.8 : 1.25), cy], [cx + R * (f === 1 ? 0.8 : 1.25), cy]];
      poles.forEach(function (p) { for (var k = 0; k < 16; k++) { S.ctx.beginPath(); S.ctx.moveTo(p[0], p[1]); var tx = cx + (p[0] > cx ? 1 : -1) * (f === 1 ? 0 : R * 0.72) + (r() - 0.5) * R * 0.2, ty = cy + (k - 7.5) * R * 0.1; S.ctx.quadraticCurveTo((p[0] + tx) / 2, ty + (r() - 0.5) * 10, tx, ty); S.ctx.stroke(); } softDark(S.ctx, p[0], p[1], 7, 0.8, 30); });
      groups.forEach(function (g) { S.regions.push({ soft: true, x: g[0], y: g[1], rx: R * (f === 1 ? 0.28 : 0.4), ry: R * 0.85, hue: HUE.chromo, a: 0.85 }); });
      poles.forEach(function (p) { S.regions.push({ soft: true, x: (p[0] + cx) / 2, y: cy, rx: R * 0.5, ry: R * 0.7, hue: HUE.spindle, a: 0.3 }); });
    }
    if (f === 3) { nucleus(S, cx - R * 0.95, cy, R * 0.36, R * 0.33, 0.1); nucleus(S, cx + R * 0.95, cy + R * 0.05, R * 0.35, R * 0.34, -0.2); }
    cells.forEach(function (c) { membrane(S.ctx, c, 3, true, 30, 122); });
    S.marks.cell = { x: cx, y: cy, r: R };
  };

  // a tissue section: many packed cells, some immune
  SCENES.tissue = function (S, w, h) {
    var r = S.r; extracellular(S, w, h, 148);
    var cols = 5, rows = 4, cw = w / (cols - 1), ch = h / (rows - 1), cells = [];
    for (var j = 0; j < rows; j++) { for (var i = 0; i < cols; i++) {
      var x = i * cw + (r() - 0.5) * cw * 0.5, y = j * ch + (r() - 0.5) * ch * 0.5, imm = r() < 0.22;
      var rad = Math.min(cw, ch) * (imm ? 0.34 : 0.5);
      var pts = blob(x, y, rad * (1 + r() * 0.25), rad * (0.8 + r() * 0.3), r() * TAU, r, 0.09, 40);
      cells.push({ pts: pts, x: x, y: y, rad: rad, imm: imm });
    } }
    cells.forEach(function (c) { cytoplasm(S, c.pts, c.imm ? 124 : 116); S.regions.push({ pts: c.pts, hue: c.imm ? HUE.immune : HUE.cyto, a: c.imm ? 0.55 : 0.75 }); ribosomes(S, c.pts, 60); });
    cells.forEach(function (c) {
      if (!c.imm) { for (var k = 0; k < 2; k++) { var a = r() * TAU, d = c.rad * 0.55; var mx = c.x + Math.cos(a) * d, my = c.y + Math.sin(a) * d; if (inside(c.pts, mx, my)) { mito(S, mx, my, c.rad * 0.22, c.rad * 0.09, r() * TAU); } } }
      var nr = c.rad * (c.imm ? 0.72 : 0.42);
      nucleus(S, c.x + (r() - 0.5) * c.rad * 0.3, c.y + (r() - 0.5) * c.rad * 0.3, nr * (1 + r() * 0.2), nr * (0.85 + r() * 0.2), r() * TAU, { hue: c.imm ? HUE.chrom : HUE.nuc });
      if (c.imm) { for (var g = 0; g < 8; g++) { var ga = r() * TAU, gd = c.rad * (0.72 + r() * 0.2); vesicle(S, c.x + Math.cos(ga) * gd, c.y + Math.sin(ga) * gd, 2.5 + r() * 2.5, { dense: true, noregion: true }); } }
    });
    cells.forEach(function (c) { membrane(S.ctx, c.pts, 2.6, true, 34, 120); });
    S.marks.cell = { x: w / 2, y: h / 2, r: Math.min(w, h) * 0.3 };
  };

  // an ordered epithelial layer: columnar cells, basal nuclei, brush border
  SCENES.epithelium = function (S, w, h) {
    var r = S.r; extracellular(S, w, h, 158);
    var n = 6, cw = w / n, top = h * 0.16, bot = h * 0.9;
    for (var i = 0; i < n; i++) {
      var x0 = i * cw + (r() - 0.5) * 6, x1 = (i + 1) * cw + (r() - 0.5) * 6;
      var pts = [[x0 + 4, top + (r() - 0.5) * 8], [x1 - 4, top + (r() - 0.5) * 8], [x1 - 2, bot], [x0 + 2, bot]];
      var poly = []; for (var e = 0; e < 4; e++) { var a = pts[e], b = pts[(e + 1) % 4]; for (var t = 0; t < 1; t += 0.1) { poly.push([lerp(a[0], b[0], t) + (r() - 0.5) * 3, lerp(a[1], b[1], t) + (r() - 0.5) * 3]); } }
      cytoplasm(S, poly, 118); S.regions.push({ pts: poly, hue: HUE.cyto, a: 0.78, poly: true }); ribosomes(S, poly, 220);
      mito(S, lerp(x0, x1, 0.5), top + (bot - top) * (0.32 + r() * 0.12), cw * 0.1, cw * 0.24, Math.PI / 2 + (r() - 0.5) * 0.4);
      rer(S, lerp(x0, x1, 0.5), top + (bot - top) * 0.56, cw * 0.55, 0.15 + (r() - 0.5) * 0.4, 2, { gap: 8 });
      nucleus(S, lerp(x0, x1, 0.5), top + (bot - top) * 0.76, cw * 0.28, cw * 0.36, 0.1);
      membrane(S.ctx, poly, 2.6, false, 34, 120);
      // brush border: microvilli
      S.ctx.strokeStyle = grey(40); S.ctx.lineWidth = 2.2; S.ctx.lineCap = 'round';
      for (var m = 0; m < 14; m++) { var mx = lerp(x0 + 6, x1 - 6, m / 13); S.ctx.beginPath(); S.ctx.moveTo(mx, top + 1); S.ctx.lineTo(mx + (r() - 0.5) * 3, top - 14 - r() * 8); S.ctx.stroke(); }
    }
    // basement membrane
    S.ctx.strokeStyle = grey(46); S.ctx.lineWidth = 3.2; S.ctx.beginPath(); S.ctx.moveTo(0, bot + 4); for (var q = 0; q <= 10; q++) { S.ctx.lineTo(q / 10 * w, bot + 4 + Math.sin(q * 1.3) * 2); } S.ctx.stroke();
    S.regions.push({ pts: [[0, top - 26], [w, top - 26], [w, top + 2], [0, top + 2]], hue: HUE.mem, a: 0.7, poly: true });
    S.marks.cell = { x: w / 2, y: h / 2, r: h * 0.35 };
  };

  // a crystalline lattice at atomic-ish resolution, with a grain boundary
  SCENES.crystal = function (S, w, h) {
    var r = S.r, ctx = S.ctx; ctx.fillStyle = grey(96); ctx.fillRect(0, 0, w, h);
    var sp = Math.max(9, Math.min(w, h) / 34), ang = 0.28, bx = w * 0.58;
    function lattice(a, x0, x1, off, dark) {
      var ca = Math.cos(a), sa = Math.sin(a);
      for (var i = -60; i < 60; i++) { for (var j = -60; j < 60; j++) {
        var u = (i + (j % 2 ? 0.5 : 0)) * sp + off, v = j * sp * 0.87;
        var x = w / 2 + u * ca - v * sa, y = h / 2 + u * sa + v * ca;
        if (x < x0 || x > x1 || y < -sp || y > h + sp) { continue; }
        var g = ctx.createRadialGradient(x, y, 0, x, y, sp * 0.42); g.addColorStop(0, 'rgba(' + dark + ',' + dark + ',' + dark + ',0.95)'); g.addColorStop(1, 'rgba(' + dark + ',' + dark + ',' + dark + ',0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, sp * 0.42, 0, TAU); ctx.fill();
        if (r() < 0.015) { softDark(ctx, x, y, sp * 0.9, 0.5, 170); }
      } }
    }
    lattice(ang, -sp, bx, 0, 34); lattice(ang + 0.31, bx, w + sp, sp * 0.3, 30);
    // the boundary: a slightly lighter band with dislocations
    ctx.strokeStyle = 'rgba(180,180,180,0.35)'; ctx.lineWidth = sp * 0.6; ctx.beginPath(); ctx.moveTo(bx, -10); for (var y = 0; y <= h; y += 20) { ctx.lineTo(bx + Math.sin(y * 0.05) * sp * 0.4, y); } ctx.stroke();
    for (var k = 0; k < 6; k++) { softDark(ctx, r() * w, r() * h, sp * (2 + r() * 3), 0.35, r() < 0.5 ? 40 : 160); }
    S.marks.cell = { x: w / 2, y: h / 2, r: Math.min(w, h) * 0.3 };
  };

  // a cell with a receptor on its membrane, ready for a signal to travel to the nucleus
  SCENES.signaling = function (S, w, h) {
    var r = S.r; extracellular(S, w, h);
    var R = Math.min(w, h) * 0.47, cx = w * 0.55, cy = h * 0.5;
    var cell = blob(cx, cy, R * 1.28, R * 0.98, 0.15, r, 0.06, 64);
    cytoplasm(S, cell, 118); S.regions.push({ pts: cell, hue: HUE.cyto, a: 0.8 }); filaments(S, cell, 36); ribosomes(S, cell, 800);
    var nx = cx + R * 0.45, ny = cy + R * 0.02, nrx = R * 0.4, nry = R * 0.36;
    rer(S, nx - nrx * 1.3, ny + nry * 0.9, R * 0.5, 0.9, 3);
    golgi(S, nx - nrx * 0.3, ny - nry * 1.35, R * 0.2, 1.4);
    mito(S, cx - R * 0.6, cy + R * 0.42, R * 0.17, R * 0.07, -0.5); mito(S, cx - R * 0.15, cy - R * 0.55, R * 0.15, R * 0.06, 0.9); mito(S, cx - R * 0.75, cy - R * 0.3, R * 0.12, R * 0.055, 1.9);
    for (var i = 0; i < 6; i++) { var a = r() * TAU, d = R * (0.3 + r() * 0.6), vx = cx + Math.cos(a) * d, vy = cy + Math.sin(a) * d; if (inside(cell, vx, vy) && Math.hypot(vx - nx, vy - ny) > nrx * 1.15) { vesicle(S, vx, vy, R * (0.03 + r() * 0.03), { dense: r() < 0.4 }); } }
    nucleus(S, nx, ny, nrx, nry, -0.2);
    membrane(S.ctx, cell, 3.2, true, 30, 122);
    // the receptor: a dense dimer straddling the membrane on the left
    var best = cell[0]; cell.forEach(function (p) { if (p[0] < best[0]) { best = p; } });
    var rx = best[0], ry = best[1];
    S.ctx.fillStyle = grey(26); [-5, 5].forEach(function (dy) { S.ctx.beginPath(); S.ctx.ellipse(rx, ry + dy, 7.5, 3.6, 0, 0, TAU); S.ctx.fill(); });
    S.marks.receptor = { x: rx, y: ry, r: 16 };
    // cascade nodes between receptor and nucleus
    var nodes = []; for (var k = 1; k <= 3; k++) { var t = k / 4; nodes.push({ x: lerp(rx + 14, nx - nrx - 6, t) + (k === 2 ? 0 : (k === 1 ? 6 : -6)), y: lerp(ry, ny, t) + Math.sin(k * 2.1) * R * 0.22 }); }
    S.marks.nodes = nodes; S.marks.cell = { x: cx, y: cy, r: R };
  };

  // a metaphase cell: chromosomes lined up, spindle to two poles
  SCENES.checkpoint = function (S, w, h) {
    var r = S.r; extracellular(S, w, h);
    var R = Math.min(w, h) * 0.4, cx = w * 0.5, cy = h * 0.5;
    var cell = blob(cx, cy, R * 1.25, R * 0.95, 0.1, r, 0.04, 64);
    cytoplasm(S, cell, 118); S.regions.push({ pts: cell, hue: HUE.cyto, a: 0.8 }); ribosomes(S, cell, 700);
    for (var k = 0; k < 4; k++) { var a = r() * TAU, d = R * (0.62 + r() * 0.25); var mx = cx + Math.cos(a) * d, my = cy + Math.sin(a) * d * 0.7; if (inside(cell, mx, my) && Math.abs(mx - cx) > R * 0.35) { mito(S, mx, my, R * 0.13, R * 0.05, r() * TAU); } }
    var poles = [[cx - R * 0.95, cy], [cx + R * 0.95, cy]];
    S.ctx.strokeStyle = 'rgba(55,55,55,0.5)'; S.ctx.lineWidth = 0.9;
    poles.forEach(function (p) { for (var i = 0; i < 22; i++) { var ty = cy + (i - 10.5) * R * 0.075; S.ctx.beginPath(); S.ctx.moveTo(p[0], p[1]); S.ctx.quadraticCurveTo((p[0] + cx) / 2, ty + (r() - 0.5) * 8, cx + (r() - 0.5) * R * 0.08, ty); S.ctx.stroke(); } softDark(S.ctx, p[0], p[1], 9, 0.85, 28); });
    S.ctx.strokeStyle = grey(26); S.ctx.lineWidth = 4; S.ctx.lineCap = 'round';
    for (k = 0; k < 16; k++) { var y = cy + (k - 7.5) * R * 0.1 + (r() - 0.5) * R * 0.03, x = cx + (r() - 0.5) * R * 0.1, l = R * (0.07 + r() * 0.08), an = (r() - 0.5) * 0.5; S.ctx.beginPath(); S.ctx.moveTo(x - Math.cos(an) * l, y - Math.sin(an) * l); S.ctx.lineTo(x + Math.cos(an) * l, y + Math.sin(an) * l); S.ctx.stroke(); }
    S.regions.push({ soft: true, x: cx - R * 0.55, y: cy, rx: R * 0.55, ry: R * 0.8, hue: HUE.spindle, a: 0.4 });
    S.regions.push({ soft: true, x: cx + R * 0.55, y: cy, rx: R * 0.55, ry: R * 0.8, hue: HUE.spindle, a: 0.4 });
    S.regions.push({ soft: true, x: cx, y: cy, rx: R * 0.3, ry: R * 0.9, hue: HUE.chromo, a: 0.85 });
    membrane(S.ctx, cell, 3.2, true, 30, 122);
    S.marks.plate = { x: cx, y: cy, r: R * 0.5 }; S.marks.cell = { x: cx, y: cy, r: R };
  };

  // a stressed cell: many vacuoles and blebs
  SCENES.stressed = function (S, w, h) {
    var r = S.r; extracellular(S, w, h);
    var R = Math.min(w, h) * 0.45, cx = w * 0.5, cy = h * 0.5;
    var cell = blob(cx, cy, R * 1.15, R * 0.95, r() * TAU, r, 0.11, 64);
    cytoplasm(S, cell, 116); S.regions.push({ pts: cell, hue: HUE.cyto, a: 0.8 }); ribosomes(S, cell, 500); filaments(S, cell, 30);
    var nx = cx - R * 0.12, ny = cy - R * 0.05, nrx = R * 0.38, nry = R * 0.33;
    for (var i = 0; i < 14; i++) { var a = r() * TAU, d = R * (0.35 + r() * 0.6), vx = cx + Math.cos(a) * d, vy = cy + Math.sin(a) * d; if (!inside(cell, vx, vy) || Math.hypot(vx - nx, vy - ny) < nrx * 1.05) { continue; } vesicle(S, vx, vy, R * (0.05 + r() * 0.08), { light: true, hue: HUE.ves }); }
    for (i = 0; i < 3; i++) { a = r() * TAU; d = R * 0.7; var mx = cx + Math.cos(a) * d, my = cy + Math.sin(a) * d; if (inside(cell, mx, my) && Math.hypot(mx - nx, my - ny) > nrx * 1.3) { mito(S, mx, my, R * 0.12, R * 0.06, r() * TAU); } }
    nucleus(S, nx, ny, nrx, nry, 0.3);
    membrane(S.ctx, cell, 3.2, true, 30, 122);
    S.marks.cell = { x: cx, y: cy, r: R };
  };

  // a protein cartoon with a binding pocket: drawn, not a micrograph
  SCENES.protein = function (S, w, h) {
    var r = S.r, ctx = S.ctx; ctx.fillStyle = '#0c0e1a'; ctx.fillRect(0, 0, w, h);
    var g = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.55); g.addColorStop(0, 'rgba(60,50,130,0.4)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // secondary-structure elements packed inside a compact ellipsoid, joined by loops
    var Rx = w * 0.27, Ry = h * 0.3, cx = w * 0.5, cy = h * 0.5, els = [];
    // a faint molecular surface so the fold reads as one body
    var sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(Rx, Ry) * 1.25); sg.addColorStop(0, 'rgba(120,100,220,0.28)'); sg.addColorStop(0.7, 'rgba(90,70,190,0.14)'); sg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(cx, cy, Rx * 1.35, Ry * 1.3, 0.3, 0, TAU); ctx.fill();
    var kinds = ['helix', 'strand', 'helix', 'strand', 'strand', 'helix', 'loop', 'helix', 'strand', 'helix', 'strand', 'helix', 'strand', 'helix'];
    for (var i = 0; i < kinds.length; i++) {
      var th = r() * TAU, ph = Math.acos(2 * r() - 1), rad = 0.2 + r() * 0.6;
      var x = cx + Math.sin(ph) * Math.cos(th) * Rx * rad, y = cy + Math.sin(ph) * Math.sin(th) * Ry * rad, z = Math.cos(ph) * rad;
      var ang = r() * TAU, len = (kinds[i] === 'helix' ? 0.5 : 0.6) * Math.min(Rx, Ry) * (0.7 + r() * 0.5);
      els.push({ k: kinds[i], x: x, y: y, z: z, a: ang, l: len, c: i });
    }
    els.sort(function (a, b) { return a.z - b.z; });
    var pal = ['#7B61FF', '#35C9F2', '#FF4D9D', '#FFB020', '#2EE6C5', '#B39DFF'];
    // loops first (thin), then elements
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (i = 0; i < els.length - 1; i++) {
      var A = els[i], B = els[i + 1];
      var ax = A.x + Math.cos(A.a) * A.l / 2, ay = A.y + Math.sin(A.a) * A.l / 2, bx = B.x - Math.cos(B.a) * B.l / 2, by = B.y - Math.sin(B.a) * B.l / 2;
      ctx.strokeStyle = 'rgba(210,205,230,0.55)'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(ax, ay);
      ctx.bezierCurveTo(ax + (r() - 0.5) * 60, ay + (r() - 0.5) * 60, bx + (r() - 0.5) * 60, by + (r() - 0.5) * 60, bx, by); ctx.stroke();
    }
    els.forEach(function (e, idx) {
      var depth = (e.z + 1) / 2, col = pal[e.c % pal.length], ca = Math.cos(e.a), sa = Math.sin(e.a), nx = -sa, ny = ca;
      var x0 = e.x - ca * e.l / 2, y0 = e.y - sa * e.l / 2;
      ctx.globalAlpha = 0.45 + depth * 0.55;
      if (e.k === 'helix') {
        // a coil: the front turns bright and wide, the back turns dark and thin
        var turns = Math.max(3, Math.round(e.l / 11)), rr = 7 + depth * 3;
        for (var pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          for (var t = 0; t <= 1.0001; t += 0.02) {
            var phase = t * turns * TAU, front = Math.cos(phase) > 0;
            if ((pass === 1) !== front) { continue; }
            var px = x0 + ca * e.l * t + nx * Math.sin(phase) * rr, py = y0 + sa * e.l * t + ny * Math.sin(phase) * rr;
            ctx.lineTo(px, py);
          }
          ctx.strokeStyle = pass ? col : shade(col, 0.45); ctx.lineWidth = pass ? 5.5 + depth * 2 : 3.2; ctx.stroke();
        }
      } else if (e.k === 'strand') {
        // a flat arrow
        var wd = 6 + depth * 4, hx = x0 + ca * e.l, hy = y0 + sa * e.l, sx = x0 + ca * e.l * 0.78, sy = y0 + sa * e.l * 0.78;
        ctx.fillStyle = col; ctx.beginPath();
        ctx.moveTo(x0 + nx * wd / 2, y0 + ny * wd / 2); ctx.lineTo(sx + nx * wd / 2, sy + ny * wd / 2); ctx.lineTo(sx + nx * wd, sy + ny * wd);
        ctx.lineTo(hx, hy); ctx.lineTo(sx - nx * wd, sy - ny * wd); ctx.lineTo(sx - nx * wd / 2, sy - ny * wd / 2); ctx.lineTo(x0 - nx * wd / 2, y0 - ny * wd / 2); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0 + nx * wd / 2, y0 + ny * wd / 2); ctx.lineTo(sx + nx * wd / 2, sy + ny * wd / 2); ctx.stroke();
      } else {
        ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(e.x + nx * 20, e.y + ny * 20, x0 + ca * e.l, y0 + sa * e.l); ctx.stroke();
      }
    });
    ctx.globalAlpha = 1;
    function shade(hex, k) { var n = parseInt(hex.slice(1), 16); var R = (n >> 16) * k, G = ((n >> 8) & 255) * k, B = (n & 255) * k; return 'rgb(' + Math.round(R) + ',' + Math.round(G) + ',' + Math.round(B) + ')'; }
    // the pocket: a small ligand of atoms in the front-most gap
    var px = cx + Rx * 0.18, py = cy - Ry * 0.12;
    var gl = ctx.createRadialGradient(px, py, 0, px, py, 34); gl.addColorStop(0, 'rgba(200,161,90,0.35)'); gl.addColorStop(1, 'rgba(200,161,90,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(px, py, 34, 0, TAU); ctx.fill();
    ctx.fillStyle = '#F0DFB6';
    [[0, 0], [9, 4], [-8, 6], [4, -9], [-3, -8], [12, -4], [-11, -2]].forEach(function (o, k) { if (k) { ctx.strokeStyle = 'rgba(240,223,182,0.85)'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + o[0], py + o[1]); ctx.stroke(); } });
    [[0, 0], [9, 4], [-8, 6], [4, -9], [-3, -8], [12, -4], [-11, -2]].forEach(function (o, k) { ctx.beginPath(); ctx.arc(px + o[0], py + o[1], k === 0 ? 4.2 : 3.1, 0, TAU); ctx.fill(); });
    S.marks.pocket = { x: px, y: py, r: 26 }; S.marks.cell = { x: cx, y: cy, r: Math.min(w, h) * 0.3 };
    S.nofinish = true;
  };

  // a clinical document skeleton: not a micrograph, a product diagram that fills in
  SCENES.documents = function (S, w, h) {
    var ctx = S.ctx; ctx.fillStyle = '#0f0e0c'; ctx.fillRect(0, 0, w, h);
    S.marks.cell = { x: w / 2, y: h / 2, r: 10 }; S.nofinish = true; S.isDiagram = true;
  };

  /* ---------- render a scene to a bitmap ---------- */
  function render(kind, w, h, mode, seed, frame) {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var c = document.createElement('canvas'); c.width = Math.max(2, Math.round(w * dpr)); c.height = Math.max(2, Math.round(h * dpr));
    var ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var S = { ctx: ctx, w: w, h: h, r: rng(seed || 7), regions: [], marks: {} };
    (SCENES[kind] || SCENES.cell)(S, w, h, frame);
    if (!S.nofinish) { colourise(S, mode); finish(S, mode); }
    return { canvas: c, marks: S.marks, isDiagram: !!S.isDiagram };
  }

  /* ---------- one RAF loop for every micrograph on the page ---------- */
  var tickers = [], running = false, last = 0;
  function loop(now) {
    if (document.hidden) { running = false; return; }
    var t = now / 1000, dt = Math.min(0.05, t - last || 0.016); last = t; var any = false;
    for (var i = 0; i < tickers.length; i++) { var k = tickers[i]; if (k.visible && !k.paused) { any = true; try { k.tick(t, dt); } catch (e) { k.paused = true; if (window.console) { console.error(e); } } } }
    if (any) { requestAnimationFrame(loop); } else { running = false; }
  }
  function wake() { if (!running && !RM()) { running = true; requestAnimationFrame(loop); } }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { wake(); } });

  /* ---------- attach a live micrograph to a canvas ---------- */
  function attach(canvas, opts) {
    opts = opts || {};
    var kind = opts.kind || 'cell', mode = opts.mode || 'color', anim = opts.anim || 'kenburns', seed = opts.seed || 7;
    var W = 0, H = 0, dpr = 1, scene = null, frames = null, ready = false;
    var state = { progress: 0, hover: 0, t0: 0 };
    function size() {
      var r = canvas.getBoundingClientRect(); var w = Math.max(64, Math.round(r.width)), h = Math.max(64, Math.round(r.height));
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      if (w !== W || h !== H) { W = w; H = h; canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); return true; }
      return false;
    }
    function build() {
      size();
      if (kind === 'division') { frames = [0, 1, 2, 3].map(function (f) { return render(kind, W, H, mode, seed + f * 11, f); }); scene = frames[0]; }
      else { scene = render(kind, W, H, mode, seed); }
      ready = true; draw(0);
    }
    function ring(ctx, m, a, t, col) {
      if (!m || a <= 0) { return; }
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col || 'rgba(200,161,90,0.95)'; ctx.lineWidth = 1.4; ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 1.15 + Math.sin(t * 1.4) * 1.5, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(a * 1.4)); ctx.stroke();
      ctx.beginPath(); ctx.arc(m.x, m.y, 2.6, 0, TAU); ctx.fillStyle = col || 'rgba(200,161,90,0.95)'; ctx.fill();
      ctx.restore();
    }
    function draw(t) {
      if (!ready) { return; }
      var ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var tt = t - state.t0;
      // slow drift and zoom, 22s cycle
      var z = anim === 'still' || scene.isDiagram ? 1 : 1.03 + Math.sin(tt * 0.285) * 0.03;
      var ox = anim === 'still' || scene.isDiagram ? 0 : Math.sin(tt * 0.19) * W * 0.012, oy = anim === 'still' || scene.isDiagram ? 0 : Math.cos(tt * 0.16) * H * 0.012;
      ctx.save(); ctx.translate(W / 2 + ox, H / 2 + oy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2);
      if (kind === 'division' && frames) {
        var cyc = (tt * 0.11) % 4, fi = Math.floor(cyc), fr = cyc - fi, nxt = (fi + 1) % 4;
        ctx.drawImage(frames[fi].canvas, 0, 0, W, H);
        if (fr > 0.72) { ctx.globalAlpha = smooth((fr - 0.72) / 0.28); ctx.drawImage(frames[nxt].canvas, 0, 0, W, H); ctx.globalAlpha = 1; }
      } else {
        ctx.drawImage(scene.canvas, 0, 0, W, H);
      }
      var m = scene.marks;
      // scene-specific overlays
      if (anim === 'signal' || kind === 'signaling') {
        var p = state.progress; // 0..1 from the three steps
        var pts = [m.receptor].concat(m.nodes || [], [m.nucleus]);
        ctx.save(); ctx.strokeStyle = 'rgba(200,161,90,0.55)'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 5]);
        ctx.beginPath(); pts.forEach(function (q, i) { if (i) { ctx.lineTo(q.x, q.y); } else { ctx.moveTo(q.x, q.y); } }); ctx.stroke(); ctx.restore();
        // a packet travels along the path, position from progress plus a slow idle run
        var u = p > 0 ? clamp(p) : (tt * 0.12) % 1; var segf = u * (pts.length - 1), si = Math.min(pts.length - 2, Math.floor(segf)), sf = segf - si;
        var a = pts[si], b = pts[si + 1], px = lerp(a.x, b.x, sf), py = lerp(a.y, b.y, sf);
        var gl = ctx.createRadialGradient(px, py, 0, px, py, 16); gl.addColorStop(0, 'rgba(255,214,120,0.9)'); gl.addColorStop(1, 'rgba(255,214,120,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(px, py, 16, 0, TAU); ctx.fill();
        ctx.fillStyle = '#F5F1E8'; ctx.beginPath(); ctx.arc(px, py, 3, 0, TAU); ctx.fill();
        ring(ctx, m.receptor, u > 0.02 ? 1 : 0.35, t); (m.nodes || []).forEach(function (nd, i) { ring(ctx, { x: nd.x, y: nd.y, r: 8 }, u > (i + 1) / (pts.length - 1) - 0.02 ? 1 : 0.25, t); });
        ring(ctx, m.nucleus, u > 0.97 ? 1 : 0.25, t);
      } else if (anim === 'transport' && m.line) {
        // small molecules crossing the membrane through the channel, vesicles pinching in at the pit
        for (var i = 0; i < 6; i++) { var ph = (tt * 0.25 + i * 0.37) % 1; var q = { x: m.channel.x + Math.sin(i * 2.3) * 2, y: m.channel.y - 60 + ph * 120 }; ctx.fillStyle = 'rgba(245,241,232,' + (0.9 * Math.sin(ph * Math.PI)) + ')'; ctx.beginPath(); ctx.arc(q.x, q.y, 2.4, 0, TAU); ctx.fill(); }
        ring(ctx, m.channel, 0.6 + Math.sin(tt * 1.3) * 0.2, t);
        var pp = (tt * 0.18) % 1; ring(ctx, { x: m.pit.x, y: m.pit.y + pp * 34, r: 10 - pp * 3 }, 1 - pp, t);
      } else if (anim === 'ring' && opts.mark && m[opts.mark]) {
        var mk = m[opts.mark]; if (Array.isArray(mk)) { mk = mk[0]; }
        ring(ctx, mk, 0.55 + 0.45 * state.hover, t);
      } else if (anim === 'checkpoint') {
        // a gate around the plate that opens once the check mark lands
        var open = smooth(((tt * 0.16) % 1 - 0.55) / 0.3), gate = m.plate;
        ctx.save(); ctx.strokeStyle = 'rgba(200,161,90,0.9)'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(gate.x, gate.y, gate.r * 1.3, Math.PI * 0.55 + open * 0.8, Math.PI * 1.45 - open * 0.8); ctx.stroke();
        ctx.beginPath(); ctx.arc(gate.x, gate.y, gate.r * 1.3, -Math.PI * 0.45 + open * 0.8, Math.PI * 0.45 - open * 0.8); ctx.stroke();
        var ck = smooth(((tt * 0.16) % 1 - 0.35) / 0.15); if (ck > 0) { ctx.strokeStyle = 'rgba(111,207,151,' + ck + ')'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(gate.x - gate.r * 0.05, gate.y - gate.r * 1.75); ctx.lineTo(gate.x + gate.r * 0.04, gate.y - gate.r * 1.62); ctx.lineTo(gate.x + gate.r * 0.2, gate.y - gate.r * 1.86); ctx.stroke(); }
        ctx.restore();
      } else if (kind === 'documents') {
        drawDocuments(ctx, W, H, tt);
      } else if (anim === 'scan') {
        var sy = ((tt * 0.07) % 1) * H; var sg = ctx.createLinearGradient(0, sy - 40, 0, sy + 4); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(1, 'rgba(255,255,255,0.14)'); ctx.fillStyle = sg; ctx.fillRect(0, sy - 40, W, 44);
      }
      ctx.restore();
      // scale bar, like every plate
      ctx.save(); ctx.fillStyle = 'rgba(245,241,232,0.85)'; ctx.fillRect(W - 62, H - 18, 44, 2); ctx.restore();
    }
    function drawDocuments(ctx, W, H, tt) {
      // a page outline whose sections fill in one by one, then a second page
      var pw = W * 0.44, ph = H * 0.74, x = W * 0.12, y = H * 0.13, cyc = (tt * 0.09) % 1;
      ctx.fillStyle = '#F5F1E8'; ctx.fillRect(x, y, pw, ph); ctx.fillStyle = '#EDE7DA'; ctx.fillRect(x + pw + 18, y + 14, pw, ph);
      var secs = ['Protocol', 'Endpoints', 'Cohort', 'Sample size', 'SAP', 'Monitoring'];
      ctx.font = '500 10px "Geist Mono", ui-monospace, monospace';
      secs.forEach(function (s, i) {
        var f = smooth((cyc - i * 0.13) / 0.12), sy = y + 22 + i * (ph - 30) / secs.length;
        ctx.fillStyle = 'rgba(20,18,16,' + (0.25 + f * 0.7) + ')'; ctx.fillText(s.toUpperCase(), x + 14, sy);
        ctx.fillStyle = 'rgba(20,18,16,' + (0.12 + f * 0.3) + ')';
        for (var k = 0; k < 3; k++) { ctx.fillRect(x + 14, sy + 6 + k * 6, (pw - 28) * (k === 2 ? 0.55 : 0.9) * f, 2.2); }
        if (f > 0.99) { ctx.fillStyle = 'rgba(111,207,151,0.9)'; ctx.beginPath(); ctx.arc(x + pw - 14, sy - 3, 3, 0, TAU); ctx.fill(); }
      });
      ctx.fillStyle = 'rgba(200,161,90,0.9)'; ctx.font = '500 10px "Geist Mono", ui-monospace, monospace'; ctx.fillText('PROTOCOL v0.3 · DRAFT', x + 14, y + ph - 10);
    }
    build();
    var k = { visible: false, paused: false, tick: function (t) { draw(t); } };
    tickers.push(k);
    if (RM() || anim === 'still') { k.paused = true; }
    else {
      new IntersectionObserver(function (es) { k.visible = es[0].isIntersecting; if (k.visible) { wake(); } }, { rootMargin: '120px 0px' }).observe(canvas);
      new ResizeObserver(function () { if (size()) { build(); } }).observe(canvas);
    }
    canvas.addEventListener('pointerenter', function () { state.hover = 1; });
    canvas.addEventListener('pointerleave', function () { state.hover = 0; });
    return {
      setProgress: function (p) { state.progress = p; },
      redraw: function () { draw(last); },
      marks: function () { return scene ? scene.marks : {}; }
    };
  }

  window.CytogentTEM = { render: render, attach: attach, HUE: HUE, scenes: Object.keys(SCENES), wake: wake };
})();
