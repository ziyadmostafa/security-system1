// ─────────────────────────────────────────────
// History Page — /history
//
// Shows processed results from notifications
// Displays confirmed/rejected status for each item
// Loads from Supabase for persistent storage
// ─────────────────────────────────────────────

"use client";

import { useState } from "react";
import Image from "next/image";
import { History, Check, X, RefreshCw } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import CyberBackground from "@/components/CyberBackground";
import CyberBottomNav from "@/components/CyberBottomNav";

export default function HistoryPage() {
  const { processedResults, refreshProcessedResults } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProcessedResults();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CyberBackground />

      <div className="flex flex-col w-full min-h-screen bg-white/95 backdrop-blur-xl shadow-2xl relative sm:max-w-md sm:mx-auto">

        {/* ── Futuristic Header ── */}
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
            <History size={22} color="#00d4ff" style={{ filter: "drop-shadow(0 0 8px rgba(0, 170, 255, 0.6))" }} />
            <span className="text-white text-base font-semibold" style={{ textShadow: "0 0 10px rgba(0, 170, 255, 0.5)" }}>
              History
            </span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="relative z-10 p-2 rounded-xl transition-all duration-300"
            style={{
              background: "rgba(0, 170, 255, 0.15)",
              border: "1px solid rgba(0, 170, 255, 0.3)",
              boxShadow: "0 0 12px rgba(0, 170, 255, 0.2)",
            }}
          >
            <RefreshCw size={18} color="#00d4ff" className={refreshing ? "animate-spin" : ""} />
          </button>
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
              Activity Log
            </h1>
            <p className="text-white/70 text-xs mt-1" style={{ textShadow: "0 0 5px rgba(0, 170, 255, 0.3)" }}>
              {processedResults.length} {processedResults.length === 1 ? "result" : "results"} recorded
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
          {processedResults.length === 0 ? (
            <div className="text-center py-12">
              <History size={40} color="#00aaff" className="mx-auto mb-3" style={{ filter: "drop-shadow(0 0 12px rgba(0, 170, 255, 0.4))" }} />
              <p className="text-[#1A1A1A] text-sm font-medium">No processed results yet</p>
              <p className="text-[#7A8BB0] text-xs mt-1">Confirmed and rejected results will appear here</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {processedResults.map((result) => (
                <div
                  key={result.id}
                  className="rounded-2xl px-4 py-4 relative overflow-hidden"
                  style={{
                    background: result.status === "confirmed"
                      ? "linear-gradient(135deg, rgba(0, 170, 255, 0.06) 0%, rgba(0, 100, 200, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(255, 50, 50, 0.04) 0%, rgba(200, 0, 0, 0.08) 100%)",
                    border: `1px solid ${result.status === "confirmed" ? "rgba(0, 170, 255, 0.3)" : "rgba(255, 50, 50, 0.25)"}`,
                    boxShadow: result.status === "confirmed"
                      ? "0 0 15px rgba(0, 170, 255, 0.1), inset 0 0 8px rgba(0, 170, 255, 0.05)"
                      : "0 0 15px rgba(255, 50, 50, 0.08), inset 0 0 8px rgba(255, 50, 50, 0.03)",
                  }}
                >
                  {/* Card glow */}
                  <div className="absolute inset-0 rounded-2xl" style={{
                    background: "linear-gradient(135deg, transparent 25%, rgba(0, 170, 255, 0.04) 75%, transparent)",
                    animation: "cyber-pulse 3s ease-in-out infinite",
                  }} />
                  <div className="flex items-start gap-3 relative z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: result.status === "confirmed"
                          ? "linear-gradient(135deg, rgba(0, 170, 255, 0.3) 0%, rgba(0, 100, 200, 0.4) 100%)"
                          : "linear-gradient(135deg, rgba(255, 50, 50, 0.3) 0%, rgba(200, 0, 0, 0.4) 100%)",
                        border: `1px solid ${result.status === "confirmed" ? "rgba(0, 170, 255, 0.5)" : "rgba(255, 50, 50, 0.4)"}`,
                        boxShadow: result.status === "confirmed"
                          ? "0 0 12px rgba(0, 170, 255, 0.3)"
                          : "0 0 12px rgba(255, 50, 50, 0.2)",
                      }}
                    >
                      {result.status === "confirmed" ? (
                        <Check size={16} color="#00d4ff" style={{ filter: "drop-shadow(0 0 5px rgba(0, 170, 255, 0.7))" }} />
                      ) : (
                        <X size={16} color="#ff6b6b" style={{ filter: "drop-shadow(0 0 5px rgba(255, 50, 50, 0.5))" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[13px] font-bold text-[#1A1A1A] truncate">
                          {result.person_name}
                        </p>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: result.status === "confirmed"
                              ? "linear-gradient(135deg, rgba(0, 170, 255, 0.8) 0%, rgba(0, 100, 200, 0.9) 100%)"
                              : "linear-gradient(135deg, rgba(255, 50, 50, 0.8) 0%, rgba(200, 0, 0, 0.9) 100%)",
                            color: "#fff",
                            boxShadow: result.status === "confirmed"
                              ? "0 0 8px rgba(0, 170, 255, 0.4)"
                              : "0 0 8px rgba(255, 50, 50, 0.3)",
                          }}
                        >
                          {result.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A8BB0]">ID: {result.person_id}</p>
                      <p className="text-[11px] text-[#7A8BB0]">Case: {result.legal_case}</p>
                      <p className="text-[11px] text-[#7A8BB0]">Score: {result.score.toFixed(2)}</p>
                      <p className="text-[11px] text-[#7A8BB0]">Node: {result.node_id}</p>
                      <p className="text-[10px] text-[#7A8BB0] mt-1">
                        {new Date(result.timestamp).toLocaleString()}
                      </p>
                      <p className="text-[9px] text-[#7A8BB0] mt-0.5">
                        Processed: {new Date(result.processedAt).toLocaleString()}
                      </p>
                    </div>
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
