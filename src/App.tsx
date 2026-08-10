import React, { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SEOHead } from "./components/SEOHead";
import { HomeView } from "./views/HomeView";
import { CatalogView } from "./views/CatalogView";
import { ProductDetailView } from "./views/ProductDetailView";
import { CheckoutView } from "./views/CheckoutView";
import { OrderConfirmationView } from "./views/OrderConfirmationView";
import { OrderTrackingView } from "./views/OrderTrackingView";
import { AccountView } from "./views/AccountView";
import { LoginView } from "./views/LoginView";
import { SignUpView } from "./views/SignUpView";
import { ForgotPasswordView } from "./views/ForgotPasswordView";
import { StoreLocatorView } from "./views/StoreLocatorView";
import { EyeTestBookingView } from "./views/EyeTestBookingView";
import { ILensCircleView } from "./views/ILensCircleView";
import { StaticPageView } from "./views/StaticPageView";
import { TryOnView } from "./views/TryOnView";
import { TryOnCalibrationView } from "./views/TryOnCalibrationView";
import { NotFoundView } from "./views/NotFoundView";
import { AdminLayout } from "./views/admin/AdminLayout";

import { CartDrawer } from "./components/CartDrawer";
import { CompareDrawer } from "./components/CompareDrawer";
import { AiAssistantModal } from "./components/AiAssistantModal";
import { VirtualTryOnModal } from "./components/VirtualTryOnModal";
import { FaceShapeFinderModal } from "./components/FaceShapeFinderModal";
import { AiStyleFinderModal } from "./components/AiStyleFinderModal";
import { CameraSearchModal } from "./components/CameraSearchModal";
import { FrameSizeGuideModal } from "./components/FrameSizeGuideModal";
import { LensCustomizationModal } from "./components/LensCustomizationModal";

import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

const AppContent: React.FC = () => {
  const { activeView, setActiveView, isAuthenticated, authLoading, notifications, dismissNotification, products } = useApp();

  // Listen to hash / URL for direct /admin navigation
  useEffect(() => {
    const handleUrlCheck = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      if (hash === "#admin" || hash.startsWith("#admin/") || path === "/admin" || path.startsWith("/admin/")) {
        setActiveView({ type: "admin" });
      }
    };

    handleUrlCheck();
    window.addEventListener("hashchange", handleUrlCheck);
    return () => window.removeEventListener("hashchange", handleUrlCheck);
  }, []);

  // If in Admin Mode, render the full dedicated Admin Layout workspace
  if (activeView.type === "admin") {
    return <AdminLayout section={activeView.section} />;
  }

  const renderCurrentView = () => {
    switch (activeView.type) {
      case "home":
        return <HomeView />;

      case "catalog":
        return <CatalogView />;

      case "product-detail":
        return <ProductDetailView productId={activeView.productId} />;

      case "checkout":
        return <CheckoutView />;

      case "order-confirmation":
        return <OrderConfirmationView order={activeView.order} />;

      case "order-tracking":
        return <OrderTrackingView orderId={activeView.orderId} />;

      case "login":
        return <LoginView />;

      case "signup":
        return <SignUpView />;

      case "forgot-password":
        return <ForgotPasswordView />;

      case "account":
        if (authLoading) {
          return (
            <div className="py-24 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-neutral-500">Loading ILens Account...</p>
            </div>
          );
        }
        if (!isAuthenticated) {
          return <LoginView />;
        }
        return <AccountView tab={activeView.tab} />;

      case "stores":
        return <StoreLocatorView />;

      case "eye-test-booking":
        return <EyeTestBookingView storeId={activeView.storeId} />;

      case "circle":
        return <ILensCircleView />;

      case "try-on":
        return <TryOnView initialProductId={activeView.productId} />;

      case "try-on-calibration":
        return <TryOnCalibrationView productId={activeView.productId} />;

      case "static-page":
        return <StaticPageView pageSlug={activeView.pageSlug} />;

      case "404":
        return <NotFoundView />;

      default:
        return <NotFoundView />;
    }
  };


  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      {/* Dynamic SEO Meta Tag Manager */}
      <SEOHead activeView={activeView} products={products} />

      {/* Toast Notifications Overlay */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 text-xs font-bold transition-all animate-in slide-in-from-bottom-2 duration-300 ${
              n.type === "success"
                ? "bg-neutral-900 text-white border-neutral-800"
                : n.type === "warning"
                ? "bg-amber-50 text-amber-950 border-amber-300"
                : "bg-white text-neutral-900 border-neutral-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {n.type === "success" && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
              {n.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
              {n.type === "info" && <Info className="w-4 h-4 text-amber-600 shrink-0" />}
              <span>{n.message}</span>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Primary Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <CompareDrawer />
      <AiAssistantModal />
      <VirtualTryOnModal />
      <FaceShapeFinderModal />
      <AiStyleFinderModal />
      <CameraSearchModal />
      <FrameSizeGuideModal />
      <LensCustomizationModal />

      {/* Primary Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
