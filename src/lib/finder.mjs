// College & Career Finder: loads and checks the finder data, prepares what the browser app downloads, and lays the
// verified college corrections over the IPEDS directory.
//
// Two separate sources, never mixed:
//   - College and university facts come only from IPEDS (src/data/colleges.json, `npm run update-colleges`) plus
//     verified corrections in src/data/finder/colleges-custom.json.
//   - Training recommendations come only from the CEI course catalog: the job-title trainings (one per career profile)
//     and the checkout courses. A finder mapping that names a career without a training stops the build.
import fs from 'node:fs';
import { partnerById } from './partners.mjs';

const read = (f) => JSON.parse(fs.readFileSync(new URL(`../data/finder/${f}.json`, import.meta.url), 'utf8'));
export const finderSrc = { interests: read('interests'), majors: read('majors'), minors: read('minors'), skills: read('skills'), questions: read('questions'), recommend: read('recommend'), collegesCustom: read('colleges-custom') };

// The shared ranking engine (also served to the browser as /assets/finder-engine.js)
// (package.json makes .js files ES modules, so the browser script is evaluated as a CommonJS-style function)
export const engine = (() => {
  const mod = { exports: {} };
  new Function('module', 'exports', fs.readFileSync(new URL('../assets/finder-engine.js', import.meta.url), 'utf8'))(mod, mod.exports);
  return mod.exports;
})();

export const majorFields = finderSrc.majors.fields;
export const majors = finderSrc.majors.majors;
export const minors = finderSrc.minors.minors;
export const interests = finderSrc.interests.interests;
export const skills = finderSrc.skills.skills;
export const questions = finderSrc.questions;
export const config = finderSrc.recommend;
export const majorBySlug = Object.fromEntries(majors.map((m) => [m.slug, m]));
export const minorBySlug = Object.fromEntries(minors.map((m) => [m.slug, m]));
export const interestBySlug = Object.fromEntries(interests.map((m) => [m.slug, m]));
export const skillBySlug = Object.fromEntries(skills.map((m) => [m.slug, m]));
export const fieldBySlug = Object.fromEntries(majorFields.map((f) => [f.slug, f]));

export const majorPath = (m) => `/college-majors/${typeof m === 'string' ? m : m.slug}/`;
export const fieldPath = (f) => `/college-majors/${typeof f === 'string' ? f : f.slug}-majors/`;
export const minorPath = (m) => `/college-minors/${typeof m === 'string' ? m : m.slug}/`;
export const skillPath = (s) => `/skills-to-learn/${typeof s === 'string' ? s : s.slug}/`;
export const FINDER = '/college-and-career-finder/';
// Each finder step is its own page (in step order). The step pages that already exist as guides (colleges, majors,
// minors, skills) carry the interactive step at the top and the searchable guide content below it.
export const STEP_PATHS = [FINDER, '/college-and-career-finder/education-level/', '/career-interests/', '/colleges/', '/college-majors/', '/college-minors/', '/career-finder/', '/skills-to-learn/', '/college-and-career-finder/results/'];
export const interestPath = (i) => `/career-interests/${typeof i === 'string' ? i : i.slug}/`;

// Majors that a minor is suggested for, with the reason (from majors.json)
export const minorPairs = (slug) => majors.flatMap((m) => m.minors.filter(([s]) => s === slug).map(([, why]) => ({ major: m, why })));

// Every check that keeps recommendations tied to real courses and pages. Throws with a list of problems.
export function checkFinder(byslug, categories) {
  const errs = [];
  const career = (s, where) => { if (!byslug[s]) errs.push(`${where}: no career profile or training "${s}"`); };
  const cats = new Set(categories.map((c) => c.slug));
  const seen = new Set();
  const uniq = (kind, s) => { if (seen.has(kind + s)) errs.push(`duplicate ${kind} slug ${s}`); seen.add(kind + s); if (!/^[a-z0-9-]+$/.test(s)) errs.push(`${kind} slug "${s}" must be lowercase letters, numbers and hyphens`); };
  for (const f of majorFields) uniq('field', f.slug);
  for (const m of majors) {
    uniq('major', m.slug);
    if (!fieldBySlug[m.field]) errs.push(`major ${m.slug}: unknown field ${m.field}`);
    if (majorFields.some((f) => `${f.slug}-majors` === m.slug)) errs.push(`major ${m.slug} clashes with a field page`);
    m.careers.forEach((s) => career(s, `major ${m.slug}`));
    m.minors.forEach(([s]) => { if (!minorBySlug[s]) errs.push(`major ${m.slug}: unknown minor ${s}`); });
    m.interests.forEach((s) => { if (!interestBySlug[s]) errs.push(`major ${m.slug}: unknown interest ${s}`); });
    if (!m.cip.length) errs.push(`major ${m.slug}: no CIP codes`);
    m.cip.forEach((c) => { if (!/^\d\d(\.\d{2}(\d{2})?)?$/.test(c)) errs.push(`major ${m.slug}: bad CIP code ${c}`); });
  }
  for (const m of minors) { uniq('minor', m.slug); m.careers.forEach((s) => career(s, `minor ${m.slug}`)); m.interests.forEach((s) => { if (!interestBySlug[s]) errs.push(`minor ${m.slug}: unknown interest ${s}`); }); }
  for (const i of interests) {
    uniq('interest', i.slug);
    i.careers.forEach((s) => career(s, `interest ${i.slug}`));
    i.fields.forEach((f) => { if (!cats.has(f)) errs.push(`interest ${i.slug}: unknown career field ${f}`); });
    i.majors.forEach((s) => { if (!majorBySlug[s]) errs.push(`interest ${i.slug}: unknown major ${s}`); });
  }
  for (const s of skills) { uniq('skill', s.slug); s.careers.forEach((c) => career(c, `skill ${s.slug}`)); }
  for (const s of Object.keys(config.boosts || {})) career(s, 'recommend.json boosts');
  for (const s of config.hide || []) career(s, 'recommend.json hide');
  for (const [m, list] of Object.entries(config.pins || {})) { if (!majorBySlug[m]) errs.push(`recommend.json pins: unknown major ${m}`); list.forEach((s) => career(s, `recommend.json pins ${m}`)); }
  for (const s of Object.keys(config.courseOverrides || {})) career(s, 'recommend.json courseOverrides');
  if (errs.length) throw new Error('College & Career Finder data problems:\n  - ' + errs.join('\n  - '));
}

