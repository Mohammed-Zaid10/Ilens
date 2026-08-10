import React, { useState } from "react";
import { AdminProvider, useAdmin } from "../../context/AdminContext";
import { AdminSidebar } from "./components/AdminSidebar";
import { AdminHeader } from "./components/AdminHeader";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboardHome } from "./sections/AdminDashboardHome";
import { AdminProductsView } from "./sections/AdminProductsView";
import { AdminCategoriesView } from "./sections/AdminCategoriesView";
import { AdminInventoryView } from "./sections/AdminInventoryView";
import { AdminOrdersView } from "./sections/AdminOrdersView";
import { AdminCustomersView } from "./sections/AdminCustomersView";
import { AdminPrescriptionsView } from "./sections/AdminPrescriptionsView";
import { AdminTryOnView } from "./sections/AdminTryOnView";
import { AdminCouponsView } from "./sections/AdminCouponsView";
import { AdminReviewsView } from "./sections/AdminReviewsView";
import { AdminAppointmentsView } from "./sections/AdminAppointmentsView";
import { AdminStoreLocationsView } from "./sections/AdminStoreLocationsView";
import { AdminContentView } from "./sections/AdminContentView";
import { AdminAnalyticsView } from "./sections/AdminAnalyticsView";
import { AdminSettingsView } from "./sections/AdminSettingsView";
import { AdminSection } from "../../types/admin";

interface AdminLayoutContentProps {
  initialSection?: AdminSection;
}

const AdminLayoutContent: React.FC<AdminLayoutContentProps> = ({ initialSection }) => {
  const { isAdminAuthenticated, activeSection, setActiveSection } = useAdmin();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  React.useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboardHome />;
      case "products":
        return <AdminProductsView />;
      case "categories":
        return <AdminCategoriesView />;
      case "inventory":
        return <AdminInventoryView />;
      case "orders":
        return <AdminOrdersView />;
      case "customers":
        return <AdminCustomersView />;
      case "prescriptions":
        return <AdminPrescriptionsView />;
      case "tryon":
        return <AdminTryOnView />;
      case "coupons":
        return <AdminCouponsView />;
      case "reviews":
        return <AdminReviewsView />;
      case "appointments":
        return <AdminAppointmentsView />;
      case "stores":
        return <AdminStoreLocationsView />;
      case "content":
        return <AdminContentView />;
      case "analytics":
        return <AdminAnalyticsView />;
      case "settings":
        return <AdminSettingsView />;
      default:
        return <AdminDashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      {/* Fixed Left Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Workspace Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Top Header */}
        <AdminHeader onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC<{ section?: AdminSection }> = ({ section }) => {
  return (
    <AdminProvider>
      <AdminLayoutContent initialSection={section} />
    </AdminProvider>
  );
};
