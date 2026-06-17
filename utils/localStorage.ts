// ─────────────────────────────────────────────
// LocalStorage Utility for Notifications & History
//
// Provides persistent storage for:
// - Notifications (real-time face recognition events)
// - History (confirmed/rejected records)
// ─────────────────────────────────────────────

export interface HistoryRecord {
  id: string;
  person_name: string;
  person_id: string;
  legal_case: string;
  score: number;
  node_id: string;
  timestamp: string;
  processedAt: string;
  status: "confirmed" | "rejected";
}

export interface NotificationRecord {
  id: string;
  type: "match";
  person_name: string;
  person_id: string;
  age: string;
  legal_case: string;
  score: number;
  node_id: string;
  timestamp: string;
  server_timestamp?: string;
  processedAt?: string;
  status: "pending" | "confirmed" | "rejected";
}

const HISTORY_STORAGE_KEY = "security_system_history";
const NOTIFICATIONS_STORAGE_KEY = "security_system_notifications";

// ── History Operations ──

export const getHistory = (): HistoryRecord[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(HISTORY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading history from localStorage:", error);
    return [];
  }
};

export const addHistoryRecord = (record: HistoryRecord): void => {
  if (typeof window === "undefined") return;
  
  try {
    const history = getHistory();
    // Add new record at the beginning (latest first)
    history.unshift(record);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error adding history record to localStorage:", error);
  }
};

export const clearHistory = (): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing history from localStorage:", error);
  }
};

export const deleteHistoryRecord = (id: string): void => {
  if (typeof window === "undefined") return;
  
  try {
    const history = getHistory();
    const updatedHistory = history.filter((record) => record.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Error deleting history record from localStorage:", error);
  }
};

// ── Notification Operations ──

export const getNotifications = (): NotificationRecord[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading notifications from localStorage:", error);
    return [];
  }
};

export const getPendingNotifications = (): NotificationRecord[] => {
  const notifications = getNotifications();
  return notifications.filter((n) => n.status === "pending");
};

export const addNotification = (notification: NotificationRecord): void => {
  if (typeof window === "undefined") return;
  
  try {
    const notifications = getNotifications();
    // Check if notification already exists
    const existing = notifications.find((n) => n.id === notification.id);
    if (!existing) {
      // Add new notification at the beginning (latest first)
      notifications.unshift(notification);
      // Keep only last 50 notifications to prevent storage overflow
      if (notifications.length > 50) {
        notifications.pop();
      }
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    }
  } catch (error) {
    console.error("Error adding notification to localStorage:", error);
  }
};

export const updateNotificationStatus = (id: string, status: "confirmed" | "rejected"): void => {
  if (typeof window === "undefined") return;
  
  try {
    const notifications = getNotifications();
    const updatedNotifications = notifications.map((n) =>
      n.id === id ? { ...n, status } : n
    );
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error("Error updating notification status in localStorage:", error);
  }
};

export const clearNotifications = (): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing notifications from localStorage:", error);
  }
};

export const deleteNotification = (id: string): void => {
  if (typeof window === "undefined") return;
  
  try {
    const notifications = getNotifications();
    const updatedNotifications = notifications.filter((record) => record.id !== id);
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error("Error deleting notification from localStorage:", error);
  }
};
