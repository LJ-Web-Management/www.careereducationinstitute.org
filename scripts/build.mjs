// Static site generator for Career Education Institute. Usage: node scripts/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import cfg from '../site.config.mjs';
import { abs, esc, href, wordCount } from '../src/lib/util.mjs';
import { layout, setGlobals, CSS, shell } from '../src/lib/layout.mjs';
import { partnerCourses } from '../src/lib/partners.mjs';
import { categories } from '../src/data/categories.mjs';
import { enrich, compareSlug } from '../src/lib/career-helpers.mjs';
import { careerPages, comparePage } from '../src/pages/careers.mjs';
import { trainingPages, trainingCatalog } from '../src/pages/training.mjs';
import { hubPages, directoryData } from '../src/pages/hubs.mjs';
import { homePage } from '../src/pages/home.mjs';
import { quizPages, quizCareerData } from '../src/pages/quizzes.mjs';
import { guidePages } from '../src/pages/guides.mjs';
import { companyPages } from '../src/pages/company.mjs';
import { legalPages } from '../src/pages/legal.mjs';
import { newsletterPages } from '../src/pages/newsletter.mjs';
import { utilityPages } from '../src/pages/utility.mjs';
import { employerPages } from '../src/pages/employers.mjs';
import { coursePages } from '../src/pages/courses.mjs';
import { partnerPages } from '../src/pages/partners.mjs';
import { writeImages } from './images.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const t0 = Date.now();

// ---------- Load data ----------
const labor = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/labor.json'), 'utf8'));
const careerDir = path.join(ROOT, 'src/data/careers');
let raw = [];
for (const f of fs.readdirSync(careerDir).filter((f) => f.endsWith('.mjs')).sort()) {
  raw = raw.concat((await import(pathToFileURL(path.join(careerDir, f)).href)).default);
}
const catOrder = categories.map((c) => c.slug);
const careers = raw.map((c) => enrich(c, labor)).sort((a, b) => catOrder.indexOf(a.cat) - catOrder.indexOf(b.cat) || a.title.localeCompare(b.title));
const byslug = Object.fromEntries(careers.map((c) => [c.slug, c]));
for (const c of careers) for (const r of c.related) if (!byslug[r]) console.warn(`! ${c.slug} relates to missing career ${r}`);
// The blog is a separate site (repo blog.careereducationinstitute.org, at cfg.blogUrl). The homepage shows its latest
// posts from the live blog's posts.json (locally: the blog repo's dist/ next to this one). BLOG_POSTS_URL overrides
// either. If the file can't be read, the homepage simply skips its blog section.
const blogSrc = process.env.BLOG_POSTS_URL || (/localhost/.test(cfg.url) ? path.resolve(ROOT, '../careereducationinstitute-blog/dist/posts.json') : `${cfg.blogUrl}/posts.json`);
let posts = [];
try {
  posts = /^https?:/.test(blogSrc)
    ? await fetch(blogSrc, { signal: AbortSignal.timeout(10000) }).then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    : JSON.parse(fs.readFileSync(blogSrc, 'utf8'));
} catch (e) { console.warn(`! blog posts not loaded from ${blogSrc} (${e.message}); homepage blog section skipped`); }
const cats = categories.filter((cat) => careers.some((c) => c.cat === cat.slug));
setGlobals({ careers, categories: cats, partners: partnerCourses });
const ctx = { labor, careers, byslug, categories: cats, posts, ROOT };

// ---------- Generate pages ----------
const pages = [];
for (const c of careers) pages.push(...careerPages(c, ctx), ...trainingPages(c, ctx));
const pairs = new Map();
for (const c of careers) for (const r of c.related) if (byslug[r]) pairs.set(compareSlug(c.slug, r), [c, byslug[r]]);
ctx.pairs = [...pairs.values()];
for (const [a, b] of ctx.pairs) pages.push(comparePage(a, b, ctx));
pages.push(trainingCatalog(ctx), homePage(ctx), ...hubPages(ctx), ...quizPages(ctx), ...guidePages(ctx), ...companyPages(ctx), ...legalPages(ctx), ...newsletterPages(), ...employerPages(ctx), ...coursePages(ctx), ...partnerPages(ctx));
pages.push(...utilityPages(ctx, pages)); // search, sitemap page, 404 (needs the full list)

