// ─────────────────────────────────────────────
// Settings Page — /settings
//
// Placeholder settings screen matching the app theme.
// Blue header, white body, grouped setting rows.
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
  AlertTriangle
} from "lucide-react";

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
      console.error('[SETTINGS] Supabase client not available');
      return;
    }
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
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
        console.error('[SETTINGS] Supabase client not available');
        setPasswordError('Authentication system not available');
        setIsChangingPassword(false);
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
    <div className="min-h-screen" style={{ background: "#F3F3F6" }}>
      <div className="flex flex-col w-full min-h-screen bg-white shadow-2xl relative sm:max-w-md sm:mx-auto">

        {/* ── Blue top bar ── */}
        <header
          className="flex items-center justify-center px-4 py-3"
          style={{ background: "#1F49D8" }}
        >
          <Image
            src="/logo.png"
            alt="Security System Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </header>

        {/* ── Page title ── */}
        <div
          className="px-4 pt-2 pb-5 text-center"
          style={{ background: "#1F49D8" }}
        >
          <h1 className="text-white text-[26px] font-extrabold tracking-wide">
            Settings
          </h1>
        </div>

        {/* ── Settings body ── */}
        <div className="flex-1 bg-white px-4 pt-5 pb-28 flex flex-col gap-5">
          {settingsSections.map(({ title, items }) => (
            <div key={title}>
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-2 px-1"
                style={{ color: "#7A8BB0" }}
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
                    className="flex items-center gap-3 rounded-xl px-4 py-3 w-full text-left active:opacity-70 transition-opacity"
                    style={{ background: "#ECECF1" }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "#1F49D8" }}
                    >
                      <Icon size={18} color="#fff" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#1A1A1A]">{label}</p>
                      <p className="text-[11px] text-[#7A8BB0] mt-0.5">{description}</p>
                    </div>
                    <ChevronRight size={16} color="#7A8BB0" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#1A1A1A]">Change Password</h2>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError("");
                    setPasswordSuccess("");
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} color="#7A8BB0" />
                </button>
              </div>

              {passwordSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <Check size={16} color="#22C55E" />
                    <p className="text-sm text-green-700">{passwordSuccess}</p>
                  </div>
                </div>
              )}

              {passwordError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} color="#E8334A" />
                    <p className="text-sm text-red-700">{passwordError}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-[#C8D0E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-[#C8D0E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-[#C8D0E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              {/* Modern Action Buttons */}
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
                    background: "#F3F4F6", 
                    color: "#6B7280",
                    border: "2px solid #E5E7EB"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#22C55E" }}
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>
            </div>
          </div>
        )}

        </div>
    </div>
  );
}
