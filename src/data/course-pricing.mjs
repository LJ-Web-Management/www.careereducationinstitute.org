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
  // Careers added October 2026, same ladder
  // 6 hours: entry-level roles that train mostly on the job (22)
  farmworker: 6, 'ranch-hand': 6, 'agricultural-equipment-operator': 6, landscaper: 6, roustabout: 6, 'line-cook': 6, 'prep-cook': 6, bartender: 6, server: 6,
  barista: 6, 'hotel-housekeeper': 6, 'postal-mail-carrier': 6, deckhand: 6, lifeguard: 6, 'refuse-collector': 6, 'retail-sales-associate': 6, cashier: 6,
  'stock-associate': 6, 'parts-salesperson': 6, 'rental-agent': 6, painter: 6, flagger: 6,
  // 8 hours: short certificate and short on-the-job roles (33)
  'veterinary-assistant': 8, 'animal-caretaker': 8, arborist: 8, 'pesticide-applicator': 8, 'forest-and-conservation-worker': 8, 'sports-official': 8,
  'recreation-worker': 8, tailor: 8, receptionist: 8, 'human-services-assistant': 8, 'community-health-worker': 8, 'residential-advisor': 8, 'childcare-worker': 8,
  'home-health-aide': 8, baker: 8, butcher: 8, 'hotel-front-desk-agent': 8, 'tour-guide': 8, 'casino-dealer': 8, 'delivery-driver': 8, 'school-bus-driver': 8,
  'transit-bus-driver': 8, 'flight-attendant': 8, 'shipping-and-receiving-clerk': 8, 'freight-dispatcher': 8, 'production-assembler': 8,
  'transportation-security-officer': 8, 'animal-control-officer': 8, 'pest-control-technician': 8, 'insurance-agent': 8, 'travel-agent': 8, 'drywall-installer': 8,
  'concrete-finisher': 8,
  // 10 hours: technical, skilled and specialized roles (137)
  'derrick-operator': 10, 'rotary-drill-operator': 10, 'oilfield-service-operator': 10, 'mining-machine-operator': 10, roofer: 10, 'veterinary-technician': 10,
  'animal-trainer': 10, 'farm-manager': 10, 'farm-equipment-mechanic': 10, 'agricultural-technician': 10, 'agricultural-inspector': 10, 'landscaping-supervisor': 10,
  'logging-equipment-operator': 10, 'graphic-designer': 10, photographer: 10, 'video-editor': 10, 'sound-engineer': 10, 'audio-video-technician': 10,
  'lighting-technician': 10, animator: 10, 'art-director': 10, 'fashion-designer': 10, 'industrial-designer': 10, florist: 10, 'public-relations-specialist': 10,
  'technical-writer': 10, journalist: 10, 'court-reporter': 10, cosmetologist: 10, barber: 10, esthetician: 10, 'nail-technician': 10, 'makeup-artist': 10,
  'salon-manager': 10, 'massage-therapist': 10, 'personal-trainer': 10, 'exercise-physiologist': 10, 'funeral-director': 10, embalmer: 10, 'executive-assistant': 10,
  'office-manager': 10, 'claims-adjuster': 10, 'tax-preparer': 10, 'purchasing-agent': 10, 'property-manager': 10, 'rehabilitation-counselor': 10, 'health-educator': 10,
  'psychiatric-technician': 10, 'eligibility-interviewer': 10, 'social-and-community-service-manager': 10, fundraiser: 10, 'court-clerk': 10, 'tax-examiner': 10,
  mediator: 10, 'preschool-teacher': 10, 'teacher-assistant': 10, tutor: 10, 'adult-education-teacher': 10, 'library-technician': 10, 'instructional-coordinator': 10,
  'corporate-trainer': 10, 'gas-plant-operator': 10, 'stationary-engineer': 10, 'refinery-operator': 10, 'chemical-plant-operator': 10, 'nuclear-technician': 10,
  'wellhead-pumper': 10, 'telecommunications-lineworker': 10, 'water-well-driller': 10, 'medical-administrative-assistant': 10, 'sterile-processing-technician': 10,
  chef: 10, 'private-chef': 10, 'restaurant-manager': 10, 'food-service-supervisor': 10, 'hotel-manager': 10, concierge: 10, 'event-planner': 10,
  'railroad-conductor': 10, 'auto-body-technician': 10, 'small-engine-mechanic': 10, 'motorcycle-mechanic': 10, 'heavy-equipment-mechanic': 10,
  'building-maintenance-technician': 10, millwright: 10, 'tool-and-die-maker': 10, 'cnc-programmer': 10, 'quality-control-inspector': 10, 'production-supervisor': 10,
  'biomedical-equipment-technician': 10, 'correctional-officer': 10, '911-dispatcher': 10, 'private-investigator': 10, bailiff: 10, 'security-supervisor': 10,
  'safety-technician': 10, 'environmental-engineering-technician': 10, 'transportation-inspector': 10, 'fire-inspector': 10, 'forest-fire-prevention-specialist': 10,
  'fire-alarm-technician': 10, 'conservation-technician': 10, 'septic-tank-technician': 10, 'retail-store-manager': 10, 'visual-merchandiser': 10,
  'account-executive': 10, 'wholesale-sales-representative': 10, 'technical-sales-representative': 10, 'advertising-sales-agent': 10, 'medical-lab-technician': 10,
  'chemical-technician': 10, 'biological-technician': 10, 'food-science-technician': 10, 'calibration-technician': 10, 'semiconductor-processing-technician': 10,
  'civil-engineering-technician': 10, 'mechanical-engineering-technician': 10, 'mechatronics-technician': 10, 'cad-drafter': 10, 'surveying-technician': 10,
  'network-technician': 10, 'software-qa-tester': 10, 'ux-ui-designer': 10, 'computer-repair-technician': 10, 'telecommunications-technician': 10,
  'cell-tower-technician': 10, 'electronics-technician': 10, brickmason: 10, 'sheet-metal-worker': 10, 'camera-operator': 10, 'interior-designer': 10, interpreter: 10,
  'sports-coach': 10, 'loan-officer': 10, 'childcare-center-director': 10, 'substitute-teacher': 10, librarian: 10,
  // 12 hours: licensed, high-hazard or advanced professional roles (58)
  'financial-analyst': 12, 'urban-planner': 12, 'power-plant-operator': 12, 'nuclear-reactor-operator': 12, 'power-dispatcher': 12, 'substation-technician': 12,
  'radiologic-technologist': 12, 'diagnostic-medical-sonographer': 12, 'dental-hygienist': 12, 'respiratory-therapist': 12, 'physical-therapist-assistant': 12,
  paramedic: 12, 'commercial-pilot': 12, 'air-traffic-controller': 12, 'locomotive-engineer': 12, 'crane-operator': 12, 'avionics-technician': 12, detective: 12,
  'fish-and-game-warden': 12, 'emergency-management-director': 12, 'probation-officer': 12, 'sales-engineer': 12, 'sales-manager': 12, 'marketing-manager': 12,
  'real-estate-broker': 12, 'forensic-science-technician': 12, chemist: 12, microbiologist: 12, 'mechanical-engineer': 12, 'software-developer': 12,
  'data-scientist': 12, 'computer-systems-analyst': 12, 'database-administrator': 12, 'it-manager': 12, ironworker: 12, 'elevator-technician': 12,
  'landscape-architect': 12, 'athletic-trainer': 12, dietitian: 12, 'recreational-therapist': 12, 'social-worker': 12, 'healthcare-social-worker': 12,
  'substance-abuse-counselor': 12, 'marriage-and-family-therapist': 12, 'kindergarten-teacher': 12, 'elementary-school-teacher': 12, 'middle-school-teacher': 12,
  'high-school-teacher': 12, 'special-education-teacher': 12, 'career-and-technical-education-teacher': 12, 'school-counselor': 12, 'safety-engineer': 12,
  'environmental-health-specialist': 12, 'financial-services-sales-agent': 12, surveyor: 12, 'civil-engineer': 12, 'electrical-engineer': 12, 'construction-manager': 12,
  // Careers added October 2026, second batch, same ladder
  // 6 hours: entry-level roles that train mostly on the job (41)
  'movie-projectionist': 6, model: 6, 'quarry-rock-splitter': 6, 'fast-food-cook': 6, 'cafeteria-cook': 6, 'short-order-cook': 6, 'banquet-server': 6, busser: 6,
  dishwasher: 6, 'restaurant-host': 6, janitor: 6, usher: 6, 'amusement-park-attendant': 6, 'casino-cashier': 6, 'postal-clerk': 6, 'mail-sorter': 6,
  'shuttle-driver': 6, 'taxi-driver': 6, 'parking-attendant': 6, 'gas-station-attendant': 6, 'conveyor-operator': 6, 'vehicle-cleaner': 6, 'hand-packer': 6,
  'tank-loader': 6, 'hand-grinder': 6, 'hand-cutter': 6, 'product-decorator': 6, 'machine-feeder': 6, 'meat-trimmer': 6, 'meat-packer': 6,
  'food-roasting-machine-operator': 6, 'garment-presser': 6, 'sewing-machine-operator': 6, 'carpet-installer': 6, 'insulation-installer': 6, pipelayer: 6,
  'mason-helper': 6, 'carpenter-helper': 6, 'painter-helper': 6, 'roofer-helper': 6, 'fence-installer': 6,
  // 8 hours: short certificate and short on-the-job roles (55)
  'farm-labor-contractor': 8, 'craft-artist': 8, 'costume-attendant': 8, 'photo-lab-technician': 8, 'switchboard-operator': 8, 'telephone-operator': 8, 'bank-teller': 8,
  'correspondence-clerk': 8, 'file-clerk': 8, 'intake-interviewer': 8, 'loan-processor': 8, 'order-clerk': 8, 'data-entry-clerk': 8, typist: 8, 'mail-clerk': 8,
  'office-clerk': 8, 'office-machine-operator': 8, 'library-assistant': 8, 'meter-reader': 8, orderly: 8, 'psychiatric-aide': 8, 'occupational-therapy-aide': 8,
  'physical-therapist-aide': 8, 'pharmacy-aide': 8, 'sportsbook-writer': 8, bellhop: 8, 'casino-cage-cashier': 8, 'school-bus-monitor': 8, 'reservation-agent': 8,
  'cargo-agent': 8, courier: 8, 'weigher-and-checker': 8, 'ambulance-driver': 8, 'route-sales-driver': 8, 'bridge-tender': 8, 'aircraft-service-attendant': 8,
  'passenger-attendant': 8, 'hand-sewer': 8, 'textile-dyeing-machine-operator': 8, 'textile-knitting-machine-operator': 8, 'packaging-machine-operator': 8,
  'production-helper': 8, 'tire-technician': 8, 'vending-machine-technician': 8, 'maintenance-helper': 8, 'shoe-machine-operator': 8, 'floor-layer': 8,
  'floor-sander': 8, 'tile-setter': 8, 'drywall-taper': 8, paperhanger: 8, plasterer: 8, 'electrician-helper': 8, 'plumber-helper': 8, 'manufactured-home-installer': 8,
  // 10 hours: technical, skilled and specialized roles (239)
  'agricultural-engineer': 10, 'animal-scientist': 10, 'soil-and-plant-scientist': 10, 'extension-educator': 10, 'public-relations-manager': 10, curator: 10,
  'museum-technician': 10, 'fine-artist': 10, 'set-designer': 10, 'producer-and-director': 10, choreographer: 10, 'music-director': 10, 'broadcast-announcer': 10,
  editor: 10, writer: 10, 'broadcast-technician': 10, 'desktop-publisher': 10, proofreader: 10, 'musical-instrument-repairer': 10, 'apparel-patternmaker': 10,
  jeweler: 10, engraver: 10, 'chief-executive': 10, 'general-and-operations-manager': 10, 'administrative-services-manager': 10, 'facilities-manager': 10,
  'financial-manager': 10, 'purchasing-manager': 10, 'compensation-and-benefits-manager': 10, 'human-resources-manager': 10, 'training-and-development-manager': 10,
  'auto-damage-appraiser': 10, 'compliance-officer': 10, 'labor-relations-specialist': 10, 'management-analyst': 10, 'compensation-and-benefits-specialist': 10,
  'budget-analyst': 10, 'credit-analyst': 10, 'insurance-underwriter': 10, 'financial-risk-specialist': 10, 'financial-examiner': 10, 'credit-counselor': 10,
  actuary: 10, 'operations-research-analyst': 10, economist: 10, 'survey-researcher': 10, 'judicial-law-clerk': 10, 'title-examiner': 10, 'debt-collector': 10,
  'billing-clerk': 10, 'payroll-clerk': 10, 'procurement-clerk': 10, 'brokerage-clerk': 10, 'credit-authorizer': 10, 'new-accounts-clerk': 10, 'hr-assistant': 10,
  'legal-secretary': 10, 'insurance-claims-clerk': 10, 'statistical-assistant': 10, 'business-professor': 10, 'computer-science-professor': 10, 'math-professor': 10,
  'architecture-professor': 10, 'engineering-professor': 10, 'agricultural-sciences-professor': 10, 'biology-professor': 10, 'forestry-professor': 10,
  'earth-sciences-professor': 10, 'chemistry-professor': 10, 'environmental-science-professor': 10, 'physics-professor': 10, 'anthropology-professor': 10,
  'cultural-studies-professor': 10, 'economics-professor': 10, 'geography-professor': 10, 'political-science-professor': 10, 'psychology-professor': 10,
  'sociology-professor': 10, 'education-professor': 10, 'library-science-professor': 10, 'criminal-justice-professor': 10, 'social-work-professor': 10,
  'art-professor': 10, 'college-administrator': 10, 'communications-professor': 10, 'english-professor': 10, 'foreign-language-professor': 10, 'history-professor': 10,
  'philosophy-professor': 10, 'family-and-consumer-sciences-professor': 10, 'recreation-and-fitness-professor': 10, 'postsecondary-cte-instructor': 10,
  'self-enrichment-teacher': 10, archivist: 10, 'graduate-teaching-assistant': 10, 'geological-technician': 10, 'surface-mining-equipment-operator': 10,
  'roof-bolter': 10, 'underground-mining-loader-operator': 10, 'extraction-helper': 10, 'control-valve-technician': 10, 'chemical-equipment-operator': 10,
  'separating-machine-operator': 10, 'gas-compressor-operator': 10, 'pump-operator': 10, 'medical-dosimetrist': 10, 'dietetic-technician': 10,
  'ophthalmic-technician': 10, optician: 10, 'hearing-aid-specialist': 10, 'health-information-technologist': 10, 'occupational-therapy-assistant': 10,
  'medical-transcriptionist': 10, 'dental-lab-technician': 10, 'medical-appliance-technician': 10, 'ophthalmic-lab-technician': 10, 'casino-manager': 10,
  'recreation-manager': 10, 'custodial-supervisor': 10, 'casino-floor-supervisor': 10, 'logistics-manager': 10, postmaster: 10, 'railroad-track-equipment-operator': 10,
  'railroad-signal-technician': 10, 'aircraft-cargo-supervisor': 10, 'transportation-supervisor': 10, 'airfield-operations-specialist': 10, 'rail-yard-engineer': 10,
  'railroad-switch-operator': 10, 'subway-operator': 10, 'motorboat-operator': 10, 'traffic-technician': 10, 'dredge-operator': 10, 'hoist-operator': 10,
  'textile-cutting-machine-operator': 10, 'textile-winding-machine-operator': 10, 'fiber-extruding-machine-operator': 10, 'wood-model-maker': 10,
  'wood-patternmaker': 10, 'sawmill-operator': 10, 'woodworking-machine-operator': 10, 'crushing-machine-operator': 10, 'mixing-machine-operator': 10,
  'slicing-machine-operator': 10, 'forming-machine-operator': 10, 'furnace-and-kiln-operator': 10, 'industrial-painter': 10, 'cnc-operator': 10,
  'adhesive-machine-operator': 10, 'industrial-cleaning-operator': 10, 'freezing-equipment-operator': 10, 'molder-and-caster': 10, 'paper-machine-operator': 10,
  'tire-builder': 10, 'industrial-production-manager': 10, 'industrial-engineering-technician': 10, 'production-planner': 10, 'maintenance-supervisor': 10,
  'electric-motor-repairer': 10, 'transportation-equipment-electrician': 10, 'industrial-electronics-repairer': 10, 'car-electronics-installer': 10,
  'auto-glass-technician': 10, 'rail-car-repairer': 10, 'marine-mechanic': 10, 'bicycle-mechanic': 10, 'rv-technician': 10, 'appliance-repair-technician': 10,
  'machinery-maintenance-worker': 10, 'refractory-repairer': 10, 'camera-repairer': 10, 'watch-repairer': 10, 'aircraft-assembler': 10, 'coil-winder': 10,
  'electronics-assembler': 10, 'engine-assembler': 10, 'metal-fabricator': 10, 'fiberglass-laminator': 10, 'timing-device-assembler': 10, 'food-batchmaker': 10,
  'food-cooking-machine-operator': 10, 'extruding-machine-operator': 10, 'forging-machine-operator': 10, 'rolling-machine-operator': 10, 'press-operator': 10,
  'drilling-machine-operator': 10, 'grinding-machine-operator': 10, 'lathe-operator': 10, 'milling-machine-operator': 10, 'metal-furnace-operator': 10,
  'metal-pourer': 10, 'metal-model-maker': 10, 'metal-patternmaker': 10, 'foundry-moldmaker': 10, 'molding-machine-operator': 10, 'multiple-machine-tool-operator': 10,
  'welding-machine-operator': 10, 'heat-treating-operator': 10, 'metal-layout-worker': 10, 'plating-operator': 10, 'tool-grinder': 10, 'prepress-technician': 10,
  'printing-press-operator': 10, 'bindery-worker': 10, 'natural-sciences-manager': 10, mathematician: 10, statistician: 10, 'electrical-drafter': 10,
  'mechanical-drafter': 10, 'aerospace-engineering-technician': 10, 'food-scientist': 10, biochemist: 10, epidemiologist: 10, 'medical-scientist': 10, astronomer: 10,
  physicist: 10, meteorologist: 10, 'materials-scientist': 10, sociologist: 10, archaeologist: 10, geographer: 10, historian: 10,
  'social-science-research-assistant': 10, 'cost-estimator': 10, 'construction-foreman': 10, stonemason: 10, 'terrazzo-worker': 10, 'paving-equipment-operator': 10,
  'pile-driver-operator': 10, glazier: 10, 'mechanical-insulator': 10, 'rebar-worker': 10, 'highway-maintenance-worker': 10, 'garage-door-technician': 10, locksmith: 10,
  rigger: 10, upholsterer: 10, cabinetmaker: 10, 'furniture-finisher': 10,
  // 12 hours: licensed, high-hazard or advanced professional roles (74)
  forester: 12, 'talent-agent': 12, 'financial-advisor': 12, 'industrial-organizational-psychologist': 12, lawyer: 12, 'health-sciences-professor': 12,
  'nursing-instructor': 12, 'law-professor': 12, 'school-principal': 12, 'school-psychologist': 12, 'middle-school-cte-teacher': 12,
  'preschool-special-education-teacher': 12, 'middle-school-special-education-teacher': 12, 'high-school-special-education-teacher': 12, 'mining-engineer': 12,
  'nuclear-engineer': 12, 'petroleum-engineer': 12, blaster: 12, 'health-services-manager': 12, 'physician-assistant': 12, 'nurse-practitioner': 12,
  'nurse-anesthetist': 12, 'nurse-midwife': 12, pharmacist: 12, 'physical-therapist': 12, 'occupational-therapist': 12, dentist: 12, 'oral-surgeon': 12,
  orthodontist: 12, prosthodontist: 12, optometrist: 12, chiropractor: 12, podiatrist: 12, audiologist: 12, 'speech-language-pathologist': 12, anesthesiologist: 12,
  cardiologist: 12, dermatologist: 12, 'emergency-medicine-physician': 12, 'family-medicine-physician': 12, internist: 12, neurologist: 12,
  'obstetrician-gynecologist': 12, pediatrician: 12, pathologist: 12, psychiatrist: 12, radiologist: 12, ophthalmologist: 12, 'orthopedic-surgeon': 12,
  'pediatric-surgeon': 12, acupuncturist: 12, 'radiation-therapist': 12, 'cardiovascular-technologist': 12, 'nuclear-medicine-technologist': 12, 'mri-technologist': 12,
  'orthotist-and-prosthetist': 12, 'genetic-counselor': 12, 'surgical-assistant': 12, 'airline-pilot': 12, 'ship-captain': 12, 'ship-engineer': 12,
  'industrial-engineer': 12, 'engineering-manager': 12, architect: 12, cartographer: 12, 'aerospace-engineer': 12, 'biomedical-engineer': 12, 'chemical-engineer': 12,
  'electronics-engineer': 12, 'marine-engineer': 12, 'materials-engineer': 12, geoscientist: 12, boilermaker: 12, 'commercial-diver': 12,
  // Replaced by provider courses (see partner-selection.mjs): truck-driver, forklift-operator
  'truck-driver': 10, 'forklift-operator': 6
};

// Share of course time per syllabus module (10 modules, sums to 1)
export const moduleWeights = [0.08, 0.06, 0.1, 0.1, 0.22, 0.08, 0.12, 0.08, 0.08, 0.08];

export const minutesLabel = (m) => {
  const r = Math.max(5, Math.round(m / 5) * 5);
  return r >= 60 ? `${Math.floor(r / 60)} hr${r % 60 ? ` ${r % 60} min` : ''}` : `${r} min`;
};
