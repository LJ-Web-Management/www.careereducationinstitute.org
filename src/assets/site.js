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

  // Career directory filters
  var f = d.querySelector('[data-filter]');
  if (f) {
    var cards = [].slice.call(d.querySelectorAll('[data-card]'));
    var out = d.querySelector('[data-count]');
    var grid = d.querySelector('[data-cards]');
    var run = function () {
      var q = (f.q.value || '').toLowerCase().trim(), cat = f.cat.value, edu = f.edu.value, sort = f.sort.value, n = 0;
      cards.forEach(function (c) {
        var ok = (!q || c.dataset.name.indexOf(q) > -1) && (!cat || c.dataset.cat === cat) && (!edu || +c.dataset.edu <= +edu);
        c.classList.toggle('hide', !ok); if (ok) n++;
      });
      if (sort && grid) {
        cards.slice().sort(function (a, b) {
          if (sort === 'name') return a.dataset.name.localeCompare(b.dataset.name);
          if (sort === 'train') return a.dataset.months - b.dataset.months;
          return b.dataset[sort] - a.dataset[sort];
        }).forEach(function (c) { grid.appendChild(c); });
      }
      if (out) out.textContent = n + ' career' + (n === 1 ? '' : 's');
    };
    f.addEventListener('input', run); f.addEventListener('change', run);
    f.addEventListener('submit', function (e) { e.preventDefault(); run(); });
    run();
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

  // Privacy choices (opt-out of optional analytics; Global Privacy Control is always honored)
  var opt = d.querySelector('[data-optout]');
  var getOpt = function () { try { return localStorage.getItem('cei-optout') === '1'; } catch (e) { return false; } };
  if (opt) {
    var st = d.querySelector('[data-optout-status]');
    var show = function () { if (st) st.textContent = (getOpt() || navigator.globalPrivacyControl) ? 'You are opted out of optional analytics on this browser.' : 'Optional analytics are allowed on this browser (if enabled on this site).'; };
    opt.addEventListener('click', function () { try { localStorage.setItem('cei-optout', getOpt() ? '0' : '1'); } catch (e) {} show(); });
    show();
  }

  // Optional analytics: only loads if configured, never with GPC or opt-out
  var ga = window.MP && window.MP.ga;
  if (ga && !navigator.globalPrivacyControl && !getOpt()) {
    var load = function () {
      var s = d.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ga; d.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', ga, { anonymize_ip: true, allow_google_signals: false, allow_ad_personalization_signals: false });
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
