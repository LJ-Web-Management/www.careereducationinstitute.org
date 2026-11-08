import { esc, href, abs, money, money2, clamp, fitTitle, md, wordCount, fmtDate, countLabel } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, ctaCard, sideLinks } from '../lib/layout.mjs';
import { tierTable, partnerById } from '../lib/partners.mjs';
import { priceForHours } from '../data/course-pricing.mjs';
import { landingPages, fieldLandings } from '../data/landing.mjs';

// Keyword landing pages (src/data/landing.mjs), one per keyword cluster, at /<slug>/.
const UPDATED = '2026-11-08';
const HOURS = Object.keys(priceForHours).map(Number);
const PRICES = Object.values(priceForHours);
const usd = (n) => '$' + money2(n).slice(1);

export const landingPath = (slug) => `/${slug}/`;
export const landingFor = (cat) => (fieldLandings[cat] ? landingPath(fieldLandings[cat]) : null);

// Price and length shown for a career's training: the checkout course's own figures when the training is one.
const course = (c) => {
  const p = c.replacedBy && partnerById[c.replacedBy];
  return p ? { hours: p.hoursNum || p.hours, price: p.price } : { hours: c.hours, price: c.price };
};

function trainingTable(slugs, byslug, key) {
  const list = slugs.map((s) => { if (!byslug[s]) throw new Error(`Landing table ${key}: no career ${s}`); return byslug[s]; });
  return `<div class="table-wrap"><table class="course-table"><thead><tr><th scope="col">Training</th><th scope="col" class="num hide-sm">Hours</th><th scope="col" class="num">Price</th><th scope="col" class="num">Median pay</th></tr></thead><tbody>${list.map((c) => { const k = course(c); return `<tr><td><a href="${href(c.trainingUrl)}">${esc(c.title)} Training</a><div class="small muted">Online, self-paced<span class="mob-only"> · ${k.hours} hours</span> · <a href="${href(c.url)}">Career profile</a></div></td><td class="num hide-sm">${k.hours}</td><td class="num"><strong>${usd(k.price)}</strong></td><td class="num">${money(c.l.wages.median)}</td></tr>`; }).join('')}</tbody></table></div>`;
}

function computedList(key, careers) {
  const item = (c, extra) => `- [${c.title}](${c.url}): ${extra}`;
  if (key === 'fastest-growing') return [...careers].sort((a, b) => b.l.growthPct - a.l.growthPct).slice(0, 8).map((c) => item(c, `${c.l.growthPct > 0 ? '+' : ''}${c.l.growthPct.toFixed(1)}% projected growth, median pay ${money(c.l.wages.median)}`)).join('\n');
  if (key === 'no-degree-pay') return careers.filter((c) => c.eduLevel < 4).sort((a, b) => b.l.wages.median - a.l.wages.median).slice(0, 8).map((c) => item(c, `median pay ${money(c.l.wages.median)}, training ${c.train}`)).join('\n');
  if (key === 'fast-track') return careers.filter((c) => c.months <= 3).sort((a, b) => b.l.wages.median - a.l.wages.median).slice(0, 8).map((c) => item(c, `training ${c.train}, median pay ${money(c.l.wages.median)}`)).join('\n');
  throw new Error(`Landing list token: unknown list ${key}`);
}

const fieldLinks = () => [
  ['Healthcare and medical career training', 'healthcare-career-training'],
  ['Skilled trades, construction and manufacturing training', 'skilled-trades-training'],
  ['Transportation, logistics and supply chain training', 'transportation-logistics-training'],
  ['IT, technology and business career training', 'technology-business-career-training']
].map(([t, s]) => `- [${t}](${landingPath(s)})`).join('\n');

