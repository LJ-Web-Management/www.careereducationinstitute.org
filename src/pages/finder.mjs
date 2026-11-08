// College & Career Finder: one page per step, each also an indexable guide, plus a page for every major, minor, interest,
// skill and state, built from the same data so search engines and AI assistants can read everything without JavaScript.
// Steps (STEP_PATHS in src/lib/finder.mjs; src/assets/finder.js mounts the matching step on each):
//   1 /college-and-career-finder/                  what you are looking for (start)
//   2 /college-and-career-finder/education-level/  stage of education
//   3 /career-interests/                           areas of interest       + /career-interests/<interest>/
//   4 /colleges/                                   college search (IPEDS)  + /colleges/<state>/
//   5 /college-majors/                             majors                  + /college-majors/<field>-majors/, /college-majors/<major>/
//   6 /college-minors/                             minors                  + /college-minors/<minor>/
//   7 /career-finder/                              career goals
//   8 /skills-to-learn/                            skills                  + /skills-to-learn/<skill>/
//   9 /college-and-career-finder/results/          personalized results (noindex)
// Also: /college-majors-and-career-paths/, /career-options-after-high-school/.
// FAQ answers are built from the data (coursework, skills, careers, IPEDS counts) so they stay accurate and specific.
import cfg from '../../site.config.mjs';
import { esc, href, abs, clamp, fitTitle, listJoin, countLabel, num, md } from '../lib/util.mjs';
import { pick } from '../lib/career-helpers.mjs';
import { pageHero, faqBlock, faqSchema, ctaCard, sideLinks, answerBox, icon, band } from '../lib/layout.mjs';
import {
  majors, minors, majorFields, interests, skills, questions, majorBySlug, minorBySlug, fieldBySlug, interestBySlug, engine, engineData, courseFor,
  majorPath, fieldPath, minorPath, skillPath, interestPath, minorPairs, FINDER, STEP_PATHS, loadColleges, majorCollegeCounts, CONTROL, LEVEL, AWARD,
  STATES, statePath
} from '../lib/finder.mjs';

const OG = '/og/guides.png';
const FIND_CTA = { title: 'Try the College & Career Finder', text: 'Answer a few questions to explore colleges, majors, minors and careers, then get training recommendations for your goals. Free, no sign-up.', btn: 'Start the finder', link: FINDER };
const SHOW = 8; // FAQs shown before "View more questions"

// Shown wherever college or training information appears
export const finderNote = (colleges = true) => `<aside class="callout info finder-note"><p><strong>About this information:</strong> Career Education Institute is not a college, university, degree-granting institution or admissions service.${colleges ? ` College and program information comes from the U.S. Department of Education’s <a href="https://nces.ed.gov/ipeds/" rel="noopener">IPEDS</a> data; confirm programs, costs and admission requirements with each school.` : ''} CEI trainings are general, non-credit career-preparation courses. They do not replace a college degree, grant academic credit or guarantee employment.</p></aside>`;

const plural = (n, one, many = one + 's') => `${num(n)} ${n === 1 ? one : many}`;
const lc = (s) => (/^[A-Z]{2}/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));
const sentence = (s) => s.replace(/\.?$/, '.');
// A FAQ entry with a plain-text answer (escaped here; faqBlock escapes the question)
const Q = (q, a) => [q, esc(a)];
const faqs = (list, heading = 'Frequently asked questions') => faqBlock(list, heading, 'faq', { show: SHOW });
const DURATION = { C: 'certificates take from a few months to about two years', A: 'an associate degree usually takes about two years of full-time study', B: 'a bachelor’s degree usually takes about four years of full-time study', M: 'a master’s degree usually takes one to two years after a bachelor’s', D: 'a doctoral or professional degree takes several more years beyond that' };
// Hands-on parts of a program, found in the major's own description and course list
const HANDS_ON = [[/clinical/i, 'clinical rotations'], [/practicum/i, 'a practicum'], [/externship/i, 'an externship'], [/student teaching/i, 'student teaching'], [/field (work|methods|placement)/i, 'field work'], [/\blab(s|oratory)?\b/i, 'laboratory work'], [/internship/i, 'internships'], [/portfolio/i, 'building a portfolio'], [/studio/i, 'studio courses'], [/apprenticeship/i, 'apprenticeship options'], [/flight training/i, 'flight training'], [/kitchen/i, 'kitchen labs'], [/team (software )?projects|design projects|projects with real clients/i, 'team projects']];
// "A Nursing major prepares you…" from a summary that starts with a verb ("Prepares you…") or a noun phrase ("A broad…")
const describe = (subject, summary) => (/^(A|An|The) /.test(summary) ? `${subject} is ${lc(summary)}` : `${subject} ${lc(summary)}`);
const titleCase = (t) => t.replace(/\b([a-z])([a-z]*)/g, (w, f, r) => (/^(and|or|of|for|the|in|to|a|an)$/.test(w) ? w : f.toUpperCase() + r));
// Words in a major's skill list that show it builds each skill (for "Which majors build X?")
const SKILL_IN_MAJOR = { communication: /communicat|writing|public speaking|presentation/i, leadership: /leadership|supervis/i, 'critical-thinking': /critical thinking|analysis|reasoning|judgment/i, 'problem-solving': /problem solving|troubleshoot|diagnos/i, 'computer-skills': /software|computer|spreadsheet|database|electronic health/i, 'artificial-intelligence': /machine learning|artificial intelligence|responsible ai/i, 'project-management': /project|scheduling/i, 'workplace-safety': /safety|hazard|osha/i, 'customer-service': /customer|guest service|client/i, 'technical-skills': /equipment|installation|wiring|repair|welding|machining|maintenance|instrument/i, 'professional-development': /professional|portfolio/i };
const SOFT = new Set(['communication', 'leadership', 'critical-thinking', 'problem-solving', 'customer-service', 'professional-development']);

