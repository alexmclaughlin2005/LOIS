# LOIS Deployment & Development Roadmap

## Current Status

**Repository**: https://github.com/alexmclaughlin2005/LOIS
**Current Phase**: Demo/Prototype - Ready for Deployment
**Deployment Target**: Vercel (Monolithic SvelteKit)
**Last Updated**: October 23, 2025

### ✅ Completed
- SvelteKit frontend with chat interface
- Demo mode with 2 hardcoded queries
- Routine creation card (560px form)
- Routines library side panel (480px)
- Data visualization components
- Comprehensive documentation (IMPLEMENTATION.md)
- GitHub repository setup
- Design system implementation (Figma-based)

### 🎯 Next Immediate Step
**Deploy to Vercel** - Get the demo app live and accessible

---

## Phase 1: Initial Deployment (Week 1)

### Priority: 🔴 HIGH - Start Today

### 1.1 Vercel Deployment (Day 1 - 2 hours)

**Goal**: Get current demo application deployed to production

#### Tasks:
- [ ] Create Vercel account at https://vercel.com
- [ ] Connect GitHub repository (alexmclaughlin2005/LOIS)
- [ ] Configure project settings:
  - Framework Preset: SvelteKit
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `.svelte-kit`
  - Install Command: `npm install`
- [ ] Deploy to production
- [ ] Test deployed application
- [ ] Verify all demo features work:
  - Chat interface loads
  - Query 1: "How many open personal injury cases..."
  - Query 2: "Can you show me which cases..."
  - Routine creation card appears
  - Routines library opens/closes
- [ ] Add custom domain (optional):
  - lois-legal.vercel.app or custom domain

#### Success Criteria:
✅ Application accessible at public URL
✅ No console errors
✅ All demo queries work correctly
✅ Routines library displays properly
✅ Automatic deployments enabled on git push

#### Deployment Commands:
```bash
# Install Vercel CLI (optional but recommended)
npm install -g vercel

# Deploy from command line
cd frontend
vercel

# Or deploy via Vercel dashboard by connecting GitHub repo
```

#### Estimated Time: 1-2 hours

---

### 1.2 Documentation Updates (Day 1-2 - 2 hours)

**Goal**: Make project accessible for contributors and users

#### Tasks:
- [ ] Create README.md in root directory
- [ ] Add deployment badge with production URL
- [ ] Document local development setup
- [ ] Add screenshots of the application
- [ ] Create DEPLOYMENT.md with step-by-step guide
- [ ] Update IMPLEMENTATION.md with production URL
- [ ] Add environment variable documentation

#### README.md Structure:
```markdown
# LOIS - Legal Operations Intelligence System

[Demo Link](https://lois.vercel.app)

## Features
- Chat interface for legal queries
- Automated routine creation
- Routines library management
- Demo mode with sample queries

## Quick Start
```bash
git clone https://github.com/alexmclaughlin2005/LOIS
cd LOIS/frontend
npm install
npm run dev
```

## Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.
```

#### Success Criteria:
✅ Clear setup instructions
✅ Production URL documented
✅ Screenshots added
✅ Contributing guidelines present

#### Estimated Time: 2 hours

---

### 1.3 Environment Configuration (Day 2-3 - 2 hours)

**Goal**: Prepare for future backend integration

#### Tasks:
- [ ] Create `.env.example` in frontend directory
- [ ] Document required environment variables
- [ ] Add Vercel environment variables guide
- [ ] Set up different environments:
  - Development (.env.local)
  - Staging (.env.staging) - future
  - Production (Vercel dashboard)
- [ ] Update `.gitignore` to exclude `.env.local`

#### Environment Variables to Plan:
```bash
# Future Backend API
PUBLIC_API_URL=http://localhost:5000

# Future Authentication
PUBLIC_SUPABASE_URL=your-project-url
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Future AI Integration (for NL queries)
OPENAI_API_KEY=your-key (server-side only)

# Analytics (optional)
PUBLIC_POSTHOG_KEY=your-key
```

#### Success Criteria:
✅ `.env.example` documented
✅ Environment variable guide created
✅ No secrets in repository

#### Estimated Time: 1-2 hours

---

## Phase 2: Database & Backend Setup (Weeks 2-3)

### Priority: 🟡 MEDIUM - After successful deployment

### 2.1 Database Selection & Setup (Week 2 - 1 day)

**Recommended: Supabase** (PostgreSQL + Auth + Storage)

