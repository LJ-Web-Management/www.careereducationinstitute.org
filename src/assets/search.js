(function () {
  var form = document.querySelector('form[data-search]');
  if (!form) return;
  var input = form.querySelector('input'), out = document.querySelector('[data-results]'), status = document.querySelector('[data-status]');
  var base = (window.MP && window.MP.base) || '', idx = null;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var norm = function (s) { return s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' '); };
  var run = function () {
    var q = norm(input.value).trim();
    if (!q) { out.innerHTML = ''; status.textContent = 'Type a career, skill or question.'; return; }
    var words = q.split(/\s+/).filter(function (w) { return w.length > 1; });
    var res = idx.map(function (p) {
      var t = norm(p.t), d = norm(p.d + ' ' + (p.k || '')), s = 0, hit = 0;
      words.forEach(function (w) { var inT = t.indexOf(w) > -1, inD = d.indexOf(w) > -1; if (inT) s += 5; if (inD) s += 1; if (inT || inD) hit++; });
      if (t.indexOf(q) > -1) s += 10;
      s += hit * 3;
      if (p.y === 'Career' || p.y === 'Training' || p.y === 'Salary') s += s ? 2 : 0;
      return { p: p, s: s, hit: hit };
    }).filter(function (r) { return r.s > 0 && r.hit >= Math.ceil(words.length / 2); })
      .sort(function (a, b) { return b.s - a.s; }).slice(0, 40);
    status.textContent = res.length + ' result' + (res.length === 1 ? '' : 's') + ' for “' + input.value + '”';
    out.innerHTML = res.map(function (r) { return '<li class="card link"><span class="chip">' + esc(r.p.y) + '</span><h3 style="margin-top:8px"><a class="stretch" href="' + base + r.p.u + '">' + esc(r.p.t) + '</a></h3><p>' + esc(r.p.d) + '</p></li>'; }).join('');
  };
  var load = function (cb) {
    if (idx) return cb();
    status.textContent = 'Loading…';
    fetch(base + '/search-index.json').then(function (r) { return r.json(); }).then(function (j) { idx = j; cb(); });
  };
  var q0 = new URLSearchParams(location.search).get('q');
  if (q0) { input.value = q0; load(run); }
  form.addEventListener('submit', function (e) { e.preventDefault(); history.replaceState(null, '', '?q=' + encodeURIComponent(input.value)); load(run); });
  var t; input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { load(run); }, 160); });
})();
