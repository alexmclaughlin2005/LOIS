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
├── IMPLEMENTATION.md                   # Complete implementation docs
├── DEPLOYMENT_ROADMAP.md               # Phased development plan
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
