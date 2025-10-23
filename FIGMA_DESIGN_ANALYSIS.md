# LOIS - Figma Design Analysis Summary

**Date**: 2025-10-23
**Figma File**: Cross-Project LOIS - Search, Reporting, Chat
**Analysis Completed**: ✅

---

## Key Findings

### 1. Dual Interface Paradigm

The design reveals **two distinct but integrated interfaces**:

#### A. LOIS Conversational Interface
- **Purpose**: AI-first, chat-based search and interaction
- **Layout**: Left sidebar (240px) + center chat area
- **Key Features**:
  - "Ask LOIS" as primary CTA
  - Saved routines and prompts
  - Natural language input with voice and upload options
  - Action cards for Search, Report, Analyze, Summarize
  - Recent chat history

#### B. FileVine-Style Activity Feed
- **Purpose**: Traditional case/project management interface
- **Layout**: Top nav + left sidebar + center content + filter panel
- **Key Features**:
  - Activity feed with tasks, notes, messages
  - Filter system (Unread, Messages, Tasks, etc.)
  - Status tracking (Overdue, Complete, Recent activity)
  - Project/case organization
  - Contact and document management

**Integration Point**: Both interfaces share the same data and can be accessed via "Ask LOIS" button, suggesting seamless transitions between conversational AI and structured data views.

---

## 2. Visual Design System

