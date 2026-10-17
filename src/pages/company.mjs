import cfg from '../../site.config.mjs';
import { esc, href, abs, clamp, fitTitle, md, fmtDate } from '../lib/util.mjs';
import { pageHero, faqBlock, faqSchema, ctaCard, sideLinks, answerBox, band } from '../lib/layout.mjs';
import { typeformEmbed } from '../lib/forms.mjs';
import { partnerById, partnerCourses, partnerTable } from '../lib/partners.mjs';

export const companyFaqs = [
  ['What is Career Education Institute?', 'Career Education Institute is a U.S. online training company that offers general career training by job title, plus free career resources: career profiles with BLS salary data, quizzes, step-by-step job guides and college and career-change guides.'],
  ['How do the trainings work?', `Each training is a self-paced online course on our learning platform (LMS). Lessons cover what the job involves, a typical day, key vocabulary, common procedures, safety, tools and how to launch your career, ending with a final knowledge check and a ${cfg.course.certificate.toLowerCase()}.`],
  ['Are the courses accredited, and will I get a license?', 'No. Our trainings are general, non-credit career-preparation courses. They do not grant academic credit, state licenses or industry certifications, and they do not replace state-required training programs. They help you understand a career and prepare for formal training, exams and interviews.'],
  ['How do I enroll?', `Open the training you want and complete the enrollment form on its page. It opens a pre-filled email to our team at ${cfg.enrollTo}. We reply with your payment link or invoice and your login details. CDL ELDT, forklift operator, flagger and mold inspector courses can be bought instantly at checkout. You can also call ${cfg.phone}.`],
  ['Do you offer training for employers and groups?', `Yes. Employers, staffing agencies, schools and workforce programs use our job-title trainings for onboarding, pre-placement and career exploration. ${cfg.course.groupNote}.`],
  ['Who can use Career Education Institute?', 'Our services and website are intended for people in the United States. Our policies are designed to comply with U.S. federal and state law only.'],
  ['Is the career information free?', 'Yes. All career profiles, salary data, quizzes, guides, worksheets and practice tests are free to use without an account.']
];

