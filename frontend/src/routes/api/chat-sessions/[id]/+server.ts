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

// GET - Fetch a single chat session by ID
export const GET: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;

		const result = await pool.query(
			`SELECT * FROM chat_sessions WHERE id = $1`,
			[id]
		);

		if (result.rows.length === 0) {
			return json(
				{
					success: false,
					error: 'Chat session not found'
				},
				{ status: 404 }
			);
		}

		return json({
			success: true,
			session: result.rows[0]
		});
	} catch (error) {
		console.error('Error fetching chat session:', error);
		return json(
			{
				success: false,
				error: 'Failed to fetch chat session'
			},
			{ status: 500 }
		);
	}
};

// PUT - Update a chat session (title, messages, etc.)
export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const { id } = params;
		const body = await request.json();
		const { title, messages, isArchived, projectId } = body;

		// Build dynamic update query based on provided fields
		const updates: string[] = [];
		const values: any[] = [];
		let paramCount = 1;

		if (title !== undefined) {
			updates.push(`title = $${paramCount}`);
			values.push(title);
			paramCount++;
		}

		if (messages !== undefined) {
			updates.push(`messages = $${paramCount}`);
			values.push(JSON.stringify(messages));
			paramCount++;

			// Update last_message_at when messages are updated
			updates.push(`last_message_at = NOW()`);
		}

		if (isArchived !== undefined) {
			updates.push(`is_archived = $${paramCount}`);
			values.push(isArchived);
			paramCount++;
		}

		if (projectId !== undefined) {
			updates.push(`project_id = $${paramCount}`);
			values.push(projectId);
			paramCount++;
		}

		if (updates.length === 0) {
			return json(
				{
					success: false,
					error: 'No fields to update'
				},
				{ status: 400 }
			);
		}

		values.push(id);
		const query = `
			UPDATE chat_sessions
			SET ${updates.join(', ')}
			WHERE id = $${paramCount}
			RETURNING *
		`;

		const result = await pool.query(query, values);

		if (result.rows.length === 0) {
			return json(
				{
					success: false,
					error: 'Chat session not found'
				},
				{ status: 404 }
			);
		}

		return json({
			success: true,
			session: result.rows[0]
		});
	} catch (error) {
		console.error('Error updating chat session:', error);
		return json(
			{
				success: false,
				error: 'Failed to update chat session'
			},
			{ status: 500 }
		);
	}
};

// DELETE - Delete a chat session
export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;

		const result = await pool.query(
			`DELETE FROM chat_sessions WHERE id = $1 RETURNING id`,
			[id]
		);

		if (result.rows.length === 0) {
			return json(
				{
					success: false,
					error: 'Chat session not found'
				},
				{ status: 404 }
			);
		}

		return json({
			success: true,
			message: 'Chat session deleted successfully'
		});
	} catch (error) {
		console.error('Error deleting chat session:', error);
		return json(
			{
				success: false,
				error: 'Failed to delete chat session'
			},
			{ status: 500 }
		);
	}
};
