# LOIS - Quick Reference Card

**Last Updated**: 2025-10-23

---

## 📋 Project Overview

**Name**: LOIS (Localized Organizational Intelligence System)
**Type**: Omni-search conversational application for legal case management
**Timeline**: 10 weeks (6 phases)
**Current Phase**: Phase 0 - Planning & Setup ✅ (mostly complete)

---

## 📚 Documentation Quick Links

| Document | Purpose | Lines |
|----------|---------|-------|
| [README.md](./README.md) | Project overview | ~100 |
| [ai_instructions.md](./ai_instructions.md) | Master AI guidance - architecture, features, services | ~750 |
| [PROJECT_PLAN.md](./PROJECT_PLAN.md) | 10-week detailed timeline and milestones | ~1,000 |
| [DESIGN_SPECIFICATIONS.md](./DESIGN_SPECIFICATIONS.md) | Complete UI/UX specs with colors, components | ~800 |
| [FIGMA_DESIGN_ANALYSIS.md](./FIGMA_DESIGN_ANALYSIS.md) | Design review summary and findings | ~500 |
| [NEXT_STEPS.md](./NEXT_STEPS.md) | Immediate action items | ~400 |
| [PROJECT_KICKOFF_SUMMARY.md](./PROJECT_KICKOFF_SUMMARY.md) | Executive summary of planning phase | ~500 |

**Total Documentation**: ~3,900 lines

---

## 🎯 Core Features (7)

1. **Conversational Search** - Natural language queries with AI
2. **Omni-Search Engine** - Search across all data stores
3. **Multi-Type Results** - Unified display of heterogeneous data
4. **Conversation History** - Context-aware follow-up queries
5. **Advanced Filtering** - Dynamic filters and refinement
6. **Reporting & Export** - Export results (CSV, PDF, JSON)
7. **Analytics Dashboard** - Search trends and insights

---

## 💾 Data Stores (7)

| Type | Count | Purpose |
|------|-------|---------|
| Projects | 200-300 | Legal cases, statuses, teams |
| People | 100-150 | Attorneys, paralegals, clients |
| Documents | 500-800 | Case files, evidence |
| Notes | 300-500 | Internal case notes |
| Calendar | 400-600 | Hearings, depositions |
| Field Data | 200-400 | Evidence collection |
| Audit | 1000-2000 | Activity tracking |

**Total Synthetic Data**: ~3,000+ records

---

## 🎨 Design System Quick Reference

### Colors
```
Brand Coral:    #FF6B6B
Primary CTA:    #000000 (black)
Background:     #F7F7F6 (light gray)
Text Primary:   #161616 (dark gray)
Active Blue:    #2196F3
Success:        #4CAF50
Warning:        #FF6B6B
```

### Typography
```
Headings:   Helvetica Now Display, Bold, 21px
Body:       System fonts, Regular, 14px
Small:      12px
Caption:    11px
```

### Spacing
```
8px Grid: 4px, 8px, 16px, 24px, 32px, 48px
Card Padding: 16-20px
Button Padding: 8-12px vertical, 16-24px horizontal
```

### Key Components
- Button (primary black, secondary outlined)
- Card (white bg, shadow, 8-10px radius)
- Input (6-8px radius, blue focus)
- Tag/Badge (pill shape, 12px radius)
- Avatar (circular, multiple sizes)

---

## 🏗️ Tech Stack

### ✅ Confirmed
- React 18+ with TypeScript
- Node.js + TypeScript (backend)
- PostgreSQL (database)
- Tailwind CSS (styling)
- Vite (build tool)

### ⚠️ To Decide
- State: Zustand OR React Query
- UI Lib: Shadcn/ui OR Radix UI
- Backend: Express OR Fastify
- Search: MeiliSearch OR Elasticsearch
- ORM: Prisma OR TypeORM
- AI: OpenAI API OR Local LLM

---

## 📅 Timeline Quick View

| Phase | Weeks | Focus | Status |
|-------|-------|-------|--------|
| Phase 0 | Week 0 | Planning & Setup | 🟢 In Progress |
| Phase 1 | Weeks 1-2 | Foundation (DB, data, UI shell) | ⚪ Not Started |
| Phase 2 | Weeks 3-4 | Search Core | ⚪ Not Started |
| Phase 3 | Weeks 5-6 | Conversational Interface | ⚪ Not Started |
| Phase 4 | Weeks 7-8 | Advanced Features | ⚪ Not Started |
| Phase 5 | Weeks 9-10 | Polish & Testing | ⚪ Not Started |

---

## ✅ Current Status (Phase 0)

### Completed
- [x] Project plan created (PROJECT_PLAN.md)
- [x] AI instructions documented (ai_instructions.md)
- [x] Design specifications extracted (DESIGN_SPECIFICATIONS.md)
- [x] Figma designs accessed and analyzed
- [x] Directory structure created
- [x] .gitignore configured

### In Progress
- [ ] Technology stack finalization
- [ ] Development environment setup
- [ ] Git repository initialization

### Blocked
- None

---

## 🚀 Next 3 Actions (Priority Order)

### 1. Finalize Tech Stack (1-2 days)
**Owner**: Technical Lead
- Review recommendations in NEXT_STEPS.md
- Make decisions on pending items
- Document in new TECH_STACK.md file