#### Why Supabase?
- Free tier: 500MB database, 50,000 monthly active users
- Built-in authentication
- Real-time subscriptions
- RESTful API auto-generated
- Great TypeScript support
- Easy Vercel integration

#### Alternative Options:
- **Neon**: Serverless Postgres (also good, simpler)
- **Vercel Postgres**: Integrated with Vercel (newer, limited)
- **PlanetScale**: MySQL-based (different approach)

#### Tasks:
- [ ] Create Supabase account
- [ ] Create new project
- [ ] Design database schema:

```sql
-- Users (handled by Supabase Auth)

-- Cases
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project VARCHAR(255),
  type VARCHAR(100),
  phase VARCHAR(100),
  primary_attorney VARCHAR(255),
  medical_expenses DECIMAL(12, 2),
  created_date DATE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Routines
CREATE TABLE routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  schedule_type VARCHAR(50),
  schedule_config JSONB,
  query_config JSONB,
  is_active BOOLEAN DEFAULT true,
  last_run TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Routine Executions
CREATE TABLE routine_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_id UUID REFERENCES routines(id) ON DELETE CASCADE,
  status VARCHAR(50),
  results JSONB,
  executed_at TIMESTAMP DEFAULT NOW()
);

-- Query History
CREATE TABLE query_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  query_text TEXT NOT NULL,
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cases_type ON cases(type);
CREATE INDEX idx_cases_phase ON cases(phase);
CREATE INDEX idx_cases_medical_expenses ON cases(medical_expenses);
CREATE INDEX idx_routines_user_id ON routines(user_id);
CREATE INDEX idx_routine_executions_routine_id ON routine_executions(routine_id);
```

- [ ] Run migrations in Supabase SQL editor
- [ ] Create seed data for demo cases:

```sql
-- Insert demo cases
INSERT INTO cases (project, type, phase, primary_attorney, medical_expenses, created_date) VALUES
  ('Ava Thompson', 'Personal Injury', 'Discovery', 'Daniel Ruiz', 125000.00, '2024-10-15'),
  ('Robert Chen', 'Personal Injury', 'Discovery', 'Rachel Hegmann', 150000.00, '2024-10-17'),
  ('Michael Davis', 'Personal Injury', 'Discovery', 'Sarah Johnson', 110000.00, '2024-10-18');
```

- [ ] Add Supabase connection to SvelteKit
- [ ] Test database connection

#### Success Criteria:
✅ Database schema created
✅ Seed data inserted
✅ Connection from SvelteKit works
✅ Can query cases

#### Estimated Time: 4-6 hours

---

### 2.2 Authentication Implementation (Week 2-3 - 2 days)

**Recommended: Supabase Auth**

#### Tasks:
- [ ] Install Supabase client library:
```bash
npm install @supabase/supabase-js
```

- [ ] Create Supabase client in SvelteKit:
```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
)
```

- [ ] Create auth pages:
  - `/login` - Login page
  - `/signup` - Registration page
  - `/forgot-password` - Password reset

- [ ] Implement auth hooks:
```typescript
// src/hooks.server.ts
export const handle = async ({ event, resolve }) => {
  event.locals.supabase = supabase
  event.locals.getSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession()
    return session
  }
  return resolve(event)
}
```

- [ ] Add protected routes middleware
- [ ] Implement session persistence
- [ ] Add user profile page
- [ ] Test auth flow end-to-end

#### Auth Pages UI:
- Simple, clean design matching current design system
- Social auth (Google, Microsoft) - optional for MVP
- Email/password auth
- "Forgot password" link
- "Remember me" checkbox

#### Success Criteria:
✅ Users can sign up
✅ Users can log in
✅ Sessions persist across refreshes
✅ Protected routes redirect to login
✅ User profile shows user info

#### Estimated Time: 12-16 hours

---

### 2.3 Real Query API (Week 3 - 2 days)

**Goal**: Replace demo queries with actual database queries

#### Tasks:
- [ ] Create API routes in SvelteKit:

