import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
	connectionString: 'postgres://postgres.lwnfjqoimobmgzxxonyg:o7kbo9VwejmlWPh3@aws-1-us-east-1.pooler.supabase.com:6543/postgres',
	ssl: {
		rejectUnauthorized: false
	}
});

// GET - Fetch all chat sessions (most recent first)
export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const includeArchived = url.searchParams.get('includeArchived') === 'true';

		let query = `
			SELECT
				id,
				title,
				created_at,
				updated_at,
				last_message_at,
				is_archived,
				jsonb_array_length(messages) as message_count
			FROM chat_sessions
		`;

		if (!includeArchived) {
			query += ` WHERE is_archived = false`;
		}

		query += `
			ORDER BY last_message_at DESC
			LIMIT $1 OFFSET $2
		`;

		const result = await pool.query(query, [limit, offset]);

		return json({
			success: true,
			sessions: result.rows
		});
	} catch (error) {
		console.error('Error fetching chat sessions:', error);
		return json(
			{
				success: false,
				error: 'Failed to fetch chat sessions'
			},
			{ status: 500 }
		);
	}
};

// POST - Create a new chat session
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { title, messages = [], projectId = null, userId = null } = body;

		if (!title) {
			return json(
				{
					success: false,
					error: 'Title is required'
				},
				{ status: 400 }
			);
		}

		const result = await pool.query(
			`INSERT INTO chat_sessions (title, messages, project_id, user_id, last_message_at)
			VALUES ($1, $2, $3, $4, NOW())
			RETURNING *`,
			[title, JSON.stringify(messages), projectId, userId]
		);

		return json({
			success: true,
			session: result.rows[0]
		});
	} catch (error) {
		console.error('Error creating chat session:', error);
		return json(
			{
				success: false,
				error: 'Failed to create chat session'
			},
			{ status: 500 }
		);
	}
};
