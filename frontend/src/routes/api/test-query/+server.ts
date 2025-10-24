import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const GET: RequestHandler = async () => {
	try {
		// Test 1: Direct query
		const { data: directData, error: directError } = await supabaseAdmin
			.from('time_entries')
			.select('*')
			.limit(5);

		console.log('Direct query result:', { directData, directError });

		// Test 2: Using RPC function
		const testSQL = 'SELECT * FROM time_entries LIMIT 5';
		const { data: rpcData, error: rpcError } = await supabaseAdmin.rpc('execute_readonly_sql', {
			query_text: testSQL
		});

		console.log('RPC query result:', { rpcData, rpcError });

		return json({
			direct: { data: directData, error: directError },
			rpc: { data: rpcData, error: rpcError }
		});
	} catch (error) {
		console.error('Test error:', error);
		return json({ error: String(error) }, { status: 500 });
	}
};
