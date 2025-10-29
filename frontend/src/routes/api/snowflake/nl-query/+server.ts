import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeSnowflakeQuery } from '$lib/snowflake';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';

const anthropic = new Anthropic({
	apiKey: env.ANTHROPIC_API_KEY
});

/**
 * Apply ORG_ID filter to generated SQL query
 * Intelligently adds WHERE clause or extends existing WHERE clause
 * Handles CTEs (WITH clauses) properly by filtering in the CTE definition
 * Only applies if the query references tables that have ORG_ID
 */
function applyOrgFilter(sql: string, orgId: string): string {
	const sqlUpper = sql.toUpperCase();

	// Check if query references tables that have ORG_ID
	// All VW_DATABRIDGE tables have ORG_ID
	const hasDatabridgeTables = sqlUpper.includes('VW_DATABRIDGE');

	// Skip filtering if no databridge tables are referenced
	if (!hasDatabridgeTables) {
		console.log('Skipping ORG_ID filter - no VW_DATABRIDGE tables detected');
		return sql;
	}

	// Check if this is a CTE (Common Table Expression) query
	const hasCTE = sqlUpper.includes('WITH ');
	
	if (hasCTE) {
		// For CTE queries, add ORG_ID filter to the base table in the CTE definition
		// Pattern: FROM team_thc2.databridge.vw_databridge_xxx
		// We need to add WHERE after the FROM clause but before the closing paren of the CTE
		
		// Find the FROM clause in the CTE
		const cteFromMatch = sql.match(/(FROM\s+(?:TEAM_THC2\.DATABRIDGE\.)?VW_DATABRIDGE_\w+)/i);
		if (cteFromMatch) {
			const fromClause = cteFromMatch[1];
			// Add WHERE clause after the FROM, before the next line/paren
			const replacement = `${fromClause}\n  WHERE ORG_ID = ${orgId}`;
			return sql.replace(cteFromMatch[1], replacement);
		}
	}

	// For non-CTE queries, add WHERE clause intelligently
	const hasWhere = sqlUpper.includes('WHERE');
	const hasJoin = sqlUpper.includes('JOIN');
	
	// Construct the ORG_ID filter
	// If there's a JOIN, we need to filter ALL tables that have ORG_ID
	let orgFilter = `ORG_ID = ${orgId}`;
	
	if (hasJoin) {
		// Find all table aliases in FROM and JOIN clauses
		const tableMatches = sql.match(/(?:FROM|JOIN)\s+(?:TEAM_THC2\.DATABRIDGE\.)?VW_DATABRIDGE_\w+\s+(?:AS\s+)?(\w+)/gi);
		if (tableMatches && tableMatches.length > 0) {
			const aliases: string[] = [];
			tableMatches.forEach(match => {
				const aliasMatch = match.match(/(?:FROM|JOIN)\s+(?:TEAM_THC2\.DATABRIDGE\.)?VW_DATABRIDGE_\w+\s+(?:AS\s+)?(\w+)/i);
				if (aliasMatch && aliasMatch[1]) {
					aliases.push(aliasMatch[1]);
				}
			});
			
			// Filter all tables by ORG_ID (with OR for LEFT JOINs to allow NULLs)
			if (aliases.length > 1) {
				// Multiple tables - filter each one
				orgFilter = aliases.map(alias => `${alias}.ORG_ID = ${orgId}`).join(' AND ');
			} else if (aliases.length === 1) {
				// Single table with alias
				orgFilter = `${aliases[0]}.ORG_ID = ${orgId}`;
			}
		}
	}

	if (!hasWhere) {
		// Find the position to insert WHERE clause
		// SQL order: SELECT ... FROM ... JOIN ... WHERE ... GROUP BY ... ORDER BY ... LIMIT
		// WHERE must come BEFORE GROUP BY
		const groupByMatch = sql.match(/\s+(GROUP\s+BY)/i);
		const orderByMatch = sql.match(/\s+(ORDER\s+BY)/i);
		const limitMatch = sql.match(/\s+(LIMIT\s+\d+)/i);
		
		// Check in correct SQL order - GROUP BY comes before ORDER BY
		if (groupByMatch) {
			// Insert WHERE before GROUP BY
			return sql.replace(/\s+GROUP\s+BY/i, `\nWHERE ${orgFilter}\nGROUP BY`);
		} else if (orderByMatch) {
			// Insert WHERE before ORDER BY
			return sql.replace(/\s+ORDER\s+BY/i, `\nWHERE ${orgFilter}\nORDER BY`);
		} else if (limitMatch) {
			// Insert WHERE before LIMIT
			return sql.replace(/\s+LIMIT\s+/i, `\nWHERE ${orgFilter}\nLIMIT `);
		} else {
			// No clauses found - add WHERE at the end before semicolon if present
			if (sql.trim().endsWith(';')) {
				return sql.trim().slice(0, -1) + `\nWHERE ${orgFilter};`;
			} else {
				return sql.trim() + `\nWHERE ${orgFilter}`;
			}
		}
	} else {
		// Has WHERE clause - extend it with AND
		// Find the WHERE clause and add our filter right after it
		return sql.replace(/\bWHERE\b/i, `WHERE ${orgFilter} AND`);
	}
}

