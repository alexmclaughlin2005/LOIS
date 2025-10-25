# Snowflake Cortex Analyst Integration Project Plan

## Executive Summary

This project plan outlines the integration of Snowflake Cortex Analyst into LOIS to replace our current Claude-based natural language SQL generation with Snowflake's native AI-powered query service.

**Key Benefits:**
- Native Snowflake integration (no external LLM calls)
- Better accuracy with semantic models
- Multi-turn conversation support
- Built-in governance and security
- Lower latency (queries stay within Snowflake)
- Cost reduction (eliminates Claude API calls for SQL generation)

---

## Current State vs. Future State

### Current Implementation
- **Architecture**: LOIS → Claude API → SQL Generation → Snowflake Execution
- **Limitations**:
  - Schema context must be manually maintained
  - Column name mismatches require explicit prompt engineering
  - Two-step process (generate SQL, then execute)
  - External API dependency for SQL generation

### Future State with Cortex Analyst
- **Architecture**: LOIS → Cortex Analyst REST API → Automatic SQL + Execution
- **Advantages**:
  - Semantic model defines business terminology
  - Native understanding of Snowflake schema
  - Single API call for NL query → results
  - Conversation history support
  - Governed by Snowflake RBAC

---

## Phase 1: Research & Setup (1-2 days)

### 1.1 Prerequisites Check
- [ ] Verify Snowflake account has Cortex features enabled
- [ ] Confirm we have `SNOWFLAKE.CORTEX_ANALYST_USER` role access
- [ ] Identify which warehouse to use for queries
- [ ] Verify stage access for semantic model storage

### 1.2 Semantic Model Creation
**Goal**: Create YAML semantic model for TEAM_THC2.DATABRIDGE schema

**Key Views to Model:**
- `VW_DATABRIDGE_PROJECT_LIST_DATA_V1` (primary view for projects/cases)
- `VW_DATABRIDGE_PERSON_STANDARD_DATA_V1` (client information)
- `VW_DATABRIDGE_DOCS_V1` (document metadata)
- `VW_DATABRIDGE_INVOICE_DATA_V1` (billing data)

**Semantic Model Structure:**
```yaml
name: "LOIS Legal Data Model"
description: "Filevine legal case and project data"

tables:
  - name: VW_DATABRIDGE_PROJECT_LIST_DATA_V1
    description: "Main view for legal cases and projects"
    base_table:
      database: TEAM_THC2
      schema: DATABRIDGE
      table: VW_DATABRIDGE_PROJECT_LIST_DATA_V1

    dimensions:
      - name: project_number
        synonyms: ["case number", "matter number", "project id"]
        description: "Unique identifier for a case or project"
        expr: PROJECT_NUMBER
        data_type: TEXT

      - name: phase_name
        synonyms: ["status", "phase", "stage", "discovery phase"]
        description: "Current phase of the case (e.g., Discovery, Trial, Settlement)"
        expr: PHASE_NAME
        data_type: TEXT

      - name: client_name
        synonyms: ["client", "customer", "person", "contact"]
        description: "Full name of the primary client"
        expr: CLIENT_FULL_NAME
        data_type: TEXT

    time_dimensions:
      - name: created_date
        synonyms: ["filed date", "creation date", "start date"]
        description: "Date the case was created in the system"
        expr: CREATED_AT
        data_type: DATE

    measures:
      - name: case_count
        synonyms: ["number of cases", "total cases", "count"]
        description: "Total number of cases"
        expr: COUNT(*)
        data_type: NUMBER

      - name: total_balance
        synonyms: ["total owed", "outstanding balance"]
        description: "Sum of current invoice balances"
        expr: SUM(CURRENT_BALANCE)
        data_type: NUMBER
```

**Actions:**
- [ ] Document all column names and business meanings
- [ ] Identify common synonyms for each field
- [ ] Create comprehensive YAML semantic model
- [ ] Upload to Snowflake stage
- [ ] Test with simple queries

---

## Phase 2: API Integration (2-3 days)

### 2.1 Cortex Analyst REST API Endpoint
**Create**: `/api/snowflake/cortex-analyst/+server.ts`

**Functionality:**
```typescript
POST /api/snowflake/cortex-analyst
Body: {
  question: string,
  conversation_history?: Array<{role: string, content: string}>
}

Response: {
  success: boolean,
  sql?: string,
  results?: any[],
  interpretation?: string,
  conversation_id?: string
}
```

**Implementation Steps:**
- [ ] Research Cortex Analyst REST API endpoint format
- [ ] Implement authentication with Snowflake session token
- [ ] Create API route that calls Cortex Analyst
- [ ] Parse response (SQL + results)
- [ ] Handle conversation history for multi-turn queries
- [ ] Error handling and validation

### 2.2 Update Chat Interface
**File**: `/frontend/src/routes/chat/+page.svelte`

**Changes:**
- [ ] Add toggle or setting for "Use Cortex Analyst" vs "Use Claude"
- [ ] Update Snowflake query handler to call Cortex Analyst endpoint
- [ ] Store conversation history for multi-turn support
- [ ] Display both SQL and interpretation in UI
- [ ] Add feedback mechanism for query quality

### 2.3 Conversation History Management
- [ ] Store conversation_id in session
- [ ] Build message array with role: "user" and role: "analyst"
- [ ] Clear history on new chat session
- [ ] Implement "Start New Conversation" button

---

## Phase 3: Testing & Validation (1-2 days)

### 3.1 Query Accuracy Testing

