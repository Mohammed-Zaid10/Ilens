import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { useApp } from "../../../context/AppContext";
import { Sparkles, Sliders, Play, Glasses, CheckCircle2, AlertCircle, Edit2 } from "lucide-react";

export const AdminTryOnView: React.FC = () => {
  const { products, updateProduct } = useAdmin();
  const { setActiveView } = useApp();

  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" /> Virtual Try-On 3D GLB & AR Calibration
          </h2>
          <p className="text-xs text-neutral-400">
            Manage WebGL Three.js 3D eyewear models, MediaPipe face tracking anchors, scale factors, and pitch/yaw rotation offsets
          </p>
        </div>
      </div>

      {/* Grid of Frames with 3D Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full font-mono border ${
                    prod.tryOnModel
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                      : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {prod.tryOnModel ? "3D GLB Active" : "2D Image Fallback"}
                </span>

                <span className="text-[10px] font-mono text-neutral-400">{prod.frameShape}</span>
              </div>

              <div className="flex items-center gap-3">
                <img src={prod.primaryImage} alt={prod.name} className="w-14 h-14 rounded-2xl object-cover border border-neutral-800 shrink-0" />
                <div>
                  <h3 className="font-extrabold text-white text-base">{prod.name}</h3>
                  <p className="text-xs text-neutral-400">{prod.brand}</p>
                  <p className="text-[10px] font-mono text-amber-400 mt-0.5">Model: {prod.tryOnModel || "None"}</p>
                </div>
              </div>

              {/* Calibration Parameters Brief */}
              <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-1 text-[11px] font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Scale Factor:</span>
                  <span className="text-white font-bold">{prod.tryOnCalibration?.scale ?? 1.0}x</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Offsets (X, Y, Z):</span>
                  <span className="text-white font-bold">
                    {prod.tryOnCalibration?.xOffset ?? 0}, {prod.tryOnCalibration?.yOffset ?? 0}, {prod.tryOnCalibration?.zOffset ?? 0}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Rotations Pitch/Yaw:</span>
                  <span className="text-white font-bold">
                    {prod.tryOnCalibration?.rotationX ?? 0}°, {prod.tryOnCalibration?.rotationY ?? 0}°
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveView({ type: "try-on", productId: prod.id })}
                className="flex-1 py-2 bg-purple-500 hover:bg-purple-400 text-neutral-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Live AR Try-On
              </button>

              <button
                onClick={() => setActiveView({ type: "try-on-calibration", productId: prod.id })}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs rounded-xl border border-neutral-700 transition-colors flex items-center gap-1"
                title="Fine-tune 3D model scale and position"
              >
                <Sliders className="w-3.5 h-3.5" /> Calibrate
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
