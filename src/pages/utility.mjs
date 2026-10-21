import { esc, href, clamp, fitTitle, countLabel } from '../lib/util.mjs';
import { pageHero } from '../lib/layout.mjs';

export function utilityPages(ctx, all) {
  const pages = [];
  // Search (noindex)
  pages.push({
    path: '/search/', crumbs: [['Home', '/'], ['Search', '/search/']], noindex: true, scripts: ['search'], og: '/og/default.png',
    title: fitTitle('Search Careers, Trainings & Guides'), desc: 'Search Career Education Institute career profiles, trainings, quizzes, guides and employer resources.',
    body: `${pageHero({ crumbs: [['Home', '/'], ['Search', '/search/']], eyebrow: 'Search', h1: 'Search Career Education Institute', meta: false })}<div class="wrap" style="padding-top:30px;padding-bottom:60px;max-width:860px"><form data-search role="search" class="filters" action="${href('/search/')}"><div class="field" style="flex:4"><label for="sq">What are you looking for?</label><input id="sq" name="q" type="search" placeholder="Try “electrician salary” or “how to become a CNA”" autocomplete="off"></div><button class="btn btn-primary" type="submit">Search</button></form><div class="search-tools" data-tools hidden><div class="st-types" role="group" aria-label="Filter by type" data-types></div><div class="st-right"><label class="st-sort"><span>Sort by</span><select data-sort><option value="rel">Best match</option><option value="az">Title: A to Z</option><option value="za">Title: Z to A</option></select></label><div class="st-view" role="group" aria-label="Show results as"><button type="button" data-view="list" aria-pressed="true"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>List</button><button type="button" data-view="grid" aria-pressed="false"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 3h5v5H3zM12 3h5v5h-5zM3 12h5v5H3zM12 12h5v5h-5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>Grid</button></div></div></div><p class="muted" data-status aria-live="polite">Type a career, skill or question.</p><ul class="list-view search-results" data-results></ul><p data-more-row hidden><button class="btn" type="button" data-more>Show more results</button></p></div>`, schema: []
  });

  // HTML sitemap
  // Hub-level pages only: every career, training, practice test and comparison is linked from its field's pages.
  const fields = new Set(ctx.categories.map((c) => c.slug));
  const fieldHub = (p, root) => p.path === root || (p.path.startsWith(root) && fields.has(p.path.slice(root.length).replace(/\/$/, '')));
  const groups = [['Careers by field', (p) => fieldHub(p, '/careers/')], ['Salary guides', (p) => p.path.startsWith('/salary-guide/')], ['Trainings', (p) => p.path === '/training/' || p.path === '/enroll/' || p.path === '/how-it-works/'], ['Online courses', (p) => p.path.startsWith('/courses/')], ['Quizzes', (p) => p.path.startsWith('/quizzes/')], ['Guides & worksheets', (p) => p.path.startsWith('/guides/') || p.path.startsWith('/resources/')], ['Best careers lists', (p) => p.path.startsWith('/best-careers/')], ['Comparisons', (p) => fieldHub(p, '/compare/')], ['Employers', (p) => p.path.startsWith('/employers/') && p.path.split('/').length <= 4 || p.path.startsWith('/for-')], ['Partner program', (p) => p.path.startsWith('/partners/')], ['Blog', (p) => p.path === '/blog/' || p.path === '/newsletter/'], ['Company & legal', (p) => p.path.split('/').length === 3 && !/^\/(careers|training|courses|quizzes|guides|resources|best-careers|compare|employers|blog|search|partners|salary-guide|enroll|how-it-works)\//.test(p.path) && !p.path.startsWith('/for-')]];
  // The blog is a separate site at /blog/ (repo "blog"), so it gets a single entry here.
  const list = [...all.filter((p) => !p.noindex && !p.raw && p.path !== '/'), { path: '/blog/', name: 'Career advice blog' }];
  pages.push({
    path: '/sitemap/', crumbs: [['Home', '/'], ['Site map', '/sitemap/']], og: '/og/default.png', kind: 'Page', name: 'Site map',
    title: fitTitle('Site Map: All Careers, Trainings & Guides'), desc: clamp('Browse every section of Career Education Institute: career profiles and salaries, trainings, practice tests, quizzes, guides, comparisons, employer resources, blog and policies.'),
    body: `${pageHero({ crumbs: [['Home', '/'], ['Site map', '/sitemap/']], eyebrow: 'Site map', h1: 'Site Map', lead: `The main sections of Career Education Institute. Each field page lists its careers, and each of our ${countLabel(ctx.careers.length)} careers has subpages for salary, day in the life, how to become, skills, glossary, how-to guides, interview questions, FAQ, a fit quiz, training and a practice test.`, meta: false })}<div class="wrap" style="padding-top:30px;padding-bottom:60px"><div class="cols">${groups.map(([t, f]) => { const ps = list.filter(f); return ps.length ? `<div><h2 style="font-size:1.2rem;margin-top:0">${t}</h2><ul>${ps.map((p) => `<li><a href="${href(p.path)}">${esc(p.name || p.title)}</a></li>`).join('')}</ul></div>` : ''; }).join('')}</div></div>`, schema: []
  });

  // 404
  pages.push({
    path: '/404.html', file: '404.html', noindex: true, og: '/og/default.png',
    title: 'Page Not Found | Career Education Institute', desc: 'The page you were looking for could not be found. Explore careers, trainings, quizzes, guides and employer resources from Career Education Institute.',
    body: `${pageHero({ eyebrow: 'Error 404', h1: 'We couldn’t find that page', lead: 'The page may have moved, or the link may be mistyped. Try one of these instead:', meta: false })}<div class="wrap" style="padding-top:30px;padding-bottom:60px"><div class="grid">${[['Explore careers', '/careers/'], ['Browse trainings', '/training/'], ['Take the Career Match Quiz', '/quizzes/career-match/'], ['Read career guides', '/guides/'], ['Employer resources', '/employers/'], ['Search the site', '/search/']].map(([t, l]) => `<article class="card link"><h3><a class="stretch" href="${href(l)}">${t}</a></h3></article>`).join('')}</div></div>`, schema: []
  });
  return pages;
}
