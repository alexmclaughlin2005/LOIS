import { faker } from '@faker-js/faker';
import { supabase, config, randomInt, randomDate } from '../config.js';

// Attorney hourly rates by seniority
const HOURLY_RATES = {
  partner: [450, 550, 650, 750],
  senior: [350, 400, 450],
  associate: [250, 300, 350],
  paralegal: [150, 175, 200]
};

// Common legal activities
const ACTIVITY_TYPES = [
  'Legal Research',
  'Document Review',
  'Document Drafting',
  'Client Meeting',
  'Court Appearance',
  'Deposition',
  'Discovery Review',
  'Case Strategy',
  'Motion Preparation',
  'Brief Writing',
  'Witness Preparation',
  'Settlement Negotiation',
  'Email Correspondence',
  'Phone Conference',
  'File Review'
];

function generateActivityDescription(activityType: string): string {
  const templates: Record<string, string[]> = {
    'Legal Research': [
      'Research case law on {topic}',
      'Analyze statutory requirements for {topic}',
      'Review recent decisions regarding {topic}'
    ],
    'Document Review': [
      'Review and analyze {documents}',
      'Detailed review of {documents} for case preparation',
      'Examination of {documents} received in discovery'
    ],
    'Document Drafting': [
      'Draft {document} for filing',
      'Prepare {document} with supporting exhibits',
      'Revise and finalize {document}'
    ],
    'Client Meeting': [
      'Meeting with client to discuss case strategy',
      'Conference with client regarding {topic}',
      'Client consultation on settlement options'
    ],
    'Court Appearance': [
      'Appearance for {hearing}',
      'Attend court hearing on {motion}',
      'Represent client at {proceeding}'
    ]
  };

  const template = templates[activityType]
    ? faker.helpers.arrayElement(templates[activityType])
    : `${activityType} - ${faker.lorem.words(5)}`;

  return template
    .replace('{topic}', faker.lorem.words(3))
    .replace('{documents}', faker.lorem.words(2))
    .replace('{document}', faker.lorem.words(2))
    .replace('{hearing}', faker.lorem.words(2))
    .replace('{motion}', faker.lorem.words(3))
    .replace('{proceeding}', faker.lorem.words(2));
}

// ============================================================================
// TIME ENTRIES GENERATION
// ============================================================================

async function generateTimeEntries() {
  console.log('⏱️  Generating time entries...');

  // Fetch all projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, filing_date');

  if (projectsError || !projects) {
    console.error('❌ Error fetching projects:', projectsError);
    throw projectsError;
  }

  const timeEntries = [];

  for (const project of projects) {
    const entryCount = randomInt(
      config.timeEntries.perProject.min,
      config.timeEntries.perProject.max
    );

    const filingDate = project.filing_date ? new Date(project.filing_date) : new Date(2023, 0, 1);

    for (let i = 0; i < entryCount; i++) {
      const activityType = faker.helpers.arrayElement(ACTIVITY_TYPES);
      const seniorityLevel = faker.helpers.arrayElement(['partner', 'senior', 'associate', 'paralegal']);
      const hourlyRate = faker.helpers.arrayElement(HOURLY_RATES[seniorityLevel]);

      // Generate hours in 0.1 increments (6 minute billing increments)
      const hours = Math.round(faker.number.float({ min: 0.1, max: 8.0, precision: 0.1 }) * 10) / 10;

      const entryDate = randomDate(
        filingDate,
        new Date()
      );

      const timeEntry = {
        project_id: project.id,
        attorney: faker.string.uuid(), // Mock attorney UUID
        date: entryDate.toISOString().split('T')[0],
        hours: hours,
        activity_type: activityType,
        description: generateActivityDescription(activityType),
        hourly_rate: hourlyRate,
        is_billable: Math.random() < 0.95 // 95% billable
      };

      timeEntries.push(timeEntry);
    }
  }

  console.log(`📊 Generated ${timeEntries.length} time entries for ${projects.length} projects`);

  // Insert in batches of 200
  const batchSize = 200;
  let insertedCount = 0;

  for (let i = 0; i < timeEntries.length; i += batchSize) {
    const batch = timeEntries.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('time_entries')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting time entries batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    insertedCount += batch.length;
    console.log(`✅ Inserted time entries batch ${i / batchSize + 1} (${batch.length} entries)`);
  }

  console.log(`✅ Successfully generated ${insertedCount} time entries`);
  return insertedCount;
}