// The training sold for a career: the job-title training, or the checkout course that replaces it.
// courseOverrides (recommend.json) can rename it, rewrite its description or point it at another CEI page.
export function courseFor(c) {
  const o = (config.courseOverrides || {})[c.slug] || {};
  const m = c.replacedBy && partnerById[c.replacedBy];
  const base = m
    ? { name: m.title, url: m.url, price: m.price, hours: m.hoursNum, buy: `/checkout/?course=${m.slug}`, buyLabel: 'Buy now' }
    : { name: `${c.title} Training`, url: c.trainingUrl, price: c.price, hours: c.hours, buy: `${c.trainingUrl}#enroll`, buyLabel: 'Enroll' };
  return {
    ...base,
    name: o.name || base.name,
    url: o.url || base.url,
    buy: o.enrollUrl || base.buy,
    desc: o.description || `A self-paced online course on what ${c.pluralLower} do: duties, ${c.terms.length}+ key terms, step-by-step tasks, tools, safety and how to launch the career.`
  };
}

// Careers whose skills, duties and tools mention a skill's match words (precomputed so the browser needs no text)
function skillMatches(careers) {
  return Object.fromEntries(skills.map((s) => {
    const words = (s.match || []).map((w) => w.toLowerCase());
    const hit = words.length ? careers.filter((c) => { const t = [...c.hard, ...c.soft, ...c.tools, ...c.duties].join(' ').toLowerCase(); return words.some((w) => t.includes(w)); }).map((c) => c.slug) : [];
    return [s.slug, hit];
  }));
}

// Data for the engine. Short keys keep the download small: t title, c field, r related careers, k has a training,
// o BLS openings per year (only used to order ties).
export function engineData(careers, categories) {
  const matched = skillMatches(careers);
  return {
    config,
    fields: Object.fromEntries(categories.map((c) => [c.slug, c.name])),
    careers: Object.fromEntries(careers.map((c) => [c.slug, { t: c.title, c: c.cat, r: c.related, k: 1, o: c.l.annualOpenings }])),
    majors: Object.fromEntries(majors.map((m) => [m.slug, { name: m.name, careers: m.careers }])),
    minors: Object.fromEntries(minors.map((m) => [m.slug, { name: m.name, careers: m.careers }])),
    interests: Object.fromEntries(interests.map((i) => [i.slug, { name: i.name, careers: i.careers, fields: i.fields }])),
    skills: Object.fromEntries(skills.map((s) => [s.slug, { name: s.name, careers: s.careers, all: !!s.all, matched: matched[s.slug] }]))
  };
}

// /assets/finder/data.json: everything the questionnaire needs up front
export function finderPayload(careers, categories) {
  const eng = engineData(careers, categories);
  return {
    v: 1,
    questions: { goals: questions.goals, stages: questions.stages, careerGoalTypes: questions.careerGoalTypes, stageNotes: questions.stageNotes },
    categories: categories.map((c) => ({ slug: c.slug, name: c.name })),
    interests: interests.map((i) => ({ ...i, featured: !!i.featured })),
    fields: majorFields,
    majors: majors.map((m) => ({ ...m, aka: m.aka || '' })),
    minors,
    skills: skills.map(({ match, ...s }) => s),
    // Career cards and course details: [title, field, blurb, top skills, related, training time,
    // course [name, url, price, hours, enroll url, enroll label, description override], other names, BLS openings per year]
    careers: Object.fromEntries(careers.map((c) => {
      const k = courseFor(c);
      return [c.slug, [c.title, c.cat, c.blurb, c.hard.slice(0, 4), c.related, c.train, [k.name, k.url, k.price, k.hours, k.buy, k.buyLabel, (config.courseOverrides || {})[c.slug]?.description || ''], c.aka.slice(0, 3).join(', '), c.l.annualOpenings]];
    })),
    engine: { config: eng.config, fields: eng.fields, skills: Object.fromEntries(Object.entries(eng.skills).map(([k, v]) => [k, { all: v.all, matched: v.matched }])) }
  };
}

