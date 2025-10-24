import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeSnowflakeQuery } from '$lib/snowflake';

/**
 * POST /api/snowflake/query
 * Execute a Snowflake query and return results
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { query, binds } = await request.json();

		if (!query || typeof query !== 'string') {
			return json(
				{
					success: false,
					error: 'Query is required and must be a string'
				},
				{ status: 400 }
			);
		}

		console.log('Executing Snowflake query:', query);

		const results = await executeSnowflakeQuery(query, binds);

		return json({
			success: true,
			data: results,
			rowCount: results.length
		});
	} catch (error: any) {
		console.error('Snowflake query error:', error);
		return json(
			{
				success: false,
				error: error.message || 'Failed to execute Snowflake query',
				details: error.toString()
			},
			{ status: 500 }
		);
	}
};
