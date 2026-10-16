// HAZWOPER-OSHA.com courses sold on MrPress Education (checkout sends the LMS course id).
// Run `npm run update-partner-courses` after editing this list to refresh prices and details.

export const partnerCategories = [
  { slug: 'cdl-eldt', name: 'CDL Entry-Level Driver Training (ELDT)', blurb: 'Federally required theory training for new Class A and Class B CDL drivers and endorsements.' },
  { slug: 'osha-outreach', name: 'OSHA 10-Hour and 30-Hour Outreach', blurb: 'The most widely requested safety training for construction and general industry jobs, with a DOL card.' },
  { slug: 'hazwoper', name: 'HAZWOPER', blurb: 'Required training for hazardous waste site work, cleanup and emergency response under 29 CFR 1910.120.' },
  { slug: 'construction-safety', name: 'Construction Safety', blurb: 'Focused courses on the hazards construction workers face every day.' },
  { slug: 'workplace-safety', name: 'Workplace and General Industry Safety', blurb: 'Core safety topics for plants, warehouses, offices and service workplaces.' },
  { slug: 'electrical-safety', name: 'Electrical Safety and Lockout/Tagout', blurb: 'NFPA 70E, arc flash, GFCI and hazardous energy control.' },
  { slug: 'equipment-warehouse', name: 'Forklift, Equipment and Warehouse', blurb: 'Training for powered industrial trucks, lifts, mobile equipment and warehouse work.' },
  { slug: 'healthcare-first-aid', name: 'Healthcare, First Aid and HIPAA', blurb: 'Bloodborne pathogens, first aid, CPR, AED and patient privacy.' },
  { slug: 'environmental-hazmat', name: 'Environmental and Hazardous Materials', blurb: 'Asbestos, lead, mold, RCRA, SPCC, stormwater and DOT hazmat shipping.' },
  { slug: 'emergency-management', name: 'Emergency Response and Incident Command', blurb: 'FEMA ICS 100 and ICS 200 for responders and emergency teams.' },
  { slug: 'competent-person', name: 'Competent Person and Supervisor', blurb: 'Advanced courses for leads and supervisors who direct high-hazard work.' }
];

// [LMS course id, category]
export const selection = [
  [304, 'cdl-eldt'], [309, 'cdl-eldt'], [316, 'cdl-eldt'], [281, 'cdl-eldt'], [499, 'cdl-eldt'], [493, 'cdl-eldt'], [293, 'cdl-eldt'], [299, 'cdl-eldt'],
  [478, 'osha-outreach'], [435, 'osha-outreach'], [480, 'osha-outreach'], [482, 'osha-outreach'],
  [123, 'hazwoper'], [137, 'hazwoper'], [112, 'hazwoper'], [133, 'hazwoper'], [134, 'hazwoper'], [654, 'hazwoper'],
  [450, 'construction-safety'], [485, 'construction-safety'], [501, 'construction-safety'], [96, 'construction-safety'], [415, 'construction-safety'], [343, 'construction-safety'], [226, 'construction-safety'], [575, 'construction-safety'], [655, 'construction-safety'], [166, 'construction-safety'], [463, 'construction-safety'], [416, 'construction-safety'], [467, 'construction-safety'], [614, 'construction-safety'], [535, 'construction-safety'], [469, 'construction-safety'], [451, 'construction-safety'],
  [97, 'workplace-safety'], [322, 'workplace-safety'], [517, 'workplace-safety'], [222, 'workplace-safety'], [658, 'workplace-safety'], [287, 'workplace-safety'], [362, 'workplace-safety'], [519, 'workplace-safety'], [670, 'workplace-safety'], [296, 'workplace-safety'], [269, 'workplace-safety'], [549, 'workplace-safety'], [347, 'workplace-safety'], [317, 'workplace-safety'], [260, 'workplace-safety'], [665, 'workplace-safety'], [100, 'workplace-safety'], [407, 'workplace-safety'], [580, 'workplace-safety'], [486, 'workplace-safety'], [477, 'workplace-safety'], [664, 'workplace-safety'], [89, 'workplace-safety'], [521, 'workplace-safety'], [662, 'workplace-safety'],
  [420, 'electrical-safety'], [423, 'electrical-safety'], [187, 'electrical-safety'], [572, 'electrical-safety'], [528, 'electrical-safety'],
  [248, 'equipment-warehouse'], [470, 'equipment-warehouse'], [559, 'equipment-warehouse'], [249, 'equipment-warehouse'], [524, 'equipment-warehouse'],
  [132, 'healthcare-first-aid'], [368, 'healthcare-first-aid'], [474, 'healthcare-first-aid'],
  [128, 'environmental-hazmat'], [95, 'environmental-hazmat'], [218, 'environmental-hazmat'], [237, 'environmental-hazmat'], [114, 'environmental-hazmat'], [181, 'environmental-hazmat'], [374, 'environmental-hazmat'], [558, 'environmental-hazmat'], [440, 'environmental-hazmat'], [543, 'environmental-hazmat'], [542, 'environmental-hazmat'], [431, 'environmental-hazmat'], [666, 'environmental-hazmat'],
  [548, 'emergency-management'], [550, 'emergency-management'],
  [353, 'competent-person'], [411, 'competent-person'], [399, 'competent-person'], [365, 'competent-person'], [406, 'competent-person'], [244, 'competent-person'], [419, 'competent-person'], [393, 'competent-person']
];

