# Next Steps for LOIS Project

## Immediate Actions (Priority 1)

### 1. Access Figma Designs
**Owner**: Project Lead
**Timeline**: ASAP

The Figma link provided requires authentication. To proceed:

1. Share the Figma file with appropriate permissions
2. Or export design specifications (colors, typography, spacing, components)
3. Or provide screenshots/mockups of key screens

**Why this matters**: Design specifications will inform UI component structure, color scheme, and user interaction patterns.

**Alternative**: We can start with wireframes/basic layout and refine once designs are accessible.

---

### 2. Technology Stack Finalization
**Owner**: Technical Lead
**Timeline**: 1-2 days

Review and approve the recommended technology stack in `ai_instructions.md`:

#### Frontend Decisions Needed:
- ✓ React + TypeScript (recommended)
- State Management: Zustand OR React Query? (Recommend: React Query for server state)
- UI Components: Shadcn/ui OR Radix UI directly? (Recommend: Shadcn/ui for faster setup)

#### Backend Decisions Needed:
- ✓ Node.js + TypeScript (recommended)
- Framework: Express OR Fastify? (Recommend: Fastify for performance)
- Search Engine: Elasticsearch OR MeiliSearch? (Recommend: MeiliSearch for easier setup)
- ORM: Prisma OR TypeORM? (Recommend: Prisma for better DX)

#### Infrastructure Decisions:
- Use Docker for local development? (Recommend: Yes)
- AI/NLP: OpenAI API OR local LLM? (Recommend: OpenAI for prototype)

**Action**: Create `tech-stack.md` documenting final choices and rationale.

---

### 3. Development Environment Setup
**Owner**: All Developers
**Timeline**: 2-3 days

#### Step-by-step setup:

1. **Initialize Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial project structure"
   ```

2. **Set up Frontend**
   ```bash
   cd frontend
   npm create vite@latest . -- --template react-ts
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   # Install additional dependencies based on tech stack decisions
   ```

3. **Set up Backend**
   ```bash
   cd backend
   npm init -y
   npm install express typescript @types/node @types/express
   npm install -D tsx nodemon
   npx tsc --init
   # Install additional dependencies based on tech stack decisions
   ```

4. **Set up Database**
   - Install PostgreSQL locally OR use Docker
   - Create database: `lois_dev`
   - Set up connection string in `.env`

5. **Set up Docker Compose** (optional but recommended)
   ```yaml
   # docker-compose.yml
   services:
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: lois_dev
         POSTGRES_USER: lois
         POSTGRES_PASSWORD: lois_dev_password
       ports:
         - "5432:5432"

     redis:
       image: redis:7
       ports:
         - "6379:6379"

     meilisearch:
       image: getmeili/meilisearch:latest
       ports:
         - "7700:7700"
   ```

6. **Configure TypeScript**
   - Set up path aliases (@/components, @/services, etc.)
   - Configure strict mode
   - Share types between frontend and backend

7. **Set up Code Quality Tools**
   ```bash
   npm install -D eslint prettier eslint-config-prettier
   npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
   npm install -D husky lint-staged
   ```

**Deliverable**: All team members can run `npm run dev` in both frontend and backend directories.

---

### 4. Create Initial Package Files
**Owner**: Technical Lead
**Timeline**: 1 day

Create `package.json` for each workspace with scripts:

**Frontend package.json scripts**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

**Backend package.json scripts**:
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint . --ext ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "test": "vitest",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx src/database/seed.ts"
  }
}
```

---

## Secondary Actions (Priority 2)

### 5. Start Data Generation
**Owner**: Backend Developer
**Timeline**: Week 1

Begin with the simplest generator first:

1. **Person Generator** (`data/generators/personGenerator.ts`)
   - Start with 20 test records
   - Validate data structure
   - Test database insertion

2. **Expand to other entities** once Person generator works

**Quick Start Example**:
```typescript
// data/generators/personGenerator.ts
import { faker } from '@faker-js/faker';

export function generatePerson() {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    role: faker.person.jobTitle(),
    department: faker.commerce.department(),
    // ... more fields
  };
}

export function generatePeople(count: number) {
  return Array.from({ length: count }, generatePerson);
}
```

