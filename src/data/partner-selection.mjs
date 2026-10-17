// HAZWOPER-OSHA.com courses sold on Career Education Institute (checkout sends the LMS course id).
// Only courses that are the complete training for a job title belong here, the way CDL ELDT Class A
// is the training for a truck driver. Topic, regulation, supervisor, competent person, endorsement
// and refresher courses are left out.
// Run `npm run update-partner-courses` after editing this list to refresh prices and details.

// slug: our page URL (/courses/<slug>/). job: the job title the course trains for. field: career field (categories.mjs). career: matching career profile, if there is one.
export const selection = [
  { id: 304, slug: 'cdl-eldt-class-a', job: 'Truck Driver (Class A CDL)', field: 'transportation-and-logistics', career: 'truck-driver' },
  { id: 309, slug: 'cdl-eldt-class-b', job: 'Class B CDL Driver', field: 'transportation-and-logistics', career: 'truck-driver' },
  { id: 248, slug: 'forklift-operator-training', job: 'Forklift Operator', field: 'transportation-and-logistics', career: 'forklift-operator' },
  { id: 535, slug: 'flagger-certification', job: 'Flagger', field: 'skilled-trades' },
  { id: 237, slug: 'mold-inspector-certification', job: 'Mold Inspector', field: 'safety-and-environmental' }
];

// Careers whose job-title training is the matching provider course.
export const replaceTraining = { 'truck-driver': 304, 'forklift-operator': 248 };

// Short display names used in menus, tables, buy boxes and page titles.
export const shortNames = {
  304: 'CDL ELDT Class A', 309: 'CDL ELDT Class B', 248: 'Forklift Operator Training',
  535: 'Flagger Certification', 237: 'Mold Inspector Certification'
};
