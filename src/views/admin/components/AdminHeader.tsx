import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { useApp } from "../../../context/AppContext";
import { AdminSection } from "../../../types/admin";
import {
  Menu,
  Search,
  Bell,
  Plus,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
  Boxes,
  ShoppingBag,
  CheckCircle,
  Sparkles
} from "lucide-react";

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onOpenMobileSidebar }) => {
  const {
    activeSection,
    setActiveSection,
    prescriptions,
    products,
    orders,
    logoutAdmin
  } = useAdmin();
  const { setActiveView } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const pendingRx = prescriptions.filter((r) => r.status === "Pending Verification");
  const lowStockProducts = products.filter((p) => p.stockCount <= p.lowStockThreshold);
  const newOrders = orders.filter((o) => o.status === "Order Placed");

  const totalNotifications = pendingRx.length + lowStockProducts.length + newOrders.length;

  const sectionTitles: Record<AdminSection, string> = {
    dashboard: "Executive Overview & Store Telemetry",
    products: "Product Catalog & Eyewear Master List",
    categories: "Category & Taxonomy Configuration",
    inventory: "Real-time Stock Control & Inventory",
    orders: "Fulfillment & Lens Crafting Workflow",
    customers: "Customer Directory & Prescription Vault",
    prescriptions: "Optometric Prescription Verification Queue",
    tryon: "Virtual Try-On 3D Assets & AR Calibration",
    coupons: "Offers, Promo Codes & Campaign Engine",
    reviews: "Customer Product Reviews & Moderation",
    appointments: "In-Store Eye Exam Appointments",
    stores: "Retail Flagships & Atelier Locations",
    content: "Storefront CMS & Announcement Banners",
    analytics: "Financial Analytics & Eyewear Insights",
    settings: "Store Operations & System Settings"
  };

  return (
    <header className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 text-white px-4 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Section Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 hover:bg-neutral-800 rounded-lg text-neutral-300 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-extrabold text-white capitalize tracking-tight flex items-center gap-2">
            <span>{activeSection}</span>
            <span className="hidden sm:inline text-xs font-normal text-neutral-400">|</span>
            <span className="hidden sm:inline text-xs font-normal text-amber-400 font-mono">
              ILENS-OS v2.4
            </span>
          </h1>
          <p className="text-[11px] text-neutral-400 font-medium hidden md:block">
            {sectionTitles[activeSection] || "Manage ILens Store"}
          </p>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products, orders (e.g. IL-ORD-9842), customers, or Rx..."
          className="w-full pl-9 pr-4 py-1.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/60 transition-all font-mono"
        />
        {searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-3 z-50 text-xs">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Search Results</p>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setActiveSection("orders");
                  setSearchQuery("");
                }}
                className="w-full text-left p-2 hover:bg-neutral-800 rounded-lg flex items-center justify-between"
              >
                <span>Find order containing "{searchQuery}"</span>
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <button
                onClick={() => {
                  setActiveSection("products");
                  setSearchQuery("");
                }}
                className="w-full text-left p-2 hover:bg-neutral-800 rounded-lg flex items-center justify-between"
              >
                <span>Find product matching "{searchQuery}"</span>
                <Boxes className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowQuickActions(!showQuickActions);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-500/10"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>

          {showQuickActions && (
            <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <p className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Store Operations
              </p>
              <button
                onClick={() => {
                  setActiveSection("products");
                  setShowQuickActions(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-neutral-200 hover:text-white hover:bg-neutral-800 rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                Add New Eyewear Product
              </button>
              <button
                onClick={() => {
                  setActiveSection("coupons");
                  setShowQuickActions(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-neutral-200 hover:text-white hover:bg-neutral-800 rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                Create Coupon Code
              </button>
              <button
                onClick={() => {
                  setActiveSection("prescriptions");
                  setShowQuickActions(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-neutral-200 hover:text-white hover:bg-neutral-800 rounded-xl"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Verify Pending Prescriptions ({pendingRx.length})
              </button>
              <button
                onClick={() => {
                  setActiveSection("tryon");
                  setShowQuickActions(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-neutral-200 hover:text-white hover:bg-neutral-800 rounded-xl"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Calibrate 3D Virtual Try-On
              </button>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowQuickActions(false);
            }}
            className="p-2 hover:bg-neutral-800 rounded-xl text-neutral-300 hover:text-white relative transition-colors"
            title="System Alerts & Notifications"
          >
            <Bell className="w-4 h-4" />
            {totalNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            )}
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-red-500 text-white font-extrabold text-[9px] rounded-full border border-neutral-900">
                {totalNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" /> System Alerts
                </h4>
                <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">
                  {totalNotifications} Pending
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
                {pendingRx.length > 0 && (
                  <div
                    onClick={() => {
                      setActiveSection("prescriptions");
                      setShowNotifications(false);
                    }}
                    className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl cursor-pointer hover:bg-red-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{pendingRx.length} Prescriptions Need Review</span>
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Customers uploaded optical Rx requiring optometrist approval before lens crafting.
                    </p>
                  </div>
                )}

                {lowStockProducts.length > 0 && (
                  <div
                    onClick={() => {
                      setActiveSection("inventory");
                      setShowNotifications(false);
                    }}
                    className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl cursor-pointer hover:bg-amber-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                      <Boxes className="w-3.5 h-3.5" />
                      <span>{lowStockProducts.length} Products Low in Stock</span>
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Items like {lowStockProducts[0]?.name} have reached reorder thresholds.
                    </p>
                  </div>
                )}

                {newOrders.length > 0 && (
                  <div
                    onClick={() => {
                      setActiveSection("orders");
                      setShowNotifications(false);
                    }}
                    className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl cursor-pointer hover:bg-emerald-500/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{newOrders.length} New Orders Received</span>
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      Fresh orders waiting to enter lens crafting pipeline.
                    </p>
                  </div>
                )}

                {totalNotifications === 0 && (
                  <div className="py-6 text-center text-neutral-500 space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500/60 mx-auto" />
                    <p>All store operations clear!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Customer Store Link */}
        <button
          onClick={() => setActiveView({ type: "home" })}
          className="p-2 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors"
          title="Open Customer Store"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* Admin Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs">
            SA
          </div>
        </div>
      </div>
    </header>
  );
};
