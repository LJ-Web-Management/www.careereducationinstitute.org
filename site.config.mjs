// Central site settings. Change values here, then rebuild (npm run build).
// SITE_URL is injected by the GitHub Pages workflow. When the custom domain
// (www.careereducationinstitute.org) is connected, it switches automatically.
const url = (process.env.SITE_URL || 'http://localhost:4173').replace(/\/$/, '');
// The blog is its own site (repo blog.careereducationinstitute.org). BLOG_URL overrides; otherwise it follows this
// site: the local blog server, the blog repo's github.io address, or blog.careereducationinstitute.org.
const blogUrl = (process.env.BLOG_URL || (/localhost/.test(url) ? 'http://localhost:4174' : /github\.io/.test(url) ? new URL(url).origin + '/blog.careereducationinstitute.org' : 'https://blog.careereducationinstitute.org')).replace(/\/$/, '');

export default {
  name: 'Career Education Institute',
  shortName: 'CEI',
  // Company that operates the site: named in the legal pages, footer copyright and schema.
  legalName: 'Industrial Certified Training, LLC',
  legalUrl: 'https://www.ictraining.us',
  tagline: 'Career training by job title',
  description:
    'Career Education Institute offers online career training by job title, plus free career quizzes, salary data, day-in-the-life guides and college and career-change resources for the U.S.',
  url, // absolute origin + base path, no trailing slash
  basePath: new URL(url).pathname.replace(/\/$/, ''), // '' on a custom domain, '/repo' on github.io
  blogUrl, // the blog's address, no trailing slash: links written as /blog/... go there
  futureDomain: 'https://www.careereducationinstitute.org',
  locale: 'en_US',
  lang: 'en-US',
  country: 'US',

  // Contact (phone and inbox shared with HAZWOPER-OSHA.com)
  phone: '1-866-429-6742',
  phoneE164: '+18664296742',
  email: 'info@hazwoper-osha.com',
  // Enrollment form opens a pre-filled email to these addresses.
  enrollTo: 'info@hazwoper-osha.com',
  enrollCc: 'hasan@hazwoper-osha.com',
  governingState: 'Illinois',

  // Date shown as "Last updated" on content pages (YYYY-MM-DD). Bump when content is reviewed.
  updated: '2026-10-18',
  launched: '2026-10-15',

  // Defaults for job-title trainings. Per-course hours and prices live in
  // src/data/course-pricing.mjs.
  course: {
    format: 'Online, self-paced',
    access: '12 months of LMS access',
    certificate: 'Certificate of completion',
    level: 'Beginner to intermediate',
    language: 'English',
    groupNote: 'Volume pricing from 2 seats'
  },

  // Seat-count discount ladder (same ladder the LMS applies at checkout)
  bulkTiers: [
    { min: 1, max: 1, discount: 0 },
    { min: 2, max: 10, discount: 0.01 },
    { min: 11, max: 20, discount: 0.02 },
    { min: 21, max: 50, discount: 0.03 },
    { min: 51, max: 100, discount: 0.05 },
    { min: 101, max: 250, discount: 0.07 },
    { min: 251, max: 500, discount: 0.08 },
    { min: 501, max: 1000, discount: 0.1 }
  ],

  // Seat subscriptions (/subscriptions/ and /for-workforce-programs/). No prices are published: every request is quoted
  // by email. Monthly and yearly plans drop `loyalty.step` in price after each full year, up to `loyalty.max`; the
  // discount resets when seats are reduced or the plan is cancelled.
  subscriptions: {
    cycles: ['Monthly', 'Yearly', 'Decade (10 years)'],
    loyalty: { step: 0.03, max: 0.15 },
    // Plans for individuals, families and small groups on /subscriptions/
    plans: [
      { name: 'Solo', seats: '1 seat', min: 1, max: 1, for: 'One learner exploring or training for a new job', points: ['Any job-title training in the catalog', 'Switch trainings as your goals change', 'Certificate for every training you finish'] },
      { name: 'Household', seats: '2 to 5 seats', min: 2, max: 5, for: 'Families, roommates and study partners', points: ['A seat for each learner', 'Each person picks their own trainings', 'One bill for the whole household'], featured: true },
      { name: 'Small group', seats: '6 to 25 seats', min: 6, max: 25, for: 'Small businesses, crews, clubs and classes', points: ['Assign seats to anyone in your group', 'Move a seat to a new person when someone finishes', 'Completion updates on request'] },
      { name: 'Organization', seats: '26+ seats', min: 26, max: 100000, for: 'Schools, workforce programs and employers', points: ['Seat count set to your program size', 'Invoice or purchase-order billing', 'Setup help for your learner list'] }
    ]
  },

  // Card checkout for partner courses: Stripe (publishable key only) + the provider LMS API.
  checkout: {
    stripePublishableKey: 'pk_live_doCHB0jglD5eISjEmB1vB6mb00xIg51noK',
    apiBase: 'https://hazwoper-osha.com/api',
    orderFrom: 'careereducationinstitute.org',
    provider: 'HAZWOPER-OSHA.com',
    providerLegal: 'Industrial Certified Training, LLC',
    providerHours: '6:00 AM to 5:00 PM Pacific Time'
  },

  // Typeform "live embed" ids for the embedded forms. Copy them from Typeform → Share → Embed.
  forms: {
    contact: '01M544HP0YBQQ0WGMHMXFC933Z', // /contact/
    newsletterSignup: '01M5421ZBBAAEPEEQB6DV7W1B6', // /newsletter/
    newsletterUnsubscribe: '01M54344EYC6CM7DTS0QBXTN4Z' // /newsletter/unsubscribe/
  },

  // Partner discount program (/partners/): learners who use a partner's code get `discount`
  // off, and the partner earns `share` of the sale price after that discount. A partner's
  // share link (any page with ?code=XYZ) keeps the code filled in for `linkDays` days.
  partnerProgram: { discount: 0.1, share: 0.05, linkDays: 30 },

  // Google Analytics 4 measurement id and Microsoft Clarity project id. Both load after page load,
  // never with GPC or the opt-out on /your-privacy-choices/ (see src/assets/site.js).
  // Leave one empty to turn it off.
  analytics: { ga4: 'G-FPKWMLEWMG', clarity: 'z4kntlcpgn' },
  verification: { google: '', bing: '' },
  social: [] // e.g. ['https://www.linkedin.com/company/career-education-institute']
};
