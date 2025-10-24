import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

const DATABASE_SCHEMA = `
# LOIS Database Schema

## Tables Overview
Your database contains legal case management data with the following tables:

### 1. projects (Main case table)
- id (UUID, primary key)
- case_number (VARCHAR, unique) - Format: CV-2025-00001, CR-2025-00002, etc.
- title (VARCHAR) - Case title/name
- case_type (VARCHAR) - Types: Personal Injury, Corporate, Family Law, Criminal Defense, Real Estate, Employment, Intellectual Property, Estate Planning
- status (VARCHAR) - Status: Open, Closed, Pending, On Hold
- phase (VARCHAR) - Phases: Discovery, Trial, Settlement, Appeal, Potential New Client, etc.
- priority (VARCHAR) - Priority: Low, Medium, High, Urgent
- jurisdiction (VARCHAR) - Legal jurisdiction
- court_name (VARCHAR) - Name of court
- filing_date (DATE) - Case filing date (NOT start_date!)
- estimated_value (DECIMAL) - Estimated case value
- description (TEXT) - Case description
- assigned_attorney (UUID) - Assigned attorney ID
- created_by (UUID) - Creator user ID
- created_at (TIMESTAMP) - Record creation timestamp
- updated_at (TIMESTAMP) - Record update timestamp
- custom_fields (JSONB) - Case-specific data:
  - Personal Injury cases: medical_expenses, lost_wages, injury_type, liability_percentage
  - Corporate cases: contract_value, transaction_type, jurisdiction
  - Family Law cases: custody_arrangement, child_support, alimony
  - Criminal Defense cases: charges, plea_status, bail_amount
  - Real Estate cases: property_value, transaction_type, closing_date
  - Employment cases: claim_type, settlement_amount, termination_date
  - IP cases: patent_number, trademark_name, infringement_type
  - Estate Planning cases: estate_value, trust_type, beneficiaries

### 2. contacts
- id (UUID, primary key)
- first_name (VARCHAR)
- last_name (VARCHAR)
- email (VARCHAR, unique)
- phone (VARCHAR)
- contact_type (VARCHAR) - Types: Client, Attorney, Witness, Expert, Court Personnel, Paralegal
- organization (VARCHAR) - NOT company!
- title (VARCHAR) - Job title
- bar_number (VARCHAR) - For attorneys
- specialty (VARCHAR) - For experts
- address_line1, address_line2 (VARCHAR)
- city (VARCHAR)
- state (VARCHAR)
- zip_code (VARCHAR)
- country (VARCHAR) - Default: 'United States'
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 3. project_contacts (Join table)
- project_id (UUID, foreign key to projects)
- contact_id (UUID, foreign key to contacts)
- role (VARCHAR) - Role: Primary Attorney, Opposing Counsel, Client, Witness, Expert Witness, etc.
- created_at (TIMESTAMP)

### 4. documents
- id (UUID, primary key)
- project_id (UUID, foreign key to projects)
- title (VARCHAR)
- document_type (VARCHAR) - Types: Contract, Pleading, Discovery, Evidence, Correspondence, Brief, Motion, Memo
- file_name (VARCHAR) - Original file name
- file_path (VARCHAR) - Storage path
- file_size_kb (INTEGER) - File size in kilobytes (NOT file_size!)
- mime_type (VARCHAR) - MIME type
- content (TEXT) - Full-text searchable content
- status (VARCHAR) - Document status (e.g., Draft, Final, Archived)
- date_filed (DATE) - Date document was filed
- date_received (DATE) - Date document was received
- uploaded_by (UUID) - User who uploaded (NOT VARCHAR!)
- tags (VARCHAR[]) - Array of tags
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 5. calendar_entries
- id (UUID, primary key)
- project_id (UUID, foreign key to projects)
- title (VARCHAR)
- entry_type (VARCHAR) - Types: Hearing, Deposition, Meeting, Deadline, Court Date, Filing Deadline
- start_time (TIMESTAMP)
- end_time (TIMESTAMP)
- location (VARCHAR)
- description (TEXT)
- reminder_minutes (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 6. notes
- id (UUID, primary key)
- project_id (UUID, foreign key to projects)
- content (TEXT)
- created_by (VARCHAR)
- is_private (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 7. tasks
- id (UUID, primary key)
- project_id (UUID, foreign key to projects)
- title (VARCHAR)
- description (TEXT)
- assigned_to (VARCHAR)
- status (VARCHAR) - Status: Pending, In Progress, Completed, Blocked
- priority (VARCHAR) - Priority: Low, Medium, High, Urgent
- due_date (DATE)
- completed_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 8. time_entries
- id (UUID, primary key)
- project_id (UUID, foreign key to projects)
- attorney (UUID) - Attorney who logged the time
- date (DATE) - Date of time entry (NOT entry_date!)
- hours (DECIMAL) - Hours worked
- activity_type (VARCHAR) - Type of activity
- description (TEXT) - Description of work
- hourly_rate (DECIMAL) - Billing rate (NOT billable_rate!)
- total_amount (DECIMAL) - Computed: hours * hourly_rate
- is_billable (BOOLEAN) - Whether entry is billable
- invoice_id (UUID) - Associated invoice if billed
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 9. expenses
- id (UUID, primary key)
- project_id (UUID, foreign key to projects)
- date (DATE) - Expense date (NOT expense_date!)
- expense_type (VARCHAR) - Type/category of expense (NOT expense_category!)
- description (TEXT)
- amount (DECIMAL)
- vendor (VARCHAR) - Vendor name
- receipt_file_path (VARCHAR) - Path to receipt file
- is_billable (BOOLEAN) - Whether expense is billable
- invoice_id (UUID) - Associated invoice if billed
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### 10. invoices
- id (UUID, primary key)
- project_id (UUID, foreign key to projects)
- invoice_number (VARCHAR)
- amount (DECIMAL)
- status (VARCHAR) - Status: Draft, Sent, Paid, Overdue, Cancelled
- issue_date (DATE)
- due_date (DATE)
- paid_date (DATE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Important Query Guidelines

1. **Date Queries**: Use PostgreSQL date functions like CURRENT_DATE, NOW(), INTERVAL
   - Example: WHERE start_date > CURRENT_DATE - INTERVAL '30 days'

2. **JSONB Queries**: Access custom_fields using -> or ->> operators
   - Example: WHERE custom_fields->>'medical_expenses' > '100000'
   - Example: WHERE custom_fields->>'injury_type' = 'Spinal Injury'

3. **Full-Text Search**: Use to_tsvector and websearch_to_tsquery for document searches
   - Example: WHERE to_tsvector('english', content) @@ websearch_to_tsquery('english', 'settlement agreement')

4. **Joins**: Most common joins:
   - projects ⟷ project_contacts ⟷ contacts (for case participants)
   - projects ⟷ documents (for case documents)
   - projects ⟷ calendar_entries (for case events)
   - projects ⟷ time_entries (for billable hours)

5. **Aggregations**: Common queries need COUNT, SUM, AVG functions
   - Example: COUNT(*) for case counts
   - Example: SUM(amount) for total expenses
   - Example: AVG(hours) for average billable hours

6. **Safety**: ONLY generate SELECT queries. NO INSERT, UPDATE, DELETE, DROP, etc.
`;

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { query, context } = await request.json();

		if (!query || typeof query !== 'string') {
			return json({ error: 'Query is required' }, { status: 400 });
		}

		console.log('🔍 Generating SQL for query:', query);
		if (context?.previousQuery) {
			console.log('📜 With context - Previous query:', context.previousQuery);
			console.log('📊 Previous result count:', Array.isArray(context.previousResult) ? context.previousResult.length : 'unknown');
		}

		// Use Claude to generate the SQL query
		const message = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 2048,
			messages: [
				{
					role: 'user',
					content: `You are a PostgreSQL expert helping with a legal case management system.

${DATABASE_SCHEMA}

${context?.previousQuery && context.previousSql ? `## Conversation Context

**Previous query**: "${context.previousQuery}"
**Previous SQL**:
\`\`\`sql
${context.previousSql}
\`\`\`

${Array.isArray(context.previousResult) && context.previousResult.length > 0 ? `
**Previous result**: Returned ${context.previousResult.length} rows

**Sample of previous results** (first 2 rows):
\`\`\`json
${JSON.stringify(context.previousResult.slice(0, 2), null, 2)}
\`\`\`

The user is now asking a FOLLOW-UP question that may reference these ${context.previousResult.length} results.
- If they say "these cases" or "those cases", they mean the ${context.previousResult.length} cases from the previous query
- If they say "this case", they likely mean case: ${context.previousResult[0]?.case_number || 'the first result'}
- Extract specific IDs/case numbers from the sample above to build your WHERE clause
- You can filter the previous results by adding WHERE conditions
` : `
**Previous result**: Query executed successfully

The user is asking a FOLLOW-UP question about the previous query.
- Use the previous SQL as context to understand what data was queried
- The follow-up may ask to filter, aggregate, or relate to that data
`}

` : ''}User's natural language query: "${query}"

Generate a PostgreSQL query to answer this question. Respond with ONLY a JSON object in this exact format:
{
  "sql": "SELECT ... (the complete SQL query - plain text, no markdown)",
  "explanation": "A brief user-friendly explanation of what this query finds",
  "estimated_rows": "approximate number of results (e.g., 'few', 'dozens', 'hundreds')",
  "display_columns": ["column1", "column2"]
}

## CRITICAL RULES:

1. **SQL Format**:
   - The "sql" field MUST contain ONLY the SQL query as plain text
   - DO NOT wrap SQL in markdown code blocks (\`\`\`sql)
   - DO NOT include any explanatory text before or after the query
   - The SQL must start with SELECT

2. **Query Safety**:
   - ONLY generate SELECT queries (read-only)
   - NO INSERT, UPDATE, DELETE, DROP, TRUNCATE, ALTER, or CREATE statements
   - Use parameterized values safely (avoid SQL injection patterns)

3. **JOIN Best Practices**:
   - Use explicit JOIN syntax (INNER JOIN, LEFT JOIN)
   - Always specify join conditions with ON clauses
   - Use table aliases for clarity (e.g., p for projects, c for contacts)
   - Example: FROM projects p INNER JOIN contacts c ON p.id = c.project_id

4. **Filtering & Conditions**:
   - Use WHERE clauses for filtering
   - For JSONB custom_fields: (custom_fields->>'field_name')::numeric > value
   - For text search: ILIKE '%term%' or to_tsvector/to_tsquery for full-text
   - For date ranges: WHERE date_column BETWEEN start_date AND end_date
   - Use CURRENT_DATE, CURRENT_TIMESTAMP for current time queries
   - Handle NULL values: WHERE column IS NULL or IS NOT NULL

5. **Performance & Limits**:
   - ALWAYS include LIMIT clause (default 100, max 500)
   - Add ORDER BY for consistent, meaningful results
   - Select only necessary columns (avoid SELECT *)
   - For counts/aggregations, use COUNT(), SUM(), AVG() with GROUP BY

6. **Column Selection & Aliases**:
   - Use descriptive aliases: SELECT p.case_number as "Case Number"
   - Format dates: TO_CHAR(date_column, 'YYYY-MM-DD') as formatted_date
   - Cast JSONB: (custom_fields->>'amount')::numeric as amount
   - Aggregate examples: COUNT(*) as total_cases, SUM(hours) as total_hours

7. **Common Query Patterns**:
   - Case search: SELECT case_number, title, status FROM projects WHERE status = 'Open' LIMIT 100
   - Time entries: SELECT project_id, SUM(hours) as total_hours FROM time_entries GROUP BY project_id ORDER BY total_hours DESC LIMIT 100
   - Upcoming events: SELECT title, start_time FROM calendar_entries WHERE start_time > CURRENT_DATE ORDER BY start_time ASC LIMIT 50
   - Document search: SELECT title, document_type FROM documents WHERE title ILIKE '%search%' LIMIT 100
   - Custom field filter: SELECT case_number, (custom_fields->>'field')::numeric as value FROM projects WHERE (custom_fields->>'field')::numeric > 10000

8. **Searching for Names/Parties**:
   When searching for a person or party name (e.g., "cases involving Smith" or "matters with Johnson"):
   - Search BOTH the case title AND contacts table
   - Case titles often contain party names in formats like "Smith v. Jones" or "Matter of Smith"
   - Use ILIKE with % wildcards for flexible matching
   - Example: WHERE p.title ILIKE '%smith%' OR c.last_name ILIKE '%smith%'
   - For follow-up questions about previous results, maintain the same filtering criteria

## Examples:

Query: "Show me open personal injury cases"
{
  "sql": "SELECT case_number, title, status, filing_date FROM projects WHERE status = 'Open' AND case_type = 'Personal Injury' ORDER BY filing_date DESC LIMIT 100",
  "explanation": "Finding all open Personal Injury cases",
  "estimated_rows": "dozens"
}

Query: "Which cases have billable time over 80 hours?"
{
  "sql": "SELECT p.case_number, p.title, SUM(te.hours) as total_hours FROM projects p INNER JOIN time_entries te ON p.id = te.project_id WHERE te.is_billable = true GROUP BY p.id, p.case_number, p.title HAVING SUM(te.hours) > 80 ORDER BY total_hours DESC LIMIT 100",
  "explanation": "Finding cases with more than 80 billable hours",
  "estimated_rows": "few"
}

Query: "Upcoming court dates this month"
{
  "sql": "SELECT p.case_number, ce.title, ce.start_time, ce.location FROM calendar_entries ce INNER JOIN projects p ON ce.project_id = p.id WHERE ce.entry_type = 'Court Date' AND ce.start_time BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '1 month' ORDER BY ce.start_time ASC LIMIT 100",
  "explanation": "Finding court dates scheduled in the next month",
  "estimated_rows": "dozens"
}

Query: "Cases involving Smith" or "Which cases involved Smith?"
{
  "sql": "SELECT DISTINCT p.case_number, p.title, p.status FROM projects p LEFT JOIN project_contacts pc ON p.id = pc.project_id LEFT JOIN contacts c ON pc.contact_id = c.id WHERE p.title ILIKE '%smith%' OR c.first_name ILIKE '%smith%' OR c.last_name ILIKE '%smith%' ORDER BY p.case_number LIMIT 100",
  "explanation": "Finding all cases where 'Smith' appears in the case title or as a contact",
  "estimated_rows": "few"
}

IMPORTANT: Respond ONLY with the JSON object. No markdown, no code blocks, no additional text.`
				}
			]
		});

		const content = message.content[0];
		if (content.type !== 'text') {
			throw new Error('Unexpected response type from Claude');
		}

		// Parse the JSON response
		const responseText = content.text.trim();
		console.log('📝 Claude response:', responseText);

		// Extract JSON from potential markdown code blocks
		let jsonText = responseText;
		const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
		if (jsonMatch) {
			jsonText = jsonMatch[1];
		} else if (responseText.startsWith('```')) {
			jsonText = responseText.replace(/```[\s\S]*?\n/, '').replace(/```$/, '');
		}

		const result = JSON.parse(jsonText);

		// Validate the response structure
		if (!result.sql || !result.explanation) {
			console.error('❌ Invalid response structure:', result);
			throw new Error('Invalid response structure from Claude');
		}

		// Clean the SQL - remove markdown code blocks if present
		let cleanedSql = result.sql.trim();

		// Remove markdown SQL code blocks
		const sqlBlockMatch = cleanedSql.match(/```sql\s*([\s\S]*?)\s*```/);
		if (sqlBlockMatch) {
			cleanedSql = sqlBlockMatch[1].trim();
			console.log('📝 Extracted SQL from markdown code block');
		} else if (cleanedSql.startsWith('```')) {
			// Generic code block
			cleanedSql = cleanedSql.replace(/```[\s\S]*?\n/, '').replace(/```$/, '').trim();
			console.log('📝 Extracted SQL from generic code block');
		}

		console.log('🔍 Cleaned SQL:', cleanedSql);

		// Safety check: ensure query is SELECT only
		const sqlUpper = cleanedSql.trim().toUpperCase();
		if (!sqlUpper.startsWith('SELECT')) {
			console.error('❌ SQL does not start with SELECT. First 100 chars:', sqlUpper.substring(0, 100));
			console.error('❌ Full SQL:', cleanedSql);
			throw new Error('Only SELECT queries are allowed');
		}

		// Update result with cleaned SQL
		result.sql = cleanedSql;

		// Check for dangerous keywords
		const dangerousKeywords = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'TRUNCATE', 'ALTER', 'CREATE'];
		for (const keyword of dangerousKeywords) {
			if (sqlUpper.includes(keyword)) {
				throw new Error(`Query contains forbidden keyword: ${keyword}`);
			}
		}

		console.log('✅ Generated SQL:', result.sql);

		return json({
			success: true,
			sql: result.sql,
			explanation: result.explanation,
			estimatedRows: result.estimated_rows
		});

	} catch (error) {
		console.error('❌ Error generating query:', error);

		// Log detailed error for debugging
		if (error instanceof Error) {
			console.error('Error name:', error.name);
			console.error('Error message:', error.message);
			console.error('Error stack:', error.stack);
		}

		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to generate query'
		}, { status: 500 });
	}
};
