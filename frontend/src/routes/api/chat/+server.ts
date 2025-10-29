import { json, error } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// API key is optional for demo mode - will be configured in Phase 2
const anthropic = env.ANTHROPIC_API_KEY ? new Anthropic({
	apiKey: env.ANTHROPIC_API_KEY
}) : null;

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Return error if API key not configured (demo mode)
		if (!anthropic) {
			throw error(501, 'API endpoint not configured. Currently running in demo mode.');
		}

		const { messages } = await request.json();

		if (!messages || !Array.isArray(messages)) {
			throw error(400, 'Invalid request: messages array required');
		}

		// Convert messages to Anthropic format
		const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
			role: msg.role === 'user' ? 'user' : 'assistant',
			content: msg.content
		}));

		// Create a streaming response
		const stream = await anthropic.messages.create({
			model: 'claude-sonnet-4-5',
			max_tokens: 4096,
			messages: anthropicMessages,
			stream: true
		});

		// Create a ReadableStream for the response
		const readableStream = new ReadableStream({
			async start(controller) {
				try {
					for await (const event of stream) {
						if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
							const text = event.delta.text;
							controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
						}
					}
					controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
					controller.close();
				} catch (err) {
					controller.error(err);
				}
			}
		});

		return new Response(readableStream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		});
	} catch (err) {
		console.error('Chat API error:', err);
		throw error(500, 'Failed to process chat request');
	}
};