export function finderPages(ctx) {
  const { careers, byslug, categories } = ctx;
  const data = engineData(careers, categories);
  const rec = (profile) => engine.recommend(data, profile);
  const counts = majorCollegeCounts();
  const colleges = loadColleges();
  const nColleges = colleges.institutions.length;
  const collegeLabel = nColleges >= 1000 ? `${(Math.floor(nColleges / 100) * 100).toLocaleString('en-US')}+` : String(nColleges);
  const pages = [];
  const states = Object.keys(STATES).filter((s) => colleges.institutions.some((i) => i.state === s));
  // Colleges per major per state, for "which states have the most colleges offering X" and each state's common majors
  const byState = majors.map(() => ({}));
  for (const i of colleges.institutions) for (const idx of i.majors) byState[idx][i.state] = (byState[idx][i.state] || 0) + 1;
  const majorIdx = Object.fromEntries(majors.map((m, i) => [m.slug, i]));

  // ---------- Shared pieces ----------
  const careerCards = (slugs, max = 8) => `<div class="grid">${slugs.map((s) => byslug[s]).filter(Boolean).slice(0, max).map((c) => `<article class="card link"><span class="ico">${icon(c.cat)}</span><h3><a class="stretch" href="${href(c.url)}">${esc(c.title)}</a></h3><p>${esc(c.blurb)}</p><ul class="chips"><li class="chip">Typical training: ${esc(c.train)}</li></ul></article>`).join('')}</div>`;
  const linkCards = (items) => `<div class="grid">${items.map(([name, path, text, ico]) => `<article class="card link">${ico ? `<span class="ico">${icon(ico)}</span>` : ''}<h3><a class="stretch" href="${href(path)}">${esc(name)}</a></h3><p>${esc(text)}</p></article>`).join('')}</div>`;
  // A CEI training recommendation: what it is, the skills it builds, why it fits, and how to enroll
  const courseCard = (slug, why) => {
    const c = byslug[slug]; const k = courseFor(c);
    return `<article class="course-card"><div class="cc-head"><span class="ico">${icon(c.cat)}</span><div><h3><a href="${href(k.url)}">${esc(k.name)}</a></h3><p class="cc-meta">Online, self-paced · about ${k.hours} hours · $${Number(k.price).toFixed(2)}</p></div></div><p>${esc(k.desc)}</p><p class="cc-skills"><strong>Skills you build:</strong> ${esc(listJoin(c.hard.slice(0, 3).map(lc)))}</p>${why ? `<p class="cc-why"><strong>Why it fits:</strong> ${esc(why)}</p>` : ''}<div class="btn-row"><a class="btn btn-primary btn-sm" href="${href(k.buy)}">${k.buyLabel === 'Buy now' ? 'Start learning today' : 'Enroll in this course'}</a><a class="btn btn-sm" href="${href(k.url)}">View course details</a></div></article>`;
  };
  const courseGrid = (items) => `<div class="course-grid">${items.map(([s, why]) => courseCard(s, why)).join('')}</div>`;
  const whyFrom = (r) => engine.reasonText(r.reasons[0] || ['', '']);
  const itemList = (name, slugs) => ({ '@type': 'ItemList', name, itemListElement: slugs.map((s, i) => { const k = courseFor(byslug[s]); return { '@type': 'ListItem', position: i + 1, url: abs(k.url), name: k.name }; }) });
  const trainingWhy = `<h2 id="why-training">Why consider career training alongside college?</h2><p>Your college major gives you an academic foundation. Short career training can add practical knowledge of a specific job: what the work involves day to day, its vocabulary, common tasks, tools and safety rules. You do not have to wait until graduation: many students take a short course to test a career before choosing a major, to prepare for an internship or a part-time job, or to show employers they understand the work.</p>`;
  const careerList = (slugs, n = 6) => listJoin(slugs.filter((s) => byslug[s]).slice(0, n).map((s) => byslug[s].title.toLowerCase().replace(/\b(it|ux|ui|hr|hvac|cnc|emt|cad|ai)\b/g, (x) => x.toUpperCase())));
  const levelsOf = (cnt, min = 5) => Object.entries(cnt.levels).filter(([, n]) => n >= min).map(([l]) => l).sort((a, b) => 'CABMD'.indexOf(a) - 'CABMD'.indexOf(b));
  const topStates = (slug, n = 5) => Object.entries(byState[majorIdx[slug]]).sort((a, b) => b[1] - a[1]).slice(0, n);

  // The interactive step, mounted by finder.js. The hidden icons make every icon the app draws part of this page's sprite.
  const iconKeys = [...new Set([...interests.map((i) => i.icon), ...majorFields.map((f) => f.icon), ...skills.map((s) => s.icon), ...categories.map((c) => c.slug)])];
  const mount = (step, fallback) => `<div class="wrap finder-wrap"><div class="finder" id="finder" data-finder data-step="${step}" data-paths="${esc(JSON.stringify(STEP_PATHS.map((p) => p)))}" data-base="${esc(cfg.basePath)}" aria-live="polite">
<noscript><div class="callout"><p>The interactive College &amp; Career Finder needs JavaScript. ${fallback || ''} You can still explore <a href="${href('/college-majors/')}">college majors</a>, <a href="${href('/college-minors/')}">minors</a>, <a href="${href('/colleges/')}">colleges by state</a>, <a href="${href('/careers/')}">careers</a> and <a href="${href('/training/')}">online career training</a>.</p></div></noscript>
<div class="finder-loading"><p>Loading the College &amp; Career Finder…</p></div>
<div hidden>${iconKeys.map((k) => icon(k)).join('')}</div></div></div>`;
  const stepScripts = (step) => ['finder-engine', ...(step === 3 ? ['college-search'] : []), 'finder'];
  const stepLinks = `<ol class="step-links">${['What you are looking for', 'Your stage of education', 'Areas of interest', 'Colleges and universities', 'College majors', 'College minors', 'Career goals', 'Skills to develop', 'Your personalized results'].map((t, i) => `<li><a href="${href(STEP_PATHS[i])}">${esc(t)}</a></li>`).join('')}</ol>`;

  // ---------- Step 1: start ----------
  {
    const path = STEP_PATHS[0];
    const crumbs = [['Home', '/'], ['College & Career Finder', path]];
    const list = [
      Q('What is the College & Career Finder?', 'A free tool from Career Education Institute that helps you explore U.S. colleges and universities, college majors and minors, career paths and skills. At the end you get a personalized summary with career paths, skills to develop and related online training.'),
      Q('How does the College & Career Finder work?', 'You move through nine short steps, each on its own page: what you are looking for, your stage of education, your interests, colleges, majors, minors, career goals and skills. Every step is optional, and your answers shape the suggestions in later steps and in your results.'),
      Q('How long does the College & Career Finder take?', 'About five minutes if you answer every step. You can skip any step and come back later; your answers are saved in your browser.'),
      Q('Is the College & Career Finder free?', 'Yes. It is free, with no sign-up and no form to fill in.'),
      Q('Do I need to give my email to see my results?', 'No. Your results appear on screen as soon as you finish, and you can download, print, email or share them yourself.'),
      Q('Is my information saved?', 'Your answers are saved only in your browser so you can come back to them. They are not sent to Career Education Institute.'),
      Q('Who is the College & Career Finder for?', 'High school students, recent graduates, college students, college graduates, working professionals, career changers and parents helping a student plan.'),
      Q('Where does the college information come from?', `From the U.S. Department of Education’s Integrated Postsecondary Education Data System (IPEDS). The finder includes ${collegeLabel} active, degree-granting colleges and universities that take part in federal student aid programs, with the programs each school reported awarding. Always confirm details on the school’s official website.`),
      Q('How are training recommendations chosen?', 'Each Career Education Institute training is about one job. The finder ranks trainings by how closely that job connects to the majors, minors, interests, careers and skills you choose, and it leaves out trainings that are not closely related.'),
      Q('Is Career Education Institute a college?', 'No. Career Education Institute is not a college, university, degree-granting institution or admissions service, and it does not apply to colleges for you. It offers general, non-credit online career training by job title.'),
      Q('Can career training replace a college degree?', 'No. CEI trainings do not replace a degree and do not grant college credit, a license or a guarantee of employment. They help you learn about a job and build practical knowledge, alongside college or on their own.'),
      Q('Can I change my answers?', 'Yes. Use the step list at the top of any step to go back, change your choices and see your results update.')
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'Free career exploration tool', h1: 'College & Career Finder', lead: `Explore ${collegeLabel} U.S. colleges, ${majors.length} majors, ${minors.length} minors and ${countLabel(careers.length)} careers in a few minutes. See where your interests can lead and which practical skills you can start building now.`, meta: false, extra: `<p class="hero-note">Free · No sign-up · About 5 minutes · Your answers stay in your browser</p>` })}
${mount(0)}
<div class="wrap layout"><article class="prose">
<h2 id="how-it-works">How the College &amp; Career Finder works</h2>
<p>Nine short steps, each on its own page. Every step is optional, and your answers shape the suggestions that follow.</p>
${stepLinks}
<h2 id="explore">Explore on your own</h2>
<ul><li><a href="${href('/college-majors/')}">College majors</a>: ${majors.length} majors in ${majorFields.length} fields, with what each includes, skills and career paths</li><li><a href="${href('/college-minors/')}">College minors</a>: ${minors.length} minors and the majors they complement</li><li><a href="${href('/colleges/')}">College and university search</a>: ${collegeLabel} schools by state, city, ZIP code, type and program</li><li><a href="${href('/career-interests/')}">Career interests</a>: majors and careers for ${interests.length} areas of interest</li><li><a href="${href('/college-majors-and-career-paths/')}">College majors and career paths</a></li><li><a href="${href('/skills-to-learn/')}">Skills to learn</a> for different careers</li><li><a href="${href('/career-options-after-high-school/')}">Career options after high school</a></li></ul>
<h2 id="fields">Explore majors by field</h2>
${linkCards(majorFields.map((f) => [`${f.name} majors`, fieldPath(f), f.blurb, f.icon]))}
${trainingWhy}
${faqs(list)}
${finderNote()}
</article><aside>${ctaCard({ title: 'Prefer a quick quiz?', text: 'The Career Match Quiz suggests careers from 24 questions about what you enjoy.', btn: 'Take the quiz', link: '/quizzes/career-match/' })}${sideLinks('Related', [['College vs. trade school', '/guides/college-vs-trade-school/'], ['How to choose a career', '/guides/how-to-choose-a-career/'], ['Career exploration questions', '/career-exploration/'], ['All careers', '/careers/'], ['Online career training', '/online-career-training/'], ['For students', '/students/']])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Tool', name: 'College & Career Finder', scripts: stepScripts(0),
      keywords: 'college and career finder, career exploration tool, career training finder, college major finder, careers for my major',
      title: fitTitle('College & Career Finder: Majors, Colleges & Careers'),
      desc: clamp(`Free career exploration tool: search ${collegeLabel} U.S. colleges, compare ${majors.length} college majors and ${minors.length} minors, discover career paths and find training for the skills you need.`),
      schema: [{ '@type': 'WebApplication', name: 'College & Career Finder', url: abs(path), applicationCategory: 'EducationalApplication', operatingSystem: 'Any web browser', isAccessibleForFree: true, offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, provider: { '@id': abs('/#org') }, description: 'Explore U.S. colleges, college majors and minors, career paths and skills, with personalized career training recommendations.' }, faqSchema(list, path)]
    });
  }

  // ---------- Step 2: education level ----------
  {
    const path = STEP_PATHS[1];
    const crumbs = [['Home', '/'], ['College & Career Finder', FINDER], ['Education level', path]];
    const advice = {
      'high-school': ['Explore before you choose', `Start with what you enjoy, then look at the careers and college majors that use those interests. Visit <a href="${href('/college-majors/')}">college majors</a> and <a href="${href('/career-interests/')}">career interests</a>, take the <a href="${href('/quizzes/career-match/')}">Career Match Quiz</a>, and ask about dual enrollment or career and technical classes at your school.`],
      'recent-grad': ['Compare your paths', `Compare a four-year college, community college, an apprenticeship and short-term certificates side by side. <a href="${href('/career-options-after-high-school/')}">Career options after high school</a> explains each, and <a href="${href('/guides/college-vs-trade-school/')}">college vs. trade school</a> compares them.`],
      'in-college': ['Make the most of your degree', `Confirm your major, add a <a href="${href('/college-minors/')}">minor</a> that fills a gap, look for internships and part-time work in your field, and build practical, job-specific knowledge alongside your classes.`],
      'college-grad': ['Connect your degree to a job', `Look at the career paths connected to your major on its <a href="${href('/college-majors/')}">major page</a>. Short, job-specific training and certifications can help you show employers that you understand a particular role.`],
      professional: ['Grow where you are', `Identify the skills the next role up requires, from <a href="${href(skillPath('leadership'))}">leadership</a> to <a href="${href(skillPath('project-management'))}">project management</a>, and build them through focused training and certifications.`],
      changer: ['Test a new field first', `List your transferable skills, then try a new field with low-cost, short training before committing to a longer program. See <a href="${href('/guides/how-to-change-careers/')}">how to change careers</a> and the <a href="${href('/career-changers/')}">career changer hub</a>.`],
      other: ['Explore at your own pace', `Every step of the finder is optional. Browse <a href="${href('/careers/')}">careers</a>, <a href="${href('/college-majors/')}">majors</a> and <a href="${href('/skills-to-learn/')}">skills</a> in any order.`]
    };
    const list = [
      Q('Why does the finder ask about my stage of education?', 'Your stage shapes your options. A high school student is choosing a first path, a college student may be adding a minor or internship, and a career changer may want to test a new field quickly. Your results explain how college and career training can fit together for you.'),
      Q('What should high school students do to plan a career?', 'Explore interests, look at the careers and majors connected to them, take career-related classes, try job shadowing or part-time work, and compare four-year college, community college, apprenticeships and short-term training.'),
      Q('What are my options after graduating from high school?', 'You can attend a four-year college, start at a community or technical college, join an apprenticeship, earn a short-term certificate, start working with on-the-job training, or join the military. Many people combine them.'),
      Q('Can I start career training while I am in college?', 'Yes. Short online career training can help you learn what a specific job involves and build practical knowledge alongside your classes. It does not replace your degree.'),
      Q('What can I do after graduating from college if I am unsure about my career?', 'Review the careers connected to your major, talk to people in roles that interest you, consider internships or entry-level roles, and use short, job-specific training or certifications to explore and strengthen your applications.'),
      Q('How can working professionals move up in their field?', 'Find out what the next role requires, then build those skills through on-the-job projects, focused training and industry certifications.'),
      Q('How do I change careers?', 'Identify your transferable skills, research fields that use them, test a new field with short, low-cost training or volunteering, and then commit to the education or credentials the new career requires.'),
      Q('Is it too late to go to college or start a new career?', 'No. Adults of every age enroll in college, earn certificates and change careers. Community colleges, online programs and short training make it easier to learn while working.'),
      Q('Do I have to answer this question?', 'No. Every step of the College & Career Finder is optional. Your answer only changes the advice shown with your results.')
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College & Career Finder · Step 2', h1: 'Career Planning by Education Level', lead: 'Where you are in your education changes your best next step. Choose your stage, then see advice for students, graduates, working professionals and career changers.', meta: false })}
${mount(1)}
<div class="wrap layout"><article class="prose">
${questions.stages.map((s) => advice[s.value] ? `<h2 id="${s.value}">${esc(s.label)}: ${esc(advice[s.value][0].toLowerCase())}</h2><p>${esc(questions.stageNotes[s.value] || '')} ${advice[s.value][1]}</p>` : '').join('')}
${faqs(list)}
${finderNote(false)}
</article><aside>${ctaCard(FIND_CTA)}${sideLinks('Related', [['For students', '/students/'], ['For career changers', '/career-changers/'], ['For working professionals', '/professionals/'], ['Career options after high school', '/career-options-after-high-school/']])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'Career planning by education level', scripts: stepScripts(1),
      keywords: 'career planning for high school students, career planning for college students, career change, what to do after college',
      title: fitTitle('Career Planning by Education Level: Next Steps'),
      desc: 'Career planning advice for high school students, recent graduates, college students and graduates, working professionals and career changers.',
      schema: [faqSchema(list, path)]
    });
  }

  // ---------- Step 3: career interests (hub and one page per interest) ----------
  const interestMajors = (i) => [...new Set([...i.majors, ...majors.filter((m) => m.interests.includes(i.slug)).map((m) => m.slug)])];
  const interestMinors = (i) => minors.filter((m) => m.interests.includes(i.slug));
  const interestCareers = (i) => [...new Set([...i.careers, ...careers.filter((c) => i.fields.includes(c.cat)).sort((a, b) => b.l.annualOpenings - a.l.annualOpenings).map((c) => c.slug)])];
  {
    const path = STEP_PATHS[2];
    const crumbs = [['Home', '/'], ['Career interests', path]];
    const list = [
      Q('How do I find my career interests?', 'Think about the subjects, activities and problems you enjoy, the work settings you prefer, and what people say you are good at. Then explore the careers and majors connected to those areas and notice which ones keep catching your attention.'),
      Q('What careers match my interests?', `Pick an area below to see the college majors and careers connected to it. The College & Career Finder can combine several interests and suggest careers, majors and skills for you.`),
      Q('How many interests should I choose?', 'As many as feel true. Most people choose two to four areas. Choosing several helps the finder find careers that combine them.'),
      Q('Can my interests change over time?', 'Yes. Interests often change with experience, so explore widely and revisit your choices as you try classes, jobs and volunteering.'),
      Q('What if my interests do not match a specific major?', 'Many careers are open to several majors, and many majors lead to several careers. Look at the skills a career requires, then choose a major and minor that build them.'),
      Q('Are interests or skills more important in choosing a career?', 'Both matter. Interests help you stay motivated; skills can be learned. A career that matches your interests is easier to build skills for.'),
      Q('Is there a quiz to find careers that fit my interests?', `Yes. The free Career Match Quiz suggests careers from 24 questions about what you enjoy, and the College & Career Finder connects your interests to majors, minors, careers and training.`),
      Q('Where can I learn more about a specific career?', `Each of the ${countLabel(careers.length)} career profiles on this site covers what the work involves, a day in the life, how to become one, skills and pay data.`)
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College & Career Finder · Step 3', h1: 'Find Careers and Majors That Match Your Interests', lead: `Choose the areas that interest you. Each of the ${interests.length} interest areas connects to college majors, careers, skills and practical training.`, meta: false })}
${mount(2)}
<div class="wrap layout"><article class="prose">
<h2 id="all-interests">All areas of interest</h2>
${linkCards(interests.map((i) => [i.name, interestPath(i), i.blurb, i.icon]))}
${faqs(list)}
${finderNote(false)}
</article><aside>${ctaCard({ title: 'Prefer a quick quiz?', text: 'The Career Match Quiz suggests careers from 24 questions about what you enjoy.', btn: 'Take the quiz', link: '/quizzes/career-match/' })}${sideLinks('Related', [['College majors', '/college-majors/'], ['All careers', '/careers/'], ['How to choose a career', '/guides/how-to-choose-a-career/']])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'Career interests', scripts: stepScripts(2),
      keywords: 'careers that match my interests, career interests, what career fits my interests, majors by interest',
      title: fitTitle('Careers and Majors That Match Your Interests'),
      desc: clamp(`Find careers and college majors that match your interests. Explore ${interests.length} interest areas, from healthcare and technology to skilled trades, with majors, careers and skills for each.`),
      schema: [{ '@type': 'ItemList', name: 'Career interest areas', itemListElement: interests.map((i, k) => ({ '@type': 'ListItem', position: k + 1, url: abs(interestPath(i)), name: i.name })) }, faqSchema(list, path)]
    });
  }
  for (const i of interests) {
    const path = interestPath(i);
    const crumbs = [['Home', '/'], ['Career interests', STEP_PATHS[2]], [i.name, path]];
    const ms = interestMajors(i).map((s) => majorBySlug[s]).filter(Boolean);
    const ns = interestMinors(i);
    const cs = interestCareers(i);
    const noDegree = cs.filter((s) => byslug[s].eduLevel < 4).slice(0, 6);
    const degree = cs.filter((s) => byslug[s].eduLevel >= 4).slice(0, 6);
    const freq = {}; cs.slice(0, 12).forEach((s) => byslug[s].hard.slice(0, 4).forEach((h) => { freq[h] = (freq[h] || 0) + 1; }));
    const topSkills = Object.keys(freq).sort((a, b) => freq[b] - freq[a]).slice(0, 6);
    const top = rec({ interests: [i.slug] }).courses.slice(0, 4);
    const name = i.name, low = i.name.toLowerCase().replace(/\b(ai)\b/g, 'AI');
    const list = [
      Q(`What careers are there in ${low}?`, `Careers connected to ${low} include ${careerList(cs, 8)}.`),
      Q(`What should I major in if I am interested in ${low}?`, ms.length ? `Majors connected to ${low} include ${listJoin(ms.slice(0, 6).map((m) => m.name))}. Compare what each includes, the skills it builds and where it leads.` : 'Many majors can lead to these careers; compare the education each career typically requires.'),
      ...(noDegree.length ? [Q(`What ${low} careers do not require a four-year degree?`, `Examples include ${careerList(noDegree)}. They typically start with a high school diploma, a certificate, an associate degree, an apprenticeship or on-the-job training.`)] : []),
      ...(degree.length ? [Q(`Which ${low} careers usually require a bachelor’s degree or more?`, `Examples include ${careerList(degree)}. Some also need a license or certification.`)] : []),
      ...(topSkills.length ? [Q(`What skills do you need for a career in ${low}?`, `Skills that come up often in these careers include ${listJoin(topSkills.map(lc))}, along with communication and problem solving.`)] : []),
      ...(ns.length ? [Q(`What minors fit an interest in ${low}?`, `Minors connected to ${low} include ${listJoin(ns.slice(0, 5).map((m) => m.name))}.`)] : []),
      Q(`How do I start a career in ${low}?`, `Learn about the careers in the field, choose one or two that fit you, check the education or training each requires, and build practical knowledge early through classes, part-time work, volunteering or short career training.`),
      Q(`Can I explore ${low} careers before choosing a college major?`, `Yes. Career profiles, job shadowing and short online career training let you learn what jobs in ${low} involve before you commit to a major or program.`),
      ...(top.length ? [Q(`Does Career Education Institute offer training related to ${low}?`, `Yes. Related online trainings include ${listJoin(top.map((r) => courseFor(byslug[r.slug]).name))}. They are general, non-credit courses that teach what a job involves; they do not grant a degree or license.`)] : []),
      Q(`Which colleges offer programs related to ${low}?`, `Use the college search to find U.S. colleges that report awarding degrees in related majors, filtered by state, city, ZIP code, online programs and type of school.`)
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'Career interests', h1: `Majors and Careers for People Interested in ${esc(name)}`, lead: esc(i.blurb), meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(`${STEP_PATHS[2]}?interest=${i.slug}`)}">Explore this interest in the finder</a></div>` })}
<div class="wrap layout"><article class="prose">
${answerBox(`${name} at a glance`, esc(`Careers: ${careerList(cs, 5)}.${ms.length ? ` Majors: ${listJoin(ms.slice(0, 5).map((m) => m.name))}.` : ''}`))}
${ms.length ? `<h2 id="majors">College majors for ${esc(low)}</h2>${linkCards(ms.slice(0, 9).map((m) => [m.name, majorPath(m), m.summary]))}` : ''}
<h2 id="careers">Careers in ${esc(low)}</h2>${careerCards(cs, 9)}
${topSkills.length ? `<h2 id="skills">Skills these careers use</h2><ul class="chips skill-chips">${topSkills.map((s) => `<li class="chip">${esc(s)}</li>`).join('')}</ul>` : ''}
${ns.length ? `<h2 id="minors">Minors that fit this interest</h2><ul>${ns.map((m) => `<li><a href="${href(minorPath(m))}">${esc(m.name)}</a>: ${esc(m.summary)}</li>`).join('')}</ul>` : ''}
${top.length ? `<h2 id="training">Start building skills now</h2>${courseGrid(top.map((r) => [r.slug, whyFrom(r)]))}` : ''}
${faqs(list, `${name}: frequently asked questions`)}
${finderNote(false)}
</article><aside>${ctaCard({ ...FIND_CTA, link: `${STEP_PATHS[2]}?interest=${i.slug}` })}${sideLinks('Other interests', [...interests.filter((x) => x.slug !== i.slug).slice(0, 12).map((x) => [x.name, interestPath(x)]), ['All interests', STEP_PATHS[2]]])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: `${name}: majors and careers`, keywords: `${i.keywords}, careers in ${low}, majors for ${low}`,
      title: fitTitle(pick([`${name}: Majors, Careers & Skills`, `${name} Careers and Majors`, `${name} Careers`])),
      desc: clamp(`Interested in ${low}? See the college majors, careers, skills and minors that fit, which careers need a degree and which do not, and training to start now.`),
      schema: [...(top.length ? [itemList(`Training related to ${low}`, top.map((r) => r.slug))] : []), faqSchema(list, path)]
    });
  }

  // ---------- Step 4: colleges (search and state pages) ----------
  {
    const path = STEP_PATHS[3];
    const crumbs = [['Home', '/'], ['Colleges and universities', path]];
    const n = (fn) => colleges.institutions.filter(fn).length;
    const pub = n((i) => i.control === 1), four = n((i) => i.level === 1), two = n((i) => i.level === 2), online = n((i) => i.online), grad = n((i) => i.grad);
    const big = states.map((s) => [s, n((i) => i.state === s)]).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const list = [
      Q('How many colleges are there in the United States?', `The latest U.S. Department of Education data lists ${num(nColleges)} active, degree-granting colleges and universities that take part in federal student aid programs: ${num(pub)} public and ${num(nColleges - pub)} private, ${num(four)} four-year and ${num(two)} two-year.`),
      Q('How do I find colleges near me?', 'Enter your ZIP code to sort colleges by approximate distance, or select “Use my location”. You can also filter by state and city.'),
      Q('How do I find colleges that offer my major?', `Choose a major in the “Major or program” filter. The search shows colleges that reported awarding degrees or certificates in that field. It covers ${majors.length} majors.`),
      Q('How do I find online colleges?', `Set “Online or in person” to “Offers fully online programs”. ${num(online)} colleges reported offering at least one program entirely online; that does not mean every program at those schools is online.`),
      Q('What is the difference between a two-year and a four-year college?', 'Two-year colleges, such as community and technical colleges, mainly award certificates and associate degrees. Four-year colleges and universities award bachelor’s degrees, and many also offer graduate degrees.'),
      Q('What is the difference between public and private colleges?', 'Public colleges are run by states or local governments. Private nonprofit colleges are independent institutions, and private for-profit colleges are run as businesses. Costs, financial aid and programs vary widely in every group.'),
      Q('How many colleges offer graduate programs?', `${num(grad)} of the colleges in this search report offering graduate programs.`),
      Q('Which states have the most colleges?', `${listJoin(big.map(([s, k]) => `${STATES[s]} (${num(k)})`))}.`),
      Q('Where does this college list come from?', `From the U.S. Department of Education’s Integrated Postsecondary Education Data System (IPEDS): ${colleges.meta.directory || ''} and ${colleges.meta.completions || ''}. It includes active, degree-granting institutions that take part in federal student aid programs.`),
      Q('Does the list include tuition or admission requirements?', 'No. Costs and admission requirements change often and differ by program, so check each school’s official website. Where the school provided them, the search links to its admissions page, its net price calculator and its College Navigator profile.'),
      Q('Can I save colleges to compare later?', 'Yes. Select “Save” on any college to add it to your College & Career Finder results. Your list stays in your browser.'),
      Q('Is Career Education Institute affiliated with these colleges?', 'No. Career Education Institute is not a college or an admissions service and is not affiliated with the schools listed.')
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College & Career Finder · Step 4', h1: 'Search U.S. Colleges and Universities', lead: `Search ${collegeLabel} degree-granting U.S. colleges and universities by name, state, city, ZIP code, online programs, public or private, two-year or four-year, and major.`, meta: false })}
${mount(3, 'Browse colleges by state below.')}
<div class="wrap" style="padding-top:20px;padding-bottom:20px">
<h2 id="states">Colleges by state</h2><ul class="state-list">${states.map((s) => `<li><a href="${href(statePath(s))}">${esc(STATES[s])}</a> <span class="muted small">${num(colleges.institutions.filter((i) => i.state === s).length)}</span></li>`).join('')}</ul>
<h2 id="by-major">Colleges by major</h2><p>Each major page shows how many colleges report awarding it and links to the colleges that offer it: ${majorFields.map((f) => `<a href="${href(fieldPath(f))}">${esc(f.name.toLowerCase())}</a>`).join(', ')}.</p>
<p class="small muted">Source: ${esc(colleges.meta.source || '')}. ${esc(colleges.meta.directory || '')}; ${esc(colleges.meta.completions || '')}.</p>
${faqs(list)}
${finderNote()}
</div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Tool', name: 'College and university search', scripts: stepScripts(3),
      keywords: 'college finder, find a college, college search, colleges near me, online colleges, community colleges, colleges by major',
      title: fitTitle('College Finder: Search U.S. Colleges & Universities'),
      desc: clamp(`Search ${collegeLabel} U.S. colleges and universities by state, city, ZIP code, online programs, public or private, two- or four-year and major. Official federal IPEDS data.`),
      schema: [faqSchema(list, path)]
    });
  }
  for (const s of states) {
    const list = colleges.institutions.filter((i) => i.state === s);
    const name = STATES[s];
    const path = statePath(s);
    const crumbs = [['Home', '/'], ['Colleges and universities', STEP_PATHS[3]], [name, path]];
    const n = (fn) => list.filter(fn).length;
    const pub = n((i) => i.control === 1), nonprofit = n((i) => i.control === 2), forprofit = n((i) => i.control === 3), four = n((i) => i.level === 1), two = n((i) => i.level === 2), online = n((i) => i.online), grad = n((i) => i.grad);
    const cities = Object.entries(list.reduce((a, i) => ((a[i.city] = (a[i.city] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topMajors = majors.map((m, idx) => [m, byState[idx][s] || 0]).filter(([, k]) => k).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const twoYr = list.filter((i) => i.level === 2 && i.control === 1).slice(0, 6).map((i) => i.name);
    const fq = [
      Q(`How many colleges are in ${name}?`, `${name} has ${plural(list.length, 'degree-granting college or university', 'degree-granting colleges and universities')} that take part in federal student aid programs, according to the latest U.S. Department of Education (IPEDS) data.`),
      Q(`How many public colleges are in ${name}?`, `${num(pub)} public, ${num(nonprofit)} private nonprofit and ${num(forprofit)} private for-profit.`),
      Q(`How many community colleges and two-year colleges are in ${name}?`, `${plural(two, 'two-year college')}${twoYr.length ? `, including public two-year colleges such as ${listJoin(twoYr)}` : ''}.`),
      Q(`How many four-year colleges and universities are in ${name}?`, `${num(four)} four-year colleges and universities${grad ? `, and ${num(grad)} schools in ${name} offer graduate programs` : ''}.`),
      Q(`Which colleges in ${name} offer online programs?`, `${plural(online, 'college')} in ${name} reported offering at least one program entirely online. Use the college search with “Offers fully online programs” to see them, and check each school for specific online programs.`),
      ...(cities.length ? [Q(`Which cities in ${name} have the most colleges?`, `${listJoin(cities.map(([c, k]) => `${c} (${k})`))}.`)] : []),
      ...(topMajors.length ? [Q(`What majors are most widely offered at colleges in ${name}?`, `Among the ${majors.length} majors in this guide, the most widely offered in ${name} are ${listJoin(topMajors.map(([m, k]) => `${m.name} (${k} schools)`))}.`)] : []),
      Q(`How do I find a college in ${name} that offers my major?`, `Use the college search with the state set to ${name} and choose your major, or filter by city or ZIP code.`),
      Q(`Where does this list of ${name} colleges come from?`, `From the U.S. Department of Education’s IPEDS data (${colleges.meta.directory || ''}). Confirm programs, costs and admission requirements on each school’s official website.`)
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'Colleges by state', h1: `Colleges and Universities in ${esc(name)}`, lead: `${plural(list.length, 'degree-granting college or university', 'degree-granting colleges and universities')} in ${esc(name)} that take part in federal student aid programs, from the U.S. Department of Education.`, meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(`${STEP_PATHS[3]}?state=${s}`)}">Search ${esc(name)} colleges by major</a></div>` })}
<div class="wrap" style="padding-top:30px;padding-bottom:20px">
<ul class="facts"><li class="fact"><div class="k">Colleges</div><div class="v">${num(list.length)}</div></li><li class="fact"><div class="k">Public</div><div class="v">${num(pub)}</div><div class="n">${num(list.length - pub)} private</div></li><li class="fact"><div class="k">Four-year</div><div class="v">${num(four)}</div><div class="n">${num(two)} two-year</div></li><li class="fact"><div class="k">Online programs</div><div class="v">${num(online)}</div><div class="n">Report at least one fully online program</div></li></ul>
${topMajors.length ? `<p>Widely offered majors in ${esc(name)}: ${topMajors.map(([m, k]) => `<a href="${href(`${STEP_PATHS[3]}?state=${s}&major=${m.slug}`)}">${esc(m.name)}</a> (${k})`).join(', ')}.</p>` : ''}
<div class="table-wrap"><table data-sortable class="college-table"><caption class="vh">Colleges and universities in ${esc(name)}</caption><thead><tr><th scope="col" data-sort="text">College</th><th scope="col" data-sort="text">City</th><th scope="col" data-sort="text">Type</th><th scope="col" data-sort="text">Level</th><th scope="col" data-sort="text">Online programs</th></tr></thead><tbody>${list.map((i) => `<tr><td>${i.web ? `<a href="${esc(i.web)}" rel="nofollow noopener external">${esc(i.name)}</a>` : esc(i.name)}</td><td>${esc(i.city)}</td><td>${esc(CONTROL[i.control] || '')}</td><td>${esc(LEVEL[i.level] || '')}</td><td>${i.online ? 'Yes' : 'No'}</td></tr>`).join('')}</tbody></table></div>
<p class="small muted">Source: ${esc(colleges.meta.source || '')}, ${esc(colleges.meta.directory || '')}. Links go to each school’s official website as reported to IPEDS. “Online programs” means the school reported at least one program offered entirely by distance education.</p>
${faqs(fq, `Colleges in ${name}: frequently asked questions`)}
${finderNote()}
<p><a href="${href(STEP_PATHS[3])}">All states</a> · <a href="${href('/college-majors/')}">Explore college majors</a> · <a href="${href(FINDER)}">College &amp; Career Finder</a></p>
</div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Directory', name: `Colleges in ${name}`,
      title: fitTitle(`Colleges and Universities in ${name} (${list.length})`),
      desc: clamp(`All ${list.length} degree-granting colleges and universities in ${name}: ${pub} public, ${list.length - pub} private, ${online} with online programs. Official U.S. Department of Education data.`),
      schema: [{ '@type': 'ItemList', name: `Colleges and universities in ${name}`, numberOfItems: list.length, itemListElement: list.slice(0, 100).map((i, k) => ({ '@type': 'ListItem', position: k + 1, item: { '@type': 'CollegeOrUniversity', name: i.name, ...(i.web ? { url: i.web } : {}), address: { '@type': 'PostalAddress', addressLocality: i.city, addressRegion: i.state, postalCode: i.zip, addressCountry: 'US' } } })) }, faqSchema(fq, path)]
    });
  }

  // ---------- Step 5: majors (hub, field pages, one page per major) ----------
  {
    const path = STEP_PATHS[4];
    const crumbs = [['Home', '/'], ['College majors', path]];
    const most = majors.map((m) => [m, counts[m.slug].total]).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const list = [
      Q('How do I choose a college major?', 'Start with what you enjoy and are good at, then look at the careers each major can lead to, the courses you would take and the skills you would build. Compare two or three majors side by side, talk to people working in those careers, and remember that many majors lead to more than one career.'),
      Q('What does a college major include?', 'A major is a set of required and elective courses in one field, usually a third to a half of a bachelor’s degree, plus general education courses. Many majors also include labs, projects, internships, clinical work or a capstone.'),
      Q('How many college majors are there?', `Colleges offer hundreds of majors. The U.S. Department of Education classifies more than 2,000 instructional programs. This guide covers ${majors.length} common majors in ${majorFields.length} fields and shows how many colleges report awarding each one.`),
      Q('Which majors are offered at the most colleges?', `Among the majors in this guide: ${listJoin(most.map(([m, k]) => `${m.name} (${num(k)} colleges)`))}.`),
      Q('When do you have to declare a major?', 'Many four-year colleges ask students to declare a major by the end of the second year, though some programs, such as nursing or engineering, expect you to start earlier. Check your college’s rules.'),
      Q('Can I change my major?', 'Yes. Many students change majors, especially in the first two years. Changing later can add time to your degree, so explore early with intro courses, minors and short career training.'),
      Q('What is the difference between a major and a minor?', 'A major is your main field of study and makes up a large share of your courses. A minor is a smaller set of courses in a second subject that adds skills or knowledge to your major.'),
      Q('Can I have two majors?', 'Many colleges allow a double major if you complete the requirements for both. It usually takes more courses, so plan early with an advisor.'),
      Q('Does my major determine my career?', 'Not completely. Some careers require a specific degree and license, while many accept several majors plus experience and practical skills.'),
      Q('What if I am undecided about my major?', 'That is common. Take introductory courses in a few fields, use the College & Career Finder to compare majors, and talk with advisors and people working in careers that interest you.'),
      Q('Do I need a major to start building career skills?', 'No. You can take short, practical career training at any time, whether you are in high school, deciding on a major or already working.')
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College & Career Finder · Step 5', h1: 'Explore College Majors and Where They Lead', lead: `Compare ${majors.length} college majors in ${majorFields.length} fields: what each major includes, the skills you build, the careers it can lead to, and the minors that complement it.`, meta: false })}
${mount(4)}
<div class="wrap" style="padding-top:20px;padding-bottom:20px">
<h2 id="all-majors">All college majors by field</h2>
${majorFields.map((f) => `<section class="major-field" id="${f.slug}"><h3>${icon(f.icon)} <a href="${href(fieldPath(f))}">${esc(f.name)} majors</a></h3><ul class="link-cols">${majors.filter((m) => m.field === f.slug).map((m) => `<li><a href="${href(majorPath(m))}">${esc(m.name)}</a></li>`).join('')}</ul></section>`).join('')}
<p><a href="${href('/college-majors-and-career-paths/')}">College majors and the career paths they lead to</a></p>
${faqs(list)}
${finderNote()}
</div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'College majors', scripts: stepScripts(4),
      keywords: 'college major finder, find a college major, explore college majors, list of college majors, what major should I choose',
      title: fitTitle(`College Major Finder: Explore ${majors.length} Majors & Careers`),
      desc: clamp(`Explore ${majors.length} college majors in ${majorFields.length} fields. See what each major includes, skills you build, careers it leads to, suggested minors and colleges that offer it.`),
      schema: [{ '@type': 'ItemList', name: 'College majors', itemListElement: majors.map((m, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(majorPath(m)), name: m.name })) }, faqSchema(list, path)]
    });
  }
  for (const f of majorFields) {
    const ms = majors.filter((m) => m.field === f.slug);
    const path = fieldPath(f);
    const crumbs = [['Home', '/'], ['College majors', STEP_PATHS[4]], [`${f.name} majors`, path]];
    const top = rec({ majors: ms.map((m) => m.slug) }).courses.slice(0, 6);
    const low = f.name.toLowerCase();
    const most = [...ms].sort((a, b) => counts[b.slug].total - counts[a.slug].total);
    const short = ms.filter((m) => /certificate|associate/i.test(m.degrees));
    const list = [
      Q(`What are the best ${low} majors?`, `The best major depends on the career you want. Common choices include ${listJoin(ms.slice(0, 5).map((m) => m.name))}. Compare the careers, coursework and skills for each.`),
      Q(`How many ${low} majors are there?`, `This guide covers ${plural(ms.length, 'major')} in ${low}: ${listJoin(ms.map((m) => m.name))}. Colleges may use different names for similar programs.`),
      Q(`What careers can you get with a ${low} major?`, `Careers connected to these majors include ${careerList([...new Set(ms.flatMap((m) => m.careers.slice(0, 2)))], 8)}. Some require a degree and a license, while others start with a certificate or on-the-job training.`),
      Q(`Which ${low} majors are offered at the most colleges?`, `${listJoin(most.slice(0, 4).map((m) => `${m.name} (${num(counts[m.slug].total)} colleges)`))}, based on IPEDS completions data.`),
      ...(short.length ? [Q(`Which ${low} programs can you start with a certificate or associate degree?`, `${listJoin(short.map((m) => m.name))} are commonly offered as certificates or associate degrees, as well as at higher levels at some schools.`)] : []),
      Q(`What skills do ${low} majors build?`, `Common skills include ${listJoin([...new Set(ms.flatMap((m) => m.skills.slice(0, 2)))].slice(0, 8).map(lc))}.`),
      Q(`Can I study ${low} online?`, `Many colleges that offer these majors also report offering fully online programs. Use the college search with a major selected and “Offers fully online programs”, then confirm with each school which programs are online.`),
      Q(`Can I start training for a ${low} career before I finish college?`, 'Yes. Short online career training can help you learn what a specific job involves and build practical knowledge while you study. It does not replace a degree or a required license.')
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College majors', h1: `${esc(f.name)} Majors and Career Paths`, lead: esc(f.blurb), meta: false })}
<div class="wrap layout"><article class="prose">
${answerBox(`${f.name} majors at a glance`, `${esc(listJoin(ms.map((m) => m.name)))}. Each major below links to what it includes, the skills you build, career paths, suggested minors and how many colleges report awarding it.`)}
<div class="table-wrap"><table><thead><tr><th scope="col">Major</th><th scope="col">Typical degrees</th><th scope="col">Career paths</th><th scope="col" class="num">Colleges</th></tr></thead><tbody>${ms.map((m) => `<tr><td><a href="${href(majorPath(m))}">${esc(m.name)}</a></td><td class="small">${esc(m.degrees)}</td><td class="small">${m.careers.slice(0, 3).map((s) => `<a href="${href(byslug[s].url)}">${esc(byslug[s].title)}</a>`).join(', ')}</td><td class="num">${num(counts[m.slug].total)}</td></tr>`).join('')}</tbody></table></div>
<p class="small muted">Colleges: active, degree-granting U.S. schools that reported awarding at least one degree or certificate in the field, ${esc(colleges.meta.completions || 'IPEDS')}.</p>
${ms.map((m) => `<h2 id="${m.slug}"><a href="${href(majorPath(m))}">${esc(m.name)}</a></h2><p>${esc(m.summary)} ${esc(sentence(m.about.split('. ')[0]))}</p><p class="small"><strong>Skills:</strong> ${esc(listJoin(m.skills.slice(0, 4)))}. <strong>Pairs well with:</strong> ${m.minors.slice(0, 3).map(([s]) => `<a href="${href(minorPath(s))}">${esc(minorBySlug[s].name)}</a>`).join(', ')}.</p>`).join('')}
${top.length ? `<h2 id="training">Practical training for ${esc(low)} careers</h2><p>These Career Education Institute courses connect to the careers above. Each is a short, self-paced online course about one job.</p>${courseGrid(top.map((r) => [r.slug, whyFrom(r)]))}` : ''}
${trainingWhy}
${faqs(list, `${f.name} majors: frequently asked questions`)}
${finderNote()}
</article><aside>${ctaCard({ ...FIND_CTA, link: STEP_PATHS[4] })}${sideLinks('Other fields', majorFields.filter((x) => x.slug !== f.slug).map((x) => [`${x.name} majors`, fieldPath(x)]))}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: `${f.name} majors`,
      title: fitTitle(pick([`${f.name} Majors: Careers, Skills & Minors`, `${f.name} Majors and Career Paths`, `${f.name} Majors`])),
      desc: clamp(`Compare ${ms.length} ${low} college majors: ${listJoin(ms.slice(0, 3).map((m) => m.name))} and more. See what each includes, careers, skills, minors and how many colleges offer it.`),
      schema: [{ '@type': 'ItemList', name: `${f.name} majors`, itemListElement: ms.map((m, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(majorPath(m)), name: m.name })) }, ...(top.length ? [itemList(`Training for ${low} careers`, top.map((r) => r.slug))] : []), faqSchema(list, path)]
    });
  }
  for (const m of majors) {
    const f = fieldBySlug[m.field];
    const path = majorPath(m);
    const crumbs = [['Home', '/'], ['College majors', STEP_PATHS[4]], [`${f.name} majors`, fieldPath(f)], [m.name, path]];
    const cnt = counts[m.slug];
    const top = rec({ majors: [m.slug] }).courses.slice(0, 4);
    const lower = m.name.toLowerCase().replace(/\bai\b/, 'AI');
    const a = /^[AEIOU]/i.test(m.name) ? 'an' : 'a';
    const levels = levelsOf(cnt);
    const hands = [...new Set(HANDS_ON.filter(([re]) => re.test(m.about + ' ' + m.study.join(' '))).map(([, t]) => t))];
    const related = majors.filter((x) => x.field === m.field && x.slug !== m.slug);
    const ts = topStates(m.slug);
    const studyList = listJoin(m.study.map(lc));
    const includes = `${a.charAt(0).toUpperCase() + a.slice(1)} ${m.name} major includes coursework in ${listJoin(m.study.slice(0, 5).map(lc))}${m.study.length > 5 ? ' and more' : ''}. You build skills such as ${listJoin(m.skills.slice(0, 4).map(lc))}.${hands.length ? ` Programs often include ${listJoin(hands)}.` : ''} Typical degrees: ${lc(m.degrees)}.`;
    const list = [
      Q(`What is ${a} ${m.name} major?`, `${describe(`${a.charAt(0).toUpperCase() + a.slice(1)} ${m.name} major`, m.summary)} ${sentence(m.about.split('. ')[0])}`),
      Q(`What does ${a} ${m.name} major include?`, includes),
      Q(`What classes do you take as ${a} ${m.name} major?`, `Typical courses include ${studyList}. Exact course names and requirements vary by college, and most degrees also include general education courses.`),
      Q(`How long does it take to get ${a} ${m.name} degree?`, levels.length ? `It depends on the level. ${m.name} is offered as ${listJoin(levels.map((l) => AWARD[l].toLowerCase()))} awards at U.S. colleges; ${listJoin(levels.map((l) => DURATION[l]))}. Part-time study takes longer.` : `It depends on the program level: ${lc(m.degrees)}.`),
      Q(`What degree levels are available in ${m.name}?`, `${sentence(m.degrees)}${levels.length ? ` In the latest federal data, ${listJoin(levels.map((l) => `${num(cnt.levels[l])} colleges reported ${AWARD[l].toLowerCase()} awards`))}.` : ''}`),
      Q(`What can you do with ${a} ${m.name} degree?`, `Career paths connected to ${lower} include ${careerList(m.careers, 8)}. Some roles need additional training, experience, certification or a license.`),
      Q(`What jobs can you get with ${a} ${m.name} major?`, `Examples include ${listJoin(m.careers.slice(0, 6).filter((s) => byslug[s]).map((s) => `${byslug[s].title.toLowerCase()} (typical training: ${byslug[s].train})`))}.`),
      Q(`What skills do you learn in ${a} ${m.name} major?`, `${m.name} majors build skills such as ${sentence(listJoin(m.skills.map(lc)))}`),
      Q(`What minor goes well with ${m.name}?`, `Good pairings include ${listJoin(m.minors.slice(0, 4).map(([s, why]) => `${minorBySlug[s].name} (${lc(why).replace(/\.$/, '')})`))}.`),
      ...(hands.length ? [Q(`Does ${a} ${m.name} major include hands-on experience?`, `Often, yes. Programs commonly include ${listJoin(hands)}. Ask each college how its program arranges hands-on work.`)] : []),
      Q(`Is ${m.name} a good major?`, `It can be a good fit if you are interested in the work it leads to, such as ${careerList(m.careers, 3)}, and enjoy subjects like ${listJoin(m.study.slice(0, 2).map(lc))}. No major guarantees a job, so compare the coursework, the careers and the education each career requires before deciding.`),
      Q(`Is ${m.name} a hard major?`, `How hard it feels depends on your strengths. Core coursework includes ${listJoin(m.study.slice(0, 3).map(lc))}; if those subjects interest you, the major is likely to feel more manageable. Reviewing a college’s course list and talking to current students helps you judge.`),
      Q(`How many colleges offer ${a} ${m.name} major?`, cnt.total ? `${plural(cnt.total, 'U.S. college')} reported awarding degrees or certificates in this field in the latest federal (IPEDS) data. Programs can have different names at different schools.` : 'Few colleges report awards under this exact program classification. Search related programs in the College & Career Finder.'),
      ...(ts.length ? [Q(`Which states have the most colleges offering ${m.name}?`, `${listJoin(ts.map(([s, k]) => `${STATES[s]} (${num(k)})`))}, based on the colleges that reported awards in this field.`)] : []),
      Q(`Can you study ${m.name} online?`, cnt.total ? `${plural(cnt.online, 'of the colleges', 'of the colleges')} that offer ${lower} also report offering at least one program entirely online, though not necessarily this one. Use the college search with this major and “Offers fully online programs”, then confirm with the school.` : 'Check with individual colleges; online availability varies by program.'),
      ...related.slice(0, 2).map((x) => Q(`What is the difference between ${m.name} and ${x.name}?`, `${describe(m.name, m.summary)} ${describe(x.name, x.summary)} ${m.name} leads to careers such as ${careerList(m.careers, 2)}, while ${x.name} leads to careers such as ${careerList(x.careers, 2)}.`)),
      Q(`Can I take career training while I study ${lower}?`, 'Yes. Short online career training can help you understand a specific job and build practical knowledge alongside your classes. It does not replace your degree or any required license.'),
      Q(`Does Career Education Institute offer ${a} ${m.name} degree?`, `No. Career Education Institute is not a college and does not award degrees. It offers short, non-credit online trainings about jobs connected to ${lower}${top.length ? `, such as ${courseFor(byslug[top[0].slug]).name}` : ''}.`)
    ];
    const lvls = Object.entries(cnt.levels).sort((x, y) => 'CABMD'.indexOf(x[0]) - 'CABMD'.indexOf(y[0]));
    const body = `${pageHero({ crumbs, eyebrow: `${f.name} major`, h1: `${esc(m.name)} Major: What It Includes, Classes and Careers`, lead: esc(m.summary), meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(`${STEP_PATHS[4]}?major=${m.slug}`)}">Explore this major in the finder</a>${top.length ? '<a class="btn" href="#training">Related career training</a>' : ''}</div>` })}