export function keywordPages(ctx) {
  const { careers, byslug } = ctx;
  const fill = (s, p) => (typeof s !== 'string' ? s : s
    .replace(/\{careers\}/g, countLabel(careers.length))
    .replace(/\{minPrice\}/g, usd(Math.min(...PRICES))).replace(/\{maxPrice\}/g, usd(Math.max(...PRICES)))
    .replace(/\{minHours\}/g, Math.min(...HOURS)).replace(/\{maxHours\}/g, Math.max(...HOURS))
    .replace(/\{(pay|hours|price):([a-z0-9-]+)\}/g, (m, k, slug) => {
      const c = byslug[slug];
      if (!c) throw new Error(`Landing token ${m}: no career ${slug}`);
      return k === 'pay' ? money(c.l.wages.median) : k === 'hours' ? course(c).hours : usd(course(c).price);
    })
    .replace(/^\{table:([a-z-]+)\}$/gm, (m, k) => { if (!p.tables?.[k]) throw new Error(`Landing ${p.slug}: no table ${k}`); return trainingTable(p.tables[k], byslug, k); })
    .replace(/^\{list:([a-z-]+)\}$/gm, (m, k) => computedList(k, careers))
    .replace(/^\{tiers\}$/gm, tierTable())
    .replace(/^\{fields\}$/gm, fieldLinks()));
  const inline = (s) => md(s).html.replace(/^<p>|<\/p>$/g, '');

  return landingPages.map((p) => {
    const path = landingPath(p.slug);
    const crumbs = p.audience ? [['Home', '/'], ['Employers', '/employers/'], [p.crumb, path]] : [['Home', '/'], ['Training', '/training/'], [p.crumb, path]];
    const f = (s) => fill(s, p);
    // Question-and-answer pages: each question is an h2 with its direct answer first (answer-led, for AI search).
    const qaMd = p.qa ? p.qa.map(([q, a]) => `## ${q}\n${f(a)}`).join('\n\n') : '';
    const { html, toc } = md(p.body ? f(p.body) : qaMd);
    const faqs = (p.faq || []).map(([q, a]) => [f(q), inline(f(a))]);
    const schemaQa = p.qa ? p.qa.map(([q, a]) => [q, md(f(a)).html]) : faqs;
    const words = wordCount(html);
    const main = `<div class="byline"><span>By the Career Education Institute Curriculum Team</span><span>Updated <time datetime="${UPDATED}">${fmtDate(UPDATED)}</time></span><span>${Math.max(2, Math.round(words / 230))} min read</span></div>
<div class="answer"><span class="label">Quick answer</span><p>${inline(f(p.answer))}</p></div>
${html}
${faqs.length ? faqBlock(faqs) : ''}
<aside class="callout info"><p>Career Education Institute trainings are general, non-credit career-preparation courses. They do not grant a license, certification or academic credit, do not replace state-approved or legally required training, and do not include job placement. Pay figures are U.S. medians from the Bureau of Labor Statistics.</p></aside>`;
    const cta = p.cta || (p.field ? { title: 'Not sure which job fits?', text: 'Take the free Career Match Quiz, then try a free practice test before you enroll.', btn: 'Take the quiz', link: '/quizzes/career-match/' } : { title: 'Browse every training', text: `${countLabel(careers.length)} job-title trainings, each ${Math.min(...HOURS)} to ${Math.max(...HOURS)} hours and under $50.`, btn: 'See the catalog', link: '/training/' });
    const aside = `${toc.length > 2 ? `<nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>` : ''}${ctaCard(cta)}${sideLinks('Related', p.related || [])}`;
    const tableSlugs = [...new Set(Object.values(p.tables || {}).flat())];
    return {
      path, crumbs, og: p.field ? `/og/cat-${p.field}.png` : p.audience ? '/og/training.png' : '/og/guides.png', kind: 'Training guide', name: p.h1, type: 'article', keywords: p.keywords, modified: UPDATED,
      title: fitTitle(p.metaTitle), desc: clamp(f(p.desc)),
      body: `${pageHero({ crumbs, eyebrow: p.eyebrow, h1: esc(p.h1), lead: esc(f(p.lead)), meta: false, extra: p.qa ? '' : `<div class="btn-row"><a class="btn btn-primary" href="${href(cta.link)}">${esc(cta.btn)}</a>${cta.link !== '/training/' ? `<a class="btn" href="${href('/training/')}">Browse all trainings</a>` : `<a class="btn" href="${href('/quizzes/career-match/')}">Take the Career Match Quiz</a>`}</div>` })}<div class="wrap layout"><article class="prose">${main}</article><aside>${aside}</aside></div>`,
      schema: [
        { '@type': 'Article', headline: p.h1, description: f(p.desc), author: { '@type': 'Organization', name: 'Career Education Institute Curriculum Team', url: abs('/editorial-policy/') }, publisher: { '@id': abs('/#org') }, datePublished: UPDATED, dateModified: UPDATED, mainEntityOfPage: abs(path), image: abs(p.field ? `/og/cat-${p.field}.png` : '/og/guides.png'), wordCount: words, inLanguage: 'en-US', keywords: p.keywords },
        ...(tableSlugs.length ? [{ '@type': 'ItemList', name: `${p.crumb}: trainings`, itemListElement: tableSlugs.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(byslug[s].trainingUrl), name: `${byslug[s].title} Training` })) }] : []),
        ...(schemaQa.length ? [faqSchema(schemaQa, path)] : [])
      ]
    };
  });
}
