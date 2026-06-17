// ─────────────────────────────────────────────
// Notification Bell Component
//
// Simple bell icon that navigates to notifications page
// No badge, no dropdown, just navigation
// ─────────────────────────────────────────────

"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/notifications")}
      className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
      style={{ background: "transparent" }}
    >
      <Bell size={24} color="#fff" />
    </button>
  );
}
