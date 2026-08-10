import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { AdminCustomer } from "../../../types/admin";
import { Users, Search, Award, FileText, ShoppingBag, Eye, X, Mail, Phone } from "lucide-react";

export const AdminCustomersView: React.FC = () => {
  const { customers } = useAdmin();
  const [search, setSearch] = useState("");
  const [selectedCust, setSelectedCust] = useState<AdminCustomer | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" /> Customer Vault & Memberships ({filtered.length})
          </h2>
          <p className="text-xs text-neutral-400">Manage ILens Circle loyalty tiers, lifetime spend, and stored optometric records</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-2xl relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-7 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name, email address, or phone..."
          className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
        />
      </div>

      {/* Table */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300 border-collapse">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">ILens Circle Tier</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Prescriptions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-neutral-800" />
                      <div>
                        <p className="font-bold text-white text-sm">{c.name}</p>
                        <p className="text-[10px] text-neutral-400">{c.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border ${
                        c.tier === "Platinum"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                          : c.tier === "Gold"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          : "bg-neutral-800 text-neutral-300 border-neutral-700"
                      }`}
                    >
                      {c.tier} Member
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-white">{c.totalOrders} orders</td>

                  <td className="py-3 px-4 font-mono font-bold text-amber-400">${c.totalSpent}</td>

                  <td className="py-3 px-4 font-mono text-neutral-300">{c.prescriptionsCount} Rx records</td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCust(c)}
                      className="p-1.5 hover:bg-neutral-800 text-amber-400 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCust && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-white text-sm">Customer Dossier</h3>
              <button onClick={() => setSelectedCust(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img src={selectedCust.avatar} alt={selectedCust.name} className="w-16 h-16 rounded-full object-cover border-2 border-amber-500" />
              <div>
                <h4 className="text-base font-black text-white">{selectedCust.name}</h4>
                <p className="text-amber-400 font-mono font-bold">{selectedCust.tier} Tier Member</p>
                <p className="text-neutral-400 text-[11px]">Joined {selectedCust.joinedDate}</p>
              </div>
            </div>

            <div className="space-y-2 p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
              <p className="flex items-center gap-2 text-neutral-300"><Mail className="w-4 h-4 text-amber-400" /> {selectedCust.email}</p>
              <p className="flex items-center gap-2 text-neutral-300"><Phone className="w-4 h-4 text-amber-400" /> {selectedCust.phone}</p>
              <p className="flex items-center gap-2 text-neutral-300"><ShoppingBag className="w-4 h-4 text-amber-400" /> Lifetime Orders: {selectedCust.totalOrders}</p>
              <p className="flex items-center gap-2 text-neutral-300"><Award className="w-4 h-4 text-amber-400" /> Lifetime Spend: ${selectedCust.totalSpent}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
