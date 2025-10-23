# LOIS - Design Specifications

**Extracted from Figma Designs**
**Date**: 2025-10-23
**Design File**: Cross-Project LOIS - Search, Reporting, Chat

---

## Overview

LOIS (Localized Organizational Intelligence System) design combines elements of:
1. **Conversational AI Interface** - Chat-like interaction with saved prompts and routines
2. **Activity Feed/Task Management** - Similar to FileVine or project management tools
3. **Search & Discovery** - Omni-search across multiple data types
4. **Data Visualization** - Tables, lists, and detail views

The design shows **two distinct UI paradigms**:
- **LOIS Interface** (Left sidebar + chat center): AI-first conversational search
- **FileVine-style Interface** (Traditional app): Existing feed/task management system

---

## Color Palette

### Primary Colors

**Brand/Accent**
- LOIS Coral/Pink: `#FF6B6B` or similar (used in logo and accents)
- Primary Action: Black `#000000` (used in "Ask LOIS" button)

**Interface Background**
- Light Gray: `#F7F7F6` (rgb(247, 247, 246)) - Main background
- White: `#FFFFFF` - Cards, panels, dropdowns
- Warm Gray: `#C5C5C3` approximately - Borders and dividers

**Text Colors**
- Primary Text: `#161616` (rgb(22, 22, 22)) - Dark gray/near black
- Secondary Text: `#6B6B6B` - Medium gray for labels
- Tertiary Text: `#999999` - Light gray for hints/placeholders
- Link/Interactive: Blue tones for mentions and links

### Semantic Colors

**Status Indicators**
- Success/Complete: `#4CAF50` or `#00A86B` - Green shades
- Warning/Overdue: `#FF4444` or `#FF6B6B` - Red/coral
- Info/Portal ON: `#00C853` - Bright green
- Active/Selected: Blue highlight `#2196F3` approximate

**Tag Colors**
- Permitted: Gray tag `#E0E0E0` with dark text
- Licenses: Green tag `#E8F5E9` with green text
- Personal Injury: Pink tag `#FCE4EC` with pink text
- URGENT: Yellow tag `#FFF9C4` with dark text
- Follow-up needed: Purple tag `#F3E5F5` with purple text

### Neutral Palette
- N50: `#FAFAFA`
- N100: `#F5F5F5`
- N200: `#EEEEEE`
- N300: `#E0E0E0`
- N400: `#BDBDBD`
- N500: `#9E9E9E`
- N600: `#757575`
- N700: `#616161`
- N800: `#424242`
- N900: `#212121`

---

## Typography

### Font Families

**Primary Font**: Helvetica Now Display
- Used for headings, names, important text
- Bold weight (700) for emphasis

**Secondary Font**: System default (San Francisco on Mac, Segoe UI on Windows)
- Used for body text, descriptions, labels

### Font Sizes & Weights

**Headings**
- H1 (Page Title): 21px, Bold (700), Helvetica Now Display
- H2 (Section Title): 16-18px, Semi-Bold (600)
- H3 (Card Title): 14-16px, Medium (500)

**Body Text**
- Body Regular: 14px, Regular (400)
- Body Small: 12px, Regular (400)
- Caption: 11px, Regular (400)

**Interactive Elements**
- Button Text: 14px, Medium (500)
- Link Text: 14px, Regular (400), underline on hover
- Input Placeholder: 14px, Regular (400), light gray

### Line Heights
- Tight: 1.2 (for headings)
- Normal: 1.5 (for body text)
- Relaxed: 1.75 (for long-form content)

---

## Layout & Spacing

### Grid System
- Desktop breakpoint: 1440px (design canvas width)
- Content max-width: ~1200-1260px with margins

### Spacing Scale
Following an 8px grid system:
- 2px - Tight spacing (between inline elements)
- 4px - Compact spacing
- 8px - Small spacing
- 12px - Medium spacing
- 16px - Default spacing (most common)
- 20px - Large spacing
- 24px - XL spacing
- 32px - 2XL spacing
- 40px - 3XL spacing
- 48px - 4XL spacing

### Component Spacing
- Card padding: 16-20px
- List item padding: 12-16px vertical, 16px horizontal
- Button padding: 8-12px vertical, 16-24px horizontal
- Input padding: 8-10px vertical, 12-16px horizontal

---

## UI Components

### 1. Navigation Header (FileVine Style)

**Structure**:
- Height: 55px
- Background: Light gray `#F7F7F6`
- Horizontal layout with left, center, right sections

