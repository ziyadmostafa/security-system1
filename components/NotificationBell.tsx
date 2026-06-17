// ─────────────────────────────────────────────
// Notification Bell Component
//
// Displays notification bell with badge count
// Shows pending notifications in dropdown panel
// Allows confirm/reject actions on each notification
// Stores notifications in localStorage for persistence
// ─────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
import { useNotifications, NotificationItem } from "@/contexts/NotificationContext";
import { Bell, Check, X, AlertTriangle } from "lucide-react";
import { getNotifications, addNotification, NotificationRecord, addHistoryRecord, HistoryRecord } from "@/utils/localStorage";

export default function NotificationBell() {
  const { pendingNotifications, confirmNotification, rejectNotification, getPendingCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const pendingCount = getPendingCount();

  const handleConfirm = (id: string) => {
    confirmNotification(id);
    // Save to history with confirmed status
    const notification = pendingNotifications.find((n) => n.id === id);
    if (notification) {
      const historyRecord: HistoryRecord = {
        id: notification.id,
        person_name: notification.person_name,
        person_id: notification.person_id,
        legal_case: notification.legal_case,
        score: notification.score,
        node_id: notification.node_id,
        timestamp: notification.timestamp,
        processedAt: new Date().toISOString(),
        status: "confirmed",
      };
      addHistoryRecord(historyRecord);
    }
  };

  const handleReject = (id: string) => {
    rejectNotification(id);
    // Save to history with rejected status
    const notification = pendingNotifications.find((n) => n.id === id);
    if (notification) {
      const historyRecord: HistoryRecord = {
        id: notification.id,
        person_name: notification.person_name,
        person_id: notification.person_id,
        legal_case: notification.legal_case,
        score: notification.score,
        node_id: notification.node_id,
        timestamp: notification.timestamp,
        processedAt: new Date().toISOString(),
        status: "rejected",
      };
      addHistoryRecord(historyRecord);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
        style={{ background: "transparent" }}
      >
        <Bell size={24} color="#fff" />
        {pendingCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            style={{
              minWidth: "20px",
              minHeight: "20px"
            }}
          >
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div
            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-xl shadow-2xl z-50 border"
            style={{
              borderColor: "#C8D0E7",
              maxHeight: "400px"
            }}
          >
            <div className="p-4 border-b" style={{ borderColor: "#C8D0E7" }}>
              <h3 className="text-sm font-bold text-[#1A1A1A]">
                Notifications ({pendingCount})
              </h3>
            </div>

            {pendingNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <AlertTriangle size={32} color="#7A8BB0" className="mx-auto mb-2" />
                <p className="text-sm text-[#7A8BB0]">No pending notifications</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "#C8D0E7" }}>
                {pendingNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onConfirm={handleConfirm}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function NotificationCard({
  notification,
  onConfirm,
  onReject
}: {
  notification: NotificationItem;
  onConfirm: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "#1F49D8" }}
        >
          <AlertTriangle size={16} color="#fff" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-[#1A1A1A] truncate">
            {notification.person_name}
          </p>
          <p className="text-[10px] text-[#7A8BB0] mt-0.5">
            ID: {notification.person_id}
          </p>
          <p className="text-[10px] text-[#7A8BB0]">
            Score: {notification.score.toFixed(2)}
          </p>
          <p className="text-[10px] text-[#7A8BB0]">
            {new Date(notification.timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onConfirm(notification.id)}
          className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white transition-colors"
          style={{ background: "#22C55E" }}
        >
          Confirm
        </button>
        <button
          onClick={() => onReject(notification.id)}
          className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-white transition-colors"
          style={{ background: "#E8334A" }}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
