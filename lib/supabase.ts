import { createClient } from "@supabase/supabase-js";

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client with proper validation
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[SUPABASE] CRITICAL: Missing required environment variables');
  console.error('[SUPABASE] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗ MISSING');
  console.error('[SUPABASE] NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗ MISSING');
  console.error('[SUPABASE] Please check your .env.local file and ensure both variables are set');
  console.error('[SUPABASE] Authentication will not work without these variables');
  
  // Create a dummy client that will fail gracefully
  supabase = {
    auth: {
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured - missing environment variables')),
      signUp: () => Promise.reject(new Error('Supabase not configured - missing environment variables')),
      signOut: () => Promise.reject(new Error('Supabase not configured - missing environment variables')),
      getSession: () => Promise.reject(new Error('Supabase not configured - missing environment variables')),
      onAuthStateChange: () => ({ data: { subscription: null }, error: new Error('Supabase not configured') })
    }
  };
} else {
  console.log('[SUPABASE] ✓ Environment variables validated');
  console.log('[SUPABASE] URL:', supabaseUrl);
  console.log('[SUPABASE] Key: ✓ configured');
  
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Check if Supabase env vars are properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};