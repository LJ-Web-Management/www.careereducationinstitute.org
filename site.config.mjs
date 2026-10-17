// Central site settings. Change values here, then rebuild (npm run build).
// SITE_URL is injected by the GitHub Pages workflow. When the custom domain
// (www.careereducationinstitute.org) is connected, it switches automatically.
const url = (process.env.SITE_URL || 'http://localhost:4173').replace(/\/$/, '');

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
  updated: '2026-10-15',
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

  // Card checkout for partner courses: Stripe (publishable key only) + the provider LMS API.
  checkout: {
    stripePublishableKey: 'pk_live_doCHB0jglD5eISjEmB1vB6mb00xIg51noK',
    apiBase: 'https://hazwoper-osha.com/api',
    orderFrom: 'mrpress-education.org',
    provider: 'HAZWOPER-OSHA.com',
    providerLegal: 'Industrial Certified Training, LLC',
    providerHours: '6:00 AM to 5:00 PM Pacific Time'
  },

  // Optional integrations — leave empty to keep the site cookie-free and fastest.
  analytics: { ga4: '' },
  verification: { google: '', bing: '' },
  social: [] // e.g. ['https://www.linkedin.com/company/career-education-institute']
};
