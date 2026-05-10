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

// ── Full-Screen Network Mesh (blurred, background depth) ──
function NetworkMesh() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ filter: 'blur(0.8px)' }}>
      <defs>
        <linearGradient id="meshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066aa" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#00aaff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00ccff" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Horizontal mesh lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={`${(i + 1) * 8}%`} x2="100%" y2={`${(i + 1) * 8}%`} stroke="url(#meshGrad)" strokeWidth="0.6" opacity="0.35" />
      ))}
      {/* Vertical mesh lines */}
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={`v${i}`} x1={`${(i + 1) * 6}%`} y1="0" x2={`${(i + 1) * 6}%`} y2="100%" stroke="url(#meshGrad)" strokeWidth="0.5" opacity="0.3" />
      ))}
      {/* Diagonal cross lines for depth */}
      <line x1="0" y1="0" x2="100%" y2="100%" stroke="#00aaff" strokeWidth="0.4" opacity="0.08" />
      <line x1="100%" y1="0" x2="0" y2="100%" stroke="#00aaff" strokeWidth="0.4" opacity="0.08" />
      <line x1="20%" y1="0" x2="80%" y2="100%" stroke="#00ccff" strokeWidth="0.3" opacity="0.06" />
      <line x1="80%" y1="0" x2="20%" y2="100%" stroke="#00ccff" strokeWidth="0.3" opacity="0.06" />
    </svg>
  );
}

