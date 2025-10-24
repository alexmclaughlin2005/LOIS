# LOIS Database Implementation Guide

Complete step-by-step guide to implementing the database system from scratch.

---

## Overview

You'll be setting up:
1. A Supabase PostgreSQL database
2. Database schema (9 tables with relationships)
3. Seed data generation system (6,000-8,000 records)
4. Integration with your SvelteKit frontend

**Time required**: 30-45 minutes

---

## Phase 1: Supabase Setup (10 minutes)

### Step 1: Create Supabase Account & Project

1. Go to **https://supabase.com**
2. Click **"Start your project"** (free tier available)
3. Sign up with GitHub (recommended) or email
4. Once logged in, click **"New Project"**

### Step 2: Configure Your Project

Fill in the project details:
- **Name**: `lois-legal-ops` (or your preferred name)
- **Database Password**: Create a strong password (save this!)
- **Region**: Choose closest to you (e.g., `us-east-1`)
- **Pricing Plan**: Start with **Free tier** ($0/month)

Click **"Create new project"** and wait 2-3 minutes for provisioning.

### Step 3: Get Your API Credentials

Once the project is ready:

1. Go to **Settings** (gear icon in sidebar)
2. Click **API** section
3. You'll see:
   - **Project URL** - Copy this (looks like `https://xxxxx.supabase.co`)
   - **Project API keys**:
     - `anon` `public` key - For frontend (public, safe to expose)
     - `service_role` key - For backend/seed scripts (SECRET, never expose)

**Save both keys** - you'll need them in the next steps.

---

## Phase 2: Database Schema Setup (5 minutes)

### Step 4: Open SQL Editor

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **"New query"** button

### Step 5: Run the Schema

