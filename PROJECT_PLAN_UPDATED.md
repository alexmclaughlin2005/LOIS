# LOIS Project Plan - Updated
## Omni-Search Conversational Application

**Project Start Date**: October 23, 2025
**Current Date**: October 24, 2025
**Current Phase**: Phase 2 (Backend Integration) - 80% Complete
**Overall Project Status**: 🟢 **50-60% Complete**
**Last Updated**: 2025-10-24

---

## Executive Summary

LOIS (Localized Organizational Intelligence System) is an AI-powered legal operations intelligence system that enables natural language queries over legal case data. The application uses LLM-powered query generation to convert conversational questions into SQL queries against a PostgreSQL database.

### Project Goals
1. ✅ Build a functional prototype demonstrating conversational search capabilities
2. ✅ Connect to database with realistic legal case data (6,000-8,000 records)
3. ✅ Enable natural language queries with AI-powered SQL generation
4. 🔄 Create an intuitive, fast, and accessible user interface (in progress)
5. ⏳ Enable automated routine execution for recurring queries

### Success Criteria
- ✅ Working application deployed to Vercel for user testing
- ✅ Sub-second query response times for most queries
- ✅ Natural language query understanding with AI (Claude)
- 🔄 Rich multi-entity result displays (basic table view complete)
- 🔄 Routine creation and automation (UI complete, execution pending)

---

## 🎉 Major Accomplishments (Phases 0-2)

### ✅ Phase 0: Planning & Setup (COMPLETE)
**Duration**: Week 0 (Oct 23-24, 2025)
**Status**: ✅ **100% Complete**

#### Completed Deliverables
- [x] AI Instructions document (ai_instructions.md)
- [x] Project plan documents
- [x] Technology stack finalized (SvelteKit + Supabase + Anthropic)
- [x] Git repository initialized
- [x] Project structure scaffolded
- [x] Figma design analysis complete
- [x] Design system implemented in Tailwind

**Key Achievements:**
- Created 4,900+ lines of planning documentation
- Extracted complete Figma design specifications
- Implemented comprehensive design token system
- Set up SvelteKit with Tailwind CSS 4

---

### ✅ Phase 1: Foundation (COMPLETE)
**Duration**: Weeks 1-2
**Status**: ✅ **95% Complete**

#### Completed Deliverables
- [x] Database schema created (9 entities, 10+ tables)
- [x] Synthetic data generators for all entity types
- [x] Seeded database with 6,000-8,000 records
- [x] Basic frontend layout (header, input, results area)
- [x] Supabase connection working
- [x] Type definitions for all entities

**Key Achievements:**
- Complete PostgreSQL schema with legal case management entities
- Comprehensive seed data generator creating realistic legal data:
  - 150-200 Projects (legal cases)
  - 300-400 Contacts (attorneys, clients, witnesses)
  - 800-1,000 Documents with full-text content
  - 500-700 Calendar Entries (hearings, deadlines)
  - 600-800 Notes & 400-600 Tasks
  - 2,000-3,000 Time Entries (billable hours)
  - 300-500 Expenses & 150-250 Invoices

---

### ✅ Phase 2: AI-Powered Search Core (80% COMPLETE)
**Duration**: Weeks 3-4
**Status**: 🟡 **80% Complete** (CURRENT PHASE)

#### Completed Deliverables
- [x] Supabase database connection
- [x] AI-powered query classification (LLM-based)
- [x] Dynamic SQL generation from natural language (Anthropic Claude)
- [x] Query execution via Supabase RPC
- [x] Conversation context for follow-up queries
- [x] Document search with context awareness
- [x] Basic results display with tables
- [x] Query routing system
- [x] Error handling and validation

#### Partially Complete
- [ ] 🔄 Multi-entity result cards (only basic table view)
- [ ] 🔄 Grouped results by entity type
- [ ] 🔄 Quick actions per result
- [ ] 🔄 Rich result previews

**Key Achievements:**
- **LLM Integration**: Claude 3.5 Sonnet for query understanding
- **Intelligent SQL Generation**: Converts natural language to PostgreSQL queries
- **Context-Aware Conversations**: Maintains conversation state for follow-ups
- **Query Classification**: Automatically routes queries (SQL, document search, general)
- **Safety**: Read-only queries with SQL injection prevention

**Recent Git Commits (Last 20):**
```
55b43c2 fix: Always include case_number in document queries
4856897 refactor: Simplify LLM prompts to reduce verbosity
c0ecd20 fix: Correct Supabase query for documents by case number
9802164 fix: Improve document context extraction for follow-up queries
7150c2f fix: Update documents table schema documentation
0826506 feat: Make general handler document-aware for summarization
8530fa6 fix: Improve context handling in SQL generation
426ebf4 fix: Make document search context-aware for follow-up queries
2945dd2 feat: Implement conversation context for follow-up queries
b717c22 docs: Document data quality issue with party names
277c42c fix: Add party name search guidance
8f3354b feat: Enhance SQL generation prompt with rules and examples
2f367bb fix: Extract SQL from markdown code blocks in LLM responses
a2c69ee debug: Add enhanced logging to diagnose SQL execution
547cc7b feat: Replace pattern-based classifier with LLM classifier
2acd4f3 fix: Update database schema in SQL generation
6f66d90 fix: Improve query classification for SQL queries
ba223a5 feat: LLM-powered dynamic SQL query generation
b59066d feat: Implement intelligent query routing system
5e6fab2 feat: Connect frontend to Supabase database
```

