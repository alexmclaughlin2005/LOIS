/**
 * Snowflake Schema Context for LLM
 *
 * This provides a focused schema description for TEAM_THC2.DATABRIDGE
 * which contains all the legal/project data views
 */

export const SNOWFLAKE_SCHEMA_CONTEXT = `
# Snowflake Data Warehouse Schema

## Database: TEAM_THC2
### Schema: DATABRIDGE

This schema contains views with legal case and project data.

#### Available Views:

**VW_CLIENT_AUDIT_DATA_V1**
- Contains audit trail data for client activities
- Useful for tracking client interactions and changes

**VW_DATABRIDGE_BILLING_CONTACT_DATA_V1**
- Billing contact information for clients
- Links clients to their billing contacts

**VW_DATABRIDGE_BILLING_TRANSACTION_DATA_V1**
- Payment transactions and refunds applied to invoices
- NOTE: This does NOT contain invoice line items (time entries/expenses)
- Key columns:
  * ID - Unique transaction identifier
  * PROJECT_ID - Links to project/case
  * INVOICE_ID - Links to invoice
  * TRANSACTION_TYPE - Type: 'PAYMENT', 'REFUND', etc.
  * TOTAL - Payment amount
  * AMOUNT_APPLIED_TO_INVOICE - How much was applied to the invoice
  * DATE - Date of transaction
  * DATE_APPLIED - When payment was applied
  * SOURCE - Payment source (e.g., 'FV Payments')
  * REFERENCE_NUMBER - Payment reference
  * IS_VOID - Whether transaction was voided
  * IS_WRITE_OFF - Whether this is a write-off

**VW_DATABRIDGE_CLIENT_INFO_V1**
- Core client information
- Client demographics and basic data

**VW_DATABRIDGE_COMMENTS_DATA_V1**
- Comments and notes on cases/projects
- User-generated annotations

**VW_DATABRIDGE_DATA_DICTIONARY_V1**
- Data dictionary and metadata
- Describes other tables and fields

**VW_DATABRIDGE_DOCS_V1**
- Document metadata and references
- Links to case documents

**VW_DATABRIDGE_INVOICE_DATA_V1**
- Invoice records and billing information
- Key columns:
  * ID - Unique invoice identifier
  * INVOICE_NUMBER - Invoice number
  * PROJECT_ID - Links to project/case
  * INVOICE_DATE - Date invoice was created
  * DUE_DATE - Payment due date
  * SENT_DATE - Date invoice was sent to client
  * FINALIZED_DATE - Date invoice was finalized (NULL = draft/unbilled)
  * VOIDED_DATE - Date invoice was voided (NULL = not voided)
  * TOTAL - Total invoice amount
  * OUTSTANDING_BALANCE - Amount still owed
  * CREATED_DATE - Timestamp when record was created (USE THIS, NOT CREATED_AT)
  * LAST_UPDATED_DATE - Timestamp when record was last updated

**VW_DATABRIDGE_NOTES_DATA_V1**
- Case notes and memoranda
- Detailed case notes

**VW_DATABRIDGE_NOTE_TAGS_DATA_V1**
- Tags applied to notes
- Categorization and classification

**VW_DATABRIDGE_PERSON_ADDRESSES_DATA_V1**
- Address information for people
- Physical addresses

**VW_DATABRIDGE_PERSON_CUSTOM_DATA_V1**
- Custom person fields
- Extended person attributes

**VW_DATABRIDGE_PERSON_EMAILS_DATA_V1**
- Email addresses for people
- Contact email information

**VW_DATABRIDGE_PERSON_PHONES_DATA_V1**
- Phone numbers for people
- Contact phone information

**VW_DATABRIDGE_PERSON_STANDARD_DATA_V1**
- Standard person fields
- Core person/contact data

**VW_DATABRIDGE_PERSON_TAGS_DATA_V1**
- Tags applied to people
- Person categorization

**VW_DATABRIDGE_PERSON_TYPES_DATA_V1**
- Types of people (client, attorney, etc.)
- Person role classification

**VW_DATABRIDGE_PROJECT_CALENDAR_V1**
- Calendar events for projects
- Deadlines and appointments

**VW_DATABRIDGE_PROJECT_CONTACTS_DATA_V1**
- Contacts associated with projects
- Project team members

**VW_DATABRIDGE_PROJECT_LIST_DATA_V1** (PRIMARY VIEW FOR PROJECTS/CASES)
- Main project/case list - USE THIS for finding cases and projects
- Key columns:
  * PROJECT_ID - Unique project identifier
  * PROJECT_NAME - Name of the project/case
  * PROJECT_NUMBER - Case number
  * PROJECT_TYPE_NAME - Type of project
  * PHASE_NAME - Current phase (e.g., "Discovery", "Trial", etc.)
  * PHASE_DATE - When phase was last changed
  * CLIENT_FULL_NAME - Primary contact/client name
  * FIRST_PRIMARY_USER_FULL_NAME - Attorney/primary user
  * CREATED_AT - Date project was created
  * CURRENT_BALANCE - Current invoice balance

**VW_DATABRIDGE_PROJECT_SECTIONS_DATA_V1**
- Project sections/phases
- Project organization

**VW_DATABRIDGE_PROJECT_TAGS_DATA_V1**
- Tags applied to projects
- Project categorization

**VW_DATABRIDGE_PROJECT_TEAMS_DATA_V1**
- Project team members
- Team assignments

**VW_DATABRIDGE_TAGS_DATA_V1**
- Master tags list
- All available tags

**VW_DATABRIDGE_USERS_V1**
- System users
- User information and access

## Query Guidelines:

1. Always use fully qualified names: TEAM_THC2.DATABRIDGE.view_name
2. Use LIMIT clauses to prevent large result sets (default to LIMIT 100)
3. These are views (read-only), not tables
4. Focus on VW_DATABRIDGE_PROJECT_LIST_DATA_V1 for case/project queries
5. Join with VW_DATABRIDGE_PERSON_STANDARD_DATA_V1 for client information
6. Use VW_DATABRIDGE_DOCS_V1 for document-related queries
7. Use VW_DATABRIDGE_USERS_V1 for user/team member information
8. ORG_ID filtering will be added automatically - DO NOT add it yourself
9. For INVOICE table, use CREATED_DATE (not CREATED_AT) for timestamp ordering

## Common Query Patterns:

- **Finding cases/projects**: Query VW_DATABRIDGE_PROJECT_LIST_DATA_V1 (this is the main view for projects)
- **Client information**: Query VW_DATABRIDGE_CLIENT_INFO_V1 or VW_DATABRIDGE_PERSON_STANDARD_DATA_V1
- **Billing/financial**: Query VW_DATABRIDGE_INVOICE_DATA_V1 or VW_DATABRIDGE_BILLING_TRANSACTION_DATA_V1
- **Documents**: Query VW_DATABRIDGE_DOCS_V1
- **Notes/comments**: Query VW_DATABRIDGE_NOTES_DATA_V1 or VW_DATABRIDGE_COMMENTS_DATA_V1
- **Users/team**: Query VW_DATABRIDGE_USERS_V1 or VW_DATABRIDGE_PROJECT_TEAMS_DATA_V1

## Example Queries:

**Finding cases in a specific phase:**
\`\`\`sql
SELECT PROJECT_NUMBER, PROJECT_NAME, PHASE_NAME, CLIENT_FULL_NAME
FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
WHERE PHASE_NAME = 'Discovery'
LIMIT 100
\`\`\`

**Counting cases by phase:**
\`\`\`sql
SELECT PHASE_NAME, COUNT(*) as case_count
FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
GROUP BY PHASE_NAME
ORDER BY case_count DESC
LIMIT 100
\`\`\`

**Finding recent cases:**
\`\`\`sql
SELECT PROJECT_NUMBER, PROJECT_NAME, CREATED_AT, CLIENT_FULL_NAME
FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
WHERE CREATED_AT >= DATEADD(month, -1, CURRENT_DATE())
ORDER BY CREATED_AT DESC
LIMIT 100
\`\`\`

**Querying invoices:**
\`\`\`sql
SELECT ID, INVOICE_NUMBER, PROJECT_ID, TOTAL, OUTSTANDING_BALANCE, CREATED_DATE
FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_INVOICE_DATA_V1
ORDER BY CREATED_DATE DESC
LIMIT 100
\`\`\`

**Querying payments applied to invoices:**
\`\`\`sql
SELECT bt.DATE, bt.TRANSACTION_TYPE, bt.TOTAL, bt.AMOUNT_APPLIED_TO_INVOICE, bt.SOURCE
FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_BILLING_TRANSACTION_DATA_V1 bt
JOIN TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_INVOICE_DATA_V1 i ON bt.INVOICE_ID = i.ID
WHERE i.INVOICE_NUMBER = 7
ORDER BY bt.DATE
LIMIT 100
\`\`\`

**NOTE:** Invoice line items (time entries, expenses, fees) are NOT available in this Snowflake schema.
`;

/**
 * Fetch detailed schema information from Snowflake
 * This will query the actual column definitions
 */
export async function fetchDetailedSchema(): Promise<string> {
	try {
		const response = await fetch('/api/snowflake/schema-map');
		const data = await response.json();

		if (data.success && data.textSummary) {
			return data.textSummary;
		}

		// Fallback to basic context if API fails
		return SNOWFLAKE_SCHEMA_CONTEXT;
	} catch (error) {
		console.error('Failed to fetch detailed schema:', error);
		return SNOWFLAKE_SCHEMA_CONTEXT;
	}
}
