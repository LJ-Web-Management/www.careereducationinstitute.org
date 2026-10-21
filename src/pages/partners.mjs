// Partner discount program: school districts, colleges, companies and organizations get a code
// that gives their people a discount on job-title trainings, and earn a share of each sale.
// Rates live in site.config.mjs → partnerProgram.
import cfg from '../../site.config.mjs';
import { esc, href, abs, money2, clamp, fitTitle, countLabel } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, ctaCard, sideLinks, answerBox } from '../lib/layout.mjs';
import { partnerForm } from '../lib/forms.mjs';
import { priceForHours } from '../data/course-pricing.mjs';

const { discount, share, linkDays } = cfg.partnerProgram;
const D = `${Math.round(discount * 100)}%`;
const S = `${Math.round(share * 100)}%`;
const cents = (n) => Math.round(n * 100) / 100;
const withCode = (price) => cents(price * (1 - discount));
const earned = (price) => cents(withCode(price) * share);
const HUB = '/partners/';
// Example list prices for the payout table and FAQ (never shown against course hours)
const PRICES = [...new Set(Object.values(priceForHours))].sort((a, b) => a - b);

const entities = [
  {
    slug: 'school-districts', type: 'School district', name: 'School districts', crumb: 'School districts',
    h1: 'Career Training Discount Codes for School Districts', title: 'Career Training Discount Codes for School Districts',
    people: 'students, families and staff', owner: 'district',
    lead: `Give students, families and staff ${D} off online career training by job title, and earn ${S} of every sale made with your district’s code.`,
    card: 'For students exploring careers, families planning next steps and staff building new skills.',
    who: ['High school students exploring careers and CTE pathways', 'Parents and guardians helping a student plan the next step', 'Teachers, counselors and support staff building new skills', 'Recent graduates and adult education learners'],
    ways: ['Counseling and career center web pages', 'CTE and career pathway classes', 'Family newsletters and district apps', 'Career days and college and career fairs'],
    courses: ['medical-assistant', 'certified-nursing-assistant', 'electrician', 'hvac-technician', 'it-support-specialist', 'welder'],
    faq: ['Can high school students use the code?', 'Yes. Students under 18 enroll with a parent or guardian, who confirms this on the enrollment form. Our trainings are general, non-credit career-exploration courses, so they fit alongside CTE pathways, advisory lessons and career days.']
  },
  {
    slug: 'colleges', type: 'College or university', name: 'Colleges and universities', crumb: 'Colleges',
    h1: 'Career Training Discount Codes for Colleges', title: 'Career Training Discount Codes for Colleges',
    people: 'students, alumni and staff', owner: 'college',
    lead: `Give students, alumni and continuing-education learners ${D} off online career training, and earn ${S} of every sale made with your college’s code.`,
    card: 'For students choosing a path, alumni changing careers and continuing-education learners.',
    who: ['Students exploring majors and career paths', 'Alumni changing careers or moving up', 'Continuing-education and workforce learners', 'Faculty and staff building new skills'],
    ways: ['Career services and advising pages', 'Continuing-education catalogs', 'Alumni newsletters and associations', 'Orientation and career fair materials'],
    courses: ['medical-assistant', 'pharmacy-technician', 'medical-billing-and-coding-specialist', 'cybersecurity-analyst', 'project-manager', 'registered-nurse'],
    faq: ['Do the trainings count for college credit?', 'No. They are general, non-credit career-preparation courses. Colleges can share them through career services or continuing education as a low-cost way for students to explore a field before committing to a program.']
  },
  {
    slug: 'companies', type: 'Company', name: 'Companies', crumb: 'Companies',
    h1: 'Career Training Discount Codes for Companies', title: 'Career Training Discount Codes for Companies',
    people: 'employees, candidates and customers', owner: 'company',
    lead: `Give employees, new hires, job candidates and customers ${D} off online career training by job title, and earn ${S} of every sale made with your company’s code.`,
    card: 'For employees, new hires, job candidates and the customers you serve.',
    who: ['Employees growing in their role or moving to a new one', 'New hires preparing for day one', 'Job candidates in your talent pipeline', 'Customers, clients and members of your community'],
    ways: ['Employee intranet and benefits pages', 'Offer letters and onboarding packets', 'Recruiting and careers pages', 'Customer emails and newsletters'],
    courses: ['customer-service-representative', 'administrative-assistant', 'warehouse-associate', 'security-guard', 'it-support-specialist', 'project-manager'],
    faq: ['Can our employees use the code?', `Yes. Employees, new hires, job candidates and customers can all use it. If your company would rather pay for a group of learners directly, see <a href="${href('/for-employers/')}">training for employers</a> for volume pricing.`]
  },
  {
    slug: 'organizations', type: 'Organization or nonprofit', name: 'Organizations and nonprofits', crumb: 'Organizations',
    h1: 'Career Training Discount Codes for Organizations', title: 'Career Training Discount Codes for Organizations',
    people: 'members, clients and participants', owner: 'organization',
    lead: `Give members, clients and program participants ${D} off online career training, and earn ${S} of every sale made with your organization’s code.`,
    card: 'For nonprofits, workforce boards, associations, unions and community groups.',
    who: ['Members of associations, unions and clubs', 'Job seekers in workforce and reentry programs', 'Veterans and military families', 'Clients of community and faith-based programs'],
    ways: ['Member newsletters and portals', 'Workforce and case-management sessions', 'Social media and community events', 'Resource pages and referral lists'],
    courses: ['certified-nursing-assistant', 'phlebotomist', 'construction-laborer', 'hvac-technician', 'customer-service-representative', 'welder'],
    faq: ['What kinds of organizations can join?', 'Nonprofits, workforce boards, professional and trade associations, unions, community and faith-based groups, veterans organizations, libraries and reentry programs, among others.']
  }
];