```typescript
// src/routes/api/cases/search/+server.ts
import type { RequestHandler } from './$types';
import { supabase } from '$lib/supabaseClient';

export const POST: RequestHandler = async ({ request, locals }) => {
  const session = await locals.getSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { query, filters } = await request.json();

  let queryBuilder = supabase
    .from('cases')
    .select('*');

  // Apply filters
  if (filters?.phase) {
    queryBuilder = queryBuilder.eq('phase', filters.phase);
  }
  if (filters?.type) {
    queryBuilder = queryBuilder.eq('type', filters.type);
  }
  if (filters?.minMedicalExpenses) {
    queryBuilder = queryBuilder.gte('medical_expenses', filters.minMedicalExpenses);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ results: data, total: data.length }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

- [ ] Update chat interface to call real API
- [ ] Remove hardcoded demo data
- [ ] Add loading states during API calls
- [ ] Add error handling for failed queries
- [ ] Implement query caching (optional)

#### API Endpoints to Create:
- `POST /api/cases/search` - Search cases
- `POST /api/routines` - Create routine
- `GET /api/routines` - List user's routines
- `PATCH /api/routines/:id` - Update routine
- `DELETE /api/routines/:id` - Delete routine

#### Success Criteria:
✅ Chat queries return real data from database
✅ API handles errors gracefully
✅ Loading states show during queries
✅ Response time < 1 second

#### Estimated Time: 12-16 hours

---

## Phase 3: Routine Execution Engine (Weeks 4-6)

### Priority: 🟢 LOW - After basic functionality works

### 3.1 Routine Scheduler Setup (Week 4 - 2 days)

**Recommended: Inngest**

#### Why Inngest?
- Free tier: 25,000 function runs/month
- Built for Next.js/SvelteKit
- Declarative scheduling
- Built-in retries and error handling
- Great developer experience

#### Alternative Options:
- **Vercel Cron**: Built-in but basic (cron syntax only)
- **BullMQ**: More complex, requires Redis
- **Quirrel**: Simpler but less maintained

#### Tasks:
- [ ] Sign up for Inngest
- [ ] Install Inngest SDK:
```bash
npm install inngest
```

- [ ] Create Inngest client:
```typescript
// src/lib/inngest.ts
import { Inngest } from 'inngest';

export const inngest = new Inngest({ name: 'LOIS' });
```

- [ ] Define routine execution function:
```typescript
// src/routes/api/inngest/+server.ts
import { inngest } from '$lib/inngest';
import { serve } from 'inngest/sveltekit';