<div class="wrap layout"><article class="prose">
${answerBox(`What does ${a} ${m.name} major include?`, esc(includes))}
<ul class="facts"><li class="fact"><div class="k">Typical degrees</div><div class="v" style="font-size:1rem">${esc(m.degrees)}</div></li><li class="fact"><div class="k">Colleges reporting awards</div><div class="v">${num(cnt.total)}</div><div class="n">U.S. schools, IPEDS</div></li><li class="fact"><div class="k">With online programs</div><div class="v">${num(cnt.online)}</div><div class="n">Schools reporting fully online programs</div></li></ul>
<h2 id="about">About the ${esc(m.name)} major</h2><p>${esc(m.about)}</p>
<h2 id="study">Classes you take</h2><ul class="checks">${m.study.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
<h2 id="skills">Skills you build</h2><ul class="chips skill-chips">${m.skills.map((s) => `<li class="chip">${esc(s)}</li>`).join('')}</ul>
<h2 id="careers">Career paths for ${esc(lower)} majors</h2><p>Careers connected to this major. Each profile explains the work, how to get started and what the job is like day to day.</p>${careerCards(m.careers)}
<h2 id="minors">Minors that pair well with ${esc(m.name)}</h2><div class="table-wrap"><table><thead><tr><th scope="col">Minor</th><th scope="col">How it complements ${esc(m.name)}</th></tr></thead><tbody>${m.minors.map(([s, why]) => `<tr><td><a href="${href(minorPath(s))}">${esc(minorBySlug[s].name)}</a></td><td>${esc(why)}</td></tr>`).join('')}</tbody></table></div>
${top.length ? `<h2 id="training">Start building practical skills now</h2><p>These short online courses from Career Education Institute connect to ${esc(lower)} careers. You can take one alongside your classes or before you choose a program.</p>${courseGrid(top.map((r) => [r.slug, `Connected to careers that ${m.name} majors pursue, such as ${byslug[r.slug].title.toLowerCase()}.`]))}<p><a class="btn" href="${href('/training/')}">Browse all training programs</a></p>` : ''}
<h2 id="colleges">Where to study ${esc(lower)}</h2><p>${cnt.total ? `${plural(cnt.total, 'U.S. college or university', 'U.S. colleges and universities')} reported awarding degrees or certificates in this field (${esc(colleges.meta.completions || 'IPEDS')}).` : 'Few colleges report awards under this exact program classification; similar programs may be listed under related names.'}</p>${lvls.length ? `<ul>${lvls.map(([l, k]) => `<li>${esc(AWARD[l])}: ${plural(k, 'school')}</li>`).join('')}</ul>` : ''}${ts.length ? `<p>States with the most: ${ts.map(([s, k]) => `<a href="${href(`${STEP_PATHS[3]}?state=${s}&major=${m.slug}`)}">${esc(STATES[s])}</a> (${k})`).join(', ')}.</p>` : ''}<p><a class="btn btn-primary" href="${href(`${STEP_PATHS[3]}?major=${m.slug}`)}">Find colleges that offer ${esc(m.name)}</a></p>
${trainingWhy}
${faqs(list, `${m.name} major FAQ`)}
${related.length ? `<h2 id="related">Related majors</h2><ul>${related.map((x) => `<li><a href="${href(majorPath(x))}">${esc(x.name)}</a>: ${esc(x.summary)}</li>`).join('')}</ul>` : ''}
${finderNote()}
</article><aside>${ctaCard({ ...FIND_CTA, text: `Compare ${m.name} with other majors, pick minors and careers, and get a personalized plan.`, link: `${STEP_PATHS[4]}?major=${m.slug}` })}${sideLinks('On this page', [['What it includes', '#about'], ['Classes', '#study'], ['Skills', '#skills'], ['Career paths', '#careers'], ['Suggested minors', '#minors'], ...(top.length ? [['Related training', '#training']] : []), ['Where to study', '#colleges'], ['FAQ', '#faq']])}${sideLinks(`${f.name} majors`, [...related.slice(0, 8).map((x) => [x.name, majorPath(x)]), ['All college majors', STEP_PATHS[4]]])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'College major', name: `${m.name} major`, keywords: `${m.name} major, what does ${a} ${lower} major include, ${lower} classes, ${m.aka}`,
      title: fitTitle(pick([`What Does ${a} ${m.name} Major Include? Classes & Careers`, `${m.name} Major: Classes, Careers & Minors`, `${m.name} Major: Classes & Careers`, `${m.name} Major Guide`, `${m.name} Major`])),
      desc: clamp(`What a ${lower} major includes: classes such as ${listJoin(m.study.slice(0, 3).map(lc))}, skills, careers, minors, degree levels and ${num(cnt.total)} colleges that offer it.`),
      schema: [...(top.length ? [itemList(`Career training related to ${m.name}`, top.map((r) => r.slug))] : []), faqSchema(list, path)]
    });
  }

  // ---------- Step 6: minors (hub and one page per minor) ----------
  {
    const path = STEP_PATHS[5];
    const crumbs = [['Home', '/'], ['College minors', path]];
    const combos = [['business-administration', ['accounting', 'marketing', 'data-analytics']], ['nursing', ['psychology', 'public-health', 'healthcare-administration']], ['computer-science', ['mathematics', 'business', 'cybersecurity']], ['construction-management', ['business', 'project-management', 'occupational-safety']], ['supply-chain-management', ['data-analytics', 'finance', 'management']], ['marketing', ['communications', 'psychology', 'business']]];
    const popular = minors.map((m) => [m, minorPairs(m.slug).length]).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const list = [
      Q('What is a college minor?', 'A minor is a smaller group of courses in a subject outside your major. It appears on your transcript and adds knowledge or skills that complement your main field.'),
      Q('How many classes is a minor?', 'Most minors require about 15 to 24 credit hours, often five to eight courses. Each college sets its own requirements.'),
      Q('Should I get a minor?', 'A minor is optional. It can be worth it when it adds a skill employers want in your field, supports a career you are considering, or lets you explore a second interest. It can also add courses, so check how it fits your degree plan.'),
      Q('What is the best minor to pair with my major?', 'Choose a minor that fills a gap. Technical majors often add business or communication; business majors often add data analytics or a technical field; health and education majors often add psychology or Spanish.'),
      Q('What are the most useful minors?', `Minors that complement many majors include ${listJoin(popular.map(([m]) => m.name))}.`),
      Q('Does a minor matter to employers?', 'A minor can show employers that you have skills beyond your major, especially when it relates to the job. Experience, projects and practical skills usually matter more.'),
      Q('Can I have more than one minor?', 'Many colleges allow two minors, or a minor alongside a double major, if you can fit the courses. Check your college’s rules and plan with an advisor.'),
      Q('Can a minor be in the same field as my major?', 'Usually not in the same subject, and many colleges limit how many courses can count toward both. Choose a minor that adds something new.'),
      Q('When should I declare a minor?', 'Many students add a minor in the second or third year. Declaring earlier makes it easier to fit the courses into your schedule.'),
      Q('What is the difference between a minor and a certificate?', 'A minor is part of a degree and appears on your transcript. A certificate can be earned alongside a degree or on its own, and is often more career-focused.')
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College & Career Finder · Step 6', h1: 'College Minors That Complement Your Major', lead: `Explore ${minors.length} college minors, the majors they pair well with, and how each one can expand your career options.`, meta: false })}
${mount(5)}
<div class="wrap layout"><article class="prose">
${answerBox('How to choose a minor', 'Pick a minor that adds something your major does not: a business minor for technical students, a data or technology minor for business students, psychology or a language for people-facing careers, or safety and project management for construction and industrial careers.')}
<h2 id="combinations">Popular major and minor combinations</h2><div class="table-wrap"><table><thead><tr><th scope="col">Major</th><th scope="col">Suggested minors</th></tr></thead><tbody>${combos.map(([mj, ms]) => `<tr><td><a href="${href(majorPath(mj))}">${esc(majorBySlug[mj].name)}</a></td><td>${ms.map((s) => `<a href="${href(minorPath(s))}">${esc(minorBySlug[s].name)}</a>`).join(', ')}</td></tr>`).join('')}</tbody></table></div>
<h2 id="all-minors">All college minors</h2><ul class="link-cols">${minors.map((m) => `<li><a href="${href(minorPath(m))}">${esc(m.name)}</a></li>`).join('')}</ul>
${faqs(list)}
${finderNote(false)}
</article><aside>${ctaCard({ ...FIND_CTA, link: STEP_PATHS[5] })}${sideLinks('Related', [['College majors', STEP_PATHS[4]], ['Majors and career paths', '/college-majors-and-career-paths/'], ['Skills to learn', STEP_PATHS[7]]])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'College minors', scripts: stepScripts(5),
      keywords: 'college minor finder, best minors, minors for my major, what minor should I choose',
      title: fitTitle('College Minor Finder: Minors That Fit Your Major'),
      desc: clamp(`Find a college minor that complements your major. Compare ${minors.length} minors, popular major and minor combinations, and the careers and skills each minor adds.`),
      schema: [{ '@type': 'ItemList', name: 'College minors', itemListElement: minors.map((m, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(minorPath(m)), name: m.name })) }, faqSchema(list, path)]
    });
  }
  for (const m of minors) {
    const path = minorPath(m);
    const crumbs = [['Home', '/'], ['College minors', STEP_PATHS[5]], [m.name, path]];
    const pairs = minorPairs(m.slug);
    const top = rec({ minors: [m.slug] }).courses.slice(0, 3);
    const a = /^[AEIOU]/i.test(m.name) ? 'an' : 'a';
    const same = majorBySlug[m.slug] || majors.find((x) => x.name === m.name);
    const list = [
      Q(`What is ${a} ${m.name} minor?`, `${describe(`${a.charAt(0).toUpperCase() + a.slice(1)} ${m.name} minor`, m.summary)} ${sentence(m.complements.split('. ')[0])}`),
      Q(`What does ${a} ${m.name} minor include?`, `${a.charAt(0).toUpperCase() + a.slice(1)} ${m.name} minor covers skills such as ${listJoin(m.skills.map(lc))}. Most minors require about 15 to 24 credit hours, often five to eight courses; each college sets its own requirements.`),
      Q(`What majors go well with ${a} ${m.name} minor?`, pairs.length ? `It pairs well with ${listJoin(pairs.slice(0, 8).map((p) => p.major.name))}.` : 'It can complement many majors, especially those that need the skills it adds.'),
      ...pairs.slice(0, 3).map((p) => Q(`Is ${m.name} a good minor for ${p.major.name} majors?`, `It can be. ${p.why}`)),
      Q(`What skills does ${a} ${m.name} minor add?`, `Skills such as ${sentence(listJoin(m.skills.map(lc)))}`),
      Q(`What careers can ${a} ${m.name} minor help with?`, `It can support careers such as ${careerList(m.careers)}, especially combined with a related major.`),
      Q(`Is ${a} ${m.name} minor worth it?`, `It is worth it if it fills a gap in your major or supports the career you want. ${sentence(m.complements.split('. ').slice(-1)[0])}`),
      ...(same ? [Q(`What is the difference between ${a} ${m.name} major and ${a} ${m.name} minor?`, `A ${same.name} major is your main field of study (${lc(same.degrees)}) and prepares you for careers such as ${careerList(same.careers, 3)}. A minor is a smaller set of courses that adds ${lc(m.name)} knowledge to a different major.`)] : []),
      Q(`Can any major add ${a} ${m.name} minor?`, 'At most colleges, students in many majors can add a minor if they meet its prerequisites and can fit the courses. Check your college’s requirements.')
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College minor', h1: `${esc(m.name)} Minor: What It Includes and Best Majors`, lead: esc(m.summary), meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(`${STEP_PATHS[5]}?minor=${m.slug}`)}">Explore this minor in the finder</a></div>` })}
<div class="wrap layout"><article class="prose">
${answerBox(`How ${a} ${m.name} minor complements your major`, esc(m.complements))}
<h2 id="skills">Skills ${esc(a)} ${esc(m.name)} minor adds</h2><ul class="chips skill-chips">${m.skills.map((s) => `<li class="chip">${esc(s)}</li>`).join('')}</ul>
${pairs.length ? `<h2 id="majors">Majors that pair well with ${esc(m.name)}</h2><div class="table-wrap"><table><thead><tr><th scope="col">Major</th><th scope="col">Why it works</th></tr></thead><tbody>${pairs.map((p) => `<tr><td><a href="${href(majorPath(p.major))}">${esc(p.major.name)}</a></td><td>${esc(p.why)}</td></tr>`).join('')}</tbody></table></div>` : ''}
${same ? `<p>Want to study it in depth? See the <a href="${href(majorPath(same))}">${esc(same.name)} major</a>.</p>` : ''}
<h2 id="careers">Careers where ${esc(a)} ${esc(m.name)} minor helps</h2>${careerCards(m.careers, 6)}
${top.length ? `<h2 id="training">Related career training</h2>${courseGrid(top.map((r) => [r.slug, `Builds practical knowledge for careers ${a} ${m.name} minor points toward.`]))}` : ''}
${faqs(list, `${m.name} minor FAQ`)}
${finderNote(false)}
</article><aside>${ctaCard({ ...FIND_CTA, link: `${STEP_PATHS[5]}?minor=${m.slug}` })}${sideLinks('Other minors', [...minors.filter((x) => x.slug !== m.slug).slice(0, 10).map((x) => [x.name, minorPath(x)]), ['All minors', STEP_PATHS[5]]])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'College minor', name: `${m.name} minor`, keywords: `${m.name} minor, what does ${a} ${m.name.toLowerCase()} minor include, ${m.aka}`,
      title: fitTitle(pick([`${m.name} Minor: What It Includes & Best Majors`, `${m.name} Minor: Skills & Best Majors`, `${m.name} Minor`])),
      desc: clamp(`What ${a} ${m.name.toLowerCase()} minor includes, the skills it adds, how it complements majors such as ${listJoin(pairs.slice(0, 3).map((p) => p.major.name)) || 'yours'}, and related careers.`),
      schema: [...(top.length ? [itemList(`Training related to ${a} ${m.name} minor`, top.map((r) => r.slug))] : []), faqSchema(list, path)]
    });
  }

  // ---------- Step 7: career finder ----------
  {
    const path = STEP_PATHS[6];
    const crumbs = [['Home', '/'], ['Career finder', path]];
    const fast = careers.filter((c) => c.months <= 3).sort((a, b) => b.l.annualOpenings - a.l.annualOpenings).slice(0, 6).map((c) => c.slug);
    const noDeg = careers.filter((c) => c.eduLevel < 4).sort((a, b) => b.l.annualOpenings - a.l.annualOpenings).slice(0, 6).map((c) => c.slug);
    const list = [
      Q('How do I find a career that fits me?', 'Start with your interests, strengths and values, then explore careers that use them. Read what each job involves day to day, check the education it requires, and try it out through job shadowing, part-time work or short training before you commit.'),
      Q('What is the difference between a career and a job?', 'A job is a specific position you hold. A career is the longer path of related jobs, skills and experience you build over time.'),
      Q('How many careers can I explore here?', `${countLabel(careers.length)} career profiles in ${categories.length} fields, each covering what the work involves, a day in the life, how to become one, skills and pay data from the U.S. Bureau of Labor Statistics.`),
      Q('What careers do not require a four-year degree?', `Many do, including ${careerList(noDeg)}. They typically start with a high school diploma, a certificate, an associate degree, an apprenticeship or on-the-job training.`),
      Q('What careers can I train for quickly?', `Some careers start with training measured in weeks or a few months, such as ${careerList(fast)}. Requirements vary by state and employer.`),
      Q('Can I choose a career before choosing a major?', 'Yes. Many people pick a career goal first and then choose the major, minor or training that leads there. Each career profile lists the typical education.'),
      Q('What if I am interested in more than one career?', 'Select several. The College & Career Finder looks for majors, skills and training that connect them, and many careers share skills you can build once.'),
      Q('How do majors connect to careers?', 'Some careers require a specific major and license, such as nursing. Others accept many majors plus experience and skills. Each major page lists the career paths connected to it.'),
      Q('Can I change careers later?', 'Yes. Many people change careers several times. Transferable skills, short training and certificates make it easier to move into a new field.'),
      Q('Are the career suggestions a guarantee of a job?', 'No. Career information is general. Pay, requirements and opportunities vary by employer and location, and no career outcome is guaranteed.')
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College & Career Finder · Step 7', h1: 'Career Finder: Discover Careers That Fit You', lead: `Search ${countLabel(careers.length)} careers, explore careers by industry, or see careers suggested from your interests and majors. Every career shows what the work involves, the education it requires and related training.`, meta: false })}
${mount(6)}
<div class="wrap layout"><article class="prose">
<h2 id="industries">Careers by industry</h2>
${linkCards(categories.map((c) => [c.name, `/careers/${c.slug}/`, c.blurb, c.slug]))}
<p><a href="${href('/careers/')}">All ${countLabel(careers.length)} careers</a> · <a href="${href('/college-majors-and-career-paths/')}">Majors and career paths</a> · <a href="${href('/quizzes/career-match/')}">Career Match Quiz</a></p>
${faqs(list)}
${finderNote(false)}
</article><aside>${ctaCard({ title: 'Prefer a quick quiz?', text: 'The Career Match Quiz suggests careers from 24 questions about what you enjoy.', btn: 'Take the quiz', link: '/quizzes/career-match/' })}${sideLinks('Related', [['How to choose a career', '/guides/how-to-choose-a-career/'], ['How to change careers', '/guides/how-to-change-careers/'], ['Career interests', STEP_PATHS[2]], ['Salary guide', '/salary-guide/']])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Tool', name: 'Career finder', scripts: stepScripts(6),
      keywords: 'career finder, find a career that fits me, career search, careers by industry, what career is right for me',
      title: fitTitle('Career Finder: Discover Careers That Fit You'),
      desc: clamp(`Find a career that fits you: search ${countLabel(careers.length)} careers, explore by industry, or get suggestions from your interests and major, with education requirements and related training.`),
      schema: [faqSchema(list, path)]
    });
  }

  // ---------- Step 8: skills (hub and one page per skill) ----------
  {
    const path = STEP_PATHS[7];
    const crumbs = [['Home', '/'], ['Skills to learn', path]];
    const list = [
      Q('What skills should I learn for my career?', 'Start with the skills listed in job descriptions for the career you want, then add transferable skills such as communication, problem solving and computer skills. Industry-specific knowledge, such as a field’s vocabulary, tools and safety rules, helps you stand out.'),
      Q('What skills do employers look for?', 'Employers consistently ask for communication, teamwork, problem solving, reliability and computer skills, plus the technical skills of the specific job.'),
      Q('What is the difference between hard skills and soft skills?', 'Hard skills are specific, teachable abilities such as using software, operating equipment or following safety procedures. Soft skills, such as communication and leadership, shape how you work with people and apply to almost every job.'),
      Q('What are transferable skills?', 'Skills you can carry from one job or field to another, such as communication, problem solving, customer service and project management. They matter most when changing careers.'),
      Q('How can I build career skills quickly?', 'Short, focused training, practice projects, part-time work, volunteering and job shadowing all help. Online job-title training can teach a role’s basics in a few hours.'),
      Q('Can I learn career skills online?', 'Yes. Many skills can be started online, including computer skills, workplace safety knowledge and the basics of a specific job. Hands-on skills also need supervised practice.'),
      Q('How do I show skills on my resume?', 'List specific examples: what you did, the tools you used and the result. Training certificates and projects help show skills you are still building.'),
      Q('Which skills are in demand for the future?', 'Computer and data skills, understanding of artificial intelligence tools, communication, problem solving and the technical skills of growing fields such as healthcare and the skilled trades are widely sought.')
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'College & Career Finder · Step 8', h1: 'Skills to Learn for Different Careers', lead: `${skills.length} skills employers look for, why each one matters, how to start building it and which careers rely on it.`, meta: false })}
${mount(7)}
<div class="wrap" style="padding-top:20px;padding-bottom:20px">
<h2 id="all-skills">All skills</h2>
${linkCards(skills.map((s) => [s.name, skillPath(s), s.blurb, s.icon]))}
${faqs(list)}
</div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'Skills to learn', scripts: stepScripts(7),
      keywords: 'skills to learn, career skills, skills for different careers, skills employers want, job skills to learn',
      title: fitTitle('Skills to Learn for Different Careers'),
      desc: clamp(`Which skills should you learn for your career? Explore ${skills.length} skills employers want, from communication to workplace safety and AI, with tips and related careers.`),
      schema: [faqSchema(list, path)]
    });
  }
  for (const s of skills) {
    const path = skillPath(s);
    const label = (/skills$/i.test(s.name) ? s.name : `${s.name} skills`).replace(/^./, (c) => c.toUpperCase());
    const lowerLabel = label.toLowerCase();
    const crumbs = [['Home', '/'], ['Skills to learn', STEP_PATHS[7]], [s.name, path]];
    const r = rec({ skills: [s.slug] });
    const top = r.courses.slice(0, 6);
    const matched = data.skills[s.slug].matched;
    const careersFor = (s.all ? [] : [...s.careers, ...matched.filter((x) => !s.careers.includes(x)).sort((a, b) => byslug[b].l.annualOpenings - byslug[a].l.annualOpenings)]).slice(0, 8);
    const buildMajors = SKILL_IN_MAJOR[s.slug] ? majors.filter((m) => m.skills.some((k) => SKILL_IN_MAJOR[s.slug].test(k))).slice(0, 6) : [];
    const list = [
      Q(`Why are ${lowerLabel} important?`, s.why),
      Q(`How can I improve my ${lowerLabel}?`, sentence(s.tips.join('. '))),
      Q(`Is ${s.name.toLowerCase()} a hard skill or a soft skill?`, SOFT.has(s.slug) ? `${s.name} is usually considered a soft skill: it shapes how you work with people and apply your knowledge, and it transfers to almost every job.` : `${s.name} is usually considered a hard or technical skill: it can be taught, practiced and shown through specific tasks, tools or certificates.`),
      ...(careersFor.length ? [Q(`Which careers need ${lowerLabel}?`, `Careers that rely on them include ${careerList(careersFor, 8)}.`)] : []),
      ...(buildMajors.length ? [Q(`Which college majors build ${lowerLabel}?`, `Majors that list them among their core skills include ${listJoin(buildMajors.map((m) => m.name))}.`)] : []),
      Q(`How do I show ${lowerLabel} on a resume?`, 'Give specific examples: a situation, what you did, the tools or methods you used and the result. Add related training, certificates or projects.'),
      Q(`How long does it take to build ${lowerLabel}?`, 'You can learn the basics in weeks with focused study and practice. Strong skills come from using them regularly over months and years, on the job, in classes or in projects.'),
      Q(`Can I learn ${lowerLabel} online?`, `Yes, you can start online.${top.length ? ` Career Education Institute trainings that build them include ${listJoin(top.slice(0, 3).map((x) => courseFor(byslug[x.slug]).name))}.` : ''} Practice with real tasks makes them stick.`)
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'Skills to learn', h1: `${esc(titleCase(label))} for Your Career`, lead: esc(s.blurb), meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href(STEP_PATHS[7])}">Choose skills in the finder</a></div>` })}
<div class="wrap layout"><article class="prose">
${answerBox(`Why ${s.name.toLowerCase()} matters`, esc(s.why))}
<h2 id="how">How to start building it</h2><ul class="checks">${s.tips.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
${s.all ? `<h2 id="careers">Every career has its own knowledge</h2><p>Each field has its own vocabulary, tools, regulations and daily routines. Every Career Education Institute training is built around one job title and teaches exactly this: what the role involves, its key terms, step-by-step tasks, tools and safety rules. <a href="${href('/training/')}">Browse trainings by job title</a> or <a href="${href('/careers/')}">explore careers</a>.</p>` : `<h2 id="careers">Careers that rely on ${esc(s.name.toLowerCase())}</h2>${careerCards(careersFor, 8)}`}
${buildMajors.length ? `<h2 id="majors">Majors that build ${esc(lowerLabel)}</h2><ul>${buildMajors.map((m) => `<li><a href="${href(majorPath(m))}">${esc(m.name)}</a></li>`).join('')}</ul>` : ''}
${top.length ? `<h2 id="training">Training that builds ${esc(s.name.toLowerCase())}</h2>${courseGrid(top.map((x) => [x.slug, `${s.name} is central to this job.`]))}` : ''}
${faqs(list, `${label}: frequently asked questions`)}
${finderNote(false)}
</article><aside>${ctaCard({ ...FIND_CTA, link: STEP_PATHS[7] })}${sideLinks('Other skills', skills.filter((x) => x.slug !== s.slug).map((x) => [x.name, skillPath(x)]))}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: label,
      title: fitTitle(pick([`${label.replace(/\b\w/g, (c) => c.toUpperCase())}: Why They Matter & How to Learn`, `${label.replace(/\b\w/g, (c) => c.toUpperCase())}: How to Build Them`])),
      desc: clamp(`${s.blurb} Learn why ${lowerLabel} matter, how to build them and which careers and trainings rely on them.`),
      schema: [...(top.length ? [itemList(`Training that builds ${s.name.toLowerCase()}`, top.map((x) => x.slug))] : []), faqSchema(list, path)]
    });
  }

  // ---------- Step 9: results (personal, so not indexed) ----------
  {
    const path = STEP_PATHS[8];
    const crumbs = [['Home', '/'], ['College & Career Finder', FINDER], ['Your results', path]];
    pages.push({
      path, crumbs, og: OG, noindex: true, scripts: stepScripts(8),
      title: 'Your College & Career Finder Results | Career Education Institute', desc: 'Your personalized College & Career Finder results: academic interests, career paths, skills to develop and recommended training.',
      body: `${pageHero({ crumbs, eyebrow: 'College & Career Finder · Step 9', h1: 'Your College & Career Finder Results', lead: 'Your academic interests, career paths, skills to develop and recommended training, based on your answers.', meta: false })}${mount(8)}<div class="wrap" style="padding-bottom:40px">${finderNote()}</div>`
    });
  }

  // ---------- Majors and career paths ----------
  {
    const path = '/college-majors-and-career-paths/';
    const crumbs = [['Home', '/'], ['College majors', STEP_PATHS[4]], ['Majors and career paths', path]];
    const list = [
      Q('What is the best college major for my career?', 'Work backward from the career: look at the education it typically requires, then compare the majors that lead there. Some careers require a specific degree and license, while others accept many majors plus practical skills.'),
      Q('Does my major decide my career?', 'Not completely. Many careers accept several majors, and people often change direction. Skills, experience and additional training can open careers outside your major.'),
      Q('Which majors lead to careers without a four-year degree?', 'Many technical and healthcare programs, such as medical assisting, welding technology, HVAC technology and emergency medical services, are offered as certificates or associate degrees.'),
      Q('Which majors lead to healthcare careers?', `Healthcare majors include ${listJoin(majors.filter((m) => m.field === 'healthcare').slice(0, 6).map((m) => m.name))}.`),
      Q('Which majors lead to technology careers?', `Technology majors include ${listJoin(majors.filter((m) => m.field === 'technology').map((m) => m.name))}.`),
      Q('Which majors lead to business careers?', `Business majors include ${listJoin(majors.filter((m) => m.field === 'business').slice(0, 7).map((m) => m.name))}.`),
      Q('Can I get a job outside my major?', 'Yes. Many graduates work in fields different from their major, especially when they build relevant skills through minors, internships, projects and job-specific training.')
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'Majors and careers', h1: 'College Majors and Career Paths', lead: `Where ${majors.length} college majors can lead: the career paths connected to each one, and practical training you can take along the way.`, meta: false })}
<div class="wrap" style="padding-top:30px;padding-bottom:20px">
${answerBox('How to use this list', 'Find your major, or a major you are considering, to see careers that commonly connect to it. Select a career to read what the work involves, or a training to start building skills for it now. Many careers are open to more than one major.')}
${majorFields.map((f) => `<h2 id="${f.slug}">${esc(f.name)}</h2><div class="table-wrap"><table><thead><tr><th scope="col">Major</th><th scope="col">Career paths</th><th scope="col">Related training</th></tr></thead><tbody>${majors.filter((m) => m.field === f.slug).map((m) => { const t = m.careers[0]; return `<tr><td><a href="${href(majorPath(m))}">${esc(m.name)}</a></td><td class="small">${m.careers.slice(0, 4).map((s) => `<a href="${href(byslug[s].url)}">${esc(byslug[s].title)}</a>`).join(', ')}</td><td class="small"><a href="${href(courseFor(byslug[t]).url)}">${esc(courseFor(byslug[t]).name)}</a></td></tr>`; }).join('')}</tbody></table></div>`).join('')}
${faqs(list)}
${finderNote(false)}
</div>
${band('Want suggestions for you?', 'Tell the College & Career Finder your interests and it will suggest majors, careers and skills.', 'Start the finder', FINDER, 'All careers', '/careers/')}`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'College majors and career paths',
      keywords: 'college majors and career paths, best college majors for careers, what can I do with my major, majors and careers list',
      title: fitTitle('College Majors and Career Paths: Where Majors Lead'),
      desc: clamp(`See the career paths connected to ${majors.length} college majors, from nursing and business to cybersecurity and construction management, plus training for each.`),
      schema: [faqSchema(list, path)]
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
    const list = [
      Q('What are the options after high school?', 'The main options are a four-year college, a community or technical college, an apprenticeship, short-term training, starting work with on-the-job training, and military service. Many people combine them, such as working while taking classes.'),
      Q('Is college the only path to a good career?', 'No. Many careers start with a certificate, an associate degree or an apprenticeship. Others require a bachelor’s degree or more. The right path depends on the career you want.'),
      Q('What if I do not know what I want to do?', 'That is common. Explore with career quizzes, job shadowing, part-time work and intro courses. Community college and short training are low-cost ways to try a field.'),
      Q('Is community college a good option after high school?', 'For many students, yes. Community colleges offer certificates and associate degrees, often at lower cost, and credits can often transfer to four-year colleges. Check transfer agreements with the schools you are considering.'),
      Q('What is an apprenticeship?', 'A paid job combined with classroom instruction, usually lasting two to five years, that leads to a skilled occupation such as electrician or plumber.'),
      Q('Can I work and go to school at the same time?', 'Yes. Many students work part time, and many community colleges and online programs offer evening, weekend and online classes.'),
      Q('What are good jobs right after high school?', 'Entry-level jobs in healthcare support, warehousing, customer service, retail and the trades often train on the job and can lead to further training and promotion.'),
      Q('Should I take a gap year?', 'A planned gap year for work, service or exploration can help some students choose a direction. Check how it affects college admission offers and financial aid before deciding.')
    ];
    const body = `${pageHero({ crumbs, eyebrow: 'For students', h1: 'Career Options After High School', lead: 'College, community college, apprenticeships, short-term training, work and the military: how each path works and how to choose.', meta: false })}
