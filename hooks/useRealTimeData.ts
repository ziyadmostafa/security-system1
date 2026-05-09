// Real-time data hook with WebSocket and fallback mechanism
// Handles WebSocket connection and JSON file fallback

"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

export interface SecurityData {
  type?: string;
  person_name: string;
  person_id: string;
  age: string;
  legal_case: string;
  score: string;
  node_id: string;
  timestamp: string;
  server_timestamp?: string;
  match_id?: string;
}

interface RealTimeDataState {
  connected: boolean;
  data: SecurityData[];
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
  connectionType: 'websocket' | 'fallback' | 'offline' | 'reconnecting';
}

const SERVER_URL = 'https://spireless-elmira-unmurmurously.ngrok-free.dev';
const WS_URL = 'https://spireless-elmira-unmurmurously.ngrok-free.dev';

// ── Gate number normalization helper ──
// Converts "Gate 1", "gate 2", "3" → "1", "2", "3"
function normalizeGate(gate: string | null | undefined): string {
  if (!gate) return '';
  return gate.toString().toLowerCase().replace(/^gate\s*/i, '').trim();
}

export function useRealTimeData() {
  const [state, setState] = useState<RealTimeDataState>({
    connected: false,
    data: [],
    loading: false,
    error: null,
    lastUpdate: null,
    connectionType: 'offline'
  });

  const socketRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef<SecurityData[]>([]);
  const userGateRef = useRef<string>('');
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  // Keep userGateRef always in sync with latest auth state
  useEffect(() => {
    const normalized = normalizeGate(user?.gate_number);
    userGateRef.current = user?.gate_number || '';
    console.log('[AUTH] User gate updated:', user?.gate_number, '→ normalized:', normalized);
  }, [user?.gate_number]);

  // Helper function to check if event belongs to user's gate
  const isEventForUserGate = useCallback((eventNodeId: string): boolean => {
    const userGate = normalizeGate(userGateRef.current);
    const eventGate = normalizeGate(eventNodeId);
    console.log('[GATE MATCH] User gate:', userGateRef.current, '→', userGate, '| Event gate:', eventNodeId, '→', eventGate, '| Match:', userGate === eventGate);
    if (!userGate) return false;
    return userGate === eventGate;
  }, []);

  // Fallback: Fetch data from JSON file via REST API
  const fetchFallbackData = useCallback(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/data`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const allData = result.data || [];
          
          // Gate-based filtering: Only show events for user's gate
          const currentUserGate = normalizeGate(user?.gate_number || '');
          console.log('[FALLBACK] Normalized user gate for filtering:', currentUserGate);
          const filteredData = currentUserGate
            ? allData.filter((item: SecurityData) => {
                const itemGate = normalizeGate(item.node_id);
                const match = itemGate === currentUserGate;
                if (!match) console.log('[FALLBACK] Filtering out item gate:', item.node_id, '→', itemGate, '≠ user gate:', currentUserGate);
                return match;
              })
            : [];
          
          dataRef.current = filteredData;
          
          setState(prev => ({
            ...prev,
            data: filteredData,
            loading: false,
            error: null,
            lastUpdate: result.timestamp,
            connectionType: 'fallback'
          }));
          
          console.log(`Loaded ${filteredData.length}/${allData.length} records via fallback (gate-filtered for: ${user?.gate_number || 'none'})`);
        }
      }
    } catch (error) {
      console.error('Fallback fetch error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Unable to connect to server',
        connectionType: 'offline'
      }));
    }
  }, [isEventForUserGate, user?.gate_number]);

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    try {
      // Clear any existing fallback polling
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
        fallbackIntervalRef.current = null;
      }

      // Import socket.io-client dynamically to avoid SSR issues
      import('socket.io-client').then(({ io }) => {
        console.log('Connecting to socket...');
        socketRef.current = io(SERVER_URL, {
          transports: ['websocket'],
          forceNew: true,
          reconnection: true
        });

        socketRef.current.on('connect', () => {
          console.log('Connected');
          console.log('Socket ID:', socketRef.current.id);
          setState(prev => ({
            ...prev,
            connected: true,
            loading: false,
            error: null,
            connectionType: 'websocket'
          }));

          // Clear any pending reconnection timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        });

        socketRef.current.on('disconnect', (reason: string) => {
          console.log('WebSocket disconnected:', reason);
          console.log('Socket.IO will attempt to reconnect automatically...');
          setState(prev => ({
            ...prev,
            connected: false,
            connectionType: 'reconnecting'
          }));
          // Let Socket.IO handle reconnection automatically
        });

        socketRef.current.on('new_match', (newData: SecurityData) => {
          console.log('📡 Received new_match event via WebSocket');
          console.log('Data received:', newData);
          console.log('Data structure:', JSON.stringify(newData, null, 2));
          
          // Gate-based filtering: Check if event belongs to user's gate
          // Use ref directly to avoid stale closure from useCallback capture
          const normalizedUserGate = normalizeGate(userGateRef.current);
          const normalizedEventGate = normalizeGate(newData.node_id);
          const isMatch = normalizedUserGate && normalizedEventGate && normalizedUserGate === normalizedEventGate;

          console.log('[SOCKET new_match] Raw user gate:', userGateRef.current, '| Normalized:', normalizedUserGate);
          console.log('[SOCKET new_match] Raw event gate:', newData.node_id, '| Normalized:', normalizedEventGate);
          console.log('[SOCKET new_match] Match result:', isMatch);

          if (!isMatch) {
            console.log('🚫 Event filtered out - user gate', normalizedUserGate, '≠ event gate', normalizedEventGate);
            return;
          }

          console.log('✅ Event accepted for user\'s gate:', normalizedUserGate);
          
          // Update data with new match at the beginning
          const updatedData = [newData, ...dataRef.current];
          dataRef.current = updatedData;
          
          console.log('Updated data array length:', updatedData.length);
          console.log('First item in array:', updatedData[0]);
          
          setState(prev => ({
            ...prev,
            data: updatedData,
            loading: false,
            error: null,
            lastUpdate: newData.server_timestamp || newData.timestamp,
            connectionType: 'websocket'
          }));

          // Add to notification queue
          const notificationItem = {
            id: newData.match_id || `${newData.timestamp}_${newData.person_id}`,
            type: "match" as const,
            person_name: newData.person_name,
            person_id: newData.person_id,
            age: newData.age,
            legal_case: newData.legal_case,
            score: parseFloat(newData.score) || 0,
            node_id: newData.node_id,
            timestamp: newData.timestamp,
            server_timestamp: newData.server_timestamp
          };
          addNotification(notificationItem);
        });

        socketRef.current.on('error', (error: any) => {
          console.error('WebSocket error:', error);
          setState(prev => ({
            ...prev,
            error: error.message || 'Connection error',
            connectionType: 'offline'
          }));
        });

        socketRef.current.on('connect_error', (error: any) => {
          console.log('ERROR:', error);
          // Don't set error state - let Socket.IO handle reconnection
          // Error state will only be set if reconnection fails completely
        });

      }).catch((error) => {
        console.error('Failed to import socket.io-client:', error);
        // Start fallback polling
        fetchFallbackData();
        fallbackIntervalRef.current = setInterval(fetchFallbackData, 5000);
      });

    } catch (error) {
      console.error('WebSocket connection failed:', error);
      // Start fallback polling
      fetchFallbackData();
      fallbackIntervalRef.current = setInterval(fetchFallbackData, 5000);
    }
  }, [fetchFallbackData]);

  // Send test data
  const sendTestData = useCallback(() => {
    const testData: SecurityData = {
      person_name: "Test Criminal",
      person_id: `TEST_${Date.now()}`,
      age: "32",
      legal_case: "Trespassing",
      score: "95%",
      node_id: "NODE_01",
      timestamp: new Date().toISOString()
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit('new_match', testData);
      console.log('Sent test data via WebSocket');
    } else {
      // Send via REST API as fallback
      fetch(`${SERVER_URL}/api/new_match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      }).then(response => response.json())
        .then(result => {
          console.log('Sent test data via REST API:', result);
          // Refresh data
          fetchFallbackData();
        })
        .catch(error => {
          console.error('Failed to send test data:', error);
        });
    }
  }, [fetchFallbackData]);

  // Emit criminal confirmed event
  const emitCriminalConfirmed = useCallback((data: SecurityData) => {
    const eventData = {
      name: data.person_name,
      id: data.person_id,
      time: data.timestamp,
      location: data.node_id
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit('criminal_confirmed', eventData);
      console.log('Emitted criminal_confirmed:', eventData);
      return true;
    } else {
      console.warn('WebSocket not connected, cannot emit criminal_confirmed');
      return false;
    }
  }, []);

  // Emit criminal rejected event
  const emitCriminalRejected = useCallback((data: SecurityData) => {
    const eventData = {
      name: data.person_name,
      id: data.person_id,
      time: data.timestamp,
      location: data.node_id
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit('criminal_rejected', eventData);
      console.log('Emitted criminal_rejected:', eventData);
      return true;
    } else {
      console.warn('WebSocket not connected, cannot emit criminal_rejected');
      return false;
    }
  }, []);

  // Manual refresh
  const refreshData = useCallback(() => {
    if (socketRef.current?.connected) {
      // WebSocket is connected, data should be real-time
      console.log('WebSocket is active, data is real-time');
    } else {
      // Force refresh via fallback
      fetchFallbackData();
    }
  }, [fetchFallbackData]);

  // Initialize connection on mount
  useEffect(() => {
    connectWebSocket();

    return () => {
      // Cleanup
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
      }
    };
  }, [connectWebSocket]);

  return {
    ...state,
    sendTestData,
    refreshData,
    reconnect: connectWebSocket,
    emitCriminalConfirmed,
    emitCriminalRejected
  };
}
