import fs from 'node:fs';
import cfg from '../../site.config.mjs';
import { esc, href, abs, fmtDate, money, pct } from './util.mjs';
import { icons } from '../data/categories.mjs';

const cssRaw = fs.readFileSync(new URL('../assets/styles.css', import.meta.url), 'utf8');
export const CSS = cssRaw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}');

let G = { careers: [], categories: [], partners: [] };
export const setGlobals = (g) => { G = { ...G, ...g }; };


// Full logo (mark + wordmark) from scripts/images.mjs; width/height match LOGO there.
export const logo = (cls = '') =>
  `<a class="logo ${cls}" href="${href('/')}"><picture><source type="image/webp" srcset="${href('/brand/logo.webp')}"><img src="${href('/brand/logo.png')}" width="260" height="54" alt="${esc(cfg.name)}"></picture></a>`;

export const icon = (cat, size = 24) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false">${icons[cat] || icons['business-and-office']}</svg>`;

const chev = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const pick = (slugs) => slugs.map((s) => G.careers.find((c) => c.slug === s)).filter(Boolean);

function menu() {
  const popularCareers = pick(['registered-nurse', 'electrician', 'medical-assistant', 'hvac-technician', 'cybersecurity-analyst', 'truck-driver']);
  const popularTraining = pick(['medical-assistant', 'phlebotomist', 'pharmacy-technician', 'electrician', 'it-support-specialist', 'project-manager']);
  const buyOnline = G.partners || [];
  return [
    { label: 'Careers', match: ['/careers/', '/compare/', '/best-careers/', '/salary-guide/', '/glossary/'], cols: [
      { h: 'Career fields', links: G.categories.map((c) => [c.name, `/careers/${c.slug}/`]) },
      { h: 'Explore', links: [['All 50 careers', '/careers/'], ['Salary guide', '/salary-guide/'], ['Best careers lists', '/best-careers/'], ['Compare careers', '/compare/'], ['Career glossary', '/glossary/'], ['Career Match Quiz', '/quizzes/career-match/']] },
      { h: 'Popular careers', links: popularCareers.map((c) => [c.title, c.url]) }] },
    { label: 'Training', match: ['/training/', '/enroll/', '/courses/', '/checkout/'], cols: [
      { h: 'Job-title training by field', links: G.categories.map((c) => [c.short || c.name, `/training/#${c.slug}`]).concat([[`All ${G.careers.length} trainings`, '/training/']]) },
      { h: 'Popular trainings', links: popularTraining.map((c) => [`${c.title} Training`, c.trainingUrl]).concat([['How it works', '/how-it-works/'], ['Enroll', '/enroll/']]) },
      { h: 'Buy online now', links: buyOnline.map((c) => [c.short, c.url]).concat([['All online courses', '/courses/']]) }] },
    { label: 'Quizzes', match: ['/quizzes/'], cols: [
      { h: 'Find your fit', links: [['Career Match Quiz', '/quizzes/career-match/'], ['Work Style Quiz', '/quizzes/work-style/'], ['College or Trade School?', '/quizzes/college-or-trade-school/'], ['Career Change Readiness', '/quizzes/career-change-readiness/']] },
      { h: 'Quizzes by field', links: G.categories.map((c) => [c.short || c.name, `/quizzes/which-${c.slug}-career-is-right-for-me/`]) },
      { h: 'Test yourself', links: [['Career fit quizzes', '/quizzes/#fit-quizzes'], ['Practice tests', '/quizzes/#practice-tests'], ['All quizzes', '/quizzes/']] }] },
    { label: 'Resources', match: ['/students/', '/career-changers/', '/professionals/', '/guides/', '/resources/', '/blog/'], cols: [
      { h: 'Start here', links: [['For students', '/students/'], ['For career changers', '/career-changers/'], ['For working professionals', '/professionals/']] },
      { h: 'Learn', links: [['Career guides', '/guides/'], ['Free worksheets', '/resources/'], ['Blog', '/blog/'], ['Career glossary', '/glossary/']] },
      { h: 'Popular guides', links: [['How to choose a career', '/guides/how-to-choose-a-career/'], ['College vs. trade school', '/guides/college-vs-trade-school/'], ['How to change careers', '/guides/how-to-change-careers/'], ['How to write a resume', '/guides/how-to-write-a-resume/'], ['Job interview tips', '/guides/job-interview-tips/']] }] },
    { label: 'Employers', match: ['/employers/', '/for-'], cols: [
      { h: 'Training for teams', links: [['Onboarding training', '/for-employers/'], ['Recruiters and staffing agencies', '/for-staffing-agencies/'], ['Schools and workforce programs', '/for-workforce-programs/'], ['Courses to buy online', '/courses/']] },
      { h: 'Hiring tools', links: [['Hiring guides by job', '/employers/hiring-guides/'], ['Job description templates', '/employers/job-descriptions/'], ['30-60-90 onboarding plans', '/employers/onboarding-plans/'], ['Training ROI calculator', '/employers/training-roi-calculator/'], ['Onboarding assessment', '/employers/onboarding-assessment/'], ['Employer resource center', '/employers/']] },
      { h: 'By industry', links: G.categories.map((c) => [c.short || c.name, `/for-employers/${c.slug}/`]) }] },
    { label: 'About', match: ['/about/', '/how-it-works/', '/faq/', '/contact/', '/editorial-policy/'], cols: [
      { h: 'Company', links: [['About us', '/about/'], ['How it works', '/how-it-works/'], ['Editorial policy', '/editorial-policy/']] },
      { h: 'Help', links: [['FAQ', '/faq/'], ['Contact us', '/contact/'], ['Refund policy', '/refund-policy/']] },
      { h: 'Talk to us', links: [[cfg.phone, `tel:${cfg.phoneE164}`], [cfg.email, `mailto:${cfg.email}`]] }] }
  ];
}

