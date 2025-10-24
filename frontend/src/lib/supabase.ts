import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

// Create Supabase client with environment variables
const supabaseUrl = env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Using demo mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection on initialization
export async function testConnection() {
  try {
    const { count, error } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Supabase connection error:', error);
      return false;
    }

    console.log(`✅ Supabase connected! ${count} projects in database`);
    return true;
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
    return false;
  }
}
