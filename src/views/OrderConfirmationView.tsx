import React from "react";
import { useApp } from "../context/AppContext";
import { Order } from "../types";
import { printOrderInvoice } from "../services/invoiceService";
import {
  CheckCircle2,
  Truck,
  Package,
  Printer,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  CreditCard,
  Glasses
} from "lucide-react";

interface Props {
  order?: Order;
}

export const OrderConfirmationView: React.FC<Props> = ({ order: propOrder }) => {
  const { orders, setActiveView, formatPrice } = useApp();

  const order = propOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-16 h-16 text-neutral-300 mx-auto" />
        <h2 className="text-2xl font-black font-serif text-neutral-900">No Recent Order Found</h2>
        <button
          onClick={() => setActiveView({ type: "home" })}
          className="px-6 py-3 bg-neutral-900 text-white font-bold text-xs rounded-2xl"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white p-8 rounded-3xl border border-neutral-800 text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs text-amber-400 font-bold uppercase tracking-widest font-mono">
            Order Placed & Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-serif text-white">
            Thank You for Your Order!
          </h1>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Order <strong className="text-white font-mono">{order.id}</strong> has been received and queued for optical crafting.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveView({ type: "order-tracking", orderId: order.id })}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center gap-2"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Status</span>
          </button>

          <button
            onClick={() => printOrderInvoice(order)}
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-2xl border border-neutral-700 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Download Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Shipping & Delivery Card */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm border-b border-neutral-100 pb-2">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Delivery Destination</span>
          </div>

          <div className="text-neutral-700 space-y-0.5">
            <p className="font-extrabold text-neutral-950 text-sm">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}{order.shippingAddress.street2 ? `, ${order.shippingAddress.street2}` : ""}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}</p>
            <p className="text-neutral-500 pt-1">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 flex items-center justify-between text-[11px] text-neutral-700">
            <span className="font-bold">Estimated Delivery:</span>
            <span className="font-bold text-amber-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {order.estimatedDelivery}
            </span>
          </div>
        </div>

        {/* Payment & Status Card */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm border-b border-neutral-100 pb-2">
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>Payment & Invoice</span>
          </div>

          <div className="space-y-1.5 text-neutral-700">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-bold text-neutral-950">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax Invoice No:</span>
              <span className="font-mono font-bold text-neutral-900">{order.invoiceNumber || `INV-${order.id}`}</span>
            </div>
          </div>

          <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950 flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Full 30-day warranty & free lens replacement guarantee applies to this order.</span>
          </div>
        </div>
      </div>

      {/* Items Breakdown Table */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 space-y-4 shadow-xs">
        <h3 className="text-base font-black font-serif text-neutral-950 border-b border-neutral-100 pb-3">
          Ordered Eyewear & Optics ({order.items.length})
        </h3>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.cartItemId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.product.primaryImage}
                  alt={item.product.name}
                  className="w-16 h-16 object-contain bg-white p-1 rounded-xl border border-neutral-200 shrink-0"
                />
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-neutral-900 text-sm font-serif">{item.product.name}</h4>
                  <p className="text-neutral-500">
                    Color: {item.selectedColor.name} | Size: {item.product.dimensions?.sizeCategory || "Medium"} | Qty: {item.quantity}
                  </p>
                  {item.lensConfig && (
                    <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 inline-block">
                      Lens: {item.lensConfig.usageLabel} ({item.lensConfig.indexLabel})
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right font-black text-sm text-neutral-950">
                {formatPrice(item.totalItemPrice)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="pt-4 border-t border-neutral-200 max-w-xs ml-auto space-y-1.5 text-xs text-neutral-700">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-bold text-neutral-900">{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-amber-600 font-bold">
              <span>Discount ({order.couponCode || "Coupon"}):</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span className="font-bold text-emerald-700">{order.shippingFee === 0 ? "FREE" : formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 pt-2 font-black text-sm text-neutral-950">
            <span>Total Paid:</span>
            <span className="text-amber-600">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => setActiveView({ type: "catalog", category: "all" })}
          className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-2xl transition-all inline-flex items-center gap-2"
        >
          <span>Continue Shopping ILens Eyewear</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
