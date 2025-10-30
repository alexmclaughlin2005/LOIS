import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';

const anthropic = new Anthropic({
	apiKey: ANTHROPIC_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { query, conversationHistory } = await request.json();

		if (!query || typeof query !== 'string') {
			return json({ error: 'Query is required' }, { status: 400 });
		}

		console.log('💬 Processing conversational query:', query);
		console.log('📜 Conversation history length:', conversationHistory?.length || 0);

		// Build messages array from conversation history
		const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

		if (conversationHistory && Array.isArray(conversationHistory)) {
			for (const msg of conversationHistory) {
				messages.push({
					role: msg.role === 'user' ? 'user' : 'assistant',
					content: msg.content
				});
			}
		}

		// Add the current query
		messages.push({
			role: 'user',
			content: query
		});

		// Call Claude with full conversation context
		const response = await anthropic.messages.create({
			model: 'claude-sonnet-4-5',
			max_tokens: 2048,
			system: `You are LOIS (Legal Operations Intelligence System), a helpful AI assistant for a legal case management system.

You help users with:
- Understanding their data and cases
- Answering questions about the system
- Providing guidance on how to use features
- Explaining case information and status
- General conversation and support

Be friendly, concise, and helpful. If you don't have specific information, acknowledge that and offer to help in other ways.`,
			messages: messages
		});

		const content = response.content[0];
		if (content.type !== 'text') {
			throw new Error('Unexpected response type from Claude');
		}

		console.log('✅ Generated conversational response');

		return json({
			success: true,
			response: content.text
		});

	} catch (error) {
		console.error('❌ Error in conversational chat:', error);
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to process conversational query'
		}, { status: 500 });
	}
};
