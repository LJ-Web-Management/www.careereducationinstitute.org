// College & Career Finder recommendation engine. One file, used two ways so results always match:
// in the browser (finder.js) as window.CEIRecommend, and at build time (src/lib/finder.mjs) to put
// related trainings on the major and minor pages.
//
// recommend(data, profile) ranks CEI career trainings (one per career profile) by how strongly they connect to the
// visitor's answers. Weights and limits come from src/data/finder/recommend.json (data.config). A training must reach
// config.minScore to be recommended, so unrelated courses are never added to fill space.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CEIRecommend = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  function recommend(data, profile) {
    var cfg = data.config || {}, W = cfg.weights || {};
    var careers = data.careers, scores = {}, skillPart = {}, reasons = {};
    var hide = {}; (cfg.hide || []).forEach(function (s) { hide[s] = 1; });
    var pos = function (i) { return Math.max(cfg.positionFloor || 0.55, 1 - (cfg.positionDecay || 0.07) * i); };
    var add = function (slug, pts, why, isSkill) {
      if (!careers[slug] || hide[slug] || !pts) return;
      scores[slug] = (scores[slug] || 0) + pts;
      if (isSkill) skillPart[slug] = (skillPart[slug] || 0) + pts;
      if (why) {
        var r = reasons[slug] || (reasons[slug] = []);
        if (!r.some(function (x) { return x[0] === why[0] && x[1] === why[1]; })) r.push(why);
      }
    };
    var p = profile || {};
    var list = function (k) { return Array.isArray(p[k]) ? p[k] : []; };

    list('careers').forEach(function (s) {
      add(s, W.career, ['career', careers[s] ? careers[s].t : s]);
      ((careers[s] && careers[s].r) || []).forEach(function (r) { add(r, W.relatedCareer, ['related', careers[s].t]); });
    });
    list('majors').forEach(function (m) {
      var mj = data.majors[m]; if (!mj) return;
      (mj.careers || []).forEach(function (s, i) { add(s, W.major * pos(i), ['major', mj.name]); });
      ((cfg.pins || {})[m] || []).forEach(function (s) { add(s, 100, ['major', mj.name]); });
    });
    list('minors').forEach(function (m) {
      var mn = data.minors[m]; if (!mn) return;
      (mn.careers || []).forEach(function (s, i) { add(s, W.minor * pos(i), ['minor', mn.name]); });
    });
    var fields = {};
    list('interests').forEach(function (k) {
      var it = data.interests[k]; if (!it) return;
      (it.careers || []).forEach(function (s, i) { add(s, W.interestCareer * pos(i), ['interest', it.name]); });
      (it.fields || []).forEach(function (f) { fields[f] = fields[f] || ['interest', it.name]; });
    });
    list('industries').forEach(function (f) { fields[f] = ['industry', (data.fields && data.fields[f]) || f]; });
    // Field matches only strengthen trainings that already connect to something more specific
    Object.keys(scores).forEach(function (s) { var f = fields[careers[s].c]; if (f) add(s, W.interestField, f); });
    // Careers in a chosen industry are candidates too (the field bonus above already counted for those with other links)
    if (list('industries').length) Object.keys(careers).forEach(function (s) {
      if (list('industries').indexOf(careers[s].c) > -1) add(s, (W.industry || 6) - (scores[s] ? W.interestField : 0), fields[careers[s].c]);
    });

    // A course listed under a skill counts in full when it shares a career field with the rest of the answers (or when
    // the skill is all the visitor picked), and at half weight otherwise, so a nursing student who wants safety skills
    // is not sent to forklift training.
    var related = {}, relFields = {};
    Object.keys(scores).forEach(function (s) { related[s] = 1; relFields[careers[s].c] = 1; });
    Object.keys(fields).forEach(function (f) { relFields[f] = 1; });
    var open = !Object.keys(related).length;
    list('skills').forEach(function (k) {
      var sk = data.skills[k]; if (!sk) return;
      (sk.careers || []).forEach(function (s) { if (careers[s]) add(s, (open || relFields[careers[s].c] ? 1 : 0.5) * W.skillCourse, ['skill', sk.name], true); });
      if (sk.all) Object.keys(related).forEach(function (s) { add(s, W.skillAll, null, true); });
      (sk.matched || []).forEach(function (s) { if (related[s]) add(s, W.skillMatch, ['skill', sk.name], true); });
    });
    Object.keys(scores).forEach(function (s) { if ((cfg.boosts || {})[s]) add(s, Number(cfg.boosts[s]), null); });

    var min = cfg.minScore || 6;
    // Ties: more U.S. job openings per year (BLS) first, then by title
    var tie = function (a, b) { return (careers[b.slug].o || 0) - (careers[a.slug].o || 0) || (careers[a.slug].t < careers[b.slug].t ? -1 : 1); };
    var ranked = Object.keys(scores).map(function (s) { return { slug: s, score: Math.round(scores[s] * 10) / 10, career: Math.round((scores[s] - (skillPart[s] || 0)) * 10) / 10, reasons: reasons[s] || [] }; })
      .sort(function (a, b) { return b.score - a.score || tie(a, b); });
    var courses = ranked.filter(function (x) { return x.score >= min && careers[x.slug].k; });
    var paths = ranked.filter(function (x) { return x.career >= min; }).sort(function (a, b) { return b.career - a.career || tie(a, b); });
    return { courses: courses, careers: paths, all: ranked };
  }

  // Plain-language reason for a recommendation ("Matches your Nursing major")
  function reasonText(r) {
    var t = r[0], n = r[1];
    return t === 'major' ? 'Connected to your ' + n + ' major'
      : t === 'minor' ? 'Connected to your ' + n + ' minor'
      : t === 'career' ? 'Training for a career you chose: ' + n
      : t === 'related' ? 'Related to ' + n + ', a career you chose'
      : t === 'interest' ? 'Fits your interest in ' + n
      : t === 'industry' ? 'In an industry you picked: ' + n
      : t === 'skill' ? 'Builds a skill you want: ' + n.toLowerCase() : n;
  }

  return { recommend: recommend, reasonText: reasonText };
});
