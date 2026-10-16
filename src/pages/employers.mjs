import cfg from '../../site.config.mjs';
import { esc, href, abs, money, money2, num, pct, clamp, fitTitle, listJoin, lowerFirst, taskPhrase } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, ctaCard, sideLinks, answerBox, icon, band } from '../lib/layout.mjs';
import { enrollForm } from '../lib/forms.mjs';
import { pick, dataNote, growthWord } from '../lib/career-helpers.mjs';
import { modules } from './training.mjs';
import { employerCats } from '../data/employer-cats.mjs';
import { guides, gp } from '../data/guides/index.mjs';
import { resources } from '../data/resources.mjs';

const E = ['Home', '/'];
const EH = ['Employers', '/employers/'];
const empGuides = () => guides.filter((g) => g.topic === 'employers');
const empSheets = () => resources.filter((r) => r.audience === 'employers');

const buyerFaqs = [
  ['How is pricing structured for teams?', `Pricing is per learner, with volume discounts for larger groups and multi-course bundles. Tell us your roles and headcount on the form and we’ll send a quote. ${cfg.course.groupNote}.`],
  ['Is there a minimum number of learners?', 'No. You can enroll a single new hire or hundreds across multiple roles.'],
  ['Can we mix courses across job titles?', `Yes. Choose any combination of our ${50} job-title trainings, for example, medical assistant and phlebotomist for a clinic, or forklift operator and warehouse associate for a distribution center.`],
  ['How quickly can learners start?', 'Typically within a few business days of your request. Learners receive login details by email and can start immediately.'],
  ['Do the courses replace OSHA, licensing or state-required training?', 'No. Our trainings are general, non-credit job-role courses. They complement, but do not replace, OSHA-required training, state licensing programs, manufacturer training or your own site-specific procedures.'],
  ['How do we know who finished?', `Learners earn a ${cfg.course.certificate.toLowerCase()} after passing the final knowledge check, and we can provide completion updates for your group on request.`],
  ['Can you invoice our company or accept a purchase order?', 'Yes. Ask for an invoice or provide your PO details when you request a quote.']
];

const quoteForm = (careers, kind = 'employer', heading = 'Request group pricing') => enrollForm({ kind: 'employer', heading, id: 'quote' });

function buyerPage({ path, crumbs, eyebrow, h1, lead, title, desc, sections, careers, faqs = buyerFaqs, asideTitle = 'Get a team quote' }) {
  const aside = `<div class="cta-card"><h2>${esc(asideTitle)}</h2><p>Tell us your roles and headcount. We’ll reply with pricing and setup details.</p><ul><li>${careers.length} job-title trainings</li><li>Self-paced, online: no scheduling</li><li>${esc(cfg.course.certificate)}</li><li>Volume discounts</li></ul><a class="btn btn-primary" href="#quote">Request pricing</a></div>${sideLinks('Employer resources', [['Hiring guides by job', '/employers/hiring-guides/'], ['Job description templates', '/employers/job-descriptions/'], ['Onboarding plans by job', '/employers/onboarding-plans/'], ['Training ROI calculator', '/employers/training-roi-calculator/'], ['Onboarding assessment', '/employers/onboarding-assessment/'], ['Employer resource center', '/employers/']])}`;
  return {
    path, crumbs, og: '/og/training.png', kind: 'Employers', name: h1, scripts: ['enroll'], title, desc,
    mcta: `<a class="btn btn-primary" href="#quote">Request pricing</a><a class="btn" href="${href('/employers/training-roi-calculator/')}">ROI calculator</a>`,
    body: `${pageHero({ crumbs, eyebrow, h1, lead, meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="#quote">Request group pricing</a><a class="btn" href="${href('/employers/training-roi-calculator/')}">Calculate your training ROI</a></div>` })}<div class="wrap layout"><div class="prose">${sections}${quoteForm(careers)}${faqBlock(faqs, 'Questions from employers')}<aside class="callout info"><p>MrPress Education trainings are general, non-credit job-role courses. They supplement, and do not replace, legally required safety training, licensing programs or your site-specific procedures. For OSHA, HAZWOPER, CDL ELDT and other certification courses, see our <a href="${href('/courses/')}">safety, compliance and CDL courses</a>.</p></aside></div><aside>${aside}</aside></div>`,
    schema: [faqSchema(faqs, path), { '@type': 'Service', name: h1, serviceType: 'Employee onboarding and job-role training', provider: { '@id': abs('/#org') }, areaServed: { '@type': 'Country', name: 'United States' }, audience: { '@type': 'BusinessAudience', name: 'Employers' }, url: abs(path) }]
  };
}

export function employerPages(ctx) {
  const { careers, categories, labor, byslug } = ctx;
  const pages = [];
  const roleList = (cs, sub = 'hiring-guides') => `<div class="grid">${cs.map((c) => `<article class="card link"><span class="ico">${icon(c.cat)}</span><h3><a class="stretch" href="${href(`/employers/${sub}/${c.slug}/`)}">${sub === 'hiring-guides' ? `How to hire ${c.a === 'an' ? 'an' : 'a'} ${esc(c.lower)}` : sub === 'job-descriptions' ? `${esc(c.title)} job description` : `${esc(c.title)} onboarding plan`}</a></h3><p class="small">Median pay ${money(c.l.wages.median)} · ${num(c.l.annualOpenings)} openings/yr</p></article>`).join('')}</div>`;

  // ---------- Main buyer page ----------
  pages.push(buyerPage({
    path: '/for-employers/', crumbs: [E, ['For employers', '/for-employers/']], careers,
    eyebrow: 'For employers', h1: 'Onboarding Training for Every New Hire', lead: `Give new employees a consistent, practical foundation in their role (duties, vocabulary, step-by-step procedures, safety and professional standards) with self-paced online training for ${careers.length} job titles.`,
    title: fitTitle('Employee Onboarding Training by Job Title'), desc: clamp(`Onboarding training for employers: self-paced online courses for ${careers.length} job titles that teach new hires the role, vocabulary, core procedures and safety. Group pricing available.`),
    sections: `${answerBox('What employers get', `A ready-made, job-specific foundation course for each new hire, so supervisors and trainers can spend their time on your equipment, workflows and culture instead of re-teaching the basics. Courses are ${esc(cfg.course.format.toLowerCase())}, take 6 to 14 hours, cost $59.99 to $129.99 per learner and end with a knowledge check and ${esc(cfg.course.certificate.toLowerCase())}.`)}
