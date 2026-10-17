import cfg from '../../site.config.mjs';
import { esc, href, abs, clamp, fitTitle, md, wordCount, fmtDate } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, ctaCard, sideLinks } from '../lib/layout.mjs';
import { guides, guideBySlug, topics, gp } from '../data/guides/index.mjs';
import { resources } from '../data/resources.mjs';

export function guidePages(ctx) {
  const { byslug } = ctx;
  const pages = [];
  for (const g of guides) {
    const path = gp(g);
    const crumbs = g.topic === 'employers' ? [['Home', '/'], ['Employers', '/employers/'], [g.crumb || g.title, path]] : [['Home', '/'], ['Guides', '/guides/'], [g.crumb || g.title, path]];
    const { html, toc } = md(g.body);
    const words = wordCount(html);
    const related = (g.related || []).map((s) => guideBySlug[s]).filter(Boolean);
    const careerLinks = (g.careers || []).map((s) => byslug[s]).filter(Boolean);
    const main = `<div class="byline"><span>By the Career Education Institute Curriculum Team</span><span>Updated <time datetime="${g.updated || cfg.updated}">${fmtDate(g.updated || cfg.updated)}</time></span><span>${Math.max(2, Math.round(words / 230))} min read</span></div>
${g.answer ? `<div class="answer"><span class="label">Quick answer</span><p>${md(g.answer).html.replace(/^<p>|<\/p>$/g, '')}</p></div>` : ''}${html}
${g.faq?.length ? faqBlock(g.faq) : ''}
${careerLinks.length ? `<h2 id="careers-mentioned">Careers mentioned in this guide</h2><ul>${careerLinks.map((c) => `<li><a href="${href(c.url)}">${esc(c.title)}</a>: ${esc(c.blurb)}</li>`).join('')}</ul>` : ''}
${related.length ? `<h2 id="keep-reading">Keep reading</h2><div class="grid-2">${related.map((r) => `<article class="card link"><h3><a class="stretch" href="${href(gp(r))}">${esc(r.title)}</a></h3><p>${esc(r.desc)}</p></article>`).join('')}</div>` : ''}`;
    const aside = `${toc.length > 2 ? `<nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>` : ''}${g.audience?.includes('employers') ? ctaCard({ title: 'Onboarding training by job title', text: 'Give every new hire a consistent foundation in their role: duties, vocabulary, procedures and safety.', btn: 'See employer training', link: '/for-employers/' }) : ctaCard({ title: 'Find your career fit', text: 'Take the free Career Match Quiz, then learn the job with a practical online training.', btn: 'Take the quiz', link: '/quizzes/career-match/' })}`;
    pages.push({
      path, crumbs, og: g.audience?.includes('employers') ? '/og/training.png' : '/og/guides.png', kind: 'Guide', name: g.title, type: 'article', keywords: g.keywords || '',
      title: fitTitle(g.metaTitle || g.title), desc: clamp(g.desc),
      body: `${pageHero({ crumbs, eyebrow: topics[g.topic] || 'Guide', h1: esc(g.h1 || g.title), lead: esc(g.lead || g.desc), meta: false })}<div class="wrap layout"><article class="prose">${main}</article><aside>${aside}</aside></div>`,
      schema: [{ '@type': 'Article', headline: g.h1 || g.title, description: g.desc, author: { '@type': 'Organization', name: 'Career Education Institute Curriculum Team', url: abs('/editorial-policy/') }, publisher: { '@id': abs('/#org') }, datePublished: cfg.launched, dateModified: g.updated || cfg.updated, mainEntityOfPage: abs(path), image: abs('/og/guides.png'), wordCount: words, inLanguage: 'en-US' }, ...(g.faq?.length ? [faqSchema(g.faq, path)] : [])]
    });
  }

  // Guides index
  {
    const path = '/guides/';
    const crumbs = [['Home', '/'], ['Guides', path]];
    const body = `${pageHero({ crumbs, eyebrow: `${guides.length} free guides`, h1: 'Career Guides', lead: 'Practical, plain-English guides for choosing a career, picking an education path, changing careers, landing the job, growing once you’re there, and hiring and onboarding for employers.' })}
<div class="wrap" style="padding-top:30px;padding-bottom:60px">${Object.entries(topics).map(([k, v]) => { const gs = guides.filter((g) => g.topic === k); return gs.length ? `<section id="${k}" style="scroll-margin-top:90px"><h2>${esc(v)}</h2><div class="grid">${gs.map((g) => `<article class="card link"><h3><a class="stretch" href="${href(gp(g))}">${esc(g.title)}</a></h3><p>${esc(g.desc)}</p></article>`).join('')}</div></section>` : ''; }).join('')}
<section><h2>Free printable worksheets</h2><ul>${resources.map((r) => `<li><a href="${href(`/resources/${r.slug}/`)}">${esc(r.title)}</a></li>`).join('')}</ul></section></div>`;
    pages.push({ path, crumbs, body, og: '/og/guides.png', kind: 'Guide', name: 'All career guides', title: fitTitle('Career Guides: Choose, Change & Grow Your Career'), desc: clamp(`${guides.length} free career guides: how to choose a career, college vs. trade school, changing careers, resumes, interviews, raises, promotions, plus hiring and onboarding guides for employers.`), schema: [{ '@type': 'ItemList', itemListElement: guides.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(gp(g)), name: g.title })) }] });
  }

  // Resources (printable worksheets)
  {
    const idx = '/resources/';
    const crumbs0 = [['Home', '/'], ['Free worksheets', idx]];
    pages.push({ path: idx, crumbs: crumbs0, og: '/og/guides.png', kind: 'Worksheet', name: 'Free printable career worksheets', title: fitTitle('Free Printable Career Worksheets & Checklists'), desc: clamp('Free printable career worksheets and checklists: career decision worksheet, college visit checklist, career change budget, job application tracker, resume checklist and employer templates.'),
      body: `${pageHero({ crumbs: crumbs0, eyebrow: 'Printable', h1: 'Free Career Worksheets & Checklists', lead: 'Print them, fill them in by hand or save as PDF from your browser. No sign-up required.' })}<div class="wrap" style="padding-top:30px;padding-bottom:60px"><div class="grid">${resources.map((r) => `<article class="card link"><h3><a class="stretch" href="${href(`/resources/${r.slug}/`)}">${esc(r.title)}</a></h3><p>${esc(r.desc)}</p></article>`).join('')}</div></div>`, schema: [] });
    for (const r of resources) {
      const path = `/resources/${r.slug}/`;
      const crumbs = [...crumbs0, [r.title, path]];
      const body = `${pageHero({ crumbs, eyebrow: r.audience === 'employers' ? 'Employer template' : 'Printable worksheet', h1: esc(r.title), lead: esc(r.desc), extra: `<div class="btn-row no-print"><button class="btn btn-primary" type="button" data-print>Print or save as PDF</button></div>` })}<div class="wrap layout"><article class="prose">${md(r.body).html}</article><aside>${sideLinks('More worksheets', resources.filter((x) => x !== r).map((x) => [x.title, `/resources/${x.slug}/`]))}</aside></div>`;
      pages.push({ path, crumbs, body, og: '/og/guides.png', kind: 'Worksheet', name: r.title, title: fitTitle(r.metaTitle || r.title), desc: clamp(r.desc), schema: [] });
    }
  }
  return pages;
}
