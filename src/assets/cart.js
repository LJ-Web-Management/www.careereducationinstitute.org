// Cart page: lists what site.js saved in this browser, with learner counts, volume pricing and two ways to finish:
// card checkout for online courses (all in one order) and one enrollment request for job-title trainings.
(function () {
  var root = document.querySelector('[data-cart]');
  var dataEl = document.getElementById('cart-data');
  if (!root || !dataEl || !window.MP || !MP.cart) return;
  var D = JSON.parse(dataEl.textContent);
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var fmt = function (n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var round = function (n) { return Math.round(n * 100) / 100; };
  var tierFor = function (n) { for (var i = D.tiers.length - 1; i >= 0; i--) if (n >= D.tiers[i].min) return D.tiers[i]; return D.tiers[0]; };
  // Current price for an item, or null when it is no longer sold that way
  var priceOf = function (i) { return i.k === 'course' ? (D.courses[i.s] ? D.courses[i.s].p : null) : (D.trainings[i.s] != null ? D.trainings[i.s] : null); };
  var line = function (i) {
    var p = priceOf(i), n = Math.max(1, Math.min(1000, parseInt(i.n, 10) || 1)), t = tierFor(n);
    var sub = round(p * n), total = round(round(p * (1 - t.discount)) * n);
    return { i: i, p: p, n: n, t: t, sub: sub, total: total, disc: round(sub - total) };
  };
  var update = function (k, s, fn) {
    var list = MP.cart.get();
    list = list.map(function (x) { return x.k === k && x.s === s ? fn(x) : x; }).filter(Boolean);
    MP.cart.set(list);
  };

  var render = function () {
    var list = MP.cart.get().filter(function (i) { return priceOf(i) != null; });
    // Drop anything no longer sold (for example a training now replaced by an online course)
    if (list.length !== MP.cart.get().length) { MP.cart.set(list); return; }
    var groups = { course: [], training: [] };
    list.forEach(function (i) { (groups[i.k] || []).push(line(i)); });
    root.querySelector('[data-cart-empty]').hidden = list.length > 0;
    root.querySelector('[data-cart-summary]').hidden = !list.length;
    ['course', 'training'].forEach(function (k) {
      var sec = root.querySelector('[data-cart-group="' + k + '"]'), ls = groups[k];
      sec.hidden = !ls.length;
      sec.querySelector('[data-lines]').innerHTML = ls.map(function (l) {
        var title = k === 'course' && D.courses[l.i.s] ? D.courses[l.i.s].t : l.i.t;
        return '<li class="cart-line" data-k="' + k + '" data-s="' + esc(l.i.s) + '"><div><p class="k">' + (k === 'course' ? 'Online course' : 'Job-title training') + '</p><h3><a href="' + esc(l.i.u) + '">' + esc(title) + '</a></h3><p class="meta">' + fmt(l.p) + ' per learner</p></div>' +
          '<div class="amt">' + fmt(l.total) + (l.disc > 0 ? '<small>' + Math.round(l.t.discount * 100) + '% volume discount</small>' : '') + '</div>' +
          '<div class="ctl"><span class="qty"><button type="button" data-step="-1" aria-label="One fewer learner">−</button><input type="number" min="1" max="1000" value="' + l.n + '" aria-label="Learners for ' + esc(title) + '" inputmode="numeric"><button type="button" data-step="1" aria-label="One more learner">+</button></span><span class="small muted">' + (l.n === 1 ? 'learner' : 'learners') + '</span><button class="link-btn" type="button" data-remove>Remove</button></div></li>';
      }).join('');
      var sum = root.querySelector('[data-sum-' + k + ']');
      sum.hidden = !ls.length;
      var sub = round(ls.reduce(function (a, l) { return a + l.sub; }, 0)), total = round(ls.reduce(function (a, l) { return a + l.total; }, 0));
      sum.querySelector('[data-sum-rows]').innerHTML = '<tr><th scope="row">' + ls.length + (ls.length === 1 ? (k === 'course' ? ' course' : ' training') : (k === 'course' ? ' courses' : ' trainings')) + '</th><td>' + fmt(sub) + '</td></tr>' +
        (sub > total ? '<tr><th scope="row">Volume discount</th><td>-' + fmt(round(sub - total)) + '</td></tr>' : '') + '<tr class="total"><th scope="row">' + (k === 'course' ? 'Total' : 'Estimated total') + '</th><td>' + fmt(total) + '</td></tr>';
      if (k === 'training') {
        var form = root.querySelector('form[data-enroll]');
        if (form) {
          form.elements.Cart.value = ls.map(function (l) { return '- ' + l.i.t + ': ' + l.n + (l.n === 1 ? ' learner' : ' learners') + ' x ' + fmt(l.p) + (l.disc > 0 ? ', ' + Math.round(l.t.discount * 100) + '% volume discount' : '') + ' = ' + fmt(l.total); }).join('\n') + '\nEstimated total: ' + fmt(total);
          form.elements.CartCount.value = ls.length;
        }
      }
    });
  };

  root.addEventListener('click', function (e) {
    var li = e.target.closest('.cart-line'); if (!li) return;
    var k = li.getAttribute('data-k'), s = li.getAttribute('data-s');
    var step = e.target.closest('[data-step]');
    if (step) update(k, s, function (x) { x.n = Math.max(1, Math.min(1000, (parseInt(x.n, 10) || 1) + Number(step.getAttribute('data-step')))); return x; });
    if (e.target.closest('[data-remove]')) update(k, s, function () { return null; });
  });
  root.addEventListener('change', function (e) {
    if (!e.target.matches('.qty input')) return;
    var li = e.target.closest('.cart-line'), v = Math.max(1, Math.min(1000, parseInt(e.target.value, 10) || 1));
    update(li.getAttribute('data-k'), li.getAttribute('data-s'), function (x) { x.n = v; return x; });
  });
  // Re-render after any change, here or in another tab; keep focus on the learner box being edited
  document.addEventListener('cart:change', function () {
    var a = document.activeElement, li = a && a.closest && a.closest('.cart-line'), which = li && (a.matches('input') ? 'input' : a.getAttribute('data-step') ? '[data-step="' + a.getAttribute('data-step') + '"]' : null);
    var key = li && li.getAttribute('data-k') + '|' + li.getAttribute('data-s');
    render();
    if (key && which) { var again = root.querySelector('.cart-line[data-k="' + key.split('|')[0] + '"][data-s="' + key.split('|')[1] + '"] ' + which); if (again) again.focus(); }
  });
  render();
})();
