import cfg from '../../site.config.mjs';
import { esc, href, abs, money, pct, clamp } from '../lib/util.mjs';
import { faqBlock, faqSchema, icon, band } from '../lib/layout.mjs';
import { companyFaqs } from './company.mjs';
import { guides, gp } from '../data/guides/index.mjs';
import { partnerCourses, partnerTable } from '../lib/partners.mjs';

export function homePage(ctx) {
  const { careers, categories, labor, posts, byslug } = ctx;
  const pick = (s) => byslug[s] || careers[0];
  const stack = ['electrician', 'medical-assistant', 'cybersecurity-analyst'].map(pick);
  const popular = ['medical-assistant', 'electrician', 'hvac-technician', 'pharmacy-technician', 'truck-driver', 'phlebotomist', 'cybersecurity-analyst', 'occupational-safety-specialist', 'certified-nursing-assistant', 'welder', 'it-support-specialist', 'project-manager'].map((s) => byslug[s]).filter(Boolean);
  const noDegree = careers.filter((c) => c.eduLevel < 4).sort((a, b) => b.l.wages.median - a.l.wages.median).slice(0, 6);
  const fastest = careers.filter((c) => c.months <= 6).sort((a, b) => b.l.wages.median - a.l.wages.median).slice(0, 6);
  const featuredGuides = ['how-to-choose-a-career', 'college-vs-trade-school', 'how-to-change-careers', 'transferable-skills', 'how-to-ask-for-a-raise', 'how-to-write-a-resume'].map((s) => guides.find((g) => g.slug === s)).filter(Boolean);
  const faqs = companyFaqs.slice(0, 7);
  const mini = (cs, metric) => `<ol class="bars" style="margin:0">${cs.map((c) => `<li><a href="${href(c.url)}">${esc(c.title)}</a><span class="b"><i style="width:${(c.l.wages.median / cs[0].l.wages.median * 100).toFixed(0)}%"></i></span><span>${metric(c)}</span></li>`).join('')}</ol>`;

  const body = `<section class="hero"><div class="wrap"><div>
<p class="eyebrow">Career training by job title</p>
<h1>Find the career that fits. <em>Then learn how the job is really done.</em></h1>
<p class="lead">Free career quizzes, official pay data and day-in-the-life guides for ${careers.length} in-demand careers, plus practical online training for every job title. Built for U.S. students, career changers and employers.</p>
<div class="btn-row"><a class="btn btn-primary" href="${href('/quizzes/career-match/')}">Take the free Career Match Quiz</a><a class="btn" href="${href('/training/')}">Browse ${careers.length} trainings</a></div>
<ul class="trust"><li>${careers.length} job-title trainings</li><li>BLS pay data, ${labor.meta.oewsLabel}</li><li>Self-paced online</li><li>Free tools, no sign-up</li></ul>
</div><div class="stack" aria-hidden="true">${stack.map((c) => `<div class="scard"><b>${esc(c.title)}</b><div class="row"><span>Median pay</span><strong>${money(c.l.wages.median)}</strong></div><div class="row"><span>Growth ${labor.meta.projections}</span><strong>${pct(c.l.growthPct)}</strong></div><div class="row"><span>Time to train</span><strong>${esc(c.train)}</strong></div></div>`).join('')}</div></div></section>

<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">Start where you are</p><h2>Who are you here for?</h2><p>Pick your starting point. Every path leads to real career information and a practical next step.</p></div>
<div class="grid">
<article class="card link aud"><h3><a class="stretch" href="${href('/students/')}">I’m a student</a></h3><p>Figure out what you want to do and whether college, trade school or an apprenticeship gets you there.</p><ul><li>Career Match Quiz</li><li>College vs. trade school</li><li>High school roadmap</li></ul></article>
<article class="card link aud"><h3><a class="stretch" href="${href('/career-changers/')}">I’m changing careers</a></h3><p>Find a realistic new direction, reuse your skills and retrain efficiently.</p><ul><li>Readiness quiz</li><li>Transferable skills</li><li>Careers you can enter in a year</li></ul></article>
<article class="card link aud"><h3><a class="stretch" href="${href('/professionals/')}">I want to grow at work</a></h3><p>Earn more, get promoted and sharpen the skills of the job you already have.</p><ul><li>Raises &amp; promotions</li><li>Certifications vs. degrees</li><li>Job-specific how-tos</li></ul></article>
<article class="card link aud" style="border-top-color:#b8860b"><h3><a class="stretch" href="${href('/for-employers/')}">I hire &amp; train people</a></h3><p>Onboard new hires faster with consistent training for every job title on your team.</p><ul><li>Onboarding training</li><li>Hiring guides by job</li><li>ROI calculator</li></ul></article>
</div></div></section>

<section class="section alt"><div class="wrap"><div class="section-head"><p class="eyebrow">Explore by field</p><h2>${categories.length} career fields, ${careers.length} careers</h2><p>Every career includes pay, training time, a day in the life, skills, vocabulary, how-to guides, interview questions and a matching training.</p></div>
<div class="grid">${categories.map((cat) => { const cs = careers.filter((c) => c.cat === cat.slug); const meds = cs.map((c) => c.l.wages.median); return `<article class="card link"><span class="ico">${icon(cat.slug)}</span><h3><a class="stretch" href="${href(`/careers/${cat.slug}/`)}">${esc(cat.name)}</a></h3><p>${esc(cat.blurb)}</p><ul class="chips"><li class="chip">${cs.length} careers</li><li class="chip pay">${money(Math.min(...meds))}–${money(Math.max(...meds))}</li></ul></article>`; }).join('')}</div>
<p style="margin-top:20px"><a class="btn" href="${href('/careers/')}">See all ${careers.length} careers</a></p></div></section>

<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">Popular trainings</p><h2>Learn the job before your first day</h2><p>Each training covers the role, a realistic day, key vocabulary, step-by-step procedures, safety and how to land the job: self-paced and online.</p></div>
<div class="grid">${popular.map((c) => `<article class="card link"><span class="ico">${icon(c.cat)}</span><h3><a class="stretch" href="${href(c.trainingUrl)}">${esc(c.title)} Training</a></h3><p>${esc(c.blurb)}</p><ul class="chips"><li class="chip pay">Median ${money(c.l.wages.median)}</li><li class="chip">${esc(c.train)} to enter</li></ul></article>`).join('')}</div>
<p style="margin-top:20px"><a class="btn btn-primary" href="${href('/training/')}">View all trainings</a></p></div></section>

<section class="section dark"><div class="wrap"><div class="section-head"><p class="eyebrow" style="color:#7fd1c4">How it works</p><h2>From “what should I do?” to day one</h2></div>
<ol class="how"><li><h3>Explore free</h3><p>Read real career profiles with BLS pay data, daily routines and requirements.</p></li><li><h3>Find your match</h3><p>Take the Career Match Quiz or a career’s fit quiz and practice test.</p></li><li><h3>Enroll</h3><p>Prices are listed on every course. Request a training by email, or buy CDL, forklift, flagger and mold inspector courses at checkout.</p></li><li><h3>Learn at your pace</h3><p>Complete modules online and earn a certificate of completion.</p></li></ol></div></section>

<section class="section"><div class="wrap"><div class="grid-2">
<div><p class="eyebrow">By the numbers</p><h2 style="margin-top:0">Top-paying careers without a four-year degree</h2>${mini(noDegree, (c) => money(c.l.wages.median))}<p><a href="${href('/best-careers/highest-paying-jobs-without-a-degree/')}">See the full list →</a></p></div>
<div><p class="eyebrow">Start fast</p><h2 style="margin-top:0">Best-paying careers you can train for in 6 months or less</h2>${mini(fastest, (c) => money(c.l.wages.median))}<p><a href="${href('/best-careers/fastest-careers-to-train-for/')}">See all fast-track careers →</a></p></div>
</div><p class="small muted">Median annual pay, U.S. Bureau of Labor Statistics, ${labor.meta.oewsLabel}.</p></div></section>

<section class="section alt"><div class="wrap"><div class="section-head"><p class="eyebrow">Free tools</p><h2>Career quizzes that actually help</h2></div>
<div class="grid">${[['Career Match Quiz', '/quizzes/career-match/', 'Match your interests to careers using the RIASEC model.'], ['College or Trade School?', '/quizzes/college-or-trade-school/', 'Find the education path that fits how you learn and what you want.'], ['Career Change Readiness', '/quizzes/career-change-readiness/', 'Score your readiness and get a clear next step.'], ['Work Style Quiz', '/quizzes/work-style/', 'People, things or data? Indoors or out?']].map(([t, l, d]) => `<article class="card link"><h3><a class="stretch" href="${href(l)}">${t}</a></h3><p>${d}</p><span class="more">Start →</span></article>`).join('')}</div></div></section>

<section class="section alt"><div class="wrap"><div class="section-head"><p class="eyebrow">Buy online today</p><h2>Job-title training you can start now</h2><p>Complete online training for truck drivers, forklift operators, flaggers and mold inspectors. Buy here and start right away.</p></div>${partnerTable(partnerCourses)}<p><a class="btn" href="${href('/courses/')}">See all online courses</a></p></div></section>

${band('Training new hires? Give every one the same strong start.', 'Onboarding training by job title for employers, staffing agencies and workforce programs, with group pricing.', 'See employer training', '/for-employers/', 'Hiring guides', '/employers/hiring-guides/')}

${featuredGuides.length ? `<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">Guides</p><h2>Plain-English career guides</h2></div><div class="grid">${featuredGuides.map((g) => `<article class="card link"><h3><a class="stretch" href="${href(gp(g))}">${esc(g.title)}</a></h3><p>${esc(g.desc)}</p></article>`).join('')}</div><p style="margin-top:20px"><a class="btn" href="${href('/guides/')}">All guides</a></p></div></section>` : ''}

${posts.length ? `<section class="section alt"><div class="wrap"><div class="section-head"><p class="eyebrow">From the blog</p><h2>Latest articles</h2></div><div class="grid">${posts.slice(0, 3).map((p) => `<article class="card link"><span class="chip">${esc(p.category)}</span><h3 style="margin-top:8px"><a class="stretch" href="${href(`/blog/${p.slug}/`)}">${esc(p.title)}</a></h3><p>${esc(p.description)}</p></article>`).join('')}</div></div></section>` : ''}

<section class="section"><div class="wrap" style="max-width:860px">${faqBlock(faqs, 'Questions, answered')}</div></section>
${band('Ready to find your fit?', 'It takes about four minutes and it’s free.', 'Take the Career Match Quiz', '/quizzes/career-match/', 'Browse trainings', '/training/')}`;

  return {
    path: '/', crumbs: [], og: '/og/default.png', kind: 'Page', name: 'Home',
    title: 'Career Education Institute: Online Career Training by Job Title',
    desc: clamp(`Find your career and train for it. Free career quizzes, BLS salary data and day-in-the-life guides for ${careers.length} jobs, plus online training by job title for U.S. learners and employers.`),
    body,
    schema: [faqSchema(faqs, '/')]
  };
}
