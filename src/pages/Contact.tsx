import React, { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle, Sparkles, Loader2, Compass, Phone, Github, Linkedin, User } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending contact message
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen text-slate-100 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background atmosphere radial highlights */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/40 text-indigo-400 border border-indigo-800/40 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            VantageAI Operations Command
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            Connect with our architects
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Need custom enterprise scheduling? Missing localized climate charts? Get in touch with our team today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Information blocks */}
          <div className="md:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white/[0.01] border border-slate-800/80 backdrop-blur-xl space-y-4">
              <h3 className="text-lg font-bold text-white">Direct Communication</h3>
              
              <div className="space-y-4 text-sm text-slate-300 font-mono">
                <div className="flex items-center gap-3">
                  <User className="w-4.5 h-4.5 text-indigo-400" />
                  <span className="text-white font-semibold">Sanjai</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4.5 h-4.5 text-indigo-400" />
                  <a 
                    href="mailto:shasan4467@gmail.com" 
                    className="hover:text-indigo-400 hover:underline transition-colors duration-200"
                  >
                    shasan4467@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-950 to-indigo-950/20 border border-slate-800/80 backdrop-blur-xl">
              <h3 className="text-white font-bold mb-2">Service Allocation</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Our support team is located globally, monitoring telemetry stacks 24/7. Standard responsive windows are under 2 hours.
              </p>
            </div>
          </div>

          {/* Contact form panel */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-slate-800/80 backdrop-blur-xl">
            {success && (
              <div className="flex items-center gap-2.5 p-4 mb-6 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 text-sm animate-fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Message synchronized. We'll get back to you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 font-mono">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Elena Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 font-mono">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="elena@vantage.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2 font-mono">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-white/5 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none transition-all text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/15 border border-indigo-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    Transmit Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