1. Open the file `database/schema.sql` in your LOIS project
2. **Copy the entire contents** (it's ~550 lines)
3. **Paste into the SQL Editor**
4. Click **"Run"** (or press `Cmd/Ctrl + Enter`)

You should see:
```
Success. No rows returned
```

### Step 6: Verify Tables Created

1. Click **Table Editor** in the left sidebar
2. You should see 9 tables:
   - `projects`
   - `contacts`
   - `project_contacts`
   - `documents`
   - `calendar_entries`
   - `notes`
   - `tasks`
   - `time_entries`
   - `expenses`
   - `invoices`

✅ **Your database schema is now ready!**

---

## Phase 3: Seed Data Generation (15 minutes)

### Step 7: Navigate to Seed Directory

Open your terminal:

```bash
cd /Users/alexmclaughlin/Desktop/Cursor\ Projects/LOIS/database/seed
```

### Step 8: Install Dependencies

```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Database client
- `@faker-js/faker` - Fake data generator
- `tsx` - TypeScript runner
- `dotenv` - Environment variables

### Step 9: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Open `.env` in your editor:
```bash
# Open with your preferred editor
code .env
# or
nano .env
# or
open .env
```

3. Fill in your Supabase credentials:
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: Use the `service_role` key (not the `anon` key) for seed scripts.

4. Save the file

### Step 10: Run the Seed Script

```bash
npm run seed
```

You'll see colorful output showing progress:

```
🚀 LOIS Database Seed Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 Checking database connection...
✅ Connected to Supabase

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PHASE 1: Core Entities
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Generating projects (legal cases)...
✅ Inserted projects batch 1 (100 projects)
✅ Inserted projects batch 2 (75 projects)
✨ Generated 175 projects

👥 Generating contacts...
✅ Inserted contacts batch 1 (100 contacts)
✅ Inserted contacts batch 2 (100 contacts)
✅ Inserted contacts batch 3 (100 contacts)
✅ Inserted contacts batch 4 (50 contacts)
✨ Generated 350 contacts

...
```

**Wait 2-5 minutes** for completion.

### Step 11: Verify Data

When complete, you'll see a summary:

```
🎉 DATA GENERATION COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary:
   Projects:         175
   Contacts:         350
   Documents:        875
   Calendar Entries: 612
   Notes:            701
   Tasks:            525
   Time Entries:     2634
   Expenses:         438
   Invoices:         201

   Total Records:    6511
   Duration:         137.23s

✅ Database is ready for use!
```

### Step 12: Verify in Supabase Dashboard

1. Go back to **Supabase Dashboard**
2. Click **Table Editor**
3. Click on `projects` table
4. You should see ~175 rows of legal case data
5. Check other tables - all should have data

✅ **Your database is now populated!**

---

## Phase 4: Test Queries (5 minutes)

### Step 13: Run Sample Queries

1. Go to **SQL Editor** in Supabase
2. Try these queries:

**Query 1: Personal Injury cases with high medical expenses**
```sql
SELECT
  case_number,
  title,
  status,
  custom_fields->>'medical_expenses' as medical_expenses,
  custom_fields->>'injury_type' as injury_type
FROM projects
WHERE case_type = 'Personal Injury'
  AND (custom_fields->>'medical_expenses')::numeric > 100000
ORDER BY (custom_fields->>'medical_expenses')::numeric DESC
LIMIT 10;
```

**Query 2: Upcoming deadlines in next 7 days**
```sql
SELECT
  p.case_number,
  p.title,
  c.title as deadline,
  c.start_time
FROM calendar_entries c
JOIN projects p ON c.project_id = p.id
WHERE c.entry_type = 'Deadline'
  AND c.start_time BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY c.start_time;
```

**Query 3: Total billable hours by project**
```sql
SELECT
  p.case_number,
  p.title,
  COUNT(te.id) as time_entries,
  SUM(te.hours) as total_hours,
  SUM(te.total_amount) as total_fees
FROM time_entries te
JOIN projects p ON te.project_id = p.id
WHERE te.is_billable = TRUE
GROUP BY p.id, p.case_number, p.title
ORDER BY total_fees DESC
LIMIT 20;
```

**Query 4: Full-text search in documents**
```sql
SELECT
  p.case_number,
  d.title,
  d.document_type,
  LEFT(d.content, 200) as preview
FROM documents d
JOIN projects p ON d.project_id = p.id
WHERE to_tsvector('english', d.content) @@ to_tsquery('english', 'settlement | damages')
LIMIT 10;
```

All queries should return results! 🎉

---

## Phase 5: Frontend Integration (10 minutes)

### Step 14: Install Supabase Client in Frontend

```bash
cd /Users/alexmclaughlin/Desktop/Cursor\ Projects/LOIS/frontend
npm install @supabase/supabase-js
```

### Step 15: Create Supabase Client File

Create a new file: `frontend/src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

const supabaseUrl = env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Step 16: Add Environment Variables to Frontend

1. Create `frontend/.env` file:
```bash
cd frontend
touch .env
```

2. Add your credentials (use the `anon` key, NOT service_role):
```bash
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 17: Create a Test Query Function

Create `frontend/src/lib/queries.ts`:

```typescript
import { supabase } from './supabase';

export async function getOpenPersonalInjuryCases() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('case_type', 'Personal Injury')
    .eq('status', 'Open')
    .eq('phase', 'Discovery');

  if (error) {
    console.error('Error fetching cases:', error);
    return [];
  }

  return data;
}

export async function getCasesWithHighMedicalExpenses() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('case_type', 'Personal Injury')
    .filter('custom_fields->>medical_expenses', 'gt', '100000');

  if (error) {
    console.error('Error fetching cases:', error);
    return [];
  }

  return data;
}
```

### Step 18: Test in Your Chat Component

Update `frontend/src/routes/chat/+page.svelte`:

```typescript
<script lang="ts">
  import { getOpenPersonalInjuryCases, getCasesWithHighMedicalExpenses } from '$lib/queries';

  // Add a test function
  async function testDatabaseConnection() {
    console.log('Testing database connection...');

    const cases = await getOpenPersonalInjuryCases();
    console.log('Open PI cases in discovery:', cases.length);

    const highMedCases = await getCasesWithHighMedicalExpenses();
    console.log('Cases with high medical expenses:', highMedCases.length);
  }

  // Call on mount
  import { onMount } from 'svelte';
  onMount(() => {
    testDatabaseConnection();
  });
