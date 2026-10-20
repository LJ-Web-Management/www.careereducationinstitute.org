import cfg from '../../site.config.mjs';
import { esc, href, abs, money, money2, pct, num, clamp, fitTitle, fmtDate, listJoin } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, ctaCard, sideLinks, answerBox, icon, careerCard, band } from '../lib/layout.mjs';
import { dataNote, growthWord, compareSlug, EDU_LABEL } from '../lib/career-helpers.mjs';
import { lists as allLists } from '../data/lists.mjs';
import { guides, gp } from '../data/guides/index.mjs';
import { fieldCourses } from '../lib/partners.mjs';

// Careers directory data for the filter (src/assets/site.js loads it only when someone filters or sorts)
export const directoryData = (careers) => careers.map((c) => ({ n: c.title, u: c.url, c: c.cat, e: c.eduLevel, m: c.l.wages.median, g: c.l.growthPct, mo: c.months, t: c.train, b: c.blurb, k: (c.title + ' ' + c.aka.join(' ')).toLowerCase() }));

const careerTable = (cs, labor, metric) => `<div class="table-wrap"><table data-sortable><thead><tr><th scope="col">#</th><th scope="col" data-sort="text">Career</th><th scope="col" class="num" data-sort="num">Median pay</th><th scope="col" class="num" data-sort="num">Growth ${labor.meta.projections}</th>${metric === 'openings' ? '<th scope="col" class="num" data-sort="num">Openings/yr</th>' : ''}<th scope="col">Training time</th><th scope="col">Typical entry education</th></tr></thead><tbody>${cs.map((c, i) => `<tr><td>${i + 1}</td><td><a href="${href(c.url)}">${esc(c.title)}</a></td><td class="num" data-v="${c.l.wages.median}">${money(c.l.wages.median)}</td><td class="num" data-v="${c.l.growthPct}">${pct(c.l.growthPct)}</td>${metric === 'openings' ? `<td class="num" data-v="${c.l.annualOpenings}">${num(c.l.annualOpenings)}</td>` : ''}<td>${esc(c.train)}</td><td>${esc(c.l.entryEducation)}</td></tr>`).join('')}</tbody></table></div>`;

const guideCards = (gs) => `<div class="grid">${gs.map((g) => `<article class="card link"><h3><a class="stretch" href="${href(gp(g))}">${esc(g.title)}</a></h3><p>${esc(g.desc)}</p><span class="more">Read guide →</span></article>`).join('')}</div>`;

