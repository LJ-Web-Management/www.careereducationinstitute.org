// Search-as-you-type for the college major and minor lists (/college-majors/, /college-minors/).
(function () {
  var d = document;
  [].forEach.call(d.querySelectorAll('[data-list-filter]'), function (form) {
    var list = d.querySelector(form.getAttribute('data-list-filter')); if (!list) return;
    var items = [].slice.call(list.querySelectorAll('[data-k]')), groups = [].slice.call(list.querySelectorAll('[data-group]'));
    var count = form.querySelector('[data-list-count]'), empty = list.querySelector('[data-list-empty]'), total = count ? count.textContent : '';
    var run = function () {
      var words = (form.q.value || '').toLowerCase().trim().split(/\s+/).filter(Boolean), n = 0;
      items.forEach(function (el) { var ok = words.every(function (w) { return el.getAttribute('data-k').indexOf(w) > -1; }); el.hidden = !ok; if (ok) n++; });
      groups.forEach(function (g) { g.hidden = !g.querySelector('[data-k]:not([hidden])'); });
      if (count) count.textContent = words.length ? n + (n === 1 ? ' match' : ' matches') : total;
      if (empty) empty.hidden = n > 0;
    };
    form.addEventListener('input', run);
    form.addEventListener('submit', function (e) { e.preventDefault(); run(); var a = list.querySelector('[data-k]:not([hidden]) a'); if (a) a.focus(); });
  });
})();
