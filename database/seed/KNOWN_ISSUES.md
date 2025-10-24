# Known Issues with Seed Data

## Party Names in Case Titles Don't Match Contacts

### Issue
Case titles are generated with party names (e.g., "Matter v. Hahn - McLaughlin"), but these party names are not created as contact records and linked to the case.

**Example:**
- Case: `FL-2025-00035` - "Face to face clear-thinking challenge v. Hahn - McLaughlin"
- Linked contacts: "Emie Graham, Kayden Walsh, Euna Klein" (unrelated names)
- Missing: "Hahn" and "McLaughlin" as contact records

### Root Cause
The seed generation has two independent phases:
1. **Phase 1**: Generate projects with random party names in titles
2. **Phase 2**: Generate contacts and randomly assign them to projects

These phases don't communicate, so party names in titles don't become actual contacts.

### Impact
- Queries like "Which cases involved Hahn?" may not find cases if searching only the contacts table
- Data doesn't reflect real-world legal practice where parties in case titles are also contacts
- Reduces fidelity of prototype/demo data

### Workaround
The LLM query generation prompt has been updated to search **both**:
- Case titles (using `ILIKE '%name%'`)
- Contact records (first_name, last_name)

This allows finding cases by party name regardless of whether they're in contacts.

### Proper Fix (Future Enhancement)
Refactor seed generation to:

1. **Generate party names first**
   ```typescript
   const plaintiffName = { first: faker.person.firstName(), last: faker.person.lastName() };
   const defendantName = { first: faker.person.firstName(), last: faker.person.lastName() };
   ```

2. **Use names in case title**
   ```typescript
   title: `${plaintiff.last} v. ${defendant.last}`
   ```

3. **Create contact records for parties**
   ```typescript
   const plaintiffContact = generateContactByType('Client', plaintiff);
   const defendantContact = generateContactByType('Opposing Party', defendant);
   ```

4. **Link parties to case**
   ```typescript
   await linkContactsToProject(project.id, [
     { contactId: plaintiffContact.id, role: 'Plaintiff' },
     { contactId: defendantContact.id, role: 'Defendant' }
   ]);
   ```

### References
- Issue discovered during testing: "Which cases involved Hahn?" query
- LLM prompt fix: commit 277c42c
- Related files:
  - `/database/seed/src/generators/projects.ts` (line 178 - title generation)
  - `/database/seed/src/generators/contacts.ts` (lines 157-291 - contact linking)