**Left Section**:
- Hamburger menu icon
- Navigation items: Feed, Tasks, Projects, Documents
- Each with icon + text label

**Center Section**:
- FILEVINE logo (or LOIS logo depending on context)

**Right Section**:
- Global search bar (300px width, rounded corners)
- Timer icon
- Messages icon
- Help icon (?)
- User avatar (circular, 32-36px)

**Search Bar**:
- Placeholder: "Search for a project, contact, tag, etc."
- Border: 1px solid light gray
- Border-radius: 20-24px (pill shape)
- Padding: 8px 16px
- Search icon on left

---

### 2. LOIS Sidebar Navigation

**Structure**:
- Width: ~240-260px
- Background: White
- Fixed left position
- Sections separated by dividers

**Top Section**:
- LOIS logo/branding (coral/pink text)
- Collapse/expand toggle button

**Primary Actions** (top buttons):
- "New Chat" - with icon
- "Create Routine" - with icon
- "Routines Library" - with icon

**Recent Routines Section**:
- Section header with collapse arrow
- List items:
  - Title (bold, 14px)
  - Description (12px, gray, 2 lines max)
  - Info badge (blue circle with number)

**Recent Chats Section**:
- Section header with collapse arrow
- List of chat history items
- Text truncation with ellipsis

**List Item States**:
- Default: White background
- Hover: Light gray background `#F5F5F5`
- Active/Selected: Light blue background `#E3F2FD`

---

### 3. Left Sidebar (FileVine Style)

**Structure**:
- Width: ~200-220px
- Background: White
- Border-right: 1px solid light gray

**Top Section**:
- User info card:
  - Avatar (50px, circular)
  - Name (bold, 21px)
  - Contact details (email, phone, smaller text)

**Filter Menu**:
- Expandable "Filter Menu" header
- Search Project input field
- "Project Feed" link (highlighted)

**Navigation Items**:
- Billing
- Calendar
- Intake
- Medical Records
- Contacts
- Docs
- Related

**Icons**: Left-aligned, 16-20px size, dark gray

---

### 4. Main Content Area - Sort & Filter Panel

**Structure**:
- Background: Light gray
- Padding: 16-20px
- Sticky position at top of content

**Components**:
- "SORT & FILTER" header with collapse toggle (`<<`)
- Filter sections:
  - **Unread** badge with count (blue pill)
  - **My Recent Activity** link
  - **Quick Filters** section:
    - Checkboxes for: Notes, Messages (with count), Emails, Faxes, Phone Calls, Texts, Tasks (with count), Reminders
    - "All" and "None" quick actions
  - Count badges: Blue pills with white text

---

### 5. Activity Feed / Content Stream

**Structure**:
- Background: White
- Cards with borders and shadows

**Feed Header Banner**:
- Light blue background
- Icon + message text
- Close button (X)
- Example: "📢 Feed updates are here! You can opt-in to the new look..."

**Filter Bar**:
- Dropdowns: "Filter ▼", "Sort by Last Activity ▼"
- Right-aligned: "Summarize" button with sparkle icon
- View toggles: List, Grid, Card views

**Input Field**:
- "Add new activity..." placeholder
- Full width
- Light border

**Content Sections**:
- "Trending Tags" - collapsible
- "Pinned" section - with item count
- "Earlier" section - with item count (e.g., "22 items")

---

### 6. Activity/Task Cards

**Structure**:
- White background
- Left border (4-5px thick) - blue for active tasks
- Padding: 16px
- Rounded corners: 4-6px
- Subtle shadow

**Header**:
- Avatar (32-40px) + Name (bold)
- Action description: "created a task", "created a note"
- Title of task/note (bold)
- Timestamp (relative, e.g., "now", "7/21/25 • 12:23 PM")
- Status badges (right-aligned): "Overdue", "Complete", "Recent activity"
- Action buttons (star, pin, more menu)

**Content**:
- @mentions (blue, clickable)
- Description text
- Tags (colored pills): #Permitted, #Licenses, etc.

**Metadata Row**:
- "Assigned to" with avatar + name
- "Due" date
- "Triggered by" action/button
- Action buttons: "Complete Task", etc.

**Completion Info** (if completed):
- Green checkmark icon
- "Completed on [date] by [name]"
- Light green background

---

### 7. LOIS Conversational Interface

**Structure**:
- Center panel, max-width ~700-800px
- Clean, spacious layout
- Focus on input and AI interaction

