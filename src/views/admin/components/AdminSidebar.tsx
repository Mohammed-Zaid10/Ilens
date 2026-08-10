import React from "react";
import { useAdmin } from "../../../context/AdminContext";
import { useApp } from "../../../context/AppContext";
import { AdminSection } from "../../../types/admin";
import {
  LayoutDashboard,
  Glasses,
  Grid,
  Boxes,
  ShoppingBag,
  Users,
  FileText,
  Sparkles,
  Tag,
  Star,
  Calendar,
  Building2,
  FileCode,
  TrendingUp,
  Settings,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X
} from "lucide-react";

interface AdminSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed
}) => {
  const { activeSection, setActiveSection, prescriptions, products, orders, logoutAdmin, adminEmail } = useAdmin();
  const { setActiveView } = useApp();

  // Counts for badges
  const pendingRxCount = prescriptions.filter((r) => r.status === "Pending Verification").length;
  const lowStockCount = products.filter((p) => p.stockCount <= p.lowStockThreshold).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "Processing" || o.status === "Confirmed").length;

  const navItems: { id: AdminSection; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Glasses },
    { id: "categories", label: "Categories", icon: Grid },
    {
      id: "inventory",
      label: "Inventory",
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeColor: "bg-amber-500/20 text-amber-400 border border-amber-500/30"
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
    },
    { id: "customers", label: "Customers", icon: Users },
    {
      id: "prescriptions",
      label: "Prescriptions",
      icon: FileText,
      badge: pendingRxCount > 0 ? pendingRxCount : undefined,
      badgeColor: "bg-red-500/20 text-red-400 border border-red-500/30"
    },
    { id: "tryon", label: "Virtual Try-On", icon: Sparkles },
    { id: "coupons", label: "Offers & Coupons", icon: Tag },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "stores", label: "Store Locations", icon: Building2 },
    { id: "content", label: "Content (CMS)", icon: FileCode },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-neutral-950 text-neutral-300 border-r border-neutral-800/80 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-black text-xl tracking-tighter shadow-lg shadow-amber-500/10">
            iL
          </div>
          {!isCollapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight font-mono">iLENS</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 rounded border border-amber-500/30">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium">Eyewear Commerce OS</p>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Toggle */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Profile Brief */}
      {!isCollapsed && (
        <div className="px-4 py-3 bg-neutral-900/60 border-b border-neutral-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-left leading-none min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Super Admin</p>
              <p className="text-[10px] text-amber-400 font-mono mt-0.5 truncate" title={adminEmail}>
                {adminEmail}
              </p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online"></div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                isActive
                  ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/80"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-amber-400" : "text-neutral-400"}`} />
              {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
              {!isCollapsed && item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor || "bg-neutral-800 text-neutral-300"}`}>
                  {item.badge}
                </span>
              )}

              {/* Tooltip on Collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-neutral-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-neutral-700 shadow-xl">
                  {item.label}
                  {item.badge !== undefined && ` (${item.badge})`}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer Actions */}
      <div className="p-3 border-t border-neutral-800/80 space-y-2 bg-neutral-950">
        <button
          onClick={() => setActiveView({ type: "home" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 transition-colors"
          title="Switch to customer website"
        >
          <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
          {!isCollapsed && <span className="truncate">View Customer Store</span>}
        </button>

        <button
          onClick={logoutAdmin}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
          title="Sign out of Admin Dashboard"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out Admin</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 z-50 w-72 transition-transform duration-300 ease-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
