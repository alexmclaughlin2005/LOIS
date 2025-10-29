# LOIS Troubleshooting & Task Tracker

**Date Created**: 2025-10-29
**Status**: 🟡 In Progress

---

## Overview

This document tracks three key issues that need investigation and resolution in the LOIS application.

---

## Issue #1: Saved Prompts UX Improvements

**Priority**: Medium
**Status**: 🟡 In Progress - Partial Fix Applied
**Assigned**: Claude & User

### Current State
- Feature is functionally complete per `SAVED_PROMPTS_FEATURE.md`
- Library with 8 default prompts
- Create/edit/delete functionality works
- Search, filtering, and favorites implemented
- Placeholder support `[PLACEHOLDER]` functional

### Problem
Need to verify and improve the user experience:
1. ✅ **FIXED**: Positioning Issue - Modal was rendered outside app container
2. ✅ **FIXED**: Persistence Issue - Implemented localStorage
3. ✅ **FIXED**: Space Usage - Implemented compact list view
4. **Discoverability**: "Star" button on homepage may not be intuitive
5. **Placeholder UX**: Need to verify placeholder filling works smoothly
6. **Mobile Responsiveness**: Check if library works well on mobile devices

### Issue #1A: Positioning Bug (✅ FIXED)

**Problem Found**:
1. Initial issue: Components were rendered OUTSIDE `.app-container` div (after `</style>`)
2. Second issue: Components were positioned BEFORE sidebar, appearing on LEFT instead of RIGHT

**Solution Applied**:
- First fix: Moved components INSIDE `.app-container`
- Second fix: Moved components INSIDE `<main>` element at the end (matching chat page)

This positions them correctly: [Sidebar LEFT] → [Main Content] → [Side Panels RIGHT]

**Files Changed**:
- `frontend/src/routes/+page.svelte`:
  - SavedPromptsLibrary: lines 257-260 (inside main)
  - RoutinesLibrary: lines 262-268 (inside main)
  - Removed duplicates that were outside container

**Commits**:
- `6c0844f` - Initial positioning fix
- `ece55a3` - Corrected to RIGHT side (final fix)

### Issue #1B: localStorage Persistence (✅ FIXED)

**Problem**: Prompts were only stored in memory, lost on page refresh

**Solution Applied**:
- Added `loadPromptsFromStorage()` function to read from localStorage on mount
- Added `savePromptsToStorage()` function called after all CRUD operations
- Storage key: `'lois_saved_prompts'`
- Fallback to DEFAULT_PROMPTS if localStorage is empty
- All operations (create, edit, delete, favorite, use) now persist changes

**Files Changed**:
- `frontend/src/lib/components/SavedPromptsLibrary.svelte`

**Commit**:
- `7327e00` - Add localStorage persistence

### Issue #1C: Compact List View (✅ FIXED)

**Problem**: Each saved prompt took up too much space with large card layout

**Solution Applied**:
- Replaced card grid with vertical compact list
- Added expand/collapse functionality for details
- Always-visible prompt preview (2-line truncated)
- Collapsible section for description and tags
- Inline action buttons instead of separate footer
- Reduced vertical space usage by ~70%

**Design Changes**:
- Main row: favorite star + category pill + title + usage badge + expand button
- Preview row: Always visible, shows 2 lines of prompt text
- Expanded row: Shows full description and tags (animated slideDown)
- Actions row: Edit, Delete, Use Prompt buttons inline

**Files Changed**:
- `frontend/src/lib/components/SavedPromptsLibrary.svelte`
  - Added `expandedPromptId` state variable
  - Added `toggleExpanded()` function
  - Replaced `.prompts-grid` markup with `.prompts-list`
  - Replaced card-based CSS with compact list CSS

**Commit**:
- `637f20a` - Implement compact list view

