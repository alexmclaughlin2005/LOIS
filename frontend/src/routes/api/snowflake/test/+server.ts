import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { testSnowflakeConnection, getSnowflakeTables } from '$lib/snowflake';

/**
 * GET /api/snowflake/test
 * Test Snowflake connection and return available tables
 */
export const GET: RequestHandler = async () => {
	try {
		console.log('Testing Snowflake connection...');

		const isConnected = await testSnowflakeConnection();

		if (!isConnected) {
			return json(
				{
					success: false,
					error: 'Failed to connect to Snowflake'
				},
				{ status: 500 }
			);
		}

		// Get available tables
		const tables = await getSnowflakeTables();

		return json({
			success: true,
			connected: true,
			message: 'Successfully connected to Snowflake',
			tables: tables
		});
	} catch (error: any) {
		console.error('Snowflake connection test error:', error);
		return json(
			{
				success: false,
				connected: false,
				error: error.message || 'Failed to test Snowflake connection',
				details: error.toString()
			},
			{ status: 500 }
		);
	}
};
