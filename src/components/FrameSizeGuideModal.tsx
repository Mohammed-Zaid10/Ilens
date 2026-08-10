import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, CreditCard, Ruler, CheckCircle2, Glasses } from "lucide-react";

export const FrameSizeGuideModal: React.FC = () => {
  const { isFrameSizeGuideOpen, setIsFrameSizeGuideOpen } = useApp();
  const [activeTab, setActiveTab] = useState<"card" | "specs">("card");

  if (!isFrameSizeGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-neutral-900 text-white p-6 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500 text-neutral-950 rounded-2xl flex items-center justify-center font-bold">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif">Frame Size & Fit Guide</h3>
              <p className="text-xs text-neutral-400">Find your ideal frame size in millimeters</p>
            </div>
          </div>

          <button
            onClick={() => setIsFrameSizeGuideOpen(false)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 pt-3 space-x-4">
          <button
            onClick={() => setActiveTab("card")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === "card"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Credit Card Scale Test
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === "specs"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-700"
            }`}
          >
            Reading Frame Numbers (52-18-140)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === "card" ? (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-2">
                <span className="font-bold block text-sm">Quick Credit Card Test:</span>
                <p>
                  A standard credit card width equals the average eye size of a Medium (M) frame! Stand in front of a mirror and hold the card vertically along the center line of your nose.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-xs font-bold text-neutral-900 block">Card extends BEYOND edge of eye</span>
                  <span className="text-amber-600 font-extrabold text-sm block mt-1">Small / Narrow (S)</span>
                  <span className="text-[10px] text-neutral-500 block mt-1">Frame Width &lt; 130mm</span>
                </div>

                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 ring-2 ring-neutral-900">
                  <span className="text-xs font-bold text-neutral-900 block">Card ends EXACTLY at edge of eye</span>
                  <span className="text-amber-600 font-extrabold text-sm block mt-1">Medium / Standard (M)</span>
                  <span className="text-[10px] text-neutral-500 block mt-1">Frame Width 131 - 138mm</span>
                </div>

                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-xs font-bold text-neutral-900 block">Card ends BEFORE edge of eye</span>
                  <span className="text-amber-600 font-extrabold text-sm block mt-1">Large / Wide (L)</span>
                  <span className="text-[10px] text-neutral-500 block mt-1">Frame Width &gt; 139mm</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-5 bg-neutral-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Temple Engraving Example</span>
                  <span className="text-2xl font-black font-mono">52 ☐ 18  145</span>
                </div>
                <Glasses className="w-8 h-8 text-amber-400" />
              </div>

              <div className="space-y-3 text-xs text-neutral-700">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <span className="font-bold">52 mm (Lens Width)</span>
                  <span className="text-neutral-500">Horizontal width of one lens</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <span className="font-bold">18 mm (Bridge Width)</span>
                  <span className="text-neutral-500">Distance over nose bridge between lenses</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                  <span className="font-bold">145 mm (Temple Length)</span>
                  <span className="text-neutral-500">Length of side arm to behind ear</span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsFrameSizeGuideOpen(false)}
            className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl transition-colors"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
