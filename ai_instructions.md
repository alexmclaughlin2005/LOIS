# LOIS - AI Instructions Master Document

## Application Overview

**LOIS** (Localized Organizational Intelligence System) is an omni-search conversational application that provides unified access to organizational data through natural language interaction. It connects to multiple data stores and presents information through an intelligent, context-aware conversational interface.

**Design Philosophy**: LOIS combines two distinct UI paradigms:
1. **Conversational AI Interface** - Chat-centric design with LOIS sidebar navigation, saved routines, and natural language input
2. **Traditional Activity Feed** - FileVine-style interface with task management, filters, and structured data views

The application seamlessly bridges AI-powered search and traditional project/case management workflows.

---

## Core Purpose

LOIS enables users to search, discover, and interact with organizational data across multiple domains (projects, people, documents, notes, calendar, field data, audit logs) through natural language queries and conversational interactions.

**Key Design Reference**: See `DESIGN_SPECIFICATIONS.md` for complete UI/UX guidelines including color palette, typography, component patterns, and interaction design.

---

## Application Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Search    │  │Conversation  │  │  Results Panel   │  │
│  │  Interface  │  │   Interface  │  │  (Multi-type)    │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │    Search    │  │Conversation  │  │  Aggregation    │  │
│  │     API      │  │     API      │  │     API         │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Search     │  │   AI/NLP     │  │   Data Access   │  │
│  │   Service    │  │   Service    │  │    Service      │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Store Connectors                      │
│  ┌────────┐ ┌────────┐ ┌─────────┐ ┌────────┐ ┌─────────┐ │
│  │Projects│ │ People │ │Documents│ │ Notes  │ │Calendar │ │
│  └────────┘ └────────┘ └─────────┘ └────────┘ └─────────┘ │
│  ┌────────┐ ┌────────┐                                      │
│  │  Field │ │ Audit  │                                      │
│  │  Data  │ │  Data  │                                      │
│  └────────┘ └────────┘                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Feature Mapping

### 1. Conversational Search Interface

**Purpose**: Allow users to search using natural language queries

**Key Features**:
- Natural language query input
- Query understanding and intent recognition
- Context-aware search across all data stores
- Suggested queries and autocomplete
- Query history and saved searches

**Technical Components**:
- `ConversationService` - Manages conversation state and context
- `QueryParser` - Parses and interprets natural language
- `IntentRecognizer` - Determines user intent (search, filter, compare, etc.)
- `ContextManager` - Maintains conversation context across queries

**Interactions**:
- User enters query → QueryParser → IntentRecognizer → SearchService → Results
- Context flows through ContextManager to inform subsequent queries

---

### 2. Omni-Search Engine

**Purpose**: Search across all connected data stores simultaneously

**Key Features**:
- Unified search across all data types
- Relevance ranking and scoring
- Filtered search by data type
- Faceted search with dynamic filters
- Real-time search suggestions

**Technical Components**:
- `SearchService` - Core search orchestration
- `IndexService` - Manages search indexes for each data store
- `RankingEngine` - Scores and ranks results by relevance
- `FilterService` - Applies filters and facets to results

**Data Store Connectors**:
- `ProjectConnector` - Searches project data
- `PeopleConnector` - Searches people/contact data
- `DocumentConnector` - Searches documents
- `NotesConnector` - Searches notes
- `CalendarConnector` - Searches calendar entries
- `FieldDataConnector` - Searches field data
- `AuditConnector` - Searches audit logs

**Interactions**:
- SearchService coordinates parallel queries to all connectors
- Results aggregated and ranked by RankingEngine
- FilterService applies user-specified filters

---

### 3. Multi-Type Results Display

**Purpose**: Display heterogeneous results in an organized, scannable format

**Key Features**:
- Grouped results by data type
- Preview cards for each result type
- Quick actions per result type
- Infinite scroll/pagination
- Sort and filter controls
- Detailed view modal/panel

**Technical Components**:
- `ResultsRenderer` - Renders results based on type
- `CardFactory` - Creates appropriate card components per type
- `PreviewService` - Generates previews and excerpts
- `QuickActionsService` - Provides contextual actions

**Result Types**:
- **Project**: Name, status, dates, owner, description preview
- **Person**: Name, role, department, contact info, avatar
- **Document**: Title, type, date, author, excerpt
- **Note**: Title, date, tags, excerpt
- **Calendar**: Event title, date/time, participants, location
- **Field Data**: Record ID, type, location, date, key fields
- **Audit**: Action, user, timestamp, entity, changes

---

### 4. Conversation History & Context

