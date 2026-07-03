import React, { useEffect, useState } from "react";
import { 
  Bookmark, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Trash2, 
  ArrowLeft, 
  Compass,
  Hotel,
  Utensils,
  CloudSun,
  TrendingUp
} from "lucide-react";
import { motion } from "motion/react";
import { TripPlan, UserProfile } from "../types";
import { formatINR } from "../utils/format";

interface SavedTripsProps {
  user: UserProfile;
  initialSelectedTrip?: TripPlan | null;
  clearInitialSelectedTrip?: () => void;
}

export default function SavedTrips({ user, initialSelectedTrip, clearInitialSelectedTrip }: SavedTripsProps) {
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<TripPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'hotels' | 'restaurants' | 'weather' | 'budget'>('itinerary');

  useEffect(() => {
    fetchTrips();
    if (initialSelectedTrip) {
      setSelectedTrip(initialSelectedTrip);
      if (clearInitialSelectedTrip) clearInitialSelectedTrip();
    }
  }, [user.uid, initialSelectedTrip]);

  const fetchTrips = async () => {
    try {
      const response = await fetch(`/api/trips?userId=${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this trip?")) return;

    try {
      const response = await fetch(`/api/trips/${id}?userId=${user.uid}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTrips(trips.filter((t) => t.id !== id));
        if (selectedTrip?.id === id) {
          setSelectedTrip(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {!selectedTrip ? (
          /* List of Trips View */
          <div className="space-y-8">
            <div>
              <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest font-mono">
                Encrypted Vault
              </span>
              <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight mt-1">
                Your Saved Journeys
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Access, manage, and explore detailed routes or budget breakdowns for all your custom-planned voyages.
              </p>
            </div>

            {isLoading ? (
              <div className="py-20 text-center text-slate-500 animate-pulse font-mono text-sm">
                Retrieving your customized travel library from active secure clusters...
              </div>
            ) : trips.length === 0 ? (
              <div className="py-16 text-center text-slate-500 border border-dashed border-slate-800/80 rounded-2xl max-w-xl mx-auto p-8 space-y-3">
                <Bookmark className="w-10 h-10 text-slate-700 mx-auto" />
                <h3 className="text-white font-medium">No saved plans</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Go to the AI Trip Planner tab, generate an itinerary, and click "Save Trip Plan" to secure your custom travels here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    onClick={() => {
                      setSelectedTrip(trip);
                      setActiveTab('itinerary');
                    }}
                    className="p-6 rounded-2xl border border-slate-800/80 bg-white/[0.01] hover:border-slate-700/60 transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
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
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">People</p>
                          <p className="text-sm font-semibold text-slate-300 font-mono">{trip.request.people} Pax</p>
                        </div>
                      </div>
                      <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                        Explore Plan <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Selected Trip Detail View */
          <div className="space-y-8 animate-fade-in">
            {/* Action Bar Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded">
                      {selectedTrip.request.travelType} Style
                    </span>
                    <span className="text-xs text-slate-500">Saved Plan</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mt-1">
                    {selectedTrip.request.days}-Day Escape to {selectedTrip.request.destination}
                  </h1>
                </div>
              </div>

              <button
                onClick={(e) => {
                  deleteTrip(selectedTrip.id, e);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-rose-950/20 border border-rose-900/40 hover:bg-rose-900/20 hover:border-rose-700 text-rose-300 transition-all cursor-pointer"
              >
                <Trash2 className="w-4.5 h-4.5" />
                Delete Saved Plan
              </button>
            </div>

            {/* Overview Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl space-y-3">
              <h2 className="text-lg font-semibold text-white">Destination Intelligence Details</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base italic">
                "{selectedTrip.destinationDetails}"
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
                  {selectedTrip.itinerary.map((day) => (
                    <div 
                      key={day.dayNumber}
                      className="p-6 rounded-2xl bg-white/[0.01] border border-slate-800/80 hover:border-slate-850 hover:bg-white/[0.02] transition-all"
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
                  {selectedTrip.hotels.map((hotel, hIdx) => (
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

              {/* Restaurants Tab */}
              {activeTab === 'restaurants' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedTrip.restaurants.map((rest, rIdx) => (
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
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/20 to-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <CloudSun className="w-10 h-10" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 uppercase tracking-wider font-mono">Predicted Current Temp</p>
                        <h3 className="text-4xl font-bold text-white font-mono">{selectedTrip.weather.temperature}°C</h3>
                        <p className="text-slate-300 text-sm mt-0.5">{selectedTrip.weather.condition}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 shrink-0">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-900/60 text-center min-w-[100px]">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Humidity</p>
                        <p className="text-base font-bold text-white mt-1 font-mono">{selectedTrip.weather.humidity}%</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-900/60 text-center min-w-[100px]">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Wind Speed</p>
                        <p className="text-base font-bold text-white mt-1 font-mono">{selectedTrip.weather.windSpeed} km/h</p>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white pt-4">Daily predictive trends during stay</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {selectedTrip.weather.forecast.map((fc, fcIdx) => (
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
                        { label: 'Accommodation', amount: selectedTrip.budgetBreakdown.accommodation, color: 'bg-indigo-500' },
                        { label: 'Food & Dining', amount: selectedTrip.budgetBreakdown.food, color: 'bg-emerald-500' },
                        { label: 'Activities & Tours', amount: selectedTrip.budgetBreakdown.activities, color: 'bg-cyan-500' },
                        { label: 'Transport & Flights', amount: selectedTrip.budgetBreakdown.transport, color: 'bg-purple-500' },
                        { label: 'Miscellaneous/Emergency', amount: selectedTrip.budgetBreakdown.miscellaneous, color: 'bg-pink-500' },
                      ].map((item, iIdx) => {
                        const pct = Math.round(((item.amount || 0) / (selectedTrip.budgetBreakdown.total || 1)) * 100);
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
                        <p className="text-xl font-mono font-bold text-indigo-400">{formatINR(selectedTrip.request.budget)}</p>
                      </div>
                      <div className="w-px h-10 bg-slate-900" />
                      <div>
                        <p className="text-xs text-slate-500 font-mono uppercase">Calculated Total</p>
                        <p className="text-xl font-mono font-bold text-emerald-400">{formatINR(selectedTrip.budgetBreakdown.total)}</p>
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
