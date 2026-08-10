import React from "react";
import { useAdmin } from "../../../context/AdminContext";
import {
  DollarSign,
  ShoppingBag,
  Boxes,
  FileText,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Plus,
  Eye,
  RefreshCw,
  Award
} from "lucide-react";

export const AdminDashboardHome: React.FC = () => {
  const {
    products,
    orders,
    prescriptions,
    setActiveSection,
    updateOrderStatus,
    updateStockCount,
    updatePrescriptionStatus
  } = useAdmin();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingRx = prescriptions.filter((r) => r.status === "Pending Verification");
  const lowStockItems = products.filter((p) => p.stockCount <= p.lowStockThreshold);
  const totalSalesCount = products.reduce((sum, p) => sum + p.salesCount, 0);

  const stats = [
    {
      label: "Total Sales Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+18.4% vs last month",
      icon: DollarSign,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      label: "Active Orders",
      value: orders.length.toString(),
      change: `${orders.filter((o) => o.status === "Order Placed").length} pending crafting`,
      icon: ShoppingBag,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      label: "Rx Review Queue",
      value: pendingRx.length.toString(),
      change: pendingRx.length > 0 ? "Requires action" : "All verified",
      icon: FileText,
      color: pendingRx.length > 0 ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      label: "Low Stock Products",
      value: lowStockItems.length.toString(),
      change: `${lowStockItems.length} below reorder point`,
      icon: Boxes,
      color: lowStockItems.length > 0 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-neutral-400 bg-neutral-800"
    },
    {
      label: "3D AR Try-On Sessions",
      value: "14,820",
      change: "+34.2% conversion rate",
      icon: Sparkles,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
    },
    {
      label: "Avg. Order Value",
      value: `$${Math.round(totalRevenue / (orders.length || 1))}`,
      change: "Japanese Titanium + Lens",
      icon: TrendingUp,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 p-6 rounded-3xl border border-neutral-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider font-bold">
            <Award className="w-4 h-4" /> Real-time Store Control Center
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ILens Eyewear Operating System
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl">
            Live telemetry for Japanese Titanium inventory, 3D AR Virtual Try-On sessions, optical prescription verification, and order fulfillment.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSection("products")}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
          <button
            onClick={() => setActiveSection("prescriptions")}
            className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl border border-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-amber-400" /> Verify Rx ({pendingRx.length})
          </button>
          <button
            onClick={() => setActiveSection("inventory")}
            className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl border border-neutral-700 transition-colors flex items-center gap-1.5"
          >
            <Boxes className="w-4 h-4 text-amber-400" /> Stock ({lowStockItems.length} low)
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-neutral-400 truncate">{s.label}</span>
                <div className={`p-2 rounded-xl border ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">{s.value}</p>
                <p className="text-[10px] font-medium text-neutral-400 mt-1 truncate">{s.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Layout: Sales Visualizer & Pending Rx Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend Visualizer */}
        <div className="lg:col-span-2 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" /> Monthly Revenue & Order Volume
              </h3>
              <p className="text-xs text-neutral-400">Aggregated sales across prescription & sunglass lines</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
              +24% YoY
            </span>
          </div>

          {/* Simple Clean Bar Visualizer */}
          <div className="h-44 pt-4 flex items-end justify-between gap-2 border-b border-neutral-800 pb-2">
            {[
              { month: "Jan", rev: 32, label: "$32k" },
              { month: "Feb", rev: 41, label: "$41k" },
              { month: "Mar", rev: 38, label: "$38k" },
              { month: "Apr", rev: 52, label: "$52k" },
              { month: "May", rev: 64, label: "$64k" },
              { month: "Jun", rev: 58, label: "$58k" },
              { month: "Jul", rev: 72, label: "$72k" },
              { month: "Aug", rev: 89, label: "$89k", active: true }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono text-neutral-400 group-hover:text-amber-300 transition-colors">
                  {bar.label}
                </span>
                <div
                  className={`w-full rounded-t-xl transition-all ${
                    bar.active
                      ? "bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/20"
                      : "bg-neutral-800 hover:bg-neutral-700"
                  }`}
                  style={{ height: `${(bar.rev / 90) * 120}px` }}
                />
                <span className="text-[10px] font-bold text-neutral-400">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Current Month Target ($90,000)
            </span>
            <span className="font-mono text-white font-bold">98.8% Reached</span>
          </div>
        </div>

        {/* Pending Prescription Queue Widget */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-400" /> Pending Rx Review Queue
            </h3>
            <button
              onClick={() => setActiveSection("prescriptions")}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-64 custom-scrollbar">
            {pendingRx.map((rx) => (
              <div key={rx.id} className="p-3 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{rx.customerName}</span>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {rx.orderId}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 font-mono flex items-center gap-3">
                  <span>OD: {rx.odSph} / {rx.odCyl}</span>
                  <span>OS: {rx.osSph} / {rx.osCyl}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80 text-xs">
                  <span className="text-[10px] text-neutral-400">{rx.doctorName || "Uploaded Rx File"}</span>
                  <button
                    onClick={() => updatePrescriptionStatus(rx.id, "Approved")}
                    className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg font-bold text-[10px] transition-colors"
                  >
                    Approve Rx
                  </button>
                </div>
              </div>
            ))}

            {pendingRx.length === 0 && (
              <div className="py-12 text-center text-neutral-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-neutral-300">All Prescriptions Verified!</p>
                <p className="text-[11px]">No optical records waiting in queue.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Layout: Recent Orders & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Feed */}
        <div className="lg:col-span-2 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" /> Recent Customer Orders
              </h3>
              <p className="text-xs text-neutral-400">Real-time status updates from shopping bag to delivery</p>
            </div>
            <button
              onClick={() => setActiveSection("orders")}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              Manage Orders <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300 border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-400">{ord.id}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-white">{ord.shippingAddress.fullName}</p>
                      <p className="text-[10px] text-neutral-400">{ord.shippingAddress.city}, {ord.shippingAddress.state}</p>
                    </td>
                    <td className="py-3 px-3">
                      {ord.items[0]?.product.name || "Custom Frame"}
                      {ord.items.length > 1 && <span className="text-[10px] text-neutral-400"> +{ord.items.length - 1} more</span>}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">${ord.total}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                          ord.status === "Delivered"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : ord.status === "Shipped"
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActiveSection("orders")}
                        className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white"
                        title="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Reorder Alerts */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Low Stock Warning
            </h3>
            <button
              onClick={() => setActiveSection("inventory")}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              Inventory <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
            {lowStockItems.map((prod) => (
              <div key={prod.id} className="p-3 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={prod.primaryImage} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border border-neutral-800" />
                  <div>
                    <p className="text-xs font-bold text-white">{prod.name}</p>
                    <p className="text-[10px] text-amber-400 font-mono font-bold">
                      {prod.stockCount === 0 ? "OUT OF STOCK" : `Only ${prod.stockCount} left`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => updateStockCount(prod.id, 10)}
                  className="px-2.5 py-1.5 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 text-[10px] font-bold rounded-xl border border-neutral-700 transition-all flex items-center gap-1"
                  title="Restock 10 units"
                >
                  <Plus className="w-3 h-3" /> +10 Stock
                </button>
              </div>
            ))}

            {lowStockItems.length === 0 && (
              <div className="py-12 text-center text-neutral-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-neutral-300">Inventory Healthy!</p>
                <p className="text-[11px]">All frames & lenses above safety threshold.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