**Test Cases:**
1. **Simple Aggregation**
   - Query: "How many cases are in the discovery phase?"
   - Expected: COUNT where PHASE_NAME = 'Discovery'

2. **Time-based Filtering**
   - Query: "Show me cases filed in the last month"
   - Expected: Filter on CREATED_AT with date functions

3. **Client Search**
   - Query: "Who are the top 5 clients by outstanding balance?"
   - Expected: GROUP BY client, ORDER BY SUM(CURRENT_BALANCE)

4. **Multi-turn Conversation**
   - Query 1: "Show me personal injury cases"
   - Query 2: "How many have medical expenses over $100k?"
   - Expected: Context from Q1 carries to Q2

5. **Synonym Handling**
   - Query: "What's the status of case PI-2025-00154?"
   - Expected: Uses PHASE_NAME even though user said "status"

### 3.2 Performance Testing
- [ ] Measure response time (target: <3 seconds)
- [ ] Compare latency: Cortex vs Claude approach
- [ ] Test with concurrent users
- [ ] Verify warehouse auto-suspend behavior

### 3.3 Error Handling
- [ ] Test with ambiguous questions
- [ ] Test with questions outside semantic model scope
- [ ] Verify error messages are user-friendly
- [ ] Test permission/access control

---

## Phase 4: Deployment & Monitoring (1 day)

### 4.1 Environment Configuration
- [ ] Add Cortex Analyst credentials to Vercel environment variables
- [ ] Configure Snowflake warehouse settings
- [ ] Set up stage for semantic model YAML files
- [ ] Configure RBAC roles and permissions

### 4.2 Feature Rollout
- [ ] Deploy to staging environment first
- [ ] Test with limited user group
- [ ] Collect feedback on query accuracy
- [ ] Gradual rollout to production

### 4.3 Monitoring & Alerts
- [ ] Log all Cortex Analyst queries for analysis
- [ ] Monitor query accuracy and errors
- [ ] Track usage patterns
- [ ] Set up alerts for failures

---

## Phase 5: Optimization & Enhancement (Ongoing)

### 5.1 Semantic Model Refinement
- [ ] Add more views (invoices, time entries, documents)
- [ ] Refine synonyms based on user queries
- [ ] Add verified queries as examples in YAML
- [ ] Create relationships between tables

### 5.2 Advanced Features
- [ ] Implement query suggestions based on popular patterns
- [ ] Add export functionality for query results
- [ ] Create saved queries library
- [ ] Build analytics dashboard for query insights

### 5.3 User Experience
- [ ] Add "Did this answer your question?" feedback
- [ ] Implement query refinement suggestions
- [ ] Show sample questions to guide users
- [ ] Add visualization options for results

---

## Success Metrics

### Accuracy
- **Target**: >90% of queries generate correct SQL
- **Measurement**: User feedback + manual review

### Performance
- **Target**: <3 second response time (p95)
- **Measurement**: API latency tracking

### Adoption
- **Target**: 50%+ of Snowflake queries use Cortex Analyst
- **Measurement**: Query logs analysis

### User Satisfaction
- **Target**: 4.5/5 star rating for query quality
- **Measurement**: In-app feedback collection

---

## Risks & Mitigation

### Risk 1: Semantic Model Complexity
**Impact**: High - Poor model = inaccurate queries
**Mitigation**:
- Start with core views only
- Iterate based on usage patterns
- Test thoroughly before adding new tables

### Risk 2: Cortex Analyst Limitations
**Impact**: Medium - May not handle all query types
**Mitigation**:
- Keep Claude-based fallback option
- Document known limitations
- Hybrid approach for edge cases

### Risk 3: Permission/Access Issues
**Impact**: Medium - Users can't access data
**Mitigation**:
- Test RBAC thoroughly
- Clear error messages
- Document permission requirements

### Risk 4: Cost
**Impact**: Low-Medium - Cortex Analyst usage charges
**Mitigation**:
- Monitor Snowflake credits usage
- Set warehouse auto-suspend aggressively
- Implement query result caching

---

## Cost Analysis

### Current Approach (Claude API)
- **Cost**: ~$0.015 per query (Claude API calls)
- **Latency**: 2-4 seconds (Claude) + query execution
- **Scalability**: External API limits

### Cortex Analyst Approach
- **Cost**: Snowflake credits (warehouse compute)
- **Latency**: 1-2 seconds (single call)
- **Scalability**: Native Snowflake scaling

**Expected Savings**: 30-40% reduction in query costs

---

## Timeline Summary

- **Phase 1** (Research & Setup): 1-2 days
- **Phase 2** (API Integration): 2-3 days
- **Phase 3** (Testing): 1-2 days
- **Phase 4** (Deployment): 1 day
- **Phase 5** (Optimization): Ongoing

**Total Initial Implementation**: 5-8 days

---

## Next Steps

1. **Immediate**: Verify Cortex Analyst access on Snowflake account
2. **Day 1**: Create semantic model YAML for PROJECT_LIST view
3. **Day 2**: Test Cortex Analyst REST API with sample queries
4. **Day 3-4**: Implement API endpoint in LOIS
5. **Day 5-6**: Integrate into chat interface
6. **Day 7**: Testing and refinement
7. **Day 8**: Deploy to production

---

## Resources

- **Snowflake Cortex Analyst Docs**: https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst
- **Semantic Model Specification**: https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-analyst/semantic-model-spec
- **Cortex Analyst Quickstart**: https://quickstarts.snowflake.com/guide/getting_started_with_cortex_analyst/
- **API Reference**: (to be added from Snowflake docs)

---

*Project Plan Version 1.0 - Created: October 25, 2025*
