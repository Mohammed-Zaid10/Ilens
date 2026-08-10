import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, ShieldCheck, Truck, RotateCcw, Award, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export const Footer: React.FC = () => {
  const { navigateToCatalog, navigateToStatic, setActiveView, showNotification } = useApp();
  const [emailInput, setEmailInput] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      showNotification("Thank you for subscribing to ILens Atelier updates! Check your inbox for $25 off.", "success");
      setEmailInput("");
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-900">
      {/* Value Proposition Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-neutral-900">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 bg-neutral-900 text-amber-400 rounded-2xl flex items-center justify-center mb-1 border border-neutral-800">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-sm tracking-wide">Free Global Express Shipping</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Complimentary expedited delivery on all orders over $150 with real-time tracking.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 bg-neutral-900 text-amber-400 rounded-2xl flex items-center justify-center mb-1 border border-neutral-800">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-sm tracking-wide">30-Day Risk-Free Trial</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              100% money-back guarantee even on custom optical prescription lenses. No questions asked.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 bg-neutral-900 text-amber-400 rounded-2xl flex items-center justify-center mb-1 border border-neutral-800">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-sm tracking-wide">1-Year Frame Warranty</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every ILens frame is backed by a 1-year manufacturing defect replacement guarantee.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 bg-neutral-900 text-amber-400 rounded-2xl flex items-center justify-center mb-1 border border-neutral-800">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-sm tracking-wide">Certified Prescription Accuracy</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Hand-checked by licensed optometrists using ultra-precise laser centration.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Brand Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-amber-500 text-neutral-950 rounded-xl flex items-center justify-center font-bold tracking-tighter text-xl">
              iL
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white font-serif">
                ILENS
              </span>
              <span className="block text-[9px] font-semibold tracking-widest text-neutral-400 uppercase -mt-1">
                Atelier & Optical
              </span>
            </div>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            ILens combines Japanese precision titanium, Italian bio-acetate, and advanced optical lens engineering with AI-driven visual customization.
          </p>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Join ILens Circle
            </h5>
            <p className="text-xs text-neutral-400">
              Subscribe for $25 off your first prescription order and exclusive artisan drop alerts.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 rounded-xl px-3.5 py-2.5 flex-1 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1"
              >
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Column 1 - Eyewear */}
        <div className="lg:col-span-2 space-y-4">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Eyewear Collections</h5>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li>
              <button onClick={() => navigateToCatalog("eyeglasses")} className="hover:text-amber-400 transition-colors">
                Prescription Eyeglasses
              </button>
            </li>
            <li>
              <button onClick={() => navigateToCatalog("sunglasses")} className="hover:text-amber-400 transition-colors">
                Polarized Sunglasses
              </button>
            </li>
            <li>
              <button onClick={() => navigateToCatalog("contacts")} className="hover:text-amber-400 transition-colors">
                Contact Lenses
              </button>
            </li>
            <li>
              <button onClick={() => navigateToCatalog("bluelight")} className="hover:text-amber-400 transition-colors">
                Blue Light Blocking
              </button>
            </li>
            <li>
              <button onClick={() => navigateToCatalog("new-arrivals")} className="hover:text-amber-400 transition-colors">
                New Arrivals
              </button>
            </li>
            <li>
              <button onClick={() => navigateToCatalog("offers")} className="hover:text-amber-400 transition-colors text-amber-400 font-semibold">
                Offers & Bundles
              </button>
            </li>
          </ul>
        </div>

        {/* Navigation Column 2 - Optical & AI */}
        <div className="lg:col-span-3 space-y-4">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Optical & AI Studio</h5>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li>
              <button onClick={() => setActiveView({ type: "eye-test-booking" })} className="hover:text-amber-400 transition-colors">
                Book In-Store Eye Test
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView({ type: "stores" })} className="hover:text-amber-400 transition-colors">
                Flagship Store Locator
              </button>
            </li>
            <li>
              <button onClick={() => navigateToStatic("help")} className="hover:text-amber-400 transition-colors">
                Prescription Guide & Pupil Distance
              </button>
            </li>
            <li>
              <button onClick={() => navigateToStatic("about")} className="hover:text-amber-400 transition-colors">
                Lens Materials & Coatings
              </button>
            </li>
            <li>
              <button onClick={() => setActiveView({ type: "circle" })} className="hover:text-amber-400 transition-colors">
                ILens Circle Loyalty Rewards
              </button>
            </li>
          </ul>
        </div>

        {/* Navigation Column 3 - Support */}
        <div className="lg:col-span-3 space-y-4">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Help & Legal</h5>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li>
              <button onClick={() => navigateToStatic("shipping")} className="hover:text-amber-400 transition-colors">
                Shipping & Delivery Policy
              </button>
            </li>
            <li>
              <button onClick={() => navigateToStatic("returns")} className="hover:text-amber-400 transition-colors">
                30-Day Returns & Exchanges
              </button>
            </li>
            <li>
              <button onClick={() => navigateToStatic("warranty")} className="hover:text-amber-400 transition-colors">
                1-Year Frame Warranty
              </button>
            </li>
            <li>
              <button onClick={() => navigateToStatic("privacy")} className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => navigateToStatic("terms")} className="hover:text-amber-400 transition-colors">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => navigateToStatic("contact")} className="hover:text-amber-400 transition-colors">
                Contact Optical Stylists
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
        <p>© 2026 ILens Eyewear Atelier Inc. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          <span className="hover:text-neutral-400 cursor-pointer">Security Verified</span>
          <span className="hover:text-neutral-400 cursor-pointer">FDA Cleared Lenses</span>
          <span className="hover:text-neutral-400 cursor-pointer">HIPAA Compliant Prescriptions</span>
          <button
            onClick={() => setActiveView({ type: "admin" })}
            className="text-amber-500 hover:text-amber-400 font-bold transition-colors"
          >
            Admin Portal
          </button>
        </div>
      </div>
    </footer>
  );
};
