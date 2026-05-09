// ─────────────────────────────────────────────
// Login Page — /login
//
// PIXEL-PERFECT REPLICA of reference design
// ONLY MODIFICATION: Logo replaced with /logo.png
// ─────────────────────────────────────────────

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import styles from "./login.module.css";

// ── Project Logo (same as Home Page /logo.png) ──
function ProjectLogo() {
  return (
    <Image
      src="/logo.png"
      alt="Security System Logo"
      width={140}
      height={140}
      className="object-contain"
      priority
    />
  );
}

// ── Lock Icon for left side (from reference) ──
function LockSideIcon() {
  return (
    <div className="relative w-[50px] h-[60px]">
      <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
        <defs>
          <radialGradient id="lockGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00aaff" />
            <stop offset="100%" stopColor="#0066cc" />
          </radialGradient>
          <filter id="lockGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Lock body */}
        <rect x="8" y="25" width="34" height="30" rx="4" fill="url(#lockGrad)" stroke="#00d4ff" strokeWidth="1.5" filter="url(#lockGlow)" />
        {/* Lock shackle */}
        <path d="M15 25 V18 Q15 8 25 8 Q35 8 35 18 V25" fill="none" stroke="#00d4ff" strokeWidth="2" filter="url(#lockGlow)" />
        {/* Keyhole */}
        <circle cx="25" cy="38" r="4" fill="#000511" />
        <path d="M25 42 L25 48" stroke="#000511" strokeWidth="2" />
      </svg>
      {/* Glow */}
      <div className={`absolute inset-0 ${styles['animate-pulse']}`} style={{
        background: 'radial-gradient(circle, rgba(0, 180, 255, 0.5) 0%, transparent 60%)',
        filter: 'blur(8px)',
        zIndex: -1
      }} />
    </div>
  );
}

// ── Envelope Icon (from reference) ──
function EnvelopeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M22 7L12 13L2 7" />
    </svg>
  );
}

// ── Small Lock Icon for password field (from reference) ──
function SmallLockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M12 11V7a4 4 0 0 0-4-4 4 4 0 0 0-4 4v4" />
      <circle cx="12" cy="16" r="1.5" fill="#00d4ff" />
    </svg>
  );
}