export function hubPages(ctx) {
  const { careers, categories, labor, byslug, pairs } = ctx;
  const lists = allLists.filter((l) => careers.some(l.filter));
  const pages = [];

  // ---------- Careers directory ----------
  {
    const path = '/careers/';
    const crumbs = [['Home', '/'], ['Careers', path]];
    const body = `${pageHero({ crumbs, eyebrow: `${careers.length} career profiles`, h1: 'Explore Careers', lead: `Pay, training time, job growth and what the work is really like, for ${careers.length} in-demand U.S. careers. Filter by field or education, or sort by pay and growth.`, meta: true })}
<div class="wrap" style="padding-top:30px;padding-bottom:60px">${dataNote(labor)}
<form class="filters" data-filter role="search" aria-label="Filter careers"><div class="field"><label for="f-q">Search</label><input id="f-q" name="q" type="search" placeholder="e.g. nurse, electrician"></div><div class="field"><label for="f-cat">Field</label><select id="f-cat" name="cat"><option value="">All fields</option>${categories.map((c) => `<option value="${c.slug}">${esc(c.name)}</option>`).join('')}</select></div><div class="field"><label for="f-edu">Education I want</label><select id="f-edu" name="edu"><option value="">Any</option><option value="1">High school or less</option><option value="2">Up to a certificate</option><option value="3">Up to associate/apprenticeship</option><option value="4">Bachelor’s or higher</option></select></div><div class="field"><label for="f-sort">Sort by</label><select id="f-sort" name="sort"><option value="">Field</option><option value="median">Highest pay</option><option value="growth">Fastest growth</option><option value="train">Fastest training</option><option value="name">A–Z</option></select></div><p class="count" data-count aria-live="polite">${careers.length} careers</p></form>
<div class="grid" data-cards hidden></div>
<div data-dir>${categories.map((cat) => { const cs = careers.filter((c) => c.cat === cat.slug).sort((a, b) => a.title.localeCompare(b.title)); return `<section id="${cat.slug}" style="scroll-margin-top:90px"><h2>${icon(cat.slug, 26)} <a href="${href(`/careers/${cat.slug}/`)}">${esc(cat.name)}</a> <span class="muted small">${cs.length} careers</span></h2><ul class="linklist">${cs.map((c) => `<li><a href="${href(c.url)}">${esc(c.title)}</a> <span class="muted small">${money(c.l.wages.median)}</span></li>`).join('')}</ul></section>`; }).join('')}</div>
<section class="section" style="padding-bottom:0"><h2>Browse by field</h2><div class="grid">${categories.map((c) => `<article class="card link"><span class="ico">${icon(c.slug)}</span><h3><a class="stretch" href="${href(`/careers/${c.slug}/`)}">${esc(c.name)}</a></h3><p>${esc(c.blurb)}</p></article>`).join('')}</div></section>
<section class="section" style="padding-bottom:0"><h2>Popular career lists</h2><ul>${lists.map((l) => `<li><a href="${href(`/best-careers/${l.slug}/`)}">${esc(l.title)}</a></li>`).join('')}</ul></section></div>
${band('Not sure where to start?', 'Answer 24 quick questions and get matched with careers that fit your interests.', 'Take the Career Match Quiz', '/quizzes/career-match/', 'See all quizzes', '/quizzes/')}`;
    pages.push({ path, crumbs, body, og: '/og/default.png', kind: 'Directory', name: 'All careers',
      title: fitTitle(`Explore ${careers.length} Careers: Pay, Training & Outlook`),
      desc: clamp(`Explore ${careers.length} U.S. careers with BLS pay data, job growth, training time and day-in-the-life details. Filter by field and education to find your next career.`),
      schema: [] }); // each field page carries its own ItemList; one list of every career would be very large
  }

  // ---------- Category hubs ----------
  for (const cat of categories) {
    const path = `/careers/${cat.slug}/`;
    const cs = careers.filter((c) => c.cat === cat.slug);
    const crumbs = [['Home', '/'], ['Careers', '/careers/'], [cat.name, path]];
    const sorted = [...cs].sort((a, b) => b.l.wages.median - a.l.wages.median);
    const fastest = [...cs].sort((a, b) => a.months - b.months)[0];
    const growth = [...cs].sort((a, b) => b.l.growthPct - a.l.growthPct)[0];
    const faqs = [
      [`What is the highest-paying ${cat.noun} career on this list?`, `${sorted[0].title} has the highest median pay among our ${cat.noun} profiles at ${money(sorted[0].l.wages.median)} per year (BLS, ${labor.meta.oewsLabel}).`],
      [`Which ${cat.noun} career is fastest to start?`, `${fastest.title} typically takes about ${fastest.train} of training.`],
      [`Which ${cat.noun} career is growing fastest?`, `${growth.title}, with projected growth of ${pct(growth.l.growthPct)} from ${labor.meta.projections} (${growthWord(growth.l.growthPct)}).`],
      [`How do I choose the right ${cat.noun} career?`, `Compare day-to-day duties, training time and pay, then take our ${cat.name} career quiz for a personalized match. Reading a day in the life for your top two choices helps a lot.`]
    ];
    const partner = fieldCourses(cat.slug);
    const body = `${pageHero({ crumbs, eyebrow: 'Career field', h1: `${esc(cat.name)} Careers`, lead: esc(cat.blurb) })}
<div class="wrap layout"><div class="prose">${cat.intro.map((p) => `<p>${esc(p)}</p>`).join('')}${dataNote(labor)}
<h2 id="careers">${cs.length} ${esc(cat.noun)} careers</h2><div class="grid-2">${cs.map((c) => careerCard(c, c.l)).join('')}</div>
<h2 id="compare">Compare ${esc(cat.noun)} careers</h2>${careerTable(sorted, labor)}
<h2 id="tips">Getting hired in ${esc(cat.noun)}</h2><p>${esc(cat.tips)}</p><h3>What affects pay in this field</h3><ul>${cat.payFactors.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>${partner}
<h2 id="quiz">Find your fit</h2><p>Take the <a href="${href(`/quizzes/which-${cat.slug}-career-is-right-for-me/`)}">${esc(cat.name)} career quiz</a> to see which of these roles matches your interests best.</p>
${faqBlock(faqs, `${cat.name} careers FAQ`)}</div>
<aside>${ctaCard({ title: `${cat.name} trainings`, text: `Practical online courses for every ${cat.noun} career on this page.`, btn: 'Browse trainings', link: `/training/#${cat.slug}` })}${sideLinks('Other fields', categories.filter((c) => c !== cat).map((c) => [c.name, `/careers/${c.slug}/`]))}</aside></div>`;
    pages.push({ path, crumbs, body, og: `/og/cat-${cat.slug}.png`, kind: 'Career field', name: `${cat.name} careers`,
      title: fitTitle(`${cat.name} Careers: Pay, Training & Outlook`.length <= 60 ? `${cat.name} Careers: Pay, Training & Outlook` : `${cat.name} Careers`),
      desc: clamp(`Compare ${cs.length} ${cat.noun} careers (${listJoin(cs.slice(0, 3).map((c) => c.title.toLowerCase()))} and more) by median pay, job growth, training time and daily duties.`),
      schema: [{ '@type': 'ItemList', itemListElement: cs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(c.url), name: c.title })) }, faqSchema(faqs, path)] });
  }

  // ---------- Compare index (one page per field, so each stays small) ----------
  {
    const path = '/compare/';
    const crumbs = [['Home', '/'], ['Careers', '/careers/'], ['Compare careers', path]];
    const byField = categories.map((cat) => [cat, pairs.filter(([a]) => a.cat === cat.slug)]).filter(([, ps]) => ps.length);
    const vs = ([a, b]) => { const [x, y] = [a, b].sort((p, q) => p.slug.localeCompare(q.slug)); return [x, y, href(`/compare/${compareSlug(a.slug, b.slug)}/`)]; };
    const body = `${pageHero({ crumbs, eyebrow: `${pairs.length} comparisons`, h1: 'Compare Careers Side by Side', lead: 'Torn between two careers? Compare median pay, training time, job growth and daily duties for related jobs. Pick a field to see every comparison in it.' })}
<div class="wrap" style="padding-top:30px;padding-bottom:60px"><div class="grid">${byField.map(([cat, ps]) => `<article class="card link"><span class="ico">${icon(cat.slug)}</span><h3><a class="stretch" href="${href(`/compare/${cat.slug}/`)}">${esc(cat.name)}</a></h3><p>${ps.length} comparisons, such as ${ps.slice(0, 2).map((p) => { const [x, y] = vs(p); return `${esc(x.title)} vs. ${esc(y.title)}`; }).join(' and ')}.</p></article>`).join('')}</div></div>`;
    pages.push({ path, crumbs, body, og: '/og/compare.png', kind: 'Comparison', name: 'Compare careers',
      title: fitTitle('Compare Careers Side by Side: Pay & Training'),
      desc: clamp(`Compare ${pairs.length} pairs of related careers side by side (median pay, training time, job growth, education and daily duties) to choose the right path.`), schema: [] });
    for (const [cat, ps] of byField) {
      const p = `/compare/${cat.slug}/`;
      const fc = [...crumbs, [cat.name, p]];
      const fbody = `${pageHero({ crumbs: fc, eyebrow: `${ps.length} comparisons`, h1: `Compare ${esc(cat.name)} Careers`, lead: `Side-by-side comparisons of related ${esc(cat.noun)} careers: median pay, training time, job growth and daily duties.` })}
<div class="wrap" style="padding-top:30px;padding-bottom:60px"><ul class="grid" style="list-style:none;padding:0">${ps.map((pr) => { const [x, y, u] = vs(pr); return `<li class="card link" style="margin:0"><a class="stretch" href="${u}"><strong>${esc(x.title)}</strong> vs. <strong>${esc(y.title)}</strong></a><p class="small muted" style="margin:.4em 0 0">${money(x.l.wages.median)} vs. ${money(y.l.wages.median)} median</p></li>`; }).join('')}</ul>
<p style="margin-top:24px"><a href="${href(`/careers/${cat.slug}/`)}">All ${esc(cat.noun)} careers</a> · <a href="${href(path)}">Comparisons in other fields</a></p></div>`;
      pages.push({ path: p, crumbs: fc, body: fbody, og: `/og/cat-${cat.slug}.png`, kind: 'Comparison', name: `Compare ${cat.name} careers`,
        title: fitTitle(`Compare ${cat.short || cat.name} Careers Side by Side`),
        desc: clamp(`${ps.length} side-by-side comparisons of ${cat.noun} careers, such as ${vs(ps[0])[0].title.toLowerCase()} vs. ${vs(ps[0])[1].title.toLowerCase()}: median pay, training time, job growth and daily duties.`), schema: [] });
    }
  }


  // ---------- Salary guide: summary by field, plus one full table per field ----------
  {
    const path = '/salary-guide/';
    const crumbs = [['Home', '/'], ['Salary guide', path]];
    const sorted = [...careers].sort((a, b) => b.l.wages.median - a.l.wages.median);
    const mid = (xs) => { const v = xs.map((c) => c.l.wages.median).sort((a, b) => a - b); return v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2; };
    const head = (field) => `<thead><tr><th scope="col" data-sort="text">Career</th><th scope="col" class="num" data-sort="num">Median/yr</th><th scope="col" class="num" data-sort="num">Median/hr</th><th scope="col" class="num" data-sort="num">10th pct</th><th scope="col" class="num" data-sort="num">90th pct</th><th scope="col" class="num" data-sort="num">Growth</th>${field ? '<th scope="col" data-sort="text">Field</th>' : ''}</tr></thead>`;
    const row = (c, field) => `<tr><td><a href="${href(c.url + 'salary/')}">${esc(c.title)}</a></td><td class="num" data-v="${c.l.wages.median}">${money(c.l.wages.median)}</td><td class="num" data-v="${c.l.wages.hourly ?? (c.l.wages.median / 2080).toFixed(2)}">${c.l.wages.hourly != null ? money2(c.l.wages.hourly) : 'Annual only'}</td><td class="num" data-v="${c.l.wages.p10}">${money(c.l.wages.p10)}</td><td class="num" data-v="${c.l.wages.p90}">${money(c.l.wages.p90)}</td><td class="num" data-v="${c.l.growthPct}">${pct(c.l.growthPct)}</td>${field ? `<td>${esc(categories.find((x) => x.slug === c.cat).name)}</td>` : ''}</tr>`;
    const fields = categories.map((cat) => { const cs = sorted.filter((c) => c.cat === cat.slug); return { cat, cs, mid: mid(cs) }; });
    const faqs = [
      ['Where does this salary data come from?', `All figures come from the U.S. Bureau of Labor Statistics ${labor.meta.wageSource} survey, the most comprehensive source of U.S. wage data by occupation. Growth projections come from the ${labor.meta.projectionsSource}.`],
      ['How often is this salary guide updated?', `BLS publishes new wage estimates each spring. We refresh the guide after each release. Data shown was checked on ${fmtDate(labor.meta.fetched)}.`],
      ['Why is my local pay different?', 'These are national figures. Pay varies widely by state, metro area, employer, union status, experience and credentials.']
    ];
    const body = `${pageHero({ crumbs, eyebrow: `Updated ${fmtDate(labor.meta.fetched)}`, h1: `Salary Guide: Pay for ${careers.length} Careers`, lead: 'Median annual pay, hourly wage, pay range and job growth for every career we profile, from official Bureau of Labor Statistics data. Pick a field for its full, sortable table.' })}
<div class="wrap" style="padding-top:30px;padding-bottom:60px">${dataNote(labor)}
<h2 id="by-field">Pay by field</h2><div class="table-wrap"><table data-sortable><caption class="vh">Median pay by career field, ${labor.meta.oewsLabel}</caption><thead><tr><th scope="col" data-sort="text">Field</th><th scope="col" class="num" data-sort="num">Careers</th><th scope="col" class="num" data-sort="num">Typical median/yr</th><th scope="col" data-sort="text">Highest-paying career</th></tr></thead><tbody>${fields.map(({ cat, cs, mid: m }) => `<tr><td><a href="${href(`/salary-guide/${cat.slug}/`)}">${esc(cat.name)}</a></td><td class="num" data-v="${cs.length}">${cs.length}</td><td class="num" data-v="${m}">${money(m)}</td><td><a href="${href(cs[0].url + 'salary/')}">${esc(cs[0].title)}</a> (${money(cs[0].l.wages.median)})</td></tr>`).join('')}</tbody></table></div><p class="small muted">Typical median is the middle of the median wages for the careers we profile in that field.</p>
<h2 id="top">The 25 highest-paying careers we profile</h2><div class="table-wrap"><table data-sortable><caption class="vh">25 highest-paying careers, ${labor.meta.oewsLabel}</caption>${head(true)}<tbody>${sorted.slice(0, 25).map((c) => row(c, true)).join('')}</tbody></table></div>
<div class="prose">${faqBlock(faqs, 'About this data')}</div></div>`;
    pages.push({ path, crumbs, body, og: '/og/default.png', kind: 'Salary', name: 'Salary guide (all careers)',
      title: fitTitle(`Salary Guide ${cfg.updated.slice(0, 4)}: Pay for ${careers.length} Careers`),
      desc: clamp(`Median salary, hourly pay and pay ranges for ${careers.length} careers from official BLS ${labor.meta.oewsLabel} data, plus job growth, by field. Updated ${fmtDate(labor.meta.fetched)}.`),
      schema: [{ '@type': 'Dataset', name: `Career Education Institute salary guide (${labor.meta.oewsLabel})`, description: `Median and percentile annual wages and projected growth for ${careers.length} U.S. occupations, compiled from BLS OEWS and Employment Projections data.`, url: abs(path), creator: { '@id': abs('/#org') }, isBasedOn: 'https://www.bls.gov/oes/', temporalCoverage: String(labor.meta.oewsYear), spatialCoverage: 'United States', license: 'https://www.bls.gov/opub/copyright-information.htm', dateModified: labor.meta.fetched }, faqSchema(faqs, path)] });
    for (const { cat, cs, mid: m } of fields) {
      const p = `/salary-guide/${cat.slug}/`;
      const fc = [...crumbs, [cat.name, p]];
      const fbody = `${pageHero({ crumbs: fc, eyebrow: `Updated ${fmtDate(labor.meta.fetched)}`, h1: `${esc(cat.name)} Salary Guide: Pay for ${cs.length} Careers`, lead: `Median annual pay, hourly wage, pay range and job growth for ${cs.length} ${esc(cat.noun)} careers, from official Bureau of Labor Statistics data. Click a column to sort.` })}
<div class="wrap" style="padding-top:30px;padding-bottom:60px">${dataNote(labor)}<p>The typical median wage across these ${cs.length} careers is <strong>${money(m)}</strong> a year. The highest-paying is <a href="${href(cs[0].url + 'salary/')}">${esc(cs[0].lower)}</a> at ${money(cs[0].l.wages.median)}.</p>
<div class="table-wrap"><table data-sortable><caption class="vh">Pay for ${cs.length} ${esc(cat.noun)} careers, ${labor.meta.oewsLabel}</caption>${head(false)}<tbody>${cs.map((c) => row(c, false)).join('')}</tbody></table></div>
<p style="margin-top:24px"><a href="${href(`/careers/${cat.slug}/`)}">All ${esc(cat.noun)} careers</a> · <a href="${href(path)}">Salaries in other fields</a></p></div>`;
      pages.push({ path: p, crumbs: fc, body: fbody, og: `/og/cat-${cat.slug}.png`, kind: 'Salary', name: `${cat.name} salary guide`,
        title: fitTitle(`${cat.short || cat.name} Salary Guide ${cfg.updated.slice(0, 4)}: ${cs.length} Careers`),
        desc: clamp(`${cat.name} salaries for ${cs.length} careers from BLS ${labor.meta.oewsLabel} data: median pay, hourly wage, pay range and growth, led by ${cs[0].lower} (${money(cs[0].l.wages.median)}).`), schema: [] });
    }
  }


  // ---------- Glossary hub (A–Z index plus one page per letter) ----------
  {
    const path = '/glossary/';
    const crumbs = [['Home', '/'], ['Career glossary', path]];
    const all = careers.flatMap((c) => c.terms.map(([t, d]) => ({ t, d, c }))).sort((a, b) => a.t.localeCompare(b.t, 'en', { sensitivity: 'base' }));
    const letterOf = (x) => x.t[0].toUpperCase().replace(/[^A-Z]/, '#');
    const letters = [...new Set(all.map(letterOf))];
    const lpath = (l) => `/glossary/${l === '#' ? 'num' : l.toLowerCase()}/`;
    const lname = (l) => (l === '#' ? 'Numbers' : l);
    const anchor = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const azNav = (cur) => `<ul class="az">${letters.map((l) => (l === cur ? `<li><span aria-current="page">${l}</span></li>` : `<li><a href="${href(lpath(l))}">${l}</a></li>`)).join('')}</ul>`;
    const body = `${pageHero({ crumbs, eyebrow: `${all.length} terms`, h1: 'Career Glossary: Job Terms A–Z', lead: `Plain-English definitions of ${all.length} terms used across ${careers.length} careers, from healthcare and the trades to tech and logistics. Pick a letter, or open a career’s own glossary.` })}
<div class="wrap" style="padding-top:30px;padding-bottom:60px">${azNav()}
<h2>Browse by letter</h2><div class="grid">${letters.map((l) => { const n = all.filter((x) => letterOf(x) === l).length; return `<article class="card link"><h3><a class="stretch" href="${href(lpath(l))}">${esc(lname(l))}</a></h3><p>${n} term${n === 1 ? '' : 's'}</p></article>`; }).join('')}</div>
${categories.map((cat) => `<section id="${cat.slug}" style="scroll-margin-top:90px"><h2>${esc(cat.name)} glossaries</h2><ul class="linklist">${careers.filter((c) => c.cat === cat.slug).map((c) => `<li><a href="${href(c.url + 'glossary/')}">${esc(c.title)} terms</a></li>`).join('')}</ul></section>`).join('')}</div>`;
    pages.push({ path, crumbs, body, og: '/og/default.png', kind: 'Glossary', name: 'Career glossary A–Z',
      title: fitTitle('Career Glossary: 700+ Job Terms Defined A–Z'.replace('700+', `${Math.floor(all.length / 50) * 50}+`)),
      desc: clamp(`A–Z glossary of ${all.length} job terms from ${careers.length} careers, defined in plain English. Learn the vocabulary of healthcare, skilled trades, safety, logistics, business and tech.`), schema: [] });
    // Letters with many terms are split into pages of up to PER terms (/glossary/c/, /glossary/c/2/ ...)
    const PER = 350;
    for (const l of letters) {
      const terms = all.filter((x) => letterOf(x) === l);
      const n = Math.ceil(terms.length / PER);
      for (let i = 0; i < n; i++) {
        const chunk = terms.slice(i * PER, (i + 1) * PER);
        const p = lpath(l) + (i ? `${i + 1}/` : '');
        const lc = [...crumbs, [lname(l), lpath(l)], ...(i ? [[`Page ${i + 1}`, p]] : [])];
        const range = n > 1 ? ` (${esc(chunk[0].t)} to ${esc(chunk.at(-1).t)})` : '';
        const h1 = (l === '#' ? 'Career Glossary: Terms Starting With a Number' : `Career Glossary: Terms Starting With ${l}`) + (n > 1 ? `, Page ${i + 1}` : '');
        const pager = n > 1 ? `<nav class="pager" aria-label="Pages"><ul class="az">${Array.from({ length: n }, (_, j) => (j === i ? `<li><span aria-current="page">${j + 1}</span></li>` : `<li><a href="${href(lpath(l) + (j ? `${j + 1}/` : ''))}">${j + 1}</a></li>`)).join('')}</ul></nav>` : '';
        const lbody = `${pageHero({ crumbs: lc, eyebrow: `${terms.length} terms`, h1, lead: `Plain-English definitions of job terms${l === '#' ? ' that start with a number' : ` that start with ${l}`}${range}, each linked to the career that uses it.` })}
<div class="wrap" style="padding-top:30px;padding-bottom:60px">${azNav(l)}${pager}<dl class="glossary">${chunk.map((x) => `<dt>${esc(x.t)} <span class="chip">${esc(x.c.short)}</span></dt><dd>${esc(x.d)} <a href="${href(x.c.url + 'glossary/#' + anchor(x.t))}">More ${esc(x.c.lower)} terms</a></dd>`).join('')}</dl>${pager}
<p><a href="${href(path)}">All letters and career glossaries</a></p></div>`;
        pages.push({ path: p, crumbs: lc, body: lbody, og: '/og/default.png', kind: 'Glossary', name: h1,
          title: fitTitle((l === '#' ? 'Job Terms Starting With a Number' : `Job Terms Starting With ${l}`) + (n > 1 ? ` (Page ${i + 1})` : '') + ': Career Glossary'),
          desc: clamp(`${terms.length} career and job terms starting with ${l === '#' ? 'a number' : l}, defined in plain English${chunk.length ? `, from ${chunk.slice(0, 3).map((x) => x.t).join(', ')} and more` : ''}${n > 1 ? ` (page ${i + 1} of ${n})` : ''}. Each links to the career where it’s used.`), schema: [] });
      }
    }
  }

  // ---------- Best careers lists ----------
  {
    const idx = '/best-careers/';
    const crumbs0 = [['Home', '/'], ['Best careers', idx]];
    pages.push({ path: idx, crumbs: crumbs0, og: '/og/default.png', kind: 'List', name: 'Best careers lists',
      title: fitTitle('Best Careers Lists: Pay, Growth & Fast Training'),
      desc: clamp('Data-driven lists of the best careers: highest-paying jobs without a degree, fastest careers to train for, fastest-growing jobs, outdoor jobs, jobs for introverts and more.'),
      body: `${pageHero({ crumbs: crumbs0, eyebrow: 'Data-driven lists', h1: 'Best Careers Lists', lead: `Ranked lists built from official BLS pay and growth data for the ${careers.length} careers we profile.` })}<div class="wrap" style="padding-top:30px;padding-bottom:60px"><div class="grid">${lists.map((l) => `<article class="card link"><h3><a class="stretch" href="${href(`/best-careers/${l.slug}/`)}">${esc(l.title)}</a></h3><p>${esc(l.intro.split('. ')[0])}.</p></article>`).join('')}</div></div>`, schema: [] });
    for (const l of lists) {
      const path = `/best-careers/${l.slug}/`;
      const crumbs = [...crumbs0, [l.short, path]];
      const cs = careers.filter(l.filter).sort(l.sort).slice(0, l.limit || 50);
      const faqs = [[`What is #1 on the list of ${l.short.toLowerCase()}?`, `${cs[0].title}, with a median wage of ${money(cs[0].l.wages.median)} per year and about ${cs[0].train} of training.`], ['How was this list made?', `We ranked careers from our ${careers.length} profiles using BLS ${labor.meta.oewsLabel} wage data and ${labor.meta.projections} employment projections, applying the criteria described on this page.`]];
      const body = `${pageHero({ crumbs, eyebrow: `${cs.length} careers`, h1: esc(l.title), lead: esc(l.intro) })}
<div class="wrap layout"><div class="prose">${dataNote(labor)}${careerTable(cs, labor, l.metric)}
${cs.map((c, i) => `<h2 id="${c.slug}">${i + 1}. ${esc(c.title)}</h2><p>${esc(c.summary)}</p><ul><li><strong>Median pay:</strong> ${money(c.l.wages.median)}${c.l.wages.hourly != null ? ` (${money2(c.l.wages.hourly)}/hr)` : ''}</li><li><strong>Training:</strong> ${esc(c.train)}: ${esc(c.l.entryEducation.toLowerCase())}</li><li><strong>Growth:</strong> ${pct(c.l.growthPct)} (${growthWord(c.l.growthPct)}), ${num(c.l.annualOpenings)} openings/yr</li></ul><p><a href="${href(c.url)}">${esc(c.title)} career guide</a> · <a href="${href(c.trainingUrl)}">${esc(c.title)} training</a></p>`).join('')}
<h2 id="method">Methodology</h2><p>Rankings use national data from the U.S. Bureau of Labor Statistics (${esc(labor.meta.wageSource)}; ${esc(labor.meta.projectionsSource)}) for the ${careers.length} careers profiled on Career Education Institute. Lists are not exhaustive of all U.S. occupations. Data checked ${fmtDate(labor.meta.fetched)}.</p>${faqBlock(faqs, 'About this list')}</div>
<aside>${ctaCard({ title: 'Find your fit', text: 'Answer 24 questions and get careers matched to your interests.', btn: 'Take the Career Match Quiz', link: '/quizzes/career-match/' })}${sideLinks('More lists', lists.filter((x) => x !== l).map((x) => [x.short, `/best-careers/${x.slug}/`]))}</aside></div>`;
      pages.push({ path, crumbs, body, og: '/og/default.png', kind: 'List', name: l.title, type: 'article',
        title: fitTitle(l.title.length <= 60 ? l.title : l.short),
        desc: clamp(`${l.title}: ${cs.length} careers ranked with BLS pay and growth data, led by ${cs[0].title.toLowerCase()} (${money(cs[0].l.wages.median)} median). See training time and how to start.`),
        schema: [{ '@type': 'ItemList', name: l.title, numberOfItems: cs.length, itemListOrder: 'https://schema.org/ItemListOrderDescending', itemListElement: cs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(c.url), name: c.title })) }, faqSchema(faqs, path)] });
    }
  }

  // ---------- Audience hubs ----------
  const audience = [
    { path: '/students/', key: 'students', eyebrow: 'For high school & college students', h1: 'Career and College Planning for Students',
      title: 'Career & College Planning for Students (Free Tools)',
      lead: 'Figure out what you want to do, choose between college, trade school and apprenticeships, and map out the steps, with free quizzes, guides and real pay data.',
      intro: ['Choosing a career at 16, 18 or 20 can feel impossible, mostly because nobody shows you what jobs actually look like day to day. That’s what this hub is for. Start with your interests, look at real careers in detail, and then pick the education path that gets you there with the least debt and wasted time.', 'You don’t have to get it perfect. Most people change jobs many times. The goal is a smart first step: one that teaches you useful skills, keeps options open and moves you toward work you like.'],
      steps: [['Discover your interests', 'Take the free Career Match Quiz to see which kinds of work fit you.', '/quizzes/career-match/'], ['Explore real careers', 'Read a day in the life, pay and training time for your top matches.', '/careers/'], ['Choose your path', 'Compare college, community college, trade school and apprenticeships.', '/guides/college-vs-trade-school/'], ['Make a plan', 'Use the high school roadmap and paying-for-training guide.', '/guides/high-school-career-planning/']],
      quizzes: [['Career Match Quiz', '/quizzes/career-match/'], ['College or Trade School?', '/quizzes/college-or-trade-school/'], ['Work Style Quiz', '/quizzes/work-style/']],
      lists: ['fastest-careers-to-train-for', 'highest-paying-jobs-without-a-degree', 'best-entry-level-healthcare-jobs', 'jobs-with-paid-on-the-job-training'],
      sheets: [['Career Decision Worksheet', '/resources/career-decision-worksheet/'], ['College & Program Visit Checklist', '/resources/college-visit-checklist/']],
      faqs: [['How do I choose a career if I have no idea what I want?', 'Start with what you enjoy and what you’re good at, then test ideas cheaply: take an interest quiz, read day-in-the-life profiles, talk to people in the job and try a short course or job shadow. Narrow to two or three options before committing to expensive education.'], ['Is college worth it?', 'For careers that require a degree (like registered nursing, accounting or engineering) usually yes. For many well-paid skilled trades and technical roles, a certificate or paid apprenticeship can be faster and cheaper. Compare total cost, time and expected pay for the specific career you want.'], ['What can I do in high school to prepare for a career?', 'Take classes connected to your interests, join career and technical education (CTE) programs, get a part-time job or volunteer role, earn entry credentials like CPR or OSHA 10 where relevant, and job-shadow people in fields you’re considering.'], ['Can I start a good career without college?', 'Yes. Many careers in our directory need a high school diploma plus a certificate, license or apprenticeship and still pay well. See our list of the highest-paying jobs without a four-year degree.']] },
    { path: '/career-changers/', key: 'changers', eyebrow: 'For adults changing careers', h1: 'Changing Careers? Start Here',
      title: 'Career Change Guide & Tools for Adults',
      lead: 'Whether you’re burned out, underpaid or just ready for something new, these tools help you choose a new direction, reuse the skills you already have and retrain efficiently.',
      intro: ['Career changes rarely fail because people lack ability. They stall because the next step feels too big, too expensive or too uncertain. The answer is to make the change smaller: identify what transfers, test a target career before you commit, and pick a training path that fits your budget and schedule.', 'Thousands of adults switch fields every year, into healthcare from retail, into the trades from office work, into tech from teaching. Use the resources below to plan yours.'],
      steps: [['Check your readiness', 'Take the Career Change Readiness Quiz to see what to plan for first.', '/quizzes/career-change-readiness/'], ['Inventory your skills', 'Find the transferable skills employers in your target field want.', '/guides/transferable-skills/'], ['Pick a realistic target', 'Shortlist careers you can enter in a year or less.', '/best-careers/best-careers-for-career-changers/'], ['Test-drive and retrain', 'Take a job-title training to learn the job before you leap.', '/training/']],
      quizzes: [['Career Change Readiness Quiz', '/quizzes/career-change-readiness/'], ['Career Match Quiz', '/quizzes/career-match/'], ['Work Style Quiz', '/quizzes/work-style/']],
      lists: ['best-careers-for-career-changers', 'fastest-careers-to-train-for', 'jobs-that-pay-over-60k-without-a-bachelors-degree', 'remote-friendly-careers'],
      sheets: [['Career Change Budget Worksheet', '/resources/career-change-budget-worksheet/'], ['Career Decision Worksheet', '/resources/career-decision-worksheet/']],
      faqs: [['Is it too late to change careers at 40 or 50?', 'No. Employers value maturity, reliability and transferable experience. Choose a target with reasonable training time, build a financial cushion and lead with the skills you already have.'], ['How do I change careers with no experience in the new field?', 'Use transferable skills, a short credential, volunteer or part-time work, and informational interviews to build relevant experience fast. A career-change resume that leads with skills, not job titles, helps employers see the fit.'], ['How long does a career change take?', 'It depends on the target. Some careers can be entered in weeks (warehouse, security, phlebotomy), others in months (CDL, medical assisting) and some require years (registered nursing, accounting).'], ['Should I quit my job before retraining?', 'Usually not. Most people do better training part-time or evenings while still employed, then switching once they have a credential or offer.']] },
    { path: '/professionals/', key: 'professionals', eyebrow: 'For working professionals', h1: 'Grow in Your Career',
      title: 'Career Growth Tips for Working Professionals',
      lead: `Practical advice for getting better at the job you have (earning more, getting promoted, adding credentials and avoiding burnout) plus job-specific tips for ${careers.length} careers.`,
      intro: ['Growth doesn’t always mean changing careers. Often the fastest raise comes from becoming the person your team relies on: sharpening core skills, earning the right credential and making your results visible.', 'Use the guides below for general strategies, then jump into your own job’s skills, vocabulary and step-by-step task guides to keep building expertise.'],
      steps: [['Sharpen your core skills', 'Review your role’s skills, tools and how-to guides.', '/careers/'], ['Add a credential', 'Decide whether a certification or degree pays off.', '/guides/certifications-vs-degrees/'], ['Make your case', 'Ask for a raise or promotion with evidence.', '/guides/how-to-ask-for-a-raise/'], ['Protect your energy', 'Prevent burnout so growth is sustainable.', '/guides/avoid-burnout/']],
      quizzes: [['Work Style Quiz', '/quizzes/work-style/'], ['Career Change Readiness Quiz', '/quizzes/career-change-readiness/']],
      lists: ['fastest-growing-careers', 'remote-friendly-careers', 'jobs-that-pay-over-60k-without-a-bachelors-degree', 'careers-with-the-most-job-openings'],
      sheets: [['Job Application Tracker', '/resources/job-application-tracker/'], ['Resume Checklist', '/resources/resume-checklist/']],
      faqs: [['How often should I ask for a raise?', 'Typically once a year, tied to your review cycle, or sooner if your responsibilities have grown significantly. Bring market data and specific results.'], ['Are certifications worth it?', 'Often, yes, when the credential is recognized by employers in your field and tied to higher pay or required for promotion. Check job postings for the roles you want next.'], ['How do I get promoted faster?', 'Master your current role, take on visible problems your manager cares about, learn the next role’s skills, and tell your manager explicitly that you want to advance.'], ['What if I feel stuck?', 'Talk with your manager about growth paths, take on a stretch project, build skills outside work, or explore related careers that use what you already know.']] }
  ];
  for (const a of audience) {
    const crumbs = [['Home', '/'], [a.h1.replace('?', ''), a.path]];
    const gs = guides.filter((g) => g.audience?.includes(a.key));
    const byCat = categories.map((cat) => `<div><h3>${esc(cat.name)}</h3><ul>${careers.filter((c) => c.cat === cat.slug).map((c) => `<li><a href="${href(c.url + (a.key === 'professionals' ? 'how-to/' : ''))}">${esc(c.title)}${a.key === 'professionals' ? ' tips' : ''}</a></li>`).join('')}</ul></div>`).join('');
    const body = `${pageHero({ crumbs, eyebrow: a.eyebrow, h1: esc(a.h1), lead: esc(a.lead) })}
<div class="wrap layout"><div class="prose">${a.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
<h2 id="start">Start here: 4 steps</h2><ol class="steps">${a.steps.map(([t, d, l]) => `<li><h3><a href="${href(l)}">${esc(t)}</a></h3><p>${esc(d)}</p></li>`).join('')}</ol>
${gs.length ? `<h2 id="guides">Guides for you</h2>${guideCards(gs)}` : ''}
<h2 id="quizzes">Quizzes</h2><ul>${a.quizzes.map(([t, l]) => `<li><a href="${href(l)}">${esc(t)}</a></li>`).join('')}</ul>
<h2 id="lists">Career lists worth a look</h2><ul>${a.lists.map((s) => lists.find((l) => l.slug === s)).filter(Boolean).map((l) => `<li><a href="${href(`/best-careers/${l.slug}/`)}">${esc(l.title)}</a></li>`).join('')}</ul>
<h2 id="worksheets">Free printable worksheets</h2><ul>${a.sheets.map(([t, l]) => `<li><a href="${href(l)}">${esc(t)}</a></li>`).join('')}</ul>
<h2 id="careers">${a.key === 'professionals' ? 'Job-specific tips and how-to guides' : 'Explore careers by field'}</h2><div class="cols">${byCat}</div>
${faqBlock(a.faqs)}</div>
<aside>${ctaCard({ title: a.key === 'students' ? 'Find careers that fit you' : a.key === 'changers' ? 'Test-drive a new career' : 'Level up with training', text: a.key === 'students' ? 'The free Career Match Quiz takes about 4 minutes.' : 'Job-title trainings show you what the work involves before you commit.', btn: a.key === 'students' ? 'Take the quiz' : 'Browse trainings', link: a.key === 'students' ? '/quizzes/career-match/' : '/training/' })}${sideLinks('Other hubs', [['For students', '/students/'], ['For career changers', '/career-changers/'], ['For working professionals', '/professionals/']].filter(([, l]) => l !== a.path))}</aside></div>`;
    pages.push({ path: a.path, crumbs, body, og: '/og/guides.png', kind: 'Hub', name: a.h1,
      title: fitTitle(a.title), desc: clamp(a.lead), schema: [faqSchema(a.faqs, a.path)] });
  }
  return pages;
}