**Welcome Screen** (Landing V1):
- Centered content
- Large heading: "Search or Talk to LO\S"
- Subheading: "Find documents, search projects, ask questions, or have Lois take action"
- Large input field with placeholder
- "Look at..." dropdown + "⭐ Saved Prompts"
- Icon buttons: Upload, Voice input
- Primary CTA: "Ask LOIS" (black button)
- Quick action cards:
  - Search (magnifying glass icon)
  - Report (document icon)
  - Analyze (chart icon)
  - Summarize (list icon)

**Welcome Screen V2** (Landing V2):
- Heading: "Welcome to LO\S"
- Three action cards in row:
  - Search, Report, Analyze
  - Each with icon, title, description
  - Two example use cases per card
- Input at bottom with same controls

**Chat Input**:
- Large text area
- Placeholder: "What would you like get done today?"
- "Look at..." dropdown
- "⭐ Saved Prompts" button
- Icon buttons: Upload (📎), Voice (🎤)
- "Ask LOIS" button (black, prominent)

---

### 8. Search Results - Modal/Drawer

**Structure**:
- Right-side drawer/modal
- Width: ~400-500px
- White background
- Shadow overlay on main content

**Header**:
- Title: "Personal Injury Cases in Discovery Phase" (or query)
- Share button
- Close button (X)

**Content Panel** (Split view):
- **Left side**: Query results summary
  - Natural language explanation
  - Highlighted answer
  - "Personal Injury Cases in Discovery Phase"
  - Count: "I found 42 open personal injury cases..."
  - Result preview card

- **Right side**: Data table
  - Column headers: Project, Type, Phase, Primary
  - Filterable columns (filter icons)
  - Rows with:
    - Avatar + name
    - Client name (smaller text)
    - Data fields
    - Action button (⚙️ settings/options)
  - Scrollable list

**Bottom Input**:
- Same as chat input (smaller)
- "Look at..." + "Saved Prompts"
- Voice and upload icons
- "Ask LOIS" button

---

### 9. Search Dropdown (Project Search)

**Structure**:
- Dropdown panel appearing below search bar
- White background
- Shadow/border
- Max height with scroll

**Header Section**:
- "Include Archived" checkbox
- "Ask LOIS" button (black, right-aligned)

**Results Sections**:
- **Contacts** section:
  - Avatar + name (bold)
  - Title/role + details
  - Tags

- **Projects** section:
  - Name + details
  - Multiple line metadata
  - Tags

**Result Item Structure**:
- Hover state: Light gray background
- Avatar/icon on left (circular or icon)
- Primary text (bold)
- Secondary text (2-3 lines, gray)
- Tags (colored pills)
- Right-aligned: item count or badge

---

### 10. Buttons

**Primary Button** ("Ask LOIS"):
- Background: Black `#000000`
- Text: White, 14px, medium weight
- Padding: 10-12px vertical, 20-24px horizontal
- Border-radius: 6-8px
- Hover: Slightly lighter black or subtle shadow

**Secondary Button**:
- Background: White
- Border: 1px solid gray
- Text: Dark gray
- Same dimensions as primary

**Icon Button**:
- Circular or square with rounded corners
- 32-36px size
- Icon centered
- Background: Transparent or light gray
- Hover: Light gray background

**Badge Button** (e.g., "Vitals"):
- Background: Black
- Text: White with icon
- Compact padding
- Border-radius: 4-6px

---

### 11. Form Inputs

**Text Input**:
- Border: 1px solid `#E0E0E0`
- Border-radius: 6-8px
- Padding: 8-12px
- Font-size: 14px
- Focus: Border color changes to blue `#2196F3`, subtle shadow

**Search Input**:
- Border-radius: 20-24px (pill shape)
- Background: White or very light gray
- Icon inside (left or right)
- Placeholder in light gray

**Textarea** (Chat input):
- Min-height: 40-50px
- Border: 1px solid light gray
- Border-radius: 8px
- Padding: 12px
- Resize: Vertical only

**Dropdown/Select**:
- Border: 1px solid light gray
- Border-radius: 6px
- Dropdown arrow icon
- Hover: Border darkens
- Active: Border blue

---

### 12. Tags & Pills

**Tag Structure**:
- Inline-block
- Padding: 4px 10px
- Border-radius: 12px (pill)
- Font-size: 11-12px
- Font-weight: Medium (500)
- No border (background color differentiates)

**Tag Types**:
- #Permitted: Gray background `#E8E8E8`, dark text
- #Licenses: Light green `#E8F5E9`, green text `#2E7D32`
- #Personal injury: Light pink `#FCE4EC`, pink text `#C2185B`
- #URGENT: Light yellow `#FFF9C4`, dark text
- #Followup needed: Light purple `#F3E5F5`, purple text `#7B1FA2`

