import React from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Star,
  Glasses,
  Zap,
  ArrowRight
} from "lucide-react";

export const ILensCircleView: React.FC = () => {
  const { user, showNotification, setActiveView } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="bg-neutral-950 text-white p-8 sm:p-12 rounded-3xl border border-neutral-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="space-y-4 max-w-xl z-10">
          <span className="px-3.5 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            ILens Circle VIP Membership
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-serif leading-tight">
            Elevate Your Vision with Private Atelier Privileges.
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
            Every frame purchase earns 10 points per $1 spent. Unlock complimentary lens coatings, annual doctor eye exams, and private access to Sabae titanium drops.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <div className="bg-neutral-900/90 p-4 rounded-2xl border border-neutral-800 flex items-center gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Your Current Status</span>
                <span className="text-lg font-black text-amber-400">{user.circleTier} Tier ({user.circlePoints} pts)</span>
              </div>
            </div>

            <button
              onClick={() => setActiveView({ type: "catalog", category: "all" })}
              className="px-6 py-4 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-2xl transition-all shadow-lg"
            >
              Shop & Earn Points
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 h-72 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl shrink-0 relative">
          <img
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800"
            alt="ILens Circle"
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent p-6 flex flex-col justify-end">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Atelier Membership</span>
            <h3 className="text-xl font-bold font-serif text-white">Platinum Atelier Lounge</h3>
          </div>
        </div>
      </div>

      {/* Tier Comparison Matrix */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">VIP Membership Tiers</span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-neutral-950">
            Exclusive Atelier Tier Benefits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Silver */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Tier 1 • 0 - 999 Pts</span>
            <h3 className="text-2xl font-black font-serif text-neutral-950">Silver Member</h3>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Earn 10 Pts per $1 spent</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Free Insured Express Shipping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>30-Day Risk-Free Lens Guarantee</span>
              </li>
            </ul>
          </div>

          {/* Gold */}
          <div className="bg-amber-500/10 p-6 sm:p-8 rounded-3xl border-2 border-amber-500 shadow-md space-y-4 relative">
            <span className="absolute -top-3 right-6 px-3 py-0.5 bg-amber-500 text-neutral-950 font-black text-[10px] uppercase tracking-wider rounded-full shadow-sm">
              Your Current Tier
            </span>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Tier 2 • 1,000 - 2,499 Pts</span>
            <h3 className="text-2xl font-black font-serif text-neutral-950">Gold Atelier</h3>
            <ul className="space-y-2 text-xs text-neutral-800 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>All Silver Benefits Included</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Complimentary Annual Doctor Eye Exam</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>20% Off All Prescription Lens Upgrades</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Birthday Gift Frame Credit ($50)</span>
              </li>
            </ul>
          </div>

          {/* Platinum */}
          <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-xl space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Tier 3 • 2,500+ Pts</span>
            <h3 className="text-2xl font-black font-serif text-white">Platinum Bespoke</h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>All Gold Benefits Included</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1:1 Private Stylist Consultation in SoHo / Beverly Hills</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Priority Sabae Japanese Titanium Pre-Orders</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Lifetime Frame Maintenance & Deep Cleaning</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
