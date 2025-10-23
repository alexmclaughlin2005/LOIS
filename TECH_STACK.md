# LOIS - Technology Stack

**Date**: 2025-10-23
**Status**: Finalized for Phase 0

---

## Final Technology Decisions

### Frontend Stack

#### ✅ Framework & Build Tools
- **Framework**: React 18.3+
- **Language**: TypeScript 5+
- **Build Tool**: Vite 5+
- **Package Manager**: npm (built-in, reliable)

**Rationale**: Industry standard, excellent TypeScript support, fast development.

#### ✅ State Management
- **Choice**: React Query (TanStack Query v5)
- **Alternative considered**: Zustand

**Rationale**:
- React Query excels at server state management (perfect for search/API data)
- Built-in caching, refetching, and optimistic updates
- Better for data-heavy applications like LOIS
- Use React Context for UI state (sidebar open/closed, filters)

#### ✅ UI Components
- **Choice**: Shadcn/ui (Radix UI primitives)
- **Alternative considered**: Radix UI directly

**Rationale**:
- Shadcn/ui provides ready-made components that we can customize
- Built on Radix UI (excellent accessibility)
- Components are copied into project (full control)
- Faster development than building from Radix primitives
- Perfect for matching Figma designs

#### ✅ Styling
- **Primary**: Tailwind CSS 3+
- **CSS-in-JS**: None (Tailwind is sufficient)
- **Icons**: Lucide React (line icons, matches Figma style)

**Rationale**:
- Tailwind perfect for design token system
- Great for responsive design
- Lucide icons are clean, outline-style (matches designs)

#### ✅ Forms & Validation
- **Forms**: React Hook Form
- **Validation**: Zod

**Rationale**: Industry standard, TypeScript-first, works great with React Query.

#### ✅ Routing
- **Choice**: React Router v6

**Rationale**: Standard, reliable, excellent TypeScript support.

#### ✅ Date Handling
- **Choice**: date-fns

**Rationale**: Lightweight, tree-shakeable, functional approach.

---

### Backend Stack

#### ✅ Runtime & Framework
- **Runtime**: Node.js 20 LTS
- **Framework**: Fastify 4+
- **Language**: TypeScript 5+
- **Alternative considered**: Express

**Rationale**:
- Fastify is faster than Express (important for search performance)
- Better TypeScript support out of the box
- Built-in validation (JSON Schema)
- Modern async/await patterns
- Plugin ecosystem

#### ✅ Database
- **Primary Database**: PostgreSQL 15+
- **ORM**: Prisma 5+
- **Alternative considered**: TypeORM

**Rationale**:
- Prisma has excellent TypeScript support (auto-generated types)
- Great developer experience
- Visual studio integration
- Migrations are straightforward
- PostgreSQL is robust for relational data

#### ✅ Search Engine
- **Choice**: MeiliSearch
- **Alternative considered**: Elasticsearch

**Rationale**:
- MeiliSearch is easier to set up and configure
- Built-in typo tolerance and relevance ranking
- Great performance out of the box
- Lighter weight than Elasticsearch
- Perfect for prototype (can switch to Elasticsearch later if needed)
- REST API is simple

#### ✅ Caching
- **Choice**: Redis 7+
- **Usage**: Query caching, session storage

**Rationale**: Industry standard, fast, reliable. Optional for MVP but recommended.

#### ✅ AI/NLP
- **Choice**: OpenAI API (GPT-4)
- **Alternative**: Anthropic Claude API
- **Alternative considered**: Local LLM

**Rationale**:
- Faster to implement than local LLM
- Reliable query understanding
- Can switch to local LLM later if needed
- Good balance of cost and quality for prototype

#### ✅ Validation
- **Choice**: Zod (shared with frontend)

**Rationale**: TypeScript-first, can share schemas between frontend and backend.

#### ✅ Logging
- **Choice**: Pino

**Rationale**: Fast, JSON logging, works great with Fastify.

---

### Development Tools

#### ✅ Testing
- **Unit/Integration**: Vitest
- **Component Testing**: React Testing Library
- **E2E**: Playwright
- **API Testing**: Supertest with Vitest

**Rationale**: Vitest is fast, compatible with Vite, great DX.

#### ✅ Code Quality
- **Linting**: ESLint 8+ with TypeScript rules
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript strict mode

#### ✅ Development Environment
- **Containerization**: Docker + Docker Compose
- **Services**: PostgreSQL, Redis, MeiliSearch

**Rationale**: Consistent environment across team, easy setup.

---

### Data Generation

#### ✅ Synthetic Data
- **Library**: @faker-js/faker
- **Custom Generators**: TypeScript scripts in `data/generators/`
- **Seeding**: Prisma seed scripts

**Rationale**: Faker is comprehensive, TypeScript support, easy to customize.

---

## Project Structure

### Monorepo vs Multi-repo
**Decision**: Monorepo (single repository)

**Structure**:
```
lois/
├── frontend/          # React app
├── backend/           # Fastify API
├── data/              # Data generators
└── shared/            # Shared types and utilities (optional)
```

**Rationale**: Easier for small team, shared types, simpler deployment for prototype.

---

## Package Versions (Recommended)

