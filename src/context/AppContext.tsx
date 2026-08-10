import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../services/firebase/firebaseConfig";
import {
  getUserProfile,
  createOrUpdateUserProfile,
  deleteUserAccount,
  FirestoreUserData
} from "../services/firebase/userService";
import { getRemoteCart, saveRemoteCart, mergeCarts } from "../services/firebase/cartService";
import { getRemoteWishlist, saveRemoteWishlist, mergeWishlists } from "../services/firebase/wishlistService";
import { getUserOrders, saveUserOrder } from "../services/firebase/orderService";
import {
  getUserAddresses,
  saveAddress,
  deleteAddress,
  setDefaultAddress,
  Address
} from "../services/firebase/addressService";
import {
  getUserPrescriptions,
  saveUserPrescription,
  deleteUserPrescription,
  PrescriptionRecord
} from "../services/firebase/prescriptionService";
import { uploadPrescriptionFileToStorage } from "../services/firebase/storageService";
import { signOutUser } from "../services/firebase/authService";

import {
  ActiveView,
  Product,
  CartItem,
  WishlistItem,
  Order,
  EyeTestBooking,
  UserProfile,
  ColorOption,
  SelectedLensConfig,
  CategoryType,
  FrameShape,
  GenderCategory
} from "../types";
import { MOCK_PRODUCTS } from "../data/products";

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  navigateToCatalog: (category?: CategoryType, shapeFilter?: FrameShape, genderFilter?: GenderCategory) => void;
  navigateToProduct: (productId: string) => void;
  navigateToStatic: (slug: "about" | "shipping" | "returns" | "warranty" | "privacy" | "terms" | "help" | "contact") => void;

  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, color?: ColorOption, lensConfig?: SelectedLensConfig, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  compareList: Product[];
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Auth & User Profile
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  user: UserProfile;
  firestoreUserData: FirestoreUserData | null;
  signOut: () => Promise<void>;
  updateProfileDetails: (firstName: string, lastName: string, phone: string) => Promise<void>;
  deleteAccount: () => Promise<void>;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;

  // Addresses
  savedAddresses: Address[];
  addAddress: (addr: Address) => Promise<void>;
  deleteAddressItem: (id: string) => Promise<void>;
  setDefaultAddressItem: (id: string) => Promise<void>;

  // Prescriptions
  savedPrescriptions: PrescriptionRecord[];
  addPrescription: (record: PrescriptionRecord, file?: File) => Promise<void>;
  deletePrescriptionItem: (id: string) => Promise<void>;

  // Eye Tests
  eyeTestBookings: EyeTestBooking[];
  addEyeTestBooking: (booking: EyeTestBooking) => void;

  currency: "USD" | "EUR" | "GBP" | "CAD";
  setCurrency: (c: "USD" | "EUR" | "GBP" | "CAD") => void;
  formatPrice: (price: number) => string;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;

  isVirtualTryOnOpen: boolean;
  setIsVirtualTryOnOpen: (open: boolean) => void;
  virtualTryOnProduct: Product | null;
  openVirtualTryOn: (product?: Product) => void;

  isFaceShapeModalOpen: boolean;
  setIsFaceShapeModalOpen: (open: boolean) => void;

  isStyleFinderOpen: boolean;
  setIsStyleFinderOpen: (open: boolean) => void;

  isCameraSearchOpen: boolean;
  setIsCameraSearchOpen: (open: boolean) => void;

  isFrameSizeGuideOpen: boolean;
  setIsFrameSizeGuideOpen: (open: boolean) => void;

  isLensCustomizerOpen: boolean;
  setIsLensCustomizerOpen: (open: boolean) => void;
  customizingProduct: Product | null;
  openLensCustomizer: (product: Product) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  notifications: { id: string; message: string; type: "success" | "info" | "warning" }[];
  showNotification: (msg: string, type?: "success" | "info" | "warning") => void;
  dismissNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const GUEST_USER: UserProfile = {
  name: "Guest Member",
  email: "guest@ilens.com",
  phone: "+1 (800) 555-ILENS",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  savedPrescriptions: [],
  savedAddresses: [],
  circlePoints: 0,
  circleTier: "Silver"
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>({ type: "home" });
  const [products] = useState<Product[]>(MOCK_PRODUCTS);

  // Auth States
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [firestoreUserData, setFirestoreUserData] = useState<FirestoreUserData | null>(null);
  const [user, setUser] = useState<UserProfile>(GUEST_USER);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("ilens_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem("ilens_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare
  const [compareList, setCompareList] = useState<Product[]>([]);

  // User Sub-collections
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [savedPrescriptions, setSavedPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [eyeTestBookings, setEyeTestBookings] = useState<EyeTestBooking[]>([]);

  // Currency
  const [currency, setCurrency] = useState<"USD" | "EUR" | "GBP" | "CAD">("USD");

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  const [isVirtualTryOnOpen, setIsVirtualTryOnOpen] = useState(false);
  const [virtualTryOnProduct, setVirtualTryOnProduct] = useState<Product | null>(null);

  const [isFaceShapeModalOpen, setIsFaceShapeModalOpen] = useState(false);
  const [isStyleFinderOpen, setIsStyleFinderOpen] = useState(false);
  const [isCameraSearchOpen, setIsCameraSearchOpen] = useState(false);
  const [isFrameSizeGuideOpen, setIsFrameSizeGuideOpen] = useState(false);

  const [isLensCustomizerOpen, setIsLensCustomizerOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: "success" | "info" | "warning" }[]>([]);

  // Listen to Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setAuthLoading(true);
      if (fUser) {
        setFirebaseUser(fUser);
        // Load or create Firestore user doc
        let profileData = await getUserProfile(fUser.uid);
        if (!profileData) {
          const nameParts = (fUser.displayName || "").split(" ");
          await createOrUpdateUserProfile(fUser.uid, {
            uid: fUser.uid,
            firstName: nameParts[0] || "Member",
            lastName: nameParts.slice(1).join(" ") || "",
            email: fUser.email || "",
            photoURL: fUser.photoURL || ""
          });
          profileData = await getUserProfile(fUser.uid);
        }

        if (profileData) {
          setFirestoreUserData(profileData);
          setUser({
            name: `${profileData.firstName} ${profileData.lastName}`.trim() || fUser.displayName || "Member",
            email: profileData.email || fUser.email || "",
            phone: profileData.phone || fUser.phoneNumber || "Not provided",
            avatar: profileData.photoURL || fUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
            savedPrescriptions: [],
            savedAddresses: [],
            circlePoints: profileData.circlePoints ?? 100,
            circleTier: profileData.circleTier || "Silver"
          });
        }

        // Fetch user subcollections
        const [remoteCart, remoteWishlist, userOrders, userAddrs, userRxs] = await Promise.all([
          getRemoteCart(fUser.uid),
          getRemoteWishlist(fUser.uid),
          getUserOrders(fUser.uid),
          getUserAddresses(fUser.uid),
          getUserPrescriptions(fUser.uid)
        ]);

        // Merge cart with local guest cart
        const guestCart = cart;
        const mergedCart = mergeCarts(guestCart, remoteCart);
        setCart(mergedCart);
        await saveRemoteCart(fUser.uid, mergedCart);

        // Merge wishlist with local guest wishlist
        const guestWishlist = wishlist;
        const mergedWishlist = mergeWishlists(guestWishlist, remoteWishlist);
        setWishlist(mergedWishlist);
        await saveRemoteWishlist(fUser.uid, mergedWishlist);

        setOrders(userOrders);
        setSavedAddresses(userAddrs);
        setSavedPrescriptions(userRxs);
      } else {
        setFirebaseUser(null);
        setFirestoreUserData(null);
        setUser(GUEST_USER);
        setOrders([]);
        setSavedAddresses([]);
        setSavedPrescriptions([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync Cart changes to Firestore or LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("ilens_cart", JSON.stringify(cart));
      if (firebaseUser) {
        saveRemoteCart(firebaseUser.uid, cart);
      }
    } catch (e) {
      console.error(e);
    }
  }, [cart, firebaseUser]);

  // Sync Wishlist changes to Firestore or LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("ilens_wishlist", JSON.stringify(wishlist));
      if (firebaseUser) {
        saveRemoteWishlist(firebaseUser.uid, wishlist);
      }
    } catch (e) {
      console.error(e);
    }
  }, [wishlist, firebaseUser]);

  const showNotification = (message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissNotification(id);
    }, 4000);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const navigateToCatalog = (category: CategoryType = "all", shapeFilter?: FrameShape, genderFilter?: GenderCategory) => {
    setActiveView({ type: "catalog", category, shapeFilter, genderFilter });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToProduct = (productId: string) => {
    setActiveView({ type: "product-detail", productId });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToStatic = (pageSlug: "about" | "shipping" | "returns" | "warranty" | "privacy" | "terms" | "help" | "contact") => {
    setActiveView({ type: "static-page", pageSlug });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (
    product: Product,
    color?: ColorOption,
    lensConfig?: SelectedLensConfig,
    quantity: number = 1
  ) => {
    const selectedColor = color || product.colors[0];
    const lensPrice = lensConfig ? lensConfig.totalLensPrice : 0;
    const totalItemPrice = (product.price + lensPrice) * quantity;

    const cartItemId = `${product.id}-${selectedColor.name}-${lensConfig ? lensConfig.usage : "no-lens"}-${Date.now()}`;

    const newItem: CartItem = {
      cartItemId,
      product,
      selectedColor,
      quantity,
      lensConfig,
      totalItemPrice
    };

    setCart((prev) => [...prev, newItem]);
    showNotification(`Added "${product.name}" to your Shopping Bag!`, "success");
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showNotification("Item removed from Shopping Bag.", "info");
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const singleUnitPrice = item.totalItemPrice / item.quantity;
            return {
              ...item,
              quantity: newQty,
              totalItemPrice: singleUnitPrice * newQty
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalItemPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.product.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.product.id !== product.id));
      showNotification(`Removed "${product.name}" from Wishlist.`, "info");
    } else {
      setWishlist((prev) => [...prev, { product, addedAt: new Date().toISOString() }]);
      showNotification(`Saved "${product.name}" to Wishlist!`, "success");
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product.id === productId);
  };

  const toggleCompare = (product: Product) => {
    const exists = compareList.some((p) => p.id === product.id);
    if (exists) {
      setCompareList((prev) => prev.filter((p) => p.id !== product.id));
      showNotification(`Removed "${product.name}" from Compare list.`, "info");
    } else {
      if (compareList.length >= 4) {
        showNotification("You can compare up to 4 frames at a time.", "warning");
        return;
      }
      setCompareList((prev) => [...prev, product]);
      showNotification(`Added "${product.name}" to Compare!`, "success");
      setIsCompareOpen(true);
    }
  };

  const isInCompare = (productId: string) => {
    return compareList.some((p) => p.id === productId);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const addOrder = async (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    if (firebaseUser) {
      await saveUserOrder(firebaseUser.uid, order);
    }
  };

  const addAddressItem = async (addr: Address) => {
    setSavedAddresses((prev) => {
      let updated = addr.isDefault ? prev.map((a) => ({ ...a, isDefault: false })) : [...prev];
      return [...updated, addr];
    });
    if (firebaseUser) {
      await saveAddress(firebaseUser.uid, addr);
    }
    showNotification("Address saved successfully!", "success");
  };

  const deleteAddressItem = async (id: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    if (firebaseUser) {
      await deleteAddress(firebaseUser.uid, id);
    }
    showNotification("Address deleted.", "info");
  };

  const setDefaultAddressItem = async (id: string) => {
    setSavedAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    if (firebaseUser) {
      await setDefaultAddress(firebaseUser.uid, id);
    }
    showNotification("Default address updated.", "success");
  };

  const addPrescription = async (record: PrescriptionRecord, file?: File) => {
    let finalRecord = { ...record };
    if (file && firebaseUser) {
      const { storagePath, downloadUrl } = await uploadPrescriptionFileToStorage(
        firebaseUser.uid,
        record.id,
        file
      );
      finalRecord.fileName = file.name;
      finalRecord.storagePath = storagePath;
      finalRecord.downloadUrl = downloadUrl;
    }

    setSavedPrescriptions((prev) => [finalRecord, ...prev]);
    if (firebaseUser) {
      await saveUserPrescription(firebaseUser.uid, finalRecord);
    }
    showNotification("Prescription saved securely!", "success");
  };

  const deletePrescriptionItem = async (id: string) => {
    setSavedPrescriptions((prev) => prev.filter((p) => p.id !== id));
    if (firebaseUser) {
      await deleteUserPrescription(firebaseUser.uid, id);
    }
    showNotification("Prescription removed.", "info");
  };

  const updateProfileDetails = async (firstName: string, lastName: string, phone: string) => {
    if (firebaseUser) {
      await createOrUpdateUserProfile(firebaseUser.uid, {
        firstName,
        lastName,
        phone
      });
      setUser((prev) => ({
        ...prev,
        name: `${firstName} ${lastName}`.trim(),
        phone
      }));
      showNotification("Profile updated successfully.", "success");
    }
  };

  const signOut = async () => {
    await signOutUser();
    setActiveView({ type: "home" });
    showNotification("Signed out successfully.", "info");
  };

  const deleteAccount = async () => {
    if (firebaseUser) {
      await deleteUserAccount(firebaseUser.uid);
      setActiveView({ type: "home" });
      showNotification("Account deleted.", "info");
    }
  };

  const addEyeTestBooking = (booking: EyeTestBooking) => {
    setEyeTestBookings((prev) => [booking, ...prev]);
    showNotification("Eye Test Appointment successfully confirmed!", "success");
  };

  const formatPrice = (price: number) => {
    let rate = 1;
    let symbol = "$";

    if (currency === "EUR") {
      rate = 0.92;
      symbol = "€";
    } else if (currency === "GBP") {
      rate = 0.79;
      symbol = "£";
    } else if (currency === "CAD") {
      rate = 1.36;
      symbol = "CA$";
    }

    const converted = (price * rate).toFixed(0);
    return `${symbol}${converted}`;
  };

  const openVirtualTryOn = (product?: Product) => {
    const targetProduct = product || products.find((p) => p.category !== "contacts") || products[0];
    setVirtualTryOnProduct(targetProduct);
    setActiveView({ type: "try-on", productId: targetProduct?.id });
    setIsVirtualTryOnOpen(true);
  };

  const openLensCustomizer = (product: Product) => {
    setCustomizingProduct(product);
    setIsLensCustomizerOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        navigateToCatalog,
        navigateToProduct,
        navigateToStatic,
        products,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        toggleCompare,
        isInCompare,
        clearCompare,

        firebaseUser,
        isAuthenticated: !!firebaseUser,
        authLoading,
        user,
        firestoreUserData,
        signOut,
        updateProfileDetails,
        deleteAccount,

        orders,
        addOrder,

        savedAddresses,
        addAddress: addAddressItem,
        deleteAddressItem,
        setDefaultAddressItem,

        savedPrescriptions,
        addPrescription,
        deletePrescriptionItem,

        eyeTestBookings,
        addEyeTestBooking,
        currency,
        setCurrency,
        formatPrice,

        isCartOpen,
        setIsCartOpen,
        isCompareOpen,
        setIsCompareOpen,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        isVirtualTryOnOpen,
        setIsVirtualTryOnOpen,
        virtualTryOnProduct,
        openVirtualTryOn,
        isFaceShapeModalOpen,
        setIsFaceShapeModalOpen,
        isStyleFinderOpen,
        setIsStyleFinderOpen,
        isCameraSearchOpen,
        setIsCameraSearchOpen,
        isFrameSizeGuideOpen,
        setIsFrameSizeGuideOpen,
        isLensCustomizerOpen,
        setIsLensCustomizerOpen,
        customizingProduct,
        openLensCustomizer,
        searchQuery,
        setSearchQuery,
        notifications,
        showNotification,
        dismissNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
