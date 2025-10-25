import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { executeSnowflakeQuery } from '$lib/snowflake';

/**
 * Generate a comprehensive schema map of all Snowflake data
 * This will be used to create context for the LLM
 */
export const GET: RequestHandler = async () => {
	try {
		const schemaMap: any = {
			databases: []
		};

		// Get all databases
		const databases = await executeSnowflakeQuery('SHOW DATABASES');

		for (const db of databases) {
			const dbName = db.name;
			const dbInfo: any = {
				name: dbName,
				schemas: []
			};

			try {
				// Get schemas in this database
				const schemas = await executeSnowflakeQuery(`SHOW SCHEMAS IN DATABASE ${dbName}`);

				for (const schema of schemas) {
					const schemaName = schema.name;
					const schemaInfo: any = {
						name: schemaName,
						tables: [],
						views: []
					};

					try {
						// Get tables
						const tables = await executeSnowflakeQuery(
							`SHOW TABLES IN ${dbName}.${schemaName}`
						);

						for (const table of tables) {
							const tableName = table.name;
							try {
								// Get columns for this table
								const columns = await executeSnowflakeQuery(
									`DESCRIBE TABLE ${dbName}.${schemaName}.${tableName}`
								);

								schemaInfo.tables.push({
									name: tableName,
									columns: columns.map((col) => ({
										name: col.name,
										type: col.type,
										nullable: col.null === 'Y',
										comment: col.comment
									}))
								});
							} catch (err) {
								console.error(`Error describing table ${tableName}:`, err);
							}
						}

						// Get views
						const views = await executeSnowflakeQuery(
							`SHOW VIEWS IN ${dbName}.${schemaName}`
						);

						for (const view of views) {
							const viewName = view.name;
							try {
								// Get columns for this view
								const columns = await executeSnowflakeQuery(
									`DESCRIBE VIEW ${dbName}.${schemaName}.${viewName}`
								);

								schemaInfo.views.push({
									name: viewName,
									columns: columns.map((col) => ({
										name: col.name,
										type: col.type,
										nullable: col.null === 'Y',
										comment: col.comment
									}))
								});
							} catch (err) {
								console.error(`Error describing view ${viewName}:`, err);
							}
						}

						dbInfo.schemas.push(schemaInfo);
					} catch (err) {
						console.error(`Error processing schema ${schemaName}:`, err);
					}
				}

				schemaMap.databases.push(dbInfo);
			} catch (err) {
				console.error(`Error processing database ${dbName}:`, err);
			}
		}

		return json({
			success: true,
			schemaMap,
			// Generate a text summary for LLM context
			textSummary: generateTextSummary(schemaMap)
		});
	} catch (error: any) {
		console.error('Schema map error:', error);
		return json(
			{
				success: false,
				error: error.message || 'Failed to generate schema map'
			},
			{ status: 500 }
		);
	}
};

/**
 * Generate a human-readable text summary of the schema
 * This will be injected into the LLM's context
 */
function generateTextSummary(schemaMap: any): string {
	let summary = '# Snowflake Database Schema\n\n';

	for (const db of schemaMap.databases) {
		summary += `## Database: ${db.name}\n\n`;

		for (const schema of db.schemas) {
			summary += `### Schema: ${db.name}.${schema.name}\n\n`;

			if (schema.tables.length > 0) {
				summary += '#### Tables:\n\n';
				for (const table of schema.tables) {
					summary += `**${table.name}**\n`;
					summary += 'Columns:\n';
					for (const col of table.columns) {
						summary += `  - ${col.name} (${col.type})${col.nullable ? ' NULL' : ' NOT NULL'}`;
						if (col.comment) summary += ` - ${col.comment}`;
						summary += '\n';
					}
					summary += '\n';
				}
			}

			if (schema.views.length > 0) {
				summary += '#### Views:\n\n';
				for (const view of schema.views) {
					summary += `**${view.name}**\n`;
					summary += 'Columns:\n';
					for (const col of view.columns) {
						summary += `  - ${col.name} (${col.type})${col.nullable ? ' NULL' : ' NOT NULL'}`;
						if (col.comment) summary += ` - ${col.comment}`;
						summary += '\n';
					}
					summary += '\n';
				}
			}
		}
	}

	return summary;
}
