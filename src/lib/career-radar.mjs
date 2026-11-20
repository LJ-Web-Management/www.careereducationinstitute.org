// Career Radar (daily game at /games/career-radar/): how close every career is to every other career.
// The browser picks today's secret career with the date formula in src/assets/career-radar.js, then loads that
// career's ranking file (written by the build from secretFiles()) and ranks each guess against it.
// Closeness comes only from the career data: duties, skills, tools and vocabulary (text similarity), the BLS SOC job
// family, the career field, related-career links, Holland interest code, work traits and training level.
import { offerData } from './offer.mjs';
import { href } from './util.mjs';
import { radar } from '../data/career-radar.mjs';

// Why a guess is close: one bit per reason, explained in the browser (REASONS in career-radar.js)
export const BITS = { field: 1, socMajor: 2, socMinor: 4, related: 8, text: 16, edu: 32, interest: 64, traits: 128 };

const STOP = new Set('a an and are as at be by for from has have in into is it its of on or that the their them they this to with without your you who what when where which while will can may more most such than other others use uses using used work works working job jobs worker workers including include includes each per about across also make makes keep keeps help helps over under up out new all any day daily one two three'.split(' '));
const stem = (w) => w.replace(/(ies)$/, 'y').replace(/(ing|ers|er|ed|es|s)$/, '');
const words = (s) => String(s).toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)).map(stem).filter((w) => w.length > 2);

// Weighted bag of words per career: the title and duties count most, then skills and tools, then the rest.
function bag(c) {
  const m = new Map();
  const add = (s, w) => { for (const t of words(s)) m.set(t, (m.get(t) || 0) + w); };
  add(c.title, 4); c.aka.forEach((a) => add(a, 2));
  add(c.blurb, 1.5); add(c.summary, 1);
  c.duties.forEach((d) => add(d, 1.5));
  c.hard.forEach((d) => add(d, 1.5));
  (c.tools || []).forEach((d) => add(d, 1));
  (c.terms || []).forEach(([t]) => add(t, 1));
  (c.certs || []).forEach(([t]) => add(t, 0.5));
  return m;
}

function tfidf(careers) {
  const bags = careers.map(bag);
  const df = new Map();
  for (const b of bags) for (const t of b.keys()) df.set(t, (df.get(t) || 0) + 1);
  const n = careers.length;
  return bags.map((b) => {
    const v = new Map();
    let norm = 0;
    for (const [t, tf] of b) {
      const d = df.get(t);
      if (d < 2) continue; // words only one career uses can't link two careers
      const w = (1 + Math.log(tf)) * Math.log(n / d);
      v.set(t, w); norm += w * w;
    }
    norm = Math.sqrt(norm) || 1;
    for (const [t, w] of v) v.set(t, w / norm);
    return v;
  });
}

const cosine = (a, b) => {
  if (a.size > b.size) [a, b] = [b, a];
  let s = 0;
  for (const [t, w] of a) { const x = b.get(t); if (x) s += w * x; }
  return s;
};

// Closeness of career j to career i (higher is closer), plus the reasons bitmask.
function score(i, j, C, vec, rel, textCut) {
  const a = C[i], b = C[j];
  const text = cosine(vec[i], vec[j]);
  let s = text * 12, m = 0;
  if (text >= textCut) m |= BITS.text;
  const sa = a.l.soc, sb = b.l.soc;
  if (sa.slice(0, 2) === sb.slice(0, 2)) { s += 2; m |= BITS.socMajor; }
  if (sa.slice(0, 4) === sb.slice(0, 4)) { s += 2; m |= BITS.socMinor; }
  if (sa.slice(0, 6) === sb.slice(0, 6)) s += 1.5;
  if (a.cat === b.cat) { s += 2; m |= BITS.field; }
  if (rel[i].has(j) || rel[j].has(i)) { s += 4.5; m |= BITS.related; }
  else if ([...rel[i]].some((k) => rel[j].has(k) || rel[k].has(j))) s += 1;
  if (a.riasec[0] === b.riasec[0]) { s += 0.8; m |= BITS.interest; }
  s += [...a.riasec].filter((x) => b.riasec.includes(x)).length * 0.25;
  const ta = new Set(a.traits), shared = b.traits.filter((t) => ta.has(t)).length;
  const jac = shared / (new Set([...a.traits, ...b.traits]).size || 1);
  s += jac * 1.5;
  if (jac >= 0.5) m |= BITS.traits;
  const de = Math.abs(a.eduLevel - b.eduLevel);
  s -= de * 0.45;
  if (!de) m |= BITS.edu;
  return [s, m];
}

// Every career's ranking of every other career, for the careers in `secrets` (indexes into careers).
// Returns { [careerIndex]: { o: career indexes from closest to farthest (o[0] is the secret), m: reasons by career index } }
export function rankings(careers, secrets) {
  const idx = new Map(careers.map((c, i) => [c.slug, i]));
  const rel = careers.map((c) => new Set(c.related.map((s) => idx.get(s)).filter((x) => x != null)));
  const vec = tfidf(careers);
  // "Similar duties, skills and tools" is shown for roughly the closest 4% of career pairs by text alone.
  const sample = [];
  for (let i = 0; i < careers.length; i += 7) for (let j = 0; j < careers.length; j += 5) if (i !== j) sample.push(cosine(vec[i], vec[j]));
  sample.sort((a, b) => b - a);
  const textCut = sample[Math.floor(sample.length * 0.04)];
  const out = {};
  for (const i of secrets) {
    const rows = careers.map((_, j) => (j === i ? [Infinity, 0, j] : [...score(i, j, careers, vec, rel, textCut), j]));
    out[i] = { o: [...rows].sort((a, b) => b[0] - a[0] || a[2] - b[2]).map((r) => r[2]), m: rows.map((r) => r[1]) };
  }
  return out;
}

// The answer pool: the slugs in src/data/career-radar.mjs, checked against the careers that exist.
export function answerPool(careers) {
  const idx = new Map(careers.map((c, i) => [c.slug, i]));
  const missing = radar.answers.filter((s) => !idx.has(s));
  if (missing.length) throw new Error(`Career Radar answers name careers that don't exist: ${missing.join(', ')}`);
  if (new Set(radar.answers).size !== radar.answers.length) throw new Error('Career Radar answers list a career twice');
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  if (gcd(radar.step, radar.answers.length) !== 1) throw new Error(`Career Radar step ${radar.step} shares a factor with the ${radar.answers.length} answers, so some careers would never come up. Pick another prime step.`);
  return radar.answers.map((s) => idx.get(s));
}

// Settings the page embeds for the browser (the date formula's inputs and where to load files)
export const radarConfig = (careers) => ({ launch: radar.launch, step: radar.step, offset: radar.offset, pool: answerPool(careers).length, files: href('/assets/games/career-radar/'), careers: href('/careers/') });

// Shared file for the browser: every career's name, profile slug and aliases (for typing a guess), and how common the
// job is (4 × log10 of U.S. employment) so suggestions list well-known jobs first.
// [title, slug, aliases, commonness]
export const guessList = (careers) => careers.map((c) => [c.title, c.slug, c.aka, Math.round(Math.log10(Math.max(10, c.l.employment)) * 4)]);

// One ranking file per answer, named by its place in the answer pool: { o, m } (see rankings()) plus k, the answer's
// training offer (offerData) for the end screen.
export function secretFiles(careers) {
  const pool = answerPool(careers);
  const r = rankings(careers, pool);
  return pool.map((i) => ({ ...r[i], k: offerData(careers[i]) }));
}
