// College & Career Finder (/college-and-career-finder/). A nine-step questionnaire that ends in personalized results:
// academic interests, career paths, skills to develop and recommended CEI trainings (ranked by finder-engine.js).
// Answers are kept only in this browser (localStorage). There are no forms: visitors can download, email or share results themselves.
// Data: /assets/finder/data.json (built from src/data/finder/*.json and the course catalog).
(function () {
  var d = document, root = d.querySelector('[data-finder]');
  if (!root || !window.CEIRecommend) return;
  var base = root.getAttribute('data-base') || '';
  var E = window.CEIRecommend, KEY = 'cei-finder';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ico = function (k) { return '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><use href="#i-' + k + '"/></svg>'; };
  var store = { get: function (k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var STEPS = [['goals', 'Goals'], ['stage', 'Education'], ['interests', 'Interests'], ['colleges', 'Colleges'], ['majors', 'Majors'], ['minors', 'Minors'], ['careers', 'Careers'], ['skills', 'Skills'], ['results', 'Results']];
  var fresh = function () { return { v: 1, step: 0, goals: [], stage: '', interests: [], colleges: [], collegeInfo: {}, majors: [], minors: [], ctype: '', careers: [], industries: [], skills: [] }; };
  var S = fresh(), P = null, ENG = null, DETAIL = null;
  var ui = { field: '', mq: '', nq: '', cq: '', iq: '', moreInterests: false, compare: [] };

  // ---------- Load ----------
  fetch(base + '/assets/finder/data.json').then(function (r) { return r.json(); }).then(init).catch(function () {
    root.innerHTML = '<div class="callout"><p>The finder could not load. Please refresh the page. You can also explore <a href="' + base + '/college-majors/">college majors</a> and <a href="' + base + '/careers/">careers</a> directly.</p></div>';
  });

  function init(data) {
    P = data;
    var careers = {};
    Object.keys(P.careers).forEach(function (k) { var c = P.careers[k]; careers[k] = { t: c[0], c: c[1], r: c[4], k: 1, o: c[8] || 0 }; });
    var map = function (list, fn) { var o = {}; list.forEach(function (x) { o[x.slug] = fn(x); }); return o; };
    P.major = map(P.majors, function (x) { return x; }); P.minor = map(P.minors, function (x) { return x; });
    P.interest = map(P.interests, function (x) { return x; }); P.skill = map(P.skills, function (x) { return x; });
    P.field = map(P.fields, function (x) { return x; });
    ENG = {
      config: P.engine.config, fields: P.engine.fields, careers: careers,
      majors: map(P.majors, function (m) { return { name: m.name, careers: m.careers }; }),
      minors: map(P.minors, function (m) { return { name: m.name, careers: m.careers }; }),
      interests: map(P.interests, function (i) { return { name: i.name, careers: i.careers, fields: i.fields }; }),
      skills: map(P.skills, function (s) { return { name: s.name, careers: s.careers, all: !!P.engine.skills[s.slug].all, matched: P.engine.skills[s.slug].matched }; })
    };
    var q = new URLSearchParams(location.search), shared = q.get('r'), saved = store.get(KEY);
    if (shared) { try { S = Object.assign(fresh(), clean(JSON.parse(decodeURIComponent(escape(atob(shared.replace(/-/g, '+').replace(/_/g, '/'))))))); S.step = 8; } catch (e) {} }
    else if (saved && saved.v === 1) S = Object.assign(fresh(), clean(saved));
    if (q.get('major') && P.major[q.get('major')]) { if (S.majors.indexOf(q.get('major')) < 0) S.majors.push(q.get('major')); S.step = 4; }
    root.innerHTML = '<div class="fz"><nav class="fz-steps" aria-label="Finder steps"><ol data-steps></ol></nav><div class="fz-bar" aria-hidden="true"><i data-bar></i></div><p class="fz-of" data-of></p><section class="fz-panel" data-panel></section><div class="fz-nav" data-nav></div></div><dialog class="dlg" data-dlg aria-labelledby="dlg-title"><div class="dlg-in"><button class="dlg-x" type="button" data-close aria-label="Close">×</button><div data-dlg-body></div></div></dialog>';
    bind();
    go(S.step, true);
  }
  // Keep only known keys and values from saved or shared answers
  function clean(o) {
    var f = fresh(), out = {};
    var known = function (list, set) { return (Array.isArray(list) ? list : []).filter(function (x) { return set ? !!set[x] : true; }); };
    out.step = Math.min(8, Math.max(0, +o.step || 0));
    out.goals = known(o.goals).filter(function (g) { return P.questions.goals.some(function (x) { return x.value === g; }); });
    out.stage = P.questions.stages.some(function (x) { return x.value === o.stage; }) ? o.stage : '';
    out.interests = known(o.interests, P.interest); out.majors = known(o.majors, P.major); out.minors = known(o.minors, P.minor);
    out.careers = known(o.careers, P.careers); out.skills = known(o.skills, P.skill);
    out.industries = known(o.industries).filter(function (x) { return P.categories.some(function (c) { return c.slug === x; }); });
    out.ctype = ['specific', 'industry', 'general', 'exploring'].indexOf(o.ctype) > -1 ? o.ctype : '';
    out.colleges = known(o.colleges).map(Number).filter(Boolean).slice(0, 50);
    out.collegeInfo = {}; out.colleges.forEach(function (id) { var c = o.collegeInfo && o.collegeInfo[id]; if (c) out.collegeInfo[id] = [String(c[0]), String(c[1]), String(c[2]), /^https?:\/\//.test(c[3]) ? c[3] : '']; });
    return Object.assign(f, out);
  }
  var save = function () { store.set(KEY, S); };
  var profile = function () { return { majors: S.majors, minors: S.minors, interests: S.interests, careers: S.careers, industries: S.industries, skills: S.skills }; };
  var career = function (s) { var c = P.careers[s]; return c && { slug: s, title: c[0], cat: c[1], blurb: c[2], hard: c[3], related: c[4], train: c[5], course: { name: c[6][0], url: c[6][1], price: c[6][2], hours: c[6][3], buy: c[6][4], buyLabel: c[6][5], desc: c[6][6] }, aka: c[7] }; };
  var courseDesc = function (c) { return c.course.desc || 'A self-paced online course on what the ' + c.title.toLowerCase() + ' job involves: duties, key terms, step-by-step tasks, tools, safety and how to launch the career.'; };
  var catName = function (slug) { var c = P.categories.filter(function (x) { return x.slug === slug; })[0]; return c ? c.name : slug; };
  var toggle = function (list, v) { var i = list.indexOf(v); if (i > -1) { list.splice(i, 1); return false; } list.push(v); return true; };
  var select = function (type, list, v, name) {
    var on = toggle(list, v);
        if (on) 
    save();
    return on;
  };

  // ---------- Frame ----------
  function go(n, first) {
    S.step = n; save();
    var steps = root.querySelector('[data-steps]');
    steps.innerHTML = STEPS.map(function (s, i) { return '<li' + (i === n ? ' aria-current="step"' : '') + (i < n ? ' class="done"' : '') + '><button type="button" data-go="' + i + '"><span class="n">' + (i + 1) + '</span><span class="t">' + s[1] + '</span></button></li>'; }).join('');
    root.querySelector('[data-bar]').style.width = Math.round(((n + 1) / STEPS.length) * 100) + '%';
    root.querySelector('[data-of]').textContent = 'Step ' + (n + 1) + ' of ' + STEPS.length + ': ' + STEPS[n][1];
    draw();
    if (!first) { var h = root.querySelector('[data-panel] h2'); if (h) { h.focus({ preventScroll: true }); } root.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }
  function nav() {
    var n = S.step, el = root.querySelector('[data-nav]');
    var optional = n >= 2 && n <= 7;
    el.innerHTML = (n > 0 ? '<button class="btn" type="button" data-go="' + (n - 1) + '">Back</button>' : '<span></span>')
      + (n < 8 ? '<div class="fz-nav-r">' + (optional ? '<button class="btn btn-quiet" type="button" data-go="' + (n + 1) + '">Skip this step</button>' : '') + '<button class="btn btn-primary" type="button" data-go="' + (n + 1) + '">' + (n === 7 ? 'See my results' : 'Continue') + '</button></div>'
        : '<div class="fz-nav-r"><button class="btn" type="button" data-act="restart">Start over</button></div>');
  }
  function draw() {
    var panel = root.querySelector('[data-panel]');
    panel.innerHTML = [goals, stage, interests, colleges, majorsStep, minorsStep, careersStep, skillsStep, results][S.step]();
    nav();
    if (S.step === 3) mountColleges();
  }
  var head = function (t, sub) { return '<h2 tabindex="-1">' + t + '</h2>' + (sub ? '<p class="fz-sub">' + sub + '</p>' : ''); };
  var optCard = function (type, name, value, on, label, hint, icon) {
    return '<label class="opt-card' + (on ? ' on' : '') + '"><input type="' + type + '" name="' + name + '" value="' + esc(value) + '"' + (on ? ' checked' : '') + '>' + (icon ? '<span class="oc-ico">' + ico(icon) + '</span>' : '') + '<span class="oc-t">' + esc(label) + '</span>' + (hint ? '<span class="oc-h">' + esc(hint) + '</span>' : '') + '</label>';
  };

  // Contextual training: a few related CEI courses for what the visitor has picked so far
  function strip(prof, title, list, n) {
    var r = E.recommend(ENG, prof).courses.slice(0, n || ENG.config.maxCoursesPerStep || 3);
    if (!r.length) return '';
    return '<aside class="train-strip"><h3>' + esc(title) + '</h3><div class="ts-list">' + r.map(function (x) {
      var c = career(x.slug);
      return '<div class="ts-item"><a href="' + base + c.course.url + '">' + esc(c.course.name) + '</a><span class="small muted">' + esc(E.reasonText(x.reasons[0] || ['', ''])) + ' · $' + Number(c.course.price).toFixed(2) + '</span></div>';
    }).join('') + '</div><p class="small"><a href="' + base + '/training/">Explore related training</a></p></aside>';
  }
  // ---------- Steps ----------
  function goals() {
    return head('What are you hoping to find?', 'Choose as many as you like. Every step is optional, and you can come back to change your answers.')
      + '<fieldset class="opt-grid"><legend class="vh">What are you hoping to find?</legend>' + P.questions.goals.map(function (g) { return optCard('checkbox', 'goal', g.value, S.goals.indexOf(g.value) > -1, g.label, g.hint); }).join('') + '</fieldset>';
  }
  function stage() {
    return head('What stage of education are you in?', 'This helps us explain how college and career training can fit together for you.')
      + '<fieldset class="opt-grid opt-grid-sm"><legend class="vh">Stage of education</legend>' + P.questions.stages.map(function (s) { return optCard('radio', 'stage', s.value, S.stage === s.value, s.label); }).join('') + '</fieldset>';
  }
  function interests() {
    var q = ui.iq.toLowerCase().trim(), words = q.split(/\s+/).filter(Boolean);
    var list = P.interests.filter(function (i) {
      if (words.length) { var k = (i.name + ' ' + i.keywords + ' ' + i.blurb).toLowerCase(); return words.every(function (w) { return k.indexOf(w) > -1; }); }
      return i.featured || ui.moreInterests || S.interests.indexOf(i.slug) > -1;
    });
    var more = P.interests.filter(function (i) { return !i.featured; }).length;
    return head('What are you interested in?', 'Pick the areas that interest you. Search to find more.')
      + '<div class="fz-search"><label for="fz-iq">Search interests</label><input id="fz-iq" type="search" data-q="iq" value="' + esc(ui.iq) + '" placeholder="e.g. animals, law, aviation, sports" autocomplete="off"></div>'
      + '<fieldset class="opt-grid opt-grid-ico"><legend class="vh">Areas of interest</legend>' + (list.map(function (i) { return optCard('checkbox', 'interest', i.slug, S.interests.indexOf(i.slug) > -1, i.name, i.blurb, i.icon); }).join('') || '<p>No interests match “' + esc(ui.iq) + '”. Try another word.</p>') + '</fieldset>'
      + (!words.length ? '<p><button class="link-btn" type="button" data-act="more-interests" aria-expanded="' + ui.moreInterests + '">' + (ui.moreInterests ? 'Show fewer interests' : 'Show ' + more + ' more interests') + '</button></p>' : '')
      + (S.interests.length ? strip({ interests: S.interests }, 'Training related to your interests', 'finder_interests') : '');
  }
  function colleges() {
    return head('Find colleges and universities', 'Search ' + 'U.S. colleges by name, location, type and program. Save any that interest you to your results. You can skip this step.')
      + '<div class="college-app" data-college-mount></div>';
  }
  var collegeWidget = null;
  function mountColleges() {
    var el = root.querySelector('[data-college-mount]');
    if (!el || !window.CEIColleges) return;
    collegeWidget = window.CEIColleges.mount(el, {
      base: base, saved: S.colleges, majors: S.majors, params: { mine: S.majors.length ? 1 : 0 }, compact: true,
      onSave: function (ids, rows) {
        S.colleges = ids;
        ids.forEach(function (id) { if (!S.collegeInfo[id]) { var r = rows.filter(function (x) { return x[0] === id; })[0]; if (r) S.collegeInfo[id] = [r[1], r[2], r[3], r[5]]; } });
        Object.keys(S.collegeInfo).forEach(function (id) { if (ids.indexOf(+id) < 0) delete S.collegeInfo[id]; });
                save();
      }
    });
  }
  function majorCard(m) {
    var on = S.majors.indexOf(m.slug) > -1, cmp = ui.compare.indexOf(m.slug) > -1;
    return '<article class="pick-card' + (on ? ' on' : '') + '"><h3>' + esc(m.name) + '</h3><p class="small muted">' + esc(P.field[m.field].name) + '</p><p>' + esc(m.summary) + '</p><div class="pc-act"><button class="btn btn-sm' + (on ? ' btn-primary' : '') + '" type="button" data-pick="major" data-v="' + m.slug + '" aria-pressed="' + on + '">' + (on ? 'Selected' : 'Select') + '<span class="vh"> ' + esc(m.name) + '</span></button><button class="btn btn-sm" type="button" data-detail="major" data-v="' + m.slug + '">Details<span class="vh"> about ' + esc(m.name) + '</span></button><label class="pc-cmp"><input type="checkbox" data-compare="' + m.slug + '"' + (cmp ? ' checked' : '') + '> Compare</label></div></article>';
  }
  function majorsStep() {
    var q = ui.mq.toLowerCase().trim(), words = q.split(/\s+/).filter(Boolean);
    var suggested = []; S.interests.forEach(function (i) { (P.interest[i].majors || []).forEach(function (m) { if (suggested.indexOf(m) < 0 && P.major[m]) suggested.push(m); }); });
    var list = P.majors.filter(function (m) {
      if (ui.field && m.field !== ui.field) return false;
      if (words.length) { var k = (m.name + ' ' + m.aka + ' ' + m.summary + ' ' + P.field[m.field].name).toLowerCase(); return words.every(function (w) { return k.indexOf(w) > -1; }); }
      return true;
    });
    if (!ui.field && !words.length && suggested.length) list.sort(function (a, b) { var x = suggested.indexOf(a.slug), y = suggested.indexOf(b.slug); return (x < 0 ? 999 : x) - (y < 0 ? 999 : y); });
    return head('Explore college majors', 'Select the majors you are considering. Open Details to see what you would study, the skills you would build and where each major can lead. Check Compare on two or three to see them side by side.')
      + chosen('major', S.majors, function (s) { return P.major[s].name; })
      + (ui.compare.length ? '<p class="fz-cmpbar"><button class="btn btn-sm btn-primary" type="button" data-act="compare"' + (ui.compare.length < 2 ? ' disabled' : '') + '>Compare ' + ui.compare.length + ' majors</button> <button class="link-btn small" type="button" data-act="compare-clear">Clear</button>' + (ui.compare.length < 2 ? ' <span class="small muted">Pick at least two.</span>' : '') + '</p>' : '')
      + '<div class="fz-filter"><div class="fz-search"><label for="fz-mq">Search majors</label><input id="fz-mq" type="search" data-q="mq" value="' + esc(ui.mq) + '" placeholder="e.g. nursing, cybersecurity, logistics" autocomplete="off"></div>'
      + '<div class="fz-search"><label for="fz-mf">Field</label><select id="fz-mf" data-field><option value="">All fields</option>' + P.fields.map(function (f) { return '<option value="' + f.slug + '"' + (ui.field === f.slug ? ' selected' : '') + '>' + esc(f.name) + '</option>'; }).join('') + '</select></div></div>'
      + (!ui.field && !words.length && suggested.length ? '<p class="small muted">Majors that match your interests are listed first.</p>' : '')
      + '<p class="small muted" aria-live="polite">' + list.length + (list.length === 1 ? ' major' : ' majors') + '</p>'
      + '<div class="pick-grid">' + list.map(majorCard).join('') + '</div>'
      + (S.majors.length ? strip({ majors: S.majors }, 'Start building skills for your majors', 'finder_majors') : '');
  }
  function chosen(type, list, name) {
    if (!list.length) return '';
    return '<div class="chosen"><span class="small">Your ' + type + 's:</span> ' + list.map(function (s) { return '<button class="chip chip-x" type="button" data-pick="' + type + '" data-v="' + s + '" aria-label="Remove ' + esc(name(s)) + '">' + esc(name(s)) + ' ×</button>'; }).join(' ') + '</div>';
  }
  function minorsStep() {
    var q = ui.nq.toLowerCase().trim(), words = q.split(/\s+/).filter(Boolean);
    var minorCard = function (m, why) {
      var on = S.minors.indexOf(m.slug) > -1;
      return '<article class="pick-card' + (on ? ' on' : '') + '"><h3>' + esc(m.name) + '</h3><p>' + esc(why || m.summary) + '</p><div class="pc-act"><button class="btn btn-sm' + (on ? ' btn-primary' : '') + '" type="button" data-pick="minor" data-v="' + m.slug + '" aria-pressed="' + on + '">' + (on ? 'Selected' : 'Select') + '<span class="vh"> ' + esc(m.name) + '</span></button><button class="btn btn-sm" type="button" data-detail="minor" data-v="' + m.slug + '">Details<span class="vh"> about ' + esc(m.name) + '</span></button></div></article>';
    };
    var sug = S.majors.map(function (s) { var mj = P.major[s]; return '<h3 class="fz-h3">Suggested for ' + esc(mj.name) + '</h3><div class="pick-grid">' + mj.minors.map(function (x) { return minorCard(P.minor[x[0]], x[1]); }).join('') + '</div>'; }).join('');
    var all = P.minors.filter(function (m) { if (!words.length) return true; var k = (m.name + ' ' + m.aka + ' ' + m.summary).toLowerCase(); return words.every(function (w) { return k.indexOf(w) > -1; }); });
    return head('Choose minors that complement your major', S.majors.length ? 'A minor adds skills your major may not cover. Here are minors that pair well with your majors, and why.' : 'A minor adds skills and knowledge to your main field of study. Pick a major in the previous step to see tailored suggestions, or browse all minors below.')
      + chosen('minor', S.minors, function (s) { return P.minor[s].name; }) + sug
      + '<h3 class="fz-h3">' + (S.majors.length ? 'Search all minors' : 'All minors') + '</h3><div class="fz-search"><label for="fz-nq">Search minors</label><input id="fz-nq" type="search" data-q="nq" value="' + esc(ui.nq) + '" placeholder="e.g. psychology, data, Spanish" autocomplete="off"></div>'
      + '<div class="pick-grid">' + all.map(function (m) { return minorCard(m); }).join('') + '</div>'
      + (S.minors.length ? strip({ minors: S.minors, majors: S.majors }, 'Training related to your major and minor', 'finder_minors') : '');
  }
  function careersStep() {
    var t = S.ctype, body = '';
    if (t === 'specific') {
      var q = ui.cq.toLowerCase().trim(), words = q.split(/\s+/).filter(Boolean), hits = [];
      if (words.length) Object.keys(P.careers).forEach(function (s) { var c = P.careers[s], k = (c[0] + ' ' + c[7]).toLowerCase(); if (words.every(function (w) { return k.indexOf(w) > -1; })) hits.push(s); });
      hits.sort(function (a, b) { return P.careers[a][0].toLowerCase().indexOf(q) - P.careers[b][0].toLowerCase().indexOf(q) || (P.careers[b][8] || 0) - (P.careers[a][8] || 0); });
      body = '<div class="fz-search"><label for="fz-cq">Search ' + Object.keys(P.careers).length + ' careers</label><input id="fz-cq" type="search" data-q="cq" value="' + esc(ui.cq) + '" placeholder="e.g. nurse, electrician, data scientist" autocomplete="off"></div>'
        + (words.length ? '<div class="pick-grid">' + (hits.slice(0, 12).map(careerCard).join('') || '<p>No careers match. Try a different job title.</p>') + '</div>' : '');
    } else if (t === 'industry') {
      body = '<fieldset class="opt-grid opt-grid-sm"><legend class="fz-h3">Which industries interest you?</legend>' + P.categories.map(function (c) { return optCard('checkbox', 'industry', c.slug, S.industries.indexOf(c.slug) > -1, c.name, '', c.slug); }).join('') + '</fieldset>';
    }
    var r = E.recommend(ENG, { majors: S.majors, minors: S.minors, interests: S.interests, industries: S.industries, careers: S.careers });
    var sug = r.careers.map(function (x) { return x.slug; }).filter(function (s) { return S.careers.indexOf(s) < 0; }).slice(0, 12);
    return head('What type of career are you interested in?', 'Choose how you want to explore. Careers suggested from your answers appear below; select any that interest you.')
      + '<fieldset class="opt-grid opt-grid-sm"><legend class="vh">Type of career goal</legend>' + P.questions.careerGoalTypes.map(function (g) { return optCard('radio', 'ctype', g.value, t === g.value, g.label, g.hint); }).join('') + '</fieldset>'
      + body + chosen('career', S.careers, function (s) { return P.careers[s][0]; })
      + (S.careers.length ? '<div class="pick-grid">' + S.careers.map(careerCard).join('') + '</div>' : '')
      + (sug.length ? '<h3 class="fz-h3">' + (S.majors.length || S.interests.length || S.industries.length ? 'Suggested careers based on your answers' : 'Popular careers to explore') + '</h3><div class="pick-grid">' + sug.map(careerCard).join('') + '</div>' : (!S.careers.length && t !== 'specific' ? '<p class="callout">Pick some interests, majors or industries to see suggested careers, or search for a specific career.</p>' : ''))
      + (S.careers.length ? strip({ careers: S.careers }, 'Training for the careers you chose', 'finder_careers') : '')
      + '<p class="small muted">Career information is general. Pay, requirements and opportunities vary by employer and location, and no career outcome is guaranteed.</p>';
  }
  function careerCard(s) {
    var c = career(s), on = S.careers.indexOf(s) > -1;
    return '<article class="pick-card' + (on ? ' on' : '') + '"><h3>' + esc(c.title) + '</h3><p class="small muted">' + esc(catName(c.cat)) + ' · Typical training: ' + esc(c.train) + '</p><p>' + esc(c.blurb) + '</p><div class="pc-act"><button class="btn btn-sm' + (on ? ' btn-primary' : '') + '" type="button" data-pick="career" data-v="' + s + '" aria-pressed="' + on + '">' + (on ? 'Selected' : 'Select') + '<span class="vh"> ' + esc(c.title) + '</span></button><button class="btn btn-sm" type="button" data-detail="career" data-v="' + s + '">Details<span class="vh"> about ' + esc(c.title) + '</span></button></div></article>';
  }
  function skillsStep() {
    return head('Which skills do you want to develop?', 'Choose any that matter to you. We use them to find training that fits.')
      + '<fieldset class="opt-grid opt-grid-ico"><legend class="vh">Skills to develop</legend>' + P.skills.map(function (s) { return optCard('checkbox', 'skill', s.slug, S.skills.indexOf(s.slug) > -1, s.name, s.blurb, s.icon); }).join('') + '</fieldset>';
  }

  // ---------- Results ----------
  function rec() { return E.recommend(ENG, profile()); }
  function results() {
    var r = rec(), courses = r.courses.slice(0, ENG.config.maxCourses || 6), paths = r.careers.slice(0, ENG.config.maxCareers || 9);
    var stageNote = S.stage ? P.questions.stageNotes[S.stage] : '';
    var list = function (items, empty) { return items.length ? '<ul>' + items.join('') + '</ul>' : '<p class="small muted">' + empty + '</p>'; };
    var A = '<section class="res-sec" id="res-a"><h3>A. Your academic interests</h3><div class="res-cols">'
      + '<div><h4>Majors</h4>' + list(S.majors.map(function (s) { return '<li><a href="' + base + '/college-majors/' + s + '/">' + esc(P.major[s].name) + '</a></li>'; }), 'None selected') + '</div>'
      + '<div><h4>Minors</h4>' + list(S.minors.map(function (s) { return '<li><a href="' + base + '/college-minors/' + s + '/">' + esc(P.minor[s].name) + '</a></li>'; }), 'None selected') + '</div>'
      + '<div><h4>Areas of interest</h4>' + list(S.interests.map(function (s) { return '<li>' + esc(P.interest[s].name) + '</li>'; }), 'None selected') + '</div>'
      + '<div><h4>Colleges and universities</h4>' + list(S.colleges.map(function (id) { var c = S.collegeInfo[id] || []; return '<li>' + (c[3] ? '<a href="' + esc(c[3]) + '" rel="nofollow noopener external" target="_blank">' + esc(c[0]) + '</a>' : esc(c[0] || 'College ' + id)) + (c[1] ? ' <span class="small muted">' + esc(c[1]) + ', ' + esc(c[2]) + '</span>' : '') + '</li>'; }), 'None saved. <a href="#" data-go="3">Search colleges</a>') + '</div>'
      + '</div></section>';
    var B = '<section class="res-sec" id="res-b"><h3>B. Recommended career paths</h3>' + (paths.length ? '<div class="pick-grid">' + paths.map(function (x) {
      var c = career(x.slug);
      return '<article class="pick-card"><h4>' + esc(c.title) + '</h4><p>' + esc(c.blurb) + '</p><p class="small"><strong>Key skills:</strong> ' + esc(c.hard.slice(0, 3).join(', ')) + '</p><p class="small muted">' + esc(x.reasons.slice(0, 2).map(E.reasonText).join(' · ')) + '</p><div class="pc-act"><button class="btn btn-sm" type="button" data-detail="career" data-v="' + x.slug + '">Details</button><a class="btn btn-sm" href="' + base + '/careers/' + x.slug + '/">Career profile</a></div></article>';
    }).join('') + '</div>' : '<p>Choose a few interests, majors or careers to see career paths. <a href="#" data-go="2">Pick interests</a></p>') + '</section>';
    // Skills: the ones chosen, then skills common to the suggested careers and chosen majors
    var freq = {};
    paths.slice(0, 6).forEach(function (x) { career(x.slug).hard.forEach(function (h) { freq[h] = (freq[h] || 0) + 1; }); });
    S.majors.forEach(function (m) { P.major[m].skills.forEach(function (h) { freq[h] = (freq[h] || 0) + 2; }); });
    var common = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; }).slice(0, 10);
    var C = '<section class="res-sec" id="res-c"><h3>C. Recommended skills to develop</h3>'
      + (S.skills.length ? '<div class="skill-list">' + S.skills.map(function (s) { var k = P.skill[s]; return '<div class="sk"><h4>' + ico(k.icon) + ' <a href="' + base + '/skills-to-learn/' + s + '/">' + esc(k.name) + '</a></h4><p class="small">' + esc(k.why) + '</p><p class="small"><strong>Start with:</strong> ' + esc(k.tips[0]) + '.</p></div>'; }).join('') + '</div>' : '')
      + (common.length ? '<h4>Skills common to your majors and career paths</h4><ul class="chips skill-chips">' + common.map(function (h) { return '<li class="chip">' + esc(h) + '</li>'; }).join('') + '</ul>' : '')
      + (!S.skills.length && !common.length ? '<p><a href="#" data-go="7">Choose skills to develop</a></p>' : '') + '</section>';
    var D = '<section class="res-sec res-train" id="res-d"><h3>D. Recommended CEI training courses</h3>' + (courses.length
      ? '<p>Practical online courses from Career Education Institute matched to your majors, minors, career goals and skills. Each one is self-paced and focused on a single job.</p><div class="course-grid">' + courses.map(function (x) { return courseCard(x); }).join('') + '</div>'
      : '<p>We did not find training closely related to your answers yet. Add a major, interest or career goal, or browse the full catalog.</p>')
      + '<p class="btn-row"><a class="btn" href="' + base + '/training/">Browse all training programs</a></p></section>';
    var E5 = '<section class="res-sec" id="res-e"><h3>E. Why consider additional career training?</h3><p>Your college major can provide an academic foundation, while additional career training can help you develop practical knowledge and skills relevant to your professional interests.</p><p>You do not need to wait until graduation to start. A short course can help you test a career before you commit to a program, prepare for an internship or part-time job, and speak the language of the field in interviews.</p>' + (stageNote ? '<p><strong>For you:</strong> ' + esc(stageNote) + '</p>' : '') + '<p class="small muted">Career Education Institute is not a college, university, degree-granting institution or admissions service. CEI trainings are general, non-credit career-preparation courses: they do not replace a college degree, grant academic credit or guarantee employment.</p></section>';
    return head('Your personalized results', 'Based on your answers. Change any step to update them.')
      + '<p class="print-only">College &amp; Career Finder results from Career Education Institute, ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + '</p>'
      + '<div class="res-actions no-print"><button class="btn btn-primary" type="button" data-act="download">Download my results</button><button class="btn" type="button" data-act="email">Email my results</button><button class="btn" type="button" data-act="share">Copy a link to my results</button><span class="small muted" data-share-msg aria-live="polite"></span></div>'
      + '<nav class="res-toc no-print" aria-label="Results sections"><a href="#res-a">Academic interests</a><a href="#res-b">Career paths</a><a href="#res-c">Skills</a><a href="#res-d">Training</a><a href="#res-e">Why training</a></nav>'
      + A + B + C + D + E5;
  }
  function courseCard(x) {
    var c = career(x.slug), k = c.course, buy = k.buyLabel === 'Buy now';
    var item = esc(JSON.stringify({ k: buy ? 'course' : 'training', s: buy ? k.buy.split('course=')[1] : x.slug, t: k.name, p: k.price, u: base + k.url }));
    return '<article class="course-card"><div class="cc-head"><span class="ico">' + ico(c.cat) + '</span><div><h4><a href="' + base + k.url + '">' + esc(k.name) + '</a></h4><p class="cc-meta">Online, self-paced · about ' + k.hours + ' hours · $' + Number(k.price).toFixed(2) + '</p></div></div><p>' + esc(courseDesc(c)) + '</p><p class="cc-skills"><strong>Skills developed:</strong> ' + esc(c.hard.slice(0, 3).join(', ')) + '</p><p class="cc-why"><strong>Why it fits you:</strong> ' + esc(x.reasons.slice(0, 2).map(E.reasonText).join('; ')) + '.</p><div class="btn-row"><a class="btn btn-primary btn-sm" href="' + base + k.buy + '">' + (buy ? 'Start learning today' : 'Enroll in this course') + '</a><a class="btn btn-sm" href="' + base + k.url + '">View course details</a><button class="btn btn-sm btn-light no-print" type="button" data-add-cart="' + item + '">Add to cart</button></div></article>';
  }

  // Plain-text summary for emails
  function summary() {
    var r = rec(), lines = ['My College & Career Finder results (Career Education Institute)', ''];
    var sec = function (t, items) { if (items.length) { lines.push(t + ':'); items.forEach(function (i) { lines.push('- ' + i); }); lines.push(''); } };
    sec('Majors', S.majors.map(function (s) { return P.major[s].name + ': ' + location.origin + base + '/college-majors/' + s + '/'; }));
    sec('Minors', S.minors.map(function (s) { return P.minor[s].name; }));
    sec('Areas of interest', S.interests.map(function (s) { return P.interest[s].name; }));
    sec('Colleges', S.colleges.map(function (id) { var c = S.collegeInfo[id] || []; return (c[0] || id) + (c[3] ? ' (' + c[3] + ')' : ''); }));
    sec('Career paths', r.careers.slice(0, 9).map(function (x) { return P.careers[x.slug][0] + ': ' + location.origin + base + '/careers/' + x.slug + '/'; }));
    sec('Skills to develop', S.skills.map(function (s) { return P.skill[s].name; }));
    sec('Recommended training', r.courses.slice(0, ENG.config.maxCourses || 6).map(function (x) { var c = career(x.slug); return c.course.name + ' ($' + Number(c.course.price).toFixed(2) + '): ' + location.origin + base + c.course.url; }));
    lines.push('See these results again: ' + shareUrl());
    return lines.join('\n');
  }
  function shareUrl() {
    var o = { step: 8, goals: S.goals, stage: S.stage, interests: S.interests, majors: S.majors, minors: S.minors, ctype: S.ctype, careers: S.careers, industries: S.industries, skills: S.skills, colleges: S.colleges, collegeInfo: S.collegeInfo };
    return location.origin + location.pathname + '?r=' + btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  var mailto = function (to, cc, subject, body) { return 'mailto:' + to + '?' + (cc ? 'cc=' + encodeURIComponent(cc) + '&' : '') + 'subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body.length > 1800 ? body.slice(0, 1800) + '\n…' : body); };

  function download() { setTimeout(function () { window.print(); }, 150); }
  // ---------- Details dialogs ----------
  function openDlg(html) {
    var dlg = root.querySelector('[data-dlg]');
    dlg.querySelector('[data-dlg-body]').innerHTML = html;
    dlg._from = d.activeElement;
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
    dlg.querySelector('.dlg-in').scrollTop = 0;
    dlg.querySelector('[data-close]').focus();
  }
  function closeDlg() { var dlg = root.querySelector('[data-dlg]'); if (dlg.open) { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); } }
  var pickBtn = function (type, v, on, name) { return '<button class="btn btn-sm' + (on ? ' btn-primary' : '') + '" type="button" data-pick="' + type + '" data-v="' + v + '" aria-pressed="' + on + '">' + (on ? 'Selected' : 'Select this ' + type) + '<span class="vh"> ' + esc(name) + '</span></button>'; };
  function majorDetail(s) {
    var m = P.major[s];
    openDlg('<h2 id="dlg-title">' + esc(m.name) + '</h2><p class="small muted">' + esc(P.field[m.field].name) + ' · ' + esc(m.degrees) + '</p><p>' + esc(m.about) + '</p>'
      + '<p>' + pickBtn('major', s, S.majors.indexOf(s) > -1, m.name) + ' <a class="btn btn-sm" href="' + base + '/college-majors/' + s + '/">Full major guide</a></p>'
      + '<div class="dlg-cols"><div><h3>What you study</h3><ul>' + m.study.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div><div><h3>Skills you build</h3><ul>' + m.skills.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div></div>'
      + '<h3>Career opportunities</h3><ul class="dlg-links">' + m.careers.map(function (c) { return '<li><button class="link-btn" type="button" data-detail="career" data-v="' + c + '">' + esc(P.careers[c][0]) + '</button></li>'; }).join('') + '</ul>'
      + '<h3>Minors that pair well</h3><ul>' + m.minors.map(function (x) { return '<li><strong>' + esc(P.minor[x[0]].name) + ':</strong> ' + esc(x[1]) + '</li>'; }).join('') + '</ul>'
      + strip({ majors: [s] }, 'Related CEI training', 'finder_major_detail', 3));
  }
  function minorDetail(s) {
    var m = P.minor[s], pairs = [];
    P.majors.forEach(function (mj) { mj.minors.forEach(function (x) { if (x[0] === s) pairs.push([mj, x[1]]); }); });
    openDlg('<h2 id="dlg-title">' + esc(m.name) + ' minor</h2><p>' + esc(m.summary) + '</p><p>' + esc(m.complements) + '</p><p>' + pickBtn('minor', s, S.minors.indexOf(s) > -1, m.name) + ' <a class="btn btn-sm" href="' + base + '/college-minors/' + s + '/">Full minor guide</a></p>'
      + '<h3>Skills it adds</h3><ul class="chips">' + m.skills.map(function (x) { return '<li class="chip">' + esc(x) + '</li>'; }).join('') + '</ul>'
      + (pairs.length ? '<h3>Majors it complements</h3><ul>' + pairs.slice(0, 8).map(function (p) { return '<li><strong>' + esc(p[0].name) + ':</strong> ' + esc(p[1]) + '</li>'; }).join('') + '</ul>' : '')
      + strip({ minors: [s] }, 'Related CEI training', 'finder_minor_detail', 3));
  }
  function careerDetail(s) {
    var c = career(s), on = S.careers.indexOf(s) > -1;
    var render = function () {
      var x = DETAIL && DETAIL[s];
      openDlg('<h2 id="dlg-title">' + esc(c.title) + '</h2><p class="small muted">' + esc(catName(c.cat)) + ' · Typical training: ' + esc(c.train) + '</p><p>' + esc(x ? x[0] : c.blurb) + '</p><p>' + pickBtn('career', s, on, c.title) + ' <a class="btn btn-sm" href="' + base + '/careers/' + s + '/">Full career profile</a></p>'
        + (x ? '<div class="dlg-cols"><div><h3>Common responsibilities</h3><ul>' + x[1].map(function (y) { return '<li>' + esc(y) + '</li>'; }).join('') + '</ul></div><div><h3>Important skills</h3><ul>' + c.hard.concat(x[3]).map(function (y) { return '<li>' + esc(y) + '</li>'; }).join('') + '</ul></div></div><h3>Relevant education</h3><p>' + esc(x[2]) + ' <span class="small muted">Typical entry education (BLS): ' + esc(x[4]) + '.</span></p>' : '<p class="muted">Loading details…</p>')
        + (c.related.length ? '<h3>Related career paths</h3><ul class="dlg-links">' + c.related.filter(function (r) { return P.careers[r]; }).map(function (r) { return '<li><button class="link-btn" type="button" data-detail="career" data-v="' + r + '">' + esc(P.careers[r][0]) + '</button></li>'; }).join('') + '</ul>' : '')
        + '<aside class="train-strip"><h3>Training for this career</h3><div class="ts-item"><a href="' + base + c.course.url + '">' + esc(c.course.name) + '</a><span class="small muted">Online, self-paced · about ' + c.course.hours + ' hours · $' + Number(c.course.price).toFixed(2) + '</span></div><p class="btn-row"><a class="btn btn-primary btn-sm" href="' + base + c.course.buy + '">Develop skills for this career</a></p></aside>'
        + '<p class="small muted">Career information is general. Requirements vary by state and employer, and no career outcome is guaranteed.</p>');
    };
    render();
    if (!DETAIL) fetch(base + '/assets/finder/careers-detail.json').then(function (r) { return r.json(); }).then(function (j) { DETAIL = j; var dlg = root.querySelector('[data-dlg]'); if (dlg.open && dlg.querySelector('#dlg-title').textContent === c.title) render(); }).catch(function () {});
  }
  function compareDialog() {
    var ms = ui.compare.map(function (s) { return P.major[s]; });
    var row = function (label, fn) { return '<tr><th scope="row">' + label + '</th>' + ms.map(function (m) { return '<td>' + fn(m) + '</td>'; }).join('') + '</tr>'; };
    var ul = function (a) { return '<ul>' + a.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };
    openDlg('<h2 id="dlg-title">Compare majors</h2><div class="table-wrap"><table class="cmp"><thead><tr><th scope="col"><span class="vh">Topic</span></th>' + ms.map(function (m) { return '<th scope="col">' + esc(m.name) + '</th>'; }).join('') + '</tr></thead><tbody>'
      + row('Overview', function (m) { return esc(m.summary); }) + row('Typical degrees', function (m) { return esc(m.degrees); }) + row('What you study', function (m) { return ul(m.study.slice(0, 5)); }) + row('Skills', function (m) { return ul(m.skills.slice(0, 5)); })
      + row('Career paths', function (m) { return ul(m.careers.slice(0, 5).map(function (c) { return P.careers[c][0]; })); }) + row('Suggested minors', function (m) { return ul(m.minors.map(function (x) { return P.minor[x[0]].name; })); })
      + row('Related training', function (m) { var c = career(m.careers[0]); return '<a href="' + base + c.course.url + '">' + esc(c.course.name) + '</a>'; })
      + row('', function (m) { return pickBtn('major', m.slug, S.majors.indexOf(m.slug) > -1, m.name); }) + '</tbody></table></div>');
  }

  // ---------- Events ----------
  function bind() {
    root.addEventListener('click', function (e) {
      var t = e.target.closest('button, a'); if (!t || !root.contains(t)) return;
      if (t.hasAttribute('data-close')) { closeDlg(); return; }
      if (t.hasAttribute('data-go')) { e.preventDefault(); closeDlg(); go(+t.getAttribute('data-go')); return; }
      if (t.hasAttribute('data-detail')) { var k = t.getAttribute('data-detail'), v = t.getAttribute('data-v'); if (k === 'major') majorDetail(v); else if (k === 'minor') minorDetail(v); else careerDetail(v); return; }
      if (t.hasAttribute('data-pick')) {
        var type = t.getAttribute('data-pick'), val = t.getAttribute('data-v');
        var listFor = { major: S.majors, minor: S.minors, career: S.careers }[type];
        var name = type === 'major' ? P.major[val].name : type === 'minor' ? P.minor[val].name : P.careers[val][0];
        var on = select(type, listFor, val, name);
        var inDlg = t.closest('[data-dlg]');
        if (inDlg) { t.classList.toggle('btn-primary', on); t.setAttribute('aria-pressed', on); t.firstChild.textContent = on ? 'Selected' : 'Select this ' + type; }
        redraw(t);
        return;
      }
      var act = t.getAttribute('data-act');
      if (act === 'more-interests') { ui.moreInterests = !ui.moreInterests; redraw(t, '[data-act="more-interests"]'); }
      else if (act === 'compare') compareDialog();
      else if (act === 'compare-clear') { ui.compare = []; redraw(t); }
      else if (act === 'restart') { if (confirm('Clear all your answers and start over?')) { S = fresh(); ui.compare = []; save(); try { history.replaceState(null, '', location.pathname); } catch (x) {} go(0); } }
      else if (act === 'download') download();
      else if (act === 'email') location.href = mailto('', '', 'My College & Career Finder results', summary());
      else if (act === 'share') {
        var url = shareUrl(), msg = root.querySelector('[data-share-msg]');
        var done = function () { msg.textContent = 'Link copied. Anyone with the link can see these results.'; };
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt('Copy this link:', url); }); else prompt('Copy this link:', url);
      }
    });
    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'goal') { select('goal', S.goals, t.value, t.parentNode.querySelector('.oc-t').textContent); t.parentNode.classList.toggle('on', t.checked); }
      else if (t.name === 'stage') { S.stage = t.value; save(); [].forEach.call(root.querySelectorAll('[name="stage"]'), function (r) { r.parentNode.classList.toggle('on', r.checked); }); }
      else if (t.name === 'interest') { select('interest', S.interests, t.value, P.interest[t.value].name); redraw(t); }
      else if (t.name === 'skill') { select('skill', S.skills, t.value, P.skill[t.value].name); t.parentNode.classList.toggle('on', t.checked); }
      else if (t.name === 'industry') { select('industry', S.industries, t.value, catName(t.value)); redraw(t); }
      else if (t.name === 'ctype') { S.ctype = t.value; save(); redraw(t); }
      else if (t.hasAttribute('data-compare')) { var s = t.getAttribute('data-compare'); if (t.checked && ui.compare.length >= 3) { t.checked = false; alert('You can compare up to three majors.'); return; } toggle(ui.compare, s); redraw(t); }
      else if (t.hasAttribute('data-field')) { ui.field = t.value; redraw(t); }
    });
    root.addEventListener('input', function (e) {
      var t = e.target, k = t.getAttribute('data-q'); if (!k) return;
      ui[k] = t.value;
      clearTimeout(t._tm); t._tm = setTimeout(function () { redraw(t); }, 150);
    });
    var dlg = root.querySelector('[data-dlg]');
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDlg(); });
    dlg.addEventListener('close', function () { if (dlg._from && d.contains(dlg._from) && dlg._from.focus) dlg._from.focus(); if (S.step !== 8) redraw(null); });
  }
  // Re-render the current step and put focus back where it was (same control, or the matching one)
  function redraw(from, selector) {
    if (S.step === 3) return; // the college search keeps its own state
    var panel = root.querySelector('[data-panel]');
    var dlgOpen = root.querySelector('[data-dlg]').open;
    if (dlgOpen && from && from.closest('[data-dlg]')) return; // refreshed when the dialog closes
    var sel = selector || (from && (from.id ? '#' + from.id : from.getAttribute('data-pick') ? '[data-pick="' + from.getAttribute('data-pick') + '"][data-v="' + from.getAttribute('data-v') + '"]' : from.name && from.value ? '[name="' + from.name + '"][value="' + from.value + '"]' : from.hasAttribute('data-compare') ? '[data-compare="' + from.getAttribute('data-compare') + '"]' : ''));
    var pos = from && from.selectionStart, y = window.scrollY;
    panel.innerHTML = [goals, stage, interests, colleges, majorsStep, minorsStep, careersStep, skillsStep, results][S.step]();
    nav();
    window.scrollTo(0, y);
    if (sel) { var el = panel.querySelector(sel); if (el) { el.focus({ preventScroll: true }); if (pos != null && el.setSelectionRange) try { el.setSelectionRange(pos, pos); } catch (x) {} } }
  }
})();