---

## 🎯 Current Status Summary

### What's Working Now ✅
1. **Natural Language Queries**: Ask questions in plain English, get SQL results
2. **AI Query Understanding**: Claude interprets intent and generates PostgreSQL
3. **Follow-up Questions**: Maintains context (e.g., "these cases", "those documents")
4. **Document Search**: Full-text search with context awareness
5. **Database**: 6,000-8,000 realistic legal records ready to query
6. **Safety**: SQL injection prevention, read-only queries
7. **Deployment**: Live on Vercel with Supabase backend

### What's Not Working Yet ❌
1. **Rich Result Display**: Only basic tables (no entity-specific cards)
2. **Result Grouping**: No "5 Cases, 12 Documents" grouped views
3. **Filtering UI**: Can generate filtered SQL but no UI controls
4. **Export**: No CSV/PDF export functionality
5. **Routine Execution**: UI exists but routines don't save/run
6. **Conversation Persistence**: Context lost on page refresh
7. **User Authentication**: No multi-user support yet
8. **Query Suggestions**: No pre-built example queries

---

## 📋 Next Phases - Detailed Plan

### Phase 3: Complete the Search Experience (Weeks 5-6)
**Duration**: 2 weeks
**Status**: ⏳ **Not Started**
**Priority**: 🔴 **HIGH**

#### Objectives
- Create rich, entity-specific result displays
- Implement advanced filtering UI
- Add export functionality
- Persist conversation history

#### 3.1 Multi-Entity Result Cards (Week 5, Days 1-3)
**Time Estimate**: 3-4 days

**Tasks:**
- [ ] Create result card components for each entity type:
  - [ ] `ProjectCard.svelte` - Case number, title, type, status, phase, value
    - Show case-specific custom fields (medical expenses, contract value, etc.)
    - Status badge with color coding
    - Quick action buttons (view details, export, share)
  - [ ] `ContactCard.svelte` - Name, role, contact info, organization
    - Avatar with initials fallback
    - Contact type badge (Attorney, Client, Witness, Expert)
    - Quick actions (email, phone, view cases)
  - [ ] `DocumentCard.svelte` - Title, type, date filed, size, preview
    - Document type icon
    - File size and mime type
    - Preview snippet (first 200 chars of content)
    - Quick actions (download, view, search in doc)
  - [ ] `CalendarCard.svelte` - Event title, type, date/time, location
    - Event type badge (Hearing, Deposition, Deadline, Meeting)
    - Time formatted (e.g., "Tomorrow at 2:00 PM")
    - Quick actions (add to calendar, reschedule)
  - [ ] `TimeEntryCard.svelte` - Attorney, hours, rate, total, activity type
    - Billable status indicator
    - Hourly rate and total amount highlighted
    - Quick actions (edit, mark non-billable)
  - [ ] `TaskCard.svelte` - Title, status, priority, due date, assignee
    - Priority badge (Urgent, High, Medium, Low)
    - Due date with overdue warning
    - Quick actions (complete, reassign, edit)
  - [ ] `NoteCard.svelte` - Content preview, author, date, privacy status
    - Private/public indicator
    - Author avatar
    - Quick actions (view full, edit, share)

- [ ] Implement `ResultsRenderer.svelte`:
  - Detect entity type from SQL result columns
  - Render appropriate card component
  - Handle mixed result types
  - Fallback to generic card for unknown types

- [ ] Add grouped results view:
  - Count by entity type (e.g., "Found 5 Cases, 12 Documents, 3 Contacts")
  - Tab navigation between entity types
  - "View All" vs type-specific tabs
  - Maintain query context when switching tabs

- [ ] Add quick actions framework:
  - Define action interface: `{ label: string, icon: string, handler: () => void }`
  - Context-aware actions per entity type
  - Action confirmation dialogs for destructive actions
  - Toast notifications on action completion

**Success Criteria:**
- ✅ Each entity type displays in a visually distinct card
- ✅ Results grouped by type with counts
- ✅ Quick actions work for at least 2 actions per entity type
- ✅ Cards match Figma design specifications

