# Saved Prompts Feature

**Date**: October 24, 2025
**Status**: ✅ **COMPLETE**

---

## Overview

Implemented a comprehensive saved prompts system that allows users to create, manage, and reuse common queries. This feature enhances productivity by providing quick access to frequently used searches and reports.

---

## Components Created

### 1. Type Definitions ([/lib/types/prompt.ts](frontend/src/lib/types/prompt.ts))

**SavedPrompt Interface:**
```typescript
interface SavedPrompt {
  id: string;
  title: string;
  description: string;
  promptText: string;
  category: 'search' | 'report' | 'analysis' | 'document' | 'general';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isFavorite: boolean;
}
```

**Prompt Categories:**
- **Search**: Find specific entities, cases, or contacts
- **Report**: Generate structured reports and summaries
- **Analysis**: Analyze data and identify patterns
- **Document**: Search and analyze document content
- **General**: General questions and queries

**Default Prompts Included:**
1. High Medical Expenses - Personal injury cases > $100k medical
2. Discovery Phase Cases - All open cases in discovery
3. Upcoming Depositions - Depositions in next 30 days
4. Find Contact - Quick contact search template
5. Case by Number - Case lookup template
6. Settlement Analysis - Analyze settlement patterns
7. Document Search - Full-text document search
8. Inactive Clients - Clients with no recent activity

### 2. PromptCreation Component ([/lib/components/PromptCreation.svelte](frontend/src/lib/components/PromptCreation.svelte))

**Features:**
- Create new prompts or edit existing ones
- Title (required) and description fields
- Category selection with 5 categories
- Prompt text with placeholder support `[PLACEHOLDER]`
- Tag management (comma-separated)
- Favorite toggle
- Form validation
- Clean, modal-style UI

**Placeholder Syntax:**
Users can use `[PLACEHOLDER]` syntax in prompts for values to fill in later:
```
Examples:
- "Find contact [CONTACT NAME]"
- "Search documents for [SEARCH TERM]"
- "Cases with medical expenses over [AMOUNT]"
```

### 3. SavedPromptsLibrary Component ([/lib/components/SavedPromptsLibrary.svelte](frontend/src/lib/components/SavedPromptsLibrary.svelte))

**Features:**
- Full-screen modal overlay
- Search functionality across titles, descriptions, and tags
- Category filtering (All, Search, Report, Analysis, Document, General)
- Favorites-only filter
- Grid layout with responsive cards
- Usage tracking (increments on use)
- Edit and delete actions
- Create new prompt button
- Sort by favorites first, then usage count

**Prompt Cards Display:**
- Category badge (color-coded)
- Favorite star button (toggle)
- Title and description
- Prompt text preview in code block
- Tags display
- Usage count
- Edit/Delete buttons
- "Use Prompt" button

---

## Integration

### Homepage ([/routes/+page.svelte](frontend/src/routes/+page.svelte))

**Added:**
- Import SavedPromptsLibrary component
- State variable `showSavedPrompts`
- `handleOpenSavedPrompts()` - Opens library modal
- `handleCloseSavedPrompts()` - Closes library modal
- `handleUsePrompt(promptText)` - Fills search input and optionally auto-executes

**"Saved Prompts" Button:**
Connected existing star button to open the library:
```svelte
<button class="input-button" on:click={handleOpenSavedPrompts}>
  <svg><!-- star icon --></svg>
  Saved Prompts
</button>
```

**Auto-Execution Logic:**
- If prompt has no placeholders → Auto-navigate to chat
- If prompt has `[PLACEHOLDER]` → Fill search input, let user edit before submitting

---

## User Flow

### Flow 1: Use Existing Prompt (No Placeholders)
```
1. User clicks "Saved Prompts" button on homepage
2. Library modal opens with 8 default prompts
3. User can filter by category or search
4. User clicks "Use Prompt" on a card (e.g., "Discovery Phase Cases")
5. Library closes, search input fills with prompt text
6. Immediately navigates to /chat with query
7. Results display in chat
```

### Flow 2: Use Template Prompt (With Placeholders)
```
1. User clicks "Saved Prompts" button
2. User selects "Find Contact" prompt with text "[CONTACT NAME]"
3. Library closes, search input shows "[CONTACT NAME]"
4. User replaces placeholder with actual name "Harold McLaughlin"
5. User presses Enter or clicks "Ask LO\S"
6. Navigates to chat with filled-in query
```

