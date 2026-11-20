// Career Radar: one mystery career per day. The date formula below picks it; the build writes the files it loads
// (src/lib/career-radar.mjs). Guesses, streak and stats stay in this browser (localStorage).
(function () {
  var root = document.querySelector('[data-radar]');
  var cfgEl = document.getElementById('radar-data');
  if (!root || !cfgEl) return;
  var cfg = JSON.parse(cfgEl.textContent);
  var $ = function (s) { return root.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var input = $('#radar-guess'), list = $('#radar-list'), form = $('[data-form]'), submit = form.querySelector('button[type=submit]');
  var msg = $('[data-msg]'), latestEl = $('[data-latest]'), guessesEl = $('[data-guesses]'), endEl = $('[data-end]'), countEl = $('[data-count]');
  var hintBtn = $('[data-hint]'), giveBtn = $('[data-giveup]');

  // ---------- The date formula ----------
  // day = days since launch in the visitor's local calendar (launch day is #1);
  // answer = answers[(day × step + offset) mod answers]. step is prime and doesn't divide the pool size, so every answer
  // comes up once before any repeats.
  var L = cfg.launch.split('-').map(Number);
  var dayNumber = function (d) { return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(L[0], L[1] - 1, L[2])) / 864e5); };
  var day = Math.max(0, dayNumber(new Date()));
  var slot = (day * cfg.step + cfg.offset) % cfg.pool;
  var num = day + 1;
  $('[data-day]').textContent = 'Career Radar #' + num;

  // ---------- Saved progress ----------
  var KEY = 'cei-career-radar';
  var load = function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  var saved = load();
  saved.days = saved.days || {};
  // g: guesses as [career index, 1 if it came from a hint]; d: 0 playing, 1 solved, 2 gave up
  var today = saved.days[num] || { g: [], d: 0 };
  var save = function () {
    saved.days[num] = today;
    var keys = Object.keys(saved.days).map(Number).sort(function (a, b) { return b - a; });
    keys.slice(400).forEach(function (k) { delete saved.days[k]; });
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* private mode: play still works, just isn't saved */ }
  };

  // ---------- Data ----------
  var careers, order, reasons, offerK, rank = [], N, names = [];
  var url = function (ci) { return cfg.careers + careers[ci][1] + '/'; };
  var norm = function (s) { return String(s).toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); };
  Promise.all([cfg.files + 'careers.json', cfg.files + slot + '.json'].map(function (u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); }))
    .then(function (d) {
      careers = d[0]; order = d[1].o; reasons = d[1].m; offerK = d[1].k; N = careers.length;
      order.forEach(function (ci, r) { rank[ci] = r + 1; });
      careers.forEach(function (c, i) {
        names.push({ n: c[0], k: norm(c[0]), i: i, alias: false });
        c[2].forEach(function (a) { names.push({ n: a, k: norm(a), i: i, alias: true }); });
      });
      input.disabled = submit.disabled = false;
      input.placeholder = 'Type a job title…';
      render();
      if (!today.d && !today.g.length && !saved.seenHelp) { saved.seenHelp = 1; save(); openDialog('[data-help]'); }
    })
    .catch(function () { say('Today’s career didn’t load. Check your connection and reload the page.', 'bad'); input.placeholder = 'Couldn’t load the game'; });

  // ---------- Ranks, colors and reasons ----------
  var secret = function () { return order[0]; };
  var heat = function (r) { return r <= 25 ? 'hot' : r <= 150 ? 'warm' : 'cold'; };
  var width = function (r) { return Math.max(4, Math.round(100 * (1 - Math.log(r) / Math.log(N)))); };
  var WHY = [[1, 'Same career field'], [16, 'Similar duties, skills and tools'], [8, 'Listed as a related career'], [4, 'Closely related BLS job group'], [2, 'Same broad BLS job group'], [64, 'Same main interest type (Holland code)'], [128, 'Similar work style'], [32, 'Same level of training']];
  var why = function (ci) {
    var m = reasons[ci], out = WHY.filter(function (w) { return m & w[0]; }).map(function (w) { return w[1]; });
    return out.length ? out : ['Not much in common with the mystery career'];
  };
  var guessed = function (ci) { return today.g.some(function (g) { return g[0] === ci; }); };
  var best = function () { return today.g.reduce(function (b, g) { return g[0] === secret() ? b : Math.min(b, rank[g[0]]); }, Infinity); };

  var row = function (g, latest) {
    var ci = g[0], r = rank[ci], c = careers[ci], id = 'rw' + ci + (latest ? 'l' : '');
    return '<li class="rg ' + heat(r) + (latest ? ' latest' : '') + '" style="--w:' + width(r) + '%"><button class="rg-row" type="button" aria-expanded="false" aria-controls="' + id + '"><span class="rg-name">' + esc(c[0]) + (g[1] ? ' <span class="rg-tag">hint</span>' : '') + '</span><span class="rg-rank">#' + r + '</span></button>' +
      '<div class="rg-why" id="' + id + '" hidden><p>' + (ci === secret() ? 'This is the mystery career.' : 'What it shares with the mystery career:') + '</p>' + (ci === secret() ? '' : '<ul>' + why(ci).map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>') + '<a href="' + url(ci) + '">' + esc(c[0]) + ' career profile</a></div></li>';
  };

  var lastGuess = null;
  function render() {
    var n = today.g.length, hints = today.g.filter(function (g) { return g[1]; }).length;
    countEl.textContent = n ? n + (n === 1 ? ' guess' : ' guesses') + (hints ? ' · ' + hints + (hints === 1 ? ' hint' : ' hints') : '') : '';
    var sorted = today.g.slice().sort(function (a, b) { return rank[a[0]] - rank[b[0]]; });
    guessesEl.innerHTML = sorted.map(function (g) { return row(g, false); }).join('');
    if (lastGuess && !today.d) { latestEl.innerHTML = '<ol class="radar-guesses">' + row(lastGuess, true) + '</ol>'; latestEl.hidden = false; }
    else latestEl.hidden = true;
    var done = !!today.d;
    form.hidden = done;
    hintBtn.disabled = giveBtn.disabled = done || !careers;
    hintBtn.hidden = giveBtn.hidden = done;
    if (done) showEnd();
  }

  guessesEl.addEventListener('click', toggleWhy);
  latestEl.addEventListener('click', toggleWhy);
  function toggleWhy(e) {
    var b = e.target.closest('.rg-row');
    if (!b) return;
    var panel = document.getElementById(b.getAttribute('aria-controls'));
    var open = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!open));
    panel.hidden = open;
  }

  var say = function (t, kind) { msg.textContent = t; msg.className = 'radar-msg' + (kind ? ' ' + kind : ''); };

  // ---------- Guessing ----------
  function guess(ci, fromHint) {
    if (today.d) return;
    if (guessed(ci)) { say(careers[ci][0] + ' is already on your list at #' + rank[ci] + '.'); return; }
    var g = [ci, fromHint ? 1 : 0];
    today.g.push(g);
    lastGuess = g;
    if (ci === secret()) { today.d = 1; say(''); }
    else say(fromHint ? 'Hint: ' + careers[ci][0] + ' is #' + rank[ci] + '.' : '');
    save();
    render();
    if (today.d) endEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  // Suggestions, one row per career: an exact title first; then titles with a word starting with the typed text, and
  // exact "also called" names; then "also called" names with such a word; then a match anywhere. Within each group,
  // more common jobs come first, then shorter names.
  var active = -1, shown = [];
  function suggest() {
    var q = norm(input.value);
    if (!q || !careers) { closeList(); return; }
    var seen = {}, hits = [];
    names.forEach(function (x) {
      var p = x.k.indexOf(q);
      if (p < 0) return;
      var word = p === 0 || x.k.indexOf(' ' + q) >= 0;
      hits.push({ x: x, t: x.k === q ? (x.alias ? 1 : 0) : !word ? 3 : x.alias ? 2 : 1 });
    });
    hits.sort(function (a, b) { return a.t - b.t || careers[b.x.i][3] - careers[a.x.i][3] || a.x.k.length - b.x.k.length; });
    shown = hits.map(function (h) { return h.x; }).filter(function (x) { if (seen[x.i]) return false; seen[x.i] = 1; return true; }).slice(0, 8);
    if (!shown.length) { list.innerHTML = '<li class="radar-none" role="option" aria-disabled="true">No matching job title. Try another word.</li>'; list.hidden = false; input.setAttribute('aria-expanded', 'true'); active = -1; return; }
    active = 0;
    list.innerHTML = shown.map(function (x, k) {
      var title = careers[x.i][0];
      return '<li id="ro' + k + '" role="option" aria-selected="' + (k === 0) + '" data-k="' + k + '"><span>' + esc(x.alias ? x.n : title) + '</span>' + (x.alias ? '<small>' + esc(title) + '</small>' : '') + (guessed(x.i) ? '<small class="was">#' + rank[x.i] + '</small>' : '') + '</li>';
    }).join('');
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-activedescendant', 'ro0');
  }
  function closeList() { list.hidden = true; list.innerHTML = ''; shown = []; active = -1; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); }
  function move(d) {
    if (!shown.length) return;
    active = (active + d + shown.length) % shown.length;
    [].forEach.call(list.children, function (li, k) { li.setAttribute('aria-selected', String(k === active)); });
    input.setAttribute('aria-activedescendant', 'ro' + active);
    list.children[active].scrollIntoView({ block: 'nearest' });
  }
  function pick(k) {
    var x = shown[k];
    if (!x) return;
    input.value = '';
    closeList();
    guess(x.i, false);
    input.focus();
  }
  input.addEventListener('input', suggest);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Escape') closeList();
  });
  input.addEventListener('blur', function () { setTimeout(closeList, 150); });
  list.addEventListener('mousedown', function (e) { e.preventDefault(); });
  list.addEventListener('click', function (e) { var li = e.target.closest('[data-k]'); if (li) pick(Number(li.getAttribute('data-k'))); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!careers) return;
    if (!shown.length) suggest();
    if (shown.length && active >= 0) pick(active);
    else if (input.value.trim()) say('Pick a job title from the list.');
  });

  // A hint adds a career about halfway between your best guess and the answer (never the answer itself).
  hintBtn.addEventListener('click', function () {
    var b = best(), target = b === Infinity ? Math.min(300, N) : Math.max(2, Math.floor(b / 2)), lim = b === Infinity ? N : b - 1;
    for (var r = target; r <= lim; r++) if (!guessed(order[r - 1])) return guess(order[r - 1], true);
    for (r = target - 1; r >= 2; r--) if (!guessed(order[r - 1])) return guess(order[r - 1], true);
    say('Your best guess is already #2. Only the mystery career is closer!');
  });

  giveBtn.addEventListener('click', function () {
    if (!window.confirm('Give up and see today’s mystery career? This ends your streak.')) return;
    today.d = 2;
    save();
    say('');
    render();
    endEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  // ---------- End of the game ----------
  var money = function (n) { return '$' + Number(n).toFixed(2); };
  // k = [name, course url, price, buy url, instant, cart slug] (offerData in src/lib/offer.mjs)
  var cartAttr = function (k) { return esc(JSON.stringify({ k: k[4] ? 'course' : 'training', s: k[5], t: k[0], p: k[2], u: k[1] })); };
  var offer = function (k) {
    return '<div class="offer"><div class="offer-txt"><p class="offer-k">Try this career</p><p class="offer-h"><a href="' + k[1] + '">' + esc(k[0]) + '</a>: <strong>' + money(k[2]) + '</strong>, start today</p><p class="offer-meta">Online, self-paced · certificate of completion' + (k[4] ? ' · Instant access' : '') + '</p></div><div class="offer-btns"><a class="btn btn-primary" href="' + k[3] + '">Buy now</a><button class="btn" type="button" data-add-cart="' + cartAttr(k) + '">Add to cart</button></div></div>';
  };
  var timer;
  function showEnd() {
    var c = careers[secret()], u = url(secret()), n = today.g.length, hints = today.g.filter(function (g) { return g[1]; }).length;
    var head = today.d === 1
      ? '<h2>You found it in ' + n + (n === 1 ? ' guess' : ' guesses') + '!</h2><p>Today’s mystery career is <a href="' + u + '"><strong>' + esc(c[0]) + '</strong></a>' + (hints ? ' (with ' + hints + (hints === 1 ? ' hint' : ' hints') + ')' : '') + '.</p>'
      : '<h2>Today’s mystery career was ' + esc(c[0]) + '</h2><p>Better luck tomorrow. In the meantime, read the full <a href="' + u + '">' + esc(c[0]) + ' career profile</a>.</p>';
    var top = order.slice(1, 11).map(function (ci) { return '<li><a href="' + url(ci) + '">' + esc(careers[ci][0]) + '</a></li>'; }).join('');
    endEl.innerHTML = '<div class="result-card radar-result"><p class="eyebrow">Career Radar #' + num + '</p>' + head + offer(offerK) +
      '<div class="btn-row"><button class="btn btn-primary" type="button" data-share>Share result</button><a class="btn" href="' + u + '">Explore this career</a><a class="btn" href="' + u + 'salary/">See salary</a></div>' +
      '<p class="radar-next">Next mystery career in <b data-countdown></b></p>' +
      '<h3>The 10 closest careers to ' + esc(c[0]) + '</h3><ol class="radar-top10" start="2">' + top + '</ol></div>';
    endEl.hidden = false;
    endEl.querySelector('[data-share]').addEventListener('click', share);
    tick();
    clearInterval(timer);
    timer = setInterval(tick, 1000);
  }
  function tick() {
    var el = endEl.querySelector('[data-countdown]');
    if (!el) return;
    var now = new Date(), next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), s = Math.max(0, Math.round((next - now) / 1000));
    if (!s || Math.max(0, dayNumber(now)) + 1 !== num) { clearInterval(timer); el.parentNode.innerHTML = 'A new mystery career is ready. <a href="">Play now</a>'; return; }
    var p = function (x) { return (x < 10 ? '0' : '') + x; };
    el.textContent = p(Math.floor(s / 3600)) + ':' + p(Math.floor(s / 60) % 60) + ':' + p(s % 60);
  }

  function shareText() {
    var n = today.g.length, hints = today.g.filter(function (g) { return g[1]; }).length, h = { hot: 0, warm: 0, cold: 0 };
    today.g.forEach(function (g) { if (g[0] !== secret()) h[heat(rank[g[0]])]++; });
    var line = today.d === 1 ? '🎯 Solved in ' + n + (n === 1 ? ' guess' : ' guesses') + (hints ? ' (' + hints + (hints === 1 ? ' hint)' : ' hints)') : '') : '🏳️ Gave up after ' + n + (n === 1 ? ' guess' : ' guesses');
    return 'Career Radar #' + num + '\n' + line + '\n🟩 ' + h.hot + '  🟨 ' + h.warm + '  🟥 ' + h.cold + '\n' + location.origin + location.pathname;
  }
  function share() {
    var text = shareText(), btn = endEl.querySelector('[data-share]');
    var done = function () { btn.textContent = 'Copied! Paste it anywhere'; setTimeout(function () { btn.textContent = 'Share result'; }, 2500); };
    if (navigator.share && window.matchMedia('(pointer:coarse)').matches) { navigator.share({ text: text }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
    function fallback() {
      var t = document.createElement('textarea');
      t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) { window.prompt('Copy your result:', text); }
      document.body.removeChild(t);
    }
  }

  // ---------- Stats ----------
  function stats() {
    var days = Object.keys(saved.days).map(Number).sort(function (a, b) { return a - b; });
    var fin = days.filter(function (d) { return saved.days[d].d; }), won = fin.filter(function (d) { return saved.days[d].d === 1; });
    var bestStreak = 0, run = 0, prev = null;
    won.forEach(function (d) { run = prev !== null && d === prev + 1 ? run + 1 : 1; prev = d; bestStreak = Math.max(bestStreak, run); });
    // Current streak: solved days in a row up to today (or up to yesterday while today is still in play)
    var cur = 0, d = today.d ? num : num - 1;
    while (saved.days[d] && saved.days[d].d === 1) { cur++; d--; }
    var avg = won.length ? Math.round(won.reduce(function (s, x) { return s + saved.days[x].g.length; }, 0) / won.length) : 0;
    return [['Played', fin.length], ['Solved', fin.length ? Math.round(100 * won.length / fin.length) + '%' : '0%'], ['Current streak', cur], ['Best streak', bestStreak], ['Average guesses', avg || '-']];
  }
  function openDialog(sel) {
    var dlg = root.querySelector(sel);
    if (sel === '[data-stats]') dlg.querySelector('[data-stats-body]').innerHTML = '<dl class="radar-stats">' + stats().map(function (s) { return '<div><dt>' + s[0] + '</dt><dd>' + s[1] + '</dd></div>'; }).join('') + '</dl>';
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  $('[data-show-stats]').addEventListener('click', function () { openDialog('[data-stats]'); });
  $('[data-show-help]').addEventListener('click', function () { openDialog('[data-help]'); });
  [].forEach.call(root.querySelectorAll('dialog'), function (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  });
})();