</script>
```

### Step 19: Test It!

1. Make sure your dev server is running:
```bash
cd frontend
npm run dev
```

2. Open http://localhost:5173/chat

3. Open browser console (F12)

4. You should see:
```
Testing database connection...
Open PI cases in discovery: 42
Cases with high medical expenses: 12
```

✅ **Your frontend is now connected to the database!**

---

## Phase 6: Replace Demo Mode (Optional - 15 minutes)

### Step 20: Update Message Handler

In `frontend/src/routes/chat/+page.svelte`, find the `handleDemoQuery` function and replace it with real queries:

```typescript
async function handleUserMessage(content: string) {
  // Add user message
  messages = [...messages, {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date()
  }];

  // Show loading
  isLoading = true;

  // Check for specific queries
  if (content.toLowerCase().includes('open personal injury') &&
      content.toLowerCase().includes('discovery')) {

    const cases = await getOpenPersonalInjuryCases();

    messages = [...messages, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `I found ${cases.length} open personal injury cases in the discovery phase.`,
      data: {
        type: 'table',
        results: cases.map(c => ({
          caseNumber: c.case_number,
          title: c.title,
          status: c.status,
          phase: c.phase,
          filingDate: c.filing_date
        })),
        columns: ['caseNumber', 'title', 'status', 'phase', 'filingDate']
      },
      timestamp: new Date()
    }];
  }
  else if (content.toLowerCase().includes('medical expenses') &&
           content.toLowerCase().includes('100000')) {

    const cases = await getCasesWithHighMedicalExpenses();

    messages = [...messages, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `I found ${cases.length} cases where medical expenses exceed $100,000.`,
      data: {
        type: 'table',
        results: cases.map(c => ({
          caseNumber: c.case_number,
          title: c.title,
          medicalExpenses: c.custom_fields?.medical_expenses,
          injuryType: c.custom_fields?.injury_type
        })),
        columns: ['caseNumber', 'title', 'medicalExpenses', 'injuryType']
      },
      timestamp: new Date()
    }];
  }
  else {
    // Generic response
    messages = [...messages, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "I'm connected to your database! Try asking about open personal injury cases or medical expenses.",
      timestamp: new Date()
    }];
  }

  isLoading = false;
}
```

---

## Troubleshooting

### Problem: "Missing required environment variables"

**Solution**:
- Check that `.env` file exists in `database/seed/`
- Verify you copied credentials correctly (no extra spaces)
- Make sure you're using the `service_role` key for seed scripts

### Problem: "relation does not exist"

**Solution**:
- You forgot to run `schema.sql` in Step 5
- Go back to SQL Editor and run the schema

### Problem: "permission denied for table"

**Solution**:
- For seed scripts: Use `service_role` key (not `anon` key)
- For frontend: Use `anon` key (not `service_role` key)

### Problem: Seed script is slow or timing out

**Solution**:
- This is normal for 6,000+ records
- Wait 3-5 minutes
- Check your internet connection
- Supabase free tier may have rate limits

### Problem: Frontend can't connect to database

**Solution**:
- Check `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` in `frontend/.env`
- Verify credentials have `PUBLIC_` prefix
- Restart dev server after adding .env file
- Check browser console for errors

### Problem: Queries return no results

**Solution**:
- Verify data exists: Check Supabase Table Editor
- Check query syntax in console
- Make sure you're filtering on correct fields

---

## Next Steps

Now that your database is set up:

1. **Build More Queries**: Create functions for different case types, date ranges, etc.
2. **Add Authentication**: Supabase has built-in auth (Phase 3 in roadmap)
3. **Enable Row Level Security (RLS)**: Restrict data access by user
4. **Add Real-time Features**: Supabase supports real-time subscriptions
5. **Deploy to Production**: See [DEPLOYMENT_ROADMAP.md](DEPLOYMENT_ROADMAP.md)

---

## Summary Checklist

- [x] Created Supabase account and project
- [x] Copied API credentials (URL + keys)
- [x] Ran schema.sql to create tables
- [x] Verified 9 tables exist in Table Editor
- [x] Installed seed script dependencies
- [x] Configured .env with service_role key
- [x] Ran `npm run seed` successfully
- [x] Verified data in Supabase dashboard
- [x] Tested sample queries in SQL Editor
- [x] Installed @supabase/supabase-js in frontend
- [x] Created frontend/.env with anon key
- [x] Created supabase.ts client
- [x] Created queries.ts functions
- [x] Tested connection in browser console
- [x] (Optional) Replaced demo mode with real queries

---

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase JS Client**: https://supabase.com/docs/reference/javascript
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **LOIS Roadmap**: [DEPLOYMENT_ROADMAP.md](DEPLOYMENT_ROADMAP.md)
- **Data Store Plan**: [DATA_STORE_PLAN.md](DATA_STORE_PLAN.md)

---

## Questions?

If you run into issues:
1. Check the Troubleshooting section above
2. Review the seed script README: `database/seed/README.md`
3. Check Supabase logs in the dashboard
4. Open a GitHub issue with error details

**You're now ready to build with real data!** 🎉
