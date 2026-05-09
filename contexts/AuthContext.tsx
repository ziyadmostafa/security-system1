// ─────────────────────────────────────────────
// Authentication Context
//
// Provides user authentication state across the app.
// Handles user session, login state, and user data.
// ─────────────────────────────────────────────

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser, Session, AuthChangeEvent } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role?: string;
  mall_name?: string | null;
  gate_number?: string | null;
  gate_id?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (supabaseUser: SupabaseUser) => {
    try {
      // Build user data with gate information from user_metadata
      // Open access model: no email-based filtering required
      const userData: AuthUser = {
        id: supabaseUser.id,
        full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || null,
        phone: supabaseUser.phone || null,
        role: supabaseUser.user_metadata?.role || 'User',
        mall_name: supabaseUser.user_metadata?.mall_name || null,
        gate_number: supabaseUser.user_metadata?.gate_number || null,
        gate_id: supabaseUser.user_metadata?.gate_id || null
      };
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      const userData: AuthUser = {
        id: supabaseUser.id,
        full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email || null,
        phone: supabaseUser.phone || null,
        role: supabaseUser.user_metadata?.role || 'User',
        mall_name: supabaseUser.user_metadata?.mall_name || null,
        gate_number: supabaseUser.user_metadata?.gate_number || null,
        gate_id: supabaseUser.user_metadata?.gate_id || null
      };
      setUser(userData);
    }
  };

  const refreshUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setSupabaseUser(currentUser);
        await fetchUserData(currentUser);
      } else {
        setSupabaseUser(null);
        setUser(null);
      }
    } catch (err) {
      console.error('[Auth] refreshUser failed:', err);
      setSupabaseUser(null);
      setUser(null);
    }
  };

  useEffect(() => {
    let subscription: any = null;

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSupabaseUser(session.user);
          await fetchUserData(session.user);
        }
      } catch (err) {
        console.error('[Auth] getInitialSession failed:', err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, session: Session | null) => {
          try {
            if (session?.user) {
              setSupabaseUser(session.user);
              await fetchUserData(session.user);
            } else {
              setSupabaseUser(null);
              setUser(null);
            }
          } catch (err) {
            console.error('[Auth] onAuthStateChange handler error:', err);
          } finally {
            setLoading(false);
          }
        }
      );
      subscription = data.subscription;
    } catch (err) {
      console.error('[Auth] onAuthStateChange setup failed:', err);
      setLoading(false);
    }

    return () => {
      if (subscription) {
        try { subscription.unsubscribe(); } catch (e) { /* ignore */ }
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, supabaseUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
