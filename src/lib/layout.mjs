import fs from 'node:fs';
import crypto from 'node:crypto';
import cfg from '../../site.config.mjs';
import { esc, href, abs, fmtDate, money, pct } from './util.mjs';
import { icons } from '../data/categories.mjs';

const cssRaw = fs.readFileSync(new URL('../assets/styles.css', import.meta.url), 'utf8');
export const CSS = cssRaw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}');
// Served once as /assets/styles.css (written by the build); the hash makes browsers fetch the new file after each change.
export const CSS_VERSION = crypto.createHash('sha1').update(CSS).digest('hex').slice(0, 10);

let G = { careers: [], categories: [], partners: [] };
export const setGlobals = (g) => { G = { ...G, ...g }; };


// Full logo (mark + wordmark) from scripts/images.mjs; width/height match LOGO there.
export const logo = (cls = '') =>
  `<a class="logo ${cls}" href="${href('/')}"><img src="${href('/brand/logo.png')}" width="260" height="54" alt="${esc(cfg.name)}"></a>`;

export const icon = (cat, size = 24) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false"><use href="#i-${icons[cat] ? cat : 'business-and-office'}"/></svg>`;
const iconSprite = (html) => {
  const used = [...new Set([...html.matchAll(/<use href="#i-([a-z-]+)"/g)].map((m) => m[1]))];
  return used.length ? `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${used.map((c) => `<symbol id="i-${c}" viewBox="0 0 24 24">${icons[c]}</symbol>`).join('')}</svg>` : '';
};

const searchIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
const cartIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 4h2.2l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6.3"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/></svg>';
const chev = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const pick = (slugs) => slugs.map((s) => G.careers.find((c) => c.slug === s)).filter(Boolean);

