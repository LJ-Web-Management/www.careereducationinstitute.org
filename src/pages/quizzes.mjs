import { esc, href, abs, money, clamp, fitTitle, countLabel } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, ctaCard, sideLinks, answerBox, band } from '../lib/layout.mjs';

const SCALE = ['Strongly dislike', 'Dislike', 'Not sure', 'Like', 'Strongly like'];
const RIASEC_NAMES = { R: 'Realistic (hands-on doer)', I: 'Investigative (problem solver)', A: 'Artistic (creator)', S: 'Social (helper)', E: 'Enterprising (persuader/leader)', C: 'Conventional (organizer)' };

const interest = [
  ['R', 'Fixing or building things with tools'], ['I', 'Figuring out why something isn’t working'], ['A', 'Designing, writing or creating things'], ['S', 'Helping people who are sick, stressed or struggling'], ['E', 'Taking charge of a group or a crisis'], ['C', 'Keeping records, schedules or files organized'],
  ['R', 'Working outdoors or on a job site'], ['I', 'Analyzing data or evidence to answer a question'], ['A', 'Coming up with new ideas or better ways to do things'], ['S', 'Teaching or explaining things to others'], ['E', 'Persuading or negotiating with people'], ['C', 'Following clear procedures and checklists'],
  ['R', 'Operating machines, vehicles or heavy equipment'], ['I', 'Learning how systems work: the body, a network, an engine'], ['A', 'Working on projects without a fixed routine'], ['S', 'Working closely as part of a team'], ['E', 'Setting goals and competing to hit them'], ['C', 'Working with numbers and details accurately'],
  ['R', 'Using my hands more than a keyboard'], ['I', 'Solving puzzles and technical problems'], ['A', 'Making things look good: visuals, layouts, spaces'], ['S', 'Making a direct difference in someone’s day'], ['E', 'Making decisions under pressure'], ['C', 'Using software to track and manage information']
].map(([key, q]) => ({ q, key, scale: true }));

const prefs = [
  { q: 'How much more education or training are you willing to do?', eduQ: true, options: [['A few weeks to a few months', { maxEdu: 2, 't_fast-track': 2 }], ['Up to a year or two', { maxEdu: 3 }], ['Two to four years', { maxEdu: 4 }], ['Whatever it takes for the right career', { maxEdu: 4 }]] },
  { q: 'Where would you rather spend most of your workday?', options: [['Indoors: clinic, office, shop or plant', { t_indoors: 1 }], ['Outdoors or on job sites', { t_outdoors: 1.5 }], ['A mix of both', { t_outdoors: 0.5, t_travel: 0.5 }], ['At a computer, possibly remote', { 't_remote-friendly': 1.5, t_desk: 1 }]] },
  { q: 'What pace suits you best?', options: [['Fast-paced. I like constant action', { 't_fast-paced': 1 }], ['Steady and predictable', { t_steady: 1 }], ['No strong preference', {}]] },
  { q: 'What matters most in your next job?', options: [['Higher pay', { 't_high-pay': 1.5 }], ['Helping people', { t_helping: 1.5 }], ['Plenty of job openings and security', { 't_in-demand': 1.5 }], ['Starting work quickly', { 't_fast-track': 1.5 }]] }
];

// o and g (annual openings, projected growth) feed a small job-outlook adjustment in quiz.js so that, among careers that fit
// about equally well, ones with more openings rank first instead of the tie going to whichever is listed first.
const careerPayload = (cs) => cs.map((c) => ({ n: c.title, u: href(c.url), r: c.riasec, t: c.traits, e: c.eduLevel, p: money(c.l.wages.median), tr: c.train, o: c.l.annualOpenings, g: c.l.growthPct }));
// Quizzes that score every career load this shared file (written by the build) instead of embedding it.
export const quizCareerData = (careers) => careerPayload(careers);
const QUIZ_CAREERS = href('/assets/quiz-careers.json');

