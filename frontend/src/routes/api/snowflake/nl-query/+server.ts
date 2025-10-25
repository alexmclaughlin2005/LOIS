import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeSnowflakeQuery } from '$lib/snowflake';
import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';

const anthropic = new Anthropic({
	apiKey: env.ANTHROPIC_API_KEY
});

/**
 * Natural language query interface for Snowflake
 * Converts user questions into SQL and executes them
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { question, schemaContext } = await request.json();

		if (!question) {
			return json({ success: false, error: 'Question is required' }, { status: 400 });
		}

		// Step 1: Convert natural language to SQL using Claude
		const sqlGenerationPrompt = `You are a SQL expert helping users query a Snowflake database.

Given the following database schema:

${schemaContext}

User question: "${question}"

Generate a valid Snowflake SQL query to answer this question.

IMPORTANT RULES:
1. Only SELECT queries are allowed (no INSERT, UPDATE, DELETE, DROP, etc.)
2. Use LIMIT 100 to prevent large result sets
3. Focus on the TEAM_THC2.DATABRIDGE schema which contains legal/project data
4. Return ONLY the SQL query, no explanations or markdown formatting
5. If the question cannot be answered with the available schema, return "ERROR: Cannot generate query"

SQL Query:`;

		console.log('Generating SQL for question:', question);

		const sqlResponse = await anthropic.messages.create({
			model: 'claude-3-5-sonnet-20241022',
			max_tokens: 1024,
			messages: [
				{
					role: 'user',
					content: sqlGenerationPrompt
				}
			]
		});

		const sqlQuery = sqlResponse.content[0].type === 'text' ? sqlResponse.content[0].text.trim() : '';

		if (sqlQuery.startsWith('ERROR:')) {
			return json({
				success: false,
				error: sqlQuery.replace('ERROR: ', '')
			});
		}

		console.log('Generated SQL:', sqlQuery);

		// Validate it's a SELECT query
		const upperQuery = sqlQuery.toUpperCase().trim();
		if (!upperQuery.startsWith('SELECT') && !upperQuery.startsWith('WITH')) {
			return json({
				success: false,
				error: 'Only SELECT queries are allowed for security reasons'
			});
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
			model: 'claude-3-5-sonnet-20241022',
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
