// College and university search (IPEDS data from /assets/finder/colleges.json). Used on /colleges/ and in step 4 of
// the College & Career Finder: window.CEIColleges.mount(element, options).
// Options: base (site base path), saved (array of school ids), onSave(ids) to let visitors build a list,
// majors (preselected major slugs), params (initial filters), track(eventName, params).
(function () {
  var d = document;
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var CONTROL = { 1: 'Public', 2: 'Private nonprofit', 3: 'Private for-profit' }, LEVEL = { 1: 'Four-year', 2: 'Two-year' };
  var AWARD = { C: 'Certificate', A: 'Associate', B: 'Bachelor’s', M: 'Master’s', D: 'Doctoral' };
  var cache = {};
  var getJSON = function (url) { return cache[url] || (cache[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })); };
  var miles = function (a, b, c, e) { var R = 3958.8, r = Math.PI / 180, x = Math.sin((c - a) * r / 2), y = Math.sin((e - b) * r / 2); return 2 * R * Math.asin(Math.sqrt(x * x + Math.cos(a * r) * Math.cos(c * r) * y * y)); };
  var track = function (o, n, p) { try { (o.track || (window.MP && MP.track) || function () {})(n, p); } catch (e) {} };

  function mount(el, o) {
    o = o || {};
    var base = o.base || (window.MP && MP.base) || '';
    var saved = (o.saved || []).slice();
    var PAGE = 20, shown = PAGE, rows = [], meta = {}, majors = [], origin = null, originLabel = '';
    el.innerHTML = '<p class="muted">Loading ' + (o.compact ? '' : 'the college search') + '…</p>';
    getJSON(base + '/assets/finder/colleges.json').then(function (j) { rows = j.rows; meta = j.meta; majors = j.majors; render(j.states); }).catch(function () {
      el.innerHTML = '<p class="callout">The college search could not load. Please refresh the page, or browse <a href="' + base + '/colleges/">colleges by state</a>.</p>';
    });

    function render(states) {
      var p = o.params || {};
      var fieldGroups = {}, fieldOrder = [];
      majors.forEach(function (m, i) { if (!fieldGroups[m[2]]) { fieldGroups[m[2]] = []; fieldOrder.push(m[2]); } fieldGroups[m[2]].push([m[0], m[1], i]); });
      var stOpts = Object.keys(states).filter(function (s) { return rows.some(function (r) { return r[3] === s; }); }).map(function (s) { return '<option value="' + s + '"' + (p.state === s ? ' selected' : '') + '>' + esc(states[s]) + '</option>'; }).join('');
      var mjOpts = fieldOrder.map(function (f) { return '<optgroup label="' + esc(f) + '">' + fieldGroups[f].map(function (m) { return '<option value="' + m[0] + '"' + (p.major === m[0] ? ' selected' : '') + '>' + esc(m[1]) + '</option>'; }).join('') + '</optgroup>'; }).join('');
      var id = 'cs' + Math.random().toString(36).slice(2, 7);
      var sel = function (name, label, opts) { return '<div class="field"><label for="' + id + name + '">' + label + '</label><select id="' + id + name + '" name="' + name + '">' + opts + '</select></div>'; };
      el.innerHTML = '<form class="filters cs-filters" role="search" aria-label="Search colleges and universities">'
        + '<div class="field cs-wide"><label for="' + id + 'q">College name</label><input id="' + id + 'q" name="q" type="search" placeholder="e.g. Ohio State, community college" autocomplete="off" value="' + esc(p.q || '') + '"></div>'
        + sel('state', 'State', '<option value="">All states</option>' + stOpts)
        + '<div class="field"><label for="' + id + 'city">City</label><input id="' + id + 'city" name="city" type="text" autocomplete="address-level2" value="' + esc(p.city || '') + '"></div>'
        + '<div class="field cs-zip"><label for="' + id + 'zip">ZIP code</label><input id="' + id + 'zip" name="zip" type="text" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" autocomplete="postal-code" value="' + esc(p.zip || '') + '"><button class="link-btn small" type="button" data-near>Use my location</button></div>'
        + sel('major', 'Major or program', '<option value="">Any major</option>' + mjOpts)
        + sel('online', 'Online or in person', '<option value="">Any</option><option value="1"' + (p.online === '1' ? ' selected' : '') + '>Offers fully online programs</option>')
        + sel('control', 'Public or private', '<option value="">Any</option><option value="1">Public</option><option value="2">Private nonprofit</option><option value="3">Private for-profit</option><option value="23">Any private</option>')
        + sel('level', 'Two- or four-year', '<option value="">Any</option><option value="1">Four-year</option><option value="2">Two-year</option>')
        + sel('prog', 'Programs', '<option value="">Undergraduate or graduate</option><option value="ug">Undergraduate</option><option value="grad">Graduate</option>')
        + (o.majors && o.majors.length ? '<div class="field cs-check"><label><input type="checkbox" name="mine"' + (p.mine ? ' checked' : '') + '> Only colleges offering my selected majors</label></div>' : '')
        + '</form><p class="cs-count" aria-live="polite" data-count></p><p class="small muted" data-origin hidden></p><ol class="cs-list" data-list></ol><p data-more-wrap hidden><button class="btn" type="button" data-more>Show more colleges</button></p>'
        + '<p class="small muted cs-source">Source: ' + esc(meta.source) + ' (' + esc(meta.directory) + '; ' + esc(meta.completions) + '). Confirm details with each school.</p>'
        + '<dialog class="dlg" data-dlg aria-labelledby="' + id + 'dt"><div class="dlg-in"><button class="dlg-x" type="button" data-close aria-label="Close">×</button><div data-dlg-body></div></div></dialog>';
      var f = el.querySelector('form');
      var timer;
      var go = function () { shown = PAGE; draw(); clearTimeout(timer); timer = setTimeout(function () { track(o, 'college_search', { state: f.state.value || 'all', major: f.major.value || 'any', online: f.online.value ? 'yes' : 'any', control: f.control.value || 'any', level: f.level.value || 'any' }); }, 1500); };
      f.addEventListener('input', go); f.addEventListener('change', go);
      f.addEventListener('submit', function (e) { e.preventDefault(); go(); });
      el.querySelector('[data-more]').addEventListener('click', function () { shown += PAGE; draw(); });
      el.querySelector('[data-near]').addEventListener('click', function (e) {
        var b = e.target;
        if (!navigator.geolocation) { b.textContent = 'Location not available'; return; }
        b.textContent = 'Finding you…';
        navigator.geolocation.getCurrentPosition(function (pos) { origin = [pos.coords.latitude, pos.coords.longitude]; originLabel = 'your location'; f.zip.value = ''; b.textContent = 'Using your location'; go(); }, function () { b.textContent = 'Location not shared'; });
      });
      var dlg = el.querySelector('[data-dlg]');
      dlg.querySelector('[data-close]').addEventListener('click', function () { dlg.close(); });
      dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
      el.querySelector('[data-list]').addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        var idv = b.getAttribute('data-id'), row = rows.filter(function (r) { return String(r[0]) === idv; })[0]; if (!row) return;
        if (b.hasAttribute('data-save')) {
          var i = saved.indexOf(row[0]);
          if (i > -1) saved.splice(i, 1); else { saved.push(row[0]); track(o, 'college_save', { college_name: row[1], state: row[3] }); }
          if (o.onSave) o.onSave(saved.slice(), rows);
          draw(true);
        } else open(row, b);
      });
      draw();
    }

    function filters() {
      var f = el.querySelector('form'), v = function (n) { return f[n] ? (f[n].type === 'checkbox' ? f[n].checked : f[n].value.trim()) : ''; };
      return { q: v('q').toLowerCase(), state: v('state'), city: v('city').toLowerCase(), zip: v('zip'), major: v('major'), online: v('online'), control: v('control'), level: v('level'), prog: v('prog'), mine: v('mine') };
    }

    function draw(keepScroll) {
      var F = filters();
      var mIdx = F.major ? majors.map(function (m) { return m[0]; }).indexOf(F.major) : -1;
      var mine = F.mine && o.majors ? o.majors.map(function (s) { return majors.map(function (m) { return m[0]; }).indexOf(s); }).filter(function (i) { return i > -1; }) : [];
      var words = F.q.split(/\s+/).filter(Boolean);
      // ZIP: center on schools in the same ZIP (or the same 3-digit ZIP area); distances are approximate
      if (/^\d{5}$/.test(F.zip)) {
        var same = rows.filter(function (r) { return r[4] === F.zip && r[11] != null; });
        if (!same.length) same = rows.filter(function (r) { return r[4].slice(0, 3) === F.zip.slice(0, 3) && r[11] != null; });
        if (same.length) { origin = [same.reduce(function (a, r) { return a + r[11]; }, 0) / same.length, same.reduce(function (a, r) { return a + r[12]; }, 0) / same.length]; originLabel = 'ZIP ' + F.zip + ' (approximate)'; }
        else { origin = null; originLabel = ''; }
      } else if (originLabel.indexOf('ZIP') === 0) { origin = null; originLabel = ''; }
      var res = rows.filter(function (r) {
        if (words.length) { var k = (r[1] + ' ' + r[14] + ' ' + r[2]).toLowerCase(); if (!words.every(function (w) { return k.indexOf(w) > -1; })) return false; }
        if (F.state && r[3] !== F.state) return false;
        if (F.city && r[2].toLowerCase().indexOf(F.city) !== 0) return false;
        if (F.online && !(r[10] & 1)) return false;
        if (F.control && F.control.indexOf(String(r[6])) < 0) return false;
        if (F.level && String(r[7]) !== F.level) return false;
        if (F.prog === 'ug' && !r[8]) return false;
        if (F.prog === 'grad' && !r[9]) return false;
        if (mIdx > -1 && r[13].indexOf(mIdx) < 0) return false;
        if (mine.length && !mine.some(function (i) { return r[13].indexOf(i) > -1; })) return false;
        return true;
      });
      var dist = {};
      if (origin) {
        res.forEach(function (r) { dist[r[0]] = r[11] != null ? miles(origin[0], origin[1], r[11], r[12]) : 99999; });
        if (!F.state && !words.length && !F.city) res = res.filter(function (r) { return dist[r[0]] <= 100; });
        res.sort(function (a, b) { return dist[a[0]] - dist[b[0]]; });
      }
      var c = el.querySelector('[data-count]'), og = el.querySelector('[data-origin]');
      c.textContent = res.length.toLocaleString('en-US') + (res.length === 1 ? ' college matches' : ' colleges match') + (saved.length && o.onSave ? ' · ' + saved.length + ' saved to your list' : '');
      og.hidden = !origin; og.textContent = origin ? 'Sorted by distance from ' + originLabel + (F.state || words.length || F.city ? '.' : ', within about 100 miles.') : '';
      el.querySelector('[data-list]').innerHTML = res.slice(0, shown).map(function (r) {
        var on = saved.indexOf(r[0]) > -1;
        return '<li class="cs-item"><div class="cs-main"><button class="cs-name" type="button" data-id="' + r[0] + '">' + esc(r[1]) + '</button><span class="cs-loc">' + esc(r[2]) + ', ' + r[3] + (dist[r[0]] != null && dist[r[0]] < 99999 ? ' · about ' + Math.round(dist[r[0]]) + ' mi' : '') + '</span><ul class="chips"><li class="chip">' + CONTROL[r[6]] + '</li><li class="chip">' + LEVEL[r[7]] + '</li>' + (r[10] & 1 ? '<li class="chip chip-on">Online programs</li>' : '') + (r[9] ? '<li class="chip">Graduate</li>' : '') + '</ul></div><div class="cs-act">'
          + (r[5] ? '<a class="btn btn-sm" href="' + esc(r[5]) + '" rel="nofollow noopener external" target="_blank">Website<span class="vh"> of ' + esc(r[1]) + ' (opens in a new tab)</span></a>' : '')
          + (o.onSave ? '<button class="btn btn-sm' + (on ? ' btn-primary' : '') + '" type="button" data-save data-id="' + r[0] + '" aria-pressed="' + on + '">' + (on ? 'Saved' : 'Save') + '<span class="vh"> ' + esc(r[1]) + '</span></button>' : '') + '</div></li>';
      }).join('') || '<li class="cs-empty">No colleges match these filters. Try removing one.</li>';
      el.querySelector('[data-more-wrap]').hidden = res.length <= shown;
      if (o.onCount) o.onCount(res.length);
    }

    function open(r, from) {
      var dlg = el.querySelector('[data-dlg]'), body = dlg.querySelector('[data-dlg-body]');
      var ms = r[13].map(function (i) { return majors[i]; });
      body.innerHTML = '<h2 id="' + dlg.getAttribute('aria-labelledby') + '">' + esc(r[1]) + '</h2>' + (r[14] ? '<p class="muted small">Also known as ' + esc(r[14]) + '</p>' : '')
        + '<p>' + esc(r[2]) + ', ' + r[3] + ' ' + r[4] + '</p><ul class="chips"><li class="chip">' + CONTROL[r[6]] + '</li><li class="chip">' + LEVEL[r[7]] + '</li><li class="chip">' + (r[8] && r[9] ? 'Undergraduate and graduate' : r[9] ? 'Graduate' : 'Undergraduate') + '</li></ul>'
        + '<h3>Online education</h3><p>' + (r[10] & 1 ? 'Reports offering at least one program entirely online' + ((r[10] & 2) && (r[10] & 4) ? ' (undergraduate and graduate).' : r[10] & 2 ? ' (undergraduate).' : r[10] & 4 ? ' (graduate).' : '.') + ' Check with the school which programs are online.' : 'Does not report any program offered entirely online. Some individual courses may be online.') + '</p>'
        + '<h3>Official links</h3><ul data-links>' + (r[5] ? '<li><a href="' + esc(r[5]) + '" rel="nofollow noopener external" target="_blank">School website</a></li>' : '') + '<li><a href="https://nces.ed.gov/collegenavigator/?id=' + r[0] + '" rel="noopener" target="_blank">College Navigator profile (U.S. Department of Education)</a>: costs, admissions, enrollment and outcomes</li></ul>'
        + (ms.length ? '<h3>Majors offered from this guide</h3><ul class="cs-majors" data-majors>' + ms.map(function (m) { return '<li><a href="' + base + '/college-majors/' + m[0] + '/">' + esc(m[1]) + '</a></li>'; }).join('') + '</ul>' : '')
        + '<h3>All programs reported</h3><div data-programs><p class="muted">Loading programs…</p></div>'
        + '<p class="small muted">Programs: awards the school reported to IPEDS (' + esc(meta.completions) + '). Program names can differ at the school.</p>';
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      dlg.querySelector('[data-close]').focus();
      dlg.addEventListener('close', function f() { dlg.removeEventListener('close', f); if (from && from.focus) from.focus(); });
      track(o, 'college_view', { college_name: r[1], state: r[3] });
      Promise.all([getJSON(base + '/assets/finder/programs/' + r[3] + '.json'), getJSON(base + '/assets/finder/cip.json')]).then(function (x) {
        var info = x[0][r[0]] || {}, cip = x[1];
        var links = body.querySelector('[data-links]');
        if (info.a) links.insertAdjacentHTML('beforeend', '<li><a href="' + esc(info.a) + '" rel="nofollow noopener external" target="_blank">Admissions</a></li>');
        if (info.n) links.insertAdjacentHTML('beforeend', '<li><a href="' + esc(info.n) + '" rel="nofollow noopener external" target="_blank">Net price calculator</a></li>');
        var ml = body.querySelector('[data-majors]');
        if (ml && info.l) [].forEach.call(ml.children, function (li, k) { var lv = info.l[r[13][k]] || ''; if (lv) li.insertAdjacentHTML('beforeend', ' <span class="muted small">' + lv.split('').map(function (l) { return AWARD[l]; }).join(', ') + '</span>'); });
        var progs = (info.p || '').split(',').filter(Boolean).map(function (p) { var a = p.split(':'); return [a[0], a[1]]; });
        var fam = {};
        progs.forEach(function (p) { var k = p[0].slice(0, 2); (fam[k] = fam[k] || []).push(p); });
        body.querySelector('[data-programs]').innerHTML = progs.length ? Object.keys(fam).sort().map(function (k) {
          return '<details><summary>' + esc(cip[k] || k) + ' <span class="muted">(' + fam[k].length + ')</span></summary><ul>' + fam[k].map(function (p) { return '<li>' + esc(cip[p[0]] || p[0]) + ' <span class="muted small">' + p[1].split('').map(function (l) { return AWARD[l]; }).join(', ') + '</span></li>'; }).join('') + '</ul></details>';
        }).join('') : '<p>No programs reported for the latest year.</p>';
      }).catch(function () { body.querySelector('[data-programs]').innerHTML = '<p>Programs could not load. See the College Navigator profile above.</p>'; });
    }
    return { refresh: function (opts) { if (opts) { if (opts.majors) o.majors = opts.majors; } if (rows.length) draw(); } };
  }

  window.CEIColleges = { mount: mount, getJSON: getJSON };
  // Standalone search on /colleges/: filters can come from the address (?state=OH&major=nursing&q=...)
  var st = d.querySelector('[data-college-search][data-standalone]');
  if (st) {
    var q = new URLSearchParams(location.search), p = {};
    ['q', 'state', 'major', 'city', 'zip', 'online'].forEach(function (k) { if (q.get(k)) p[k] = q.get(k); });
    mount(st, { base: st.getAttribute('data-base'), params: p });
  }
})();
