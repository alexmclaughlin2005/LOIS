# LOIS Chat Application - Implementation Documentation

## Overview

LOIS is a legal operations intelligence system built with SvelteKit that provides a chat interface for querying case data and creating automated routines. The application features a modern chat interface with data visualization, routine creation capabilities, and a comprehensive routines library.

## Architecture

### Technology Stack

- **Frontend Framework**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS
- **Design System**: Based on Figma designs with Helvetica Now font family
- **State Management**: Svelte's reactive stores and component state
- **Development Server**: Vite

### Project Structure

```
LOIS/
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── components/
│   │   │       ├── RoutineCreationCard.svelte
│   │   │       ├── RoutinesLibrary.svelte
│   │   │       ├── ResultsView.svelte
│   │   │       ├── DataPreviewCard.svelte
│   │   │       └── DataLoadingSkeleton.svelte
│   │   └── routes/
│   │       └── chat/
│   │           └── +page.svelte
│   ├── package.json
│   └── svelte.config.js
└── IMPLEMENTATION.md (this file)
```

## Features Implemented

### 1. Chat Interface ([src/routes/chat/+page.svelte](src/routes/chat/+page.svelte))

The main chat interface provides an interactive conversation experience for legal queries.

#### Key Features:
- **Message Flow**: User and assistant messages displayed in a conversation format
- **Demo Mode**: Hardcoded responses for two specific queries
- **Data Visualization**: Integration with ResultsView component for displaying query results
- **Routine Creation**: Inline routine creation card triggered from chat responses
- **Routines Library**: Side panel for managing and browsing routines

#### Demo Queries:

**Query 1**: "How many open personal injury cases are currently in the discovery phase?"
- **Response**: "I found 42 open personal injury cases that are now in the discovery phase."
- **Action**: Displays a DataPreviewCard with sample case data

**Query 2**: "Can you show me which of these cases have medical expenses exceed $100,000?"
- **Response**: "I found 3 cases where medical expenses exceed $100,000."
- **Action**: Shows ResultsView with 3 cases and "Yes, create routine" button
- **Follow-up**: Clicking the button displays an inline RoutineCreationCard

#### Styling:
- **Background**: `#F8F9FA` (light gray)
- **Message Container**: Max-width 70% (85% on mobile)
- **User Messages**: `#E9E9E9` background
- **Assistant Messages**: White background with `#E5E5E5` border
- **Typography**: 14px font size, 20px line height

### 2. Routine Creation Card ([src/lib/components/RoutineCreationCard.svelte](src/lib/components/RoutineCreationCard.svelte))

A form component for creating automated routines that appears inline within chat messages.

#### Design Specifications:
- **Width**: Fixed 560px with 28px horizontal padding
- **Background**: White with `#E5E5E5` border
- **Border Radius**: 8px
- **Layout**: Vertical form with labeled fields

#### Form Fields:

1. **DESCRIPTION** (Read-only with edit icon)
   - Default: "Meds > $100k"
   - Gray background `#F4F4F4`
   - Edit icon on the right

2. **REPEAT** (Dropdown)
   - Options: Daily, Weekly, Monthly
   - Default: "Weekly"

3. **EVERY** (Dropdown)
   - Options: 1-4 Weeks
   - Default: "2 Weeks"

4. **ON** (Dropdown)
   - Options: Mon-Sun
   - Default: "Tue"

5. **AT** (Dropdown)
   - Time options
   - Default: "2:30PM"

6. **TYPE** (Dropdown)
   - Options: Prompt, Report, Alert
   - Default: "Prompt"

7. **PROMPT** (Read-only with edit icon)
   - Default: "Medical expenses exceed $100,000"
   - Gray background `#F4F4F4`

#### Actions:
- **Save Routine**: Black button (`#161616`) with white text
- **Cancel**: White button with red text (`#DA1E28`) and red border

#### Layout Details:
- REPEAT/EVERY fields: Side-by-side in 2-column grid with 16px gap
- ON/AT fields: Side-by-side in 2-column grid with 16px gap
- Field labels: 12px, uppercase, `#6F6F6F` color
- Field spacing: 16px gap between rows

### 3. Routines Library ([src/lib/components/RoutinesLibrary.svelte](src/lib/components/RoutinesLibrary.svelte))

A slide-out panel on the right side for browsing and managing routines.

