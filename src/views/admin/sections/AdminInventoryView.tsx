import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Boxes, Search, AlertTriangle, Plus, Minus, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";

export const AdminInventoryView: React.FC = () => {
  const { products, updateStockCount } = useAdmin();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "low" | "out" | "healthy">("all");

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === "low") return p.stockCount <= p.lowStockThreshold && p.stockCount > 0;
    if (filterStatus === "out") return p.stockCount === 0;
    if (filterStatus === "healthy") return p.stockCount > p.lowStockThreshold;
    return true;
  });

  const lowStockCount = products.filter((p) => p.stockCount <= p.lowStockThreshold && p.stockCount > 0).length;
  const outOfStockCount = products.filter((p) => p.stockCount === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-400" /> Real-time Inventory & Stock Telemetry
          </h2>
          <p className="text-xs text-neutral-400">Monitor stock levels, reorder thresholds, suppliers, and cost margins</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> {lowStockCount} Low Stock
          </span>
          <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> {outOfStockCount} Out of Stock
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "all" ? "bg-amber-500 text-neutral-950" : "bg-neutral-950 text-neutral-400 hover:text-white"
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setFilterStatus("low")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "low" ? "bg-amber-500 text-neutral-950" : "bg-neutral-950 text-neutral-400 hover:text-white"
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterStatus("out")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === "out" ? "bg-red-500 text-white" : "bg-neutral-950 text-neutral-400 hover:text-white"
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300 border-collapse">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Retail / Cost</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={p.primaryImage} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-neutral-800" />
                      <div>
                        <p className="font-bold text-white text-sm">{p.name}</p>
                        <p className="text-[10px] text-neutral-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{p.sku}</td>

                  <td className="py-3 px-4 text-neutral-300">{p.supplier || "Japan Atelier"}</td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-white">${p.price}</span>
                    <span className="text-[10px] text-neutral-500 block">Cost: ${p.costPrice || Math.round(p.price * 0.4)}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold px-2.5 py-1 rounded-full text-[11px] border ${
                        p.stockCount === 0
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : p.stockCount <= p.lowStockThreshold
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {p.stockCount} units
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateStockCount(p.id, -1)}
                        className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-bold"
                        title="Reduce by 1"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => updateStockCount(p.id, 5)}
                        className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500 hover:text-neutral-950 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-all"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => updateStockCount(p.id, 20)}
                        className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500 hover:text-neutral-950 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-all"
                      >
                        +20
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