function renderQuestions(qs) {
  return qs.map((q, i) => `<fieldset><legend><span class="qn">Question ${i + 1} of ${qs.length}</span>${esc(q.q)}</legend>${q.scale ? `<div class="scale">${SCALE.map((l, v) => `<label class="opt"><input type="radio" name="q${i}" value="${v + 1}" required><span>${l}</span></label>`).join('')}</div>` : `<div class="opts">${q.options.map(([l], v) => `<label class="opt"><input type="radio" name="q${i}" value="${v}" required><span>${esc(l)}</span></label>`).join('')}</div>`}</fieldset>`).join('');
}

function quizPage({ path, crumbs, eyebrow, h1, lead, intro, data, questions, after = '', title, desc, faqs = [], aside }) {
  const clean = { ...data, questions: questions.map((q) => (q.scale ? { scale: true, key: q.key } : { eduQ: !!q.eduQ, options: q.options.map(([, w]) => ({ w })) })) };
  const body = `${pageHero({ crumbs, eyebrow, h1, lead })}<div class="wrap layout"><div class="prose">${answerBox('How it works', intro)}
<form class="quiz" data-quiz novalidate>${renderQuestions(questions)}<div class="quiz-bar"><div class="progress" aria-hidden="true"><i></i></div><button class="btn btn-primary" type="submit">See my results</button></div></form>
<section class="results" aria-live="polite" tabindex="-1"></section><script type="application/json" id="quiz-data">${JSON.stringify(clean)}</script>${after}${faqs.length ? faqBlock(faqs) : ''}</div>
<aside>${aside || ctaCard({ title: 'Turn results into a plan', text: 'Every career in our directory has a matching online training so you can learn the job before you commit.', btn: 'Browse trainings', link: '/training/' })}${sideLinks('More quizzes', [['Career Match Quiz', '/quizzes/career-match/'], ['College or Trade School?', '/quizzes/college-or-trade-school/'], ['Career Change Readiness', '/quizzes/career-change-readiness/'], ['Work Style Quiz', '/quizzes/work-style/'], ['All quizzes', '/quizzes/']].filter(([, l]) => l !== path))}</aside></div>`;
  return { path, crumbs, body, title, desc, og: '/og/quiz.png', kind: 'Quiz', name: h1, scripts: ['quiz'], schema: faqs.length ? [faqSchema(faqs, path)] : [] };
}

