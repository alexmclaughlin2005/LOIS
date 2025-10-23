import { faker } from '@faker-js/faker';
import { supabase, config, randomInt, randomDate, selectByDistribution } from '../config.js';

// ============================================================================
// NOTES GENERATION
// ============================================================================

function generateNoteByType(noteType: string, caseType: string): { title: string; content: string } {
  switch (noteType) {
    case 'Case Note':
      return {
        title: `Case Update - ${faker.date.recent({ days: 30 }).toLocaleDateString()}`,
        content: `${faker.lorem.paragraph(2)}\n\nKey Points:\n- ${faker.lorem.sentence()}\n- ${faker.lorem.sentence()}\n- ${faker.lorem.sentence()}\n\nNext Steps:\n${faker.lorem.paragraph()}`
      };

    case 'Strategy':
      return {
        title: `Strategy - ${faker.lorem.words(3)}`,
        content: `Strategic Analysis:\n\n${faker.lorem.paragraph(3)}\n\nProposed Approach:\n1. ${faker.lorem.sentence()}\n2. ${faker.lorem.sentence()}\n3. ${faker.lorem.sentence()}\n\nRisks:\n- ${faker.lorem.sentence()}\n- ${faker.lorem.sentence()}\n\nExpected Outcome:\n${faker.lorem.paragraph()}`
      };

    case 'Meeting Note':
      return {
        title: `Meeting Notes - ${faker.person.lastName()} - ${faker.date.recent({ days: 7 }).toLocaleDateString()}`,
        content: `Attendees: ${faker.person.fullName()}, ${faker.person.fullName()}\n\nAgenda:\n${faker.lorem.sentence()}\n\nDiscussion:\n${faker.lorem.paragraph(3)}\n\nAction Items:\n- ${faker.lorem.sentence()}\n- ${faker.lorem.sentence()}\n- ${faker.lorem.sentence()}\n\nNext Meeting: TBD`
      };

    case 'Phone Call':
      return {
        title: `Call with ${faker.person.fullName()} - ${faker.date.recent({ days: 3 }).toLocaleDateString()}`,
        content: `Date: ${faker.date.recent({ days: 3 }).toLocaleString()}\nDuration: ${randomInt(5, 45)} minutes\n\nSummary:\n${faker.lorem.paragraph(2)}\n\nFollow-up Required:\n${faker.lorem.sentence()}`
      };

    case 'Research':
      return {
        title: `Research Note - ${faker.lorem.words(4)}`,
        content: `Research Question:\n${faker.lorem.sentence()}\n\nFindings:\n${faker.lorem.paragraph(3)}\n\nRelevant Cases:\n- ${faker.lorem.words(5)} (${randomInt(1990, 2024)})\n- ${faker.lorem.words(5)} (${randomInt(1990, 2024)})\n\nConclusion:\n${faker.lorem.paragraph()}`
      };

    default:
      return {
        title: faker.lorem.words(5),
        content: faker.lorem.paragraphs(3)
      };
  }
}

async function generateNotes() {
  console.log('📝 Generating notes...');

  // Fetch all projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, case_type');

  if (projectsError || !projects) {
    console.error('❌ Error fetching projects:', projectsError);
    throw projectsError;
  }

  const notes = [];
  const noteTypes = ['Case Note', 'Strategy', 'Meeting Note', 'Phone Call', 'Research'];

  for (const project of projects) {
    const noteCount = randomInt(
      config.notes.perProject.min,
      config.notes.perProject.max
    );

    for (let i = 0; i < noteCount; i++) {
      const noteType = faker.helpers.arrayElement(noteTypes);
      const { title, content } = generateNoteByType(noteType, project.case_type);

      const note = {
        project_id: project.id,
        title: title,
        content: content,
        note_type: noteType,
        is_pinned: Math.random() < 0.15, // 15% chance to be pinned
        tags: faker.helpers.arrayElements(
          ['important', 'follow-up', 'client', 'internal', 'urgent', 'reference'],
          randomInt(1, 3)
        )
      };

      notes.push(note);
    }
  }

  console.log(`📊 Generated ${notes.length} notes for ${projects.length} projects`);

  // Insert in batches of 100
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < notes.length; i += batchSize) {
    const batch = notes.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('notes')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting notes batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    insertedCount += batch.length;
    console.log(`✅ Inserted notes batch ${i / batchSize + 1} (${batch.length} notes)`);
  }

  console.log(`✅ Successfully generated ${insertedCount} notes`);
  return insertedCount;
}