#### Design Specifications:
- **Width**: 480px
- **Position**: Fixed, full height on right side
- **Background**: `#F4F4F4`
- **Border**: 1px solid `#E0E0E0` on left side
- **Z-index**: 100

#### Header Section:
- **Title**: "Routines Library" with folder icon
- **Font**: 17.5px Helvetica Now Text Regular
- **Actions**:
  - "Create Routine" button (black, `#161616`)
  - Close button (X icon)

#### Search Bar:
- White background with `#E0E0E0` border
- Placeholder: "Search for a routine"
- Search icon on the left
- 6px border radius

#### Promoted Routines Section:

**Card Design**:
- Background: `#E9E9E9`
- Border radius: 10px
- Padding: 15px vertical, 25px horizontal
- No border

**Sample Data**:
1. **Client Care Package** - Vista Group
   - Subroutines: Client Birthdays, No Activity in 30 Days, Client Follow-Ups

2. **Litigation Management Suite** - Shunnarah Law
   - Subroutines: Depos Next Month, Hearing Alerts, Discovery Progress Tracker

3. **Financial Compliance Monitor** - Morgan & Morgan
   - Subroutines: Trust Account Reconciliation, Outstanding Invoices, Monthly Financial Summary

4. **Discovery Deadline Tracker** - Baker & McKenzie
   - Subroutines: Discovery Responses Due, Document Production Deadlines, Motion Filing Reminders

**Features**:
- Expandable/collapsible cards (click to expand)
- Subroutines listed when expanded with schedule information
- "Add to my routines" button in expanded state
- Organization name displayed at bottom

#### My Routines Section:

**Card Design**:
- White background
- 1px solid `#E0E0E0` border
- Border radius: 10px
- 2-column grid layout
- 12px gap between cards

**Sample Data**:
1. Meds > $100k (Last run: Oct 18, 2025)
2. Depos Next Month (Last run: Oct 1, 2025)
3. Inactive Clients (Last run: Oct 21, 2025)
4. Settlement Offers (Last run: Oct 22, 2025)
5. Trial Prep Checklist (Last run: Oct 23, 2025)
6. Statute of Limitations (Last run: Oct 23, 2025)
7. New Case Intake (Last run: Oct 21, 2025)
8. High Value Cases (Last run: Oct 15, 2025)

**Card Contents**:
- Routine name (14px, bold)
- Last run date (11px, gray)
- Description (12px)
- Schedule with clock icon
- "Details →" link
- Action buttons: Edit and Share icons

#### Typography System:
- **Routine Titles**: 17.5px Helvetica Now Text Regular, line-height 25px
- **Section Headers**: 12px Helvetica Now Micro Bold, uppercase
- **Descriptions**: 14px Helvetica Now Text Regular, line-height 20px
- **Secondary Text**: 11-12px, color `#8D8D8D`

### 4. Results View ([src/lib/components/ResultsView.svelte](src/lib/components/ResultsView.svelte))

Displays query results in a formatted card layout.

#### Features:
- Title with case count
- Data table with sample case information
- Action buttons ("Yes, create routine" / "No, thanks")
- Expandable "View Full Table" link

### 5. Data Preview Card ([src/lib/components/DataPreviewCard.svelte](src/lib/components/DataPreviewCard.svelte))

A simple card for previewing data results.

#### Features:
- Clean card layout
- Sample data display
- Consistent styling with design system

### 6. Data Loading Skeleton ([src/lib/components/DataLoadingSkeleton.svelte](src/lib/components/DataLoadingSkeleton.svelte))

Loading state indicator for data fetching operations.

#### Features:
- Animated skeleton UI
- Matches data card dimensions
- Smooth loading experience

## Design System

### Color Palette

#### Primary Colors:
- **Text Primary**: `#161616` (near black)
- **Text Secondary**: `#525252` (medium gray)
- **Text Tertiary**: `#8D8D8D` (light gray)

#### Background Colors:
- **Page Background**: `#F8F9FA` (very light gray)
- **Library Background**: `#F4F4F4` (light gray)
- **Card Background**: White `#FFFFFF`
- **Promoted Card**: `#E9E9E9` (light gray)
- **User Message**: `#E9E9E9`
- **Field Background**: `#F4F4F4`

