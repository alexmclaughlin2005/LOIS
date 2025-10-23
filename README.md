# LOIS - Legal Operations Intelligence System

A SvelteKit-based chat application for legal professionals to query case data, visualize results, and create automated routines.

**Repository**: https://github.com/alexmclaughlin2005/LOIS

**Live Demo**: Deploy to Vercel today! → See [Deployment](#deployment-to-vercel) section below

---

## ✨ Features

### Currently Implemented (Demo Mode)

- ✅ **Chat Interface**: Conversational UI for querying legal case data
- ✅ **Demo Queries**: Two hardcoded queries demonstrating the system
  - "How many open personal injury cases are currently in the discovery phase?" → Returns 42 cases
  - "Can you show me which of these cases have medical expenses exceed $100,000?" → Returns 3 cases
- ✅ **Routine Creation**: Inline 560px form for creating automated routines with scheduling
- ✅ **Routines Library**: 480px side panel with:
  - 4 promoted routines from other organizations
  - 8 personal routines in grid layout
  - Expandable subroutines
- ✅ **Data Visualization**: Results display with case information tables
- ✅ **Design System**: Figma-based design with Helvetica Now typography

### Coming Soon (See [Roadmap](#roadmap))

- 🔄 Database integration (Supabase PostgreSQL)
- 🔄 User authentication and profiles
- 🔄 Real-time query execution
- 🔄 Scheduled routine automation
- 🔄 Email notifications
- 🔄 Data export (CSV, PDF)
- 🔄 Advanced filtering
- 🔄 Natural language query parsing (AI)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ LTS
- npm or pnpm

### Local Development

```bash
# Clone the repository
git clone https://github.com/alexmclaughlin2005/LOIS.git
cd LOIS/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production

```bash
cd frontend
npm run build
npm run preview  # Preview production build locally
```

---

## 📦 Deployment to Vercel

### Option 1: Via Vercel Dashboard (Recommended - 5 minutes)

1. Go to **https://vercel.com** and sign up/login
2. Click **"New Project"**
3. Import repository: `alexmclaughlin2005/LOIS`
4. Configure settings:
   - **Framework Preset**: SvelteKit
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.svelte-kit`
   - **Install Command**: `npm install`
5. Click **"Deploy"**
6. Wait 2-3 minutes
7. ✅ Visit your live URL!

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts to deploy
```

### Environment Variables

Not needed for demo mode. Required in Phase 2+:

```bash
# Phase 2 - Database
PUBLIC_SUPABASE_URL=your-project-url
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Phase 3 - Background Jobs
INNGEST_EVENT_KEY=your-key
INNGEST_SIGNING_KEY=your-key

# Phase 4 - AI (Optional)
ANTHROPIC_API_KEY=your-key
```

---

## 🗄️ Database Setup (Phase 2)

LOIS includes a complete database schema and seed data generator for Supabase PostgreSQL.

### Quick Database Setup

```bash
# 1. Create Supabase project at https://supabase.com

# 2. Run schema to create tables
# Go to Supabase SQL Editor and run: database/schema.sql

# 3. Generate realistic seed data
cd database/seed
npm install
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Seed the database
npm run seed

# ✅ Database populated with 6,000-8,000 records!
```

### What Gets Generated

The seed system creates realistic legal case management data:

- **150-200 Projects** (legal cases) with case-specific custom fields
  - Personal Injury (40%) - medical expenses, injury type, accident details
  - Corporate (25%) - contract values, transaction types
  - Family Law (15%) - marital assets, custody details
  - Employment (10%) - damages sought, termination info
  - Real Estate (10%) - property values, square footage

- **300-400 Contacts** (attorneys, clients, witnesses, experts)
  - Linked to projects with specific roles
  - Full contact information and specialties

- **800-1,000 Documents** with realistic mock content
  - Pleadings, discovery, correspondence, evidence
  - Full-text searchable legal documents

- **500-700 Calendar Entries**
  - Court dates, depositions, deadlines, meetings

- **600-800 Notes** & **400-600 Tasks**
  - Case notes, strategy, meeting notes
  - To-dos, follow-ups, reviews with due dates

- **2,000-3,000 Time Entries** with billable hours
  - Activity types, hourly rates, descriptions
  - Realistic attorney billing patterns

- **300-500 Expenses** & **150-250 Invoices**
  - Court fees, expert fees, travel expenses
  - Invoice generation with payment tracking

### Database Documentation

- **[database/schema.sql](database/schema.sql)** - Complete PostgreSQL schema with 9 entities
- **[database/seed/README.md](database/seed/README.md)** - Detailed seed data documentation
- **[DATA_STORE_PLAN.md](DATA_STORE_PLAN.md)** - Comprehensive database architecture plan

### Sample Queries

Test your database with these queries:

```sql
-- Personal injury cases with medical expenses > $100k
SELECT * FROM projects
WHERE case_type = 'Personal Injury'
AND (custom_fields->>'medical_expenses')::numeric > 100000;

-- Upcoming deadlines in next 7 days
SELECT p.case_number, c.title, c.start_time
FROM calendar_entries c
JOIN projects p ON c.project_id = p.id
WHERE c.entry_type = 'Deadline'
AND c.start_time BETWEEN NOW() AND NOW() + INTERVAL '7 days';

-- Total billable hours by project
SELECT p.case_number, SUM(te.hours) as total_hours
FROM time_entries te
JOIN projects p ON te.project_id = p.id
GROUP BY p.case_number
ORDER BY total_hours DESC;
```

---

## 📁 Project Structure

```
LOIS/
├── frontend/                           # SvelteKit application
│   ├── src/
│   │   ├── lib/
│   │   │   └── components/             # Svelte components
│   │   │       ├── RoutineCreationCard.svelte    # 560px routine form
│   │   │       ├── RoutinesLibrary.svelte        # 480px side panel
│   │   │       ├── ResultsView.svelte            # Query results display
│   │   │       ├── DataPreviewCard.svelte        # Data preview
│   │   │       └── DataLoadingSkeleton.svelte    # Loading state
│   │   └── routes/
│   │       ├── +page.svelte                      # Landing page
│   │       ├── chat/+page.svelte                 # Chat interface (main app)
│   │       └── api/chat/+server.ts               # API endpoint (future)
│   ├── package.json
│   └── svelte.config.js
├── database/                           # Database schema and seed data
│   ├── schema.sql                      # PostgreSQL schema (9 entities)
│   └── seed/                           # Data generation scripts
│       ├── src/
│       │   ├── config.ts               # Supabase client + config
│       │   ├── index.ts                # Master seed script
│       │   └── generators/             # Data generators
│       │       ├── projects.ts         # Legal cases
│       │       ├── contacts.ts         # People + relationships
│       │       ├── documents.ts        # Documents with content
│       │       ├── calendar.ts         # Events and deadlines
│       │       ├── notes-tasks.ts      # Notes and tasks
│       │       └── billing.ts          # Time, expenses, invoices
│       ├── package.json
│       └── README.md                   # Seed documentation
├── IMPLEMENTATION.md                   # Complete implementation docs
├── DEPLOYMENT_ROADMAP.md               # Phased development plan
├── DATA_STORE_PLAN.md                  # Database architecture
├── PROJECT_PLAN.md                     # Original project plan
└── README.md                           # This file
```

---

## 💻 Technology Stack

### Frontend
- **Framework**: SvelteKit + TypeScript
- **Styling**: Tailwind CSS
- **Design**: Figma-based (Helvetica Now fonts)
- **Build**: Vite

### Future Backend (Phase 2+)
- **Database**: Supabase (PostgreSQL + Auth)
- **Background Jobs**: Inngest
- **Email**: Resend
- **AI**: OpenAI GPT-4 (optional)
- **Caching**: Vercel KV (Redis)

### Deployment
- **Hosting**: Vercel
- **CI/CD**: Auto-deploy on git push
- **Domain**: Custom domain support

---

## 🎮 Try the Demo

### Demo Query 1
```
How many open personal injury cases are currently in the discovery phase?
```
**Expected**: "I found 42 open personal injury cases..."

### Demo Query 2 (Follow-up)
```
Can you show me which of these cases have medical expenses exceed $100,000?
```
**Expected**: Shows 3 cases with "Yes, create routine" button

### Create a Routine
1. Click **"Yes, create routine"**
2. Form appears with pre-filled schedule
3. Edit fields or click **"Save Routine"**

### Explore Routines Library
1. Click routines icon in header
2. Browse 4 promoted routines
3. Expand to see subroutines
4. Scroll to view 8 personal routines in grid

---

## 📚 Documentation

### Core Docs
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Complete system documentation
  - All features explained
  - Design system specs (colors, typography, spacing)
  - Component API documentation
  - State management patterns
  - Demo flow walkthrough

- **[DEPLOYMENT_ROADMAP.md](DEPLOYMENT_ROADMAP.md)** - Development plan
  - **Phase 1**: Vercel deployment (current - deploy today!)
  - **Phase 2**: Database & auth (weeks 2-3)
  - **Phase 3**: Routine execution (weeks 4-6)
  - **Phase 4-5**: Advanced features (weeks 7-12)
  - Technology recommendations
  - Budget estimates ($0-125/mo depending on phase)

- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** - Original omni-search concept plan

---

## 🗺️ Roadmap

### Phase 1: Deployment ✅ (Current - Week 1)
- [x] Demo application with chat interface
- [x] Routine creation and management UI
- [x] Design system implementation
- [ ] **→ Production deployment on Vercel (DO THIS TODAY!)**
- [ ] Documentation complete

### Phase 2: Backend Integration (Weeks 2-3)
- [ ] Supabase PostgreSQL database
- [ ] User authentication (login/signup)
- [ ] Real query API (replace demo mode)
- [ ] Database schema and seed data

### Phase 3: Routine Automation (Weeks 4-6)
- [ ] Inngest for scheduled execution
- [ ] Email notifications (Resend)
- [ ] Execution history tracking
- [ ] Error handling and retries

### Phase 4: Enhanced Features (Weeks 7-10)
- [ ] Data export (CSV, PDF)
- [ ] Advanced filtering
- [ ] Natural language queries (AI)
- [ ] Analytics dashboard

### Phase 5: Polish & Production (Weeks 11-12)
- [ ] Performance optimization (Lighthouse > 90)
- [ ] Testing (70%+ coverage)
- [ ] Error tracking (Sentry)
- [ ] Mobile responsiveness

---

## 💰 Budget & Costs

### Current (Demo Mode)
- Vercel: **$0** (free tier)
- Domain: **$15/year** (optional)
- **Total: $0-15/year**

### Phase 2-3 (Basic Features)
- Vercel: **$0-20/month**
- Supabase: **$0** (free tier)
- Inngest: **$0** (free tier)
- Resend: **$0** (free tier)
- **Total: $0-20/month**

### Production (All Features)
- Vercel Pro: **$20/month**
- Supabase Pro: **$25/month**
- Inngest: **$20/month**
- Resend Pro: **$10/month**
- OpenAI API: **$20-50/month** (usage)
- **Total: $95-125/month**

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes
4. Commit: `git commit -m "feat: add amazing feature"`
5. Push: `git push origin feature/your-feature`
6. Open Pull Request

### Guidelines
- Follow existing code style
- Maintain TypeScript types
- Update documentation
- Test thoroughly

---

## 📊 Project Status

- **Version**: 1.0.0-demo
- **Status**: Demo/Prototype Phase
- **Last Updated**: October 23, 2025
- **Next Milestone**: Production Deployment on Vercel

---

## 📞 Support

- **Issues**: https://github.com/alexmclaughlin2005/LOIS/issues
- **Discussions**: https://github.com/alexmclaughlin2005/LOIS/discussions

---

## 📄 License

[Add license - MIT, Apache 2.0, etc.]

---

## 🙏 Acknowledgments

- Design system based on Figma designs
- Built with SvelteKit, Tailwind CSS, and modern web tech
- Inspired by modern legal operations tools

---

**Ready to deploy?**

👉 Follow the [Deployment to Vercel](#deployment-to-vercel) section and get your app live in 5 minutes! 🚀
