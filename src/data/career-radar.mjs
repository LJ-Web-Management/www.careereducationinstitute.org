// Career Radar (daily game at /games/career-radar/): settings and the careers that can be the secret career.
//
// The date formula (in src/assets/career-radar.js) picks today's secret career:
//   day    = days since launch (launch day is Career Radar #1)
//   answer = answers[(day × step + offset) mod answers.length]
// step must be a prime that doesn't divide the number of answers (the build checks), so every answer comes up once
// before any repeats. Answers are well-known careers (100,000+ U.S. jobs when the list was made); every guess can be any
// of the site's careers.
//
// Editing the answers list (adding or removing careers) changes which career falls on each day from then on, so do it
// rarely. Every slug must be a career in src/data/careers (the build checks).
export const radar = {
  launch: '2026-11-19',
  step: 389,
  offset: 17,
  answers: [
    "911-dispatcher", "account-executive", "accountant", "administrative-assistant", "administrative-services-manager",
    "aircraft-mechanic", "airline-pilot", "amusement-park-attendant", "animal-caretaker", "architect", "art-director",
    "art-professor", "auto-body-technician", "automotive-service-technician", "baker", "bank-teller", "banquet-server",
    "barista", "bartender", "billing-clerk", "bookkeeper", "building-maintenance-technician", "business-professor",
    "busser", "butcher", "cad-drafter", "cafeteria-cook", "career-and-technical-education-teacher", "cargo-agent",
    "carpenter", "cashier", "certified-nursing-assistant", "chef", "chemical-equipment-operator", "chief-executive",
    "childcare-worker", "civil-engineer", "claims-adjuster", "cnc-machinist", "cnc-operator", "college-administrator",
    "compensation-and-benefits-specialist", "compliance-officer", "computer-systems-analyst", "concrete-finisher",
    "construction-foreman", "construction-inspector", "construction-laborer", "construction-manager",
    "corporate-trainer", "correctional-officer", "cosmetologist", "cost-estimator", "courier", "court-clerk",
    "custodial-supervisor", "customer-service-representative", "cybersecurity-analyst", "data-entry-clerk",
    "data-scientist", "debt-collector", "delivery-driver", "dental-assistant", "dental-hygienist", "dentist",
    "detective", "diesel-mechanic", "digital-marketing-specialist", "dishwasher", "drywall-installer", "editor",
    "electrical-engineer", "electrical-lineworker", "electrician", "electronics-assembler",
    "elementary-school-teacher", "eligibility-interviewer", "emt", "engineering-manager", "esthetician",
    "event-planner", "executive-assistant", "facilities-manager", "family-medicine-physician", "farm-manager",
    "farmworker", "fast-food-cook", "financial-advisor", "financial-analyst", "financial-manager",
    "financial-services-sales-agent", "firefighter", "flight-attendant", "food-batchmaker", "food-service-supervisor",
    "forklift-operator", "freight-dispatcher", "fundraiser", "gas-station-attendant", "general-and-operations-manager",
    "graduate-teaching-assistant", "graphic-designer", "hand-packer", "health-sciences-professor",
    "health-services-manager", "healthcare-social-worker", "heavy-equipment-mechanic", "heavy-equipment-operator",
    "high-school-special-education-teacher", "high-school-teacher", "highway-maintenance-worker", "home-health-aide",
    "hotel-front-desk-agent", "hotel-housekeeper", "human-resources-manager", "human-resources-specialist",
    "human-services-assistant", "hvac-technician", "industrial-engineer", "industrial-maintenance-technician",
    "industrial-painter", "industrial-production-manager", "instructional-coordinator", "insurance-agent",
    "insurance-claims-clerk", "insurance-underwriter", "intake-interviewer", "it-manager", "it-support-specialist",
    "janitor", "kindergarten-teacher", "landscaper", "landscaping-supervisor", "lawyer", "legal-secretary",
    "librarian", "licensed-practical-nurse", "lifeguard", "line-cook", "loan-officer", "loan-processor",
    "logistics-coordinator", "logistics-manager", "mail-sorter", "maintenance-supervisor", "management-analyst",
    "marketing-manager", "massage-therapist", "meat-trimmer", "mechanical-engineer",
    "medical-administrative-assistant", "medical-assistant", "medical-billing-and-coding-specialist",
    "medical-lab-technician", "medical-scientist", "middle-school-teacher", "molding-machine-operator",
    "multiple-machine-tool-operator", "nail-technician", "natural-sciences-manager", "network-administrator",
    "network-technician", "nurse-practitioner", "occupational-safety-specialist", "occupational-therapist",
    "office-clerk", "office-manager", "operations-research-analyst", "packaging-machine-operator", "painter",
    "paralegal", "paramedic", "parking-attendant", "parts-salesperson", "payroll-clerk", "personal-trainer",
    "pest-control-technician", "pharmacist", "pharmacy-technician", "phlebotomist", "photographer",
    "physical-therapist", "physical-therapist-assistant", "physician-assistant", "plumber", "police-officer",
    "postal-mail-carrier", "postsecondary-cte-instructor", "prep-cook", "preschool-teacher", "press-operator",
    "printing-press-operator", "producer-and-director", "production-assembler", "production-helper",
    "production-planner", "production-supervisor", "project-manager", "property-manager", "psychiatric-technician",
    "public-relations-specialist", "purchasing-agent", "quality-control-inspector", "radiologic-technologist",
    "ranch-hand", "real-estate-agent", "real-estate-broker", "receptionist", "recreation-worker", "refuse-collector",
    "registered-nurse", "rental-agent", "reservation-agent", "respiratory-therapist", "restaurant-host",
    "restaurant-manager", "retail-sales-associate", "retail-store-manager", "roofer", "route-sales-driver",
    "sales-manager", "salon-manager", "school-bus-driver", "school-counselor", "school-principal", "security-guard",
    "self-enrichment-teacher", "server", "sewing-machine-operator", "sheet-metal-worker",
    "shipping-and-receiving-clerk", "short-order-cook", "shuttle-driver", "social-and-community-service-manager",
    "social-worker", "software-developer", "software-qa-tester", "special-education-teacher",
    "speech-language-pathologist", "sports-coach", "stock-associate", "substance-abuse-counselor",
    "substitute-teacher", "surgical-technologist", "taxi-driver", "teacher-assistant",
    "technical-sales-representative", "telecommunications-lineworker", "telecommunications-technician",
    "tire-technician", "transit-bus-driver", "transportation-supervisor", "truck-driver", "tutor", "usher",
    "ux-ui-designer", "vehicle-cleaner", "veterinary-assistant", "veterinary-technician", "visual-merchandiser",
    "warehouse-associate", "water-treatment-operator", "welder", "wholesale-sales-representative", "writer"
  ]
};
