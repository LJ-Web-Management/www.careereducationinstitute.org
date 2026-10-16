import students from './students.mjs';
import changers from './changers.mjs';
import jobsearch from './jobsearch.mjs';
import professionals from './professionals.mjs';
import employers from './employers.mjs';

export const topics = {
  'choosing-a-career': 'Choosing a career',
  'education-paths': 'College, trade school & training',
  'career-change': 'Changing careers',
  'job-search': 'Resumes, interviews & job search',
  'career-growth': 'Growing in your career',
  employers: 'Hiring & onboarding (for employers)'
};
export const guides = [...students, ...changers, ...jobsearch, ...professionals, ...employers];
export const gp = (g) => (g.topic === 'employers' ? `/employers/${g.slug}/` : `/guides/${g.slug}/`);
export const guideBySlug = Object.fromEntries(guides.map((g) => [g.slug, g]));
