"use client";

// ── Animated Floating Particle ──
function FloatingParticle({ delay, duration, size, top, left, color }: {
  delay: number; duration: number; size: number; top: string; left: string; color: string;
}) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        top, left,
        width: `${size}px`, height: `${size}px`,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}`,
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

// ── Network Mesh ──
function NetworkMesh() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" style={{ filter: "blur(0.8px)" }}>
      <defs>
        <linearGradient id="meshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066aa" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#00aaff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00ccff" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={`${(i + 1) * 8}%`} x2="100%" y2={`${(i + 1) * 8}%`} stroke="url(#meshGrad)" strokeWidth="0.6" opacity="0.35" />
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <line key={`v${i}`} x1={`${(i + 1) * 6}%`} y1="0" x2={`${(i + 1) * 6}%`} y2="100%" stroke="url(#meshGrad)" strokeWidth="0.5" opacity="0.3" />
      ))}
      <line x1="0" y1="0" x2="100%" y2="100%" stroke="#00aaff" strokeWidth="0.4" opacity="0.08" />
      <line x1="100%" y1="0" x2="0" y2="100%" stroke="#00aaff" strokeWidth="0.4" opacity="0.08" />
      <line x1="20%" y1="0" x2="80%" y2="100%" stroke="#00ccff" strokeWidth="0.3" opacity="0.06" />
      <line x1="80%" y1="0" x2="20%" y2="100%" stroke="#00ccff" strokeWidth="0.3" opacity="0.06" />
    </svg>
  );
}

// ── Premium Cyber Background ──
export default function CyberBackground() {
  const particles = [
    { d: 0, dur: 3.5, s: 5, t: "5%", l: "6%", c: "#00ccff" },
    { d: 0.4, dur: 4.5, s: 3, t: "10%", l: "94%", c: "#00aaff" },
    { d: 0.8, dur: 4, s: 4, t: "3%", l: "45%", c: "#00ddff" },
    { d: 1.2, dur: 5, s: 3, t: "22%", l: "12%", c: "#0099ff" },
    { d: 0.2, dur: 3.5, s: 6, t: "8%", l: "78%", c: "#00ccff" },
    { d: 0.6, dur: 4.5, s: 3, t: "16%", l: "3%", c: "#00aaff" },
    { d: 1, dur: 4, s: 4, t: "28%", l: "97%", c: "#00ddff" },
    { d: 1.5, dur: 5, s: 3, t: "33%", l: "2%", c: "#0099ff" },
    { d: 0.3, dur: 4, s: 5, t: "38%", l: "96%", c: "#00ccff" },
    { d: 1.8, dur: 5.5, s: 3, t: "45%", l: "8%", c: "#00aaff" },
    { d: 0.5, dur: 4.5, s: 4, t: "50%", l: "92%", c: "#00ddff" },
    { d: 1.1, dur: 4, s: 3, t: "56%", l: "18%", c: "#0099ff" },
    { d: 0.7, dur: 5.5, s: 6, t: "62%", l: "82%", c: "#00ccff" },
    { d: 1.4, dur: 4.5, s: 3, t: "68%", l: "10%", c: "#00aaff" },
    { d: 0.1, dur: 4, s: 4, t: "74%", l: "94%", c: "#00ddff" },
    { d: 0.9, dur: 5, s: 3, t: "80%", l: "6%", c: "#0099ff" },
    { d: 1.3, dur: 5.5, s: 4, t: "86%", l: "88%", c: "#00ccff" },
    { d: 0.4, dur: 4, s: 3, t: "92%", l: "42%", c: "#00aaff" },
    { d: 1.6, dur: 4.5, s: 4, t: "1%", l: "70%", c: "#00ddff" },
    { d: 0.8, dur: 5, s: 3, t: "15%", l: "55%", c: "#0099ff" },
    { d: 0.2, dur: 3.5, s: 5, t: "25%", l: "35%", c: "#00ccff" },
    { d: 1, dur: 4.5, s: 3, t: "35%", l: "65%", c: "#00aaff" },
    { d: 0.5, dur: 5, s: 4, t: "42%", l: "25%", c: "#00ddff" },
    { d: 1.3, dur: 4, s: 3, t: "55%", l: "75%", c: "#0099ff" },
    { d: 0.6, dur: 5.5, s: 5, t: "72%", l: "30%", c: "#00ccff" },
    { d: 1, dur: 4.5, s: 3, t: "85%", l: "22%", c: "#00aaff" },
    { d: 0.3, dur: 4, s: 4, t: "95%", l: "78%", c: "#00ddff" },
  ];

  const dataFlows = [
    { t: "8%", w: 300, h: 2, dur: 7, delay: 0, rev: false },
    { t: "18%", w: 200, h: 1.5, dur: 11, delay: 0, rev: true },
    { t: "32%", w: 250, h: 2, dur: 9, delay: 2.5, rev: false },
    { t: "48%", w: 180, h: 1.5, dur: 13, delay: 1.8, rev: true },
    { t: "62%", w: 280, h: 2, dur: 8, delay: 4.2, rev: false },
    { t: "78%", w: 220, h: 1.5, dur: 10, delay: 3.5, rev: true },
    { t: "92%", w: 240, h: 2, dur: 6, delay: 1.2, rev: false },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep Base */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 30% 20%, rgba(0, 20, 60, 0.4) 0%, transparent 50%), linear-gradient(180deg, #000008 0%, #000511 20%, #000a1a 40%, #000511 70%, #000008 100%)"
      }} />
      {/* Ambient Lighting */}
      <div className="absolute inset-0 opacity-30" style={{
        background: "radial-gradient(circle at 20% 30%, rgba(0, 100, 200, 0.2) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(0, 150, 255, 0.15) 0%, transparent 35%)"
      }} />
      {/* Center Glow */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[800px] h-[600px]" style={{
        background: "radial-gradient(ellipse, rgba(0, 120, 220, 0.2) 0%, rgba(0, 60, 140, 0.1) 40%, transparent 65%)"
      }} />
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[500px] h-[400px]" style={{
        background: "radial-gradient(circle, rgba(0, 170, 255, 0.1) 0%, transparent 55%)"
      }} />
      {/* Network Mesh */}
      <NetworkMesh />
      {/* Ambient Glow Orbs */}
      <div className="absolute top-[15%] left-[10%] w-[120px] h-[120px] rounded-full" style={{
        background: "radial-gradient(circle, rgba(0, 170, 255, 0.1) 0%, transparent 70%)",
        animation: "ambient-glow 6s ease-in-out infinite"
      }} />
      <div className="absolute top-[60%] right-[15%] w-[80px] h-[80px] rounded-full" style={{
        background: "radial-gradient(circle, rgba(0, 200, 255, 0.08) 0%, transparent 60%)",
        animation: "ambient-glow 8s ease-in-out infinite 2s"
      }} />
      <div className="absolute bottom-[20%] left-[20%] w-[100px] h-[100px] rounded-full" style={{
        background: "radial-gradient(circle, rgba(0, 150, 255, 0.06) 0%, transparent 50%)",
        animation: "ambient-glow 7s ease-in-out infinite 4s"
      }} />
      {/* Data Flow Lines */}
      {dataFlows.map((df, i) => (
        <div key={i} className="absolute left-0" style={{
          top: df.t,
          background: `linear-gradient(90deg, transparent, rgba(0,${220 - i * 10},255,${0.8 - i * 0.05}), transparent)`,
          width: `${df.w}px`, height: `${df.h}px`,
          animation: `${df.rev ? "data-flow-reverse" : "data-flow"} ${df.dur}s linear infinite ${df.delay}s`,
        }} />
      ))}
      {/* Floating Particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} delay={p.d} duration={p.dur} size={p.s} top={p.t} left={p.l} color={p.c} />
      ))}
      {/* Pulse Nodes */}
      {[
        { t: 50, c: "#00ccff", a: "pulse-circuit" },
        { t: 170, c: "#00aaff", a: "pulse-circuit-slow" },
        { t: 290, c: "#0099ff", a: "pulse-circuit-slower" },
        { t: 410, c: "#00ccff", a: "pulse-circuit" },
        { t: 530, c: "#00aaff", a: "pulse-circuit-slow" },
      ].map((n, i) => (
        <div key={`L${i}`} className="absolute left-[20px]" style={{
          top: `${n.t}px`, width: "8px", height: "8px", borderRadius: "50%",
          background: n.c, boxShadow: `0 0 15px ${n.c}, 0 0 30px ${n.c}99`,
          animation: `${n.a} 2s ease-in-out infinite ${i * 0.3}s`,
        }} />
      ))}
      {[
        { t: 70, c: "#0099ff", a: "pulse-circuit-slower" },
        { t: 190, c: "#00ccff", a: "pulse-circuit" },
        { t: 310, c: "#00aaff", a: "pulse-circuit-slow" },
        { t: 430, c: "#0099ff", a: "pulse-circuit-slower" },
        { t: 550, c: "#00ccff", a: "pulse-circuit" },
      ].map((n, i) => (
        <div key={`R${i}`} className="absolute right-[20px]" style={{
          top: `${n.t}px`, width: "8px", height: "8px", borderRadius: "50%",
          background: n.c, boxShadow: `0 0 15px ${n.c}, 0 0 30px ${n.c}99`,
          animation: `${n.a} 2s ease-in-out infinite ${i * 0.3}s`,
        }} />
      ))}
      {/* Scan Lines */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 180, 255, 0.08) 2px, rgba(0, 180, 255, 0.08) 4px)"
      }} />
      <div className="absolute inset-0 opacity-[0.015]" style={{
        background: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0, 200, 255, 0.05) 3px, rgba(0, 200, 255, 0.05) 6px)"
      }} />
      {/* Deep Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 8, 0.8) 100%)"
      }} />
    </div>
  );
}