---

### 6. Create Basic UI Shell
**Owner**: Frontend Developer
**Timeline**: Week 1

Create minimal working UI:

1. **Layout Components**
   - `MainLayout.tsx` - Overall layout structure
   - `Header.tsx` - App header with logo/title
   - `Sidebar.tsx` - Navigation sidebar (can be empty initially)

2. **Basic Routing**
   ```typescript
   // Routes
   / - Home (search interface)
   /search - Search results
   /conversation - Conversation view
   ```

3. **Placeholder Components**
   - Search bar (non-functional initially)
   - Empty results state
   - Basic styling with Tailwind

**Quick Start Example**:
```typescript
// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<SearchPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
```

---

### 7. Set Up Basic API Server
**Owner**: Backend Developer
**Timeline**: Week 1

Create minimal API server:

1. **Basic Express/Fastify server**
   ```typescript
   // backend/src/server.ts
   import express from 'express';

   const app = express();
   const PORT = process.env.PORT || 3001;

   app.use(express.json());

   app.get('/health', (req, res) => {
     res.json({ status: 'ok' });
   });

   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

2. **Basic error handling**
3. **CORS configuration**
4. **Logger setup**

---

## Questions to Resolve

### Design Questions
1. What is the primary color scheme?
2. What is the layout structure (sidebar + main area, or different)?
3. How should search results be displayed (list, grid, cards)?
4. What is the conversation interface design (chat bubbles, inline, other)?
5. Mobile-first or desktop-first approach?

### Technical Questions
1. Do we need real-time features (WebSockets)?
2. What level of offline support is needed?
3. Should conversations persist across sessions?
4. What export formats are most important (CSV, PDF, JSON)?
5. Are there any specific compliance requirements (data privacy, audit)?

### Product Questions
1. Who are the primary user personas?
2. What are the most common use cases/queries?
3. What data relationships are most important to surface?
4. Are there any data types with special visualization needs?
5. What analytics are most valuable to track?

---

## Team Coordination

### Suggested First Week Schedule

**Day 1**: Setup
- Morning: Review project plan and ai_instructions.md
- Afternoon: Initialize repositories, install dependencies

**Day 2**: Environment
- Morning: Set up local development environment
- Afternoon: Verify all team members can run basic "Hello World"

**Day 3**: Foundation
- Morning: Backend - Database schema and first generator (Person)
- Afternoon: Frontend - Basic layout and routing

**Day 4**: Integration
- Morning: Backend - Simple API endpoint (GET /api/people)
- Afternoon: Frontend - API client setup and first API call

**Day 5**: Review
- Morning: Demo current progress
- Afternoon: Retrospective, plan Week 2

### Communication
- Daily standup (15 min) - async or sync
- End of week demo (30 min)
- Slack/Discord for quick questions
- GitHub PRs for code review

---

## Success Criteria for Phase 0

By the end of Phase 0 (Week 0), we should have:

- ✅ Project plan and AI instructions documents created
- ⬜ Figma designs reviewed and documented
- ⬜ Technology stack finalized and documented
- ⬜ Git repository initialized with initial structure
- ⬜ All developers can run frontend and backend locally
- ⬜ Basic "Hello World" working in both frontend and backend
- ⬜ Docker Compose configured (if using Docker)
- ⬜ Code quality tools (ESLint, Prettier, Husky) set up
- ⬜ README.md updated with setup instructions

---

## Resources

### Learning Resources
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Fastify Documentation](https://www.fastify.io/docs/latest/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MeiliSearch Documentation](https://docs.meilisearch.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)

### Tools
- [Faker.js Documentation](https://fakerjs.dev/)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Excalidraw](https://excalidraw.com/) - For diagrams and planning

---

## Contact & Questions

If you have questions or need clarification on any part of the project plan:

1. Review the `ai_instructions.md` for detailed feature and architecture information
2. Review the `PROJECT_PLAN.md` for timeline and phase details
3. Create a GitHub issue for tracking
4. Discuss in team channels

---

**Last Updated**: 2025-10-23
**Next Review**: After Phase 0 completion
