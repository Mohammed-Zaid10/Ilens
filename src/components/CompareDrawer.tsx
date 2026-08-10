import React from "react";
import { useApp } from "../context/AppContext";
import { X, Trash2, ShoppingBag, Check, Layers } from "lucide-react";

export const CompareDrawer: React.FC = () => {
  const {
    isCompareOpen,
    setIsCompareOpen,
    compareList,
    toggleCompare,
    clearCompare,
    formatPrice,
    addToCart
  } = useApp();

  if (!isCompareOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-6xl bg-white rounded-t-3xl shadow-2xl border-t border-neutral-200 overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="bg-neutral-900 text-white p-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-amber-500 text-neutral-950 rounded-xl flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif">Compare Frame Specifications</h3>
              <p className="text-xs text-neutral-400">Comparing {compareList.length} ILens frames side-by-side</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="text-xs text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-2 text-neutral-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-x-auto">
          {compareList.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              No frames selected for comparison. Click the compare icon on any product card!
            </div>
          ) : (
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-3 bg-neutral-50 text-neutral-500 font-bold uppercase w-32 border border-neutral-200">
                    Feature
                  </th>
                  {compareList.map((p) => (
                    <th key={p.id} className="p-3 border border-neutral-200 text-center w-56">
                      <div className="relative group">
                        <button
                          onClick={() => toggleCompare(p)}
                          className="absolute -top-2 -right-2 bg-neutral-200 hover:bg-neutral-900 hover:text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <img src={p.primaryImage} alt={p.name} className="w-full h-24 object-contain mb-2" />
                        <span className="font-bold text-neutral-900 block font-serif text-sm">{p.name}</span>
                        <span className="text-amber-600 font-extrabold text-sm block mt-0.5">{formatPrice(p.price)}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr>
                  <td className="p-3 bg-neutral-50 font-bold text-neutral-700 border border-neutral-200">
                    Category
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 border border-neutral-200 text-center capitalize font-semibold">
                      {p.category}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-neutral-50 font-bold text-neutral-700 border border-neutral-200">
                    Frame Shape
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 border border-neutral-200 text-center capitalize">
                      {p.frameShape}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-neutral-50 font-bold text-neutral-700 border border-neutral-200">
                    Material
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 border border-neutral-200 text-center capitalize">
                      {p.material.replace("_", " ")}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-neutral-50 font-bold text-neutral-700 border border-neutral-200">
                    Sizing (Width)
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 border border-neutral-200 text-center font-mono">
                      {p.dimensions.lensWidthMm}-{p.dimensions.bridgeWidthMm}-{p.dimensions.templeLengthMm} mm
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-neutral-50 font-bold text-neutral-700 border border-neutral-200">
                    Face Suitability
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 border border-neutral-200 text-center">
                      <div className="flex flex-wrap justify-center gap-1">
                        {p.suitableFaceShapes.map((f, i) => (
                          <span key={i} className="px-2 py-0.5 bg-neutral-100 rounded text-[10px]">
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 bg-neutral-50 font-bold text-neutral-700 border border-neutral-200">
                    Action
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-3 border border-neutral-200 text-center">
                      <button
                        onClick={() => {
                          addToCart(p);
                          setIsCompareOpen(false);
                        }}
                        className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
