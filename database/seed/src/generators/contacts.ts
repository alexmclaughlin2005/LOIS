import { faker } from '@faker-js/faker';
import { supabase, config, randomInt, selectByDistribution } from '../config.js';

function generateBarNumber(): string {
  const state = faker.location.state({ abbreviated: true });
  const number = faker.number.int({ min: 100000, max: 999999 });
  return `${state}${number}`;
}

function generateContactByType(contactType: string) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const baseContact = {
    first_name: firstName,
    last_name: lastName,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    phone: faker.phone.number(),
    contact_type: contactType,
    address_line1: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zip_code: faker.location.zipCode(),
    country: 'United States',
    notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 })
  };

  switch (contactType) {
    case 'Attorney':
      return {
        ...baseContact,
        organization: faker.company.name() + ' Law Firm',
        title: faker.helpers.arrayElement([
          'Partner',
          'Associate',
          'Senior Associate',
          'Of Counsel',
          'Managing Partner'
        ]),
        bar_number: generateBarNumber(),
        specialty: faker.helpers.arrayElement([
          'Personal Injury',
          'Corporate Law',
          'Family Law',
          'Employment Law',
          'Real Estate Law',
          'Litigation',
          'Tax Law'
        ])
      };

    case 'Client':
      return {
        ...baseContact,
        organization: faker.helpers.maybe(() => faker.company.name(), { probability: 0.4 }),
        title: faker.helpers.maybe(() => faker.person.jobTitle(), { probability: 0.4 })
      };

    case 'Opposing Counsel':
      return {
        ...baseContact,
        organization: faker.company.name() + ' LLP',
        title: faker.helpers.arrayElement(['Partner', 'Senior Partner', 'Associate']),
        bar_number: generateBarNumber()
      };

    case 'Witness':
      return {
        ...baseContact,
        organization: faker.helpers.maybe(() => faker.company.name(), { probability: 0.5 }),
        title: faker.helpers.maybe(() => faker.person.jobTitle(), { probability: 0.5 })
      };

    case 'Expert':
      return {
        ...baseContact,
        organization: faker.company.name() + ' Consulting',
        title: faker.helpers.arrayElement([
          'Forensic Expert',
          'Medical Expert',
          'Financial Expert',
          'Technical Expert',
          'Industry Expert'
        ]),
        specialty: faker.helpers.arrayElement([
          'Forensic Accounting',
          'Medical Evaluation',
          'Engineering',
          'Accident Reconstruction',
          'Digital Forensics',
          'Toxicology',
          'Psychiatry'
        ])
      };

    case 'Judge':
      return {
        ...baseContact,
        organization: faker.helpers.arrayElement([
          'United States District Court',
          'Superior Court',
          'Circuit Court',
          'Supreme Court'
        ]),
        title: faker.helpers.arrayElement([
          'Judge',
          'Magistrate Judge',
          'Chief Judge',
          'Associate Justice'
        ])
      };

    default:
      return baseContact;
  }
}

async function generateContacts() {
  console.log('👥 Generating contacts...');

  const targetCount = randomInt(config.contacts.min, config.contacts.max);
  const contacts = [];

  for (let i = 0; i < targetCount; i++) {
    const contactType = selectByDistribution(config.contactTypes);
    const contact = generateContactByType(contactType);
    contacts.push(contact);
  }

  // Insert in batches of 100
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < contacts.length; i += batchSize) {
    const batch = contacts.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('contacts')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting contacts batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    insertedCount += batch.length;
    console.log(`✅ Inserted contacts batch ${i / batchSize + 1} (${batch.length} contacts)`);
  }

  console.log(`✅ Successfully generated ${insertedCount} contacts`);

  // Now generate project_contacts relationships
  await generateProjectContacts();

  return insertedCount;
}

