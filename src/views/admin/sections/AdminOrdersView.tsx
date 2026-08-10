import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Order } from "../../../types";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  X,
  FileText,
  MapPin,
  CreditCard,
  ChevronRight
} from "lucide-react";

export const AdminOrdersView: React.FC = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statuses: Order["status"][] = [
    "Order Placed",
    "Payment Confirmed",
    "Prescription Verification",
    "Processing",
    "Ready to Ship",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(search.toLowerCase()) ||
      ord.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase()) ||
      ord.shippingAddress.city.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === "all" || ord.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" /> Order Fulfillment Pipeline ({filteredOrders.length})
          </h2>
          <p className="text-xs text-neutral-400">
            Track optical lens crafting, quality checks, shipment tracking numbers, and customer invoices
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID (e.g. IL-ORD-9842), customer, or city..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
        >
          <option value="all">All Order Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300 border-collapse">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Purchased Items</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Current Pipeline Status</th>
                <th className="py-3 px-4">Tracking Number</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <p className="font-bold text-amber-400 text-sm">{ord.id}</p>
                    <p className="text-[10px] text-neutral-400">{new Date(ord.date).toLocaleDateString()}</p>
                  </td>

                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{ord.shippingAddress.fullName}</p>
                    <p className="text-[10px] text-neutral-400">
                      {ord.shippingAddress.city}, {ord.shippingAddress.state}
                    </p>
                  </td>

                  <td className="py-3 px-4">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{it.product.name}</span>
                        {it.lensConfig && (
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/20 font-mono">
                            Rx Lens
                          </span>
                        )}
                      </div>
                    ))}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-white">${ord.total}</td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order["status"])}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-xl border bg-neutral-950 font-mono focus:outline-none ${
                        ord.status === "Delivered"
                          ? "text-emerald-400 border-emerald-500/30"
                          : ord.status === "Shipped"
                          ? "text-blue-400 border-blue-500/30"
                          : "text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-300">
                    {ord.trackingNumber || "Pending Dispatch"}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl border border-neutral-700 transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" /> View Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail & Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 custom-scrollbar shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-white font-mono">{selectedOrder.id}</span>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-bold text-[10px] border border-amber-500/30">
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Placed on {new Date(selectedOrder.date).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl flex items-center gap-1.5 font-bold"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" /> Print Invoice
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Shipping & Payment Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> Shipping Destination
                </h4>
                <p className="font-bold text-neutral-200">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-neutral-400">{selectedOrder.shippingAddress.street}</p>
                <p className="text-neutral-400">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                </p>
              </div>

              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-1">
                <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Payment & Dispatch
                </h4>
                <p className="text-neutral-200 font-mono font-bold">{selectedOrder.paymentMethod}</p>
                <p className="text-neutral-400 font-mono">Tracking: {selectedOrder.trackingNumber}</p>
                <p className="text-neutral-400">Est. Delivery: {selectedOrder.estimatedDelivery}</p>
              </div>
            </div>

            {/* Items & Lens Specs */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Ordered Eyewear & Lens Configuration</h4>
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={it.product.primaryImage} alt={it.product.name} className="w-12 h-12 rounded-xl object-cover border border-neutral-800" />
                      <div>
                        <p className="font-bold text-white text-sm">{it.product.name}</p>
                        <p className="text-[10px] text-neutral-400">{it.product.brand} — Color: {it.selectedColor?.name}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white text-sm">${it.totalItemPrice}</span>
                  </div>

                  {it.lensConfig && (
                    <div className="mt-2 pt-2 border-t border-neutral-800/80 bg-neutral-900/60 p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between font-bold text-amber-400 text-[11px]">
                        <span>Rx Lens: {it.lensConfig.usageLabel}</span>
                        <span>{it.lensConfig.indexLabel}</span>
                      </div>
                      {it.lensConfig.prescription && (
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-neutral-950 p-2 rounded-lg border border-neutral-800">
                          <div>
                            <span className="text-neutral-400 block font-bold">OD (Right Eye):</span>
                            <span>SPH: {it.lensConfig.prescription.odSph} | CYL: {it.lensConfig.prescription.odCyl} | AXIS: {it.lensConfig.prescription.odAxis}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block font-bold">OS (Left Eye):</span>
                            <span>SPH: {it.lensConfig.prescription.osSph} | CYL: {it.lensConfig.prescription.osCyl} | AXIS: {it.lensConfig.prescription.osAxis}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total Breakdown */}
            <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-1 font-mono text-right">
              <p className="text-neutral-400">Subtotal: ${selectedOrder.subtotal}</p>
              {selectedOrder.discount > 0 && <p className="text-amber-400">Discount: -${selectedOrder.discount}</p>}
              <p className="text-neutral-400">Shipping: ${selectedOrder.shippingFee}</p>
              <p className="text-base font-extrabold text-white pt-2 border-t border-neutral-800">
                Total Paid: ${selectedOrder.total}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
