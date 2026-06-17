// ─────────────────────────────────────────────
// Notifications Page — /notifications
//
// Shows all notifications with Accept/Reject buttons
// Actions mark notifications as confirmed/rejected
// Persists changes in localStorage
// ─────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X, AlertTriangle } from "lucide-react";
import CyberBackground from "@/components/CyberBackground";
import CyberBottomNav from "@/components/CyberBottomNav";
import { NotificationRecord } from "@/utils/localStorage";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem("security_system_notifications");
    if (data) {
      setNotifications(JSON.parse(data));
    }
  }, []);

  // Derived value: pending notifications only (work queue)
  const pendingNotifications = notifications.filter(n => n.status === "pending");

  // Sync notifications to localStorage whenever state changes
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("security_system_notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const handleAccept = (id: string) => {
    setNotifications((prev) => 
      prev.map((n) => n.id === id ? { ...n, status: "confirmed" as const, processedAt: new Date().toISOString() } : n)
    );
  };

  const handleReject = (id: string) => {
    setNotifications((prev) => 
      prev.map((n) => n.id === id ? { ...n, status: "rejected" as const, processedAt: new Date().toISOString() } : n)
    );
  };

  // Sync to localStorage whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("security_system_notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CyberBackground />

      <div className="flex flex-col w-full min-h-screen bg-white/95 backdrop-blur-xl shadow-2xl relative sm:max-w-md sm:mx-auto">

        {/* ── Header ── */}
        <header
          className="flex items-center justify-between px-4 py-3 relative"
          style={{
            background: "linear-gradient(135deg, rgba(0, 40, 100, 0.95) 0%, rgba(0, 20, 60, 0.98) 100%)",
            borderBottom: "2px solid rgba(0, 170, 255, 0.4)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 25px rgba(0, 170, 255, 0.3), inset 0 0 15px rgba(0, 170, 255, 0.1)",
          }}
        >
          <div className="absolute inset-0" style={{
            background: "linear-gradient(90deg, transparent, rgba(0, 170, 255, 0.12), transparent)",
            animation: "shimmer 3s infinite"
          }} />
          <div className="relative flex items-center gap-2 z-10">
            <Bell size={22} color="#00d4ff" style={{ filter: "drop-shadow(0 0 8px rgba(0, 170, 255, 0.6))" }} />
            <span className="text-white text-base font-semibold" style={{ textShadow: "0 0 10px rgba(0, 170, 255, 0.5)" }}>
              Notifications
            </span>
          </div>
        </header>

        {/* ── Page Title Section ── */}
        <div
          className="px-4 pt-3 pb-4 text-center relative"
          style={{
            background: "linear-gradient(180deg, rgba(0, 40, 100, 0.6) 0%, rgba(0, 20, 60, 0.4) 100%)",
            borderBottom: "1px solid rgba(0, 170, 255, 0.25)",
          }}
        >
          <div className="absolute inset-0" style={{
            background: "linear-gradient(90deg, transparent, rgba(0, 170, 255, 0.08), transparent)",
            animation: "shimmer 4s infinite"
          }} />
          <div className="relative z-10">
            <h1 className="text-white text-xl font-bold tracking-wide" style={{ textShadow: "0 0 15px rgba(0, 170, 255, 0.6)" }}>
              Work Queue
            </h1>
            <p className="text-white/70 text-xs mt-1" style={{ textShadow: "0 0 5px rgba(0, 170, 255, 0.3)" }}>
              {pendingNotifications.length} {pendingNotifications.length === 1 ? "pending item" : "pending items"}
            </p>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div
          className="flex-1 px-4 pt-4 pb-24 flex flex-col gap-3 relative"
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(0, 170, 255, 0.12)",
          }}
        >
          {pendingNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={40} color="#00aaff" className="mx-auto mb-3" style={{ filter: "drop-shadow(0 0 12px rgba(0, 170, 255, 0.4))" }} />
              <p className="text-[#1A1A1A] text-sm font-medium">No pending items</p>
              <p className="text-[#7A8BB0] text-xs mt-1">All notifications have been processed</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl px-4 py-4 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 170, 255, 0.06) 0%, rgba(0, 100, 200, 0.1) 100%)",
                    border: "1px solid rgba(0, 170, 255, 0.3)",
                    boxShadow: "0 0 15px rgba(0, 170, 255, 0.1), inset 0 0 8px rgba(0, 170, 255, 0.05)",
                  }}
                >
                  <div className="flex items-start gap-3 relative z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "linear-gradient(135deg, rgba(0, 170, 255, 0.3) 0%, rgba(0, 100, 200, 0.4) 100%)",
                        border: "1px solid rgba(0, 170, 255, 0.5)",
                        boxShadow: "0 0 12px rgba(0, 170, 255, 0.3)",
                      }}
                    >
                      <AlertTriangle size={16} color="#00d4ff" style={{ filter: "drop-shadow(0 0 5px rgba(0, 170, 255, 0.7))" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[13px] font-bold text-[#1A1A1A] truncate">
                          {notification.person_name}
                        </p>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: "linear-gradient(135deg, rgba(0, 170, 255, 0.8) 0%, rgba(0, 100, 200, 0.9) 100%)",
                            color: "#fff",
                            boxShadow: "0 0 8px rgba(0, 170, 255, 0.4)",
                          }}
                        >
                          PENDING
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A8BB0]">ID: {notification.person_id}</p>
                      <p className="text-[11px] text-[#7A8BB0]">Case: {notification.legal_case}</p>
                      <p className="text-[11px] text-[#7A8BB0]">Score: {notification.score.toFixed(2)}</p>
                      <p className="text-[11px] text-[#7A8BB0]">Node: {notification.node_id}</p>
                      <p className="text-[10px] text-[#7A8BB0] mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAccept(notification.id)}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white transition-colors"
                      style={{ background: "#22C55E" }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(notification.id)}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white transition-colors"
                      style={{ background: "#E8334A" }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <CyberBottomNav />
      </div>
    </div>
  );
}
