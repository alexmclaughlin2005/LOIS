# Search/Lookup UX Design Proposal

## Overview
Add search-style query handling alongside existing report/analysis functionality.

## User Intent Detection

### Search Patterns (Single Entity Lookup)
- Just a name: "Harold McLaughlin"
- Simple search: "Find Harold McLaughlin"
- Direct lookup: "Show me CR-2025-00097"
- Entity reference: "Smith v. Jones"

### Report Patterns (Multi-Entity Analysis)
- Filtering: "What cases are in discovery?"
- Aggregation: "Cases with medical expenses >$100k"
- Comparison: "Which attorneys have the most billable hours?"

## UI Patterns

### Pattern 1: Single Result (Direct Match)
**When**: Exact match on name, case number, or unique identifier

**Display**:
- Full expanded card inline (Contact/Project/Document Card)
- No table view needed
- Quick action buttons below card

**Example**:
```
User: "Harold McLaughlin"

Response:
┌────────────────────────────────────────────┐
│ 👤 Harold McLaughlin                       │
│ Expert Witness • Medical Consultant        │
│                                            │
│ 📧 harold.mclaughlin@experts.com           │
│ 📞 (555) 123-4567                          │
│ 📋 Bar #: CA-98765                         │
│                                            │
│ Organization: Medical Forensics Group      │
│ Specialty: Orthopedic Injuries             │
│                                            │
│ Quick Actions:                             │
│ [📧 Send Email] [📞 Call] [📂 View Cases]  │
└────────────────────────────────────────────┘

Found in 8 active cases (all Personal Injury)
```

### Pattern 2: Few Results (2-5 matches)
**When**: Partial name match, common surname, ambiguous search

**Display**:
- Compact cards inline (2-3 lines each)
- Quick action links on each card
- "Show all" if more exist

**Example**:
```
User: "Smith"

Response: Found 3 results for "Smith"

┌────────────────────────────────────────────┐
│ 👤 John Smith                              │
│ Attorney • Smith & Associates              │
│ → [View Profile] [View Cases]              │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 👤 Mary Smith                              │
│ Client • Personal Injury Case PI-2025-001  │
│ → [View Profile] [Open Case]               │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ ⚖️ Smith v. Jones Manufacturing            │
│ Personal Injury • Discovery Phase          │
│ → [Open Case] [View Documents]             │
└────────────────────────────────────────────┘
```

### Pattern 3: Many Results (6+ matches)
**When**: Generic search term, category search

**Display**:
- Summary count + preview (first 3)
- "View Full Results" button → opens side panel
- Side panel has full table/cards with filtering

**Example**:
```
User: "Personal Injury"

Response: Found 46 Personal Injury cases

Showing 3 most recent:
[Compact cards...]

[View All 46 Cases →]
```

## Quick Actions by Entity Type

### Contact/Person Actions
- **Primary**: 📧 Send Email, 📞 Call
- **Secondary**: View Cases, View Documents, Schedule Meeting
- **Tertiary**: Add Note, Edit Contact

### Case/Project Actions
- **Primary**: Open Case, View Documents
- **Secondary**: View Timeline, View Contacts, Add Time Entry
- **Tertiary**: Update Status, Generate Report

### Document Actions
- **Primary**: View Document, Download
- **Secondary**: View Case, Related Documents
- **Tertiary**: Share, Archive

## Implementation Approach

### 1. Query Classification Enhancement
Add "search" as a new query type alongside sql, document_search, general:

```typescript
type QueryType = 'sql' | 'document_search' | 'general' | 'search';
```

**Search indicators**:
- Single name (2-3 words, proper case)
- Case number format (CV-2025-00001)
- "Find [name]", "Show me [entity]"
- No aggregation keywords (count, sum, average)
- No filter keywords (where, greater than, exceeding)

### 2. Search Handler
```typescript
async function handleSearch(query: string): Promise<QueryResult> {
  // Detect entity type (contact, case, document)
  // Search across all tables
  // Return formatted results with actions
}
```

### 3. Result Rendering
- Single result: Use existing ResultsRenderer with showGrouping={false}
- Multiple results: New SearchResults component
- Actions: Add action buttons to card components

### 4. Quick Actions Implementation
```typescript
interface QuickAction {
  icon: string;
  label: string;
  action: 'email' | 'call' | 'navigate' | 'custom';
  value: string; // email address, phone number, URL, etc.
}
```

## Benefits

1. **Faster Lookups**: Direct access to entities without formulating queries
2. **Natural Interaction**: Type what you're looking for, like Google
3. **Contextual Actions**: One-click access to common tasks
4. **Reduces Clicks**: No need to open side panel for single results
5. **Better for Mobile**: Larger touch targets, cleaner interface

## Example User Flows

### Flow 1: Quick Contact Lookup
```
1. User types: "Harold McLaughlin"
2. System shows: Contact card with email/phone
3. User clicks: "📧 Send Email"
4. System opens: Default email client with pre-filled address
```

### Flow 2: Case Number Lookup
```
1. User types: "CR-2025-00097"
2. System shows: Full case card with details
3. User clicks: "View Documents"
4. System opens: Document list for that case
```

### Flow 3: Ambiguous Search
```
1. User types: "Smith"
2. System shows: 3 compact results (2 contacts, 1 case)
3. User clicks: "View Profile" on John Smith
4. System shows: Full contact card with cases
```

## Next Steps

1. Add search classification to queryClassifier
2. Implement handleSearch in queryRouter
3. Create SearchResults component
4. Add QuickActions to existing card components
5. Test with various search patterns
6. Deploy and gather user feedback
