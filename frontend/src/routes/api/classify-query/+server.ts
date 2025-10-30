import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { query, context } = await request.json();

		if (!query || typeof query !== 'string') {
			return json({ error: 'Query is required' }, { status: 400 });
		}

		console.log('🤖 Classifying query with LLM:', query);
		if (context?.previousQuery) {
			console.log('📜 Has context from previous query:', context.previousQuery);
		}

		// Use Claude to classify the query
		const message = await anthropic.messages.create({
			model: 'claude-sonnet-4-5',
			max_tokens: 500,
			messages: [
				{
					role: 'user',
					content: `You are a query classifier for a legal case management system. Analyze the user's query and classify it into ONE of these types:

**1. SEARCH** - For looking up specific entities (people, cases):
- Just a person's name (e.g., "Harold McLaughlin")
- Just a case number (e.g., "CV-2025-00097")
- Simple "find X" where X is a specific person, case, or entity
- No filtering, counting, or list requests
- Examples:
  - "Harold McLaughlin"
  - "find Sarah Johnson"
  - "CV-2025-00097"

**2. LIST** - For requesting filtered lists or collections of items:
- Queries asking for "all", "list", "show me", with filtering criteria
- Questions about cases matching specific conditions
- Requests for projects, contacts, invoices, documents with filters
- Questions with counts, totals, or aggregations
- Examples:
  - "Show me all active projects"
  - "List cases filed in the last 30 days"
  - "Which cases have time entries exceeding 100 hours?"
  - "How many open Personal Injury cases are there?"
  - "Show me unbilled invoices"
  - "What projects is Harold McLaughlin working on?"

**3. CONVERSATIONAL** - For general questions, analysis, or chat:
- Questions asking "what", "why", "how", "can you", "tell me about"
- Requests for summaries, explanations, or analysis
- Questions about capabilities or help
- General conversation or clarifying questions
- Multi-step reasoning queries
- Examples:
  - "What can you help me with?"
  - "Tell me about the Thompson case"
  - "How do I create a new project?"
  - "What's the status of my cases?"
  - "Can you explain this data?"

User's query: "${query}"

Respond with ONLY a JSON object in this exact format:
{
  "type": "search" | "list" | "conversational",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of why this classification was chosen"
}

Be decisive. Choose the BEST fit based on the user's intent.`
				}
			]
		});

		const content = message.content[0];
		if (content.type !== 'text') {
			throw new Error('Unexpected response type from Claude');
		}

		// Parse the JSON response
		const responseText = content.text.trim();
		console.log('📝 Classification response:', responseText);

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
		if (!result.type || !['search', 'list', 'conversational'].includes(result.type)) {
			throw new Error('Invalid classification type from Claude');
		}

		console.log(`✅ Classified as: ${result.type} (confidence: ${result.confidence})`);
		console.log(`💭 Reasoning: ${result.reasoning}`);

		return json({
			success: true,
			type: result.type,
			confidence: result.confidence || 1.0,
			reasoning: result.reasoning,
			suggestedAction: getSuggestedAction(result.type)
		});

	} catch (error) {
		console.error('❌ Error classifying query:', error);
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to classify query'
		}, { status: 500 });
	}
};

function getSuggestedAction(type: string): string {
	switch (type) {
		case 'search':
			return 'Searching for entity...';
		case 'list':
			return 'Querying database for list...';
		case 'conversational':
			return 'Analyzing your question...';
		default:
			return 'Processing...';
	}
}
