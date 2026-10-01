/* Cytogent — analytics consent ("basic" consent mode).
   Google Analytics 4 loads only after the visitor says yes; before that, nothing from Google is requested.
   The choice lives in localStorage['cg-consent']: granted | denied. A missing key means not asked yet.
   build.py inlines this file into every page. site/404.html carries a hand-pasted copy: keep the two in step. */
(function () {
  'use strict';
  var KEY = 'cg-consent', ID = 'G-H7WJPJ2WSP', d = document, state = null, loaded = false, bar = null, opener = null;
  try { state = window.localStorage.getItem(KEY); } catch (e) { state = null; }
  if (state !== 'granted' && state !== 'denied') { state = null; }
  function save(v) { state = v; try { window.localStorage.setItem(KEY, v); } catch (e) {} }

  /* the Google tag, exactly as issued: the async script, then the inline config */
  function load() {
    window['ga-disable-' + ID] = false;
    if (loaded) { return; }
    loaded = true;
    var s = d.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID; d.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  }
  /* a visitor who said yes earlier and now declines: stop sending and remove the analytics cookies */
  function stop() {
    window['ga-disable-' + ID] = true;
    try {
      var host = window.location.hostname, parts = host.split('.'), domains = [host, '.' + host];
      if (parts.length > 2) { domains.push('.' + parts.slice(-2).join('.')); }
      d.cookie.split(';').forEach(function (c) {
        var n = c.split('=')[0].replace(/^\s+|\s+$/g, '');
        if (n !== '_ga' && n.indexOf('_ga_') !== 0) { return; }
        d.cookie = n + '=; Max-Age=0; path=/';
        domains.forEach(function (dm) { d.cookie = n + '=; Max-Age=0; path=/; domain=' + dm; });
      });
    } catch (e) {}
  }

  /* events go out only with consent; otherwise this does nothing */
  window.cgTrack = function (name, params) {
    if (state === 'granted' && typeof window.gtag === 'function') { window.gtag('event', name, params || {}); }
  };

  function build() {
    bar = d.createElement('div');
    bar.className = 'cookiebar'; bar.id = 'cookiebar'; bar.tabIndex = -1;
    bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Cookie choice');
    bar.innerHTML = '<div class="cookiebar__in"><p class="cookiebar__text">' +
      '<span class="cookiebar__long">We use Google Analytics to see which pages help visitors. It sets cookies only if you say yes. </span>' +
      '<span class="cookiebar__short">We use Google Analytics, with cookies only if you say yes. </span>' +
      '<a href="/privacy/#cookies">Privacy policy</a></p>' +
      '<div class="cookiebar__actions">' +
      '<button type="button" class="btn btn--sm btn--primary" data-consent="granted">Accept analytics</button>' +
      '<button type="button" class="btn btn--sm btn--outline" data-consent="denied">Decline</button>' +
      '</div></div>';
    bar.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('[data-consent]') : null;
      if (b) { choose(b.getAttribute('data-consent')); }
    });
    var skip = d.querySelector('.skip');
    if (skip && skip.parentNode === d.body) { d.body.insertBefore(bar, skip.nextSibling); } else { d.body.insertBefore(bar, d.body.firstChild); }
  }
  function show(from) {
    if (!bar) { build(); }
    opener = from || null; bar.hidden = false;
    if (from) { bar.focus(); }
  }
  function choose(v) {
    var inside = bar.contains(d.activeElement);
    save(v);
    if (v === 'granted') { load(); } else { stop(); }
    bar.hidden = true;
    // hand the keyboard back to the page: to the link that opened the bar, or to the main content
    if (inside) {
      var t = opener || d.getElementById('main') || d.querySelector('main') || d.body;
      if (t !== opener && !t.hasAttribute('tabindex')) { t.setAttribute('tabindex', '-1'); }
      try { t.focus({ preventScroll: true }); } catch (e) { t.focus(); }
    }
    opener = null;
  }

  if (state === 'granted') { load(); }
  function ready() {
    if (state === null) { show(null); }
    d.addEventListener('click', function (e) {
      if (!e.target.closest) { return; }
      var cs = e.target.closest('[data-cookie-settings]');
      if (cs) { e.preventDefault(); show(cs); return; }
      // "Request access" buttons, and links that name their own place with data-cta
      var a = e.target.closest('a[data-cta], a[href^="/request-access/"]');
      if (!a) { return; }
      var loc = a.getAttribute('data-cta') || (a.closest('.sheet') ? 'menu' : a.closest('.nav') ? 'nav' : a.closest('.heroscene, .phero') ? 'hero' :
        a.closest('.cta') ? 'cta' : a.closest('.doors') ? 'access' : a.closest('.foot') ? 'footer' : 'page');
      window.cgTrack('cta_click', { location: loc });
    });
  }
  if (d.readyState === 'loading') { d.addEventListener('DOMContentLoaded', ready); } else { ready(); }
})();
