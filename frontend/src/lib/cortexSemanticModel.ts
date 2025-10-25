/**
 * Cortex Analyst Semantic Model for LOIS Legal Data
 *
 * This YAML model defines the schema, relationships, and synonyms
 * for natural language queries against Snowflake data.
 */

export const CORTEX_SEMANTIC_MODEL = `
name: "LOIS Legal Case Management Data Model"
description: "Legal case and project management data for THC2 law firm"

tables:
  - name: VW_DATABRIDGE_PROJECT_LIST_DATA_V1
    description: "Main view for legal cases and projects. Use this as the primary source for case queries."
    base_table:
      database: TEAM_THC2
      schema: DATABRIDGE
      table: VW_DATABRIDGE_PROJECT_LIST_DATA_V1

    dimensions:
      - name: project_id
        synonyms: ["case id", "project identifier", "id"]
        description: "Unique identifier for the project/case"
        expr: PROJECT_ID
        data_type: NUMBER
        unique: true

      - name: project_name
        synonyms: ["case name", "project title", "matter name", "case title"]
        description: "Name of the legal case or project"
        expr: PROJECT_NAME
        data_type: TEXT

      - name: project_number
        synonyms: ["case number", "matter number", "docket number", "file number"]
        description: "Official case or project number"
        expr: PROJECT_NUMBER
        data_type: TEXT

      - name: project_type
        synonyms: ["case type", "matter type", "type of case", "project category"]
        description: "Type or category of the legal matter"
        expr: PROJECT_TYPE_NAME
        data_type: TEXT

      - name: phase
        synonyms: ["status", "stage", "current phase", "case status", "project status", "discovery phase", "trial phase", "pre-trial", "settlement"]
        description: "Current phase or status of the case (e.g., Discovery, Trial, Settlement, Pre-Trial, Closed)"
        expr: PHASE_NAME
        data_type: TEXT
        sample_values: ["Discovery", "Trial", "Settlement", "Pre-Trial", "Closed", "Investigation"]

      - name: phase_date
        synonyms: ["phase change date", "status date", "last updated", "status change date"]
        description: "Date when the case phase was last changed"
        expr: PHASE_DATE
        data_type: DATE

      - name: client_name
        synonyms: ["client", "client full name", "primary contact", "customer name", "claimant"]
        description: "Primary client or contact for the case"
        expr: CLIENT_FULL_NAME
        data_type: TEXT

      - name: attorney
        synonyms: ["primary attorney", "lead attorney", "lawyer", "primary user", "case attorney", "assigned attorney"]
        description: "Primary attorney or user assigned to the case"
        expr: FIRST_PRIMARY_USER_FULL_NAME
        data_type: TEXT

      - name: created_date
        synonyms: ["creation date", "date created", "opened date", "case opened", "start date"]
        description: "Date when the case was created or opened"
        expr: CREATED_AT
        data_type: DATE

      - name: current_balance
        synonyms: ["balance", "outstanding balance", "amount due", "invoice balance", "owed amount"]
        description: "Current outstanding invoice balance for the case"
        expr: CURRENT_BALANCE
        data_type: NUMBER

    measures:
      - name: total_cases
        synonyms: ["number of cases", "case count", "count of cases", "how many cases", "total projects"]
        description: "Total number of cases or projects"
        expr: COUNT(*)
        data_type: NUMBER

      - name: total_balance
        synonyms: ["total amount due", "total outstanding", "sum of balances", "total owed"]
        description: "Sum of all outstanding balances"
        expr: SUM(CURRENT_BALANCE)
        data_type: NUMBER

      - name: average_balance
        synonyms: ["avg balance", "mean balance", "average amount due"]
        description: "Average outstanding balance per case"
        expr: AVG(CURRENT_BALANCE)
        data_type: NUMBER

  - name: VW_DATABRIDGE_CLIENT_INFO_V1
    description: "Core client information and demographics"
    base_table:
      database: TEAM_THC2
      schema: DATABRIDGE
      table: VW_DATABRIDGE_CLIENT_INFO_V1

    dimensions:
      - name: client_id
        description: "Unique client identifier"
        expr: CLIENT_ID
        data_type: NUMBER
        unique: true

  - name: VW_DATABRIDGE_INVOICE_DATA_V1
    description: "Invoice records and billing information"
    base_table:
      database: TEAM_THC2
      schema: DATABRIDGE
      table: VW_DATABRIDGE_INVOICE_DATA_V1

    dimensions:
      - name: invoice_id
        synonyms: ["invoice number", "bill number"]
        description: "Unique invoice identifier"
        expr: INVOICE_ID
        data_type: NUMBER
        unique: true

  - name: VW_DATABRIDGE_DOCS_V1
    description: "Document metadata and references for cases"
    base_table:
      database: TEAM_THC2
      schema: DATABRIDGE
      table: VW_DATABRIDGE_DOCS_V1

    dimensions:
      - name: doc_id
        synonyms: ["document id", "file id"]
        description: "Unique document identifier"
        expr: DOC_ID
        data_type: NUMBER
        unique: true

    measures:
      - name: total_documents
        synonyms: ["number of documents", "document count", "how many documents", "doc count"]
        description: "Total number of documents"
        expr: COUNT(*)
        data_type: NUMBER

  - name: VW_DATABRIDGE_USERS_V1
    description: "System users including attorneys and staff"
    base_table:
      database: TEAM_THC2
      schema: DATABRIDGE
      table: VW_DATABRIDGE_USERS_V1

    dimensions:
      - name: user_id
        synonyms: ["attorney id", "staff id"]
        description: "Unique user identifier"
        expr: USER_ID
        data_type: NUMBER
        unique: true

    measures:
      - name: total_users
        synonyms: ["number of users", "user count", "how many attorneys", "staff count"]
        description: "Total number of users"
        expr: COUNT(*)
        data_type: NUMBER

verified_queries:
  - name: cases_by_phase
    question: "How many cases are in each phase?"
    sql: |
      SELECT PHASE_NAME, COUNT(*) as case_count
      FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
      GROUP BY PHASE_NAME
      ORDER BY case_count DESC
      LIMIT 100

  - name: discovery_phase_cases
    question: "How many cases are in the discovery phase?"
    sql: |
      SELECT COUNT(*) as discovery_cases
      FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
      WHERE PHASE_NAME = 'Discovery'
      LIMIT 100

  - name: cases_by_attorney
    question: "How many cases does each attorney have?"
    sql: |
      SELECT FIRST_PRIMARY_USER_FULL_NAME as attorney, COUNT(*) as case_count
      FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
      WHERE FIRST_PRIMARY_USER_FULL_NAME IS NOT NULL
      GROUP BY FIRST_PRIMARY_USER_FULL_NAME
      ORDER BY case_count DESC
      LIMIT 100

  - name: outstanding_balances
    question: "What is the total outstanding balance across all cases?"
    sql: |
      SELECT SUM(CURRENT_BALANCE) as total_outstanding
      FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
      WHERE CURRENT_BALANCE > 0
      LIMIT 100

  - name: recent_cases
    question: "Show me cases created in the last 30 days"
    sql: |
      SELECT PROJECT_NUMBER, PROJECT_NAME, CREATED_AT, CLIENT_FULL_NAME, PHASE_NAME
      FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
      WHERE CREATED_AT >= DATEADD(day, -30, CURRENT_DATE())
      ORDER BY CREATED_AT DESC
      LIMIT 100
`;