**Purpose**: Maintain conversation context to enable follow-up queries

**Key Features**:
- Persistent conversation threads
- Context-aware follow-up queries
- Reference to previous results
- Conversation branching
- Export conversation history

**Technical Components**:
- `ConversationStore` - Persists conversation data
- `ContextResolver` - Resolves references in queries
- `ThreadManager` - Manages conversation threads

**Interactions**:
- Each query adds to conversation thread
- ContextResolver interprets "show me more", "who else", etc.
- Previous results inform current search

---

### 5. Advanced Filtering & Refinement

**Purpose**: Allow users to narrow results through filters

**Key Features**:
- Dynamic filters based on result types
- Date range filtering
- Metadata filtering (status, owner, type, etc.)
- Tag-based filtering
- Location-based filtering (for field data)

**Technical Components**:
- `FilterService` - Manages filter application
- `FilterConfigService` - Provides available filters per data type
- `DateRangeService` - Handles date/time filtering

---

### 6. Reporting & Export

**Purpose**: Enable users to export and report on search results

**Key Features**:
- Export results to CSV, PDF, JSON
- Create saved reports
- Schedule recurring reports
- Share results with team members

**Technical Components**:
- `ExportService` - Handles data export
- `ReportGenerator` - Creates formatted reports
- `SharingService` - Manages sharing and permissions

---

### 7. Analytics & Insights

**Purpose**: Provide insights about organizational data

**Key Features**:
- Search analytics (common queries, trends)
- Data distribution visualizations
- Activity timelines
- Relationship mapping

**Technical Components**:
- `AnalyticsService` - Collects and analyzes usage data
- `VisualizationService` - Generates charts and graphs
- `InsightsEngine` - Identifies patterns and insights

---

## Data Models

### Core Entities

#### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  owner: Person;
  team: Person[];
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Person
```typescript
interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department: string;
  avatar?: string;
  location?: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Document
```typescript
interface Document {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'spreadsheet' | 'presentation' | 'text' | 'other';
  content: string;
  author: Person;
  project?: Project;
  fileSize: number;
  mimeType: string;
  url: string;
  tags: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Note
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  author: Person;
  project?: Project;
  tags: string[];
  isPrivate: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### CalendarEntry
```typescript
interface CalendarEntry {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  participants: Person[];
  project?: Project;
  type: 'meeting' | 'deadline' | 'milestone' | 'reminder' | 'other';
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### FieldData
```typescript
interface FieldData {
  id: string;
  type: string;
  project: Project;
  collector: Person;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  data: Record<string, any>;
  attachments: string[];
  tags: string[];
  metadata: Record<string, any>;
  collectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### AuditEntry
```typescript
interface AuditEntry {
  id: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'share';
  entityType: 'project' | 'person' | 'document' | 'note' | 'calendar' | 'field_data';
  entityId: string;
  user: Person;
  changes?: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}
```

#### SearchResult
```typescript
interface SearchResult {
  id: string;
  type: 'project' | 'person' | 'document' | 'note' | 'calendar' | 'field_data' | 'audit';
  entity: Project | Person | Document | Note | CalendarEntry | FieldData | AuditEntry;
  score: number;
  highlights: {
    field: string;
    matches: string[];
  }[];
  metadata: Record<string, any>;
}
```

#### ConversationThread
```typescript
interface ConversationThread {
  id: string;
  user: Person;
  messages: ConversationMessage[];
  context: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### ConversationMessage
```typescript
interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  query?: string;
  results?: SearchResult[];
  metadata: Record<string, any>;
  timestamp: Date;
}
```

---

## Service Interactions

### Search Flow

1. **User Input** → `ConversationInterface`
2. **Query Parsing** → `QueryParser` extracts intent, entities, filters
3. **Intent Recognition** → `IntentRecognizer` determines action type
4. **Context Resolution** → `ContextManager` adds conversation context
5. **Search Execution** → `SearchService` orchestrates data store queries
6. **Parallel Queries** → All `DataConnectors` execute searches simultaneously
7. **Result Aggregation** → `RankingEngine` merges and scores results
8. **Filter Application** → `FilterService` applies user filters
9. **Result Rendering** → `ResultsRenderer` displays results
10. **Context Update** → `ConversationStore` saves query and results

### Conversation Flow

1. **New Query** → Check `ContextManager` for conversation context
2. **Reference Resolution** → `ContextResolver` interprets references ("show me more", "who is on that project")
3. **Augmented Query** → Original query + context → `SearchService`
4. **Results with Context** → Results include reference to previous queries
5. **Thread Update** → `ThreadManager` adds to conversation thread

---

## Technology Stack Recommendations

### Frontend
- **Framework**: React 18+ with TypeScript
- **State Management**: Zustand or React Query
- **UI Components**: Shadcn/ui or Radix UI
- **Styling**: Tailwind CSS (configured with design tokens from DESIGN_SPECIFICATIONS.md)
- **Search UI**: Custom components with accessibility focus
- **Chat UI**: Message list with streaming support
- **Icons**: Line/outline style icons (16-24px, matching Figma designs)

**Design Integration**:
- Implement color palette from DESIGN_SPECIFICATIONS.md as Tailwind theme
- Use 8px spacing scale for consistent layouts
- Typography: Helvetica Now Display for headings, system fonts for body
- Components should match Figma designs (buttons, cards, inputs, etc.)

### Backend
- **Runtime**: Node.js with Express or Fastify
- **Language**: TypeScript
- **Search**: Elasticsearch or MeiliSearch for indexing
- **Database**: PostgreSQL for relational data
- **Caching**: Redis for session and query caching
- **AI/NLP**: OpenAI API or local LLM for query understanding

### Data Generation (Prototype)
- **Faker.js**: Generate synthetic person data
- **Custom generators**: Domain-specific data (projects, field data, tasks, notes)
- **Date libraries**: date-fns for temporal data
- **Seed scripts**: Reproducible data generation matching FileVine/case management context

### Development
- **Package Manager**: pnpm or npm
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **API Testing**: Supertest
- **E2E Testing**: Playwright

---

## Key User Flows

### Flow 1: Simple Search
1. User types "projects in California"
2. System parses query: intent=search, entity=project, filter=location:California
3. ProjectConnector searches with location filter
4. Results displayed grouped by relevance
5. User can refine with additional filters

### Flow 2: Conversational Refinement
1. User: "show me active projects"
2. System returns active projects
3. User: "who is working on the solar project?"
4. System resolves "solar project" from previous results
5. Returns team members for that specific project

### Flow 3: Cross-Entity Search
1. User: "everything related to John Smith"
2. System searches all data stores for John Smith
3. Returns: Person profile, Projects where he's involved, Documents authored, Calendar events, Field data collected, Audit trail
4. Results grouped by type with counts

### Flow 4: Temporal Query
1. User: "what happened last week?"
2. System applies date filter: last 7 days
3. Searches Calendar entries, Audit logs, new Documents, new Field data
4. Timeline view of activities

### Flow 5: Export Results
1. User performs search
2. Clicks "Export" button
3. Selects format (CSV/PDF/JSON)
4. ExportService generates file with current results
5. File downloaded

---

## API Endpoints

### Search API
- `POST /api/search` - Execute omni-search
- `POST /api/search/suggestions` - Get query suggestions
- `GET /api/search/filters` - Get available filters for result set

### Conversation API
- `POST /api/conversations` - Start new conversation
- `GET /api/conversations/:id` - Get conversation thread
- `POST /api/conversations/:id/messages` - Add message to conversation
- `DELETE /api/conversations/:id` - Delete conversation

### Data APIs (per entity type)
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project details
- `GET /api/people` - List people
- `GET /api/people/:id` - Get person details
- Similar endpoints for documents, notes, calendar, field-data, audit

### Export API
- `POST /api/export` - Export search results
- `GET /api/export/:id` - Download exported file

### Analytics API
- `GET /api/analytics/search-trends` - Get search trends
- `GET /api/analytics/data-distribution` - Get data distribution stats

---

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
- Set up project structure
- Configure TypeScript, build tools
- Create basic UI layout
- Implement data models
- Generate synthetic datasets

### Phase 2: Search Core (Weeks 3-4)
- Implement SearchService
- Build data store connectors
- Create indexing system
- Basic search UI with results display

### Phase 3: Conversational Interface (Weeks 5-6)
- Build ConversationService
- Implement QueryParser and IntentRecognizer
- Create chat UI
- Context management

### Phase 4: Advanced Features (Weeks 7-8)
- Advanced filtering
- Export functionality
- Analytics dashboard
- Performance optimization

### Phase 5: Polish & Testing (Weeks 9-10)
- User testing feedback integration
- UI/UX refinement
- Performance testing
- Documentation

---

## Success Metrics

### User Experience
- Query response time < 500ms
- Natural language query understanding accuracy > 85%
- User satisfaction score > 4/5

### Technical Performance
- Search across all data stores < 1 second
- Support for 10+ concurrent users
- 99.9% uptime

### Business Value
- Reduction in time to find information
- Increased data discovery
- User adoption rate

---

## Synthetic Data Requirements

### Scale for Prototype
- **Projects**: 200-300 records
- **People**: 100-150 records
- **Documents**: 500-800 records
- **Notes**: 300-500 records
- **Calendar Entries**: 400-600 records
- **Field Data**: 200-400 records
- **Audit Entries**: 1000-2000 records

### Data Characteristics
- **Realistic names and locations**: Use California-specific data
- **Temporal spread**: Data spanning 2-3 years
- **Interconnections**: Projects linked to people, documents, etc.
- **Variety**: Different statuses, types, tags
- **Search-relevant content**: Include keywords that users might search

---

## File Structure

```
lois/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── search/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── SearchResults.tsx
│   │   │   │   └── ResultCard.tsx
│   │   │   ├── conversation/
│   │   │   │   ├── ConversationInterface.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   └── MessageBubble.tsx
│   │   │   ├── filters/
│   │   │   │   ├── FilterPanel.tsx
│   │   │   │   └── FilterChip.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       ├── Sidebar.tsx
│   │   │       └── MainLayout.tsx
│   │   ├── services/
│   │   │   ├── searchService.ts
│   │   │   ├── conversationService.ts
│   │   │   └── apiClient.ts
│   │   ├── hooks/
│   │   │   ├── useSearch.ts
│   │   │   ├── useConversation.ts
│   │   │   └── useFilters.ts
│   │   ├── stores/
│   │   │   ├── searchStore.ts
│   │   │   └── conversationStore.ts
│   │   ├── types/
│   │   │   ├── entities.ts
│   │   │   ├── search.ts
│   │   │   └── conversation.ts
│   │   └── App.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── search.ts
│   │   │   │   ├── conversation.ts
│   │   │   │   ├── projects.ts
│   │   │   │   └── [other entities].ts
│   │   │   └── middleware/
│   │   │       ├── auth.ts
│   │   │       └── errorHandler.ts
│   │   ├── services/
│   │   │   ├── searchService.ts
│   │   │   ├── conversationService.ts
│   │   │   ├── queryParser.ts
│   │   │   ├── intentRecognizer.ts
│   │   │   ├── rankingEngine.ts
│   │   │   └── connectors/
│   │   │       ├── projectConnector.ts
│   │   │       ├── peopleConnector.ts
│   │   │       └── [other connectors].ts
│   │   ├── models/
│   │   │   ├── Project.ts
│   │   │   ├── Person.ts
│   │   │   └── [other models].ts
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   └── migrations/
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   └── validators.ts
│   │   └── server.ts
│   └── package.json
├── data/
│   ├── generators/
│   │   ├── projectGenerator.ts
│   │   ├── personGenerator.ts
│   │   └── [other generators].ts
│   ├── seeds/
│   │   └── seedDatabase.ts
│   └── synthetic/
│       └── [generated JSON files]
├── docs/
│   ├── api.md
│   ├── architecture.md
│   └── user-guide.md
├── ai_instructions.md
├── PROJECT_PLAN.md
└── README.md
```

---

## AI Coding Tool Guidance

When working on LOIS, AI coding tools should:

1. **Understand the context**: This is a search-first application where conversation enhances discovery
2. **Prioritize search performance**: All queries should be optimized for speed
3. **Maintain type safety**: Use TypeScript strictly throughout
4. **Follow the service layer pattern**: Keep concerns separated
5. **Think about extensibility**: New data stores should be easy to add
6. **Focus on UX**: Search and conversation should feel fast and intuitive
7. **Generate realistic data**: Synthetic data should be believable and useful for testing
8. **Document as you go**: Complex logic should have clear comments
9. **Test search scenarios**: Consider edge cases in query parsing
10. **Keep accessibility in mind**: All UI should be keyboard navigable

### Common Tasks
- **Adding a new data store**: Create connector in `backend/src/services/connectors/`, add to SearchService orchestration, create generator in `data/generators/`
- **Adding a filter**: Update FilterService, add UI component, update FilterPanel
- **Improving search relevance**: Modify RankingEngine scoring algorithm
- **Adding query intent**: Update IntentRecognizer with new pattern matching
- **Creating new result card**: Add component in `frontend/src/components/search/`, register in CardFactory

---

## Next Steps

1. Review Figma designs (when accessible) and update this document with specific UI patterns
2. Confirm technology stack choices
3. Set up development environment
4. Begin Phase 1 implementation
5. Generate initial synthetic datasets
6. Build basic search functionality
7. Iterate with user testing

---

**Document Version**: 1.0
**Last Updated**: 2025-10-23
**Status**: Initial Draft - Awaiting Figma Design Review