// ============================================================================
// EXPENSES GENERATION
// ============================================================================

const EXPENSE_TYPES = [
  { type: 'Court Filing Fee', range: [50, 500] },
  { type: 'Expert Witness Fee', range: [2000, 15000] },
  { type: 'Deposition Costs', range: [500, 2000] },
  { type: 'Court Reporter', range: [300, 1500] },
  { type: 'Document Production', range: [100, 800] },
  { type: 'Travel', range: [200, 1500] },
  { type: 'Photocopying', range: [50, 300] },
  { type: 'Postage and Delivery', range: [25, 150] },
  { type: 'Research Database Fees', range: [100, 500] },
  { type: 'Process Server', range: [75, 300] }
];

async function generateExpenses() {
  console.log('💰 Generating expenses...');

  // Fetch all projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, filing_date');

  if (projectsError || !projects) {
    console.error('❌ Error fetching projects:', projectsError);
    throw projectsError;
  }

  const expenses = [];

  for (const project of projects) {
    const expenseCount = randomInt(
      config.expenses.perProject.min,
      config.expenses.perProject.max
    );

    const filingDate = project.filing_date ? new Date(project.filing_date) : new Date(2023, 0, 1);

    for (let i = 0; i < expenseCount; i++) {
      const expenseType = faker.helpers.arrayElement(EXPENSE_TYPES);

      const expenseDate = randomDate(
        filingDate,
        new Date()
      );

      const expense = {
        project_id: project.id,
        date: expenseDate.toISOString().split('T')[0],
        expense_type: expenseType.type,
        description: `${expenseType.type} - ${faker.lorem.words(4)}`,
        amount: faker.number.float({
          min: expenseType.range[0],
          max: expenseType.range[1],
          precision: 0.01
        }),
        vendor: faker.company.name(),
        is_billable: Math.random() < 0.90 // 90% billable
      };

      expenses.push(expense);
    }
  }

  console.log(`📊 Generated ${expenses.length} expenses for ${projects.length} projects`);

  // Insert in batches of 100
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < expenses.length; i += batchSize) {
    const batch = expenses.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('expenses')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting expenses batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    insertedCount += batch.length;
    console.log(`✅ Inserted expenses batch ${i / batchSize + 1} (${batch.length} expenses)`);
  }

  console.log(`✅ Successfully generated ${insertedCount} expenses`);
  return insertedCount;
}

// ============================================================================
// INVOICES GENERATION
// ============================================================================