/**
 * Natural language query interface for Snowflake
 * Converts user questions into SQL and executes them
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { question, schemaContext, orgId } = await request.json();

		if (!question) {
			return json({ success: false, error: 'Question is required' }, { status: 400 });
		}

		console.log('Generating SQL for question:', question);
		if (orgId) {
			console.log('Filtering by ORG_ID:', orgId);
		}

		// Step 1: Convert natural language to SQL using Claude
		const sqlGenerationPrompt = `You are a SQL expert helping users query a Snowflake database.

Given the following database schema:

${schemaContext}

User question: "${question}"

Generate a valid Snowflake SQL query to answer this question.

CRITICAL RULES:
1. Only SELECT queries are allowed (no INSERT, UPDATE, DELETE, DROP, etc.)
2. ALWAYS use LIMIT 100 to prevent large result sets
3. Use fully qualified names: TEAM_THC2.DATABRIDGE.view_name
4. The main view is VW_DATABRIDGE_PROJECT_LIST_DATA_V1
5. For project phase/status, use PHASE_NAME column (NOT "status" or "STATUS")
6. For case numbers, use PROJECT_NUMBER column
7. For client names, use CLIENT_FULL_NAME column
8. Return ONLY the SQL query, no explanations, no markdown code blocks
9. If the question cannot be answered, return "ERROR: Cannot generate query"
${orgId ? `10. DO NOT add ORG_ID filtering - it will be added automatically` : ''}

SQL Query:`;

		console.log('Generating SQL for question:', question);

		const sqlResponse = await anthropic.messages.create({
			model: 'claude-sonnet-4-5',
			max_tokens: 1024,
			messages: [
				{
					role: 'user',
					content: sqlGenerationPrompt
				}
			]
		});

		let sqlQuery = sqlResponse.content[0].type === 'text' ? sqlResponse.content[0].text.trim() : '';

		if (sqlQuery.startsWith('ERROR:')) {
			return json({
				success: false,
				error: sqlQuery.replace('ERROR: ', '')
			});
		}

		console.log('Generated SQL (before org filter):', sqlQuery);

		// Validate it's a SELECT query
		const upperQuery = sqlQuery.toUpperCase().trim();
		if (!upperQuery.startsWith('SELECT') && !upperQuery.startsWith('WITH')) {
			return json({
				success: false,
				error: 'Only SELECT queries are allowed for security reasons'
			});
		}

		// Apply ORG_ID filter if provided
		if (orgId) {
			try {
				sqlQuery = applyOrgFilter(sqlQuery, orgId);
				console.log('Generated SQL (after org filter):');
				console.log(sqlQuery);
			} catch (error) {
				console.error('Error applying ORG_ID filter:', error);
				// Continue without filter if there's an error
			}
		}

		// Step 2: Execute the SQL query
		const results = await executeSnowflakeQuery(sqlQuery);

		// Step 3: Generate a natural language summary of the results
		const summaryPrompt = `You are helping interpret SQL query results for a user.

User's question: "${question}"

SQL query executed:
\`\`\`sql
${sqlQuery}
\`\`\`

Results (${results.length} rows):
\`\`\`json
${JSON.stringify(results.slice(0, 10), null, 2)}
${results.length > 10 ? `\n... and ${results.length - 10} more rows` : ''}
\`\`\`

Provide a clear, concise answer to the user's question based on these results. Focus on insights and key findings.`;

		const summaryResponse = await anthropic.messages.create({
			model: 'claude-sonnet-4-5',
			max_tokens: 2048,
			messages: [
				{
					role: 'user',
					content: summaryPrompt
				}
			]
		});

		const summary =
			summaryResponse.content[0].type === 'text' ? summaryResponse.content[0].text : '';

		return json({
			success: true,
			sql: sqlQuery,
			results,
			summary,
			rowCount: results.length
		});
	} catch (error: any) {
		console.error('Snowflake query error:', error);
		return json(
			{
				success: false,
				error: error.message || 'Failed to execute query',
				details: error.toString()
			},
			{ status: 500 }
		);
	}
};
