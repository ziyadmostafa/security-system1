// ─────────────────────────────────────────────
// Supabase client configuration
//
// This file creates a single shared Supabase client instance
// that can be imported anywhere in the app.
//
// The values come from environment variables defined in .env.local
// NEXT_PUBLIC_ prefix makes them accessible in the browser.
// ─────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

// Lazy initialization to avoid build-time errors
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    if (!supabaseInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      
      // During build or when env vars are missing, return a mock
      if (!supabaseUrl || !supabaseAnonKey) {
        return () => Promise.resolve({ data: null, error: null });
      }
      
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseInstance[prop as keyof typeof supabaseInstance];
  }
});
