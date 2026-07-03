import React, { useState } from "react";
import { Search, Utensils, Star, MapPin, Loader2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Restaurant } from "../types";

export default function Restaurants() {
  const [destination, setDestination] = useState("");
  const [cuisine, setCuisine] = useState("Local Specialties");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;

    setIsLoading(true);
    setError(null);
    setRestaurants([]);

    try {
      const response = await fetch(
        `/api/restaurants/search?destination=${encodeURIComponent(destination)}&cuisine=${encodeURIComponent(cuisine)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch culinary hotspot recommendations.");
      }

      setRestaurants(data.restaurants || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <div>
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-widest font-mono">
            Culinary Analytics
          </span>
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight mt-1">
            Local Cuisines & Hotspots
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse authentic local eateries, luxury bistros, and iconic native flavors customized to your choice.
          </p>
        </div>

        {/* Search Panel */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-slate-800/80 backdrop-blur-xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6 space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                Destination City
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <MapPin className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto, Japan or Rome, Italy"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-white/5 border border-slate-800 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                Cuisine Specialty Preference
              </label>
              <input
                type="text"
                placeholder="e.g. Fine Dining, Sushi, Street Food"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full bg-white/5 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="md:col-span-2 w-full py-3.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/15 border border-cyan-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-300 text-sm animate-fade-in max-w-xl mx-auto">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500 animate-pulse font-mono text-sm">
            Tuning sensory AI networks for local cuisines in {destination}...
          </div>
        ) : restaurants.length === 0 ? (
          <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800/80 rounded-2xl max-w-xl mx-auto p-8 space-y-3">
            <Utensils className="w-10 h-10 text-slate-700 mx-auto" />
            <h3 className="text-white font-medium">No Culinary Results</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your target destination city above to fetch real-world epicurean highlights and matching restaurants instantly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {restaurants.map((rest, rIdx) => (
              <div 
                key={rIdx}
                className="p-6 rounded-2xl bg-white/[0.01] border border-slate-800/80 flex flex-col justify-between group hover:border-slate-700/60 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-800/30 px-2 py-0.5 rounded">
                        {rest.cuisine}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-2 group-hover:text-cyan-400 transition-colors">
                        {rest.name}
                      </h3>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1 rounded-lg">
                      {rest.priceLevel}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {rest.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900/80 pt-4 mt-6">
                  <p className="text-slate-500 text-xs font-mono flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {rest.address}
                  </p>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-400">Rating</p>
                    <p className="text-xs font-bold text-amber-400 font-mono">★ {rest.rating} / 5</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
