import React, { useState } from "react";
import { 
  Sparkles, 
  MapPin, 
  IndianRupee, 
  Users, 
  Plane, 
  Loader2, 
  AlertCircle, 
  Check, 
  ChevronRight, 
  CloudSun, 
  Calendar, 
  Hotel, 
  Utensils, 
  TrendingUp, 
  ArrowLeft,
  BookmarkPlus
} from "lucide-react";
import { motion } from "motion/react";
import { TripPlan, UserProfile } from "../types";
import { formatINR } from "../utils/format";

interface PlannerProps {
  user: UserProfile;
  setCurrentPage: (page: string) => void;
  onTripSaved?: () => void;
}

export default function Planner({ user, setCurrentPage, onTripSaved }: PlannerProps) {
  // Input states
  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("150000");
  const [days, setDays] = useState(5);
  const [people, setPeople] = useState(2);
  const [travelType, setTravelType] = useState<'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business'>("Couple");

  // App UI states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedTrip, setGeneratedTrip] = useState<TripPlan | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Tab states for results
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'restaurants' | 'weather' | 'budget'>('itinerary');

  const loadingMessages = [
    "Spinning up neural curation engines...",
    "Validating geographical travel grids...",
    "Querying current weather satellite indices...",
    "Curating high-comfort hotel catalogs...",
    "Assembling customized culinary hotspots...",
    "Optimizing day-by-day itineraries and budgets..."
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !destination || !budget) {
      setError("Please fill out all the planning coordinates.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedTrip(null);
    setLoadingStep(0);

    // Simulate stepping through loader milestones for premium user feeling
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingMessages.length - 1) return prev + 1;
        return prev;
      });
    }, 2000);

    try {
      const response = await fetch("/api/trips/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          destination,
          budget: Number(budget),
          days,
          people,
          travelType
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Generation engine failed to yield a responsive plan.");
      }

      setGeneratedTrip({
        ...data,
        request: { from, destination, budget: Number(budget), days, people, travelType }
      });
      setActiveTab('itinerary');
    } catch (err: any) {
      setError(err.message || "An unexpected neural model timeout occurred.");
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!generatedTrip) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/trips/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          trip: generatedTrip
        }),
      });

      if (!response.ok) throw new Error("Could not save to file-based databases.");
      
      setSaveSuccess(true);
      if (onTripSaved) onTripSaved();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save plan. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial atmosphere */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {!generatedTrip && !isLoading ? (
          /* Input view styled with Elegant Dark theme */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest font-mono">
                  Autonomous Core
                </span>
                <h1 className="text-4xl font-light text-white tracking-tight mt-1 mb-2">
                  Where to next?
                </h1>
                <p className="text-slate-400 text-base leading-relaxed">
                  Enter your details and let our neural engine build your dream journey.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-300 text-sm animate-fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                    Departing From
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                      <Plane className="w-4.5 h-4.5 rotate-45" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. San Francisco, USA"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                    Destination
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                      <MapPin className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kyoto, Japan"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                    Total Budget (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                      <IndianRupee className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 150000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                    Travel Days
                  </label>
                  <div className="flex items-center bg-white/5 border border-slate-800 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setDays(Math.max(1, days - 1))}
                      className="px-4 py-3 text-indigo-400 hover:bg-white/5 font-bold transition-colors select-none text-lg shrink-0"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={`${days} Days`}
                      className="w-full bg-transparent text-center focus:outline-none text-white text-sm font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setDays(Math.min(14, days + 1))}
                      className="px-4 py-3 text-indigo-400 hover:bg-white/5 font-bold transition-colors select-none text-lg shrink-0"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                    Travelers Count
                  </label>
                  <div className="flex items-center bg-white/5 border border-slate-800 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setPeople(Math.max(1, people - 1))}
                      className="px-4 py-3 text-indigo-400 hover:bg-white/5 font-bold transition-colors select-none text-lg shrink-0"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      readOnly
                      value={`${people} People`}
                      className="w-full bg-transparent text-center focus:outline-none text-white text-sm font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setPeople(people + 1)}
                      className="px-4 py-3 text-indigo-400 hover:bg-white/5 font-bold transition-colors select-none text-lg shrink-0"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider font-mono">
                    Experience Theme
                  </label>
                  <select
                    value={travelType}
                    onChange={(e) => setTravelType(e.target.value as any)}
                    className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-white outline-none transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="Solo" className="bg-slate-950 text-white">Solo Backpacker</option>
                    <option value="Couple" className="bg-slate-950 text-white">Romantic Couple</option>
                    <option value="Family" className="bg-slate-950 text-white">Family Vacation</option>
                    <option value="Friends" className="bg-slate-950 text-white">Group Friends</option>
                    <option value="Business" className="bg-slate-950 text-white">Business Class</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full sm:col-span-2 py-4.5 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl text-white font-bold text-base shadow-xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Intelligent Itinerary
                </button>
              </form>
            </div>

            {/* Preview Column (Mock draft placeholder) */}
            <div className="lg:col-span-5 h-full">
              <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 flex flex-col relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                  <Plane className="w-32 h-32 text-indigo-400 rotate-90" />
                </div>

                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-semibold text-white">Draft Preview</h3>
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-500/20">
                    System Ready
                  </span>
                </div>

                <div className="space-y-6 flex-1 overflow-hidden">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                    <p className="text-slate-300 text-sm italic">
                      "An immersive holiday tailored for a {travelType.toLowerCase()} style, blending cultural local secrets, selected dining tracks, and custom price optimization models."
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono text-sm font-bold">
                        01
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">Arrival & First Sightseeing</h4>
                        <p className="text-xs text-slate-500">Autonomous location routing pending input</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 font-mono text-sm">
                        02
                      </div>
                      <div>
                        <h4 className="text-slate-400 font-medium text-sm">Cuisine & Historic Sights</h4>
                        <p className="text-xs text-slate-600">Local restaurants selected based on reviews</p>
                      </div>
                    </div>
                  </div>

                  {/* Micro Indicators */}
                  <div className="grid grid-cols-2 gap-4 mt-auto pt-6">
                    <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                      <p className="text-[10px] uppercase font-bold text-indigo-400 mb-1">Curation Engine</p>
                      <p className="text-lg font-bold text-white">Vantage v4.2</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                      <p className="text-[10px] uppercase font-bold text-purple-400 mb-1">Efficiency Match</p>
                      <p className="text-lg font-bold text-white">98% Optimized</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          /* Premium interactive loading screen */
          <div className="max-w-xl mx-auto py-24 text-center space-y-8 animate-fade-in">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-2.5 rounded-full border-4 border-purple-500/20 border-b-purple-500 animate-spin-reverse" />
              <div className="absolute inset-5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white tracking-tight">Designing Your Trip</h3>
              <p className="text-indigo-400 font-mono text-sm h-6">
                {loadingMessages[loadingStep]}
              </p>
            </div>

            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden max-w-sm mx-auto">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
              />
            </div>
            
            <p className="text-slate-500 text-xs">
              This utilizes server-side Gemini 3.5 models to guarantee premium itineraries.
            </p>
          </div>
        ) : (
          /* Render Generated Travel Plan Response! */
          <div className="space-y-8 animate-fade-in">
            {/* Action Bar Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGeneratedTrip(null)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded">
                      {generatedTrip?.request.travelType} Style
                    </span>
                    <span className="text-xs text-slate-500">Curated plan</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mt-1">
                    {generatedTrip?.request.days}-Day Escape to {generatedTrip?.request.destination}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveTrip}
                  disabled={isSaving || saveSuccess}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg border cursor-pointer ${
                    saveSuccess 
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-400"
                      : "bg-indigo-600 hover:bg-indigo-500 border-indigo-400/20 text-white shadow-indigo-500/10"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving to vault...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved Successfully
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      Save Trip Plan
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Overview Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-3">
              <h2 className="text-lg font-semibold text-white">Destination Intelligence Details</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base italic">
                "{generatedTrip?.destinationDetails}"
              </p>
            </div>

            {/* Core Tabs Navigation */}
            <div className="flex border-b border-slate-900 overflow-x-auto no-scrollbar gap-1">
              {[
                { id: 'itinerary', label: 'Itinerary Plan', icon: Calendar },
                { id: 'hotels', label: 'Recommended Hotels', icon: Hotel },
                { id: 'restaurants', label: 'Culinary Hotspots', icon: Utensils },
                { id: 'weather', label: 'Predictive Weather', icon: CloudSun },
                { id: 'budget', label: 'Budget Allocation', icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all whitespace-nowrap cursor-pointer border-b-2 -mb-[2px] ${
                      active 
                        ? "text-indigo-400 border-indigo-500 bg-indigo-950/10" 
                        : "text-slate-400 border-transparent hover:text-white"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Views */}
            <div className="space-y-6">
              {/* Itinerary Tab */}
              {activeTab === 'itinerary' && (
                <div className="space-y-8">
                  {generatedTrip?.itinerary.map((day) => (
                    <div 
                      key={day.dayNumber}
                      className="p-6 rounded-2xl bg-white/[0.01] border border-slate-800/80 hover:border-slate-800 hover:bg-white/[0.02] transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-900/60 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                            D{day.dayNumber}
                          </div>
                          <h3 className="text-lg font-bold text-white">{day.theme}</h3>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">Day Wise Track</span>
                      </div>

                      <div className="space-y-6 relative border-l-2 border-slate-800 pl-6 ml-5">
                        {day.activities.map((act, aIdx) => (
                          <div key={aIdx} className="relative">
                            <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-indigo-500 bg-slate-950" />
                            <div className="space-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h4 className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/30">
                                    {act.time}
                                  </span>
                                  {act.title}
                                </h4>
                                <span className="text-xs text-emerald-400 font-mono font-semibold bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded">
                                  {act.cost === 0 ? "Free" : formatINR(act.cost)}
                                </span>
                              </div>
                              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-4xl pt-1">
                                {act.description}
                              </p>
                              {act.location && (
                                <p className="text-slate-500 text-xs font-mono flex items-center gap-1 pt-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {act.location}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Hotels Tab */}
              {activeTab === 'hotels' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedTrip?.hotels.map((hotel, hIdx) => (
                    <div 
                      key={hIdx}
                      className="p-6 rounded-2xl bg-white/[0.01] border border-slate-800/80 flex flex-col justify-between group hover:border-slate-700/60 transition-all"
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
                          {hotel.tags.map((tag, tIdx) => (
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

              {/* Restaurants Tab */}
              {activeTab === 'restaurants' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedTrip?.restaurants.map((rest, rIdx) => (
                    <div 
                      key={rIdx}
                      className="p-6 rounded-2xl bg-white/[0.01] border border-slate-800/80 flex flex-col justify-between group hover:border-slate-700/60 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-2 py-0.5 rounded">
                              {rest.cuisine}
                            </span>
                            <h3 className="text-lg font-bold text-white mt-2 group-hover:text-indigo-400 transition-colors">
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

              {/* Weather Tab */}
              {activeTab === 'weather' && (
                <div className="space-y-6">
                  {/* Current conditions panel */}
                  <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/20 to-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <CloudSun className="w-10 h-10" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 uppercase tracking-wider font-mono">Predicted Current Temp</p>
                        <h3 className="text-4xl font-bold text-white font-mono">{generatedTrip?.weather.temperature}°C</h3>
                        <p className="text-slate-300 text-sm mt-0.5">{generatedTrip?.weather.condition}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 shrink-0">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-900/60 text-center min-w-[100px]">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Humidity</p>
                        <p className="text-base font-bold text-white mt-1 font-mono">{generatedTrip?.weather.humidity}%</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-900/60 text-center min-w-[100px]">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Wind Speed</p>
                        <p className="text-base font-bold text-white mt-1 font-mono">{generatedTrip?.weather.windSpeed} km/h</p>
                      </div>
                    </div>
                  </div>

                  {/* Daily list */}
                  <h3 className="text-lg font-bold text-white pt-4">Daily predictive trends during stay</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {generatedTrip?.weather.forecast.map((fc, fcIdx) => (
                      <div 
                        key={fcIdx}
                        className="p-4 rounded-2xl bg-white/[0.01] border border-slate-800/80 text-center space-y-2 hover:border-slate-700/60 transition-all"
                      >
                        <p className="text-xs text-indigo-400 font-mono font-bold">{fc.day}</p>
                        <p className="text-xl font-bold font-mono text-white">{fc.temp}°C</p>
                        <p className="text-xs text-slate-400">{fc.condition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget Tab */}
              {activeTab === 'budget' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Itemized Budget Estimation</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Accommodation', amount: generatedTrip?.budgetBreakdown.accommodation, color: 'bg-indigo-500' },
                        { label: 'Food & Dining', amount: generatedTrip?.budgetBreakdown.food, color: 'bg-emerald-500' },
                        { label: 'Activities & Tours', amount: generatedTrip?.budgetBreakdown.activities, color: 'bg-cyan-500' },
                        { label: 'Transport & Flights', amount: generatedTrip?.budgetBreakdown.transport, color: 'bg-purple-500' },
                        { label: 'Miscellaneous/Emergency', amount: generatedTrip?.budgetBreakdown.miscellaneous, color: 'bg-pink-500' },
                      ].map((item, iIdx) => {
                        const pct = Math.round(((item.amount || 0) / (generatedTrip?.budgetBreakdown.total || 1)) * 100);
                        return (
                          <div key={iIdx} className="p-4 rounded-xl bg-white/[0.01] border border-slate-900 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${item.color}`} />
                                <span className="text-slate-300 font-medium">{item.label}</span>
                              </div>
                              <span className="font-mono font-bold text-white">{formatINR(item.amount || 0)} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                              <div className={`${item.color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-tr from-slate-950 via-slate-900/40 to-indigo-950/20 border border-slate-800/80 text-center space-y-4">
                    <TrendingUp className="w-12 h-12 text-indigo-400 mx-auto" />
                    <h4 className="text-xl font-bold text-white">Summation Assessment</h4>
                    
                    <div className="py-4 border-y border-slate-900/60 flex items-center justify-around">
                      <div>
                        <p className="text-xs text-slate-500 font-mono uppercase">User's Ceiling</p>
                        <p className="text-xl font-mono font-bold text-indigo-400">{formatINR(generatedTrip?.request.budget || 0)}</p>
                      </div>
                      <div className="w-px h-10 bg-slate-900" />
                      <div>
                        <p className="text-xs text-slate-500 font-mono uppercase">Calculated Total</p>
                        <p className="text-xl font-mono font-bold text-emerald-400">{formatINR(generatedTrip?.budgetBreakdown.total || 0)}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed pt-2">
                      This calculation represents custom optimal routing. Food indices, hotel tiers, and internal city transit estimates are aligned perfectly to matching style.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
