import { faker } from '@faker-js/faker';
import { supabase, config, randomInt, randomDate } from '../config.js';

// Mock document content generators by type
function generateComplaintContent(caseType: string): string {
  return `COMPLAINT FOR DAMAGES

Comes now the Plaintiff, by and through undersigned counsel, and for their Complaint against Defendant, states as follows:

PARTIES
1. Plaintiff ${faker.person.fullName()} is a resident of ${faker.location.city()}, ${faker.location.state()}.
2. Defendant ${faker.company.name()} is a corporation doing business in ${faker.location.state()}.

JURISDICTION AND VENUE
3. This Court has jurisdiction over this matter pursuant to ${faker.lorem.words(5)}.
4. Venue is proper in this Court as the events giving rise to this action occurred in ${faker.location.county()}.

FACTUAL ALLEGATIONS
5. On or about ${faker.date.past({ years: 2 }).toLocaleDateString()}, ${faker.lorem.sentence()}.
6. As a direct result of Defendant's actions, Plaintiff suffered ${faker.lorem.words(10)}.
7. Defendant's conduct was negligent, reckless, and in violation of applicable law.

CAUSES OF ACTION
COUNT I - NEGLIGENCE
8-12. [Detailed negligence allegations...]

COUNT II - ${faker.lorem.words(2).toUpperCase()}
13-17. [Additional allegations...]

PRAYER FOR RELIEF
WHEREFORE, Plaintiff respectfully requests this Court enter judgment in their favor and award damages in excess of ${faker.number.int({ min: 100000, max: 1000000 })}, costs, attorney fees, and such other relief as the Court deems just and proper.

Respectfully submitted,
${faker.person.fullName()}, Esq.
Attorney for Plaintiff
Date: ${new Date().toLocaleDateString()}`;
}

function generateMotionContent(): string {
  return `MOTION FOR ${faker.lorem.words(3).toUpperCase()}

Comes now the ${faker.helpers.arrayElement(['Plaintiff', 'Defendant'])}, and respectfully moves this Court for an Order ${faker.lorem.words(8)}, and in support thereof states as follows:

BACKGROUND
${faker.lorem.paragraph(3)}

LEGAL STANDARD
${faker.lorem.paragraph(2)}

ARGUMENT
I. ${faker.lorem.words(5).toUpperCase()}
${faker.lorem.paragraph(4)}

II. ${faker.lorem.words(5).toUpperCase()}
${faker.lorem.paragraph(4)}

CONCLUSION
For the foregoing reasons, ${faker.helpers.arrayElement(['Plaintiff', 'Defendant'])} respectfully requests this Court grant this Motion and provide such other relief as the Court deems appropriate.

Respectfully submitted,
${faker.person.fullName()}, Esq.
Date: ${new Date().toLocaleDateString()}`;
}

function generateDiscoveryContent(): string {
  const requestCount = randomInt(10, 25);
  let content = `INTERROGATORIES TO ${faker.helpers.arrayElement(['PLAINTIFF', 'DEFENDANT'])}\n\n`;
  content += `Please answer the following interrogatories separately and fully in writing under oath:\n\n`;

  for (let i = 1; i <= requestCount; i++) {
    content += `${i}. ${faker.lorem.sentence({ min: 10, max: 20 })}\n\n`;
  }

  content += `Respectfully submitted,\n${faker.person.fullName()}, Esq.\nDate: ${new Date().toLocaleDateString()}`;
  return content;
}

function generateCorrespondenceContent(): string {
  return `From: ${faker.person.fullName()} <${faker.internet.email()}>
To: ${faker.person.fullName()} <${faker.internet.email()}>
Date: ${faker.date.recent({ days: 30 }).toLocaleString()}
Subject: RE: ${faker.lorem.words(5)}

Dear ${faker.person.lastName()}:

${faker.lorem.paragraph(2)}

${faker.lorem.paragraph(3)}

${faker.lorem.paragraph(2)}

Please contact me if you have any questions.

Best regards,
${faker.person.fullName()}, Esq.
${faker.company.name()}
${faker.phone.number()}
${faker.internet.email()}`;
}

function generateContractContent(): string {
  return `${faker.lorem.words(3).toUpperCase()} AGREEMENT

This Agreement ("Agreement") is entered into as of ${faker.date.recent({ days: 90 }).toLocaleDateString()} ("Effective Date") by and between:

${faker.company.name()} ("Party A")
${faker.company.name()} ("Party B")

RECITALS
WHEREAS, ${faker.lorem.sentence()};
WHEREAS, ${faker.lorem.sentence()};

NOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, the parties agree as follows:

1. DEFINITIONS
   ${faker.lorem.paragraph(2)}

2. SCOPE OF SERVICES
   ${faker.lorem.paragraph(3)}

3. COMPENSATION
   Party A agrees to pay Party B $${faker.number.int({ min: 50000, max: 500000 })} for ${faker.lorem.words(5)}.

4. TERM AND TERMINATION
   ${faker.lorem.paragraph(2)}

5. CONFIDENTIALITY
   ${faker.lorem.paragraph(3)}

6. GOVERNING LAW
   This Agreement shall be governed by the laws of ${faker.location.state()}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

[Signatures]`;
}