### Frontend
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@tanstack/react-query": "^5.51.0",
    "react-hook-form": "^7.52.0",
    "zod": "^3.23.0",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.424.0",
    "axios": "^1.7.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vite": "^5.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.57.0",
    "prettier": "^3.3.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0"
  }
}
```

### Backend
```json
{
  "dependencies": {
    "fastify": "^4.28.0",
    "@fastify/cors": "^9.0.0",
    "@fastify/helmet": "^11.1.0",
    "prisma": "^5.17.0",
    "@prisma/client": "^5.17.0",
    "zod": "^3.23.0",
    "pino": "^9.3.0",
    "pino-pretty": "^11.2.0",
    "openai": "^4.53.0",
    "meilisearch": "^0.41.0",
    "redis": "^4.6.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "tsx": "^4.16.0",
    "@types/node": "^20.14.0",
    "eslint": "^8.57.0",
    "prettier": "^3.3.0",
    "vitest": "^2.0.0",
    "supertest": "^7.0.0"
  }
}
```

### Data Generation
```json
{
  "dependencies": {
    "@faker-js/faker": "^8.4.0",
    "@prisma/client": "^5.17.0",
    "date-fns": "^3.6.0"
  }
}
```

---

## Environment Variables

### Frontend (.env.local)
```bash
VITE_API_URL=http://localhost:3001
VITE_ENABLE_MOCK_DATA=false
```

### Backend (.env)
```bash
# Server
NODE_ENV=development
PORT=3001
HOST=0.0.0.0

# Database
DATABASE_URL="postgresql://lois:lois_dev_password@localhost:5432/lois_dev"

# MeiliSearch
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=lois_master_key_dev

# Redis
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Security
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=http://localhost:5173
```

---

## Docker Compose Configuration

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: lois-postgres
    environment:
      POSTGRES_USER: lois
      POSTGRES_PASSWORD: lois_dev_password
      POSTGRES_DB: lois_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: lois-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  meilisearch:
    image: getmeili/meilisearch:v1.9
    container_name: lois-meilisearch
    environment:
      MEILI_MASTER_KEY: lois_master_key_dev
      MEILI_ENV: development
    ports:
      - "7700:7700"
    volumes:
      - meilisearch_data:/meili_data

volumes:
  postgres_data:
  redis_data:
  meilisearch_data:
```

---

## Scripts to Add

### Root package.json
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "test": "npm run test:frontend && npm run test:backend",
    "test:frontend": "cd frontend && npm test",
    "test:backend": "cd backend && npm test",
    "lint": "npm run lint:frontend && npm run lint:backend",
    "lint:frontend": "cd frontend && npm run lint",
    "lint:backend": "cd backend && npm run lint",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "setup": "npm run docker:up && npm run setup:backend && npm run setup:frontend",
    "setup:backend": "cd backend && npm install && npm run db:migrate && npm run db:seed",
    "setup:frontend": "cd frontend && npm install"
  }
}
```

---

## Installation Order

1. **Docker services** (PostgreSQL, Redis, MeiliSearch)
2. **Backend** (install deps, run migrations)
3. **Frontend** (install deps)
4. **Data generation** (seed database)

---

## Development Workflow

### Initial Setup
```bash
# 1. Start Docker services
npm run docker:up

# 2. Install all dependencies
npm run setup

# 3. Start development servers
npm run dev
```

### Daily Development
```bash
# Start Docker services (if not running)
docker-compose up -d

# Start dev servers
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3001
# MeiliSearch: http://localhost:7700
```

---

## Architecture Decisions

### Why Fastify over Express?
- 2x-3x faster in benchmarks
- Better TypeScript support
- Built-in schema validation
- Plugin architecture
- Modern async/await

### Why React Query over Zustand?
- LOIS is data-heavy (search, feeds, results)
- React Query handles server state excellently
- Built-in caching and refetching
- Optimistic updates
- Better for API-first apps

### Why MeiliSearch over Elasticsearch?
- Simpler setup for prototype
- Great out-of-the-box relevance
- Lighter resource usage
- Easy to switch later if needed

### Why Prisma over TypeORM?
- Better TypeScript support
- Auto-generated types
- Cleaner syntax
- Better migration system
- Great VS Code integration

### Why Shadcn/ui?
- Components you own (copied to project)
- Built on Radix (accessible)
- Easy to customize for Figma designs
- Faster than building from scratch

---

## Trade-offs & Considerations

### OpenAI API
**Pro**: Fast to implement, reliable
**Con**: Costs money, requires internet
**Mitigation**: Can switch to local LLM later if needed

### MeiliSearch
**Pro**: Easy setup, great for prototype
**Con**: Less feature-rich than Elasticsearch
**Mitigation**: Architecture allows switching later

### Monorepo
**Pro**: Simpler for small team, shared types
**Con**: Single repo can grow large
**Mitigation**: Structure allows splitting later if needed

---

## Success Criteria

This tech stack is successful if:
- ✅ Development server starts in < 30 seconds
- ✅ Hot reload works reliably
- ✅ Search completes in < 1 second
- ✅ TypeScript catches errors at compile time
- ✅ Easy to onboard new developers
- ✅ Can build production bundles
- ✅ Tests run fast (< 10 seconds for unit tests)

---

## Future Considerations

### If Scaling Needed:
- Switch to Elasticsearch for advanced search
- Add load balancer
- Consider microservices architecture
- Add CDN for frontend assets

### If Going Production:
- Add proper authentication (Auth0, Clerk, etc.)
- Set up CI/CD (GitHub Actions)
- Add monitoring (Sentry, DataDog)
- Add analytics (PostHog, Mixpanel)
- Configure production environment variables

---

## Documentation References

- [Fastify Docs](https://fastify.dev/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Prisma Docs](https://www.prisma.io/docs)
- [MeiliSearch Docs](https://www.meilisearch.com/docs)
- [Shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind Docs](https://tailwindcss.com/)

---

**Status**: ✅ Finalized
**Review Date**: 2025-10-23
**Next Review**: After Phase 1 (Week 2)
