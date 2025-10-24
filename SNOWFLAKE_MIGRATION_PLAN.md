# Snowflake Migration Plan

**Status**: Future consideration (Phase 5+)
**Current**: Using Supabase PostgreSQL
**Target**: Hybrid architecture with Snowflake for analytics

---

## Strategic Approach: Hybrid Architecture

Rather than replacing Supabase with Snowflake, we'll add Snowflake as an **analytics layer** while keeping Supabase for operational data.

```
┌─────────────────────────────────────────────────────┐
│            LOIS Frontend (SvelteKit)                │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
               ▼                      ▼
        ┌─────────────┐        ┌─────────────┐
        │  Supabase   │  ETL   │  Snowflake  │
        │ PostgreSQL  │───────>│             │
        └─────────────┘        └─────────────┘

     OPERATIONAL              ANALYTICAL
     - Live chat              - Complex analytics
     - CRUD operations        - BI dashboards
     - Real-time updates      - Trend analysis
     - User authentication    - Multi-tenant reporting
     - Routine execution      - Historical analysis
     - <1M records            - Millions of records
```

---

## When to Migrate

### Triggers for Adding Snowflake

Migrate when you hit **any** of these conditions:

1. **Data Volume**
   - ✅ >1M cases in database
   - ✅ >10M time entries
   - ✅ >5M documents
   - ✅ PostgreSQL queries taking >5 seconds

2. **Analytics Requirements**
   - ✅ Need complex cross-firm analytics
   - ✅ Executive dashboards with heavy aggregations
   - ✅ Machine learning on historical data
   - ✅ Multi-year trend analysis

3. **Business Growth**
   - ✅ Multiple law firms using system (multi-tenant)
   - ✅ Need to share data between organizations
   - ✅ Compliance requires data warehouse
   - ✅ BI team wants Tableau/Looker/Power BI

4. **Performance Issues**
   - ✅ Reports timing out
   - ✅ Complex queries blocking operational queries
   - ✅ Need query result caching
   - ✅ Peak usage causing slowdowns

5. **Budget Available**
   - ✅ $500+/month for analytics infrastructure
   - ✅ Engineering resources for ETL pipeline
   - ✅ Data engineering team available

**Rule of Thumb**: If 80% of queries are simple CRUD and 20% are complex analytics, add Snowflake for the 20%.

---

## Migration Phases

### Phase 5A: Preparation (2 weeks)

**Week 1: Assessment**
- [ ] Audit current query patterns (operational vs. analytical)
- [ ] Identify slow/complex queries (>2 seconds)
- [ ] Calculate current PostgreSQL database size
- [ ] Document data retention requirements
- [ ] Estimate Snowflake costs based on query volume

**Week 2: Architecture Design**
- [ ] Design star schema for Snowflake (fact/dimension tables)
- [ ] Plan ETL pipeline (batch frequency, tools)
- [ ] Design data partitioning strategy
- [ ] Define aggregation tables for common reports
- [ ] Plan query routing logic (operational → Supabase, analytical → Snowflake)

### Phase 5B: Snowflake Setup (2 weeks)

**Week 1: Infrastructure**
- [ ] Create Snowflake account (choose AWS region matching Supabase)
- [ ] Set up warehouses (compute clusters):
  - `REPORTING_WH` - Small (for dashboards)
  - `ETL_WH` - Medium (for data loading)
  - `ANALYTICS_WH` - Large (for complex queries)
- [ ] Configure resource monitors (cost controls)
- [ ] Set up user roles and permissions
- [ ] Configure network policies (IP whitelisting)

**Week 2: Schema Creation**
```sql
-- Create dimensional model
CREATE DATABASE lois_analytics;
USE DATABASE lois_analytics;

-- Dimension tables
CREATE TABLE dim_projects (
  project_key NUMBER AUTOINCREMENT,
  project_id STRING,
  case_number STRING,
  case_type STRING,
  status STRING,
  filing_date DATE,
  -- SCD Type 2 fields
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  is_current BOOLEAN
);

CREATE TABLE dim_attorneys (
  attorney_key NUMBER AUTOINCREMENT,
  attorney_id STRING,
  full_name STRING,
  seniority_level STRING,
  hourly_rate NUMBER(10,2),
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  is_current BOOLEAN
);

CREATE TABLE dim_time_periods (
  date_key NUMBER,
  date DATE,
  year NUMBER,
  quarter NUMBER,
  month NUMBER,
  week NUMBER,
  day_of_week NUMBER,
  is_business_day BOOLEAN
);

-- Fact tables
CREATE TABLE fact_time_entries (
  time_entry_key NUMBER AUTOINCREMENT,
  date_key NUMBER,
  project_key NUMBER,
  attorney_key NUMBER,
  hours NUMBER(5,2),
  hourly_rate NUMBER(10,2),
  total_amount NUMBER(10,2),
  activity_type STRING,
  is_billable BOOLEAN,
  entry_timestamp TIMESTAMP
);

CREATE TABLE fact_case_activities (
  activity_key NUMBER AUTOINCREMENT,
  date_key NUMBER,
  project_key NUMBER,
  activity_type STRING, -- 'document_filed', 'hearing', 'settlement', etc.
  activity_metadata VARIANT, -- JSON for flexible attributes
  activity_timestamp TIMESTAMP
);

-- Aggregation tables (pre-computed for speed)
CREATE TABLE agg_monthly_billing (
  year_month STRING,
  project_key NUMBER,
  attorney_key NUMBER,
  total_hours NUMBER(10,2),
  total_revenue NUMBER(12,2),
  billable_percentage NUMBER(5,2)
);
```

