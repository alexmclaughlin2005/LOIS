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

**1. SEARCH** - For direct entity lookups (HIGHEST PRIORITY):
- Just a person's name with NO other context or question words
- Just a case number
- Simple "find X" or "show me X" where X is a specific person or case
- NO analysis, filtering, or comparison words
- Examples:
  - "Harold McLaughlin" → SEARCH
  - "John Smith" → SEARCH
  - "CV-2025-00097" → SEARCH
  - "find Sarah Johnson" → SEARCH
  - "Smith" → SEARCH
- Counter-examples (NOT search):
  - "What cases is Harold McLaughlin involved in?" → GENERAL or SQL
  - "How many cases does Smith have?" → SQL
  - "Show me cases where Smith is involved" → SQL

**2. SQL Query** - For queries that need structured data from the database:
- Questions about counts, totals, sums, averages
- Filtering or searching cases by specific criteria
- Questions about billable hours, expenses, invoices
- Date range queries (last 30 days, this month, etc.)
- Aggregations and statistics
- Examples:
  - "Which cases have time entries exceeding 100 hours?"
  - "How many open Personal Injury cases are there?"
  - "Show me all cases filed in the last 30 days"
  - "What's the total billable amount for Project X?"

**3. Document Search** - For full-text search through document content:
- Questions explicitly asking to search document text
- Questions about what documents mention or contain specific terms
- Questions about finding pleadings, motions, contracts with specific content
- Examples:
  - "Search documents for 'settlement agreement'"
  - "Find all documents mentioning damages"
  - "What pleadings reference the accident date?"

**4. General Question** - For complex, analytical, or conversational queries:
- Questions requiring multi-step reasoning
- Questions asking for summaries or analysis
- Questions combining data from multiple sources
- Questions about case status, updates, or explanations
- Examples:
  - "Tell me about the Thompson case"
  - "Summarize the documents in the Hahn case"
  - "What's the status of my open cases?"

User's query: "${query}"

IMPORTANT: If the query is JUST a name (like "Harold McLaughlin") with NO question words, it is a SEARCH, not SQL.

Respond with ONLY a JSON object in this exact format:
{
  "type": "search" | "sql" | "document_search" | "general",
  "confidence": 0.0-1.0,
  "reasoning": "Brief explanation of why this classification was chosen"
}

Be decisive. Choose the BEST fit. Prioritize SEARCH for simple name lookups.`
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
		if (!result.type || !['sql', 'document_search', 'general'].includes(result.type)) {
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
		case 'sql':
			return 'Querying case database...';
		case 'document_search':
			return 'Searching through documents...';
		case 'general':
			return 'Analyzing your question...';
		default:
			return 'Processing...';
	}
}