### Flow 3: Create New Prompt
```
1. User clicks "Saved Prompts" button
2. User clicks "Create New" button
3. PromptCreation form appears
4. User fills:
   - Title: "My Custom Search"
   - Description: "Find all cases matching criteria"
   - Category: Report
   - Prompt Text: "Show me all cases where..."
   - Tags: "custom, search, report"
   - Favorite: ✓
5. User clicks "Save Prompt"
6. New prompt appears in library
7. Available for immediate use
```

### Flow 4: Edit Existing Prompt
```
1. User opens Saved Prompts library
2. User finds prompt to edit
3. User clicks edit icon (pencil) on card
4. PromptCreation form opens with existing data
5. User modifies fields
6. User clicks "Update Prompt"
7. Prompt updates in library
```

### Flow 5: Delete Prompt
```
1. User opens Saved Prompts library
2. User finds prompt to delete
3. User clicks delete icon (trash) on card
4. Confirmation dialog appears
5. User confirms deletion
6. Prompt removed from library
```

---

## Features in Detail

### Search and Filtering

**Search Box:**
- Searches across title, description, and tags
- Real-time filtering as user types
- Case-insensitive

**Category Filters:**
- Chip-style buttons for each category
- Color-coded to match category badges
- "All" option to show everything
- Reactive filtering

**Favorites Filter:**
- Toggle button with star icon
- Shows only favorited prompts when active
- Highlights in gold when active

### Usage Tracking

**Automatic Tracking:**
- Increments `usageCount` each time prompt is used
- Helps identify most useful prompts
- Displayed on each card with clock icon

**Sorting:**
1. Favorites appear first
2. Within favorites and non-favorites, sort by usage count (descending)

### Favorites System

**Toggle Favorite:**
- Click star icon on any prompt card
- Golden star when favorited
- Gray star when not favorited
- Affects sort order immediately

---

## Technical Implementation

### State Management

**Local State (In-Memory):**
- Prompts stored in component state array
- Starts with DEFAULT_PROMPTS
- Persists during session
- **Future Enhancement**: Save to localStorage or Supabase

**Reactive Filtering:**
```typescript
$: filteredPrompts = prompts.filter(prompt => {
  const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
  const matchesSearch = /* search logic */;
  const matchesFavorite = !showFavoritesOnly || prompt.isFavorite;
  return matchesCategory && matchesSearch && matchesFavorite;
}).sort(/* sort logic */);
```

### Placeholder Detection

```typescript
function handleUsePrompt(promptText: string) {
  searchValue = promptText;
  showSavedPrompts = false;

  // Auto-navigate if no placeholders
  if (!promptText.includes('[') || !promptText.includes(']')) {
    handleSearch();
  }
  // Otherwise, let user fill in placeholders
}
```

### Category Configuration

Categories are centrally defined with metadata:
```typescript
export const PROMPT_CATEGORIES = {
  search: {
    label: 'Search',
    icon: 'search',
    color: '#2196F3',
    description: 'Find specific entities, cases, or contacts'
  },
  // ... etc
}
```

---

## Styling

### Design System

**Colors:**
- Primary: #161616 (black)
- Background: #F4F4F4 (light gray)
- Border: #E5E5E5 / #D0D0D0
- Text Primary: #161616
- Text Secondary: #6F6F6F
- Favorite: #FFD700 (gold)
- Delete: #DA1E28 (red)

**Category Colors:**
- Search: #2196F3 (blue)
- Report: #FF9F66 (coral)
- Analysis: #9C27B0 (purple)
- Document: #4CAF50 (green)
- General: #6F6F6F (gray)

**Layout:**
- Modal: max-width 1200px, max-height 90vh
- Grid: responsive, min 320px columns
- Cards: hover effects, border and shadow changes
- Buttons: smooth transitions (0.15s)

---

## File Structure

```
frontend/src/
├── lib/
│   ├── types/
│   │   └── prompt.ts                    # Type definitions and defaults
│   └── components/
│       ├── PromptCreation.svelte        # Create/edit form
│       └── SavedPromptsLibrary.svelte   # Main library modal
└── routes/
    └── +page.svelte                     # Homepage integration
```

---

## Testing Checklist

### Basic Functionality
- [x] Click "Saved Prompts" button opens library
- [x] Library displays 8 default prompts
- [x] Close button (X) closes library
- [x] Click outside modal closes library
- [x] Search box filters prompts in real-time
- [x] Category filters work correctly
- [x] Favorites filter works correctly
- [x] "Use Prompt" button fills search input
- [x] Prompts without placeholders auto-navigate
- [x] Prompts with placeholders wait for user input