### Phase 5C: ETL Pipeline (3 weeks)

**Option 1: Fivetran (Recommended - Easiest)**
```bash
# Cost: ~$100-300/month
# Setup time: 1-2 hours
# Maintenance: Minimal

1. Sign up for Fivetran
2. Connect Supabase as source
3. Connect Snowflake as destination
4. Configure sync schedule (hourly/daily)
5. Enable auto-schema detection
6. Done! ✅
```

**Option 2: dbt + Airflow (Most Flexible)**
```bash
# Cost: $0 (open source) + compute costs
# Setup time: 2-3 weeks
# Maintenance: Medium

# Install tools
pip install dbt-snowflake apache-airflow

# dbt project structure
lois-analytics/
├── models/
│   ├── staging/
│   │   ├── stg_projects.sql
│   │   ├── stg_time_entries.sql
│   │   └── stg_documents.sql
│   ├── intermediate/
│   │   ├── int_case_metrics.sql
│   │   └── int_attorney_performance.sql
│   └── marts/
│       ├── fact_time_entries.sql
│       ├── dim_projects.sql
│       └── agg_monthly_billing.sql
├── dbt_project.yml
└── profiles.yml

# Airflow DAG
from airflow import DAG
from airflow.operators.bash import BashOperator

dag = DAG(
  'lois_etl_daily',
  schedule_interval='0 2 * * *',  # 2 AM daily
  catchup=False
)

extract = BashOperator(
  task_id='extract_from_supabase',
  bash_command='python /etl/extract.py',
  dag=dag
)

transform = BashOperator(
  task_id='dbt_run',
  bash_command='cd /dbt && dbt run',
  dag=dag
)

extract >> transform
```

**Option 3: Custom Python Script (Most Control)**
```python
# etl/supabase_to_snowflake.py
import os
from supabase import create_client
import snowflake.connector
from datetime import datetime, timedelta

# Connect to both databases
supabase = create_client(
  os.getenv('SUPABASE_URL'),
  os.getenv('SUPABASE_SERVICE_KEY')
)

snowflake_conn = snowflake.connector.connect(
  account=os.getenv('SNOWFLAKE_ACCOUNT'),
  user=os.getenv('SNOWFLAKE_USER'),
  password=os.getenv('SNOWFLAKE_PASSWORD'),
  warehouse='ETL_WH',
  database='lois_analytics'
)

def extract_incremental_data(table_name, last_sync_time):
  """Extract only changed records since last sync"""
  response = supabase.table(table_name)\
    .select('*')\
    .gte('updated_at', last_sync_time)\
    .execute()
  return response.data

def transform_projects(records):
  """Transform projects to dimensional model"""
  transformed = []
  for record in records:
    transformed.append({
      'project_id': record['id'],
      'case_number': record['case_number'],
      'case_type': record['case_type'],
      'status': record['status'],
      'filing_date': record['filing_date'],
      'estimated_value': record['estimated_value'],
      'custom_fields': json.dumps(record['custom_fields']),
      'valid_from': record['updated_at'],
      'is_current': True
    })
  return transformed

def load_to_snowflake(table_name, records):
  """Bulk load to Snowflake"""
  cursor = snowflake_conn.cursor()

  # Use Snowflake's MERGE for upserts
  cursor.execute(f"""
    MERGE INTO {table_name} t
    USING temp_stage s ON t.project_id = s.project_id
    WHEN MATCHED THEN UPDATE SET
      t.is_current = FALSE,
      t.valid_to = CURRENT_TIMESTAMP()
    WHEN NOT MATCHED THEN INSERT (...)
  """)

  cursor.close()

# Run ETL
if __name__ == '__main__':
  last_sync = get_last_sync_time()

  # Extract
  projects = extract_incremental_data('projects', last_sync)
  time_entries = extract_incremental_data('time_entries', last_sync)

  # Transform
  dim_projects = transform_projects(projects)
  fact_time = transform_time_entries(time_entries)

  # Load
  load_to_snowflake('dim_projects', dim_projects)
  load_to_snowflake('fact_time_entries', fact_time)

  # Update sync timestamp
  save_last_sync_time(datetime.now())
```

