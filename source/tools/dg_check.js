// runs inside the harness page: draws every case at many moments and reports layout problems
window.runChecks = function (cases, opts) {
  var D = window.CytogentDiagrams.D, out = {};
  var cv = document.createElement('canvas'), ctx = cv.getContext('2d');
  function ov(a, b, tol) { tol = tol || 1; return a.x0 < b.x1 - tol && b.x0 < a.x1 - tol && a.y0 < b.y1 - tol && b.y0 < a.y1 - tol; }
  function inside(a, b, tol) { tol = tol === undefined ? 1 : tol; return a.x0 >= b.x0 - tol && a.x1 <= b.x1 + tol && a.y0 >= b.y0 - tol && a.y1 <= b.y1 + tol; }
  function ptIn(p, b, pad) { return p.x > b.x0 - pad && p.x < b.x1 + pad && p.y > b.y0 - pad && p.y < b.y1 + pad; }
  function nm(e) { return e.t + (e.s ? ':' + e.s : ''); }
  function add(c, t, rule, a, b) {
    var key = c.id + ' | ' + rule + ' | ' + nm(a) + (b ? '  ×  ' + nm(b) : '');
    var r = out[key] || (out[key] = { kind: c.kind, id: c.id, rule: rule, n: 0, ts: [] }); r.n++; if (r.ts.length < 4) r.ts.push(t);
  }
  var TEXTY = { text: 1, chip: 1 }, ICON = { agent: 1, person: 1, icon: 1 }, CONT = { card: 1, page: 1, box: 1 };
  cases.forEach(function (c) {
    cv.width = Math.ceil(c.W); cv.height = Math.ceil(c.H);
    var samples = [];
    for (var t = 0; t < (opts.tmax || 20); t += (opts.dt || 0.4)) samples.push({ t: t, p: 0 });
    if (c.kind === 'flow' || c.kind === 'cascade') for (var p = 0.02; p < 1; p += 0.04) samples.push({ t: 1, p: p });
    samples.forEach(function (sm) {
      var E = [], id = 0;
      var h = { depth: 0, parent: 0, frame: null, emit: function (el) { el.id = ++id; E.push(el); return el.id; } };
      window.CytogentDiagrams.inspect(h);
      try { D[c.kind](ctx, c.W, c.H, sm.t, { progress: sm.p, cfg: c.cfg }); } catch (e) { add(c, sm.t, 'ERROR ' + e.message, { t: 'x' }); }
      window.CytogentDiagrams.inspect(null);
      var W = c.W, H = c.H, tag = sm.p ? 'p' + sm.p.toFixed(2) : sm.t.toFixed(1);
      var byId = {}; E.forEach(function (e) { byId[e.id] = e; });
      var objs = E.filter(function (e) { return e.t !== 'link'; });
      objs.forEach(function (e) {
        if (e.t === 'box' && e.x0 <= 0.5 && e.y0 <= 0.5) return;
        if (e.x0 < 3 || e.y0 < 3 || e.x1 > W - 3 || e.y1 > H - 3) add(c, tag, 'off-frame', e);
      });
      for (var i = 0; i < objs.length; i++) for (var j = i + 1; j < objs.length; j++) {
        var a = objs[i], b = objs[j];
        if (!ov(a, b)) continue;
        var A = a.t, B = b.t;
        // text / chips against each other
        if (TEXTY[A] && TEXTY[B]) { add(c, tag, A + '-' + B + ' overlap', a, b); continue; }
        // text / chip against an icon
        if ((TEXTY[A] && ICON[B]) || (TEXTY[B] && ICON[A])) { add(c, tag, 'label on icon', TEXTY[A] ? a : b, TEXTY[A] ? b : a); continue; }
        // text / chip against a check badge
        if ((TEXTY[A] && B === 'check') || (TEXTY[B] && A === 'check')) { add(c, tag, 'label on check', TEXTY[A] ? a : b, TEXTY[A] ? b : a); continue; }
        // text / chip crossing a container edge
        if ((TEXTY[A] && CONT[B]) || (TEXTY[B] && CONT[A])) {
          var tx = TEXTY[A] ? a : b, cn = TEXTY[A] ? b : a;
          if (!inside(tx, cn, 0.5)) add(c, tag, tx.parent === cn.id ? 'title overflows its box' : 'label crosses box edge', tx, cn);
          continue;
        }
        // icons on icons
        if (ICON[A] && ICON[B]) { if (!(inside(a, b) || inside(b, a))) add(c, tag, 'icon on icon', a, b); continue; }
        // containers partly overlapping (not nested)
        if (CONT[A] && CONT[B]) { if (!(inside(a, b) || inside(b, a))) add(c, tag, 'boxes overlap', a, b); continue; }
        // icon crossing a container edge
        if ((ICON[A] && CONT[B]) || (ICON[B] && CONT[A])) { var ic = ICON[A] ? a : b, cn2 = ICON[A] ? b : a; if (!inside(ic, cn2, 0.5)) add(c, tag, 'icon crosses box edge', ic, cn2); }
      }
      // parent titles that overflow their card even if nothing else is there
      objs.forEach(function (e) { if (e.t === 'text' && e.parent && byId[e.parent] && e.x1 > byId[e.parent].x1 - 3) add(c, tag, 'title overflows its box', e, byId[e.parent]); });
      // lines passing through things they do not connect
      E.filter(function (e) { return e.t === 'link' && e.a > 0.05; }).forEach(function (l) {
        var A = { x: l.ax, y: l.ay }, B = { x: l.bx, y: l.by };
        objs.forEach(function (o) {
          if (o.t === 'check') return;
          // an opaque object drawn after the line hides it; only lines drawn on top, or under see-through things, count
          if (o.id > l.id && { card: 1, page: 1, agent: 1, person: 1, chip: 1 }[o.t]) return;
          if (ptIn(A, o, 8) || ptIn(B, o, 8)) return;
          var hit = 0;
          for (var k = 1; k < 24; k++) { var u = k / 24, m = 1 - u, p = l.bend ? { x: m * m * l.ax + 2 * m * u * l.mx + u * u * l.bx, y: m * m * l.ay + 2 * m * u * l.my + u * u * l.by } : { x: l.ax + (l.bx - l.ax) * u, y: l.ay + (l.by - l.ay) * u }; if (ptIn(p, o, -2)) hit++; }
          if (hit >= 2) add(c, tag, 'line through ' + o.t, o);
        });
      });
    });
  });
  return Object.keys(out).map(function (k) { var r = out[k]; return { key: k, n: r.n, ts: r.ts }; });
};
