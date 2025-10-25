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
- Billing transaction records
- Financial transactions and payment history

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
- Invoice records
- Billing and invoicing information

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

**VW_DATABRIDGE_PROJECT_LIST_DATA_V1**
- Main project/case list
- Core project/case data with names, status, dates, etc.
- USE THIS VIEW for finding cases and projects

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

## Common Query Patterns:

- **Finding cases/projects**: Query VW_DATABRIDGE_PROJECT_LIST_DATA_V1 (this is the main view for projects)
- **Client information**: Query VW_DATABRIDGE_CLIENT_INFO_V1 or VW_DATABRIDGE_PERSON_STANDARD_DATA_V1
- **Billing/financial**: Query VW_DATABRIDGE_INVOICE_DATA_V1 or VW_DATABRIDGE_BILLING_TRANSACTION_DATA_V1
- **Documents**: Query VW_DATABRIDGE_DOCS_V1
- **Notes/comments**: Query VW_DATABRIDGE_NOTES_DATA_V1 or VW_DATABRIDGE_COMMENTS_DATA_V1
- **Users/team**: Query VW_DATABRIDGE_USERS_V1 or VW_DATABRIDGE_PROJECT_TEAMS_DATA_V1
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
