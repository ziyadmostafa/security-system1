"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import RealTimeDataTable from "@/components/RealTimeDataTable";
import NotificationBell from "@/components/NotificationBell";
import {
  Menu,
  ChevronRight,
  MapPin,
  User,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

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
    sendTestData, 
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
    <div className="min-h-screen" style={{ background: "#F3F3F6" }}>
      <div className="flex flex-col w-full min-h-screen bg-white shadow-2xl relative sm:max-w-md sm:mx-auto">

        <header
          className="flex items-center justify-between px-4 py-2"
          style={{ background: "#1F49D8" }}
        >
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 rounded-lg transition-colors active:bg-white/10"
          >
            <Menu size={22} color="#fff" />
          </button>

          <Image
            src="/logo.png"
            alt="Security System Logo"
            width={80}
            height={80}
            className="object-contain mt-1"
            priority
          />

          <NotificationBell />
        </header>

        {menuOpen && (
          <nav
            className="flex flex-col px-4 pb-2 pt-1"
            style={{ background: "#1A3EC4" }}
            aria-label="Main menu"
          >
            {[
              { label: "Home",     href: "/dashboard" },
              { label: "History",  href: "/history" },
              { label: "Settings", href: "/settings" },
              { label: "Profile",  href: "/profile" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between text-white/90 text-sm py-2.5 border-b border-white/10 last:border-0 hover:text-white transition-colors"
              >
                {label}
                <ChevronRight size={14} className="opacity-50" />
              </Link>
            ))}
          </nav>
        )}

        <div
          className="px-4 pt-0.5 pb-2 text-center"
          style={{ background: "#1F49D8" }}
        >
          <h1 className="text-white text-[22px] font-extrabold tracking-wide">
            Security System
          </h1>
        </div>

        <div className="flex-1 bg-white px-3 sm:px-4 pt-2 pb-16 sm:pb-3 flex flex-col gap-2 relative">

          {/* Location card - Dynamic user location */}
          <div
            className="flex items-center gap-2 rounded-xl px-2 py-1.5"
            style={{ background: "#ECECF1" }}
          >
            <div
              className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center"
              style={{ background: "#C8D0E7" }}
            >
              <User size={16} color="#7A8BB0" />
            </div>
            <div>
              <p className="text-[9px] text-[#7A8BB0] font-medium">Delivered from</p>
              <div className="flex items-center gap-1 mt-0">
                <MapPin size={9} color="#E8334A" />
                <span className="text-[11px] font-semibold text-[#1A1A1A]">
                  {user?.mall_name && user?.gate_number
                    ? `${user.mall_name}, Gate ${user.gate_number.replace(/gate\s*/i, '').trim()}`
                    : user?.mall_name
                    ? `${user.mall_name}`
                    : "Set your location in Profile"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <RealTimeDataTable
              data={matches}
              connected={connected}
              loading={loading}
              error={error}
              lastUpdate={lastUpdate}
              connectionType={connectionType}
              onRefresh={refreshData}
              onSendTest={sendTestData}
              onConfirmMatch={handleConfirmMatch}
              onRejectMatch={handleRejectMatch}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
