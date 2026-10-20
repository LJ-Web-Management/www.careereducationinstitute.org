import cfg from '../../site.config.mjs';
import { esc, href, money, money2, pct, num, article, listJoin, slugify, fmtDate } from './util.mjs';
import { courseHours, priceForHours } from '../data/course-pricing.mjs';
import { replaceTraining } from '../data/partner-selection.mjs';

// BLS publishes only annual wages for some salaried occupations (teachers, pilots, coaches).
export const hr = (w, suffix = '/hr') => (w.hourly != null ? money2(w.hourly) + suffix : '');

export const EDU_LABEL = ['No formal credential', 'High school diploma', 'Postsecondary certificate', 'Associate degree or apprenticeship', 'Bachelor’s degree or higher'];

export const growthWord = (g) =>
  g >= 7 ? 'much faster than average' : g >= 5 ? 'faster than average' : g >= 2.5 ? 'about as fast as average' : g >= 1 ? 'slower than average' : g > -1 ? 'little or no change' : 'a projected decline';

export function enrich(c, labor) {
  const l = labor.careers[c.slug];
  if (!l) throw new Error('No labor data for ' + c.slug);
  const lower = c.lower || c.title.split(' ').map((w) => (/^[A-Z]{2,}/.test(w) ? w : w.toLowerCase())).join(' ');
  const plural = c.plural || (c.title.endsWith('y') ? c.title.slice(0, -1) + 'ies' : c.title + 's');
  const pluralLower = c.pluralLower || plural.split(' ').map((w) => (/^[A-Z]{2,}/.test(w) ? w : w.toLowerCase())).join(' ');
  const traits = [...new Set([...(c.traits || []), ...(c.eduLevel < 4 ? ['no-degree'] : []), ...(c.months <= 6 ? ['fast-track'] : []), ...(l.wages.median >= 70000 ? ['high-pay'] : []), ...(l.growthPct >= 5 || l.annualOpenings >= 50000 ? ['in-demand'] : [])])];
  return {
    ...c, l, lower, plural, pluralLower, traits,
    a: c.article || article(lower),
    short: c.short || c.title,
    hours: courseHours[c.slug] || 10,
    price: priceForHours[courseHours[c.slug] || 10],
    replacedBy: replaceTraining[c.slug] || null,
    url: `/careers/${c.slug}/`,
    trainingUrl: `/training/${c.slug}/`,
    howto: (c.howto || []).map((h) => ({ ...h, slug: h.slug || slugify(h.t) }))
  };
}

export const SUB = [
  ['Overview', ''], ['Day in the Life', 'day-in-the-life/'], ['Salary', 'salary/'], ['How to Become', 'how-to-become/'], ['Skills', 'skills/'],
  ['Glossary', 'glossary/'], ['How-To Guides', 'how-to/'], ['Interview Questions', 'interview-questions/'], ['FAQ', 'faq/'], ['Fit Quiz', 'is-it-right-for-me/']
];

export function subnav(c, current) {
  const links = SUB.map(([t, p]) => [t, c.url + p]).concat([['Training', c.trainingUrl], ['Practice Test', c.trainingUrl + 'practice-test/']]);
  return `<nav class="subnav" aria-label="${esc(c.title)} sections"><ul>${links.map(([t, p]) => `<li><a href="${href(p)}"${p === current ? ' aria-current="page"' : ''}>${t}</a></li>`).join('')}</ul></nav>`;
}

export const pick = (cands, max = 60) => cands.find((t) => t.length <= max) || cands.at(-1);

export const dataNote = (labor) =>
  `<p class="data-note">Pay data: ${labor.meta.wageSource.replace('BLS Occupational Employment and Wage Statistics (OEWS)', 'BLS OEWS')} · Outlook: BLS ${labor.meta.projections} · Checked ${fmtDate(labor.meta.fetched)}</p>`;

export function facts(c, labor) {
  const l = c.l;
  return `<ul class="facts">
<li class="fact"><div class="k">Median pay</div><div class="v">${money(l.wages.median)}</div><div class="n">${hr(l.wages, '/hour') || 'Annual salary'} · ${labor.meta.oewsLabel}</div></li>
<li class="fact"><div class="k">Job growth</div><div class="v">${pct(l.growthPct)}</div><div class="n">${labor.meta.projections}, ${growthWord(l.growthPct)}</div></li>
<li class="fact"><div class="k">Openings per year</div><div class="v">${num(l.annualOpenings)}</div><div class="n">Average, ${labor.meta.projections}</div></li>
<li class="fact"><div class="k">Typical entry education</div><div class="v" style="font-size:1.05rem">${esc(l.entryEducation)}</div><div class="n">BLS classification</div></li>
<li class="fact"><div class="k">Time to train</div><div class="v">${esc(c.train)}</div><div class="n">Typical program length</div></li>
<li class="fact"><div class="k">U.S. jobs</div><div class="v">${num(l.employment)}</div><div class="n">Employment, 2025</div></li>
</ul>`;
}