export function companyPages(ctx) {
  const { careers, labor, categories } = ctx;
  const pages = [];
  const simple = (path, crumbName, h1, lead, main, aside, extra = {}) => {
    const crumbs = [['Home', '/'], [crumbName, path]];
    pages.push({ path, crumbs, og: '/og/default.png', kind: 'Page', name: crumbName, body: `${pageHero({ crumbs, eyebrow: extra.eyebrow || 'Career Education Institute', h1, lead, meta: extra.meta ?? false })}<div class="wrap layout"><div class="prose">${main}</div><aside>${aside}</aside></div>`, ...extra });
  };

  // About
  simple('/about/', 'About', 'About Career Education Institute', 'We help people in the United States choose a career with clear eyes, and learn how the job is really done before day one.',
    md(`## Our mission
Most people choose careers with surprisingly little information. Job postings list duties, but not what a Tuesday actually feels like. Salary sites disagree. Training programs sell the dream, not the day-to-day.

Career Education Institute exists to fix that. We publish free, plain-language profiles of ${careers.length} in-demand careers: what the work involves hour by hour, what it pays according to official government data, how to get in and what vocabulary and procedures you’ll need. Then we offer practical online training for each job title so you can learn the role before you commit time and money to it.

## Who we serve
- **Students** deciding between college, community college, trade school and apprenticeships
- **Adults changing careers** who need a realistic, efficient path into a new field
- **Working professionals** who want to grow in the job they have
- **Employers, staffing agencies and workforce programs** that need consistent onboarding and pre-placement training

## How we build our content
Every career profile combines official labor-market data from the U.S. Bureau of Labor Statistics with practical knowledge of how each job is done. Pay figures are national estimates from the BLS Occupational Employment and Wage Statistics program (${labor.meta.oewsLabel}), and job outlook figures come from BLS Employment Projections (${labor.meta.projections}). Each page shows the date it was last updated. Read our [editorial policy](/editorial-policy/) for details.

## What our trainings are, and aren’t
Our courses are general, non-credit career-preparation trainings. They teach what a role involves, the vocabulary, common procedures, safety and how to launch your career. They do not grant licenses, certifications or academic credit, and they don’t replace state-required programs. We’re upfront about that because trust matters more than a sale.

## Serving the United States
Career Education Institute serves learners in the United States. Our website and policies are designed to comply with U.S. federal and state law only.

## Contact us
Phone: [${cfg.phone}](tel:${cfg.phoneE164}) · Email: [${cfg.email}](mailto:${cfg.email})`).html,
    `${ctaCard({ title: 'Start exploring', text: 'Find careers that fit your interests in about four minutes.', btn: 'Take the Career Match Quiz', link: '/quizzes/career-match/' })}${sideLinks('Company', [['How it works', '/how-it-works/'], ['Editorial policy', '/editorial-policy/'], ['Contact', '/contact/'], ['For employers', '/for-employers/']])}`,
    { title: fitTitle('About Career Education Institute: Our Mission & Approach'), desc: clamp(`Career Education Institute helps U.S. students, career changers and employers with free career information for ${careers.length} jobs and practical online training by job title. Learn about our mission and data.`), pageType: 'AboutPage', schema: [] });

  // How it works
  simple('/how-it-works/', 'How it works', 'How Career Education Institute Works', 'From “what should I do?” to day one on the job, in four steps.',
    `<ol class="steps"><li><h3>Explore careers for free</h3><p>Browse ${careers.length} career profiles with day-in-the-life details, BLS pay data, skills, vocabulary and step-by-step task guides. Take the <a href="${href('/quizzes/career-match/')}">Career Match Quiz</a> if you’re not sure where to start.</p></li><li><h3>Pick your training</h3><p>Every career has a matching <a href="${href('/training/')}">job-title training</a> covering the role, a typical day, key vocabulary, common procedures, safety, tools and career launch. Try the free practice test first.</p></li><li><h3>Send your enrollment request</h3><p>Fill out the short form on any training page. It opens a pre-filled email to our team, and nothing is stored on the website. We reply with your payment link or invoice and your learning-platform login. CDL ELDT, forklift operator, flagger and mold inspector courses can be bought online right away.</p></li><li><h3>Learn at your own pace</h3><p>Work through the modules on our online learning platform (LMS). Courses take 6 to 14 hours and include ${esc(cfg.course.access)}. Pass the final knowledge check to earn your ${esc(cfg.course.certificate.toLowerCase())}.</p></li></ol>
<h2>For teams</h2><p>Employers, staffing agencies and workforce programs can enroll groups of learners with a single request. See <a href="${href('/for-employers/')}">training for employers</a>.</p>${faqBlock(companyFaqs.slice(1, 5))}`,
    ctaCard({ title: 'Ready to start?', text: 'Choose a training and enroll from its page.', btn: 'Enroll now', link: '/enroll/' }),
    { title: fitTitle('How Career Education Institute Works (4 Simple Steps)'), desc: clamp('How Career Education Institute works: explore careers free, choose a job-title training, send a quick enrollment request by email and learn at your own pace online with a certificate of completion.'), schema: [faqSchema(companyFaqs.slice(1, 5), '/how-it-works/')] });

  // Enroll
  {
    const path = '/enroll/';
    const crumbs = [['Home', '/'], ['Enroll', path]];
    const row = (c) => {
      const m = c.replacedBy && partnerById[c.replacedBy];
      return m ? `<li><a href="${href(`/checkout/?course=${m.slug}`)}">${esc(c.title)}: ${esc(m.short)}</a> <span class="muted small">${m.hoursNum} hours · $${m.price.toFixed(2)} · buy online</span></li>`
        : `<li><a href="${href(`${c.trainingUrl}#enroll`)}">${esc(c.title)} Training</a> <span class="muted small">${c.hours} hours · $${c.price.toFixed(2)}</span></li>`;
    };
    pages.push({ path, crumbs, og: '/og/training.png', kind: 'Page', name: 'Enroll in a training',
      title: fitTitle('Enroll in Online Career Training'), desc: clamp(`Enroll in any of ${careers.length} Career Education Institute career trainings. Pick your training, then use the short form on its page or buy job-title courses online.`),
      body: `${pageHero({ crumbs, eyebrow: 'Enrollment', h1: 'Enroll in a Training', lead: 'Choose your training below. Each training page has a short enrollment form for that course, and a few job-title courses can be bought online right away.' })}<div class="wrap layout"><div class="prose"><h2>Choose your training</h2><p>Select a training to open its enrollment form. Prices are per learner, with volume pricing from 2 learners.</p>${categories.map((cat) => `<h3>${esc(cat.name)}</h3><ul class="enroll-list">${careers.filter((c) => c.cat === cat.slug).map(row).join('')}</ul>`).join('')}
<h2>Buy online now</h2><p>These job-title courses come from our affiliated training provider and can be bought online with instant enrollment.</p>${partnerTable(partnerCourses.filter((p) => !careers.some((c) => c.replacedBy === p.id)), { caption: 'Job-title courses to buy online' })}
<h2>What happens next</h2><ol><li>Open your training and complete its enrollment form. Your email app opens with your request, just press send.</li><li>Our team replies by email, usually within one business day, with a payment link or invoice for the listed price.</li><li>After payment, you receive your login to our online learning platform.</li><li>Start learning right away, at your own pace.</li></ol>${faqBlock(companyFaqs.slice(2, 6))}</div><aside>${sideLinks('Not sure which course?', [['Career Match Quiz', '/quizzes/career-match/'], ['Browse all trainings', '/training/'], ['Courses to buy online', '/courses/'], ['Group & employer training', '/for-employers/'], ['Contact us', '/contact/']])}</aside></div>`,
      schema: [faqSchema(companyFaqs.slice(2, 6), path)] });
  }

  // Contact
  {
    const path = '/contact/';
    const crumbs = [['Home', '/'], ['Contact', path]];
    pages.push({ path, crumbs, og: '/og/default.png', kind: 'Page', name: 'Contact us', pageType: 'ContactPage',
      title: fitTitle('Contact Career Education Institute'), desc: clamp(`Contact Career Education Institute by phone at ${cfg.phone} or email ${cfg.email}. Questions about courses, group training, billing, accessibility or privacy requests are welcome.`),
      body: `${pageHero({ crumbs, eyebrow: 'We’re here to help', h1: 'Contact Us', lead: 'Questions about a course, group training, billing, accessibility or your privacy? Reach us by phone, email or the form below.' })}<div class="wrap layout"><div class="prose"><div class="cols"><div><h3>Phone</h3><p><a href="tel:${cfg.phoneE164}">${cfg.phone}</a></p></div><div><h3>Email</h3><p><a href="mailto:${cfg.email}">${cfg.email}</a></p></div></div><p style="margin-top:1em">For privacy requests (access, deletion, correction or opt-out), email us with the subject “Privacy Request” or see <a href="${href('/your-privacy-choices/')}">Your Privacy Choices</a>. For accessibility help, call or email us, or mention it in your message.</p><h2 id="message">Send us a message</h2>${typeformEmbed(cfg.forms.contact, 830)}</div><aside>${sideLinks('Quick links', [['Enroll in a training', '/enroll/'], ['FAQ', '/faq/'], ['Employer training', '/for-employers/'], ['Privacy Policy', '/privacy-policy/']])}</aside></div>`, schema: [] });
  }

  // FAQ
  simple('/faq/', 'FAQ', 'Frequently Asked Questions', 'Answers about our trainings, enrollment, pricing, certificates and how we handle your information.',
    `${faqBlock(companyFaqs, 'General questions', 'general')}${faqBlock([['How much do trainings cost?', `Job-title trainings cost $59.99 to $129.99 per learner, based on course length (6 to 14 hours). The price is listed on each training page. CDL ELDT, forklift operator, flagger and mold inspector courses are priced on their course pages and can be bought online. ${cfg.course.groupNote}.`], ['How long do I have access?', `${cfg.course.access}.`], ['What is your refund policy?', `See our <a href="${href('/refund-policy/')}">Refund Policy</a> for details.`], ['Do I need any special software?', 'Just a modern web browser and an internet connection. Courses work on computers, tablets and phones.'], ['Can I get a receipt or invoice for my employer?', 'Yes. Ask our team when you enroll and we’ll provide one.']], 'Pricing, access and billing', 'billing')}${faqBlock([['Do you sell my personal information?', `No. We do not sell or share personal information for cross-context behavioral advertising. See our <a href="${href('/privacy-policy/')}">Privacy Policy</a>.`], ['Is the website accessible?', `We aim to meet WCAG 2.1 Level AA. If anything is hard to use, contact us: see our <a href="${href('/accessibility/')}">Accessibility Statement</a>.`], ['Can people outside the U.S. enroll?', 'Our services are intended for U.S. residents, and our policies are designed for U.S. law only.']], 'Privacy and accessibility', 'privacy')}`,
    ctaCard({ title: 'Still have questions?', text: `Call ${cfg.phone} or email ${cfg.email}.`, btn: 'Contact us', link: '/contact/' }),
    { title: fitTitle('FAQ: Courses, Enrollment, Pricing & Privacy'), desc: clamp('Answers to common questions about Career Education Institute trainings: how courses work, enrollment, pricing, access, certificates, refunds, privacy and who can enroll.'), schema: [{ '@type': 'FAQPage', '@id': abs('/faq/') + '#faq', mainEntity: companyFaqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }] });

  // Editorial policy
  simple('/editorial-policy/', 'Editorial policy', 'Editorial Policy & Data Sources', 'How we research, write, review and update career information, and where our numbers come from.',
    md(`## Our standards
- **Accuracy first.** Facts about pay, growth and education come from official U.S. government sources. Practical content about how jobs are done is written and reviewed by our curriculum team against industry standards, regulatory guidance and employer expectations.
- **Plain language.** We write for real people making real decisions: no jargon without a definition.
- **Honesty about limits.** We say what our trainings do and don’t provide, label estimates as estimates and note when requirements vary by state.
- **Independence.** No employer, school or advertiser pays to be included or ranked on our lists.

## Data sources
| Data | Source | Current release |
|---|---|---|
| Wages (median and percentiles) | U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics | ${labor.meta.oewsLabel} |
| Employment, growth and openings | BLS Employment Projections, Table 1.2 | ${labor.meta.projections} |
| Typical entry education and training | BLS Employment Projections education and training categories | ${labor.meta.projections} |
| Occupation definitions | Standard Occupational Classification (SOC) and O*NET | 2018 SOC |

Data was last checked on ${fmtDate(labor.meta.fetched)}. BLS releases new wage estimates each spring and new projections each fall; we update after each release.

## How we map careers to data
Each career is matched to the closest SOC occupation. Some job titles are narrower or broader than their SOC category (for example, “medical billing and coding specialist” maps to “medical records specialists”), so figures should be read as close estimates for the role.

## Review and updates
Every page shows a “last updated” date. We review career content at least annually and whenever regulations, credentials or data change. Corrections can be sent to [${cfg.email}](mailto:${cfg.email}).

## Safety and how-to content
Step-by-step guides are general educational overviews. They are not a substitute for hands-on training, supervision, manufacturer instructions or legal requirements. Readers should always follow employer procedures and applicable regulations.

## Use of AI tools
We may use software tools, including AI-assisted tools, to help draft, organize or check content. All published content is reviewed by our team, and facts and figures are verified against the sources listed above.`).html,
    sideLinks('Related', [['About us', '/about/'], ['Salary guide', '/salary-guide/'], ['Disclaimer', '/disclaimer/']]),
    { title: fitTitle('Editorial Policy & Data Sources'), desc: clamp('How Career Education Institute researches, writes and updates career content, including our BLS wage and projections data sources, review process and corrections policy.'), schema: [] });

  return pages;
}
