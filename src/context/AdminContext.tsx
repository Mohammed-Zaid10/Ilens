import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AdminProduct,
  AdminCustomer,
  PendingPrescription,
  Coupon,
  ProductReview,
  AdminAppointment,
  CMSContent,
  AdminStoreSettings,
  AdminSection
} from "../types/admin";
import { Order, StoreLocation } from "../types";
import {
  INITIAL_ADMIN_PRODUCTS,
  INITIAL_ADMIN_ORDERS,
  INITIAL_ADMIN_CUSTOMERS,
  INITIAL_PENDING_PRESCRIPTIONS,
  INITIAL_ADMIN_COUPONS,
  INITIAL_PRODUCT_REVIEWS,
  INITIAL_ADMIN_APPOINTMENTS,
  INITIAL_ADMIN_STORES,
  INITIAL_CMS_CONTENT,
  INITIAL_STORE_SETTINGS
} from "../data/adminMockData";

interface AdminContextType {
  // Auth State
  isAdminAuthenticated: boolean;
  adminRole: "Super Admin" | "Inventory Manager" | "Optometrist Admin";
  adminPasscode: string;
  adminEmail: string;
  authorizedEmail: string;
  loginAdmin: (passcodeOrEmail: string) => boolean;
  logoutAdmin: () => void;

  // Active Section
  activeSection: AdminSection;
  setActiveSection: (sec: AdminSection) => void;

