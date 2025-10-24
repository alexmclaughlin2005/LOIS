# LOIS Quick Start Guide

Fast track to get your database up and running in 15 minutes.

---

## 🚀 Super Quick Setup

### 1. Supabase Setup (3 minutes)
```bash
# 1. Go to https://supabase.com
# 2. Create account → New Project
# 3. Save: Project URL + service_role key
```

### 2. Create Database Tables (2 minutes)
```bash
# In Supabase Dashboard:
# SQL Editor → New Query → Paste database/schema.sql → Run
```

### 3. Generate Data (5 minutes)
```bash
cd database/seed
npm install
cp .env.example .env
# Edit .env with your Supabase URL and service_role key
npm run seed
# Wait 2-5 minutes ☕
```

### 4. Connect Frontend (5 minutes)
```bash
cd ../frontend
npm install @supabase/supabase-js

# Create frontend/.env
echo "PUBLIC_SUPABASE_URL=your-url" >> .env
echo "PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env

# Create src/lib/supabase.ts (see below)
npm run dev
```

---

## 📝 Essential Files

### frontend/src/lib/supabase.ts
```typescript
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

export const supabase = createClient(
  env.PUBLIC_SUPABASE_URL || '',
  env.PUBLIC_SUPABASE_ANON_KEY || ''
);
```

### frontend/src/lib/queries.ts
```typescript
import { supabase } from './supabase';

export async function queryProjects(filters = {}) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .limit(100);

  if (error) throw error;
  return data;
}

export async function searchCases(searchTerm: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .ilike('title', `%${searchTerm}%`)
    .limit(20);

  if (error) throw error;
  return data;
}
```

---

## 🧪 Test Queries

Open Supabase SQL Editor and try:

```sql
-- Count projects by type
SELECT case_type, COUNT(*) as count
FROM projects
GROUP BY case_type
ORDER BY count DESC;

-- High value cases
SELECT case_number, title, estimated_value
FROM projects
WHERE estimated_value > 500000
ORDER BY estimated_value DESC
LIMIT 10;

-- Recent documents
SELECT p.case_number, d.title, d.document_type, d.date_received
FROM documents d
JOIN projects p ON d.project_id = p.id
ORDER BY d.date_received DESC
LIMIT 20;
```

---

## 🎯 Common Commands

```bash
# Regenerate all data (clears existing)
npm run seed -- --clear

# Run specific generators
npm run seed:projects
npm run seed:contacts
npm run seed:documents

# Frontend dev server
cd frontend && npm run dev

# Build frontend
cd frontend && npm run build
```

---

## ⚠️ Important Notes

**Use the RIGHT keys:**
- **Seed scripts** → `SUPABASE_SERVICE_KEY` (service_role key)
- **Frontend** → `PUBLIC_SUPABASE_ANON_KEY` (anon key)

**Don't commit:**
- `database/seed/.env` (has service_role key)
- `frontend/.env` (has your credentials)

**Free Tier Limits:**
- 500 MB database storage
- 2 GB bandwidth/month
- Should be plenty for prototyping!

---

## 📚 Full Documentation

- **Detailed guide**: [DATABASE_IMPLEMENTATION_GUIDE.md](DATABASE_IMPLEMENTATION_GUIDE.md)
- **Database plan**: [DATA_STORE_PLAN.md](DATA_STORE_PLAN.md)
- **Seed docs**: [database/seed/README.md](database/seed/README.md)
- **Deployment roadmap**: [DEPLOYMENT_ROADMAP.md](DEPLOYMENT_ROADMAP.md)

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Missing environment variables" | Check `.env` file exists and has correct keys |
| "relation does not exist" | Run `schema.sql` in SQL Editor first |
| "permission denied" | Use `service_role` key for seed, `anon` key for frontend |
| Seed script slow | Normal for 6K+ records, wait 3-5 minutes |
| Frontend can't connect | Restart dev server after adding `.env` |

---

## ✅ Success Checklist

After setup, you should have:
- ✅ 9 tables in Supabase (projects, contacts, documents, etc.)
- ✅ ~6,000-8,000 records generated
- ✅ Sample queries returning results
- ✅ Frontend connected (check browser console)
- ✅ No errors in Supabase logs

**Ready to build!** 🎉

---

**Next**: See [DATABASE_IMPLEMENTATION_GUIDE.md](DATABASE_IMPLEMENTATION_GUIDE.md) for detailed steps.