export function quizPages(ctx) {
  const { careers, categories } = ctx;
  const pages = [];
  const hub = ['Quizzes', '/quizzes/'];

  // Career Match
  {
    const path = '/quizzes/career-match/';
    const faqs = [['What is the Career Match Quiz based on?', 'It uses the Holland Code (RIASEC) model of career interests (Realistic, Investigative, Artistic, Social, Enterprising and Conventional) which is also used by the U.S. Department of Labor’s O*NET system. We combine your interest scores with your preferences for training time, work setting, pace and priorities.'], ['Is the quiz free? Do I need to sign up?', 'Yes, it’s completely free with no sign-up. Your answers stay in your browser and are not saved or sent anywhere.'], ['How accurate is it?', 'It’s a starting point, not a verdict. Use your matches to explore careers in detail, read a day in the life and talk to people who do the work.']];
    pages.push(quizPage({ path, crumbs: [['Home', '/'], hub, ['Career Match Quiz', path]], eyebrow: 'Free · 28 questions · About 4 minutes', h1: 'Career Match Quiz: What Career Is Right for Me?', lead: `Rate 24 activities and answer 4 quick preference questions. We’ll match you with careers from our ${countLabel(careers.length)} profiles and show your interest code.`, intro: 'For each activity, choose how much you would enjoy doing it as part of your job: don’t worry about whether you’re good at it yet. Then answer four questions about training time, work setting, pace and priorities. Results appear instantly; nothing is stored.',
      data: { type: 'careers', careersUrl: QUIZ_CAREERS, top: 6, riasecNames: RIASEC_NAMES, resultTitle: 'Your best-matching careers', resultText: 'Ranked by how well each career’s typical activities and conditions line up with your answers.' }, questions: [...interest, ...prefs],
      after: `<h2 id="riasec">About the six interest types</h2><ul>${Object.entries(RIASEC_NAMES).map(([k, v]) => `<li><strong>${k}: ${esc(v)}</strong></li>`).join('')}</ul><p>Most people are a blend of two or three types. Careers are matched on their dominant types and work conditions.</p>`,
      title: fitTitle('Career Match Quiz: What Career Is Right for Me?'), desc: clamp(`Free career quiz: rate 24 activities and get matched with careers that fit your interests, training time and priorities, with pay data and training for each. No sign-up.`), faqs }));
  }

  // Category quizzes
  for (const cat of categories) {
    const cs = careers.filter((c) => c.cat === cat.slug);
    const path = `/quizzes/which-${cat.slug}-career-is-right-for-me/`;
    const h1 = `Which ${cat.name} Career Is Right for Me?`;
    pages.push(quizPage({ path, crumbs: [['Home', '/'], hub, [`${cat.name} quiz`, path]], eyebrow: `${cat.name} · Free quiz`, h1, lead: `Match your interests to ${cs.length} ${cat.noun} careers, including ${cs.slice(0, 4).map((c) => c.lower).join(', ')} and more.`, intro: `Rate how much you’d enjoy each activity, then answer four preference questions. We’ll rank the ${cs.length} ${cat.noun} careers we profile by how well they fit you.`,
      data: { type: 'careers', careers: careerPayload(cs), top: Math.min(4, cs.length), riasecNames: RIASEC_NAMES, resultTitle: `Your best ${cat.noun} matches`, resultText: `Ranked among ${cs.length} ${cat.noun} careers.` }, questions: [...interest.slice(0, 18), ...prefs],
      after: `<h2 id="careers">Careers included, with fit quizzes and practice tests</h2><ul>${cs.map((c) => `<li><a href="${href(c.url)}">${esc(c.title)}</a>: ${esc(c.blurb)} <span class="small">(<a href="${href(c.url + 'is-it-right-for-me/')}">fit quiz</a> · <a href="${href(c.trainingUrl + 'practice-test/')}">practice test</a>)</span></li>`).join('')}</ul><p>Want to compare across all fields? Take the full <a href="${href('/quizzes/career-match/')}">Career Match Quiz</a>.</p>`,
      title: fitTitle(h1.length <= 50 ? `${h1} (Quiz)` : h1.length <= 60 ? h1 : `Which ${cat.short} Career Is Right for Me?`), desc: clamp(`Free ${cat.noun} career quiz: find out which of ${cs.length} ${cat.noun} careers fits your interests, training time and priorities. Instant results with pay data.`) }));
  }

  // College or trade school
  {
    const path = '/quizzes/college-or-trade-school/';
    const q = [
      ['How do you learn best?', [['Reading, lectures and writing papers', { college: 2 }], ['Hands-on practice and doing the real thing', { trade: 2, apprentice: 1 }], ['A mix of classroom and hands-on', { cc: 2 }], ['Short, focused lessons I can apply right away', { cert: 2 }]]],
      ['Which career idea excites you most right now?', [['A profession that requires a degree (nurse, accountant, engineer, teacher)', { college: 3 }], ['A skilled trade (electrician, HVAC, welding, plumbing)', { trade: 2, apprentice: 2 }], ['A healthcare or technical support role (medical assistant, IT support)', { cert: 2, cc: 1 }], ['I honestly don’t know yet', { cc: 2 }]]],
      ['How important is starting to earn money soon?', [['Very. I need income within a year', { cert: 2, apprentice: 2 }], ['Somewhat. One to two years is fine', { cc: 2, trade: 1 }], ['Not very. I can invest four years', { college: 2 }]]],
      ['How do you feel about student loans?', [['I want to avoid debt as much as possible', { apprentice: 2, cert: 1, cc: 1 }], ['Some debt is OK if the payoff is clear', { trade: 1, cc: 1 }], ['I’m comfortable with debt for the right degree', { college: 2 }]]],
      ['Which work environment sounds best?', [['An office, lab, school or hospital', { college: 1, cc: 1 }], ['Job sites, shops or outdoors', { trade: 2, apprentice: 1 }], ['Clinics, help desks or customer-facing roles', { cert: 2 }], ['I’m flexible', { cc: 1 }]]],
      ['How did you feel about high school academics?', [['I liked them and did well', { college: 2 }], ['They were fine, but I prefer practical work', { trade: 1, cert: 1 }], ['I struggled with traditional classes', { apprentice: 2, trade: 1 }], ['Mixed. Some subjects clicked, some didn’t', { cc: 2 }]]],
      ['Would you like to get paid while you train?', [['Yes, that would be ideal', { apprentice: 3 }], ['Maybe, if the training is good', { trade: 1, cc: 1 }], ['Not necessary', { college: 1 }]]],
      ['How sure are you about your career direction?', [['Very sure. I know the job I want', { trade: 1, college: 1 }], ['Somewhat sure', { cc: 1, cert: 1 }], ['Not sure at all', { cc: 2 }]]],
      ['What about the “college experience”: campus life, clubs, dorms?', [['It matters a lot to me', { college: 2 }], ['Nice but not essential', { cc: 1 }], ['Doesn’t matter to me', { trade: 1, cert: 1, apprentice: 1 }]]],
      ['Long term, what matters most?', [['Advancing into management or advanced professional roles', { college: 2 }], ['Becoming a highly skilled expert in a trade', { trade: 2, apprentice: 1 }], ['Stable, in-demand work I can start fast', { cert: 2 }], ['Keeping options open', { cc: 2 }]]]
    ].map(([qq, options]) => ({ q: qq, options }));
    const outcomes = {
      college: { title: 'A four-year college could be your best fit', text: 'You lean toward academic learning and careers that require a bachelor’s degree. Choose a major tied to real job outcomes, and consider starting at a community college to cut costs.', links: [['College vs. trade school guide', href('/guides/college-vs-trade-school/')], ['How to choose a college major', href('/guides/how-to-choose-a-college-major/')], ['Paying for college and training', href('/guides/financial-aid-basics/')]] },
      trade: { title: 'Trade school looks like a strong match', text: 'You prefer hands-on learning and practical careers. A trade or technical school program can get you job-ready in months to two years, often with far less debt than a four-year degree.', links: [['Highest-paying trade jobs', href('/best-careers/highest-paying-trade-jobs/')], ['Skilled trades careers', href('/careers/skilled-trades/')], ['College vs. trade school guide', href('/guides/college-vs-trade-school/')]] },
      apprentice: { title: 'An apprenticeship may be perfect for you', text: 'You want to earn while you learn and avoid debt. Registered apprenticeships combine paid on-the-job training with classroom hours and lead to nationally recognized credentials.', links: [['Apprenticeships guide', href('/guides/apprenticeships-guide/')], ['Jobs with paid training', href('/best-careers/jobs-with-paid-on-the-job-training/')], ['Electrician career', href('/careers/electrician/')]] },
      cc: { title: 'Community college is a smart starting point', text: 'You’re still exploring or want a flexible, affordable path. Community colleges offer certificates, associate degrees and transfer pathways, so you can build skills while you decide.', links: [['Community college guide', href('/guides/community-college-guide/')], ['Career Match Quiz', href('/quizzes/career-match/')], ['How to choose a career', href('/guides/how-to-choose-a-career/')]] },
      cert: { title: 'A short certificate program could get you working fast', text: 'You want to start earning soon in a stable field. Many healthcare, logistics, safety and IT careers can be entered with a certificate that takes weeks or months.', links: [['Fastest careers to train for', href('/best-careers/fastest-careers-to-train-for/')], ['Entry-level healthcare jobs', href('/best-careers/best-entry-level-healthcare-jobs/')], ['All trainings', href('/training/')]] }
    };
    pages.push(quizPage({ path, crumbs: [['Home', '/'], hub, ['College or Trade School?', path]], eyebrow: 'Free · 10 questions', h1: 'Should I Go to College or Trade School? (Quiz)', lead: 'Answer 10 questions about how you learn, your goals and your budget to see whether a four-year college, community college, trade school, apprenticeship or short certificate fits you best.', intro: 'Pick the answer that sounds most like you. There are no wrong answers: the quiz weighs learning style, cost, timing and goals to suggest an education path.', data: { type: 'outcome', outcomes }, questions: q,
      title: fitTitle('College or Trade School? Take the Free Quiz'), desc: clamp('Should you go to college or trade school? Answer 10 quick questions to see whether a university, community college, trade school, apprenticeship or certificate fits you best.'),
      faqs: [['Is trade school better than college?', 'Neither is better for everyone. Trade school is often faster and cheaper and leads directly to skilled jobs; college is required for many professions and can open management and specialized paths. The right choice depends on the career you want.'], ['Can I do both?', 'Yes. Many people earn a trade credential first and add a degree later, or use community college to combine technical certificates with transferable credits.']] }));
  }

  // Career change readiness
  {
    const path = '/quizzes/career-change-readiness/';
    const q = [
      ['Do you know which career you want to move into?', [['Not yet', 0], ['I have a few ideas', 1], ['I have one or two strong options', 2], ['Yes, and I’ve researched it', 3]]],
      ['Have you talked to people who do that work?', [['No', 0], ['I’ve read about it online', 1], ['I’ve talked to one person', 2], ['I’ve talked to several or job-shadowed', 3]]],
      ['How many months of expenses do you have saved?', [['Less than one', 0], ['One to two', 1], ['Three to five', 2], ['Six or more', 3]]],
      ['Do you know what training or credential the new career requires?', [['No idea', 0], ['Roughly', 1], ['Yes, I know the options', 2], ['Yes, and I’ve picked a program', 3]]],
      ['Can you fit training around your current responsibilities?', [['Not right now', 0], ['Barely', 1], ['Yes, part-time', 2], ['Yes, easily', 3]]],
      ['How well can you explain your transferable skills?', [['I’m not sure what they are', 0], ['I could name a few', 1], ['I have a list', 2], ['My resume already reflects them', 3]]],
      ['How does your household feel about the change?', [['We haven’t discussed it', 0], ['Mixed feelings', 1], ['Mostly supportive', 2], ['Fully supportive', 3]]],
      ['Would you accept a temporary pay cut to switch?', [['No', 0], ['Only a small one', 1], ['Yes, for a short period', 2], ['Yes: the long-term payoff is worth it', 3]]],
      ['Have you tried any work or learning in the new field?', [['No', 0], ['I’ve watched videos or read guides', 1], ['I took a short course', 2], ['I’ve volunteered, freelanced or worked part-time in it', 3]]],
      ['How strong is your motivation to change?', [['I’m just curious', 0], ['I’m unhappy but unsure', 1], ['I’m determined', 2], ['I’m determined and have a timeline', 3]]]
    ].map(([qq, options]) => ({ q: qq, options: options.map(([l, n]) => [l, { s: n }]) }));
    pages.push(quizPage({ path, crumbs: [['Home', '/'], hub, ['Career Change Readiness', path]], eyebrow: 'Free · 10 questions', h1: 'Career Change Readiness Quiz: Am I Ready to Switch?', lead: 'Score your readiness across direction, finances, skills, support and training, and get a clear next step.', intro: 'Answer honestly. The quiz scores your readiness from 0–100% and tells you what to work on first. Nothing is stored.',
      data: { type: 'points', max: 30, bands: [{ min: 75, title: 'Ready to make your move', text: 'You’ve done the groundwork. Lock in your training plan and start applying or enrolling.', links: [['Browse trainings', href('/training/')], ['Career change resume guide', href('/guides/career-change-resume/')]] }, { min: 50, title: 'Almost ready: close a few gaps', text: 'You have momentum. Focus on your lowest-scoring areas, usually finances, research or a training plan.', links: [['How to change careers', href('/guides/how-to-change-careers/')], ['Budgeting for a career change', href('/guides/financial-planning-career-change/')]] }, { min: 25, title: 'Plan before you leap', text: 'Explore and test your target career first. Informational interviews and a short course are low-risk ways to build confidence.', links: [['Informational interviews', href('/guides/informational-interviews/')], ['Transferable skills', href('/guides/transferable-skills/')]] }, { min: 0, title: 'Start with exploration', text: 'You’re at the beginning, and that’s fine. Start by discovering careers that fit your interests.', links: [['Career Match Quiz', href('/quizzes/career-match/')], ['How to choose a career', href('/guides/how-to-choose-a-career/')]] }] }, questions: q,
      title: fitTitle('Career Change Readiness Quiz: Am I Ready?'), desc: clamp('Are you ready to change careers? Take this free 10-question quiz to score your readiness on direction, finances, skills, training and support, and get your next step.') }));
  }

  // Work style
  {
    const path = '/quizzes/work-style/';
    const q = [
      ['I’d rather work mostly with…', [['People', { t_people: 2 }], ['Tools, machines or my hands', { 't_hands-on': 2 }], ['Information, numbers or computers', { t_data: 2 }]]],
      ['My ideal workplace is…', [['Indoors in a clinic, office or shop', { t_indoors: 1.5 }], ['Outdoors or moving between sites', { t_outdoors: 2, t_travel: 0.5 }], ['Anywhere with a laptop', { 't_remote-friendly': 2 }]]],
      ['Physically, I want a job that is…', [['Active. I like to move and lift', { t_physical: 2 }], ['Moderately active', { 't_hands-on': 0.5 }], ['Mostly seated', { t_desk: 2 }]]],
      ['I work best…', [['On a close-knit team', { t_team: 2 }], ['Independently, with focus time', { t_independent: 2 }], ['Either way', {}]]],
      ['I prefer days that are…', [['Fast-paced and unpredictable', { 't_fast-paced': 2 }], ['Steady and routine', { t_steady: 2 }], ['Varied but not chaotic', { 't_problem-solving': 1 }]]],
      ['What would make you proudest at the end of the day?', [['I helped someone feel better or safer', { t_helping: 2 }], ['I fixed or built something that works', { 't_hands-on': 1.5, 't_problem-solving': 1 }], ['I solved a tricky problem', { 't_problem-solving': 2 }], ['I created something new', { t_creative: 2 }]]],
      ['Your stance on night, weekend or rotating shifts?', [['Fine with me', { 't_shift-work': 1.5 }], ['Occasionally OK', {}], ['I need regular daytime hours', { t_steady: 1, t_desk: 0.5 }]]],
      ['How much responsibility do you want for safety-critical decisions?', [['A lot. I can handle the pressure', { 't_high-responsibility': 2 }], ['Some', {}], ['As little as possible', { t_steady: 1 }]]],
      ['Travel for work sounds…', [['Exciting', { t_travel: 2, t_outdoors: 0.5 }], ['OK sometimes', {}], ['Not for me', { t_indoors: 1 }]]],
      ['Which would you rather do on a free afternoon?', [['Volunteer or coach', { t_helping: 1, t_people: 1 }], ['Work on a car, house or project', { 't_hands-on': 2 }], ['Learn a new app or skill online', { t_data: 1, 't_remote-friendly': 0.5 }], ['Design or make something', { t_creative: 2 }]]]
    ].map(([qq, options]) => ({ q: qq, options }));
    pages.push(quizPage({ path, crumbs: [['Home', '/'], hub, ['Work Style Quiz', path]], eyebrow: 'Free · 10 questions', h1: 'Work Style Quiz: What Kind of Job Suits Me?', lead: 'People, things or data? Indoors or outdoors? Fast or steady? Discover your work style and the careers that match it.', intro: `Choose the answer that fits you best. We match your work-style preferences to the conditions of ${countLabel(careers.length)} careers.`,
      data: { type: 'careers', careersUrl: QUIZ_CAREERS, top: 6, resultTitle: 'Careers that match your work style', resultText: 'Based on work setting, pace, physical demands and the kind of work you enjoy.' }, questions: q,
      title: fitTitle('Work Style Quiz: What Kind of Job Suits Me?'), desc: clamp('Free work style quiz: find out whether you’re suited to people, hands-on or data work, indoors or outdoors, fast or steady, and see 6 matching careers with pay data.') }));
  }

  // Hub
  {
    const path = '/quizzes/';
    const crumbs = [['Home', '/'], hub];
    const body = `${pageHero({ crumbs, eyebrow: 'Free career quizzes', h1: 'Career Quizzes', lead: 'Free, no-sign-up quizzes to discover careers that fit you, choose an education path, check your readiness to switch careers and test your job knowledge.' })}
<div class="wrap" style="padding-top:30px;padding-bottom:60px"><h2 style="margin-top:0">Start with these</h2><div class="grid">${[['Career Match Quiz', '/quizzes/career-match/', '28 questions · Matches you with careers using the RIASEC interest model.'], ['College or Trade School?', '/quizzes/college-or-trade-school/', '10 questions · Find the education path that fits.'], ['Career Change Readiness', '/quizzes/career-change-readiness/', '10 questions · Score your readiness to switch.'], ['Work Style Quiz', '/quizzes/work-style/', '10 questions · People, things or data?']].map(([t, l, d]) => `<article class="card link"><h3><a class="stretch" href="${href(l)}">${t}</a></h3><p>${d}</p><span class="more">Start quiz →</span></article>`).join('')}</div>
<h2 id="field-quizzes">Which career in a field is right for me?</h2><div class="grid">${categories.map((cat) => `<article class="card link"><h3><a class="stretch" href="${href(`/quizzes/which-${cat.slug}-career-is-right-for-me/`)}">Which ${esc(cat.name)} career?</a></h3><p>${careers.filter((c) => c.cat === cat.slug).length} careers compared.</p></article>`).join('')}</div>
<h2 id="fit-quizzes">“Is this career right for me?” fit quizzes and practice tests</h2><p id="practice-tests">Every one of our ${countLabel(careers.length)} careers has a fit quiz and a practice test that checks your job knowledge. Find them by field:</p><div class="grid">${categories.map((cat) => { const n = careers.filter((c) => c.cat === cat.slug).length; return `<article class="card link"><h3><a class="stretch" href="${href(`/quizzes/which-${cat.slug}-career-is-right-for-me/#careers`)}">${esc(cat.name)}</a></h3><p>${n} fit quizzes and ${n} practice tests.</p></article>`; }).join('')}</div></div>`;
    pages.push({ path, crumbs, body, og: '/og/quiz.png', kind: 'Quiz', name: 'All career quizzes', title: fitTitle('Free Career Quizzes, Fit Quizzes & Practice Tests'), desc: clamp(`Free career quizzes with instant results: Career Match, College or Trade School, Career Change Readiness, Work Style, ${countLabel(careers.length)} career fit quizzes and ${countLabel(careers.length)} practice tests.`), schema: [] });
  }
  return pages;
}
