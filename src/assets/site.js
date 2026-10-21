(function () {
  var d = document;

  // Partner share links: ?code=XYZ on any page remembers the discount code for MP.cd days, and
  // MP.code() hands it to the checkout and enrollment forms to fill in.
  var MP = window.MP = window.MP || {};
  var CODE_KEY = 'cei-partner-code';
  try {
    var linkCode = new URLSearchParams(location.search).get('code');
    if (linkCode && /^[A-Za-z0-9_-]{2,40}$/.test(linkCode)) localStorage.setItem(CODE_KEY, JSON.stringify({ c: linkCode, t: Date.now() }));
  } catch (e) {}
  MP.code = function () {
    try {
      var saved = JSON.parse(localStorage.getItem(CODE_KEY) || 'null');
      if (saved && Date.now() - saved.t < (MP.cd || 30) * 864e5) return saved.c;
      localStorage.removeItem(CODE_KEY);
    } catch (e) {}
    return '';
  };
  // Menu: mobile toggle + dropdown panels (click, keyboard, outside click, Escape)
  var btn = d.querySelector('.menu-btn'), nav = d.getElementById('nav');
  var items = [].slice.call(d.querySelectorAll('.mi'));
  var closeAll = function (except) {
    items.forEach(function (li) { if (li !== except) { li.classList.remove('open'); li.querySelector('.mt').setAttribute('aria-expanded', 'false'); } });
  };
  if (btn && nav) btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) closeAll();
  });
  items.forEach(function (li) {
    var t = li.querySelector('.mt');
    t.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !li.classList.contains('open');
      closeAll(li);
      li.classList.toggle('open', open);
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    li.addEventListener('mouseleave', function () { if (window.matchMedia('(min-width: 1201px)').matches) { li.classList.remove('open'); t.setAttribute('aria-expanded', 'false'); } });
  });
  d.addEventListener('click', function (e) { if (!e.target.closest || !e.target.closest('.mi')) closeAll(); });
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openLi = d.querySelector('.mi.open');
      closeAll();
      if (openLi) openLi.querySelector('.mt').focus();
    }
  });

  // Career directory: the page lists every career by field. Filtering or sorting loads /assets/careers.json
  // once and shows matching cards instead of the list.
  var f = d.querySelector('[data-filter]');
  if (f) {
    var out = d.querySelector('[data-count]'), grid = d.querySelector('[data-cards]'), dir = d.querySelector('[data-dir]');
    var all = null, loading = false, total = out ? out.textContent : '', base = (window.MP && window.MP.base) || '';
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var card = function (c) { return '<article class="card link"><span class="ico"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><use href="#i-' + c.c + '"/></svg></span><h3><a class="stretch" href="' + base + c.u + '">' + esc(c.n) + '</a></h3><p>' + esc(c.b) + '</p><ul class="chips"><li class="chip pay">$' + Math.round(c.m).toLocaleString('en-US') + '/yr</li><li class="chip grow">' + (c.g > 0 ? '+' : '') + c.g.toFixed(1) + '% growth</li><li class="chip">' + esc(c.t) + '</li></ul></article>'; };
    var run = function () {
      var q = (f.q.value || '').toLowerCase().trim(), cat = f.cat.value, edu = f.edu.value, sort = f.sort.value;
      if (!q && !cat && !edu && !sort) { grid.hidden = true; grid.innerHTML = ''; dir.hidden = false; if (out) out.textContent = total; return; }
      if (!all) {
        if (!loading) { loading = true; if (out) out.textContent = 'Loading…'; fetch(base + '/assets/careers.json').then(function (r) { return r.json(); }).then(function (j) { all = j; run(); }); }
        return;
      }
      var res = all.filter(function (c) { return (!q || c.k.indexOf(q) > -1) && (!cat || c.c === cat) && (!edu || c.e <= +edu); });
      if (sort) res.sort(function (a, b) { return sort === 'name' ? a.n.localeCompare(b.n) : sort === 'train' ? a.mo - b.mo : sort === 'median' ? b.m - a.m : b.g - a.g; });
      grid.innerHTML = res.map(card).join(''); grid.hidden = false; dir.hidden = true;
      if (out) out.textContent = res.length + ' career' + (res.length === 1 ? '' : 's');
    };
    f.addEventListener('input', run); f.addEventListener('change', run);
    f.addEventListener('submit', function (e) { e.preventDefault(); run(); });
  }

  // Sortable tables
  [].forEach.call(d.querySelectorAll('table[data-sortable]'), function (t) {
    [].forEach.call(t.querySelectorAll('th[data-sort]'), function (th, i) {
      var b = d.createElement('button'); b.type = 'button'; b.textContent = th.textContent; th.textContent = ''; th.appendChild(b);
      var dir = 1;
      b.addEventListener('click', function () {
        var rows = [].slice.call(t.tBodies[0].rows), col = th.cellIndex, num = th.dataset.sort === 'num';
        rows.sort(function (a, z) {
          var x = a.cells[col].dataset.v || a.cells[col].textContent, y = z.cells[col].dataset.v || z.cells[col].textContent;
          return (num ? (parseFloat(x) - parseFloat(y)) : x.localeCompare(y)) * dir;
        });
        dir = -dir; rows.forEach(function (r) { t.tBodies[0].appendChild(r); });
      });
    });
  });

  // Cart: saved only in this browser (localStorage), never sent anywhere until checkout or an enrollment request.
  // Items: { k: 'course' (bought online) or 'training' (enrollment by request), s: slug, t: title, p: price, u: url, n: learners }
  var CART_KEY = 'cei-cart';
  // On the blog's own site (another address once custom domains are connected) the cart lives on the main site, so
  // the header link still works there but the count is only shown on the main site.
  var cartHere = !MP.main || location.origin === new URL(MP.main, location.href).origin;
  MP.cart = {
    get: function () { try { var c = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); return Array.isArray(c) ? c.filter(function (i) { return i && i.s && i.k; }) : []; } catch (e) { return []; } },
    set: function (list) { try { localStorage.setItem(CART_KEY, JSON.stringify(list)); } catch (e) {} MP.cart.badge(); d.dispatchEvent(new CustomEvent('cart:change')); },
    add: function (item) {
      var list = MP.cart.get(), found = null;
      list.forEach(function (i) { if (i.k === item.k && i.s === item.s) found = i; });
      if (found) found.n = Math.min(1000, (found.n || 1) + (item.n || 1)); else list.push({ k: item.k, s: item.s, t: item.t, p: item.p, u: item.u, n: item.n || 1 });
      MP.cart.set(list);
    },
    badge: function () {
      var n = cartHere ? MP.cart.get().length : 0;
      [].forEach.call(d.querySelectorAll('[data-cart-count]'), function (b) { b.textContent = n; b.hidden = !n; });
      [].forEach.call(d.querySelectorAll('[data-cart-link]'), function (a) { a.setAttribute('aria-label', n ? 'Cart, ' + n + (n === 1 ? ' item' : ' items') : 'Cart'); });
    }
  };
  MP.cart.badge();
  addEventListener('storage', function (e) { if (e.key === CART_KEY) { MP.cart.badge(); d.dispatchEvent(new CustomEvent('cart:change')); } });
  // "Add to cart" buttons carry the item as JSON in data-add-cart
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-add-cart]');
    if (!b) return;
    try { MP.cart.add(JSON.parse(b.getAttribute('data-add-cart'))); } catch (x) { return; }
    b.textContent = 'Added to cart';
    var next = b.nextElementSibling;
    if (!next || !next.hasAttribute('data-view-cart')) {
      var v = d.createElement('a');
      v.href = (MP.base || '') + '/cart/'; v.className = 'view-cart'; v.setAttribute('data-view-cart', ''); v.textContent = 'View cart';
      b.insertAdjacentElement('afterend', v);
    }
  });

  // FAQ blocks marked data-faq-hover: an answer opens while the pointer is over its question and closes when the
  // pointer leaves; a click anywhere on the question or answer keeps it open, and another click closes it. On touch
  // screens and with the keyboard, a click or Enter simply opens and closes it.
  var canHover = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  [].forEach.call(d.querySelectorAll('[data-faq-hover] details'), function (dt) {
    dt.addEventListener('mouseenter', function () { if (canHover && !dt.open) { dt.open = true; dt.setAttribute('data-peek', ''); } });
    dt.addEventListener('mouseleave', function () { if (dt.hasAttribute('data-peek')) { dt.open = false; dt.removeAttribute('data-peek'); } });
    dt.addEventListener('click', function (e) {
      if (e.target.closest('a')) return; // links in an answer work as usual
      e.preventDefault();
      if (dt.hasAttribute('data-peek')) dt.removeAttribute('data-peek'); // open from hovering: now stays open
      else dt.open = !dt.open;
    });
  });
  // FAQ "View more": extra questions stay hidden until asked for, then the full FAQ page is offered
  [].forEach.call(d.querySelectorAll('[data-faq-more]'), function (b) {
    var sec = b.closest('.faq'), extra = sec.querySelectorAll('[data-faq-extra]'), all = sec.querySelector('[data-faq-all]');
    [].forEach.call(extra, function (x) { x.hidden = true; });
    b.parentNode.hidden = false;
    b.addEventListener('click', function () {
      [].forEach.call(extra, function (x) { x.hidden = false; });
      b.hidden = true;
      if (all) { all.hidden = false; } else b.parentNode.hidden = true;
      if (extra[0]) extra[0].querySelector('summary').focus();
    });
  });

  // Privacy choices (opt-out of optional analytics; Global Privacy Control is always honored)
  var opt = d.querySelector('[data-optout]');
  var getOpt = function () { try { return localStorage.getItem('cei-optout') === '1'; } catch (e) { return false; } };
  if (opt) {
    var st = d.querySelector('[data-optout-status]');
    var show = function () { if (st) st.textContent = (getOpt() || navigator.globalPrivacyControl) ? 'You are opted out of Google Analytics on this browser.' : 'Google Analytics is allowed on this browser.'; };
    opt.addEventListener('click', function () { try { localStorage.setItem('cei-optout', getOpt() ? '0' : '1'); } catch (e) {} show(); });
    show();
  }

  // Optional analytics: only loads if configured, never with GPC or opt-out
  var ga = window.MP && window.MP.ga;
  if (ga && !navigator.globalPrivacyControl && !getOpt()) {
    var load = function () {
      var s = d.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ga; d.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', ga, { allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 34128000 }); // 395 days, the 13 months in the cookie policy
    };
    if ('requestIdleCallback' in window) addEventListener('load', function () { requestIdleCallback(load); }); else addEventListener('load', load);
  }

  // Copy-to-clipboard buttons (job description templates)
  [].forEach.call(d.querySelectorAll('[data-copy-target]'), function (b) {
    b.addEventListener('click', function () {
      var el = d.querySelector(b.getAttribute('data-copy-target')); if (!el) return;
      var text = el.innerText;
      var done = function () { var t = b.textContent; b.textContent = 'Copied!'; setTimeout(function () { b.textContent = t; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done); else { var r = d.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); d.execCommand('copy'); done(); }
    });
  });

  // Print buttons
  [].forEach.call(d.querySelectorAll('[data-print]'), function (b) { b.addEventListener('click', function () { window.print(); }); });
})();
