// Central site settings. Change values here, then rebuild (npm run build).
// SITE_URL is injected by the GitHub Pages workflow. When the custom domain
// (www.mrpress-education.org) is connected, it switches automatically.
const url = (process.env.SITE_URL || 'http://localhost:4173').replace(/\/$/, '');

export default {
  name: 'MrPress Education',
  shortName: 'MrPress',
  legalName: 'MrPress Education',
  tagline: 'Career training by job title',
  description:
    'MrPress Education offers online career training by job title, plus free career quizzes, salary data, day-in-the-life guides and college and career-change resources for the U.S.',
  url, // absolute origin + base path, no trailing slash
  basePath: new URL(url).pathname.replace(/\/$/, ''), // '' on a custom domain, '/repo' on github.io
  futureDomain: 'https://www.mrpress-education.org',
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
  governingState: 'California',

  // Date shown as "Last updated" on content pages (YYYY-MM-DD). Bump when content is reviewed.
  updated: '2026-10-15',
  launched: '2026-10-15',

  // Course defaults shown on every training page. Edit to match your LMS.
  course: {
    format: 'Online, self-paced',
    length: 'About 8–12 hours',
    lengthISO: 'PT10H',
    access: '12 months of LMS access',
    certificate: 'Certificate of completion',
    level: 'Beginner to intermediate',
    language: 'English',
    price: null, // e.g. 149 — leave null to show "Request pricing"
    groupNote: 'Group and employer pricing available'
  },

  // Optional integrations — leave empty to keep the site cookie-free and fastest.
  analytics: { ga4: '' },
  verification: { google: '', bing: '' },
  social: [] // e.g. ['https://www.linkedin.com/company/mrpress-education']
};