<div class="wrap layout"><article class="prose">${answerBox('Quick answer', 'After high school you can attend a four-year college, start at a community or technical college, join an apprenticeship, earn a short-term certificate, go straight to work with on-the-job training, or enlist in the military. Choose based on the career you want, the education it requires, and the time and cost you can manage.')}${html}${faqs(list)}${finderNote(false)}</article><aside>${toc.length > 2 ? `<nav class="toc" aria-label="On this page"><h2>On this page</h2><ol>${toc.map((t) => `<li><a href="#${t.id}">${esc(t.text)}</a></li>`).join('')}</ol></nav>` : ''}${ctaCard(FIND_CTA)}${sideLinks('Related', [['College vs. trade school', '/guides/college-vs-trade-school/'], ['How to choose a career', '/guides/how-to-choose-a-career/'], ['College majors', STEP_PATHS[4]], ['For students', '/students/']])}</aside></div>`;
    pages.push({
      path, crumbs, body, og: OG, kind: 'Guide', name: 'Career options after high school', type: 'article',
      keywords: 'career options after high school, what to do after high school, alternatives to college, jobs after high school',
      title: fitTitle('Career Options After High School: Your Paths'),
      desc: 'College, community college, apprenticeships, short-term training, work or the military: compare career options after high school and how to choose.',
      schema: [faqSchema(list, path)]
    });
  }

  return pages;
}