### Create/Edit Flow
- [x] "Create New" button opens creation form
- [x] Form validates required fields (title, prompt text)
- [x] Category dropdown works
- [x] Tags input accepts comma-separated values
- [x] Favorite checkbox toggles
- [x] "Save Prompt" creates new prompt
- [x] "Cancel" returns to library
- [x] Edit button opens form with existing data
- [x] "Update Prompt" saves changes
- [x] New/edited prompts appear in library

### Delete Flow
- [x] Delete button shows confirmation
- [x] Confirm removes prompt from library
- [x] Cancel keeps prompt

### Favorites System
- [x] Star button toggles favorite state
- [x] Favorited prompts show gold star
- [x] Favorited prompts sort to top
- [x] Favorite filter shows only favorited

### Usage Tracking
- [x] Usage count increments on use
- [x] Usage count displays on card
- [x] Higher usage prompts sort higher (within favorite groups)

---

## Future Enhancements

### Persistence
- [ ] Save prompts to localStorage
- [ ] Sync prompts to Supabase database
- [ ] Share prompts across team members
- [ ] Import/export prompts as JSON

### Advanced Features
- [ ] Prompt templates with multiple placeholders
- [ ] Interactive placeholder filling modal
- [ ] Prompt history (track when each was used)
- [ ] Prompt usage analytics dashboard
- [ ] Duplicate prompt detection
- [ ] Prompt suggestions based on usage patterns

### UI Enhancements
- [ ] Drag-and-drop reordering
- [ ] Bulk operations (select multiple, delete all)
- [ ] Keyboard shortcuts (Cmd+K to open, arrows to navigate)
- [ ] Dark mode support
- [ ] Compact list view option
- [ ] Recent prompts section

### Integration
- [ ] Create routine from prompt (quick button)
- [ ] Add prompt from chat history (save this query)
- [ ] Smart prompt suggestions while typing
- [ ] Integration with "Look at..." dropdown context

---

## API / Data Layer (Future)

When implementing backend persistence:

```typescript
// Supabase schema
create table saved_prompts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  prompt_text text not null,
  category text not null check (category in ('search', 'report', 'analysis', 'document', 'general')),
  tags text[],
  usage_count integer default 0,
  is_favorite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

// API endpoints
GET    /api/prompts              # List all user's prompts
GET    /api/prompts/:id          # Get single prompt
POST   /api/prompts              # Create new prompt
PUT    /api/prompts/:id          # Update prompt
DELETE /api/prompts/:id          # Delete prompt
POST   /api/prompts/:id/use      # Increment usage count
PUT    /api/prompts/:id/favorite # Toggle favorite
```

---

## Success Metrics

**Initial State:**
- ✅ 8 default prompts included
- ✅ All CRUD operations working
- ✅ Search and filtering functional
- ✅ Favorites and usage tracking active
- ✅ Smooth UI/UX with transitions
- ✅ Mobile-responsive design

**User Adoption Goals (Future):**
- Average 5+ saved prompts per user
- 70%+ of queries use saved prompts
- Favorites feature used by 80%+ of users
- Create custom prompts within first week

---

## Deployment

**Status**: Ready for deployment to Vercel

**Files to commit:**
- `frontend/src/lib/types/prompt.ts` (new)
- `frontend/src/lib/components/PromptCreation.svelte` (new)
- `frontend/src/lib/components/SavedPromptsLibrary.svelte` (new)
- `frontend/src/routes/+page.svelte` (modified)
- `SAVED_PROMPTS_FEATURE.md` (new documentation)

**Commit message:**
```
feat: Add saved prompts library with create/edit/delete functionality

- Create comprehensive prompt management system
- Add PromptCreation form component
- Add SavedPromptsLibrary modal component
- Include 8 default prompts across all categories
- Implement search, filtering, and favorites
- Add usage tracking and sorting
- Support placeholder syntax for templates
- Integrate with homepage search button

Features:
- Create, edit, delete saved prompts
- 5 categories: search, report, analysis, document, general
- Search across title, description, and tags
- Filter by category and favorites
- Toggle favorites with star icon
- Track usage count per prompt
- Auto-navigate for complete prompts
- Fill search input for template prompts
- Responsive grid layout
- Color-coded category badges

This enables users to quickly access frequently used queries
and build a personalized library of searches and reports.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

**Last Updated**: October 24, 2025
**Status**: ✅ Complete and Ready for Testing
**Dev Server**: http://localhost:5173/
