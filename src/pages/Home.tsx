import React from "react";
import { Compass, Sparkles, Map, ShieldCheck, ArrowRight, Star, Globe, Shield, CreditCard } from "lucide-react";
import { motion } from "motion/react";

interface HomeProps {
  setCurrentPage: (page: string) => void;
  user: any;
}

export default function Home({ setCurrentPage, user }: HomeProps) {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Our state-of-the-art model designs comprehensive day-by-day routes and activity plans tailored to you.",
      color: "from-cyan-500 to-blue-500",
      glowColor: "group-hover:bg-cyan-500/10",
      accentBorder: "group-hover:border-cyan-500/30"
    },
    {
      icon: Map,
      title: "Smart Budget Tracking",
      description: "Detailed live estimates on hotels, culinary hotspots, travel fees, and emergency cash requirements.",
      color: "from-indigo-500 to-purple-500",
      glowColor: "group-hover:bg-indigo-500/10",
      accentBorder: "group-hover:border-indigo-500/30"
    },
    {
      icon: ShieldCheck,
      title: "Immersive Curation",
      description: "Carefully filtered listings of high-tier hotels and native dining places based on real reviews.",
      color: "from-pink-500 to-rose-500",
      glowColor: "group-hover:bg-rose-500/10",
      accentBorder: "group-hover:border-rose-500/30"
    },
  ];

  const showcaseDestinations = [
    {
      name: "Kyoto Autumn Retreat",
      duration: "7 Days",
      budget: "₹1,25,000",
      vibe: "Cultural • Historic",
      tagline: "Temples & Bamboo Forests",
      bgClass: "from-amber-600/20 to-orange-950/40"
    },
    {
      name: "Swiss Alpine Luxury",
      duration: "6 Days",
      budget: "₹3,40,000",
      vibe: "Adventure • Elite",
      tagline: "Panoramic Train Routes",
      bgClass: "from-blue-600/20 to-slate-900/40"
    },
    {
      name: "Amalfi Coast Serenity",
      duration: "8 Days",
      budget: "₹2,80,000",
      vibe: "Romance • Gastronomy",
      tagline: "Private Shore Excursions",
      bgClass: "from-cyan-600/20 to-indigo-950/40"
    }
  ];

  const testimonials = [
    {
      quote: "The AI recommendations matched my taste perfectly! Highly recommend the custom dining maps.",
      author: "Sophia L.",
      role: "Adventure Blogger",
      rating: 5,
    },
    {
      quote: "VantageAI saved me 12 hours of planning for our group's trip to Tokyo. The budget split was spot-on.",
      author: "Marcus K.",
      role: "Tech Lead",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="relative min-h-screen text-slate-100 overflow-hidden font-sans">
      {/* Background radial effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Section */}
    <section className="w-full max-w-screen-2xl mx-auto px-6 lg:px-12 pt-24 pb-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/40 text-indigo-300 border border-indigo-800/30 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
            Empowered by Next-Gen Gemini AI Model
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="font-display font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-none max-w-5xl mx-auto mb-8 text-white"
        >
          Your Next Adventure,{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
            Architected in Seconds
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Ditch the browser tabs. VantageAI builds personalized, ultra-detailed itineraries, hotel curations, culinary hotspots, and instant weather estimates matching your exact budget and travel style.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
        >
          <button
            onClick={() => setCurrentPage(user ? "planner" : "register")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-indigo-500 via-blue-600 to-cyan-600 hover:from-indigo-400 hover:to-cyan-500 text-white shadow-xl shadow-indigo-500/25 border border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm tracking-wide"
          >
            Start Planning Now
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage("contact")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-slate-900/40 hover:bg-slate-900/80 text-slate-300 border border-slate-800/80 hover:border-slate-700/80 backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm"
          >
            Request Private Demo
          </button>
        </motion.div>

        {/* Floating Interactive Live Mockup / Visual */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.4 }}
          className="w-full max-w-5xl mx-auto rounded-[24px] border border-white/[0.06] bg-slate-950/40 p-4 sm:p-6 backdrop-blur-xl shadow-2xl shadow-indigo-500/5 relative group"
        >
          {/* Subtle border reflection glow */}
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-tr from-cyan-500/10 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-900/80 pb-4 mb-6 text-left">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950/60 px-3 py-1 rounded-md border border-slate-900">
              vantage-ai://live-trip-simulation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-900/80 hover:border-slate-800 transition-colors">
              <div className="flex items-center gap-2 text-slate-500">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] uppercase tracking-wider font-bold font-mono">Live Budget Audit</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">₹2,04,500</div>
              <div className="w-full bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "65%" }} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-900/80 hover:border-slate-800 transition-colors">
              <div className="flex items-center gap-2 text-slate-500">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] uppercase tracking-wider font-bold font-mono">AI Luxury Match</span>
              </div>
              <div className="text-lg font-bold text-white mt-2">Shibuya Sky Suites</div>
              <div className="text-[11px] text-slate-400 mt-0.5">9.8/10 Score • Tokyo District</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-900/80 hover:border-slate-800 transition-colors">
              <div className="flex items-center gap-2 text-slate-500">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] uppercase tracking-wider font-bold font-mono">Precision Day 1</span>
              </div>
              <div className="text-lg font-bold text-indigo-300 mt-2">Neon Sights Walk</div>
              <div className="text-[11px] text-slate-400 mt-0.5">3 temple routes mapped dynamically</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Curated Destinations Grid */}
      <section className="py-20 border-t border-slate-900/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/30 border border-cyan-800/40 px-3 py-1 rounded-full">
              AI Collections
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mt-3 mb-4">
              Featured Luxury Itineraries
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Explore preset high-end templates prepared by our model to preview our detailed day-wise structures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {showcaseDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.05] bg-slate-950/30 overflow-hidden flex flex-col justify-between group hover:border-slate-700/50 transition-all duration-300 shadow-xl"
              >
                {/* Backdrop representation with CSS gradient glow */}
                <div className={`h-40 bg-gradient-to-tr ${dest.bgClass} relative flex items-end p-5 overflow-hidden`}>
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/5 text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                    {dest.duration}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-100 z-0" />
                  <div className="relative z-10">
                    <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 bg-indigo-950/50 border border-indigo-900/30 px-2 py-0.5 rounded">
                      {dest.vibe}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">{dest.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-slate-400 text-xs leading-relaxed">
                    A beautiful, fully calculated model roadmap featuring {dest.tagline.toLowerCase()}, curated 4-star boutique hotels, and authentic local street food suggestions.
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-slate-900 pt-4">
                    <div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase">Aprox. Budget</p>
                      <p className="text-sm font-bold text-emerald-400 font-mono">{dest.budget}</p>
                    </div>
                    <button 
                      onClick={() => setCurrentPage(user ? "planner" : "login")}
                      className="flex items-center gap-1.5 text-xs text-indigo-400 group-hover:text-indigo-300 font-bold transition-colors cursor-pointer"
                    >
                      Use Model <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature section */}
      <section className="py-20 border-t border-slate-900/80 bg-slate-950/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/30 border border-indigo-800/40 px-3 py-1 rounded-full">
              System Capabilities
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mt-3 mb-4">
              Designed for Frictionless Voyages
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Our travel generator coordinates all booking and scheduling layers so you can focus entirely on the destination.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-2xl border border-white/[0.04] bg-slate-950/40 hover:border-slate-800 transition-all duration-300 relative group overflow-hidden shadow-md hover:shadow-xl"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity duration-300`} />
                  <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 font-display">{feat.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-slate-900/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest bg-rose-950/30 border border-rose-800/40 px-3 py-1 rounded-full">
              Testimonials
            </span>
            <h2 className="font-display font-bold text-3xl text-white tracking-tight mt-3 mb-4">
              Endorsed by Modern Explorers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-white/[0.04] bg-slate-950/20 backdrop-blur-sm flex flex-col justify-between hover:border-slate-800 transition-colors"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 italic text-sm sm:text-base leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-slate-900/60 pt-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono text-indigo-400 font-bold">
                    {test.author.substring(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{test.author}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{test.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