**Files to Create:**
- `frontend/src/lib/components/results/ProjectCard.svelte`
- `frontend/src/lib/components/results/ContactCard.svelte`
- `frontend/src/lib/components/results/DocumentCard.svelte`
- `frontend/src/lib/components/results/CalendarCard.svelte`
- `frontend/src/lib/components/results/TimeEntryCard.svelte`
- `frontend/src/lib/components/results/TaskCard.svelte`
- `frontend/src/lib/components/results/NoteCard.svelte`
- `frontend/src/lib/components/results/ResultsRenderer.svelte`
- `frontend/src/lib/components/results/GroupedResults.svelte`

---

#### 3.2 Conversation Persistence (Week 5, Days 4-5)
**Time Estimate**: 2-3 days

**Tasks:**
- [ ] Create `conversations` and `conversation_messages` tables:
  ```sql
  CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- For future auth (nullable for now)
    title VARCHAR(255), -- First query as title
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    sql_executed TEXT,
    result_data JSONB,
    result_count INTEGER,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX idx_conversations_created ON conversations(created_at DESC);
  CREATE INDEX idx_messages_conversation ON conversation_messages(conversation_id);
  ```

- [ ] Implement conversation management:
  - [ ] Save query/result pair on each submission
  - [ ] Auto-generate conversation title from first query
  - [ ] Load conversation on page load (use URL param: `/chat?conversation=uuid`)
  - [ ] List recent conversations in sidebar
  - [ ] Add "New Conversation" button to start fresh

- [ ] Create `ConversationHistory.svelte` sidebar component:
  - List recent 10 conversations
  - Show title and timestamp
  - Click to load conversation
  - Delete button with confirmation
  - "Load More" pagination

- [ ] Update chat interface to use conversation context:
  - Load previous messages on mount
  - Display full conversation history
  - Maintain scroll position
  - Auto-scroll to bottom on new message

**Success Criteria:**
- ✅ Conversations persist across page refreshes
- ✅ Can return to previous conversations
- ✅ Conversation history sidebar shows recent conversations
- ✅ Follow-up queries use full conversation history

**Files to Create/Modify:**
- `database/schema.sql` - Add tables
- `frontend/src/lib/stores/conversationStore.ts`
- `frontend/src/lib/components/ConversationHistory.svelte`
- `frontend/src/routes/chat/+page.svelte` - Update to use conversation ID

---

#### 3.3 Export Functionality (Week 6, Days 1-2)
**Time Estimate**: 2-3 days

**Tasks:**
- [ ] Add "Export" button to results view with dropdown:
  - Export as CSV
  - Export as PDF (future)
  - Export as JSON

- [ ] Implement CSV export:
  ```typescript
  // frontend/src/lib/utils/export.ts
  export function exportToCSV(data: any[], filename: string) {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Handle commas and quotes in values
          return typeof value === 'string'
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        }).join(',')
      )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  ```

