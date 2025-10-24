import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

// Use service role key for direct SQL execution
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { sql } = await request.json();

		if (!sql || typeof sql !== 'string') {
			return json({ error: 'SQL query is required' }, { status: 400 });
		}

		console.log('🔍 Executing SQL:', sql);

		// Safety check: ensure query is SELECT only
		const sqlUpper = sql.trim().toUpperCase();
		if (!sqlUpper.startsWith('SELECT')) {
			return json({ error: 'Only SELECT queries are allowed' }, { status: 400 });
		}

		// Check for dangerous keywords
		const dangerousKeywords = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'TRUNCATE', 'ALTER', 'CREATE', 'GRANT', 'REVOKE'];
		for (const keyword of dangerousKeywords) {
			if (sqlUpper.includes(keyword)) {
				return json({ error: `Query contains forbidden keyword: ${keyword}` }, { status: 400 });
			}
		}

		// Execute the SQL query using RPC
		// Note: You'll need to create this function in Supabase:
		// CREATE OR REPLACE FUNCTION execute_readonly_sql(query_text text)
		// RETURNS json AS $$
		// DECLARE
		//   result json;
		// BEGIN
		//   EXECUTE query_text INTO result;
		//   RETURN result;
		// END;
		// $$ LANGUAGE plpgsql SECURITY DEFINER;

		const { data, error } = await supabaseAdmin.rpc('execute_readonly_sql', {
			query_text: sql
		});

		if (error) {
			console.error('❌ Query execution error:', error);
			return json({ error: `Query execution failed: ${error.message}` }, { status: 500 });
		}

		console.log('✅ Query executed successfully, rows:', data?.length || 0);

		return json({
			success: true,
			data: data,
			rowCount: Array.isArray(data) ? data.length : 1
		});

	} catch (error) {
		console.error('❌ Error executing query:', error);
		return json({
			error: error instanceof Error ? error.message : 'Failed to execute query'
		}, { status: 500 });
	}
};
