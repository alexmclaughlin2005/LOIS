import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { query, data, queryType } = await request.json();

		if (!query || typeof query !== 'string') {
			return json({ error: 'Query is required' }, { status: 400 });
		}

		console.log('📝 Generating narrative response for:', query);
		console.log('📊 Data rows:', Array.isArray(data) ? data.length : 'N/A');

		// Prepare data summary for the LLM
		let dataContext = '';
		if (data && Array.isArray(data) && data.length > 0) {
			const sampleSize = Math.min(data.length, 10);
			dataContext = `
## Query Results (${data.length} total rows)

### Sample Data (first ${sampleSize} rows):
\`\`\`json
${JSON.stringify(data.slice(0, sampleSize), null, 2)}
\`\`\`

### Available Fields:
${Object.keys(data[0]).join(', ')}
`;
		} else if (data && !Array.isArray(data)) {
			dataContext = `
## Query Result:
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
`;
		} else {
			dataContext = `
## Query Result:
No structured data available.
`;
		}

		const prompt = `You are LOIS, a legal operations intelligence assistant. Analyze the query results and provide a clear, conversational narrative response.

## User's Question:
"${query}"

${dataContext}

## Instructions:

1. **Answer the question directly** - Start with a clear yes/no or direct answer
2. **Provide key insights** - Summarize the most important findings
3. **Add context and details** - Explain roles, relationships, and patterns in the data
4. **Be conversational** - Write naturally, as if explaining to a colleague
5. **Use specific examples** - Reference actual case numbers, names, and details from the data
6. **Keep it concise** - 2-4 paragraphs maximum

## Format Guidelines:

- Start with a direct answer (e.g., "Yes, Harold McLaughlin is involved in 8 cases...")
- Group information logically (e.g., by role, case type, or chronology)
- Use bullet points sparingly and only when listing multiple items
- Reference specific data points (case numbers, names, dates, amounts)
- End with relevant insights or patterns if applicable

## Example Response Style:

"Yes, Harold McLaughlin is involved in 8 Personal Injury cases currently in the discovery phase. He serves as an Expert Witness in 5 of these cases, including CR-2025-00097 (Innovative static info-mediaries) where he provides testimony on medical matters. He also appears as a Lead Attorney in 2 cases and as a witness in 1 additional case.

The cases span a range of injury types and medical expense levels. His involvement as an expert witness is most prevalent in cases with significant medical expenses, suggesting his expertise in evaluating injury severity and damages."

Now, generate a response for the user's question based on the provided data.`;

		const message = await anthropic.messages.create({
			model: 'claude-sonnet-4-5',
			max_tokens: 1024,
			messages: [
				{
					role: 'user',
					content: prompt
				}
			]
		});

		const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

		console.log('✅ Generated narrative response:', responseText.substring(0, 100) + '...');

		return json({
			response: responseText,
			success: true
		});

	} catch (error: any) {
		console.error('❌ Error generating response:', error);
		return json(
			{ error: error.message || 'Failed to generate response' },
			{ status: 500 }
		);
	}
};
