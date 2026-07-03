import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Planner from "./pages/Planner";
import Hotels from "./pages/Hotels";
import Restaurants from "./pages/Restaurants";
import Weather from "./pages/Weather";
import SavedTrips from "./pages/SavedTrips";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import { UserProfile, TripPlan } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Compass, Shield, Activity, RefreshCw } from "lucide-react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedTripForPreview, setSelectedTripForPreview] = useState<TripPlan | null>(null);
  const [atmosphere, setAtmosphere] = useState<'blue' | 'emerald' | 'rose'>("blue");

  // Load session & theme from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem("vantage_session_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("vantage_session_user");
      }
    }

    const savedAtmo = localStorage.getItem("vantage_atmosphere");
    if (savedAtmo === "blue" || savedAtmo === "emerald" || savedAtmo === "rose") {
      setAtmosphere(savedAtmo);
    }
  }, []);

  const handleAtmosphereChange = (newAtmo: 'blue' | 'emerald' | 'rose') => {
    setAtmosphere(newAtmo);
    localStorage.setItem("vantage_atmosphere", newAtmo);
  };


  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem("vantage_session_user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("vantage_session_user");
    setCurrentPage("home");
  };

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem("vantage_session_user", JSON.stringify(updatedUser));
  };

  // Render active screen helper
  const renderPageContent = () => {
    switch (currentPage) {
      case "home":
        return <Home setCurrentPage={setCurrentPage} user={user} />;
      case "login":
        return <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLogin} />;
      case "register":
        return <Register setCurrentPage={setCurrentPage} onRegisterSuccess={handleLogin} />;
      case "contact":
        return <Contact />;
      
      // Protected routes - Fallback to login if user session is absent
      case "dashboard":
        return user ? (
          <Dashboard 
            user={user} 
            setCurrentPage={setCurrentPage} 
            setSelectedTripForPreview={setSelectedTripForPreview} 
          />
        ) : (
          <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLogin} />
        );
      case "planner":
        return user ? (
          <Planner user={user} setCurrentPage={setCurrentPage} />
        ) : (
          <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLogin} />
        );
      case "hotels":
        return user ? (
          <Hotels />
        ) : (
          <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLogin} />
        );
      case "restaurants":
        return user ? (
          <Restaurants />
        ) : (
          <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLogin} />
        );
      case "weather":
        return user ? (
          <Weather />
        ) : (
          <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLogin} />
        );
      case "saved":
        return user ? (
          <SavedTrips 
            user={user} 
            initialSelectedTrip={selectedTripForPreview} 
            clearInitialSelectedTrip={() => setSelectedTripForPreview(null)} 
          />
        ) : (
          <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLogin} />
        );
      case "profile":
        return user ? (
          <Profile user={user} onUpdateSuccess={handleProfileUpdate} />
        ) : (
          <Login setCurrentPage={setCurrentPage} onLoginSuccess={handleLogin} />
        );
      default:
        return <Home setCurrentPage={setCurrentPage} user={user} />;
    }
  };

  const glowStyles = {
    blue: {
      glow1: "bg-indigo-600/15",
      glow2: "bg-purple-600/15",
      text: "text-indigo-400",
      accent: "from-cyan-500 via-blue-600 to-indigo-600"
    },
    emerald: {
      glow1: "bg-teal-600/15",
      glow2: "bg-emerald-600/15",
      text: "text-emerald-400",
      accent: "from-teal-500 via-emerald-600 to-cyan-600"
    },
    rose: {
      glow1: "bg-rose-600/15",
      glow2: "bg-purple-600/15",
      text: "text-rose-400",
      accent: "from-pink-500 via-rose-600 to-purple-600"
    }
  };

  const currentGlow = glowStyles[atmosphere] || glowStyles.blue;

  return (
    <div className="min-h-screen bg-[#020512] text-slate-200 flex flex-col font-sans relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Atmosphere Glows - Dynamic based on state */}
      <div className={`absolute top-[-15%] right-[-10%] w-[600px] h-[600px] ${currentGlow.glow1} rounded-full blur-[140px] pointer-events-none z-0 transition-all duration-1000`} />
      <div className={`absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] ${currentGlow.glow2} rounded-full blur-[140px] pointer-events-none z-0 transition-all duration-1000`} />

      {/* Persistent Top Navigation Bar */}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area with Smooth Animation Wrapper */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {renderPageContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Multi-column Premium Bento Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/60 backdrop-blur-2xl py-12 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-4 space-y-4">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCurrentPage("home")}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${currentGlow.accent} flex items-center justify-center shadow-lg`}>
                <Compass className="w-5 h-5 text-white animate-spin-slow" />
              </div>
              <span className="font-sans font-bold text-lg tracking-tight text-white">
                Vantage<span className={`${currentGlow.text} text-xs font-semibold ml-0.5 font-mono`}>AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An elite, hyper-focused generative itinerary architect delivering comprehensive routes, live meteorological forecasts, culinary charts, and budget limits.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold font-mono uppercase tracking-wider border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Core Server Online
              </span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="flex items-center gap-1 text-slate-500 text-[10px] font-mono">
                <Activity className="w-3.5 h-3.5" />
                Vantage v4.2
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">
              Portal Routes
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage("home")} className="text-slate-400 hover:text-white transition-colors">
                  Home Screen
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage(user ? "dashboard" : "login")} className="text-slate-400 hover:text-white transition-colors">
                  Client Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("contact")} className="text-slate-400 hover:text-white transition-colors">
                  Support & Contact
                </button>
              </li>
              {user ? (
                <li>
                  <button onClick={() => setCurrentPage("profile")} className="text-slate-400 hover:text-white transition-colors">
                    User Preferences
                  </button>
                </li>
              ) : (
                <li>
                  <button onClick={() => setCurrentPage("login")} className="text-slate-400 hover:text-white transition-colors">
                    Security Login
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Intelligent Services */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">
              Autonomous Engines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentPage("planner")} className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> AI Itinerary Architect
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("hotels")} className="text-slate-400 hover:text-cyan-400 transition-colors">
                  Elite Hotel Directory
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("restaurants")} className="text-slate-400 hover:text-pink-400 transition-colors">
                  Culinary Gastronomy Search
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage("weather")} className="text-slate-400 hover:text-amber-400 transition-colors">
                  Predictive Climate Weather
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Aesthetic Mood controls */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider font-mono">
              Ambient Theme Aura
            </h4>
            <p className="text-slate-400 text-[10px] leading-normal mb-3">
              Switch the glowing backdrop atmosphere of your travel dashboard.
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleAtmosphereChange("blue")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  atmosphere === "blue"
                    ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-500/5"
                    : "bg-slate-900/30 border-slate-800/60 text-slate-400 hover:bg-slate-900/60 hover:text-slate-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Aether Indigo
                </span>
                {atmosphere === "blue" && <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase">Active</span>}
              </button>

              <button
                onClick={() => handleAtmosphereChange("emerald")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  atmosphere === "emerald"
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5"
                    : "bg-slate-900/30 border-slate-800/60 text-slate-400 hover:bg-slate-900/60 hover:text-slate-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Emerald Oasis
                </span>
                {atmosphere === "emerald" && <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Active</span>}
              </button>

              <button
                onClick={() => handleAtmosphereChange("rose")}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  atmosphere === "rose"
                    ? "bg-rose-950/40 border-rose-500/40 text-rose-300 shadow-md shadow-rose-500/5"
                    : "bg-slate-900/30 border-slate-800/60 text-slate-400 hover:bg-slate-900/60 hover:text-slate-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Cosmic Rose
                </span>
                {atmosphere === "rose" && <span className="text-[9px] font-mono text-rose-400 font-bold uppercase">Active</span>}
              </button>
            </div>
          </div>

        </div>

        {/* Lower footer line */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            © 2026 VantageAI. Fully integrated travel analytics. Powered by Gemini 3.5.
          </p>
          <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
            <span className="hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Security Protocol
            </span>
            <span className="hover:text-indigo-400 transition-colors cursor-pointer flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> API Sync Metrics
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