function menu() {
  const popularCareers = pick(['electrician', 'hvac-technician', 'registered-nurse', 'heavy-equipment-operator', 'telecommunications-technician', 'medical-assistant']);
  const popularTraining = pick(['electrician', 'hvac-technician', 'medical-assistant', 'construction-laborer', 'building-maintenance-technician', 'phlebotomist']);
  const buyOnline = G.partners || [];
  return [
    { label: 'Careers', match: ['/careers/', '/compare/', '/best-careers/', '/salary-guide/', '/glossary/'], cols: [
      { h: 'Career fields', links: G.categories.map((c) => [c.name, `/careers/${c.slug}/`]) },
      { h: 'Explore', links: [[`All ${G.careers.length} careers`, '/careers/'], ['Salary guide', '/salary-guide/'], ['Best careers lists', '/best-careers/'], ['Compare careers', '/compare/'], ['Career glossary', '/glossary/'], ['Career Match Quiz', '/quizzes/career-match/']] },
      { h: 'Popular careers', links: popularCareers.map((c) => [c.title, c.url]) }] },
    { label: 'Training', match: ['/training/', '/enroll/', '/courses/', '/checkout/'], cols: [
      { h: 'Job-title training', links: [[`All ${G.careers.length} trainings by field`, '/training/'], ['How it works', '/how-it-works/'], ['Enroll', '/enroll/'], ['Not sure? Career Match Quiz', '/quizzes/career-match/']] },
      { h: 'Popular trainings', links: popularTraining.map((c) => [`${c.title} Training`, c.trainingUrl]) },
      { h: 'Buy online now', links: buyOnline.map((c) => [c.short, c.url]).concat([['All online courses', '/courses/']]) }] },
    { label: 'Quizzes', match: ['/quizzes/'], cols: [
      { h: 'Find your fit', links: [['Career Match Quiz', '/quizzes/career-match/'], ['Work Style Quiz', '/quizzes/work-style/'], ['College or Trade School?', '/quizzes/college-or-trade-school/'], ['Career Change Readiness', '/quizzes/career-change-readiness/']] },
      { h: 'Quizzes by field', links: [[`${G.categories.length} career field quizzes`, '/quizzes/#field-quizzes'], ...['healthcare', 'skilled-trades', 'technology'].map((k) => G.categories.find((c) => c.slug === k)).filter(Boolean).map((c) => [`${c.short || c.name} quiz`, `/quizzes/which-${c.slug}-career-is-right-for-me/`])] },
      { h: 'Test yourself', links: [['Career fit quizzes', '/quizzes/#fit-quizzes'], ['Practice tests', '/quizzes/#practice-tests'], ['All quizzes', '/quizzes/']] }] },
    { label: 'Resources', match: ['/students/', '/career-changers/', '/professionals/', '/guides/', '/resources/', '/blog/'], cols: [
      { h: 'Start here', links: [['For students', '/students/'], ['For career changers', '/career-changers/'], ['For working professionals', '/professionals/']] },
      { h: 'Learn', links: [['Career guides', '/guides/'], ['Free worksheets', '/resources/'], ['Blog', '/blog/'], ['Career glossary', '/glossary/']] },
      { h: 'Popular guides', links: [['How to choose a career', '/guides/how-to-choose-a-career/'], ['College vs. trade school', '/guides/college-vs-trade-school/'], ['How to change careers', '/guides/how-to-change-careers/'], ['How to write a resume', '/guides/how-to-write-a-resume/'], ['Job interview tips', '/guides/job-interview-tips/']] }] },
    { label: 'Employers', match: ['/employers/', '/for-', '/partners/'], cols: [
      { h: 'Training for teams', links: [['Onboarding training', '/for-employers/'], ['Recruiters and staffing agencies', '/for-staffing-agencies/'], ['Schools and workforce programs', '/for-workforce-programs/'], ['Partner discount program', '/partners/'], ['Courses to buy online', '/courses/']] },
      { h: 'Hiring tools', links: [['Hiring guides by job', '/employers/hiring-guides/'], ['Job description templates', '/employers/job-descriptions/'], ['30-60-90 onboarding plans', '/employers/onboarding-plans/'], ['Training ROI calculator', '/employers/training-roi-calculator/'], ['Onboarding assessment', '/employers/onboarding-assessment/'], ['Employer resource center', '/employers/']] },
      { h: 'By industry', links: [[`Onboarding for ${G.categories.length} industries`, '/for-employers/#industries'], ...['healthcare', 'skilled-trades', 'transportation-and-logistics'].map((k) => G.categories.find((c) => c.slug === k)).filter(Boolean).map((c) => [c.short || c.name, `/for-employers/${c.slug}/`])] }] },
    { label: 'About', match: ['/about/', '/how-it-works/', '/faq/', '/contact/', '/editorial-policy/'], cols: [
      { h: 'Company', links: [['About us', '/about/'], ['How it works', '/how-it-works/'], ['Editorial policy', '/editorial-policy/']] },
      { h: 'Help', links: [['FAQ', '/faq/'], ['Contact us', '/contact/'], ['Refund policy', '/refund-policy/']] },
      { h: 'Talk to us', links: [[cfg.phone, `tel:${cfg.phoneE164}`], [cfg.email, `mailto:${cfg.email}`]] }] }
  ];
}

export function header(path) {
  const items = menu().map((m, i) => {
    const on = m.match.some((p) => path.startsWith(p));
    return `<li class="mi"><button class="mt" type="button" aria-expanded="false" aria-controls="mp${i}"${on ? ' data-current="true"' : ''}>${m.label}${chev}</button><div class="mp" id="mp${i}"><div class="mp-in">${m.cols.map((c) => `<div><p class="mp-h">${esc(c.h)}</p><ul>${c.links.map(([t, l]) => `<li><a href="${esc(href(l))}">${esc(t)}</a></li>`).join('')}</ul></div>`).join('')}</div></div></li>`;
  }).join('');
  return `<header class="site-header"><div class="wrap hdr">${logo()}<a class="hdr-btn first" href="${href('/search/')}" aria-label="Search the site">${searchIcon}</a><a class="hdr-btn" href="${href('/cart/')}" aria-label="Cart" data-cart-link>${cartIcon}<span class="cart-count" data-cart-count hidden></span></a><button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Menu</span></button><nav class="nav" id="nav" aria-label="Main"><ul class="menu">${items}</ul><div class="nav-end"><a class="search-link" href="${href('/search/')}" aria-label="Search the site">${searchIcon}<span class="search-label">Search</span></a><a class="search-link" href="${href('/cart/')}" aria-label="Cart" data-cart-link>${cartIcon}<span class="search-label">Cart</span><span class="cart-count" data-cart-count hidden></span></a><a class="btn btn-primary btn-sm" href="${href('/enroll/')}">Enroll</a></div></nav></div></header>`;
}

