# -*- coding: utf-8 -*-
"""Shared pieces for the page checks: the browser flags and the contrast test that runs inside a page."""

# software WebGL, so the cell canvases draw in a headless browser
GL = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']

# Returns the text elements that miss WCAG AA: 4.5:1, or 3:1 for large text (24px, or 18.66px bold).
# The background is the nearest painted background colour up the tree, blended over the page ground.
# Elements that are hidden, or faded on purpose as an inactive state (opacity under 0.9), are skipped.
CONTRAST = r"""() => {
  function parse(c) {
    var m = /rgba?\(([^)]+)\)/.exec(c);
    if (m) { var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
    m = /color\(srgb ([^)]+)\)/.exec(c);
    if (m) { var q = m[1].split(/[\s\/]+/).filter(Boolean).map(parseFloat); return { r: q[0] * 255, g: q[1] * 255, b: q[2] * 255, a: q.length > 3 ? q[3] : 1 }; }
    return null;
  }
  function over(top, bot) { var a = top.a; return { r: top.r * a + bot.r * (1 - a), g: top.g * a + bot.g * (1 - a), b: top.b * a + bot.b * (1 - a), a: 1 }; }
  function lum(c) { function f(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); } return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
  function ground(el) {
    var stack = [], e = el;
    while (e && e.nodeType === 1) { var c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; } e = e.parentElement; }
    var base = { r: 5, g: 6, b: 14, a: 1 };
    for (var i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  }
  function shown(el) {
    var op = 1, e = el;
    while (e && e.nodeType === 1) {
      var cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility !== 'visible' || e.hidden || e.getAttribute('aria-hidden') === 'true') return false;
      op *= parseFloat(cs.opacity); e = e.parentElement;
    }
    return op >= 0.9;
  }
  var bad = [], seen = new Set();
  var walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walk.nextNode()) {
    var n = walk.currentNode, el = n.parentElement;
    if (!el || seen.has(el) || !n.textContent.trim()) continue;
    seen.add(el);
    if (/^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|OPTION)$/.test(el.tagName) || el.closest('.sr-only,.skip,[disabled]')) continue;
    var r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1 || !shown(el)) continue;
    var cs = getComputedStyle(el), fg = parse(cs.color); if (!fg) continue;
    var bg = ground(el), col = over(fg, bg), l1 = lum(col), l2 = lum(bg);
    var ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    var px = parseFloat(cs.fontSize), big = px >= 24 || (px >= 18.66 && parseInt(cs.fontWeight, 10) >= 700);
    if (ratio < (big ? 3 : 4.5)) bad.push(n.textContent.trim().slice(0, 40) + ' ' + ratio.toFixed(2) + ' (' + (el.className || el.tagName) + ')');
  }
  return bad;
}"""
