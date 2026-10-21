import fs from 'node:fs';
import cfg from '../../site.config.mjs';
import { esc, href, money2 } from './util.mjs';
import { selection, shortNames } from '../data/partner-selection.mjs';

// Text from the provider catalog: tidy spacing and punctuation for our pages.
export const tidy = (s = '') => String(s)
  .replace(/\s*\u2014\s*/g, ', ').replace(/\s+–\s+/g, ', ').replace(/,\s*,/g, ',')
  .replace(/\s+([.,;:!?)])/g, '$1').replace(/\s{2,}/g, ' ').trim();

const cleanTitle = (t) => tidy(t).replace(/\s+[-–]\s+\d+\s*CFR[\s\S]*$/i, '').replace(/\b(\d+) Hour\b/g, '$1-Hour').replace(/\s+-\s+/g, ': ');
const shorten = (id, t) => {
  if (shortNames[id]) return shortNames[id];
  const s = t.replace(/ Training$/i, '');
  return s.length <= 52 ? s : t;
};

const cleanSlug = (s) => s.replace(/-(new|online)$/, '');
const hoursAdj = (n) => `${n}-hour`;
const fixLead = (p) => p.replace(/^(?:Then|So),?\s+(\w)/, (m, a) => a.toUpperCase());

const sel = Object.fromEntries(selection.map((x, i) => [x.id, { ...x, order: i }]));
const raw = JSON.parse(fs.readFileSync(new URL('../data/partner-courses.json', import.meta.url), 'utf8'));
export const partnerCourses = raw.filter((c) => sel[c.id]).sort((a, b) => sel[a.id].order - sel[b.id].order).map((c) => ({
  ...c,
  job: sel[c.id].job,
  jobLower: sel[c.id].job.replace(/\b[A-Z][a-z]+\b/g, (w) => w.toLowerCase()),
  career: sel[c.id].career || null,
  field: sel[c.id].field,
  title: cleanTitle(c.title),
  short: shorten(c.id, cleanTitle(c.title)),
  slug: sel[c.id].slug || cleanSlug(c.slug),
  url: `/courses/${sel[c.id].slug || cleanSlug(c.slug)}/`,
  hours: c.hours.replace(/\bHours?\b/g, (h) => h.toLowerCase()),
  hoursNum: parseFloat(c.hours) || 0,
  hoursAdj: hoursAdj(parseFloat(c.hours) || 0),
  facts: Object.fromEntries(Object.entries(c.facts).map(([k, v]) => [k, tidy(v)])),
  isEldt: /\bELDT\b/.test(c.title),
  regulation: tidy((c.intro.find((l) => /accordance|aligned|compliance|meets/i.test(l)) || '').replace(/^In accordance with\s*/i, '')),
  extras: c.intro.filter((l) => !/accordance with/i.test(l)).map(tidy),
  overview: c.overview.map((p) => fixLead(tidy(p))),
  audience: c.audience.map(tidy),
  requirements: c.requirements.map(tidy),
  objectives: c.objectives.map(tidy),
  syllabus: { intro: tidy(c.syllabus.intro), modules: c.syllabus.modules.map((m) => ({ title: tidy(m.title), desc: tidy(m.desc), lessons: m.lessons.map(tidy) })) },
  faqs: c.faqs.map(([q, a]) => [tidy(q), a.split('\n').map((l) => (l.startsWith('- ') ? '- ' + tidy(l.slice(2)) : tidy(l))).join('\n')]),
  langLabel: c.langs.map((l) => (l === 'EN' ? 'English' : l === 'ES' ? 'Spanish' : l)).join(' and ') || 'English'
}));
export const partnerById = Object.fromEntries(partnerCourses.map((c) => [c.id, c]));
export const partnerBySlug = Object.fromEntries(partnerCourses.map((c) => [c.slug, c]));

export const providerLine = () => `Provided by ${cfg.checkout.provider} (${cfg.checkout.providerLegal})`;

// Compact table of partner courses with price and a buy link.
export function partnerTable(ids, { caption = '', buy = true } = {}) {
  const list = ids.map((i) => (typeof i === 'object' ? i : partnerById[i])).filter(Boolean);
  if (!list.length) return '';
  return `<div class="table-wrap"><table class="course-table">${caption ? `<caption class="vh">${esc(caption)}</caption>` : ''}<thead><tr><th scope="col">Course</th><th scope="col" class="num hide-sm">Hours</th><th scope="col" class="num">Price</th>${buy ? '<th scope="col"><span class="vh">Buy</span></th>' : ''}</tr></thead><tbody>${list.map((c) => `<tr><td><a href="${href(c.url)}">${esc(c.title)}</a><div class="small muted">For: ${esc(c.job)}<span class="mob-only"> · ${esc(String(c.hoursNum))} hours</span> · ${esc(c.langLabel)}</div></td><td class="num hide-sm">${esc(String(c.hoursNum || c.hours))}</td><td class="num"><strong>$${money2(c.price).slice(1)}</strong></td>${buy ? `<td class="num"><a class="btn btn-sm btn-primary" href="${href(`/checkout/?course=${c.slug}`)}" aria-label="Buy ${esc(c.title)}">Buy</a></td>` : ''}</tr>`).join('')}</tbody></table></div>`;
}

export const tierTable = () => `<div class="table-wrap"><table><thead><tr><th scope="col">Seats</th><th scope="col" class="num">Discount</th></tr></thead><tbody>${cfg.bulkTiers.filter((t) => t.discount > 0).map((t) => `<tr><td>${t.min} to ${t.max.toLocaleString('en-US')}</td><td class="num">${Math.round(t.discount * 100)}% off</td></tr>`).join('')}</tbody></table></div>`;

// Callout listing the provider courses for one career field (hub and employer industry pages).
export function fieldCourses(field, lead = 'Complete online training you can buy now') {
  const list = partnerCourses.filter((c) => c.field === field);
  if (!list.length) return '';
  return `<aside class="callout info"><p><strong>${esc(lead)}:</strong> ${list.map((c) => `<a href="${href(c.url)}">${esc(c.short)}</a> (${esc(c.jobLower.replace(/ \(.*\)/, ''))}, $${money2(c.price).slice(1)})`).join(', ')}. Volume pricing from 2 learners.</p></aside>`;
}