export const rangeBar = (w) => {
  const lo = w.p10, hi = w.p90, span = hi - lo || 1;
  const pos = (v) => (((v - lo) / span) * 92 + 4).toFixed(1);
  const mk = (v, top, bottom) => `<span class="mk" style="left:${pos(v)}%"><span class="t">${top}</span><span class="b">${bottom}</span></span>`;
  return `<div class="range" role="img" aria-label="Pay range from ${money(lo)} (10th percentile) to ${money(hi)} (90th percentile), median ${money(w.median)}"><div class="bar">${mk(lo, money(lo), '10th')}${mk(w.median, money(w.median), 'Median')}${mk(hi, money(hi), '90th')}</div></div>`;
};

export const occupationSchema = (c, labor, url) => {
  const w = c.l.wages;
  return {
    '@type': 'Occupation',
    '@id': url + '#occupation',
    name: c.title,
    alternateName: c.aka,
    description: c.summary,
    occupationalCategory: `${c.l.soc} ${c.l.blsTitle}`,
    occupationLocation: [{ '@type': 'Country', name: 'United States' }],
    estimatedSalary: [{ '@type': 'MonetaryAmountDistribution', name: 'base', currency: 'USD', duration: 'P1Y', percentile10: w.p10, percentile25: w.p25, median: w.median, percentile75: w.p75, percentile90: w.p90 }],
    educationRequirements: c.l.entryEducation,
    experienceRequirements: c.l.relatedExperience === 'None' ? 'No related work experience typically required' : c.l.relatedExperience,
    qualifications: c.certs.map((x) => x[0]).join(', '),
    skills: [...c.hard, ...c.soft].join(', '),
    responsibilities: c.duties.join('; '),
    mainEntityOfPage: url,
    datePosted: cfg.updated
  };
};

export function relatedCards(cs, byslug) {
  return `<div class="grid">${cs.map((s) => byslug[s]).filter(Boolean).map((r) => `<article class="card link"><h3><a class="stretch" href="${href(r.url)}">${esc(r.title)}</a></h3><p>${esc(r.blurb)}</p><ul class="chips"><li class="chip pay">${money(r.l.wages.median)}</li><li class="chip">${esc(r.train)}</li></ul></article>`).join('')}</div>`;
}

export const compareSlug = (a, b) => [a, b].sort().join('-vs-');

export function genFaqs(c, labor) {
  const w = c.l.wages;
  return [
    [`How much does ${c.a} ${c.lower} make?`, `The median annual wage for ${c.pluralLower} was ${money(w.median)}${w.hourly != null ? ` (${money2(w.hourly)} per hour)` : ''} in ${labor.meta.oewsLabel}, according to the U.S. Bureau of Labor Statistics. The lowest 10% earned less than ${money(w.p10)} and the highest 10% earned more than ${money(w.p90)}.`],
    [`How long does it take to become ${c.a} ${c.lower}?`, `Most people need about ${c.train} of training. ${c.edu}`],
    [`Do you need a degree to be ${c.a} ${c.lower}?`, c.degreeA ? c.degreeA : /^(Master|Doctoral)/.test(c.l.entryEducation) ? `Yes. BLS lists a ${c.l.entryEducation.toLowerCase()} as the typical entry-level education${c.license ? ', and you also need a state license to practice' : ''}.` : c.eduLevel >= 4 ? `Usually, yes. BLS lists a ${c.l.entryEducation.toLowerCase()} as the typical entry-level education, although skills, certifications and experience can sometimes substitute.` : `No four-year degree is typically required. BLS lists “${c.l.entryEducation.toLowerCase()}” as the typical entry-level education${c.l.onTheJobTraining !== 'None' ? `, plus ${c.l.onTheJobTraining.toLowerCase()}` : ''}.`],
    [`Is ${c.lower} a good career?`, `It can be, depending on your goals. Employment is projected to change ${pct(c.l.growthPct)} from ${labor.meta.projections} (${growthWord(c.l.growthPct)}), with about ${num(c.l.annualOpenings)} openings each year. Upsides include ${c.pros[0].charAt(0).toLowerCase() + c.pros[0].slice(1)}; a common challenge is that ${c.cons[0].charAt(0).toLowerCase() + c.cons[0].slice(1)}.`],
    [`What skills does ${c.a} ${c.lower} need?`, `Key technical skills include ${listJoin(c.hard.slice(0, 4).map((s) => s.toLowerCase()))}. Employers also value ${listJoin(c.soft.slice(0, 3).map((s) => s.toLowerCase()))}.`],
    [`What certifications are available for ${c.pluralLower}?`, `Common credentials include ${listJoin(c.certs.map((x) => x[0]))}. ${c.license || 'Requirements vary by state and employer.'}`]
  ];
}

export function stateNote(c) {
  return c.license ? `<aside class="callout info"><p><strong>Licensing note:</strong> ${esc(c.license)}</p></aside>` : '';
}
