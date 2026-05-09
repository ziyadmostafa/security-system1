// ─────────────────────────────────────────────
// Profile Page — /profile
//
// Shows the authenticated user's information and
// account settings. The sign-out button calls
// Supabase Auth and redirects to /login.
// ─────────────────────────────────────────────

"use client";

import { useState, useEffect } from "react";
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
  X,
  MapPin,
  Building2,
  Save,
} from "lucide-react";

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
  
  // Load user data on mount
  useEffect(() => {
    if (user) {
      setMallName(user.mall_name || '');
      setGateNumber(user.gate_number || '');
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
      // Check if supabase client is available
      if (!supabase) {
        console.error('[PROFILE] Supabase client not available');
        setSavingLocation(false);
        return;
      }
      
      setSavingLocation(true);
      // Sanitize gate_number to remove "Gate" prefix if present
      const sanitizedGateNumber = gateNumber.replace(/gate\s*/i, '').trim();
      
      console.log('[PROFILE] Updating user metadata:', { mall_name: mallName, gate_number: sanitizedGateNumber });
      
      // Update user metadata for backward compatibility
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
      
      // Open access model: Create or join gate without ownership restrictions
      // Check if gate already exists
      const { data: existingGate } = await supabase
        .from('gates')
        .select('id')
        .eq('gate_number', sanitizedGateNumber)
        .single();
      
      if (existingGate) {
        // Gate exists, allow user to join/access it
        console.log('Gate exists, user can access it:', sanitizedGateNumber);
        await refreshUser();
        alert('Location saved successfully. You can now access this gate.');
      } else {
        // Gate doesn't exist, create it
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

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
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

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to upload image');
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) {
        console.error('Update error:', updateError);
        alert('Failed to update profile');
      } else {
        setProfileImageUrl(publicUrl);
        setPreviewUrl(null);
      }

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('An error occurred while uploading the image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      if (!supabase) {
        console.error('[PROFILE] Supabase client not available');
        return;
      }
      
      setUploading(true);

      // Remove from user metadata
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: null }
      });

      if (error) {
        console.error('Error removing image:', error);
        alert('Failed to remove profile image');
      } else {
        setProfileImageUrl(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Error removing image:', error);
      alert('An error occurred while removing the image');
    } finally {
      setUploading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen" style={{ background: "#F3F3F6" }}>
        <div className="flex flex-col w-full min-h-screen bg-white shadow-2xl relative sm:max-w-md sm:mx-auto">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#7A8BB0]">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F3F3F6" }}>
      <div className="flex flex-col w-full min-h-screen bg-white shadow-2xl relative sm:max-w-md sm:mx-auto">

        {/* ── Blue top bar ── */}
        <header
          className="flex items-center justify-center px-4 py-3"
          style={{ background: "#1F49D8" }}
        >
          <User size={28} color="#fff" />
        </header>

        {/* ── Page title ── */}
        <div
          className="px-4 pt-2 pb-5 text-center"
          style={{ background: "#1F49D8" }}
        >
          <h1 className="text-white text-[26px] font-extrabold tracking-wide">
            Profile
          </h1>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 bg-white px-4 pt-5 pb-28 flex flex-col gap-4">

          {/* Avatar & name card */}
          <div
            className="flex items-center gap-4 rounded-2xl px-4 py-4"
            style={{ background: "#ECECF1" }}
          >
            <div className="relative">
              {previewUrl || profileImageUrl ? (
                <>
                  <img
                    src={previewUrl || profileImageUrl || ''}
                    alt="Profile"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <button
                    onClick={handleRemoveImage}
                    disabled={uploading}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ zIndex: 10 }}
                  >
                    <X size={12} />
                  </button>
                </>
              ) : (
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0 relative"
                  style={{ background: "#1F49D8" }}
                >
                  {user.full_name?.charAt(0) || 'U'}
                  <label htmlFor="avatar-upload" className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/20 rounded-xl opacity-0 hover:opacity-100 transition-opacity">
                    <Camera size={16} color="white" />
                  </label>
                </div>
              )}
              {!previewUrl && !profileImageUrl && (
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              )}
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-[#1A1A1A]">{user.full_name || 'User'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Shield size={12} color="#1F49D8" />
                <span className="text-[11px] font-medium" style={{ color: "#7A8BB0" }}>{user.role || 'User'}</span>
              </div>
              <p className="text-[11px] mt-0.5" style={{ color: "#7A8BB0" }}>Member since January 2026</p>
              {!profileImageUrl && !previewUrl && (
                <button
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                  disabled={uploading}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Add photo'}
                </button>
              )}
            </div>
          </div>

          {/* Contact info */}
          <div
            className="flex flex-col gap-3 rounded-2xl p-4"
            style={{ background: "#ECECF1" }}
          >
            <div className="flex items-center gap-3">
              <Mail size={16} color="#7A8BB0" />
              <span className="text-[13px] text-[#1A1A1A]">{user.email || 'No email'}</span>
            </div>
            <div className="h-px" style={{ background: "#C8D0E7" }} />
            <div className="flex items-center gap-3">
              <Phone size={16} color="#7A8BB0" />
              <span className="text-[13px] text-[#1A1A1A]">{user.phone || 'No phone'}</span>
            </div>
          </div>

          {/* Location Settings */}
          <div
            className="flex flex-col gap-3 rounded-2xl p-4"
            style={{ background: "#ECECF1" }}
          >
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} color="#1F49D8" />
              <span className="text-[13px] font-bold text-[#1A1A1A]">Location Settings</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium text-[#7A8BB0]">Mall Name</label>
              <div className="flex items-center gap-2">
                <Building2 size={14} color="#7A8BB0" />
                <input
                  type="text"
                  value={mallName}
                  onChange={(e) => setMallName(e.target.value)}
                  placeholder="Enter mall name"
                  className="flex-1 text-[13px] bg-transparent outline-none text-[#1A1A1A] placeholder:text-[#7A8BB0]/50"
                />
              </div>
            </div>
            
            <div className="h-px" style={{ background: "#C8D0E7" }} />
            
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-medium text-[#7A8BB0]">Gate Number</label>
              <div className="flex items-center gap-2">
                <MapPin size={14} color="#7A8BB0" />
                <input
                  type="text"
                  value={gateNumber}
                  onChange={(e) => setGateNumber(e.target.value)}
                  placeholder="Enter gate number"
                  className="flex-1 text-[13px] bg-transparent outline-none text-[#1A1A1A] placeholder:text-[#7A8BB0]/50"
                />
              </div>
            </div>
            
            <button
              onClick={handleSaveLocation}
              disabled={savingLocation}
              className="flex items-center justify-center gap-2 mt-2 rounded-xl py-2.5 text-[12px] font-semibold active:opacity-70 transition-opacity disabled:opacity-50"
              style={{ background: "#1F49D8", color: "#fff" }}
            >
              <Save size={14} />
              {savingLocation ? 'Saving...' : 'Save Location'}
            </button>
          </div>

          {/* Sign out button */}
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold active:opacity-70 transition-opacity"
            style={{ background: "#FDEEF2", color: "#E8334A" }}
          >
            <LogOut size={16} />
            Sign Out
          </button>

        </div>

      </div>
    </div>
  );
}
