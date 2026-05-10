"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clock, Settings, User } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Clock, label: "History", href: "/history" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function CyberBottomNav() {
  const pathname = usePathname();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "linear-gradient(135deg, rgba(0, 40, 100, 0.95) 0%, rgba(0, 20, 60, 0.98) 100%)",
        borderTop: "2px solid rgba(0, 170, 255, 0.4)",
        boxShadow: "0 -5px 25px rgba(0, 170, 255, 0.3), inset 0 0 15px rgba(0, 170, 255, 0.1)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Navbar glow overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0, 170, 255, 0.12), transparent)",
          animation: "shimmer 3s infinite",
        }}
      />

      <div className="flex items-center justify-around py-3 relative z-10">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300"
              style={{
                background: active
                  ? "linear-gradient(135deg, rgba(0, 170, 255, 0.25) 0%, rgba(0, 100, 200, 0.35) 100%)"
                  : "rgba(0, 170, 255, 0.08)",
                border: active
                  ? "2px solid rgba(0, 170, 255, 0.5)"
                  : "1px solid rgba(0, 170, 255, 0.2)",
                boxShadow: active
                  ? "0 0 20px rgba(0, 170, 255, 0.4), inset 0 0 10px rgba(0, 170, 255, 0.15)"
                  : "0 0 8px rgba(0, 170, 255, 0.15), inset 0 0 5px rgba(0, 170, 255, 0.05)",
              }}
            >
              <Icon
                size={20}
                color={active ? "#00d4ff" : "#ffffff"}
                style={{
                  filter: active
                    ? "drop-shadow(0 0 10px rgba(0, 170, 255, 0.7))"
                    : "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))",
                }}
              />
              <span
                className="text-xs font-semibold"
                style={{
                  color: active ? "#00d4ff" : "#ffffff",
                  textShadow: active
                    ? "0 0 10px rgba(0, 170, 255, 0.7)"
                    : "0 0 5px rgba(255, 255, 255, 0.3)",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
