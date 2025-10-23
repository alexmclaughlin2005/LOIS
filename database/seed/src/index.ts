#!/usr/bin/env tsx
/**
 * LOIS Database Seed Script
 *
 * Generates realistic legal case management data for high-fidelity prototyping.
 *
 * Usage:
 *   npm run seed              # Run all generators
 *   npm run seed:projects     # Run specific generator
 *
 * Prerequisites:
 *   1. Create a Supabase project
 *   2. Run schema.sql to create tables
 *   3. Create .env file with SUPABASE_URL and SUPABASE_SERVICE_KEY
 */

import { supabase } from './config.js';
import { generateProjects } from './generators/projects.js';
import { generateContacts } from './generators/contacts.js';
import { generateDocuments } from './generators/documents.js';
import { generateCalendarEntries } from './generators/calendar.js';
import { generateNotesAndTasks } from './generators/notes-tasks.js';
import { generateBilling } from './generators/billing.js';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function checkConnection() {
  try {
    const { data, error } = await supabase.from('projects').select('count').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    return false;
  }
}

async function clearDatabase() {
  log('\n🗑️  Clearing existing data...', colors.yellow);

  const tables = [
    'invoices',
    'expenses',
    'time_entries',
    'tasks',
    'notes',
    'calendar_entries',
    'documents',
    'project_contacts',
    'contacts',
    'projects'
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) {
        console.warn(`⚠️  Warning: Could not clear ${table}:`, error.message);
      } else {
        log(`✅ Cleared ${table}`, colors.green);
      }
    } catch (error) {
      console.warn(`⚠️  Warning: Could not clear ${table}`);
    }
  }

  log('✅ Database cleared\n', colors.green);
}

async function generateAllData() {
  const startTime = Date.now();

  log('\n' + '='.repeat(60), colors.cyan);
  log('🚀 LOIS Database Seed Script', colors.bright + colors.cyan);
  log('='.repeat(60) + '\n', colors.cyan);

  // Check connection
  log('📡 Checking database connection...', colors.blue);
  const connected = await checkConnection();
  if (!connected) {
    log('❌ Failed to connect to database. Please check your .env configuration.', colors.red);
    process.exit(1);
  }
  log('✅ Connected to Supabase\n', colors.green);

  // Ask user if they want to clear existing data
  const shouldClear = process.argv.includes('--clear') || process.argv.includes('-c');
  if (shouldClear) {
    await clearDatabase();
  }

  try {
    // Phase 1: Core Entities (Projects & Contacts)
    log('━'.repeat(60), colors.cyan);
    log('📋 PHASE 1: Core Entities', colors.bright + colors.blue);
    log('━'.repeat(60) + '\n', colors.cyan);

    const projectsCount = await generateProjects();
    log(`\n✨ Generated ${projectsCount} projects\n`, colors.green);

    const contactsCount = await generateContacts();
    log(`\n✨ Generated ${contactsCount} contacts with project relationships\n`, colors.green);

    // Phase 2: Content Entities (Documents, Calendar, Notes, Tasks)
    log('\n' + '━'.repeat(60), colors.cyan);
    log('📄 PHASE 2: Content Entities', colors.bright + colors.blue);
    log('━'.repeat(60) + '\n', colors.cyan);

    const documentsCount = await generateDocuments();
    log(`\n✨ Generated ${documentsCount} documents\n`, colors.green);

    const calendarCount = await generateCalendarEntries();
    log(`\n✨ Generated ${calendarCount} calendar entries\n`, colors.green);

    const { notesCount, tasksCount } = await generateNotesAndTasks();
    log(`\n✨ Generated ${notesCount} notes and ${tasksCount} tasks\n`, colors.green);

    // Phase 3: Billing Entities (Time Entries, Expenses, Invoices)
    log('\n' + '━'.repeat(60), colors.cyan);
    log('💰 PHASE 3: Billing & Time Tracking', colors.bright + colors.blue);
    log('━'.repeat(60) + '\n', colors.cyan);

    const { timeEntriesCount, expensesCount, invoicesCount } = await generateBilling();
    log(`\n✨ Generated:`, colors.green);
    log(`   - ${timeEntriesCount} time entries`, colors.green);
    log(`   - ${expensesCount} expenses`, colors.green);
    log(`   - ${invoicesCount} invoices\n`, colors.green);

    // Summary
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    log('\n' + '='.repeat(60), colors.cyan);
    log('🎉 DATA GENERATION COMPLETE!', colors.bright + colors.green);
    log('='.repeat(60) + '\n', colors.cyan);

    log('📊 Summary:', colors.bright);
    log(`   Projects:         ${projectsCount}`, colors.cyan);
    log(`   Contacts:         ${contactsCount}`, colors.cyan);
    log(`   Documents:        ${documentsCount}`, colors.cyan);
    log(`   Calendar Entries: ${calendarCount}`, colors.cyan);
    log(`   Notes:            ${notesCount}`, colors.cyan);
    log(`   Tasks:            ${tasksCount}`, colors.cyan);
    log(`   Time Entries:     ${timeEntriesCount}`, colors.cyan);
    log(`   Expenses:         ${expensesCount}`, colors.cyan);
    log(`   Invoices:         ${invoicesCount}`, colors.cyan);

    const totalRecords = projectsCount + contactsCount + documentsCount + calendarCount +
                         notesCount + tasksCount + timeEntriesCount + expensesCount + invoicesCount;

    log(`\n   Total Records:    ${totalRecords}`, colors.bright + colors.green);
    log(`   Duration:         ${duration}s`, colors.cyan);

    log('\n✅ Database is ready for use!', colors.bright + colors.green);
    log('\n💡 Next steps:', colors.yellow);
    log('   1. Verify data in Supabase dashboard', colors.reset);
    log('   2. Test queries using the sample queries in schema.sql', colors.reset);
    log('   3. Integrate with your SvelteKit frontend\n', colors.reset);

  } catch (error) {
    log('\n❌ Fatal error during data generation:', colors.red);
    console.error(error);
    process.exit(1);
  }
}

// Run the seed script
generateAllData()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    log('\n❌ Unexpected error:', colors.red);
    console.error(error);
    process.exit(1);
  });
