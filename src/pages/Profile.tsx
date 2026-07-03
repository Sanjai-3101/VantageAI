import React, { useState } from "react";
import { User, MapPin, Sliders, CheckCircle2, Loader2, Mail, Compass } from "lucide-react";
import { motion } from "motion/react";
import { UserProfile } from "../types";

interface ProfileProps {
  user: UserProfile;
  onUpdateSuccess: (updatedUser: UserProfile) => void;
}

export default function Profile({ user, onUpdateSuccess }: ProfileProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [homeCity, setHomeCity] = useState(user.homeCity || "");
  const [preferences, setPreferences] = useState(user.preferences || "");
  
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          fullName,
          homeCity,
          preferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile settings.");
      }

      onUpdateSuccess(data.user);
      setStatusMessage("Profile settings synchronized successfully.");
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background lights */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        <div>
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest font-mono">
            User Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight mt-1">
            Explorer Profile Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Customize your identity and neural training metrics to automatically influence future travel generation.
          </p>
        </div>

        {statusMessage && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 text-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-slate-800/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-900">
              <img 
                src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.fullName}`}
                alt="Avatar" 
                className="w-16 h-16 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-inner"
              />
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-white">{user.fullName}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                  Account Email (Read-Only)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-600">
                    <Mail className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-slate-950/40 border border-slate-900 rounded-xl pl-10 pr-4 py-3 text-slate-500 outline-none cursor-not-allowed text-sm font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                  Home City
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <MapPin className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, USA"
                    value={homeCity}
                    onChange={(e) => setHomeCity(e.target.value)}
                    className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                  Curation Preference Vibe
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    <Sliders className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Michelin restaurants, Serene gardens"
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/15 border border-indigo-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Synchronizing Database...
                </>
              ) : (
                <>
                  Save Changes
                  <Sliders className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
