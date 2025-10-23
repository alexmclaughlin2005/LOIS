# LOIS - Localized Organizational Intelligence System

An omni-search conversational application that provides unified access to organizational data through natural language interaction.

## Project Overview

LOIS connects to multiple data stores (projects, people, documents, notes, calendar, field data, audit logs) and presents information through an intelligent, context-aware conversational interface.

This is a **high-fidelity working prototype** built with synthetic datasets for user testing and validation.

## Documentation

### 📌 Start Here
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference card with key info, links, and checklists
- **[PROJECT_KICKOFF_SUMMARY.md](./PROJECT_KICKOFF_SUMMARY.md)** - Executive summary of planning phase

### 📋 Core Documentation
- **[ai_instructions.md](./ai_instructions.md)** - Master document mapping features, services, and architecture
- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** - Detailed project plan with phases, milestones, and deliverables
- **[DESIGN_SPECIFICATIONS.md](./DESIGN_SPECIFICATIONS.md)** - Complete UI/UX guidelines with colors, typography, and components
- **[FIGMA_DESIGN_ANALYSIS.md](./FIGMA_DESIGN_ANALYSIS.md)** - Summary of Figma design review and key findings
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Immediate action items and Phase 0 checklist

### 📚 Additional Documentation
- **[API Documentation](./docs/api.md)** - API endpoints and usage (coming soon)
- **[User Guide](./docs/user-guide.md)** - End-user documentation (coming soon)

## Project Structure

```
lois/
├── frontend/          # React + TypeScript frontend
│   └── src/
│       ├── components/    # UI components
│       ├── services/      # API and business logic
│       ├── hooks/         # React hooks
│       ├── stores/        # State management
│       ├── types/         # TypeScript types
│       └── utils/         # Utility functions
├── backend/           # Node.js + TypeScript backend
│   └── src/
│       ├── api/           # Routes and middleware
│       ├── services/      # Business logic
│       ├── models/        # Data models
│       ├── database/      # Database setup and migrations
│       └── utils/         # Utility functions
├── data/              # Data generation and seeding
│   ├── generators/        # Synthetic data generators
│   ├── seeds/            # Database seeding scripts
│   └── synthetic/        # Generated data files
└── docs/              # Additional documentation
```

## Getting Started

### Prerequisites

- Node.js 20+ LTS
- PostgreSQL 15+
- pnpm (or npm)
- Docker (optional, for running services locally)

### Installation

Instructions coming soon after Phase 0 setup is complete.

## Features

- **Omni-Search**: Search across all data stores simultaneously
- **Conversational Interface**: Natural language queries with context awareness
- **Multi-Type Results**: Unified display of heterogeneous results
- **Advanced Filtering**: Dynamic filters and faceted search
- **Export & Reporting**: Export results in multiple formats
- **Analytics Dashboard**: Insights about search patterns and data distribution

## Data Stores

LOIS connects to the following data types:

1. **Projects** - Project information, status, team
2. **People** - Personnel, contacts, roles
3. **Documents** - Files, reports, documentation
4. **Notes** - Internal notes and annotations
5. **Calendar** - Events, meetings, deadlines
6. **Field Data** - Location-based field observations
7. **Audit** - Activity logs and audit trail

## Technology Stack

### Frontend
- React 18+ with TypeScript
- Vite build tool
- Tailwind CSS + Shadcn/ui
- Zustand or React Query for state
- React Router for navigation

### Backend
- Node.js with Express/Fastify
- TypeScript
- PostgreSQL database
- Elasticsearch/MeiliSearch for search
- Redis for caching (optional)

### Data Generation
- Faker.js for synthetic data
- Custom TypeScript generators

## Development Status

**Current Phase**: Phase 0 - Planning & Setup

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed timeline and milestones.

## License

[To be determined]

## Contact

[To be determined]
