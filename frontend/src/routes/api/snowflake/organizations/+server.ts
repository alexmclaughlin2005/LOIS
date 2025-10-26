import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeSnowflakeQuery } from '$lib/snowflake';

/**
 * GET /api/snowflake/organizations
 * Fetch distinct organizations from Snowflake for filtering
 */
export const GET: RequestHandler = async () => {
	try {
		// Query to get distinct organizations
		const query = `
			SELECT DISTINCT
				ORG_ID,
				ORG_NAME
			FROM TEAM_THC2.DATABRIDGE.VW_DATABRIDGE_PROJECT_LIST_DATA_V1
			WHERE ORG_ID IS NOT NULL
				AND ORG_NAME IS NOT NULL
			ORDER BY ORG_NAME
		`;

		console.log('Fetching organizations from Snowflake');
		const results = await executeSnowflakeQuery(query);

		return json({
			success: true,
			organizations: results
		});
	} catch (error: any) {
		console.error('Error fetching organizations:', error);
		return json(
			{
				success: false,
				error: error.message || 'Failed to fetch organizations'
			},
			{ status: 500 }
		);
	}
};