const faqs = (n) => [
  ['How does the partner discount program work?', `We give your school district, college, company or organization its own discount code. Anyone you share it with saves ${D} on our ${countLabel(n)} job-title trainings, and you earn ${S} of the sale price after the discount on every enrollment that uses your code.`],
  ['Does it cost anything to join?', 'No. Joining the partner program is free.'],
  ['How much do we earn?', `${S} of the price the learner pays after the ${D} discount. For example, on a training listed at ${money2(PRICES[1])}, the learner pays ${money2(withCode(PRICES[1]))} with your code and you earn ${money2(earned(PRICES[1]))}.`],
  ['How do learners use the code?', `The easiest way is your share link, which fills the code in for them. They can also type it in: in the “Discount code” box at checkout for courses bought online, or in the “Partner discount code” field of the enrollment form for other trainings. The ${D} discount is applied at checkout, or to their payment link or invoice.`],
  ['How does the share link work?', `Add ?code= and your code to the end of any link to our site. For the next ${linkDays} days, the code is filled in for that person at checkout and on enrollment forms, even if they browse other pages first.`],
  ['How do you track enrollments and pay our share?', 'Each partner gets its own code, so every enrollment that uses it is credited to you. We confirm payout details, such as timing and payment method, by email when we issue your code.'],
  ['Who can join?', 'School districts, colleges and universities, companies and organizations in the United States.']
];

const steps = (people) => `<ol class="steps"><li><h3>Sign up</h3><p>Fill out the short form on this page. It opens a pre-filled email to our team.</p></li><li><h3>Get your code</h3><p>We reply with your own discount code and program details, usually within one business day.</p></li><li><h3>Share it</h3><p>Give your ${esc(people)} the code, or a link that fills it in for them. They use it at checkout or on the enrollment form of any training.</p></li><li><h3>They save, you earn</h3><p>Each learner saves ${D} on their training, and you earn ${S} of the sale price after the discount.</p></li></ol>`;

const earningsTable = () => `<div class="table-wrap"><table><caption>Example training prices with a partner code, per learner</caption><thead><tr><th scope="col">List price</th><th scope="col">Price with your code</th><th scope="col">You earn (${S})</th></tr></thead><tbody>${PRICES.map((p) => `<tr><th scope="row">${money2(p)}</th><td>${money2(withCode(p))}</td><td><strong>${money2(earned(p))}</strong></td></tr>`).join('')}</tbody></table></div><p class="small muted">Your share is ${S} of what the learner pays after the ${D} discount, rounded to the cent. Ten learners in ${money2(PRICES[2])} trainings, for example, earn you ${money2(cents(earned(PRICES[2]) * 10))}.</p>`;

const shareLink = (people) => `<h2 id="share-link">Share a link with your code built in</h2><p>Add your code to the end of any link to our site and it is filled in for your ${esc(people)} at checkout and on enrollment forms for the next ${linkDays} days. For example:</p><p><code class="share-link">${esc(abs('/training/'))}?code=YOURCODE</code></p><p>Link to our <a href="${href('/training/')}">training catalog</a>, the <a href="${href('/courses/')}">courses you can buy online</a> or a single training page, and replace YOURCODE with the code we send you.</p>`;

const note = '<aside class="callout info"><p>Career Education Institute trainings are general, non-credit career-preparation courses. They do not grant academic credit, licenses or industry certifications, and they do not replace state-required training programs.</p></aside>';

const aside = (current) => `${ctaCard({ title: 'Get your discount code', text: `Your people save ${D}. You earn ${S} of every sale. Joining is free.`, btn: 'Sign up', link: `${current}#signup` })}${sideLinks('Partner program', [['Program overview', HUB], ...entities.map((e) => [`For ${e.name.toLowerCase()}`, `${HUB}${e.slug}/`])].filter(([, l]) => l !== current))}`;

