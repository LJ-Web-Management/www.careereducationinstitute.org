// College & Career Finder admin dashboard (/finder-admin/). The site is static, so this page edits drafts of the data
// files in src/data/finder/ and publishes them by committing to GitHub (the push redeploys the site), or lets staff
// download the files. A GitHub token is kept only in this browser tab (sessionStorage) and sent only to api.github.com.
// Drafts are saved in this browser (localStorage) until published or discarded.
(function () {
  var d = document, root = d.querySelector('[data-finder-admin]');
  if (!root) return;
  var base = root.getAttribute('data-base') || '', REPO = root.getAttribute('data-repo'), BRANCH = root.getAttribute('data-branch') || 'main', GA = root.getAttribute('data-ga');
  var FILES = ['majors', 'minors', 'interests', 'skills', 'recommend', 'questions', 'colleges-custom'];
  var DIR = 'src/data/finder/';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ls = { get: function (k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }, del: function (k) { try { localStorage.removeItem(k); } catch (e) {} } };
  var token = function () { try { return sessionStorage.getItem('cei-admin-token') || ''; } catch (e) { return ''; } };
  var ORIG = {}, DRAFT = {}, SHA = {}, PAY = null, COL = null, tab = 'overview', sel = {}, q = {};
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };
  var changed = function (f) { return JSON.stringify(DRAFT[f]) !== JSON.stringify(ORIG[f]); };

  Promise.all(FILES.map(function (f) { return fetch(base + '/assets/finder/source/' + f + '.json', { cache: 'no-store' }).then(function (r) { return r.json(); }); }).concat([fetch(base + '/assets/finder/data.json').then(function (r) { return r.json(); })]))
    .then(function (all) {
      FILES.forEach(function (f, i) { ORIG[f] = all[i]; });
      PAY = all[FILES.length];
      var saved = ls.get('cei-finder-admin-draft');
      FILES.forEach(function (f) { DRAFT[f] = saved && saved[f] ? saved[f] : clone(ORIG[f]); });
      frame(); show();
    }).catch(function (e) { root.innerHTML = '<p class="callout warn">The admin data could not load (' + esc(e.message) + ').</p>'; });

  var persist = function () { ls.set('cei-finder-admin-draft', DRAFT); badge(); };
  var careers = function () { return PAY.careers; };
  var cName = function (s) { var c = PAY.careers[s]; return c ? c[0] : s + ' (missing)'; };
  var TABS = [['overview', 'Overview'], ['majors', 'Majors'], ['minors', 'Minors'], ['interests', 'Interests'], ['skills', 'Skills'], ['courses', 'Courses & ranking'], ['colleges', 'Colleges'], ['questions', 'Questions'], ['test', 'Test recommendations'], ['analytics', 'Analytics & leads'], ['publish', 'Publish']];

  function frame() {
    root.innerHTML = '<div class="adm"><nav class="adm-tabs" aria-label="Admin sections">' + TABS.map(function (t) { return '<button type="button" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</nav><p class="adm-status" data-status aria-live="polite"></p><div class="adm-body" data-body></div></div>';
    root.addEventListener('click', onClick); root.addEventListener('change', onChange); root.addEventListener('input', onInput);
    badge();
  }
  function badge() {
    var n = FILES.filter(changed).length, st = root.querySelector('[data-status]');
    if (st) st.innerHTML = n ? '<strong>' + n + ' file' + (n === 1 ? '' : 's') + ' with unpublished changes</strong> (' + FILES.filter(changed).join(', ') + '.json). <button class="link-btn" type="button" data-tab="publish">Review and publish</button>' : 'No unpublished changes.' + (token() ? ' Connected to GitHub.' : '');
  }
  function show() {
    [].forEach.call(root.querySelectorAll('[data-tab]'), function (b) { if (b.closest('.adm-tabs')) b.setAttribute('aria-current', b.getAttribute('data-tab') === tab ? 'page' : 'false'); });
    var body = root.querySelector('[data-body]');
    body.innerHTML = ({ overview: overview, majors: function () { return coll('majors'); }, minors: function () { return coll('minors'); }, interests: function () { return coll('interests'); }, skills: function () { return coll('skills'); }, courses: courses, colleges: colleges, questions: questions, test: test, analytics: analytics, publish: publish })[tab]();
    if (tab === 'colleges') loadColleges();
    if (tab === 'test') runTest();
  }

  // ---------- Validation (same rules as the build: src/lib/finder.mjs checkFinder) ----------
  function validate() {
    var errs = [], C = careers(), D = DRAFT;
    var maj = {}, min = {}, int = {}, fld = {}, cats = {};
    PAY.categories.forEach(function (c) { cats[c.slug] = 1; });
    D.majors.fields.forEach(function (f) { fld[f.slug] = 1; });
    D.majors.majors.forEach(function (m) { if (maj[m.slug]) errs.push('Duplicate major ' + m.slug); maj[m.slug] = 1; });
    D.minors.minors.forEach(function (m) { if (min[m.slug]) errs.push('Duplicate minor ' + m.slug); min[m.slug] = 1; });
    D.interests.interests.forEach(function (m) { if (int[m.slug]) errs.push('Duplicate interest ' + m.slug); int[m.slug] = 1; });
    var slugOk = function (k, s) { if (!/^[a-z0-9-]+$/.test(s || '')) errs.push(k + ' "' + s + '": slug must use lowercase letters, numbers and hyphens'); };
    var car = function (where, s) { if (!C[s]) errs.push(where + ': no CEI career or training "' + s + '"'); };
    D.majors.majors.forEach(function (m) {
      slugOk('Major', m.slug); if (!m.name) errs.push('Major ' + m.slug + ': name is required');
      if (!fld[m.field]) errs.push('Major ' + m.slug + ': unknown field ' + m.field);
      (m.careers || []).forEach(function (s) { car('Major ' + m.slug, s); });
      (m.minors || []).forEach(function (p) { if (!min[p[0]]) errs.push('Major ' + m.slug + ': unknown minor ' + p[0]); });
      (m.interests || []).forEach(function (s) { if (!int[s]) errs.push('Major ' + m.slug + ': unknown interest ' + s); });
      if (!(m.cip || []).length) errs.push('Major ' + m.slug + ': add at least one CIP code');
      (m.cip || []).forEach(function (c) { if (!/^\d\d(\.\d{2}(\d{2})?)?$/.test(c)) errs.push('Major ' + m.slug + ': bad CIP code ' + c); });
    });
    D.minors.minors.forEach(function (m) { slugOk('Minor', m.slug); (m.careers || []).forEach(function (s) { car('Minor ' + m.slug, s); }); (m.interests || []).forEach(function (s) { if (!int[s]) errs.push('Minor ' + m.slug + ': unknown interest ' + s); }); });
    D.interests.interests.forEach(function (m) { slugOk('Interest', m.slug); (m.careers || []).forEach(function (s) { car('Interest ' + m.slug, s); }); (m.fields || []).forEach(function (f) { if (!cats[f]) errs.push('Interest ' + m.slug + ': unknown career field ' + f); }); (m.majors || []).forEach(function (s) { if (!maj[s]) errs.push('Interest ' + m.slug + ': unknown major ' + s); }); });
    D.skills.skills.forEach(function (m) { slugOk('Skill', m.slug); (m.careers || []).forEach(function (s) { car('Skill ' + m.slug, s); }); });
    var R = D.recommend;
    Object.keys(R.boosts || {}).forEach(function (s) { car('Boosts', s); });
    (R.hide || []).forEach(function (s) { car('Hidden courses', s); });
    Object.keys(R.pins || {}).forEach(function (m) { if (!maj[m]) errs.push('Pins: unknown major ' + m); R.pins[m].forEach(function (s) { car('Pins ' + m, s); }); });
    Object.keys(R.courseOverrides || {}).forEach(function (s) { car('Course overrides', s); var o = R.courseOverrides[s]; ['url', 'enrollUrl'].forEach(function (k) { if (o[k] && !/^\/[^\s]*$/.test(o[k])) errs.push('Course override ' + s + ': ' + k + ' must be a path on this site starting with /'); }); });
    return errs;
  }

  // ---------- Overview ----------
  function overview() {
    var errs = validate(), D = DRAFT;
    return '<h2>Overview</h2><ul class="facts"><li class="fact"><div class="k">Majors</div><div class="v">' + D.majors.majors.length + '</div><div class="n">in ' + D.majors.fields.length + ' fields</div></li><li class="fact"><div class="k">Minors</div><div class="v">' + D.minors.minors.length + '</div></li><li class="fact"><div class="k">Interests</div><div class="v">' + D.interests.interests.length + '</div></li><li class="fact"><div class="k">Skills</div><div class="v">' + D.skills.skills.length + '</div></li><li class="fact"><div class="k">CEI trainings</div><div class="v">' + Object.keys(careers()).length + '</div><div class="n">the course catalog</div></li></ul>'
      + (errs.length ? '<div class="callout warn"><p><strong>' + errs.length + ' problem(s) to fix before publishing:</strong></p><ul>' + errs.slice(0, 40).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div>' : '<p class="callout info">All mappings point at real CEI trainings and existing majors, minors and interests.</p>')
      + '<h3>How this works</h3><ul><li><strong>Course catalog is the source of truth.</strong> Every recommendation is a CEI training that exists: one job-title training per career profile, plus the checkout courses. Prices and course pages come from the catalog (src/data/course-pricing.mjs and the provider catalog); here you can only change how a training is described in the finder, its link, and how it ranks.</li><li><strong>Majors, minors, interests and skills</strong> connect to careers. A connected career’s training becomes a candidate, ranked by the weights in Courses &amp; ranking. Order matters: careers listed first count more.</li><li><strong>Colleges</strong> come from the U.S. Department of Education (IPEDS), refreshed with <code>npm run update-colleges</code>. Use the Colleges tab only for verified corrections.</li><li><strong>Publishing</strong> commits the changed files to GitHub (' + esc(REPO) + ', branch ' + esc(BRANCH) + '). The site rebuilds and deploys in a few minutes. The build re-checks every mapping and stops if something is wrong.</li><li><strong>User interactions, leads, course clicks and conversions</strong> are measured in Google Analytics 4. See Analytics &amp; leads.</li></ul>';
  }

  // ---------- Collections (majors, minors, interests, skills) ----------
  var SCHEMA = {
    majors: [['slug', 'slug', 'Slug (page address /college-majors/<slug>/)'], ['name', 'text', 'Name'], ['field', 'field', 'Field'], ['summary', 'textarea', 'Summary (one sentence)'], ['about', 'textarea', 'About (short paragraph)'], ['degrees', 'text', 'Typical degrees'], ['study', 'lines', 'What you study (one per line)'], ['skills', 'lines', 'Skills (one per line)'], ['careers', 'careers', 'Career paths (CEI careers, most relevant first: drives career suggestions and training recommendations)'], ['pins', 'pins', 'Pinned trainings (always listed first for this major)'], ['minors', 'pairs', 'Suggested minors and why they pair well'], ['interests', 'refs:interests', 'Interests'], ['cip', 'lines', 'CIP program codes or prefixes (one per line; used to find colleges that offer the major)'], ['aka', 'text', 'Other names (comma separated, for search)']],
    minors: [['slug', 'slug', 'Slug (page address /college-minors/<slug>/)'], ['name', 'text', 'Name'], ['summary', 'textarea', 'Summary'], ['complements', 'textarea', 'How it complements a major'], ['skills', 'lines', 'Skills (one per line)'], ['careers', 'careers', 'Related CEI careers (most relevant first)'], ['interests', 'refs:interests', 'Interests'], ['aka', 'text', 'Other names']],
    interests: [['slug', 'slug', 'Slug'], ['name', 'text', 'Name'], ['featured', 'bool', 'Show as a card (otherwise found by search or “more interests”)'], ['icon', 'icon', 'Icon'], ['blurb', 'text', 'Short description'], ['fields', 'refs:categories', 'CEI career fields'], ['careers', 'careers', 'CEI careers (most relevant first)'], ['majors', 'refs:majors', 'Suggested majors'], ['keywords', 'text', 'Search keywords']],
    skills: [['slug', 'slug', 'Slug'], ['name', 'text', 'Name'], ['icon', 'icon', 'Icon'], ['blurb', 'textarea', 'Short description'], ['why', 'textarea', 'Why it matters'], ['tips', 'lines', 'How to start (one per line)'], ['careers', 'careers', 'CEI trainings that build this skill directly'], ['match', 'lines', 'Match words (found in career skills and duties; takes effect after publishing)'], ['all', 'bool', 'Every CEI training teaches this skill']]
  };
  var listOf = function (k) { return k === 'majors' ? DRAFT.majors.majors : DRAFT[k][k]; };
  function coll(k) {
    var items = listOf(k), qq = (q[k] || '').toLowerCase(), cur = sel[k] != null ? sel[k] : 0;
    var shown = items.map(function (x, i) { return [x, i]; }).filter(function (p) { return !qq || (p[0].name + ' ' + p[0].slug).toLowerCase().indexOf(qq) > -1; });
    return '<h2>' + k.charAt(0).toUpperCase() + k.slice(1) + '</h2>' + (k === 'majors' ? fieldsEditor() : '') + '<div class="adm-split"><div class="adm-list"><input type="search" placeholder="Search ' + k + '" data-q="' + k + '" value="' + esc(q[k] || '') + '" aria-label="Search ' + k + '"><button class="btn btn-sm" type="button" data-add="' + k + '">+ Add</button><ul>' + shown.map(function (p) { return '<li><button type="button" data-pick="' + k + '" data-i="' + p[1] + '"' + (p[1] === cur ? ' aria-current="true"' : '') + '>' + esc(p[0].name || p[0].slug || '(new)') + '</button></li>'; }).join('') + '</ul></div><div class="adm-form">' + (items[cur] ? form(k, items[cur], cur) : '<p>Nothing selected.</p>') + '</div></div>';
  }
  function fieldsEditor() {
    return '<details class="adm-fields"><summary>Major fields (' + DRAFT.majors.fields.length + ')</summary><table class="adm-table"><thead><tr><th>Slug</th><th>Name</th><th>Icon</th><th>Description</th></tr></thead><tbody>' + DRAFT.majors.fields.map(function (f, i) { return '<tr><td><input data-fset="' + i + '" data-k="slug" value="' + esc(f.slug) + '"></td><td><input data-fset="' + i + '" data-k="name" value="' + esc(f.name) + '"></td><td><input data-fset="' + i + '" data-k="icon" value="' + esc(f.icon) + '"></td><td><input data-fset="' + i + '" data-k="blurb" value="' + esc(f.blurb) + '"></td></tr>'; }).join('') + '</tbody></table><button class="btn btn-sm" type="button" data-act="add-field">+ Add field</button></details>';
  }
  function form(k, item, i) {
    return '<form data-form="' + k + '" data-i="' + i + '">' + SCHEMA[k].map(function (f) {
      var key = f[0], type = f[1], label = f[2], v = item[key], id = 'f-' + k + '-' + key;
      var wrap = function (inner) { return '<div class="field"><label for="' + id + '">' + esc(label) + '</label>' + inner + '</div>'; };
      if (type === 'slug' || type === 'text' || type === 'icon') return wrap('<input id="' + id + '" data-key="' + key + '" value="' + esc(v || '') + '"' + (type === 'slug' ? ' pattern="[a-z0-9-]+"' : '') + '>');
      if (type === 'textarea') return wrap('<textarea id="' + id + '" data-key="' + key + '" rows="3">' + esc(v || '') + '</textarea>');
      if (type === 'lines') return wrap('<textarea id="' + id + '" data-key="' + key + '" data-lines rows="4">' + esc((v || []).join('\n')) + '</textarea>');
      if (type === 'bool') return '<label class="check"><input type="checkbox" data-key="' + key + '"' + (v ? ' checked' : '') + '> <span>' + esc(label) + '</span></label>';
      if (type === 'field') return wrap('<select id="' + id + '" data-key="' + key + '">' + DRAFT.majors.fields.map(function (x) { return '<option value="' + x.slug + '"' + (x.slug === v ? ' selected' : '') + '>' + esc(x.name) + '</option>'; }).join('') + '</select>');
      if (type === 'careers') return refs(id, key, label, v || [], 'careers', true);
      if (type === 'pins') return refs(id, key, label, (DRAFT.recommend.pins || {})[item.slug] || [], 'careers', true, 'pins');
      if (type.indexOf('refs:') === 0) return refs(id, key, label, v || [], type.slice(5), false);
      if (type === 'pairs') return '<fieldset class="field"><legend>' + esc(label) + '</legend>' + (v || []).map(function (p, j) { return '<div class="adm-pair"><select data-pair="' + j + '" data-pk="0" aria-label="Minor">' + DRAFT.minors.minors.map(function (m) { return '<option value="' + m.slug + '"' + (m.slug === p[0] ? ' selected' : '') + '>' + esc(m.name) + '</option>'; }).join('') + '</select><input data-pair="' + j + '" data-pk="1" value="' + esc(p[1]) + '" aria-label="Why it pairs well"><button class="btn btn-sm" type="button" data-pair-del="' + j + '" aria-label="Remove">×</button></div>'; }).join('') + '<button class="btn btn-sm" type="button" data-pair-add>+ Add minor</button></fieldset>';
      return '';
    }).join('') + '<p class="btn-row"><button class="btn btn-sm" type="button" data-del="' + k + '" data-i="' + i + '">Delete this ' + k.slice(0, -1) + '</button>' + (k === 'majors' ? ' <button class="btn btn-sm" type="button" data-act="test-major" data-v="' + esc(item.slug) + '">Test its recommendations</button>' : '') + '</p></form>';
  }
  function refOptions(src) {
    if (src === 'careers') return Object.keys(careers()).map(function (s) { return [s, cName(s) + ' (' + s + ')']; });
    if (src === 'categories') return PAY.categories.map(function (c) { return [c.slug, c.name]; });
    if (src === 'interests') return DRAFT.interests.interests.map(function (x) { return [x.slug, x.name]; });
    if (src === 'majors') return DRAFT.majors.majors.map(function (x) { return [x.slug, x.name]; });
    if (src === 'minors') return DRAFT.minors.minors.map(function (x) { return [x.slug, x.name]; });
    return [];
  }
  function refs(id, key, label, list, src, ordered, target) {
    var opts = refOptions(src), names = {}; opts.forEach(function (o) { names[o[0]] = o[1]; });
    var dl = 'dl-' + src;
    return '<fieldset class="field adm-refs" data-refs="' + key + '" data-src="' + src + '"' + (target ? ' data-target="' + target + '"' : '') + '><legend>' + esc(label) + '</legend><ol>' + list.map(function (s, j) { return '<li><span>' + esc(names[s] || s + ' (missing)') + '</span>' + (ordered ? '<button type="button" class="btn btn-sm" data-ref-up="' + j + '" aria-label="Move up">↑</button><button type="button" class="btn btn-sm" data-ref-down="' + j + '" aria-label="Move down">↓</button>' : '') + '<button type="button" class="btn btn-sm" data-ref-del="' + j + '" aria-label="Remove">×</button></li>'; }).join('') + '</ol><input list="' + dl + '" placeholder="Type to add…" data-ref-add aria-label="Add to ' + esc(label) + '"><datalist id="' + dl + '">' + opts.map(function (o) { return '<option value="' + esc(o[1]) + '">'; }).join('') + '</datalist></fieldset>';
  }
  function currentItem(f) { var k = f.getAttribute('data-form'); return [k, listOf(k)[+f.getAttribute('data-i')]]; }
  function refList(fs, item) { var key = fs.getAttribute('data-refs'); if (fs.getAttribute('data-target') === 'pins') { var p = DRAFT.recommend.pins = DRAFT.recommend.pins || {}; return p[item.slug] = p[item.slug] || []; } return item[key] = item[key] || []; }

  // ---------- Courses & ranking ----------
  function courses() {
    var R = DRAFT.recommend, W = R.weights, qq = (q.courses || '').toLowerCase();
    var list = Object.keys(careers()).filter(function (s) { var c = careers()[s]; return !qq || (c[0] + ' ' + s + ' ' + c[6][0]).toLowerCase().indexOf(qq) > -1; });
    return '<h2>Courses &amp; ranking</h2><h3>Weights</h3><p class="small muted">Points a training earns for each connection to a visitor’s answers. A training needs at least the minimum score to be recommended, so unrelated courses are never shown just to fill space.</p><div class="adm-grid">'
      + Object.keys(W).map(function (k) { return '<label class="field"><span>' + esc(k) + '</span><input type="number" step="0.5" data-w="' + k + '" value="' + W[k] + '"></label>'; }).join('')
      + ['minScore', 'maxCourses', 'maxCareers', 'maxCoursesPerStep', 'positionDecay', 'positionFloor'].map(function (k) { return '<label class="field"><span>' + k + '</span><input type="number" step="0.01" data-cfg="' + k + '" value="' + R[k] + '"></label>'; }).join('') + '</div>'
      + '<h3>Course catalog (' + Object.keys(careers()).length + ' trainings)</h3><p class="small muted">Boost: extra points (negative to demote). Hide: never recommend. Overrides change only how the training appears in the finder; leave blank to use the catalog. Course pages and prices are managed in the catalog.</p><input type="search" placeholder="Search trainings" data-q="courses" value="' + esc(q.courses || '') + '" aria-label="Search trainings">'
      + '<div class="table-wrap"><table class="adm-table"><thead><tr><th>Training</th><th>Price</th><th>Boost</th><th>Hide</th><th>Name override</th><th>Description override</th><th>Page URL</th><th>Enroll URL</th></tr></thead><tbody>'
      + list.slice(0, 80).map(function (s) { var c = careers()[s], o = (R.courseOverrides || {})[s] || {}; return '<tr><td><a href="' + base + c[6][1] + '" target="_blank" rel="noopener">' + esc(c[6][0]) + '</a><div class="small muted">' + esc(s) + '</div></td><td>$' + Number(c[6][2]).toFixed(2) + '</td><td><input type="number" step="1" data-boost="' + s + '" value="' + ((R.boosts || {})[s] || '') + '" style="width:5em"></td><td><input type="checkbox" data-hide="' + s + '"' + ((R.hide || []).indexOf(s) > -1 ? ' checked' : '') + '></td>' + ['name', 'description', 'url', 'enrollUrl'].map(function (k) { return '<td><input data-ov="' + s + '" data-k="' + k + '" value="' + esc(o[k] || '') + '" placeholder="' + esc(k === 'name' ? c[6][0] : k === 'url' ? c[6][1] : k === 'enrollUrl' ? c[6][4] : 'catalog text') + '"></td>'; }).join('') + '</tr>'; }).join('')
      + '</tbody></table></div>' + (list.length > 80 ? '<p class="small muted">Showing 80 of ' + list.length + '. Search to find others.</p>' : '');
  }

  // ---------- Colleges ----------
  function colleges() {
    var C = DRAFT['colleges-custom'];
    return '<h2>Colleges (corrections to IPEDS)</h2><p>The college directory comes from the U.S. Department of Education (IPEDS) and is refreshed with <code>npm run update-colleges</code>. Use this page only for corrections you have verified on the school’s official website.</p>'
      + '<h3>Current changes</h3><ul>' + (C.add.length || Object.keys(C.edit).length || C.hide.length ? C.add.map(function (a, i) { return '<li>Added: ' + esc(a.name) + ' (' + esc(a.city) + ', ' + esc(a.state) + ') <button class="link-btn" type="button" data-cadd-del="' + i + '">Remove</button></li>'; }).join('') + Object.keys(C.edit).map(function (id) { return '<li>Edited ' + id + ': ' + esc(JSON.stringify(C.edit[id])) + ' <button class="link-btn" type="button" data-cedit-del="' + id + '">Undo</button></li>'; }).join('') + C.hide.map(function (id) { return '<li>Hidden: ' + id + ' <button class="link-btn" type="button" data-chide-del="' + id + '">Unhide</button></li>'; }).join('') : '<li>None.</li>') + '</ul>'
      + '<h3>Find a college to edit or hide</h3><input type="search" placeholder="College name" data-cq aria-label="Search colleges"><div data-cres><p class="muted small">Loading the directory…</p></div>'
      + '<h3>Add a college missing from IPEDS</h3><form data-cnew class="adm-grid">' + [['name', 'Name'], ['city', 'City'], ['state', 'State (2 letters)'], ['zip', 'ZIP'], ['web', 'Official website (https://…)']].map(function (f) { return '<label class="field"><span>' + f[1] + '</span><input name="' + f[0] + '" required></label>'; }).join('')
      + '<label class="field"><span>Type</span><select name="control"><option value="1">Public</option><option value="2">Private nonprofit</option><option value="3">Private for-profit</option></select></label><label class="field"><span>Level</span><select name="level"><option value="1">Four-year</option><option value="2">Two-year</option></select></label><label class="check"><input type="checkbox" name="online"> <span>Offers fully online programs</span></label><label class="check"><input type="checkbox" name="grad"> <span>Graduate programs</span></label><button class="btn btn-sm" type="submit">Add college</button></form>';
  }
  function loadColleges() {
    var go = function () {
      var box = root.querySelector('[data-cres]'), inp = root.querySelector('[data-cq]'); if (!box) return;
      var qq = (inp.value || '').toLowerCase().trim();
      if (qq.length < 3) { box.innerHTML = '<p class="muted small">Type at least three letters.</p>'; return; }
      var C = DRAFT['colleges-custom'];
      var hits = COL.rows.filter(function (r) { return r[1].toLowerCase().indexOf(qq) > -1; }).slice(0, 15);
      box.innerHTML = '<table class="adm-table"><thead><tr><th>College</th><th>City</th><th>Website</th><th>Online</th><th></th></tr></thead><tbody>' + hits.map(function (r) { var e = C.edit[r[0]] || {}; return '<tr><td>' + esc(e.name || r[1]) + '<div class="small muted">IPEDS id ' + r[0] + '</div></td><td>' + esc(e.city || r[2]) + ', ' + r[3] + '</td><td><input data-cedit="' + r[0] + '" data-k="web" value="' + esc(e.web || r[5]) + '"></td><td><select data-cedit="' + r[0] + '" data-k="online"><option value="1"' + ((e.online != null ? e.online : r[10] & 1) ? ' selected' : '') + '>Yes</option><option value="0"' + ((e.online != null ? e.online : r[10] & 1) ? '' : ' selected') + '>No</option></select></td><td><button class="btn btn-sm" type="button" data-chide="' + r[0] + '">' + (C.hide.indexOf(r[0]) > -1 ? 'Hidden' : 'Hide') + '</button></td></tr>'; }).join('') + '</tbody></table>';
    };
    if (COL) return go();
    fetch(base + '/assets/finder/colleges.json').then(function (r) { return r.json(); }).then(function (j) { COL = j; go(); });
    root._cgo = go;
  }

  // ---------- Questions ----------
  function questions() {
    var Q = DRAFT.questions;
    var block = function (k, title) { return '<h3>' + title + '</h3><table class="adm-table"><thead><tr><th>Value (keep stable)</th><th>Label</th><th>Hint</th></tr></thead><tbody>' + Q[k].map(function (o, i) { return '<tr><td><code>' + esc(o.value) + '</code></td><td><input data-qk="' + k + '" data-i="' + i + '" data-k="label" value="' + esc(o.label) + '"></td><td>' + (o.hint != null || k !== 'stages' ? '<input data-qk="' + k + '" data-i="' + i + '" data-k="hint" value="' + esc(o.hint || '') + '">' : '') + '</td></tr>'; }).join('') + '</tbody></table>'; };
    return '<h2>Questions</h2>' + block('goals', 'Step 1: What are you hoping to find?') + block('stages', 'Step 2: Stage of education') + block('careerGoalTypes', 'Step 7: Type of career goal')
      + '<h3>Notes on the results page by stage</h3>' + Object.keys(Q.stageNotes).map(function (k) { return '<div class="field"><label>' + esc(k) + '</label><textarea data-note="' + k + '" rows="2">' + esc(Q.stageNotes[k]) + '</textarea></div>'; }).join('');
  }

  // ---------- Test recommendations ----------
  function engineData() {
    var C = {}; Object.keys(careers()).forEach(function (s) { var c = careers()[s]; C[s] = { t: c[0], c: c[1], r: c[4], k: 1, o: c[8] || 0 }; });
    var map = function (list, fn) { var o = {}; list.forEach(function (x) { o[x.slug] = fn(x); }); return o; };
    return { config: DRAFT.recommend, fields: PAY.engine.fields, careers: C,
      majors: map(DRAFT.majors.majors, function (m) { return { name: m.name, careers: m.careers || [] }; }), minors: map(DRAFT.minors.minors, function (m) { return { name: m.name, careers: m.careers || [] }; }),
      interests: map(DRAFT.interests.interests, function (m) { return { name: m.name, careers: m.careers || [], fields: m.fields || [] }; }),
      skills: map(DRAFT.skills.skills, function (m) { var e = PAY.engine.skills[m.slug] || {}; return { name: m.name, careers: m.careers || [], all: !!m.all, matched: e.matched || [] }; }) };
  }
  var T = { majors: [], minors: [], interests: [], careers: [], industries: [], skills: [] };
  function test() {
    var pick = function (k, opts) { return '<div class="field"><label>' + k + '</label><select multiple size="6" data-t="' + k + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (T[k].indexOf(o[0]) > -1 ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></div>'; };
    return '<h2>Test recommendations</h2><p>Build a sample visitor and see exactly what the finder would recommend with your unpublished changes, and why. Hold Ctrl (or Cmd) to select several.</p><div class="adm-grid">' + pick('majors', refOptions('majors')) + pick('minors', refOptions('minors')) + pick('interests', refOptions('interests')) + pick('skills', DRAFT.skills.skills.map(function (s) { return [s.slug, s.name]; })) + pick('industries', refOptions('categories')) + pick('careers', refOptions('careers')) + '</div><div data-tres></div>';
  }
  function runTest() {
    var box = root.querySelector('[data-tres]'); if (!box || !window.CEIRecommend) return;
    var r = CEIRecommend.recommend(engineData(), T), R = DRAFT.recommend;
    var row = function (x, i, show) { return '<tr' + (i < show ? '' : ' class="muted"') + '><td>' + (i + 1) + '</td><td>' + esc(careers()[x.slug][6][0]) + '</td><td>' + x.score + '</td><td class="small">' + x.reasons.map(CEIRecommend.reasonText).map(esc).join('; ') + '</td></tr>'; };
    box.innerHTML = '<h3>Recommended trainings</h3>' + (r.courses.length ? '<table class="adm-table"><thead><tr><th>#</th><th>Training</th><th>Score</th><th>Why</th></tr></thead><tbody>' + r.courses.slice(0, 15).map(function (x, i) { return row(x, i, R.maxCourses); }).join('') + '</tbody></table><p class="small muted">The finder shows the top ' + R.maxCourses + ' (greyed rows are below the cut). Minimum score: ' + R.minScore + '.</p>' : '<p>No training reaches the minimum score (' + R.minScore + ') for this profile.</p>')
      + '<h3>Career paths</h3><p>' + (r.careers.slice(0, R.maxCareers).map(function (x) { return esc(careers()[x.slug][0]) + ' (' + x.career + ')'; }).join(', ') || 'None') + '</p>';
  }

  // ---------- Analytics & leads ----------
  function analytics() {
    var ev = [['finder_start', 'Someone began the questionnaire (entry: direct or major_page)'], ['finder_step', 'Each step viewed (step_number, step_name): build a funnel from these'], ['finder_select', 'Each selection (item_type: interest, major, minor, career, skill, industry, stage, goal; item_name)'], ['finder_complete', 'Results reached (majors, minors, interests, careers, skills, stage, course_count)'], ['view_item_list', 'Training recommendations shown (item_list_id says where; items list the courses)'], ['select_item', 'A recommended course link clicked'], ['course_enroll_click', 'An Enroll / Start learning button clicked (course_id, item_list_id)'], ['finder_course_page_view', 'A training page visited within 30 days of finishing the finder'], ['add_to_cart', 'A training added to the cart'], ['enroll_request', 'An enrollment request form sent'], ['purchase', 'A checkout course bought (value, items)'], ['generate_lead', 'A finder lead form sent (lead_type: finder_results or info_request)'], ['finder_results_download / finder_results_email / finder_share', 'Results saved or shared'], ['college_search / college_view / college_save', 'College search used, a college opened or saved'], ['finder_view_major / finder_view_career / finder_compare_majors', 'Details opened, majors compared']];
    return '<h2>Analytics &amp; leads</h2><p>The site is static, so visitor activity is measured in Google Analytics 4' + (GA ? ' (property ' + esc(GA) + ')' : '') + ' and, if configured, Google Tag Manager (<code>site.config.mjs → analytics.gtm</code>). Visitors with Global Privacy Control or the site opt-out are not tracked, and names and emails are never sent to analytics.</p><p><a class="btn btn-primary" href="https://analytics.google.com/" target="_blank" rel="noopener">Open Google Analytics</a></p>'
      + '<h3>Events</h3><table class="adm-table"><thead><tr><th>Event</th><th>Meaning</th></tr></thead><tbody>' + ev.map(function (e) { return '<tr><td><code>' + esc(e[0]) + '</code></td><td>' + esc(e[1]) + '</td></tr>'; }).join('') + '</tbody></table>'
      + '<h3>Which academic interests lead to sales</h3><p>Course visits, cart adds, enrollment requests and purchases within 30 days of finishing the finder carry <code>finder_assisted</code>, <code>finder_major</code>, <code>finder_minor</code>, <code>finder_interest</code>, <code>finder_stage</code> and <code>finder_recommended</code> (yes when the course was one we recommended). Register these as event-scoped custom dimensions in GA4 (Admin → Custom definitions), then build an Exploration: rows <code>finder_major</code>, values event count and purchase revenue, filtered to <code>purchase</code> or <code>enroll_request</code>.</p>'
      + '<h3>Suggested reports</h3><ul><li><strong>Funnel:</strong> finder_start → finder_step (step 5 majors) → finder_complete → select_item → course_enroll_click → purchase.</li><li><strong>Most selected majors and minors:</strong> finder_select, item_type = major or minor, by item_name.</li><li><strong>Most recommended courses:</strong> view_item_list items (Monetization → Ecommerce, item list).</li><li><strong>Conversion rate:</strong> finder_complete ÷ finder_start, and purchase or enroll_request ÷ finder_complete.</li></ul>'
      + '<h3>Leads</h3><p>Lead forms send to ' + (root.closest('body').querySelector('[data-finder]') ? '' : '') + 'the address in <code>site.config.mjs → finder.leadEndpoint</code> as JSON when it is set (for example a Zapier or Make webhook, a Google Apps Script web app that writes to a Google Sheet, or a CRM form endpoint). Without an endpoint, information requests open a pre-filled email to the enrollment inbox, and visitors who email themselves their results and agree to follow-up copy the inbox. Each lead includes education level, majors, minors, interests, career goals, skills, recommended courses and the visitor’s consent choices.</p>';
  }

  // ---------- Publish ----------
  function publish() {
    var errs = validate(), ch = FILES.filter(changed);
    return '<h2>Publish</h2>' + (errs.length ? '<div class="callout warn"><p>Fix these before publishing:</p><ul>' + errs.slice(0, 30).map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div>' : '')
      + '<p>' + (ch.length ? 'Changed files: ' + ch.map(function (f) { return '<code>' + DIR + f + '.json</code>'; }).join(', ') : 'No changes yet.') + '</p>'
      + '<h3>Option 1: publish to GitHub</h3><p>Use a fine-grained personal access token with <strong>Contents: read and write</strong> on ' + esc(REPO) + ' only. It is kept in this browser tab and sent only to api.github.com. Publishing commits to <code>' + esc(BRANCH) + '</code>; the site rebuilds automatically.</p>'
      + '<div class="adm-grid"><label class="field"><span>GitHub token</span><input type="password" data-token value="' + (token() ? '••••••••' : '') + '" autocomplete="off"></label></div><p class="btn-row"><button class="btn" type="button" data-act="connect">Save token for this tab</button><button class="btn" type="button" data-act="pull">Load latest from GitHub</button><button class="btn btn-primary" type="button" data-act="push"' + (errs.length || !ch.length ? ' disabled' : '') + '>Publish ' + ch.length + ' file' + (ch.length === 1 ? '' : 's') + '</button></p>'
      + '<h3>Option 2: download the files</h3><p>Download each changed file and replace it in <code>' + DIR + '</code> (for example with GitHub’s web editor: Add file → Upload files).</p><p class="btn-row">' + FILES.map(function (f) { return '<button class="btn btn-sm' + (changed(f) ? ' btn-primary' : '') + '" type="button" data-dl="' + f + '">' + f + '.json</button>'; }).join('') + '</p>'
      + '<h3>Discard</h3><p><button class="btn btn-sm" type="button" data-act="discard">Discard all unpublished changes</button></p><div data-log></div>';
  }
  var api = function (path, opt) { opt = opt || {}; opt.headers = Object.assign({ Authorization: 'Bearer ' + token(), Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }, opt.headers || {}); return fetch('https://api.github.com/repos/' + REPO + path, opt).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.message || r.status); return j; }); }); };
  var b64 = function (s) { return btoa(unescape(encodeURIComponent(s))); }, unb64 = function (s) { return decodeURIComponent(escape(atob(s.replace(/\n/g, '')))); };
  var log = function (m) { var el = root.querySelector('[data-log]'); if (el) el.insertAdjacentHTML('beforeend', '<p>' + m + '</p>'); };
  function pull() {
    if (!token()) return log('Save a token first.');
    log('Loading the latest files from GitHub…');
    Promise.all(FILES.map(function (f) { return api('/contents/' + DIR + f + '.json?ref=' + encodeURIComponent(BRANCH)).then(function (j) { SHA[f] = j.sha; return [f, JSON.parse(unb64(j.content))]; }); })).then(function (all) {
      var diff = all.filter(function (x) { return JSON.stringify(x[1]) !== JSON.stringify(ORIG[x[0]]); }).map(function (x) { return x[0]; });
      all.forEach(function (x) { if (!changed(x[0])) DRAFT[x[0]] = clone(x[1]); ORIG[x[0]] = x[1]; });
      persist(); log('Loaded. ' + (diff.length ? 'Newer on GitHub than this page: ' + diff.join(', ') + '. Unchanged drafts were updated; drafts you edited were kept, so check them before publishing.' : 'This page already matched GitHub.'));
    }).catch(function (e) { log('<strong>Could not load:</strong> ' + esc(e.message)); });
  }
  function push() {
    var ch = FILES.filter(changed); if (!ch.length) return;
    if (!token()) return log('Save a token first.');
    var who = prompt('Your name, for the commit message:', '') || 'CEI staff';
    var seq = Promise.resolve();
    ch.forEach(function (f) {
      seq = seq.then(function () { return SHA[f] ? SHA[f] : api('/contents/' + DIR + f + '.json?ref=' + encodeURIComponent(BRANCH)).then(function (j) { if (JSON.stringify(JSON.parse(unb64(j.content))) !== JSON.stringify(ORIG[f])) throw new Error(f + '.json changed on GitHub since this page loaded. Use “Load latest from GitHub” first.'); return (SHA[f] = j.sha); }); })
        .then(function (sha) { return api('/contents/' + DIR + f + '.json', { method: 'PUT', body: JSON.stringify({ message: 'Finder admin: update ' + f + '.json (' + who + ')', content: b64(JSON.stringify(DRAFT[f], null, 2) + '\n'), sha: sha, branch: BRANCH }) }); })
        .then(function (j) { SHA[f] = j.content.sha; ORIG[f] = clone(DRAFT[f]); persist(); log('Published ' + f + '.json.'); });
    });
    seq.then(function () { log('<strong>Done.</strong> The site rebuilds in a few minutes; check the Actions tab on GitHub if it does not update.'); ls.del('cei-finder-admin-draft'); badge(); }).catch(function (e) { log('<strong>Stopped:</strong> ' + esc(e.message)); });
  }

  // ---------- Events ----------
  function onClick(e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.hasAttribute('data-tab')) { tab = t.getAttribute('data-tab'); show(); return; }
    if (t.hasAttribute('data-pick')) { sel[t.getAttribute('data-pick')] = +t.getAttribute('data-i'); show(); return; }
    if (t.hasAttribute('data-add')) {
      var k = t.getAttribute('data-add'), list = listOf(k);
      var blank = { majors: { slug: '', name: 'New major', field: DRAFT.majors.fields[0].slug, summary: '', about: '', study: [], skills: [], degrees: '', careers: [], minors: [], interests: [], cip: [], aka: '' }, minors: { slug: '', name: 'New minor', summary: '', complements: '', skills: [], careers: [], interests: [], aka: '' }, interests: { slug: '', name: 'New interest', featured: false, icon: 'f-bulb', blurb: '', fields: [], careers: [], majors: [], keywords: '' }, skills: { slug: '', name: 'New skill', icon: 'f-bulb', blurb: '', why: '', tips: [], careers: [], match: [] } }[k];
      list.push(blank); sel[k] = list.length - 1; persist(); show(); return;
    }
    if (t.hasAttribute('data-del')) {
      var k2 = t.getAttribute('data-del'), i2 = +t.getAttribute('data-i'), it = listOf(k2)[i2];
      if (!confirm('Delete ' + (it.name || it.slug) + '? References to it elsewhere will show as problems until removed.')) return;
      listOf(k2).splice(i2, 1); sel[k2] = 0; persist(); show(); return;
    }
    if (t.hasAttribute('data-dl')) { var f = t.getAttribute('data-dl'), a = d.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(DRAFT[f], null, 2) + '\n'], { type: 'application/json' })); a.download = f + '.json'; a.click(); return; }
    var fs = t.closest('[data-refs]'), frm = t.closest('[data-form]');
    if (fs && frm) {
      var item = currentItem(frm)[1], l = refList(fs, item), j;
      if (t.hasAttribute('data-ref-del')) l.splice(+t.getAttribute('data-ref-del'), 1);
      else if (t.hasAttribute('data-ref-up')) { j = +t.getAttribute('data-ref-up'); if (j > 0) l.splice(j - 1, 0, l.splice(j, 1)[0]); }
      else if (t.hasAttribute('data-ref-down')) { j = +t.getAttribute('data-ref-down'); if (j < l.length - 1) l.splice(j + 1, 0, l.splice(j, 1)[0]); }
      if (fs.getAttribute('data-target') === 'pins' && !l.length) delete DRAFT.recommend.pins[item.slug];
      persist(); show(); return;
    }
    if (frm && t.hasAttribute('data-pair-add')) { var it3 = currentItem(frm)[1]; it3.minors.push([DRAFT.minors.minors[0].slug, '']); persist(); show(); return; }
    if (frm && t.hasAttribute('data-pair-del')) { currentItem(frm)[1].minors.splice(+t.getAttribute('data-pair-del'), 1); persist(); show(); return; }
    var C = DRAFT['colleges-custom'];
    if (t.hasAttribute('data-chide')) { var id = +t.getAttribute('data-chide'), x = C.hide.indexOf(id); if (x > -1) C.hide.splice(x, 1); else C.hide.push(id); persist(); show(); return; }
    if (t.hasAttribute('data-chide-del')) { C.hide.splice(C.hide.indexOf(+t.getAttribute('data-chide-del')), 1); persist(); show(); return; }
    if (t.hasAttribute('data-cedit-del')) { delete C.edit[t.getAttribute('data-cedit-del')]; persist(); show(); return; }
    if (t.hasAttribute('data-cadd-del')) { C.add.splice(+t.getAttribute('data-cadd-del'), 1); persist(); show(); return; }
    var act = t.getAttribute('data-act');
    if (act === 'add-field') { DRAFT.majors.fields.push({ slug: 'new-field', name: 'New field', icon: 'f-bulb', blurb: '' }); persist(); show(); }
    else if (act === 'test-major') { T = { majors: [t.getAttribute('data-v')], minors: [], interests: [], careers: [], industries: [], skills: [] }; tab = 'test'; show(); }
    else if (act === 'connect') { var v = root.querySelector('[data-token]').value.trim(); if (v && v.indexOf('•') < 0) { try { sessionStorage.setItem('cei-admin-token', v); } catch (x2) {} log('Token saved for this tab.'); badge(); } }
    else if (act === 'pull') pull();
    else if (act === 'push') push();
    else if (act === 'discard') { if (confirm('Discard all unpublished changes?')) { FILES.forEach(function (f2) { DRAFT[f2] = clone(ORIG[f2]); }); ls.del('cei-finder-admin-draft'); badge(); show(); } }
  }
  function onChange(e) {
    var t = e.target, frm = t.closest('[data-form]');
    if (frm && t.hasAttribute('data-key')) {
      var item = currentItem(frm)[1], key = t.getAttribute('data-key'), old = item.slug;
      item[key] = t.type === 'checkbox' ? t.checked : t.hasAttribute('data-lines') ? t.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean) : t.value.trim();
      if (key === 'slug' && old && old !== item.slug && frm.getAttribute('data-form') === 'majors' && DRAFT.recommend.pins && DRAFT.recommend.pins[old]) { DRAFT.recommend.pins[item.slug] = DRAFT.recommend.pins[old]; delete DRAFT.recommend.pins[old]; }
      persist(); if (key === 'name') { var b = root.querySelector('.adm-list [aria-current="true"]'); if (b) b.textContent = item.name; }
      return;
    }
    if (frm && t.hasAttribute('data-ref-add')) {
      var fs = t.closest('[data-refs]'), it = currentItem(frm)[1], opts = refOptions(fs.getAttribute('data-src')), hit = opts.filter(function (o) { return o[1] === t.value || o[0] === t.value; })[0];
      if (hit) { var l = refList(fs, it); if (l.indexOf(hit[0]) < 0) l.push(hit[0]); persist(); show(); var again = root.querySelector('[data-refs="' + fs.getAttribute('data-refs') + '"] [data-ref-add]'); if (again) again.focus(); }
      return;
    }
    if (frm && t.hasAttribute('data-pair')) { currentItem(frm)[1].minors[+t.getAttribute('data-pair')][+t.getAttribute('data-pk')] = t.value; persist(); return; }
    if (t.hasAttribute('data-fset')) { DRAFT.majors.fields[+t.getAttribute('data-fset')][t.getAttribute('data-k')] = t.value.trim(); persist(); return; }
    var R = DRAFT.recommend;
    if (t.hasAttribute('data-w')) { R.weights[t.getAttribute('data-w')] = Number(t.value); persist(); return; }
    if (t.hasAttribute('data-cfg')) { R[t.getAttribute('data-cfg')] = Number(t.value); persist(); return; }
    if (t.hasAttribute('data-boost')) { var s = t.getAttribute('data-boost'); R.boosts = R.boosts || {}; if (t.value === '' || Number(t.value) === 0) delete R.boosts[s]; else R.boosts[s] = Number(t.value); persist(); return; }
    if (t.hasAttribute('data-hide')) { var s2 = t.getAttribute('data-hide'); R.hide = (R.hide || []).filter(function (x) { return x !== s2; }); if (t.checked) R.hide.push(s2); persist(); return; }
    if (t.hasAttribute('data-ov')) { var s3 = t.getAttribute('data-ov'), k = t.getAttribute('data-k'); R.courseOverrides = R.courseOverrides || {}; var o = R.courseOverrides[s3] = R.courseOverrides[s3] || {}; if (t.value.trim()) o[k] = t.value.trim(); else delete o[k]; if (!Object.keys(o).length) delete R.courseOverrides[s3]; persist(); return; }
    if (t.hasAttribute('data-qk')) { DRAFT.questions[t.getAttribute('data-qk')][+t.getAttribute('data-i')][t.getAttribute('data-k')] = t.value; persist(); return; }
    if (t.hasAttribute('data-note')) { DRAFT.questions.stageNotes[t.getAttribute('data-note')] = t.value; persist(); return; }
    if (t.hasAttribute('data-t')) { T[t.getAttribute('data-t')] = [].filter.call(t.options, function (o) { return o.selected; }).map(function (o) { return o.value; }); runTest(); return; }
    if (t.hasAttribute('data-cedit')) { var C = DRAFT['colleges-custom'], id = t.getAttribute('data-cedit'), e2 = C.edit[id] = C.edit[id] || {}; e2[t.getAttribute('data-k')] = t.getAttribute('data-k') === 'online' ? Number(t.value) : t.value.trim(); persist(); return; }
  }
  function onInput(e) {
    var t = e.target;
    if (t.hasAttribute('data-q')) { var k = t.getAttribute('data-q'); q[k] = t.value; clearTimeout(t._tm); t._tm = setTimeout(function () { show(); var el = root.querySelector('[data-q="' + k + '"]'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }, 250); }
    if (t.hasAttribute('data-cq') && root._cgo) { clearTimeout(t._tm); t._tm = setTimeout(root._cgo, 200); }
    if (t.hasAttribute('data-cq') && !root._cgo) loadColleges();
  }
  root.addEventListener('submit', function (e) {
    var f = e.target; if (!f.hasAttribute('data-cnew')) return; e.preventDefault();
    var v = function (n) { return f.elements[n].type === 'checkbox' ? (f.elements[n].checked ? 1 : 0) : f.elements[n].value.trim(); };
    if (!v('name') || !/^[A-Z]{2}$/.test(v('state')) || !/^https?:\/\//.test(v('web'))) { alert('Enter a name, a two-letter state and the official website address starting with https://'); return; }
    var C = DRAFT['colleges-custom'];
    C.add.push({ id: 9000000 + C.add.reduce(function (m, a) { return Math.max(m, (+a.id || 9000000) - 9000000); }, 0) + 1, name: v('name'), city: v('city'), state: v('state'), zip: v('zip'), web: v('web'), control: +v('control'), level: +v('level'), online: v('online'), grad: v('grad'), ug: 1 });
    persist(); show();
  });
})();
