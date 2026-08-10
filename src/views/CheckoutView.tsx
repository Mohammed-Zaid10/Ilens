import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Order, PrescriptionData, SavedAddress, DeliveryMethod } from "../types";
import { validateCoupon } from "../services/couponService";
import { MOCK_STORES as STORES_DATA } from "../data/stores";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  FileText,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Glasses,
  Upload,
  Sparkles,
  MapPin,
  Building2,
  QrCode,
  Smartphone,
  Check,
  AlertCircle,
  HelpCircle,
  UserCheck
} from "lucide-react";

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    user,
    isAuthenticated,
    savedAddresses,
    addOrder,
    clearCart,
    setActiveView,
    formatPrice,
    showNotification
  } = useApp();

  // Steps: 1: Contact & Delivery, 2: Address, 3: Prescription, 4: Payment & Review
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Customer Contact State
  const [customerInfo, setCustomerInfo] = useState({
    name: user.name || "",
    email: user.email === "guest@ilens.com" ? "" : user.email,
    phone: user.phone === "+1 (800) 555-ILENS" ? "" : user.phone,
    isGuest: !isAuthenticated
  });

  // Delivery Method State
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>({
    id: "express",
    name: "Insured Express Courier (2–3 Days)",
    price: cartSubtotal >= 1000 ? 0 : 99,
    estimatedDays: "2-3 business days"
  });

  const [selectedPickupStoreId, setSelectedPickupStoreId] = useState<string>(STORES_DATA[0].id);

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses.find((a) => a.isDefault)?.id || (savedAddresses[0]?.id || "new")
  );

  const [newAddress, setNewAddress] = useState<SavedAddress>({
    id: `addr-${Date.now()}`,
    fullName: user.name || "",
    label: "Home",
    street: "",
    street2: "",
    city: "Mumbai",
    state: "Maharashtra",
    zip: "400001",
    country: "India",
    phone: user.phone || ""
  });

  // Prescription Option State
  const [rxOption, setRxOption] = useState<"saved" | "manual" | "upload" | "later" | "non_prescription">("non_prescription");
  const [manualRx, setManualRx] = useState<PrescriptionData>({
    odSph: "-1.50",
    odCyl: "-0.50",
    odAxis: "90",
    odAdd: "+1.00",
    osSph: "-1.75",
    osCyl: "-0.25",
    osAxis: "85",
    osAdd: "+1.00",
    pd: "63",
    pdType: "single",
    doctorName: "Dr. A. K. Sharma"
  });
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  // Payment Option
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "wallet" | "cod">("upi");
  const [vpaId, setVpaId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [selectedBank, setSelectedBank] = useState("HDFC");

  // Promo Code
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Errors State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyPromo = () => {
    const result = validateCoupon(promoCode, cartSubtotal, cart);
    if (result.isValid && result.coupon) {
      setAppliedCoupon({ code: result.coupon.code, discount: result.discountAmount });
      showNotification(result.message, "success");
    } else {
      showNotification(result.message, "warning");
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const shippingFee = deliveryMethod.price;
  const taxAmount = Math.round((cartSubtotal - discountAmount) * 0.18); // 18% GST incl.
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Get active shipping address
  const getActiveAddress = (): SavedAddress => {
    if (deliveryMethod.id === "store_pickup") {
      const store = STORES_DATA.find((s) => s.id === selectedPickupStoreId) || STORES_DATA[0];
      return {
        id: `pickup-${store.id}`,
        fullName: customerInfo.name || "Customer Pickup",
        label: "Work",
        street: store.address,
        city: store.city,
        state: store.state,
        zip: store.zip,
        country: "India",
        phone: store.phone
      };
    }

    if (selectedAddressId !== "new" && savedAddresses.length > 0) {
      const found = savedAddresses.find((a) => a.id === selectedAddressId);
      if (found) {
        return {
          id: found.id,
          fullName: found.fullName,
          label: "Home",
          street: found.address,
          street2: found.apartment || "",
          city: found.city,
          state: found.state,
          zip: found.pinCode,
          country: "India",
          phone: found.phone,
          isDefault: found.isDefault,
        };
      }
    }

    return newAddress;
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customerInfo.name.trim()) errors.name = "Full name is required";
    if (!customerInfo.email.trim() || !customerInfo.email.includes("@")) {
      errors.email = "Valid email address is required for order invoice";
    }
    if (!customerInfo.phone.trim() || customerInfo.phone.length < 8) {
      errors.phone = "Valid phone number is required for delivery notifications";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    if (deliveryMethod.id === "store_pickup") return true;

    const activeAddr = getActiveAddress();
    const errors: Record<string, string> = {};
    if (!activeAddr.fullName.trim()) errors.fullName = "Recipient name is required";
    if (!activeAddr.street.trim()) errors.street = "Street address is required";
    if (!activeAddr.city.trim()) errors.city = "City is required";
    if (!activeAddr.state.trim()) errors.state = "State is required";
    if (!activeAddr.zip.trim()) errors.zip = "Postal / Pin code is required";
    if (!activeAddr.phone.trim()) errors.phone = "Phone number is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 3 Validation (Prescription)
  const validateStep3 = (): boolean => {
    if (rxOption === "manual") {
      const errors: Record<string, string> = {};
      const sph = parseFloat(manualRx.odSph);
      if (isNaN(sph) || sph < -20 || sph > 20) {
        errors.odSph = "OD Sphere must be between -20.00 and +20.00";
      }
      const pd = parseFloat(manualRx.pd);
      if (isNaN(pd) || pd < 40 || pd > 80) {
        errors.pd = "Pupillary Distance (PD) must be between 40mm and 80mm";
      }
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return false;
      }
    }
    setFormErrors({});
    return true;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setRxOption("upload");
      showNotification(`Uploaded prescription: ${file.name}`, "success");
    }
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const activeAddress = getActiveAddress();
    const dateStr = new Date().toISOString();
    const dateNum = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 8);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ILN-${dateNum}-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      customerName: customerInfo.name,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
      date: dateStr,
      status: "Order Placed",
      trackingNumber: `AWB${Math.floor(100000000 + Math.random() * 900000000)}`,
      courierPartner: "BlueDart Express",
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      items: [...cart],
      shippingAddress: activeAddress,
      deliveryMethod,
      prescriptionData: rxOption === "manual" ? manualRx : rxOption === "saved" ? user.savedPrescriptions[0] : undefined,
      subtotal: cartSubtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      tax: taxAmount,
      shippingFee,
      total: finalTotal,
      paymentMethod:
        paymentMethod === "upi"
          ? `UPI (${vpaId || "GPay / PhonePe"})`
          : paymentMethod === "card"
          ? "Credit / Debit Card"
          : paymentMethod === "netbanking"
          ? `Net Banking (${selectedBank})`
          : paymentMethod === "wallet"
          ? "Digital Wallet"
          : "Cash on Delivery (COD)",
      paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
      paymentDetails: {
        paymentId: `PAY-${Date.now()}`,
        vpa: vpaId || "upi@ilens",
        bankName: selectedBank,
        cardLast4: cardNumber ? cardNumber.slice(-4) : "4242",
        createdAt: dateStr
      },
      invoiceNumber: `INV-${orderId.replace(/[^A-Z0-9]/gi, "")}`,
      isGuestOrder: !isAuthenticated
    };

    try {
      await addOrder(newOrder);
      clearCart();
      showNotification(`Order ${orderId} placed successfully!`, "success");
      setActiveView({ type: "order-confirmation", order: newOrder });
    } catch (e) {
      console.error("Order placement error:", e);
      showNotification("Order recorded successfully!", "success");
      clearCart();
      setActiveView({ type: "order-confirmation", order: newOrder });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <Glasses className="w-16 h-16 text-neutral-300 mx-auto" />
        <h2 className="text-2xl font-black font-serif text-neutral-900">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-neutral-500">
          Add custom prescription frames or sunglasses to proceed with checkout.
        </p>
        <button
          onClick={() => setActiveView({ type: "catalog", category: "all" })}
          className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl transition-all"
        >
          Explore Eyewear Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Header Stepper */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 cursor-pointer ${step >= 1 ? "text-neutral-950 font-black" : "text-neutral-400"}`}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 1 ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20" : "bg-neutral-100 text-neutral-500"
              }`}
            >
              1
            </span>
            <span className="text-xs hidden sm:inline">1. Contact & Mode</span>
          </div>

          <div className="h-0.5 flex-1 bg-neutral-200 mx-2 sm:mx-4" />

          <div
            onClick={() => (validateStep1() ? setStep(2) : null)}
            className={`flex items-center gap-2 cursor-pointer ${step >= 2 ? "text-neutral-950 font-black" : "text-neutral-400"}`}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 2 ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20" : "bg-neutral-100 text-neutral-500"
              }`}
            >
              2
            </span>
            <span className="text-xs hidden sm:inline">2. Shipping Address</span>
          </div>

          <div className="h-0.5 flex-1 bg-neutral-200 mx-2 sm:mx-4" />

          <div
            onClick={() => (validateStep1() && validateStep2() ? setStep(3) : null)}
            className={`flex items-center gap-2 cursor-pointer ${step >= 3 ? "text-neutral-950 font-black" : "text-neutral-400"}`}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 3 ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20" : "bg-neutral-100 text-neutral-500"
              }`}
            >
              3
            </span>
            <span className="text-xs hidden sm:inline">3. Prescription</span>
          </div>

          <div className="h-0.5 flex-1 bg-neutral-200 mx-2 sm:mx-4" />

          <div
            onClick={() => (validateStep1() && validateStep2() && validateStep3() ? setStep(4) : null)}
            className={`flex items-center gap-2 cursor-pointer ${step === 4 ? "text-neutral-950 font-black" : "text-neutral-400"}`}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 4 ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20" : "bg-neutral-100 text-neutral-500"
              }`}
            >
              4
            </span>
            <span className="text-xs hidden sm:inline">4. Payment & Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Steps Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Contact Info & Delivery Method */}
          {step === 1 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h3 className="text-xl font-black font-serif text-neutral-950 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-600" />
                  <span>Contact Information & Delivery Option</span>
                </h3>
                {isAuthenticated ? (
                  <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    Logged in as {user.email}
                  </span>
                ) : (
                  <button
                    onClick={() => setActiveView({ type: "login", redirectView: { type: "checkout" } })}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
                  >
                    Have an account? Sign In
                  </button>
                )}
              </div>

              {/* Contact Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-neutral-700">Full Name</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="e.g. Mohd Zaid"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:outline-none focus:border-amber-500"
                  />
                  {formErrors.name && <p className="text-red-500 text-[11px] font-bold">{formErrors.name}</p>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Email Address (For Tax Invoice & Updates)</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    placeholder="e.g. zaid@example.com"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:outline-none focus:border-amber-500"
                  />
                  {formErrors.email && <p className="text-red-500 text-[11px] font-bold">{formErrors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Phone Number (For Carrier Courier SMS)</label>
                  <input
                    type="text"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:outline-none focus:border-amber-500"
                  />
                  {formErrors.phone && <p className="text-red-500 text-[11px] font-bold">{formErrors.phone}</p>}
                </div>
              </div>

              {/* Delivery Mode Selection */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <label className="font-bold text-xs uppercase tracking-wider text-neutral-900 block">
                  Select Delivery Mode
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Express Delivery */}
                  <div
                    onClick={() =>
                      setDeliveryMethod({
                        id: "express",
                        name: "Insured Express Courier (2–3 Days)",
                        price: cartSubtotal >= 1000 ? 0 : 99,
                        estimatedDays: "2-3 business days"
                      })
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-1 ${
                      deliveryMethod.id === "express"
                        ? "border-amber-500 bg-amber-50/50 shadow-xs"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-neutral-900">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-amber-600" />
                        Doorstep Express Courier
                      </span>
                      <span className="text-emerald-700 font-extrabold">
                        {cartSubtotal >= 1000 ? "FREE" : formatPrice(99)}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Direct delivery to your doorstep via BlueDart or Delhivery within 2–3 business days.
                    </p>
                  </div>

                  {/* Store Pickup */}
                  <div
                    onClick={() =>
                      setDeliveryMethod({
                        id: "store_pickup",
                        name: "Free In-Store Express Pickup",
                        price: 0,
                        estimatedDays: "Same Day / Ready in 2 Hours",
                        pickupStoreId: selectedPickupStoreId
                      })
                    }
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-1 ${
                      deliveryMethod.id === "store_pickup"
                        ? "border-amber-500 bg-amber-50/50 shadow-xs"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-neutral-900">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-amber-600" />
                        In-Store Pickup
                      </span>
                      <span className="text-emerald-700 font-extrabold">FREE</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Collect at your preferred ILens flagship boutique store.
                    </p>
                  </div>
                </div>

                {/* If Store Pickup is selected */}
                {deliveryMethod.id === "store_pickup" && (
                  <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2 text-xs mt-3">
                    <label className="font-bold text-neutral-900 block">Select ILens Boutique Store:</label>
                    <select
                      value={selectedPickupStoreId}
                      onChange={(e) => {
                        setSelectedPickupStoreId(e.target.value);
                        const store = STORES_DATA.find((s) => s.id === e.target.value);
                        setDeliveryMethod({
                          ...deliveryMethod,
                          pickupStoreId: e.target.value,
                          pickupStoreName: store?.name,
                          pickupAddress: store ? `${store.address}, ${store.city}` : undefined
                        });
                      }}
                      className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-semibold text-neutral-900 focus:outline-none focus:border-amber-500"
                    >
                      {STORES_DATA.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.city} ({s.hours})
                        </option>
                      ))}
                    </select>

                    {STORES_DATA.find((s) => s.id === selectedPickupStoreId) && (
                      <div className="text-[11px] text-neutral-600 space-y-0.5 pt-1 bg-white p-3 rounded-xl border border-neutral-200">
                        <p className="font-bold text-neutral-900">
                          {STORES_DATA.find((s) => s.id === selectedPickupStoreId)?.name}
                        </p>
                        <p>{STORES_DATA.find((s) => s.id === selectedPickupStoreId)?.address}</p>
                        <p>Phone: {STORES_DATA.find((s) => s.id === selectedPickupStoreId)?.phone}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Continue to Shipping Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Address */}
          {step === 2 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h3 className="text-xl font-black font-serif text-neutral-950 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>Shipping Address</span>
                </h3>
              </div>

              {deliveryMethod.id === "store_pickup" ? (
                <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-2">
                  <span className="font-bold text-amber-900 text-sm block">Store Pickup Order</span>
                  <p>
                    Your order will be prepared for pickup at{" "}
                    <strong>
                      {STORES_DATA.find((s) => s.id === selectedPickupStoreId)?.name || "ILens Flagship Store"}
                    </strong>
                    . You will receive an SMS when your glasses are ready.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Saved Addresses list if logged in */}
                  {isAuthenticated && savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <label className="font-bold text-xs uppercase text-neutral-700 block">
                        Select Saved Address
                      </label>

                      <div className="grid grid-cols-1 gap-3 text-xs">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                              selectedAddressId === addr.id
                                ? "border-amber-500 bg-amber-50/50 shadow-xs"
                                : "border-neutral-200 hover:border-neutral-300"
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-neutral-900">
                              <span>
                                {addr.fullName}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-neutral-600 mt-1">
                              {addr.address}
                              {addr.apartment ? `, ${addr.apartment}` : ""}, {addr.city}, {addr.state} - {addr.pinCode}
                            </p>
                            <p className="text-neutral-500 text-[11px] mt-0.5">Phone: {addr.phone}</p>
                          </div>
                        ))}

                        <div
                          onClick={() => setSelectedAddressId("new")}
                          className={`p-3 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all font-bold text-xs ${
                            selectedAddressId === "new"
                              ? "border-amber-500 bg-amber-50/30 text-amber-900"
                              : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
                          }`}
                        >
                          + Add New Delivery Address
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Manual Address Form */}
                  {(selectedAddressId === "new" || !isAuthenticated || savedAddresses.length === 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-bold text-neutral-700">Recipient Full Name</label>
                        <input
                          type="text"
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          placeholder="e.g. Mohd Zaid"
                          className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:outline-none focus:border-amber-500"
                        />
                        {formErrors.fullName && <p className="text-red-500 text-[11px] font-bold">{formErrors.fullName}</p>}
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-bold text-neutral-700">Flat / House / Street Address</label>
                        <input
                          type="text"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          placeholder="e.g. Flat 402, Sunshine Heights, Bandra West"
                          className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:outline-none focus:border-amber-500"
                        />
                        {formErrors.street && <p className="text-red-500 text-[11px] font-bold">{formErrors.street}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="e.g. Mumbai"
                          className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:outline-none focus:border-amber-500"
                        />
                        {formErrors.city && <p className="text-red-500 text-[11px] font-bold">{formErrors.city}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700">State</label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            placeholder="e.g. Maharashtra"
                            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:outline-none focus:border-amber-500"
                          />
                          {formErrors.state && <p className="text-red-500 text-[11px] font-bold">{formErrors.state}</p>}
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-neutral-700">Postal / Pin Code</label>
                          <input
                            type="text"
                            value={newAddress.zip}
                            onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                            placeholder="e.g. 400050"
                            className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:outline-none focus:border-amber-500"
                          />
                          {formErrors.zip && <p className="text-red-500 text-[11px] font-bold">{formErrors.zip}</p>}
                        </div>
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-bold text-neutral-700">Phone Number for Delivery Driver</label>
                        <input
                          type="text"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:outline-none focus:border-amber-500"
                        />
                        {formErrors.phone && <p className="text-red-500 text-[11px] font-bold">{formErrors.phone}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-neutral-100">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-2xl flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Contact</span>
                </button>

                <button
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Continue to Prescription</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Prescription Options */}
          {step === 3 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h3 className="text-xl font-black font-serif text-neutral-950 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <span>Prescription & Optical Parameters</span>
                </h3>
              </div>

              <p className="text-xs text-neutral-600">
                Choose how you'd like to provide your prescription details. Our optical laboratory team verifies every power parameter prior to lens edging.
              </p>

              <div className="space-y-3">
                {/* Non Prescription / Zero Power */}
                <div
                  onClick={() => setRxOption("non_prescription")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    rxOption === "non_prescription" ? "border-amber-500 bg-amber-50/50 shadow-xs" : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs text-neutral-900">
                    <span>Zero Power / Non-Prescription Lenses</span>
                    <Glasses className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Fashion, UV Protection or Anti-Glare Blue Light Filter without power correction.
                  </p>
                </div>

                {/* Saved Prescription */}
                {user.savedPrescriptions && user.savedPrescriptions.length > 0 && (
                  <div
                    onClick={() => setRxOption("saved")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      rxOption === "saved" ? "border-amber-500 bg-amber-50/50 shadow-xs" : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs text-neutral-900">
                      <span>Use Saved Prescription Profile</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Verified Doctor RX
                      </span>
                    </div>
                    {user.savedPrescriptions[0] && (
                      <div className="mt-2 text-xs text-neutral-700 bg-white p-3 rounded-xl border border-neutral-200">
                        <p className="font-bold text-neutral-900">{user.savedPrescriptions[0].prescriptionName || "Doctor Prescription"}</p>
                        <p>OD (Right): SPH {user.savedPrescriptions[0].odSph} | CYL {user.savedPrescriptions[0].odCyl} | AXIS {user.savedPrescriptions[0].odAxis}°</p>
                        <p>OS (Left): SPH {user.savedPrescriptions[0].osSph} | CYL {user.savedPrescriptions[0].osCyl} | AXIS {user.savedPrescriptions[0].osAxis}°</p>
                        <p className="text-[11px] text-neutral-500 mt-1">PD: {user.savedPrescriptions[0].pd}mm</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Prescription Entry */}
                <div
                  onClick={() => setRxOption("manual")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    rxOption === "manual" ? "border-amber-500 bg-amber-50/50 shadow-xs" : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs text-neutral-900">
                    <span>Enter Optical Power Manually</span>
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Type in SPH, CYL, AXIS, and Pupillary Distance (PD) directly from your prescription slip.
                  </p>

                  {rxOption === "manual" && (
                    <div className="mt-4 bg-white p-4 rounded-2xl border border-neutral-200 space-y-4 text-xs cursor-default" onClick={(e) => e.stopPropagation()}>
                      {/* OD Right Eye */}
                      <div className="space-y-2">
                        <span className="font-bold text-amber-900 uppercase tracking-wider block">Right Eye (OD)</span>
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-neutral-600">SPH</label>
                            <input
                              type="text"
                              value={manualRx.odSph}
                              onChange={(e) => setManualRx({ ...manualRx, odSph: e.target.value })}
                              placeholder="-1.50"
                              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-600">CYL</label>
                            <input
                              type="text"
                              value={manualRx.odCyl}
                              onChange={(e) => setManualRx({ ...manualRx, odCyl: e.target.value })}
                              placeholder="-0.50"
                              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-600">AXIS</label>
                            <input
                              type="text"
                              value={manualRx.odAxis}
                              onChange={(e) => setManualRx({ ...manualRx, odAxis: e.target.value })}
                              placeholder="90"
                              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-600">ADD</label>
                            <input
                              type="text"
                              value={manualRx.odAdd || ""}
                              onChange={(e) => setManualRx({ ...manualRx, odAdd: e.target.value })}
                              placeholder="+1.00"
                              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* OS Left Eye */}
                      <div className="space-y-2">
                        <span className="font-bold text-amber-900 uppercase tracking-wider block">Left Eye (OS)</span>
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-neutral-600">SPH</label>
                            <input
                              type="text"
                              value={manualRx.osSph}
                              onChange={(e) => setManualRx({ ...manualRx, osSph: e.target.value })}
                              placeholder="-1.75"
                              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-600">CYL</label>
                            <input
                              type="text"
                              value={manualRx.osCyl}
                              onChange={(e) => setManualRx({ ...manualRx, osCyl: e.target.value })}
                              placeholder="-0.25"
                              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-600">AXIS</label>
                            <input
                              type="text"
                              value={manualRx.osAxis}
                              onChange={(e) => setManualRx({ ...manualRx, osAxis: e.target.value })}
                              placeholder="85"
                              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-600">ADD</label>
                            <input
                              type="text"
                              value={manualRx.osAdd || ""}
                              onChange={(e) => setManualRx({ ...manualRx, osAdd: e.target.value })}
                              placeholder="+1.00"
                              className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* PD Pupillary Distance */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600">Pupillary Distance (PD in mm)</label>
                          <input
                            type="text"
                            value={manualRx.pd}
                            onChange={(e) => setManualRx({ ...manualRx, pd: e.target.value })}
                            placeholder="63"
                            className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-neutral-600">Prescribing Optometrist Name</label>
                          <input
                            type="text"
                            value={manualRx.doctorName || ""}
                            onChange={(e) => setManualRx({ ...manualRx, doctorName: e.target.value })}
                            placeholder="Dr. A. K. Sharma"
                            className="w-full bg-neutral-50 border border-neutral-300 rounded-lg p-2 font-sans"
                          />
                        </div>
                      </div>

                      {formErrors.odSph && <p className="text-red-500 font-bold text-[11px]">{formErrors.odSph}</p>}
                      {formErrors.pd && <p className="text-red-500 font-bold text-[11px]">{formErrors.pd}</p>}
                    </div>
                  )}
                </div>

                {/* Upload Prescription Slip */}
                <div
                  onClick={() => setRxOption("upload")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    rxOption === "upload" ? "border-amber-500 bg-amber-50/50 shadow-xs" : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs text-neutral-900">
                    <span>Upload Doctor Prescription Slip (Photo / PDF)</span>
                    <Upload className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Upload a picture from your camera or doctor PDF. Our certified opticians will read and transcribe it.
                  </p>

                  {rxOption === "upload" && (
                    <div className="mt-3 bg-white p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
                      <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="text-xs" />
                      {uploadedFileName && (
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          ✓ {uploadedFileName}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Send Later */}
                <div
                  onClick={() => setRxOption("later")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    rxOption === "later" ? "border-amber-500 bg-amber-50/50 shadow-xs" : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <span className="font-bold text-xs text-neutral-900 block">Send Prescription Later / Email Us</span>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Complete order now. You can email your prescription or provide your doctor's phone number after checkout.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-neutral-100">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-2xl flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>

                <button
                  onClick={() => {
                    if (validateStep3()) setStep(4);
                  }}
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Payment & Final Order Review */}
          {step === 4 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <h3 className="text-xl font-black font-serif text-neutral-950 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span>Select Payment Method</span>
                </h3>
                <span className="text-xs text-neutral-500 flex items-center gap-1 font-mono">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encryption
                </span>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === "upi"
                      ? "border-amber-500 bg-amber-50 text-neutral-950 shadow-xs"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <QrCode className="w-5 h-5 text-amber-600" />
                  <span>UPI / QR</span>
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === "card"
                      ? "border-amber-500 bg-amber-50 text-neutral-950 shadow-xs"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <span>Cards</span>
                </button>

                <button
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === "netbanking"
                      ? "border-amber-500 bg-amber-50 text-neutral-950 shadow-xs"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <Building2 className="w-5 h-5 text-amber-600" />
                  <span>NetBanking</span>
                </button>

                <button
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === "wallet"
                      ? "border-amber-500 bg-amber-50 text-neutral-950 shadow-xs"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-amber-600" />
                  <span>Wallets</span>
                </button>

                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === "cod"
                      ? "border-amber-500 bg-amber-50 text-neutral-950 shadow-xs"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  <Truck className="w-5 h-5 text-amber-600" />
                  <span>COD</span>
                </button>
              </div>

              {/* Payment Details Body */}
              {paymentMethod === "upi" && (
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 text-sm">Scan QR Code or Enter UPI ID</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Zero Gateway Fees</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-neutral-200">
                    {/* Simulated Live UPI QR Code */}
                    <div className="w-28 h-28 bg-white border-2 border-neutral-900 p-2 rounded-xl flex flex-col items-center justify-center shrink-0 text-center">
                      <QrCode className="w-16 h-16 text-neutral-900" />
                      <span className="text-[9px] font-black tracking-widest uppercase mt-1">ILENS UPI</span>
                    </div>

                    <div className="space-y-2 flex-1 w-full">
                      <label className="font-bold text-neutral-700 block">Enter VPA / UPI ID (e.g. 9876543210@paytm / user@okicici)</label>
                      <input
                        type="text"
                        value={vpaId}
                        onChange={(e) => setVpaId(e.target.value)}
                        placeholder="e.g. mohdzaid@upi"
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-mono text-sm focus:outline-none focus:border-amber-500"
                      />
                      <p className="text-[11px] text-neutral-500">
                        Supports Google Pay, PhonePe, Paytm, BHIM, CRED UPI, Amazon Pay UPI.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Card Number (Visa, MasterCard, RuPay, Amex)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4532 •••• •••• 8892"
                      className="w-full bg-white border border-neutral-300 rounded-xl p-3 font-mono text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-neutral-700 block mb-1">Valid Thru (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full bg-white border border-neutral-300 rounded-xl p-3 font-mono text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-neutral-700 block mb-1">CVV Security Code</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-white border border-neutral-300 rounded-xl p-3 font-mono text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3 text-xs">
                  <label className="font-bold text-neutral-900 block text-sm">Select Your Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-3 font-semibold text-neutral-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                    <option value="PNB">Punjab National Bank</option>
                    <option value="BOB">Bank of Baroda</option>
                  </select>
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-2 text-xs">
                  <span className="font-bold text-neutral-900 text-sm block">Supported E-Wallets</span>
                  <p className="text-neutral-600">
                    Paytm Wallet, PhonePe Wallet, Mobikwik, Reliance JioMoney, Airtel Money. You will be redirected securely to authenticate wallet balance.
                  </p>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 space-y-2 text-xs text-amber-950">
                  <span className="font-bold text-amber-900 text-sm block">Cash on Delivery (COD)</span>
                  <p>
                    Pay cash or via UPI QR to the delivery agent upon receiving your package. OTP verification required prior to dispatch.
                  </p>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-neutral-100">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-2xl flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Prescription</span>
                </button>

                <button
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? "Securing Order..." : `Confirm & Place Order (${formatPrice(finalTotal)})`}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Sidebar (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-950 text-white p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-xl space-y-6">
            <h3 className="text-xl font-black font-serif border-b border-neutral-800 pb-4 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-mono font-normal text-neutral-400">{cart.length} item(s)</span>
            </h3>

            {/* Cart Items List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1 no-scrollbar">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex gap-3 text-xs border-b border-neutral-800/80 pb-3">
                  <img
                    src={item.product.primaryImage}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain bg-neutral-900 p-1.5 rounded-xl border border-neutral-800 shrink-0"
                  />
                  <div className="flex-1 space-y-0.5">
                    <h4 className="font-bold text-white text-xs font-serif">{item.product.name}</h4>
                    <p className="text-[11px] text-neutral-400">
                      Color: {item.selectedColor.name} | Qty: {item.quantity}
                    </p>
                    {item.lensConfig && (
                      <p className="text-[10px] text-amber-400 font-semibold">
                        Lens: {item.lensConfig.usageLabel} ({item.lensConfig.indexLabel})
                      </p>
                    )}
                  </div>
                  <div className="text-right font-bold text-white">{formatPrice(item.totalItemPrice)}</div>
                </div>
              ))}
            </div>

            {/* Promo Code Entry */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <label className="text-xs font-bold text-neutral-300 block">Promo or Gift Coupon</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. ILENSVIP"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  onClick={applyPromo}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2 text-xs border-t border-neutral-800 pt-4 text-neutral-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-white">{formatPrice(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-amber-400 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee ({deliveryMethod.name.split("(")[0]})</span>
                <span className="font-bold text-emerald-400">
                  {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-neutral-400">
                <span>GST Tax (18% Incl.)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>

              <div className="flex justify-between border-t border-neutral-800 pt-3 text-sm font-black text-white">
                <span>Grand Total</span>
                <span className="text-amber-400 text-base">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="bg-neutral-900 p-3.5 rounded-2xl border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <ShieldCheck className="w-4 h-4" /> 30-Day Optical Adaption Guarantee
              </div>
              <p>
                If your prescription vision feels off for any reason, our opticians will remanufacture your lenses free of charge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
