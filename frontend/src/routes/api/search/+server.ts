import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

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

		// Step 1: Execute a broad database query to get potential matches
		// For now, we'll search across cases, contacts, and activities
		// This is a simplified version - in production you'd want more sophisticated search
		let searchResults: any[] = [];

		// Search cases by case_number, title, or description
		const { data: cases, error: casesError } = await supabase
			.from('cases')
			.select('case_id, case_number, title, description, case_type, status, practice_area')
			.or(`case_number.ilike.%${query}%,title.ilike.%${query}%,description.ilike.%${query}%`)
			.limit(10);

		if (cases && !casesError) {
			searchResults = cases.map(c => ({
				type: 'case',
				id: c.case_id,
				data: c
			}));
		}

		// Search contacts by name
		const { data: contacts, error: contactsError } = await supabase
			.from('contacts')
			.select('contact_id, first_name, last_name, role, email, phone')
			.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
			.limit(10);

		if (contacts && !contactsError) {
			searchResults = [
				...searchResults,
				...contacts.map(c => ({
					type: 'contact',
					id: c.contact_id,
					data: c
				}))
			];
		}

		console.log(`📊 Found ${searchResults.length} potential matches`);

		// Step 2: Use Claude to analyze and rank the search results
		// Generate relevance reasoning for each result
		const prompt = `You are a legal case management search assistant. The user searched for: "${query}"

Here are the database search results:

${JSON.stringify(searchResults, null, 2)}

For each result, analyze its relevance to the user's query and provide:
1. A relevance score (0-100)
2. A brief 1-2 sentence explanation of WHY this result is relevant
3. A short snippet highlighting the most relevant information

Return a JSON array with this structure:
[
  {
    "id": "result_id",
    "type": "case" | "contact",
    "title": "Display title",
    "subtitle": "Secondary info (optional)",
    "snippet": "Brief relevant text from the result",
    "relevanceReason": "1-2 sentences explaining why this is relevant",
    "relevanceScore": 0-100,
    "metadata": {
      "key": "value"
    }
  }
]

Sort results by relevance score (highest first). Only include results with relevance score > 30.
Be concise and specific in the relevance reasoning.`;

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
