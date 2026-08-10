import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, CheckCircle2, Upload, Sparkles, Shield, ArrowRight, ArrowLeft, FileText, Check } from "lucide-react";
import {
  LensUsage,
  LensMaterialIndex,
  LensCoating,
  PrescriptionData,
  SelectedLensConfig
} from "../types";

export const LensCustomizationModal: React.FC = () => {
  const {
    isLensCustomizerOpen,
    setIsLensCustomizerOpen,
    customizingProduct,
    addToCart,
    user
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Configuration State
  const [usage, setUsage] = useState<LensUsage>("distance");
  const [usageLabel, setUsageLabel] = useState("Single Vision Distance");
  const [usagePrice, setUsagePrice] = useState(0);

  const [index, setIndex] = useState<LensMaterialIndex>("1.60_thin");
  const [indexLabel, setIndexLabel] = useState("1.60 Thin Index (25% Thinner)");
  const [indexPrice, setIndexPrice] = useState(30);

  const [coatings, setCoatings] = useState<LensCoating[]>(["standard_anti_reflective", "blue_light_blocker"]);
  const [coatingsPrice, setCoatingsPrice] = useState(25);

  const [prescription, setPrescription] = useState<PrescriptionData>({
    odSph: "-2.25",
    odCyl: "-0.50",
    odAxis: "180",
    osSph: "-2.50",
    osCyl: "-0.75",
    osAxis: "175",
    pd: "63",
    pdType: "single"
  });

  if (!isLensCustomizerOpen || !customizingProduct) return null;

  const totalLensPrice = usagePrice + indexPrice + coatingsPrice;
  const grandTotal = customizingProduct.price + totalLensPrice;

  const handleCoatingToggle = (c: LensCoating, cost: number) => {
    if (coatings.includes(c)) {
      setCoatings(coatings.filter((item) => item !== c));
      setCoatingsPrice((prev) => Math.max(0, prev - cost));
    } else {
      setCoatings([...coatings, c]);
      setCoatingsPrice((prev) => prev + cost);
    }
  };

  const handleFinishAndAdd = () => {
    const finalConfig: SelectedLensConfig = {
      usage,
      usageLabel,
      usagePrice,
      index,
      indexLabel,
      indexPrice,
      coatings,
      coatingsPrice,
      prescription,
      totalLensPrice
    };

    addToCart(customizingProduct, undefined, finalConfig, 1);
    setIsLensCustomizerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-neutral-900 text-white p-6 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500 text-neutral-950 rounded-2xl flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif">Configure Optical Lenses</h3>
              <p className="text-xs text-neutral-400">
                Customizing <span className="text-amber-400 font-bold">{customizingProduct.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLensCustomizerOpen(false)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-200 flex items-center justify-between text-xs font-semibold text-neutral-600">
          <div className="flex items-center space-x-4">
            <span className={step === 1 ? "text-amber-600 font-bold" : ""}>1. Usage</span>
            <span>&gt;</span>
            <span className={step === 2 ? "text-amber-600 font-bold" : ""}>2. Prescription</span>
            <span>&gt;</span>
            <span className={step === 3 ? "text-amber-600 font-bold" : ""}>3. Lens Index</span>
            <span>&gt;</span>
            <span className={step === 4 ? "text-amber-600 font-bold" : ""}>4. Coatings</span>
          </div>

          <span className="font-mono text-neutral-900 font-bold">
            Lens Total: ${totalLensPrice}
          </span>
        </div>

        {/* Content View according to Step */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-neutral-900 font-serif">
                Select Your Primary Vision Need
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "distance", label: "Single Vision Distance", desc: "For driving, sports, watching TV", price: 0 },
                  { id: "reading", label: "Single Vision Reading", desc: "For books, tablets, close work", price: 0 },
                  { id: "progressive", label: "Progressive / Multi-Focal", desc: "Seamless distance, intermediate & near", price: 80 },
                  { id: "computer", label: "Computer & Screen Blue Light", desc: "Anti-fatigue screen protection", price: 35 },
                  { id: "non_prescription", label: "Non-Prescription Fashion", desc: "Styling or blue light defense only", price: 0 },
                  { id: "frame_only", label: "Frame Only (Demo Lenses)", desc: "Take to your local optometrist", price: -10 }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setUsage(opt.id as LensUsage);
                      setUsageLabel(opt.label);
                      setUsagePrice(opt.price);
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all flex items-start justify-between ${
                      usage === opt.id
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                        : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className={`text-[11px] block mt-1 ${usage === opt.id ? "text-neutral-300" : "text-neutral-500"}`}>
                        {opt.desc}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${usage === opt.id ? "text-amber-400" : "text-amber-600"}`}>
                      {opt.price === 0 ? "Included" : opt.price > 0 ? `+$${opt.price}` : `-$${Math.abs(opt.price)}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-neutral-900 font-serif">
                  Optical Prescription Details
                </h4>

                {user.savedPrescriptions.length > 0 && (
                  <button
                    onClick={() => {
                      const p = user.savedPrescriptions[0];
                      setPrescription(p);
                    }}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> Use Saved Vault Script
                  </button>
                )}
              </div>

              {/* Prescription Grid */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-4">
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-neutral-500 uppercase">
                  <span>Eye</span>
                  <span>SPH (Sphere)</span>
                  <span>CYL (Cylinder)</span>
                  <span>AXIS</span>
                </div>

                {/* Right Eye OD */}
                <div className="grid grid-cols-4 gap-2 items-center text-xs">
                  <span className="font-bold text-neutral-900">Right (OD)</span>
                  <input
                    type="text"
                    value={prescription.odSph}
                    onChange={(e) => setPrescription({ ...prescription, odSph: e.target.value })}
                    className="bg-white border border-neutral-300 rounded-lg py-1.5 px-2 text-center font-mono font-bold"
                  />
                  <input
                    type="text"
                    value={prescription.odCyl}
                    onChange={(e) => setPrescription({ ...prescription, odCyl: e.target.value })}
                    className="bg-white border border-neutral-300 rounded-lg py-1.5 px-2 text-center font-mono"
                  />
                  <input
                    type="text"
                    value={prescription.odAxis}
                    onChange={(e) => setPrescription({ ...prescription, odAxis: e.target.value })}
                    className="bg-white border border-neutral-300 rounded-lg py-1.5 px-2 text-center font-mono"
                  />
                </div>

                {/* Left Eye OS */}
                <div className="grid grid-cols-4 gap-2 items-center text-xs">
                  <span className="font-bold text-neutral-900">Left (OS)</span>
                  <input
                    type="text"
                    value={prescription.osSph}
                    onChange={(e) => setPrescription({ ...prescription, osSph: e.target.value })}
                    className="bg-white border border-neutral-300 rounded-lg py-1.5 px-2 text-center font-mono font-bold"
                  />
                  <input
                    type="text"
                    value={prescription.osCyl}
                    onChange={(e) => setPrescription({ ...prescription, osCyl: e.target.value })}
                    className="bg-white border border-neutral-300 rounded-lg py-1.5 px-2 text-center font-mono"
                  />
                  <input
                    type="text"
                    value={prescription.osAxis}
                    onChange={(e) => setPrescription({ ...prescription, osAxis: e.target.value })}
                    className="bg-white border border-neutral-300 rounded-lg py-1.5 px-2 text-center font-mono"
                  />
                </div>

                {/* PD Pupil Distance */}
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-900">Pupillary Distance (PD):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={prescription.pd}
                      onChange={(e) => setPrescription({ ...prescription, pd: e.target.value })}
                      className="w-16 bg-white border border-neutral-300 rounded-lg py-1.5 text-center font-mono font-bold"
                    />
                    <span className="text-neutral-500 font-semibold">mm</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-neutral-900 font-serif">
                Select Lens Material & Thickness Index
              </h4>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    id: "1.50_standard",
                    label: "1.50 Standard Index",
                    desc: "Recommended for mild prescriptions (0.00 to +/- 2.00)",
                    price: 0
                  },
                  {
                    id: "1.60_thin",
                    label: "1.60 Thin Index (25% Thinner & Lighter)",
                    desc: "Recommended for moderate prescriptions (+/- 2.00 to +/- 4.00)",
                    price: 30
                  },
                  {
                    id: "1.67_super_thin",
                    label: "1.67 Super Thin Index (40% Thinner)",
                    desc: "Recommended for strong prescriptions (+/- 4.00 to +/- 6.00)",
                    price: 65
                  },
                  {
                    id: "1.74_ultra_thin",
                    label: "1.74 Ultra-High Index (50% Thinner)",
                    desc: "Flattest & lightest lens profile for high prescriptions (+/- 6.00+)",
                    price: 110
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIndex(item.id as LensMaterialIndex);
                      setIndexLabel(item.label);
                      setIndexPrice(item.price);
                    }}
                    className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      index === item.id
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                        : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800"
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className={`text-[11px] block mt-0.5 ${index === item.id ? "text-neutral-300" : "text-neutral-500"}`}>
                        {item.desc}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${index === item.id ? "text-amber-400" : "text-amber-600"}`}>
                      {item.price === 0 ? "Included" : `+$${item.price}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-neutral-900 font-serif">
                Select Premium Protective Coatings & Filters
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "standard_anti_reflective",
                    label: "7-Layer Anti-Reflective & Hydrophobic",
                    desc: "Eliminates glare, repels water & smudges",
                    cost: 0,
                    included: true
                  },
                  {
                    id: "blue_light_blocker",
                    label: "BlueShield Max HEV Filter",
                    desc: "Blocks 98% digital blue light from screens",
                    cost: 25
                  },
                  {
                    id: "photochromic_transitions",
                    label: "Transitions® Photochromic",
                    desc: "Adapts automatically from clear indoors to dark sun outdoors",
                    cost: 75
                  },
                  {
                    id: "polarized_sun",
                    label: "Polarized HD Sun Tint",
                    desc: "100% UV400 glare cancellation for driving & water",
                    cost: 55
                  }
                ].map((c) => {
                  const isChecked = coatings.includes(c.id as LensCoating);
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleCoatingToggle(c.id as LensCoating, c.cost)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                        isChecked
                          ? "bg-amber-500/10 border-amber-500 ring-1 ring-amber-500"
                          : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">{c.label}</span>
                        <span className="text-[11px] text-neutral-500 block mt-1">{c.desc}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-600">
                        {c.cost === 0 ? "Free" : `+$${c.cost}`}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary Box */}
              <div className="mt-6 p-4 bg-neutral-900 text-white rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Frame ({customizingProduct.name}):</span>
                  <span>${customizingProduct.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Lens Package ({usageLabel}):</span>
                  <span>${totalLensPrice}</span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-sm text-amber-400">
                  <span>Grand Total:</span>
                  <span>${grandTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-4 bg-white border-t border-neutral-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center gap-2"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          ) : (
            <button
              onClick={handleFinishAndAdd}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Complete & Add to Bag (${grandTotal})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