// ── Central Shield with Half-Human / Half-Digital Face ──
function ShieldWithFace() {
  return (
    <div className={`absolute top-[8%] left-1/2 -translate-x-1/2 ${styles['animate-shield-pulse']}`} style={{ filter: 'drop-shadow(0 0 30px rgba(0,170,255,0.4)) drop-shadow(0 0 60px rgba(0,100,200,0.2))' }}>
      <svg width="340" height="380" viewBox="0 0 340 380" fill="none">
        <defs>
          <linearGradient id="shieldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ccff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0066cc" stopOpacity="0.4" />
          </linearGradient>
          <filter id="shieldBlur">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Outer shield */}
        <path d="M170 20 L300 80 L300 200 C300 290 170 360 170 360 C170 360 40 290 40 200 L40 80 Z" stroke="url(#shieldGlow)" strokeWidth="2" fill="rgba(0,20,60,0.15)" filter="url(#shieldBlur)" />
        <path d="M170 35 L285 90 L285 200 C285 280 170 345 170 345 C170 345 55 280 55 200 L55 90 Z" stroke="#00aaff" strokeWidth="1.2" fill="none" opacity="0.5" />
        <path d="M170 50 L270 100 L270 200 C270 270 170 330 170 330 C170 330 70 270 70 200 L70 100 Z" stroke="#00ccff" strokeWidth="0.8" fill="none" opacity="0.35" />

        {/* Inner hexagon tech frame */}
        <path d="M170 100 L215 125 L215 175 L170 200 L125 175 L125 125 Z" stroke="#00aaff" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M170 110 L205 130 L205 170 L170 190 L135 170 L135 130 Z" stroke="#00ccff" strokeWidth="0.5" fill="none" opacity="0.25" />

        {/* ── FACE: Left half = human (organic curves) ── */}
        {/* Human eye (left) */}
        <ellipse cx="150" cy="145" rx="10" ry="7" stroke="#00ccff" strokeWidth="0.8" fill="none" opacity="0.6" />
        <circle cx="150" cy="145" r="3" fill="#00ccff" opacity="0.5" />
        {/* Human eyebrow */}
        <path d="M140 135 Q150 130 160 135" stroke="#00aaff" strokeWidth="0.8" fill="none" opacity="0.5" />
        {/* Human cheek contour */}
        <path d="M135 160 Q140 175 150 180" stroke="#00aaff" strokeWidth="0.6" fill="none" opacity="0.4" />
        {/* Human nose bridge */}
        <path d="M165 145 Q168 160 165 175" stroke="#0099cc" strokeWidth="0.6" fill="none" opacity="0.4" />
        {/* Human jaw */}
        <path d="M135 175 Q145 195 170 190" stroke="#00aaff" strokeWidth="0.6" fill="none" opacity="0.35" />

        {/* ── FACE: Right half = digital (grid/geometric) ── */}
        {/* Digital eye (right) - hexagonal */}
        <path d="M180 138 L192 143 L192 153 L180 158 L168 153 L168 143 Z" stroke="#00ddff" strokeWidth="0.8" fill="none" opacity="0.7" />
        <circle cx="180" cy="148" r="2.5" fill="#00ddff" opacity="0.6" />
        {/* Digital grid lines on face */}
        <line x1="175" y1="125" x2="175" y2="190" stroke="#00aaff" strokeWidth="0.4" opacity="0.3" />
        <line x1="185" y1="125" x2="185" y2="190" stroke="#00aaff" strokeWidth="0.4" opacity="0.3" />
        <line x1="195" y1="125" x2="195" y2="190" stroke="#00aaff" strokeWidth="0.4" opacity="0.3" />
        <line x1="168" y1="135" x2="202" y2="135" stroke="#00aaff" strokeWidth="0.4" opacity="0.25" />
        <line x1="168" y1="148" x2="202" y2="148" stroke="#00aaff" strokeWidth="0.4" opacity="0.25" />
        <line x1="168" y1="160" x2="202" y2="160" stroke="#00aaff" strokeWidth="0.4" opacity="0.25" />
        <line x1="168" y1="172" x2="202" y2="172" stroke="#00aaff" strokeWidth="0.4" opacity="0.25" />
        {/* Digital circuit trace from eye */}
        <path d="M192 148 L205 148 L210 140 L215 140" stroke="#00ddff" strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M192 148 L205 148 L210 156 L215 156" stroke="#00ddff" strokeWidth="0.5" fill="none" opacity="0.3" />
        {/* Digital jaw line - geometric */}
        <path d="M170 190 L185 185 L195 180 L200 170" stroke="#00ccff" strokeWidth="0.6" fill="none" opacity="0.4" />

        {/* Center divider line */}
        <line x1="170" y1="120" x2="170" y2="195" stroke="#00aaff" strokeWidth="0.6" opacity="0.3" strokeDasharray="3 2" />

        {/* Microchip pattern at bottom of shield */}
        <rect x="155" y="280" width="30" height="20" rx="2" stroke="#00aaff" strokeWidth="0.6" fill="none" opacity="0.3" />
        <line x1="160" y1="285" x2="180" y2="285" stroke="#00aaff" strokeWidth="0.4" opacity="0.3" />
        <line x1="160" y1="290" x2="180" y2="290" stroke="#00aaff" strokeWidth="0.4" opacity="0.3" />
        <line x1="160" y1="295" x2="180" y2="295" stroke="#00aaff" strokeWidth="0.4" opacity="0.3" />
        {/* Pins */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`pinL${i}`} x1="153" y1={`${282 + i * 4}`} x2="155" y2={`${282 + i * 4}`} stroke="#00ccff" strokeWidth="0.4" opacity="0.4" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`pinR${i}`} x1="185" y1={`${282 + i * 4}`} x2="187" y2={`${282 + i * 4}`} stroke="#00ccff" strokeWidth="0.4" opacity="0.4" />
        ))}
      </svg>
    </div>
  );
}

// ── Floating Padlock (background element, left side) ──
function FloatingPadlock() {
  return (
    <div className={`absolute left-[5%] top-[35%] ${styles['animate-particle-drift']}`} style={{ filter: 'drop-shadow(0 0 15px rgba(0,170,255,0.5))' }}>
      <svg width="70" height="90" viewBox="0 0 70 90" fill="none" opacity="0.25">
        <defs>
          <linearGradient id="padlockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ccff" />
            <stop offset="100%" stopColor="#0066cc" />
          </linearGradient>
        </defs>
        {/* Shackle */}
        <path d="M20 40 V25 Q20 8 35 8 Q50 8 50 25 V40" stroke="url(#padlockGrad)" strokeWidth="2.5" fill="none" />
        {/* Body */}
        <rect x="12" y="38" width="46" height="40" rx="6" stroke="url(#padlockGrad)" strokeWidth="1.5" fill="rgba(0,30,80,0.2)" />
        {/* Keyhole */}
        <circle cx="35" cy="55" r="5" stroke="#00aaff" strokeWidth="0.8" fill="none" />
        <path d="M35 60 L35 70" stroke="#00aaff" strokeWidth="1" />
        {/* Tech details */}
        <line x1="18" y1="48" x2="52" y2="48" stroke="#00aaff" strokeWidth="0.5" opacity="0.5" />
        <line x1="18" y1="68" x2="52" y2="68" stroke="#00aaff" strokeWidth="0.5" opacity="0.5" />
        <rect x="28" y="72" width="14" height="4" rx="1" stroke="#00ccff" strokeWidth="0.5" fill="none" opacity="0.6" />
      </svg>
    </div>
  );
}