// ---------- Write ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
const seen = new Set();
for (const p of pages) {
  if (seen.has(p.path)) throw new Error('Duplicate path ' + p.path);
  seen.add(p.path);
  // No em dashes anywhere in published pages (style rule); convert any that slip through.
  const html = (p.raw ? p.content : layout(p)).replace(/[ \t]*\u2014[ \t]*/g, ', ');
  const file = p.file ? path.join(DIST, p.file) : path.join(DIST, p.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// ---------- Assets ----------
const minJs = (s) => s.replace(/^\s*\/\/.*$/gm, '').replace(/\n\s+/g, '\n').replace(/\n{2,}/g, '\n').trim();
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
fs.writeFileSync(path.join(DIST, 'assets', 'styles.css'), CSS);
fs.writeFileSync(path.join(DIST, 'assets', 'shell.json'), JSON.stringify(shell())); // read by the blog's build
// Data loaded on demand by the careers directory filter and the all-careers quizzes
fs.writeFileSync(path.join(DIST, 'assets', 'careers.json'), JSON.stringify(directoryData(careers)));
fs.writeFileSync(path.join(DIST, 'assets', 'quiz-careers.json'), JSON.stringify(quizCareerData(careers)));
for (const f of fs.readdirSync(path.join(ROOT, 'src/assets')).filter((f) => f.endsWith('.js'))) {
  fs.writeFileSync(path.join(DIST, 'assets', f), minJs(fs.readFileSync(path.join(ROOT, 'src/assets', f), 'utf8')));
}
if (fs.existsSync(path.join(ROOT, 'static'))) fs.cpSync(path.join(ROOT, 'static'), DIST, { recursive: true });
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
if (process.env.CNAME) fs.writeFileSync(path.join(DIST, 'CNAME'), process.env.CNAME);

// ---------- SEO files ----------
const indexable = pages.filter((p) => !p.noindex && !p.file);
const groups = { main: [], careers: [], training: [], courses: [], guides: [], employers: [], blog: [] };
for (const p of indexable) {
  const g = p.path.startsWith('/careers/') || p.path.startsWith('/compare/') || p.path.startsWith('/best-careers/') ? 'careers' : p.path.startsWith('/training/') ? 'training' : p.path.startsWith('/courses/') ? 'courses' : p.path.startsWith('/guides/') || p.path.startsWith('/resources/') || p.path.startsWith('/quizzes/') ? 'guides' : p.path.startsWith('/blog/') ? 'blog' : p.path.startsWith('/employers/') || p.path.startsWith('/for-') ? 'employers' : 'main';
  groups[g].push(p);
}
const urlset = (list) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${list.map((p) => `<url><loc>${abs(p.path)}</loc><lastmod>${p.modified || cfg.updated}</lastmod>${p.og ? `<image:image><image:loc>${abs(p.og)}</image:loc></image:image>` : ''}</url>`).join('\n')}\n</urlset>\n`;
for (const [g, list] of Object.entries(groups)) if (list.length) fs.writeFileSync(path.join(DIST, `sitemap-${g}.xml`), urlset(list));
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.entries(groups).filter(([, l]) => l.length).map(([g, l]) => `<sitemap><loc>${abs(`/sitemap-${g}.xml`)}</loc><lastmod>${l.map((p) => p.modified || cfg.updated).sort().at(-1)}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`); // the blog is its own site and lists its own sitemap in its robots.txt

const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot', 'Amazonbot', 'meta-externalagent', 'MistralAI-User', 'cohere-ai', 'CCBot', 'YouBot'];
fs.writeFileSync(path.join(DIST, 'robots.txt'), `# Career Education Institute: all search engines and AI assistants are welcome.\nUser-agent: *\nAllow: /\nDisallow: ${cfg.basePath}/search/?\n\n${aiBots.map((b) => `User-agent: ${b}\nAllow: /`).join('\n\n')}\n\nSitemap: ${abs('/sitemap.xml')}\n`);

fs.writeFileSync(path.join(DIST, 'site.webmanifest'), JSON.stringify({ name: cfg.name, short_name: cfg.shortName, description: cfg.description, start_url: href('/'), scope: href('/'), display: 'standalone', background_color: '#faf8f3', theme_color: '#022350', icons: [{ src: href('/icons/icon-192.png'), sizes: '192x192', type: 'image/png' }, { src: href('/icons/icon-512.png'), sizes: '512x512', type: 'image/png' }, { src: href('/icons/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' }] }, null, 1));
fs.mkdirSync(path.join(DIST, '.well-known'), { recursive: true });
fs.writeFileSync(path.join(DIST, '.well-known/security.txt'), `Contact: mailto:${cfg.email}\nExpires: ${Number(cfg.updated.slice(0, 4)) + 1}-12-31T23:59:59.000Z\nPreferred-Languages: en\nCanonical: ${abs('/.well-known/security.txt')}\n`);

// Search index
// Search index: descriptions are shortened to keep the download small; keywords only when a page has them.
const snip = (d = '', n = 120) => (d.length <= n ? d : d.slice(0, d.lastIndexOf(' ', n)).replace(/[,;:.\s]+$/, '') + '…');
// Per-career subpages that are reached from the career page itself stay out of the index, as do the individual
// X vs. Y pages (searching both titles finds the careers), so the download stays small with many careers.
const notSearched = new Set(['Day in the life', 'Skills', 'Glossary', 'How-to guides', 'Interview questions', 'FAQ', 'Quiz', 'Practice test', 'Onboarding plan']);
const inSearch = (p) => p.kind && !(notSearched.has(p.kind) && !/^\/(glossary|quizzes)\//.test(p.path)) && !(p.kind === 'Comparison' && p.path.includes('-vs-'));
fs.writeFileSync(path.join(DIST, 'search-index.json'), JSON.stringify(indexable.filter(inSearch).map((p) => ({ t: p.name || p.title, u: p.path, d: snip(p.desc), y: p.kind, ...(p.keywords ? { k: p.keywords } : {}) }))));

// llms.txt (AI assistant guide) + llms-full.txt (facts for every career)
const money = (n) => '$' + Math.round(n).toLocaleString('en-US');
const llms = `# ${cfg.name}

> ${cfg.description} Pay data comes from the U.S. Bureau of Labor Statistics (${labor.meta.wageSource}); outlook from ${labor.meta.projectionsSource}. Content last reviewed ${cfg.updated}.

${cfg.name} publishes free, plain-language career information for ${careers.length} job titles (what the job is, a day in the life, salary percentiles, how to become one, skills, vocabulary, step-by-step tasks, interview questions and FAQs), career quizzes, and college and career-change guides. It also sells general, non-credit online training courses by job title for U.S. learners. Enrollment: ${abs('/enroll/')} · Phone ${cfg.phone} · ${cfg.email}

## Start here
- [Career Match Quiz](${abs('/quizzes/career-match/')}): free interest-based quiz that recommends careers from our ${careers.length} profiles
- [All careers](${abs('/careers/')}): directory with pay, growth and training time
- [Salary guide](${abs('/salary-guide/')}): BLS median pay for all ${careers.length} careers
- [All trainings](${abs('/training/')}): online courses by job title
- [Job-title courses to buy online](${abs('/courses/')}): CDL Entry-Level Driver Training (Class A and B), forklift operator, flagger and mold inspector, bought online
- [Guides](${abs('/guides/')}): choosing a career, college vs. trade school, changing careers, resumes, interviews
- [For students](${abs('/students/')}) · [For career changers](${abs('/career-changers/')}) · [For working professionals](${abs('/professionals/')})
- [Full facts for every career (llms-full.txt)](${abs('/llms-full.txt')})

## Career profiles by field
Each profile has salary, how to become, day in the life, skills, glossary, how-to, interview questions, FAQ, training and practice test pages. Summaries for every career are in llms-full.txt.
${cats.map((cat) => `\n### [${cat.name}](${abs(`/careers/${cat.slug}/`)})\n${careers.filter((c) => c.cat === cat.slug).map((c) => `- [${c.title}](${abs(c.url)}): median pay ${money(c.l.wages.median)}, training ${c.train}`).join('\n')}`).join('\n')}

## Guides
${pages.filter((p) => p.path.startsWith('/guides/') && p.path !== '/guides/').map((p) => `- [${p.name || p.title}](${abs(p.path)}): ${p.desc}`).join('\n')}

## Policies
- [Privacy Policy](${abs('/privacy-policy/')}): U.S.-only service
- [Terms of Use](${abs('/terms-of-use/')})
- [Editorial policy and data sources](${abs('/editorial-policy/')})
`;
fs.writeFileSync(path.join(DIST, 'llms.txt'), llms);
const full = `# ${cfg.name}: career facts (${careers.length} careers)\n\nSource of pay data: ${labor.meta.wageSource}. Projections: ${labor.meta.projectionsSource}. Reviewed ${cfg.updated}. National U.S. figures.\n\n${careers.map((c) => `## ${c.title}\nURL: ${abs(c.url)}\nAlso called: ${c.aka.join(', ')}\nSOC: ${c.l.soc} (${c.l.blsTitle})\nSummary: ${c.summary}\nMedian annual pay: ${money(c.l.wages.median)}${c.l.wages.hourly != null ? ` (${'$' + c.l.wages.hourly.toFixed(2)}/hour)` : ' (annual wages only)'}. 10th percentile ${money(c.l.wages.p10)}; 90th percentile ${money(c.l.wages.p90)}.\nProjected growth ${labor.meta.projections}: ${c.l.growthPct}%; about ${c.l.annualOpenings.toLocaleString('en-US')} openings per year.\nTypical entry education (BLS): ${c.l.entryEducation}. Typical training time: ${c.train}.\nKey duties: ${c.duties.join('; ')}.\nCertifications: ${c.certs.map((x) => x[0]).join('; ')}.\nSkills: ${[...c.hard, ...c.soft].join('; ')}.\nHow to become: ${c.steps.map((s, i) => `${i + 1}) ${s[0]}`).join(' ')}\nTraining course: ${abs(c.trainingUrl)}\n`).join('\n')}`;
fs.writeFileSync(path.join(DIST, 'llms-full.txt'), full);

await writeImages({ DIST, careers, categories: cats, ROOT });

const words = pages.reduce((a, p) => a + wordCount(p.body || ''), 0);
console.log(`Built ${pages.length} pages (${indexable.length} indexable, ~${Math.round(words / 1000)}k words) for ${cfg.url} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
