import React from "react";
import { useApp } from "../context/AppContext";
import { Search, Home, ShoppingBag, Eye } from "lucide-react";

export const NotFoundView: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-neutral-50 text-neutral-900">
      <div className="max-w-md w-full bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
          <Eye className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">404 Error</span>
          <h1 className="text-3xl font-black font-serif text-neutral-950">Page Not Found</h1>
          <p className="text-xs text-neutral-500 leading-relaxed">
            The optical page or frame configuration you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={() => setActiveView({ type: "home" })}
            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </button>

          <button
            onClick={() => setActiveView({ type: "catalog", category: "all" })}
            className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Shop Eyewear</span>
          </button>

          <button
            onClick={() => setActiveView({ type: "catalog", category: "all" })}
            className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-xs rounded-xl flex items-center justify-center space-x-2 transition border border-neutral-200"
          >
            <Search className="w-4 h-4" />
            <span>Search Catalog</span>
          </button>
        </div>
      </div>
    </div>
  );
};