export const { GET, POST, PUT } = serve(inngest, [
  inngest.createFunction(
    { name: 'Execute Routine' },
    { event: 'routine/execute' },
    async ({ event, step }) => {
      const { routineId } = event.data;

      // Step 1: Fetch routine config
      const routine = await step.run('fetch-routine', async () => {
        // Get routine from database
      });

      // Step 2: Execute query
      const results = await step.run('execute-query', async () => {
        // Run the query based on routine config
      });

      // Step 3: Save results
      await step.run('save-results', async () => {
        // Store execution results
      });

      // Step 4: Notify user
      await step.run('notify-user', async () => {
        // Send email or in-app notification
      });

      return { success: true, resultsCount: results.length };
    }
  ),
]);
```

- [ ] Create cron schedule for routines:
```typescript
inngest.createFunction(
  { name: 'Daily Routine Check' },
  { cron: '0 8 * * *' }, // Every day at 8am
  async ({ step }) => {
    // Find all routines that should run today
    // Trigger execution for each
  }
);
```

- [ ] Test routine execution locally
- [ ] Deploy and test in production

#### Success Criteria:
✅ Routines can be scheduled
✅ Scheduled routines execute on time
✅ Execution results are saved
✅ Failed routines retry automatically

#### Estimated Time: 12-16 hours

---

### 3.2 Notification System (Week 5 - 1 day)

**Goal**: Notify users when routines complete

#### Options:
- **Email**: Resend (recommended), SendGrid, or Postmark
- **In-App**: Toast notifications in UI
- **Push**: OneSignal or Firebase (future)

#### Tasks for Email (Resend):
- [ ] Sign up for Resend (free tier: 3,000 emails/month)
- [ ] Install SDK:
```bash
npm install resend
```

- [ ] Create email templates:
```typescript
// src/lib/email/templates.ts
export const routineCompleteTemplate = (routine: Routine, results: any[]) => `
  <h2>Routine "${routine.name}" Complete</h2>
  <p>Your routine has finished executing.</p>
  <p><strong>Results:</strong> ${results.length} cases found</p>
  <a href="${PUBLIC_APP_URL}/routines/${routine.id}">View Details</a>
`;
```

- [ ] Send email from Inngest function
- [ ] Add email preferences to user profile
- [ ] Test email delivery

#### Success Criteria:
✅ Users receive emails when routines complete
✅ Emails have correct content and formatting
✅ Users can unsubscribe/adjust preferences

#### Estimated Time: 6-8 hours

---

## Phase 4: Enhanced Features (Weeks 7-10)

### 4.1 Data Export (Week 7 - 2 days)

#### Tasks:
- [ ] Add export functionality to results view
- [ ] Implement CSV export
- [ ] Implement PDF export (optional)
- [ ] Add export history tracking
- [ ] Test exports with various data sizes

#### Success Criteria:
✅ Users can export query results as CSV
✅ Exports include all relevant fields
✅ Large exports don't timeout

#### Estimated Time: 12-16 hours

---

### 4.2 Advanced Filtering (Week 8 - 2 days)

#### Tasks:
- [ ] Create filter panel component
- [ ] Add date range filtering
- [ ] Add multi-select filters (type, phase, attorney)
- [ ] Add numeric range filters (medical expenses)
- [ ] Implement filter persistence in URL
- [ ] Test filter combinations

#### Success Criteria:
✅ Filters work correctly
✅ Multiple filters can be combined
✅ Filters persist across page reloads

#### Estimated Time: 12-16 hours

---

### 4.3 Natural Language Queries (Week 9-10 - 4 days) [STRETCH GOAL]

**Goal**: Use AI to parse natural language into database queries

#### Recommended: OpenAI GPT-4

#### Tasks:
- [ ] Set up OpenAI API access
- [ ] Create prompt template for query parsing:
```typescript
const systemPrompt = `You are a SQL query generator for a legal case management system.
Given a natural language query, generate a JSON filter object.

Database schema:
- cases table: id, project, type, phase, primary_attorney, medical_expenses, created_date

Example:
User: "Find personal injury cases in discovery with medical expenses over $100k"
Output: {
  "type": "Personal Injury",
  "phase": "Discovery",
  "minMedicalExpenses": 100000
}`;
```

- [ ] Implement query parser API endpoint
- [ ] Update chat interface to use NL parsing
- [ ] Add fallback for unclear queries
- [ ] Test with various query types
- [ ] Monitor API costs

#### Success Criteria:
✅ 80%+ of natural language queries parse correctly
✅ Unclear queries show helpful error messages
✅ API costs stay within budget

#### Estimated Time: 20-24 hours

---

## Phase 5: Polish & Optimization (Weeks 11-12)

### 5.1 Performance Optimization (Week 11)

#### Tasks:
- [ ] Add database indexes for common queries
- [ ] Implement query result caching (Vercel KV/Redis)
- [ ] Optimize bundle size:
  - Code splitting
  - Lazy loading components
  - Tree shaking
- [ ] Add CDN for static assets
- [ ] Optimize images
- [ ] Run Lighthouse audit and fix issues

#### Performance Targets:
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3.0s
- Query response < 500ms

#### Estimated Time: 12-16 hours

---

### 5.2 Testing (Week 12)

#### Tasks:
- [ ] Set up Vitest for unit tests
- [ ] Write tests for API endpoints
- [ ] Set up Playwright for E2E tests
- [ ] Write E2E tests for:
  - Login flow
  - Query submission
  - Routine creation
  - Routines library
- [ ] Add GitHub Actions for CI/CD
- [ ] Run tests on every PR

#### Test Coverage Goal: 70%+

#### Estimated Time: 16-20 hours

---

### 5.3 Monitoring & Error Tracking (Week 12)

#### Tasks:
- [ ] Set up Sentry for error tracking
- [ ] Add Vercel Analytics
- [ ] Set up performance monitoring
- [ ] Add custom error pages (404, 500)
- [ ] Implement error boundaries
- [ ] Add user feedback widget

#### Success Criteria:
✅ Errors automatically reported to Sentry
✅ Performance metrics tracked
✅ Custom error pages show for errors

#### Estimated Time: 6-8 hours

---

## Technology Decisions Summary

### ✅ Confirmed Decisions:
- **Frontend Framework**: SvelteKit
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (monolithic)
- **Version Control**: GitHub
- **Design System**: Figma-based (Helvetica Now fonts)

### 🎯 Recommended Decisions:
- **Database**: Supabase (PostgreSQL + Auth)
- **Background Jobs**: Inngest
- **Email**: Resend
- **Error Tracking**: Sentry
- **Caching**: Vercel KV (Redis)
- **AI/NLP**: OpenAI GPT-4 (for NL queries)

### 📦 Package Installations Needed:

```bash
# Phase 2 - Database & Auth
npm install @supabase/supabase-js

