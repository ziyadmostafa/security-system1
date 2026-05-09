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
      width={170}
      height={170}
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

// ── Cyber Background (futuristic AI security theme) ──
function CyberBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Layer 1: Deep dark navy base */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #00010a 0%, #000511 25%, #000818 50%, #000511 75%, #00010a 100%)'
      }} />

      {/* Layer 2: Radial center glow (subtle, behind form) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]" style={{
        background: 'radial-gradient(circle, rgba(0, 80, 180, 0.12) 0%, rgba(0, 40, 100, 0.05) 40%, transparent 70%)'
      }} />
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[400px]" style={{
        background: 'radial-gradient(ellipse, rgba(0, 100, 200, 0.08) 0%, transparent 60%)'
      }} />

      {/* Layer 3: Digital Shield / Lock motif (very subtle, center) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${styles['animate-shield-pulse']}`}>
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none" opacity="0.04">
          <path d="M250 60 L440 140 L440 280 C440 380 250 460 250 460 C250 460 60 380 60 280 L60 140 Z" stroke="#00aaff" strokeWidth="1.5" fill="none" />
          <path d="M250 90 L410 160 L410 280 C410 360 250 430 250 430 C250 430 90 360 90 280 L90 160 Z" stroke="#0099cc" strokeWidth="1" fill="none" opacity="0.7" />
          <path d="M250 120 L380 180 L380 280 C380 340 250 400 250 400 C250 400 120 340 120 280 L120 180 Z" stroke="#00ccff" strokeWidth="0.8" fill="none" opacity="0.5" />
          {/* Lock shackle inside shield */}
          <path d="M210 200 V170 Q210 130 250 130 Q290 130 290 170 V200" stroke="#00aaff" strokeWidth="1.2" fill="none" opacity="0.6" />
          <rect x="210" y="200" width="80" height="60" rx="6" stroke="#00aaff" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
      </div>

      {/* Layer 4: Concentric ring pulses (behind form) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-cyan-500/5" style={{ animation: 'ring-expand 6s ease-out infinite' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-cyan-500/8" style={{ animation: 'ring-expand 6s ease-out infinite 2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full border border-cyan-500/10" style={{ animation: 'ring-expand 6s ease-out infinite 4s' }} />

      {/* Layer 5: Network grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(rgba(0,170,255,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,170,255,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }} />

      {/* Layer 6: Animated data flow lines */}
      <div className="absolute top-[12%] left-0 w-full h-[1px]" style={{
        background: 'linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.6), transparent)',
        animation: 'data-flow 10s linear infinite',
        width: '200px'
      }} />
      <div className="absolute top-[25%] left-0 w-full h-[1px]" style={{
        background: 'linear-gradient(90deg, transparent, rgba(0, 180, 255, 0.4), transparent)',
        animation: 'data-flow-reverse 14s linear infinite',
        width: '150px'
      }} />
      <div className="absolute top-[38%] left-0 w-full h-[1px]" style={{
        background: 'linear-gradient(90deg, transparent, rgba(0, 220, 255, 0.5), transparent)',
        animation: 'data-flow 12s linear infinite 3s',
        width: '180px'
      }} />
      <div className="absolute top-[55%] left-0 w-full h-[1px]" style={{
        background: 'linear-gradient(90deg, transparent, rgba(0, 160, 255, 0.3), transparent)',
        animation: 'data-flow-reverse 16s linear infinite 2s',
        width: '120px'
      }} />
      <div className="absolute top-[72%] left-0 w-full h-[1px]" style={{
        background: 'linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.5), transparent)',
        animation: 'data-flow 9s linear infinite 5s',
        width: '200px'
      }} />
      <div className="absolute top-[88%] left-0 w-full h-[1px]" style={{
        background: 'linear-gradient(90deg, transparent, rgba(0, 180, 255, 0.4), transparent)',
        animation: 'data-flow-reverse 11s linear infinite 1s',
        width: '160px'
      }} />

      {/* Layer 7: Circuit patterns - LEFT side */}
      <svg className="absolute left-0 top-0 h-full w-[200px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00aaff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line x1="25" y1="0" x2="25" y2="100%" stroke="url(#cL)" strokeWidth="1.5" />
        <line x1="55" y1="0" x2="55" y2="100%" stroke="url(#cL)" strokeWidth="1" opacity="0.7" />
        <line x1="85" y1="0" x2="85" y2="100%" stroke="url(#cL)" strokeWidth="0.8" opacity="0.5" />
        <line x1="115" y1="0" x2="115" y2="100%" stroke="url(#cL)" strokeWidth="0.6" opacity="0.4" />
        <line x1="145" y1="0" x2="145" y2="100%" stroke="url(#cL)" strokeWidth="0.5" opacity="0.3" />
        {/* Branches */}
        <line x1="25" y1="60" x2="85" y2="60" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="55" y1="120" x2="115" y2="120" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="25" y1="180" x2="85" y2="180" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="55" y1="240" x2="115" y2="240" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="25" y1="300" x2="85" y2="300" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="55" y1="360" x2="115" y2="360" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="25" y1="420" x2="85" y2="420" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="55" y1="480" x2="115" y2="480" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="25" y1="540" x2="85" y2="540" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="55" y1="600" x2="115" y2="600" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        {/* Connectors */}
        <line x1="85" y1="60" x2="85" y2="80" stroke="#00aaff" strokeWidth="0.8" opacity="0.4" />
        <line x1="115" y1="120" x2="115" y2="140" stroke="#00aaff" strokeWidth="0.6" opacity="0.3" />
        <line x1="85" y1="180" x2="85" y2="200" stroke="#00aaff" strokeWidth="0.8" opacity="0.4" />
        <line x1="115" y1="240" x2="115" y2="260" stroke="#00aaff" strokeWidth="0.6" opacity="0.3" />
        {/* Nodes */}
        <circle cx="55" cy="60" r="3" fill="#00aaff" opacity="0.7" className={`${styles['animate-node-blink']}`} />
        <circle cx="85" cy="60" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="55" cy="120" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="115" cy="120" r="2" fill="#00aaff" opacity="0.4" />
        <circle cx="55" cy="180" r="3" fill="#00ccff" opacity="0.7" />
        <circle cx="85" cy="180" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="55" cy="240" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="115" cy="240" r="2" fill="#0099ff" opacity="0.4" />
        <circle cx="55" cy="300" r="3" fill="#00aaff" opacity="0.7" />
        <circle cx="85" cy="300" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="55" cy="360" r="2.5" fill="#00ccff" opacity="0.6" />
        <circle cx="115" cy="360" r="2" fill="#00aaff" opacity="0.4" />
        <circle cx="55" cy="420" r="3" fill="#00aaff" opacity="0.7" />
        <circle cx="85" cy="420" r="2" fill="#0099ff" opacity="0.5" />
        <circle cx="55" cy="480" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="115" cy="480" r="2" fill="#00aaff" opacity="0.4" />
        <circle cx="55" cy="540" r="3" fill="#00ccff" opacity="0.7" />
        <circle cx="85" cy="540" r="2" fill="#00aaff" opacity="0.5" />
      </svg>

      {/* Layer 8: Circuit patterns - RIGHT side */}
      <svg className="absolute right-0 top-0 h-full w-[200px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cR" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00aaff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line x1="175" y1="0" x2="175" y2="100%" stroke="url(#cR)" strokeWidth="1.5" />
        <line x1="145" y1="0" x2="145" y2="100%" stroke="url(#cR)" strokeWidth="1" opacity="0.7" />
        <line x1="115" y1="0" x2="115" y2="100%" stroke="url(#cR)" strokeWidth="0.8" opacity="0.5" />
        <line x1="85" y1="0" x2="85" y2="100%" stroke="url(#cR)" strokeWidth="0.6" opacity="0.4" />
        <line x1="55" y1="0" x2="55" y2="100%" stroke="url(#cR)" strokeWidth="0.5" opacity="0.3" />
        {/* Branches */}
        <line x1="175" y1="80" x2="115" y2="80" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="145" y1="140" x2="85" y2="140" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="175" y1="200" x2="115" y2="200" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="145" y1="260" x2="85" y2="260" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="175" y1="320" x2="115" y2="320" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="145" y1="380" x2="85" y2="380" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="175" y1="440" x2="115" y2="440" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="145" y1="500" x2="85" y2="500" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        <line x1="175" y1="560" x2="115" y2="560" stroke="#00aaff" strokeWidth="1.2" opacity="0.6" />
        <line x1="145" y1="620" x2="85" y2="620" stroke="#00aaff" strokeWidth="1" opacity="0.5" />
        {/* Connectors */}
        <line x1="115" y1="80" x2="115" y2="100" stroke="#00aaff" strokeWidth="0.8" opacity="0.4" />
        <line x1="85" y1="140" x2="85" y2="160" stroke="#00aaff" strokeWidth="0.6" opacity="0.3" />
        <line x1="115" y1="200" x2="115" y2="220" stroke="#00aaff" strokeWidth="0.8" opacity="0.4" />
        <line x1="85" y1="260" x2="85" y2="280" stroke="#00aaff" strokeWidth="0.6" opacity="0.3" />
        {/* Nodes */}
        <circle cx="145" cy="80" r="3" fill="#00aaff" opacity="0.7" className={`${styles['animate-node-blink']}`} />
        <circle cx="115" cy="80" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="145" cy="140" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="85" cy="140" r="2" fill="#00aaff" opacity="0.4" />
        <circle cx="145" cy="200" r="3" fill="#00ccff" opacity="0.7" />
        <circle cx="115" cy="200" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="145" cy="260" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="85" cy="260" r="2" fill="#0099ff" opacity="0.4" />
        <circle cx="145" cy="320" r="3" fill="#00aaff" opacity="0.7" />
        <circle cx="115" cy="320" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="145" cy="380" r="2.5" fill="#00ccff" opacity="0.6" />
        <circle cx="85" cy="380" r="2" fill="#00aaff" opacity="0.4" />
        <circle cx="145" cy="440" r="3" fill="#00aaff" opacity="0.7" />
        <circle cx="115" cy="440" r="2" fill="#0099ff" opacity="0.5" />
        <circle cx="145" cy="500" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="85" cy="500" r="2" fill="#00aaff" opacity="0.4" />
        <circle cx="145" cy="560" r="3" fill="#00ccff" opacity="0.7" />
        <circle cx="115" cy="560" r="2" fill="#00aaff" opacity="0.5" />
      </svg>

      {/* Layer 9: HUD Corner brackets */}
      {/* Top-left */}
      <div className="absolute top-6 left-6 w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, #00aaff, transparent)', boxShadow: '0 0 8px #00aaff' }} />
        <div className="absolute top-0 left-0 w-[1px] h-full" style={{ background: 'linear-gradient(180deg, #00aaff, transparent)', boxShadow: '0 0 8px #00aaff' }} />
      </div>
      {/* Top-right */}
      <div className="absolute top-6 right-6 w-12 h-12">
        <div className="absolute top-0 right-0 w-full h-[1px]" style={{ background: 'linear-gradient(270deg, #00aaff, transparent)', boxShadow: '0 0 8px #00aaff' }} />
        <div className="absolute top-0 right-0 w-[1px] h-full" style={{ background: 'linear-gradient(180deg, #00aaff, transparent)', boxShadow: '0 0 8px #00aaff' }} />
      </div>
      {/* Bottom-left */}
      <div className="absolute bottom-6 left-6 w-12 h-12">
        <div className="absolute bottom-0 left-0 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, #00aaff, transparent)', boxShadow: '0 0 8px #00aaff' }} />
        <div className="absolute bottom-0 left-0 w-[1px] h-full" style={{ background: 'linear-gradient(0deg, #00aaff, transparent)', boxShadow: '0 0 8px #00aaff' }} />
      </div>
      {/* Bottom-right */}
      <div className="absolute bottom-6 right-6 w-12 h-12">
        <div className="absolute bottom-0 right-0 w-full h-[1px]" style={{ background: 'linear-gradient(270deg, #00aaff, transparent)', boxShadow: '0 0 8px #00aaff' }} />
        <div className="absolute bottom-0 right-0 w-[1px] h-full" style={{ background: 'linear-gradient(0deg, #00aaff, transparent)', boxShadow: '0 0 8px #00aaff' }} />
      </div>

      {/* Layer 10: Floating particles (many, varied) */}
      <FloatingParticle delay={0} duration={4} size={3} top="6%" left="8%" color="#00aaff" />
      <FloatingParticle delay={0.5} duration={5} size={2} top="12%" left="92%" color="#0099ff" />
      <FloatingParticle delay={1} duration={4.5} size={3} top="4%" left="48%" color="#00ccff" />
      <FloatingParticle delay={1.5} duration={5.5} size={2} top="24%" left="15%" color="#00aaff" />
      <FloatingParticle delay={0.3} duration={4} size={4} top="10%" left="75%" color="#00ddff" />
      <FloatingParticle delay={0.8} duration={5} size={2} top="18%" left="5%" color="#0099ff" />
      <FloatingParticle delay={1.2} duration={4.5} size={3} top="30%" left="95%" color="#00aaff" />
      <FloatingParticle delay={1.7} duration={5} size={2} top="35%" left="3%" color="#00ccff" />
      <FloatingParticle delay={0.4} duration={4.5} size={3} top="40%" left="97%" color="#0099ff" />
      <FloatingParticle delay={2} duration={6} size={2} top="48%" left="10%" color="#00ccff" />
      <FloatingParticle delay={0.6} duration={5.5} size={3} top="52%" left="88%" color="#00aaff" />
      <FloatingParticle delay={1.3} duration={4.5} size={2} top="58%" left="20%" color="#0099ff" />
      <FloatingParticle delay={0.9} duration={6} size={4} top="64%" left="80%" color="#00ddff" />
      <FloatingParticle delay={1.6} duration={5} size={2} top="70%" left="12%" color="#00ccff" />
      <FloatingParticle delay={0.2} duration={4.5} size={3} top="76%" left="92%" color="#00aaff" />
      <FloatingParticle delay={1.1} duration={5.5} size={2} top="82%" left="8%" color="#0099ff" />
      <FloatingParticle delay={0.7} duration={6} size={3} top="88%" left="85%" color="#00ccff" />
      <FloatingParticle delay={1.4} duration={4} size={2} top="94%" left="45%" color="#00aaff" />
      <FloatingParticle delay={0.1} duration={5} size={3} top="2%" left="65%" color="#0099ff" />
      <FloatingParticle delay={1.9} duration={5.5} size={2} top="20%" left="60%" color="#00ccff" />

      {/* Layer 11: Larger ambient glow orbs */}
      <div className="absolute rounded-full" style={{
        top: '15%', left: '20%', width: '120px', height: '120px',
        background: 'radial-gradient(circle, rgba(0,150,255,0.08) 0%, transparent 70%)',
        animation: 'particle-drift 15s ease-in-out infinite',
      }} />
      <div className="absolute rounded-full" style={{
        top: '60%', left: '75%', width: '150px', height: '150px',
        background: 'radial-gradient(circle, rgba(0,100,200,0.06) 0%, transparent 70%)',
        animation: 'particle-drift 18s ease-in-out infinite reverse',
      }} />
      <div className="absolute rounded-full" style={{
        top: '40%', left: '80%', width: '100px', height: '100px',
        background: 'radial-gradient(circle, rgba(0,180,255,0.07) 0%, transparent 70%)',
        animation: 'particle-float-slow 12s ease-in-out infinite',
      }} />
      <div className="absolute rounded-full" style={{
        top: '75%', left: '15%', width: '180px', height: '180px',
        background: 'radial-gradient(circle, rgba(0,120,220,0.05) 0%, transparent 70%)',
        animation: 'particle-drift 20s ease-in-out infinite',
      }} />

      {/* Layer 12: Animated circuit pulse nodes */}
      <div className={`absolute left-[25px] top-[60px] w-[6px] h-[6px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00aaff', boxShadow: '0 0 10px #00aaff, 0 0 20px rgba(0,170,255,0.5)' }} />
      <div className={`absolute left-[25px] top-[180px] w-[6px] h-[6px] rounded-full ${styles['animate-pulse-circuit-slow']}`} style={{ background: '#00ccff', boxShadow: '0 0 10px #00ccff, 0 0 20px rgba(0,204,255,0.5)' }} />
      <div className={`absolute left-[25px] top-[300px] w-[6px] h-[6px] rounded-full ${styles['animate-pulse-circuit-slower']}`} style={{ background: '#0099ff', boxShadow: '0 0 10px #0099ff, 0 0 20px rgba(0,153,255,0.5)' }} />
      <div className={`absolute left-[25px] top-[420px] w-[6px] h-[6px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00aaff', boxShadow: '0 0 10px #00aaff, 0 0 20px rgba(0,170,255,0.5)' }} />
      <div className={`absolute left-[25px] top-[540px] w-[6px] h-[6px] rounded-full ${styles['animate-pulse-circuit-slow']}`} style={{ background: '#00ccff', boxShadow: '0 0 10px #00ccff, 0 0 20px rgba(0,204,255,0.5)' }} />
      <div className={`absolute right-[25px] top-[80px] w-[6px] h-[6px] rounded-full ${styles['animate-pulse-circuit-slower']}`} style={{ background: '#0099ff', boxShadow: '0 0 10px #0099ff, 0 0 20px rgba(0,153,255,0.5)' }} />
      <div className={`absolute right-[25px] top-[200px] w-[6px] h-[6px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00aaff', boxShadow: '0 0 10px #00aaff, 0 0 20px rgba(0,170,255,0.5)' }} />
      <div className={`absolute right-[25px] top-[320px] w-[6px] h-[6px] rounded-full ${styles['animate-pulse-circuit-slow']}`} style={{ background: '#00ccff', boxShadow: '0 0 10px #00ccff, 0 0 20px rgba(0,204,255,0.5)' }} />
      <div className={`absolute right-[25px] top-[440px] w-[6px] h-[6px] rounded-full ${styles['animate-pulse-circuit-slower']}`} style={{ background: '#0099ff', boxShadow: '0 0 10px #0099ff, 0 0 20px rgba(0,153,255,0.5)' }} />
      <div className={`absolute right-[25px] top-[560px] w-[6px] h-[6px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00aaff', boxShadow: '0 0 10px #00aaff, 0 0 20px rgba(0,170,255,0.5)' }} />

      {/* Layer 13: Light wave bands */}
      <div className="absolute left-1/2 top-[30%] w-[120%] h-[2px]" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,170,255,0.15) 20%, rgba(0,200,255,0.2) 50%, rgba(0,170,255,0.15) 80%, transparent 100%)',
        animation: 'light-wave 10s ease-in-out infinite',
      }} />
      <div className="absolute left-1/2 top-[50%] w-[120%] h-[1px]" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,170,255,0.1) 30%, rgba(0,200,255,0.15) 50%, rgba(0,170,255,0.1) 70%, transparent 100%)',
        animation: 'light-wave 12s ease-in-out infinite 3s',
      }} />
      <div className="absolute left-1/2 top-[70%] w-[120%] h-[2px]" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,170,255,0.12) 25%, rgba(0,200,255,0.18) 50%, rgba(0,170,255,0.12) 75%, transparent 100%)',
        animation: 'light-wave 14s ease-in-out infinite 6s',
      }} />

      {/* Layer 14: Subtle scan lines */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 170, 255, 0.06) 2px, rgba(0, 170, 255, 0.06) 4px)'
      }} />

      {/* Layer 15: Vignette (dark edges) */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 1, 10, 0.5) 100%)'
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
      <CyberBackground />
      
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