function generateEvidenceDescription(): string {
  return `EVIDENCE ITEM: ${faker.lorem.words(4).toUpperCase()}

Description: ${faker.lorem.paragraph(2)}

Chain of Custody:
- Collected: ${faker.date.past({ years: 1 }).toLocaleDateString()}
- Collected by: ${faker.person.fullName()}
- Location: ${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}

Analysis: ${faker.lorem.paragraph(3)}

Relevance: ${faker.lorem.paragraph(2)}`;
}

function generateDocumentContent(documentType: string, caseType: string): string {
  switch (documentType) {
    case 'Pleading':
      return generateComplaintContent(caseType);
    case 'Motion':
      return generateMotionContent();
    case 'Discovery':
      return generateDiscoveryContent();
    case 'Correspondence':
      return generateCorrespondenceContent();
    case 'Contract':
      return generateContractContent();
    case 'Evidence':
      return generateEvidenceDescription();
    default:
      return faker.lorem.paragraphs(5);
  }
}

function generateDocumentTitle(documentType: string): string {
  switch (documentType) {
    case 'Pleading':
      return faker.helpers.arrayElement([
        'Complaint for Damages',
        'Answer to Complaint',
        'Amended Complaint',
        'Cross-Complaint'
      ]);
    case 'Motion':
      return `Motion for ${faker.lorem.words(3)}`;
    case 'Discovery':
      return faker.helpers.arrayElement([
        'Interrogatories Set 1',
        'Request for Production of Documents',
        'Request for Admissions',
        'Deposition Notice',
        'Responses to Interrogatories'
      ]);
    case 'Correspondence':
      return `RE: ${faker.lorem.words(4)}`;
    case 'Contract':
      return `${faker.lorem.words(2)} Agreement`;
    case 'Evidence':
      return `Evidence - ${faker.lorem.words(3)}`;
    default:
      return faker.lorem.words(5);
  }
}

async function generateDocuments() {
  console.log('📄 Generating documents...');

  // Fetch all projects
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, case_type');

  if (projectsError || !projects) {
    console.error('❌ Error fetching projects:', projectsError);
    throw projectsError;
  }

  const documents = [];
  const documentTypes = ['Pleading', 'Discovery', 'Correspondence', 'Evidence', 'Contract', 'Motion'];

  for (const project of projects) {
    const docCount = randomInt(
      config.documents.perProject.min,
      config.documents.perProject.max
    );

    for (let i = 0; i < docCount; i++) {
      const documentType = faker.helpers.arrayElement(documentTypes);
      const title = generateDocumentTitle(documentType);
      const content = generateDocumentContent(documentType, project.case_type);

      const dateReceived = randomDate(
        new Date(2022, 0, 1),
        new Date()
      );

      const document = {
        project_id: project.id,
        title: title,
        document_type: documentType,
        file_name: title.toLowerCase().replace(/\s+/g, '_') + '.pdf',
        file_size_kb: randomInt(50, 5000),
        mime_type: 'application/pdf',
        content: content,
        status: faker.helpers.arrayElement(['Draft', 'Final', 'Filed', 'Received']),
        date_received: dateReceived.toISOString().split('T')[0],
        tags: faker.helpers.arrayElements(
          ['urgent', 'confidential', 'reviewed', 'pending', 'important'],
          randomInt(1, 3)
        )
      };

      // Add date_filed if status is 'Filed'
      if (document.status === 'Filed') {
        const dateFiled = new Date(dateReceived);
        dateFiled.setDate(dateFiled.getDate() + randomInt(1, 7));
        document['date_filed'] = dateFiled.toISOString().split('T')[0];
      }

      documents.push(document);
    }
  }

  console.log(`📊 Generated ${documents.length} documents for ${projects.length} projects`);

  // Insert in batches of 50 (documents have large content)
  const batchSize = 50;
  let insertedCount = 0;

  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = documents.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('documents')
      .insert(batch)
      .select();

    if (error) {
      console.error(`❌ Error inserting documents batch ${i / batchSize + 1}:`, error);
      throw error;
    }

    insertedCount += batch.length;
    console.log(`✅ Inserted documents batch ${i / batchSize + 1} (${batch.length} documents)`);
  }

  console.log(`✅ Successfully generated ${insertedCount} documents`);
  return insertedCount;
}

// If running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDocuments()
    .then((count) => {
      console.log(`\n🎉 Complete! Generated ${count} documents`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

export { generateDocuments };
