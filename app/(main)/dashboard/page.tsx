"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import RealTimeDataTable from "@/components/RealTimeDataTable";
import NotificationBell from "@/components/NotificationBell";
import {
  Menu,
  ChevronRight,
  MapPin,
  User,
  Settings,
  Bell,
  Home,
} from "lucide-react";
import styles from "./dashboard.module.css";

// ── Animated Floating Particle (from login page) ──
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

// ── Premium Cyber Background (immersive) ──
function CyberBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">

      {/* === DEEP BASE === */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(0, 20, 60, 0.4) 0%, transparent 50%), linear-gradient(180deg, #000008 0%, #000511 20%, #000a1a 40%, #000511 70%, #000008 100%)'
      }} />

      {/* === AMBIENT LIGHTING === */}
      <div className="absolute inset-0 opacity-30" style={{
        background: 'radial-gradient(circle at 20% 30%, rgba(0, 100, 200, 0.2) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(0, 150, 255, 0.15) 0%, transparent 35%)'
      }} />

      {/* === CENTER GLOW === */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[800px] h-[600px]" style={{
        background: 'radial-gradient(ellipse, rgba(0, 120, 220, 0.2) 0%, rgba(0, 60, 140, 0.1) 40%, transparent 65%)'
      }} />
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[500px] h-[400px]" style={{
        background: 'radial-gradient(circle, rgba(0, 170, 255, 0.1) 0%, transparent 55%)'
      }} />

      {/* === NETWORK MESH (enhanced) === */}
      <NetworkMesh />

      {/* === AMBIENT GLOW ORBS === */}
      <div className="absolute top-[15%] left-[10%] w-[120px] h-[120px] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(0, 170, 255, 0.1) 0%, transparent 70%)',
        animation: 'ambient-glow 6s ease-in-out infinite'
      }} />
      <div className="absolute top-[60%] right-[15%] w-[80px] h-[80px] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(0, 200, 255, 0.08) 0%, transparent 60%)',
        animation: 'ambient-glow 8s ease-in-out infinite 2s'
      }} />
      <div className="absolute bottom-[20%] left-[20%] w-[100px] h-[100px] rounded-full" style={{
        background: 'radial-gradient(circle, rgba(0, 150, 255, 0.06) 0%, transparent 50%)',
        animation: 'ambient-glow 7s ease-in-out infinite 4s'
      }} />

      {/* === DATA FLOW LINES (enhanced) === */}
      <div className="absolute top-[8%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,220,255,0.8), transparent)', width: '300px', height: '2px', animation: 'data-flow 7s linear infinite' }} />
      <div className="absolute top-[18%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,180,255,0.6), transparent)', width: '200px', height: '1.5px', animation: 'data-flow-reverse 11s linear infinite' }} />
      <div className="absolute top-[32%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.7), transparent)', width: '250px', height: '2px', animation: 'data-flow 9s linear infinite 2.5s' }} />
      <div className="absolute top-[48%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,160,255,0.5), transparent)', width: '180px', height: '1.5px', animation: 'data-flow-reverse 13s linear infinite 1.8s' }} />
      <div className="absolute top-[62%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,210,255,0.7), transparent)', width: '280px', height: '2px', animation: 'data-flow 8s linear infinite 4.2s' }} />
      <div className="absolute top-[78%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,190,255,0.6), transparent)', width: '220px', height: '1.5px', animation: 'data-flow-reverse 10s linear infinite 3.5s' }} />
      <div className="absolute top-[92%] left-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.7), transparent)', width: '240px', height: '2px', animation: 'data-flow 6s linear infinite 1.2s' }} />

      {/* === FLOATING PARTICLES (enhanced) === */}
      <FloatingParticle delay={0} duration={3.5} size={5} top="5%" left="6%" color="#00ccff" />
      <FloatingParticle delay={0.4} duration={4.5} size={3} top="10%" left="94%" color="#00aaff" />
      <FloatingParticle delay={0.8} duration={4} size={4} top="3%" left="45%" color="#00ddff" />
      <FloatingParticle delay={1.2} duration={5} size={3} top="22%" left="12%" color="#0099ff" />
      <FloatingParticle delay={0.2} duration={3.5} size={6} top="8%" left="78%" color="#00ccff" />
      <FloatingParticle delay={0.6} duration={4.5} size={3} top="16%" left="3%" color="#00aaff" />
      <FloatingParticle delay={1} duration={4} size={4} top="28%" left="97%" color="#00ddff" />
      <FloatingParticle delay={1.5} duration={5} size={3} top="33%" left="2%" color="#0099ff" />
      <FloatingParticle delay={0.3} duration={4} size={5} top="38%" left="96%" color="#00ccff" />
      <FloatingParticle delay={1.8} duration={5.5} size={3} top="45%" left="8%" color="#00aaff" />
      <FloatingParticle delay={0.5} duration={4.5} size={4} top="50%" left="92%" color="#00ddff" />
      <FloatingParticle delay={1.1} duration={4} size={3} top="56%" left="18%" color="#0099ff" />
      <FloatingParticle delay={0.7} duration={5.5} size={6} top="62%" left="82%" color="#00ccff" />
      <FloatingParticle delay={1.4} duration={4.5} size={3} top="68%" left="10%" color="#00aaff" />
      <FloatingParticle delay={0.1} duration={4} size={4} top="74%" left="94%" color="#00ddff" />
      <FloatingParticle delay={0.9} duration={5} size={3} top="80%" left="6%" color="#0099ff" />
      <FloatingParticle delay={1.3} duration={5.5} size={4} top="86%" left="88%" color="#00ccff" />
      <FloatingParticle delay={0.4} duration={4} size={3} top="92%" left="42%" color="#00aaff" />
      <FloatingParticle delay={1.6} duration={4.5} size={4} top="1%" left="70%" color="#00ddff" />
      <FloatingParticle delay={0.8} duration={5} size={3} top="15%" left="55%" color="#0099ff" />
      <FloatingParticle delay={0.2} duration={3.5} size={5} top="25%" left="35%" color="#00ccff" />
      <FloatingParticle delay={1} duration={4.5} size={3} top="35%" left="65%" color="#00aaff" />
      <FloatingParticle delay={0.5} duration={5} size={4} top="42%" left="25%" color="#00ddff" />
      <FloatingParticle delay={1.3} duration={4} size={3} top="55%" left="75%" color="#0099ff" />
      <FloatingParticle delay={0.6} duration={5.5} size={5} top="72%" left="30%" color="#00ccff" />
      <FloatingParticle delay={1} duration={4.5} size={3} top="85%" left="22%" color="#00aaff" />
      <FloatingParticle delay={0.3} duration={4} size={4} top="95%" left="78%" color="#00ddff" />

      {/* === PULSE NODES (enhanced) === */}
      <div className={`absolute left-[20px] top-[50px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00ccff', boxShadow: '0 0 15px #00ccff, 0 0 30px rgba(0,204,255,0.6)' }} />
      <div className={`absolute left-[20px] top-[170px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit-slow']}`} style={{ background: '#00aaff', boxShadow: '0 0 15px #00aaff, 0 0 30px rgba(0,170,255,0.6)' }} />
      <div className={`absolute left-[20px] top-[290px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit-slower']}`} style={{ background: '#0099ff', boxShadow: '0 0 15px #0099ff, 0 0 30px rgba(0,153,255,0.6)' }} />
      <div className={`absolute left-[20px] top-[410px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00ccff', boxShadow: '0 0 15px #00ccff, 0 0 30px rgba(0,204,255,0.6)' }} />
      <div className={`absolute left-[20px] top-[530px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit-slow']}`} style={{ background: '#00aaff', boxShadow: '0 0 15px #00aaff, 0 0 30px rgba(0,170,255,0.6)' }} />
      <div className={`absolute right-[20px] top-[70px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit-slower']}`} style={{ background: '#0099ff', boxShadow: '0 0 15px #0099ff, 0 0 30px rgba(0,153,255,0.6)' }} />
      <div className={`absolute right-[20px] top-[190px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00ccff', boxShadow: '0 0 15px #00ccff, 0 0 30px rgba(0,204,255,0.6)' }} />
      <div className={`absolute right-[20px] top-[310px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit-slow']}`} style={{ background: '#00aaff', boxShadow: '0 0 15px #00aaff, 0 0 30px rgba(0,170,255,0.6)' }} />
      <div className={`absolute right-[20px] top-[430px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit-slower']}`} style={{ background: '#0099ff', boxShadow: '0 0 15px #0099ff, 0 0 30px rgba(0,153,255,0.6)' }} />
      <div className={`absolute right-[20px] top-[550px] w-[8px] h-[8px] rounded-full ${styles['animate-pulse-circuit']}`} style={{ background: '#00ccff', boxShadow: '0 0 15px #00ccff, 0 0 30px rgba(0,204,255,0.6)' }} />

      {/* === ENHANCED HUD CORNERS === */}
      <div className="absolute top-5 left-5 w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-[3px]" style={{ background: 'linear-gradient(90deg, #00ccff, transparent)', boxShadow: '0 0 15px #00ccff' }} />
        <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: 'linear-gradient(180deg, #00ccff, transparent)', boxShadow: '0 0 15px #00ccff' }} />
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full" style={{ background: '#00ccff', boxShadow: '0 0 10px #00ccff', animation: 'pulse 2s ease-in-out infinite' }} />
      </div>
      <div className="absolute top-5 right-5 w-16 h-16">
        <div className="absolute top-0 right-0 w-full h-[3px]" style={{ background: 'linear-gradient(270deg, #00ccff, transparent)', boxShadow: '0 0 15px #00ccff' }} />
        <div className="absolute top-0 right-0 w-[3px] h-full" style={{ background: 'linear-gradient(180deg, #00ccff, transparent)', boxShadow: '0 0 15px #00ccff' }} />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#00ccff', boxShadow: '0 0 10px #00ccff', animation: 'pulse 2s ease-in-out infinite 0.5s' }} />
      </div>
      <div className="absolute bottom-5 left-5 w-16 h-16">
        <div className="absolute bottom-0 left-0 w-full h-[3px]" style={{ background: 'linear-gradient(90deg, #00ccff, transparent)', boxShadow: '0 0 15px #00ccff' }} />
        <div className="absolute bottom-0 left-0 w-[3px] h-full" style={{ background: 'linear-gradient(0deg, #00ccff, transparent)', boxShadow: '0 0 15px #00ccff' }} />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full" style={{ background: '#00ccff', boxShadow: '0 0 10px #00ccff', animation: 'pulse 2s ease-in-out infinite 1s' }} />
      </div>
      <div className="absolute bottom-5 right-5 w-16 h-16">
        <div className="absolute bottom-0 right-0 w-full h-[3px]" style={{ background: 'linear-gradient(270deg, #00ccff, transparent)', boxShadow: '0 0 15px #00ccff' }} />
        <div className="absolute bottom-0 right-0 w-[3px] h-full" style={{ background: 'linear-gradient(0deg, #00ccff, transparent)', boxShadow: '0 0 15px #00ccff' }} />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full" style={{ background: '#00ccff', boxShadow: '0 0 10px #00ccff', animation: 'pulse 2s ease-in-out infinite 1.5s' }} />
      </div>

      {/* === ENHANCED SCAN LINES === */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 180, 255, 0.08) 2px, rgba(0, 180, 255, 0.08) 4px)'
      }} />
      <div className="absolute inset-0 opacity-[0.015]" style={{
        background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0, 200, 255, 0.05) 3px, rgba(0, 200, 255, 0.05) 6px)'
      }} />

      {/* === DEEP VIGNETTE === */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 8, 0.8) 100%)'
      }} />
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Authentication guard - require real user
  if (!user && !loading) {
    console.log('[DASHBOARD] No user found, redirecting to login');
    router.replace("/login");
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Add debug logs to track session flow
  console.log('[DASHBOARD] User authenticated:', !!user);
  console.log('[DASHBOARD] Loading state:', loading);
  console.log('[DASHBOARD] Session check passed - rendering dashboard');
  
  const { 
    connected, 
    data: matches, 
    loading: dataLoading, 
    error, 
    lastUpdate, 
    connectionType, 
    refreshData,
    emitCriminalConfirmed,
    emitCriminalRejected
  } = useRealTimeData();

  // Log data changes for debugging (only log real errors)
  console.log('[DASHBOARD] Connection:', { connected, connectionType });
  console.log('[DASHBOARD] User gate:', user?.gate_number || 'none');
  console.log('[DASHBOARD] Matches count:', matches.length);
  if (error) {
    console.error('[DASHBOARD] Error:', error);
  }
  if (matches.length > 0) {
    console.log('[DASHBOARD] Latest match node_id:', matches[0].node_id);
  }
  
  const [menuOpen, setMenuOpen] = useState(false);

  const handleConfirmMatch = (match: any) => {
    console.log('Match confirmed:', match);
    emitCriminalConfirmed(match);
  };

  const handleRejectMatch = (match: any) => {
    console.log('Match rejected:', match);
    emitCriminalRejected(match);
  };

  return (
    /* ── Mobile App Style Cyber Security Dashboard ── */
    <div className="min-h-screen relative overflow-hidden">
      <CyberBackground />
      
      {/* ── Mobile App Container (matches Profile/History proportions) ── */}
      <div className="flex flex-col w-full min-h-screen bg-white/95 backdrop-blur-xl shadow-2xl relative sm:max-w-md sm:mx-auto">
        
        {/* ── Futuristic Header (Mobile App Style) ── */}
        <header className="flex items-center justify-between px-4 py-3 relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 40, 100, 0.95) 0%, rgba(0, 20, 60, 0.98) 100%)',
                  borderBottom: '2px solid rgba(0, 170, 255, 0.4)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 0 25px rgba(0, 170, 255, 0.3), inset 0 0 15px rgba(0, 170, 255, 0.1)'
                }}>
          
          {/* Animated header glow */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 170, 255, 0.12), transparent)',
            animation: 'shimmer 3s infinite'
          }} />
          
          {/* LEFT: Hamburger Menu */}
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-xl transition-all duration-300 relative z-10"
            style={{
              background: 'rgba(0, 170, 255, 0.15)',
              border: '1px solid rgba(0, 170, 255, 0.3)',
              boxShadow: '0 0 12px rgba(0, 170, 255, 0.2)'
            }}
          >
            <Menu size={22} color="#00d4ff" />
          </button>

          {/* CENTER: Logo + Text */}
          <div className="flex flex-col items-center relative" style={{ transform: 'translateY(6px)' }}>
            <Image
              src="/logo.png"
              alt="Security System Logo"
              width={88}
              height={88}
              className="object-contain"
              priority
              style={{
                transform: 'translateY(12px)',
                filter: 'drop-shadow(0 0 20px rgba(0, 170, 255, 0.6))'
              }}
            />
            <span 
              className="text-white text-base font-medium"
              style={{
                textShadow: '0 0 10px rgba(0, 170, 255, 0.5)',
                letterSpacing: '0.5px',
                marginTop: '0px'
              }}
            >
              Security System
            </span>
          </div>

          {/* RIGHT: Notification Bell Icon */}
          <NotificationBell />
        </header>

        {/* ── Sidebar Menu ── */}
        {menuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setMenuOpen(false)}
              style={{
                animation: 'fadeIn 0.3s ease-out'
              }}
            />
            
            {/* Sidebar */}
            <div
              className="fixed top-0 left-0 h-full w-72 z-50"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 40, 100, 0.98) 0%, rgba(0, 20, 60, 0.99) 100%)',
                backdropFilter: 'blur(20px)',
                borderRight: '2px solid rgba(0, 170, 255, 0.4)',
                boxShadow: '0 0 40px rgba(0, 170, 255, 0.3)',
                animation: 'slideInLeft 0.3s ease-out'
              }}
            >
              {/* Sidebar Header */}
              <div className="px-6 py-6 border-b border-white/10">
                <h2 className="text-white text-xl font-bold" style={{ textShadow: '0 0 15px rgba(0, 170, 255, 0.6)' }}>
                  Menu
                </h2>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col py-4">
                {[
                  { icon: Menu, label: "History", href: "/history" },
                  { icon: Settings, label: "Settings", href: "/settings" },
                  { icon: User, label: "Profile", href: "/profile" },
                ].map(({ icon: Icon, label, href }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-4 px-6 py-4 text-white transition-all duration-200 hover:bg-white/10"
                      style={{
                        borderLeft: isActive ? '3px solid #00d4ff' : '3px solid transparent',
                        background: isActive ? 'rgba(0, 170, 255, 0.2)' : 'transparent'
                      }}
                    >
                      <Icon 
                        size={20} 
                        color={isActive ? "#00d4ff" : "#ffffff"}
                        style={{ 
                          filter: isActive ? 'drop-shadow(0 0 10px rgba(0, 170, 255, 0.8))' : 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))'
                        }} 
                      />
                      <span 
                        className="text-base font-medium"
                        style={{
                          color: isActive ? "#00d4ff" : "#ffffff",
                          textShadow: isActive ? '0 0 10px rgba(0, 170, 255, 0.6)' : 'none'
                        }}
                      >
                        {label}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Close Button */}
              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Close Menu
                </button>
              </div>
            </div>
          </>
        )}

        
        {/* ── Main Content Area (Mobile App Style) ── */}
        <div className="flex-1 bg-white px-4 pt-4 pb-20 flex flex-col gap-3 relative"
             style={{
               background: 'rgba(255, 255, 255, 0.98)',
               backdropFilter: 'blur(6px)',
               border: '1px solid rgba(0, 170, 255, 0.12)'
             }}>

          {/* ── Location Card (Mobile App Style) ── */}
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3 relative"
               style={{
                 background: 'linear-gradient(135deg, rgba(0, 40, 100, 0.06) 0%, rgba(0, 80, 180, 0.1) 100%)',
                 border: '1px solid rgba(0, 170, 255, 0.25)',
                 boxShadow: '0 0 20px rgba(0, 170, 255, 0.12), inset 0 0 12px rgba(0, 170, 255, 0.06)'
               }}>
            
            {/* Card glow effect */}
            <div className="absolute inset-0 rounded-2xl" style={{
              background: 'linear-gradient(135deg, transparent 25%, rgba(0, 170, 255, 0.06) 75%, transparent)',
              animation: 'cyber-pulse 3s ease-in-out infinite'
            }} />
            
            {/* User icon */}
            <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center relative z-10"
                 style={{
                   background: 'linear-gradient(135deg, #00ccff 0%, #0088ee 100%)',
                   border: '2px solid #00d4ff',
                   boxShadow: '0 0 15px rgba(0, 170, 255, 0.4), inset 0 0 8px rgba(0, 100, 200, 0.3)'
                 }}>
              <User size={18} color="#ffffff" />
            </div>
            
            {/* Location info */}
            <div className="relative z-10 flex-1">
              <p className="text-[10px] font-semibold mb-1" style={{ color: '#00aaff' }}>Delivered from</p>
              <div className="flex items-center gap-2">
                <MapPin size={10} color="#00d4ff" />
                <span className="text-[12px] font-semibold text-[#1a1a1a]">
                  {(() => {
                    const authUser = user as any;
                    const mallName = authUser?.user_metadata?.mall_name || authUser?.mall_name;
                    const gateNumber = authUser?.user_metadata?.gate_number || authUser?.gate_number;
                    return mallName && gateNumber
                      ? `${mallName}, Gate ${gateNumber.replace(/gate\s*/i, '').trim()}`
                      : mallName
                      ? `${mallName}`
                      : "Set your location in Profile";
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* ── Data Table Area (Mobile App Style) ── */}
          <div className="flex-1 relative">
            {/* Table container with cyber styling */}
            <div className="absolute inset-0 rounded-2xl"
                 style={{
                   background: 'linear-gradient(135deg, rgba(0, 40, 100, 0.03) 0%, rgba(0, 80, 180, 0.06) 100%)',
                   border: '1px solid rgba(0, 170, 255, 0.15)',
                   boxShadow: '0 0 25px rgba(0, 170, 255, 0.1), inset 0 0 15px rgba(0, 170, 255, 0.05)',
                   pointerEvents: 'none'
                 }} />
            
            {/* Data table container */}
            <div className="relative z-10 h-full rounded-2xl overflow-hidden"
                 style={{
                   background: 'rgba(255, 255, 255, 0.95)',
                   backdropFilter: 'blur(6px)',
                   border: '1px solid rgba(0, 170, 255, 0.12)'
                 }}>
              
              <RealTimeDataTable
                data={matches}
                connected={connected}
                loading={loading}
                error={error}
                lastUpdate={lastUpdate}
                connectionType={connectionType}
                onRefresh={refreshData}
                onConfirmMatch={handleConfirmMatch}
                onRejectMatch={handleRejectMatch}
              />
            </div>
          </div>

        </div>

        {/* ── Bottom Navigation (Matches Top Header Style) ── */}
        <div className="fixed bottom-0 left-0 right-0 z-50"
             style={{
               background: 'linear-gradient(135deg, rgba(0, 40, 100, 0.95) 0%, rgba(0, 20, 60, 0.98) 100%)',
               borderTop: '2px solid rgba(0, 170, 255, 0.4)',
               boxShadow: '0 -5px 25px rgba(0, 170, 255, 0.3), inset 0 0 15px rgba(0, 170, 255, 0.1)',
               backdropFilter: 'blur(20px)'
             }}>
          
          {/* Navbar glow overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 170, 255, 0.12), transparent)',
            animation: 'shimmer 3s infinite'
          }} />
          
          <div className="flex items-center justify-around py-3 relative z-10">
            {[
              { icon: Home, label: "Home", href: "/dashboard", active: true },
              { icon: Menu, label: "History", href: "/history", active: false },
              { icon: Settings, label: "Settings", href: "/settings", active: false },
              { icon: User, label: "Profile", href: "/profile", active: false },
            ].map(({ icon: Icon, label, href, active }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300"
                style={{
                  background: active 
                    ? 'linear-gradient(135deg, rgba(0, 170, 255, 0.25) 0%, rgba(0, 100, 200, 0.35) 100%)'
                    : 'rgba(0, 170, 255, 0.08)',
                  border: active ? '2px solid rgba(0, 170, 255, 0.5)' : '1px solid rgba(0, 170, 255, 0.2)',
                  boxShadow: active 
                    ? '0 0 20px rgba(0, 170, 255, 0.4), inset 0 0 10px rgba(0, 170, 255, 0.15)'
                    : '0 0 8px rgba(0, 170, 255, 0.15), inset 0 0 5px rgba(0, 170, 255, 0.05)'
                }}
              >
                <Icon 
                  size={20} 
                  color={active ? "#00d4ff" : "#ffffff"}
                  style={{
                    filter: active ? 'drop-shadow(0 0 10px rgba(0, 170, 255, 0.7))' : 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))'
                  }}
                />
                <span 
                  className="text-xs font-semibold"
                  style={{ 
                    color: active ? "#00d4ff" : "#ffffff",
                    textShadow: active ? '0 0 10px rgba(0, 170, 255, 0.7)' : '0 0 5px rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
                                
      </div>
    </div>
  );
}