async function generateProjectContacts() {
  console.log('🔗 Linking contacts to projects...');

  // Fetch all projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, case_type');

  if (projectsError || !projects) {
    console.error('❌ Error fetching projects:', projectsError);
    throw projectsError;
  }

  // Fetch all contacts by type
  const { data: attorneys, error: attorneysError } = await supabase
    .from('contacts')
    .select('id')
    .eq('contact_type', 'Attorney');

  const { data: clients, error: clientsError } = await supabase
    .from('contacts')
    .select('id')
    .eq('contact_type', 'Client');

  const { data: opposingCounsel, error: opposingError } = await supabase
    .from('contacts')
    .select('id')
    .eq('contact_type', 'Opposing Counsel');

  const { data: witnesses, error: witnessesError } = await supabase
    .from('contacts')
    .select('id')
    .eq('contact_type', 'Witness');

  const { data: experts, error: expertsError } = await supabase
    .from('contacts')
    .select('id')
    .eq('contact_type', 'Expert');

  if (attorneysError || clientsError || opposingError || witnessesError || expertsError) {
    console.error('❌ Error fetching contacts');
    throw new Error('Failed to fetch contacts');
  }

  const projectContacts = [];

  for (const project of projects) {
    // Each project gets:
    // - 1 lead attorney
    // - 1-2 clients (plaintiffs/defendants)
    // - 1 opposing counsel
    // - 0-3 witnesses
    // - 0-2 experts

    // Lead attorney
    if (attorneys && attorneys.length > 0) {
      projectContacts.push({
        project_id: project.id,
        contact_id: faker.helpers.arrayElement(attorneys).id,
        role: 'Lead Attorney',
        is_primary: true
      });
    }

    // Clients
    if (clients && clients.length > 0) {
      const clientCount = randomInt(1, 2);
      const selectedClients = faker.helpers.arrayElements(clients, clientCount);
      selectedClients.forEach((client, index) => {
        projectContacts.push({
          project_id: project.id,
          contact_id: client.id,
          role: index === 0 ? 'Plaintiff' : 'Co-Plaintiff',
          is_primary: index === 0
        });
      });
    }

    // Opposing counsel
    if (opposingCounsel && opposingCounsel.length > 0) {
      projectContacts.push({
        project_id: project.id,
        contact_id: faker.helpers.arrayElement(opposingCounsel).id,
        role: 'Opposing Counsel',
        is_primary: false
      });
    }

    // Witnesses (30% chance)
    if (witnesses && witnesses.length > 0 && Math.random() < 0.3) {
      const witnessCount = randomInt(1, 3);
      const selectedWitnesses = faker.helpers.arrayElements(witnesses, Math.min(witnessCount, witnesses.length));
      selectedWitnesses.forEach(witness => {
        projectContacts.push({
          project_id: project.id,
          contact_id: witness.id,
          role: 'Witness',
          is_primary: false
        });
      });
    }

    // Experts (40% chance)
    if (experts && experts.length > 0 && Math.random() < 0.4) {
      const expertCount = randomInt(1, 2);
      const selectedExperts = faker.helpers.arrayElements(experts, Math.min(expertCount, experts.length));
      selectedExperts.forEach(expert => {
        projectContacts.push({
          project_id: project.id,
          contact_id: expert.id,
          role: 'Expert Witness',
          is_primary: false
        });
      });
    }
  }

  // Insert project_contacts in batches
  const batchSize = 100;
  for (let i = 0; i < projectContacts.length; i += batchSize) {
    const batch = projectContacts.slice(i, i + batchSize);
    const { error } = await supabase
      .from('project_contacts')
      .insert(batch);

    if (error) {
      console.error(`❌ Error inserting project_contacts batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    console.log(`✅ Linked batch ${i / batchSize + 1} (${batch.length} relationships)`);
  }

  console.log(`✅ Successfully linked ${projectContacts.length} contacts to projects`);
}

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateContacts()
    .then((count) => {
      console.log(`\n🎉 Complete! Generated ${count} contacts`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

export { generateContacts };
