import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Order, OrderStatus } from "../types";
import { getOrderByIdAndContact, getOrderById } from "../services/firebase/orderService";
import { printOrderInvoice } from "../services/invoiceService";
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Printer,
  ShieldCheck,
  AlertCircle,
  Glasses,
  Calendar,
  ExternalLink,
  PhoneCall
} from "lucide-react";

interface Props {
  orderId?: string;
}

const ORDER_TIMELINE_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: "Order Placed", label: "Order Received", desc: "Your order details have been confirmed." },
  { status: "Payment Confirmed", label: "Payment Verified", desc: "Payment successfully authorized." },
  { status: "Prescription Verification", label: "Optical Lab Crafting", desc: "Certified opticians shaping and edging custom lenses." },
  { status: "Ready to Ship", label: "Quality Inspection", desc: "Final lens alignment & anti-scratch inspection passed." },
  { status: "Shipped", label: "Handed to Courier", desc: "Dispatched via BlueDart Express." },
  { status: "Out for Delivery", label: "Out for Delivery", desc: "Delivery agent is en route to your address." },
  { status: "Delivered", label: "Delivered", desc: "Package handed over safely." }
];

export const OrderTrackingView: React.FC<Props> = ({ orderId: initialOrderId }) => {
  const { orders, user, isAuthenticated, setActiveView, formatPrice } = useApp();

  const [inputOrderId, setInputOrderId] = useState(initialOrderId || (orders[0]?.id || ""));
  const [inputContact, setInputContact] = useState(user.email || "");
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(
    orders.find((o) => o.id === initialOrderId) || orders[0] || null
  );

  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      handleLookup(initialOrderId, inputContact);
    }
  }, [initialOrderId]);

  const handleLookup = async (lookupId?: string, lookupContact?: string) => {
    const idToSearch = (lookupId || inputOrderId).trim();
    const contactToSearch = (lookupContact || inputContact).trim();

    setSearchError("");
    if (!idToSearch) {
      setSearchError("Please enter your Order Number.");
      return;
    }

    setIsSearching(true);

    // 1. Check local AppContext orders first
    const localMatch = orders.find((o) => o.id.toLowerCase() === idToSearch.toLowerCase());
    if (localMatch) {
      setTrackedOrder(localMatch);
      setIsSearching(false);
      return;
    }

    // 2. Query Firestore global collection
    const result = await getOrderByIdAndContact(idToSearch, contactToSearch || user.email);
    if (result.order) {
      setTrackedOrder(result.order);
    } else {
      // Direct fallback fetch by ID
      const directOrder = await getOrderById(idToSearch);
      if (directOrder) {
        setTrackedOrder(directOrder);
      } else {
        setSearchError(result.error || "Order not found. Please double check your Order ID.");
        setTrackedOrder(null);
      }
    }
    setIsSearching(false);
  };

  // Determine current step index in timeline
  const getStepIndex = (status: OrderStatus): number => {
    if (status === "Order Placed") return 0;
    if (status === "Payment Confirmed") return 1;
    if (status === "Processing" || status === "Prescription Verification") return 2;
    if (status === "Ready to Ship") return 3;
    if (status === "Shipped") return 4;
    if (status === "Out for Delivery") return 5;
    if (status === "Delivered") return 6;
    return 2;
  };

  const currentStepIdx = trackedOrder ? getStepIndex(trackedOrder.status) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h1 className="text-3xl font-black font-serif text-neutral-950">
          Track Your ILens Order
        </h1>
        <p className="text-xs text-neutral-500">
          Real-time updates on prescription crafting, optical quality inspection, and express courier shipping.
        </p>
      </div>

      {/* Order Lookup Form */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm max-w-2xl mx-auto space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-3"
        >
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              placeholder="Order ID (e.g. ILN-20260810-4821)"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl px-4 py-3 text-xs font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={inputContact}
              onChange={(e) => setInputContact(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="sm:col-span-3 py-3 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSearching ? "Searching..." : "Track Order"}</span>
          </button>
        </form>

        {searchError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Tracked Order Content */}
      {trackedOrder ? (
        <div className="space-y-8">
          {/* Order Details Header Card */}
          <div className="bg-neutral-950 text-white p-6 sm:p-8 rounded-3xl border border-neutral-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-mono font-bold text-sm">{trackedOrder.id}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {trackedOrder.status}
                </span>
              </div>
              <h2 className="text-xl font-bold font-serif text-white">
                Estimated Delivery: {trackedOrder.estimatedDelivery}
              </h2>
              <p className="text-xs text-neutral-400">
                Shipped via <strong className="text-neutral-200">{trackedOrder.courierPartner || "BlueDart Express"}</strong> | AWB:{" "}
                <span className="font-mono text-amber-400">{trackedOrder.trackingNumber || "1Z999482910"}</span>
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => printOrderInvoice(trackedOrder)}
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl border border-neutral-700 transition-all flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Invoice PDF</span>
              </button>
            </div>
          </div>

          {/* Visual Step Timeline */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
            <h3 className="text-base font-black font-serif text-neutral-950 border-b border-neutral-100 pb-3">
              Fulfillment & Optics Progress Timeline
            </h3>

            {/* Horizontal Timeline (Desktop) */}
            <div className="hidden md:flex items-center justify-between relative px-2">
              <div className="absolute top-5 left-8 right-8 h-1 bg-neutral-200 -z-0" />
              <div
                className="absolute top-5 left-8 h-1 bg-amber-500 transition-all duration-500 -z-0"
                style={{ width: `${(currentStepIdx / (ORDER_TIMELINE_STEPS.length - 1)) * 100}%` }}
              />

              {ORDER_TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.status} className="flex flex-col items-center text-center space-y-2 relative z-10 max-w-[100px]">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? "bg-amber-500 text-neutral-950 ring-4 ring-amber-100 shadow-lg"
                          : isPassed
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold ${isCurrent ? "text-amber-600 font-extrabold" : isPassed ? "text-neutral-900" : "text-neutral-400"}`}>
                        {step.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vertical Timeline (Mobile) */}
            <div className="md:hidden space-y-4">
              {ORDER_TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.status} className="flex gap-3 text-xs">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCurrent
                          ? "bg-amber-500 text-neutral-950 shadow-md"
                          : isPassed
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className="space-y-0.5 pt-1">
                      <p className={`font-bold ${isCurrent ? "text-amber-600 font-extrabold" : isPassed ? "text-neutral-900" : "text-neutral-400"}`}>
                        {step.label}
                      </p>
                      <p className="text-[11px] text-neutral-500">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Items Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            {/* Items (7 Cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-neutral-200 space-y-4 shadow-xs">
              <h3 className="font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
                Items in This Shipment ({trackedOrder.items.length})
              </h3>

              <div className="space-y-3">
                {trackedOrder.items.map((item) => (
                  <div key={item.cartItemId} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <img
                      src={item.product.primaryImage}
                      alt={item.product.name}
                      className="w-14 h-14 object-contain bg-white p-1 rounded-xl border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 space-y-0.5">
                      <h4 className="font-bold text-neutral-900 font-serif">{item.product.name}</h4>
                      <p className="text-[11px] text-neutral-500">
                        Color: {item.selectedColor.name} | Qty: {item.quantity}
                      </p>
                      {item.lensConfig && (
                        <p className="text-[10px] text-amber-700 font-semibold">
                          Lens: {item.lensConfig.usageLabel} ({item.lensConfig.indexLabel})
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-neutral-950">{formatPrice(item.totalItemPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Logistics (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-neutral-200 space-y-4 shadow-xs">
              <h3 className="font-bold text-neutral-900 text-sm border-b border-neutral-100 pb-2">
                Shipping Destination
              </h3>

              <div className="space-y-1 text-neutral-700">
                <p className="font-bold text-neutral-950">{trackedOrder.shippingAddress.fullName}</p>
                <p>{trackedOrder.shippingAddress.street}</p>
                <p>{trackedOrder.shippingAddress.city}, {trackedOrder.shippingAddress.state} - {trackedOrder.shippingAddress.zip}</p>
                <p className="text-neutral-500 pt-1">Contact: {trackedOrder.shippingAddress.phone}</p>
              </div>

              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <div className="flex justify-between">
                  <span>Delivery Method:</span>
                  <span className="font-bold text-neutral-900">{trackedOrder.deliveryMethod?.name || "Express Courier"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Paid:</span>
                  <span className="font-bold text-amber-600">{formatPrice(trackedOrder.total)}</span>
                </div>
              </div>

              <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 text-[11px] text-neutral-600 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Need support? Call 1800-555-ILENS or email support@ilens.com</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-neutral-200 text-center space-y-3 max-w-xl mx-auto shadow-xs">
          <Truck className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-bold font-serif text-neutral-900">Track Order Status</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            Enter your Order ID (e.g. ILN-20260810-4821) and registered Email or Phone number above to view real-time tracking.
          </p>
        </div>
      )}
    </div>
  );
};
