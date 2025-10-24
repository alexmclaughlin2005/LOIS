/**
 * Snowflake Connection Module for LOIS
 *
 * This module handles connections to Snowflake data warehouse
 * Supports both password and private key authentication
 */

import snowflake from 'snowflake-sdk';
import {
	SNOWFLAKE_ACCOUNT,
	SNOWFLAKE_USER,
	SNOWFLAKE_PASSWORD,
	SNOWFLAKE_DATABASE,
	SNOWFLAKE_SCHEMA,
	SNOWFLAKE_WAREHOUSE,
	SNOWFLAKE_ROLE
} from '$env/static/private';

export interface SnowflakeConfig {
	account: string;
	username: string;
	password?: string;
	database?: string;
	schema?: string;
	warehouse?: string;
	role?: string;
}

/**
 * Get Snowflake connection configuration from environment variables
 */
export function getSnowflakeConfig(): SnowflakeConfig {
	return {
		account: SNOWFLAKE_ACCOUNT,
		username: SNOWFLAKE_USER,
		password: SNOWFLAKE_PASSWORD,
		database: SNOWFLAKE_DATABASE,
		schema: SNOWFLAKE_SCHEMA,
		warehouse: SNOWFLAKE_WAREHOUSE,
		role: SNOWFLAKE_ROLE
	};
}

/**
 * Create a Snowflake connection
 */
export function createSnowflakeConnection(): Promise<snowflake.Connection> {
	return new Promise((resolve, reject) => {
		const config = getSnowflakeConfig();

		const connection = snowflake.createConnection(config);

		connection.connect((err, conn) => {
			if (err) {
				console.error('Unable to connect to Snowflake:', err.message);
				reject(err);
			} else {
				console.log('Successfully connected to Snowflake');
				resolve(conn);
			}
		});
	});
}

/**
 * Execute a query on Snowflake and return results as an array of objects
 */
export async function executeSnowflakeQuery<T = any>(
	query: string,
	binds?: any[]
): Promise<T[]> {
	const connection = await createSnowflakeConnection();

	return new Promise((resolve, reject) => {
		connection.execute({
			sqlText: query,
			binds: binds,
			complete: (err, stmt, rows) => {
				// Close connection
				connection.destroy((destroyErr) => {
					if (destroyErr) {
						console.error('Failed to close connection:', destroyErr.message);
					}
				});

				if (err) {
					console.error('Failed to execute statement:', err.message);
					reject(err);
				} else {
					// Convert rows to objects with column names
					const columns = stmt.getColumns();
					const columnNames = columns.map(col => col.getName());

					const results = (rows || []).map(row => {
						const obj: any = {};
						columnNames.forEach((name, index) => {
							obj[name] = row[index];
						});
						return obj as T;
					});

					resolve(results);
				}
			}
		});
	});
}

/**
 * Test Snowflake connection
 */
export async function testSnowflakeConnection(): Promise<boolean> {
	try {
		const connection = await createSnowflakeConnection();

		return new Promise((resolve, reject) => {
			connection.execute({
				sqlText: 'SELECT CURRENT_VERSION()',
				complete: (err) => {
					connection.destroy((destroyErr) => {
						if (destroyErr) {
							console.error('Failed to close connection:', destroyErr.message);
						}
					});

					if (err) {
						reject(err);
					} else {
						resolve(true);
					}
				}
			});
		});
	} catch (error) {
		console.error('Snowflake connection test failed:', error);
		return false;
	}
}

/**
 * Get available tables in the current schema
 */
export async function getSnowflakeTables(): Promise<Array<{ name: string; type: string }>> {
	const query = `
		SHOW TABLES IN SCHEMA ${SNOWFLAKE_DATABASE}.${SNOWFLAKE_SCHEMA}
	`;

	try {
		const results = await executeSnowflakeQuery<any>(query);
		return results.map(row => ({
			name: row.name || row.NAME,
			type: row.kind || row.KIND || 'TABLE'
		}));
	} catch (error) {
		console.error('Failed to get Snowflake tables:', error);
		return [];
	}
}

/**
 * Get table schema (columns and types)
 */
export async function getTableSchema(tableName: string): Promise<Array<{
	name: string;
	type: string;
	nullable: boolean;
}>> {
	const query = `
		DESCRIBE TABLE ${SNOWFLAKE_DATABASE}.${SNOWFLAKE_SCHEMA}.${tableName}
	`;

	try {
		const results = await executeSnowflakeQuery<any>(query);
		return results.map(row => ({
			name: row.name || row.NAME,
			type: row.type || row.TYPE,
			nullable: (row.null || row.NULL) === 'Y'
		}));
	} catch (error) {
		console.error(`Failed to get schema for table ${tableName}:`, error);
		return [];
	}
}