function header(path) {
  const items = menu().map((m, i) => {
    const on = m.match.some((p) => path.startsWith(p));
    return `<li class="mi"><button class="mt" type="button" aria-expanded="false" aria-controls="mp${i}"${on ? ' data-current="true"' : ''}>${m.label}${chev}</button><div class="mp" id="mp${i}"><div class="mp-in">${m.cols.map((c) => `<div><p class="mp-h">${esc(c.h)}</p><ul>${c.links.map(([t, l]) => `<li><a href="${esc(href(l))}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('')}</div></div></li>`;
  }).join('');
  return `<header class="site-header"><div class="wrap hdr">${logo()}<button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Menu</span></button><nav class="nav" id="nav" aria-label="Main"><ul class="menu">${items}</ul><div class="nav-end"><a class="search-link" href="${href('/search/')}" aria-label="Search the site"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><span class="search-label">Search</span></a><a class="btn btn-primary btn-sm" href="${href('/enroll/')}">Enroll</a></div></nav></div></header>`;
}

function footer() {
  const col = (h, links) => `<div><h2>${h}</h2><ul>${links.map(([t, l]) => `<li><a href="${esc(href(l))}">${esc(t)}</a></li>`).join('')}</ul></div>`;
  const legal = [['Privacy Policy', '/privacy-policy/'], ['Terms of Use', '/terms-of-use/'], ['Cookie Policy', '/cookie-policy/'], ['Accessibility', '/accessibility/'], ['Refund Policy', '/refund-policy/'], ['Disclaimer', '/disclaimer/'], ['Your Privacy Choices', '/your-privacy-choices/'], ['Non-Discrimination', '/non-discrimination/'], ['Copyright', '/copyright-policy/']]
    .map(([t, p]) => `<a href="${href(p)}">${t}</a>`).join(' · ');
  return `<footer class="site-footer"><div class="wrap"><div class="fgrid">
<div>${logo()}<p style="margin-top:14px">Career training by job title, plus free tools to help students and working adults choose and change careers.</p><p><a href="tel:${cfg.phoneE164}">${cfg.phone}</a><br><a href="mailto:${cfg.email}">${cfg.email}</a></p></div>
${col('Careers', G.categories.map((c) => [c.name, `/careers/${c.slug}/`]).concat([['All 50 careers', '/careers/'], ['Salary guide', '/salary-guide/']]))}
${col('Training and courses', [['All job-title trainings', '/training/'], ...pick(['medical-assistant', 'electrician', 'pharmacy-technician', 'cybersecurity-analyst']).map((c) => [`${c.title} Training`, c.trainingUrl]), ['Courses to buy online', '/courses/'], ...(G.partners || []).slice(0, 3).map((c) => [c.short, c.url]), ['Enroll', '/enroll/']])}
${col('Resources', [['Career Match Quiz', '/quizzes/career-match/'], ['All quizzes', '/quizzes/'], ['Career guides', '/guides/'], ['For students', '/students/'], ['For career changers', '/career-changers/'], ['For working professionals', '/professionals/'], ['Best careers lists', '/best-careers/'], ['Career glossary', '/glossary/'], ['Free worksheets', '/resources/'], ['Blog', '/blog/']])}
<div><h2>Employers</h2><ul>${[['Onboarding training', '/for-employers/'], ['Recruiters and staffing agencies', '/for-staffing-agencies/'], ['Schools and workforce programs', '/for-workforce-programs/'], ['Employer resource center', '/employers/'], ['Hiring guides by job', '/employers/hiring-guides/'], ['Training ROI calculator', '/employers/training-roi-calculator/']].map(([t, l]) => `<li><a href="${href(l)}">${t}</a></li>`).join('')}</ul><h2 style="margin-top:22px">Company</h2><ul>${[['About us', '/about/'], ['How it works', '/how-it-works/'], ['Contact', '/contact/'], ['FAQ', '/faq/'], ['Editorial policy', '/editorial-policy/'], ['Site map', '/sitemap/']].map(([t, l]) => `<li><a href="${href(l)}">${t}</a></li>`).join('')}</ul></div>
</div>
<div class="fbottom"><span>© ${cfg.updated.slice(0, 4)} ${esc(cfg.legalName)}. All rights reserved.</span><span>${legal}</span></div>
</div></footer>`;
}

export const crumbsHtml = (crumbs) =>
  crumbs?.length ? `<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs.map(([n, p], i) => `<li>${i === crumbs.length - 1 ? `<span aria-current="page">${esc(n)}</span>` : `<a href="${href(p)}">${esc(n)}</a>`}</li>`).join('')}</ol></nav>` : '';

export const pageHero = ({ crumbs, eyebrow, h1, lead, meta = true, extra = '', aka }) =>
  `<section class="page-hero"><div class="wrap">${crumbsHtml(crumbs)}${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h1>${h1}</h1>${aka ? `<p class="aka">${aka}</p>` : ''}${lead ? `<p class="lead">${lead}</p>` : ''}${meta ? `<div class="meta"><span>Updated <time datetime="${typeof meta === 'string' ? meta : cfg.updated}">${fmtDate(typeof meta === 'string' ? meta : cfg.updated)}</time></span><span>By the Career Education Institute Curriculum Team</span></div>` : ''}${extra}</div></section>`;

export const orgNode = () => ({
  '@type': ['Organization', 'EducationalOrganization'],
  '@id': abs('/#org'),
  name: cfg.name,
  url: abs('/'),
  logo: { '@type': 'ImageObject', url: abs('/icons/icon-512.png'), width: 512, height: 512 },
  email: cfg.email,
  telephone: cfg.phoneE164,
  areaServed: { '@type': 'Country', name: 'United States' },
  contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', telephone: cfg.phoneE164, email: cfg.email, areaServed: 'US', availableLanguage: 'English' },
  ...(cfg.social.length ? { sameAs: cfg.social } : {})
});

export function layout(p) {
  const { path, title, desc, body, crumbs = [], schema = [], og = '/og/default.png', ogAlt, type = 'website', noindex = false, scripts = [], mcta, published, modified } = p;
  const url = abs(path);
  const graph = [orgNode(), { '@type': 'WebSite', '@id': abs('/#website'), name: cfg.name, url: abs('/'), publisher: { '@id': abs('/#org') }, inLanguage: 'en-US', potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: abs('/search/') + '?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } }];
  graph.push({ '@type': p.pageType || 'WebPage', '@id': url + '#webpage', url, name: title, description: desc, isPartOf: { '@id': abs('/#website') }, inLanguage: 'en-US', datePublished: published || cfg.launched, dateModified: modified || cfg.updated, primaryImageOfPage: { '@type': 'ImageObject', url: abs(og) }, ...(crumbs.length ? { breadcrumb: { '@id': url + '#breadcrumb' } } : {}) });
  if (crumbs.length) graph.push({ '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: crumbs.map(([n, cp], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(cp) })) });
  graph.push(...schema);
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  const js = ['site', ...scripts].map((s) => `<script src="${href(`/assets/${s}.js`)}" defer></script>`).join('');
  const mobile = mcta ? `<div class="mobile-cta">${mcta}</div>` : '';
  return `<!doctype html><html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}"><meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'}"><link rel="alternate" hreflang="en-US" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}"><meta property="og:site_name" content="${cfg.name}"><meta property="og:locale" content="en_US"><meta property="og:type" content="${type}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${abs(og)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(ogAlt || title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${abs(og)}">${type === 'article' ? `<meta property="article:published_time" content="${published || cfg.launched}"><meta property="article:modified_time" content="${modified || cfg.updated}">` : ''}${cfg.verification.google ? `<meta name="google-site-verification" content="${cfg.verification.google}">` : ''}${cfg.verification.bing ? `<meta name="msvalidate.01" content="${cfg.verification.bing}">` : ''}<meta name="theme-color" content="#022350"><meta name="format-detection" content="telephone=no"><link rel="icon" href="${href('/favicon.ico')}" sizes="32x32"><link rel="icon" href="${href('/favicon-48.png')}" type="image/png" sizes="48x48"><link rel="apple-touch-icon" href="${href('/apple-touch-icon.png')}"><link rel="manifest" href="${href('/site.webmanifest')}"><link rel="alternate" type="application/rss+xml" title="Career Education Institute Blog" href="${href('/blog/feed.xml')}"><style>${CSS}</style><script type="application/ld+json">${ld}</script></head><body${mcta ? ' class="has-mcta"' : ''}><a class="skip" href="#main">Skip to main content</a>${header(path)}<main id="main">${body}</main>${footer()}${mobile}<script>window.MP=${JSON.stringify({ base: cfg.basePath, ga: cfg.analytics.ga4 || '' })}</script>${js}</body></html>`;
}

// ---------- Shared components ----------
export const careerCard = (c, l) =>
  `<article class="card link"><span class="ico">${icon(c.cat)}</span><h3><a class="stretch" href="${href(`/careers/${c.slug}/`)}">${esc(c.title)}</a></h3><p>${esc(c.blurb || c.summary)}</p><ul class="chips"><li class="chip pay">${money(l.wages.median)}/yr median</li><li class="chip grow">${pct(l.growthPct)} growth</li><li class="chip">${esc(c.train)}</li></ul></article>`;

export const trainingCard = (c, l) =>
  `<article class="card link"><span class="ico">${icon(c.cat)}</span><h3><a class="stretch" href="${href(`/training/${c.slug}/`)}">${esc(c.title)} Training</a></h3><p>${esc(c.blurb || c.summary)}</p><ul class="chips"><li class="chip">${esc(cfg.course.format)}</li><li class="chip pay">Career median ${money(l.wages.median)}</li></ul></article>`;

export const faqBlock = (faqs, heading = 'Frequently asked questions', id = 'faq') =>
  `<section class="faq" id="${id}"><h2>${esc(heading)}</h2>${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><div><p>${a}</p></div></details>`).join('')}</section>`;

export const faqSchema = (faqs, url) => ({
  '@type': 'FAQPage', '@id': abs(url) + '#faq',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } }))
});

export const ctaCard = ({ title, text, items = [], btn, link }) =>
  `<div class="cta-card"><h2>${esc(title)}</h2><p>${text}</p>${items.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}<a class="btn btn-primary" href="${href(link)}">${esc(btn)}</a></div>`;

export const sideLinks = (title, links) =>
  `<nav class="side-box" aria-label="${esc(title)}"><h2>${esc(title)}</h2><ul>${links.map(([t, p]) => `<li><a href="${href(p)}">${esc(t)}</a></li>`).join('')}</ul></nav>`;

export const band = (h, p, btn, link, btn2, link2) =>
  `<section class="band"><div class="wrap"><div><h2>${h}</h2><p>${p}</p></div><div class="btn-row" style="margin:0"><a class="btn btn-dark" href="${href(link)}">${esc(btn)}</a>${btn2 ? `<a class="btn" href="${href(link2)}">${esc(btn2)}</a>` : ''}</div></div></section>`;

export const answerBox = (label, text) => `<div class="answer"><span class="label">${esc(label)}</span><p>${text}</p></div>`;
