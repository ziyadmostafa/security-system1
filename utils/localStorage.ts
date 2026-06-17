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
  status: "accepted" | "rejected";
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

export const addNotification = (notification: NotificationRecord): void => {
  if (typeof window === "undefined") return;
  
  try {
    const notifications = getNotifications();
    // Add new notification at the beginning (latest first)
    notifications.unshift(notification);
    // Keep only last 50 notifications to prevent storage overflow
    if (notifications.length > 50) {
      notifications.pop();
    }
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error("Error adding notification to localStorage:", error);
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
