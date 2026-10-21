import cfg from '../../site.config.mjs';
import { href, clamp, fitTitle, md, fmtDate } from '../lib/util.mjs';
import { pageHero, sideLinks } from '../lib/layout.mjs';

const D = fmtDate(cfg.updated);
const companySite = `[${cfg.legalUrl.replace(/^https?:\/\/(www\.)?/, '')}](${cfg.legalUrl})`;
// Names the operating company and defines “we” at the top of every legal page.
const who = (doc) => `${cfg.name} is operated by ${cfg.legalName} (${companySite}). In ${doc}, “${cfg.name},” “we,” “us” and “our” mean ${cfg.legalName}.`;
// The provider courses come from another training brand of the same company.
const sister = `${cfg.checkout.provider}, a training brand we also operate`;
const contact = `**${cfg.legalName}**, operator of ${cfg.name}  \nWebsite: ${companySite}  \nPhone: [${cfg.phone}](tel:${cfg.phoneE164})  \nEmail: [${cfg.email}](mailto:${cfg.email})`;
const usOnly = `> **U.S.-only notice:** This website and the services offered through it are intended solely for individuals located in the United States. This policy is designed to comply with applicable U.S. federal and state laws only. The website is **not** designed to comply with the laws of any other country or jurisdiction, including the European Union or United Kingdom General Data Protection Regulation (GDPR), Canada’s PIPEDA, Brazil’s LGPD or similar laws. If you access the website from outside the United States, you do so on your own initiative, and any information you provide will be processed in the United States under U.S. law.`;

