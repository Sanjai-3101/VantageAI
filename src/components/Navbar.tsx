import React, { useState } from "react";
import { 
  Compass, 
  MapPin, 
  Hotel, 
  Utensils, 
  CloudSun, 
  Bookmark, 
  User, 
  Mail, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

export default function Navbar({ currentPage, setCurrentPage, user, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: "home", label: "Home", icon: Compass },
    ...(user ? [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "planner", label: "AI Planner", icon: MapPin },
      { id: "hotels", label: "Hotels", icon: Hotel },
      { id: "restaurants", label: "Restaurants", icon: Utensils },
      { id: "weather", label: "Weather", icon: CloudSun },
      { id: "saved", label: "Saved Trips", icon: Bookmark },
      { id: "profile", label: "Profile", icon: User },
    ] : [
      { id: "login", label: "Login", icon: User },
      { id: "register", label: "Register", icon: User },
    ]),
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-950/75 backdrop-blur-xl border-b border-slate-800/80 shadow-xl shadow-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setCurrentPage("home")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <span className="font-sans font-bold text-xl tracking-tight bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              Vantage<span className="text-cyan-400 text-sm font-semibold ml-0.5 font-mono">AI</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive 
                      ? "text-cyan-400 bg-cyan-950/30 border border-cyan-800/40" 
                      : "text-slate-300 hover:text-white hover:bg-slate-900/50 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  {item.label}
                </button>
              );
            })}

            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-800">
                <div className="flex items-center gap-2">
                  <img 
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.fullName}`} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900"
                  />
                  <span className="text-xs text-slate-300 font-medium font-mono hidden xl:inline max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/30 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-3">
            {user && (
              <img 
                src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.fullName}`} 
                alt="Avatar" 
                className="w-8 h-8 rounded-lg border border-slate-700 bg-slate-900"
              />
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive 
                      ? "text-cyan-400 bg-cyan-950/40 border border-cyan-800/30" 
                      : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                  }`}
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                  {item.label}
                </button>
              );
            })}

            {user && (
              <div className="pt-4 mt-4 border-t border-slate-800 px-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.fullName}`} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-lg border border-slate-700 bg-slate-900"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">{user.fullName}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-rose-950/30 text-rose-400 border border-rose-900/40 hover:bg-rose-900/30 hover:text-rose-300 transition-all text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
