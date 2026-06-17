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
import { getNotifications, NotificationRecord } from "@/utils/localStorage";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  // Load all notifications from localStorage on mount
  useEffect(() => {
    setNotifications(getNotifications());
  }, []);

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
              All Notifications
            </h1>
            <p className="text-white/70 text-xs mt-1" style={{ textShadow: "0 0 5px rgba(0, 170, 255, 0.3)" }}>
              {notifications.length} {notifications.length === 1 ? "notification" : "notifications"}
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
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={40} color="#00aaff" className="mx-auto mb-3" style={{ filter: "drop-shadow(0 0 12px rgba(0, 170, 255, 0.4))" }} />
              <p className="text-[#1A1A1A] text-sm font-medium">No notifications yet</p>
              <p className="text-[#7A8BB0] text-xs mt-1">Notifications will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl px-4 py-4 relative overflow-hidden"
                  style={{
                    background: notification.status === "pending"
                      ? "linear-gradient(135deg, rgba(0, 170, 255, 0.06) 0%, rgba(0, 100, 200, 0.1) 100%)"
                      : notification.status === "confirmed"
                      ? "linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, rgba(22, 163, 74, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(239, 68, 68, 0.04) 0%, rgba(220, 38, 38, 0.08) 100%)",
                    border: `1px solid ${
                      notification.status === "pending"
                        ? "rgba(0, 170, 255, 0.3)"
                        : notification.status === "confirmed"
                        ? "rgba(34, 197, 94, 0.3)"
                        : "rgba(239, 68, 68, 0.25)"
                    }`,
                    boxShadow: notification.status === "pending"
                      ? "0 0 15px rgba(0, 170, 255, 0.1), inset 0 0 8px rgba(0, 170, 255, 0.05)"
                      : notification.status === "confirmed"
                      ? "0 0 15px rgba(34, 197, 94, 0.1), inset 0 0 8px rgba(34, 197, 94, 0.05)"
                      : "0 0 15px rgba(239, 68, 68, 0.08), inset 0 0 8px rgba(239, 68, 68, 0.03)",
                  }}
                >
                  <div className="flex items-start gap-3 relative z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: notification.status === "pending"
                          ? "linear-gradient(135deg, rgba(0, 170, 255, 0.3) 0%, rgba(0, 100, 200, 0.4) 100%)"
                          : notification.status === "confirmed"
                          ? "linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.4) 100%)"
                          : "linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.4) 100%)",
                        border: `1px solid ${
                          notification.status === "pending"
                            ? "rgba(0, 170, 255, 0.5)"
                            : notification.status === "confirmed"
                            ? "rgba(34, 197, 94, 0.5)"
                            : "rgba(239, 68, 68, 0.4)"
                        }`,
                        boxShadow: notification.status === "pending"
                          ? "0 0 12px rgba(0, 170, 255, 0.3)"
                          : notification.status === "confirmed"
                          ? "0 0 12px rgba(34, 197, 94, 0.3)"
                          : "0 0 12px rgba(239, 68, 68, 0.2)",
                      }}
                    >
                      {notification.status === "pending" ? (
                        <AlertTriangle size={16} color="#00d4ff" style={{ filter: "drop-shadow(0 0 5px rgba(0, 170, 255, 0.7))" }} />
                      ) : notification.status === "confirmed" ? (
                        <Check size={16} color="#22c55e" style={{ filter: "drop-shadow(0 0 5px rgba(34, 197, 94, 0.7))" }} />
                      ) : (
                        <X size={16} color="#ef4444" style={{ filter: "drop-shadow(0 0 5px rgba(239, 68, 68, 0.5))" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[13px] font-bold text-[#1A1A1A] truncate">
                          {notification.person_name}
                        </p>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: notification.status === "pending"
                              ? "linear-gradient(135deg, rgba(0, 170, 255, 0.8) 0%, rgba(0, 100, 200, 0.9) 100%)"
                              : notification.status === "confirmed"
                              ? "linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(22, 163, 74, 0.9) 100%)"
                              : "linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.9) 100%)",
                            color: "#fff",
                            boxShadow: notification.status === "pending"
                              ? "0 0 8px rgba(0, 170, 255, 0.4)"
                              : notification.status === "confirmed"
                              ? "0 0 8px rgba(34, 197, 94, 0.4)"
                              : "0 0 8px rgba(239, 68, 68, 0.3)",
                          }}
                        >
                          {notification.status.toUpperCase()}
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

                  {notification.status === "pending" && (
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
                  )}
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
