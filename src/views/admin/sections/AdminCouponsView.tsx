import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Coupon } from "../../../types/admin";
import { Tag, Plus, Trash2, CheckCircle2, XCircle, Power, Ticket, Percent, DollarSign } from "lucide-react";

export const AdminCouponsView: React.FC = () => {
  const { coupons, addCoupon, toggleCouponStatus, deleteCoupon } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Omit<Coupon, "id" | "usageCount">>({
    code: "",
    discountType: "percentage",
    value: 20,
    minPurchase: 100,
    usageLimit: 500,
    startDate: "2026-08-01",
    expiryDate: "2026-12-31",
    status: "Active",
    description: ""
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code) return;
    addCoupon({
      ...formData,
      code: formData.code.toUpperCase(),
      usageCount: 0
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" /> Promo Codes & Offers Engine ({coupons.length})
          </h2>
          <p className="text-xs text-neutral-400">Configure discount vouchers, minimum cart thresholds, and usage limits</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Coupon Code
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300 border-collapse">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min Spend</th>
                <th className="py-3 px-4">Usage / Limit</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-mono font-extrabold text-amber-400 text-sm tracking-wider">{c.code}</p>
                    <p className="text-[10px] text-neutral-400 truncate max-w-xs">{c.description}</p>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {c.discountType === "percentage" ? `${c.value}% OFF` : `$${c.value} OFF`}
                  </td>

                  <td className="py-3 px-4 font-mono text-neutral-300">${c.minPurchase}</td>

                  <td className="py-3 px-4 font-mono">
                    <span className="text-white font-bold">{c.usageCount}</span> / {c.usageLimit} uses
                  </td>

                  <td className="py-3 px-4 font-mono text-neutral-400">{c.expiryDate}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border ${
                        c.status === "Active"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-neutral-800 text-neutral-500 border-neutral-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleCouponStatus(c.id)}
                        className="p-1.5 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg transition-colors"
                        title="Toggle Active Status"
                      >
                        <Power className={`w-4 h-4 ${c.status === "Active" ? "text-emerald-400" : "text-neutral-500"}`} />
                      </button>
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="p-1.5 hover:bg-neutral-800 text-red-400 rounded-lg transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Ticket className="w-5 h-5 text-amber-400" /> Create Promotional Coupon
            </h3>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold text-neutral-300">Coupon Code (e.g. ILENS30)</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-300">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-neutral-300">Discount Value</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-300">Min Cart Spend ($)</label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                    className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-300">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-300">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 20% off Japanese Titanium models..."
                  className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-neutral-950 font-bold rounded-xl"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