---

### 13. Avatars

**Sizes**:
- Small: 24-28px (in tags, small lists)
- Medium: 32-36px (standard)
- Large: 40-48px (user profile)
- XL: 50px+ (profile cards)

**Style**:
- Circular
- Border: Optional 2px white border with subtle shadow
- Fallback: Initials on colored background

---

### 14. Icons

**Style**: Line icons (outline style, not solid fill)
**Size**: 16-24px typically
**Color**: Matches text color (dark gray default)

**Common Icons**:
- ⚡ Lightning: Feed/Activity
- ✓ Checkmark: Tasks/Complete
- 📋 Clipboard: Projects
- 📄 Document: Documents
- 🔍 Search: Search
- 📊 Chart: Analytics/Reports
- ⭐ Star: Favorites/Important
- 📎 Paperclip: Attachments
- 🎤 Microphone: Voice input
- ⚙️ Settings/Options: More actions
- ❌ Close: Close/Dismiss
- ➕ Plus: Add new
- 📖 Book: Routines/Library

---

### 15. Cards

**Standard Card**:
- Background: White
- Border: 1px solid `#E0E0E0` OR subtle shadow (0 2px 4px rgba(0,0,0,0.1))
- Border-radius: 8-10px
- Padding: 16-20px
- Hover: Shadow increases slightly

**Interactive Card** (clickable):
- Cursor: pointer
- Hover: Background slight gray `#FAFAFA`, shadow increases
- Active: Pressed state with slight scale or shadow change

**Info Card** (on landing page):
- Icon at top (32-40px)
- Title (bold, 16px)
- Description text (14px, gray)
- List of examples (smaller text, gray)
- Hover: Border or background change

---

### 16. Status Badges

**Structure**:
- Inline-flex
- Padding: 4px 8px
- Border-radius: 4px
- Font-size: 11-12px
- Font-weight: 500-600

**Types**:
- **Overdue**: Red background `#FFEBEE`, red text `#C62828`
- **Complete**: Green background `#E8F5E9`, green text `#2E7D32`
- **Recent activity**: Blue background `#E3F2FD`, blue text `#1565C0`
- **Portal ON**: Bright green background, white text
- **Numbered badge** (count): Blue circle `#2196F3`, white text, 16-20px diameter

---

### 17. Dividers & Borders

**Horizontal Divider**:
- Height: 1px
- Color: Light gray `#E0E0E0`
- Margin: 16-24px vertical

**Section Border**:
- 1px solid `#E0E0E0`
- Border-radius: 6-8px (on containers)

**Left Accent Border** (on cards):
- Width: 4-5px
- Color: Blue `#2196F3` for active/selected
- Border-radius: 4px 0 0 4px

---

### 18. Shadows

**Elevation Levels**:
- **Level 1** (Subtle): `0 1px 3px rgba(0, 0, 0, 0.08)`
- **Level 2** (Cards): `0 2px 8px rgba(0, 0, 0, 0.12)`
- **Level 3** (Modals): `0 4px 16px rgba(0, 0, 0, 0.16)`
- **Level 4** (Drawers): `0 8px 24px rgba(0, 0, 0, 0.20)`

**Usage**:
- Cards: Level 1-2
- Dropdowns: Level 2
- Modals/Drawers: Level 3-4
- Hover states: Increase by one level

---

## Layout Patterns

### 1. LOIS Chat Layout
```
┌─────────────────────────────────────────────────┐
│ Left Sidebar (240px)  │  Main Chat Area         │
│ - Logo                │  - Welcome message      │
│ - Actions             │  - Action cards         │
│ - Recent Routines     │  - Input field          │
│ - Recent Chats        │  - Ask LOIS button      │
└─────────────────────────────────────────────────┘
```

### 2. FileVine-Style Feed Layout
```
┌──────────────────────────────────────────────────────────┐
│ Top Navigation Bar (full width, 55px height)             │
├────────┬──────────────┬───────────────────────────────────┤
│ Left   │ Center Panel │  Main Content Feed                │
│ Sidebar│ Sort/Filter  │  - Activity cards                 │
│ (220px)│ (200-280px)  │  - Task cards                     │
│        │              │  - Notes                          │
└────────┴──────────────┴───────────────────────────────────┘
```

### 3. Search Results Layout (with drawer)
```
┌──────────────────────────────────────────────────────────┐
│ Main Content (dimmed)        │  Results Drawer (500px)   │
│                              │  - Query summary           │
│                              │  - Data table              │
│                              │  - Input field             │
└──────────────────────────────────────────────────────────┘
```

