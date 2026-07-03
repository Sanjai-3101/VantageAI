import React, { useState } from "react";
import { Search, CloudSun, Wind, Droplets, MapPin, Loader2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { WeatherInfo } from "../types";

export default function Weather() {
  const [destination, setDestination] = useState("");
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;

    setIsLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await fetch(`/api/weather/search?destination=${encodeURIComponent(destination)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch weather forecast suggestions.");
      }

      setWeather(data.weather || null);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <div>
          <span className="text-xs uppercase font-bold text-pink-400 tracking-widest font-mono">
            Atmospheric Sensors
          </span>
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight mt-1">
            Predictive Weather Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Analyze climatic temperature shifts, air humidity trends, and day-wise weather conditions for comfortable scheduling.
          </p>
        </div>

        {/* Search Panel */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-slate-800/80 backdrop-blur-xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-10 space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                Target Location / City
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <MapPin className="w-4.5 h-4.5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kyoto, Japan or Cairo, Egypt"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-white/5 border border-slate-800 focus:border-pink-500/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="md:col-span-2 w-full py-3.5 px-4 rounded-xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-lg shadow-pink-500/15 border border-pink-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Analyze
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
            Retrieving current climatic tracking maps for {destination}...
          </div>
        ) : !weather ? (
          <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800/80 rounded-2xl max-w-xl mx-auto p-8 space-y-3">
            <CloudSun className="w-10 h-10 text-slate-700 mx-auto" />
            <h3 className="text-white font-medium">No weather details analyzed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter any city or holiday location to fetch predictive climate data, winds, humidity levels, and daily forecasts.
            </p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Main Climate Deck */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-950/10 via-slate-900/40 to-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shadow-lg shadow-pink-500/5">
                  <CloudSun className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest bg-pink-950/40 border border-pink-900/40 px-2 py-0.5 rounded">
                    Meteorological Core
                  </span>
                  <h3 className="text-4xl font-bold text-white font-mono mt-1.5">{weather.temperature}°C</h3>
                  <p className="text-slate-300 text-sm mt-0.5 font-medium">{weather.condition} in {destination}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 shrink-0 w-full md:w-auto">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Humidity</p>
                    <p className="text-sm font-bold text-white mt-0.5 font-mono">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 flex items-center gap-3">
                  <Wind className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Wind Speed</p>
                    <p className="text-sm font-bold text-white mt-0.5 font-mono">{weather.windSpeed} km/h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Forecast Panel list */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">5-Day Meteorological Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {weather.forecast.map((fc, fcIdx) => (
                  <div 
                    key={fcIdx}
                    className="p-4 rounded-2xl bg-white/[0.01] border border-slate-800/80 text-center space-y-2 hover:border-slate-700/60 transition-all shadow-md"
                  >
                    <p className="text-xs text-pink-400 font-mono font-bold">{fc.day}</p>
                    <p className="text-xl font-bold font-mono text-white">{fc.temp}°C</p>
                    <p className="text-xs text-slate-400">{fc.condition}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
