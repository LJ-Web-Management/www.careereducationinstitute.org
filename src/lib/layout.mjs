import fs from 'node:fs';
import cfg from '../../site.config.mjs';
import { esc, href, abs, fmtDate, money, pct } from './util.mjs';
import { icons } from '../data/categories.mjs';

const cssRaw = fs.readFileSync(new URL('../assets/styles.css', import.meta.url), 'utf8');
export const CSS = cssRaw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}');

let G = { careers: [], categories: [] };
export const setGlobals = (g) => { G = { ...G, ...g }; };

export const logoMark = (size = 40) =>
  `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true" focusable="false"><rect width="48" height="48" rx="11" fill="#13294b"/><path d="M11.5 36V17l9.5 10.5L31.5 12v24" fill="none" stroke="#fff" stroke-width="5.4" stroke-linejoin="round" stroke-linecap="square"/><rect x="35.2" y="30.6" width="5.6" height="5.6" rx="1" fill="#f2b134"/></svg>`;

export const logo = (cls = '') =>
  `<a class="logo ${cls}" href="${href('/')}">${logoMark()}<span class="logo-word"><span class="logo-name"><i>Mr</i>Press</span> <span class="logo-sub">Education</span></span></a>`;

export const icon = (cat, size = 24) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false">${icons[cat] || icons['business-and-office']}</svg>`;

const NAV = [
  ['Careers', '/careers/'], ['Training', '/training/'], ['Quizzes', '/quizzes/'], ['Students', '/students/'],
  ['Career Changers', '/career-changers/'], ['Employers', '/employers/'], ['Guides', '/guides/'], ['Blog', '/blog/']
];

