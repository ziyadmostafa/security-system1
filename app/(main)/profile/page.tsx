// ─────────────────────────────────────────────
// Profile Page — /profile
//
// Shows the authenticated user's information and
// account settings. The sign-out button calls
// Supabase Auth and redirects to /login.
// ─────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  Shield,
  LogOut,
  Camera,
  MapPin,
  Save,
} from "lucide-react";
import CyberBackground from "@/components/CyberBackground";
import CyberBottomNav from "@/components/CyberBottomNav";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // Location fields
  const [mallName, setMallName] = useState('');
  const [gateNumber, setGateNumber] = useState('');
  const [savingLocation, setSavingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Authentication guard - require real user
  if (!user && !loading) {
    console.log('[PROFILE] No user found, redirecting to login');
    router.replace("/login");
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <CyberBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-base font-medium" style={{ textShadow: "0 0 15px rgba(0, 170, 255, 0.6)" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Add debug logs to track session flow
  console.log('[PROFILE] User authenticated:', !!user);
  console.log('[PROFILE] Loading state:', loading);
  console.log('[PROFILE] Session check passed - rendering profile');

  // Load user data on mount
  useEffect(() => {
    if (user) {
      const authUser = user as any;
      setMallName(authUser?.user_metadata?.mall_name || authUser?.mall_name || '');
      setGateNumber(authUser?.user_metadata?.gate_number || authUser?.gate_number || '');
    }
  }, [user]);

  // Load profile image on mount
  useEffect(() => {
    if (user && (user as any).user_metadata?.avatar_url) {
      setProfileImageUrl((user as any).user_metadata.avatar_url);
    }
  }, [user]);

  // Save location data
  const handleSaveLocation = async () => {
    try {
      if (!supabase) {
        console.error("Supabase client failed to initialize");
        return;
      }

      setSavingLocation(true);
      const sanitizedGateNumber = gateNumber.replace(/gate\s*/i, '').trim();

      console.log('[PROFILE] Updating user metadata:', { mall_name: mallName, gate_number: sanitizedGateNumber });

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          mall_name: mallName,
          gate_number: sanitizedGateNumber
        }
      });

      console.log("AUTH RESPONSE:", updateError ? null : 'success');
      console.log("AUTH ERROR:", updateError);

      if (updateError) {
        console.error("Supabase Auth Error:", updateError);
        setError(updateError?.message || JSON.stringify(updateError));
      }

      const { data: existingGate } = await supabase
        .from('gates')
        .select('id')
        .eq('gate_number', sanitizedGateNumber)
        .single();

      if (existingGate) {
        console.log('Gate exists, user can access it:', sanitizedGateNumber);
        await refreshUser();
        alert('Location saved successfully. You can now access this gate.');
      } else {
        const { error: insertError } = await supabase
          .from('gates')
          .insert([{
            gate_number: sanitizedGateNumber,
            mall_name: mallName,
            status: 'active'
          }] as any);

        if (insertError) {
          console.error('Error creating gate:', insertError);
          alert('Failed to create gate');
        } else {
          await refreshUser();
          alert('Gate created successfully. You can now access it.');
        }
      }
    } catch (error) {
      console.error('Error saving location:', error);
      alert('An error occurred while saving');
    } finally {
      setSavingLocation(false);
    }
  };

  async function handleSignOut() {
    if (!supabase) {
      console.error('[PROFILE] Supabase client not available');
      return;
    }
    await supabase.auth.signOut();
    router.push("/login");
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file || !user || !supabase) return;

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Avatar upload failed:', uploadError);
        alert('Failed to upload image');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfileImageUrl(publicUrl);

      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      await refreshUser();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading');
    } finally {
      setUploading(false);
    }
  };

  const authUser = user as any;

  const name =
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.email?.split('@')[0] ||
    'User';

  const email = authUser?.email || '';

  const role =
    authUser?.user_metadata?.role ||
    authUser?.app_metadata?.role ||
    'User';

  const phone = authUser?.phone || '';
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

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
            <User size={22} color="#00d4ff" style={{ filter: "drop-shadow(0 0 8px rgba(0, 170, 255, 0.6))" }} />
            <h1 className="text-white text-xl font-bold tracking-wide" style={{ textShadow: "0 0 15px rgba(0, 170, 255, 0.6)" }}>
              Profile
            </h1>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div
          className="flex-1 px-4 pt-4 pb-24 flex flex-col gap-4 relative"
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(0, 170, 255, 0.12)",
          }}
        >

          {/* Avatar + Name */}
          <div className="flex flex-col items-center gap-2 pb-3 relative">
            <div className="relative">
              {profileImageUrl || previewUrl ? (
                <div className="w-[90px] h-[90px] rounded-full overflow-hidden"
                  style={{
                    border: "2px solid rgba(0, 170, 255, 0.4)",
                    boxShadow: "0 0 25px rgba(0, 170, 255, 0.3)",
                  }}
                >
                  <Image
                    src={previewUrl || profileImageUrl || ''}
                    alt="Avatar"
                    width={90}
                    height={90}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div
                  className="w-[90px] h-[90px] rounded-full flex items-center justify-center text-white text-3xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 40, 100, 0.9) 0%, rgba(0, 20, 60, 0.95) 100%)",
                    border: "2px solid rgba(0, 170, 255, 0.4)",
                    boxShadow: "0 0 25px rgba(0, 170, 255, 0.3)",
                    textShadow: "0 0 15px rgba(0, 170, 255, 0.5)",
                  }}
                >
                  {initials}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
                  <div className="w-6 h-6 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <label
                className="absolute bottom-0 right-0 rounded-full p-1.5 cursor-pointer transition-all hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, rgba(0, 170, 255, 0.3) 0%, rgba(0, 100, 200, 0.4) 100%)",
                  border: "1px solid rgba(0, 170, 255, 0.4)",
                  boxShadow: "0 0 15px rgba(0, 170, 255, 0.3)",
                }}
              >
                <Camera size={16} color="#00d4ff" style={{ filter: "drop-shadow(0 0 5px rgba(0, 170, 255, 0.5))" }} />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <p className="text-[18px] font-extrabold text-[#1A1A1A]" style={{ textShadow: "0 0 10px rgba(0, 170, 255, 0.15)" }}>
              {name}
            </p>
            <p className="text-[13px] font-medium text-[#7A8BB0]">{email}</p>
          </div>

          {/* Contact Info Card */}
          <div
            className="flex flex-col gap-2.5 rounded-2xl px-4 py-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0, 40, 100, 0.04) 0%, rgba(0, 80, 180, 0.06) 100%)",
              border: "1px solid rgba(0, 170, 255, 0.2)",
              boxShadow: "0 0 15px rgba(0, 170, 255, 0.08), inset 0 0 8px rgba(0, 170, 255, 0.03)",
            }}
          >
            <div className="absolute inset-0 rounded-2xl" style={{
              background: "linear-gradient(135deg, transparent 25%, rgba(0, 170, 255, 0.03) 75%, transparent)",
              animation: "cyber-pulse 3s ease-in-out infinite",
            }} />
            <div className="relative z-10 flex flex-col gap-2.5">
              <InfoRow icon={Mail} label="Email" value={email} />
              <InfoRow icon={Phone} label="Phone" value={phone || "Not set"} />
              <InfoRow icon={Shield} label="Role" value={role} />
            </div>
          </div>

          {/* Location Settings */}
          <div
            className="rounded-2xl px-4 py-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0, 40, 100, 0.04) 0%, rgba(0, 80, 180, 0.06) 100%)",
              border: "1px solid rgba(0, 170, 255, 0.2)",
              boxShadow: "0 0 15px rgba(0, 170, 255, 0.08), inset 0 0 8px rgba(0, 170, 255, 0.03)",
            }}
          >
            <div className="absolute inset-0 rounded-2xl" style={{
              background: "linear-gradient(135deg, transparent 25%, rgba(0, 170, 255, 0.03) 75%, transparent)",
              animation: "cyber-pulse 3s ease-in-out infinite 1.5s",
            }} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 170, 255, 0.2) 0%, rgba(0, 100, 200, 0.3) 100%)",
                    border: "1px solid rgba(0, 170, 255, 0.3)",
                    boxShadow: "0 0 10px rgba(0, 170, 255, 0.2)",
                  }}
                >
                  <MapPin size={16} color="#00d4ff" style={{ filter: "drop-shadow(0 0 5px rgba(0, 170, 255, 0.5))" }} />
                </div>
                <p className="text-[13px] font-bold text-[#1A1A1A]">Location Settings</p>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#7A8BB0] mb-1">Mall Name</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{
                    background: "rgba(0, 170, 255, 0.06)",
                    border: "1px solid rgba(0, 170, 255, 0.2)",
                    boxShadow: "inset 0 0 8px rgba(0, 170, 255, 0.04)",
                  }}>
                    <MapPin size={14} color="#00aaff" />
                    <input
                      type="text"
                      value={mallName}
                      onChange={(e) => setMallName(e.target.value)}
                      placeholder="Enter mall name"
                      className="flex-1 text-[13px] bg-transparent outline-none text-[#1A1A1A] placeholder:text-[#7A8BB0]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#7A8BB0] mb-1">Gate Number</label>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{
                    background: "rgba(0, 170, 255, 0.06)",
                    border: "1px solid rgba(0, 170, 255, 0.2)",
                    boxShadow: "inset 0 0 8px rgba(0, 170, 255, 0.04)",
                  }}>
                    <MapPin size={14} color="#00aaff" />
                    <input
                      type="text"
                      value={gateNumber}
                      onChange={(e) => setGateNumber(e.target.value)}
                      placeholder="Enter gate number"
                      className="flex-1 text-[13px] bg-transparent outline-none text-[#1A1A1A] placeholder:text-[#7A8BB0]/50"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-[11px] font-medium text-[#ff6b6b]">{error}</p>
                )}

                <button
                  onClick={handleSaveLocation}
                  disabled={savingLocation}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 170, 255, 0.25) 0%, rgba(0, 100, 200, 0.35) 100%)",
                    color: "#fff",
                    border: "1px solid rgba(0, 170, 255, 0.4)",
                    boxShadow: "0 0 20px rgba(0, 170, 255, 0.3)",
                    textShadow: "0 0 10px rgba(0, 170, 255, 0.5)",
                  }}
                >
                  <Save size={18} color="#00d4ff" style={{ filter: "drop-shadow(0 0 5px rgba(0, 170, 255, 0.5))" }} />
                  {savingLocation ? "Saving..." : "Save Location"}
                </button>
              </div>
            </div>
          </div>

          {/* Sign out button */}
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold active:opacity-70 transition-all"
            style={{
              background: "linear-gradient(135deg, rgba(255, 50, 50, 0.06) 0%, rgba(200, 0, 0, 0.1) 100%)",
              border: "1px solid rgba(255, 50, 50, 0.2)",
              color: "#ff6b6b",
              boxShadow: "0 0 12px rgba(255, 50, 50, 0.08)",
            }}
          >
            <LogOut size={16} color="#ff6b6b" style={{ filter: "drop-shadow(0 0 5px rgba(255, 50, 50, 0.3))" }} />
            Sign Out
          </button>

        </div>

        <CyberBottomNav />
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: "linear-gradient(135deg, rgba(0, 170, 255, 0.2) 0%, rgba(0, 100, 200, 0.3) 100%)",
          border: "1px solid rgba(0, 170, 255, 0.3)",
          boxShadow: "0 0 10px rgba(0, 170, 255, 0.2)",
        }}
      >
        <Icon size={16} color="#00d4ff" style={{ filter: "drop-shadow(0 0 5px rgba(0, 170, 255, 0.5))" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-[#7A8BB0]">{label}</p>
        <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">{value}</p>
      </div>
    </div>
  );
}
