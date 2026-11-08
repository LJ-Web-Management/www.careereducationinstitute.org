// College & Career Finder: the interactive tool, plus indexable pages built from the same data so search engines and
// AI assistants can read the content without running JavaScript.
//   /college-and-career-finder/               the step-by-step finder (src/assets/finder.js)
//   /college-majors/, /college-majors/<field>-majors/, /college-majors/<major>/
//   /college-minors/, /college-minors/<minor>/
//   /college-majors-and-career-paths/         every major with its careers and related training
//   /skills-to-learn/, /skills-to-learn/<skill>/
//   /career-options-after-high-school/
//   /colleges/, /colleges/<state>/            college and university search and state lists (IPEDS)
import cfg from '../../site.config.mjs';
import { esc, href, abs, clamp, fitTitle, listJoin, countLabel, num, md } from '../lib/util.mjs';
import { pick } from '../lib/career-helpers.mjs';
import { pageHero, faqBlock, faqSchema, ctaCard, sideLinks, answerBox, icon, band } from '../lib/layout.mjs';
import {
  majors, minors, majorFields, interests, skills, majorBySlug, minorBySlug, fieldBySlug, engine, engineData, courseFor,
  majorPath, fieldPath, minorPath, skillPath, minorPairs, FINDER, loadColleges, majorCollegeCounts, CONTROL, LEVEL, AWARD,
  STATES, statePath, config
} from '../lib/finder.mjs';

const OG = '/og/guides.png';
const FIND_CTA = { title: 'Try the College & Career Finder', text: 'Answer a few questions to explore colleges, majors, minors and careers, then get training recommendations for your goals. Free, no sign-up.', btn: 'Start the finder', link: FINDER };

// Shown wherever college or training information appears
export const finderNote = (colleges = true) => `<aside class="callout info finder-note"><p><strong>About this information:</strong> Career Education Institute is not a college, university, degree-granting institution or admissions service.${colleges ? ` College and program information comes from the U.S. Department of Education’s <a href="https://nces.ed.gov/ipeds/" rel="noopener">IPEDS</a> data; confirm programs, costs and admission requirements with each school.` : ''} CEI trainings are general, non-credit career-preparation courses. They do not replace a college degree, grant academic credit or guarantee employment.</p></aside>`;

const plural = (n, one, many = one + 's') => `${num(n)} ${n === 1 ? one : many}`;