const docs = [
  { slug: 'privacy-policy', title: 'Privacy Policy', desc: 'How Career Education Institute collects, uses and protects personal information, your U.S. state privacy rights (including California) and how to contact us. U.S.-only service.',
    body: `**Effective date and last updated:** ${D}

${usOnly}

${who('this policy')}

This Privacy Policy explains how we collect, uses, discloses and protects personal information when you visit our website, use our free tools, request enrollment or take our courses. It also explains the privacy rights available to you under U.S. federal and state law.

## 1. Information we collect
### Information you give us
- **Enrollment and partner program requests.** Our enrollment and partner sign-up forms do not send or store your information on this website. When you press the submit button, your own email application opens with a pre-filled message. If you choose to send it, we receive what you include, typically your name, email address, phone number (optional), state, course of interest, number of learners, organization (for group and partner requests), any partner discount code and any message.
- **Contact and newsletter forms.** Our contact form and our newsletter sign-up and unsubscribe forms are hosted by a third-party form provider. What you enter there (for example, your name, email address, phone number, company and message) is collected by that provider and shared with us so we can reply to you or manage your newsletter subscription.
- **Course enrollment and payment.** When you enroll, we collect the information needed to create your learning-platform (LMS) account and process payment.
- **Online checkout.** When you buy a course on our checkout page, the details you enter (name, email, phone, company, billing address and number of learners) are sent to the learning platform of ${sister}, to create your learner account and order. Your card details are entered into a secure form provided by Stripe, Inc. and go directly to Stripe. We never see or store full card numbers.
- **Communications.** Emails, calls and messages you send us.

### Information collected automatically
- **Hosting logs.** Our website is hosted by a third-party provider (currently GitHub Pages), which may automatically log technical information such as IP address, browser type, pages requested and date/time for security and operations. See GitHub’s privacy statement for details.
- **Browser storage.** We do not use advertising cookies. Google Analytics sets analytics cookies, described below. On the checkout page only, Stripe’s secure card form may set cookies and collect device information to prevent fraud, under Stripe’s privacy policy. We may store small preferences and your cart in your browser’s local storage (for example, your analytics opt-out choice or the courses you added to your cart). Your cart stays in your browser and is not sent to us until you check out or send an enrollment request. Quiz answers are processed entirely in your browser and are not transmitted or saved by us.
- **Analytics.** We use Google Analytics to collect pseudonymous usage information (pages viewed, approximate location, device type), with Google signals and ad personalization turned off. Analytics does not load if your browser sends a Global Privacy Control (GPC) signal or if you opt out on our [Your Privacy Choices](/your-privacy-choices/) page.

### Information from others
- Employers, staffing agencies or workforce programs that enroll you as part of a group may provide your name, work email and course assignment.

## 2. How we use information
- To respond to inquiries and process enrollment requests
- To create and manage LMS accounts, deliver courses and issue certificates of completion
- To process payments, invoices and refunds
- To provide customer support and accessibility accommodations
- To send service messages about your enrollment and, with your consent where required, occasional updates (you can unsubscribe at any time)
- To maintain security, prevent fraud and comply with law
- To improve our website, courses and content using aggregated information

## 3. How we disclose information
We disclose personal information only as described here:
- **Service providers** that help us operate, such as website hosting, email, learning-platform, payment processing (Stripe) and customer-support tools, under terms that limit their use of your information.
- **Our other training brand.** ${sister}, receives our enrollment and contact emails, answers our phone line, and fulfills online course orders, including creating learner accounts and issuing certificates.
- **Your organization.** If an employer or program enrolled you, we may share course progress and completion status with that organization.
- **Legal and safety.** When required by law, subpoena or court order, or to protect rights, property or safety.
- **Business transfers.** In connection with a merger, acquisition or sale of assets, subject to this policy.

**We do not sell personal information, and we do not share personal information for cross-context behavioral advertising.** We have not done so in the past 12 months.

## 4. Sensitive personal information
We do not intentionally collect sensitive personal information (such as Social Security numbers, precise geolocation, health information, or racial or ethnic origin) through this website. Please do not include it in messages to us.

## 5. Children’s privacy
This website is not directed to children under 13, and we do not knowingly collect personal information from children under 13, consistent with the Children’s Online Privacy Protection Act (COPPA). Learners under 18 should use our services with a parent or guardian’s permission, and enrollment requests for minors must be submitted by a parent or guardian. If you believe a child under 13 has provided us information, contact us and we will delete it.

## 6. Data retention
We keep personal information only as long as needed for the purposes above (generally for the duration of your enrollment plus up to seven years for tax, accounting and legal records) and then delete or de-identify it.

## 7. Security
We use reasonable administrative, technical and physical safeguards, including encrypted connections (HTTPS). No method of transmission or storage is completely secure, and email is not a fully secure channel, so please don’t email sensitive information.

## 8. Your privacy choices
- **Email.** Unsubscribe from marketing emails, including our newsletter, using the link in any message, our [newsletter unsubscribe page](/newsletter/unsubscribe/) or by contacting us. We will still send service messages about your enrollment.
- **Global Privacy Control.** We honor GPC browser signals as a valid request to opt out of sale, sharing and targeted advertising.
- **Do Not Track.** Because we do not track users across third-party websites, we do not change our practices in response to Do Not Track signals; we do honor GPC as described above.
- **Text messages.** We do not send marketing text messages without your prior express written consent.

## 9. Your U.S. state privacy rights
Depending on where you live, you may have the right to:
- **Know / access** the personal information we have about you and receive a portable copy
- **Correct** inaccurate personal information
- **Delete** personal information we collected from you
- **Opt out** of the sale of personal information, sharing for cross-context behavioral advertising, targeted advertising, and profiling in furtherance of decisions with legal or similarly significant effects (we do not engage in these activities)
- **Limit** the use of sensitive personal information (we do not use it for purposes requiring this right)
- **Not be discriminated against** for exercising your rights
- **Appeal** our decision on your request

These rights arise under laws such as the California Consumer Privacy Act as amended by the CPRA, and comprehensive privacy laws in states including Virginia, Colorado, Connecticut, Utah, Texas, Oregon, Montana, Iowa, Delaware, New Hampshire, New Jersey, Nebraska, Tennessee, Minnesota, Maryland, Indiana, Kentucky and Rhode Island. Some of these laws apply only to businesses that meet certain thresholds; as a matter of policy, we honor these requests from all U.S. residents.

### How to submit a request
Email [${cfg.email}](mailto:${cfg.email}) with the subject “Privacy Request” or call [${cfg.phone}](tel:${cfg.phoneE164}). Tell us which right you are exercising and your state of residence. We will verify your identity by matching information you provide with information we hold, and we will respond within 45 days (extendable once by 45 days where permitted, with notice). An authorized agent may submit a request with your signed permission; we may ask you to confirm your identity directly.

### Appeals
If we decline your request, you may appeal by replying to our decision with the subject “Privacy Appeal.” We will respond within the time required by your state’s law (generally 45–60 days). If you are not satisfied, you may contact your state attorney general.

### California-specific disclosures
In the past 12 months we have collected the following categories of personal information, from you directly and automatically from your device, for the business purposes described in Section 2, and disclosed them to the categories of recipients in Section 3:

| Category | Examples | Collected | Sold or shared |
|---|---|---|---|
| Identifiers | Name, email, phone, IP address | Yes | No |
| Customer records (Cal. Civ. Code § 1798.80) | Name, contact and billing details (card numbers are handled by Stripe) | Yes | No |
| Commercial information | Courses requested or purchased | Yes | No |
| Internet or network activity | Pages visited (hosting logs and Google Analytics) | Yes | No |
| General geolocation | State of residence; approximate location from IP | Yes | No |
| Professional or employment information | Employer name for group enrollments | Sometimes | No |
| Education information | Course progress and certificates (not covered by FERPA) | Yes | No |
| Sensitive personal information |: | No | No |

**Shine the Light (Cal. Civ. Code § 1798.83):** We do not disclose personal information to third parties for their own direct-marketing purposes.

**Nevada residents:** We do not sell covered information as defined by Nevada law. You may still submit an opt-out request to the contact above.

## 10. Third-party links
Our website links to other sites, such as the U.S. Bureau of Labor Statistics and O*NET. We are not responsible for their privacy practices.

## 11. Changes to this policy
We may update this policy. We will post the new version with an updated effective date and, for material changes, provide additional notice where required.

## 12. Contact us
${contact}` },

  { slug: 'terms-of-use', title: 'Terms of Use', desc: 'The terms that govern use of the Career Education Institute website, free career tools and online training courses, including enrollment, payment, licenses and disclaimers.',
    body: `**Effective date and last updated:** ${D}

${who('these Terms')}

Please read these Terms of Use (“Terms”) carefully. They are an agreement between you and us. By accessing or using the Career Education Institute website, free tools or courses (the “Services”), you agree to these Terms and our [Privacy Policy](/privacy-policy/). If you do not agree, do not use the Services.

## 1. Who may use the Services
The Services are offered only to individuals located in the United States. You must be at least 18 years old, or at least 13 years old with the permission and supervision of a parent or guardian who agrees to these Terms on your behalf. Organizations that enroll learners are responsible for ensuring their learners comply with these Terms.

## 2. What we offer
Career Education Institute provides free career information (career profiles, salary data, quizzes, guides and worksheets), paid general online career-preparation courses delivered through a learning-management system (LMS), and job-title courses (CDL Entry-Level Driver Training, forklift operator, flagger and mold inspector training) provided through ${sister}.

**Important disclosures about our courses:**
- Job-title trainings are general, non-credit, professional-development courses. They do not award academic credit, degrees, diplomas, state licenses or industry certifications.
- Career Education Institute is not a degree-granting institution and is not accredited by an agency recognized by the U.S. Department of Education. Courses are not eligible for federal student aid.
- Job-title trainings do not replace state-approved or employer-required training programs, supervised clinical or apprenticeship hours, or licensing exams.
- Provider courses cover the regulations stated on each course page. Whether a certificate, card or completion record satisfies a particular employer, state, agency or job site is decided by that party. Some credentials have additional steps, such as behind-the-wheel training for a CDL or hands-on evaluation for forklift operators.
- We do not guarantee employment, a particular salary, admission to any program or passing any exam.

## 3. Enrollment, pricing and payment
Prices are listed in U.S. dollars on each course page and may change, but changes will not affect purchases already confirmed. Volume discounts are applied by seat count as shown on the course and checkout pages.
- **Job-title trainings** are requested with our enrollment form, which opens an email to our team. The purchase is complete when we confirm your enrollment and receive payment.
- **Provider courses** (CDL ELDT, forklift operator, flagger and mold inspector) are purchased with a credit or debit card on our checkout page. Card payments are processed by Stripe, Inc., and your order and learner account are created in the learning platform of ${cfg.checkout.provider}, which delivers the course and issues certificates. By purchasing, you also agree to follow that provider’s course rules, such as identity validation and assessment requirements described in the course.

You are responsible for any applicable taxes. Refunds are governed by our [Refund Policy](/refund-policy/).

## 4. Course access and license
When you enroll, we grant you a limited, personal, non-exclusive, non-transferable, revocable license to access the course for the access period stated at purchase (currently ${cfg.course.access}). You may not share login credentials, copy, record, resell, redistribute or publicly display course materials. Group and employer licenses are governed by the terms agreed at purchase.

## 5. Accounts
You are responsible for keeping your LMS login confidential and for activity under your account. Notify us promptly of any unauthorized use.

## 6. Acceptable use
You agree not to: use the Services unlawfully; attempt to gain unauthorized access to systems; scrape or harvest content in a way that burdens our systems; introduce malware; impersonate others; or use the Services to harass anyone. We may suspend access for violations.

## 7. Intellectual property
The Services, including text, course materials, graphics, logos and the “Career Education Institute” name, are owned by or licensed to ${cfg.legalName} and protected by U.S. copyright and trademark law. Labor-market data from the U.S. Bureau of Labor Statistics is public information; our compilation and presentation are our own. Other trademarks (such as names of certifications and certifying bodies) belong to their owners and are used for identification only; no affiliation or endorsement is implied.

## 8. Educational information only
Content on the Services is for general educational and informational purposes. It is not professional, legal, medical, financial or career-counseling advice. Step-by-step guides are general overviews and are not a substitute for hands-on training, supervision, manufacturer instructions or applicable regulations. See our [Disclaimer](/disclaimer/).

## 9. Third-party links and services
We link to third-party websites and rely on third-party providers (such as hosting, email, LMS and payment providers). We are not responsible for third-party content or services.

## 10. Disclaimer of warranties
TO THE FULLEST EXTENT PERMITTED BY LAW, THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE,” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT CONTENT IS COMPLETE, CURRENT OR ERROR-FREE.

## 11. Limitation of liability
TO THE FULLEST EXTENT PERMITTED BY LAW, ${cfg.legalName.toUpperCase()} WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR LOST PROFITS OR DATA, ARISING FROM YOUR USE OF THE SERVICES. OUR TOTAL LIABILITY FOR ANY CLAIM WILL NOT EXCEED THE AMOUNT YOU PAID US FOR THE SERVICE GIVING RISE TO THE CLAIM IN THE 12 MONTHS BEFORE THE CLAIM, OR $100 IF YOU PAID NOTHING. Some states do not allow certain limitations, so some of these may not apply to you.

## 12. Indemnification
You agree to indemnify and hold harmless ${cfg.legalName} from claims arising from your misuse of the Services or violation of these Terms, to the extent permitted by law.

## 13. Governing law and disputes
These Terms are governed by the laws of the State of ${cfg.governingState} and applicable U.S. federal law, without regard to conflict-of-law rules. Before filing any claim, you agree to contact us and try to resolve the dispute informally for at least 30 days. Any claim not resolved informally may be brought in the state or federal courts located in ${cfg.governingState}, or in small claims court where you live if it qualifies. Nothing in these Terms limits rights you have under consumer-protection laws that cannot be waived.

## 14. Changes and termination
We may update these Terms by posting a new version with a new effective date. Continued use after changes means you accept them. We may suspend or end access to the Services for violations of these Terms.

## 15. General
If any provision is unenforceable, the rest remain in effect. These Terms, together with any written enrollment or group agreement, are the entire agreement between you and us about the Services. Our failure to enforce a provision is not a waiver.

## 16. Contact
${contact}` },

  { slug: 'cookie-policy', title: 'Cookie Policy', desc: 'Career Education Institute uses no advertising cookies. Learn what browser storage we use, how we use Google Analytics and how to turn it off.',
    body: `**Effective date and last updated:** ${D}

${who('this policy')}

## Our approach
Career Education Institute is built to be fast and private. **Our website does not set advertising cookies.** We use Google Analytics to understand how visitors use the site, and you can turn it off.

## What we use
| Technology | Purpose | Duration | Can you opt out? |
|---|---|---|---|
| Local storage: \`cei-optout\` | Remembers your choice to opt out of Google Analytics | Until you clear it | Yes: clear browser data |
| Local storage: \`cei-newsletter-popup\`, plus a blog service worker that stores nothing | Remembers that you have seen the newsletter sign-up popup on the blog, so it opens only once. The service worker caches no pages or data; it only lets a hard refresh show the popup again | Until you clear it | Yes: clear browser data |
| Local storage: \`cei-cart\` | Keeps the courses and trainings you add to your cart, with learner numbers, so they are still there when you come back | Until you remove them, check out or clear it | Yes: empty your cart or clear browser data |
| Local storage: \`cei-search-view\` | Remembers whether you prefer site search results as a list or a grid | Until you clear it | Yes: clear browser data |
| Local storage: \`cei-partner-code\` | Remembers a partner discount code from a partner’s link, so it is filled in at checkout and on enrollment forms | ${cfg.partnerProgram.linkDays} days, or until you clear it | Yes: clear browser data |
| Form provider (contact and newsletter forms) | Runs the contact form and the newsletter sign-up and unsubscribe forms, only on those three pages. The provider may set its own cookies under its privacy policy | Per the provider’s policy | Avoid those pages; call or email us instead |
| Hosting logs (GitHub Pages) | Security and reliable delivery; set by our host, not by cookies we control | Per host’s policy | Not applicable |
| Stripe cookies (for example, \`__stripe_mid\`, \`__stripe_sid\`) | Fraud prevention for card payments, set only on the checkout page | Up to 1 year | Avoid the checkout page; order by phone instead |
| Google Analytics cookies (\`_ga\`, \`_ga_FPKWMLEWMG\`) | Aggregated usage statistics, with Google signals and ad personalization turned off. Not set if your browser sends GPC or you opt out | Up to 13 months | Yes: GPC signal or [Your Privacy Choices](/your-privacy-choices/) |

## Quizzes and forms
Quiz answers are processed in your browser and are not stored or sent. Enrollment and partner sign-up forms open your own email app, and the website itself does not store what you type. The contact form and the newsletter sign-up and unsubscribe forms are hosted by a third-party form provider, which receives what you enter there. The checkout page sends your order details to our course provider and your card details to Stripe, as described in our [Privacy Policy](/privacy-policy/).

## Third-party sites
When you follow links to other sites (such as government data sources or our learning platform), those sites may use their own cookies under their own policies.

## Managing cookies
Most browsers let you block or delete cookies and local storage in their settings. Blocking them will not affect your ability to use our website.

## Questions
${contact}

This policy applies to U.S. users only. See our [Privacy Policy](/privacy-policy/).` },

  { slug: 'accessibility', title: 'Accessibility Statement', desc: 'Career Education Institute is committed to digital accessibility for people with disabilities and aims to conform to WCAG 2.1 Level AA. Learn how to request help or accommodations.',
    body: `**Last updated:** ${D}

${who('this statement')}

## Our commitment
Career Education Institute is committed to making our website and courses accessible to everyone, including people with disabilities, consistent with the Americans with Disabilities Act (ADA) and Section 508 principles.

## Conformance goal
We aim to conform to the **Web Content Accessibility Guidelines (WCAG) 2.1, Level AA**.

## What we do
- Semantic HTML with landmarks, headings and a “skip to main content” link
- Text alternatives for meaningful images; decorative graphics are hidden from screen readers
- Color contrast that meets or exceeds AA ratios
- Full keyboard navigation with visible focus indicators
- Labeled form fields, clear error messages and status announcements
- Respect for “reduced motion” settings
- Content that works without JavaScript for reading, with progressive enhancement for quizzes and forms
- Responsive layouts that work with zoom up to 200% and on mobile devices

## Known limitations
Some third-party services we link to (such as payment or learning-platform pages) are maintained by others. If you encounter a barrier there, contact us and we’ll help.

## Accommodations and feedback
If you have difficulty using any part of our website or courses, or need information in an alternative format, please contact us. We aim to respond within two business days.

${contact}

You can also send us a message through our [contact form](/contact/).` },

  { slug: 'refund-policy', title: 'Refund & Cancellation Policy', desc: 'Career Education Institute refund policy: cancel within 30 days for a full refund, a money-back guarantee, account credit after 30 days and how to request a refund.',
    body: `**Effective date and last updated:** ${D}

${who('this policy')}

This policy applies to every course purchased from Career Education Institute, including our job-title trainings and the job-title courses delivered through ${sister}.

## 30-day full refund
Not sure whether you or your employees will be able to complete the course you purchased? You can cancel a course within 30 days of purchase and receive a full refund. If you cancel more than 30 days after purchase, you receive a credit for the full amount paid, which can be used to enroll in a different course of equal or lesser value. Organizations can also ask to pay by invoice to make it easier to finalize plans later.

You must give notice of cancellation to receive a refund, to have your account credited or to cancel an invoice. Call [${cfg.phone}](tel:${cfg.phoneE164}) between ${cfg.checkout.providerHours}, or email [${cfg.email}](mailto:${cfg.email}).

## 100% money-back guarantee
Your purchase is risk free. If you are unsatisfied with the value of the training after completing a course, notify us in writing at [${cfg.email}](mailto:${cfg.email}) with the reason, and we will promptly refund your payment. Most refunds are returned to the original payment method. Certain restrictions may apply, and some purchases may be eligible for a credit instead of a refund.

## When a refund or credit is not available
No refund or credit is issued for:
- **Course completion:** 65% or more of the course material has been completed.
- **Certificate issuance:** a certificate of completion has already been issued.
- **Assessment failure:** you did not pass quizzes, final exams or other required in-course assessments within the allowed number of attempts.
- **Identity validation:** you did not pass required identity validation, such as verification of a state or government ID, security questions or other methods described in the course guidelines.
- **Time limit:** the refund was requested more than 30 days after the purchase date.
- **Expedited services:** expedited processing or mailing of certificates, once that service has been provided as promised.

## How refunds are processed
Approved refunds can take up to 10 business days to appear on your account. Refunds are issued only to the payment method used for the original purchase.

## Group and employer purchases
The same terms apply to each seat purchased. Seats that have not been assigned to a learner can be cancelled within 30 days of purchase for a full refund.

## Purchases from outside the United States
Our services are intended for customers in the United States, and this guarantee does not apply to international or overseas registrations. Payment for international registrations must be made in U.S. dollars before the course starts, and those course fees are non-refundable. Learner substitutions can be made at any time before the course starts.

## Your rights
Nothing in this policy limits any rights you may have under applicable consumer-protection laws.

## Contact
${contact}` },

  { slug: 'disclaimer', title: 'Disclaimer', desc: 'Important disclaimers about Career Education Institute career information, salary data, how-to guides, quizzes and non-credit training courses. U.S.-focused educational content.',
    body: `**Last updated:** ${D}

${who('this disclaimer')}

## Educational information only
All content on this website (career profiles, salary data, quizzes, guides, worksheets and how-to articles) is provided for general educational and informational purposes. It is not professional career counseling, legal, medical, financial, tax or safety-engineering advice.

## Salary and labor-market data
Pay and job-outlook figures come from the U.S. Bureau of Labor Statistics (BLS) and represent national estimates for the Standard Occupational Classification categories we match each career to. Actual pay varies by location, employer, experience, credentials and other factors. Data is shown with its source and date and may not reflect current conditions in your area. Career Education Institute is not affiliated with or endorsed by the BLS, the U.S. Department of Labor or O*NET.

## No guarantees
We do not guarantee employment, wages, career advancement, admission to any program, or passing any certification or licensing exam.

## Courses
Our job-title trainings are general, non-credit career-preparation courses. They do not grant licenses, certifications, academic credit or degrees and do not replace state-approved or employer-required training. Provider courses (CDL ELDT, forklift operator, flagger and mold inspector) are delivered through ${sister}, and cover the regulations stated on each course page; whether a certificate or card is accepted is decided by employers, agencies and authorities. Licensing and certification requirements vary by state and change over time; always confirm requirements with the appropriate state board, certifying body or employer.

## How-to and safety content
Step-by-step guides are general overviews. Many tasks (especially in healthcare, electrical, mechanical, hazardous-materials and public-safety work) require formal training, supervision, licensure and compliance with OSHA and other regulations. Never perform a task beyond your training or legal scope of practice. Always follow your employer’s procedures and manufacturer instructions.

## Quizzes
Career quizzes are self-reflection tools, not psychological or vocational assessments. Use results as a starting point for exploration.

## Third-party names and trademarks
Names of certifications, credentials, agencies, software and companies are trademarks of their respective owners and are used for identification only. Their mention does not imply endorsement or affiliation.

## External links
Links to other websites are provided for convenience; we are not responsible for their content or availability.

## Errors
We work hard to keep information accurate, but errors can occur. Please report them to [${cfg.email}](mailto:${cfg.email}).` },

  { slug: 'your-privacy-choices', title: 'Your Privacy Choices', desc: 'Exercise your privacy choices: Career Education Institute does not sell or share personal information. Opt out of optional analytics, use Global Privacy Control or submit a request.',
    body: `**Last updated:** ${D}

${who('this page')}

## Do Not Sell or Share My Personal Information
**Career Education Institute does not sell your personal information and does not share it for cross-context behavioral advertising.** We also do not use targeted advertising or profiling that produces legal or similarly significant effects.

Even so, you can record your preference below, and we will honor it if our practices ever change.

## Opt out of Google Analytics on this browser
<button class="btn btn-primary" type="button" data-optout>Toggle analytics opt-out</button>

<p data-optout-status class="small muted" aria-live="polite">Checking your setting…</p>

This setting is saved in this browser only. If you use another browser or device, or clear your browser data, set it again.

## Global Privacy Control (GPC)
If your browser or extension sends a GPC signal, we automatically treat it as a request to opt out of sale, sharing and targeted advertising for that browser.

## Other privacy requests
To request access, correction, deletion or a copy of your personal information, or to appeal a decision, email [${cfg.email}](mailto:${cfg.email}) with the subject “Privacy Request,” call [${cfg.phone}](tel:${cfg.phoneE164}) or use our [contact form](/contact/). Authorized agents may submit requests on your behalf with written permission.

We will not discriminate against you for exercising your privacy rights. See our full [Privacy Policy](/privacy-policy/). This page applies to U.S. residents only.` },

  { slug: 'non-discrimination', title: 'Non-Discrimination Policy', desc: 'Career Education Institute does not discriminate in access to its website, courses or services and provides reasonable accommodations for learners with disabilities.',
    body: `**Last updated:** ${D}

${who('this policy')}

Career Education Institute welcomes learners of every background. We do not discriminate on the basis of race, color, religion, creed, national origin, ancestry, sex, pregnancy, sexual orientation, gender identity or expression, age, disability, genetic information, marital status, veteran or military status, or any other characteristic protected by applicable federal, state or local law in admission to, access to, or participation in our courses and services.

## Accommodations
We provide reasonable accommodations to learners with disabilities. To request an accommodation (such as alternative formats, additional time on knowledge checks or help navigating our learning platform) contact us. Requests are handled confidentially.

## Concerns
If you believe you have experienced discrimination or harassment in connection with our services, please contact us. We will review concerns promptly and take appropriate action. We prohibit retaliation against anyone who raises a concern in good faith.

${contact}` },

  { slug: 'copyright-policy', title: 'Copyright & DMCA Policy', desc: 'How to report copyright infringement to Career Education Institute under the Digital Millennium Copyright Act (DMCA) and how to submit a counter-notification.',
    body: `**Last updated:** ${D}

${who('this policy')}

Career Education Institute respects intellectual property rights and expects users to do the same. Our original content and course materials are protected by U.S. copyright law.

## Reporting infringement (DMCA notice)
If you believe material on our website infringes your copyright, send a written notice to our copyright contact that includes, as required by 17 U.S.C. § 512(c)(3):
1. Your physical or electronic signature
2. Identification of the copyrighted work you claim is infringed
3. Identification of the allegedly infringing material and its location (URL)
4. Your name, address, telephone number and email address
5. A statement that you have a good-faith belief the use is not authorized by the copyright owner, its agent or the law
6. A statement, under penalty of perjury, that the information is accurate and that you are the owner or authorized to act on the owner’s behalf

**Copyright contact:** [${cfg.email}](mailto:${cfg.email}) (subject: “DMCA Notice”) · ${cfg.phone}

## Counter-notification
If material you posted was removed and you believe it was a mistake or misidentification, you may send a counter-notification with the information required by 17 U.S.C. § 512(g)(3).

## Repeat infringers
We may terminate access for users who repeatedly infringe copyrights.

## Using our content
You may link to our pages and quote brief excerpts with attribution and a link. Reproducing substantial portions of our content or course materials requires our written permission.` }
];

export function legalPages() {
  return docs.map((d) => {
    const path = `/${d.slug}/`;
    const crumbs = [['Home', '/'], [d.title, path]];
    const others = docs.filter((x) => x !== d).map((x) => [x.title, `/${x.slug}/`]);
    return {
      path, crumbs, og: '/og/default.png', kind: 'Policy', name: d.title,
      title: fitTitle(d.title), desc: clamp(d.desc),
      body: `${pageHero({ crumbs, eyebrow: 'Legal', h1: d.title, lead: '', meta: false })}<div class="wrap layout"><article class="prose">${md(d.body).html}</article><aside>${sideLinks('Policies', others)}</aside></div>`,
      schema: []
    };
  });
}
