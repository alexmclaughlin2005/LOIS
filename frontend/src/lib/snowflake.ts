/**
 * Snowflake Connection Module for LOIS
 *
 * This module handles connections to Snowflake data warehouse
 * Supports both password and private key authentication
 */

import snowflake from 'snowflake-sdk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';
import crypto from 'crypto';
import { env } from '$env/dynamic/private';

export interface SnowflakeConfig {
	account: string;
	username: string;
	password?: string;
	privateKey?: string;
	database?: string;
	schema?: string;
	warehouse?: string;
	role?: string;
	authenticator?: string;
}

/**
 * Load and decrypt the private key for Snowflake authentication
 * Converts encrypted PKCS8 key to unencrypted format
 *
 * Supports two modes:
 * 1. Environment variable: SNOWFLAKE_PRIVATE_KEY (for production/Vercel)
 * 2. Local file: app_testing_rsa_key.p8 (for local development)
 */
function loadPrivateKey(): string | undefined {
	try {
		let encryptedKey: string;

		// First, try to load from environment variable (production)
		if (env.SNOWFLAKE_PRIVATE_KEY) {
			console.log('Loading private key from environment variable');
			encryptedKey = env.SNOWFLAKE_PRIVATE_KEY;
		} else {
			// Fallback to loading from file (local development)
			const keyPath = join(process.cwd(), 'app_testing_rsa_key.p8');
			if (!existsSync(keyPath)) {
				console.warn('No private key found in environment or file system');
				return undefined;
			}
			console.log('Loading private key from file:', keyPath);
			encryptedKey = readFileSync(keyPath, 'utf8');
		}

		// Decrypt the private key using the password
		if (env.SNOWFLAKE_PRIVATE_KEY_PASSWORD) {
			const privateKeyObject = crypto.createPrivateKey({
				key: encryptedKey,
				format: 'pem',
				passphrase: env.SNOWFLAKE_PRIVATE_KEY_PASSWORD
			});

			// Export as unencrypted PKCS8 PEM format
			const decryptedKey = privateKeyObject.export({
				type: 'pkcs8',
				format: 'pem'
			});

			return decryptedKey.toString();
		}

		console.warn('No private key password provided');
		return undefined;
	} catch (error) {
		console.warn('Failed to load private key:', error);
		console.warn('Falling back to password authentication');
		return undefined;
	}
}

/**
 * Get Snowflake connection configuration from environment variables
 */
export function getSnowflakeConfig(): SnowflakeConfig {
	const privateKey = loadPrivateKey();

	const config: SnowflakeConfig = {
		account: env.SNOWFLAKE_ACCOUNT || '',
		username: env.SNOWFLAKE_USER || '',
		database: env.SNOWFLAKE_DATABASE,
		schema: env.SNOWFLAKE_SCHEMA,
		warehouse: env.SNOWFLAKE_WAREHOUSE,
		role: env.SNOWFLAKE_ROLE
	};

	// Use private key authentication if available, otherwise use password
	if (privateKey) {
		config.privateKey = privateKey;
		config.authenticator = 'SNOWFLAKE_JWT';
		console.log('Using private key authentication');
	} else if (env.SNOWFLAKE_PASSWORD) {
		config.password = env.SNOWFLAKE_PASSWORD;
		console.log('Using password authentication');
	}

	return config;
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
		SHOW TABLES IN SCHEMA ${env.SNOWFLAKE_DATABASE}.${env.SNOWFLAKE_SCHEMA}
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
		DESCRIBE TABLE ${env.SNOWFLAKE_DATABASE}.${env.SNOWFLAKE_SCHEMA}.${tableName}
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