// ── Scanning Radar Rings ──
function RadarRings() {
  return (
    <div className="absolute top-[22%] left-1/2 -translate-x-1/2 pointer-events-none">
      {/* Static crosshairs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px]">
        <div className="absolute top-0 left-1/2 w-[1px] h-full -translate-x-1/2" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,170,255,0.15), transparent)' }} />
        <div className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,170,255,0.15), transparent)' }} />
      </div>
    </div>
  );
}

// ── Cyber Background (complete redesign) ──
function CyberBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">

      {/* === BASE === */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #000008 0%, #000511 20%, #000a1a 40%, #000511 70%, #000008 100%)'
      }} />

      {/* === DARKER BOTTOM for form readability === */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%]" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,1,8,0.3) 30%, rgba(0,1,10,0.7) 70%, rgba(0,0,8,0.9) 100%)'
      }} />

      {/* === CENTER GLOW behind shield === */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[600px] h-[500px]" style={{
        background: 'radial-gradient(ellipse, rgba(0, 120, 220, 0.15) 0%, rgba(0, 60, 140, 0.07) 40%, transparent 65%)'
      }} />
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[400px] h-[350px]" style={{
        background: 'radial-gradient(circle, rgba(0, 170, 255, 0.08) 0%, transparent 55%)'
      }} />

      {/* === NETWORK MESH (blurred, background depth) === */}
      <NetworkMesh />

      {/* === RADAR SCANNING RINGS === */}
      <RadarRings />

      {/* === SHIELD WITH FACE (center top) === */}
      <ShieldWithFace />

      {/* === FLOATING PADLOCK (left side) === */}
      <FloatingPadlock />

      
      {/* === SIDE CIRCUIT PATTERNS (foreground, sharper) === */}
      {/* LEFT */}
      <svg className="absolute left-0 top-0 h-full w-[220px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fgL" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00aaff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line x1="20" y1="0" x2="20" y2="100%" stroke="url(#fgL)" strokeWidth="2" />
        <line x1="50" y1="0" x2="50" y2="100%" stroke="url(#fgL)" strokeWidth="1.2" opacity="0.8" />
        <line x1="80" y1="0" x2="80" y2="100%" stroke="url(#fgL)" strokeWidth="0.9" opacity="0.6" />
        <line x1="110" y1="0" x2="110" y2="100%" stroke="url(#fgL)" strokeWidth="0.7" opacity="0.45" />
        <line x1="140" y1="0" x2="140" y2="100%" stroke="url(#fgL)" strokeWidth="0.5" opacity="0.3" />
        <line x1="170" y1="0" x2="170" y2="100%" stroke="url(#fgL)" strokeWidth="0.4" opacity="0.2" />
        {/* Branches */}
        <line x1="20" y1="50" x2="80" y2="50" stroke="#00aaff" strokeWidth="1.5" opacity="0.7" />
        <line x1="50" y1="110" x2="110" y2="110" stroke="#00aaff" strokeWidth="1.2" opacity="0.55" />
        <line x1="20" y1="170" x2="80" y2="170" stroke="#00aaff" strokeWidth="1.5" opacity="0.7" />
        <line x1="50" y1="230" x2="110" y2="230" stroke="#00aaff" strokeWidth="1.2" opacity="0.55" />
        <line x1="20" y1="290" x2="80" y2="290" stroke="#00aaff" strokeWidth="1.5" opacity="0.7" />
        <line x1="50" y1="350" x2="110" y2="350" stroke="#00aaff" strokeWidth="1.2" opacity="0.55" />
        <line x1="20" y1="410" x2="80" y2="410" stroke="#00aaff" strokeWidth="1.5" opacity="0.7" />
        <line x1="50" y1="470" x2="110" y2="470" stroke="#00aaff" strokeWidth="1.2" opacity="0.55" />
        <line x1="20" y1="530" x2="80" y2="530" stroke="#00aaff" strokeWidth="1.5" opacity="0.7" />
        <line x1="50" y1="590" x2="110" y2="590" stroke="#00aaff" strokeWidth="1.2" opacity="0.55" />
        {/* Vertical connectors */}
        <line x1="80" y1="50" x2="80" y2="70" stroke="#00aaff" strokeWidth="1" opacity="0.45" />
        <line x1="110" y1="110" x2="110" y2="130" stroke="#00aaff" strokeWidth="0.7" opacity="0.35" />
        <line x1="80" y1="170" x2="80" y2="190" stroke="#00aaff" strokeWidth="1" opacity="0.45" />
        <line x1="110" y1="230" x2="110" y2="250" stroke="#00aaff" strokeWidth="0.7" opacity="0.35" />
        {/* Nodes with glow */}
        <circle cx="50" cy="50" r="4" fill="#00aaff" opacity="0.8" />
        <circle cx="80" cy="50" r="2.5" fill="#00ccff" opacity="0.6" />
        <circle cx="50" cy="110" r="3.5" fill="#00aaff" opacity="0.7" />
        <circle cx="110" cy="110" r="2" fill="#0099ff" opacity="0.5" />
        <circle cx="50" cy="170" r="4" fill="#00ccff" opacity="0.8" />
        <circle cx="80" cy="170" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="50" cy="230" r="3.5" fill="#00aaff" opacity="0.7" />
        <circle cx="110" cy="230" r="2" fill="#00ccff" opacity="0.5" />
        <circle cx="50" cy="290" r="4" fill="#00aaff" opacity="0.8" />
        <circle cx="80" cy="290" r="2.5" fill="#0099ff" opacity="0.6" />
        <circle cx="50" cy="350" r="3.5" fill="#00ccff" opacity="0.7" />
        <circle cx="110" cy="350" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="50" cy="410" r="4" fill="#00aaff" opacity="0.8" />
        <circle cx="80" cy="410" r="2.5" fill="#00ccff" opacity="0.6" />
        <circle cx="50" cy="470" r="3.5" fill="#0099ff" opacity="0.7" />
        <circle cx="110" cy="470" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="50" cy="530" r="4" fill="#00ccff" opacity="0.8" />
        <circle cx="80" cy="530" r="2.5" fill="#00aaff" opacity="0.6" />
      </svg>

      {/* RIGHT */}
      <svg className="absolute right-0 top-0 h-full w-[220px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fgR" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#00aaff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line x1="200" y1="0" x2="200" y2="100%" stroke="url(#fgR)" strokeWidth="2" />
        <line x1="170" y1="0" x2="170" y2="100%" stroke="url(#fgR)" strokeWidth="1.2" opacity="0.8" />
        <line x1="140" y1="0" x2="140" y2="100%" stroke="url(#fgR)" strokeWidth="0.9" opacity="0.6" />
        <line x1="110" y1="0" x2="110" y2="100%" stroke="url(#fgR)" strokeWidth="0.7" opacity="0.45" />
        <line x1="80" y1="0" x2="80" y2="100%" stroke="url(#fgR)" strokeWidth="0.5" opacity="0.3" />
        <line x1="50" y1="0" x2="50" y2="100%" stroke="url(#fgR)" strokeWidth="0.4" opacity="0.2" />
        {/* Branches */}
        <line x1="200" y1="70" x2="140" y2="70" stroke="#00aaff" strokeWidth="1.5" opacity="0.7" />
        <line x1="170" y1="130" x2="110" y2="130" stroke="#00aaff" strokeWidth="1.2" opacity="0.55" />
        <line x1="200" y1="190" x2="140" y2="190" stroke="#00aaff" strokeWidth="1.5" opacity="0.7" />
        <line x1="170" y1="250" x2="110" y2="250" stroke="#00aaff" strokeWidth="1.2" opacity="0.55" />
        <line x1="200" y1="310" x2="140" y2="310" stroke="#00aaff" strokeWidth="1.5" opacity="0.7" />
        <line x1="170" y1="370" x2="110" y2="370" stroke="#00aaff" strokeWidth="1.2" opacity="0.55" />
        <line x1="200" y1="430" x2="140" y2="430" stroke="#00aaff" strokeWidth="1.5" opacity="0.7" />
        <line x1="170" y1="490" x2="110" y2="490" stroke="#00aaff" strokeWidth="1.2" opacity="0.55" />
        <line x1="200" y1="550" x2="140" y2="550" stroke="#00aaff" strokeWidth="1.5" opacity="0.7" />
        <line x1="170" y1="610" x2="110" y2="610" stroke="#00aaff" strokeWidth="1.2" opacity="0.55" />
        {/* Vertical connectors */}
        <line x1="140" y1="70" x2="140" y2="90" stroke="#00aaff" strokeWidth="1" opacity="0.45" />
        <line x1="110" y1="130" x2="110" y2="150" stroke="#00aaff" strokeWidth="0.7" opacity="0.35" />
        <line x1="140" y1="190" x2="140" y2="210" stroke="#00aaff" strokeWidth="1" opacity="0.45" />
        <line x1="110" y1="250" x2="110" y2="270" stroke="#00aaff" strokeWidth="0.7" opacity="0.35" />
        {/* Nodes */}
        <circle cx="170" cy="70" r="4" fill="#00aaff" opacity="0.8" />
        <circle cx="140" cy="70" r="2.5" fill="#00ccff" opacity="0.6" />
        <circle cx="170" cy="130" r="3.5" fill="#00aaff" opacity="0.7" />
        <circle cx="110" cy="130" r="2" fill="#0099ff" opacity="0.5" />
        <circle cx="170" cy="190" r="4" fill="#00ccff" opacity="0.8" />
        <circle cx="140" cy="190" r="2.5" fill="#00aaff" opacity="0.6" />
        <circle cx="170" cy="250" r="3.5" fill="#00aaff" opacity="0.7" />
        <circle cx="110" cy="250" r="2" fill="#00ccff" opacity="0.5" />
        <circle cx="170" cy="310" r="4" fill="#00aaff" opacity="0.8" />
        <circle cx="140" cy="310" r="2.5" fill="#0099ff" opacity="0.6" />
        <circle cx="170" cy="370" r="3.5" fill="#00ccff" opacity="0.7" />
        <circle cx="110" cy="370" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="170" cy="430" r="4" fill="#00aaff" opacity="0.8" />
        <circle cx="140" cy="430" r="2.5" fill="#00ccff" opacity="0.6" />
        <circle cx="170" cy="490" r="3.5" fill="#0099ff" opacity="0.7" />
        <circle cx="110" cy="490" r="2" fill="#00aaff" opacity="0.5" />
        <circle cx="170" cy="550" r="4" fill="#00ccff" opacity="0.8" />
        <circle cx="140" cy="550" r="2.5" fill="#00aaff" opacity="0.6" />
      </svg>

      {/* === DATA FLOW LINES === */}
      <div className="absolute top-[8%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,220,255,0.7), transparent)', width: '250px', height: '1.5px', animation: 'data-flow 9s linear infinite' }} />
      <div className="absolute top-[18%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,180,255,0.5), transparent)', width: '180px', height: '1px', animation: 'data-flow-reverse 13s linear infinite' }} />
      <div className="absolute top-[32%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.6), transparent)', width: '220px', height: '1.5px', animation: 'data-flow 11s linear infinite 2.5s' }} />
      <div className="absolute top-[48%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,160,255,0.4), transparent)', width: '140px', height: '1px', animation: 'data-flow-reverse 15s linear infinite 1.8s' }} />
      <div className="absolute top-[62%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,210,255,0.6), transparent)', width: '240px', height: '1.5px', animation: 'data-flow 10s linear infinite 4.2s' }} />
      <div className="absolute top-[78%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,190,255,0.5), transparent)', width: '190px', height: '1px', animation: 'data-flow-reverse 12s linear infinite 3.5s' }} />
      <div className="absolute top-[92%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.6), transparent)', width: '210px', height: '1.5px', animation: 'data-flow 8s linear infinite 1.2s' }} />

      {/* === FLOATING PARTICLES (foreground, sharper) === */}
      <FloatingParticle delay={0} duration={3.5} size={4} top="5%" left="6%" color="#00ccff" />
      <FloatingParticle delay={0.4} duration={4.5} size={2} top="10%" left="94%" color="#00aaff" />
      <FloatingParticle delay={0.8} duration={4} size={3} top="3%" left="45%" color="#00ddff" />
      <FloatingParticle delay={1.2} duration={5} size={2} top="22%" left="12%" color="#0099ff" />
      <FloatingParticle delay={0.2} duration={3.5} size={5} top="8%" left="78%" color="#00ccff" />
      <FloatingParticle delay={0.6} duration={4.5} size={2} top="16%" left="3%" color="#00aaff" />
      <FloatingParticle delay={1} duration={4} size={3} top="28%" left="97%" color="#00ddff" />
      <FloatingParticle delay={1.5} duration={5} size={2} top="33%" left="2%" color="#0099ff" />
      <FloatingParticle delay={0.3} duration={4} size={4} top="38%" left="96%" color="#00ccff" />
      <FloatingParticle delay={1.8} duration={5.5} size={2} top="45%" left="8%" color="#00aaff" />
      <FloatingParticle delay={0.5} duration={4.5} size={3} top="50%" left="92%" color="#00ddff" />
      <FloatingParticle delay={1.1} duration={4} size={2} top="56%" left="18%" color="#0099ff" />
      <FloatingParticle delay={0.7} duration={5.5} size={5} top="62%" left="82%" color="#00ccff" />
      <FloatingParticle delay={1.4} duration={4.5} size={2} top="68%" left="10%" color="#00aaff" />
      <FloatingParticle delay={0.1} duration={4} size={3} top="74%" left="94%" color="#00ddff" />
      <FloatingParticle delay={0.9} duration={5} size={2} top="80%" left="6%" color="#0099ff" />
      <FloatingParticle delay={1.3} duration={5.5} size={3} top="86%" left="88%" color="#00ccff" />
      <FloatingParticle delay={0.4} duration={4} size={2} top="92%" left="42%" color="#00aaff" />
      <FloatingParticle delay={1.6} duration={4.5} size={3} top="1%" left="70%" color="#00ddff" />
      <FloatingParticle delay={0.8} duration={5} size={2} top="15%" left="55%" color="#0099ff" />
      <FloatingParticle delay={0.2} duration={3.5} size={4} top="25%" left="35%" color="#00ccff" />
      <FloatingParticle delay={1} duration={4.5} size={2} top="35%" left="65%" color="#00aaff" />
      <FloatingParticle delay={0.5} duration={5} size={3} top="42%" left="25%" color="#00ddff" />
      <FloatingParticle delay={1.3} duration={4} size={2} top="55%" left="75%" color="#0099ff" />
      <FloatingParticle delay={0.6} duration={5.5} size={4} top="72%" left="30%" color="#00ccff" />
      <FloatingParticle delay={1} duration={4.5} size={2} top="85%" left="22%" color="#00aaff" />
      <FloatingParticle delay={0.3} duration={4} size={3} top="95%" left="78%" color="#00ddff" />

      {/* === GLOW ORBS (ambient depth) === */}

      {/* === PULSE NODES (circuit glow points) === */}
      <div className={`absolute left-[20px] top-[50px] w-[7px] h-[7px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00ccff', boxShadow: '0 0 12px #00ccff, 0 0 24px rgba(0,204,255,0.5)' }} />
      <div className={`absolute left-[20px] top-[170px] w-[7px] h-[7px] rounded-full ${styles['animate-pulse-circuit-slow']}`} style={{ background: '#00aaff', boxShadow: '0 0 12px #00aaff, 0 0 24px rgba(0,170,255,0.5)' }} />
      <div className={`absolute left-[20px] top-[290px] w-[7px] h-[7px] rounded-full ${styles['animate-pulse-circuit-slower']}`} style={{ background: '#0099ff', boxShadow: '0 0 12px #0099ff, 0 0 24px rgba(0,153,255,0.5)' }} />
      <div className={`absolute left-[20px] top-[410px] w-[7px] h-[7px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00ccff', boxShadow: '0 0 12px #00ccff, 0 0 24px rgba(0,204,255,0.5)' }} />
      <div className={`absolute left-[20px] top-[530px] w-[7px] h-[7px] rounded-full ${styles['animate-pulse-circuit-slow']}`} style={{ background: '#00aaff', boxShadow: '0 0 12px #00aaff, 0 0 24px rgba(0,170,255,0.5)' }} />
      <div className={`absolute right-[20px] top-[70px] w-[7px] h-[7px] rounded-full ${styles['animate-pulse-circuit-slower']}`} style={{ background: '#0099ff', boxShadow: '0 0 12px #0099ff, 0 0 24px rgba(0,153,255,0.5)' }} />
      <div className={`absolute right-[20px] top-[190px] w-[7px] h-[7px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00ccff', boxShadow: '0 0 12px #00ccff, 0 0 24px rgba(0,204,255,0.5)' }} />
      <div className={`absolute right-[20px] top-[310px] w-[7px] h-[7px] rounded-full ${styles['animate-pulse-circuit-slow']}`} style={{ background: '#00aaff', boxShadow: '0 0 12px #00aaff, 0 0 24px rgba(0,170,255,0.5)' }} />
      <div className={`absolute right-[20px] top-[430px] w-[7px] h-[7px] rounded-full ${styles['animate-pulse-circuit-slower']}`} style={{ background: '#0099ff', boxShadow: '0 0 12px #0099ff, 0 0 24px rgba(0,153,255,0.5)' }} />
      <div className={`absolute right-[20px] top-[550px] w-[7px] h-[7px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00ccff', boxShadow: '0 0 12px #00ccff, 0 0 24px rgba(0,204,255,0.5)' }} />

      {/* === HUD CORNERS === */}
      <div className="absolute top-5 left-5 w-14 h-14">
        <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: 'linear-gradient(90deg, #00ccff, transparent)', boxShadow: '0 0 10px #00ccff' }} />
        <div className="absolute top-0 left-0 w-[2px] h-full" style={{ background: 'linear-gradient(180deg, #00ccff, transparent)', boxShadow: '0 0 10px #00ccff' }} />
      </div>
      <div className="absolute top-5 right-5 w-14 h-14">
        <div className="absolute top-0 right-0 w-full h-[2px]" style={{ background: 'linear-gradient(270deg, #00ccff, transparent)', boxShadow: '0 0 10px #00ccff' }} />
        <div className="absolute top-0 right-0 w-[2px] h-full" style={{ background: 'linear-gradient(180deg, #00ccff, transparent)', boxShadow: '0 0 10px #00ccff' }} />
      </div>
      <div className="absolute bottom-5 left-5 w-14 h-14">
        <div className="absolute bottom-0 left-0 w-full h-[2px]" style={{ background: 'linear-gradient(90deg, #00ccff, transparent)', boxShadow: '0 0 10px #00ccff' }} />
        <div className="absolute bottom-0 left-0 w-[2px] h-full" style={{ background: 'linear-gradient(0deg, #00ccff, transparent)', boxShadow: '0 0 10px #00ccff' }} />
      </div>
      <div className="absolute bottom-5 right-5 w-14 h-14">
        <div className="absolute bottom-0 right-0 w-full h-[2px]" style={{ background: 'linear-gradient(270deg, #00ccff, transparent)', boxShadow: '0 0 10px #00ccff' }} />
        <div className="absolute bottom-0 right-0 w-[2px] h-full" style={{ background: 'linear-gradient(0deg, #00ccff, transparent)', boxShadow: '0 0 10px #00ccff' }} />
      </div>

      {/* === LIGHT WAVES === */}
      <div className="absolute left-1/2 top-[28%] w-[140%] h-[2px] -translate-x-1/2" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,180,255,0.2) 20%, rgba(0,220,255,0.25) 50%, rgba(0,180,255,0.2) 80%, transparent 100%)',
        animation: 'light-wave 10s ease-in-out infinite',
      }} />
      <div className="absolute left-1/2 top-[48%] w-[140%] h-[1.5px] -translate-x-1/2" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,170,255,0.15) 30%, rgba(0,210,255,0.2) 50%, rgba(0,170,255,0.15) 70%, transparent 100%)',
        animation: 'light-wave 12s ease-in-out infinite 3s',
      }} />
      <div className="absolute left-1/2 top-[68%] w-[140%] h-[2px] -translate-x-1/2" style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(0,190,255,0.18) 25%, rgba(0,230,255,0.22) 50%, rgba(0,190,255,0.18) 75%, transparent 100%)',
        animation: 'light-wave 14s ease-in-out infinite 6s',
      }} />

      {/* === SCAN LINES === */}
      <div className="absolute inset-0 opacity-[0.012]" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 180, 255, 0.05) 2px, rgba(0, 180, 255, 0.05) 4px)'
      }} />

      {/* === VIGNETTE === */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 8, 0.6) 100%)'
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
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]     = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e?.preventDefault();
    console.log("LOGIN CLICKED");
    setError(null);
    
    try {
      console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('[LOGIN] Attempting login with email:', email);
      
      console.log("SUPABASE CLIENT CHECK:", supabase);
      if (!supabase) {
        console.error("Supabase client is null/undefined");
        setError("Supabase client not initialized");
        return;
      }

      console.log('[LOGIN] Request payload:', { email, password: '***' });
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log("LOGIN RESPONSE:", data);
      console.log("LOGIN ERROR:", error);

      if (error) {
        console.error("Supabase Auth Error:", error);
        setError(error?.message || "Login failed");
        return;
      }
      
      // Require real Supabase session
      if (!data.session?.user) {
        console.error('[LOGIN] No valid session returned');
        setError("No valid session created");
        return;
      }

      console.log('[LOGIN] ✓ Login successful');
      console.log('[LOGIN] User data:', { 
        id: data.user?.id, 
        email: data.user?.email,
        session: data.session ? '✓' : 'null'
      });
      
      // Only redirect with real session
      console.log('[LOGIN] Redirecting to dashboard with valid session...');
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err) {
      console.error('[LOGIN] ❌ Unexpected error during login:', err);
      setError("An unexpected error occurred");
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

            {/* Success message */}
            {success && (
              <div className="mb-5 p-3 rounded-xl text-center text-green-300 text-sm"
                style={{
                  background: 'rgba(0, 200, 50, 0.2)',
                  border: '1px solid rgba(0, 255, 100, 0.4)',
                  boxShadow: '0 0 15px rgba(0, 255, 50, 0.2)',
                }}
              >
                {success}
              </div>
            )}

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

            {/* LOGIN Button */}
            <button
              type="submit"
              className="w-full h-[54px] rounded-[27px] text-white font-semibold text-[18px] tracking-[3px] uppercase
                transition-all duration-300 mb-8"
              style={{ 
                background: 'linear-gradient(180deg, #00154d 0%, #003d99 100%)',
                border: '2px solid #00aaff',
                boxShadow: '0 0 25px rgba(0, 170, 255, 0.6), 0 0 50px rgba(0, 150, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                textShadow: '0 0 12px rgba(0, 200, 255, 1), 0 0 20px rgba(0, 150, 255, 0.8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 170, 255, 0.9), 0 0 70px rgba(0, 150, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.background = 'linear-gradient(180deg, #002266 0%, #0044cc 100%)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 170, 255, 0.6), 0 0 50px rgba(0, 150, 255, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.background = 'linear-gradient(180deg, #00154d 0%, #003d99 100%)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              LOGIN
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