#### Border Colors:
- **Primary Border**: `#E0E0E0` (light gray)
- **Divider**: `#D6D6D6` (medium-light gray)
- **Strong Border**: `#E5E5E5`

#### Accent Colors:
- **Primary Button**: `#161616` (black)
- **Link/Info**: `#0F62FE` (blue)
- **Error/Cancel**: `#DA1E28` (red)

### Typography

#### Font Families:
- **Primary**: Helvetica Now Text
- **Micro/Labels**: Helvetica Now Micro
- **Display**: Helvetica Now Display
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

#### Font Sizes:
- **Large Title**: 17.5px (line-height: 25px)
- **Body**: 14px (line-height: 20px)
- **Label/Caption**: 12px (line-height: 15px)
- **Small**: 11px

#### Font Weights:
- **Regular**: 400
- **Medium**: 500
- **Semi-Bold**: 600
- **Bold**: 700

### Spacing System

#### Padding:
- **Card**: 15px vertical, 25px horizontal
- **Compact**: 16px
- **Form Field**: 10px 12px
- **Button**: 8px 16px (small), 10px 16px (medium)

#### Gaps:
- **Large**: 20px
- **Medium**: 16px
- **Small**: 12px
- **Tiny**: 8px
- **Field Row**: 16px
- **Grid**: 12px

#### Border Radius:
- **Large Card**: 10px
- **Card**: 8px
- **Button**: 6px
- **Small**: 4px
- **Dropdown**: 3px

### Component Patterns

#### Buttons:

**Primary Button**:
```css
background: #161616;
color: white;
border-radius: 6px;
padding: 8px 16px;
font-size: 14px;
font-weight: 500;
```

**Secondary Button**:
```css
background: white;
color: #161616;
border: 1px solid #E0E0E0;
border-radius: 6px;
```

**Danger Button**:
```css
background: white;
color: #DA1E28;
border: 1px solid #DA1E28;
```

#### Form Fields:

**Dropdown/Select**:
```css
width: 100%;
padding: 10px 32px 10px 12px;
font-size: 14px;
background: white;
border: 1px solid #D0D0D0;
border-radius: 4px;
```

**Read-only Field**:
```css
background: #F4F4F4;
padding: 10px 12px;
border-radius: 4px;
min-height: 40px;
```

**Label**:
```css
font-size: 11px;
font-weight: 600;
color: #6F6F6F;
letter-spacing: 0.5px;
text-transform: uppercase;
```

## State Management

### Chat State:
- `messages`: Array of message objects
- `input`: Current input text
- `isStreaming`: Boolean for streaming state
- `isThinking`: Boolean for loading state
- `showRoutinesLibrary`: Boolean for library visibility

### Message Object Structure:
```typescript
{
  role: 'user' | 'assistant',
  content: string,
  showDataPreview?: boolean,
  dataPreviewData?: object,
  showResults?: boolean,
  resultsData?: object,
  showRoutineCreation?: boolean,
  routineCreationData?: {
    onSave: (routine: RoutineData) => void,
    onCancel: () => void
  }
}
```

### Routine Data Structure:
```typescript
{
  id: string,
  name: string,
  description: string,
  schedule: string,
  lastRun?: string,
  organization?: string,
  isPromoted?: boolean,
  subroutines?: Array<{
    name: string,
    schedule: string
  }>
}
```

## Demo Flow

### Initial State:
1. User sees empty chat with input field
2. Routines library is hidden by default

### Demo Query 1:
1. User types: "How many open personal injury cases are currently in the discovery phase?"
2. System responds: "I found 42 open personal injury cases..."
3. DataPreviewCard displays with sample case data

### Demo Query 2:
1. User types: "Can you show me which of these cases have medical expenses exceed $100,000?"
2. System responds: "I found 3 cases where medical expenses exceed $100,000."
3. ResultsView displays with 3 cases
4. User sees "Yes, create routine" button

### Routine Creation Flow:
1. User clicks "Yes, create routine"
2. RoutineCreationCard appears inline in chat
3. Card shows pre-filled form with:
   - Description: "Meds > $100k"
   - Schedule: Weekly, every 2 weeks, on Tuesday at 2:30PM
   - Type: Prompt
   - Prompt: "Medical expenses exceed $100,000"
4. User can click "Save Routine" or "Cancel"
5. On save: Card disappears, routine is saved (mock)
6. On cancel: Card disappears