function header(path) {
  const items = NAV.map(([t, p]) => `<a href="${href(p)}"${path.startsWith(p) || (p === '/employers/' && path.startsWith('/for-')) ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  return `<header class="site-header"><div class="wrap hdr">${logo()}<button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu <span aria-hidden="true">☰</span></button><nav class="nav" id="nav" aria-label="Main">${items}<a class="search-link" href="${href('/search/')}" aria-label="Search the site"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></a><a class="btn btn-primary btn-sm" href="${href('/enroll/')}">Enroll</a></nav></div></header>`;
}

function footer() {
  const cats = G.categories.map((c) => `<li><a href="${href(`/careers/${c.slug}/`)}">${esc(c.name)}</a></li>`).join('');
  const popular = ['medical-assistant', 'electrician', 'hvac-technician', 'pharmacy-technician', 'truck-driver', 'cybersecurity-analyst', 'phlebotomist', 'occupational-safety-specialist']
    .map((s) => G.careers.find((c) => c.slug === s)).filter(Boolean)
    .map((c) => `<li><a href="${href(`/training/${c.slug}/`)}">${esc(c.title)} Training</a></li>`).join('');
  const legal = [['Privacy Policy', '/privacy-policy/'], ['Terms of Use', '/terms-of-use/'], ['Cookie Policy', '/cookie-policy/'], ['Accessibility', '/accessibility/'], ['Refund Policy', '/refund-policy/'], ['Disclaimer', '/disclaimer/'], ['Your Privacy Choices', '/your-privacy-choices/'], ['Non-Discrimination', '/non-discrimination/'], ['Copyright', '/copyright-policy/']]
    .map(([t, p]) => `<a href="${href(p)}">${t}</a>`).join(' · ');
  return `<footer class="site-footer"><div class="wrap"><div class="fgrid">
<div>${logo()}<p style="margin-top:14px">Career training by job title, plus free tools to help students and working adults choose — and change — careers.</p><p><a href="tel:${cfg.phoneE164}">${cfg.phone}</a><br><a href="mailto:${cfg.email}">${cfg.email}</a></p></div>
<div><h2>Careers</h2><ul>${cats}<li><a href="${href('/careers/')}">All 50 careers</a></li><li><a href="${href('/salary-guide/')}">Salary guide</a></li></ul></div>
<div><h2>Trainings</h2><ul>${popular}<li><a href="${href('/training/')}">All trainings</a></li></ul></div>
<div><h2>Resources</h2><ul><li><a href="${href('/quizzes/career-match/')}">Career Match Quiz</a></li><li><a href="${href('/quizzes/')}">All quizzes</a></li><li><a href="${href('/guides/')}">Career guides</a></li><li><a href="${href('/students/')}">For students</a></li><li><a href="${href('/career-changers/')}">For career changers</a></li><li><a href="${href('/professionals/')}">For working professionals</a></li><li><a href="${href('/best-careers/')}">Best careers lists</a></li><li><a href="${href('/glossary/')}">Career glossary</a></li><li><a href="${href('/resources/')}">Free worksheets</a></li><li><a href="${href('/blog/')}">Blog</a></li></ul></div>
<div><h2>Employers</h2><ul><li><a href="${href('/for-employers/')}">Onboarding training for employers</a></li><li><a href="${href('/for-staffing-agencies/')}">For recruiters &amp; staffing agencies</a></li><li><a href="${href('/for-workforce-programs/')}">For schools &amp; workforce programs</a></li><li><a href="${href('/employers/')}">Employer resource center</a></li><li><a href="${href('/employers/hiring-guides/')}">Hiring guides by job</a></li><li><a href="${href('/employers/training-roi-calculator/')}">Training ROI calculator</a></li></ul><h2 style="margin-top:22px">Company</h2><ul><li><a href="${href('/about/')}">About us</a></li><li><a href="${href('/how-it-works/')}">How it works</a></li><li><a href="${href('/enroll/')}">Enroll</a></li><li><a href="${href('/contact/')}">Contact</a></li><li><a href="${href('/faq/')}">FAQ</a></li><li><a href="${href('/editorial-policy/')}">Editorial policy</a></li><li><a href="${href('/sitemap/')}">Site map</a></li></ul></div>
</div>
<p class="us-only"><strong>U.S. only:</strong> MrPress Education serves learners in the United States. This website and our policies are designed to comply with applicable U.S. federal and state law only. See our <a href="${href('/privacy-policy/')}">Privacy Policy</a>.</p>
<div class="fbottom"><span>© ${cfg.updated.slice(0, 4)} ${esc(cfg.legalName)}. All rights reserved.</span><span>${legal}</span></div>
</div></footer>`;
}

export const crumbsHtml = (crumbs) =>
  crumbs?.length ? `<nav class="crumbs" aria-label="Breadcrumb"><ol>${crumbs.map(([n, p], i) => `<li>${i === crumbs.length - 1 ? `<span aria-current="page">${esc(n)}</span>` : `<a href="${href(p)}">${esc(n)}</a>`}</li>`).join('')}</ol></nav>` : '';

export const pageHero = ({ crumbs, eyebrow, h1, lead, meta = true, extra = '', aka }) =>
  `<section class="page-hero"><div class="wrap">${crumbsHtml(crumbs)}${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h1>${h1}</h1>${aka ? `<p class="aka">${aka}</p>` : ''}${lead ? `<p class="lead">${lead}</p>` : ''}${meta ? `<div class="meta"><span>Updated <time datetime="${typeof meta === 'string' ? meta : cfg.updated}">${fmtDate(typeof meta === 'string' ? meta : cfg.updated)}</time></span><span>By the MrPress Education Curriculum Team</span></div>` : ''}${extra}</div></section>`;

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
  return `<!doctype html><html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}"><meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'}"><link rel="alternate" hreflang="en-US" href="${url}"><link rel="alternate" hreflang="x-default" href="${url}"><meta property="og:site_name" content="${cfg.name}"><meta property="og:locale" content="en_US"><meta property="og:type" content="${type}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${abs(og)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(ogAlt || title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${abs(og)}">${type === 'article' ? `<meta property="article:published_time" content="${published || cfg.launched}"><meta property="article:modified_time" content="${modified || cfg.updated}">` : ''}${cfg.verification.google ? `<meta name="google-site-verification" content="${cfg.verification.google}">` : ''}${cfg.verification.bing ? `<meta name="msvalidate.01" content="${cfg.verification.bing}">` : ''}<meta name="theme-color" content="#13294b"><meta name="format-detection" content="telephone=no"><link rel="icon" href="${href('/favicon.svg')}" type="image/svg+xml"><link rel="icon" href="${href('/favicon.ico')}" sizes="32x32"><link rel="apple-touch-icon" href="${href('/apple-touch-icon.png')}"><link rel="manifest" href="${href('/site.webmanifest')}"><link rel="alternate" type="application/rss+xml" title="MrPress Education Blog" href="${href('/blog/feed.xml')}"><style>${CSS}</style><script type="application/ld+json">${ld}</script></head><body${mcta ? ' class="has-mcta"' : ''}><a class="skip" href="#main">Skip to main content</a>${header(path)}<main id="main">${body}</main>${footer()}${mobile}<script>window.MP=${JSON.stringify({ base: cfg.basePath, ga: cfg.analytics.ga4 || '' })}</script>${js}</body></html>`;
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
