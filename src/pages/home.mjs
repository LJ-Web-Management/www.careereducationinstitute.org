import cfg from '../../site.config.mjs';
import { esc, href, abs, money, pct, clamp, fmtDate, countLabel } from '../lib/util.mjs';
import { faqBlock, faqSchema, icon, band } from '../lib/layout.mjs';
import { companyFaqs } from './company.mjs';
import { guides, gp } from '../data/guides/index.mjs';
import { partnerCourses, partnerTable, partnerById } from '../lib/partners.mjs';

export function homePage(ctx) {
  const { careers, categories, labor, posts, byslug } = ctx;
  const pick = (s) => byslug[s] || careers[0];
  const stack = ['electrician', 'hvac-technician', 'medical-assistant'].map(pick);
  const popular = ['electrician', 'hvac-technician', 'medical-assistant', 'construction-laborer', 'telecommunications-technician', 'heavy-equipment-operator', 'building-maintenance-technician', 'welder', 'truck-driver', 'phlebotomist', 'industrial-maintenance-technician', 'occupational-safety-specialist'].map((s) => byslug[s]).filter(Boolean);
  const noDegree = careers.filter((c) => c.eduLevel < 4).sort((a, b) => b.l.wages.median - a.l.wages.median).slice(0, 6);
  const fastest = careers.filter((c) => c.months <= 6).sort((a, b) => b.l.wages.median - a.l.wages.median).slice(0, 6);
  const featuredGuides = ['how-to-choose-a-career', 'college-vs-trade-school', 'how-to-change-careers', 'transferable-skills', 'how-to-ask-for-a-raise', 'how-to-write-a-resume'].map((s) => guides.find((g) => g.slug === s)).filter(Boolean);
  const faqs = companyFaqs.slice(0, 7);
  // Eight fields on the homepage; the directory has all of them
  const homeFields = ['healthcare', 'skilled-trades', 'mechanics-and-manufacturing', 'energy-and-utilities', 'technology', 'transportation-and-logistics', 'safety-and-environmental', 'business-and-office'].map((s) => categories.find((c) => c.slug === s)).filter(Boolean);
  // Ranked pay bars: names are links but read as plain text until hovered, so the section isn't a wall of blue
  const mini = (cs, metric) => `<ol class="bars quiet">${cs.map((c) => `<li><a href="${href(c.url)}">${esc(c.title)}</a><span class="b"><i style="width:${(c.l.wages.median / cs[0].l.wages.median * 100).toFixed(0)}%"></i></span><span class="v">${metric(c)}</span></li>`).join('')}</ol>`;
  const g = (slug) => { const x = guides.find((y) => y.slug === slug); return x ? gp(x) : '/guides/'; };
  const paths = [
    ['Students', 'I’m a student', 'Figure out what you want to do, and whether college, trade school or an apprenticeship gets you there.', '/students/', 'Student hub', [['Career Match Quiz', '/quizzes/career-match/'], ['College vs. trade school', g('college-vs-trade-school')], ['High school roadmap', g('high-school-career-planning')]]],
    ['Career changers', 'I’m changing careers', 'Find a realistic new direction, reuse the skills you have and retrain without starting over.', '/career-changers/', 'Career changer hub', [['Readiness quiz', '/quizzes/career-change-readiness/'], ['Transferable skills', g('transferable-skills')], ['Careers you can enter in a year', '/best-careers/fastest-careers-to-train-for/']]],
    ['Professionals', 'I want to grow at work', 'Earn more, get promoted and sharpen the skills of the job you already have.', '/professionals/', 'Professional hub', [['Ask for a raise', g('how-to-ask-for-a-raise')], ['Certifications vs. degrees', g('certifications-vs-degrees')], ['Job-title trainings', '/training/']]],
    ['Employers', 'I hire &amp; train people', 'Onboard new hires faster with the same strong training for every job title on your team.', '/for-employers/', 'Employer training', [['Onboarding training', '/for-employers/'], ['Hiring guides by job', '/employers/hiring-guides/'], ['ROI calculator', '/employers/training-roi-calculator/']]]
  ];

  const body = `<section class="hero"><div class="wrap"><div>
<p class="eyebrow">Career training by job title</p>
<h1>Find the career that fits. <em>Then learn how the job is really done.</em></h1>
<p class="lead">Free career quizzes, official pay data and day-in-the-life guides for ${countLabel(careers.length)} in-demand careers, plus practical online training for every job title. Built for U.S. students, career changers and employers.</p>
<form class="hero-search" action="${href('/training/')}" role="search"><label class="vh" for="hero-q">Find a training by job title</label><input id="hero-q" name="q" type="search" placeholder="Find your training: welder, CNA, electrician…" autocomplete="off"><button class="btn btn-primary" type="submit">Find training</button></form>
<div class="btn-row"><a class="btn" href="${href('/quizzes/career-match/')}">Not sure? Take the free Career Match Quiz</a></div>
<ul class="trust"><li>${countLabel(careers.length)} job-title trainings, most under $50</li><li>BLS pay data, ${labor.meta.oewsLabel}</li><li>Self-paced online</li><li>Free tools, no sign-up</li></ul>
</div><div class="stack" aria-hidden="true">${stack.map((c) => `<div class="scard"><b>${esc(c.title)}</b><div class="row"><span>Median pay</span><strong>${money(c.l.wages.median)}</strong></div><div class="row"><span>Growth ${labor.meta.projections}</span><strong>${pct(c.l.growthPct)}</strong></div><div class="row"><span>Time to train</span><strong>${esc(c.train)}</strong></div></div>`).join('')}</div></div></section>

<section class="section"><div class="wrap paths-wrap"><div class="paths-intro"><p class="eyebrow">Start where you are</p><h2>Who are you here for?</h2><p>Pick your starting point. Every path leads to real career information and a practical next step.</p><a class="btn" href="${href('/quizzes/career-match/')}">Not sure? Take the quiz</a></div>
<ol class="paths">${paths.map(([k, h, d, l, cta, links], i) => `<li class="path"><span class="path-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div class="path-body"><p class="path-k">${k}</p><h3><a href="${href(l)}">${h}</a></h3><p>${d}</p><ul class="path-links">${links.map(([t, u]) => `<li><a href="${href(u)}">${t}</a></li>`).join('')}</ul></div><a class="path-go" href="${href(l)}" aria-label="${esc(cta)}"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a></li>`).join('')}</ol>
</div></section>

<section class="section alt"><div class="wrap"><div class="section-head"><p class="eyebrow">Explore by field</p><h2>${categories.length} career fields, ${countLabel(careers.length)} careers</h2><p>Every career includes pay, training time, a day in the life, skills, vocabulary, how-to guides, interview questions and a matching training.</p></div>
<div class="grid">${homeFields.map((cat) => { const cs = careers.filter((c) => c.cat === cat.slug); const meds = cs.map((c) => c.l.wages.median); return `<article class="card link fcard"><span class="ico">${icon(cat.slug)}</span><h3><a class="stretch" href="${href(`/careers/${cat.slug}/`)}">${esc(cat.name)}</a></h3><p>${esc(cat.blurb)}</p><div class="fcard-foot"><span class="fcard-big">${money(Math.min(...meds))}–${money(Math.max(...meds))}</span><span>${cs.length} careers</span></div></article>`; }).join('')}</div>
<p style="margin-top:20px"><a class="btn" href="${href('/careers/')}">See all ${categories.length} fields and ${countLabel(careers.length)} careers</a></p></div></section>

<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">Popular trainings</p><h2>Learn the job before your first day</h2><p>Each training covers the role, a realistic day, key vocabulary, step-by-step procedures, safety and how to land the job: self-paced and online.</p></div>
<div class="grid">${popular.map((c) => { const m = c.replacedBy && partnerById[c.replacedBy]; const price = m ? m.price : c.price; const hrs = m ? m.hoursNum : c.hours; return `<article class="card link fcard"><span class="ico">${icon(c.cat)}</span><h3><a class="stretch" href="${href(c.trainingUrl)}">${esc(c.title)} Training</a></h3><p>${esc(c.blurb)}</p><div class="fcard-foot"><span class="fcard-big">$${price.toFixed(2)} <small>· ${hrs} hours</small></span><span>Jobs pay ${money(c.l.wages.median)} median</span></div></article>`; }).join('')}</div>
<p class="btn-row" style="margin-top:24px"><a class="btn btn-primary" href="${href('/training/')}">Browse all ${countLabel(careers.length)} trainings</a><a class="btn" href="${href('/quizzes/career-match/')}">Not sure which? Take the quiz</a></p></div></section>

<section class="section dark"><div class="wrap"><div class="section-head"><p class="eyebrow" style="color:#7fd1c4">How it works</p><h2>From “what should I do?” to day one</h2></div>
<ol class="how"><li><h3>Explore free</h3><p>Read real career profiles with BLS pay data, daily routines and requirements.</p></li><li><h3>Find your match</h3><p>Take the Career Match Quiz or a career’s fit quiz and practice test.</p></li><li><h3>Buy your training</h3><p>Most trainings are under $50, and the price is on every course. Buy the training for your career, start today and get a certificate when you finish.</p></li><li><h3>Learn at your pace</h3><p>Complete modules online and earn a certificate of completion.</p></li></ol></div></section>

<section class="section"><div class="wrap"><div class="grid-2 numbers">
<div><p class="eyebrow">By the numbers</p><h2 style="margin-top:0">Top-paying careers without a four-year degree</h2>${mini(noDegree, (c) => money(c.l.wages.median))}<a class="more-link" href="${href('/best-careers/highest-paying-jobs-without-a-degree/')}">See the full list <span aria-hidden="true">→</span></a></div>
<div><p class="eyebrow">Start fast</p><h2 style="margin-top:0">Best-paying careers you can train for in 6 months or less</h2>${mini(fastest, (c) => money(c.l.wages.median))}<a class="more-link" href="${href('/best-careers/fastest-careers-to-train-for/')}">See all fast-track careers <span aria-hidden="true">→</span></a></div>
</div><p class="small muted">Median annual pay, U.S. Bureau of Labor Statistics, ${labor.meta.oewsLabel}.</p></div></section>

<section class="section alt"><div class="wrap"><div class="section-head"><p class="eyebrow">Free tools</p><h2>Career quizzes that actually help</h2></div>
<div class="grid">${[['Career Match Quiz', '/quizzes/career-match/', 'Match your interests to careers using the RIASEC model.'], ['College or Trade School?', '/quizzes/college-or-trade-school/', 'Find the education path that fits how you learn and what you want.'], ['Career Change Readiness', '/quizzes/career-change-readiness/', 'Score your readiness and get a clear next step.'], ['Work Style Quiz', '/quizzes/work-style/', 'People, things or data? Indoors or out?']].map(([t, l, d]) => `<article class="card link"><h3><a class="stretch" href="${href(l)}">${t}</a></h3><p>${d}</p><span class="more">Start →</span></article>`).join('')}</div></div></section>

<section class="section alt"><div class="wrap"><div class="section-head"><p class="eyebrow">Instant access</p><h2>Trainings you can start in five minutes</h2><p>Buy at checkout and your login arrives by email right away.</p></div>${partnerTable(partnerCourses)}<p class="btn-row"><a class="btn btn-primary" href="${href('/training/')}">Search all trainings</a><a class="btn" href="${href('/cart/')}">View cart</a></p></div></section>

${band('Training new hires? Give every one the same strong start.', 'Onboarding training by job title for employers, staffing agencies and workforce programs, with group pricing.', 'See employer training', '/for-employers/', 'Hiring guides', '/employers/hiring-guides/')}

${featuredGuides.length ? `<section class="section centered"><div class="wrap"><div class="section-head"><p class="eyebrow">Guides</p><h2>Plain-English career guides</h2></div><ul class="list-view">${featuredGuides.map((g) => `<li><h3><a href="${href(gp(g))}">${esc(g.title)}</a></h3><p>${esc(g.desc)}</p></li>`).join('')}</ul><p style="margin-top:20px"><a class="btn" href="${href('/guides/')}">All guides</a></p></div></section>` : ''}

${posts.length ? `<section class="section alt centered"><div class="wrap"><div class="section-head"><p class="eyebrow">From the blog</p><h2>Latest articles</h2></div><ul class="list-view">${posts.slice(0, 3).map((p) => `<li><p class="lv-k">${esc(p.category)} · <time datetime="${p.date}">${fmtDate(p.date)}</time></p><h3><a href="${href(`/blog/${p.slug}/`)}">${esc(p.title)}</a></h3><p>${esc(p.description)}</p></li>`).join('')}</ul><p style="margin-top:20px"><a class="btn" href="${href('/blog/')}">All articles</a></p></div></section>` : ''}

<section class="section"><div class="wrap" style="max-width:860px">${faqBlock(faqs, 'Questions, answered', 'faq', { hover: true, show: 4, more: '/faq/' })}</div></section>
${band('Ready to find your fit?', 'It takes about four minutes and it’s free.', 'Take the Career Match Quiz', '/quizzes/career-match/', 'Browse trainings', '/training/')}`;

  return {
    path: '/', crumbs: [], og: '/og/default.png', kind: 'Page', name: 'Home',
    title: 'Career Education Institute: Online Career Training by Job Title',
    desc: clamp(`Find your career and train for it. Free career quizzes, BLS salary data and day-in-the-life guides for ${countLabel(careers.length)} jobs, plus online training by job title for U.S. learners and employers.`),
    body,
    schema: [faqSchema(faqs, '/')]
  };
}
