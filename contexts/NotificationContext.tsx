// ─────────────────────────────────────────────
// Notification Context
//
// Manages notification state for pending results
// Handles adding, confirming, and rejecting notifications
// Syncs with Explore page for processed results
// Saves to Supabase for persistent storage
// ─────────────────────────────────────────────

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface NotificationItem {
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
}

export interface ProcessedResult extends NotificationItem {
  status: "confirmed" | "rejected";
  processedAt: string;
}

interface NotificationContextType {
  pendingNotifications: NotificationItem[];
  processedResults: ProcessedResult[];
  addNotification: (item: NotificationItem) => void;
  confirmNotification: (id: string) => void;
  rejectNotification: (id: string) => void;
  getPendingCount: () => number;
  refreshProcessedResults: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [pendingNotifications, setPendingNotifications] = useState<NotificationItem[]>([]);
  const [processedResults, setProcessedResults] = useState<ProcessedResult[]>([]);

  // Load processed results from Supabase on mount and when user changes
  useEffect(() => {
    if (user) {
      loadProcessedResults();
    }
  }, [user]);

  // Gate number normalization helper
  const normalizeGate = (gate: string | null | undefined): string => {
    if (!gate) return '';
    return gate.toString().toLowerCase().replace(/^gate\s*/i, '').trim();
  };

  // Helper function to check if event belongs to user's gate
  const isEventForUserGate = (eventNodeId: string): boolean => {
    const userGate = normalizeGate(user?.gate_number);
    const eventGate = normalizeGate(eventNodeId);
    console.log('[NOTIFY GATE] User:', user?.gate_number, '→', userGate, '| Event:', eventNodeId, '→', eventGate, '| Match:', userGate === eventGate);
    if (!userGate) return false;
    return userGate === eventGate;
  };

  const loadProcessedResults = async () => {
    if (!user?.id) return;
    
    try {
      // Check if supabase client is available
      if (!supabase) {
        console.warn('[NOTIFICATIONS] Supabase client not available during build/prerender');
        return;
      }
      
      const { data, error } = await supabase
        .from('processed_results')
        .select('*')
        .eq('user_id', user.id)
        .order('processed_at', { ascending: false });

      if (error) {
        console.error('Error loading processed results:', error);
        return;
      }

      if (data) {
        // Gate-based filtering: Only show results for user's gate
        const allResults: ProcessedResult[] = data.map((item: any) => ({
          id: item.match_id,
          type: "match" as const,
          person_name: item.person_name,
          person_id: item.person_id,
          age: item.age,
          legal_case: item.legal_case,
          score: item.score,
          node_id: item.node_id,
          timestamp: item.timestamp,
          server_timestamp: item.server_timestamp,
          status: item.status,
          processedAt: item.processed_at
        }));
        
        // Filter results by user's gate
        const filteredResults = user?.gate_number 
          ? allResults.filter((item) => isEventForUserGate(item.node_id))
          : [];
        
        setProcessedResults(filteredResults);
        console.log(`Loaded ${filteredResults.length}/${allResults.length} processed results (gate-filtered for: ${user?.gate_number || 'none'})`);
      }
    } catch (error) {
      console.error('Error loading processed results:', error);
    }
  };

  const addNotification = (item: NotificationItem) => {
    setPendingNotifications(prev => [...prev, item]);
  };

  const saveToSupabase = async (notification: NotificationItem, status: "confirmed" | "rejected") => {
    try {
      // Check if supabase client is available
      if (!supabase) {
        console.warn('[NOTIFICATIONS] Supabase client not available during build/prerender');
        return;
      }
      
      const { error } = await supabase
        .from('processed_results')
        .insert([{
          match_id: notification.id,
          person_name: notification.person_name,
          person_id: notification.person_id,
          age: notification.age,
          legal_case: notification.legal_case,
          score: notification.score,
          node_id: notification.node_id,
          timestamp: notification.timestamp,
          server_timestamp: notification.server_timestamp,
          status: status,
          user_id: user?.id
        }] as any);

      if (error) {
        console.error('Error saving to Supabase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      return false;
    }
  };

  const confirmNotification = async (id: string) => {
    const notification = pendingNotifications.find(n => n.id === id);
    if (!notification) return;

    const processedItem: ProcessedResult = {
      ...notification,
      status: "confirmed",
      processedAt: new Date().toISOString()
    };

    // Remove from pending immediately
    setPendingNotifications(prev => prev.filter(n => n.id !== id));

    // Add to local state
    setProcessedResults(prev => [processedItem, ...prev]);

    // Save to Supabase for persistence
    await saveToSupabase(notification, "confirmed");
  };

  const rejectNotification = async (id: string) => {
    const notification = pendingNotifications.find(n => n.id === id);
    if (!notification) return;

    const processedItem: ProcessedResult = {
      ...notification,
      status: "rejected",
      processedAt: new Date().toISOString()
    };

    // Remove from pending immediately
    setPendingNotifications(prev => prev.filter(n => n.id !== id));

    // Add to local state
    setProcessedResults(prev => [processedItem, ...prev]);

    // Save to Supabase for persistence
    await saveToSupabase(notification, "rejected");
  };

  const getPendingCount = () => pendingNotifications.length;

  const refreshProcessedResults = async () => {
    await loadProcessedResults();
  };

  return (
    <NotificationContext.Provider
      value={{
        pendingNotifications,
        processedResults,
        addNotification,
        confirmNotification,
        rejectNotification,
        getPendingCount,
        refreshProcessedResults
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
