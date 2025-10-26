import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { executeSnowflakeQuery } from '$lib/snowflake';
import { CORTEX_SEMANTIC_MODEL } from '$lib/cortexSemanticModel';
import crypto from 'crypto';

/**
 * Snowflake Cortex Analyst API Integration
 *
 * This endpoint calls the Snowflake Cortex Analyst REST API to convert
 * natural language questions into SQL queries using semantic models.
 */

interface CortexAnalystMessage {
	role: 'user' | 'analyst';
	content: Array<{
		type: 'text' | 'sql';
		text?: string;
		statement?: string;
	}>;
}

interface CortexAnalystRequest {
	messages: CortexAnalystMessage[];
	semantic_model: string;
}

interface CortexAnalystResponse {
	request_id: string;
	message: CortexAnalystMessage;
	warnings?: string[];
	response_metadata?: {
		model_names?: string[];
		question_category?: string;
	};
}

/**
 * Load and decrypt the private key for Snowflake authentication
 */
async function loadPrivateKey(): Promise<string | undefined> {
	try {
		let encryptedKey: string | undefined;

		// First, try to load from environment variable (production)
		if (env.SNOWFLAKE_PRIVATE_KEY) {
			console.log('Loading private key from environment variable');
			encryptedKey = env.SNOWFLAKE_PRIVATE_KEY;
		} else {
			// Fallback to loading from file (local development)
			try {
				const { readFileSync } = await import('fs');
				const { join } = await import('path');
				const { existsSync } = await import('fs');

				const keyPath = join(process.cwd(), 'app_testing_rsa_key.p8');
				if (existsSync(keyPath)) {
					console.log('Loading private key from file:', keyPath);
					encryptedKey = readFileSync(keyPath, 'utf8');
				}
			} catch (fileError) {
				console.log('Private key file not accessible');
			}
		}

		if (!encryptedKey) {
			console.warn('No private key found');
			return undefined;
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

		return encryptedKey;
	} catch (error) {
		console.error('Error loading private key:', error);
		return undefined;
	}
}

/**
 * Generate a JWT token for Snowflake authentication
 * Using the key pair authentication method
 */
async function generateSnowflakeJWT(): Promise<string> {
	const account = env.SNOWFLAKE_ACCOUNT?.toUpperCase();
	const user = env.SNOWFLAKE_USER?.toUpperCase();

	if (!account || !user) {
		throw new Error('SNOWFLAKE_ACCOUNT and SNOWFLAKE_USER must be set');
	}

	// Load the private key
	const privateKey = await loadPrivateKey();
	if (!privateKey) {
		throw new Error('Could not load Snowflake private key');
	}

	// Calculate the public key fingerprint (SHA256)
	const publicKey = crypto.createPublicKey(privateKey);
	const publicKeyDer = publicKey.export({
		type: 'spki',
		format: 'der'
	});
	const fingerprint = crypto.createHash('sha256').update(publicKeyDer).digest('base64');

	// Build the qualified username
	const qualifiedUsername = `${account}.${user}`;

	// JWT payload
	const now = Math.floor(Date.now() / 1000);
	const payload = {
		iss: `${qualifiedUsername}.SHA256:${fingerprint}`,
		sub: qualifiedUsername,
		iat: now,
		exp: now + 3600 // 1 hour expiration
	};

	// JWT header
	const header = {
		alg: 'RS256',
		typ: 'JWT'
	};

	// Encode header and payload
	const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
	const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

	// Sign the token
	const signatureInput = `${encodedHeader}.${encodedPayload}`;
	const signature = crypto.sign('RSA-SHA256', Buffer.from(signatureInput), privateKey);
	const encodedSignature = signature.toString('base64url');

	// Combine to create the JWT
	const jwt = `${encodedHeader}.${encodedPayload}.${encodedSignature}`;

	console.log('Generated JWT token for user:', qualifiedUsername);
	return jwt;
}

/**
 * Call the Snowflake Cortex Analyst REST API
 */
async function callCortexAnalyst(
	question: string,
	conversationHistory: CortexAnalystMessage[] = []
): Promise<CortexAnalystResponse> {
	const account = env.SNOWFLAKE_ACCOUNT;

	// Build the full URL: https://<account>.snowflakecomputing.com/api/v2/cortex/analyst/message
	const url = `https://${account}.snowflakecomputing.com/api/v2/cortex/analyst/message`;

	// Prepare messages array (include conversation history + new question)
	const messages: CortexAnalystMessage[] = [
		...conversationHistory,
		{
			role: 'user',
			content: [
				{
					type: 'text',
					text: question
				}
			]
		}
	];

	const requestBody: CortexAnalystRequest = {
		messages,
		semantic_model: CORTEX_SEMANTIC_MODEL
	};

	console.log('Calling Cortex Analyst API:', url);
	console.log('Request body:', JSON.stringify(requestBody, null, 2));

	// Get authentication token
	const authToken = await generateSnowflakeJWT();

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${authToken}`,
			'X-Snowflake-Authorization-Token-Type': 'KEYPAIR_JWT'
		},
		body: JSON.stringify(requestBody)
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('Cortex Analyst API error:', errorText);
		throw new Error(`Cortex Analyst API failed: ${response.status} ${response.statusText}\n${errorText}`);
	}

	const result: CortexAnalystResponse = await response.json();
	console.log('Cortex Analyst response:', JSON.stringify(result, null, 2));

	return result;
}

/**
 * Extract SQL from Cortex Analyst response
 */
function extractSQL(response: CortexAnalystResponse): string | null {
	for (const contentItem of response.message.content) {
		if (contentItem.type === 'sql' && contentItem.statement) {
			return contentItem.statement;
		}
	}
	return null;
}

/**
 * Extract text summary from Cortex Analyst response
 */
function extractSummary(response: CortexAnalystResponse): string {
	const textParts: string[] = [];
	for (const contentItem of response.message.content) {
		if (contentItem.type === 'text' && contentItem.text) {
			textParts.push(contentItem.text);
		}
	}
	return textParts.join('\n\n');
}

/**
 * Apply ORG_ID filter to generated SQL query
 * Intelligently adds WHERE clause or extends existing WHERE clause
 * Only applies if the query references tables that have ORG_ID
 */
function applyOrgFilter(sql: string, orgId: string): string {
	const sqlUpper = sql.toUpperCase();

	// Check if query references tables that have ORG_ID
	// All VW_DATABRIDGE tables have ORG_ID
	const hasDatabridgeTables = sqlUpper.includes('VW_DATABRIDGE');

	// Skip filtering if no databridge tables are referenced
	if (!hasDatabridgeTables) {
		console.log('Skipping ORG_ID filter - no VW_DATABRIDGE tables detected');
		return sql;
	}

	// Check if query already has a WHERE clause
	const hasWhere = sqlUpper.includes('WHERE');
	const hasGroupBy = sqlUpper.includes('GROUP BY');
	const hasOrderBy = sqlUpper.includes('ORDER BY');
	const hasLimit = sqlUpper.includes('LIMIT');

	// Use table alias if present, otherwise just ORG_ID
	// Look for common table aliases in FROM/JOIN clauses
	const tableAliasMatch = sql.match(/VW_DATABRIDGE_\w+\s+(?:AS\s+)?(\w+)/i);
	const tableAlias = tableAliasMatch ? tableAliasMatch[1] + '.' : '';
	const orgFilter = `${tableAlias}ORG_ID = '${orgId}'`;

	if (!hasWhere) {
		// No WHERE clause - add one before GROUP BY, ORDER BY, or LIMIT
		if (hasGroupBy) {
			return sql.replace(/GROUP BY/i, `WHERE ${orgFilter}\nGROUP BY`);
		} else if (hasOrderBy) {
			return sql.replace(/ORDER BY/i, `WHERE ${orgFilter}\nORDER BY`);
		} else if (hasLimit) {
			return sql.replace(/LIMIT/i, `WHERE ${orgFilter}\nLIMIT`);
		} else {
			// No clauses - add at the end
			return sql.trim() + `\nWHERE ${orgFilter}`;
		}
	} else {
		// Has WHERE clause - extend it with AND
		return sql.replace(/WHERE/i, `WHERE ${orgFilter} AND `);
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { question, conversationHistory, orgId } = await request.json();

		if (!question) {
			return json({ success: false, error: 'Question is required' }, { status: 400 });
		}

		console.log('Cortex Analyst query:', question);
		if (orgId) {
			console.log('Filtering by ORG_ID:', orgId);
		}

		// Step 1: Call Cortex Analyst to generate SQL
		const cortexResponse = await callCortexAnalyst(question, conversationHistory);

		// Step 2: Extract SQL and summary from response
		let sqlQuery = extractSQL(cortexResponse);
		const cortexSummary = extractSummary(cortexResponse);

		if (!sqlQuery) {
			return json({
				success: false,
				error: 'Cortex Analyst did not generate a SQL query',
				cortexResponse: cortexSummary
			});
		}

		console.log('Cortex generated SQL (before org filter):', sqlQuery);

		// Step 2.5: Apply ORG_ID filter if provided
		if (orgId) {
			sqlQuery = applyOrgFilter(sqlQuery, orgId);
			console.log('Cortex generated SQL (after org filter):', sqlQuery);
		}

		// Step 3: Execute the SQL query
		const results = await executeSnowflakeQuery(sqlQuery);

		// Step 4: Return results with Cortex's interpretation
		return json({
			success: true,
			sql: sqlQuery,
			results,
			summary: cortexSummary,
			rowCount: results.length,
			requestId: cortexResponse.request_id,
			metadata: cortexResponse.response_metadata,
			warnings: cortexResponse.warnings || []
		});
	} catch (error: any) {
		console.error('Cortex Analyst error:', error);

		// Check if it's a Cortex API error
		if (error.message?.includes('Cortex Analyst API failed')) {
			return json(
				{
					success: false,
					error: 'Failed to call Cortex Analyst API',
					details: error.message,
					suggestion:
						'Make sure your Snowflake account has Cortex Analyst enabled and the user has CORTEX_ANALYST_USER role.'
				},
				{ status: 500 }
			);
		}

		return json(
			{
				success: false,
				error: error.message || 'Failed to process query',
				details: error.toString()
			},
			{ status: 500 }
		);
	}
};