// Career → recommended partner courses (LMS ids), shown on career and training pages.
export const careerCourses = {
  'medical-assistant': [132, 368, 474],
  phlebotomist: [132, 368, 474],
  'pharmacy-technician': [368, 97, 132],
  'certified-nursing-assistant': [132, 474, 368, 296],
  'licensed-practical-nurse': [132, 368, 474, 549],
  'registered-nurse': [132, 368, 549, 474],
  emt: [474, 132, 654, 548, 521],
  'dental-assistant': [132, 368, 97],
  'medical-billing-and-coding-specialist': [368],
  'surgical-technologist': [132, 368, 97],
  electrician: [478, 420, 423, 187, 480, 485],
  plumber: [478, 415, 100, 343, 575],
  'hvac-technician': [478, 420, 187, 501, 580],
  welder: [226, 575, 478, 517, 222],
  carpenter: [478, 485, 343, 501, 96, 480],
  'construction-laborer': [478, 535, 469, 415, 166, 485],
  'heavy-equipment-operator': [478, 415, 524, 655, 451],
  'electrical-lineworker': [420, 423, 485, 614, 474, 478],
  'solar-panel-installer': [478, 485, 420, 501, 614],
  'wind-turbine-technician': [485, 614, 420, 187, 474, 100],
  'diesel-mechanic': [187, 97, 435, 343, 542],
  'automotive-service-technician': [435, 97, 343, 542, 222],
  'industrial-maintenance-technician': [187, 572, 362, 420, 423, 435, 407],
  'cnc-machinist': [362, 187, 435, 343, 519],
  'aircraft-mechanic': [97, 187, 222, 519, 485, 435],
  'occupational-safety-specialist': [480, 435, 317, 347, 260, 123, 353],
  'hazmat-technician': [123, 112, 137, 128, 95, 517, 237, 114, 374, 431],
  'environmental-technician': [123, 137, 558, 440, 114, 374, 542, 664],
  'construction-inspector': [480, 478, 485, 96, 415, 100],
  'water-treatment-operator': [407, 97, 187, 89, 517, 474],
  'truck-driver': [304, 309, 316, 281, 499, 493, 293, 299, 521, 431],
  'forklift-operator': [248, 470, 559, 249],
  'warehouse-associate': [559, 248, 470, 296, 97],
  'logistics-coordinator': [431, 666, 374, 662],
  'administrative-assistant': [287, 269, 549, 368, 474],
  bookkeeper: [269, 549],
  'customer-service-representative': [269, 549, 368],
  'human-resources-specialist': [260, 317, 549, 662, 435],
  'project-manager': [480, 347, 665, 435],
  paralegal: [368, 269],
  accountant: [269],
  'real-estate-agent': [521, 549, 474],
  'it-support-specialist': [269, 296, 420, 368],
  'cybersecurity-analyst': [368, 548],
  'web-developer': [269],
  'network-administrator': [420, 269, 296, 501],
  'digital-marketing-specialist': [269],
  'police-officer': [474, 132, 548, 550, 654, 521],
  firefighter: [654, 548, 550, 474, 132, 517],
  'security-guard': [474, 549, 287, 222, 548, 132]
};

// Careers whose job-title training is replaced by the matching partner course.
export const replaceTraining = { 'truck-driver': 304, 'forklift-operator': 248, 'hazmat-technician': 123 };

// Short display names used in menus, tables, buy boxes and page titles.
export const shortNames = {
  304: 'CDL ELDT Class A', 309: 'CDL ELDT Class B', 316: 'CDL ELDT Class B to Class A Upgrade', 281: 'CDL ELDT Hazmat (H) Endorsement',
  499: 'CDL ELDT Tanker (N) Endorsement', 493: 'CDL ELDT Hazmat and Tanker (X) Endorsement', 293: 'CDL ELDT Passenger (P) Endorsement', 299: 'CDL ELDT School Bus (S) Endorsement',
  478: 'OSHA 10-Hour Construction', 435: 'OSHA 10-Hour General Industry', 480: 'OSHA 30-Hour Construction (English)', 482: 'OSHA 30-Hour Construction (Spanish)',
  123: 'OSHA 40-Hour HAZWOPER', 137: 'OSHA 24-Hour HAZWOPER', 112: 'OSHA 8-Hour HAZWOPER Refresher', 133: 'OSHA 8-Hour HAZWOPER Supervisor', 134: 'OSHA 8-Hour HAZWOPER Supervisor Refresher',
  654: 'HAZWOPER First Responder Awareness (4-Hour)', 450: 'General Safety and Health for Construction', 655: 'Focus Four Struck-By Hazards (Construction)',
  535: 'National Flagger Certification', 451: 'Motor Vehicles and Mechanized Equipment', 97: 'Hazard Communication (HazCom with GHS)',
  662: 'DOT Reasonable Suspicion for Supervisors', 528: 'GFCI and Ground Fault Protection Safety', 249: 'Aerial, Scissor and Boom Lift Safety',
  237: 'Mold Inspector Certification', 558: 'EPA SPCC Training', 431: 'DOT Hazmat General Awareness and Function-Specific',
  548: 'ICS 100: Introduction to Incident Command', 550: 'ICS 200: Incident Command for Initial Response',
  411: 'Competent Person: Excavation and Trenching', 406: 'Competent Person: Rigging and Inspection', 244: 'Competent Person: Scaffold Erection and Inspection'
};
