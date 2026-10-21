(function () {
  var form = document.querySelector('form[data-search]');
  if (!form) return;
  var input = form.querySelector('input'), out = document.querySelector('[data-results]'), status = document.querySelector('[data-status]');
  var tools = document.querySelector('[data-tools]'), typesEl = document.querySelector('[data-types]'), sortEl = document.querySelector('[data-sort]');
  var moreRow = document.querySelector('[data-more-row]'), moreBtn = document.querySelector('[data-more]');
  var base = (window.MP && window.MP.base) || '', idx = null;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var norm = function (s) { return s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' '); };
  var link = function (u) { return /^https?:/.test(u) ? u : base + u; };
  // Filter groups for the page types in the index (anything else is "Other")
  var GROUPS = [
    ['careers', 'Careers', ['Career', 'Career field', 'Directory', 'Comparison']],
    ['salary', 'Salary', ['Salary']],
    ['training', 'Training', ['Training', 'Training catalog', 'Course', 'Course category']],
    ['howto', 'How-to', ['How-to', 'How to become']],
    ['guides', 'Guides', ['Guide', 'Worksheet', 'Hub', 'List', 'Glossary']],
    ['quizzes', 'Quizzes', ['Quiz']],
    ['employers', 'Employers', ['Hiring guide', 'Job description', 'Employers']],
    ['blog', 'Blog', ['Blog']]
  ];
  var groupOf = function (y) { for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i][2].indexOf(y) > -1) return GROUPS[i][0]; return 'other'; };
  var label = function (g) { for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i][0] === g) return GROUPS[i][1]; return 'Other'; };
  var PAGE = 40, shown = PAGE, type = 'all', matches = [];
  var view = 'list';
  try { if (localStorage.getItem('cei-search-view') === 'grid') view = 'grid'; } catch (e) {}

  // Words that appear on most pages only add to the score; the specific words in a query must all match.
  var GENERIC = { training: 1, trainings: 1, train: 1, career: 1, careers: 1, job: 1, jobs: 1, course: 1, courses: 1, online: 1, how: 1, to: 1, the: 1, an: 1, of: 1, for: 1, in: 1, and: 1, what: 1, is: 1, do: 1, does: 1, become: 1, my: 1, with: 1, near: 1, me: 1 };
  // Light stemming so "phlebotomy" finds "phlebotomist" and "welding" finds "welder"
  // ("-er" only comes off longer words, so "center" stays "center" but "plumber" finds "plumbing")
  var stem = function (w) { var m = w.match(/(ies|ists|ist|ing|ers|er|es|s|y)$/), s = m ? w.slice(0, -m[0].length) : w; return s.length >= (m && /^er/.test(m[0]) ? 5 : 4) ? s : w; };
  var score = function (words, q) {
    var terms = words.map(function (w) { return { w: stem(w), req: !GENERIC[w] }; });
    var need = terms.filter(function (x) { return x.req; });
    if (!need.length) need = terms;
    return idx.map(function (p) {
      var t = norm(p.t), d = norm(p.d + ' ' + (p.k || '')), s = 0, hit = 0, inTitle = 0;
      terms.forEach(function (x) { var w = x.w, inT = t.indexOf(w) > -1, inD = d.indexOf(w) > -1; if (inT) { s += 5; inTitle++; } if (inD) s += 1; if (inT || inD) hit++; });
      var ok = need.every(function (x) { return t.indexOf(x.w) > -1 || d.indexOf(x.w) > -1; });
      // Whole phrase in the title, as typed or stemmed ("welding" also matches "Welder")
      var qs = terms.map(function (x) { return x.w; }).join(' ');
      if (t.indexOf(q) > -1 || t.indexOf(qs) > -1) s += 10;
      if (t.indexOf(q) === 0 || t.indexOf(qs) === 0) s += 4;
      if (terms.length > 1 && d.indexOf(q) > -1) s += 8; // the whole phrase in the description or keywords
      s += hit * 3;
      // Pages that match every word, and especially all in the title, come first
      if (hit === words.length) s += 12;
      if (inTitle === words.length) s += 8 + Math.max(0, 6 - t.split(' ').length); // shorter, closer titles first
      if (p.y === 'Career' || p.y === 'Training' || p.y === 'Salary') s += s ? 2 : 0;
      return { p: p, s: s, hit: hit, ok: ok, g: groupOf(p.y) };
    }).filter(function (r) { return r.s > 0 && r.ok; });
  };
  var item = function (r) {
    return view === 'grid'
      ? '<li class="card link"><span class="chip">' + esc(r.p.y) + '</span><h3 style="margin-top:8px"><a class="stretch" href="' + link(r.p.u) + '">' + esc(r.p.t) + '</a></h3><p>' + esc(r.p.d) + '</p></li>'
      : '<li><p class="lv-k">' + esc(r.p.y) + '</p><h3><a href="' + link(r.p.u) + '">' + esc(r.p.t) + '</a></h3><p>' + esc(r.p.d) + '</p></li>';
  };
  var render = function () {
    var list = type === 'all' ? matches : matches.filter(function (r) { return r.g === type; });
    var sort = sortEl.value;
    list = list.slice().sort(sort === 'az' ? function (a, b) { return a.p.t.localeCompare(b.p.t); } : sort === 'za' ? function (a, b) { return b.p.t.localeCompare(a.p.t); } : function (a, b) { return b.s - a.s; });
    out.className = view === 'grid' ? 'grid search-results' : 'list-view search-results';
    out.innerHTML = list.slice(0, shown).map(item).join('');
    moreRow.hidden = list.length <= shown;
    var q = input.value.trim();
    status.textContent = list.length + ' result' + (list.length === 1 ? '' : 's') + ' for “' + q + '”' + (type !== 'all' ? ' in ' + label(type) : '') + (list.length > shown ? ', showing ' + shown : '');
    [].forEach.call(document.querySelectorAll('[data-view]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view)); });
  };
  var chips = function () {
    var counts = {};
    matches.forEach(function (r) { counts[r.g] = (counts[r.g] || 0) + 1; });
    var groups = GROUPS.map(function (g) { return g[0]; }).concat(['other']).filter(function (g) { return counts[g]; });
    if (type !== 'all' && !counts[type]) type = 'all';
    typesEl.innerHTML = '<button type="button" data-type="all" aria-pressed="' + (type === 'all') + '">All <span>' + matches.length + '</span></button>' +
      groups.map(function (g) { return '<button type="button" data-type="' + g + '" aria-pressed="' + (type === g) + '">' + label(g) + ' <span>' + counts[g] + '</span></button>'; }).join('');
  };
  var run = function () {
    var q = norm(input.value).trim();
    shown = PAGE;
    if (!q) { matches = []; out.innerHTML = ''; tools.hidden = true; moreRow.hidden = true; status.textContent = 'Type a career, skill or question.'; return; }
    var words = q.split(/\s+/).filter(function (w) { return w.length > 1; });
    if (!words.length) words = [q];
    matches = score(words, q);
    tools.hidden = !matches.length;
    chips();
    render();
  };
  var sync = function () {
    var u = new URL(location.href);
    u.searchParams.set('q', input.value);
    if (type !== 'all') u.searchParams.set('type', type); else u.searchParams.delete('type');
    if (sortEl.value !== 'rel') u.searchParams.set('sort', sortEl.value); else u.searchParams.delete('sort');
    history.replaceState(null, '', u.pathname + u.search);
  };
  var load = function (cb) {
    if (idx) return cb();
    status.textContent = 'Loading…';
    // The blog is a separate site (MP.blog) with its own index; results still show if it can't be loaded.
    var blog = fetch(((window.MP && window.MP.blog) || base + '/blog') + '/search-index.json').then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; });
    Promise.all([fetch(base + '/search-index.json').then(function (r) { return r.json(); }), blog]).then(function (j) { idx = j[0].concat(j[1]); cb(); });
  };

  typesEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-type]'); if (!b) return;
    type = b.getAttribute('data-type'); shown = PAGE;
    chips(); render(); sync();
  });
  sortEl.addEventListener('change', function () { shown = PAGE; render(); sync(); });
  document.querySelector('.st-view').addEventListener('click', function (e) {
    var b = e.target.closest('[data-view]'); if (!b) return;
    view = b.getAttribute('data-view');
    try { localStorage.setItem('cei-search-view', view); } catch (x) {}
    render();
  });
  moreBtn.addEventListener('click', function () { shown += PAGE; render(); });

  var params = new URLSearchParams(location.search);
  var q0 = params.get('q');
  if (params.get('type')) type = params.get('type');
  if (['az', 'za'].indexOf(params.get('sort')) > -1) sortEl.value = params.get('sort');
  if (q0) { input.value = q0; load(run); }
  form.addEventListener('submit', function (e) { e.preventDefault(); sync(); load(run); });
  var t; input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { type = 'all'; load(function () { run(); sync(); }); }, 160); });
})();
