import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create singleton Supabase client with safe initialization
let supabase: SupabaseClient | null = null;
let isInitialized = false;

function initializeSupabase(): SupabaseClient | null {
  if (isInitialized) {
    return supabase;
  }

  // Check if we're in a build environment (server-side rendering)
  const isBuildTime = typeof window === 'undefined' && process.env.NODE_ENV === 'production';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    if (!isBuildTime) {
      // Only log warnings during development/runtime, not during build
      console.warn('[SUPABASE] Environment variables not configured');
      console.warn('[SUPABASE] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗ MISSING');
      console.warn('[SUPABASE] NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗ MISSING');
      console.warn('[SUPABASE] Please check your Vercel environment variables');
    }
    
    // Return null instead of throwing to prevent build crashes
    supabase = null;
    isInitialized = true;
    return null;
  }

  // Fix incorrect URL - remove /rest/v1/ if present
  const cleanUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, '');
  
  console.log('[SUPABASE] ✓ Initializing Supabase client');
  console.log('[SUPABASE] URL:', cleanUrl);
  console.log('[SUPABASE] Key: ✓ configured');
  
  supabase = createClient(cleanUrl, supabaseAnonKey, {
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

// Safe initialization that doesn't throw during build
supabase = initializeSupabase();

export { supabase };

// Check if Supabase env vars are properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

// Get Supabase URL for debugging
export const getSupabaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return 'not configured';
  // Return clean URL without /rest/v1/
  return url.replace(/\/rest\/v1\/?$/, '');
};