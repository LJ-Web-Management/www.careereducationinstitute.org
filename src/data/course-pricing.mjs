// Course length and price for each job-title training.
// Price ladder is set against comparable self-paced, non-credit career-prep courses
// (roughly $7 to $10 per instructional hour) and sits below credential courses such as
// CDL ELDT. The LMS course should be built to the hours below.
export const priceForHours = { 6: 59.99, 8: 74.99, 10: 89.99, 12: 109.99, 14: 129.99 };

export const courseHours = {
  // 6 hours: entry-level roles that train mostly on the job
  'warehouse-associate': 6, 'security-guard': 6, 'construction-laborer': 6, 'customer-service-representative': 6, 'administrative-assistant': 6,
  // 8 hours: short certificate roles
  phlebotomist: 8, 'certified-nursing-assistant': 8, 'pharmacy-technician': 8, 'dental-assistant': 8, 'solar-panel-installer': 8, 'real-estate-agent': 8, bookkeeper: 8, 'it-support-specialist': 8,
  // 10 hours: technical and specialized roles
  'medical-assistant': 10, 'medical-billing-and-coding-specialist': 10, emt: 10, 'hvac-technician': 10, welder: 10, carpenter: 10, 'heavy-equipment-operator': 10, 'automotive-service-technician': 10, 'diesel-mechanic': 10, 'cnc-machinist': 10, 'environmental-technician': 10, 'water-treatment-operator': 10, 'logistics-coordinator': 10, 'human-resources-specialist': 10, 'digital-marketing-specialist': 10, paralegal: 10, 'police-officer': 10, firefighter: 10, 'wind-turbine-technician': 10, 'industrial-maintenance-technician': 10, 'web-developer': 10,
  // 12 hours: licensed, high-hazard or advanced professional roles
  electrician: 12, plumber: 12, 'licensed-practical-nurse': 12, 'surgical-technologist': 12, 'electrical-lineworker': 12, 'aircraft-mechanic': 12, 'construction-inspector': 12, 'network-administrator': 12, 'cybersecurity-analyst': 12, accountant: 12, 'project-manager': 12, 'occupational-safety-specialist': 12, 'hazmat-technician': 12,
  // 14 hours
  'registered-nurse': 14,
  // Replaced by provider courses (see partner-selection.mjs): truck-driver, forklift-operator
  'truck-driver': 10, 'forklift-operator': 6
};

// Share of course time per syllabus module (10 modules, sums to 1)
export const moduleWeights = [0.08, 0.06, 0.1, 0.1, 0.22, 0.08, 0.12, 0.08, 0.08, 0.08];

export const minutesLabel = (m) => {
  const r = Math.max(5, Math.round(m / 5) * 5);
  return r >= 60 ? `${Math.floor(r / 60)} hr${r % 60 ? ` ${r % 60} min` : ''}` : `${r} min`;
};