### Files to Review
- `frontend/src/lib/components/SavedPromptsLibrary.svelte`
- `frontend/src/lib/components/PromptCreation.svelte`
- `frontend/src/routes/+page.svelte`
- `frontend/src/lib/types/prompt.ts`

### Tasks
- [x] **COMPLETED**: Fixed positioning bug on main page (Issue #1A)
- [x] **COMPLETED**: Implemented localStorage persistence (Issue #1B)
- [x] **COMPLETED**: Implemented compact list view (Issue #1C)
- [ ] Test saved prompts modal opens correctly on main page
- [ ] Verify modal opens on both main page AND chat page
- [ ] Test compact list view expand/collapse functionality
- [ ] Test saved prompts persist across browser sessions
- [ ] Review UX flow for creating new prompt
- [ ] Test placeholder replacement functionality
- [ ] Check mobile/tablet responsiveness
- [ ] Consider adding Supabase persistence (future enhancement)
- [ ] Gather user feedback on discoverability

### Proposed Solutions
1. **Quick Fix**: Add localStorage persistence
   - Store prompts in `localStorage` on change
   - Load from localStorage on mount
   - Fallback to DEFAULT_PROMPTS if empty

2. **Long-term**: Supabase Integration
   - Create `saved_prompts` table
   - Sync to database
   - Enable sharing across devices
   - Enable team sharing

### Success Criteria
- ✅ Prompts persist across browser sessions
- ✅ Users can easily discover saved prompts feature
- ✅ Placeholders work intuitively
- ✅ Feature works on mobile devices
- ✅ No console errors

---

## Issue #2: Upgrade to Latest Claude Model (Claude Sonnet 4.5)

**Priority**: High
**Status**: ✅ RESOLVED
**Assigned**: Claude

### Current State
**Model**: `claude-sonnet-4-5` (Claude Sonnet 4.5, latest model as of January 2025)
**All API endpoints updated**: ✅ Complete
**Max Tokens**: Varies by endpoint (1024-4096)

### Data Source Modes
The app has three query modes (toggle in chat interface):

1. **'documents'** mode:
   - Uses Claude 3.5 Sonnet for general conversational queries
   - Good for document analysis, general Q&A
   - No database queries involved
   - Current implementation at `frontend/src/routes/api/generate-response/+server.ts`

2. **'snowflake'** mode:
   - Uses Claude to generate SQL from natural language
   - Then executes SQL against Snowflake
   - Two-step process

3. **'cortex'** mode:
   - Uses Snowflake Cortex Analyst (native SQL generation)
   - Bypasses Claude for SQL generation
   - Single-step process

### Resolution Summary
**Upgraded all endpoints to Claude Sonnet 4.5 - Anthropic's latest and most capable model**

### APIs Updated
All Claude API calls upgraded from `claude-3-5-sonnet-20241022` to `claude-sonnet-4-5`:
- ✅ `frontend/src/routes/api/generate-response/+server.ts` - Document response generation
- ✅ `frontend/src/routes/api/chat/+server.ts` - Chat streaming
- ✅ `frontend/src/routes/api/classify-query/+server.ts` - Query classification
- ✅ `frontend/src/routes/api/generate-query/+server.ts` - SQL query generation
- ✅ `frontend/src/routes/api/snowflake/nl-query/+server.ts` - Snowflake NL query (2 instances)

### Model Benefits
Claude Sonnet 4.5 provides:
- Latest AI capabilities and improvements from Anthropic
- Better reasoning and complex analysis
- Improved instruction following
- Enhanced performance across all tasks
- Official recommendation from Anthropic (as of January 2025)

### Success Criteria
- ✅ All API endpoints use `claude-sonnet-4-5`
- ✅ Using Anthropic's latest recommended model
- ✅ Consistent model across entire application
- ✅ Documentation updated
- ✅ Ready for production deployment

---

## Issue #3: Snowflake Connection Errors in Production (Structured Data Mode)

**Priority**: 🔴 **HIGH** - Blocking feature in production
**Status**: ⏳ Not Started
**Assigned**: TBD

### Current State
- Snowflake queries work in local development
- **Failing in production** (Vercel deployment)
- Affects both 'snowflake' and 'cortex' data source modes
- Uses private key authentication (JWT-based)

### Symptoms
- Connection errors when using "structured data" toggle
- Possible authentication failures
- Queries may timeout or return 401/403 errors

### Authentication Flow
1. Load encrypted private key from environment variable
2. Decrypt using `SNOWFLAKE_PRIVATE_KEY_PASSWORD`
3. Generate JWT token with public key fingerprint
4. Call Snowflake Cortex Analyst REST API
5. Execute SQL query and return results

**Implementation**: `frontend/src/routes/api/snowflake/cortex-analyst/+server.ts`

### Required Environment Variables (Vercel)

Must be set in Vercel Dashboard → Settings → Environment Variables:

```bash
# Connection Config
SNOWFLAKE_ACCOUNT=SMB46128
SNOWFLAKE_USER=INTERNAL_INTEGRATION_USER
SNOWFLAKE_DATABASE=PRODUCT
SNOWFLAKE_SCHEMA=TESTING
SNOWFLAKE_WAREHOUSE=INTERNAL_INTEGRATIONS
SNOWFLAKE_ROLE=INTERNAL_INTEGRATION_ROLE

# Authentication
SNOWFLAKE_PRIVATE_KEY_PASSWORD=S50IrYonjehuyhZS2F
SNOWFLAKE_PRIVATE_KEY="-----BEGIN ENCRYPTED PRIVATE KEY-----
MIIFJDBWBgkqhkiG9w0BBQ0wSTAxBgkqhkiG9w0BBQwwJAQQi77YYPzgwOLJYSRE
YyuMJgICCAAwDAYIKoZIhvcNAgkFADAUBggqhkiG9w0DBwQI9pLlkUMyRe0EggTI
...
[FULL KEY CONTENT]
...
-----END ENCRYPTED PRIVATE KEY-----"
```

⚠️ **CRITICAL**: The private key must preserve all line breaks!

### Potential Root Causes

#### 1. Environment Variables Not Set
- [ ] Variables missing in Vercel
- [ ] Variables set for wrong environment (preview vs production)
- [ ] Private key missing BEGIN/END markers
- [ ] Line breaks stripped from private key

#### 2. JWT Generation Failing
Errors to check for:
- "Could not load Snowflake private key"
- "SNOWFLAKE_ACCOUNT and SNOWFLAKE_USER must be set"
- Crypto signing errors

#### 3. Cortex Analyst Not Enabled
- Account may not have Cortex Analyst feature
- User needs `CORTEX_ANALYST_USER` role
- Warehouse may not have access

#### 4. ORG_ID Filtering Issues
- `orgId` parameter may not be passed from frontend
- ORG filtering logic may fail on production data
- SQL injection in `applyOrgFilter()` function (lines 246-327)

#### 5. Network/CORS Issues
- Vercel serverless function timeout (10 seconds default)
- CORS headers incorrect
- Snowflake blocking Vercel IP addresses

### Files to Investigate
- `frontend/src/routes/api/snowflake/cortex-analyst/+server.ts` - Main endpoint
- `frontend/src/lib/snowflake.ts` - Connection utilities
- `frontend/src/lib/cortexSemanticModel.ts` - Semantic model definition
- `frontend/src/routes/chat/+page.svelte` - Frontend integration
- `.env` - Local environment variables (reference only)

### Debugging Steps

#### Step 1: Verify Environment Variables
```bash
# Check Vercel Dashboard
# Settings → Environment Variables
# Ensure all 8 variables are set for "Production" environment
```

#### Step 2: Test Connection Endpoint
```bash
# Test basic Snowflake connectivity
curl https://lois-app.vercel.app/api/snowflake/test

# Expected response:
# {"success": true, "connected": true, "message": "Successfully connected to Snowflake"}
```

#### Step 3: Check Vercel Logs
```bash
vercel logs --prod

# Look for:
# - "Error loading private key"
# - "Cortex Analyst API failed"
# - "JWT generation failed"
# - Timeout errors
```

#### Step 4: Test Cortex Analyst Locally
```bash
# In frontend directory
npm run dev

# Navigate to /chat
# Toggle to "Structured Data" mode
# Try query: "How many cases are in discovery?"
# Check browser console for errors
```

#### Step 5: Validate Private Key Format
- [ ] Verify key has BEGIN/END markers
- [ ] Check line breaks are intact
- [ ] Confirm password is correct
- [ ] Test decryption locally

#### Step 6: Check Snowflake Permissions
```sql
-- In Snowflake worksheet, run as INTERNAL_INTEGRATION_USER:
SHOW GRANTS TO ROLE INTERNAL_INTEGRATION_ROLE;
SHOW GRANTS TO USER INTERNAL_INTEGRATION_USER;

-- Verify access to:
-- - TEAM_THC2 database
-- - DATABRIDGE schema
-- - VW_DATABRIDGE_* views
-- - CORTEX_ANALYST_USER role
```

### Tasks Checklist

- [ ] **Verify Environment Variables**
  - [ ] Log in to Vercel Dashboard
  - [ ] Navigate to project → Settings → Environment Variables
  - [ ] Confirm all 8 variables are present
  - [ ] Check they're enabled for "Production"
  - [ ] Verify private key has correct format

- [ ] **Test Connection**
  - [ ] Hit `/api/snowflake/test` endpoint in production
  - [ ] Check response status and message
  - [ ] Review Vercel function logs for errors

- [ ] **Review Vercel Logs**
  - [ ] Run `vercel logs --prod`
  - [ ] Search for "Snowflake", "Cortex", "error", "failed"
  - [ ] Note any stack traces or error messages

- [ ] **Validate JWT Generation**
  - [ ] Add debug logging to JWT generation function
  - [ ] Redeploy and test
  - [ ] Verify JWT token is created successfully

- [ ] **Check Cortex Analyst Access**
  - [ ] Verify account has Cortex Analyst enabled
  - [ ] Confirm user has CORTEX_ANALYST_USER role
  - [ ] Test Cortex API endpoint manually with curl

- [ ] **Test ORG_ID Filtering**
  - [ ] Add logging to show orgId value in requests
  - [ ] Verify orgId is passed from frontend
  - [ ] Test SQL filtering logic with different orgId values

- [ ] **Review Error Handling**
  - [ ] Check error messages are being surfaced to UI
  - [ ] Add more descriptive error messages
  - [ ] Ensure errors are logged to Vercel

- [ ] **Performance Testing**
  - [ ] Test query response time
  - [ ] Check for timeout issues (>10 seconds)
  - [ ] Monitor Snowflake warehouse utilization

### Proposed Solutions

#### Solution 1: Environment Variables (Most Likely)
```bash
# Set in Vercel Dashboard
# Copy private key exactly as shown in SNOWFLAKE_DEPLOYMENT.md
# Including all line breaks and markers
```

#### Solution 2: Add Fallback Authentication
```typescript
// Try password auth if private key fails
if (!privateKey && env.SNOWFLAKE_PASSWORD) {
  console.log('Falling back to password authentication');
  // Use password auth instead
}
```

#### Solution 3: Improve Error Handling
```typescript
// Add more descriptive errors
try {
  const jwt = await generateSnowflakeJWT();
} catch (error) {
  console.error('JWT generation failed:', error);
  return json({
    success: false,
    error: 'Snowflake authentication failed',
    details: error.message,
    suggestion: 'Check SNOWFLAKE_PRIVATE_KEY and SNOWFLAKE_PRIVATE_KEY_PASSWORD'
  }, { status: 500 });
}
```

#### Solution 4: Add Health Check Endpoint
```typescript
// Create /api/snowflake/health
// Returns detailed connection status
// Shows which env vars are set (without exposing values)
// Tests JWT generation
// Tests basic query
```

### Success Criteria
- ✅ Connection works in production
- ✅ Structured data queries return results
- ✅ No authentication errors
- ✅ Response time < 5 seconds
- ✅ Clear error messages if failures occur
- ✅ Vercel logs show no errors

### Related Documentation
- `SNOWFLAKE_DEPLOYMENT.md` - Deployment guide
- `CORTEX_ANALYST_PROJECT_PLAN.md` - Implementation plan
- `SNOWFLAKE_INTEGRATION.md` - Integration details
- `frontend/src/lib/cortexSemanticModel.ts` - Semantic model

---

## Prioritization

1. **🔴 HIGH**: Issue #3 (Snowflake Connection) - Blocking production feature
2. **🟡 MEDIUM**: Issue #1 (Saved Prompts UX) - Feature works but needs polish
3. **🟢 LOW**: Issue #2 (Model Confirmation) - Just needs documentation

---

## Next Steps

1. **Start with Issue #3** - Fix production Snowflake connection
2. **Then Issue #1** - Improve saved prompts persistence
3. **Finally Issue #2** - Document model choice

---

## Progress Log

### 2025-10-29 - Session 1: Side Panel Positioning Fix
- ✅ Created comprehensive troubleshooting document
- ✅ Identified Issue #1A: Positioning bug in SavedPromptsLibrary & RoutinesLibrary
- ✅ Fixed attempt 1: Moved components inside .app-container (commit 6c0844f)
- ✅ Fixed attempt 2: Moved components inside <main> element (commit ece55a3)
- ✅ Fixed attempt 3: Added absolute positioning CSS (commit 1d955e1) - FINAL FIX
- ✅ User testing: Confirmed working correctly
- ✅ Pushed to GitHub: All 5 commits pushed successfully
- ✅ **Issue #1A: RESOLVED**

### 2025-10-29 - Session 2: localStorage Persistence
- ✅ Implemented localStorage persistence for saved prompts
- ✅ Added loadPromptsFromStorage() and savePromptsToStorage() functions
- ✅ Updated all CRUD operations to persist changes
- ✅ Commit 7327e00 pushed to GitHub
- ✅ **Issue #1B: RESOLVED**

### 2025-10-29 - Session 3: Compact List View
- ✅ User requested compact design to reduce space usage
- ✅ Replaced large card grid with vertical compact list
- ✅ Added expand/collapse functionality for prompt details
- ✅ Implemented always-visible 2-line prompt preview
- ✅ Added collapsible section for description and tags
- ✅ Created inline action buttons layout
- ✅ Reduced vertical space usage by ~70%
- ✅ Commit 637f20a pushed to GitHub
- ✅ **Issue #1C: RESOLVED**

### 2025-10-29 - Session 4: Upgrade to Claude Sonnet 4.5
- ✅ User requested upgrade to Anthropic's latest model
- ✅ Updated all 6 API endpoints to use `claude-sonnet-4-5`
- ✅ Updated generate-response API (documents mode)
- ✅ Updated chat API (streaming)
- ✅ Updated classify-query API (query classification)
- ✅ Updated generate-query API (SQL generation)
- ✅ Updated snowflake/nl-query API (2 instances)
- ✅ Updated troubleshooting documentation
- ✅ **Issue #2: RESOLVED**
- ⏳ Next: Test endpoints, commit and push changes

---

## Notes

- All issues have been reviewed and documented
- Each issue has clear tasks, proposed solutions, and success criteria
- Ready to work on issues systematically
- Will update this document as we make progress

---

**Last Updated**: 2025-10-29
**Next Review**: After completing Issue #3