### 2. Setup Dev Environment (2-3 days)
**Owner**: All Developers
- Initialize Git repo
- Setup frontend (React + Vite + TS)
- Setup backend (Node + TS + framework)
- Configure Docker Compose
- Verify "Hello World" works

### 3. Implement Design Tokens (3-4 days)
**Owner**: Frontend Developer
- Create Tailwind config with design tokens
- Setup typography
- Build first component (Button)
- Verify against Figma designs

---

## 📞 Key Contacts & Resources

### Figma
- **Design File**: [Cross-Project LOIS](https://www.figma.com/design/LXG7oJAKElYVQh71uGldmN/Cross-Project-LOIS---Search--Reporting--Chat)
- **Access**: Configured with Personal Access Token

### Development
- **Repo**: TBD (initialize in Phase 0)
- **Project Management**: TBD (GitHub Projects, Jira, etc.)
- **Communication**: TBD (Slack, Discord, etc.)

---

## 🎯 Success Metrics

### Phase 0 Exit Criteria
- [ ] All devs can run project locally
- [ ] Tech stack decisions documented
- [ ] Basic "Hello World" works
- [ ] Git repo initialized
- [ ] Setup instructions in README

### End of Project
- Search response < 1 second
- Query accuracy > 85%
- User satisfaction > 4/5
- 10+ concurrent users supported
- 99.9% uptime

---

## 🔍 Where to Find...

### "What is LOIS?"
→ README.md or ai_instructions.md (Application Overview)

### "What does it look like?"
→ DESIGN_SPECIFICATIONS.md or FIGMA_DESIGN_ANALYSIS.md

### "How do we build it?"
→ ai_instructions.md (Architecture) + PROJECT_PLAN.md (Timeline)

### "What do I do today?"
→ NEXT_STEPS.md or PROJECT_KICKOFF_SUMMARY.md

### "How do I set up my environment?"
→ NEXT_STEPS.md (Development Environment Setup section)

### "What are the data models?"
→ ai_instructions.md (Data Models section)

### "What components do we need?"
→ DESIGN_SPECIFICATIONS.md (UI Components section)

### "What's the color for X?"
→ DESIGN_SPECIFICATIONS.md (Color Palette section)

---

## 🐛 Common Issues & Solutions

### Issue: Can't access Figma
**Solution**: Figma API configured with PAT. See FIGMA_DESIGN_ANALYSIS.md

### Issue: Don't know what to build first
**Solution**: See PROJECT_PLAN.md Phase 1, Week 1 tasks

### Issue: Need design specs for component
**Solution**: See DESIGN_SPECIFICATIONS.md for component details

### Issue: Tech stack decision unclear
**Solution**: See NEXT_STEPS.md "Technology Stack Finalization"

---

## 📊 Project Stats

```
Documentation:       7 files, 3,918 lines
Design Screens:      5 screens analyzed
Data Models:         9 entity types defined
UI Components:       18+ components specified
API Endpoints:       15+ endpoints planned
Timeline:            10 weeks, 6 phases
Synthetic Data:      3,000+ records needed
Team Size:           1-2 developers
```

---

## 🎓 Learning Resources

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Faker.js Docs](https://fakerjs.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [MeiliSearch Docs](https://docs.meilisearch.com/)

---

## ⚡ Quick Commands (TBD after setup)

```bash
# Install dependencies
npm install

# Run development servers
npm run dev              # Frontend
npm run server          # Backend

# Build for production
npm run build

# Run tests
npm test

# Generate synthetic data
npm run seed

# Database migrations
npm run db:migrate
```

---

## 💡 Pro Tips

1. **Always reference design specs** when building UI components
2. **Use design tokens** from DESIGN_SPECIFICATIONS.md (don't hardcode colors)
3. **Follow 8px spacing grid** for consistent layouts
4. **Check PROJECT_PLAN.md** weekly to stay on track
5. **Update README.md** as you make setup changes
6. **Document decisions** in dedicated files (e.g., TECH_STACK.md)
7. **Test with synthetic data** that matches legal case management context

---

## 🚨 Important Notes

⚠️ **Design Fidelity**: Match Figma designs precisely - this is critical for user testing
⚠️ **Performance**: All searches must complete < 1 second
⚠️ **Accessibility**: Follow WCAG 2.1 AA standards
⚠️ **Data Context**: Legal case management focus (personal injury, discovery, etc.)
⚠️ **Dual Interface**: Support both AI chat and traditional feed views

---

## 📋 Checklist: Ready to Code?

Phase 0 Completion Checklist:

- [x] Project documentation complete
- [x] Design specifications extracted
- [x] Directory structure created
- [ ] Tech stack finalized
- [ ] Dev environment setup complete
- [ ] Git repo initialized
- [ ] All devs can run locally
- [ ] First commit pushed

**Progress**: 3/8 complete (37.5%)

---

## 🎉 Celebrate Milestones

- ✅ **M0**: Project kickoff (THIS MILESTONE!)
- ⬜ **M1**: Data foundation (Week 2)
- ⬜ **M2**: Search works (Week 4)
- ⬜ **M3**: Conversations work (Week 6)
- ⬜ **M4**: Feature complete (Week 8)
- ⬜ **M5**: User testing complete (Week 9)
- ⬜ **M6**: Production ready (Week 10)

---

**Keep this card handy for quick reference throughout the project!** 🚀

**Questions?** Check the appropriate detailed document or create a GitHub issue.
