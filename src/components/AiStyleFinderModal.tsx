import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Sparkles, RefreshCw, CheckCircle2, Sliders, ArrowRight } from "lucide-react";

export const AiStyleFinderModal: React.FC = () => {
  const { isStyleFinderOpen, setIsStyleFinderOpen, navigateToCatalog } = useApp();
  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState({
    lifestyle: "Work & Screen Heavy",
    vibe: "Sleek & Architectural",
    materialPref: "Titanium / Ultra-lightweight",
    colorPref: "Warm Metallics & Rose Gold"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  if (!isStyleFinderOpen) return null;

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit to Gemini API
      setIsLoading(true);
      try {
        const res = await fetch("/api/gemini/style-finder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers })
        });
        const data = await res.json();
        setRecommendation(data.recommendation || data.fallback);
      } catch (e) {
        console.error(e);
        setRecommendation({
          profileTitle: "Refined Modern Minimalist",
          personaDescription: "You appreciate clean architectural lines, ultra-lightweight Japanese titanium, and weightless comfort that transitions seamlessly from executive work to evening events.",
          recommendedShapes: ["Geometric", "Square", "Aviator"],
          recommendedMaterials: ["Grade-5 Japanese Titanium", "Mazzucchelli Bio-Acetate"],
          recommendedColors: ["Rose Gold", "Matte Gunmetal", "Crystal Clear"],
          advice: "Select thin titanium rims with anti-reflective blue light blocking lenses."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const quizSteps = [
    {
      title: "What best describes your daily routine?",
      key: "lifestyle",
      options: ["Work & Screen Heavy", "Outdoor & Active Sports", "Artistic & Fashion Events", "Casual & Weekend Travel"]
    },
    {
      title: "What visual aesthetic inspires you?",
      key: "vibe",
      options: ["Sleek & Architectural", "Retro Feline Glamour", "Bold Statement Vintage", "Understated Classic"]
    },
    {
      title: "Preferred frame materials?",
      key: "materialPref",
      options: ["Titanium / Ultra-lightweight", "Hand-sculpted Acetate", "Hybrid Titanium-Wood", "Rimless Minimalist"]
    },
    {
      title: "Favorite color palette?",
      key: "colorPref",
      options: ["Warm Metallics & Rose Gold", "Deep Tortoise & Amber", "Obsidian Black & Silver", "Crystal & Translucent Tones"]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-neutral-900 text-white p-6 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500 text-neutral-950 rounded-2xl flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif">Personal AI Style Finder</h3>
              <p className="text-xs text-neutral-400">Curated frame recommendation algorithm</p>
            </div>
          </div>

          <button
            onClick={() => setIsStyleFinderOpen(false)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Steps or Results */}
        <div className="p-6 overflow-y-auto">
          {!recommendation ? (
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                <span>Step {step + 1} of {quizSteps.length}</span>
                <span>{Math.round(((step + 1) / quizSteps.length) * 100)}% Complete</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${((step + 1) / quizSteps.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <h4 className="text-lg font-bold text-neutral-900 font-serif">
                {quizSteps[step].title}
              </h4>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quizSteps[step].options.map((opt, i) => {
                  const currentVal = (answers as any)[quizSteps[step].key];
                  const isSelected = currentVal === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setAnswers((prev) => ({ ...prev, [quizSteps[step].key]: opt }));
                      }}
                      className={`p-4 rounded-2xl text-left border text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                          : "bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200"
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini AI is generating your style profile...</span>
                  </>
                ) : (
                  <>
                    <span>{step < 3 ? "Continue" : "Generate Style Profile"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Result Report */
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-neutral-900 text-white p-6 rounded-3xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">Your Aesthetic Persona</span>
                <h4 className="text-2xl font-black font-serif text-white">{recommendation.profileTitle}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{recommendation.personaDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Recommended Shapes</span>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.recommendedShapes?.map((s: string, idx: number) => (
                      <span key={idx} className="text-xs font-bold text-neutral-900 bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Recommended Palette</span>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.recommendedColors?.map((c: string, idx: number) => (
                      <span key={idx} className="text-xs font-bold text-neutral-900 bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950">
                <span className="font-bold block mb-1">Stylist Advice:</span>
                {recommendation.advice}
              </div>

              <button
                onClick={() => {
                  setIsStyleFinderOpen(false);
                  navigateToCatalog("all");
                }}
                className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Browse Your Tailored Collection</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