**Recommended**: Start with **Fivetran** for simplicity, migrate to dbt+Airflow if you need more control.

### Phase 5D: Query Routing (2 weeks)

**Update Frontend API to Route Queries**

```typescript
// frontend/src/lib/queryRouter.ts

export type QueryType = 'operational' | 'analytical';

export function determineQueryType(query: string): QueryType {
  const analyticalKeywords = [
    'trend', 'analyze', 'report', 'dashboard',
    'avg', 'sum', 'group by', 'aggregate',
    'last 12 months', 'year over year', 'compare'
  ];

  const queryLower = query.toLowerCase();
  const isAnalytical = analyticalKeywords.some(kw => queryLower.includes(kw));

  return isAnalytical ? 'analytical' : 'operational';
}

export async function executeQuery(query: string) {
  const queryType = determineQueryType(query);

  if (queryType === 'operational') {
    // Fast queries → Supabase
    return await executeSupabaseQuery(query);
  } else {
    // Complex analytics → Snowflake
    return await executeSnowflakeQuery(query);
  }
}

async function executeSupabaseQuery(query: string) {
  // Current implementation
  const { data } = await supabase
    .from('projects')
    .select('*')
    .limit(100);
  return data;
}

async function executeSnowflakeQuery(query: string) {
  // Call backend API (Snowflake queries must go through backend)
  const response = await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  return await response.json();
}
```

**Backend API for Snowflake Queries**

```typescript
// backend/src/routes/analytics.ts
import snowflake from 'snowflake-sdk';

const connection = snowflake.createConnection({
  account: process.env.SNOWFLAKE_ACCOUNT,
  username: process.env.SNOWFLAKE_USER,
  password: process.env.SNOWFLAKE_PASSWORD,
  warehouse: 'REPORTING_WH',
  database: 'lois_analytics'
});

export async function POST(request: Request) {
  const { query } = await request.json();

  // Security: Validate query (prevent SQL injection)
  if (!isValidQuery(query)) {
    return Response.json({ error: 'Invalid query' }, { status: 400 });
  }

  // Execute query
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: query,
      complete: (err, stmt, rows) => {
        if (err) {
          reject(Response.json({ error: err.message }, { status: 500 }));
        } else {
          resolve(Response.json({ data: rows }));
        }
      }
    });
  });
}

function isValidQuery(query: string): boolean {
  // Whitelist allowed queries/patterns
  // Prevent DROP, DELETE, UPDATE, etc.
  const dangerous = ['drop', 'delete', 'update', 'insert', 'create'];
  const queryLower = query.toLowerCase();
  return !dangerous.some(kw => queryLower.includes(kw));
}
```

### Phase 5E: BI Tool Integration (1 week)

**Connect Tableau/Looker/Power BI**

```yaml
# Snowflake connection for BI tools
connection:
  type: snowflake
  account: xyz123.us-east-1
  warehouse: REPORTING_WH
  database: lois_analytics
  schema: marts
  role: ANALYST_ROLE

# Pre-built dashboards
dashboards:
  - name: "Executive Overview"
    queries:
      - monthly_revenue_by_case_type
      - attorney_utilization_rates
      - case_pipeline_funnel
      - settlement_success_rates

  - name: "Billing Analytics"
    queries:
      - billable_hours_by_attorney
      - realization_rates
      - write_offs_analysis
      - payment_aging_report

  - name: "Case Performance"
    queries:
      - case_duration_by_type
      - success_rate_by_attorney
      - cost_per_case_analysis
      - settlement_amount_trends
```

---

## Cost Estimates

### Current (Supabase Only)
- **Free Tier**: $0/month (up to 500 MB)
- **Pro Tier**: $25/month (8 GB, perfect for 100K cases)
- **Total**: $0-25/month

### After Snowflake Migration
- **Supabase Pro**: $25/month (operational data)
- **Snowflake Compute**: $150-300/month
  - REPORTING_WH (X-Small): ~$0.0003/sec = $50-100/month
  - ETL_WH (Small): ~$0.0011/sec = $50-100/month
  - ANALYTICS_WH (Medium): ~$0.0044/sec = $50-100/month (on-demand)
- **Snowflake Storage**: $10-30/month (~100 GB compressed)
- **Fivetran ETL**: $100-200/month (or $0 if custom scripts)
- **BI Tool**: $70-500/month (Looker Studio free, Tableau ~$70/user)
- **Total**: $355-1,055/month

**ROI Threshold**: Worthwhile when complex analytics saves >10 hours/month of manual work ($150/hour attorney time = $1,500 value)

---

## Data Migration Strategy

### One-Time Historical Load

