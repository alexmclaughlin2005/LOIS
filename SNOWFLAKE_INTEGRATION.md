# Snowflake Integration for LOIS

**Date**: October 24, 2025
**Status**: ✅ **READY FOR CONFIGURATION**

---

## Overview

LOIS now supports querying data from Snowflake data warehouse. This integration allows you to query your Snowflake database directly from the LOIS chat interface.

---

## Files Created

### 1. **Snowflake Connection Module**
**File**: `frontend/src/lib/snowflake.ts`

**Functions:**
- `createSnowflakeConnection()` - Creates a connection to Snowflake
- `executeSnowflakeQuery(query, binds?)` - Executes a query and returns results
- `testSnowflakeConnection()` - Tests if connection is working
- `getSnowflakeTables()` - Lists all tables in the configured schema
- `getTableSchema(tableName)` - Gets column information for a table

### 2. **API Endpoints**

#### POST `/api/snowflake/query`
Execute a Snowflake query

**Request:**
```json
{
  "query": "SELECT * FROM table_name LIMIT 10",
  "binds": []
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "rowCount": 10
}
```

#### GET `/api/snowflake/test`
Test Snowflake connection and list available tables

**Response:**
```json
{
  "success": true,
  "connected": true,
  "message": "Successfully connected to Snowflake",
  "tables": [
    { "name": "TABLE_NAME", "type": "TABLE" }
  ]
}
```

---

## Setup Instructions

### Step 1: Add Snowflake Credentials to .env

Add the following to `frontend/.env`:

```bash
# Snowflake Configuration
SNOWFLAKE_ACCOUNT=your-account-name
SNOWFLAKE_USER=your-username
SNOWFLAKE_PASSWORD=your-password
SNOWFLAKE_DATABASE=TEAM_THC2
SNOWFLAKE_SCHEMA=DATABRIDGE
SNOWFLAKE_WAREHOUSE=your-warehouse
SNOWFLAKE_ROLE=your-role
```

**Account Format Options:**
- `orgname-accountname` (e.g., `myorg-myaccount`)
- `account.region.cloud` (e.g., `xy12345.us-east-1.aws`)

### Step 2: Install Dependencies

Dependencies are already installed:
```bash
npm install snowflake-sdk  # ✅ Already done
```

### Step 3: Test the Connection

Once credentials are added, test the connection:

```bash
curl http://localhost:5173/api/snowflake/test
```

Expected response:
```json
{
  "success": true,
  "connected": true,
  "message": "Successfully connected to Snowflake",
  "tables": [...]
}
```

---

## Usage Examples

### Example 1: Query Projects Data

```bash
curl -X POST http://localhost:5173/api/snowflake/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_SECTIONS_DATA_V1 LIMIT 10"
  }'
```

### Example 2: Query with Parameters

```bash
curl -X POST http://localhost:5173/api/snowflake/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT * FROM table WHERE status = ? AND date > ?",
    "binds": ["Active", "2025-01-01"]
  }'
```

### Example 3: Use in Frontend

```typescript
async function querySnowflake(query: string) {
  const response = await fetch('/api/snowflake/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  const data = await response.json();
  return data.data; // Array of results
}

// Usage
const results = await querySnowflake(
  'SELECT * FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_SECTIONS_DATA_V1 LIMIT 10'
);
```

---

## Target View

Based on your Python code, the main view you want to query is:

**View Name:** `VW_DATABRIDGE_PROJECT_SECTIONS_DATA_V1`
**Full Path:** `TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_SECTIONS_DATA_V1`

This view is ready to be queried once you provide your Snowflake credentials.

---

## Security Considerations

### Current Implementation
- Credentials stored in `.env` file
- File is in `.gitignore` (not committed to Git)
- Environment variables are private (not exposed to frontend)
- Connections are created per-query and immediately closed

### Production Recommendations
1. **Use Vercel Environment Variables** for deployment
2. **Consider Key Pair Authentication** for enhanced security
3. **Implement Query Validation** to prevent SQL injection
4. **Add Rate Limiting** to prevent abuse
5. **Enable Query Logging** for audit trails

---

## Troubleshooting

### Issue: "Unable to connect to Snowflake"

**Possible Causes:**
1. Incorrect account name format
2. Wrong username/password
3. Network connectivity issues
4. Warehouse not running

**Solutions:**
- Verify account format (use Snowflake web UI URL)
- Check credentials in Snowflake
- Ensure warehouse is running
- Check firewall settings

### Issue: "Table or view not found"

**Cause:** Schema/database not set correctly

