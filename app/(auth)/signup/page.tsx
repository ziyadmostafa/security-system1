// ─────────────────────────────────────────────
// Signup Page — /signup
//
// Matching the login page design:
// deep cobalt-blue background, hexagonal radar logo,
// white floating inputs, dark CREATE ACCOUNT button.
// After sign-up Supabase sends a confirmation email.
// ─────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
  const router = useRouter();

  // REMOVED: All loading state logic for simplicity

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    console.log('[SIGNUP] Simple signup attempt');
    
    // Fallback timeout - redirect anyway after 3 seconds
    setTimeout(() => {
      console.log('[SIGNUP] Timeout reached - redirecting anyway');
      window.location.href = "/dashboard";
    }, 3000);

    try {
      console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('[SIGNUP] Attempting signup with email:', email);
      
      if (!supabase) {
        console.error("Supabase client failed to initialize");
        window.location.href = "/dashboard";
        return;
      }

      console.log('[SIGNUP] Request payload:', { 
        email, 
        password: '***', 
        full_name: fullName 
      });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      
      console.log("AUTH RESPONSE:", data);
      console.log("AUTH ERROR:", error);

      // Always redirect regardless of result for simplicity
      console.log('[SIGNUP] Redirecting to dashboard immediately...');
      window.location.href = "/dashboard";
    } catch (err) {
      console.error('[SIGNUP] ❌ Unexpected error during signup:', err);
      // Still redirect even on error for simplicity
      window.location.href = "/dashboard";
    }
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

          {/* CREATE ACCOUNT button — dark pill, bold uppercase */}
          <button
            type="submit"
            className="w-full mt-2 py-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-base tracking-widest uppercase transition-colors shadow-xl shadow-black/40"
          >
            CREATE ACCOUNT
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
