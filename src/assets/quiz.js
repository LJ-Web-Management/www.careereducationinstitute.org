(function () {
  var form = document.querySelector('form[data-quiz]');
  var dataEl = document.getElementById('quiz-data');
  if (!form || !dataEl) return;
  var data = JSON.parse(dataEl.textContent);
  var out = document.querySelector('.results');
  var sets = [].slice.call(form.querySelectorAll('fieldset'));
  var bar = form.querySelector('.progress i');
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var answered = function () { return sets.filter(function (f) { return f.querySelector('input:checked'); }).length; };
  form.addEventListener('change', function () { if (bar) bar.style.width = (answered() / sets.length * 100) + '%'; });
  var links = function (ls) { return ls && ls.length ? '<ul>' + ls.map(function (l) { return '<li><a href="' + l[1] + '">' + esc(l[0]) + '</a></li>'; }).join('') + '</ul>' : ''; };
  var show = function (html) { out.innerHTML = html; out.classList.add('show'); out.scrollIntoView({ behavior: 'smooth', block: 'start' }); out.focus({ preventScroll: true }); };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var missing = sets.filter(function (f) { return !f.querySelector('input:checked'); });
    if (data.type !== 'graded' && missing.length) {
      missing[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      missing[0].querySelector('input').focus({ preventScroll: true });
      alert('Please answer all ' + sets.length + ' questions (' + missing.length + ' left).');
      return;
    }
    var vals = sets.map(function (f) { var c = f.querySelector('input:checked'); return c ? c.value : null; });

    if (data.type === 'graded') {
      var right = 0;
      sets.forEach(function (f, i) {
        var ok = vals[i] !== null && +vals[i] === data.answers[i];
        if (ok) right++;
        [].forEach.call(f.querySelectorAll('label.opt'), function (l, j) {
          l.classList.remove('ok', 'bad');
          if (j === data.answers[i]) l.classList.add('ok');
          else if (vals[i] !== null && +vals[i] === j) l.classList.add('bad');
        });
        var d = f.querySelector('details'); if (d) d.open = true;
      });
      var p = Math.round(right / sets.length * 100);
      show('<div class="result-card"><p class="eyebrow">Your score</p><p class="score">' + p + '%</p><p>You answered <strong>' + right + ' of ' + sets.length + '</strong> correctly. ' + (p >= data.passing ? 'Nice work — that is a passing score.' : 'Review the explanations below and try again.') + '</p><p>' + esc(data.cta.text) + '</p><div class="btn-row"><a class="btn btn-primary" href="' + data.cta.link + '">' + esc(data.cta.btn) + '</a><button class="btn" type="button" onclick="location.reload()">Retake test</button></div></div>');
      return;
    }

    if (data.type === 'band') {
      var sum = vals.reduce(function (a, v) { return a + (+v); }, 0);
      var pct = Math.round((sum - sets.length) / (sets.length * 4) * 100);
      var b = data.bands.filter(function (x) { return pct >= x.min; })[0];
      show('<div class="result-card"><p class="eyebrow">Your result</p><p class="score">' + pct + '%</p><h2>' + esc(b.title) + '</h2><p>' + esc(b.text) + '</p>' + links(b.links) + '</div>');
      return;
    }

    // Weighted scoring: each answer adds weights to keys
    var w = {};
    sets.forEach(function (f, i) {
      var q = data.questions[i], v = vals[i];
      var add = q.scale ? (function () { var o = {}; o[q.key] = (+v - 3); return o; })() : (q.options[+v].w || {});
      Object.keys(add).forEach(function (k) { w[k] = (w[k] || 0) + add[k]; });
    });

    if (data.type === 'outcome') {
      var best = Object.keys(data.outcomes).sort(function (a, z) { return (w[z] || 0) - (w[a] || 0); })[0];
      var o = data.outcomes[best];
      show('<div class="result-card"><p class="eyebrow">Your result</p><h2>' + esc(o.title) + '</h2><p>' + esc(o.text) + '</p>' + links(o.links) + '</div>');
      return;
    }

    if (data.type === 'points') {
      var total = Object.keys(w).reduce(function (a, k) { return a + w[k]; }, 0);
      var pc = Math.max(0, Math.min(100, Math.round(total / data.max * 100)));
      var bb = data.bands.filter(function (x) { return pc >= x.min; })[0];
      show('<div class="result-card"><p class="eyebrow">Your readiness score</p><p class="score">' + pc + '%</p><h2>' + esc(bb.title) + '</h2><p>' + esc(bb.text) + '</p>' + links(bb.links) + '</div>');
      return;
    }

    if (data.type === 'careers') {
      var maxEdu = w.maxEdu != null ? w.maxEdu : 4;
      var scored = data.careers.map(function (c) {
        var s = 0;
        'RIASEC'.split('').forEach(function (k) { var pos = c.r.indexOf(k); if (pos > -1 && w[k]) s += w[k] * [3, 2, 1][pos]; });
        c.t.forEach(function (t) { if (w['t_' + t]) s += w['t_' + t] * 2; });
        if (c.e > maxEdu + (data.questions.some(function (q) { return q.eduQ; }) ? 0 : 9)) s -= 25;
        return { c: c, s: s };
      }).sort(function (a, z) { return z.s - a.s; });
      var top = scored.slice(0, data.top || 6), hi = top[0].s, lo = scored[scored.length - 1].s, span = (hi - lo) || 1;
      var html = '<div class="result-card"><p class="eyebrow">Your top matches</p><h2>' + esc(data.resultTitle || 'Careers that fit you') + '</h2><p>' + esc(data.resultText || '') + '</p><ol class="match-list">' + top.map(function (x) {
        var m = Math.round(62 + 36 * (x.s - lo) / span);
        return '<li><span><a href="' + x.c.u + '">' + esc(x.c.n) + '</a><br><span class="small muted">Median pay ' + x.c.p + ' · ' + esc(x.c.tr) + ' to train</span></span><span class="pct">' + m + '%</span><span class="meter"><i style="width:' + m + '%"></i></span></li>';
      }).join('') + '</ol>';
      var tops = 'RIASEC'.split('').filter(function (k) { return w[k] > 0; }).sort(function (a, z) { return w[z] - w[a]; }).slice(0, 3);
      if (tops.length && data.riasecNames) html += '<p style="margin-top:14px"><strong>Your interest code:</strong> ' + tops.join('') + ' — ' + tops.map(function (k) { return data.riasecNames[k]; }).join(', ') + '.</p>';
      html += '<div class="btn-row"><a class="btn btn-primary" href="' + top[0].c.u.replace('/careers/', '/training/') + '">See ' + esc(top[0].c.n) + ' training</a><button class="btn" type="button" onclick="location.reload()">Retake quiz</button></div></div>';
      show(html);
    }
  });
})();
