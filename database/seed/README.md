# LOIS Database Seed Scripts

Automated data generation system for creating realistic legal case management data for high-fidelity prototyping.

## Overview

This seed system generates:
- **150-200 Projects** (legal cases) with custom fields
- **300-400 Contacts** (attorneys, clients, witnesses, experts)
- **800-1000 Documents** with realistic mock content
- **500-700 Calendar Entries** (court dates, depositions, deadlines)
- **600-800 Notes** (case notes, strategy, meeting notes)
- **400-600 Tasks** (to-dos, follow-ups, reviews)
- **2000-3000 Time Entries** with billable hours
- **300-500 Expenses** (court fees, expert fees, travel)
- **150-250 Invoices** with payment tracking

**Total: ~6,000-8,000 records** of interconnected legal case data.

---

## Prerequisites

### 1. Supabase Project Setup

1. Create a free Supabase account: https://supabase.com
2. Create a new project
3. Navigate to **Settings > API**
4. Copy your:
   - Project URL
   - Service role key (NOT the anon key)

### 2. Database Schema

Run the schema SQL first:

```bash
# From the database directory
psql "your-supabase-connection-string" < schema.sql

# OR use Supabase SQL Editor:
# 1. Go to SQL Editor in Supabase dashboard
# 2. Copy/paste contents of schema.sql
# 3. Click "Run"
```

### 3. Environment Configuration

```bash
cd database/seed
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=https://xxxxx.supabase.co
# SUPABASE_SERVICE_KEY=your-service-role-key
```

⚠️ **Important**: Use the **service role key**, not the anon key. The service role key has full database access needed for bulk inserts.

---

## Installation

```bash
cd database/seed
npm install
```

Dependencies:
- `@supabase/supabase-js` - Supabase client
- `@faker-js/faker` - Realistic fake data generation
- `tsx` - TypeScript execution
- `dotenv` - Environment variable management

---

## Usage

### Generate All Data

```bash
npm run seed
```

This runs all generators in sequence:
1. Projects (legal cases)
2. Contacts + project relationships
3. Documents with mock content
4. Calendar entries (court dates, deadlines)
5. Notes and tasks
6. Time entries, expenses, invoices

**Estimated time**: 2-5 minutes depending on data volume.

### Clear and Regenerate

```bash
npm run seed -- --clear
# or
npm run seed -- -c
```

This will:
1. Delete all existing data
2. Generate fresh data

⚠️ **Warning**: This will permanently delete all data in the database.

### Run Individual Generators

```bash
# Generate only projects
npm run seed:projects

# Generate only contacts
npm run seed:contacts

# Generate only documents
npm run seed:documents

# Generate calendar entries
npm run seed:calendar

# Generate notes and tasks
npm run seed:notes

# Generate billing data
npm run seed:billing
```

---

## Data Characteristics

### Projects (Legal Cases)

**Case Types** (with custom fields):
- **Personal Injury** (40%) - medical_expenses, lost_wages, injury_type, accident_date
- **Corporate** (25%) - contract_value, transaction_type, closing_date, parties_involved
- **Family Law** (15%) - case_subtype, marital_assets_value, number_of_children
- **Employment** (10%) - damages_sought, termination_date, eeoc_filed
- **Real Estate** (10%) - property_value, property_type, square_footage

**Case Statuses**:
- Open (70%)
- Closed (25%)
- On Hold (5%)

**Case Phases**: Discovery, Trial, Settlement, Pre-Trial, Appeal

### Contacts

**Distribution**:
- Clients (35%)
- Attorneys (20%)
- Witnesses (20%)
- Opposing Counsel (15%)
- Experts (10%)

**Relationships**: Each project has 3-10 linked contacts with specific roles (Lead Attorney, Plaintiff, Defendant, Expert Witness, etc.)

### Documents

**Types**: Pleadings, Discovery, Correspondence, Evidence, Contracts, Motions

**Realistic Content**: Each document includes:
- Full-text mock legal content (complaints, motions, interrogatories)
- 500-3000 words per document
- Searchable via full-text search

### Calendar Entries

**Types**:
- Court Dates (hearings, trials, conferences)
- Depositions (with attendees)
- Deadlines (discovery, filing, expert designation)
- Meetings (client meetings, strategy sessions)
- Hearings (motions, preliminary)

**Scheduling**: Distributed from 2024-2026 with realistic reminders.

### Notes & Tasks

**Note Types**: Case Notes, Strategy, Meeting Notes, Phone Calls, Research

**Task Types**: To-Dos, Follow-Ups, Reviews, Research, Filings

**Statuses**:
- Tasks: Pending (50%), In Progress (30%), Completed (15%), Cancelled (5%)
- Notes: 15% pinned, tagged by category

### Billing Data

**Time Entries**:
- 15+ activity types (Research, Court Appearance, Document Review, etc.)
- Hourly rates by seniority: Partners ($450-750), Associates ($250-350), Paralegals ($150-200)
- 0.1 hour increments (6-minute billing)
- 95% billable rate

**Expenses**:
- Court filing fees, expert witness fees, deposition costs, travel
- $50-$15,000 per expense

