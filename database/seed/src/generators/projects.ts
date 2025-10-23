import { faker } from '@faker-js/faker';
import { supabase, config, randomInt, selectByDistribution, randomDate } from '../config.js';

interface CustomFields {
  [key: string]: any;
}

// Personal Injury custom fields
function generatePersonalInjuryFields(): CustomFields {
  return {
    medical_expenses: faker.number.float({ min: 25000, max: 500000, precision: 0.01 }),
    lost_wages: faker.number.float({ min: 10000, max: 150000, precision: 0.01 }),
    injury_type: faker.helpers.arrayElement([
      'Spinal Injury',
      'Traumatic Brain Injury',
      'Broken Bones',
      'Soft Tissue Injury',
      'Burns',
      'Amputation'
    ]),
    accident_date: faker.date.past({ years: 2 }).toISOString().split('T')[0],
    accident_type: faker.helpers.arrayElement([
      'Motor Vehicle Accident',
      'Slip and Fall',
      'Workplace Injury',
      'Medical Malpractice',
      'Product Liability'
    ]),
    treatment_status: faker.helpers.arrayElement([
      'Ongoing',
      'Completed',
      'Surgery Required',
      'Physical Therapy'
    ])
  };
}

// Corporate custom fields
function generateCorporateFields(): CustomFields {
  return {
    contract_value: faker.number.float({ min: 500000, max: 10000000, precision: 0.01 }),
    transaction_type: faker.helpers.arrayElement([
      'Merger & Acquisition',
      'Contract Dispute',
      'Intellectual Property',
      'Securities',
      'Corporate Governance'
    ]),
    closing_date: faker.date.future({ years: 1 }).toISOString().split('T')[0],
    parties_involved: randomInt(2, 5),
    regulatory_body: faker.helpers.arrayElement([
      'SEC',
      'FTC',
      'DOJ',
      'State Commerce Dept',
      'None'
    ])
  };
}

// Family Law custom fields
function generateFamilyLawFields(): CustomFields {
  return {
    case_subtype: faker.helpers.arrayElement([
      'Divorce',
      'Child Custody',
      'Child Support',
      'Spousal Support',
      'Property Division'
    ]),
    number_of_children: faker.helpers.arrayElement([0, 1, 2, 3]),
    marital_assets_value: faker.number.float({ min: 100000, max: 5000000, precision: 0.01 }),
    marriage_duration_years: randomInt(1, 30),
    mediation_required: faker.datatype.boolean()
  };
}

// Employment custom fields
function generateEmploymentFields(): CustomFields {
  return {
    case_subtype: faker.helpers.arrayElement([
      'Wrongful Termination',
      'Discrimination',
      'Wage & Hour',
      'Harassment',
      'Retaliation'
    ]),
    employee_count: randomInt(1, 50),
    damages_sought: faker.number.float({ min: 50000, max: 2000000, precision: 0.01 }),
    eeoc_filed: faker.datatype.boolean(),
    termination_date: faker.date.past({ years: 1 }).toISOString().split('T')[0]
  };
}

// Real Estate custom fields
function generateRealEstateFields(): CustomFields {
  return {
    property_value: faker.number.float({ min: 200000, max: 10000000, precision: 0.01 }),
    property_type: faker.helpers.arrayElement([
      'Residential',
      'Commercial',
      'Industrial',
      'Land',
      'Multi-Family'
    ]),
    transaction_type: faker.helpers.arrayElement([
      'Purchase',
      'Sale',
      'Lease Dispute',
      'Zoning',
      'Title Dispute'
    ]),
    property_address: faker.location.streetAddress(true),
    square_footage: randomInt(1000, 50000)
  };
}

function generateCustomFields(caseType: string): CustomFields {
  switch (caseType) {
    case 'Personal Injury':
      return generatePersonalInjuryFields();
    case 'Corporate':
      return generateCorporateFields();
    case 'Family Law':
      return generateFamilyLawFields();
    case 'Employment':
      return generateEmploymentFields();
    case 'Real Estate':
      return generateRealEstateFields();
    default:
      return {};
  }
}

function generateCaseNumber(index: number): string {
  const year = new Date().getFullYear();
  const type = faker.helpers.arrayElement(['CV', 'PI', 'CR', 'FL', 'EM']);
  return `${type}-${year}-${String(index).padStart(5, '0')}`;
}

function generatePhase(caseType: string, status: string): string | null {
  if (status === 'Closed') {
    return null;
  }

  const phases = [
    'Initial Filing',
    'Discovery',
    'Pre-Trial',
    'Trial',
    'Settlement Negotiations',
    'Mediation',
    'Appeal'
  ];

  return faker.helpers.arrayElement(phases);
}

async function generateProjects() {
  console.log('🏢 Generating projects (legal cases)...');

  const targetCount = randomInt(config.projects.min, config.projects.max);
  const projects = [];

  for (let i = 1; i <= targetCount; i++) {
    const caseType = selectByDistribution(config.caseTypes);
    const status = selectByDistribution(config.statuses);
    const priority = selectByDistribution(config.priorities);
    const customFields = generateCustomFields(caseType);

    const filingDate = randomDate(
      new Date(2022, 0, 1),
      new Date()
    );

    const project = {
      case_number: generateCaseNumber(i),
      title: faker.company.catchPhrase() + ' v. ' + faker.company.name(),
      case_type: caseType,
      status: status,
      phase: generatePhase(caseType, status),
      jurisdiction: faker.helpers.arrayElement([
        'Federal - Southern District of New York',
        'Federal - Northern District of California',
        'State - New York Supreme Court',
        'State - California Superior Court',
        'State - Texas District Court',
        'State - Florida Circuit Court'
      ]),
      court_name: faker.helpers.arrayElement([
        'United States District Court',
        'Superior Court',
        'Circuit Court',
        'Supreme Court',
        'Municipal Court'
      ]),
      filing_date: filingDate.toISOString().split('T')[0],
      estimated_value: faker.number.float({ min: 50000, max: 5000000, precision: 0.01 }),
      priority: priority,
      custom_fields: customFields,
      description: faker.lorem.paragraph(3)
    };

    projects.push(project);
  }

  // Insert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < projects.length; i += batchSize) {
    const batch = projects.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('projects')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting projects batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    console.log(`✅ Inserted projects batch ${i / batchSize + 1} (${batch.length} projects)`);
  }

  console.log(`✅ Successfully generated ${projects.length} projects`);
  return projects.length;
}

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateProjects()
    .then((count) => {
      console.log(`\n🎉 Complete! Generated ${count} projects`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

export { generateProjects };
