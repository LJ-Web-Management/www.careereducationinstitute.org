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
    var card = function (c) { return '<article class="card link fcard"><span class="ico"><svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><use href="#i-' + c.c + '"/></svg></span><h3><a class="stretch" href="' + base + c.u + '">' + esc(c.n) + '</a></h3><p>' + esc(c.b) + '</p><div class="fcard-foot"><span class="fcard-big">$' + Math.round(c.m).toLocaleString('en-US') + ' <small>median pay</small></span><span>' + (c.g > 0 ? '+' : '') + c.g.toFixed(1) + '% growth · Training: ' + esc(c.t) + '</span></div></article>'; };
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

  // Training catalog search: filters the rows already on the page by name, other job titles and field.
  var cs = d.querySelector('[data-catalog-search]'), cat = d.querySelector('[data-catalog]');
  if (cs && cat) {
    var groups = [].slice.call(cat.querySelectorAll('.tl-group')), cnt = d.querySelector('[data-catalog-count]'), empty = cat.querySelector('[data-catalog-empty]'), jump = cat.querySelector('.tl-jump');
    var filter = function () {
      var words = (cs.q.value || '').toLowerCase().trim().split(/\s+/).filter(Boolean), field = cs.cat.value, shown = 0;
      groups.forEach(function (g) {
        var n = 0;
        if (field && g.getAttribute('data-cat') !== field) { g.hidden = true; return; }
        [].forEach.call(g.querySelectorAll('.tl-list>li'), function (r) {
          var k = r.querySelector('a').textContent.toLowerCase() + ' ' + (r.getAttribute('data-k') || ''), ok = words.every(function (w) { return k.indexOf(w) > -1; });
          r.hidden = !ok; if (ok) n++;
        });
        g.hidden = !n; shown += n;
        var gc = g.querySelector('[data-group-count]'); if (gc) gc.textContent = n + (n === 1 ? ' training' : ' trainings');
      });
      if (cnt) cnt.textContent = shown + (shown === 1 ? ' training' : ' trainings') + (words.length || field ? ' match' + (shown === 1 ? 'es' : '') : '');
      if (empty) empty.hidden = shown > 0;
      if (jump) jump.hidden = !!(words.length || field);
    };
    cs.addEventListener('input', filter); cs.addEventListener('change', filter);
    cs.addEventListener('submit', function (e) { e.preventDefault(); filter(); var first = cat.querySelector('.tl-list>li:not([hidden]) a'); if (first) first.focus(); });
    var q0 = new URLSearchParams(location.search).get('q'); if (q0) { cs.q.value = q0; filter(); }
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
  // "Add to cart" buttons carry the item as JSON in data-add-cart; training catalog rows carry it in data-c and the row
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-add-cart], .tl-list button');
    if (!b) return;
    var row = b.closest('.tl-list>li');
    try {
      if (row) {
        var a = row.querySelector('a'), u = a.getAttribute('href'), buy = row.getAttribute('data-buy');
        MP.cart.add({ k: buy ? 'course' : 'training', s: buy || u.replace(/\/$/, '').split('/').pop(), t: a.textContent, p: parseFloat(row.querySelector('strong').textContent.replace(/[^\d.]/g, '')), u: u });
      } else MP.cart.add(JSON.parse(b.getAttribute('data-add-cart')));
    } catch (x) { return; }
    try { var it = MP.cart.get().slice(-1)[0]; if (it) MP.track('add_to_cart', withAttr({ currency: 'USD', value: it.p, items: [{ item_id: it.s, item_name: it.t, price: it.p }] }, it.s)); } catch (x) {}
    b.textContent = row ? 'Added' : 'Added to cart';
    var next = b.nextElementSibling;
    if (row) return; // catalog rows: the header cart count is enough
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
    var show = function () { if (st) st.textContent = (getOpt() || navigator.globalPrivacyControl) ? 'You are opted out of Google Analytics and Microsoft Clarity on this browser.' : 'Google Analytics and Microsoft Clarity are allowed on this browser.'; };
    opt.addEventListener('click', function () { try { localStorage.setItem('cei-optout', getOpt() ? '0' : '1'); } catch (e) {} show(); });
    show();
  }

  // Optional analytics: only loads if configured, never with GPC or opt-out
  var ga = window.MP && window.MP.ga, clarity = window.MP && window.MP.clarity, gtm = window.MP && window.MP.gtm;
  var allowed = (ga || clarity || gtm) && !navigator.globalPrivacyControl && !getOpt();
  if (allowed && (ga || gtm)) {
    // The queue starts now so events sent before the tags finish loading are kept
    window.dataLayer = window.dataLayer || [];
    if (ga) { window.gtag = function () { dataLayer.push(arguments); }; gtag('js', new Date()); gtag('config', ga, { allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 34128000 }); } // 395 days, the 13 months in the cookie policy
    if (gtm) dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  }
  if (allowed) {
    var load = function () {
      if (ga) { var s = d.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ga; d.head.appendChild(s); }
      if (gtm) { var g = d.createElement('script'); g.async = true; g.src = 'https://www.googletagmanager.com/gtm.js?id=' + gtm; d.head.appendChild(g); }
      if (clarity) {
        window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
        var c = d.createElement('script'); c.async = true; c.src = 'https://www.clarity.ms/tag/' + clarity; d.head.appendChild(c);
      }
    };
    if ('requestIdleCallback' in window) addEventListener('load', function () { requestIdleCallback(load); }); else addEventListener('load', load);
  }

  // MP.track(event, params): a GA4 event (and a Google Tag Manager dataLayer event when a container is set). Does nothing
  // for visitors with Global Privacy Control or the opt-out. Never pass names, emails or other personal details.
  MP.track = function (name, params) {
    if (!allowed) return;
    params = params || {};
    try { if (ga && window.gtag) gtag('event', name, params); if (gtm) dataLayer.push(Object.assign({ event: name }, params)); } catch (e) {}
  };
  // College & Career Finder attribution: kept 30 days after someone finishes the finder, so course visits, enrollment
  // requests and purchases can be credited to the academic interests that led to them.
  MP.finderAttr = function () {
    try {
      var a = JSON.parse(localStorage.getItem('cei-finder-attr') || 'null');
      if (!a || Date.now() - a.t > 30 * 864e5) return null;
      var c = function (x) { x = (x || []).join(', '); return x.length > 100 ? x.slice(0, 97) + '…' : x; };
      return { finder_assisted: 'yes', finder_major: c(a.majors) || 'none', finder_minor: c(a.minors) || 'none', finder_interest: c(a.interests) || 'none', finder_stage: a.stage || 'not_given', recommended: a.courses || [] };
    } catch (e) { return null; }
  };
  var withAttr = function (p, slug) {
    var a = MP.finderAttr();
    if (a) { p = Object.assign(p, a); if (slug) p.finder_recommended = a.recommended.indexOf(slug) > -1 ? 'yes' : 'no'; delete p.recommended; }
    return p;
  };
  MP.withFinder = withAttr;
  // Course links and buttons marked data-track-course (finder results, major, minor and skill pages)
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-track-action]');
    if (!a) return;
    var act = a.getAttribute('data-track-action'), list = a.getAttribute('data-track-list') || 'unknown', slug = a.getAttribute('data-track-course') || '';
    var box = a.closest('.course-card, .ts-item'), first = box && box.querySelector('a[data-track-course]');
    var name = (first || a).textContent.trim();
    if (act === 'browse') MP.track('browse_all_training', withAttr({ item_list_id: list }));
    else if (act === 'enroll') MP.track('course_enroll_click', withAttr({ item_list_id: list, course_id: slug, course_name: name }, slug));
    else MP.track('select_item', withAttr({ item_list_id: list, item_list_name: list, items: [{ item_id: slug, item_name: name, item_list_id: list }] }, slug));
  });
  // A training page visited after using the finder
  var tm = location.pathname.slice((MP.base || '').length).match(/^\/training\/([a-z0-9-]+)\/$/);
  if (tm && MP.finderAttr()) MP.track('finder_course_page_view', withAttr({ course_id: tm[1] }, tm[1]));

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