// /assets/finder/careers-detail.json: loaded when a visitor opens a career
export const careerDetails = (careers) => Object.fromEntries(careers.map((c) => [c.slug, [c.summary, c.duties.slice(0, 6), c.edu, c.soft.slice(0, 4), c.l.entryEducation]]));

// ---------- Colleges (IPEDS) ----------
let collegeCache = null;
export function loadColleges() {
  if (collegeCache) return collegeCache;
  const file = new URL('../data/colleges.json', import.meta.url);
  if (!fs.existsSync(file)) { console.warn('! src/data/colleges.json missing: run `npm run update-colleges`. The college search will be empty.'); return (collegeCache = { meta: { count: 0 }, cip: {}, institutions: [] }); }
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const custom = finderSrc.collegesCustom;
  const hidden = new Set((custom.hide || []).map(String));
  const list = raw.institutions.filter((i) => !hidden.has(String(i.id))).map((i) => ({ ...i, ...(custom.edit?.[i.id] || {}) }));
  for (const a of custom.add || []) list.push({ programs: '', ug: 1, grad: 0, online: 0, onlineUg: 0, onlineGrad: 0, custom: 1, ...a });
  list.sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name));
  // Majors each school reports awarding (a program code that starts with one of the major's CIP codes)
  const prefixes = majors.map((m, idx) => [idx, m.cip]);
  for (const i of list) {
    const codes = i.programs ? i.programs.split(',').map((p) => p.split(':')) : [];
    i.majors = prefixes.filter(([, cips]) => codes.some(([code]) => cips.some((c) => code.startsWith(c)))).map(([idx]) => idx);
    i.levels = Object.fromEntries(i.majors.map((idx) => [idx, [...new Set(codes.filter(([code]) => majors[idx].cip.some((c) => code.startsWith(c))).flatMap(([, lv]) => [...lv]))].sort((a, b) => 'CABMD'.indexOf(a) - 'CABMD'.indexOf(b)).join('')]));
  }
  return (collegeCache = { meta: raw.meta, cip: raw.cip, institutions: list });
}

export const CONTROL = { 1: 'Public', 2: 'Private nonprofit', 3: 'Private for-profit' };
export const LEVEL = { 1: 'Four-year', 2: 'Two-year' };
export const AWARD = { C: 'Certificate', A: 'Associate', B: 'Bachelor’s', M: 'Master’s', D: 'Doctoral' };
export const STATES = { AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', AS: 'American Samoa', GU: 'Guam', MP: 'Northern Mariana Islands', PR: 'Puerto Rico', VI: 'U.S. Virgin Islands' };
export const stateSlug = (abbr) => STATES[abbr].toLowerCase().replace(/\./g, '').replace(/\s+/g, '-');
export const statePath = (abbr) => `/colleges/${stateSlug(abbr)}/`;

// /assets/finder/colleges.json: one compact row per school for the search
// [id, name, city, state, zip, website, control, level, ug, grad, online bits (1 any, 2 undergrad, 4 graduate), lat, lon, major indexes, alias]
export function collegeIndex() {
  const { meta, institutions } = loadColleges();
  return {
    meta: { source: meta.source, sourceUrl: meta.sourceUrl, directory: meta.directory, completions: meta.completions, fetched: meta.fetched, count: institutions.length },
    // Majors in index order (rows refer to them by position): [slug, name, field name]
    majors: majors.map((m) => [m.slug, m.name, fieldBySlug[m.field].name]),
    states: STATES,
    rows: institutions.map((i) => [i.id, i.name, i.city, i.state, i.zip, i.web, i.control, i.level, i.ug, i.grad, (i.online ? 1 : 0) | (i.onlineUg ? 2 : 0) | (i.onlineGrad ? 4 : 0), i.lat ?? null, i.lon ?? null, i.majors, i.alias || ''])
  };
}

// /assets/finder/programs/<STATE>.json: each school's full program list and official links, loaded when a visitor opens it
export function programShards() {
  const { institutions } = loadColleges();
  const by = {};
  for (const i of institutions) (by[i.state] ||= {})[i.id] = { a: i.admissions || '', n: i.netPrice || '', p: i.programs || '', l: i.levels };
  return by;
}

// Program titles for the codes in use, plus 2-digit family titles
export const cipTitles = () => loadColleges().cip;

// How many schools report awarding each major
export function majorCollegeCounts() {
  const counts = majors.map(() => ({ total: 0, online: 0, levels: {} }));
  for (const i of loadColleges().institutions) for (const idx of i.majors) {
    const c = counts[idx]; c.total++; if (i.online) c.online++;
    for (const lv of i.levels[idx] || '') c.levels[lv] = (c.levels[lv] || 0) + 1;
  }
  return Object.fromEntries(majors.map((m, idx) => [m.slug, counts[idx]]));
}