**Solution:**
- Verify `SNOWFLAKE_DATABASE` and `SNOWFLAKE_SCHEMA` are correct
- Use fully qualified table names: `DATABASE.SCHEMA.TABLE`

### Issue: "Insufficient privileges"

**Cause:** User doesn't have access to the table/schema

**Solution:**
- Verify role has SELECT privileges
- Check with Snowflake administrator
- Try: `GRANT SELECT ON SCHEMA ... TO ROLE ...`

---

## Next Steps

### 1. Provide Snowflake Credentials
Please provide:
- ✅ Account name (format: `orgname-accountname`)
- ✅ Username
- ✅ Password
- ✅ Warehouse name
- ✅ Role name (if different from user default)

### 2. Test Connection
Once credentials are added, I'll test:
- Connection establishment
- List available tables
- Query the target view
- Verify data structure

### 3. Integrate with LOIS Chat
After successful connection:
- Update query router to support Snowflake queries
- Add Snowflake data source selection
- Enable natural language queries to Snowflake
- Display Snowflake results in the chat interface

---

## Architecture

### Current Data Flow

```
User Query
    ↓
Chat Interface
    ↓
Query Classifier
    ↓
Query Router
    ↓
┌─────────────┬──────────────┐
│   Supabase  │  Snowflake   │
│  (Primary)  │   (New!)     │
└─────────────┴──────────────┘
```

### Snowflake Query Flow

```
1. User sends query in chat
2. Query classifier detects data source
3. If Snowflake:
   a. Generate Snowflake SQL
   b. Call /api/snowflake/query
   c. Execute query via snowflake-sdk
   d. Return results as JSON
4. Display results in chat interface
```

---

## Configuration Reference

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SNOWFLAKE_ACCOUNT` | ✅ | Account identifier | `myorg-myaccount` |
| `SNOWFLAKE_USER` | ✅ | Username | `john.doe@company.com` |
| `SNOWFLAKE_PASSWORD` | ✅ | Password | `your-secure-password` |
| `SNOWFLAKE_DATABASE` | ✅ | Default database | `TEAM_THC2` |
| `SNOWFLAKE_SCHEMA` | ✅ | Default schema | `DATABRIDGE` |
| `SNOWFLAKE_WAREHOUSE` | ✅ | Compute warehouse | `COMPUTE_WH` |
| `SNOWFLAKE_ROLE` | ❌ | User role | `DATA_ANALYST` |

---

## Performance Considerations

### Connection Pooling
- Currently: New connection per query
- Future: Implement connection pool for better performance
- Snowflake SDK handles connection management internally

### Query Optimization
- Use `LIMIT` clauses for large result sets
- Filter data at the database level
- Use appropriate warehouses for query complexity

### Cost Management
- Warehouse usage is billed by Snowflake
- Consider warehouse size based on query complexity
- Auto-suspend warehouses when not in use

---

## Comparison: Supabase vs Snowflake

| Feature | Supabase (Current) | Snowflake (New) |
|---------|-------------------|-----------------|
| **Purpose** | Primary case database | Data warehouse / Analytics |
| **Data Type** | OLTP (Transactional) | OLAP (Analytical) |
| **Query Speed** | Fast for small queries | Fast for large aggregations |
| **Cost** | Per-database | Per-warehouse hour |
| **Best For** | Real-time case data | Historical analysis, reporting |

---

## Implementation Checklist

- [x] Install `snowflake-sdk` package
- [x] Create Snowflake connection module
- [x] Add API endpoints for queries
- [x] Update vite.config for Snowflake SDK
- [x] Create .env template
- [x] Write documentation
- [ ] **Add Snowflake credentials to .env** ⏳ Waiting for you
- [ ] Test connection
- [ ] Query target view
- [ ] Integrate with query router
- [ ] Add to chat interface

---

## Files Modified

- `frontend/package.json` - Added snowflake-sdk
- `frontend/package-lock.json` - Updated dependencies
- `frontend/vite.config.ts` - Externalized snowflake-sdk

## Files Created

- `frontend/src/lib/snowflake.ts` - Connection module
- `frontend/src/routes/api/snowflake/query/+server.ts` - Query endpoint
- `frontend/src/routes/api/snowflake/test/+server.ts` - Test endpoint
- `frontend/.env.snowflake.example` - Configuration template
- `SNOWFLAKE_INTEGRATION.md` - This documentation

---

## Ready for Testing!

The Snowflake integration is fully implemented and ready to use.

**Next:** Please provide your Snowflake credentials so we can test the connection and query your data!

---

**Last Updated**: October 24, 2025
**Status**: ✅ Implementation Complete - Awaiting Credentials
