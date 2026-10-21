(function () {
  var form = document.querySelector('form[data-quiz]');
  var dataEl = document.getElementById('quiz-data');
  if (!form || !dataEl) return;
  var data = JSON.parse(dataEl.textContent);
  // Quizzes that score every career load the career list from a shared file while the visitor answers.
  var careersReady = data.careersUrl ? fetch(data.careersUrl).then(function (r) { return r.json(); }).then(function (c) { data.careers = c; }) : null;
  var out = document.querySelector('.results');
  var sets = [].slice.call(form.querySelectorAll('fieldset'));
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var answered = function () { return sets.filter(function (f) { return f.querySelector('input:checked'); }).length; };
  var links = function (ls) { return ls && ls.length ? '<ul>' + ls.map(function (l) { return '<li><a href="' + l[1] + '">' + esc(l[0]) + '</a></li>'; }).join('') + '</ul>' : ''; };

  // ---------- Slides: one question at a time ----------
  // The page lists every question (works without JavaScript); here they become slides with Back/Next,
  // a progress bar with the share answered, and a results button that works before every question is answered.
  var bar = form.querySelector('.quiz-bar');
  var submitBtn = bar.querySelector('button[type=submit]');
  var submitLabel = submitBtn.textContent;
  var cur = 0, confirmed = false, graded = data.type === 'graded';
  form.classList.add('slides');
  bar.innerHTML = '<div class="qprog"><div class="progress" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><span class="qpct" aria-hidden="true">0% complete</span></div>' +
    '<div class="qnav"><button class="btn" type="button" data-prev>Back</button><button class="btn btn-primary" type="button" data-next>Next</button></div>' +
    '<div class="qwarn" role="alert" hidden><p></p><div class="btn-row"><button class="btn" type="button" data-resume>Keep answering</button><button class="btn btn-dark" type="button" data-anyway>See results anyway</button></div></div>';
  var qnav = bar.querySelector('.qnav'), prevBtn = bar.querySelector('[data-prev]'), nextBtn = bar.querySelector('[data-next]');
  var meter = bar.querySelector('.progress'), fill = meter.querySelector('i'), pctEl = bar.querySelector('.qpct'), warn = bar.querySelector('.qwarn');
  qnav.appendChild(submitBtn);
  var progress = function () {
    var p = Math.round(answered() / sets.length * 100);
    fill.style.width = p + '%';
    meter.setAttribute('aria-valuenow', p);
    pctEl.textContent = p + '% complete';
  };
  var show = function (i, focus) {
    cur = Math.max(0, Math.min(sets.length - 1, i));
    sets.forEach(function (f, j) { f.hidden = j !== cur; });
    var last = cur === sets.length - 1;
    prevBtn.disabled = cur === 0;
    nextBtn.hidden = last;
    // The results button is always available; it is the main action only on the last question.
    submitBtn.className = 'btn ' + (last ? 'btn-primary' : 'btn-quiet');
    submitBtn.textContent = last ? submitLabel : 'Finish early';
    warn.hidden = true;
    if (focus) {
      var lg = sets[cur].querySelector('legend');
      lg.setAttribute('tabindex', '-1');
      lg.focus({ preventScroll: true });
      if (form.getBoundingClientRect().top < 70) form.scrollIntoView({ block: 'start' });
    }
  };
  prevBtn.addEventListener('click', function () { show(cur - 1, true); });
  nextBtn.addEventListener('click', function () { show(cur + 1, true); });
  // Choosing an answer with a click or tap moves on to the next question (not on practice tests, where
  // people may open the answer, and not with arrow keys, which change the choice as they move).
  var timer = null;
  form.addEventListener('click', function (e) {
    var opt = e.target.closest && e.target.closest('label.opt');
    if (!opt || graded || e.detail === 0 || cur === sets.length - 1) return;
    clearTimeout(timer);
    timer = setTimeout(function () { show(cur + 1, true); }, 260);
  });
  form.addEventListener('change', progress);
  // Enter on an answer goes to the next question instead of submitting the whole quiz.
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.matches && e.target.matches('input[type=radio]')) { e.preventDefault(); if (cur < sets.length - 1) show(cur + 1, true); else submitBtn.click(); }
  });
  bar.querySelector('[data-resume]').addEventListener('click', function () {
    var first = sets.findIndex(function (f) { return !f.querySelector('input:checked'); });
    show(first < 0 ? cur : first, true);
  });
  bar.querySelector('[data-anyway]').addEventListener('click', function () {
    confirmed = true; warn.hidden = true;
    form.dispatchEvent(new Event('submit', { cancelable: true }));
  });
  show(0, false);
  progress();

  var note = '';
  var finish = function (html) {
    out.innerHTML = html + note;
    out.classList.add('show');
    if (graded) {
      // Review mode: every question with its marked answer and explanation
      form.classList.remove('slides'); form.classList.add('review');
      sets.forEach(function (f) { f.hidden = false; });
      bar.hidden = true;
    } else {
      form.hidden = true;
      var row = out.querySelector('.btn-row');
      if (row) {
        var edit = document.createElement('button');
        edit.type = 'button'; edit.className = 'btn'; edit.textContent = 'Change my answers';
        edit.addEventListener('click', function () { form.hidden = false; out.classList.remove('show'); out.innerHTML = ''; confirmed = false; show(0, true); });
        row.appendChild(edit);
      }
    }
    out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    out.focus({ preventScroll: true });
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = answered();
    if (!n) {
      warn.querySelector('p').textContent = 'Answer at least one question to see a result.';
      warn.querySelector('[data-anyway]').hidden = true;
      warn.hidden = false;
      return;
    }
    if (n < sets.length && !confirmed) {
      warn.querySelector('p').textContent = 'You’ve answered ' + n + ' of ' + sets.length + ' questions. You can see your results now, but they may not be as accurate as they would be with every question answered.';
      warn.querySelector('[data-anyway]').hidden = false;
      warn.hidden = false;
      warn.querySelector('[data-anyway]').focus();
      return;
    }
    note = n < sets.length ? '<p class="small muted quiz-note">Based on ' + n + ' of ' + sets.length + ' answers. Answer every question for a more accurate result.</p>' : '';
    var vals = sets.map(function (f) { var c = f.querySelector('input:checked'); return c ? c.value : null; });
    var given = vals.filter(function (v) { return v !== null; });

    if (graded) {
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
      if (n < sets.length) note = '<p class="small muted quiz-note">You left ' + (sets.length - n) + ' of ' + sets.length + ' questions blank; they count as wrong.</p>';
      finish('<div class="result-card"><p class="eyebrow">Your score</p><p class="score">' + p + '%</p><p>You answered <strong>' + right + ' of ' + sets.length + '</strong> correctly. ' + (p >= data.passing ? 'Nice work, that is a passing score.' : 'Review the explanations below and try again.') + '</p><p>' + esc(data.cta.text) + '</p><div class="btn-row"><a class="btn btn-primary" href="' + data.cta.link + '">' + esc(data.cta.btn) + '</a><button class="btn" type="button" onclick="location.reload()">Retake test</button></div></div>');
      return;
    }

    if (data.type === 'band') {
      // Agreement scale 1 to 5, scored on the statements answered
      var sum = given.reduce(function (a, v) { return a + (+v); }, 0);
      var pct = Math.round((sum - given.length) / (given.length * 4) * 100);
      var b = data.bands.filter(function (x) { return pct >= x.min; })[0];
      finish('<div class="result-card"><p class="eyebrow">Your result</p><p class="score">' + pct + '%</p><h2>' + esc(b.title) + '</h2><p>' + esc(b.text) + '</p>' + links(b.links) + '<div class="btn-row"><button class="btn" type="button" onclick="location.reload()">Retake quiz</button></div></div>');
      return;
    }

    // Weighted scoring: each answer adds weights to keys; unanswered questions add nothing
    var w = {};
    sets.forEach(function (f, i) {
      var q = data.questions[i], v = vals[i];
      if (v === null) return;
      var add = q.scale ? (function () { var o = {}; o[q.key] = (+v - 3); return o; })() : (q.options[+v].w || {});
      Object.keys(add).forEach(function (k) { w[k] = (w[k] || 0) + add[k]; });
    });

    if (data.type === 'outcome') {
      var best = Object.keys(data.outcomes).sort(function (a, z) { return (w[z] || 0) - (w[a] || 0); })[0];
      var o = data.outcomes[best];
      finish('<div class="result-card"><p class="eyebrow">Your result</p><h2>' + esc(o.title) + '</h2><p>' + esc(o.text) + '</p>' + links(o.links) + '<div class="btn-row"><button class="btn" type="button" onclick="location.reload()">Retake quiz</button></div></div>');
      return;
    }

    if (data.type === 'points') {
      // Readiness: points over the questions answered
      var total = Object.keys(w).reduce(function (a, k) { return a + w[k]; }, 0);
      var pc = Math.max(0, Math.min(100, Math.round(total / (data.max * n / sets.length) * 100)));
      var bb = data.bands.filter(function (x) { return pc >= x.min; })[0];
      finish('<div class="result-card"><p class="eyebrow">Your readiness score</p><p class="score">' + pc + '%</p><h2>' + esc(bb.title) + '</h2><p>' + esc(bb.text) + '</p>' + links(bb.links) + '<div class="btn-row"><button class="btn" type="button" onclick="location.reload()">Retake quiz</button></div></div>');
      return;
    }

    if (data.type === 'careers' && !data.careers) {
      if (careersReady) careersReady.then(function () { form.dispatchEvent(new Event('submit', { cancelable: true })); });
      return;
    }
    if (data.type === 'careers') {
      var maxEdu = w.maxEdu != null ? w.maxEdu : 4;
      var scored = data.careers.map(function (c) {
        var s = 0;
        'RIASEC'.split('').forEach(function (k) { var pos = c.r.indexOf(k); if (pos > -1 && w[k]) s += w[k] * [3, 2, 1][pos]; });
        c.t.forEach(function (t) { if (w['t_' + t]) s += w['t_' + t] * 2; });
        if (c.e > maxEdu + (data.questions.some(function (q) { return q.eduQ; }) ? 0 : 9)) s -= 25;
        // Job outlook: annual openings on a log scale (-1.5 to +1.5) plus growth (-1.5 to +1), at most about one matching
        // answer. It separates near-ties so small or shrinking occupations do not crowd out widely hiring ones.
        if (c.o != null) s += Math.max(-1.5, Math.min(1.5, Math.log10(Math.max(c.o, 10)) - 3.5)) + Math.max(-1.5, Math.min(1, c.g / 5));
        return { c: c, s: s };
      }).sort(function (a, z) { return z.s - a.s || (z.c.o || 0) - (a.c.o || 0); });
      var top = scored.slice(0, data.top || 6), hi = top[0].s, lo = scored[scored.length - 1].s, span = (hi - lo) || 1;
      var html = '<div class="result-card"><p class="eyebrow">Your top matches</p><h2>' + esc(data.resultTitle || 'Careers that fit you') + '</h2><p>' + esc(data.resultText || '') + '</p><ol class="match-list">' + top.map(function (x) {
        var m = Math.round(62 + 36 * (x.s - lo) / span);
        return '<li><span><a href="' + x.c.u + '">' + esc(x.c.n) + '</a><br><span class="small muted">Median pay ' + x.c.p + ' · ' + esc(x.c.tr) + ' to train</span></span><span class="pct">' + m + '%</span><span class="meter"><i style="width:' + m + '%"></i></span></li>';
      }).join('') + '</ol>';
      var tops = 'RIASEC'.split('').filter(function (k) { return w[k] > 0; }).sort(function (a, z) { return w[z] - w[a]; }).slice(0, 3);
      if (tops.length && data.riasecNames) html += '<p style="margin-top:14px"><strong>Your interest code:</strong> ' + tops.join('') + ': ' + tops.map(function (k) { return data.riasecNames[k]; }).join(', ') + '.</p>';
      html += '<div class="btn-row"><a class="btn btn-primary" href="' + top[0].c.u.replace('/careers/', '/training/') + '">See ' + esc(top[0].c.n) + ' training</a><button class="btn" type="button" onclick="location.reload()">Retake quiz</button></div></div>';
      finish(html);
    }
  });
})();