```bash
# 1. Export from Supabase
pg_dump "postgresql://postgres:password@db.xxx.supabase.co:5432/postgres" \
  --table=projects \
  --table=time_entries \
  --table=documents \
  --format=custom \
  --file=supabase_backup.dump

# 2. Convert to Snowflake-compatible format
python convert_to_snowflake.py supabase_backup.dump > snowflake_data.csv

# 3. Load to Snowflake
snowsql -a xyz123.us-east-1 -u admin -d lois_analytics << EOF
  PUT file://snowflake_data.csv @~;

  COPY INTO dim_projects
  FROM @~/snowflake_data.csv
  FILE_FORMAT = (TYPE = CSV SKIP_HEADER = 1);

  SELECT COUNT(*) FROM dim_projects;
EOF
```

### Ongoing Incremental Sync

```sql
-- Fivetran or dbt handles this automatically
-- Custom approach: Track last sync timestamp

CREATE TABLE etl_metadata (
  table_name STRING,
  last_sync_timestamp TIMESTAMP,
  records_synced NUMBER
);

-- ETL script checks this table
-- Only syncs records updated after last_sync_timestamp
```

---

## Testing & Validation

### Pre-Migration Checklist

- [ ] Compare query results: Supabase vs. Snowflake (should match)
- [ ] Performance test: Measure query times
- [ ] Cost test: Run sample workload, check Snowflake credits used
- [ ] Security audit: Verify permissions, encryption
- [ ] Backup plan: Keep Supabase data, can roll back if needed

### Post-Migration Monitoring

```sql
-- Monitor Snowflake costs
SELECT
  DATE_TRUNC('day', start_time) as day,
  warehouse_name,
  SUM(credits_used) as credits,
  SUM(credits_used) * 2.5 as cost_usd  -- Adjust for your pricing
FROM snowflake.account_usage.warehouse_metering_history
WHERE start_time >= DATEADD('day', -30, CURRENT_TIMESTAMP())
GROUP BY day, warehouse_name
ORDER BY day DESC;

-- Monitor query performance
SELECT
  query_text,
  execution_time / 1000 as seconds,
  warehouse_size,
  credits_used_cloud_services
FROM snowflake.account_usage.query_history
WHERE start_time >= DATEADD('day', -7, CURRENT_TIMESTAMP())
  AND execution_time > 5000  -- >5 seconds
ORDER BY execution_time DESC
LIMIT 20;
```

---

## Rollback Plan

If Snowflake doesn't work out:

1. **Keep Supabase running** - Never delete operational data
2. **Turn off ETL** - Stop syncing to Snowflake
3. **Redirect queries** - Point all queries back to Supabase
4. **Cancel Snowflake** - No long-term contracts required
5. **Lessons learned** - Document what didn't work

**Risk**: Low. Snowflake is additive, not replacing Supabase.

---

## Decision Criteria

Use this scorecard when deciding to migrate:

| Criteria | Weight | Score (1-5) | Weighted |
|----------|--------|-------------|----------|
| Data volume (>1M cases) | 25% | ? | |
| Query complexity (>5s) | 20% | ? | |
| BI tool requirements | 15% | ? | |
| Budget available ($500+) | 15% | ? | |
| Multi-tenant needs | 10% | ? | |
| Performance issues | 10% | ? | |
| Engineering capacity | 5% | ? | |
| **Total** | 100% | | **?/5** |

**Threshold**: Score >3.5 = Migrate now, <2.5 = Wait, 2.5-3.5 = Start planning

---

## Timeline Summary

| Phase | Duration | Effort | Cost |
|-------|----------|--------|------|
| 5A: Preparation | 2 weeks | 40 hours | $0 |
| 5B: Setup | 2 weeks | 40 hours | $100 |
| 5C: ETL | 3 weeks | 60 hours | $300 |
| 5D: Routing | 2 weeks | 40 hours | $0 |
| 5E: BI Tools | 1 week | 20 hours | $200 |
| **Total** | **10 weeks** | **200 hours** | **$600** |

**Plus ongoing**: $355-1,055/month operational costs

---

## Key Takeaways

1. ✅ **Hybrid is best** - Keep Supabase for operations, add Snowflake for analytics
2. ✅ **Start with Supabase** - You made the right call
3. ✅ **Migrate when needed** - Clear triggers outlined above
4. ✅ **Plan for success** - This document ensures smooth transition
5. ✅ **Low risk** - Additive approach, can always roll back

**You're well-positioned for future growth!** 🚀

---

## Next Steps (When Ready)

1. Monitor Supabase query performance
2. Track when analytical queries start slowing down
3. Estimate monthly Snowflake costs based on query volume
4. Revisit this plan when you hit migration triggers
5. Budget 10 weeks + $600 setup costs + $355-1,055/month

**Current status**: Continue with Supabase implementation (Phases 1-4). Revisit Snowflake at Phase 5 or when triggers are met.