<h2 id="problem">Why onboarding breaks down</h2><ul class="crosses"><li>Every trainer teaches the basics differently, so new hires learn different habits.</li><li>Your best people lose productive hours repeating the same explanations.</li><li>New hires who don’t understand the vocabulary can’t follow instructions or documentation.</li><li>When the job isn’t what someone expected, they leave, often in the first 90 days.</li></ul>
<h2 id="solution">How job-title training helps</h2><div class="grid-2">${[['Consistent foundation', 'Every new hire covers the same core content: what the role involves, key terms, common procedures and safety basics.'], ['Faster ramp-up', 'New hires arrive at hands-on training already knowing the language and the steps, so supervised practice goes further.'], ['Less trainer time', 'Self-paced lessons handle the fundamentals. Your experts focus on your site, equipment and standards.'], ['Realistic expectations', 'A clear picture of the day-to-day job before (or right after) hire supports better fit and retention.']].map(([t, d]) => `<div class="card"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
<h2 id="included">What every course covers</h2><ol>${modules(careers[0]).map(([t]) => `<li>${esc(t.replace(careers[0].title, '[Job title]'))}</li>`).join('')}</ol>
<h2 id="use-cases">Ways employers use it</h2><ul class="checks"><li><strong>New-hire onboarding:</strong> assign the course for the role during week one.</li><li><strong>Pre-hire or pre-start preparation:</strong> send it with the offer so day one starts strong.</li><li><strong>Cross-training:</strong> help employees understand adjacent roles they support.</li><li><strong>Internal mobility:</strong> let employees explore and prepare for a new role in your organization.</li><li><strong>Apprentice, intern and student programs:</strong> a structured foundation before field time.</li></ul>
<h2 id="industries">Training by industry</h2><div class="grid">${categories.map((cat) => `<article class="card link"><span class="ico">${icon(cat.slug)}</span><h3><a class="stretch" href="${href(`/for-employers/${cat.slug}/`)}">${esc(cat.name)} onboarding</a></h3><p>${careers.filter((c) => c.cat === cat.slug).length} roles · for ${esc(employerCats[cat.slug].audience)}</p></article>`).join('')}</div>
<h2 id="how">How it works for teams</h2><ol class="steps"><li><h3>Choose your roles</h3><p>Pick the job-title trainings your new hires need: mix and match across roles.</p></li><li><h3>Request a quote</h3><p>Use the form below. We reply with volume pricing, invoicing options and setup details.</p></li><li><h3>We set up your learners</h3><p>Send us your learner list; each person receives login details to our online learning platform.</p></li><li><h3>Track completion</h3><p>Learners complete the course at their own pace and earn a certificate after the final knowledge check.</p></li></ol>
<h2 id="free-resources">Free resources for hiring managers</h2><ul><li><a href="${href('/employers/hiring-guides/')}">How to hire for ${careers.length} job titles</a>: pay benchmarks, screening checklists and interview questions</li><li><a href="${href('/employers/job-descriptions/')}">Job description templates</a>: copy-ready for every role</li><li><a href="${href('/employers/onboarding-plans/')}">30-60-90 day onboarding plans by job</a></li><li><a href="${href('/employers/training-roi-calculator/')}">Training ROI calculator</a></li><li><a href="${href('/resources/new-hire-onboarding-checklist/')}">New hire onboarding checklist</a></li></ul>`
  }));

  // ---------- Staffing / recruiters ----------
  pages.push(buyerPage({
    path: '/for-staffing-agencies/', crumbs: [E, ['For recruiters & staffing agencies', '/for-staffing-agencies/']], careers, asideTitle: 'Get agency pricing',
    eyebrow: 'For recruiters & staffing agencies', h1: 'Job-Ready Training for Recruiters and Staffing Agencies', lead: 'Prepare candidates before placement, stand out to clients and give your talent pool a credential that shows they understand the job.',
    title: fitTitle('Pre-Placement Training for Staffing Agencies'), desc: clamp(`Pre-placement training for recruiters and staffing agencies: job-title courses for ${careers.length} roles that prepare candidates for day one. Volume pricing for agencies.`),
    sections: `${answerBox('Why agencies use job-title training', 'Clients want candidates who show up ready. A short, role-specific course before placement helps candidates understand the job, learn the vocabulary and safety basics, and arrive with a certificate of completion you can share with clients.')}
<h2 id="benefits">Benefits for your agency</h2><div class="grid-2">${[['Differentiate your talent', 'Present candidates who have completed role-specific training: a concrete edge in competitive bids.'], ['Better first weeks', 'Candidates who know what the job involves are better prepared for the realities of the assignment.'], ['Scale onboarding', 'Self-paced online courses work for one candidate or hundreds, without scheduling classrooms.'], ['Expand into new roles', 'Upskill your bench toward higher-demand roles your clients are struggling to fill.']].map(([t, d]) => `<div class="card"><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
<h2 id="popular">Popular roles for staffing</h2><div class="grid">${['forklift-operator', 'warehouse-associate', 'construction-laborer', 'certified-nursing-assistant', 'medical-assistant', 'phlebotomist', 'customer-service-representative', 'administrative-assistant', 'security-guard', 'it-support-specialist', 'welder', 'truck-driver'].map((s) => byslug[s]).filter(Boolean).map((c) => `<article class="card link"><h3><a class="stretch" href="${href(c.trainingUrl)}">${esc(c.title)} Training</a></h3><p class="small">${num(c.l.annualOpenings)} openings/yr nationally</p></article>`).join('')}</div>
<h2 id="recruiter-tools">Free tools for recruiters</h2><ul><li><a href="${href('/employers/job-descriptions/')}">Job description templates</a> to write client-ready requisitions</li><li><a href="${href('/employers/hiring-guides/')}">Hiring guides</a> with screening checklists and interview questions for each role</li><li><a href="${href('/salary-guide/')}">Salary guide</a> with BLS pay data for ${careers.length} roles</li><li><a href="${href('/resources/interview-scorecard-template/')}">Structured interview scorecard</a></li></ul>`
  }));

  // ---------- Workforce programs ----------
  pages.push(buyerPage({
    path: '/for-workforce-programs/', crumbs: [E, ['For schools & workforce programs', '/for-workforce-programs/']], careers, asideTitle: 'Get program pricing',
    eyebrow: 'For schools, workforce boards & nonprofits', h1: 'Career Training for Schools and Workforce Programs', lead: 'Give students and job seekers a realistic look at in-demand careers, plus free quizzes, guides and worksheets for career exploration.',
    title: fitTitle('Career Training for Schools & Workforce Programs'), desc: clamp(`Career exploration and job-role training for high schools, CTE programs, workforce boards, reentry and veterans programs. ${careers.length} job-title courses with program pricing.`),
    sections: `${answerBox('Built for career pathways', 'Our job-title trainings help participants understand what a career involves before they commit to longer programs, and give them vocabulary, procedures and safety basics that make them stronger candidates.')}
<h2 id="who">Programs we support</h2><ul class="checks"><li>High school career and technical education (CTE) and career exploration classes</li><li>Community college and adult education career pathways</li><li>Workforce development boards and American Job Centers</li><li>Reentry, veterans and youth employment programs</li><li>Nonprofits running job-readiness and placement programs</li></ul>
<h2 id="free">Free classroom resources</h2><p>Every career profile, quiz, guide and worksheet on our site is free to use with participants:</p><ul><li><a href="${href('/quizzes/career-match/')}">Career Match Quiz</a> and <a href="${href('/quizzes/college-or-trade-school/')}">College or Trade School quiz</a></li><li><a href="${href('/resources/career-decision-worksheet/')}">Career Decision Worksheet</a> and <a href="${href('/resources/informational-interview-questions/')}">informational interview questions</a></li><li><a href="${href('/careers/')}">${careers.length} career profiles</a> with BLS pay and outlook data</li><li>Free <a href="${href('/quizzes/')}">practice tests for every career</a></li></ul>
<h2 id="funding">Funding notes</h2><p>Many programs combine our courses with funding sources such as Workforce Innovation and Opportunity Act (WIOA) training funds, grants or employer partnerships. Eligibility and approval rules vary by state and local board, so check with your workforce board about whether and how our courses can be used.</p>`
  }));

  // ---------- Industry pages ----------
  for (const cat of categories) {
    const ec = employerCats[cat.slug];
    const cs = careers.filter((c) => c.cat === cat.slug);
    const path = `/for-employers/${cat.slug}/`;
    const h1 = `${cat.name} Onboarding Training`;
    pages.push(buyerPage({
      path, crumbs: [E, ['For employers', '/for-employers/'], [cat.name, path]], careers,
      eyebrow: `For ${ec.audience}`, h1, lead: esc(ec.pitch),
      title: fitTitle(pick([`${cat.name} Onboarding Training for Employers`, `${cat.name} Onboarding Training`, `${cat.name} Training for Employers`])),
      desc: clamp(`${cat.name} onboarding training for ${ec.audience}: online job-title courses for ${listJoin(cs.slice(0, 3).map((c) => c.pluralLower))} and more. Group pricing available.`),
      sections: `<h2 id="challenges">Common onboarding challenges in ${esc(cat.noun)}</h2><ul class="crosses">${ec.pains.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
<h2 id="roles">${cs.length} roles we train</h2><div class="grid-2">${cs.map((c) => `<article class="card"><h3><a href="${href(c.trainingUrl)}">${esc(c.title)} Training</a></h3><p>${esc(c.blurb)}</p><p class="small"><a href="${href(`/employers/hiring-guides/${c.slug}/`)}">Hiring guide</a> · <a href="${href(`/employers/job-descriptions/${c.slug}/`)}">Job description</a> · <a href="${href(`/employers/onboarding-plans/${c.slug}/`)}">Onboarding plan</a></p></article>`).join('')}</div>
<h2 id="measure">Onboarding metrics to track</h2><ul>${ec.kpis.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>
<h2 id="labor">The hiring market</h2>${dataNote(labor)}<div class="table-wrap"><table><thead><tr><th scope="col">Role</th><th scope="col" class="num">Median pay</th><th scope="col" class="num">Openings/yr</th><th scope="col" class="num">Growth</th></tr></thead><tbody>${cs.map((c) => `<tr><td><a href="${href(`/employers/hiring-guides/${c.slug}/`)}">${esc(c.title)}</a></td><td class="num">${money(c.l.wages.median)}</td><td class="num">${num(c.l.annualOpenings)}</td><td class="num">${pct(c.l.growthPct)}</td></tr>`).join('')}</tbody></table></div><p>With thousands of openings each year, competition for qualified ${esc(cat.noun)} workers is real. Faster, more consistent onboarding is one of the few levers fully within your control.</p>
${cat.slug === 'safety-and-environmental' || cat.slug === 'skilled-trades' ? `<aside class="callout"><p><strong>Need OSHA 10, OSHA 30 or HAZWOPER for your team?</strong> Buy them online on our <a href="${href('/courses/')}">safety and compliance courses</a> page, with volume pricing from 2 learners.</p></aside>` : ''}`
    }));
  }

  // ---------- Per-career hiring guides, job descriptions, onboarding plans ----------
  for (const c of careers) {
    const ec = employerCats[c.cat];
    const w = c.l.wages;
    const cat = categories.find((x) => x.slug === c.cat);
    const art = c.a === 'an' ? 'an' : 'a';
    const sideRole = (cur) => `${ctaCard({ title: `Onboard new ${c.pluralLower} faster`, text: `${esc(c.title)} training gives every new hire the same foundation: duties, ${c.terms.length}+ key terms, step-by-step procedures and safety.`, items: [`$${c.price.toFixed(2)} per learner`, `About ${c.hours} hours, online`, cfg.course.groupNote], btn: 'Get team pricing', link: '/for-employers/#quote' })}${sideLinks(`Hiring ${c.pluralLower}`, [['Hiring guide', `/employers/hiring-guides/${c.slug}/`], ['Job description template', `/employers/job-descriptions/${c.slug}/`], ['30-60-90 onboarding plan', `/employers/onboarding-plans/${c.slug}/`], [`${c.title} training`, c.trainingUrl], [`${c.title} salary data`, c.url + 'salary/']].filter(([, l]) => l !== cur))}`;

    // Hiring guide
    {
      const path = `/employers/hiring-guides/${c.slug}/`;
      const crumbs = [E, EH, ['Hiring guides', '/employers/hiring-guides/'], [c.title, path]];
      const faqs = [
        [`How much should I pay ${art} ${c.lower}?`, `The U.S. median wage for ${c.pluralLower} is ${money(w.median)} per year (${money2(w.hourly)}/hour), according to BLS ${labor.meta.oewsLabel} data. Entry-level offers often fall near the 25th percentile (${money(w.p25)}), while experienced hires command closer to the 75th percentile (${money(w.p75)}). Adjust for your local market.`],
        [`What qualifications should ${art} ${c.lower} have?`, `BLS lists “${c.l.entryEducation.toLowerCase()}” as the typical entry-level education. Look for ${listJoin(c.certs.slice(0, 2).map((x) => x[0]))} where relevant, plus skills such as ${listJoin(c.hard.slice(0, 3).map((s) => s.toLowerCase()))}.`],
        [`How long does it take to train a new ${c.lower}?`, `Becoming qualified typically takes ${c.train}. After hire, plan for a structured 30-60-90 day onboarding period; BLS classifies on-the-job training for this occupation as “${c.l.onTheJobTraining.toLowerCase()}.”`]
      ];
      const main = `${answerBox(`How to hire ${art} ${c.lower}`, `Write a clear job description, offer competitive pay (the national median is <strong>${money(w.median)}</strong>), recruit through ${esc(lowerFirst(ec.sources[0]))}, verify ${esc(c.certs[0][0])} where applicable, run a structured interview with a practical skills check, and onboard with a 30-60-90 day plan.`)}
${dataNote(labor)}
<h2 id="market">The hiring market for ${esc(c.pluralLower)}</h2><p>There are about <strong>${num(c.l.employment)}</strong> ${esc(c.pluralLower)} employed in the U.S., with roughly <strong>${num(c.l.annualOpenings)}</strong> openings each year. Employment is projected to change ${pct(c.l.growthPct)} from ${labor.meta.projections} (${growthWord(c.l.growthPct)}). ${c.l.growthPct >= 5 ? 'Expect competition for qualified candidates: speed and a strong offer matter.' : 'Most openings come from replacing workers who retire or change careers, so a steady pipeline matters.'}</p>
<h2 id="pay">Pay benchmarks for offers</h2><div class="table-wrap"><table><thead><tr><th scope="col">Candidate level</th><th scope="col" class="num">Annual</th><th scope="col" class="num">Hourly*</th></tr></thead><tbody>${[['Entry level (10th–25th percentile)', `${money(w.p10)}–${money(w.p25)}`, `${money2(w.p10 / 2080)}–${money2(w.p25 / 2080)}`], ['Typical / mid-career (median)', money(w.median), money2(w.hourly)], ['Experienced (75th percentile)', money(w.p75), money2(w.p75 / 2080)], ['Top of market (90th percentile)', money(w.p90), money2(w.p90 / 2080)]].map((r) => `<tr><th scope="row">${r[0]}</th><td class="num">${r[1]}</td><td class="num">${r[2]}</td></tr>`).join('')}</tbody></table></div><p class="small muted">*Annual ÷ 2,080 hours except median. National BLS data; adjust for your state and metro area. Many states and cities now require pay ranges in job postings.</p>
<h2 id="requirements">What to look for</h2><div class="cols"><div><h3>Must-haves</h3><ul class="checks"><li>${esc(c.l.entryEducation)} (typical entry level)</li>${c.license ? `<li>Licensing or certification required in your state</li>` : ''}<li>${esc(c.hard[0])}</li><li>${esc(c.soft[0])}</li></ul></div><div><h3>Nice-to-haves</h3><ul class="checks">${c.certs.slice(0, 3).map(([n]) => `<li>${esc(n)}</li>`).join('')}<li>Experience with ${esc(lowerFirst(c.tools[0]))}</li></ul></div></div>${c.license ? `<aside class="callout info"><p><strong>Licensing:</strong> ${esc(c.license)}</p></aside>` : ''}
<h2 id="sourcing">Where to find ${esc(c.pluralLower)}</h2><ul>${ec.sources.map((s) => `<li>${esc(s)}</li>`).join('')}<li>Job postings that use common alternate titles: ${c.aka.map(esc).join(', ')}</li></ul>
<h2 id="screening">Screening checklist</h2><ul class="checks">${ec.screening.map((s) => `<li>${esc(s)}</li>`).join('')}</ul><p class="small muted">Follow federal, state and local rules on background checks, drug testing and fair-chance hiring, and apply screening consistently to all candidates for the role.</p>
<h2 id="interview">Interview questions to ask</h2><p>Ask every candidate the same questions and score answers on a <a href="${href('/resources/interview-scorecard-template/')}">structured scorecard</a>.</p>${c.iq.map(([q, a], i) => `<h3>${i + 1}. “${esc(q)}”</h3><p><strong>What a strong answer includes:</strong> ${esc(a)}</p>`).join('')}
<h2 id="skills-check">Practical skills checks</h2><p>A short demonstration beats a perfect resume. Ask candidates to talk you through, or perform under supervision, tasks such as:</p><ul>${c.howto.map((h) => `<li>${esc(h.t)} (<a href="${href(`${c.url}how-to/${h.slug}/`)}">see the steps</a>)</li>`).join('')}</ul>
<h2 id="red-flags">Red flags</h2><ul class="crosses"><li>Can’t describe basic safety practices for the role</li><li>Vague or inconsistent work history with no explanation</li><li>Unfamiliar with core terms such as ${c.terms.slice(0, 3).map(([t]) => esc(t)).join(', ')}</li><li>Negative talk about every past employer or coworker</li></ul>
<h2 id="onboarding">Onboard for retention</h2><p>The first 90 days decide whether a new hire stays. Use our <a href="${href(`/employers/onboarding-plans/${c.slug}/`)}">${esc(c.title)} 30-60-90 day onboarding plan</a> and give every new hire the same foundation with <a href="${href(c.trainingUrl)}">${esc(c.title)} training</a>. Show them the path forward: ${c.path.map(([t]) => esc(t)).join(' → ')}.</p>
${faqBlock(faqs, `Hiring ${c.pluralLower}: FAQ`)}`;
      pages.push({ path, crumbs, og: `/og/${c.slug}.png`, kind: 'Hiring guide', name: `How to hire ${art} ${c.lower}`, type: 'article', mcta: `<a class="btn btn-primary" href="${href('/for-employers/#quote')}">Team pricing</a><a class="btn" href="${href(`/employers/job-descriptions/${c.slug}/`)}">Job description</a>`,
        title: fitTitle(pick([`How to Hire ${art === 'an' ? 'an' : 'a'} ${c.title}: Pay, Screening & Interviews`, `How to Hire ${art === 'an' ? 'an' : 'a'} ${c.title}: Employer Guide`, `How to Hire ${art === 'an' ? 'an' : 'a'} ${c.title}`, `How to Hire ${art === 'an' ? 'an' : 'a'} ${c.short}`])),
        desc: clamp(`Employer guide to hiring ${art} ${c.lower}: pay benchmarks (${money(w.median)} median), qualifications, where to recruit, screening checklist, interview questions and onboarding.`),
        body: `${pageHero({ crumbs, eyebrow: `Hiring guide · ${cat.name}`, h1: `How to Hire ${art === 'an' ? 'an' : 'a'} ${esc(c.title)}`, lead: `Pay benchmarks, qualifications, sourcing, screening and interview questions for hiring ${esc(c.pluralLower)}, plus a plan to get them productive fast.` })}<div class="wrap layout"><div class="prose">${main}</div><aside>${sideRole(path)}</aside></div>`,
        schema: [faqSchema(faqs, path), { '@type': 'Article', headline: `How to Hire ${art} ${c.title}`, author: { '@id': abs('/#org') }, publisher: { '@id': abs('/#org') }, datePublished: cfg.launched, dateModified: cfg.updated, mainEntityOfPage: abs(path), image: abs(`/og/${c.slug}.png`), audience: { '@type': 'BusinessAudience', name: 'Employers and recruiters' } }] });
    }

    // Job description template
    {
      const path = `/employers/job-descriptions/${c.slug}/`;
      const crumbs = [E, EH, ['Job descriptions', '/employers/job-descriptions/'], [c.title, path]];
      const jd = `<div class="jd" id="jd-text"><h3>Job title</h3><p>${esc(c.title)}</p>
<h3>Job summary</h3><p>[Company name] is seeking a dependable ${esc(c.lower)} to join our team in [city, state]. In this role, you will ${esc(lowerFirst(c.duties[0]))}, ${esc(lowerFirst(c.duties[1]))} and support our team’s commitment to safety, quality and service.</p>
<h3>Responsibilities</h3><ul>${c.duties.map((d) => `<li>${esc(d)}</li>`).join('')}<li>Follow company policies, safety procedures and applicable regulations</li></ul>
<h3>Required qualifications</h3><ul><li>${esc(c.l.entryEducation)}${c.eduLevel >= 2 ? ' or equivalent training' : ''}</li>${c.license ? `<li>Current license or certification as required by [state]</li>` : ''}<li>Working knowledge of ${esc(c.hard.slice(0, 2).map((s) => s.toLowerCase()).join(' and '))}</li><li>${esc(c.soft[0])} and ${esc(c.soft[1].toLowerCase())}</li><li>[Add role-specific requirements, such as driver’s license or ability to pass a background check, if job-related]</li></ul>
<h3>Preferred qualifications</h3><ul>${c.certs.slice(0, 3).map(([n]) => `<li>${esc(n)}</li>`).join('')}<li>Experience with ${esc(lowerFirst(c.tools[0]))}</li></ul>
<h3>Skills</h3><ul>${[...c.hard.slice(2), ...c.soft.slice(2)].map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
<h3>Work environment and schedule</h3><p>${esc(c.env)} ${esc(c.schedule)}</p>
<h3>Pay and benefits</h3><p>$[min]–$[max] per [hour/year], depending on experience. [List benefits: health insurance, paid time off, retirement plan, training and certification support.]</p>
<h3>Equal opportunity</h3><p>[Company name] is an equal opportunity employer. We consider all qualified applicants without regard to race, color, religion, sex, sexual orientation, gender identity, national origin, age, disability, veteran status or any other characteristic protected by law, and we provide reasonable accommodations upon request.</p></div>`;
      const main = `${answerBox('How to use this template', `Copy the template below, replace the bracketed fields and tailor duties to your workplace. For pay, national BLS data shows ${esc(c.pluralLower)} earn a median of <strong>${money(w.median)}</strong> (${money2(w.hourly)}/hour); the middle 50% earn ${money(w.p25)}–${money(w.p75)}.`)}
<div class="btn-row no-print"><button class="btn btn-primary" type="button" data-copy-target="#jd-text">Copy job description</button><button class="btn" type="button" data-print>Print</button></div>${jd}
<h2 id="tips">Tips for a ${esc(c.lower)} job posting that attracts applicants</h2><ul><li><strong>Use the title candidates search for.</strong> “${esc(c.title)}” is the clearest; alternates include ${c.aka.slice(0, 3).map(esc).join(', ')}.</li><li><strong>Show the pay range.</strong> Postings with pay get more qualified applicants, and a growing number of states and cities require pay ranges in job postings.</li><li><strong>Separate must-haves from nice-to-haves.</strong> Long requirement lists discourage qualified candidates, especially career changers.</li><li><strong>Describe a real day.</strong> Borrow from our <a href="${href(c.url + 'day-in-the-life/')}">day in the life of ${c.a} ${esc(c.lower)}</a> so applicants self-select accurately.</li><li><strong>Mention training.</strong> Highlighting structured onboarding: such as <a href="${href(c.trainingUrl)}">${esc(c.title)} training</a>: widens your applicant pool.</li></ul>
<h2 id="next">Next steps</h2><p>Screen and interview with our <a href="${href(`/employers/hiring-guides/${c.slug}/`)}">${esc(c.title)} hiring guide</a>, then onboard with the <a href="${href(`/employers/onboarding-plans/${c.slug}/`)}">30-60-90 day plan</a>.</p>`;
      pages.push({ path, crumbs, og: `/og/${c.slug}.png`, kind: 'Job description', name: `${c.title} job description template`, mcta: `<a class="btn btn-primary" href="${href('/for-employers/#quote')}">Team pricing</a>`,
        title: fitTitle(pick([`${c.title} Job Description Template (Free)`, `${c.title} Job Description Template`, `${c.short} Job Description Template`])),
        desc: clamp(`Free ${c.lower} job description template: summary, responsibilities, qualifications, skills, schedule and pay range guidance (${money(w.p25)}–${money(w.p75)}). Copy, customize and post.`),
        body: `${pageHero({ crumbs, eyebrow: 'Job description template', h1: `${esc(c.title)} Job Description Template`, lead: `A copy-ready ${esc(c.lower)} job description with responsibilities, qualifications, skills and pay guidance: customize it for your company in minutes.` })}<div class="wrap layout"><div class="prose">${main}</div><aside>${sideRole(path)}</aside></div>`,
        schema: [] });
    }

    // Onboarding plan
    {
      const path = `/employers/onboarding-plans/${c.slug}/`;
      const crumbs = [E, EH, ['Onboarding plans', '/employers/onboarding-plans/'], [c.title, path]];
      const mods = modules(c);
      const main = `${answerBox(`${c.title} onboarding at a glance`, `Week one covers orientation, safety and shadowing. Days 1–30 build vocabulary and supervised practice on core procedures; days 31–60 move to independent work with competency sign-offs; days 61–90 focus on full productivity, cross-training and a credential plan.`)}
<h2 id="before">Before day one</h2><ul class="checks"><li>Confirm start date, schedule, pay and supervisor in writing</li><li>Verify required credentials: ${c.certs.slice(0, 2).map(([n]) => esc(n)).join(', ')} (as applicable)</li><li>Prepare equipment and access: ${c.tools.slice(0, 4).map((t) => esc(lowerFirst(t))).join('; ')}</li><li>Assign a buddy or preceptor</li><li>Enroll the new hire in <a href="${href(c.trainingUrl)}">${esc(c.title)} training</a> so foundations are covered before or during week one</li></ul>
<h2 id="week-1">Week one: orient and protect</h2><ul><li>Workplace tour, emergency procedures and incident reporting</li>${c.safety.map((s) => `<li>${esc(s)}</li>`).join('')}<li>Shadow an experienced ${esc(c.lower)} through a full shift</li><li>Training modules 1–3: role foundations, a day on the job and essential vocabulary (${c.terms.length} terms)</li></ul>
<h2 id="days-1-30">Days 1–30: learn</h2><p><strong>Goal:</strong> perform core tasks safely under supervision.</p><ul>${c.howto.map((h) => `<li>Supervised practice: ${esc(taskPhrase(h.t))}</li>`).join('')}<li>Training modules 4–7: duties, step-by-step tasks, tools and safety</li><li>30-day check-in: confidence, questions and early wins</li></ul>
<h2 id="days-31-60">Days 31–60: contribute</h2><p><strong>Goal:</strong> handle a regular workload independently.</p><ul>${c.duties.slice(0, 4).map((d) => `<li>${esc(d)}: independently</li>`).join('')}<li>Competency sign-offs completed (see checklist below)</li><li>Training final knowledge check and ${esc(cfg.course.certificate.toLowerCase())}</li><li>60-day check-in</li></ul>
<h2 id="days-61-90">Days 61–90: own</h2><p><strong>Goal:</strong> full productivity and a growth plan.</p><ul><li>Meet productivity and quality targets for the role</li><li>Begin cross-training on a secondary task</li><li>Agree on a credential goal (for example, ${esc(c.certs[0][0])})</li><li>Discuss the career path: ${c.path.slice(0, 3).map(([t]) => esc(t)).join(' → ')}</li><li>90-day review</li></ul>
<h2 id="competency-checklist">Competency checklist</h2><div class="table-wrap"><table><thead><tr><th scope="col">Skill or task</th><th scope="col">Trained</th><th scope="col">Observed</th><th scope="col">Signed off</th></tr></thead><tbody>${[...c.howto.map((h) => h.t), ...c.hard.slice(0, 4)].map((t) => `<tr><td>${esc(t)}</td><td></td><td></td><td></td></tr>`).join('')}</tbody></table></div>
<h2 id="kpis">How to measure onboarding success</h2><ul>${ec.kpis.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>
<h2 id="training-map">How ${esc(c.title)} training maps to this plan</h2><ol>${mods.map(([t]) => `<li>${esc(t)}</li>`).join('')}</ol><div class="btn-row"><a class="btn btn-primary" href="${href('/for-employers/#quote')}">Get team pricing</a><button class="btn no-print" type="button" data-print>Print this plan</button></div>`;
      pages.push({ path, crumbs, og: `/og/${c.slug}.png`, kind: 'Onboarding plan', name: `${c.title} onboarding plan`, mcta: `<a class="btn btn-primary" href="${href('/for-employers/#quote')}">Team pricing</a>`,
        title: fitTitle(pick([`${c.title} Onboarding Plan: 30-60-90 Days`, `${c.title} Onboarding Plan`, `${c.short} Onboarding Plan: 30-60-90 Days`])),
        desc: clamp(`A 30-60-90 day onboarding plan for new ${c.pluralLower}: pre-start checklist, week-one safety, supervised practice, competency sign-offs, KPIs and a training map.`),
        body: `${pageHero({ crumbs, eyebrow: 'Onboarding plan', h1: `${esc(c.title)} Onboarding Plan (30-60-90 Days)`, lead: `A practical, printable plan to take a new ${esc(c.lower)} from first day to full productivity.` })}<div class="wrap layout"><div class="prose">${main}</div><aside>${sideRole(path)}</aside></div>`,
        schema: [{ '@type': 'HowTo', name: `${c.title} 30-60-90 day onboarding plan`, step: [['Before day one', 'Confirm logistics, verify credentials, prepare equipment, assign a buddy and enroll in role training.'], ['Week one', 'Orientation, safety training and shadowing.'], ['Days 1–30', 'Supervised practice on core procedures and foundational training.'], ['Days 31–60', 'Independent work with competency sign-offs.'], ['Days 61–90', 'Full productivity, cross-training and a credential plan.']].map(([n, t], i) => ({ '@type': 'HowToStep', position: i + 1, name: n, text: t })) }] });
    }
  }

  // ---------- Index pages ----------
  for (const [sub, h1, lead, title, desc] of [
    ['hiring-guides', 'Hiring Guides by Job Title', 'Pay benchmarks, qualifications, sourcing, screening checklists and interview questions for 50 roles.', 'Hiring Guides by Job Title (50 Roles)', `Free employer hiring guides for ${careers.length} job titles: BLS pay benchmarks, required qualifications, where to recruit, screening checklists and interview questions.`],
    ['job-descriptions', 'Job Description Templates', 'Copy-ready job descriptions with responsibilities, qualifications, skills and pay guidance for 50 roles.', 'Free Job Description Templates (50 Roles)', `Free job description templates for ${careers.length} roles in healthcare, trades, logistics, business, tech and more, with responsibilities, qualifications and pay ranges.`],
    ['onboarding-plans', 'Onboarding Plans by Job Title', '30-60-90 day onboarding plans with week-one safety, supervised practice, competency checklists and KPIs for 50 roles.', '30-60-90 Day Onboarding Plans by Job Title', `Free 30-60-90 day onboarding plans for ${careers.length} job titles, with pre-start checklists, safety, competency sign-offs and success metrics.`]
  ]) {
    const path = `/employers/${sub}/`;
    const crumbs = [E, EH, [h1, path]];
    pages.push({ path, crumbs, og: '/og/training.png', kind: 'Employers', name: h1, title: fitTitle(title), desc: clamp(desc),
      body: `${pageHero({ crumbs, eyebrow: 'Employer resources', h1, lead, meta: false })}<div class="wrap" style="padding-top:30px;padding-bottom:60px">${categories.map((cat) => `<section><h2>${icon(cat.slug, 26)} ${esc(cat.name)}</h2>${roleList(careers.filter((c) => c.cat === cat.slug), sub)}</section>`).join('')}</div>${band('Turn these plans into results.', 'Give every new hire the same strong foundation with job-title training.', 'See employer training', '/for-employers/', 'Get pricing', '/for-employers/#quote')}`,
      schema: [{ '@type': 'ItemList', itemListElement: careers.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/employers/${sub}/${c.slug}/`), name: c.title })) }] });
  }

  // ---------- ROI calculator ----------
  {
    const path = '/employers/training-roi-calculator/';
    const crumbs = [E, EH, ['Training ROI calculator', path]];
    const roles = careers.map((c) => `<option value="${c.l.wages.hourly}">${esc(c.title)} (${money2(c.l.wages.hourly)}/hr median)</option>`).join('');
    const faqs = [['How is training ROI calculated?', 'ROI = (total benefit − training cost) ÷ training cost. Benefit includes the value of faster ramp-up (wage cost of the productivity gap you recover) and savings from reduced early turnover (replacement costs avoided).'], ['What does it cost to replace an employee?', 'Estimates vary widely by role. Gallup has estimated the cost of replacing an employee at one-half to two times the employee’s annual salary, once recruiting, onboarding, lost productivity and errors are included. Use your own figures where you have them.'], ['Are these results guaranteed?', 'No. The calculator is a planning tool based on your assumptions. Actual results depend on your roles, processes and how training is implemented.']];
    const body = `${pageHero({ crumbs, eyebrow: 'Free employer tool', h1: 'Onboarding Training ROI Calculator', lead: 'Estimate what faster ramp-up and lower early turnover are worth to your organization: using your own numbers.', meta: false })}<div class="wrap layout"><div class="prose">
<form class="form-box" data-roi novalidate><h2>Your numbers</h2><div class="calc">
<div class="field"><label for="r-role">Role (fills median wage)</label><select id="r-role" name="role"><option value="">Custom</option>${roles}</select></div>
<div class="field"><label for="r-hires">New hires per year</label><input id="r-hires" name="hires" type="number" min="1" value="20" inputmode="numeric"></div>
<div class="field"><label for="r-wage">Average hourly wage ($)</label><input id="r-wage" name="wage" type="number" min="0" step="0.01" value="22"></div>
<div class="field"><label for="r-ramp">Weeks to full productivity today</label><input id="r-ramp" name="ramp" type="number" min="1" value="12"><div class="hint">Assumes productivity rises evenly to 100%.</div></div>
<div class="field"><label for="r-faster">Ramp-up time saved with training (%)</label><input id="r-faster" name="faster" type="number" min="0" max="90" value="15"></div>
<div class="field"><label for="r-turn">First-year turnover of new hires (%)</label><input id="r-turn" name="turn" type="number" min="0" max="100" value="30"></div>
<div class="field"><label for="r-turnred">Relative turnover reduction (%)</label><input id="r-turnred" name="turnred" type="number" min="0" max="100" value="10"></div>
<div class="field"><label for="r-replace">Cost to replace one hire (% of annual pay)</label><input id="r-replace" name="replace" type="number" min="0" max="300" value="50"></div>
<div class="field"><label for="r-cost">Training cost per learner ($)</label><input id="r-cost" name="cost" type="number" min="0" value="150"><div class="hint">Use your quote; this is a placeholder.</div></div>
</div>
<div class="calc-out" aria-live="polite"><div class="fact"><div class="k">Ramp-up value recovered</div><div class="v" data-out="ramp"></div></div><div class="fact"><div class="k">Turnover savings</div><div class="v" data-out="turn"></div></div><div class="fact"><div class="k">Training investment</div><div class="v" data-out="cost"></div></div><div class="fact"><div class="k">Net benefit</div><div class="v" data-out="net"></div></div><div class="fact"><div class="k">ROI</div><div class="v" data-out="roi"></div></div></div>
<p class="small muted">Estimates only. Annual pay = hourly wage × 2,080. Ramp-up value = hires × (weekly pay × weeks to productivity ÷ 2) × % time saved. Turnover savings = hires × turnover % × reduction % × replacement cost.</p></form>
<h2 id="assumptions">Choosing realistic assumptions</h2><ul><li><strong>Weeks to productivity:</strong> ask supervisors how long before a new hire works without close help. For skilled roles, 8–26 weeks is common.</li><li><strong>Ramp-up saved:</strong> start conservative (10–20%). Structured foundational training mainly shortens the “learning the basics” phase.</li><li><strong>Turnover:</strong> use your own first-year separation rate for the role.</li><li><strong>Replacement cost:</strong> include recruiting, interviewing, onboarding time, overtime to cover gaps and early-tenure errors.</li></ul>
${faqBlock(faqs)}${quoteForm(careers, 'employer', 'Get a quote for your team')}</div><aside>${ctaCard({ title: 'Plug in real pricing', text: 'Request a quote for your roles and headcount to replace the placeholder cost.', btn: 'Request pricing', link: '#quote' })}${sideLinks('Employer resources', [['Onboarding assessment', '/employers/onboarding-assessment/'], ['Onboarding plans by job', '/employers/onboarding-plans/'], ['Hiring guides by job', '/employers/hiring-guides/'], ['Employer training', '/for-employers/']])}</aside></div>`;
    pages.push({ path, crumbs, body, og: '/og/training.png', kind: 'Employers', name: 'Training ROI calculator', scripts: ['enroll', 'roi'],
      title: fitTitle('Employee Training ROI Calculator (Free)'), desc: clamp('Free onboarding training ROI calculator for employers: estimate the value of faster new-hire ramp-up and lower early turnover using your own wages, headcount and costs.'),
      schema: [faqSchema(faqs, path), { '@type': 'WebApplication', name: 'Onboarding Training ROI Calculator', applicationCategory: 'BusinessApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, url: abs(path) }] });
  }

  // ---------- Onboarding assessment (quiz) ----------
  {
    const path = '/employers/onboarding-assessment/';
    const crumbs = [E, EH, ['Onboarding assessment', path]];
    const qs = [
      'New hires receive a written plan for their first 30, 60 and 90 days',
      'Every new hire in the same role learns the same core content',
      'Role-specific safety training happens before hands-on work begins',
      'New hires learn the vocabulary of the job in a structured way',
      'We have competency checklists that supervisors sign off',
      'Trainers have time set aside for onboarding: it isn’t squeezed in',
      'New hires get scheduled check-ins at 30, 60 and 90 days',
      'We track time to productivity for each role',
      'We track 90-day retention and why early leavers quit',
      'Job postings accurately describe the day-to-day work'
    ];
    const opts = [['Not at all', 0], ['Partly', 1], ['Mostly', 2], ['Fully', 3]];
    const data = { type: 'points', max: 30, questions: qs.map(() => ({ options: opts.map(([, n]) => ({ w: { s: n } })) })), bands: [
      { min: 80, title: 'Strong onboarding foundation', text: 'Your program has the core elements in place. Focus on consistency across sites and measuring results.', links: [['Training ROI calculator', href('/employers/training-roi-calculator/')], ['Onboarding plans by job', href('/employers/onboarding-plans/')]] },
      { min: 55, title: 'Solid, with clear gaps', text: 'You have a structure, but some new hires are likely slipping through gaps. Standardizing role foundations and competency sign-offs is usually the fastest win.', links: [['Employer training options', href('/for-employers/')], ['New hire onboarding checklist', href('/resources/new-hire-onboarding-checklist/')]] },
      { min: 30, title: 'Inconsistent onboarding', text: 'Onboarding probably depends on who trains whom. A written 30-60-90 plan and a standard foundation course for each role will reduce variability quickly.', links: [['30-60-90 day plan template', href('/resources/30-60-90-day-onboarding-plan-template/')], ['Get team pricing', href('/for-employers/#quote')]] },
      { min: 0, title: 'Onboarding needs a rebuild', text: 'New hires are mostly learning on their own. Start with a simple plan, consistent role training and scheduled check-ins.', links: [['How to build an onboarding program', href('/employers/how-to-create-an-employee-onboarding-program/')], ['Talk to us', href('/for-employers/#quote')]] }] };
    const body = `${pageHero({ crumbs, eyebrow: 'Free employer assessment · 10 questions', h1: 'How Strong Is Your Onboarding Program?', lead: 'Rate 10 statements about how you onboard new hires and get an instant score with practical next steps.', meta: false })}<div class="wrap layout"><div class="prose">${answerBox('How it works', 'Choose how well each statement describes your organization today. Your score and recommendations appear instantly. Nothing is stored or sent.')}
<form class="quiz" data-quiz novalidate>${qs.map((q, i) => `<fieldset><legend><span class="qn">Statement ${i + 1} of ${qs.length}</span>${esc(q)}</legend><div class="opts">${opts.map(([l], v) => `<label class="opt"><input type="radio" name="q${i}" value="${v}" required><span>${l}</span></label>`).join('')}</div></fieldset>`).join('')}<div class="quiz-bar"><div class="progress" aria-hidden="true"><i></i></div><button class="btn btn-primary" type="submit">See my score</button></div></form><section class="results" aria-live="polite" tabindex="-1"></section><script type="application/json" id="quiz-data">${JSON.stringify(data)}</script></div><aside>${ctaCard({ title: 'Close the gaps faster', text: 'Job-title training standardizes the foundation for every new hire.', btn: 'See employer training', link: '/for-employers/' })}</aside></div>`;
    pages.push({ path, crumbs, body, og: '/og/training.png', kind: 'Employers', name: 'Onboarding assessment', scripts: ['quiz'],
      title: fitTitle('Onboarding Program Assessment (Free, 10 Questions)'), desc: clamp('How strong is your employee onboarding program? Rate 10 statements and get an instant score with practical next steps for plans, training, safety and retention.'), schema: [] });
  }

  // ---------- Employer resource center hub ----------
  {
    const path = '/employers/';
    const crumbs = [E, EH];
    const gs = empGuides();
    const faqs = buyerFaqs.slice(0, 4);
    const body = `${pageHero({ crumbs, eyebrow: 'For employers, recruiters & HR', h1: 'Employer Resource Center', lead: `Free hiring guides, job description templates, onboarding plans and tools for ${careers.length} job titles, plus onboarding training that gets new hires productive faster.`, meta: false, extra: `<div class="btn-row"><a class="btn btn-primary" href="${href('/for-employers/')}">Onboarding training for teams</a><a class="btn" href="${href('/employers/training-roi-calculator/')}">ROI calculator</a></div>` })}
<section class="section"><div class="wrap"><div class="grid">${[['Hiring guides by job', '/employers/hiring-guides/', `Pay benchmarks, screening and interview questions for ${careers.length} roles.`], ['Job description templates', '/employers/job-descriptions/', 'Copy-ready postings with pay-range guidance.'], ['Onboarding plans by job', '/employers/onboarding-plans/', '30-60-90 day plans with competency checklists.'], ['Training ROI calculator', '/employers/training-roi-calculator/', 'Estimate the value of faster ramp-up and retention.'], ['Onboarding assessment', '/employers/onboarding-assessment/', 'Score your onboarding program in 10 questions.'], ['Salary guide', '/salary-guide/', `BLS pay data for ${careers.length} roles.`]].map(([t, l, d]) => `<article class="card link"><h3><a class="stretch" href="${href(l)}">${t}</a></h3><p>${d}</p></article>`).join('')}</div></div></section>
<section class="section alt"><div class="wrap"><div class="section-head"><h2>Training for your organization</h2></div><div class="grid">${[['For employers', '/for-employers/', 'Onboarding training by job title for new hires and teams.'], ['For recruiters & staffing agencies', '/for-staffing-agencies/', 'Pre-placement training that makes candidates job-ready.'], ['For schools & workforce programs', '/for-workforce-programs/', 'Career exploration and job-role training for participants.']].map(([t, l, d]) => `<article class="card link aud"><h3><a class="stretch" href="${href(l)}">${t}</a></h3><p>${d}</p></article>`).join('')}</div><h3 style="margin-top:28px">By industry</h3><ul class="logos">${categories.map((cat) => `<li><a href="${href(`/for-employers/${cat.slug}/`)}">${esc(cat.name)}</a></li>`).join('')}</ul></div></section>
${gs.length ? `<section class="section"><div class="wrap"><div class="section-head"><h2>Hiring and onboarding guides</h2></div><div class="grid">${gs.map((g) => `<article class="card link"><h3><a class="stretch" href="${href(gp(g))}">${esc(g.title)}</a></h3><p>${esc(g.desc)}</p></article>`).join('')}</div></div></section>` : ''}
<section class="section alt"><div class="wrap"><div class="section-head"><h2>Free templates</h2></div><div class="grid">${empSheets().map((r) => `<article class="card link"><h3><a class="stretch" href="${href(`/resources/${r.slug}/`)}">${esc(r.title)}</a></h3><p>${esc(r.desc)}</p></article>`).join('')}</div></div></section>
<section class="section"><div class="wrap" style="max-width:860px">${faqBlock(faqs, 'Employer FAQ')}</div></section>
${band('Ready to standardize onboarding?', `Job-title training for ${careers.length} roles, with volume pricing.`, 'Request group pricing', '/for-employers/#quote', 'Calculate ROI', '/employers/training-roi-calculator/')}`;
    pages.push({ path, crumbs, body, og: '/og/training.png', kind: 'Employers', name: 'Employer resource center',
      title: fitTitle('Employer Resources: Hiring & Onboarding Tools'), desc: clamp(`Free employer resources: hiring guides, job description templates and 30-60-90 onboarding plans for ${careers.length} job titles, an ROI calculator and onboarding training for teams.`), schema: [faqSchema(faqs, path)] });
  }
  return pages;
}