// ── Animated Floating Particle (from reference) ──
function FloatingParticle({ delay, duration, size, top, left, color }: { delay: number, duration: number, size: number, top: string, left: string, color: string }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}`,
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// ── Circuit Pattern Background (from reference) ──
function CircuitBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep dark blue base */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #000208 0%, #000511 30%, #000818 60%, #000511 100%)'
      }} />
      
      {/* Subtle radial glow at top center behind logo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px]" style={{
        background: 'radial-gradient(ellipse, rgba(0, 100, 200, 0.25) 0%, transparent 65%)'
      }} />
      
      {/* Floating blue particles */}
      <FloatingParticle delay={0} duration={4} size={3} top="8%" left="12%" color="#00aaff" />
      <FloatingParticle delay={0.7} duration={5} size={2} top="15%" left="88%" color="#0099ff" />
      <FloatingParticle delay={1.4} duration={4.5} size={3} top="5%" left="52%" color="#00ccff" />
      <FloatingParticle delay={2.1} duration={5.5} size={2} top="28%" left="18%" color="#00aaff" />
      <FloatingParticle delay={0.3} duration={4} size={4} top="12%" left="78%" color="#00ddff" />
      <FloatingParticle delay={1} duration={5} size={2} top="22%" left="8%" color="#0099ff" />
      <FloatingParticle delay={1.8} duration={4.5} size={3} top="32%" left="92%" color="#00aaff" />
      <FloatingParticle delay={2.5} duration={5} size={2} top="38%" left="5%" color="#00ccff" />
      <FloatingParticle delay={0.5} duration={4.5} size={3} top="42%" left="95%" color="#0099ff" />
      
      {/* Circuit patterns on left side */}
      <svg className="absolute left-0 top-0 h-full w-[180px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="circuitLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00aaff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {/* Main vertical trunk */}
        <line x1="30" y1="0" x2="30" y2="100%" stroke="url(#circuitLeft)" strokeWidth="1.5" />
        <line x1="60" y1="0" x2="60" y2="100%" stroke="url(#circuitLeft)" strokeWidth="1" opacity="0.7" />
        <line x1="90" y1="0" x2="90" y2="100%" stroke="url(#circuitLeft)" strokeWidth="0.8" opacity="0.5" />
        <line x1="120" y1="0" x2="120" y2="100%" stroke="url(#circuitLeft)" strokeWidth="0.6" opacity="0.4" />
        {/* Horizontal branches with tech pattern */}
        <line x1="30" y1="80" x2="90" y2="80" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="60" y1="140" x2="120" y2="140" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="30" y1="200" x2="90" y2="200" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="60" y1="260" x2="120" y2="260" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="30" y1="320" x2="90" y2="320" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="60" y1="380" x2="120" y2="380" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="30" y1="440" x2="90" y2="440" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="60" y1="500" x2="120" y2="500" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="30" y1="560" x2="90" y2="560" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        {/* Small connecting lines for tech feel */}
        <line x1="90" y1="80" x2="90" y2="100" stroke="#00aaff" strokeWidth="0.8" opacity="0.4" />
        <line x1="120" y1="140" x2="120" y2="160" stroke="#00aaff" strokeWidth="0.6" opacity="0.3" />
        <line x1="90" y1="200" x2="90" y2="220" stroke="#00aaff" strokeWidth="0.8" opacity="0.4" />
        {/* Circuit nodes - using divs for animated nodes to avoid SMIL */}
        <circle cx="60" cy="80" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="90" cy="80" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="60" cy="140" r="3" fill="#00aaff" opacity="0.7" />
        <circle cx="90" cy="140" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="120" cy="140" r="2" fill="#00aaff" opacity="0.4" />
        <circle cx="60" cy="200" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="90" cy="200" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="60" cy="260" r="3" fill="#00aaff" opacity="0.7" />
        <circle cx="90" cy="260" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="60" cy="320" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="90" cy="320" r="2" fill="#00aaff" opacity="0.5" />
      </svg>
      
      {/* Circuit patterns on right side */}
      <svg className="absolute right-0 top-0 h-full w-[180px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="circuitRight" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00aaff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {/* Main vertical trunk */}
        <line x1="150" y1="0" x2="150" y2="100%" stroke="url(#circuitRight)" strokeWidth="1.5" />
        <line x1="120" y1="0" x2="120" y2="100%" stroke="url(#circuitRight)" strokeWidth="1" opacity="0.7" />
        <line x1="90" y1="0" x2="90" y2="100%" stroke="url(#circuitRight)" strokeWidth="0.8" opacity="0.5" />
        <line x1="60" y1="0" x2="60" y2="100%" stroke="url(#circuitRight)" strokeWidth="0.6" opacity="0.4" />
        {/* Horizontal branches */}
        <line x1="150" y1="100" x2="90" y2="100" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="120" y1="160" x2="60" y2="160" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="150" y1="220" x2="90" y2="220" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="120" y1="280" x2="60" y2="280" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="150" y1="340" x2="90" y2="340" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="120" y1="400" x2="60" y2="400" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="150" y1="460" x2="90" y2="460" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="120" y1="520" x2="60" y2="520" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="150" y1="580" x2="90" y2="580" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        {/* Connecting lines */}
        <line x1="90" y1="100" x2="90" y2="120" stroke="#00aaff" strokeWidth="0.8" opacity="0.4" />
        <line x1="60" y1="160" x2="60" y2="180" stroke="#00aaff" strokeWidth="0.6" opacity="0.3" />
        <line x1="90" y1="220" x2="90" y2="240" stroke="#00aaff" strokeWidth="0.8" opacity="0.4" />
        {/* Circuit nodes - using CSS animations instead of SMIL */}
        <circle cx="120" cy="100" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="90" cy="100" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="120" cy="160" r="3" fill="#00aaff" opacity="0.7" />
        <circle cx="90" cy="160" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="60" cy="160" r="2" fill="#00aaff" opacity="0.4" />
        <circle cx="120" cy="220" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="90" cy="220" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="120" cy="280" r="3" fill="#00aaff" opacity="0.7" />
        <circle cx="90" cy="280" r="2" fill="#00aaff" opacity="0.5" />
      </svg>
      
      {/* Animated circuit nodes using CSS - positioned absolutely */}
      <div
        className={`absolute left-[30px] top-[80px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit']}`}
        style={{ background: '#00aaff', boxShadow: '0 0 8px #00aaff' }}
      />
      <div
        className={`absolute left-[30px] top-[200px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit-slow']}`}
        style={{ background: '#00aaff', boxShadow: '0 0 8px #00aaff' }}
      />
      <div
        className={`absolute left-[30px] top-[320px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit-slower']}`}
        style={{ background: '#00aaff', boxShadow: '0 0 8px #00aaff' }}
      />
      <div
        className={`absolute right-[30px] top-[100px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit']}`}
        style={{ background: '#00aaff', boxShadow: '0 0 8px #00aaff' }}
      />
      <div
        className={`absolute right-[30px] top-[220px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit-slow']}`}
        style={{ background: '#00aaff', boxShadow: '0 0 8px #00aaff' }}
      />
      <div
        className={`absolute right-[30px] top-[340px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit-slower']}`}
        style={{ background: '#00aaff', boxShadow: '0 0 8px #00aaff' }}
      />

      {/* Subtle scan lines */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 170, 255, 0.08) 3px, rgba(0, 170, 255, 0.08) 6px)'
      }} />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();

  // Form field state
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // UI feedback state
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    /* ── Full-screen cyber security background ── */
    <div className="min-h-screen relative overflow-hidden">
      <CircuitBackground />
      
      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        
        {/* ── Logo Area with Project Logo and Lock Icon ── */}
        <div className="relative flex items-center justify-center mb-10">
          {/* Lock icon on left side */}
          <div className="absolute -left-24 top-1/2 -translate-y-1/2">
            <LockSideIcon />
          </div>
          
          {/* Main Project Logo (replaced from reference design) */}
          <div className={styles['animate-fade-in']}>
            <ProjectLogo />
          </div>
        </div>

        {/* ── Login Form Container ── */}
        <div className="w-full max-w-[340px]">
          <form onSubmit={handleLogin} className="flex flex-col">
            
            {/* Email field */}
            <div className="mb-6">
              <label className="text-white text-[16px] font-normal mb-2 block">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="example@email.com"
                  className="w-full h-[52px] text-white text-[15px] rounded-[26px] pl-5 pr-12 focus:outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(0, 8, 30, 0.7)',
                    border: '2px solid #00aaff',
                    boxShadow: focusedField === 'email'
                      ? '0 0 25px rgba(0, 170, 255, 0.7), inset 0 0 12px rgba(0, 100, 200, 0.25)'
                      : '0 0 18px rgba(0, 170, 255, 0.4), inset 0 0 10px rgba(0, 100, 200, 0.2)',
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <EnvelopeIcon />
                </span>
              </div>
            </div>

            {/* Password field */}
            <div className="mb-4">
              <label className="text-white text-[16px] font-normal mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="••••••••"
                  className="w-full h-[52px] text-white text-[15px] rounded-[26px] pl-5 pr-12 focus:outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(0, 8, 30, 0.7)',
                    border: '2px solid #00aaff',
                    boxShadow: focusedField === 'password'
                      ? '0 0 25px rgba(0, 170, 255, 0.7), inset 0 0 12px rgba(0, 100, 200, 0.25)'
                      : '0 0 18px rgba(0, 170, 255, 0.4), inset 0 0 10px rgba(0, 100, 200, 0.2)',
                  }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2">
                  <SmallLockIcon />
                </span>
              </div>
            </div>

            {/* Forget Password - right aligned */}
            <div className="flex justify-end mb-8">
              <Link
                href="#"
                className="text-white text-[14px] hover:text-cyan-300 transition-colors"
                style={{ textShadow: '0 0 10px rgba(0, 200, 255, 0.6)' }}
              >
                Forget Password
              </Link>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 p-3 rounded-xl text-center text-red-300 text-sm"
                style={{
                  background: 'rgba(200, 0, 50, 0.2)',
                  border: '1px solid rgba(255, 50, 100, 0.4)',
                  boxShadow: '0 0 15px rgba(255, 0, 50, 0.2)',
                }}
              >
                {error}
              </div>
            )}

            {/* LOGIN Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[54px] rounded-[27px] text-white font-semibold text-[18px] tracking-[3px] uppercase
                transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mb-8"
              style={{ 
                background: 'linear-gradient(180deg, #00154d 0%, #003d99 100%)',
                border: '2px solid #00aaff',
                boxShadow: '0 0 25px rgba(0, 170, 255, 0.6), 0 0 50px rgba(0, 150, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                textShadow: '0 0 12px rgba(0, 200, 255, 1), 0 0 20px rgba(0, 150, 255, 0.8)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 170, 255, 0.9), 0 0 70px rgba(0, 150, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.background = 'linear-gradient(180deg, #002266 0%, #0044cc 100%)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 170, 255, 0.6), 0 0 50px rgba(0, 150, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.background = 'linear-gradient(180deg, #00154d 0%, #003d99 100%)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>

            {/* Sign up link */}
            <p className="text-center">
              <span className="text-white/60 text-[14px]">No account? </span>
              <Link 
                href="/signup" 
                className="text-white text-[14px] underline underline-offset-2 hover:text-cyan-300 transition-colors"
                style={{ textShadow: '0 0 10px rgba(0, 200, 255, 0.6)' }}
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
      
    </div>
  );
}
