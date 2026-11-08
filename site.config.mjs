// Central site settings. Change values here, then rebuild (npm run build).
// SITE_URL is injected by the GitHub Pages workflow. When the custom domain
// (now cei.ictraining.us; later www.careereducationinstitute.org) is connected, it switches automatically.
// GitHub Pages reports an http:// base_url until "Enforce HTTPS" is ticked, so any address other than localhost is
// written as https://, keeping canonicals, the sitemaps and robots.txt on one scheme.
const https = (u) => (/^http:\/\/(localhost|127\.)/.test(u) ? u : u.replace(/^http:\/\//, 'https://'));
const url = https(process.env.SITE_URL || 'http://localhost:4173').replace(/\/$/, '');
// The blog lives in its own repo (blog.careereducationinstitute.org) and is published at /blog/ of this site: the
// deploy workflow builds it into dist/blog/. BLOG_URL overrides; locally the blog runs on its own preview server.
const blogUrl = https(process.env.BLOG_URL || (/localhost/.test(url) ? 'http://localhost:4174' : url + '/blog')).replace(/\/$/, '');

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
  blogUrl, // the blog's address (normally this site + /blog), no trailing slash: links written as /blog/... go there
  futureDomain: 'https://www.careereducationinstitute.org',
  locale: 'en_US',
  lang: 'en-US',
  country: 'US',

  // Contact (phone and inbox shared with HAZWOPER-OSHA.com)
  phone: '1-866-429-6742',
  phoneE164: '+18664296742',
  email: 'info@hazwoper-osha.com',
  // Enrollment form opens a pre-filled email to this address.
  enrollTo: 'info@hazwoper-osha.com',
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

  // The two subscription programs: Jobs/Workforce (/for-employers/: onboarding and retraining) and Schools
  // (/for-schools/: high schools and colleges). Price is set by the number of seats per month and quoted by email
  // (no prices are published). Every subscriber gets its own landing page for its learners; white label (their
  // branding instead of ours) is a paid add-on. Yearly billing is the default and the one we recommend. Plans drop
  // `loyalty.step` in price after each full year, up to `loyalty.max`; the discount resets when seats are reduced or
  // the plan is cancelled.
  subscriptions: {
    cycles: ['Yearly', 'Monthly'],
    loyalty: { step: 0.03, max: 0.15 }
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
    newsletterUnsubscribe: '01M54344EYC6CM7DTS0QBXTN4Z', // /newsletter/unsubscribe/
    // Checkout on each job-title training page (until its LMS course id exists). The page address is sent as the
    // hidden field page_url, so each order shows which training was bought.
    trainingCheckout: '01M6XRJKMGT7X82NTX8R3BEZ4G'
  },

  // Google Analytics 4 measurement id and Microsoft Clarity project id. Both load after page load,
  // never with GPC or the opt-out on /your-privacy-choices/ (see src/assets/site.js).
  // Leave one empty to turn it off.
  analytics: { ga4: 'G-FPKWMLEWMG', clarity: 'z4kntlcpgn' },

  verification: { google: '', bing: '' },
  // Official profiles: linked in the footer and listed as sameAs in the Organization schema.
  social: [
    'https://www.instagram.com/careereducationinstitute/',
    'https://www.youtube.com/@careereducationinstitute',
    'https://x.com/cei_ictraining',
    'https://www.linkedin.com/company/careereducationinstitute'
  ]
};