**Invoices**:
- Monthly billing cycles
- Statuses: Draft, Sent, Paid, Overdue
- 30-day payment terms

---

## Query Examples

After seeding, test with these queries:

```sql
-- Personal injury cases with medical expenses > $100k
SELECT *
FROM projects
WHERE case_type = 'Personal Injury'
  AND (custom_fields->>'medical_expenses')::numeric > 100000;

-- Upcoming deadlines in next 7 days
SELECT p.case_number, p.title, c.title as deadline, c.start_time
FROM calendar_entries c
JOIN projects p ON c.project_id = p.id
WHERE c.entry_type = 'Deadline'
  AND c.start_time BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY c.start_time;

-- Total billable hours by project
SELECT p.case_number, SUM(te.hours) as total_hours, SUM(te.total_amount) as total_fees
FROM time_entries te
JOIN projects p ON te.project_id = p.id
WHERE te.is_billable = TRUE
GROUP BY p.id, p.case_number
ORDER BY total_fees DESC;

-- Full-text search across documents
SELECT p.case_number, d.title, d.document_type
FROM documents d
JOIN projects p ON d.project_id = p.id
WHERE to_tsvector('english', d.content) @@ to_tsquery('english', 'settlement & damages');

-- Cases with overdue tasks
SELECT p.case_number, p.title, COUNT(t.id) as overdue_tasks
FROM projects p
JOIN tasks t ON t.project_id = p.id
WHERE t.status IN ('Pending', 'In Progress')
  AND t.due_date < NOW()
GROUP BY p.id, p.case_number, p.title
ORDER BY overdue_tasks DESC;
```

---

## File Structure

```
database/seed/
├── src/
│   ├── config.ts                 # Supabase client + data config
│   ├── index.ts                  # Master seed script
│   └── generators/
│       ├── projects.ts           # Projects with custom fields
│       ├── contacts.ts           # Contacts + project relationships
│       ├── documents.ts          # Documents with mock content
│       ├── calendar.ts           # Calendar entries
│       ├── notes-tasks.ts        # Notes and tasks
│       └── billing.ts            # Time, expenses, invoices
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Troubleshooting

### Error: "Missing required environment variables"

**Fix**: Create `.env` file with `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.

### Error: "relation does not exist"

**Fix**: Run `schema.sql` first to create tables.

### Error: "permission denied"

**Fix**: Use the **service role key**, not the anon key. Service role has full access.

### Slow performance

**Tip**: The script uses batched inserts (50-200 records per batch) for optimal performance. Large datasets (8000+ records) may take 3-5 minutes.

### Connection timeout

**Fix**: Check your internet connection and Supabase project status. Try increasing timeout in config.ts.

---

## Data Generation Logic

### Realistic Distributions

All data follows real-world patterns:
- Case types weighted by frequency (Personal Injury 40%, Corporate 25%, etc.)
- 70% cases are open, 25% closed
- 95% billable rate for time entries
- Projects have 3-10 related contacts
- Each project has 4-8 documents, 3-6 calendar entries, 10-20 time entries

### Referential Integrity

All foreign keys are properly maintained:
- Documents → Projects
- Tasks → Projects
- Time Entries → Projects
- Calendar Entries → Projects (with contact attendees)
- Project Contacts → Projects + Contacts (junction table)
- Invoices reference Time Entries and Expenses

### Searchable Content

- Documents have full-text searchable content
- Notes have realistic case commentary
- All names, addresses, dates are realistic (via Faker.js)

---

## Next Steps

After seeding:

1. **Verify in Supabase Dashboard**
   - Go to Table Editor
   - Check record counts match expected ranges
   - Spot-check data quality

2. **Test Queries**
   - Use the SQL Editor in Supabase
   - Run the example queries from schema.sql
   - Test full-text search on documents

3. **Integrate with Frontend**
   - Update frontend to use real Supabase client
   - Replace demo mode with actual queries
   - See [DEPLOYMENT_ROADMAP.md](../../DEPLOYMENT_ROADMAP.md) Phase 2

4. **Configure Row Level Security (RLS)**
   - Once authentication is added, enable RLS policies
   - Restrict access by user roles

---

## Development

### Adding New Data Types

1. Add generator file: `src/generators/my-entity.ts`
2. Export generation function
3. Add to `src/index.ts`
4. Add npm script to `package.json`

### Modifying Data Volumes

Edit `config.ts`:

```typescript
export const config = {
  projects: {
    min: 150,
    max: 200
  },
  // ... adjust as needed
};
```

### Custom Distributions

Modify distribution weights in `config.ts`:

```typescript
caseTypes: {
  'Personal Injury': 0.40,
  'Corporate': 0.25,
  // Add new types or adjust weights
}
```

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/alexmclaughlin2005/LOIS/issues
- Documentation: [DATA_STORE_PLAN.md](../DATA_STORE_PLAN.md)

---

**Ready to seed your database?**

```bash
npm install
npm run seed
```

🎉 Your LOIS database will be populated with realistic legal case management data in minutes!
