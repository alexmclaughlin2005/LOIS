/**
 * Cortex Analyst Semantic Model for LOIS Legal Data
 *
 * This YAML model defines the schema, relationships, and synonyms
 * for natural language queries against Snowflake data.
 */

export const CORTEX_SEMANTIC_MODEL = `
name: "LOIS Legal Case Management Data Model"
description: |
  Legal case and project management data for THC2 law firm.

  Key Relationships:
  - Projects (cases) are the central entity, linked by PROJECT_ID
  - People (clients, attorneys, parties) are linked by PERSON_ID
  - Invoices link to projects via PROJECT_ID
  - Notes and communications link to projects via PROJECT_ID
  - Documents link to projects via PROJECT_ID
  - Project sections contain intake, summaries, depositions, medicals, forms

  Typical Case Lifecycle:
  Intake → Discovery → Litigation → Settlement → Settled → Archived

  Common Project Types:
  Personal Injury, Family Law, Criminal Defense, Civil Litigation, etc.

  Primary workflow: Projects → People → Invoices → Transactions → Documents

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
        synonyms: ["case type", "matter type", "type of case", "project category", "lawsuit type", "personal injury", "family law", "criminal defense", "civil litigation"]
        description: "Type or category of the legal matter (e.g., Personal Injury, Family Law, Criminal Defense, Civil Litigation, etc.)"
        expr: PROJECT_TYPE_NAME
        data_type: TEXT
        sample_values: ["Personal Injury", "Family Law", "Criminal Defense", "Civil Litigation"]

      - name: phase
        synonyms: ["status", "stage", "current phase", "case status", "project status", "intake", "discovery", "litigation", "settlement", "settled", "archived", "closed"]
        description: "Current phase or status of the case. Typical lifecycle: Intake → Discovery → Litigation → Settlement → Settled → Archived"
        expr: PHASE_NAME
        data_type: TEXT
        sample_values: ["Intake", "Discovery", "Litigation", "Settlement", "Settled", "Archived"]

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
    description: "Invoice records and billing information. Links to projects via PROJECT_ID."
    base_table:
      database: TEAM_THC2
      schema: DATABRIDGE
      table: VW_DATABRIDGE_INVOICE_DATA_V1

    dimensions:
      - name: invoice_id
        synonyms: ["invoice number", "bill number", "id"]
        description: "Unique invoice identifier"
        expr: ID
        data_type: NUMBER
        unique: true

      - name: project_id
        synonyms: ["case id", "project identifier"]
        description: "Links invoice to a specific case/project"
        expr: PROJECT_ID
        data_type: NUMBER

      - name: invoice_number
        synonyms: ["bill number", "invoice num"]
        description: "Invoice number"
        expr: INVOICE_NUMBER
        data_type: NUMBER

      - name: description
        synonyms: ["invoice description", "bill description", "notes"]
        description: "Description or notes on the invoice"
        expr: DESCRIPTION
        data_type: TEXT

      - name: invoice_date
        synonyms: ["date", "bill date", "invoiced date"]
        description: "Date the invoice was created"
        expr: INVOICE_DATE
        data_type: DATE

      - name: due_date
        synonyms: ["payment due date", "due"]
        description: "Date payment is due"
        expr: DUE_DATE
        data_type: DATE

      - name: sent_date
        synonyms: ["date sent", "mailed date"]
        description: "Date the invoice was sent to client"
        expr: SENT_DATE
        data_type: DATE

      - name: finalized_date
        synonyms: ["date finalized", "completed date"]
        description: "Date the invoice was finalized"
        expr: FINALIZED_DATE
        data_type: DATE

      - name: voided_date
        synonyms: ["date voided", "cancelled date"]
        description: "Date the invoice was voided (null if not voided)"
        expr: VOIDED_DATE
        data_type: DATE

      - name: total
        synonyms: ["invoice total", "amount", "bill amount", "invoice amount"]
        description: "Total invoice amount"
        expr: TOTAL
        data_type: NUMBER

      - name: outstanding_balance
        synonyms: ["balance", "amount due", "unpaid", "owed", "remaining balance"]
        description: "Outstanding balance still owed on this invoice"
        expr: OUTSTANDING_BALANCE
        data_type: NUMBER

    measures:
      - name: total_invoices
        synonyms: ["invoice count", "number of invoices", "how many invoices"]
        description: "Total number of invoices"
        expr: COUNT(*)
        data_type: NUMBER

      - name: total_invoice_amount
        synonyms: ["sum of invoices", "total billed", "total invoiced"]
        description: "Sum of all invoice totals"
        expr: SUM(TOTAL)
        data_type: NUMBER

      - name: total_outstanding
        synonyms: ["total unpaid", "total balance due", "sum of outstanding"]
        description: "Sum of all outstanding balances"
        expr: SUM(OUTSTANDING_BALANCE)
        data_type: NUMBER

  - name: VW_DATABRIDGE_DOCS_V1
    description: "Document metadata and references for cases. Links to projects via PROJECT_ID."
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

      - name: project_id
        synonyms: ["case id", "project identifier", "case number"]
        description: "Links document to a specific case/project"
        expr: PROJECT_ID
        data_type: NUMBER

      - name: file_name
        synonyms: ["filename", "document name", "file"]
        description: "Name of the document file"
        expr: FILE_NAME
        data_type: TEXT

    measures:
      - name: total_documents
        synonyms: ["number of documents", "document count", "how many documents", "doc count", "number of files"]
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

  - name: VW_DATABRIDGE_PROJECT_SECTIONS_DATA_V1
    description: "Project organization and case management sections. Contains data points for intake, summaries, depositions, medicals, forms, and other case tracking information."
    base_table:
      database: TEAM_THC2
      schema: DATABRIDGE
      table: VW_DATABRIDGE_PROJECT_SECTIONS_DATA_V1

    dimensions:
      - name: project_id
        synonyms: ["case id", "project identifier"]
        description: "Links section data to a specific case/project"
        expr: PROJECT_ID
        data_type: NUMBER

      - name: section_name
        synonyms: ["section", "category", "intake", "summary", "depositions", "medicals", "forms", "case section"]
        description: "Name of the project section (e.g., Intake, Summary, Depositions, Medicals, Forms)"
        expr: SECTION_NAME
        data_type: TEXT
        sample_values: ["Intake", "Summary", "Depositions", "Medicals", "Forms"]

  - name: VW_DATABRIDGE_NOTES_DATA_V1
    description: "Notes, tasks, communications, and phone calls linked to cases. Includes email, task assignments, and phone call tracking."
    base_table:
      database: TEAM_THC2
      schema: DATABRIDGE
      table: VW_DATABRIDGE_NOTES_DATA_V1

    dimensions:
      - name: note_id
        synonyms: ["id", "note identifier"]
        description: "Unique note identifier"
        expr: NOTE_ID
        data_type: NUMBER
        unique: true

      - name: project_id
        synonyms: ["case id", "project identifier"]
        description: "Links note to a specific case/project"
        expr: PROJECT_ID
        data_type: NUMBER

      - name: subject
        synonyms: ["title", "note subject", "note title", "task name"]
        description: "Subject or title of the note or task"
        expr: SUBJECT
        data_type: TEXT

      - name: body
        synonyms: ["content", "note content", "note text", "message", "description"]
        description: "Full body text of the note or communication"
        expr: BODY
        data_type: TEXT

      - name: is_phone_call
        synonyms: ["phone call", "call", "phone"]
        description: "Indicates if this is a phone call record"
        expr: IS_PHONE_CALL
        data_type: BOOLEAN

      - name: completed_date
        synonyms: ["completion date", "done date", "finished date", "task completed"]
        description: "Date when the task was completed"
        expr: COMPLETED_DATE
        data_type: DATE

    measures:
      - name: total_notes
        synonyms: ["number of notes", "note count", "how many notes", "communication count"]
        description: "Total number of notes and communications"
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

  - name: documents_by_case
    question: "How many documents does each case have?"
    sql: |
      SELECT
        p.PROJECT_NUMBER,
        p.PROJECT_NAME,
        COUNT(d.DOC_ID) as document_count
      FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1 p
      LEFT JOIN TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_DOCS_V1 d
        ON p.PROJECT_ID = d.PROJECT_ID
      GROUP BY p.PROJECT_NUMBER, p.PROJECT_NAME
      ORDER BY document_count DESC
      LIMIT 100

  - name: cases_with_outstanding_balance
    question: "Show me all cases with outstanding balances"
    sql: |
      SELECT
        PROJECT_NUMBER,
        PROJECT_NAME,
        CLIENT_FULL_NAME,
        CURRENT_BALANCE,
        PHASE_NAME
      FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
      WHERE CURRENT_BALANCE > 0
      ORDER BY CURRENT_BALANCE DESC
      LIMIT 100

  - name: active_cases_by_type
    question: "How many active cases do we have by type?"
    sql: |
      SELECT
        PROJECT_TYPE_NAME,
        COUNT(*) as case_count
      FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
      WHERE PHASE_NAME NOT IN ('Archived', 'Settled', 'Closed')
      GROUP BY PROJECT_TYPE_NAME
      ORDER BY case_count DESC
      LIMIT 100

  - name: litigation_phase_cases
    question: "Show me all cases in the litigation phase"
    sql: |
      SELECT
        PROJECT_NUMBER,
        PROJECT_NAME,
        CLIENT_FULL_NAME,
        FIRST_PRIMARY_USER_FULL_NAME as attorney,
        PHASE_DATE
      FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
      WHERE PHASE_NAME = 'Litigation'
      ORDER BY PHASE_DATE DESC
      LIMIT 100
`;
