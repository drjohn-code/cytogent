/* Cytogent — agentic diagrams.
   The page's illustrations of how the workspace works: people as circles, agents as squircles, models as chips,
   datasets and documents as cards, evidence as a page with citation markers, projects as boxes. Drawn line-by-line
   in the site's own palette, with small glows, and animated where the motion means something.
   Canvas 2D. Uses the shared RAF loop from cell.js. No imports, no network. */
(function () {
  'use strict';
  var C = window.CytogentCell, P = C.P, TAU = Math.PI * 2;
  var BASE = '#0A0C1A', INK = '#ECF0FF', INK2 = '#A9B3D1', INK3 = '#8792B5', RAISED = '#0F1224', LINE = 'rgba(236,240,255,0.14)';
  var SANS = '"Geist","Geist Fallback",-apple-system,sans-serif', MONO = '"Geist Mono","Geist Mono Fallback",ui-monospace,monospace';
  function clamp(t, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return t < a ? a : t > b ? b : t; }
  function smooth(t) { t = clamp(t); return t * t * (3 - 2 * t); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function rgba(hex, a) { var n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  // an optional inspector (the layout test harness): every primitive reports what it drew and where. null in production.
  var H = null;
  function emit(el) { return (H && !H.depth) ? H.emit(el) : 0; }
  function enter() { if (H) { H.depth++; } } function leave() { if (H) { H.depth--; } }
  function tw(ctx, s, font) { ctx.save(); ctx.font = font || ('500 11px ' + MONO); var v = ctx.measureText(s).width; ctx.restore(); return v; }
  function chipW(ctx, s, dot) { return tw(ctx, s, '500 10.5px ' + MONO) + 18 + (dot ? 8 : 0); }
  // chips in a row that wraps to the next line when the frame ends; returns the y under the last row
  function chipRow(ctx, x0, y, xmax, items, gap, rowH) {
    var x = x0; gap = gap || 8; rowH = rowH || 26;
    items.forEach(function (it) { var cw = chipW(ctx, it.s, it.o && it.o.dot); if (x > x0 && x + cw > xmax) { x = x0; y += rowH; } chip(ctx, x, y, it.s, it.c, it.o || {}); x += cw + gap; });
    return y;
  }
  // an elbow connector: out to the side, along, and back in; returns a function giving the point at t
  function elbow(ctx, a, b, sx, o) {
    o = o || {}; var col = o.col || P.lilac, pts = [a, { x: sx, y: a.y }, { x: sx, y: b.y }, b];
    emit({ t: 'link', ax: a.x, ay: a.y, bx: sx, by: a.y, mx: 0, my: 0, bend: 0, a: o.a || 0.4 }); emit({ t: 'link', ax: sx, ay: a.y, bx: sx, by: b.y, mx: 0, my: 0, bend: 0, a: o.a || 0.4 }); emit({ t: 'link', ax: sx, ay: b.y, bx: b.x, by: b.y, mx: 0, my: 0, bend: 0, a: o.a || 0.4 });
    ctx.save(); ctx.strokeStyle = rgba(col, o.a === undefined ? 0.4 : o.a); ctx.lineWidth = 1; if (o.dash) ctx.setLineDash([3, 5]); ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (var i = 1; i < 4; i++) ctx.lineTo(pts[i].x, pts[i].y); ctx.stroke(); ctx.restore();
    var L = [], tot = 0; for (var j = 0; j < 3; j++) { var d = Math.hypot(pts[j + 1].x - pts[j].x, pts[j + 1].y - pts[j].y); L.push(d); tot += d; }
    return function (t) { var d = t * tot; for (var k = 0; k < 3; k++) { if (d <= L[k] || k === 2) { var f = L[k] ? Math.min(1, d / L[k]) : 0; return { x: lerp(pts[k].x, pts[k + 1].x, f), y: lerp(pts[k].y, pts[k + 1].y, f) }; } d -= L[k]; } };
  }
  function polyLen(pts) { var L = [], tot = 0; for (var k = 0; k < pts.length - 1; k++) { var d = Math.hypot(pts[k + 1].x - pts[k].x, pts[k + 1].y - pts[k].y); L.push(d); tot += d; } return { L: L, tot: tot }; }
  function polyAt(pts, f) { var m = polyLen(pts), d = clamp(f) * m.tot; for (var k = 0; k < m.L.length; k++) { if (d <= m.L[k] || k === m.L.length - 1) { var u = m.L[k] ? Math.min(1, d / m.L[k]) : 0; return { x: lerp(pts[k].x, pts[k + 1].x, u), y: lerp(pts[k].y, pts[k + 1].y, u) }; } d -= m.L[k]; } return pts[pts.length - 1]; }
  function polyDraw(ctx, pts, f) { var m = polyLen(pts), d = clamp(f) * m.tot; ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); for (var k = 0; k < m.L.length && d > 0; k++) { var u = Math.min(1, d / (m.L[k] || 1)); ctx.lineTo(lerp(pts[k].x, pts[k + 1].x, u), lerp(pts[k].y, pts[k + 1].y, u)); d -= m.L[k]; } ctx.stroke(); }
  function mark(x0, y0, x1, y1, s) { emit({ t: 'icon', s: s || '', x0: x0, y0: y0, x1: x1, y1: y1 }); }
  function fontPx(f) { var m = /(\d+(?:\.\d+)?)px/.exec(f); return m ? +m[1] : 11; }

  /* ---------- primitives ---------- */
  function rrect(ctx, x, y, w, h, r) { emit({ t: 'box', x0: x, y0: y, x1: x + w, y1: y + h }); r = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function text(ctx, s, x, y, o) {
    o = o || {}; ctx.save(); ctx.font = o.font || ('500 11px ' + MONO); ctx.fillStyle = o.color || INK2; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle'; ctx.globalAlpha = o.a === undefined ? 1 : o.a; ctx.fillText(s, x, y);
    if (H && !H.depth && (o.a === undefined || o.a > 0.05)) { var tw = ctx.measureText(s).width, fs = fontPx(ctx.font), x0 = o.align === 'center' ? x - tw / 2 : (o.align === 'right' ? x - tw : x); emit({ t: 'text', s: s, x0: x0, y0: y - fs * 0.38, x1: x0 + tw, y1: y + fs * 0.38, parent: H.parent || 0 }); }
    ctx.restore();
  }
  function glowAt(ctx, x, y, r, col, a) { enter(); C.glows(ctx, [{ x: x, y: y, r: r, c: col }], a === undefined ? 0.6 : a, 6); leave(); }
  // an agent: a squircle with a soft glow, a name and a role
  function agent(ctx, cx, cy, s, col, name, role, on) {
    on = on === undefined ? 1 : on;
    emit({ t: 'agent', x0: cx - s / 2, y0: cy - s / 2, x1: cx + s / 2, y1: cy + s / 2 }); enter();
    glowAt(ctx, cx, cy, s * 0.42, col, 0.18 + 0.35 * on);
    rrect(ctx, cx - s / 2, cy - s / 2, s, s, s * 0.3); ctx.fillStyle = BASE; ctx.fill(); ctx.fillStyle = rgba(col, 0.10 + 0.14 * on); ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = rgba(col, 0.55 + 0.45 * on); ctx.stroke();
    // a small "face": three dots
    ctx.fillStyle = rgba(col, 0.8); [-1, 0, 1].forEach(function (k) { ctx.beginPath(); ctx.arc(cx + k * s * 0.17, cy, s * 0.055, 0, TAU); ctx.fill(); });
    leave();
    if (name) text(ctx, name, cx, cy + s / 2 + 12, { font: '500 12px ' + SANS, color: INK, align: 'center' });
    if (role) text(ctx, role, cx, cy + s / 2 + 26, { font: '500 10px ' + MONO, color: INK3, align: 'center' });
  }
  // a person: a circle
  function person(ctx, cx, cy, r, label, col) {
    col = col || P.paper; emit({ t: 'person', x0: cx - r, y0: cy - r, x1: cx + r, y1: cy + r }); enter(); glowAt(ctx, cx, cy, r * 0.8, P.lilac, 0.25);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fillStyle = BASE; ctx.fill(); ctx.fillStyle = rgba(col, 0.12); ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = rgba(col, 0.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy - r * 0.18, r * 0.24, 0, TAU); ctx.fillStyle = rgba(col, 0.85); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy + r * 0.62, r * 0.46, Math.PI, TAU); ctx.fill(); leave();
    if (label) text(ctx, label, cx, cy + r + 12, { font: '500 12px ' + SANS, color: INK, align: 'center' });
  }
  // a pill with mono text; returns its width
  function chip(ctx, x, y, s, col, o) {
    o = o || {}; ctx.save(); ctx.font = '500 10.5px ' + MONO; var w = ctx.measureText(s).width + 18 + (o.dot ? 8 : 0), h = 20;
    var ax = o.align === 'center' ? x - w / 2 : (o.align === 'right' ? x - w : x);
    emit({ t: 'chip', s: s, x0: ax, y0: y - h / 2, x1: ax + w, y1: y + h / 2 }); enter();
    rrect(ctx, ax, y - h / 2, w, h, 10); ctx.fillStyle = BASE; ctx.fill(); ctx.fillStyle = o.fill || rgba(col || INK3, 0.12); ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = rgba(col || INK3, o.on ? 0.9 : 0.4); ctx.stroke();
    if (o.dot) { ctx.beginPath(); ctx.arc(ax + 10, y, 2.6, 0, TAU); ctx.fillStyle = col; ctx.fill(); }
    ctx.fillStyle = o.color || (o.on ? INK : INK2); ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillText(s, ax + (o.dot ? 17 : 9), y + 0.5); ctx.restore(); leave(); return w;
  }
  // a card: dataset, document, module
  function card(ctx, x, y, w, h, o) {
    o = o || {}; var col = o.col || P.lilac;
    var id = emit({ t: 'card', s: o.title || '', x0: x, y0: y, x1: x + w, y1: y + h }); enter();
    rrect(ctx, x, y, w, h, 8); ctx.fillStyle = o.fill || RAISED; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = o.on ? rgba(col, 0.8) : LINE; ctx.stroke();
    if (o.on) { glowAt(ctx, x + w / 2, y + h / 2, Math.min(w, h) * 0.5, col, 0.12); }
    leave(); if (H) { H.parent = id; }
    if (o.title) text(ctx, o.title, x + 10, y + 13, { font: '500 11px ' + SANS, color: INK });
    var below = o.tag && o.title && w < 300; // a narrow card puts its tag under the title instead of beside it
    var tagShown = false;
    if (o.tag) {
      var room = below ? w - 16 : (o.title ? w - 22 - tw(ctx, o.title, '500 11px ' + SANS) : w - 14);
      if (tw(ctx, o.tag, '500 9.5px ' + MONO) <= room) { tagShown = true; if (below) text(ctx, o.tag, x + 10, y + 27, { font: '500 9.5px ' + MONO, color: col }); else text(ctx, o.tag, x + w - 7, y + 13, { font: '500 9.5px ' + MONO, color: col, align: 'right' }); }
    }
    if (H) { H.parent = 0; }
    var lines = o.lines || 0, ly = y + (o.title ? (below && tagShown ? 40 : 28) : (tagShown ? 24 : 12));
    for (var i = 0; i < lines; i++) { var lw = (w - 20) * (o.widths ? o.widths[i % o.widths.length] : (i % 3 === 2 ? 0.55 : 0.86)); ctx.fillStyle = rgba(INK, o.on ? 0.28 : 0.16); ctx.fillRect(x + 10, ly + i * 8, lw, 2.4); }
  }
  // a connector; returns a function giving the point at t
  function link(ctx, a, b, o) {
    o = o || {}; var col = o.col || P.lilac; var mx = (a.x + b.x) / 2 + (o.bend || 0) * (b.y - a.y), my = (a.y + b.y) / 2 - (o.bend || 0) * (b.x - a.x);
    emit({ t: 'link', ax: a.x, ay: a.y, bx: b.x, by: b.y, mx: mx, my: my, bend: o.bend || 0, dash: !!o.dash, a: o.a === undefined ? 0.45 : o.a });
    ctx.save(); ctx.strokeStyle = rgba(col, o.a === undefined ? 0.45 : o.a); ctx.lineWidth = o.w || 1; if (o.dash) ctx.setLineDash([3, 5]);
    ctx.beginPath(); ctx.moveTo(a.x, a.y); if (o.bend) ctx.quadraticCurveTo(mx, my, b.x, b.y); else ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore();
    return function (t) { var m = 1 - t; return o.bend ? { x: m * m * a.x + 2 * m * t * mx + t * t * b.x, y: m * m * a.y + 2 * m * t * my + t * t * b.y } : { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }; };
  }
  function packet(ctx, p, col, r) { enter(); C.glows(ctx, [{ x: p.x, y: p.y, r: r || 2.6, c: col }], 0.9, 9); C.dots(ctx, [{ x: p.x, y: p.y, r: (r || 2.6) * 0.6, c: P.paper }], 1); leave(); }
  function check(ctx, cx, cy, r, col, a) {
    a = a === undefined ? 1 : a; if (a <= 0) return; emit({ t: 'check', x0: cx - r, y0: cy - r, x1: cx + r, y1: cy + r }); enter(); ctx.save(); ctx.globalAlpha = a; glowAt(ctx, cx, cy, r, col, 0.4);
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fillStyle = BASE; ctx.fill(); ctx.fillStyle = rgba(col, 0.18); ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1.4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - r * 0.42, cy + r * 0.02); ctx.lineTo(cx - r * 0.1, cy + r * 0.34); ctx.lineTo(cx + r * 0.46, cy - r * 0.32); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); leave();
  }
  function cross(ctx, cx, cy, r, col) { emit({ t: 'check', x0: cx - r * 0.4, y0: cy - r * 0.4, x1: cx + r * 0.4, y1: cy + r * 0.4 }); ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - r * 0.4, cy - r * 0.4); ctx.lineTo(cx + r * 0.4, cy + r * 0.4); ctx.moveTo(cx + r * 0.4, cy - r * 0.4); ctx.lineTo(cx - r * 0.4, cy + r * 0.4); ctx.stroke(); ctx.restore(); }
  // a document page with text lines and citation markers
  function page(ctx, x, y, w, h, o) {
    o = o || {}; var id = emit({ t: 'page', s: o.title || '', x0: x, y0: y, x1: x + w, y1: y + h }); enter(); rrect(ctx, x, y, w, h, 6); ctx.fillStyle = o.fill || '#111530'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = o.on ? rgba(P.lilac, 0.7) : LINE; ctx.stroke();
    var n = o.lines || 7, pad = 10, lh = (h - pad * 2 - (o.title ? 14 : 0)) / n, marks = [];
    if (H) { H.parent = id; } if (o.title) text(ctx, o.title, x + pad, y + pad + 4, { font: '500 11px ' + SANS, color: INK }); if (H) { H.parent = 0; }
    for (var i = 0; i < n; i++) { var ly = y + pad + (o.title ? 16 : 0) + i * lh + lh / 2, lw = (w - pad * 2) * ([0.9, 0.72, 0.84, 0.6, 0.88, 0.66, 0.5][i % 7]); var f = o.fill_t === undefined ? 1 : smooth((o.fill_t - i / n) * n); if (f <= 0) continue; ctx.fillStyle = rgba(INK, 0.22); ctx.fillRect(x + pad, ly - 1, lw * f, 2.2); if (o.cites && o.cites.indexOf(i) >= 0 && f > 0.98) { var k = o.cites.indexOf(i) + 1, mx = x + pad + lw + 6; ctx.fillStyle = rgba(P.lilac, 0.2); rrect(ctx, mx, ly - 6, 14, 12, 3); ctx.fill(); ctx.strokeStyle = rgba(P.lilac, 0.7); ctx.stroke(); text(ctx, String(k), mx + 7, ly + 0.5, { font: '500 9px ' + MONO, color: P.lilac, align: 'center' }); marks.push({ x: mx + 14, y: ly, k: k }); } }
    leave(); return marks;
  }
  // a DNA double helix between two points, with an optional cut at u (0..1) opened by amount g
  function helix(ctx, x0, y0, x1, y1, o) {
    o = o || {}; var L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux, amp = o.amp || 12, turns = o.turns || (L / 60);
    var gapC = o.cut === undefined ? -1 : o.cut * L, gapW = (o.gap || 0) * 26;
    function at(s, strand) { var ph = s / L * turns * TAU + (strand ? Math.PI : 0); var off = Math.sin(ph) * amp; var sx = s; if (gapC >= 0) { sx = s < gapC ? s - gapW / 2 : s + gapW / 2; } return { x: x0 + ux * sx + nx * off, y: y0 + uy * sx + ny * off, z: Math.cos(ph) }; }
    for (var strand = 0; strand < 2; strand++) { ctx.beginPath(); for (var s = 0; s <= L; s += 3) { if (gapC >= 0 && Math.abs(s - gapC) < 2) { ctx.stroke(); ctx.beginPath(); continue; } var p = at(s, strand); if (s === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); } ctx.strokeStyle = strand ? rgba(P.violet, 0.9) : rgba(P.cyan, 0.9); ctx.lineWidth = 2; ctx.stroke(); }
    ctx.lineWidth = 1.2; for (s = 8; s < L; s += 14) { if (gapC >= 0 && Math.abs(s - gapC) < gapW / 2 + 6) continue; var a = at(s, 0), b = at(s, 1); ctx.strokeStyle = rgba(P.lilac, 0.35 + 0.3 * (a.z > 0 ? 1 : 0)); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    return at;
  }
  function ground(ctx, w, h, seed) {
    if (H) { H.frame = { w: w, h: h }; }
    ctx.fillStyle = '#05060e'; ctx.fillRect(0, 0, w, h);
    var g = ctx.createRadialGradient(w * 0.5, h * 0.5, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.75); g.addColorStop(0, '#12102e'); g.addColorStop(1, '#05060e'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    var r = C.rng(seed || 3), pts = []; for (var i = 0; i < 90; i++) pts.push({ x: r() * w, y: r() * h, r: 0.5 + r() * 1.1, c: C.pick(r, [P.violet, P.blue, P.lilac, P.indigo]) }); C.dots(ctx, pts, 0.45);
  }
  function bars(ctx, x, y, w, h, vals, cols, t) {
    enter(); var n = vals.length, bw = w / n * 0.62, gap = w / n; ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke();
    vals.forEach(function (v, i) { var f = smooth((t - i * 0.08) / 0.5), bh = h * v * f, bx = x + i * gap + (gap - bw) / 2; ctx.fillStyle = rgba(cols[i % cols.length], 0.75); rrect(ctx, bx, y + h - bh, bw, bh, 3); ctx.fill(); if (i === 0 && f > 0.95) { glowAt(ctx, bx + bw / 2, y + h - bh, bw * 0.5, cols[0], 0.5); } }); leave();
  }

  /* ---------- the diagrams ---------- */
  var D = {};

  // How it works: You → question → three agents (with their models) → a cited result → your decision
  D.flow = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 11);
    var p = st.progress > 0 ? st.progress : ((t * 0.09) % 1);
    // the three agents sit so the lowest one's name and role stay inside the frame
    var AS = h < 330 ? 36 : 44, y0 = h * 0.2, y2 = Math.min(h * 0.8, h - AS / 2 - 36), y1 = (y0 + y2) / 2;
    var you = { x: w * 0.12, y: y1 }, ag = [{ x: w * 0.47, y: y0, c: P.violet, n: 'Reader', r: 'long-context LLM' }, { x: w * 0.47, y: y1, c: P.cyan, n: 'Analyst', r: 'code model' }, { x: w * 0.47, y: y2, c: P.magenta, n: 'Writer', r: 'drafting LLM' }];
    // the result page on the right; its numbered sources sit under it, then the human check
    var pg = { x: w * 0.68, y: h * 0.12, w: w * 0.25, h: h * 0.42 }, out = { x: pg.x + pg.w / 2, y: pg.y + pg.h / 2 };
    var s1 = smooth(p / 0.34), s2 = smooth((p - 0.34) / 0.33), s3 = smooth((p - 0.67) / 0.33);
    var fans = ag.map(function (a) { return link(ctx, { x: you.x + 24, y: you.y }, { x: a.x - AS / 2 - 2, y: a.y }, { col: P.lilac, a: 0.3 + 0.3 * s1, bend: 0.08 }); });
    var outs = ag.map(function (a) { return link(ctx, { x: a.x + AS / 2 + 2, y: a.y }, { x: pg.x - 4, y: out.y }, { col: a.c, a: 0.25 + 0.4 * s3, bend: -0.08 }); });
    person(ctx, you.x, you.y, 22, 'You');
    chip(ctx, Math.max(12, you.x - 22), Math.max(18, h * 0.06), 'Why does the line resist?', P.lilac, { on: s1 > 0 });
    ag.forEach(function (a, i) { agent(ctx, a.x, a.y, AS, a.c, a.n, a.r, 0.25 + 0.75 * smooth((s2 - i * 0.2) / 0.5)); });
    if (s1 > 0 && s1 < 1) fans.forEach(function (f) { packet(ctx, f(s1), P.lilac); });
    if (s2 > 0 && s2 < 1) ag.forEach(function (a, i) { var q = smooth((s2 - i * 0.2) / 0.5); if (q > 0 && q < 1) { glowAt(ctx, a.x, a.y, 30 * q, a.c, 0.5); } });
    page(ctx, pg.x, pg.y, pg.w, pg.h, { title: 'Result', lines: 6, cites: [1, 3], fill_t: 0.15 + s3 * 0.85, on: s3 > 0.2 });
    if (s3 > 0 && s3 < 1) outs.forEach(function (f, i) { packet(ctx, f(s3), ag[i].c); });
    // the sources carry the same numbers as the markers on the page, so no connecting lines are needed
    ['[1] article · DOI', '[2] dataset · v3'].forEach(function (sname, i) { chip(ctx, pg.x, pg.y + pg.h + 18 + i * 26, sname, P.lilac, { on: s3 > 0.6 }); });
    var dy = pg.y + pg.h + 18 + 2 * 26 + 6, dx = pg.x + 12;
    check(ctx, dx, dy, 11, P.amber, smooth((s3 - 0.7) / 0.3));
    text(ctx, 'you decide', dx + 20, dy, { font: '500 10.5px ' + MONO, color: P.amber, a: smooth((s3 - 0.7) / 0.3) });
  };

  // Literature & evidence: one query over papers, patents and protocols; three become citations
  D.literature = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 21); var cyc = (t * 0.12) % 1;
    chip(ctx, w * 0.5, h * 0.12, 'resistance · secondary mutation · binding site', P.lilac, { align: 'center', on: true });
    var nar = w / h < 1.2, cols = 6, rows = 3, cw = w * 0.11, ch = h * 0.13, gx = w * 0.06, gy = h * 0.22, ry = h * 0.18, picks = [3, 8, 14], PC = [P.violet, P.magenta, P.amber];
    var cy0 = h * 0.78, mx0 = nar ? w * 0.6 : w * 0.7;
    function cardAt(i) { return { x: gx + (i % cols) * (w * 0.15), y: gy + Math.floor(i / cols) * ry }; }
    // the citation lines first, so the cards they pass behind cover them
    picks.forEach(function (pi, k) { var c = cardAt(pi), on = cyc > (pi / (cols * rows)) / 1.3; if (!on) return; link(ctx, { x: c.x + cw / 2, y: c.y + ch }, { x: mx0 + k * 44, y: cy0 - 10 }, { col: PC[k], a: 0.5, bend: 0.1 }); });
    for (var i = 0; i < cols * rows; i++) { var c = cardAt(i); var sweep = smooth((cyc * 1.3 - i / (cols * rows)) / 0.08) * (1 - smooth((cyc * 1.3 - i / (cols * rows) - 0.1) / 0.1)); var on = picks.indexOf(i) >= 0 && cyc > (i / (cols * rows)) / 1.3; card(ctx, c.x, c.y, cw, ch, { lines: 3, on: on, col: PC[picks.indexOf(i)] || P.lilac, tag: i % 5 === 0 ? 'patent' : (i % 7 === 0 ? 'protocol' : '') }); if (sweep > 0) { glowAt(ctx, c.x + cw / 2, c.y + ch / 2, cw * 0.7, P.cyan, 0.5 * sweep); } }
    picks.forEach(function (pi, k) { var on = cyc > (pi / (cols * rows)) / 1.3; if (!on) return; chip(ctx, mx0 + k * 44, cy0, '[' + (k + 1) + ']', PC[k], { align: 'center', on: true }); });
    var claim = { x: w * 0.06, y: h * (nar ? 0.88 : 0.9) };
    if (nar) { text(ctx, 'Resistance is associated with', claim.x, claim.y, { font: '500 11px ' + SANS, color: INK }); text(ctx, 'secondary mutations at the binding site', claim.x, claim.y + 16, { font: '500 11px ' + SANS, color: INK }); }
    else { text(ctx, 'Resistance is associated with secondary mutations at the binding site', claim.x, claim.y, { font: '500 11px ' + SANS, color: INK }); }
  };

  // In-silico: a ligand docks into a pocket; candidates are ranked
  D.insilico = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 31); var cyc = (t * 0.1) % 1, dock = smooth(cyc / 0.5), rank = smooth((cyc - 0.4) / 0.5);
    var nar = w / h < 1.2, px = nar ? w * 0.5 : w * 0.3, py = nar ? h * 0.3 : h * 0.5, R = Math.min(w, h) * (nar ? 0.19 : 0.26);
    mark(px - R - 6, py - R - 6, px + R + 6, py + R + 6, 'pocket');
    ctx.save(); ctx.strokeStyle = rgba(P.violet, 0.8); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(px, py, R, Math.PI * 0.62, Math.PI * 2.38); ctx.stroke(); ctx.strokeStyle = rgba(P.violet, 0.3); ctx.lineWidth = 9; ctx.stroke(); ctx.restore();
    var r = C.rng(5); var pts = []; for (var i = 0; i < 26; i++) { var a = Math.PI * 0.62 + r() * Math.PI * 1.76, d = R + (r() - 0.5) * 14; pts.push({ x: px + Math.cos(a) * d, y: py + Math.sin(a) * d, r: 1.4 + r() * 1.6, c: C.pick(r, [P.violet, P.indigo, P.lilac]) }); } C.glows(ctx, pts, 0.5, 6); C.dots(ctx, pts, 0.9);
    var lx = lerp(px + R * 1.9, px + R * 0.15, dock), ly = lerp(py - R * 0.9, py, dock); var atoms = [[0, 0], [11, 5], [-9, 7], [5, -11], [-4, -10], [14, -5]];
    atoms.forEach(function (o, k) { if (k) { ctx.strokeStyle = rgba(P.amber, 0.8); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + o[0], ly + o[1]); ctx.stroke(); } });
    C.glows(ctx, atoms.map(function (o) { return { x: lx + o[0], y: ly + o[1], r: 3, c: P.amber }; }), 0.7, 6); C.dots(ctx, atoms.map(function (o, k) { return { x: lx + o[0], y: ly + o[1], r: k ? 2.6 : 3.4, c: P.gold }; }), 1);
    if (dock > 0.95) glowAt(ctx, px, py, R * 0.6, P.amber, 0.25);
    text(ctx, 'binding pocket', px, py + R + 22, { align: 'center' }); text(ctx, dock > 0.95 ? 'ΔG  −9.4 kcal/mol' : 'docking…', px, py + R + 38, { align: 'center', color: dock > 0.95 ? P.gold : INK3 });
    var bx = nar ? w * 0.12 : w * 0.6, by = nar ? h * 0.68 : h * 0.22, bw = nar ? w * 0.76 : w * 0.34, bh = nar ? h * 0.17 : h * 0.5;
    text(ctx, 'candidates, ranked', bx, by - 14, { color: INK }); mark(bx, by, bx + bw, by + bh, 'bars'); bars(ctx, bx, by, bw, bh, [0.92, 0.74, 0.6, 0.48, 0.35, 0.22], [P.gold, P.amber, P.magenta, P.violet, P.indigo, P.blue], rank);
    ['C-14', 'C-07', 'C-22', 'C-03', 'C-19', 'C-11'].forEach(function (n, i) { if (bw / 6 < 34 && i > 0) return; text(ctx, n, bx + (i + 0.5) * bw / 6, by + bh + 12, { align: 'center', font: '500 9.5px ' + MONO, color: INK3, a: rank }); });
    chip(ctx, bx, by + bh + 34, 'docking · ADMET · PK', P.cyan, { on: true });
  };

  // Protein design: from sequence to structure to a candidate
  D.protein = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 41); var cyc = (t * 0.1) % 1;
    var nar = w / h < 1.2, sx = w * 0.08, sy = h * (nar ? 0.14 : 0.16), sw = w * 0.84, n = 42, cw = sw / n, seq = 'MKTAYIAKQRQISFVKSHFSRQLEERLGLIEVQAPILSRVGDGTQD';
    var cur = Math.floor(cyc * n); mark(sx, sy, sx + sw, sy + 14, 'sequence');
    for (var i = 0; i < n; i++) { var col = [P.violet, P.cyan, P.magenta, P.amber, P.teal][i % 5]; var on = i === cur; ctx.fillStyle = rgba(col, on ? 0.95 : 0.35); ctx.fillRect(sx + i * cw + 1, sy, cw - 2, 14); if (on) { glowAt(ctx, sx + i * cw + cw / 2, sy + 7, 10, col, 0.8); text(ctx, seq[i % seq.length], sx + i * cw + cw / 2, sy - 10, { align: 'center', color: INK }); } }
    text(ctx, 'sequence · 312 aa', sx, sy + 26, { color: INK3 });
    // the candidate card is sized to its chips and kept inside the frame
    var chips = [['binding  ↑ 3.1×', P.gold, 0.6], ['stability  ok', P.teal, 0.75], ['validation  reported', P.lilac, 0.9]];
    var cwd = Math.max(nar ? w * 0.38 : w * 0.26, Math.max.apply(null, chips.map(function (c) { return chipW(ctx, c[0]); })) + 20);
    var chh = 128, rx = Math.min(nar ? w * 0.56 : w * 0.7, w * 0.96 - cwd), ry = Math.min(h * 0.4, h - chh - 12);
    // the fold: helices and strands in a compact arrangement, scaled to the room it has
    var top = sy + 44, cx = nar ? w * 0.27 : w * 0.34;
    var sc = Math.min(1, (h - 34 - top) / 156, (cx - 8) / 122, (rx - 12 - cx) / 108), cy = top + 50 * sc;
    mark(cx - 122 * sc, cy - 50 * sc, cx + 108 * sc, cy + 106 * sc, 'fold');
    var els = [[-90, -20, 0.3, 'h', P.violet], [-30, 30, 1.9, 's', P.cyan], [30, -30, -0.4, 'h', P.magenta], [70, 30, 2.6, 's', P.amber], [-60, 60, 0.9, 'h', P.teal], [10, 70, -2.2, 's', P.lilac]];
    ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
    els.forEach(function (e, k) { var ex = e[0], ey = e[1], a = e[2], L = 60, ca = Math.cos(a), sa = Math.sin(a), hi = Math.floor(cyc * els.length) === k; ctx.save(); ctx.globalAlpha = hi ? 1 : 0.7; if (e[3] === 'h') { ctx.beginPath(); for (var s = 0; s <= 1.001; s += 0.02) { var ph = s * 4 * TAU; ctx.lineTo(ex - ca * L / 2 + ca * L * s - sa * Math.sin(ph) * 7, ey - sa * L / 2 + sa * L * s + ca * Math.sin(ph) * 7); } ctx.strokeStyle = e[4]; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.stroke(); } else { var nx = -sa, ny = ca, x0 = ex - ca * L / 2, y0 = ey - sa * L / 2, x1 = ex + ca * L / 2, y1 = ey + sa * L / 2; ctx.fillStyle = e[4]; ctx.beginPath(); ctx.moveTo(x0 + nx * 5, y0 + ny * 5); ctx.lineTo(x1 - ca * 12 + nx * 5, y1 - sa * 12 + ny * 5); ctx.lineTo(x1 - ca * 12 + nx * 10, y1 - sa * 12 + ny * 10); ctx.lineTo(x1, y1); ctx.lineTo(x1 - ca * 12 - nx * 10, y1 - sa * 12 - ny * 10); ctx.lineTo(x1 - ca * 12 - nx * 5, y1 - sa * 12 - ny * 5); ctx.lineTo(x0 - nx * 5, y0 - ny * 5); ctx.closePath(); ctx.fill(); } if (hi) glowAt(ctx, ex, ey, 34, e[4], 0.5); ctx.restore(); });
    ctx.restore();
    text(ctx, 'predicted fold · pLDDT 91', cx - 7 * sc, cy + 106 * sc + 14, { align: 'center', color: INK3 });
    card(ctx, rx, ry, cwd, chh, { title: 'Candidate v4', lines: 3, col: P.gold, on: cyc > 0.5 });
    chips.forEach(function (c, i) { chip(ctx, rx + 10, ry + 62 + i * 24, c[0], c[1], { on: cyc > c[2] }); });
  };

  // CRISPR: a guide finds its site, the strand is cut, then repaired; off-targets are checked
  D.crispr = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 51); var cyc = (t * 0.11) % 1, nar = w / h < 1.2;
    // a short frame lifts the helix and the list, so every row stays inside
    var hy = nar ? h * 0.38 : Math.min(h * 0.42, h - 150), ly = nar ? h * 0.68 : Math.min(h * 0.72, h - 88);
    var seek = smooth(cyc / 0.35), gap = smooth((cyc - 0.4) / 0.15) * (1 - smooth((cyc - 0.7) / 0.12));
    var at = helix(ctx, w * 0.06, hy, w * 0.94, hy, { amp: 14, turns: 5, cut: 0.62, gap: gap }); mark(w * 0.06, hy - 15, w * 0.94, hy + 15, 'helix');
    var gx = lerp(w * 0.2, w * 0.62, seek), gy = hy - 44 + smooth((cyc - 0.3) / 0.1) * 22;
    ctx.save(); ctx.strokeStyle = rgba(P.cyan, 0.95); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); for (var s = -28; s <= 28; s += 2) { ctx.lineTo(gx + s, gy + Math.sin(s * 0.3) * 4); } ctx.stroke(); ctx.restore();
    glowAt(ctx, gx, gy, 26, P.cyan, 0.4); text(ctx, 'guide RNA', gx, gy - 18, { align: 'center', color: P.cyan });
    var cutX = w * 0.06 + 0.62 * w * 0.88;
    // "cut" and "repaired" take turns in the same place, never both at once
    if (gap > 0.2) { glowAt(ctx, cutX, hy, 22, P.magenta, gap * 0.8); text(ctx, 'cut', cutX, hy + 36, { align: 'center', color: P.magenta, a: gap }); }
    var heal = smooth((cyc - 0.83) / 0.07) * (1 - smooth((cyc - 0.96) / 0.04)); if (heal > 0 && gap < 0.02) { glowAt(ctx, cutX, hy, 26, P.teal, heal); text(ctx, 'repaired', cutX, hy + 36, { align: 'center', color: P.teal, a: heal }); }
    var lx = w * 0.06; text(ctx, 'guides · off-target review', lx, ly, { color: INK });
    var rows = ['g1  AGCTTGCA…  on-target', 'g2  TTGACCGA…  on-target', 'g3  GCATCGTT…  on-target', 'g4  CCGTAAGC…  1 low-risk'];
    var rw = Math.max.apply(null, rows.map(function (r) { return tw(ctx, r); }));
    rows.forEach(function (r, i) { var on = cyc > 0.15 + i * 0.12; text(ctx, r, lx, ly + 18 + i * 16, { color: on ? INK2 : INK3, a: on ? 1 : 0.5 }); if (on) check(ctx, lx + rw + 14, ly + 18 + i * 16, 6, i === 3 ? P.amber : P.teal); });
    if (nar) chip(ctx, lx, ly + 92, '0 high-risk off-targets', P.teal, { on: cyc > 0.6 }); else chip(ctx, w * 0.94, ly + 66, '0 high-risk off-targets', P.teal, { align: 'right', on: cyc > 0.6 });
  };

  // Clinical trials: the full cycle as a timeline with a cohort and its documents
  D.trials = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 61); var cyc = (t * 0.07) % 1;
    // each phase has its name above the dot and two short lines under it, so neighbours never touch
    var phases = [['Plan', ['protocol', 'endpoints'], P.violet], ['Start', ['CRF', 'site docs'], P.cyan], ['Run', ['monitoring', 'safety'], P.amber], ['Close', ['SAP', 'CSR'], P.magenta]];
    var cols0 = w >= 560 ? 12 : 8, chipBeside = w * 0.1 + (cols0 - 1) * 20 + 14 + 18 + chipW(ctx, 'draft · support · review') <= w * 0.95;
    var blockH = 26 + 44 + 28 + 36 + (24 / cols0 - 1) * 20 + 13 + (chipBeside ? 0 : 34);
    var x0 = w * 0.14, x1 = w * 0.86, y = Math.max(44, (h - blockH) / 2 + 26);
    ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    ctx.strokeStyle = rgba(P.lilac, 0.8); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, cyc), y); ctx.stroke();
    phases.forEach(function (ph, i) {
      var px = lerp(x0, x1, i / 3), on = cyc >= i / 3 - 0.02; mark(px - 7, y - 7, px + 7, y + 7, 'phase dot');
      glowAt(ctx, px, y, 10, ph[2], on ? 0.6 : 0.15); ctx.beginPath(); ctx.arc(px, y, 6, 0, TAU); ctx.fillStyle = on ? ph[2] : RAISED; ctx.fill(); ctx.strokeStyle = ph[2]; ctx.lineWidth = 1.4; ctx.stroke();
      text(ctx, ph[0], px, y - 20, { align: 'center', font: '500 12px ' + SANS, color: on ? INK : INK3 });
      ph[1].forEach(function (l, k) { text(ctx, l, px, y + 18 + k * 13, { align: 'center', font: '500 10.5px ' + MONO, color: on ? INK2 : INK3 }); });
      card(ctx, px - 20, y + 44, 40, 28, { lines: 3, col: ph[2], on: on, widths: [0.9, 0.7, 0.5] });
    });
    packet(ctx, { x: lerp(x0, x1, cyc), y: y }, P.paper, 3);
    // the cohort: people fill in as recruitment runs
    var cy0 = y + 44 + 28 + 36, cols = w >= 560 ? 12 : 8, sp = 20, n = 24, rows = n / cols, cx0 = w * 0.1;
    text(ctx, 'cohort · ' + Math.floor(smooth((cyc - 0.25) / 0.45) * n) + ' of ' + n + ' enrolled', cx0, cy0 - 16, { color: INK });
    mark(cx0 + 1, cy0 + 1, cx0 + (cols - 1) * sp + 13, cy0 + (rows - 1) * sp + 13, 'cohort');
    for (var i = 0; i < n; i++) { var f = smooth((cyc - 0.25 - i / n * 0.45) / 0.05), cx = cx0 + (i % cols) * sp + 7, cy = cy0 + Math.floor(i / cols) * sp + 7; ctx.beginPath(); ctx.arc(cx, cy, 5.5, 0, TAU); ctx.fillStyle = rgba(P.paper, 0.08 + 0.6 * f); ctx.fill(); ctx.strokeStyle = rgba(P.lilac, 0.3 + 0.6 * f); ctx.lineWidth = 1; ctx.stroke(); }
    // what the agents do: beside the cohort when there is room, under it when there is not
    var lab = 'draft · support · review', gx1 = cx0 + (cols - 1) * sp + 14, cw = chipW(ctx, lab);
    if (gx1 + 18 + cw <= w * 0.95) chip(ctx, gx1 + 18, cy0 + (rows - 1) * sp / 2 + 7, lab, P.amber, { on: true });
    else chip(ctx, cx0, cy0 + rows * sp + 14, lab, P.amber, { on: true });
  };

  // Regulatory: the module tree of a submission, checked one by one, with a reviewer question answered
  D.regulatory = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 71); var cyc = (t * 0.08) % 1;
    var nar = w / h < 1.2, mods = [['M1', ['admin']], ['M2', ['summaries', 'summary']], ['M3', ['quality']], ['M4', ['nonclinical', 'nonclin.']], ['M5', ['clinical']]];
    var bx = w * 0.06, by = h * 0.18, bw = w * (nar ? 0.16 : 0.15), bh = h * 0.26, gap = w * (nar ? 0.015 : 0.02), LF = '500 9.5px ' + MONO;
    text(ctx, 'IND / CTA · module structure', bx, by - 16, { color: INK });
    mods.forEach(function (m, i) {
      var x = bx + i * (bw + gap), f = smooth((cyc - i * 0.12) / 0.1);
      card(ctx, x, by, bw, bh, { title: m[0], lines: Math.max(0, Math.min(4, Math.floor((bh - 50) / 8) + 1)), col: [P.violet, P.cyan, P.amber, P.magenta, P.teal][i], on: f > 0.5, widths: [0.8, 0.9, 0.6, 0.7] });
      // the longest name that fits the card
      var lab = m[1].filter(function (l) { return tw(ctx, l, LF) <= bw - 16; })[0] || m[1][m[1].length - 1];
      text(ctx, lab, x + 8, by + bh - 12, { color: INK3, font: LF }); check(ctx, x + bw - 12, by + 14, 7, P.teal, f);
    });
    var qx = w * 0.06, qy = h * 0.66; var qf = smooth((cyc - 0.65) / 0.15);
    var qw = chip(ctx, qx, qy, 'reviewer: justify the dose selection', P.amber, { on: true, dot: true });
    var ax = bx + 4 * (bw + gap) + bw / 2; link(ctx, { x: Math.min(qx + qw - 12, ax - 8), y: qy - 10 }, { x: ax, y: by + bh + 2 }, { col: P.amber, a: 0.5 * qf, dash: true, bend: -0.15 });
    text(ctx, '→ M5 · 5.3.5.1 · section 9.2, with sources', qx, qy + 26, { color: qf > 0.5 ? INK2 : INK3, a: 0.4 + 0.6 * qf });
    chip(ctx, w * 0.94, qy + 52, 'IVDR technical file · SOPs', P.lilac, { align: 'right', on: true });
  };

  // Patent & IP: a claim tree on the left, prior art on a timeline on the right
  D.patent = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 81); var cyc = (t * 0.09) % 1, nar = w / h < 1.2;
    // the claim tree: the first card fits its title; the three children never touch
    var F = '500 11px ' + SANS, c1 = 'Claim 1 · independent', c1w = tw(ctx, c1, F) + 22, cw = 58, hs = 66;
    var rx = nar ? w * 0.3 : Math.max(w * 0.22, hs + cw / 2 + 12), ry = nar ? h * 0.13 : h * 0.24;
    text(ctx, 'claims', rx, ry - 20, { align: 'center', color: INK });
    [[-1, 'Claim 2'], [0, 'Claim 3'], [1, 'Claim 4']].forEach(function (c) { link(ctx, { x: rx, y: ry + 30 }, { x: rx + c[0] * hs, y: ry + 64 }, { col: P.lilac, a: 0.5 }); });
    link(ctx, { x: rx, y: ry + 88 }, { x: rx, y: ry + 116 }, { col: P.lilac, a: 0.5 });
    card(ctx, rx - c1w / 2, ry, c1w, 30, { title: c1, col: P.lilac, on: true });
    [[-1, 'Claim 2'], [0, 'Claim 3'], [1, 'Claim 4']].forEach(function (c) { card(ctx, rx + c[0] * hs - cw / 2, ry + 64, cw, 24, { title: c[1], col: P.lilac }); });
    card(ctx, rx - cw / 2, ry + 116, cw, 24, { title: 'Claim 5', col: P.lilac });
    // prior art on a timeline: beside the tree, or under it on a phone
    var tx0 = nar ? w * 0.08 : w * 0.5, tx1 = w * 0.94, ty = nar ? h * 0.6 : h * 0.42; mark(tx0, ty - 5, tx1, ty + 5, 'timeline');
    text(ctx, 'prior art · 2014 → 2026', tx0, ty - 22, { color: INK });
    ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx0, ty); ctx.lineTo(tx1, ty); ctx.stroke();
    var r = C.rng(9), docs = []; for (var i = 0; i < 14; i++) docs.push({ u: 0.04 + i / 14 * 0.92 + (r() - 0.5) * 0.03, hit: i === 4 || i === 9 });
    var sweep = smooth(cyc / 0.7);
    docs.forEach(function (d) { var x = lerp(tx0, tx1, d.u), seen = sweep > d.u; ctx.beginPath(); ctx.arc(x, ty, 4, 0, TAU); ctx.fillStyle = d.hit && seen ? P.magenta : rgba(P.lilac, seen ? 0.8 : 0.3); ctx.fill(); if (d.hit && seen) { glowAt(ctx, x, ty, 14, P.magenta, 0.6); card(ctx, x - 26, ty + 16, 52, 30, { lines: 2, col: P.magenta, on: true }); } });
    var sx = lerp(tx0, tx1, sweep); ctx.strokeStyle = rgba(P.cyan, 0.7); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx, ty - 12); ctx.lineTo(sx, ty + 12); ctx.stroke();
    // the outcome, on its own row, and the novelty argument on the row under it
    var nf = smooth((cyc - 0.75) / 0.2), full = '2 close documents · claim 3 narrowed', short = '2 close docs · claim 3 narrowed';
    var lab = chipW(ctx, full) <= tx1 - tx0 ? full : short, cwd = chipW(ctx, lab), ox = Math.max(8, Math.min(tx0, w * 0.95 - cwd)), oy = ty + 70;
    chip(ctx, ox, oy, lab, P.amber, { on: nf > 0.5 });
    check(ctx, ox + 9, oy + 28, 8, P.teal, nf); text(ctx, 'novelty argued, with sources', ox + 24, oy + 28, { color: INK2, a: nf });
  };

  // Story frames
  D.st_question = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 91); var cyc = (t * 0.12) % 1, dock = smooth((cyc - 0.2) / 0.4);
    var nar = w / h < 1.2, bx = w * (nar ? 0.3 : 0.27), FQ = '500 13px ' + SANS, FQ2 = '400 12px ' + SANS;
    var q = 'Why does this cell line resist the inhibitor?', q2 = 'What changed at the binding site?';
    // the question card is sized to its text: one line when it fits, two when it does not
    var lines = tw(ctx, q, FQ) <= w * 0.95 - bx - 32 ? [q] : ['Why does this cell line', 'resist the inhibitor?'];
    var bw = Math.min(w * 0.95 - bx, Math.max(tw(ctx, q2, FQ2), Math.max.apply(null, lines.map(function (l) { return tw(ctx, l, FQ); }))) + 32);
    var bh = 48 + lines.length * 18;
    // the two datasets: one row when they fit, two when they do not
    var ds = [['assay results · 96 wells', P.amber], ['variant list · 143 calls', P.cyan]], w0 = chipW(ctx, ds[0][0], true), w1 = chipW(ctx, ds[1][0], true);
    var oneRow = bx + w0 + 10 + w1 <= w * 0.95, blockH = bh + 22 + (oneRow ? 0 : 26) + 30;
    var by = Math.max(h * 0.1, (h - blockH) / 2);
    person(ctx, w * 0.14, by + bh / 2, 24, 'You');
    rrect(ctx, bx, by, bw, bh, 12); ctx.fillStyle = RAISED; ctx.fill(); ctx.strokeStyle = rgba(P.lilac, 0.6); ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx + 1, by + bh * 0.42); ctx.lineTo(bx - 11, by + bh * 0.52); ctx.lineTo(bx + 1, by + bh * 0.62); ctx.fillStyle = RAISED; ctx.fill();
    ctx.save(); ctx.strokeStyle = rgba(P.lilac, 0.6); ctx.beginPath(); ctx.moveTo(bx, by + bh * 0.42); ctx.lineTo(bx - 11, by + bh * 0.52); ctx.lineTo(bx, by + bh * 0.62); ctx.stroke(); ctx.restore();
    lines.forEach(function (l, i) { text(ctx, l, bx + 16, by + 24 + i * 18, { font: FQ, color: INK }); });
    text(ctx, q2, bx + 16, by + 26 + lines.length * 18, { font: FQ2, color: INK2 });
    // the datasets slide in from the right edge along their own row, so they never cross other text
    ds.forEach(function (a, i) {
      var f = smooth((dock - i * 0.5) / 0.5), fx = oneRow ? bx + (i ? w0 + 10 : 0) : bx, fy = by + bh + 22 + (oneRow ? 0 : i * 26);
      var slide = Math.max(0, Math.min(40, w - 6 - fx - (i ? w1 : w0)));
      if (f > 0) { ctx.save(); ctx.globalAlpha = f; chip(ctx, fx + slide * (1 - f), fy, a[0], a[1], { on: f > 0.9, dot: true }); ctx.restore(); }
    });
    text(ctx, dock > 0.95 ? '2 datasets attached · project isolated' : 'attaching data…', bx, by + bh + 22 + (oneRow ? 0 : 26) + 28, { color: INK3 });
  };
  D.st_evidence = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 92); var cyc = (t * 0.1) % 1;
    agent(ctx, w * 0.14, h * 0.42, 46, P.violet, 'Reader', 'long-context LLM');
    // the paper grid shrinks on a short frame so the three rows under it stay inside
    var nar = w / h < 1.2, gx = w * 0.32, gy = h * 0.1, cols = 8, rows = 5, rowH = Math.min(h * 0.125, (h - 96 - gy) / rows), cw = w * 0.055, ch = rowH * 0.8, picks = [6, 17, 31], PC = [P.violet, P.magenta, P.amber], tx = w * 0.06;
    for (var i = 0; i < 40; i++) { var x = gx + (i % cols) * (w * 0.072), y = gy + Math.floor(i / cols) * rowH, read = cyc * 1.2 > i / 40; var hit = picks.indexOf(i) >= 0 && read; rrect(ctx, x, y, cw, ch, 3); ctx.fillStyle = hit ? rgba(PC[picks.indexOf(i)], 0.35) : rgba(INK, read ? 0.1 : 0.04); ctx.fill(); ctx.strokeStyle = hit ? PC[picks.indexOf(i)] : rgba(INK, read ? 0.25 : 0.1); ctx.lineWidth = 1; ctx.stroke(); if (hit) glowAt(ctx, x + cw / 2, y + ch / 2, cw, PC[picks.indexOf(i)], 0.35); }
    var y1 = gy + rows * rowH;
    text(ctx, Math.min(40, Math.floor(cyc * 1.2 * 40)) + ' papers read · 2 cohort datasets', tx, y1 + 10, { color: INK2 });
    var cf = smooth((cyc - 0.8) / 0.2), names = nar ? ['article 2023', 'cohort v3', 'article 2021'] : ['article · 2023', 'cohort · v3', 'article · 2021'];
    var yEnd = chipRow(ctx, tx, y1 + 34, w * 0.95, picks.map(function (pi, k) { return { s: '[' + (k + 1) + '] ' + names[k], c: PC[k], o: { on: cf > 0.5 } }; }), 8, 26);
    text(ctx, cf > 0.5 ? '3 sources explain the mutation' : 'reading…', tx, yEnd + 26, { color: cf > 0.5 ? INK : INK3 });
  };
  D.st_models = function (ctx, w, h, t, st) {
    D.insilico(ctx, w, h, t, st);
    var nar = w / h < 1.2, lab = 'G12C · variant effect: damaging (0.93)';
    if (nar) { chip(ctx, w * 0.06, 24, lab, P.magenta, { on: true, dot: true }); agent(ctx, w * 0.88, 40, 30, P.cyan, 'Analyst', '', 1); return; }
    // the Analyst and its finding share the top row, clear of the pocket and the ranking
    var ay = Math.max(24, h * 0.1), ax = w * 0.06 + 15, nw = tw(ctx, 'Analyst', '500 12px ' + SANS);
    agent(ctx, ax, ay, 30, P.cyan, '', '', 1);
    text(ctx, 'Analyst', ax + 23, ay, { font: '500 12px ' + SANS, color: INK });
    chip(ctx, ax + 23 + nw + 12, ay, lab, P.magenta, { on: true, dot: true });
  };
  D.st_edit = function (ctx, w, h, t, st) { D.crispr(ctx, w, h, t, st); chip(ctx, w * 0.06, h * 0.14, 'validation protocol drafted for the bench', P.lilac, { on: true }); };
  D.st_plan = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 95); var cyc = (t * 0.08) % 1;
    agent(ctx, w * 0.12, h * 0.3, 44, P.magenta, 'Writer', 'drafting LLM');
    var nar = w / h < 1.2, px = w * (nar ? 0.25 : 0.3), py = h * 0.12, pw = w * (nar ? 0.34 : 0.3), ph = h * 0.74; var secs = ['Protocol v0.3', 'Endpoints', nar ? 'Criteria' : 'Cohort criteria', 'Sample size', 'SAP draft', 'Monitoring'];
    rrect(ctx, px, py, pw, ph, 8); ctx.fillStyle = '#111530'; ctx.fill(); ctx.strokeStyle = rgba(P.lilac, 0.5); ctx.lineWidth = 1; ctx.stroke();
    secs.forEach(function (s, i) { var f = smooth((cyc - i * 0.13) / 0.12), y = py + 22 + i * (ph - 30) / secs.length; text(ctx, s.toUpperCase(), px + 12, y, { color: f > 0.9 ? INK : INK3, a: 0.4 + 0.6 * f }); for (var k = 0; k < 3; k++) { ctx.fillStyle = rgba(INK, 0.2); ctx.fillRect(px + 12, y + 10 + k * 7, (pw - 24) * (k === 2 ? 0.55 : 0.9) * f, 2.2); } if (f > 0.98) check(ctx, px + pw - (nar ? 10 : 14), y, 6, P.teal); });
    // the cohort grid takes as many columns as fit, and the chips sit under however many rows that makes
    var n = nar ? 25 : 24, cx0 = w * (nar ? 0.62 : 0.64), cy0 = h * (nar ? 0.19 : 0.2), pc = Math.max(3, Math.min(nar ? 5 : 8, Math.floor((w * 0.95 - cx0 - 14) / 22) + 1)), rws = Math.ceil(n / pc);
    text(ctx, 'cohort definition', cx0, cy0 - 16, { color: INK }); mark(cx0 + 2, cy0 + 2, cx0 + (pc - 1) * 22 + 14, cy0 + (rws - 1) * 22 + 14, 'cohort');
    for (var i = 0; i < n; i++) { var f = smooth((cyc - 0.3 - i / n * 0.5) / 0.05); ctx.beginPath(); ctx.arc(cx0 + (i % pc) * 22 + 8, cy0 + Math.floor(i / pc) * 22 + 8, 6, 0, TAU); ctx.fillStyle = rgba(P.paper, 0.08 + 0.6 * f); ctx.fill(); ctx.strokeStyle = rgba(P.lilac, 0.3 + 0.6 * f); ctx.stroke(); }
    var qy = cy0 + rws * 22 + 20; chip(ctx, cx0, qy, nar ? 'n=120 · power 0.8' : 'n = 120 · power 0.8', P.cyan, { on: cyc > 0.7 }); chip(ctx, cx0, qy + 26, nar ? 'clinical review' : 'for clinical review', P.amber, { on: cyc > 0.85, dot: true });
  };
  D.st_record = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 96); var cyc = (t * 0.08) % 1;
    var nar = w / h < 1.2, bx = w * 0.06, by = h * 0.16, bw = w * (nar ? 0.11 : 0.105), bh = h * 0.24;
    text(ctx, 'IND modules', bx, by - 16, { color: INK }); ['M1', 'M2', 'M3', 'M4', 'M5'].forEach(function (m, i) { var f = smooth((cyc - i * 0.1) / 0.1); card(ctx, bx + i * (bw + 6), by, bw, bh, { title: m, lines: 3, col: [P.violet, P.cyan, P.amber, P.magenta, P.teal][i], on: f > 0.5 }); check(ctx, bx + i * (bw + 6) + bw - 9, by + 13, 5, P.teal, f); });
    // the claim draft sits clear of the modules and inside the frame
    var hs = 40, cwc = 54, cardsR = bx + 5 * bw + 24;
    var cx = nar ? w * 0.5 : Math.min(w * 0.96 - hs - cwc / 2, Math.max(w * 0.78, cardsR + hs + cwc / 2 + 12)), cy = nar ? h * 0.46 : by;
    text(ctx, 'claim draft', cx - 40, cy - 16, { color: INK });
    [[-1, 'Claim 2'], [1, 'Claim 3']].forEach(function (c) { link(ctx, { x: cx, y: cy + 26 }, { x: cx + c[0] * hs, y: cy + 60 }, { col: P.lilac, a: 0.5 }); });
    card(ctx, cx - 40, cy, 80, 26, { title: 'Claim 1', col: P.lilac, on: cyc > 0.5 });
    [[-1, 'Claim 2'], [1, 'Claim 3']].forEach(function (c) { card(ctx, cx + c[0] * hs - cwc / 2, cy + 60, cwc, 22, { title: c[1], col: P.lilac, on: cyc > 0.6 }); });
    text(ctx, 'built from the same cited results', bx, h * (nar ? 0.72 : 0.62), { color: INK2 });
    chipRow(ctx, bx, h * (nar ? 0.78 : 0.68), w * 0.95, [['[1] article · DOI', P.violet], ['[2] cohort · v3', P.magenta], [nar ? '[3] docking · 07' : '[3] docking run · 07', P.cyan]].map(function (q) { return { s: q[0], c: q[1], o: { on: true } }; }), 8, 26);
    var sf = smooth((cyc - 0.7) / 0.2), sy = nar ? h * 0.9 : h * 0.8; person(ctx, w * 0.82, sy, 18, 'scientist'); check(ctx, w * 0.82 + 32, sy, 11, P.amber, sf); text(ctx, sf > 0.5 ? 'signed off · checkpoint passed' : 'awaiting sign-off', w * 0.06, nar ? h * 0.9 : h * 0.86, { color: sf > 0.5 ? P.amber : INK3 });
  };

  // Data & models: dataset cards with their source, version and licence; models with validation; the curation path
  D.data = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 101); var cyc = (t * 0.07) % 1;
    var ds = [['Genomic variants', 'v3 · CC BY 4.0', P.violet], ['Protein structures', 'v12 · licensed', P.cyan], ['Compound & assay libraries', 'v7 · licensed', P.amber], ['Your data', 'your project only', P.magenta]];
    var nar = w / h < 1.2, cw = nar ? w * 0.88 : w * 0.42, ch = nar ? 34 : h * 0.15; ds.forEach(function (d, i) { card(ctx, w * 0.06, (nar ? h * 0.05 : h * 0.08) + i * (ch + 8), cw, ch, { title: d[0], tag: d[1], lines: (nar || cw < 300) ? 0 : 2, col: d[2], on: Math.floor(cyc * 8) % 4 === i, widths: [0.7, 0.45] }); });
    var mx = nar ? w * 0.06 : w * 0.54, my = nar ? h * 0.52 : h * 0.1, mg = nar ? 24 : 34; text(ctx, 'trained models', mx, my, { color: INK });
    [['variant effect', 'AUROC 0.91'], ['binding affinity', 'RMSE 0.8'], ['assay QC', 'F1 0.94']].forEach(function (m, i) { var y = my + 24 + i * mg; chip(ctx, mx, y, m[0], P.lilac, { on: true }); text(ctx, m[1], mx + 132, y, { color: P.teal }); });
    text(ctx, 'validation reported per model', mx, my + 24 + 3 * mg - 6, { color: INK3 });
    var steps = ['Collect', 'Clean', 'Version', 'Document', 'Serve'], sx0 = nar ? w * 0.1 : w * 0.56, sx1 = nar ? w * 0.9 : w * 0.94, sy = nar ? h * 0.9 : h * 0.72;
    text(ctx, 'how a dataset enters', sx0, sy - 26, { color: INK }); ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx0, sy); ctx.lineTo(sx1, sy); ctx.stroke();
    steps.forEach(function (s, i) { var x = lerp(sx0, sx1, i / 4), on = cyc >= i / 4 - 0.02; mark(x - 6, sy - 6, x + 6, sy + 6, 'step dot'); ctx.beginPath(); ctx.arc(x, sy, 5, 0, TAU); ctx.fillStyle = on ? P.lilac : RAISED; ctx.fill(); ctx.strokeStyle = P.lilac; ctx.lineWidth = 1.2; ctx.stroke(); text(ctx, s, x, sy + (i % 2 ? 32 : 18), { align: 'center', color: on ? INK2 : INK3 }); });
    packet(ctx, { x: lerp(sx0, sx1, cyc), y: sy }, P.paper, 3);
  };

  // Security: projects are boxes with their own data and agents; a crossing is refused; roles; an audit log
  D.security = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 111); var cyc = (t * 0.1) % 1, nar = w / h < 1.2;
    // the roles go beside the "no crossing" line when they fit, under it when they do not; a short frame makes the boxes shorter to keep the log inside
    var NC = 'no crossing between projects', roles = [['owner', P.gold], ['editor', P.lilac], ['viewer', INK3]], gapR = nar ? 26 : Math.min(w * 0.05, 30);
    var rolesW = roles.reduce(function (a, r) { return a + 23 + tw(ctx, r[0]) + gapR; }, -gapR), rx0 = Math.max(w * 0.52, w * 0.06 + tw(ctx, NC) + 30);
    var beside = !nar && rx0 + rolesW <= w * 0.95;
    var bw = w * 0.27, by = h * 0.1, bh = nar ? h * 0.5 : Math.min(h * 0.5, h - 150 - (beside ? 0 : 22)), cols = [P.violet, P.cyan, P.magenta];
    [0, 1, 2].forEach(function (i) { var bx = w * 0.06 + i * (bw + w * 0.035); rrect(ctx, bx, by, bw, bh, 10); ctx.fillStyle = rgba(cols[i], 0.05); ctx.fill(); ctx.strokeStyle = rgba(cols[i], 0.55); ctx.lineWidth = 1.2; ctx.setLineDash([]); ctx.stroke(); text(ctx, 'Project ' + ['A', 'B', 'C'][i], bx + 12, by + 16, { font: '500 12px ' + SANS, color: INK });
      // a data cylinder
      var dx = bx + bw * 0.3, dy = by + bh * 0.55; mark(dx - 14, dy - 19, dx + 14, dy + 17, 'data'); ctx.strokeStyle = rgba(cols[i], 0.9); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(dx, dy - 14, 14, 5, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(dx - 14, dy - 14); ctx.lineTo(dx - 14, dy + 12); ctx.ellipse(dx, dy + 12, 14, 5, 0, Math.PI, 0, true); ctx.lineTo(dx + 14, dy - 14); ctx.stroke(); text(ctx, 'data', dx, dy + 30, { align: 'center', color: INK3 });
      agent(ctx, bx + bw * 0.7, dy - 4, 30, cols[i], '', '', 1); text(ctx, 'agent', bx + bw * 0.7, dy + 30, { align: 'center', color: INK3 });
      // a lock on the wall
      var lx = bx + bw - 16, ly = by + 16; rrect(ctx, lx - 6, ly - 2, 12, 9, 2); ctx.fillStyle = rgba(cols[i], 0.9); ctx.fill(); ctx.strokeStyle = rgba(cols[i], 0.9); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(lx, ly - 4, 4, Math.PI, TAU); ctx.stroke();
    });
    // a crossing refused between A and B
    var u = (cyc * 2) % 1, ax = w * 0.06 + bw * 0.7, wall = w * 0.06 + bw, px = lerp(ax, wall - 2, Math.min(1, u * 1.2)); if (u < 0.85) { packet(ctx, { x: px, y: by + bh * 0.3 }, P.magenta, 2.6); } if (u > 0.8) { cross(ctx, wall, by + bh * 0.3, 10, P.magenta); glowAt(ctx, wall, by + bh * 0.3, 12, P.magenta, 0.5); }
    text(ctx, NC, w * 0.06, by + bh + 18, { color: INK2 });
    // roles, each stepping along by its own width
    var rx = beside ? rx0 : w * 0.06 + 8, ry = beside ? by + bh + 22 : by + bh + (nar ? 44 : 40);
    roles.forEach(function (r) { person(ctx, rx, ry, 9, '', r[1]); text(ctx, r[0], rx + 14, ry, { color: INK2 }); rx += 23 + tw(ctx, r[0]) + gapR; });
    // audit log
    var ly = Math.min(Math.max(h * 0.8, ry + 26), h - 56); text(ctx, 'audit log', w * 0.06, ly, { color: INK });
    var entries = ['12:04:11  Reader   read  cohort_v3  (project A)', '12:04:19  Analyst  ran   docking_07 (project A)', '12:05:02  owner    approved  result #41'];
    entries.forEach(function (e, i) { var f = smooth((cyc - 0.2 - i * 0.22) / 0.1); text(ctx, e, w * 0.06, ly + 18 + i * 15, { color: INK2, a: 0.2 + 0.8 * f }); });
  };


  /* ---------- inner pages ---------- */
  var ACOL = { Reader: P.violet, Analyst: P.cyan, Writer: P.magenta };
  function cfgOf(st, d) { return (st && st.cfg) || d; }
  function narrow(w, h) { return w / h < 1.2; }
  function spinner(ctx, cx, cy, r, col, t, a) { if (a <= 0) return; enter(); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(cx, cy, r, t * 4, t * 4 + Math.PI * 1.2); ctx.stroke(); ctx.restore(); leave(); }
  function lockIcon(ctx, x, y, s, col, open) { emit({ t: 'icon', x0: x - s * 0.5, y0: y - s * 0.45, x1: x + s * 0.5, y1: y + s * 0.62 }); enter(); ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = rgba(col, 0.2); ctx.lineWidth = 1.5; rrect(ctx, x - s * 0.5, y - s * 0.1, s, s * 0.72, s * 0.14); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y - s * 0.1 - (open || 0) * s * 0.22, s * 0.3, Math.PI, TAU); ctx.stroke(); ctx.restore(); leave(); }
  function cylinder(ctx, x, y, rw, hh, col, a) { emit({ t: 'icon', x0: x - rw, y0: y - hh / 2 - rw * 0.34, x1: x + rw, y1: y + hh / 2 + rw * 0.34 }); ctx.save(); ctx.strokeStyle = rgba(col, a || 0.9); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.ellipse(x, y - hh / 2, rw, rw * 0.34, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - rw, y - hh / 2); ctx.lineTo(x - rw, y + hh / 2); ctx.ellipse(x, y + hh / 2, rw, rw * 0.34, 0, Math.PI, 0, true); ctx.lineTo(x + rw, y - hh / 2); ctx.stroke(); ctx.restore(); }
  function actor(ctx, x, y, name, on, t) {
    if (name === 'You') { person(ctx, x, y, 17, '', P.paper); if (on > 0) glowAt(ctx, x, y, 22, P.amber, 0.35 * on); return; }
    agent(ctx, x, y, 36, ACOL[name] || P.lilac, '', '', 0.3 + 0.7 * on);
  }
  function mono(ctx, s, x, y, o) { o = o || {}; o.font = o.font || ('500 10.5px ' + MONO); text(ctx, s, x, y, o); }

  // A workflow team: you ask; Reader, Analyst and Writer take turns; their outputs land as documents; you sign off
  D.team = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 121);
    var c = cfgOf(st, { q: 'Your question', agents: [['Reader', 'long-context LLM'], ['Analyst', 'code model'], ['Writer', 'drafting LLM']], outs: ['Result', 'Sources', 'Draft'] });
    var cyc = (t * 0.075) % 1, nar = narrow(w, h);
    var you = { x: w * 0.1, y: h * 0.5 }, ax = w * (nar ? 0.4 : 0.39);
    var ys = [0.2, 0.5, 0.8].map(function (f) { return h * f; });
    var cols = c.agents.map(function (a) { return ACOL[a[0]] || P.lilac; });
    // phases: ask, three turns, outputs, sign-off
    var ph = [[0.02, 0.1], [0.1, 0.3], [0.36, 0.54], [0.6, 0.78]];
    var qx = 12, qy = Math.max(18, h * 0.06);
    chip(ctx, qx, qy, c.q, P.lilac, { on: true });
    link(ctx, { x: you.x, y: you.y - 22 }, { x: Math.min(qx + 20, you.x), y: qy + 11 }, { col: P.lilac, a: 0.25, dash: true });
    var l0 = link(ctx, { x: you.x + 22, y: you.y }, { x: ax - 24, y: ys[0] }, { col: P.lilac, a: 0.35, bend: 0.12 });
    // each handoff runs straight down, from under one agent's name and role to the top of the next agent
    var hand = [0, 1].map(function (i) { return link(ctx, { x: ax, y: ys[i] + 58 }, { x: ax, y: ys[i + 1] - 26 }, { col: cols[i], a: 0.45, dash: true }); });
    var ox = w * 0.64, cw = w * 0.3, ch = Math.max(34, h * 0.12), oys = [h * 0.16, h * 0.16 + ch + 12, h * 0.16 + (ch + 12) * 2];
    var outs = oys.map(function (oy) { return link(ctx, { x: ax + 24, y: ys[2] }, { x: ox - 4, y: oy + ch / 2 }, { col: cols[2], a: 0.3, bend: -0.1 }); });
    person(ctx, you.x, you.y, 20, 'You');
    c.agents.forEach(function (a, i) {
      var on = cyc >= ph[i + 1][0] && cyc < ph[i + 1][1] ? 1 : (cyc >= ph[i + 1][1] ? 0.55 : 0);
      agent(ctx, ax, ys[i], 44, cols[i], a[0], a[1], 0.2 + 0.8 * on);
      if (on === 1) { spinner(ctx, ax, ys[i], 30, cols[i], t, 0.9); }
      if (cyc >= ph[i + 1][1]) check(ctx, ax + 26, ys[i] - 18, 7, P.teal, 1);
    });
    // the question travels, then each handoff
    var u = smooth((cyc - ph[0][0]) / (ph[0][1] - ph[0][0])); if (u > 0 && u < 1) packet(ctx, l0(u), P.lilac);
    [0, 1].forEach(function (i) { var s = (cyc - ph[i + 1][1]) / (ph[i + 2][0] - ph[i + 1][1]); if (s > 0 && s < 1) packet(ctx, hand[i](smooth(s)), cols[i]); });
    // outputs arrive one by one while the Writer works; the source number sits in the card's lower corner
    c.outs.forEach(function (o, i) {
      var f = smooth((cyc - (0.64 + i * 0.05)) / 0.06);
      card(ctx, ox, oys[i], cw, ch, { title: o, lines: 2, on: f > 0.5, col: cols[2], widths: [0.62, 0.4] });
      if (f > 0.5) { var bxx = ox + cw - 16, byy = oys[i] + ch - 12; enter(); ctx.save(); ctx.fillStyle = rgba(P.lilac, 0.2); rrect(ctx, bxx - 9, byy - 7, 18, 14, 3); ctx.fill(); ctx.strokeStyle = rgba(P.lilac, 0.7); ctx.lineWidth = 1; ctx.stroke(); ctx.restore(); leave(); mono(ctx, String(i + 1), bxx, byy + 0.5, { align: 'center', color: P.lilac, font: '500 9px ' + MONO }); }
      if (f > 0 && f < 1) packet(ctx, outs[i](f), cols[2]);
    });
    var sf = smooth((cyc - 0.84) / 0.08), sy = oys[2] + ch + 30;
    check(ctx, ox + 14, sy, 12, P.amber, sf); mono(ctx, 'you sign off', ox + 34, sy, { color: P.amber, a: sf });
  };

  // Scattered tools on the left pull into one project on the right: the problem, then the fix
  D.scatter = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 131);
    var c = cfgOf(st, { chips: ['PDF', 'slides', 'notebook', 'email', 'sheet', 'script'] });
    var cyc = (t * 0.06) % 1, nar = narrow(w, h), r = C.rng(17), FF = '500 9.5px ' + MONO;
    var pull = smooth((cyc - 0.28) / 0.3) * (1 - smooth((cyc - 0.93) / 0.07));
    var bx = nar ? w * 0.08 : w * 0.5, by = nar ? h * 0.5 : h * 0.12, bw = nar ? w * 0.84 : w * 0.46, bh = nar ? h * 0.44 : h * 0.76;
    // the project
    rrect(ctx, bx, by, bw, bh, 14); ctx.fillStyle = rgba(P.violet, 0.04 + 0.05 * pull); ctx.fill(); ctx.strokeStyle = rgba(P.lilac, 0.25 + 0.55 * pull); ctx.lineWidth = 1.2; ctx.stroke();
    text(ctx, 'One project', bx + 14, by + 18, { font: '500 12px ' + SANS, color: INK, a: 0.4 + 0.6 * pull });
    mono(ctx, 'today', 14, 18, { color: INK3, a: 1 - 0.6 * pull });
    var names = ['Reader', 'Analyst', 'Writer'];
    names.forEach(function (n, i) { var x = bx + bw * (0.25 + i * 0.25), y = by + bh - 34; agent(ctx, x, y, 28, ACOL[n], '', '', 0.2 + 0.8 * pull); if (pull > 0.9) packet(ctx, { x: x + Math.sin(t * 2 + i) * 6, y: y - 22 - ((t * 20 + i * 9) % 18) }, ACOL[n], 1.8); });
    // each file is a small tag; once filed it gains a check, so it is measured both ways
    var tws = c.chips.map(function (nm) { return tw(ctx, nm, FF); });
    var col1 = Math.max.apply(null, tws.filter(function (v, i) { return i % 2 === 0; })) + 30;
    // scattered in two loose columns on the left (or on top on a phone), then filed in two columns inside the project
    var pts = c.chips.map(function (name, i) {
      var gx = i % 2, gy = Math.floor(i / 2);
      var sx = (nar ? w * 0.05 + gx * w * 0.42 : w * 0.04 + gx * w * 0.21) + r() * w * 0.03, sy = (nar ? h * 0.08 + gy * h * 0.12 : h * 0.16 + gy * h * 0.22) + r() * h * (nar ? 0.03 : 0.04);
      sx += Math.sin(t * 0.7 + i * 1.7) * 5; sy += Math.cos(t * 0.6 + i * 1.3) * 4;
      var tx = bx + 14 + gx * (col1 + 8), ty = by + 36 + gy * 26;
      // the bottom row files first and the right column before the left, so a moving tag never crosses a filed one
      var k = (2 - gy) * 2 + (1 - gx), f = smooth((pull - k * 0.05) / 0.7);
      return { x: lerp(sx, tx, f), y: lerp(sy, ty, f), f: f, name: name, tw: tws[i] };
    });
    // tangled links while scattered
    ctx.save(); ctx.globalAlpha = 0.35 * (1 - pull); ctx.setLineDash([2, 5]); ctx.strokeStyle = INK3; ctx.lineWidth = 1;
    for (var i = 0; i < pts.length; i++) { var a = pts[i], b = pts[(i * 3 + 2) % pts.length]; ctx.beginPath(); ctx.moveTo(a.x + 20, a.y + 10); ctx.lineTo(b.x + 20, b.y + 10); ctx.stroke(); }
    ctx.restore();
    pts.forEach(function (p) {
      var filed = p.f > 0.95, cw = p.tw + (filed ? 30 : 16);
      rrect(ctx, p.x, p.y, cw, 20, 5); ctx.fillStyle = RAISED; ctx.fill(); ctx.strokeStyle = filed ? rgba(P.teal, 0.6) : LINE; ctx.lineWidth = 1; ctx.stroke();
      mono(ctx, p.name, p.x + 8, p.y + 10.5, { color: filed ? INK : INK2, font: FF });
      if (filed) check(ctx, p.x + cw - 10, p.y + 10, 5.5, P.teal, 1);
    });
    var px = nar ? w * 0.86 : w * 0.1, py = nar ? h * 0.2 : h * 0.86;
    person(ctx, px, py, 14, '', P.paper);
    if (pull < 0.3) mono(ctx, '?', px, py - 26, { align: 'center', color: P.amber, font: '500 13px ' + MONO, a: 1 - pull / 0.3 });
  };

  // An example project as a pipeline: each stage has who does it; a packet runs through; each stage is logged
  D.pipeline = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 141);
    var c = cfgOf(st, { stages: [['Question', 'You'], ['Evidence', 'Reader'], ['Analysis', 'Analyst'], ['Decision', 'You']] });
    var cyc = (t * 0.07) % 1, nar = narrow(w, h), n = c.stages.length;
    var pos = c.stages.map(function (s, i) {
      if (nar) { var row = i < 2 ? 0 : 1, col = row ? 1 - (i - 2) : i; return { x: w * (0.27 + col * 0.46), y: h * (0.26 + row * 0.34) }; }
      return { x: w * (0.12 + i * (0.76 / (n - 1))), y: h * 0.38 };
    });
    // the path between stages; on a phone the turn goes round the right side, clear of the names under the icons
    var segs = []; for (var i = 0; i < n - 1; i++) { var a = pos[i], b = pos[i + 1]; segs.push(Math.abs(a.x - b.x) < 1 ? [a, { x: w * 0.93, y: a.y }, { x: w * 0.93, y: b.y }, b] : [a, b]); }
    var run = smooth(cyc / 0.8) * (n - 1);
    segs.forEach(function (pts, i) {
      var f = clamp(run - i);
      ctx.save(); ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.setLineDash([3, 5]); ctx.lineJoin = 'round'; polyDraw(ctx, pts, 1); ctx.restore();
      if (f > 0) { ctx.save(); ctx.strokeStyle = rgba(P.lilac, 0.85); ctx.lineWidth = 2; ctx.lineJoin = 'round'; polyDraw(ctx, pts, f); ctx.restore(); }
      for (var k = 0; k < pts.length - 1; k++) emit({ t: 'link', ax: pts[k].x, ay: pts[k].y, bx: pts[k + 1].x, by: pts[k + 1].y, mx: 0, my: 0, bend: 0, a: 0.5 });
    });
    c.stages.forEach(function (s, i) {
      var p = pos[i], reached = run >= i - 0.02, done = run >= i + 0.5 || (i === n - 1 && cyc > 0.86);
      actor(ctx, p.x, p.y, s[1], reached ? 1 : 0.15, t);
      text(ctx, s[0], p.x, p.y + 34, { font: '500 12px ' + SANS, color: reached ? INK : INK3, align: 'center' });
      mono(ctx, s[1] === 'You' ? 'you' : s[1].toLowerCase(), p.x, p.y + 50, { align: 'center', color: INK3, font: '500 9.5px ' + MONO });
      if (done) check(ctx, p.x + 22, p.y - 20, 7, i === n - 1 && s[1] === 'You' ? P.amber : P.teal, 1);
    });
    if (cyc < 0.8) { var k2 = Math.min(n - 2, Math.floor(run)); packet(ctx, polyAt(segs[k2], run - k2), P.paper, 3); }
    // the record fills in as stages pass
    var ly = nar ? h * 0.84 : h * 0.78; mono(ctx, 'record', w * 0.06, ly - 16, { color: INK3 });
    var lw = (w * 0.88 - (n - 1) * 8) / n;
    c.stages.forEach(function (s, i) { var f = smooth((run - i + 0.2) / 0.3); var x = w * 0.06 + i * (lw + 8); rrect(ctx, x, ly, lw, 22, 5); ctx.fillStyle = rgba(P.lilac, 0.06 * f); ctx.fill(); ctx.strokeStyle = f > 0.5 ? rgba(P.lilac, 0.45) : LINE; ctx.lineWidth = 1; ctx.stroke(); if (f > 0.05) mono(ctx, (i + 1) + ' · logged', x + 8, ly + 11.5, { color: INK2, a: f, font: '500 9.5px ' + MONO }); });
  };

  // Platform: a project board — three agents at work, one draft waiting for you
  D.bench = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 151);
    var cyc = (t * 0.08) % 1, nar = narrow(w, h);
    var x0 = w * 0.05, x1 = nar ? w * 0.95 : w * 0.72, top = h * 0.07;
    rrect(ctx, x0, top, x1 - x0, 34, 10); ctx.fillStyle = RAISED; ctx.fill(); ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.stroke();
    text(ctx, 'Project · KRAS G12C', x0 + 14, top + 17, { font: '500 12px ' + SANS, color: INK });
    var tabs = ['Datasets', 'Models', 'Protocols', 'Evidence'], tx = x0;
    tabs.forEach(function (tb, i) { var wd = chip(ctx, tx, top + 52, tb, i === 3 ? P.lilac : INK3, { on: i === Math.floor(cyc * 4) }); tx += wd + 6; });
    var rows = [['Reader', 'Literature review', '42 sources · 3 open questions'], ['Analyst', 'Variant call · cohort 07', 'QC passed · 1,204 samples'], ['Writer', 'Protocol draft', 'Waiting for your review']];
    var rh = nar ? h * 0.16 : h * 0.18, ry0 = top + 76;
    rows.forEach(function (rw, i) {
      var y = ry0 + i * (rh + 8), col = ACOL[rw[0]];
      rrect(ctx, x0, y, x1 - x0, rh, 10); ctx.fillStyle = RAISED; ctx.fill(); ctx.strokeStyle = i === 2 ? rgba(P.amber, 0.45) : LINE; ctx.lineWidth = 1; ctx.stroke();
      agent(ctx, x0 + 26, y + rh / 2, 30, col, '', '', 1);
      text(ctx, rw[1], x0 + 50, y + rh * 0.34, { font: '500 12px ' + SANS, color: INK });
      mono(ctx, rw[2], x0 + 50, y + rh * 0.62, { color: i === 2 ? P.amber : INK3, font: '500 10px ' + MONO });
      var prog = i === 2 ? 1 : ((cyc + i * 0.37) % 1), bw = x1 - x0 - 66;
      ctx.fillStyle = LINE; ctx.fillRect(x0 + 50, y + rh - 9, bw, 2.2); ctx.fillStyle = rgba(col, 0.9); ctx.fillRect(x0 + 50, y + rh - 9, bw * prog, 2.2);
      if (i < 2) spinner(ctx, x0 + 26, y + rh / 2, 21, col, t + i, 0.8);
    });
    // the reviewer
    var wy = ry0 + 2 * (rh + 8) + rh / 2;
    var rx = nar ? w * 0.84 : w * 0.86, ry = nar ? ry0 + 3 * (rh + 8) + 26 : wy;
    person(ctx, rx, ry, 18, 'You');
    var l = link(ctx, nar ? { x: rx, y: wy + rh / 2 } : { x: x1 + 4, y: wy }, nar ? { x: rx, y: ry - 20 } : { x: rx - 22, y: ry }, { col: P.amber, a: 0.5, dash: true });
    packet(ctx, l((t * 0.5) % 1), P.amber, 2.4);
    var blink = 0.5 + 0.5 * Math.sin(t * 3); glowAt(ctx, rx, ry, 26, P.amber, 0.2 + 0.25 * blink);
  };

  // Platform: each task goes to the model that does it best; the routing is logged
  D.routing = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 161);
    var tasks = ['Read papers', 'Write code', 'Predict structure', 'Draft report'];
    var models = [['long-context LLM', P.violet], ['code model', P.cyan], ['structure model', P.teal], ['drafting LLM', P.magenta]];
    var cyc = (t * 0.1) % 1, k = Math.floor(cyc * 4), u = cyc * 4 - k;
    var hub = { x: w * 0.5, y: h * 0.4 }, ys = [0.13, 0.3, 0.47, 0.64].map(function (f) { return h * f; });
    var ins = [], outs = [];
    tasks.forEach(function (tk, i) { var wd = chip(ctx, w * 0.04, ys[i], tk, INK3, { on: i === k }); ins.push(link(ctx, { x: w * 0.04 + wd + 4, y: ys[i] }, { x: hub.x - 26, y: hub.y }, { col: i === k ? models[i][1] : INK3, a: i === k ? 0.7 : 0.18, bend: 0.1 })); });
    models.forEach(function (m, i) { var wd = chip(ctx, w * 0.96, ys[i], m[0], m[1], { align: 'right', on: i === k, dot: true }); outs.push(link(ctx, { x: hub.x + 26, y: hub.y }, { x: w * 0.96 - wd - 4, y: ys[i] }, { col: m[1], a: i === k ? 0.7 : 0.18, bend: 0.1 })); });
    // the router
    glowAt(ctx, hub.x, hub.y, 34, models[k][1], 0.35); mark(hub.x - 24, hub.y - 24, hub.x + 24, hub.y + 24, 'router');
    ctx.save(); ctx.beginPath(); for (var j = 0; j <= 6; j++) { var a = j / 6 * TAU - Math.PI / 2; var px = hub.x + Math.cos(a) * 24, py = hub.y + Math.sin(a) * 24; if (j) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.fillStyle = rgba(models[k][1], 0.14); ctx.fill(); ctx.strokeStyle = rgba(INK, 0.8); ctx.lineWidth = 1.4; ctx.stroke(); ctx.restore();
    C.dots(ctx, [{ x: hub.x, y: hub.y, r: 4, c: models[k][1] }], 1);
    mono(ctx, 'router', hub.x, hub.y + 36, { align: 'center', color: INK3 });
    if (u < 0.5) packet(ctx, ins[k](smooth(u / 0.5)), models[k][1]); else packet(ctx, outs[k](smooth((u - 0.5) / 0.5)), models[k][1]);
    // the log
    var ly = h * 0.8; mono(ctx, 'routing log', w * 0.04, ly - 18, { color: INK3 });
    for (var q = 0; q < 3; q++) { var idx = k - 2 + q; if (idx < 0) continue; var a2 = q === 2 ? smooth((u - 0.5) / 0.3) : 1; if (q === 2 && u < 0.5) continue; mono(ctx, '12:0' + (4 + idx) + '  ' + tasks[idx].toLowerCase() + ' → ' + models[idx][0], w * 0.04, ly + q * 15, { color: q === 2 ? INK : INK2, a: a2, font: '500 10px ' + MONO }); }
  };

  // Platform: a request becomes a result — request, access check, agents in turn, result written back (scroll-driven)
  D.cascade = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 171);
    var p = st.progress > 0 ? st.progress : ((t * 0.08) % 1), nar = narrow(w, h);
    // four stops: in a row on a wide frame (names under them), in a column on a phone (names beside them, never on the path)
    var S = nar ? [0.13, 0.37, 0.61, 0.85].map(function (f) { return { x: w * 0.2, y: h * f }; }) : [0.1, 0.35, 0.62, 0.88].map(function (f) { return { x: w * f, y: h * 0.44 }; });
    var off = [36, 42, 64, 42];
    var s = p * 4, labels = ['request', 'access check', 'agents · logged', 'cited result'];
    for (var i = 0; i < 3; i++) { var a = S[i], b = S[i + 1], f = clamp(s - i - 0.5); ctx.save(); ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.restore(); if (f > 0) { ctx.save(); ctx.strokeStyle = rgba(P.lilac, 0.8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(lerp(a.x, b.x, f), lerp(a.y, b.y, f)); ctx.stroke(); ctx.restore(); } }
    function note(i, sname, col, on) { if (nar) { chip(ctx, S[i].x + off[i], S[i].y + 13, sname, col, { on: on }); return; } var cw = chipW(ctx, sname); chip(ctx, clamp(S[i].x - cw / 2, 8, w - 8 - cw), S[i].y - 44, sname, col, { on: on }); }
    // 1 the request
    person(ctx, S[0].x, S[0].y, 20, '', P.paper); if (s < 1.2) note(0, 'new question', P.lilac, true);
    // 2 the gate
    var g = smooth(s - 1); rrect(ctx, S[1].x - 26, S[1].y - 26, 52, 52, 14); ctx.fillStyle = BASE; ctx.fill(); ctx.fillStyle = rgba(P.teal, 0.05 + 0.1 * g); ctx.fill(); ctx.strokeStyle = rgba(g > 0.9 ? P.teal : INK3, 0.8); ctx.lineWidth = 1.2; ctx.stroke();
    lockIcon(ctx, S[1].x, S[1].y + 2, 18, g > 0.9 ? P.teal : INK2, g);
    if (g > 0.9) note(1, 'editor · project A', P.teal, true);
    // 3 the agents, in turn
    ['Reader', 'Analyst', 'Writer'].forEach(function (n, i) { var on = clamp((s - 2) * 3 - i); var ax = S[2].x + (i - 1) * 34, ay = S[2].y; agent(ctx, ax, ay, 28, ACOL[n], '', '', 0.2 + 0.8 * on); if (on > 0 && on < 1) spinner(ctx, ax, ay, 20, ACOL[n], t, 0.9); });
    var logs = Math.floor(clamp((s - 2) * 3, 0, 3)); if (logs) labels[2] = logs + ' of 3 logged';
    // 4 the result
    var r = smooth(s - 3); var pw = 54, phh = 66;
    page(ctx, S[3].x - pw / 2, S[3].y - phh / 2, pw, phh, { lines: 5, cites: [1, 3], fill_t: r, on: r > 0.2 });
    if (r > 0.95) { check(ctx, S[3].x + pw / 2 + 8, S[3].y - phh / 2, 8, P.amber, 1); }
    // travelling packet
    var k = Math.min(2, Math.floor(s)), f2 = clamp(s - k); if (p < 0.999 && s < 3.2) packet(ctx, { x: lerp(S[k].x, S[k + 1].x, smooth(f2)), y: lerp(S[k].y, S[k + 1].y, smooth(f2)) }, P.paper, 3);
    S.forEach(function (q, i) { if (nar) mono(ctx, labels[i], q.x + off[i], q.y - 9, { color: s >= i ? INK2 : INK3 }); else mono(ctx, labels[i], q.x, q.y + 46, { align: 'center', color: s >= i ? INK2 : INK3 }); });
  };

  // Platform: the tools you already use around one project; data in, results out
  D.hub = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 181);
    var nodes = ['ELN', 'LIMS', 'Storage', 'Git', 'Team chat', 'SSO', 'References'], cx = w * 0.5, cy = h * 0.5;
    var rx = w * 0.33, ry = h * 0.35;
    var pts = nodes.map(function (n, i) { var a = -Math.PI / 2 + i / nodes.length * TAU; return { x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, n: n }; });
    var cols = [P.violet, P.cyan, P.teal, P.lilac, P.magenta, P.amber, P.blue];
    pts.forEach(function (q, i) {
      var l = link(ctx, { x: cx, y: cy }, q, { col: cols[i], a: 0.25 });
      var ph = (t * 0.22 + i * 0.37) % 1, inb = Math.floor(t * 0.22 + i * 0.37) % 2 === 0;
      packet(ctx, l(inb ? 1 - ph : ph), inb ? P.teal : P.violet, 2.2);
    });
    glowAt(ctx, cx, cy, 44, P.violet, 0.35);
    agent(ctx, cx, cy, 58, P.violet, '', '', 1);
    var pw2 = tw(ctx, 'your project', '500 11px ' + SANS) + 14; enter(); rrect(ctx, cx - pw2 / 2, cy + 44 - 9, pw2, 18, 6); ctx.fillStyle = BASE; ctx.fill(); leave();
    text(ctx, 'your project', cx, cy + 44, { align: 'center', font: '500 11px ' + SANS, color: INK });
    pts.forEach(function (q, i) { chip(ctx, q.x, q.y, q.n, cols[i], { align: 'center', on: true, dot: true }); });
    mono(ctx, 'in', w * 0.04, h * 0.93, { color: P.teal }); mono(ctx, 'out', w * 0.04 + 26, h * 0.93, { color: P.violet });
  };

  // Data & models: three trained models, each with its validation drawn as a chart (no numbers invented)
  D.models = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 191);
    var cyc = (t * 0.08) % 1, gap = w * 0.03, pw = (w * 0.92 - gap * 2) / 3, top = h * 0.12, ph = h * 0.66;
    var titles = [['Variant effect', P.violet], ['Binding affinity', P.cyan], ['Assay QC', P.amber]];
    titles.forEach(function (tt, i) {
      var x = w * 0.04 + i * (pw + gap);
      rrect(ctx, x, top, pw, ph, 10); ctx.fillStyle = RAISED; ctx.fill(); ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.stroke();
      text(ctx, tt[0], x + 10, top + 16, { font: '500 11px ' + SANS, color: INK });
      var ax = x + 12, ay = top + 34, aw = pw - 24, ah = ph - 50;
      ctx.strokeStyle = LINE; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax, ay + ah); ctx.lineTo(ax + aw, ay + ah); ctx.stroke();
      var f = smooth((cyc - i * 0.12) / 0.45);
      if (i === 0) { // a ROC-like curve
        ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = rgba(INK, 0.25); ctx.beginPath(); ctx.moveTo(ax, ay + ah); ctx.lineTo(ax + aw, ay); ctx.stroke(); ctx.restore();
        ctx.beginPath(); for (var k = 0; k <= 40 * f; k++) { var u = k / 40, v = 1 - Math.pow(1 - u, 3.2); var px = ax + u * aw, py = ay + ah - v * ah; if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py); } ctx.strokeStyle = tt[1]; ctx.lineWidth = 2; ctx.stroke();
      } else if (i === 1) { // predicted vs measured
        ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = rgba(INK, 0.25); ctx.beginPath(); ctx.moveTo(ax, ay + ah); ctx.lineTo(ax + aw, ay); ctx.stroke(); ctx.restore();
        var r = C.rng(23), pts = []; for (var k2 = 0; k2 < 26; k2++) { var u2 = r(), e = (r() - 0.5) * 0.24; if (k2 / 26 > f) break; pts.push({ x: ax + u2 * aw, y: ay + ah - clamp(u2 + e) * ah, r: 2.2, c: tt[1] }); } C.glows(ctx, pts, 0.4, 6); C.dots(ctx, pts, 0.95);
      } else { // a plate: wells scanned, a few flagged
        var cols = 8, rows = 6, cw = aw / cols, chh = ah / rows, sweep = f * cols, flag = [[1, 2], [4, 5], [6, 1]];
        for (var yy = 0; yy < rows; yy++) for (var xx = 0; xx < cols; xx++) { var cx = ax + (xx + 0.5) * cw, cy = ay + (yy + 0.5) * chh, rr = Math.min(cw, chh) * 0.3, seen = xx < sweep; var fl = flag.some(function (q) { return q[0] === xx && q[1] === yy; }); ctx.beginPath(); ctx.arc(cx, cy, rr, 0, TAU); ctx.fillStyle = fl && seen ? rgba(P.amber, 0.8) : rgba(P.teal, seen ? 0.35 : 0.1); ctx.fill(); if (fl && seen) { ctx.strokeStyle = P.amber; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, rr + 3, 0, TAU); ctx.stroke(); } }
        if (f < 1) { ctx.fillStyle = rgba(P.teal, 0.18); ctx.fillRect(ax + sweep * cw - 2, ay, 3, ah); }
      }
    });
    mono(ctx, 'validation reported on each model card', w * 0.04, top + ph + 24, { color: INK2 });
  };

  // Data & models: a dataset card travels the five curation steps and gains a tag at each
  D.curation = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 201);
    var steps = ['Collect', 'Clean', 'Version', 'Document', 'Serve'], tags = ['source · licence', 'deduplicated', 'v3', 'schema · limits', 'queryable · cited'];
    var cyc = (t * 0.065) % 1, py = h * 0.7, x0 = w * 0.1, x1 = w * 0.9;
    var run = smooth(cyc / 0.82) * 4, cols = [P.violet, P.cyan, P.teal, P.amber, P.magenta];
    ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, py); ctx.lineTo(x1, py); ctx.stroke();
    ctx.strokeStyle = rgba(P.lilac, 0.8); ctx.beginPath(); ctx.moveTo(x0, py); ctx.lineTo(lerp(x0, x1, run / 4), py); ctx.stroke();
    steps.forEach(function (s, i) { var x = lerp(x0, x1, i / 4), on = run >= i - 0.02; mark(x - 7, py - 7, x + 7, py + 7, 'step dot'); ctx.beginPath(); ctx.arc(x, py, 6, 0, TAU); ctx.fillStyle = on ? cols[i] : RAISED; ctx.fill(); ctx.strokeStyle = cols[i]; ctx.lineWidth = 1.4; ctx.stroke(); if (on) glowAt(ctx, x, py, 10, cols[i], 0.4); mono(ctx, s, x, py + (i % 2 ? 36 : 20), { align: 'center', color: on ? INK : INK3 }); });
    var cx = lerp(x0, x1, run / 4), n = Math.min(5, Math.floor(run + 1.02)), cw = Math.min(150, w * 0.36), chh = 30 + n * 18, cyy = Math.max(h * 0.06, py - 26 - chh);
    var left = clamp(cx - cw / 2, w * 0.03, w * 0.97 - cw);
    ctx.save(); ctx.strokeStyle = rgba(P.lilac, 0.4); ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(cx, cyy + chh); ctx.lineTo(cx, py - 8); ctx.stroke(); ctx.restore();
    rrect(ctx, left, cyy, cw, chh, 10); ctx.fillStyle = RAISED; ctx.fill(); ctx.strokeStyle = rgba(cols[Math.min(4, n - 1)], 0.8); ctx.lineWidth = 1.2; ctx.stroke();
    text(ctx, 'Dataset', left + 12, cyy + 16, { font: '500 12px ' + SANS, color: INK });
    for (var k = 0; k < n; k++) { var a = k === n - 1 ? smooth((run - k + 0.02) / 0.4) : 1; mono(ctx, tags[k], left + 12, cyy + 36 + k * 18, { color: cols[k], a: a }); }
    if (run > 3.95) { glowAt(ctx, left + cw / 2, cyy + chh / 2, cw * 0.4, P.magenta, 0.15); }
  };

  // Security: in transit through an encrypted tunnel, at rest under managed keys, inside the project
  D.encrypt = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 211);
    var nar = narrow(w, h), cyc = (t * 0.25) % 1;
    var you = { x: w * 0.1, y: h * 0.46 }, t0 = w * 0.2, t1 = w * 0.58, ty = h * 0.46;
    person(ctx, you.x, you.y, 20, 'You');
    // the tunnel
    ctx.strokeStyle = rgba(P.teal, 0.55); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(t0, ty - 14); ctx.lineTo(t1, ty - 14); ctx.moveTo(t0, ty + 14); ctx.lineTo(t1, ty + 14); ctx.stroke();
    ctx.fillStyle = rgba(P.teal, 0.05); ctx.fillRect(t0, ty - 14, t1 - t0, 28); mark(t0, ty - 14, t1, ty + 14, 'tunnel');
    lockIcon(ctx, (t0 + t1) / 2, ty - 30, 16, P.teal, 0);
    mono(ctx, 'in transit · TLS 1.2+', (t0 + t1) / 2, ty + 34, { align: 'center', color: INK2 });
    // packets: plain outside, scrambled inside
    for (var i = 0; i < 4; i++) { var u = (cyc + i * 0.25) % 1, x = lerp(you.x + 22, w * 0.72, u); if (x < t0 || x > t1) { packet(ctx, { x: x, y: ty }, P.paper, 2.4); } else { var rs = C.rng(Math.floor(t * 8) + i * 31); for (var k = 0; k < 4; k++) { ctx.fillStyle = rgba(P.teal, 0.5 + rs() * 0.5); ctx.fillRect(x - 6 + k * 3.2, ty - 3 + (rs() - 0.5) * 6, 2.4, 2.4); } } }
    // the project with its store
    var bx = w * 0.62, by = h * 0.16, bw = w * 0.34, bh = h * 0.62;
    rrect(ctx, bx, by, bw, bh, 12); ctx.fillStyle = rgba(P.violet, 0.05); ctx.fill(); ctx.strokeStyle = rgba(P.lilac, 0.5); ctx.lineWidth = 1.2; ctx.stroke();
    text(ctx, 'Project A', bx + 12, by + 16, { font: '500 12px ' + SANS, color: INK });
    var sx = bx + bw * 0.42, sy = by + bh * 0.52; glowAt(ctx, sx, sy, 26, P.teal, 0.25 + 0.2 * Math.sin(t * 2)); cylinder(ctx, sx, sy, 18, 30, P.teal, 0.9);
    // a key that turns on a schedule
    var kx = bx + bw * 0.78, ky = by + bh * 0.52, rot = smooth(((t * 0.2) % 1 - 0.8) / 0.2) * TAU;
    ctx.save(); ctx.translate(kx, ky); ctx.rotate(rot); ctx.strokeStyle = P.gold; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(-6, 0, 5, 0, TAU); ctx.moveTo(-1, 0); ctx.lineTo(9, 0); ctx.moveTo(6, 0); ctx.lineTo(6, 4); ctx.moveTo(9, 0); ctx.lineTo(9, 4); ctx.stroke(); ctx.restore();
    mono(ctx, nar ? 'managed keys' : 'at rest · managed keys', bx + bw / 2, by + bh - 16, { align: 'center', color: INK2, font: '500 10px ' + MONO });
    if (rot > 0.1) chip(ctx, kx, ky - 26, 'rotated', P.gold, { align: 'center', on: true });
  };

  // Security: roles per project — owner, editor, viewer — and what each may do
  D.roles = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 221);
    var roles = [['owner', P.gold, [1, 1, 1, 1]], ['editor', P.lilac, [1, 1, 1, 0]], ['viewer', INK3, [1, 0, 0, 0]]];
    var acts = ['View', 'Edit', 'Run agents', 'Manage'];
    var cyc = (t * 0.1) % 1, lx = w * 0.06, c0 = w * 0.34, cw = (w * 0.94 - c0) / acts.length, top = h * 0.2, rh = h * 0.16;
    chip(ctx, lx, h * 0.08, 'Project A', P.lilac, { on: true, dot: true });
    acts.forEach(function (a, j) { mono(ctx, a, c0 + (j + 0.5) * cw, top, { align: 'center', color: INK2, font: '500 10px ' + MONO }); });
    var scan = cyc * 3.4;
    roles.forEach(function (r, i) {
      var y = top + 26 + i * rh + rh / 2, on = scan >= i;
      if (Math.floor(scan) === i) { rrect(ctx, lx - 6, y - rh / 2 + 3, w * 0.9, rh - 6, 10); ctx.fillStyle = rgba(r[1], 0.07); ctx.fill(); }
      person(ctx, lx + 12, y, 11, '', r[1]); text(ctx, r[0], lx + 32, y, { font: '500 12px ' + SANS, color: INK });
      r[2].forEach(function (v, j) { var x = c0 + (j + 0.5) * cw, a = on ? smooth((scan - i) * 3 - j * 0.4) : 0; if (v) check(ctx, x, y, 8, P.teal, 0.25 + 0.75 * a); else { ctx.strokeStyle = rgba(INK3, 0.5); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y); ctx.stroke(); } });
      ctx.strokeStyle = LINE; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lx, y + rh / 2); ctx.lineTo(w * 0.94, y + rh / 2); ctx.stroke();
    });
    mono(ctx, 'set per project and per dataset', lx, h * 0.9, { color: INK3 });
  };

  // About: people and agents around one project — ask, work, decide
  D.circle = function (ctx, w, h, t, st) {
    ground(ctx, w, h, 231);
    var cyc = (t * 0.08) % 1, cx = w * 0.5, cy = h * 0.54;
    var people = [{ x: w * 0.13, y: h * 0.36, n: 'Scientist' }, { x: w * 0.13, y: h * 0.74, n: 'Clinician' }];
    var agents = [{ x: w * 0.87, y: h * 0.28, n: 'Reader' }, { x: w * 0.87, y: h * 0.54, n: 'Analyst' }, { x: w * 0.87, y: h * 0.8, n: 'Writer' }];
    var lp = people.map(function (q) { return link(ctx, { x: q.x + 18, y: q.y }, { x: cx - 32, y: cy }, { col: P.paper, a: 0.22, bend: 0.1 }); });
    var la = agents.map(function (q) { return link(ctx, { x: cx + 32, y: cy }, { x: q.x - 22, y: q.y }, { col: ACOL[q.n], a: 0.3, bend: 0.1 }); });
    glowAt(ctx, cx, cy, 50, P.violet, 0.3);
    rrect(ctx, cx - 32, cy - 32, 64, 64, 18); ctx.fillStyle = rgba(P.violet, 0.1); ctx.fill(); ctx.strokeStyle = rgba(P.lilac, 0.8); ctx.lineWidth = 1.3; ctx.stroke();
    page(ctx, cx - 14, cy - 18, 28, 36, { lines: 4, cites: [1], fill_t: smooth((cyc - 0.35) / 0.3), on: true });
    text(ctx, 'project', cx, cy + 46, { align: 'center', font: '500 11px ' + SANS, color: INK2 });
    people.forEach(function (q, i) { person(ctx, q.x, q.y, 18, q.n); });
    agents.forEach(function (q, i) { var on = cyc > 0.2 && cyc < 0.7 ? 1 : 0.4; agent(ctx, q.x, q.y, 34, ACOL[q.n], q.n, '', on); if (on === 1) spinner(ctx, q.x, q.y, 24, ACOL[q.n], t + i, 0.8); });
    var phase = cyc < 0.2 ? 0 : cyc < 0.7 ? 1 : 2, verbs = ['Scientists ask', 'Agents read, compute and draft', 'Scientists judge and decide'];
    chip(ctx, cx, h * 0.1, verbs[phase], [P.paper, P.violet, P.amber][phase], { align: 'center', on: true });
    if (phase === 0) { var u = smooth(cyc / 0.2); packet(ctx, lp[0](u), P.paper); }
    if (phase === 1) { var u2 = ((cyc - 0.2) / 0.5 * 2) % 1, back = (cyc - 0.2) / 0.5 > 0.5; la.forEach(function (l, i) { packet(ctx, l(back ? 1 - u2 : u2), ACOL[agents[i].n], 2.2); }); }
    if (phase === 2) { var u3 = smooth((cyc - 0.7) / 0.18); lp.forEach(function (l) { packet(ctx, l(1 - u3), P.amber); }); if (u3 > 0.95) people.forEach(function (q) { check(ctx, q.x + 22, q.y - 18, 7, P.amber, 1); }); }
  };

  /* ---------- attach ---------- */
  function attach(canvas, opts) {
    opts = opts || {}; var kind = opts.kind || 'flow', fn = D[kind] || D.flow; var st = { progress: 0, cfg: opts.cfg || null }, geo = null;
    function draw(t) {
      var f = C.fit(canvas, 1.5); geo = f;
      // a narrow frame draws the same layout smaller, so nothing collides on a phone
      var k = Math.min(1, f.w / 400); f.ctx.save(); f.ctx.scale(k, k);
      fn(f.ctx, f.w / k, f.h / k, t + (opts.phase || 0) * 1.7, st); f.ctx.restore();
    }
    draw(0);
    var api = { setProgress: function (p) { st.progress = p; }, redraw: function () { draw(C.lastTime()); } };
    if (C.RM() || opts.static) { return api; }
    api.ticker = C.register(canvas, function (t) { draw(t); }, { margin: '120px 0px' });
    api.pause = function () { api.ticker.paused = true; }; api.resume = function () { api.ticker.paused = false; C.wake(); };
    return api;
  }
  window.CytogentDiagrams = { attach: attach, kinds: Object.keys(D), D: D, inspect: function (h) { H = h; } };
})();