---

## Interaction Patterns

### Hover States
- **Links**: Underline appears
- **Buttons**: Background darkens slightly or shadow increases
- **Cards**: Shadow increases, slight scale (1.01-1.02)
- **List items**: Background changes to light gray `#F5F5F5`

### Active/Selected States
- **Navigation items**: Background blue `#E3F2FD`, blue left border
- **Cards**: Blue left border (4-5px)
- **Inputs**: Blue border `#2196F3`, subtle shadow

### Loading States
- Skeleton screens (gray animated bars)
- Spinner (circular, blue accent color)
- "Thinking..." state with animated indicator

### Empty States
- Centered icon (64px, gray)
- Message text (gray)
- Optional CTA button

---

## Responsive Behavior

### Breakpoints
- **Desktop**: 1440px+ (primary design)
- **Tablet**: 768-1439px
- **Mobile**: <768px

### Responsive Adjustments
- Sidebar collapses to hamburger menu on mobile
- Cards stack vertically on smaller screens
- Navigation switches to bottom tab bar on mobile
- Search bar becomes full-width on mobile
- Two-column layouts become single-column

---

## Accessibility

### Focus States
- All interactive elements have visible focus outline
- Focus outline: 2px solid blue `#2196F3`, 2px offset
- Skip to main content link

### Color Contrast
- Text on background: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Status colors meet WCAG AA standards

### Interactive Elements
- Minimum touch target: 44x44px
- Keyboard navigable
- ARIA labels on icon-only buttons

---

## Animation & Transitions

### Duration
- Fast: 150ms (hover, focus)
- Normal: 250ms (dropdowns, modals)
- Slow: 350ms (drawers, page transitions)

### Easing
- Standard: `cubic-bezier(0.4, 0.0, 0.2, 1)` (ease-in-out)
- Enter: `cubic-bezier(0.0, 0.0, 0.2, 1)` (ease-out)
- Exit: `cubic-bezier(0.4, 0.0, 1, 1)` (ease-in)

### Animations
- Fade in/out: opacity transition
- Slide in: transform translateY or translateX
- Scale: transform scale (subtle, 0.95-1.05 range)
- Skeleton loading: shimmer effect

---

## Special Features

### "Ask LOIS" Integration
- Appears as prominent CTA throughout interface
- Black button with white text
- Consistent placement (bottom right of inputs)
- Can trigger from multiple contexts

### Voice Input
- Microphone icon button
- Visual feedback when listening
- Waveform or pulse animation

### File Upload
- Paperclip icon
- Drag-and-drop area
- Preview thumbnails

### Summarize Feature
- Sparkle icon (✨) button
- Appears with results
- Generates AI summary

---

## Design System Notes

### Consistency
- Use the same component patterns across both UI paradigms (LOIS chat vs FileVine feed)
- Maintain consistent spacing, colors, and typography
- Icons should be the same style (outline/line icons)

### Flexibility
- Components should work in both light backgrounds (white, light gray)
- Tags and badges support multiple color variants
- Cards adapt to different content types

### Scalability
- Design accommodates growing lists (scrolling, pagination)
- Filters and sorts support large datasets
- Search scales to handle many result types

---

## Implementation Priorities

### Phase 1: Core Components
1. Button component (primary, secondary, icon variants)
2. Input components (text, search, textarea)
3. Card component (base, activity, task variants)
4. Avatar component
5. Tag/Badge components

### Phase 2: Layout Components
1. Navigation header
2. Sidebar navigation (both styles)
3. Main layout container
4. Filter panel
5. Modal/Drawer component

### Phase 3: Feature Components
1. Activity feed list
2. Search results table
3. Chat interface
4. Landing page cards
5. Dropdown panels

---

## Design Tokens (Recommended Structure)

```javascript
// colors.tokens.js
export const colors = {
  brand: {
    coral: '#FF6B6B',
    black: '#000000',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F7F7F6',
    tertiary: '#F5F5F5',
  },
  text: {
    primary: '#161616',
    secondary: '#6B6B6B',
    tertiary: '#999999',
  },
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
  },
  status: {
    success: '#4CAF50',
    warning: '#FF6B6B',
    info: '#2196F3',
  },
  // ... more tokens
};

// spacing.tokens.js
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// typography.tokens.js
export const typography = {
  fontFamily: {
    primary: '"Helvetica Now Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    secondary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '21px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-23
**Based on**: Figma Design File "Cross-Project LOIS - Search, Reporting, Chat"
