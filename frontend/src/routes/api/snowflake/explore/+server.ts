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
				// Use INFORMATION_SCHEMA.TABLES which has consistent column names
				query = `
					SELECT
						TABLE_NAME as name,
						TABLE_SCHEMA as schema_name,
						TABLE_CATALOG as database_name,
						TABLE_TYPE as kind,
						ROW_COUNT as row_count,
						BYTES as byte_count,
						CREATED as created_on
					FROM ${database}.INFORMATION_SCHEMA.TABLES
					WHERE TABLE_SCHEMA = '${schema}'
					ORDER BY TABLE_NAME
				`;
				console.log('Executing query for database:', database, 'schema:', schema);
				console.log('Query:', query);
				results = await executeSnowflakeQuery(query);
				console.log('Query returned', results.length, 'results');
				console.log('Tables from INFORMATION_SCHEMA (first row):', JSON.stringify(results[0], null, 2));

				return json({
					success: true,
					data: results.map((row) => ({
						name: row.name || row.NAME || 'Unknown',
						database_name: row.database_name || row.DATABASE_NAME || database,
						schema_name: row.schema_name || row.SCHEMA_NAME || schema,
						kind: (row.kind || row.KIND || 'TABLE').replace('BASE TABLE', 'TABLE'),
						rows: row.row_count || row.ROW_COUNT || 0,
						bytes: row.byte_count || row.BYTE_COUNT || 0,
						created_on: row.created_on || row.CREATED_ON
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