async function generateInvoices() {
  console.log('🧾 Generating invoices...');

  // Fetch all projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, filing_date, case_number');

  if (projectsError || !projects) {
    console.error('❌ Error fetching projects:', projectsError);
    throw projectsError;
  }

  const invoices = [];
  let invoiceCounter = 1;

  for (const project of projects) {
    // Fetch billable time entries for this project
    const { data: timeEntries, error: timeError } = await supabase
      .from('time_entries')
      .select('id, total_amount')
      .eq('project_id', project.id)
      .eq('is_billable', true)
      .is('invoice_id', null);

    // Fetch billable expenses for this project
    const { data: expenses, error: expenseError } = await supabase
      .from('expenses')
      .select('id, amount')
      .eq('project_id', project.id)
      .eq('is_billable', true)
      .is('invoice_id', null);

    if (timeError || expenseError) {
      console.warn(`⚠️ Warning: Could not fetch billing data for project ${project.case_number}`);
      continue;
    }

    // Skip if no billable items
    if ((!timeEntries || timeEntries.length === 0) && (!expenses || expenses.length === 0)) {
      continue;
    }

    // Generate 1-2 invoices per project
    const invoiceCount = randomInt(
      config.invoices.perProject.min,
      config.invoices.perProject.max
    );

    const filingDate = project.filing_date ? new Date(project.filing_date) : new Date(2023, 0, 1);

    for (let i = 0; i < invoiceCount; i++) {
      // Split billable items across invoices
      const timeEntriesForInvoice = timeEntries && timeEntries.length > 0
        ? faker.helpers.arrayElements(timeEntries, Math.ceil(timeEntries.length / invoiceCount))
        : [];

      const expensesForInvoice = expenses && expenses.length > 0
        ? faker.helpers.arrayElements(expenses, Math.ceil(expenses.length / invoiceCount))
        : [];

      // Calculate subtotal
      const timeTotal = timeEntriesForInvoice.reduce((sum, te) => sum + (te.total_amount || 0), 0);
      const expenseTotal = expensesForInvoice.reduce((sum, e) => sum + (e.amount || 0), 0);
      const subtotal = timeTotal + expenseTotal;

      if (subtotal === 0) continue;

      const invoiceDate = randomDate(
        new Date(filingDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days after filing
        new Date()
      );

      const dueDate = new Date(invoiceDate);
      dueDate.setDate(dueDate.getDate() + 30); // 30 days payment terms

      const status = faker.helpers.arrayElement(['Draft', 'Sent', 'Paid', 'Overdue']);

      let amountPaid = 0;
      let paymentDate = null;
      let paymentMethod = null;

      if (status === 'Paid') {
        amountPaid = subtotal;
        paymentDate = randomDate(invoiceDate, new Date());
        paymentMethod = faker.helpers.arrayElement(['Check', 'Wire Transfer', 'Credit Card', 'ACH']);
      } else if (status === 'Overdue') {
        // Set due date in the past
        dueDate.setMonth(dueDate.getMonth() - 2);
      }

      const invoice = {
        project_id: project.id,
        invoice_number: `INV-${new Date().getFullYear()}-${String(invoiceCounter++).padStart(5, '0')}`,
        invoice_date: invoiceDate.toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0],
        status: status,
        subtotal: subtotal,
        tax_amount: 0, // Legal services typically not taxed
        total_amount: subtotal,
        amount_paid: amountPaid,
        payment_date: paymentDate ? paymentDate.toISOString().split('T')[0] : null,
        payment_method: paymentMethod,
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 })
      };

      invoices.push(invoice);
    }
  }

  console.log(`📊 Generated ${invoices.length} invoices for ${projects.length} projects`);

  // Insert invoices
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < invoices.length; i += batchSize) {
    const batch = invoices.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('invoices')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting invoices batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    insertedCount += batch.length;
    console.log(`✅ Inserted invoices batch ${i / batchSize + 1} (${batch.length} invoices)`);
  }

  console.log(`✅ Successfully generated ${insertedCount} invoices`);
  return insertedCount;
}

// ============================================================================
// COMBINED RUNNER
// ============================================================================

async function generateBilling() {
  const timeEntriesCount = await generateTimeEntries();
  const expensesCount = await generateExpenses();
  const invoicesCount = await generateInvoices();

  return { timeEntriesCount, expensesCount, invoicesCount };
}

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateBilling()
    .then(({ timeEntriesCount, expensesCount, invoicesCount }) => {
      console.log(`\n🎉 Complete! Generated:`);
      console.log(`   - ${timeEntriesCount} time entries`);
      console.log(`   - ${expensesCount} expenses`);
      console.log(`   - ${invoicesCount} invoices`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

export { generateTimeEntries, generateExpenses, generateInvoices, generateBilling };
