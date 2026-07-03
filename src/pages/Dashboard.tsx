import React, { useEffect, useState } from "react";
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Coins, 
  Compass, 
  ArrowRight, 
  Trash2, 
  ChevronRight, 
  Hotel, 
  Utensils, 
  CloudSun 
} from "lucide-react";
import { motion } from "motion/react";
import { TripPlan, UserProfile } from "../types";
import { formatINR } from "../utils/format";

interface DashboardProps {
  user: UserProfile;
  setCurrentPage: (page: string) => void;
  setSelectedTripForPreview?: (trip: TripPlan | null) => void;
}

export default function Dashboard({ user, setCurrentPage, setSelectedTripForPreview }: DashboardProps) {
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, [user.uid]);

  const fetchTrips = async () => {
    try {
      const response = await fetch(`/api/trips?userId=${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (e) {
      console.error("Failed to fetch trips", e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this trip plan?")) return;

    try {
      const response = await fetch(`/api/trips/${id}?userId=${user.uid}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTrips(trips.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete trip", err);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest font-mono">
              Intelligence Portal
            </span>
            <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight mt-1">
              Welcome back, <span className="font-semibold text-indigo-300">{user.fullName}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Your next curated digital travel adventure awaits. What shall we design?
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage("planner")}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              New AI Journey
            </button>
          </div>
        </div>

        {/* Info Cards / Bento-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Credits Box */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold font-mono">
                  Neural Sync Status
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-2xl font-mono text-white font-bold mt-4">1,240</p>
              <p className="text-xs text-slate-400 mt-1">Active AI planning bandwidth credits</p>
            </div>
            <button className="text-left text-xs text-indigo-400 font-semibold hover:text-indigo-300 underline decoration-indigo-500/30 mt-6 cursor-pointer">
              Top up allocation
            </button>
          </div>

          {/* Quick Stats */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-widest font-bold font-mono">
                Saved Itineraries
              </span>
              <p className="text-3xl font-bold text-white mt-4">{trips.length}</p>
              <p className="text-xs text-slate-400 mt-1">Ready for departure or adjustments</p>
            </div>
            <button 
              onClick={() => setCurrentPage("saved")}
              className="text-left text-xs text-cyan-400 font-semibold hover:text-cyan-300 flex items-center gap-1 mt-6"
            >
              View saved library <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Target destination */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/20 to-purple-950/10 border border-slate-800/80 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <span className="text-xs text-indigo-400 uppercase tracking-widest font-bold font-mono">
                Current Vibe Match
              </span>
              <p className="text-lg font-semibold text-white mt-4">Cultural & Historic Focus</p>
              <p className="text-xs text-slate-400 mt-1">
                Preference updated from user profile metrics.
              </p>
            </div>
            <button 
              onClick={() => setCurrentPage("profile")}
              className="text-left text-xs text-indigo-300 font-semibold hover:text-indigo-200 underline decoration-indigo-400/20 mt-6"
            >
              Change user preferences
            </button>
          </div>
        </div>

        {/* Quick Tools Header */}
        <div>
          <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            Autonomous Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentPage("hotels")}
              className="p-5 rounded-xl border border-slate-800/80 bg-white/[0.02] hover:bg-white/[0.04] text-left transition-all hover:border-slate-700/60 group"
            >
              <Hotel className="w-8 h-8 text-indigo-400 mb-3" />
              <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">Hotel Discovery</h3>
              <p className="text-xs text-slate-400 mt-1">Search realistic, high-comfort properties in any target destination</p>
            </button>
            <button
              onClick={() => setCurrentPage("restaurants")}
              className="p-5 rounded-xl border border-slate-800/80 bg-white/[0.02] hover:bg-white/[0.04] text-left transition-all hover:border-slate-700/60 group"
            >
              <Utensils className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">Culinary Hotspots</h3>
              <p className="text-xs text-slate-400 mt-1">Uncover authentic dishes, top ratings, and street-food recommendations</p>
            </button>
            <button
              onClick={() => setCurrentPage("weather")}
              className="p-5 rounded-xl border border-slate-800/80 bg-white/[0.02] hover:bg-white/[0.04] text-left transition-all hover:border-slate-700/60 group"
            >
              <CloudSun className="w-8 h-8 text-pink-400 mb-3" />
              <h3 className="font-semibold text-white group-hover:text-pink-300 transition-colors">Aether Weather</h3>
              <p className="text-xs text-slate-400 mt-1">Get precise 5-day predictive trends and atmospheric summaries</p>
            </button>
          </div>
        </div>

        {/* Saved Trips Preview Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Saved Journeys</h2>
            {trips.length > 0 && (
              <button 
                onClick={() => setCurrentPage("saved")}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-slate-500 animate-pulse font-mono text-sm">
              Retrieving saved itineraries from server storage...
            </div>
          ) : trips.length === 0 ? (
            <div className="p-10 rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 text-center max-w-xl mx-auto space-y-4">
              <Compass className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-semibold text-white">No plans crafted yet</h3>
              <p className="text-sm text-slate-400">
                You haven't configured any itineraries yet. Launch our AI travel architect to craft your personalized holiday.
              </p>
              <button
                onClick={() => setCurrentPage("planner")}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all"
              >
                Launch Planner
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trips.slice(0, 4).map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => {
                    if (setSelectedTripForPreview) {
                      setSelectedTripForPreview(trip);
                      setCurrentPage("saved");
                    } else {
                      setCurrentPage("saved");
                    }
                  }}
                  className="p-6 rounded-2xl border border-slate-800/80 bg-white/[0.02] hover:border-slate-700/60 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent blur-xl" />
                  
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                          {trip.request.travelType} • {trip.request.days} Days
                        </span>
                        <h3 className="text-xl font-semibold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                          {trip.request.destination}
                        </h3>
                      </div>
                      <button
                        onClick={(e) => deleteTrip(trip.id, e)}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2 mt-2 leading-relaxed italic">
                      "{trip.destinationDetails}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-900/80 pt-4 mt-6">
                    <div className="flex gap-4">
                      <div className="text-left">
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Budget</p>
                        <p className="text-sm font-semibold text-emerald-400 font-mono">{formatINR(trip.request.budget)}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">People</p>
                        <p className="text-sm font-semibold text-slate-300 font-mono">{trip.request.people} Pax</p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                      Explore Details <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
