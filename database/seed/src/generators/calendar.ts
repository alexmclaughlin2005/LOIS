import { faker } from '@faker-js/faker';
import { supabase, config, randomInt, randomDate } from '../config.js';

function generateCalendarEntry(
  projectId: string,
  entryType: string,
  contacts: Array<{ id: string }>
) {
  const startTime = randomDate(
    new Date(2024, 0, 1),
    new Date(2026, 11, 31)
  );

  let entry: any = {
    project_id: projectId,
    entry_type: entryType,
    start_time: startTime.toISOString(),
    status: faker.helpers.arrayElement(['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'])
  };

  switch (entryType) {
    case 'Court Date':
      entry.title = faker.helpers.arrayElement([
        'Preliminary Hearing',
        'Motion Hearing',
        'Trial Date',
        'Status Conference',
        'Settlement Conference',
        'Pre-Trial Conference'
      ]);
      const courtEnd = new Date(startTime);
      courtEnd.setHours(courtEnd.getHours() + randomInt(1, 4));
      entry.end_time = courtEnd.toISOString();
      entry.location = faker.helpers.arrayElement([
        'Courtroom 301, District Court',
        'Courtroom 205, Superior Court',
        'Courtroom 410, Circuit Court',
        'Federal Courthouse, Room 550'
      ]);
      entry.description = `Court appearance for ${faker.lorem.words(5)}. All parties required to attend.`;
      entry.reminder_minutes = 1440; // 24 hours
      entry.is_all_day = false;
      break;

    case 'Deposition':
      const deposedPerson = faker.person.fullName();
      entry.title = `Deposition of ${deposedPerson}`;
      const depoEnd = new Date(startTime);
      depoEnd.setHours(depoEnd.getHours() + randomInt(2, 6));
      entry.end_time = depoEnd.toISOString();
      entry.location = faker.helpers.arrayElement([
        faker.company.name() + ' Law Offices',
        'Court Reporter Services, Suite ' + randomInt(100, 500),
        'Virtual - Zoom'
      ]);
      entry.description = `Deposition of ${deposedPerson}. Court reporter arranged. Estimated duration: ${randomInt(2, 6)} hours.`;
      entry.reminder_minutes = 1440;
      entry.is_all_day = false;
      // Add some attendees
      if (contacts.length > 0) {
        entry.attendees = faker.helpers.arrayElements(contacts, Math.min(randomInt(2, 4), contacts.length)).map(c => c.id);
      }
      break;

    case 'Deadline':
      entry.title = faker.helpers.arrayElement([
        'Discovery Deadline',
        'Response to Motion Due',
        'Expert Designation Deadline',
        'Pretrial Motions Deadline',
        'Settlement Demand Deadline',
        'Filing Deadline - Amended Complaint'
      ]);
      entry.end_time = null;
      entry.location = null;
      entry.description = `${entry.title}. Must be completed by end of business day.`;
      entry.reminder_minutes = 2880; // 48 hours
      entry.is_all_day = true;
      break;

    case 'Meeting':
      entry.title = faker.helpers.arrayElement([
        'Client Meeting',
        'Strategy Session',
        'Team Meeting - Case Review',
        'Expert Consultation',
        'Settlement Negotiation',
        'Mediation Prep Meeting'
      ]);
      const meetingEnd = new Date(startTime);
      meetingEnd.setHours(meetingEnd.getHours() + randomInt(1, 3));
      entry.end_time = meetingEnd.toISOString();
      entry.location = faker.helpers.arrayElement([
        'Conference Room A',
        'Office',
        'Client Office',
        'Virtual - Teams',
        'Virtual - Zoom',
        faker.location.streetAddress()
      ]);
      entry.description = faker.lorem.sentence();
      entry.reminder_minutes = 30;
      entry.is_all_day = false;
      // Add attendees
      if (contacts.length > 0) {
        entry.attendees = faker.helpers.arrayElements(contacts, Math.min(randomInt(1, 5), contacts.length)).map(c => c.id);
      }
      break;

    case 'Hearing':
      entry.title = faker.helpers.arrayElement([
        'Motion to Dismiss Hearing',
        'Summary Judgment Hearing',
        'Preliminary Injunction Hearing',
        'Discovery Dispute Hearing',
        'Sanctions Hearing'
      ]);
      const hearingEnd = new Date(startTime);
      hearingEnd.setHours(hearingEnd.getHours() + randomInt(1, 2));
      entry.end_time = hearingEnd.toISOString();
      entry.location = faker.helpers.arrayElement([
        'Courtroom 201',
        'Courtroom 305',
        'Courtroom 450',
        'Virtual Hearing - Court Zoom'
      ]);
      entry.description = `Hearing on ${faker.lorem.words(5)}. Oral arguments scheduled.`;
      entry.reminder_minutes = 1440;
      entry.is_all_day = false;
      break;

    default:
      entry.title = faker.lorem.words(4);
      entry.description = faker.lorem.sentence();
      entry.is_all_day = false;
  }

  return entry;
}

async function generateCalendarEntries() {
  console.log('📅 Generating calendar entries...');

  // Fetch all projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id');

  if (projectsError || !projects) {
    console.error('❌ Error fetching projects:', projectsError);
    throw projectsError;
  }

  // Fetch contacts for attendees
  const { data: contacts, error: contactsError } = await supabase
    .from('contacts')
    .select('id')
    .limit(100); // Get a sample of contacts for attendees

  if (contactsError) {
    console.warn('⚠️ Warning: Could not fetch contacts for attendees');
  }

  const entries = [];
  const entryTypes = ['Court Date', 'Deposition', 'Deadline', 'Meeting', 'Hearing'];

  for (const project of projects) {
    const entryCount = randomInt(
      config.calendar.perProject.min,
      config.calendar.perProject.max
    );

    for (let i = 0; i < entryCount; i++) {
      const entryType = faker.helpers.arrayElement(entryTypes);
      const entry = generateCalendarEntry(
        project.id,
        entryType,
        contacts || []
      );
      entries.push(entry);
    }
  }

  console.log(`📊 Generated ${entries.length} calendar entries for ${projects.length} projects`);

  // Insert in batches of 100
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('calendar_entries')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting calendar entries batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    insertedCount += batch.length;
    console.log(`✅ Inserted calendar entries batch ${i / batchSize + 1} (${batch.length} entries)`);
  }

  console.log(`✅ Successfully generated ${insertedCount} calendar entries`);
  return insertedCount;
}

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateCalendarEntries()
    .then((count) => {
      console.log(`\n🎉 Complete! Generated ${count} calendar entries`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

export { generateCalendarEntries };