  // Products & Inventory
  products: AdminProduct[];
  addProduct: (product: Omit<AdminProduct, "id">) => void;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  updateStockCount: (id: string, deltaOrValue: number, isDirectSet?: boolean) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: Order["status"], trackingNumber?: string) => void;

  // Customers
  customers: AdminCustomer[];

  // Prescriptions
  prescriptions: PendingPrescription[];
  updatePrescriptionStatus: (rxId: string, status: PendingPrescription["status"], notes?: string) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, "id">) => void;
  toggleCouponStatus: (id: string) => void;
  deleteCoupon: (id: string) => void;

  // Reviews
  reviews: ProductReview[];
  updateReviewStatus: (reviewId: string, status: ProductReview["status"]) => void;
  addReviewReply: (reviewId: string, replyText: string) => void;

  // Appointments
  appointments: AdminAppointment[];
  updateAppointmentStatus: (aptId: string, status: AdminAppointment["status"]) => void;

  // Store Locations
  stores: StoreLocation[];
  addStore: (store: Omit<StoreLocation, "id">) => void;
  updateStore: (id: string, updates: Partial<StoreLocation>) => void;
  deleteStore: (id: string) => void;

  // CMS Content
  cmsContent: CMSContent;
  updateCmsContent: (updates: Partial<CMSContent>) => void;

  // Store Settings
  settings: AdminStoreSettings;
  updateSettings: (updates: Partial<AdminStoreSettings>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authorizedEmail = "mohdzaid76771@gmail.com";
  
  // Authentication - persists in localStorage
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("ilens_admin_authed") === "true";
  });
  const [adminRole] = useState<"Super Admin" | "Inventory Manager" | "Optometrist Admin">("Super Admin");
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem("ilens_admin_email") || authorizedEmail;
  });
  const adminPasscode = "admin123";

  // Navigation
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

  // State Management with local persistence fallback
  const [products, setProducts] = useState<AdminProduct[]>(() => {
    try {
      const saved = localStorage.getItem("ilens_admin_products");
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_PRODUCTS;
    } catch {
      return INITIAL_ADMIN_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("ilens_admin_orders");
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_ORDERS;
    } catch {
      return INITIAL_ADMIN_ORDERS;
    }
  });

  const [customers] = useState<AdminCustomer[]>(INITIAL_ADMIN_CUSTOMERS);

  const [prescriptions, setPrescriptions] = useState<PendingPrescription[]>(() => {
    try {
      const saved = localStorage.getItem("ilens_admin_prescriptions");
      return saved ? JSON.parse(saved) : INITIAL_PENDING_PRESCRIPTIONS;
    } catch {
      return INITIAL_PENDING_PRESCRIPTIONS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem("ilens_admin_coupons");
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_COUPONS;
    } catch {
      return INITIAL_ADMIN_COUPONS;
    }
  });

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem("ilens_admin_reviews");
      return saved ? JSON.parse(saved) : INITIAL_PRODUCT_REVIEWS;
    } catch {
      return INITIAL_PRODUCT_REVIEWS;
    }
  });

  const [appointments, setAppointments] = useState<AdminAppointment[]>(() => {
    try {
      const saved = localStorage.getItem("ilens_admin_appointments");
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_APPOINTMENTS;
    } catch {
      return INITIAL_ADMIN_APPOINTMENTS;
    }
  });

  const [stores, setStores] = useState<StoreLocation[]>(() => {
    try {
      const saved = localStorage.getItem("ilens_admin_stores");
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_STORES;
    } catch {
      return INITIAL_ADMIN_STORES;
    }
  });

  const [cmsContent, setCmsContent] = useState<CMSContent>(INITIAL_CMS_CONTENT);
  const [settings, setSettings] = useState<AdminStoreSettings>(INITIAL_STORE_SETTINGS);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("ilens_admin_products", JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem("ilens_admin_orders", JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("ilens_admin_prescriptions", JSON.stringify(prescriptions));
    } catch (e) {
      console.error(e);
    }
  }, [prescriptions]);

  useEffect(() => {
    try {
      localStorage.setItem("ilens_admin_coupons", JSON.stringify(coupons));
    } catch (e) {
      console.error(e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem("ilens_admin_stores", JSON.stringify(stores));
    } catch (e) {
      console.error(e);
    }
  }, [stores]);

  // Auth Methods
  const loginAdmin = (passcodeOrEmail: string): boolean => {
    const input = passcodeOrEmail.trim().toLowerCase();
    const isMatch =
      input === authorizedEmail.toLowerCase() ||
      input === adminPasscode.toLowerCase() ||
      input === "admin";

    if (isMatch) {
      setIsAdminAuthenticated(true);
      setAdminEmail(authorizedEmail);
      localStorage.setItem("ilens_admin_authed", "true");
      localStorage.setItem("ilens_admin_email", authorizedEmail);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem("ilens_admin_authed");
  };

  // Products CRUD
  const addProduct = (newProdData: Omit<AdminProduct, "id">) => {
    const id = `il-${Date.now().toString().slice(-4)}`;
    const newProduct: AdminProduct = {
      ...newProdData,
      id
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<AdminProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStockCount = (id: string, deltaOrValue: number, isDirectSet: boolean = false) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = isDirectSet ? Math.max(0, deltaOrValue) : Math.max(0, p.stockCount + deltaOrValue);
          return {
            ...p,
            stockCount: newStock,
            inStock: newStock > 0
          };
        }
        return p;
      })
    );
  };

  // Orders CRUD
  const updateOrderStatus = (orderId: string, newStatus: Order["status"], trackingNumber?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: newStatus,
            trackingNumber: trackingNumber || ord.trackingNumber
          };
        }
        return ord;
      })
    );
  };

  // Prescriptions CRUD
  const updatePrescriptionStatus = (rxId: string, status: PendingPrescription["status"], notes?: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) => {
        if (rx.id === rxId) {
          return {
            ...rx,
            status,
            notes: notes ? `${rx.notes || ''} [Updated]: ${notes}` : rx.notes
          };
        }
        return rx;
      })
    );
  };

  // Coupons CRUD
  const addCoupon = (couponData: Omit<Coupon, "id">) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `CPN-${Date.now().toString().slice(-4)}`
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "Active" ? "Disabled" : "Active" } : c))
    );
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  // Reviews Moderation
  const updateReviewStatus = (reviewId: string, status: ProductReview["status"]) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
  };

  const addReviewReply = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reply: replyText } : r))
    );
  };

  // Appointments
  const updateAppointmentStatus = (aptId: string, status: AdminAppointment["status"]) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === aptId ? { ...apt, status } : apt))
    );
  };

  // Stores CRUD
  const addStore = (storeData: Omit<StoreLocation, "id">) => {
    const newStore: StoreLocation = {
      ...storeData,
      id: `store-${Date.now().toString().slice(-4)}`
    };
    setStores((prev) => [newStore, ...prev]);
  };

  const updateStore = (id: string, updates: Partial<StoreLocation>) => {
    setStores((prev) =>
      prev.map((st) => (st.id === id ? { ...st, ...updates } : st))
    );
  };

  const deleteStore = (id: string) => {
    setStores((prev) => prev.filter((st) => st.id !== id));
  };

  // CMS Content
  const updateCmsContent = (updates: Partial<CMSContent>) => {
    setCmsContent((prev) => ({ ...prev, ...updates }));
  };

  // Settings
  const updateSettings = (updates: Partial<AdminStoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminAuthenticated,
        adminRole,
        adminPasscode,
        adminEmail,
        authorizedEmail,
        loginAdmin,
        logoutAdmin,

        activeSection,
        setActiveSection,

        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStockCount,

        orders,
        updateOrderStatus,

        customers,

        prescriptions,
        updatePrescriptionStatus,

        coupons,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,

        reviews,
        updateReviewStatus,
        addReviewReply,

        appointments,
        updateAppointmentStatus,

        stores,
        addStore,
        updateStore,
        deleteStore,

        cmsContent,
        updateCmsContent,

        settings,
        updateSettings
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
