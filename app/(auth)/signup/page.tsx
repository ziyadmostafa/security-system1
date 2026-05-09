// ─────────────────────────────────────────────
// Signup Page — /signup
//
// Matching the login page design:
// deep cobalt-blue background, hexagonal radar logo,
// white floating inputs, dark CREATE ACCOUNT button.
// After sign-up Supabase sends a confirmation email.
// ─────────────────────────────────────────────

"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import Image from "next/image";

// ── Person icon (right side of full-name input) ──
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// ── Envelope icon (right side of email input) ──
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

// ── Lock icon (right side of password input) ──
function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ── Check circle icon (used in success screen) ──
function CheckCircleIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function SignupPage() {
  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");

  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [success, setSuccess]     = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Validate authentication configuration first
      if (!isSupabaseConfigured()) {
        console.error('[SIGNUP] Supabase not configured - missing environment variables');
        setError('Authentication system is not properly configured. Please contact support.');
        setLoading(false);
        return;
      }

      console.log('[SIGNUP] Attempting signup with email:', email);
      console.log('[SIGNUP] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('[SIGNUP] Request payload:', { 
        email, 
        password: '***', 
        full_name: fullName 
      });
      
      // Test network connectivity before attempting auth
      const startTime = Date.now();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Store the user's display name in their profile metadata
          data: { full_name: fullName },
        },
      });
      const endTime = Date.now();
      
      console.log('[SIGNUP] Request completed in:', endTime - startTime, 'ms');
      console.log('[SIGNUP] Response received:', { 
        data: data ? '✓' : 'null', 
        error: error ? error.message : 'none' 
      });

      if (error) {
        console.error('[SIGNUP] Supabase auth error:', error);
        console.error('[SIGNUP] Full error details:', {
          message: error.message,
          status: error.status,
          code: error.code,
          stack: error.stack
        });
        
        // Provide specific user-friendly error messages
        let userMessage = error.message;
        if (error.message?.toLowerCase().includes('user already registered')) {
          userMessage = 'An account with this email already exists. Please try logging in instead.';
        } else if (error.message?.toLowerCase().includes('password should be')) {
          userMessage = 'Password is too weak. Please use a stronger password.';
        } else if (error.message?.toLowerCase().includes('invalid email')) {
          userMessage = 'Please enter a valid email address.';
        } else if (error.message?.toLowerCase().includes('network') || error.message?.toLowerCase().includes('fetch')) {
          userMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message?.toLowerCase().includes('rate limit')) {
          userMessage = 'Too many signup attempts. Please wait a moment and try again.';
        } else if (error.message?.toLowerCase().includes('supabase not configured')) {
          userMessage = 'Authentication system is not properly configured. Please contact support.';
        }
        
        setError(userMessage);
        setLoading(false);
      } else {
        console.log('[SIGNUP] ✓ Signup successful');
        console.log('[SIGNUP] User data:', { 
          id: data.user?.id, 
          email: data.user?.email,
          confirmed: data.user?.email_confirmed ? '✓' : 'pending'
        });
        setSuccess(true);
      }
    } catch (err) {
      console.error('[SIGNUP] ❌ Unexpected error during signup:', err);
      console.error('[SIGNUP] Error stack:', err instanceof Error ? err.stack : 'No stack available');
      
      // Handle different types of errors
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (err instanceof Error) {
        if (err.message?.toLowerCase().includes('network') || err.message?.toLowerCase().includes('fetch')) {
          errorMessage = 'Network connection failed. Please check your internet and try again.';
        } else if (err.message?.toLowerCase().includes('timeout')) {
          errorMessage = 'Request timed out. Please check your connection and try again.';
        }
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  }

  // ── Email confirmation success screen ──
  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "linear-gradient(180deg, #1a4fbb 0%, #1253a8 60%, #0e3d8a 100%)" }}
      >
        <div className="w-full max-w-xs flex flex-col items-center text-center gap-5">
          <div className="drop-shadow-[0_0_20px_rgba(0,207,255,0.5)]">
            <CheckCircleIcon />
          </div>
          <h2 className="text-2xl font-bold text-white">Check your email</h2>
          <p className="text-white/70 text-sm leading-relaxed">
            We sent a confirmation link to{" "}
            <strong className="text-white">{email}</strong>.{" "}
            Click it to activate your account.
          </p>
          <Link
            href="/login"
            className="mt-2 w-full py-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-lg tracking-widest uppercase transition-colors shadow-xl shadow-black/40 text-center"
          >
            BACK TO LOGIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    /* ── Full-screen deep cobalt-blue background ── */
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{ background: "linear-gradient(180deg, #1a4fbb 0%, #1253a8 60%, #0e3d8a 100%)" }}
    >
      <div className="w-full max-w-xs flex flex-col items-center">

        {/* ── Logo ── */}
        <div className="mb-10">
          <Image
            src="/logo.png"
            alt="Security System Logo"
            width={180}
            height={180}
            className="object-contain"
            priority
          />
        </div>

        {/* ── Page heading ── */}
        <h1 className="text-white text-2xl font-bold tracking-wide mb-1">
          Create Account
        </h1>
        <p className="text-white/60 text-sm mb-7">Join Security System</p>

        {/* ── Form (fields float on the blue bg, no card) ── */}
        <form onSubmit={handleSignup} className="w-full flex flex-col gap-4">

          {/* Full name field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-base font-normal pl-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Your full name"
                className="w-full bg-white text-gray-700 placeholder-gray-400 rounded-2xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <UserIcon />
              </span>
            </div>
          </div>

          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-base font-normal pl-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
                className="w-full bg-white text-gray-700 placeholder-gray-400 rounded-2xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <MailIcon />
              </span>
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-base font-normal pl-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min. 6 characters"
                className="w-full bg-white text-gray-700 placeholder-gray-400 rounded-2xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <LockIcon />
              </span>
            </div>
          </div>

          {/* Confirm password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white text-base font-normal pl-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                placeholder="Re-enter password"
                className="w-full bg-white text-gray-700 placeholder-gray-400 rounded-2xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <LockIcon />
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-300 text-xs bg-red-500/20 border border-red-400/30 rounded-xl px-3 py-2 text-center">
              {error}
            </p>
          )}

          {/* CREATE ACCOUNT button — dark pill, bold uppercase */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 rounded-2xl bg-gray-900 hover:bg-black disabled:opacity-60 text-white font-bold text-base tracking-widest uppercase transition-colors shadow-xl shadow-black/40"
          >
            {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V9C13 3.6 10.4 1 7 1H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  CREATING ACCOUNT...
                </>
              ) : "CREATE ACCOUNT"}
          </button>

          {/* Link to login */}
          <p className="text-center text-white/70 text-sm mt-1">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-semibold hover:text-blue-200 underline underline-offset-2">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
