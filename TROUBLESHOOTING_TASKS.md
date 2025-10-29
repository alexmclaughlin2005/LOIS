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
2. **Persistence Issue**: Prompts only stored in-memory (lost on refresh)
3. **Discoverability**: "Star" button on homepage may not be intuitive
4. **Placeholder UX**: Need to verify placeholder filling works smoothly
5. **Mobile Responsiveness**: Check if library works well on mobile devices

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

### Files to Review
- `frontend/src/lib/components/SavedPromptsLibrary.svelte`
- `frontend/src/lib/components/PromptCreation.svelte`
- `frontend/src/routes/+page.svelte`
- `frontend/src/lib/types/prompt.ts`

### Tasks
- [x] **FIX APPLIED**: Fixed positioning bug on main page
- [ ] Test saved prompts modal opens correctly on main page
- [ ] Verify modal opens on both main page AND chat page
- [ ] Test saved prompts on fresh browser session (verify persistence issue)
- [ ] Review UX flow for creating new prompt
- [ ] Test placeholder replacement functionality
- [ ] Check mobile/tablet responsiveness
- [ ] Implement localStorage persistence (recommended next step)
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

## Issue #2: Confirm Model for "Documents" Mode

**Priority**: Low
**Status**: ⏳ Not Started
**Assigned**: TBD

### Current State
**Model**: `claude-3-5-sonnet-20241022` (Claude 3.5 Sonnet, October 2024)
**Location**: `frontend/src/routes/api/generate-response/+server.ts:83`
**Max Tokens**: 1024

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

### Question to Answer
**Is `claude-3-5-sonnet-20241022` the right model for documents mode?**

### Tasks
- [ ] Document current model choice in code comments
- [ ] Verify this is the latest available Sonnet model
- [ ] Check if we should consider Claude 3 Opus for higher quality (if needed)
- [ ] Review response quality in documents mode
- [ ] Check if max_tokens: 1024 is sufficient for responses
- [ ] Consider cost implications of model choice
- [ ] Add model version to response metadata for tracking

### Model Comparison Reference

| Model | Speed | Quality | Cost | Use Case |
|-------|-------|---------|------|----------|
| Claude 3.5 Sonnet | Fast | High | Medium | ✅ **Current choice** - Best balance |
| Claude 3 Opus | Slower | Highest | High | Consider if quality issues arise |
| Claude 3 Haiku | Fastest | Good | Low | Too simple for legal queries |

### Proposed Actions
1. **Keep current model** (recommended) - Claude 3.5 Sonnet is the best choice
2. **Document why** - Add comments explaining model selection
3. **Add monitoring** - Track response quality metrics
4. **Add fallback** - Consider Opus fallback for complex queries

### Success Criteria
- ✅ Model choice is documented and justified
- ✅ Response quality meets user needs
- ✅ Cost is reasonable for usage volume
- ✅ No user complaints about response quality

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

### 2025-10-29 - Session 1
- ✅ Created comprehensive troubleshooting document
- ✅ Identified Issue #1A: Positioning bug in SavedPromptsLibrary & RoutinesLibrary
- ✅ Fixed attempt 1: Moved components inside .app-container
- ✅ Fixed attempt 2: Moved components inside <main> to appear on RIGHT side
- ✅ Verified: Both side panels now correctly positioned on right side
- ✅ Commits: 6c0844f (initial), ece55a3 (final fix)
- ✅ Dev server running: http://localhost:5175/
- ⏳ Next: User testing, then implement persistence

---

## Notes

- All issues have been reviewed and documented
- Each issue has clear tasks, proposed solutions, and success criteria
- Ready to work on issues systematically
- Will update this document as we make progress

---

**Last Updated**: 2025-10-29
**Next Review**: After completing Issue #3
