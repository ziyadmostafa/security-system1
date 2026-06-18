// Real-time data display component with exact card structure and button functionality
// Shows security data with individual cards and action buttons
// Integrated with notification system for persistent storage

"use client";

import { useState } from "react";
import { SecurityData } from "@/hooks/useRealTimeData";
import { useNotifications } from "@/contexts/NotificationContext";
import { Activity, AlertTriangle, Wifi, WifiOff, Database, RefreshCw, Check, X } from "lucide-react";

interface RealTimeDataTableProps {
  data: SecurityData[];
  connected: boolean;
  loading: boolean;
  error: string | null;
  lastUpdate: string | null;
  connectionType: 'websocket' | 'fallback' | 'offline' | 'reconnecting';
  onRefresh: () => void;
  onConfirmMatch?: (match: SecurityData) => void;
  onRejectMatch?: (match: SecurityData) => void;
}

interface CardState {
  [key: string]: 'confirmed' | 'rejected' | 'pending';
}

export default function RealTimeDataTable({
  data,
  connected,
  loading,
  error,
  lastUpdate,
  connectionType,
  onRefresh,
  onConfirmMatch,
  onRejectMatch
}: RealTimeDataTableProps) {

  const [cardStates, setCardStates] = useState<CardState>({});
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: ''
  });

  const { confirmNotification, rejectNotification, pendingNotifications } = useNotifications();

  const getConnectionStatus = () => {
    switch (connectionType) {
      case 'websocket':
        return { color: 'text-green-600', bg: 'bg-green-100', icon: Wifi, text: 'LIVE (WebSocket)' };
      case 'fallback':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Database, text: 'FALLBACK (HTTP)' };
      case 'offline':
        return { color: 'text-red-600', bg: 'bg-red-100', icon: WifiOff, text: 'OFFLINE' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', icon: WifiOff, text: 'UNKNOWN' };
    }
  };

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleConfirm = (match: SecurityData) => {
    console.log("CONFIRM CLICKED");
    console.log('Confirm button clicked for match:', match);
    const matchKey = match.match_id || `${match.timestamp}_${match.person_id}`;
    console.log('Setting card state to confirmed for key:', matchKey);

    setCardStates(prev => {
      const newState = { ...prev, [matchKey]: 'confirmed' } as CardState;
      console.log('Updated cardStates after confirm:', newState);
      return newState;
    });

    // Show toast notification
    showToast('success', 'the criminal detected successfully');

    // Call notification context to sync with bell and explore
    const notificationId = matchKey;
    const notification = pendingNotifications.find(n => n.id === notificationId);
    if (notification) {
      confirmNotification(notificationId);
    }

    onConfirmMatch?.(match);
  };

  const handleReject = (match: SecurityData) => {
    console.log("REJECT CLICKED");
    console.log('Reject button clicked for match:', match);
    const matchKey = match.match_id || `${match.timestamp}_${match.person_id}`;
    console.log('Setting card state to rejected for key:', matchKey);

    setCardStates(prev => {
      const newState = { ...prev, [matchKey]: 'rejected' } as CardState;
      console.log('Updated cardStates after reject:', newState);
      return newState;
    });

    // Show toast notification
    showToast('error', 'the criminal undetected');

    // Call notification context to sync with bell and explore
    const notificationId = matchKey;
    const notification = pendingNotifications.find(n => n.id === notificationId);
    if (notification) {
      rejectNotification(notificationId);
    }

    onRejectMatch?.(match);
  };

  const getCardStyle = (match: SecurityData) => {
    const matchKey = match.match_id || `${match.timestamp}_${match.person_id}`;
    const state = cardStates[matchKey];
    console.log('Card state for key', matchKey, ':', state);

    switch (state) {
      case 'confirmed':
        return 'bg-green-50 border-green-500';
      case 'rejected':
        return 'bg-red-50 border-red-500';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <AlertTriangle className="text-red-500 mr-2" size={20} />
          <span className="font-semibold text-red-800">Connection Error</span>
        </div>
        <p className="text-red-700 text-sm mb-3">{error}</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-xl flex items-center gap-2 sm:gap-3 max-w-full sm:max-w-md`}>
            {toast.type === 'success' ? <Check size={20} className="sm:w-6 sm:h-6" /> : <X size={20} className="sm:w-6 sm:h-6" />}
            <span className="font-semibold text-sm sm:text-lg">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2 sm:gap-3">
          <StatusIcon size={18} className={`${status.color} sm:w-5 sm:h-5`} />
          <div>
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
              {status.text}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <span className="text-xs sm:text-sm text-gray-600">
            {data.length} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="px-2 sm:px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Data Display - Each match in separate card */}
      {data.length === 0 ? (
        <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg border px-3">
          <AlertTriangle size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Security Data Available</h3>
          <p className="text-gray-500 mb-4">
            {connectionType === 'websocket'
              ? "Waiting for real-time data from security nodes..."
              : "No data found in system"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {data.map((match, index) => {
            const matchKey = match.match_id || `${match.timestamp}_${match.person_id}`;
            const cardState = cardStates[matchKey];
            const isDisabled = cardState === 'confirmed' || cardState === 'rejected';
            return (
              <div
                key={match.match_id || index}
                className={`border-2 rounded-lg shadow-xl p-3 sm:p-4 transition-all duration-300 ${getCardStyle(match)} ${index === 0 && !isDisabled ? 'border-blue-500' : ''
                  }`}
              >
                {/* Card Title */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Activity size={16} className="text-red-500 sm:w-4 sm:h-4" />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">Criminal detected</h2>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 sm:ml-auto">
                    {cardState === 'confirmed' && (
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs sm:text-sm font-bold">+</span>
                        </div>
                        <span className="text-green-600 font-semibold text-xs sm:text-sm">CONFIRMED</span>
                      </div>
                    )}

                    {cardState === 'rejected' && (
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs sm:text-sm font-bold">×</span>
                        </div>
                        <span className="text-red-600 font-semibold text-xs sm:text-sm">REJECTED</span>
                      </div>
                    )}

                    {index === 0 && !isDisabled && (
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] sm:text-xs text-blue-600 font-semibold">Latest</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Match Data - Each on separate line */}
                <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 text-xs sm:text-sm">
                  <div className="text-gray-900 break-words leading-tight">
                    <span className="font-semibold">type:</span> <span className="text-gray-700">{match.type}</span>
                  </div>
                  <div className="text-gray-900 break-words leading-tight">
                    <span className="font-semibold">person_name:</span> <span className="text-gray-700">{match.person_name}</span>
                  </div>
                  <div className="text-gray-900 break-words leading-tight">
                    <span className="font-semibold">person_id:</span> <span className="text-gray-700">{match.person_id}</span>
                  </div>
                  <div className="text-gray-900 break-words leading-tight">
                    <span className="font-semibold">age:</span> <span className="text-gray-700">{match.age}</span>
                  </div>
                  <div className="text-gray-900 break-words leading-tight">
                    <span className="font-semibold">legal_case:</span> <span className="text-gray-700">{match.legal_case}</span>
                  </div>
                  <div className="text-gray-900 break-words leading-tight">
                    <span className="font-semibold">score:</span> <span className="text-gray-700">{match.score}</span>
                  </div>
                  <div className="text-gray-900 break-words leading-tight">
                    <span className="font-semibold">node_id:</span> <span className="text-gray-700">{match.node_id}</span>
                  </div>
                  <div className="text-gray-900 break-words leading-tight">
                    <span className="font-semibold">timestamp:</span> <span className="text-gray-700 text-[10px] sm:text-xs">{match.timestamp}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("CONFIRM CLICKED");
                      handleConfirm(match);
                    }}
                    disabled={isDisabled}
                    className={`flex-1 py-3.5 sm:py-4 px-4 sm:px-8 rounded-lg font-bold text-base sm:text-lg transition-colors flex items-center justify-center gap-2 shadow-lg pointer-events-auto min-h-[50px] ${isDisabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    style={{ zIndex: 10 }}
                  >
                    <Check size={20} className="sm:w-5 sm:h-5" />
                    <span>Confirm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      console.log("REJECT CLICKED");
                      handleReject(match);
                    }}
                    disabled={isDisabled}
                    className={`flex-1 py-3.5 sm:py-4 px-4 sm:px-8 rounded-lg font-bold text-base sm:text-lg transition-colors flex items-center justify-center gap-2 shadow-lg pointer-events-auto min-h-[50px] ${isDisabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    style={{ zIndex: 10 }}
                  >
                    <X size={20} className="sm:w-5 sm:h-5" />
                    <span>Reject</span>
                  </button>
                </div>

                {/* Visual Confirmation/Rejection Indicator */}
                {cardState === 'confirmed' && (
                  <div className="mt-2 pt-2 border-t border-green-300">
                    <div className="flex items-center gap-1.5">
                      <Check size={14} className="text-green-600" />
                      <span className="text-xs text-green-600 font-semibold">The criminal catching successfully</span>
                    </div>
                  </div>
                )}

                {cardState === 'rejected' && (
                  <div className="mt-2 pt-2 border-t border-red-300">
                    <div className="flex items-center gap-1.5">
                      <X size={14} className="text-red-600" />
                      <span className="text-xs text-red-600 font-semibold">Match rejected</span>
                    </div>
                  </div>
                )}

                {/* Latest Record Indicator */}
                {index === 0 && !isDisabled && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-blue-600 font-semibold">Latest Detection</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}