### Brand Identity
- **LOIS Branding**: Coral/pink logo text (#FF6B6B approximate)
- **Primary CTA**: Black buttons with white text
- **Overall Aesthetic**: Clean, modern, professional with subtle color accents

### Color Palette
- **Backgrounds**: Light gray (#F7F7F6), White (#FFFFFF)
- **Text**: Dark gray/black (#161616) for primary, graduated grays for secondary
- **Accents**: Blue (#2196F3) for active states, coral/pink for branding
- **Status Colors**: Green (success), Red (overdue), Yellow (urgent), Purple (follow-up)

### Typography
- **Headings**: Helvetica Now Display, Bold (21px for main headings)
- **Body**: System fonts (14px base, 400 weight)
- **Hierarchy**: Clear size and weight differentiation

### Spacing
- **System**: 8px grid (4px, 8px, 16px, 24px, 32px, 48px)
- **Consistent padding**: 16-20px in cards, 8-12px in inputs
- **Generous whitespace**: Prevents crowded feeling

---

## 3. Core UI Components

### Navigation
1. **Top Navigation Bar** (FileVine style)
   - 55px height, light gray background
   - Logo center, nav items left, utilities right
   - Global search bar in header

2. **LOIS Sidebar**
   - 240px width, white background
   - Logo at top, actions, recent routines, recent chats
   - Collapsible sections

3. **Left Sidebar** (FileVine style)
   - 200-220px width
   - User profile card
   - Filter menu
   - Navigation links (Billing, Calendar, Intake, etc.)

### Content Display

1. **Activity/Task Cards**
   - White background with subtle shadow
   - Blue left border (4-5px) for active items
   - Avatar + name + action + timestamp header
   - @mentions support
   - Tag system with colored pills
   - Metadata rows (assigned to, due date, etc.)
   - Status badges (Overdue, Complete, etc.)

2. **Search Results Drawer**
   - Right-side panel, 400-500px width
   - Split view: summary on left, data table on right
   - Natural language answer + structured data
   - Filterable columns
   - Action buttons per row

3. **Chat Interface**
   - Center-aligned, max 700-800px width
   - Large input area with voice and upload
   - Action cards with icons
   - "Ask LOIS" button prominently placed

### Interactive Elements

1. **Buttons**
   - Primary: Black background, white text, 6-8px radius
   - Secondary: White with gray border
   - Icon buttons: 32-36px, circular or rounded square

2. **Form Inputs**
   - 6-8px border radius for text inputs
   - 20-24px radius for search (pill shape)
   - Blue focus state with subtle shadow
   - 14px font size

3. **Tags & Badges**
   - Pill shape (12px radius)
   - Colored backgrounds with matching text
   - 11-12px font size
   - Semantic colors (#Permitted, #Licenses, #URGENT, etc.)

4. **Filters & Sorts**
   - Checkbox list with counts
   - Dropdown selectors
   - Quick "All/None" actions
   - Collapsible sections

---

## 4. Key User Flows (Observed in Designs)

### Flow 1: LOIS Landing → Search
1. User arrives at LOIS landing page
2. Sees welcome message and action cards (Search, Report, Analyze)
3. Types natural language query in large input field
4. Clicks "Ask LOIS" button
5. Results appear in drawer with summary + data table

### Flow 2: Activity Feed → Task Management
1. User views feed of activities (tasks, notes, messages)
2. Filters by type (Messages, Tasks, etc.)
3. Clicks on task card to view details
4. Sees metadata, tags, assigned person, due date
5. Can complete task or take actions

### Flow 3: Global Search → Dropdown Results
1. User types in header search bar
2. Dropdown appears with sections (Contacts, Projects)
3. Shows avatars, names, details, tags
4. Can select result or "Ask LOIS" for natural language search

### Flow 4: Saved Routines
1. User accesses "Recent Routines" in LOIS sidebar
2. Sees routine cards with descriptions
3. Clicks routine to execute saved prompt/workflow
4. Results appear in chat interface

---

## 5. Data Types & Entity Representations

Based on the designs, LOIS handles these entity types:

### 1. People/Contacts
- **Display**: Avatar + name + role/title + contact info
- **Context**: Case assignments, team members, clients
- **Example**: "Rachel Hegmann", "Brad Thurman", "Sarah Salazar"

### 2. Projects/Cases
- **Display**: Project name + type (e.g., "Personal Injury") + phase (e.g., "Discovery")
- **Context**: Legal cases with statuses and stages
- **Example**: "Personal Injury Cases in Discovery Phase"

### 3. Tasks
- **Display**: Card with creator, title, assignee, due date, status
- **Metadata**: Triggered by actions, completion tracking
- **Example**: "Depo Scheduling", "Call Michelle"

### 4. Notes
- **Display**: Similar to tasks but marked as notes
- **Content**: Text with @mentions and #tags
- **Example**: "Medical Records Needed"

### 5. Tags
- **Categories**: #Permitted, #Licenses, #PersonalInjury, #URGENT, #Followupneeded
- **Purpose**: Categorization and filtering

### 6. Activities/Feed Items
- **Types**: Tasks created, notes created, messages, calls, faxes, texts
- **Timeline**: "now", "7/21/25 • 12:23 PM", relative times
- **Status**: Pinned, Trending Tags, Earlier sections

---

## 6. Conversational AI Features

### "Ask LOIS" Functionality
- **Appears**: Throughout interface as black button
- **Input Options**:
  - Text input
  - Voice input (microphone icon)
  - File upload (paperclip icon)
  - Saved prompts selector
  - "Look at..." context dropdown

### Prompts & Routines
- **Saved Prompts**: Starred prompts for quick access
- **Routines**: Multi-step workflows saved for reuse
  - Example: "Meds > $100k" - finds cases where medical expenses exceed $100k
  - Example: "Depos Next Month" - lists upcoming depositions
  - Example: "Inactive Clients" - alerts for clients with no communication

### AI Capabilities (Shown in Designs)
1. **Search**: "Find all open personal injury cases in discovery phase"
2. **Report**: "Give me a weekly report of all open litigation cases"
3. **Analyze**: "Which attorneys have the highest settlement averages?"
4. **Summarize**: Button to summarize feed activities or search results

---

## 7. Design Patterns & Best Practices

### Pattern 1: Contextual Actions
- Every entity has contextual action buttons (⚙️ settings icon)
- Quick actions based on entity type (Complete Task, Assign, etc.)
- Star/pin for prioritization

### Pattern 2: Visual Hierarchy
- **Primary info**: Bold, larger text, prominent placement
- **Secondary info**: Smaller, gray text below primary
- **Metadata**: Even smaller, structured rows with icons
- **Actions**: Right-aligned, icon buttons or badges

### Pattern 3: Progressive Disclosure
- Collapsible sections (Recent Routines, Recent Chats)
- "Earlier" section with item count (e.g., "22 items")
- Filters can be collapsed when not in use
- Cards expand to show full details

### Pattern 4: Feedback & Status
- Loading states: "Thinking..." with animation
- Status badges: Clear visual indicators (red for overdue, green for complete)
- Counts: Blue pills with numbers (unread, filtered items)
- Completion tracking: Green checkmark with completion date

### Pattern 5: Consistency Across Contexts
- Avatar + name + detail pattern used everywhere
- Tag styling consistent across all entities
- Button styles consistent (primary black, secondary outlined)
- Spacing and padding follow 8px grid

---

## 8. Technical Implementation Notes

### Responsive Considerations
- Desktop-first design (1440px canvas)
- Sidebar collapses to hamburger on mobile
- Cards stack vertically on smaller screens
- Search bar goes full-width on mobile

### Accessibility Features
- Clear focus states (blue outline)
- High contrast text on backgrounds
- Icon buttons have text labels or tooltips
- Keyboard navigable interface

### Performance Considerations
- Virtualized lists for long feeds (22+ items)
- Lazy loading for images (avatars)
- Skeleton loading states
- Pagination or infinite scroll for results

### State Management Needs
- Conversation context preservation
- Filter states
- Sidebar collapse/expand states
- Active route/view state
- Search query and results caching

---

## 9. Integration Points

### FileVine Integration
The design shows heavy FileVine influence, suggesting LOIS is:
- An **enhancement** to existing FileVine workflows
- Provides **AI layer** on top of case management data
- Maintains FileVine's **familiar UI patterns** while adding conversational search

### Data Sources (Inferred)
Based on the feed and search examples:
- **Case management** database (projects, clients, cases)
- **Document** storage
- **Communication** logs (calls, emails, texts, faxes)
- **Task/workflow** system
- **Calendar** system
- **Medical records** or field data specific to legal cases

### AI/NLP Requirements
- **Entity recognition**: Identify projects, people, dates, locations from queries
- **Intent classification**: Search, report, analyze, summarize
- **Context awareness**: Reference resolution ("that project", "those cases")
- **Natural language generation**: Summarize results in conversational format

---

## 10. Recommendations for Implementation

### Priority 1: Core Search & Feed
1. Build activity feed with cards (most visible feature)
2. Implement filtering system (high user interaction)
3. Create search results display (drawer/modal)
4. Design system tokens (colors, spacing, typography)

### Priority 2: Conversational Interface
1. LOIS sidebar navigation
2. Chat interface with input
3. "Ask LOIS" button integration
4. Saved prompts and routines

### Priority 3: Advanced Features
1. Voice input
2. File upload
3. Summarize feature
4. Advanced filtering and sorts
5. Analytics/reporting views

### Component Library First
Create reusable components matching Figma designs:
- Button (primary, secondary, icon variants)
- Card (base, activity, task, note variants)
- Input (text, search, textarea)
- Tag/Badge (status, category)
- Avatar (sizes, fallbacks)
- Dropdown (filters, selects)
- Modal/Drawer (search results, details)

### Design Tokens Setup
```javascript
// Recommended Tailwind config extension
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: { coral: '#FF6B6B' },
        background: { primary: '#FFFFFF', secondary: '#F7F7F6' },
        text: { primary: '#161616', secondary: '#6B6B6B' },
        // ... more from DESIGN_SPECIFICATIONS.md
      },
      fontFamily: {
        display: ['"Helvetica Now Display"', 'system-ui', 'sans-serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        // Use 8px grid: 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12...
      },
    },
  },
};
```

---

## 11. Outstanding Questions

To be clarified with stakeholders:

1. **Is LOIS a standalone app or FileVine plugin?**
   - Design suggests integration, but deployment model unclear

2. **What is the expected query complexity?**
   - Simple keyword search vs complex multi-filter queries?

3. **How are "Routines" created?**
   - User-defined workflows? Pre-built templates?

4. **Voice input scope?**
   - Speech-to-text only or voice commands?

5. **Offline capabilities?**
   - Does the app need to work without internet?

6. **User roles and permissions?**
   - Admin vs user views? Data access controls?

7. **Real-time updates?**
   - Should feed update live (WebSockets)?

8. **Export formats?**
   - What file formats for reports (PDF, Excel, CSV)?

9. **Integration points?**
   - APIs to other legal tech tools?

10. **Mobile app plans?**
    - Native mobile or responsive web only?

---

## 12. Next Steps

### Immediate Actions
1. ✅ Design specifications documented
2. ✅ Color palette extracted
3. ✅ Component patterns identified
4. ✅ User flows mapped

### Phase 0 Completion Items
- [ ] Create Tailwind config with design tokens
- [ ] Set up component library structure
- [ ] Build first component (Button) matching Figma
- [ ] Verify design fidelity with stakeholders

### Phase 1 Development
- [ ] Implement design system (colors, typography, spacing)
- [ ] Build core component library
- [ ] Create layout components (nav, sidebar, main)
- [ ] Set up routing and navigation
- [ ] Generate synthetic data matching FileVine context

---

## Screenshots Reference

Captured screens from Figma:

1. **Start Screen** - FileVine-style feed with activity cards
2. **LOIS Landing V1** - Conversational interface with "Search or Talk to LO\S"
3. **LOIS Landing V2** - Welcome screen with action cards
4. **Result Returned** - Search results drawer with data table
5. **Project Search Dropdown** - Autocomplete search results

All screenshots saved to `/tmp/` for reference during development.

---

## Resources

- **Full Design Specs**: See `DESIGN_SPECIFICATIONS.md`
- **Project Plan**: See `PROJECT_PLAN.md`
- **AI Instructions**: See `ai_instructions.md` (updated with design references)
- **Figma File**: https://www.figma.com/design/LXG7oJAKElYVQh71uGldmN/Cross-Project-LOIS---Search--Reporting--Chat

---

**Analysis Completed By**: Claude Code
**Review Status**: Ready for stakeholder review
**Implementation Ready**: Yes - proceed to Phase 0 setup
