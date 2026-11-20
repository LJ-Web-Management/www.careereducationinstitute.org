// Course length and price for each job-title training.
// Every job-title training is a short course of 3 or 4 hours. Every course is priced from $79 to $129.
// Price is set by tier (role complexity), not by length. The LMS course should be built to the hours below.
// Checkout courses (partner-selection.mjs, sold with instant access) keep the provider's own length and price.
export const priceForTier = { 1: 79, 2: 89, 3: 99, 4: 119, 5: 129 };
export const hoursForTier = { 1: 3, 2: 3, 3: 4, 4: 4, 5: 4 };
export const DEFAULT_TIER = 3;

export const courseTier = {
  // Tier 1: entry-level roles that train mostly on the job
  'warehouse-associate': 1, 'security-guard': 1, 'construction-laborer': 1, 'customer-service-representative': 1, 'administrative-assistant': 1,
  // Tier 2: short certificate roles
  phlebotomist: 2, 'certified-nursing-assistant': 2, 'pharmacy-technician': 2, 'dental-assistant': 2, 'solar-panel-installer': 2, 'real-estate-agent': 2, bookkeeper: 2, 'it-support-specialist': 2,
  // Tier 3: technical and specialized roles
  'medical-assistant': 3, 'medical-billing-and-coding-specialist': 3, emt: 3, 'hvac-technician': 3, welder: 3, carpenter: 3, 'heavy-equipment-operator': 3, 'automotive-service-technician': 3, 'diesel-mechanic': 3, 'cnc-machinist': 3, 'environmental-technician': 3, 'water-treatment-operator': 3, 'logistics-coordinator': 3, 'human-resources-specialist': 3, 'digital-marketing-specialist': 3, paralegal: 3, 'police-officer': 3, firefighter: 3, 'wind-turbine-technician': 3, 'industrial-maintenance-technician': 3, 'web-developer': 3,
  // Tier 4: licensed, high-hazard or advanced professional roles
  electrician: 4, plumber: 4, 'licensed-practical-nurse': 4, 'surgical-technologist': 4, 'electrical-lineworker': 4, 'aircraft-mechanic': 4, 'construction-inspector': 4, 'network-administrator': 4, 'cybersecurity-analyst': 4, accountant: 4, 'project-manager': 4, 'occupational-safety-specialist': 4, 'hazmat-technician': 4,
  // Tier 5
  'registered-nurse': 5,
  // Careers added October 2026, same ladder
  // Tier 1: entry-level roles that train mostly on the job (22)
  farmworker: 1, 'ranch-hand': 1, 'agricultural-equipment-operator': 1, landscaper: 1, roustabout: 1, 'line-cook': 1, 'prep-cook': 1, bartender: 1, server: 1,
  barista: 1, 'hotel-housekeeper': 1, 'postal-mail-carrier': 1, deckhand: 1, lifeguard: 1, 'refuse-collector': 1, 'retail-sales-associate': 1, cashier: 1,
  'stock-associate': 1, 'parts-salesperson': 1, 'rental-agent': 1, painter: 1, flagger: 1,
  // Tier 2: short certificate and short on-the-job roles (33)
  'veterinary-assistant': 2, 'animal-caretaker': 2, arborist: 2, 'pesticide-applicator': 2, 'forest-and-conservation-worker': 2, 'sports-official': 2,
  'recreation-worker': 2, tailor: 2, receptionist: 2, 'human-services-assistant': 2, 'community-health-worker': 2, 'residential-advisor': 2, 'childcare-worker': 2,
  'home-health-aide': 2, baker: 2, butcher: 2, 'hotel-front-desk-agent': 2, 'tour-guide': 2, 'casino-dealer': 2, 'delivery-driver': 2, 'school-bus-driver': 2,
  'transit-bus-driver': 2, 'flight-attendant': 2, 'shipping-and-receiving-clerk': 2, 'freight-dispatcher': 2, 'production-assembler': 2,
  'transportation-security-officer': 2, 'animal-control-officer': 2, 'pest-control-technician': 2, 'insurance-agent': 2, 'travel-agent': 2, 'drywall-installer': 2,
  'concrete-finisher': 2,
  // Tier 3: technical, skilled and specialized roles (137)
  'derrick-operator': 3, 'rotary-drill-operator': 3, 'oilfield-service-operator': 3, 'mining-machine-operator': 3, roofer: 3, 'veterinary-technician': 3,
  'animal-trainer': 3, 'farm-manager': 3, 'farm-equipment-mechanic': 3, 'agricultural-technician': 3, 'agricultural-inspector': 3, 'landscaping-supervisor': 3,
  'logging-equipment-operator': 3, 'graphic-designer': 3, photographer: 3, 'video-editor': 3, 'sound-engineer': 3, 'audio-video-technician': 3,
  'lighting-technician': 3, animator: 3, 'art-director': 3, 'fashion-designer': 3, 'industrial-designer': 3, florist: 3, 'public-relations-specialist': 3,
  'technical-writer': 3, journalist: 3, 'court-reporter': 3, cosmetologist: 3, barber: 3, esthetician: 3, 'nail-technician': 3, 'makeup-artist': 3,
  'salon-manager': 3, 'massage-therapist': 3, 'personal-trainer': 3, 'exercise-physiologist': 3, 'funeral-director': 3, embalmer: 3, 'executive-assistant': 3,
  'office-manager': 3, 'claims-adjuster': 3, 'tax-preparer': 3, 'purchasing-agent': 3, 'property-manager': 3, 'rehabilitation-counselor': 3, 'health-educator': 3,
  'psychiatric-technician': 3, 'eligibility-interviewer': 3, 'social-and-community-service-manager': 3, fundraiser: 3, 'court-clerk': 3, 'tax-examiner': 3,
  mediator: 3, 'preschool-teacher': 3, 'teacher-assistant': 3, tutor: 3, 'adult-education-teacher': 3, 'library-technician': 3, 'instructional-coordinator': 3,
  'corporate-trainer': 3, 'gas-plant-operator': 3, 'stationary-engineer': 3, 'refinery-operator': 3, 'chemical-plant-operator': 3, 'nuclear-technician': 3,
  'wellhead-pumper': 3, 'telecommunications-lineworker': 3, 'water-well-driller': 3, 'medical-administrative-assistant': 3, 'sterile-processing-technician': 3,
  chef: 3, 'private-chef': 3, 'restaurant-manager': 3, 'food-service-supervisor': 3, 'hotel-manager': 3, concierge: 3, 'event-planner': 3,
  'railroad-conductor': 3, 'auto-body-technician': 3, 'small-engine-mechanic': 3, 'motorcycle-mechanic': 3, 'heavy-equipment-mechanic': 3,
  'building-maintenance-technician': 3, millwright: 3, 'tool-and-die-maker': 3, 'cnc-programmer': 3, 'quality-control-inspector': 3, 'production-supervisor': 3,
  'biomedical-equipment-technician': 3, 'correctional-officer': 3, '911-dispatcher': 3, 'private-investigator': 3, bailiff: 3, 'security-supervisor': 3,
  'safety-technician': 3, 'environmental-engineering-technician': 3, 'transportation-inspector': 3, 'fire-inspector': 3, 'forest-fire-prevention-specialist': 3,
  'fire-alarm-technician': 3, 'conservation-technician': 3, 'septic-tank-technician': 3, 'retail-store-manager': 3, 'visual-merchandiser': 3,
  'account-executive': 3, 'wholesale-sales-representative': 3, 'technical-sales-representative': 3, 'advertising-sales-agent': 3, 'medical-lab-technician': 3,
  'chemical-technician': 3, 'biological-technician': 3, 'food-science-technician': 3, 'calibration-technician': 3, 'semiconductor-processing-technician': 3,
  'civil-engineering-technician': 3, 'mechanical-engineering-technician': 3, 'mechatronics-technician': 3, 'cad-drafter': 3, 'surveying-technician': 3,
  'network-technician': 3, 'software-qa-tester': 3, 'ux-ui-designer': 3, 'computer-repair-technician': 3, 'telecommunications-technician': 3,
  'cell-tower-technician': 3, 'electronics-technician': 3, brickmason: 3, 'sheet-metal-worker': 3, 'camera-operator': 3, 'interior-designer': 3, interpreter: 3,
  'sports-coach': 3, 'loan-officer': 3, 'childcare-center-director': 3, 'substitute-teacher': 3, librarian: 3,
  // Tier 4: licensed, high-hazard or advanced professional roles (58)
  'financial-analyst': 4, 'urban-planner': 4, 'power-plant-operator': 4, 'nuclear-reactor-operator': 4, 'power-dispatcher': 4, 'substation-technician': 4,
  'radiologic-technologist': 4, 'diagnostic-medical-sonographer': 4, 'dental-hygienist': 4, 'respiratory-therapist': 4, 'physical-therapist-assistant': 4,
  paramedic: 4, 'commercial-pilot': 4, 'air-traffic-controller': 4, 'locomotive-engineer': 4, 'crane-operator': 4, 'avionics-technician': 4, detective: 4,
  'fish-and-game-warden': 4, 'emergency-management-director': 4, 'probation-officer': 4, 'sales-engineer': 4, 'sales-manager': 4, 'marketing-manager': 4,
  'real-estate-broker': 4, 'forensic-science-technician': 4, chemist: 4, microbiologist: 4, 'mechanical-engineer': 4, 'software-developer': 4,
  'data-scientist': 4, 'computer-systems-analyst': 4, 'database-administrator': 4, 'it-manager': 4, ironworker: 4, 'elevator-technician': 4,
  'landscape-architect': 4, 'athletic-trainer': 4, dietitian: 4, 'recreational-therapist': 4, 'social-worker': 4, 'healthcare-social-worker': 4,
  'substance-abuse-counselor': 4, 'marriage-and-family-therapist': 4, 'kindergarten-teacher': 4, 'elementary-school-teacher': 4, 'middle-school-teacher': 4,
  'high-school-teacher': 4, 'special-education-teacher': 4, 'career-and-technical-education-teacher': 4, 'school-counselor': 4, 'safety-engineer': 4,
  'environmental-health-specialist': 4, 'financial-services-sales-agent': 4, surveyor: 4, 'civil-engineer': 4, 'electrical-engineer': 4, 'construction-manager': 4,
  // Careers added October 2026, second batch, same ladder
  // Tier 1: entry-level roles that train mostly on the job (41)
  'movie-projectionist': 1, model: 1, 'quarry-rock-splitter': 1, 'fast-food-cook': 1, 'cafeteria-cook': 1, 'short-order-cook': 1, 'banquet-server': 1, busser: 1,
  dishwasher: 1, 'restaurant-host': 1, janitor: 1, usher: 1, 'amusement-park-attendant': 1, 'casino-cashier': 1, 'postal-clerk': 1, 'mail-sorter': 1,
  'shuttle-driver': 1, 'taxi-driver': 1, 'parking-attendant': 1, 'gas-station-attendant': 1, 'conveyor-operator': 1, 'vehicle-cleaner': 1, 'hand-packer': 1,
  'tank-loader': 1, 'hand-grinder': 1, 'hand-cutter': 1, 'product-decorator': 1, 'machine-feeder': 1, 'meat-trimmer': 1, 'meat-packer': 1,
  'food-roasting-machine-operator': 1, 'garment-presser': 1, 'sewing-machine-operator': 1, 'carpet-installer': 1, 'insulation-installer': 1, pipelayer: 1,
  'mason-helper': 1, 'carpenter-helper': 1, 'painter-helper': 1, 'roofer-helper': 1, 'fence-installer': 1,
  // Tier 2: short certificate and short on-the-job roles (55)
  'farm-labor-contractor': 2, 'craft-artist': 2, 'costume-attendant': 2, 'photo-lab-technician': 2, 'switchboard-operator': 2, 'telephone-operator': 2, 'bank-teller': 2,
  'correspondence-clerk': 2, 'file-clerk': 2, 'intake-interviewer': 2, 'loan-processor': 2, 'order-clerk': 2, 'data-entry-clerk': 2, typist: 2, 'mail-clerk': 2,
  'office-clerk': 2, 'office-machine-operator': 2, 'library-assistant': 2, 'meter-reader': 2, orderly: 2, 'psychiatric-aide': 2, 'occupational-therapy-aide': 2,
  'physical-therapist-aide': 2, 'pharmacy-aide': 2, 'sportsbook-writer': 2, bellhop: 2, 'casino-cage-cashier': 2, 'school-bus-monitor': 2, 'reservation-agent': 2,
  'cargo-agent': 2, courier: 2, 'weigher-and-checker': 2, 'ambulance-driver': 2, 'route-sales-driver': 2, 'bridge-tender': 2, 'aircraft-service-attendant': 2,
  'passenger-attendant': 2, 'hand-sewer': 2, 'textile-dyeing-machine-operator': 2, 'textile-knitting-machine-operator': 2, 'packaging-machine-operator': 2,
  'production-helper': 2, 'tire-technician': 2, 'vending-machine-technician': 2, 'maintenance-helper': 2, 'shoe-machine-operator': 2, 'floor-layer': 2,
  'floor-sander': 2, 'tile-setter': 2, 'drywall-taper': 2, paperhanger: 2, plasterer: 2, 'electrician-helper': 2, 'plumber-helper': 2, 'manufactured-home-installer': 2,
  // Tier 3: technical, skilled and specialized roles (239)
  'agricultural-engineer': 3, 'animal-scientist': 3, 'soil-and-plant-scientist': 3, 'extension-educator': 3, 'public-relations-manager': 3, curator: 3,
  'museum-technician': 3, 'fine-artist': 3, 'set-designer': 3, 'producer-and-director': 3, choreographer: 3, 'music-director': 3, 'broadcast-announcer': 3,
  editor: 3, writer: 3, 'broadcast-technician': 3, 'desktop-publisher': 3, proofreader: 3, 'musical-instrument-repairer': 3, 'apparel-patternmaker': 3,
  jeweler: 3, engraver: 3, 'chief-executive': 3, 'general-and-operations-manager': 3, 'administrative-services-manager': 3, 'facilities-manager': 3,
  'financial-manager': 3, 'purchasing-manager': 3, 'compensation-and-benefits-manager': 3, 'human-resources-manager': 3, 'training-and-development-manager': 3,
  'auto-damage-appraiser': 3, 'compliance-officer': 3, 'labor-relations-specialist': 3, 'management-analyst': 3, 'compensation-and-benefits-specialist': 3,
  'budget-analyst': 3, 'credit-analyst': 3, 'insurance-underwriter': 3, 'financial-risk-specialist': 3, 'financial-examiner': 3, 'credit-counselor': 3,
  actuary: 3, 'operations-research-analyst': 3, economist: 3, 'survey-researcher': 3, 'judicial-law-clerk': 3, 'title-examiner': 3, 'debt-collector': 3,
  'billing-clerk': 3, 'payroll-clerk': 3, 'procurement-clerk': 3, 'brokerage-clerk': 3, 'credit-authorizer': 3, 'new-accounts-clerk': 3, 'hr-assistant': 3,
  'legal-secretary': 3, 'insurance-claims-clerk': 3, 'statistical-assistant': 3, 'business-professor': 3, 'computer-science-professor': 3, 'math-professor': 3,
  'architecture-professor': 3, 'engineering-professor': 3, 'agricultural-sciences-professor': 3, 'biology-professor': 3, 'forestry-professor': 3,
  'earth-sciences-professor': 3, 'chemistry-professor': 3, 'environmental-science-professor': 3, 'physics-professor': 3, 'anthropology-professor': 3,
  'cultural-studies-professor': 3, 'economics-professor': 3, 'geography-professor': 3, 'political-science-professor': 3, 'psychology-professor': 3,
  'sociology-professor': 3, 'education-professor': 3, 'library-science-professor': 3, 'criminal-justice-professor': 3, 'social-work-professor': 3,
  'art-professor': 3, 'college-administrator': 3, 'communications-professor': 3, 'english-professor': 3, 'foreign-language-professor': 3, 'history-professor': 3,
  'philosophy-professor': 3, 'family-and-consumer-sciences-professor': 3, 'recreation-and-fitness-professor': 3, 'postsecondary-cte-instructor': 3,
  'self-enrichment-teacher': 3, archivist: 3, 'graduate-teaching-assistant': 3, 'geological-technician': 3, 'surface-mining-equipment-operator': 3,
  'roof-bolter': 3, 'underground-mining-loader-operator': 3, 'extraction-helper': 3, 'control-valve-technician': 3, 'chemical-equipment-operator': 3,
  'separating-machine-operator': 3, 'gas-compressor-operator': 3, 'pump-operator': 3, 'medical-dosimetrist': 3, 'dietetic-technician': 3,
  'ophthalmic-technician': 3, optician: 3, 'hearing-aid-specialist': 3, 'health-information-technologist': 3, 'occupational-therapy-assistant': 3,
  'medical-transcriptionist': 3, 'dental-lab-technician': 3, 'medical-appliance-technician': 3, 'ophthalmic-lab-technician': 3, 'casino-manager': 3,
  'recreation-manager': 3, 'custodial-supervisor': 3, 'casino-floor-supervisor': 3, 'logistics-manager': 3, postmaster: 3, 'railroad-track-equipment-operator': 3,
  'railroad-signal-technician': 3, 'aircraft-cargo-supervisor': 3, 'transportation-supervisor': 3, 'airfield-operations-specialist': 3, 'rail-yard-engineer': 3,
  'railroad-switch-operator': 3, 'subway-operator': 3, 'motorboat-operator': 3, 'traffic-technician': 3, 'dredge-operator': 3, 'hoist-operator': 3,
  'textile-cutting-machine-operator': 3, 'textile-winding-machine-operator': 3, 'fiber-extruding-machine-operator': 3, 'wood-model-maker': 3,
  'wood-patternmaker': 3, 'sawmill-operator': 3, 'woodworking-machine-operator': 3, 'crushing-machine-operator': 3, 'mixing-machine-operator': 3,
  'slicing-machine-operator': 3, 'forming-machine-operator': 3, 'furnace-and-kiln-operator': 3, 'industrial-painter': 3, 'cnc-operator': 3,
  'adhesive-machine-operator': 3, 'industrial-cleaning-operator': 3, 'freezing-equipment-operator': 3, 'molder-and-caster': 3, 'paper-machine-operator': 3,
  'tire-builder': 3, 'industrial-production-manager': 3, 'industrial-engineering-technician': 3, 'production-planner': 3, 'maintenance-supervisor': 3,
  'electric-motor-repairer': 3, 'transportation-equipment-electrician': 3, 'industrial-electronics-repairer': 3, 'car-electronics-installer': 3,
  'auto-glass-technician': 3, 'rail-car-repairer': 3, 'marine-mechanic': 3, 'bicycle-mechanic': 3, 'rv-technician': 3, 'appliance-repair-technician': 3,
  'machinery-maintenance-worker': 3, 'refractory-repairer': 3, 'camera-repairer': 3, 'watch-repairer': 3, 'aircraft-assembler': 3, 'coil-winder': 3,
  'electronics-assembler': 3, 'engine-assembler': 3, 'metal-fabricator': 3, 'fiberglass-laminator': 3, 'timing-device-assembler': 3, 'food-batchmaker': 3,
  'food-cooking-machine-operator': 3, 'extruding-machine-operator': 3, 'forging-machine-operator': 3, 'rolling-machine-operator': 3, 'press-operator': 3,
  'drilling-machine-operator': 3, 'grinding-machine-operator': 3, 'lathe-operator': 3, 'milling-machine-operator': 3, 'metal-furnace-operator': 3,
  'metal-pourer': 3, 'metal-model-maker': 3, 'metal-patternmaker': 3, 'foundry-moldmaker': 3, 'molding-machine-operator': 3, 'multiple-machine-tool-operator': 3,
  'welding-machine-operator': 3, 'heat-treating-operator': 3, 'metal-layout-worker': 3, 'plating-operator': 3, 'tool-grinder': 3, 'prepress-technician': 3,
  'printing-press-operator': 3, 'bindery-worker': 3, 'natural-sciences-manager': 3, mathematician: 3, statistician: 3, 'electrical-drafter': 3,
  'mechanical-drafter': 3, 'aerospace-engineering-technician': 3, 'food-scientist': 3, biochemist: 3, epidemiologist: 3, 'medical-scientist': 3, astronomer: 3,
  physicist: 3, meteorologist: 3, 'materials-scientist': 3, sociologist: 3, archaeologist: 3, geographer: 3, historian: 3,
  'social-science-research-assistant': 3, 'cost-estimator': 3, 'construction-foreman': 3, stonemason: 3, 'terrazzo-worker': 3, 'paving-equipment-operator': 3,
  'pile-driver-operator': 3, glazier: 3, 'mechanical-insulator': 3, 'rebar-worker': 3, 'highway-maintenance-worker': 3, 'garage-door-technician': 3, locksmith: 3,
  rigger: 3, upholsterer: 3, cabinetmaker: 3, 'furniture-finisher': 3,
  // Tier 4: licensed, high-hazard or advanced professional roles (74)
  forester: 4, 'talent-agent': 4, 'financial-advisor': 4, 'industrial-organizational-psychologist': 4, lawyer: 4, 'health-sciences-professor': 4,
  'nursing-instructor': 4, 'law-professor': 4, 'school-principal': 4, 'school-psychologist': 4, 'middle-school-cte-teacher': 4,
  'preschool-special-education-teacher': 4, 'middle-school-special-education-teacher': 4, 'high-school-special-education-teacher': 4, 'mining-engineer': 4,
  'nuclear-engineer': 4, 'petroleum-engineer': 4, blaster: 4, 'health-services-manager': 4, 'physician-assistant': 4, 'nurse-practitioner': 4,
  'nurse-anesthetist': 4, 'nurse-midwife': 4, pharmacist: 4, 'physical-therapist': 4, 'occupational-therapist': 4, dentist: 4, 'oral-surgeon': 4,
  orthodontist: 4, prosthodontist: 4, optometrist: 4, chiropractor: 4, podiatrist: 4, audiologist: 4, 'speech-language-pathologist': 4, anesthesiologist: 4,
  cardiologist: 4, dermatologist: 4, 'emergency-medicine-physician': 4, 'family-medicine-physician': 4, internist: 4, neurologist: 4,
  'obstetrician-gynecologist': 4, pediatrician: 4, pathologist: 4, psychiatrist: 4, radiologist: 4, ophthalmologist: 4, 'orthopedic-surgeon': 4,
  'pediatric-surgeon': 4, acupuncturist: 4, 'radiation-therapist': 4, 'cardiovascular-technologist': 4, 'nuclear-medicine-technologist': 4, 'mri-technologist': 4,
  'orthotist-and-prosthetist': 4, 'genetic-counselor': 4, 'surgical-assistant': 4, 'airline-pilot': 4, 'ship-captain': 4, 'ship-engineer': 4,
  'industrial-engineer': 4, 'engineering-manager': 4, architect: 4, cartographer: 4, 'aerospace-engineer': 4, 'biomedical-engineer': 4, 'chemical-engineer': 4,
  'electronics-engineer': 4, 'marine-engineer': 4, 'materials-engineer': 4, geoscientist: 4, boilermaker: 4, 'commercial-diver': 4,
  // Replaced by provider courses (see partner-selection.mjs): truck-driver, forklift-operator
  'truck-driver': 3, 'forklift-operator': 1
};

export const courseHours = Object.fromEntries(Object.entries(courseTier).map(([slug, t]) => [slug, hoursForTier[t]]));
export const coursePrice = Object.fromEntries(Object.entries(courseTier).map(([slug, t]) => [slug, priceForTier[t]]));

// Share of course time per syllabus module (10 modules, sums to 1)
export const moduleWeights = [0.08, 0.06, 0.1, 0.1, 0.22, 0.08, 0.12, 0.08, 0.08, 0.08];

export const minutesLabel = (m) => {
  const r = Math.max(5, Math.round(m / 5) * 5);
  return r >= 60 ? `${Math.floor(r / 60)} hr${r % 60 ? ` ${r % 60} min` : ''}` : `${r} min`;
};