// ============================================================================
// TASKS GENERATION
// ============================================================================

function generateTaskByType(taskType: string): { title: string; description: string } {
  switch (taskType) {
    case 'To-Do':
      return {
        title: faker.helpers.arrayElement([
          'Review case file',
          'Update client on status',
          'Prepare for deposition',
          'Draft response',
          'Schedule meeting',
          'File motion'
        ]),
        description: faker.lorem.sentence()
      };

    case 'Follow-Up':
      return {
        title: `Follow up with ${faker.person.fullName()}`,
        description: `Need to follow up regarding ${faker.lorem.words(5)}. Last contact: ${faker.date.recent({ days: 7 }).toLocaleDateString()}`
      };

    case 'Review':
      return {
        title: `Review ${faker.helpers.arrayElement(['documents', 'discovery', 'evidence', 'contract', 'pleadings'])}`,
        description: `Complete review of ${faker.lorem.words(4)} by ${faker.date.soon({ days: 7 }).toLocaleDateString()}`
      };

    case 'Research':
      return {
        title: `Research ${faker.lorem.words(3)}`,
        description: `Conduct legal research on ${faker.lorem.words(5)}. Focus on recent case law and statutory updates.`
      };

    case 'Filing':
      return {
        title: `File ${faker.helpers.arrayElement(['motion', 'response', 'complaint', 'brief', 'discovery'])}`,
        description: `Prepare and file ${faker.lorem.words(3)} with the court. Ensure all exhibits are attached.`
      };

    default:
      return {
        title: faker.lorem.words(4),
        description: faker.lorem.sentence()
      };
  }
}

async function generateTasks() {
  console.log('✅ Generating tasks...');

  // Fetch all projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id');

  if (projectsError || !projects) {
    console.error('❌ Error fetching projects:', projectsError);
    throw projectsError;
  }

  const tasks = [];
  const taskTypes = ['To-Do', 'Follow-Up', 'Review', 'Research', 'Filing'];
  const taskStatuses = {
    'Pending': 0.50,
    'In Progress': 0.30,
    'Completed': 0.15,
    'Cancelled': 0.05
  };

  for (const project of projects) {
    const taskCount = randomInt(
      config.tasks.perProject.min,
      config.tasks.perProject.max
    );

    for (let i = 0; i < taskCount; i++) {
      const taskType = faker.helpers.arrayElement(taskTypes);
      const status = selectByDistribution(taskStatuses);
      const { title, description } = generateTaskByType(taskType);

      // Generate due date (past for completed, future for others)
      let dueDate: Date;
      if (status === 'Completed') {
        dueDate = randomDate(new Date(2024, 0, 1), new Date());
      } else {
        dueDate = randomDate(new Date(), new Date(2025, 11, 31));
      }

      const task: any = {
        project_id: project.id,
        title: title,
        description: description,
        task_type: taskType,
        status: status,
        priority: selectByDistribution(config.priorities),
        due_date: dueDate.toISOString()
      };

      // Add completed_at if status is Completed
      if (status === 'Completed') {
        const completedDate = new Date(dueDate);
        completedDate.setDate(completedDate.getDate() - randomInt(0, 5));
        task.completed_at = completedDate.toISOString();
      }

      tasks.push(task);
    }
  }

  console.log(`📊 Generated ${tasks.length} tasks for ${projects.length} projects`);

  // Insert in batches of 100
  const batchSize = 100;
  let insertedCount = 0;

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('tasks')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting tasks batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    insertedCount += batch.length;
    console.log(`✅ Inserted tasks batch ${i / batchSize + 1} (${batch.length} tasks)`);
  }

  console.log(`✅ Successfully generated ${insertedCount} tasks`);
  return insertedCount;
}

// ============================================================================
// COMBINED RUNNER
// ============================================================================

async function generateNotesAndTasks() {
  const notesCount = await generateNotes();
  const tasksCount = await generateTasks();
  return { notesCount, tasksCount };
}

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateNotesAndTasks()
    .then(({ notesCount, tasksCount }) => {
      console.log(`\n🎉 Complete! Generated ${notesCount} notes and ${tasksCount} tasks`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

export { generateNotes, generateTasks, generateNotesAndTasks };