### Routines Library Flow:
1. User opens routines library (button in header)
2. Library slides in from right
3. User can:
   - Search for routines
   - Browse promoted routines from other organizations
   - Expand promoted routines to see subroutines
   - Add promoted routines to their library
   - View their own routines in grid layout
   - Edit or share their routines
4. User closes library with X button

## File Reference

### Key Components:

1. **[src/routes/chat/+page.svelte](src/routes/chat/+page.svelte:1)** - Main chat interface
   - Lines 1-50: Script setup and state management
   - Lines 100-200: Demo query handlers
   - Lines 400-600: Message rendering
   - Lines 975-1220: Styles

2. **[src/lib/components/RoutineCreationCard.svelte](src/lib/components/RoutineCreationCard.svelte:1)** - Routine creation form
   - Lines 1-24: Component props and data structure
   - Lines 26-133: Form markup
   - Lines 136-282: Styles

3. **[src/lib/components/RoutinesLibrary.svelte](src/lib/components/RoutinesLibrary.svelte:1)** - Routines library panel
   - Lines 1-131: Script and dummy data
   - Lines 91-335: Component markup
   - Lines 338-740: Styles

4. **[src/lib/components/ResultsView.svelte](src/lib/components/ResultsView.svelte)** - Query results display

5. **[src/lib/components/DataPreviewCard.svelte](src/lib/components/DataPreviewCard.svelte)** - Data preview component

6. **[src/lib/components/DataLoadingSkeleton.svelte](src/lib/components/DataLoadingSkeleton.svelte)** - Loading skeleton

## Development

### Running the Application:

```bash
cd frontend
npm install
npm run dev
```

The application runs on `http://localhost:5173` by default.

### Build:

```bash
npm run build
```

### Preview Production Build:

```bash
npm run preview
```

## Design Compliance

All components follow the Figma design specifications from:
- **Design File**: Cross-Project LOIS - Search, Reporting, Chat
- **Routine Creation Card**: node-id=11975:4619
- **Routines Library**: node-id=11998:19555

### Key Design Elements:
- Consistent spacing and padding
- Proper typography hierarchy
- Color system adherence
- Component state styling (hover, active, expanded)
- Responsive layout considerations
- Icon usage and positioning

## Future Enhancements

### Planned Features:
1. **Backend Integration**: Connect to actual API endpoints
2. **Real-time Updates**: WebSocket integration for live updates
3. **Authentication**: User login and session management
4. **Routine Execution**: Actual routine running and scheduling
5. **Data Export**: Export query results to various formats
6. **Advanced Search**: Full-text search in routines library
7. **Collaborative Features**: Share routines between users
8. **Analytics Dashboard**: Usage statistics and insights
9. **Custom Queries**: Natural language query builder
10. **Notifications**: Real-time alerts for routine results

### Technical Improvements:
- Add comprehensive unit tests
- Implement E2E testing with Playwright
- Add error boundary components
- Implement proper loading states for all async operations
- Add accessibility features (ARIA labels, keyboard navigation)
- Optimize bundle size
- Add server-side rendering optimizations
- Implement proper state management with stores
- Add data caching layer
- Implement proper error handling and user feedback

## Known Issues

1. Demo mode only - no backend integration
2. Routine creation doesn't persist data
3. Search functionality not implemented
4. Edit buttons are non-functional
5. Share functionality not implemented
6. "View Full Table" doesn't expand
7. No authentication/authorization
8. No data validation on forms
9. No error handling for failed operations
10. Routines library doesn't filter based on search

## Accessibility

### Current Implementation:
- Semantic HTML structure
- ARIA labels on icon buttons
- Keyboard navigation for form fields
- Focus states on interactive elements

### Needs Improvement:
- Full keyboard navigation for all features
- Screen reader testing and optimization
- Color contrast validation
- Focus trap in modal/panel components
- Announcement of dynamic content changes

## Browser Support

Tested and working in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

When adding new features:
1. Follow the existing component structure
2. Maintain design system consistency
3. Add TypeScript types for all data structures
4. Follow Svelte best practices
5. Keep components focused and reusable
6. Document props and events
7. Add comments for complex logic
8. Test across different screen sizes

## License

[Add license information]

## Contact

[Add contact information]

---

**Last Updated**: October 23, 2025
**Version**: 1.0.0
**Documentation Status**: Complete
