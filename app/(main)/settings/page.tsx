// ─────────────────────────────────────────────
// Settings Page — /settings
//
// Settings screen with cyber security theme.
// Futuristic header, glassmorphism cards, glow effects.
// ─────────────────────────────────────────────

"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Lock,
  User,
  LogOut,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
  Settings as SettingsIcon,
} from "lucide-react";
import CyberBackground from "@/components/CyberBackground";
import CyberBottomNav from "@/components/CyberBottomNav";

export default function SettingsPage() {
  const router = useRouter();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const settingsSections = [
    {
      title: "Account",
      items: [
        { icon: User,   label: "Edit Profile",        description: "Update your name and photo" },
        { icon: Lock,   label: "Change Password",     description: "Update your login credentials", action: "password" },
      ],
    },
    {
      title: "Session",
      items: [
        { icon: LogOut, label: "Sign Out",            description: "Log out of this device" },
      ],
    },
  ];

  const handleSignOut = async () => {
    if (!supabase) {
      console.error("Supabase client failed to initialize");
      return;
    }
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);

    try {
      if (!supabase) {
        console.error("Supabase client failed to initialize");
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess("Password changed successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordSuccess("");
        }, 2000);
      }
    } catch (error) {
      setPasswordError("An error occurred while changing password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CyberBackground />

      <div className="flex flex-col w-full min-h-screen bg-white/95 backdrop-blur-xl shadow-2xl relative sm:max-w-md sm:mx-auto">

        {/* ── Futuristic Header ── */}
        <header
          className="flex items-center justify-center px-4 py-3 relative"
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
          <div className="relative z-10">
            <Image
              src="/logo.png"
              alt="Security System Logo"
              width={88}
              height={88}
              className="object-contain"
              priority
              style={{ filter: "drop-shadow(0 0 20px rgba(0, 170, 255, 0.6))" }}
            />
          </div>
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
          <div className="relative z-10 flex items-center justify-center gap-2">
            <SettingsIcon size={22} color="#00d4ff" style={{ filter: "drop-shadow(0 0 8px rgba(0, 170, 255, 0.6))" }} />
            <h1 className="text-white text-xl font-bold tracking-wide" style={{ textShadow: "0 0 15px rgba(0, 170, 255, 0.6)" }}>
              Settings
            </h1>
          </div>
        </div>

        {/* ── Settings Body ── */}
        <div
          className="flex-1 px-4 pt-4 pb-24 flex flex-col gap-4 relative"
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(0, 170, 255, 0.12)",
          }}
        >
          {settingsSections.map(({ title, items }) => (
            <div key={title}>
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-2 px-1"
                style={{ color: "#00aaff", textShadow: "0 0 8px rgba(0, 170, 255, 0.3)" }}
              >
                {title}
              </p>
              <div className="flex flex-col gap-2">
                {items.map(({ icon: Icon, label, description, action }: any) => (
                  <button
                    key={label}
                    onClick={() => {
                      if (action === "password") {
                        setShowPasswordModal(true);
                      } else if (label === "Sign Out") {
                        handleSignOut();
                      }
                    }}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 w-full text-left active:opacity-70 transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(0, 40, 100, 0.04) 0%, rgba(0, 80, 180, 0.06) 100%)",
                      border: "1px solid rgba(0, 170, 255, 0.2)",
                      boxShadow: "0 0 12px rgba(0, 170, 255, 0.08), inset 0 0 6px rgba(0, 170, 255, 0.03)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: "linear-gradient(135deg, rgba(0, 170, 255, 0.2) 0%, rgba(0, 100, 200, 0.3) 100%)",
                        border: "1px solid rgba(0, 170, 255, 0.3)",
                        boxShadow: "0 0 10px rgba(0, 170, 255, 0.2)",
                      }}
                    >
                      <Icon size={18} color="#00d4ff" style={{ filter: "drop-shadow(0 0 5px rgba(0, 170, 255, 0.5))" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#1A1A1A]">{label}</p>
                      <p className="text-[11px] text-[#7A8BB0] mt-0.5">{description}</p>
                    </div>
                    <ChevronRight size={16} color="#00aaff" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div
              className="rounded-2xl p-6 w-full max-w-sm relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0, 20, 40, 0.95) 0%, rgba(0, 10, 30, 0.98) 100%)",
                border: "1px solid rgba(0, 170, 255, 0.3)",
                boxShadow: "0 0 40px rgba(0, 170, 255, 0.2), inset 0 0 20px rgba(0, 170, 255, 0.05)",
              }}
            >
              {/* Modal glow */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(135deg, transparent 25%, rgba(0, 170, 255, 0.04) 75%, transparent)",
              }} />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white" style={{ textShadow: "0 0 10px rgba(0, 170, 255, 0.5)" }}>
                    Change Password
                  </h2>
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError("");
                      setPasswordSuccess("");
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X size={20} color="#00d4ff" />
                  </button>
                </div>

                {passwordSuccess && (
                  <div className="mb-4 p-3 rounded-xl relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(0, 170, 255, 0.1) 0%, rgba(0, 100, 200, 0.15) 100%)",
                      border: "1px solid rgba(0, 170, 255, 0.3)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Check size={16} color="#00d4ff" style={{ filter: "drop-shadow(0 0 5px rgba(0, 170, 255, 0.5))" }} />
                      <p className="text-sm text-[#00d4ff]">{passwordSuccess}</p>
                    </div>
                  </div>
                )}

                {passwordError && (
                  <div className="mb-4 p-3 rounded-xl relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(255, 50, 50, 0.1) 0%, rgba(200, 0, 0, 0.15) 100%)",
                      border: "1px solid rgba(255, 50, 50, 0.3)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} color="#ff6b6b" />
                      <p className="text-sm text-[#ff6b6b]">{passwordError}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl focus:outline-none text-white text-sm"
                      style={{
                        background: "rgba(0, 170, 255, 0.08)",
                        border: "1px solid rgba(0, 170, 255, 0.25)",
                        boxShadow: "inset 0 0 10px rgba(0, 170, 255, 0.05)",
                      }}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl focus:outline-none text-white text-sm"
                      style={{
                        background: "rgba(0, 170, 255, 0.08)",
                        border: "1px solid rgba(0, 170, 255, 0.25)",
                        boxShadow: "inset 0 0 10px rgba(0, 170, 255, 0.05)",
                      }}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl focus:outline-none text-white text-sm"
                      style={{
                        background: "rgba(0, 170, 255, 0.08)",
                        border: "1px solid rgba(0, 170, 255, 0.25)",
                        boxShadow: "inset 0 0 10px rgba(0, 170, 255, 0.05)",
                      }}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError("");
                      setPasswordSuccess("");
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                    className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: "rgba(0, 170, 255, 0.1)",
                      color: "#00d4ff",
                      border: "1px solid rgba(0, 170, 255, 0.3)",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword}
                    className="flex-1 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(135deg, rgba(0, 170, 255, 0.3) 0%, rgba(0, 100, 200, 0.4) 100%)",
                      color: "#fff",
                      border: "1px solid rgba(0, 170, 255, 0.4)",
                      boxShadow: "0 0 20px rgba(0, 170, 255, 0.3)",
                    }}
                  >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <CyberBottomNav />
      </div>
    </div>
  );
}