export function partnerPages(ctx) {
  const { careers, byslug } = ctx;
  const n = careers.length;
  const common = faqs(n);
  const pages = [];
  const service = (name, path, audience) => ({ '@type': 'Service', name, serviceType: 'Career training discount partner program', provider: { '@id': abs('/#org') }, areaServed: { '@type': 'Country', name: 'United States' }, audience: { '@type': 'Audience', audienceType: audience }, url: abs(path) });

  // Hub
  {
    const path = HUB;
    const crumbs = [['Home', '/'], ['Partner program', path]];
    pages.push({ path, crumbs, og: '/og/partners.png', kind: 'Page', name: 'Partner discount program', scripts: ['enroll'],
      title: fitTitle('Partner Discount Program'), desc: clamp(`Partner discount program for school districts, colleges, companies and organizations: share a code worth ${D} off career training and earn ${S} of every sale.`),
      mcta: `<a class="btn btn-primary" href="#signup">Get your discount code</a>`,
      body: `${pageHero({ crumbs, eyebrow: 'Partner program', h1: 'Partner Discount Program', lead: `School districts, colleges, companies and organizations can share a code that gives their people ${D} off career training by job title, and earn ${S} of every sale made with it.`, meta: false, extra: '<div class="btn-row"><a class="btn btn-primary" href="#signup">Get your discount code</a><a class="btn" href="#earnings">See what you earn</a></div>' })}<div class="wrap layout"><div class="prose">
${answerBox('The short version', `Sign up and we email you a unique discount code. Anyone who uses it saves ${D} on our ${countLabel(n)} job-title trainings, and you earn ${S} of each sale price after the discount. Joining is free.`)}
<h2 id="partner-types">Choose your partner type</h2><div class="grid-2">${entities.map((e) => `<article class="card link"><h3><a class="stretch" href="${href(`${HUB}${e.slug}/`)}">${esc(e.name)}</a></h3><p>${esc(e.card)}</p></article>`).join('')}</div>
<h2 id="how">How the program works</h2>${steps('students, employees, members or customers')}
${shareLink('students, employees, members or customers')}
<h2 id="earnings">What your people save and what you earn</h2>${earningsTable()}
${partnerForm()}
${faqBlock(common, 'Partner program questions')}${note}</div>
<aside>${aside(path)}</aside></div>`,
      schema: [faqSchema(common, path), service('Partner Discount Program', path, 'School districts, colleges, companies and organizations')] });
  }

  // One page per partner type
  for (const e of entities) {
    const path = `${HUB}${e.slug}/`;
    const crumbs = [['Home', '/'], ['Partner program', HUB], [e.crumb, path]];
    const list = [e.faq, ...common];
    const courses = e.courses.map((s) => byslug[s]).filter((c) => c && !c.replacedBy);
    pages.push({ path, crumbs, og: '/og/partners.png', kind: 'Page', name: e.h1, scripts: ['enroll'],
      title: fitTitle(e.title), desc: clamp(`Partner program for ${e.name.toLowerCase()}: give your ${e.people} ${D} off online career training and earn ${S} of every sale.`),
      mcta: `<a class="btn btn-primary" href="#signup">Get your discount code</a>`,
      body: `${pageHero({ crumbs, eyebrow: `Partner program for ${e.name.toLowerCase()}`, h1: esc(e.h1), lead: e.lead, meta: false, extra: '<div class="btn-row"><a class="btn btn-primary" href="#signup">Get your discount code</a><a class="btn" href="#earnings">See what you earn</a></div>' })}<div class="wrap layout"><div class="prose">
${answerBox('How it works', `Your ${e.owner} gets its own discount code to share with your ${esc(e.people)}. They save ${D} on any of our ${countLabel(n)} job-title trainings, and your ${e.owner} earns ${S} of each sale price after the discount. Joining is free.`)}
<h2 id="who">Who can use your code</h2><ul class="checks">${e.who.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
<h2 id="how">How the program works</h2>${steps(e.people)}
<h2 id="earnings">What your people save and what you earn</h2>${earningsTable()}
<h2 id="share">Ways to share your code</h2><ul class="checks">${e.ways.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
${shareLink(e.people)}
<h2 id="popular">Popular trainings for your ${esc(e.people)}</h2><div class="grid-2">${courses.map((c) => `<article class="card link"><h3><a class="stretch" href="${href(c.trainingUrl)}">${esc(c.title)} Training</a></h3><p class="small">${money2(withCode(c.price))} with your code (list ${money2(c.price)})</p></article>`).join('')}</div>
<p><a href="${href('/training/')}">Browse all ${countLabel(n)} job-title trainings</a></p>
${partnerForm({ type: e.type })}
${faqBlock(list, 'Partner program questions')}${note}</div>
<aside>${aside(path)}</aside></div>`,
      schema: [faqSchema(list, path), service(e.h1, path, e.name)] });
  }
  return pages;
}
