import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import snowflake from 'snowflake-sdk';

export const GET: RequestHandler = async () => {
	try {
		// Create connection
		const connection = snowflake.createConnection({
			account: 'SMB46128',
			username: 'INTERNAL_INTEGRATION_USER',
			authenticator: 'SNOWFLAKE_JWT',
			privateKeyPath: 'app_testing_rsa_key.p8',
			privateKeyPass: 'S50IrYonjehuyhZS2F',
			database: 'TEAM_THC2',
			schema: 'DATABRIDGE',
			warehouse: 'INTERNAL_INTEGRATIONS'
		});

		// Connect
		await new Promise<void>((resolve, reject) => {
			connection.connect((err) => {
				if (err) {
					console.error('Unable to connect:', err);
					reject(err);
				} else {
					console.log('Successfully connected to Snowflake');
					resolve();
				}
			});
		});

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

		// Execute query
		const results = await new Promise<any[]>((resolve, reject) => {
			connection.execute({
				sqlText: query,
				complete: (err, stmt, rows) => {
					if (err) {
						console.error('Failed to execute statement:', err);
						reject(err);
					} else {
						resolve(rows || []);
					}
				}
			});
		});

		// Destroy connection
		connection.destroy((err) => {
			if (err) {
				console.error('Unable to disconnect:', err);
			} else {
				console.log('Disconnected from Snowflake');
			}
		});

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
