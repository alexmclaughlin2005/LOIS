import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeSnowflakeQuery } from '$lib/snowflake';

/**
 * Snowflake Data Explorer API
 * GET /api/snowflake/explore?type=databases|schemas|tables|columns&database=X&schema=Y&table=Z
 */
export const GET: RequestHandler = async ({ url }) => {
	try {
		const type = url.searchParams.get('type');
		const database = url.searchParams.get('database');
		const schema = url.searchParams.get('schema');
		const table = url.searchParams.get('table');

		if (!type) {
			return json({ success: false, error: 'Type parameter is required' }, { status: 400 });
		}

		let query = '';
		let results: any[] = [];

		switch (type) {
			case 'databases':
				// List all databases
				query = 'SHOW DATABASES';
				results = await executeSnowflakeQuery(query);
				return json({
					success: true,
					data: results.map((row) => ({
						name: row.name || row.NAME,
						created_on: row.created_on || row.CREATED_ON,
						owner: row.owner || row.OWNER
					}))
				});

			case 'schemas':
				// List schemas in a database
				if (!database) {
					return json({ success: false, error: 'Database parameter is required' }, { status: 400 });
				}
				query = `SHOW SCHEMAS IN DATABASE ${database}`;
				results = await executeSnowflakeQuery(query);
				console.log('Schemas raw results:', JSON.stringify(results.slice(0, 2), null, 2));
				const schemas = results.map((row) => ({
					name: row.name || row.NAME || 'Unknown',
					database_name: row.database_name || row.DATABASE_NAME || database,
					created_on: row.created_on || row.CREATED_ON,
					owner: row.owner || row.OWNER || 'N/A'
				}));
				console.log('Schemas mapped:', JSON.stringify(schemas.slice(0, 2), null, 2));
				return json({
					success: true,
					data: schemas
				});

			case 'tables':
				// List tables and views in a schema using INFORMATION_SCHEMA
				if (!database || !schema) {
					return json(
						{ success: false, error: 'Database and schema parameters are required' },
						{ status: 400 }
					);
				}
				// Query INFORMATION_SCHEMA.TABLES
				// Note: Snowflake SDK returns original column names (uppercase), not SQL aliases
				query = `
					SELECT
						TABLE_NAME,
						TABLE_SCHEMA,
						TABLE_CATALOG,
						TABLE_TYPE,
						ROW_COUNT,
						BYTES,
						CREATED
					FROM ${database}.INFORMATION_SCHEMA.TABLES
					WHERE TABLE_SCHEMA = '${schema}'
					ORDER BY TABLE_NAME
				`;
				console.log('Executing query for database:', database, 'schema:', schema);
				results = await executeSnowflakeQuery(query);
				console.log('Query returned', results.length, 'results');
				if (results.length > 0) {
					console.log('First result keys:', Object.keys(results[0]));
					console.log('First result:', JSON.stringify(results[0], null, 2));
				}

				return json({
					success: true,
					data: results.map((row) => ({
						name: row.TABLE_NAME || row.table_name || 'Unknown',
						database_name: row.TABLE_CATALOG || row.table_catalog || database,
						schema_name: row.TABLE_SCHEMA || row.table_schema || schema,
						kind: (row.TABLE_TYPE || row.table_type || 'TABLE').replace('BASE TABLE', 'TABLE'),
						rows: row.ROW_COUNT || row.row_count || 0,
						bytes: row.BYTES || row.bytes || 0,
						created_on: row.CREATED || row.created
					}))
				});

			case 'columns':
				// Describe table/view columns
				if (!database || !schema || !table) {
					return json(
						{ success: false, error: 'Database, schema, and table parameters are required' },
						{ status: 400 }
					);
				}
				query = `DESCRIBE TABLE ${database}.${schema}.${table}`;
				results = await executeSnowflakeQuery(query);
				return json({
					success: true,
					data: results.map((row) => ({
						name: row.name || row.NAME,
						type: row.type || row.TYPE,
						kind: row.kind || row.KIND,
						null: (row.null || row.NULL) === 'Y',
						default: row.default || row.DEFAULT,
						primary_key: (row.primary_key || row.PRIMARY_KEY) === 'Y',
						unique_key: (row.unique_key || row.UNIQUE_KEY) === 'Y',
						comment: row.comment || row.COMMENT
					}))
				});

			case 'preview':
				// Preview table data
				if (!database || !schema || !table) {
					return json(
						{ success: false, error: 'Database, schema, and table parameters are required' },
						{ status: 400 }
					);
				}
				const limit = parseInt(url.searchParams.get('limit') || '10');
				query = `SELECT * FROM ${database}.${schema}.${table} LIMIT ${limit}`;
				results = await executeSnowflakeQuery(query);
				return json({
					success: true,
					data: results
				});

			default:
				return json({ success: false, error: 'Invalid type parameter' }, { status: 400 });
		}
	} catch (error: any) {
		console.error('Snowflake explore error:', error);
		return json(
			{
				success: false,
				error: error.message || 'Failed to explore Snowflake data',
				details: error.toString()
			},
			{ status: 500 }
		);
	}
};
