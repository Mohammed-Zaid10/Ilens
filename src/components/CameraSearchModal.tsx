import React, { useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import { X, Camera, Upload, Sparkles, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";

export const CameraSearchModal: React.FC = () => {
  const { isCameraSearchOpen, setIsCameraSearchOpen, navigateToCatalog } = useApp();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isCameraSearchOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setMatchData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    if (!imagePreview) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini/camera-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: imagePreview })
      });
      const json = await res.json();
      setMatchData(json.matchCriteria || json.fallback);
    } catch (e) {
      console.error(e);
      setMatchData({
        shape: "square",
        category: "eyeglasses",
        primaryColor: "black",
        material: "acetate",
        keywords: ["square", "black", "acetate", "classic"]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-neutral-900 text-white p-6 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500 text-neutral-950 rounded-2xl flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif">Visual Camera Search</h3>
              <p className="text-xs text-neutral-400">Snap or upload a picture of glasses to find matching ILens frames</p>
            </div>
          </div>

          <button
            onClick={() => setIsCameraSearchOpen(false)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!matchData ? (
            <div className="space-y-6 text-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50 rounded-3xl p-8 cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative w-44 h-44 rounded-2xl overflow-hidden shadow-md">
                    <img src={imagePreview} alt="Glasses photo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white text-amber-600 rounded-2xl flex items-center justify-center shadow-xs border border-neutral-200">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-neutral-900 block">
                        Upload a photo of any eyewear frame
                      </span>
                      <span className="text-xs text-neutral-500">Supports magazines, social photos, screenshots</span>
                    </div>
                  </>
                )}
              </div>

              {imagePreview && (
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Matching visual features with ILens Catalog...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Find Similar ILens Glasses</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-amber-950 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider block">Identified Visual Attributes</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-white px-3 py-1 rounded-full border border-amber-200 font-bold">
                    Shape: {matchData.shape}
                  </span>
                  <span className="bg-white px-3 py-1 rounded-full border border-amber-200 font-bold">
                    Color: {matchData.primaryColor}
                  </span>
                  <span className="bg-white px-3 py-1 rounded-full border border-amber-200 font-bold">
                    Material: {matchData.material}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCameraSearchOpen(false);
                  navigateToCatalog(matchData.category || "all", matchData.shape);
                }}
                className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>View Matching Frames in Catalog</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