export function footer() {
  const col = (h, links) => `<div><h2>${h}</h2><ul>${links.map(([t, l]) => `<li><a href="${esc(href(l))}">${esc(t)}</a></li>`).join('')}</ul></div>`;
  const legal = [['Privacy Policy', '/privacy-policy/'], ['Terms of Use', '/terms-of-use/'], ['Cookie Policy', '/cookie-policy/'], ['Accessibility', '/accessibility/'], ['Refund Policy', '/refund-policy/'], ['Disclaimer', '/disclaimer/'], ['Your Privacy Choices', '/your-privacy-choices/'], ['Unsubscribe', '/newsletter/unsubscribe/'], ['Non-Discrimination', '/non-discrimination/'], ['Copyright', '/copyright-policy/']]
    .map(([t, p]) => `<a href="${href(p)}">${t}</a>`).join(' · ');
  return `<footer class="site-footer"><div class="wrap"><div class="fgrid">
<div>${logo()}<p style="margin-top:14px">Career training by job title, plus free tools to help students and working adults choose and change careers.</p><p><a href="tel:${cfg.phoneE164}">${cfg.phone}</a><br><a href="mailto:${cfg.email}">${cfg.email}</a></p></div>
${col('Careers', G.categories.map((c) => [c.name, `/careers/${c.slug}/`]).concat([[`All ${G.careers.length} careers`, '/careers/'], ['Salary guide', '/salary-guide/']]))}
${col('Training and courses', [['All job-title trainings', '/training/'], ...pick(['electrician', 'hvac-technician', 'medical-assistant', 'telecommunications-technician']).map((c) => [`${c.title} Training`, c.trainingUrl]), ['Courses to buy online', '/courses/'], ...(G.partners || []).slice(0, 3).map((c) => [c.short, c.url]), ['Enroll', '/enroll/']])}
${col('Resources', [['Career Match Quiz', '/quizzes/career-match/'], ['All quizzes', '/quizzes/'], ['Career guides', '/guides/'], ['For students', '/students/'], ['For career changers', '/career-changers/'], ['For working professionals', '/professionals/'], ['Best careers lists', '/best-careers/'], ['Career glossary', '/glossary/'], ['Free worksheets', '/resources/'], ['Blog', '/blog/'], ['Newsletter', '/newsletter/']])}
<div><h2>Employers</h2><ul>${[['Onboarding training', '/for-employers/'], ['Recruiters and staffing agencies', '/for-staffing-agencies/'], ['Schools and workforce programs', '/for-workforce-programs/'], ['Partner discount program', '/partners/'], ['Employer resource center', '/employers/'], ['Hiring guides by job', '/employers/hiring-guides/'], ['Training ROI calculator', '/employers/training-roi-calculator/']].map(([t, l]) => `<li><a href="${href(l)}">${t}</a></li>`).join('')}</ul><h2 style="margin-top:22px">Company</h2><ul>${[['About us', '/about/'], ['How it works', '/how-it-works/'], ['Contact', '/contact/'], ['FAQ', '/faq/'], ['Editorial policy', '/editorial-policy/'], ['Site map', '/sitemap/']].map(([t, l]) => `<li><a href="${href(l)}">${t}</a></li>`).join('')}</ul></div>
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
  legalName: cfg.legalName,
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
  const full = path === '/' || path === '/about/' || path === '/contact/';
  const graph = full
    ? [orgNode(), { '@type': 'WebSite', '@id': abs('/#website'), name: cfg.name, url: abs('/'), publisher: { '@id': abs('/#org') }, inLanguage: 'en-US', potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: abs('/search/') + '?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } }]
    : [{ '@type': ['Organization', 'EducationalOrganization'], '@id': abs('/#org'), name: cfg.name, url: abs('/'), logo: abs('/icons/icon-512.png') }, { '@type': 'WebSite', '@id': abs('/#website'), name: cfg.name, url: abs('/') }];
  graph.push({ '@type': p.pageType || 'WebPage', '@id': url + '#webpage', url, name: title, description: desc, isPartOf: { '@id': abs('/#website') }, inLanguage: 'en-US', datePublished: published || cfg.launched, dateModified: modified || cfg.updated, primaryImageOfPage: { '@type': 'ImageObject', url: abs(og) }, ...(crumbs.length ? { breadcrumb: { '@id': url + '#breadcrumb' } } : {}) });
  if (crumbs.length) graph.push({ '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: crumbs.map(([n, cp], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(cp) })) });
  graph.push(...schema);
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  const js = ['site', ...scripts].map((s) => `<script src="${href(`/assets/${s}.js`)}" defer></script>`).join('');
  const mobile = mcta ? `<div class="mobile-cta">${mcta}</div>` : '';
  return `<!doctype html><html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}"><meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'}"><meta property="og:site_name" content="${cfg.name}"><meta property="og:locale" content="en_US"><meta property="og:type" content="${type}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${abs(og)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(ogAlt || title)}"><meta name="twitter:card" content="summary_large_image">${type === 'article' ? `<meta property="article:published_time" content="${published || cfg.launched}"><meta property="article:modified_time" content="${modified || cfg.updated}">` : ''}${cfg.verification.google ? `<meta name="google-site-verification" content="${cfg.verification.google}">` : ''}${cfg.verification.bing ? `<meta name="msvalidate.01" content="${cfg.verification.bing}">` : ''}<meta name="theme-color" content="#022350"><meta name="format-detection" content="telephone=no"><link rel="icon" href="${href('/favicon.ico')}" sizes="16x16 32x32 48x48"><link rel="icon" href="${href('/favicon-48.png')}" type="image/png" sizes="48x48"><link rel="apple-touch-icon" href="${href('/apple-touch-icon.png')}"><link rel="manifest" href="${href('/site.webmanifest')}"><link rel="alternate" type="application/rss+xml" title="Career Education Institute Blog" href="${href('/blog/feed.xml')}"><link rel="stylesheet" href="${href('/assets/styles.css')}?v=${CSS_VERSION}"><script type="application/ld+json">${ld}</script></head><body${mcta ? ' class="has-mcta"' : ''}>${(() => { const page = `<a class="skip" href="#main">Skip to main content</a>${header(path)}<main id="main">${body}</main>${footer()}${mobile}`; return iconSprite(page) + page; })()}<script>window.MP=${JSON.stringify({ base: cfg.basePath, blog: cfg.blogUrl, ga: cfg.analytics.ga4 || '', cd: cfg.partnerProgram.linkDays })}</script>${js}</body></html>`;
}

// Header, footer, stylesheet and scripts for the separate blog site (repo blog.careereducationinstitute.org).
// The build writes this to /assets/shell.json; the blog's build reads it so both sites look the same.
export const shell = () => ({
  built: new Date().toISOString(),
  stylesheet: `/assets/styles.css?v=${CSS_VERSION}`,
  scripts: ['/assets/site.js'],
  header: header('/blog/'),
  footer: footer(),
  mp: { base: cfg.basePath, blog: cfg.blogUrl, ga: cfg.analytics.ga4 || '', cd: cfg.partnerProgram.linkDays },
  careers: G.careers.length // blog posts can write {careers} for the current number of career profiles
});

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
