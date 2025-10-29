import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { executeSnowflakeQuery } from '$lib/snowflake';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { query, orgId } = await request.json();

		if (!query || typeof query !== 'string') {
			return json({ error: 'Query is required' }, { status: 400 });
		}

		console.log('🔍 Search mode query:', query);
		if (orgId) {
			console.log('🏢 Filtering by org_id:', orgId);
		}

		// Step 1: Execute Snowflake queries to get potential matches
		let searchResults: any[] = [];

		// Build ORG_ID filter if provided
		const orgFilter = orgId ? `WHERE ORG_ID = ${orgId}` : '';

		// Search projects/cases by project number or name
		const projectQuery = `
			SELECT
				PROJECT_ID,
				PROJECT_NUMBER,
				PROJECT_NAME,
				PROJECT_TYPE_NAME,
				PHASE_NAME,
				CLIENT_FULL_NAME,
				FIRST_PRIMARY_USER_FULL_NAME,
				CREATED_AT,
				CURRENT_BALANCE
			FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
			${orgFilter}
			${orgFilter ? 'AND' : 'WHERE'} (
				UPPER(PROJECT_NUMBER) LIKE UPPER('%${query}%')
				OR UPPER(PROJECT_NAME) LIKE UPPER('%${query}%')
				OR UPPER(CLIENT_FULL_NAME) LIKE UPPER('%${query}%')
			)
			LIMIT 10
		`;

		try {
			const projectResults = await executeSnowflakeQuery(projectQuery);
			if (projectResults && projectResults.length > 0) {
				searchResults = projectResults.map((p: any) => ({
					type: 'project',
					id: p.PROJECT_ID,
					data: p
				}));
			}
		} catch (error) {
			console.error('Error searching projects:', error);
		}

		// Search people/contacts by name
		const personQuery = `
			SELECT
				PERSON_ID,
				FULL_NAME,
				FIRST_NAME,
				LAST_NAME,
				EMAIL,
				PHONE,
				PERSON_TYPE
			FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PERSON_STANDARD_DATA_V1
			${orgFilter}
			${orgFilter ? 'AND' : 'WHERE'} (
				UPPER(FULL_NAME) LIKE UPPER('%${query}%')
				OR UPPER(FIRST_NAME) LIKE UPPER('%${query}%')
				OR UPPER(LAST_NAME) LIKE UPPER('%${query}%')
			)
			LIMIT 10
		`;

		try {
			const personResults = await executeSnowflakeQuery(personQuery);
			if (personResults && personResults.length > 0) {
				searchResults = [
					...searchResults,
					...personResults.map((p: any) => ({
						type: 'person',
						id: p.PERSON_ID,
						data: p
					}))
				];
			}
		} catch (error) {
			console.error('Error searching people:', error);
		}

		console.log(`📊 Found ${searchResults.length} potential matches from Snowflake`);

		// Step 2: Use Claude to analyze and rank the search results
		// Generate relevance reasoning for each result
		const prompt = `You are a legal case management search assistant. The user searched for: "${query}"

Here are the Snowflake database search results:

${JSON.stringify(searchResults, null, 2)}

For each result, analyze its relevance to the user's query and provide:
1. A relevance score (0-100)
2. A brief 1-2 sentence explanation of WHY this result is relevant
3. A short snippet highlighting the most relevant information

Return a JSON array with this structure:
[
  {
    "id": "result_id",
    "type": "project" | "person",
    "title": "Display title (e.g. project name or person full name)",
    "subtitle": "Secondary info (e.g. project number, person type)",
    "snippet": "Brief relevant text highlighting key info (e.g. client name, phase, email)",
    "relevanceReason": "1-2 sentences explaining why this is relevant to the search query",
    "relevanceScore": 0-100,
    "metadata": {
      "key": "value pairs with additional context"
    }
  }
]

Guidelines:
- For projects: Use PROJECT_NAME as title, PROJECT_NUMBER as subtitle, include CLIENT_FULL_NAME and PHASE_NAME in snippet
- For people: Use FULL_NAME as title, PERSON_TYPE as subtitle, include EMAIL or PHONE in snippet
- Sort results by relevance score (highest first)
- Only include results with relevance score > 30
- Be concise and specific in the relevance reasoning`;

		const message = await anthropic.messages.create({
			model: 'claude-sonnet-4-5',
			max_tokens: 2048,
			messages: [
				{
					role: 'user',
					content: prompt
				}
			]
		});

		const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

		// Extract JSON from potential markdown code blocks
		let jsonText = responseText.trim();
		const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
		if (jsonMatch) {
			jsonText = jsonMatch[1];
		} else if (responseText.startsWith('```')) {
			jsonText = responseText.replace(/```[\s\S]*?\n/, '').replace(/```$/, '');
		}

		const rankedResults = JSON.parse(jsonText);

		console.log(`✅ Ranked ${rankedResults.length} results`);

		return json({
			success: true,
			query,
			results: rankedResults,
			totalResults: rankedResults.length
		});

	} catch (error: any) {
		console.error('❌ Error in search endpoint:', error);
		return json(
			{
				success: false,
				error: error.message || 'Failed to execute search'
			},
			{ status: 500 }
		);
	}
};
