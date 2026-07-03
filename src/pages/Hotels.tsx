import React, { useState } from "react";
import { Search, Hotel as HotelIcon, Star, MapPin, Loader2, Compass, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Hotel } from "../types";
import { formatINR } from "../utils/format";

export default function Hotels() {
  const [destination, setDestination] = useState("");
  const [budgetTier, setBudgetTier] = useState("Moderate");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;

    setIsLoading(true);
    setError(null);
    setHotels([]);

    try {
      const response = await fetch(
        `/api/hotels/search?destination=${encodeURIComponent(destination)}&budgetTier=${encodeURIComponent(budgetTier)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch hotel options.");
      }

      setHotels(data.hotels || []);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background lights */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <div>
          <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest font-mono">
            Hotel Discovery Engine
          </span>
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight mt-1">
            Search Premium Properties
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Discover real-world comfortable accommodation tailored perfectly to selective budget brackets.
          </p>
        </div>

        {/* Search bar */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-slate-800/80 backdrop-blur-xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6 space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                Destination City or Country
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <MapPin className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto, Japan or Paris, France"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                Price / Style Tier
              </label>
              <select
                value={budgetTier}
                onChange={(e) => setBudgetTier(e.target.value)}
                className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-white outline-none transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="Budget" className="bg-slate-950 text-white">Backpacker Budget</option>
                <option value="Moderate" className="bg-slate-950 text-white">Moderate Comfort</option>
                <option value="Luxury" className="bg-slate-950 text-white">High Luxury</option>
                <option value="Ultra Luxury" className="bg-slate-950 text-white">Ultra Elite Sovereign</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="md:col-span-2 w-full py-3.5 px-4 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/15 border border-indigo-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Discover
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
            Asking AI travel databases for suitable property tracks in {destination}...
          </div>
        ) : hotels.length === 0 ? (
          <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800/80 rounded-2xl max-w-xl mx-auto p-8 space-y-3">
            <HotelIcon className="w-10 h-10 text-slate-700 mx-auto" />
            <h3 className="text-white font-medium">No active search</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your target destination city to list immersive, boutique hotel recommendations corresponding to your style.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {hotels.map((hotel, hIdx) => (
              <div 
                key={hIdx}
                className="p-6 rounded-2xl bg-white/[0.01] border border-slate-800/80 flex flex-col justify-between group hover:border-slate-700/60 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-900/30 text-indigo-300 text-xs font-bold font-mono">
                      ★ {hotel.rating}
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {hotel.description}
                  </p>
                  <p className="text-slate-500 text-xs font-mono flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {hotel.address}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900/80 pt-4 mt-6">
                  <div className="flex flex-wrap gap-1">
                    {hotel.tags?.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="text-[9px] font-mono font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Est. Price</p>
                    <p className="text-sm font-bold text-emerald-400 font-mono">{formatINR(hotel.pricePerNight)} <span className="text-[10px] text-slate-500 font-normal">/ night</span></p>
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