- [ ] Create `exports` table to track export history:
  ```sql
  CREATE TABLE exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    conversation_id UUID REFERENCES conversations(id),
    export_type VARCHAR(50), -- 'csv', 'pdf', 'json'
    filename VARCHAR(255),
    row_count INTEGER,
    file_size_kb INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] Add export history view:
  - List recent exports
  - Re-download previous exports
  - Show export metadata (date, type, row count)

- [ ] Implement PDF export (optional for Phase 3):
  - Use `jsPDF` library
  - Format results as table
  - Include query and timestamp
  - Add LOIS branding

**Success Criteria:**
- ✅ Can export any query result to CSV
- ✅ CSV file opens correctly in Excel/Google Sheets
- ✅ Export history tracked in database
- ✅ Export button disabled when no results

**Files to Create/Modify:**
- `database/schema.sql` - Add exports table
- `frontend/src/lib/utils/export.ts`
- `frontend/src/lib/components/ExportButton.svelte`
- `frontend/src/lib/components/ExportHistory.svelte`

---

#### 3.4 Advanced Filtering UI (Week 6, Days 3-5)
**Time Estimate**: 3-4 days

**Tasks:**
- [ ] Create `FilterPanel.svelte` component (slide-out from right):
  - Matches Figma design from DESIGN_SPECIFICATIONS.md
  - Animated slide-in/out transition
  - Sticky header with "Filters" title and close button
  - Scrollable filter content area

- [ ] Implement dynamic filters based on current result type:
  - **For Case/Project results:**
    - Case Type checkboxes (Personal Injury, Corporate, Family Law, etc.)
    - Status checkboxes (Open, Closed, Pending, On Hold)
    - Phase checkboxes (Discovery, Trial, Settlement, etc.)
    - Priority checkboxes (Low, Medium, High, Urgent)
    - Filing Date range picker
    - Estimated Value range slider
    - Custom fields (e.g., Medical Expenses > $X)

  - **For Document results:**
    - Document Type checkboxes (Pleading, Discovery, Evidence, etc.)
    - Status checkboxes (Draft, Final, Filed)
    - Date Filed range picker
    - File Size range
    - Tags multi-select

  - **For Contact results:**
    - Contact Type checkboxes (Attorney, Client, Witness, Expert)
    - Organization dropdown
    - State/Location dropdown

  - **For Calendar results:**
    - Entry Type checkboxes (Hearing, Deposition, Deadline, Meeting)
    - Date range picker (Start Time)
    - Location search

- [ ] Add filter state management:
  - Store active filters in Svelte store
  - Update SQL query when filters change
  - Persist filters in URL query params
  - Clear filters functionality
  - "Reset to Default" button

- [ ] Show active filter chips above results:
  - Pill-shaped chips with filter name and value
  - "X" button to remove individual filter
  - "Clear All Filters" button
  - Click chip to edit filter value

- [ ] Implement filter logic:
  - Convert filter selections to SQL WHERE clauses
  - Handle multiple filters with AND logic
  - Support OR logic within filter groups (e.g., Status = Open OR Pending)
  - Handle JSONB custom field filters

**Success Criteria:**
- ✅ Filter panel opens/closes smoothly
- ✅ Filters update query results in real-time
- ✅ Active filters shown as removable chips
- ✅ Filters persist in URL (shareable filtered results)
- ✅ Mobile-responsive filter UI

**Files to Create/Modify:**
- `frontend/src/lib/components/FilterPanel.svelte`
- `frontend/src/lib/components/FilterChip.svelte`
- `frontend/src/lib/stores/filterStore.ts`
- `frontend/src/lib/utils/sqlBuilder.ts` - Build WHERE clauses from filters
- `frontend/src/routes/chat/+page.svelte` - Add filter panel

---

#### 3.5 Query Suggestions & History (Week 6, Day 5)
**Time Estimate**: 1-2 days

**Tasks:**
- [ ] Create `query_suggestions` table:
  ```sql
  CREATE TABLE query_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100), -- 'Cases', 'Deadlines', 'Billing', 'Documents'
    query TEXT NOT NULL,
    description VARCHAR(255),
    icon VARCHAR(50), -- Icon name for UI
    sort_order INTEGER,
    is_active BOOLEAN DEFAULT true
  );

  INSERT INTO query_suggestions (category, query, description, icon, sort_order) VALUES
  ('Cases', 'Show me all open personal injury cases', 'View active PI cases', 'folder', 1),
  ('Cases', 'Which cases are in the discovery phase?', 'Cases in discovery', 'search', 2),
  ('Cases', 'Show me high priority cases', 'Urgent cases needing attention', 'alert-circle', 3),
  ('Deadlines', 'What court dates do I have this month?', 'Upcoming court calendar', 'calendar', 4),
  ('Deadlines', 'Show me deadlines in the next 7 days', 'Upcoming filing deadlines', 'clock', 5),
  ('Billing', 'Which cases have over 80 billable hours?', 'High-hour cases', 'dollar-sign', 6),
  ('Billing', 'Show me unpaid invoices', 'Outstanding invoices', 'file-text', 7),
  ('Documents', 'Find all pleadings filed this year', 'Recent court filings', 'file', 8),
  ('Documents', 'Show me documents for case CV-2025-00123', 'Case-specific documents', 'folder', 9);
  ```

- [ ] Create `QuerySuggestions.svelte` component:
  - Grid of suggestion cards (2-3 columns)
  - Category tabs or sections
  - Click suggestion to populate query input
  - Show icon and description
  - Animate on hover

- [ ] Show suggestions on empty chat (landing state):
  - Display 6-8 featured suggestions
  - "Search", "Report", "Analyze" categories (matching Figma)
  - Each card shows:
    - Icon
    - Category label
    - Sample query
    - Description
  - Click card to auto-fill and execute query

- [ ] Add recent queries display:
  - Show last 5 queries from current session
  - Click to re-run query
  - Show timestamp and result count
  - "Clear History" button

**Success Criteria:**
- ✅ Suggestions display on empty chat
- ✅ Click suggestion auto-fills and executes query
- ✅ Recent queries show in sidebar
- ✅ Can re-run previous queries

**Files to Create/Modify:**
- `database/schema.sql` - Add query_suggestions table
- `frontend/src/lib/components/QuerySuggestions.svelte`
- `frontend/src/lib/components/RecentQueries.svelte`
- `frontend/src/routes/chat/+page.svelte` - Show suggestions when empty

---

### Phase 4: Routine Automation (Weeks 7-8)
**Duration**: 2 weeks
**Status**: ⏳ **Not Started**
**Priority**: 🟡 **MEDIUM**

#### Objectives
- Make routine creation functional (save to database)
- Implement scheduled routine execution
- Add email notifications
- Display execution history

---

#### 4.1 Routine Database Integration (Week 7, Days 1-2)
**Time Estimate**: 2-3 days

**Tasks:**
- [ ] Create `routines` table (if not exists):
  ```sql
  CREATE TABLE routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- For future auth
    name VARCHAR(255) NOT NULL,
    description TEXT,
    schedule_type VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'custom'
    schedule_config JSONB, -- { day: 'Monday', time: '08:00', timezone: 'America/Los_Angeles' }
    query_text TEXT NOT NULL, -- Original natural language query
    sql_query TEXT NOT NULL, -- Generated SQL
    is_active BOOLEAN DEFAULT true,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE routine_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    routine_id UUID REFERENCES routines(id) ON DELETE CASCADE,
    status VARCHAR(50), -- 'success', 'failed', 'running'
    result_data JSONB,
    result_count INTEGER,
    error_message TEXT,
    execution_duration_ms INTEGER,
    executed_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX idx_routines_next_run ON routines(next_run_at) WHERE is_active = true;
  CREATE INDEX idx_routine_executions_routine ON routine_executions(routine_id);
  ```

- [ ] Implement routine save functionality:
  - [ ] Connect "Save Routine" button to API
  - [ ] Create `POST /api/routines` endpoint
  - [ ] Validate routine data (name, schedule, query)
  - [ ] Calculate `next_run_at` based on schedule
  - [ ] Show success toast on save
  - [ ] Navigate to routine detail or library

- [ ] Load user's routines in Routines Library:
  - [ ] Fetch routines from database
  - [ ] Display in grid layout (matches existing UI)
  - [ ] Show last run date and result count
  - [ ] Add "Active/Inactive" toggle
  - [ ] Add "Edit" and "Delete" actions

- [ ] Implement routine CRUD operations:
  - [ ] `GET /api/routines` - List user's routines
  - [ ] `GET /api/routines/:id` - Get routine details
  - [ ] `PUT /api/routines/:id` - Update routine
  - [ ] `DELETE /api/routines/:id` - Delete routine (with confirmation)
  - [ ] `POST /api/routines/:id/toggle` - Activate/deactivate routine

**Success Criteria:**
- ✅ Can save routine from creation form
- ✅ Routines Library shows saved routines from database
- ✅ Can edit, delete, and toggle routines
- ✅ Routine metadata (last run, next run) displayed

**Files to Create/Modify:**
- `database/schema.sql` - Add routines tables
- `frontend/src/routes/api/routines/+server.ts`
- `frontend/src/routes/api/routines/[id]/+server.ts`
- `frontend/src/lib/components/RoutinesLibrary.svelte` - Connect to API
- `frontend/src/lib/components/RoutineCreationCard.svelte` - Add save handler

---

#### 4.2 Scheduled Execution with Vercel Cron (Week 7, Days 3-5)
**Time Estimate**: 3-4 days

**Tasks:**
- [ ] Create Vercel Cron endpoint:
  ```typescript
  // frontend/src/routes/api/cron/run-routines/+server.ts
  import type { RequestHandler } from './$types';
  import { json } from '@sveltejs/kit';
  import { CRON_SECRET } from '$env/static/private';

  export const GET: RequestHandler = async ({ request }) => {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all active routines due to run
    const { data: routines, error } = await supabase
      .from('routines')
      .select('*')
      .eq('is_active', true)
      .lte('next_run_at', new Date().toISOString());

    if (error) {
      return json({ error: error.message }, { status: 500 });
    }

    const results = [];
    for (const routine of routines) {
      try {
        // Execute routine's SQL query
        const { data, error: execError } = await supabase.rpc(
          'execute_readonly_sql',
          { query_text: routine.sql_query }
        );

        if (execError) throw execError;

        // Save execution result
        await supabase.from('routine_executions').insert({
          routine_id: routine.id,
          status: 'success',
          result_data: data,
          result_count: data?.length || 0
        });

        // Calculate next run time
        const nextRun = calculateNextRun(routine.schedule_config);

        // Update routine
        await supabase
          .from('routines')
          .update({
            last_run_at: new Date().toISOString(),
            next_run_at: nextRun
          })
          .eq('id', routine.id);

        // Send notification (if configured)
        if (routine.notify_on_complete) {
          await sendNotification(routine, data);
        }

        results.push({ routine: routine.name, status: 'success', count: data?.length });
      } catch (err) {
        // Log failure
        await supabase.from('routine_executions').insert({
          routine_id: routine.id,
          status: 'failed',
          error_message: err.message
        });

        results.push({ routine: routine.name, status: 'failed', error: err.message });
      }
    }

    return json({
      success: true,
      routines_executed: results.length,
      results
    });
  };
  ```

- [ ] Configure Vercel Cron job:
  ```json
  // vercel.json
  {
    "crons": [{
      "path": "/api/cron/run-routines",
      "schedule": "0 * * * *"  // Every hour
    }]
  }
  ```

- [ ] Implement schedule calculation logic:
  ```typescript
  // frontend/src/lib/utils/scheduleCalculator.ts
  export function calculateNextRun(scheduleConfig: any): string {
    const { schedule_type, day, time, timezone } = scheduleConfig;
    const now = new Date();

    switch (schedule_type) {
      case 'daily':
        // Next occurrence of specified time
        const [hours, minutes] = time.split(':');
        const nextRun = new Date();
        nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        if (nextRun < now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        return nextRun.toISOString();

      case 'weekly':
        // Next occurrence of specified day and time
        // Implementation here...
        break;

      case 'monthly':
        // Next occurrence of specified day of month
        // Implementation here...
        break;

      default:
        // Default to 24 hours from now
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    }
  }
  ```

- [ ] Add manual "Run Now" button:
  - [ ] Create `POST /api/routines/:id/run` endpoint
  - [ ] Execute routine immediately
  - [ ] Save execution result
  - [ ] Return results to UI
  - [ ] Show execution progress spinner

- [ ] Display execution history in routine detail view:
  - [ ] Show last 10 executions
  - [ ] Status indicator (success/failed)
  - [ ] Execution timestamp
  - [ ] Result count
  - [ ] Error message (if failed)
  - [ ] Link to view full results

**Success Criteria:**
- ✅ Routines execute automatically on schedule
- ✅ Can manually trigger routine execution
- ✅ Execution results saved to database
- ✅ Next run time calculated correctly
- ✅ Failed executions logged with error messages

**Files to Create:**
- `vercel.json` - Configure cron
- `frontend/src/routes/api/cron/run-routines/+server.ts`
- `frontend/src/routes/api/routines/[id]/run/+server.ts`
- `frontend/src/lib/utils/scheduleCalculator.ts`
- `frontend/src/lib/components/RoutineExecutionHistory.svelte`

---

#### 4.3 Email Notifications with Resend (Week 8, Days 1-2)
**Time Estimate**: 2-3 days

**Tasks:**
- [ ] Sign up for Resend (free tier: 3,000 emails/month)
- [ ] Install Resend SDK:
  ```bash
  npm install resend
  ```

- [ ] Create email templates:
  ```typescript
  // frontend/src/lib/email/templates.ts
  export function routineCompleteEmail(routine: any, results: any[]) {
    return {
      subject: `Routine "${routine.name}" Complete - ${results.length} Results`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .header { background: #000; color: #fff; padding: 20px; }
            .content { padding: 20px; }
            .results { background: #f5f5f5; padding: 15px; border-radius: 8px; }
            .button {
              background: #000;
              color: #fff;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              display: inline-block;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LOIS Routine Report</h1>
          </div>
          <div class="content">
            <h2>${routine.name}</h2>
            <p>Your scheduled routine has completed successfully.</p>

            <div class="results">
              <h3>Results Summary</h3>
              <p><strong>${results.length}</strong> results found</p>
              <p><strong>Query:</strong> ${routine.query_text}</p>
              <p><strong>Executed:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <a href="${process.env.PUBLIC_APP_URL}/routines/${routine.id}" class="button">
              View Full Results
            </a>

            <p style="margin-top: 30px; color: #666; font-size: 14px;">
              You're receiving this because you have an active routine scheduled in LOIS.
              <a href="${process.env.PUBLIC_APP_URL}/routines/${routine.id}/settings">
                Manage notification settings
              </a>
            </p>
          </div>
        </body>
        </html>
      `
    };
  }

  export function routineFailedEmail(routine: any, error: string) {
    return {
      subject: `Routine "${routine.name}" Failed`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .header { background: #dc2626; color: #fff; padding: 20px; }
            .content { padding: 20px; }
            .error { background: #fee; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>⚠️ LOIS Routine Failed</h1>
          </div>
          <div class="content">
            <h2>${routine.name}</h2>
            <p>Your scheduled routine encountered an error during execution.</p>

            <div class="error">
              <h3>Error Details</h3>
              <p>${error}</p>
            </div>

            <a href="${process.env.PUBLIC_APP_URL}/routines/${routine.id}" class="button">
              View Routine
            </a>
          </div>
        </body>
        </html>
      `
    };
  }
  ```

- [ ] Implement send email function:
  ```typescript
  // frontend/src/lib/email/send.ts
  import { Resend } from 'resend';
  import { RESEND_API_KEY } from '$env/static/private';

  const resend = new Resend(RESEND_API_KEY);

  export async function sendEmail(to: string, subject: string, html: string) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'LOIS <notifications@yourdomain.com>',
        to: [to],
        subject,
        html
      });

      if (error) {
        console.error('Failed to send email:', error);
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Email error:', err);
      throw err;
    }
  }
  ```

- [ ] Add notification settings to routines:
  - [ ] Add `notify_on_complete` and `notification_email` fields to routines table
  - [ ] Add notification settings section in routine creation form
  - [ ] Checkbox: "Send email when routine completes"
  - [ ] Email input field (with validation)
  - [ ] Option to notify on failure only or all runs

- [ ] Integrate email sending in cron job:
  - Send success email after successful execution
  - Send failure email after failed execution
  - Track email delivery status

**Success Criteria:**
- ✅ Email sent on routine completion
- ✅ Email sent on routine failure
- ✅ Email contains results summary and error details
- ✅ Can configure notification settings per routine
- ✅ Emails look professional and branded

**Files to Create:**
- `frontend/src/lib/email/templates.ts`
- `frontend/src/lib/email/send.ts`
- `database/schema.sql` - Add notification fields to routines table
- Update `frontend/src/routes/api/cron/run-routines/+server.ts` - Add email calls

---

### Phase 5: Polish & User Experience (Weeks 9-10)
**Duration**: 2 weeks
**Status**: ⏳ **Not Started**
**Priority**: 🟢 **LOW-MEDIUM**

#### Objectives
- Improve error handling and loading states
- Performance optimization
- Mobile responsiveness
- Analytics and monitoring

---

#### 5.1 Error Handling & UX Polish (Week 9, Days 1-3)
**Time Estimate**: 3-4 days

**Tasks:**
- [ ] Implement global error boundary
- [ ] Create toast notification system
- [ ] Improve loading states with skeletons
- [ ] Add retry logic for failed queries
- [ ] Better empty states with illustrations
- [ ] Add keyboard shortcuts (Cmd+K for search, etc.)
- [ ] Improve mobile responsiveness
- [ ] Add dark mode support (optional)

---

#### 5.2 Performance Optimization (Week 9, Days 4-5)
**Time Estimate**: 2-3 days

**Tasks:**
- [ ] Add database indexes for common query patterns
- [ ] Implement result pagination (currently LIMIT 100)
- [ ] Add virtual scrolling for large result sets
- [ ] Implement query result caching (Vercel KV/Redis)
- [ ] Optimize bundle size with code splitting
- [ ] Run Lighthouse audit and fix issues (target: >90)
- [ ] Optimize images and assets

---

#### 5.3 Testing & Quality Assurance (Week 10)
**Time Estimate**: 5 days

**Tasks:**
- [ ] Set up Vitest for unit tests
- [ ] Write tests for API endpoints
- [ ] Set up Playwright for E2E tests
- [ ] Write E2E tests for critical flows:
  - Query submission and results display
  - Routine creation and execution
  - Filter application
  - Export functionality
- [ ] Add GitHub Actions CI/CD
- [ ] Run tests on every PR

---

### Phase 6: Authentication & Multi-User (Weeks 11-12) [OPTIONAL]
**Duration**: 2 weeks
**Status**: ⏳ **Not Started**
**Priority**: 🔵 **OPTIONAL**

#### Objectives (if multi-user support needed)
- User authentication with Supabase Auth
- User profiles and settings
- Row-level security (RLS) in database
- Team/organization support

**Note**: Skip this phase if LOIS is single-user or internal tool.

---

## 📊 Success Metrics

### Development Metrics
- [x] Deployed to production (Vercel)
- [x] Database connected with 6,000+ records
- [x] AI query generation working
- [ ] Response time < 1 second (p95)
- [ ] Zero critical bugs in production
- [ ] Test coverage > 70%

### User Experience Metrics
- [ ] Query understanding accuracy > 85%
- [ ] User can complete search in < 30 seconds
- [ ] Mobile responsive (all features work on phone)
- [ ] Accessibility: WCAG 2.1 AA compliant

### Business Value Metrics
- [ ] 10+ entity types searchable
- [ ] Export functionality used
- [ ] Routines running automatically
- [ ] User satisfaction > 4/5 (when we have users)

---

## 🗓️ Timeline Summary

| Phase | Duration | Start Date | End Date | Status | Completion |
|-------|----------|------------|----------|--------|------------|
| **Phase 0**: Planning & Setup | 1 week | Oct 23 | Oct 30 | ✅ Complete | 100% |
| **Phase 1**: Foundation | 2 weeks | Oct 23 | Nov 6 | ✅ Complete | 95% |
| **Phase 2**: AI Search Core | 2 weeks | Nov 6 | Nov 20 | 🟡 In Progress | 80% |
| **Phase 3**: Search Experience | 2 weeks | Nov 20 | Dec 4 | ⏳ Not Started | 0% |
| **Phase 4**: Routine Automation | 2 weeks | Dec 4 | Dec 18 | ⏳ Not Started | 0% |
| **Phase 5**: Polish & Testing | 2 weeks | Dec 18 | Jan 1 | ⏳ Not Started | 0% |
| **Phase 6**: Authentication | 2 weeks | Jan 1 | Jan 15 | ⏳ Optional | 0% |

**Total Timeline**: 10-12 weeks
**Current Progress**: ~50-60% complete
**Estimated Completion**: Mid-December 2025 (excluding auth)

---

## 🎯 Immediate Next Steps (This Week)

### Priority 1: Complete Phase 3.1 - Multi-Entity Result Cards
**Time: 3-4 days**

1. Create `ProjectCard.svelte` component
2. Create `ContactCard.svelte` component
3. Create `DocumentCard.svelte` component
4. Create `ResultsRenderer.svelte` to detect and render correct card
5. Test with various query types

### Priority 2: Implement Conversation Persistence
**Time: 2-3 days**

1. Add `conversations` and `conversation_messages` tables
2. Save queries on submission
3. Load conversation history on page load
4. Add conversation history sidebar

### Priority 3: Add Export to CSV
**Time: 1-2 days**

1. Create export utility function
2. Add "Export" button to results view
3. Test CSV export with various data types

---

## 🚧 Known Issues & Technical Debt

### Current Issues
1. **Query context lost on page refresh** - Need conversation persistence
2. **Basic table view only** - Need entity-specific cards
3. **No filtering UI** - Can generate filtered SQL but no controls
4. **Routines don't save** - UI complete but not functional
5. **No export** - Critical feature missing

### Technical Debt
1. Error handling could be more robust
2. Loading states could be improved
3. No pagination (currently LIMIT 100)
4. No caching layer
5. Bundle size not optimized

---

## 📚 Documentation Status

### Complete Documentation
- [x] AI Instructions (ai_instructions.md)
- [x] Original Project Plan (PROJECT_PLAN.md)
- [x] Design Specifications (DESIGN_SPECIFICATIONS.md)
- [x] Deployment Roadmap (DEPLOYMENT_ROADMAP.md)
- [x] Data Store Plan (DATA_STORE_PLAN.md)
- [x] README.md
- [x] Implementation Documentation (IMPLEMENTATION.md)

### Documentation Needed
- [ ] Update README with Phase 2 completion
- [ ] Update PROGRESS_UPDATE with current status (50-60% complete)
- [ ] Create API documentation for query endpoints
- [ ] Create user guide / help documentation
- [ ] Create routine creation guide

---

## 🔧 Technology Stack

### Frontend
- **Framework**: SvelteKit 2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Build Tool**: Vite 5.4
- **Deployment**: Vercel

### Backend
- **Database**: Supabase (PostgreSQL 15)
- **Authentication**: Supabase Auth (future)
- **AI/LLM**: Anthropic Claude 3.5 Sonnet
- **Background Jobs**: Vercel Cron (Phase 4)
- **Email**: Resend (Phase 4)

### Development
- **Version Control**: Git + GitHub
- **Package Manager**: npm
- **Testing**: Vitest + Playwright (future)
- **CI/CD**: GitHub Actions (future)

---

## 💰 Budget & Costs

### Current Monthly Costs
- Vercel: **$0** (Hobby tier)
- Supabase: **$0** (Free tier)
- Anthropic API: **~$5-10/month** (estimated usage)
- **Total: ~$5-10/month**

### Future Costs (Phase 4+)
- Vercel Pro: **$20/month** (for cron jobs)
- Supabase: **$0-25/month** (free tier likely sufficient)
- Anthropic API: **$10-30/month** (increased usage)
- Resend: **$0** (free tier: 3,000 emails/month)
- **Total: ~$30-75/month**

---

## 🎉 Major Wins

1. ✅ **AI-Powered Query Generation**: Claude converts natural language to SQL
2. ✅ **Conversation Context**: Handles follow-up questions intelligently
3. ✅ **6,000-8,000 Realistic Records**: Comprehensive legal case data
4. ✅ **Deployed to Production**: Live on Vercel with Supabase
5. ✅ **Query Classification**: Automatically routes different query types
6. ✅ **Document Search**: Full-text search with context awareness
7. ✅ **Safety**: SQL injection prevention, read-only queries

---

## 📞 Questions & Decisions Needed

### Open Questions
1. **User Authentication**: Single-user or multi-user? (Affects Phase 6 priority)
2. **Export Formats**: CSV only or also PDF? (Affects Phase 3.3 scope)
3. **Notification Method**: Email only or also in-app? (Affects Phase 4.3)
4. **Mobile Priority**: Full mobile support or desktop-first? (Affects Phase 5.1)
5. **Analytics**: Do we need usage analytics? (Affects Phase 5)

### Technical Decisions
1. **Pagination**: Infinite scroll vs numbered pages?
2. **Caching**: Vercel KV vs simple in-memory?
3. **Background Jobs**: Stick with Vercel Cron or upgrade to Inngest?
4. **Testing**: Unit tests only or full E2E coverage?

---

## 🔗 Related Documents

- [ai_instructions.md](./ai_instructions.md) - Original concept and architecture
- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - Original 10-week plan
- [DESIGN_SPECIFICATIONS.md](./DESIGN_SPECIFICATIONS.md) - Figma design specs
- [DEPLOYMENT_ROADMAP.md](./DEPLOYMENT_ROADMAP.md) - Phase-by-phase deployment plan
- [DATA_STORE_PLAN.md](./DATA_STORE_PLAN.md) - Database architecture
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) - Technical implementation details
- [README.md](./README.md) - Project overview

---

**Last Updated**: October 24, 2025
**Next Review**: Weekly on Mondays
**Current Sprint**: Phase 3 - Complete Search Experience
**Next Milestone**: Multi-entity result cards (Week of Nov 20)
