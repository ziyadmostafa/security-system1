import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create singleton Supabase client with proper validation
let supabase: SupabaseClient;
let isInitialized = false;

function initializeSupabase(): SupabaseClient {
  if (isInitialized) {
    return supabase;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[SUPABASE] CRITICAL: Missing required environment variables');
    console.error('[SUPABASE] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗ MISSING');
    console.error('[SUPABASE] NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗ MISSING');
    console.error('[SUPABASE] Please check your .env.local file and ensure both variables are set');
    console.error('[SUPABASE] Authentication will not work without these variables');
    
    // Throw error instead of returning dummy client to catch issues early
    throw new Error('Supabase not configured - missing environment variables');
  }

  console.log('[SUPABASE] ✓ Initializing Supabase client');
  console.log('[SUPABASE] URL:', supabaseUrl);
  console.log('[SUPABASE] Key: ✓ configured');
  
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  
  isInitialized = true;
  console.log('[SUPABASE] ✓ Client initialized successfully');
  
  return supabase;
}

// Initialize client immediately or throw error
try {
  supabase = initializeSupabase();
} catch (error) {
  console.error('[SUPABASE] Failed to initialize:', error);
  // Re-throw to let calling code handle the error
  throw error;
}

export { supabase };

// Check if Supabase env vars are properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

// Get Supabase URL for debugging
export const getSupabaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || 'not configured';
};