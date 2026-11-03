// Job-title courses sold through the online checkout (checkout sends the LMS course id). They are listed and
// named exactly like every other job-title training ("Forklift Operator Training") and live under /training/.
// Only courses that are the complete training for a job title belong here. Topic, regulation, supervisor,
// competent person, endorsement and refresher courses are left out.
// Run `npm run update-partner-courses` after editing this list to refresh details.

// slug: page URL (/training/<slug>/); for a course with a matching career it is the career's training page.
// job: the job title the course trains for. field: career field (categories.mjs). career: matching career profile, if any.
// Price: always the provider catalog price (src/data/partner-courses.json, refreshed by `npm run update-partner-courses`),
// because checkout charges the LMS price for the course id.
export const selection = [
  { id: 248, slug: 'forklift-operator', job: 'Forklift Operator', field: 'transportation-and-logistics', career: 'forklift-operator' },
  { id: 535, slug: 'flagger', job: 'Flagger', field: 'skilled-trades', career: 'flagger' },
  { id: 237, slug: 'mold-inspector', job: 'Mold Inspector', field: 'safety-and-environmental' }
];

// Careers whose job-title training is the matching checkout course.
export const replaceTraining = { 'forklift-operator': 248, flagger: 535 };

// Old addresses of these courses, sent on to the new pages.
export const movedFrom = {
  '/courses/': '/training/',
  '/courses/forklift-operator-training/': '/training/forklift-operator/',
  '/courses/flagger-certification/': '/training/flagger/',
  '/courses/mold-inspector-certification/': '/training/mold-inspector/',
  '/courses/cdl-eldt-class-a/': '/training/truck-driver/',
  '/courses/cdl-eldt-class-b/': '/training/truck-driver/'
};