# Phase 3 - Background Jobs & Email
npm install inngest resend

# Phase 4 - AI Integration (optional)
npm install openai

# Phase 5 - Testing
npm install -D vitest @testing-library/svelte playwright

# Phase 5 - Monitoring
npm install @sentry/sveltekit
```

---

## Budget Estimates

### Phase 1-2 (Months 1-2): ~$15/month
- Vercel: $0 (free tier)
- Supabase: $0 (free tier)
- Domain: $15/year
- **Total**: ~$15 one-time

### Phase 3-4 (Months 3-4): ~$45/month
- Vercel Pro: $20/month (if needed)
- Supabase: $0 (free tier sufficient)
- Inngest: $0 (free tier)
- Resend: $0 (free tier)
- **Total**: ~$20/month (or $0 if staying on free tier)

### Phase 5+ (Production): ~$95/month
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Inngest: $20/month (if exceeding free tier)
- Resend Pro: $10/month
- Sentry: $0 (free tier)
- OpenAI API: $20-50/month (usage-based)
- **Total**: ~$95-125/month

---

## Risk Management

### High Priority Risks:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Free tier limits exceeded | Medium | Monitor usage, upgrade when needed |
| Database performance issues | High | Add indexes, implement caching |
| API rate limits (OpenAI) | Medium | Cache parsed queries, set rate limits |
| Auth security issues | High | Use Supabase's built-in security, audit regularly |

---

## Success Metrics

### Phase 1 Success:
- ✅ Live production URL
- ✅ Demo working correctly
- ✅ Zero downtime deployments

### Phase 2 Success:
- ✅ Users can sign up and log in
- ✅ Real queries return accurate results
- ✅ Response time < 1 second

### Phase 3 Success:
- ✅ Routines execute on schedule
- ✅ Users receive notifications
- ✅ 99% success rate for executions

### Phase 4-5 Success:
- ✅ Lighthouse score > 90
- ✅ 70%+ test coverage
- ✅ < 0.1% error rate

---

## Next Immediate Actions

### Today (2-3 hours):
1. [ ] Create Vercel account
2. [ ] Connect GitHub repo to Vercel
3. [ ] Configure build settings
4. [ ] Deploy to production
5. [ ] Test deployed app
6. [ ] Share URL with stakeholders

### This Week (8-10 hours):
1. [ ] Write README.md with setup guide
2. [ ] Create DEPLOYMENT.md guide
3. [ ] Add screenshots to documentation
4. [ ] Set up environment variables
5. [ ] Create Supabase account and project
6. [ ] Design and create database schema
7. [ ] Add seed data for demo

### Week 2 Goals:
- ✅ Production app deployed and tested
- ✅ Complete documentation
- ✅ Database set up with seed data
- ✅ Auth provider chosen (Supabase)
- ✅ First real query working

---

## Questions to Answer

Before Phase 2, clarify:

1. **User Base**: Who are the primary users? Solo practitioners? Firms? Legal departments?
2. **Data Volume**: How many cases do you expect to manage? (affects database plan)
3. **Compliance**: Are there specific legal/compliance requirements? (HIPAA, state bar rules)
4. **Integration**: Will this integrate with existing case management systems?
5. **Timeline**: Is there a specific launch date or deadline?
6. **Budget**: What's the monthly budget for hosting/services?
7. **Team**: Building solo or with a team? Need to onboard others?

---

## Resources

### Essential Documentation:
- [Vercel SvelteKit Deployment](https://vercel.com/docs/frameworks/sveltekit)
- [Supabase Docs](https://supabase.com/docs)
- [Inngest SvelteKit Guide](https://www.inngest.com/docs/frameworks/sveltekit)
- [SvelteKit Docs](https://kit.svelte.dev/docs)

### Learning Resources:
- [SvelteKit Tutorial](https://learn.svelte.dev)
- [Supabase Tutorial](https://supabase.com/docs/guides/getting-started)
- [Inngest Quickstart](https://www.inngest.com/docs/quick-start)

### Community:
- [SvelteKit Discord](https://svelte.dev/chat)
- [Supabase Discord](https://discord.supabase.com)

---

**Roadmap Version**: 1.0
**Last Updated**: October 23, 2025
**Status**: Phase 1 - Ready to Deploy
**Next Milestone**: Production Deployment on Vercel (TODAY!)
