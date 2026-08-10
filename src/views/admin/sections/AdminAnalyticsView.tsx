import React from "react";
import { useAdmin } from "../../../context/AdminContext";
import { TrendingUp, DollarSign, Sparkles, PieChart, BarChart2, Eye } from "lucide-react";

export const AdminAnalyticsView: React.FC = () => {
  const { products, orders } = useAdmin();

  const totalRev = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" /> Executive Analytics & AR Intelligence
        </h2>
        <p className="text-xs text-neutral-400">Financial revenue breakdown, 3D try-on conversion telemetry, and popular frame geometry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 space-y-2">
          <span className="text-xs font-bold text-neutral-400">Total Store Revenue</span>
          <p className="text-3xl font-black text-white font-mono">${totalRev.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-400 font-bold">+18.2% vs last month</p>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 space-y-2">
          <span className="text-xs font-bold text-neutral-400">3D AR Try-On Conversion</span>
          <p className="text-3xl font-black text-purple-400 font-mono">34.2%</p>
          <p className="text-[10px] text-purple-300 font-bold">14,820 real-time face tracking sessions</p>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 space-y-2">
          <span className="text-xs font-bold text-neutral-400">Rx Lens Upsell Rate</span>
          <p className="text-3xl font-black text-amber-400 font-mono">78.5%</p>
          <p className="text-[10px] text-neutral-400">Progressive & 1.67 High Index Lenses</p>
        </div>
      </div>

      {/* Category Sales Breakdown */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <PieChart className="w-4 h-4 text-amber-400" /> Sales Revenue Distribution by Category
        </h3>

        <div className="space-y-3">
          {[
            { name: "Optical Eyeglasses (Japanese Titanium)", pct: 58, rev: "$142,800", color: "bg-amber-500" },
            { name: "Designer Sunglasses (Polarized)", pct: 24, rev: "$59,000", color: "bg-purple-500" },
            { name: "Blue Light Blockers", pct: 12, rev: "$29,500", color: "bg-blue-500" },
            { name: "Contact Lenses", pct: 6, rev: "$14,700", color: "bg-emerald-500" }
          ].map((cat, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-white">{cat.name}</span>
                <span className="font-mono text-amber-400">{cat.rev} ({cat.pct}%)</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                <div className={`h-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
