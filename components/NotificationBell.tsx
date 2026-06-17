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
import { 
  getPendingNotifications, 
  addNotification, 
  NotificationRecord, 
  addHistoryRecord, 
  HistoryRecord,
  updateNotificationStatus 
} from "@/utils/localStorage";

export default function NotificationBell() {
  const { pendingNotifications, confirmNotification, rejectNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingNotificationsList, setPendingNotificationsList] = useState<NotificationRecord[]>([]);

  // Load pending notifications from localStorage on mount
  useEffect(() => {
    setPendingNotificationsList(getPendingNotifications());
  }, []);

  // Sync context notifications to localStorage as pending when they arrive
  useEffect(() => {
    if (pendingNotifications.length > 0) {
      pendingNotifications.forEach((notification) => {
        const notificationRecord: NotificationRecord = {
          id: notification.id,
          type: notification.type,
          person_name: notification.person_name,
          person_id: notification.person_id,
          age: notification.age,
          legal_case: notification.legal_case,
          score: notification.score,
          node_id: notification.node_id,
          timestamp: notification.timestamp,
          server_timestamp: notification.server_timestamp,
          status: "pending", // New notifications start as pending
        };
        addNotification(notificationRecord);
      });
      setPendingNotificationsList(getPendingNotifications());
    }
  }, [pendingNotifications]);

  const handleConfirm = (id: string) => {
    // Find the notification before updating
    const notification = pendingNotificationsList.find((n) => n.id === id);
    
    // Update status in localStorage
    updateNotificationStatus(id, "confirmed");
    
    // Remove from context pending
    confirmNotification(id);
    
    // Save to history with confirmed status
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
    
    // Immediately update local state to remove from pending list
    setPendingNotificationsList((prev) => prev.filter((n) => n.id !== id));
  };

  const handleReject = (id: string) => {
    // Find the notification before updating
    const notification = pendingNotificationsList.find((n) => n.id === id);
    
    // Update status in localStorage
    updateNotificationStatus(id, "rejected");
    
    // Remove from context pending
    rejectNotification(id);
    
    // Save to history with rejected status
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
    
    // Immediately update local state to remove from pending list
    setPendingNotificationsList((prev) => prev.filter((n) => n.id !== id));
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
        {pendingNotificationsList.length > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
            style={{
              minWidth: "20px",
              minHeight: "20px"
            }}
          >
            {pendingNotificationsList.length > 9 ? "9+" : pendingNotificationsList.length}
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
                Notifications ({pendingNotificationsList.length})
              </h3>
            </div>

            {pendingNotificationsList.length === 0 ? (
              <div className="p-8 text-center">
                <AlertTriangle size={32} color="#7A8BB0" className="mx-auto mb-2" />
                <p className="text-sm text-[#7A8BB0]">No pending notifications</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "#C8D0E7" }}>
                {pendingNotificationsList.map((notification) => (
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
  notification: NotificationRecord;
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