export function finderPages(ctx) {
  const { careers, byslug, categories } = ctx;
  const data = engineData(careers, categories);
  const rec = (profile) => engine.recommend(data, profile);
  const counts = majorCollegeCounts();
  const colleges = loadColleges();
  const nColleges = colleges.institutions.length;
  const collegeLabel = nColleges >= 1000 ? `${(Math.floor(nColleges / 100) * 100).toLocaleString('en-US')}+` : String(nColleges);
  const pages = [];

  // ---------- Shared pieces ----------
  const careerCards = (slugs, max = 8) => `<div class="grid">${slugs.map((s) => byslug[s]).filter(Boolean).slice(0, max).map((c) => `<article class="card link"><span class="ico">${icon(c.cat)}</span><h3><a class="stretch" href="${href(c.url)}">${esc(c.title)}</a></h3><p>${esc(c.blurb)}</p><ul class="chips"><li class="chip">Typical training: ${esc(c.train)}</li></ul></article>`).join('')}</div>`;
  // A CEI training recommendation: what it is, the skills it builds, why it fits, and how to enroll
  const courseCard = (slug, why, list) => {
    const c = byslug[slug]; const k = courseFor(c);
    return `<article class="course-card"><div class="cc-head"><span class="ico">${icon(c.cat)}</span><div><h3><a href="${href(k.url)}">${esc(k.name)}</a></h3><p class="cc-meta">Online, self-paced · about ${k.hours} hours · $${Number(k.price).toFixed(2)}</p></div></div><p>${esc(k.desc)}</p><p class="cc-skills"><strong>Skills you build:</strong> ${esc(listJoin(c.hard.slice(0, 3).map((x) => x.charAt(0).toLowerCase() + x.slice(1))))}</p>${why ? `<p class="cc-why"><strong>Why it fits:</strong> ${esc(why)}</p>` : ''}<div class="btn-row"><a class="btn btn-primary btn-sm" href="${href(k.buy)}">${k.buyLabel === 'Buy now' ? 'Start learning today' : 'Enroll in this course'}</a><a class="btn btn-sm" href="${href(k.url)}">View course details</a></div></article>`;
  };
  const courseGrid = (items, list) => `<div class="course-grid">${items.map(([s, why]) => courseCard(s, why, list)).join('')}</div>`;
  const whyFrom = (r) => engine.reasonText(r.reasons[0] || ['', '']);
  const itemList = (name, slugs) => ({ '@type': 'ItemList', name, itemListElement: slugs.map((s, i) => { const k = courseFor(byslug[s]); return { '@type': 'ListItem', position: i + 1, url: abs(k.url), name: k.name }; }) });
  const levelText = (lv) => listJoin([...lv].map((l) => AWARD[l]));
  const trainingWhy = `<h2 id="why-training">Why consider career training alongside college?</h2><p>Your college major gives you an academic foundation. Short career training can add practical knowledge of a specific job: what the work involves day to day, its vocabulary, common tasks, tools and safety rules. You do not have to wait until graduation: many students take a short course to test a career before choosing a major, to prepare for an internship or a part-time job, or to show employers they understand the work.</p>`;

  // ---------- The finder ----------
  {
    const path = FINDER;
    const crumbs = [['Home', '/'], ['College & Career Finder', path]];
    const faqs = [
      ['What is the College & Career Finder?', `A free tool from Career Education Institute that helps you explore U.S. colleges and universities, college majors and minors, career paths and skills. At the end you get a personalized summary with career paths, skills to develop and related online training.`],
      ['Do I need to give my email to see my results?', 'No. There is no sign-up and no form to fill in. Your results appear on screen as soon as you finish, and you can download, print, email or share them yourself.'],
      ['Where does the college information come from?', `From the U.S. Department of Education’s Integrated Postsecondary Education Data System (IPEDS). The finder includes ${collegeLabel} active, degree-granting colleges and universities that take part in federal student aid programs, with the programs each school reported awarding. Always confirm details on the school’s official website.`],
      ['Is Career Education Institute a college?', 'No. Career Education Institute is not a college, university, degree-granting institution or admissions service, and it does not apply to colleges for you. It offers general, non-credit online career training by job title.'],
      ['Can career training replace a college degree?', 'No. CEI trainings do not replace a degree and do not grant college credit, a license or a guarantee of employment. They help you learn about a job and build practical knowledge, alongside college or on their own.'],
      ['Is my information saved?', 'Your answers are saved only in your browser so you can come back to them. They are not sent to Career Education Institute.']
    ];
    const steps = ['What you are looking for', 'Your stage of education', 'Areas of interest', 'Colleges and universities', 'College majors', 'College minors', 'Career goals', 'Skills to develop', 'Your personalized results'];
    const body = `${pageHero({ crumbs, eyebrow: 'Free career exploration tool', h1: 'College & Career Finder', lead: `Explore ${collegeLabel} U.S. colleges, ${majors.length} majors, ${minors.length} minors and ${countLabel(careers.length)} careers in a few minutes. See where your interests can lead and which practical skills you can start building now.`, meta: false, extra: `<p class="hero-note">Free · No sign-up · About 5 minutes · Your answers stay in your browser</p>` })}
<div class="wrap finder-wrap"><div class="finder" id="finder" data-finder data-base="${esc(cfg.basePath)}" aria-live="polite">
<noscript><div class="callout"><p>The interactive finder needs JavaScript. You can still explore everything it covers: <a href="${href('/college-majors/')}">college majors</a>, <a href="${href('/college-minors/')}">college minors</a>, <a href="${href('/colleges/')}">colleges by state</a>, <a href="${href('/careers/')}">careers</a>, <a href="${href('/skills-to-learn/')}">skills to learn</a> and <a href="${href('/training/')}">online career training</a>.</p></div></noscript>
<div class="finder-loading" data-finder-loading><p>Loading the College &amp; Career Finder…</p></div>
<div hidden>${[...new Set([...interests.map((i) => i.icon), ...majorFields.map((f) => f.icon), ...skills.map((s) => s.icon), ...categories.map((c) => c.slug)])].map((k) => icon(k)).join('')}</div>
</div></div>
<div class="wrap layout"><article class="prose">
<h2 id="how-it-works">How the College &amp; Career Finder works</h2>
<ol>${steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
<p>Every step is optional, and you can go back at any time. Your answers shape the suggestions in later steps: the majors you pick suggest minors and careers, and everything you choose shapes your final recommendations.</p>
<h2 id="explore">Explore on your own</h2>
<ul><li><a href="${href('/college-majors/')}">College majors</a>: ${majors.length} majors in ${majorFields.length} fields, with what you study, skills and career paths</li><li><a href="${href('/college-minors/')}">College minors</a>: ${minors.length} minors and the majors they complement</li><li><a href="${href('/colleges/')}">College and university search</a>: ${collegeLabel} schools by state, city, ZIP code, type and program</li><li><a href="${href('/college-majors-and-career-paths/')}">College majors and career paths</a>: where every major can lead</li><li><a href="${href('/skills-to-learn/')}">Skills to learn</a> for different careers</li><li><a href="${href('/career-options-after-high-school/')}">Career options after high school</a></li></ul>
<h2 id="interests">Explore by area of interest</h2>
<div class="grid">${majorFields.map((f) => `<article class="card link"><span class="ico">${icon(f.icon)}</span><h3><a class="stretch" href="${href(fieldPath(f))}">${esc(f.name)} majors</a></h3><p>${esc(f.blurb)}</p></article>`).join('')}</div>
${trainingWhy}
${faqBlock(faqs)}
${finderNote()}
</article><aside>${ctaCard({ title: 'Prefer a quick quiz?', text: 'The Career Match Quiz suggests careers from 24 questions about what you enjoy.', btn: 'Take the quiz', link: '/quizzes/career-match/' })}${sideLinks('Related', [['College vs. trade school', '/guides/college-vs-trade-school/'], ['How to choose a career', '/guides/how-to-choose-a-career/'], ['Career exploration questions', '/career-exploration/'], ['All careers', '/careers/'], ['Online career training', '/online-career-training/'], ['For students', '/students/']])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Tool', name: 'College & Career Finder', scripts: ['finder-engine', 'college-search', 'finder'],
      keywords: 'college major finder, career exploration tool, career training finder, college finder, find a college major, explore college majors, college minor finder, careers for my major',
      title: fitTitle('College & Career Finder: Majors, Colleges & Careers'),
      desc: clamp(`Free career exploration tool: search ${collegeLabel} U.S. colleges, compare ${majors.length} college majors and ${minors.length} minors, discover career paths and find training for the skills you need.`),
      schema: [{ '@type': 'WebApplication', name: 'College & Career Finder', url: abs(path), applicationCategory: 'EducationalApplication', operatingSystem: 'Any web browser', isAccessibleForFree: true, offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, provider: { '@id': abs('/#org') }, description: `Explore U.S. colleges, college majors and minors, career paths and skills, with personalized career training recommendations.` }, faqSchema(faqs, path)]
    });
  }

  // ---------- Majors hub ----------
  {
    const path = '/college-majors/';
    const crumbs = [['Home', '/'], ['College majors', path]];
    const faqs = [
      ['How do I choose a college major?', 'Start with what you enjoy and are good at, then look at the careers each major can lead to, the courses you would take and the skills you would build. Compare two or three majors side by side, talk to people working in those careers, and remember that many majors lead to more than one career.'],
      ['How many college majors are there?', `Colleges offer hundreds of majors. The U.S. Department of Education classifies more than 2,000 instructional programs. This guide covers ${majors.length} common majors in ${majorFields.length} fields and shows how many colleges report awarding each one.`],
      ['Can I change my major?', 'Yes. Many students change majors, especially in the first two years. Changing later can add time to your degree, so explore early with intro courses, minors and short career training.'],
      ['What is the difference between a major and a minor?', 'A major is your main field of study and makes up a large share of your courses. A minor is a smaller set of courses in a second subject that adds skills or knowledge to your major.'],
      ['Do I need a major to start building career skills?', 'No. You can take short, practical career training at any time, whether you are in high school, deciding on a major or already working.']
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College major finder', h1: 'Explore College Majors and Where They Lead', lead: `Compare ${majors.length} college majors in ${majorFields.length} fields: what you study, the skills you build, the careers each major can lead to, and the minors that complement it.`, meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(FINDER)}">Find your major with the finder</a><a class="btn" href="${href('/college-majors-and-career-paths/')}">Majors and career paths</a></div>` })}
<div class="wrap" style="padding-top:30px;padding-bottom:20px">
<form class="filters" role="search" aria-label="Search majors" data-list-filter="#major-list"><div class="field"><label for="mq">Search majors</label><input id="mq" name="q" type="search" placeholder="e.g. nursing, cybersecurity, logistics" autocomplete="off"></div><p class="small muted" data-list-count aria-live="polite" style="margin:0 0 8px">${majors.length} majors</p></form>
<div id="major-list">${majorFields.map((f) => { const ms = majors.filter((m) => m.field === f.slug); return `<section class="major-field" id="${f.slug}" data-group><h2>${icon(f.icon)} <a href="${href(fieldPath(f))}">${esc(f.name)} majors</a></h2><p class="muted">${esc(f.blurb)}</p><div class="grid">${ms.map((m) => `<article class="card link" data-k="${esc((m.name + ' ' + m.aka + ' ' + f.name).toLowerCase())}"><h3><a class="stretch" href="${href(majorPath(m))}">${esc(m.name)}</a></h3><p>${esc(m.summary)}</p><ul class="chips"><li class="chip">${plural(counts[m.slug].total, 'college')} report awards</li></ul></article>`).join('')}</div></section>`; }).join('')}<p data-list-empty hidden>No majors match your search. Try a broader word, or <a href="${href(FINDER)}">use the finder</a>.</p></div>
${faqBlock(faqs)}
${finderNote()}
</div>
${band('Not sure which major fits?', 'The College & Career Finder suggests majors from your interests, then shows careers, minors and skills for each.', 'Start the finder', FINDER, 'Explore minors', '/college-minors/')}`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'College majors', scripts: ['finder-pages'],
      keywords: 'college major finder, find a college major, explore college majors, list of college majors, what major should I choose',
      title: fitTitle(`College Major Finder: Explore ${majors.length} Majors & Careers`),
      desc: clamp(`Explore ${majors.length} college majors in ${majorFields.length} fields. See what you study, skills you build, careers each major leads to, suggested minors and colleges that offer it.`),
      schema: [{ '@type': 'ItemList', name: 'College majors', itemListElement: majors.map((m, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(majorPath(m)), name: m.name })) }, faqSchema(faqs, path)]
    });
  }

  // ---------- Field pages ----------
  for (const f of majorFields) {
    const ms = majors.filter((m) => m.field === f.slug);
    const path = fieldPath(f);
    const crumbs = [['Home', '/'], ['College majors', '/college-majors/'], [`${f.name} majors`, path]];
    const top = rec({ majors: ms.map((m) => m.slug) }).courses.slice(0, 6);
    const faqs = [
      [`What are the best ${f.name.toLowerCase()} majors?`, `The best major depends on the career you want. ${listJoin(ms.slice(0, 4).map((m) => m.name))} are common choices in this field. Compare the careers, coursework and skills for each below.`],
      [`What careers can you get with a ${f.name.toLowerCase()} major?`, `Careers connected to these majors include ${listJoin([...new Set(ms.flatMap((m) => m.careers.slice(0, 2)))].slice(0, 8).map((s) => byslug[s].title.toLowerCase()))}. Some require a degree and a license, while others start with a certificate or on-the-job training.`],
      [`Can I start training for a ${f.name.toLowerCase()} career before I finish college?`, 'Yes. Short online career training can help you learn what a specific job involves and build practical knowledge while you study. It does not replace a degree or a required license.']
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College majors', h1: `${esc(f.name)} Majors and Career Paths`, lead: esc(f.blurb), meta: false })}
<div class="wrap layout"><article class="prose">
${answerBox(`${f.name} majors at a glance`, `${esc(listJoin(ms.map((m) => m.name)))}. Each major below links to what you study, the skills you build, career paths, suggested minors and how many colleges report awarding it.`)}
<div class="table-wrap"><table><thead><tr><th scope="col">Major</th><th scope="col">Typical degrees</th><th scope="col">Career paths</th><th scope="col" class="num">Colleges</th></tr></thead><tbody>${ms.map((m) => `<tr><td><a href="${href(majorPath(m))}">${esc(m.name)}</a></td><td class="small">${esc(m.degrees)}</td><td class="small">${m.careers.slice(0, 3).map((s) => `<a href="${href(byslug[s].url)}">${esc(byslug[s].title)}</a>`).join(', ')}</td><td class="num">${num(counts[m.slug].total)}</td></tr>`).join('')}</tbody></table></div>
<p class="small muted">Colleges: active, degree-granting U.S. schools that reported awarding at least one degree or certificate in the field, ${esc(colleges.meta.completions || 'IPEDS')}.</p>
${ms.map((m) => `<h2 id="${m.slug}"><a href="${href(majorPath(m))}">${esc(m.name)}</a></h2><p>${esc(m.summary)} ${esc(m.about.split('. ')[0].replace(/\.$/, ''))}.</p><p class="small"><strong>Skills:</strong> ${esc(listJoin(m.skills.slice(0, 4)))}. <strong>Pairs well with:</strong> ${m.minors.slice(0, 3).map(([s]) => `<a href="${href(minorPath(s))}">${esc(minorBySlug[s].name)}</a>`).join(', ')}.</p>`).join('')}
${top.length ? `<h2 id="training">Practical training for ${esc(f.name.toLowerCase())} careers</h2><p>These Career Education Institute courses connect to the careers above. Each is a short, self-paced online course about one job.</p>${courseGrid(top.map((r) => [r.slug, whyFrom(r)]), 'field_page')}` : ''}
${trainingWhy}
${faqBlock(faqs)}
${finderNote()}
</article><aside>${ctaCard(FIND_CTA)}${sideLinks('Other fields', majorFields.filter((x) => x.slug !== f.slug).map((x) => [`${x.name} majors`, fieldPath(x)]))}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: `${f.name} majors`,
      title: fitTitle(pick([`${f.name} Majors: Careers, Skills & Minors`, `${f.name} Majors and Career Paths`, `${f.name} Majors`])),
      desc: clamp(`Compare ${ms.length} ${f.name.toLowerCase()} college majors: ${listJoin(ms.slice(0, 3).map((m) => m.name))} and more. See careers, skills, minors and how many colleges offer each.`),
      schema: [{ '@type': 'ItemList', name: `${f.name} majors`, itemListElement: ms.map((m, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(majorPath(m)), name: m.name })) }, ...(top.length ? [itemList(`Training for ${f.name.toLowerCase()} careers`, top.map((r) => r.slug))] : []), faqSchema(faqs, path)]
    });
  }

  // ---------- Major pages ----------
  for (const m of majors) {
    const f = fieldBySlug[m.field];
    const path = majorPath(m);
    const crumbs = [['Home', '/'], ['College majors', '/college-majors/'], [`${f.name} majors`, fieldPath(f)], [m.name, path]];
    const cnt = counts[m.slug];
    const top = rec({ majors: [m.slug] }).courses.slice(0, 4);
    const lower = m.name.toLowerCase().replace(/\bai\b/, 'AI');
    const faqs = [
      [`What is a ${m.name} major?`, `${m.summary} ${m.about.split('. ')[0].replace(/\.$/, '')}.`],
      [`What can you do with a ${m.name} degree?`, `Career paths connected to ${lower} include ${listJoin(m.careers.slice(0, 5).map((s) => byslug[s].title.toLowerCase()))}. Some roles need additional training, experience, certification or a license.`],
      [`What minor goes well with ${m.name}?`, `Good pairings include ${listJoin(m.minors.slice(0, 3).map(([s, why]) => `${minorBySlug[s].name} (${why.charAt(0).toLowerCase() + why.slice(1).replace(/\.$/, '')})`))}.`],
      [`How many colleges offer a ${m.name} major?`, cnt.total ? `${plural(cnt.total, 'U.S. college')} reported awarding degrees or certificates in this field in the latest federal (IPEDS) data, including ${plural(cnt.online, 'school')} that reported offering at least some programs entirely online. Programs can have different names at different schools.` : 'Few colleges report awards under this exact program classification. Search related programs in the College & Career Finder.'],
      [`What skills do you learn in ${m.name}?`, `${listJoin(m.skills)}.`],
      [`Can I take career training while I study ${lower}?`, 'Yes. Short online career training can help you understand a specific job and build practical knowledge alongside your classes. It does not replace your degree or any required license.']
    ];
    const levels = Object.entries(cnt.levels).sort((a, b) => 'CABMD'.indexOf(a[0]) - 'CABMD'.indexOf(b[0]));
    const related = majors.filter((x) => x.field === m.field && x.slug !== m.slug);
    const body = `${pageHero({ crumbs, eyebrow: `${f.name} major`, h1: `${esc(m.name)} Major`, lead: esc(m.summary), meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(`${FINDER}?major=${m.slug}`)}">Explore this major in the finder</a>${top.length ? '<a class="btn" href="#training">Related career training</a>' : ''}</div>` })}
<div class="wrap layout"><article class="prose">
${answerBox(`What is a ${m.name} major?`, esc(m.about))}
<ul class="facts"><li class="fact"><div class="k">Typical degrees</div><div class="v" style="font-size:1rem">${esc(m.degrees)}</div></li><li class="fact"><div class="k">Colleges reporting awards</div><div class="v">${num(cnt.total)}</div><div class="n">U.S. schools, IPEDS</div></li><li class="fact"><div class="k">With online programs</div><div class="v">${num(cnt.online)}</div><div class="n">Schools reporting fully online programs</div></li></ul>
<h2 id="study">What you study</h2><ul class="checks">${m.study.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
<h2 id="skills">Skills you build</h2><ul class="chips skill-chips">${m.skills.map((s) => `<li class="chip">${esc(s)}</li>`).join('')}</ul>
<h2 id="careers">Career paths for ${esc(lower)} majors</h2><p>Careers connected to this major. Each profile explains the work, how to get started and what the job is like day to day.</p>${careerCards(m.careers)}
<h2 id="minors">Minors that pair well with ${esc(m.name)}</h2><div class="table-wrap"><table><thead><tr><th scope="col">Minor</th><th scope="col">How it complements ${esc(m.name)}</th></tr></thead><tbody>${m.minors.map(([s, why]) => `<tr><td><a href="${href(minorPath(s))}">${esc(minorBySlug[s].name)}</a></td><td>${esc(why)}</td></tr>`).join('')}</tbody></table></div>
${top.length ? `<h2 id="training">Start building practical skills now</h2><p>These short online courses from Career Education Institute connect to ${esc(lower)} careers. You can take one alongside your classes or before you choose a program.</p>${courseGrid(top.map((r) => [r.slug, `Connected to careers that ${esc(m.name)} majors pursue, such as ${byslug[r.slug].title.toLowerCase()}.`]), 'major_page')}<p><a class="btn" href="${href('/training/')}">Browse all training programs</a></p>` : ''}
<h2 id="colleges">Where to study ${esc(lower)}</h2><p>${cnt.total ? `${plural(cnt.total, 'U.S. college or university', 'U.S. colleges and universities')} reported awarding ${levels.length ? esc(levelText(levels.map(([l]) => l).join('')).toLowerCase().replace('bachelor’s', 'bachelor’s').replace(/\bassociate\b/, 'associate')) : ''} awards in this field (${esc(colleges.meta.completions || 'IPEDS')}).` : 'Few colleges report awards under this exact program classification; similar programs may be listed under related names.'}</p>${levels.length ? `<ul>${levels.map(([l, n]) => `<li>${esc(AWARD[l])}: ${plural(n, 'school')}</li>`).join('')}</ul>` : ''}<p><a class="btn btn-primary" href="${href(`/colleges/?major=${m.slug}`)}">Find colleges that offer ${esc(m.name)}</a></p>
${trainingWhy}
${faqBlock(faqs, `${m.name} major FAQ`)}
${related.length ? `<h2 id="related">Related majors</h2><ul>${related.map((x) => `<li><a href="${href(majorPath(x))}">${esc(x.name)}</a>: ${esc(x.summary)}</li>`).join('')}</ul>` : ''}
${finderNote()}
</article><aside>${ctaCard({ ...FIND_CTA, text: `Compare ${m.name} with other majors, pick minors and careers, and get a personalized plan.`, link: `${FINDER}?major=${m.slug}` })}${sideLinks('On this page', [['What you study', '#study'], ['Skills', '#skills'], ['Career paths', '#careers'], ['Suggested minors', '#minors'], ...(top.length ? [['Related training', '#training']] : []), ['Where to study', '#colleges'], ['FAQ', '#faq']])}${sideLinks(`${f.name} majors`, [...related.slice(0, 8).map((x) => [x.name, majorPath(x)]), ['All college majors', '/college-majors/']])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'College major', name: `${m.name} major`, keywords: `${m.name} major, ${m.aka}`,
      title: fitTitle(pick([`${m.name} Major: Courses, Careers & Minors`, `${m.name} Major: Careers & Minors`, `${m.name} Major Guide`, `${m.name} Major`])),
      desc: clamp(`${m.name} major guide: ${m.summary.charAt(0).toLowerCase() + m.summary.slice(1).replace(/\.$/, '')}. See courses, skills, careers, minors and ${num(cnt.total)} colleges that offer it.`),
      schema: [...(top.length ? [itemList(`Career training related to ${m.name}`, top.map((r) => r.slug))] : []), faqSchema(faqs, path)]
    });
  }

  // ---------- Minors hub and minor pages ----------
  {
    const path = '/college-minors/';
    const crumbs = [['Home', '/'], ['College minors', path]];
    const combos = [['business-administration', ['accounting', 'marketing', 'data-analytics']], ['nursing', ['psychology', 'public-health', 'healthcare-administration']], ['computer-science', ['mathematics', 'business', 'cybersecurity']], ['construction-management', ['business', 'project-management', 'occupational-safety']], ['supply-chain-management', ['data-analytics', 'finance', 'management']], ['marketing', ['communications', 'psychology', 'business']]];
    const faqs = [
      ['What is a college minor?', 'A minor is a smaller group of courses, often 15 to 24 credit hours, in a subject outside your major. It appears on your transcript and adds knowledge or skills that complement your main field.'],
      ['Should I get a minor?', 'A minor is optional. It can be worth it when it adds a skill employers want in your field, supports a career you are considering, or lets you explore a second interest. It can also add courses, so check how it fits your degree plan.'],
      ['What is the best minor to pair with my major?', 'Choose a minor that fills a gap. Technical majors often add business or communication; business majors often add data analytics or a technical field; health and education majors often add psychology or Spanish.'],
      ['Does a minor matter to employers?', 'A minor can show employers that you have skills beyond your major, especially when it relates to the job. Experience, projects and practical skills usually matter more.']
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College minor finder', h1: 'College Minors That Complement Your Major', lead: `Explore ${minors.length} college minors, the majors they pair well with, and how each one can expand your career options.`, meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(FINDER)}">Find minors for your major</a><a class="btn" href="${href('/college-majors/')}">Explore majors</a></div>` })}
<div class="wrap layout"><article class="prose">
${answerBox('How to choose a minor', 'Pick a minor that adds something your major does not: a business minor for technical students, a data or technology minor for business students, psychology or a language for people-facing careers, or safety and project management for construction and industrial careers.')}
<h2 id="combinations">Popular major and minor combinations</h2><div class="table-wrap"><table><thead><tr><th scope="col">Major</th><th scope="col">Suggested minors</th></tr></thead><tbody>${combos.map(([mj, ms]) => `<tr><td><a href="${href(majorPath(mj))}">${esc(majorBySlug[mj].name)}</a></td><td>${ms.map((s) => `<a href="${href(minorPath(s))}">${esc(minorBySlug[s].name)}</a>`).join(', ')}</td></tr>`).join('')}</tbody></table></div>
<h2 id="all-minors">All minors</h2>
<form class="filters" role="search" aria-label="Search minors" data-list-filter="#minor-list"><div class="field"><label for="nq">Search minors</label><input id="nq" name="q" type="search" placeholder="e.g. psychology, data, safety" autocomplete="off"></div><p class="small muted" data-list-count aria-live="polite" style="margin:0 0 8px">${minors.length} minors</p></form>
<div id="minor-list"><div class="grid" data-group>${minors.map((m) => `<article class="card link" data-k="${esc((m.name + ' ' + m.aka).toLowerCase())}"><h3><a class="stretch" href="${href(minorPath(m))}">${esc(m.name)}</a></h3><p>${esc(m.summary)}</p><ul class="chips"><li class="chip">Pairs with ${plural(minorPairs(m.slug).length, 'major')}</li></ul></article>`).join('')}</div><p data-list-empty hidden>No minors match your search.</p></div>
${faqBlock(faqs)}
${finderNote(false)}
</article><aside>${ctaCard(FIND_CTA)}${sideLinks('Related', [['College majors', '/college-majors/'], ['Majors and career paths', '/college-majors-and-career-paths/'], ['Skills to learn', '/skills-to-learn/']])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'College minors', scripts: ['finder-pages'],
      keywords: 'college minor finder, best minors, minors for my major, what minor should I choose',
      title: fitTitle('College Minor Finder: Minors That Fit Your Major'),
      desc: clamp(`Find a college minor that complements your major. Compare ${minors.length} minors, popular major and minor combinations, and the careers and skills each minor adds.`),
      schema: [{ '@type': 'ItemList', name: 'College minors', itemListElement: minors.map((m, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(minorPath(m)), name: m.name })) }, faqSchema(faqs, path)]
    });
  }
  for (const m of minors) {
    const path = minorPath(m);
    const crumbs = [['Home', '/'], ['College minors', '/college-minors/'], [m.name, path]];
    const pairs = minorPairs(m.slug);
    const top = rec({ minors: [m.slug] }).courses.slice(0, 3);
    const faqs = [
      [`What is a ${m.name} minor?`, `${m.summary} ${m.complements.split('. ')[0].replace(/\.$/, '')}.`],
      [`What majors go well with a ${m.name} minor?`, pairs.length ? `It pairs well with ${listJoin(pairs.slice(0, 6).map((p) => p.major.name))}.` : 'It can complement many majors, especially those that need the skills it adds.'],
      [`What skills does a ${m.name} minor add?`, `${listJoin(m.skills)}.`]
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College minor', h1: `${esc(m.name)} Minor`, lead: esc(m.summary), meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(FINDER)}">Find your major and minor</a></div>` })}
<div class="wrap layout"><article class="prose">
${answerBox(`How a ${m.name} minor complements your major`, esc(m.complements))}
<h2 id="skills">Skills a ${esc(m.name)} minor adds</h2><ul class="chips skill-chips">${m.skills.map((s) => `<li class="chip">${esc(s)}</li>`).join('')}</ul>
${pairs.length ? `<h2 id="majors">Majors that pair well with ${esc(m.name)}</h2><div class="table-wrap"><table><thead><tr><th scope="col">Major</th><th scope="col">Why it works</th></tr></thead><tbody>${pairs.map((p) => `<tr><td><a href="${href(majorPath(p.major))}">${esc(p.major.name)}</a></td><td>${esc(p.why)}</td></tr>`).join('')}</tbody></table></div>` : ''}
<h2 id="careers">Careers where a ${esc(m.name)} minor helps</h2>${careerCards(m.careers, 6)}
${top.length ? `<h2 id="training">Related career training</h2>${courseGrid(top.map((r) => [r.slug, `Builds practical knowledge for careers a ${m.name} minor points toward.`]), 'minor_page')}` : ''}
${faqBlock(faqs, `${m.name} minor FAQ`)}
${finderNote(false)}
</article><aside>${ctaCard(FIND_CTA)}${sideLinks('Other minors', [...minors.filter((x) => x.slug !== m.slug).slice(0, 10).map((x) => [x.name, minorPath(x)]), ['All minors', '/college-minors/']])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'College minor', name: `${m.name} minor`, keywords: `${m.name} minor, ${m.aka}`,
      title: fitTitle(pick([`${m.name} Minor: Skills, Careers & Best Majors`, `${m.name} Minor: Skills & Best Majors`, `${m.name} Minor`])),
      desc: clamp(`Is a ${m.name.toLowerCase()} minor worth it? See how it complements majors such as ${listJoin(pairs.slice(0, 3).map((p) => p.major.name)) || 'yours'}, the skills it adds and related careers.`),
      schema: [...(top.length ? [itemList(`Training related to a ${m.name} minor`, top.map((r) => r.slug))] : []), faqSchema(faqs, path)]
    });
  }

  // ---------- Majors and career paths ----------
  {
    const path = '/college-majors-and-career-paths/';
    const crumbs = [['Home', '/'], ['College majors', '/college-majors/'], ['Majors and career paths', path]];
    const faqs = [
      ['What is the best college major for my career?', 'Work backward from the career: look at the education it typically requires, then compare the majors that lead there. Some careers require a specific degree and license, while others accept many majors plus practical skills.'],
      ['Does my major decide my career?', 'Not completely. Many careers accept several majors, and people often change direction. Skills, experience and additional training can open careers outside your major.'],
      ['Which majors lead to careers without a four-year degree?', 'Many technical and healthcare programs, such as medical assisting, welding technology, HVAC technology and emergency medical services, are offered as certificates or associate degrees.']
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'Majors and careers', h1: 'College Majors and Career Paths', lead: `Where ${majors.length} college majors can lead: the career paths connected to each one, and practical training you can take along the way.`, meta: false })}
<div class="wrap" style="padding-top:30px;padding-bottom:20px">
${answerBox('How to use this list', 'Find your major, or a major you are considering, to see careers that commonly connect to it. Select a career to read what the work involves, or a training to start building skills for it now. Many careers are open to more than one major.')}
${majorFields.map((f) => `<h2 id="${f.slug}">${esc(f.name)}</h2><div class="table-wrap"><table><thead><tr><th scope="col">Major</th><th scope="col">Career paths</th><th scope="col">Related training</th></tr></thead><tbody>${majors.filter((m) => m.field === f.slug).map((m) => { const t = m.careers[0]; return `<tr><td><a href="${href(majorPath(m))}">${esc(m.name)}</a></td><td class="small">${m.careers.slice(0, 4).map((s) => `<a href="${href(byslug[s].url)}">${esc(byslug[s].title)}</a>`).join(', ')}</td><td class="small"><a href="${href(courseFor(byslug[t]).url)}">${esc(courseFor(byslug[t]).name)}</a></td></tr>`; }).join('')}</tbody></table></div>`).join('')}
${faqBlock(faqs)}
${finderNote(false)}
</div>
${band('Want suggestions for you?', 'Tell the College & Career Finder your interests and it will suggest majors, careers and skills.', 'Start the finder', FINDER, 'All careers', '/careers/')}`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'College majors and career paths',
      keywords: 'college majors and career paths, best college majors for careers, what can I do with my major, majors and careers list',
      title: fitTitle('College Majors and Career Paths: Where Majors Lead'),
      desc: clamp(`See the career paths connected to ${majors.length} college majors, from nursing and business to cybersecurity and construction management, plus training for each.`),
      schema: [faqSchema(faqs, path)]
    });
  }

  // ---------- Skills to learn ----------
  {
    const path = '/skills-to-learn/';
    const crumbs = [['Home', '/'], ['Skills to learn', path]];
    const faqs = [
      ['What skills should I learn for my career?', 'Start with the skills listed in job descriptions for the career you want, then add transferable skills such as communication, problem solving and computer skills. Industry-specific knowledge, such as a field’s vocabulary, tools and safety rules, helps you stand out.'],
      ['What skills do employers look for?', 'Employers consistently ask for communication, teamwork, problem solving, reliability and computer skills, plus the technical skills of the specific job.'],
      ['How can I build career skills quickly?', 'Short, focused training, practice projects, part-time work, volunteering and job shadowing all help. Online job-title training can teach a role’s basics in a few hours.']
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'Skills to learn', h1: 'Skills to Learn for Different Careers', lead: `${skills.length} skills employers look for, why each one matters, how to start building it and which careers rely on it.`, meta: false })}
<div class="wrap" style="padding-top:30px;padding-bottom:20px">
<div class="grid">${skills.map((s) => `<article class="card link"><span class="ico">${icon(s.icon)}</span><h3><a class="stretch" href="${href(skillPath(s))}">${esc(s.name)}</a></h3><p>${esc(s.blurb)}</p></article>`).join('')}</div>
${faqBlock(faqs)}
</div>
${band('Find the skills for your path', 'The College & Career Finder connects your interests, major and career goals to the skills you may want to build.', 'Start the finder', FINDER, 'Browse training', '/training/')}`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'Skills to learn',
      keywords: 'skills to learn, career skills, skills for different careers, skills employers want, job skills to learn',
      title: fitTitle('Skills to Learn for Different Careers'),
      desc: clamp(`Which skills should you learn for your career? Explore ${skills.length} skills employers want, from communication to workplace safety and AI, with tips and related careers.`),
      schema: [faqSchema(faqs, path)]
    });
  }
  for (const s of skills) {
    const path = skillPath(s);
    const label = (/skills$/i.test(s.name) ? s.name : `${s.name} skills`).replace(/^./, (c) => c.toUpperCase());
    const lowerLabel = label.toLowerCase();
    const crumbs = [['Home', '/'], ['Skills to learn', '/skills-to-learn/'], [s.name, path]];
    const r = rec({ skills: [s.slug] });
    const top = r.courses.slice(0, 6);
    const matched = data.skills[s.slug].matched;
    const careersFor = (s.all ? [] : [...s.careers, ...matched.filter((x) => !s.careers.includes(x)).sort((a, b) => byslug[b].l.annualOpenings - byslug[a].l.annualOpenings)]).slice(0, 8);
    const faqs = [
      [`Why are ${lowerLabel} important?`, s.why],
      [`How can I improve my ${lowerLabel}?`, `${s.tips.join('. ')}.`]
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'Skills to learn', h1: `${esc(label)} for Your Career`, lead: esc(s.blurb), meta: false })}
<div class="wrap layout"><article class="prose">
${answerBox(`Why ${s.name.toLowerCase()} matters`, esc(s.why))}
<h2 id="how">How to start building it</h2><ul class="checks">${s.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
${s.all ? `<h2 id="careers">Every career has its own knowledge</h2><p>Each field has its own vocabulary, tools, regulations and daily routines. Every Career Education Institute training is built around one job title and teaches exactly this: what the role involves, its key terms, step-by-step tasks, tools and safety rules. <a href="${href('/training/')}">Browse trainings by job title</a> or <a href="${href('/careers/')}">explore careers</a>.</p>` : `<h2 id="careers">Careers that rely on ${esc(s.name.toLowerCase())}</h2>${careerCards(careersFor, 8)}`}
${top.length ? `<h2 id="training">Training that builds ${esc(s.name.toLowerCase())}</h2>${courseGrid(top.map((x) => [x.slug, `${s.name} is central to this job.`]), 'skill_page')}` : ''}
${faqBlock(faqs)}
${finderNote(false)}
</article><aside>${ctaCard(FIND_CTA)}${sideLinks('Other skills', skills.filter((x) => x.slug !== s.slug).map((x) => [x.name, skillPath(x)]))}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: label,
      title: fitTitle(pick([`${label.replace(/\b\w/g, (c) => c.toUpperCase())}: Why They Matter & How to Learn`, `${label.replace(/\b\w/g, (c) => c.toUpperCase())}: How to Build Them`])),
      desc: clamp(`${s.blurb} Learn why ${lowerLabel} matter, how to build them and which careers and trainings rely on them.`),
      schema: [...(top.length ? [itemList(`Training that builds ${s.name.toLowerCase()}`, top.map((x) => x.slug))] : []), faqSchema(faqs, path)]
    });
  }

  // ---------- Career options after high school ----------
  {
    const path = '/career-options-after-high-school/';
    const crumbs = [['Home', '/'], ['For students', '/students/'], ['Career options after high school', path]];
    const ex = (slugs) => slugs.map((s) => `[${byslug[s].title.toLowerCase()}](${byslug[s].url})`).join(', ');
    const text = `## Your main options
There is no single right path after high school. Most people choose one of these, and many combine two:

| Path | Typical length | Examples |
|---|---|---|
| Four-year college or university | About 4 years for a bachelor’s degree | [Nursing](${majorPath('nursing')}), [business administration](${majorPath('business-administration')}), [computer science](${majorPath('computer-science')}), [engineering](${fieldPath('engineering')}) |
| Community or technical college | Certificates in months, associate degrees in about 2 years | [Medical assisting](${majorPath('medical-assisting')}), [HVAC technology](${majorPath('hvac-technology')}), [information technology](${majorPath('information-technology')}) |
| Apprenticeship | Usually 2 to 5 years of paid work plus classes | ${ex(['electrician', 'plumber', 'carpenter'])} |
| Short-term training and certificates | Weeks to months | ${ex(['certified-nursing-assistant', 'phlebotomist', 'truck-driver'])} |
| Start working and train on the job | Varies | ${ex(['warehouse-associate', 'customer-service-representative', 'retail-sales-associate'])} |
| Military service | Commitments typically start at 4 years | Training in many technical fields, plus education benefits |

## How to choose
1. **Start with interests, not job titles.** List what you enjoy and what you are good at, then look at the fields that use those strengths. The [College & Career Finder](${FINDER}) or the [Career Match Quiz](/quizzes/career-match/) can help.
2. **Look at the education each career requires.** Some careers require a degree and a state license; others start with a short certificate or an apprenticeship. Each [career profile](/careers/) lists the typical training.
3. **Compare cost and time.** Consider tuition, how long you would be in school and whether you can earn while you learn.
4. **Test before you commit.** Job shadowing, part-time work, volunteering and short online courses let you try a field before spending years on it.
5. **Keep options open.** Credits from community college often transfer to four-year schools, and many careers let you add education later.

## Paths that start without a four-year degree
Many solid careers begin with a certificate, an associate degree or an apprenticeship, including ${ex(['electrician', 'hvac-technician', 'dental-hygienist', 'medical-assistant', 'it-support-specialist', 'welder'])}. See [college vs. trade school](/guides/college-vs-trade-school/) for a closer comparison.

## Building skills before you decide
You do not need to wait until you have picked a school or a major to build useful skills. Communication, computer skills and [workplace safety](${skillPath('workplace-safety')}) apply almost everywhere. Short, self-paced [online career training](/online-career-training/) can teach you what a specific job involves, so you can decide with real information.`;
    const { html, toc } = md(text);
    const faqs = [
      ['What are the options after high school?', 'The main options are a four-year college, a community or technical college, an apprenticeship, short-term training, starting work with on-the-job training, and military service. Many people combine them, such as working while taking classes.'],
      ['Is college the only path to a good career?', 'No. Many careers start with a certificate, an associate degree or an apprenticeship. Others require a bachelor’s degree or more. The right path depends on the career you want.'],
      ['What if I do not know what I want to do?', 'That is common. Explore with career quizzes, job shadowing, part-time work and intro courses. Community college and short training are low-cost ways to try a field.']
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'For students', h1: 'Career Options After High School', lead: 'College, community college, apprenticeships, short-term training, work and the military: how each path works and how to choose.', meta: false })}
<div class="wrap layout"><article class="prose">${answerBox('Quick answer', 'After high school you can attend a four-year college, start at a community or technical college, join an apprenticeship, earn a short-term certificate, go straight to work with on-the-job training, or enlist in the military. Choose based on the career you want, the education it requires, and the time and cost you can manage.')}${html}${faqBlock(faqs)}${finderNote(false)}</article><aside>${toc.length > 2 ? `<nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>` : ''}${ctaCard(FIND_CTA)}${sideLinks('Related', [['College vs. trade school', '/guides/college-vs-trade-school/'], ['How to choose a career', '/guides/how-to-choose-a-career/'], ['College majors', '/college-majors/'], ['For students', '/students/']])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'Career options after high school', type: 'article',
      keywords: 'career options after high school, what to do after high school, alternatives to college, jobs after high school',
      title: fitTitle('Career Options After High School: Your Paths'),
      desc: 'College, community college, apprenticeships, short-term training, work or the military: compare career options after high school and how to choose.',
      schema: [faqSchema(faqs, path)]
    });
  }

  // ---------- Colleges ----------
  const states = Object.keys(STATES).filter((s) => colleges.institutions.some((i) => i.state === s));
  {
    const path = '/colleges/';
    const crumbs = [['Home', '/'], ['Colleges and universities', path]];
    const faqs = [
      ['Where does this college list come from?', `From the U.S. Department of Education’s Integrated Postsecondary Education Data System (IPEDS): ${esc(colleges.meta.directory || '')} and ${esc(colleges.meta.completions || '')}. It includes active, degree-granting institutions that take part in federal student aid programs.`],
      ['What does “online programs” mean here?', 'The school reported to IPEDS that it offers at least one program that can be completed entirely through distance education. It does not mean every program is online. Check with the school for specific programs.'],
      ['Does the list include tuition or admission requirements?', 'No. Costs and admission requirements change often and differ by program, so check each school’s official website. Where the school provided them to IPEDS, the search links to its admissions page and net price calculator.'],
      ['Is Career Education Institute affiliated with these colleges?', 'No. Career Education Institute is not a college or an admissions service and is not affiliated with the schools listed.']
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College and university finder', h1: 'Search U.S. Colleges and Universities', lead: `Search ${collegeLabel} degree-granting U.S. colleges and universities by name, state, city, ZIP code, online programs, public or private, two-year or four-year, and major.`, meta: false })}
<div class="wrap" style="padding-top:30px;padding-bottom:20px">
<div class="college-app" data-college-search data-base="${esc(cfg.basePath)}" data-standalone><noscript><p>The search needs JavaScript. Browse colleges by state below.</p></noscript><p class="muted" data-cs-loading>Loading the college search…</p></div>
<h2 id="states">Colleges by state</h2><ul class="state-list">${states.map((s) => `<li><a href="${href(statePath(s))}">${esc(STATES[s])}</a> <span class="muted small">${num(colleges.institutions.filter((i) => i.state === s).length)}</span></li>`).join('')}</ul>
<p class="small muted">Source: ${esc(colleges.meta.source || '')}. ${esc(colleges.meta.directory || '')}; ${esc(colleges.meta.completions || '')}.</p>
${faqBlock(faqs)}
${finderNote()}
</div>
${band('Choosing a major too?', 'The College & Career Finder connects colleges, majors, minors and careers in one plan.', 'Start the finder', FINDER, 'Explore majors', '/college-majors/')}`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Tool', name: 'College and university search', scripts: ['college-search'],
      keywords: 'college finder, find a college, college search, universities near me, online colleges, community colleges, colleges by major',
      title: fitTitle('College Finder: Search U.S. Colleges & Universities'),
      desc: clamp(`Search ${collegeLabel} U.S. colleges and universities by state, city, ZIP code, online programs, public or private, two- or four-year and major. Official federal IPEDS data.`),
      schema: [faqSchema(faqs, path)]
    });
  }
  for (const s of states) {
    const list = colleges.institutions.filter((i) => i.state === s);
    const name = STATES[s];
    const path = statePath(s);
    const crumbs = [['Home', '/'], ['Colleges and universities', '/colleges/'], [name, path]];
    const n = (fn) => list.filter(fn).length;
    const pub = n((i) => i.control === 1), four = n((i) => i.level === 1), two = n((i) => i.level === 2), online = n((i) => i.online);
    const cities = Object.entries(list.reduce((a, i) => ((a[i.city] = (a[i.city] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const body = `${pageHero({ crumbs, eyebrow: 'Colleges by state', h1: `Colleges and Universities in ${esc(name)}`, lead: `${plural(list.length, 'degree-granting college or university', 'degree-granting colleges and universities')} in ${esc(name)} that take part in federal student aid programs, from the U.S. Department of Education.`, meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(`/colleges/?state=${s}`)}">Search ${esc(name)} colleges by major</a></div>` })}
<div class="wrap" style="padding-top:30px;padding-bottom:20px">
<ul class="facts"><li class="fact"><div class="k">Colleges</div><div class="v">${num(list.length)}</div></li><li class="fact"><div class="k">Public</div><div class="v">${num(pub)}</div><div class="n">${num(list.length - pub)} private</div></li><li class="fact"><div class="k">Four-year</div><div class="v">${num(four)}</div><div class="n">${num(two)} two-year</div></li><li class="fact"><div class="k">Online programs</div><div class="v">${num(online)}</div><div class="n">Report at least one fully online program</div></li></ul>
${cities.length ? `<p>Cities with the most colleges: ${esc(listJoin(cities.map(([c, k]) => `${c} (${k})`)))}.</p>` : ''}
<div class="table-wrap"><table data-sortable class="college-table"><caption class="vh">Colleges and universities in ${esc(name)}</caption><thead><tr><th scope="col" data-sort="text">College</th><th scope="col" data-sort="text">City</th><th scope="col" data-sort="text">Type</th><th scope="col" data-sort="text">Level</th><th scope="col" data-sort="text">Online programs</th></tr></thead><tbody>${list.map((i) => `<tr><td>${i.web ? `<a href="${esc(i.web)}" rel="nofollow noopener external">${esc(i.name)}</a>` : esc(i.name)}</td><td>${esc(i.city)}</td><td>${esc(CONTROL[i.control] || '')}</td><td>${esc(LEVEL[i.level] || '')}</td><td>${i.online ? 'Yes' : 'No'}</td></tr>`).join('')}</tbody></table></div>
<p class="small muted">Source: ${esc(colleges.meta.source || '')}, ${esc(colleges.meta.directory || '')}. Links go to each school’s official website as reported to IPEDS. “Online programs” means the school reported at least one program offered entirely by distance education.</p>
${finderNote()}
<p><a href="${href('/colleges/')}">All states</a> · <a href="${href('/college-majors/')}">Explore college majors</a> · <a href="${href(FINDER)}">College &amp; Career Finder</a></p>
</div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Directory', name: `Colleges in ${name}`,
      title: fitTitle(`Colleges and Universities in ${name} (${list.length})`),
      desc: clamp(`All ${list.length} degree-granting colleges and universities in ${name}: ${pub} public, ${list.length - pub} private, ${online} with online programs. Official U.S. Department of Education data.`),
      schema: [{ '@type': 'ItemList', name: `Colleges and universities in ${name}`, numberOfItems: list.length, itemListElement: list.slice(0, 100).map((i, k) => ({ '@type': 'ListItem', position: k + 1, item: { '@type': 'CollegeOrUniversity', name: i.name, ...(i.web ? { url: i.web } : {}), address: { '@type': 'PostalAddress', addressLocality: i.city, addressRegion: i.state, postalCode: i.zip, addressCountry: 'US' } } })) }]
    });
  }

  return pages;
}
