import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Settings, Save, Shield, DollarSign, Truck, Sparkles, Check, UserCheck, Key, ShieldAlert } from "lucide-react";

export const AdminSettingsView: React.FC = () => {
  const { settings, updateSettings, authorizedEmail } = useAdmin();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-400" /> System Operations & Platform Settings
        </h2>
        <p className="text-xs text-neutral-400">Configure global currency, tax rates, free shipping rules, and security enforcement</p>
      </div>

      {/* Admin Privilege & Access Control Card */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-4 text-xs shadow-xl">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" /> Authorized Admin Personnel & Access Control
        </h3>

        <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm font-mono">{authorizedEmail}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">Primary Administrator Account — Full System Read/Write Privileges</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] rounded-lg font-bold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" /> Access Granted
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-6 text-xs shadow-xl">
        {saved && (
          <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center gap-2">
            <Check className="w-4 h-4" /> Operations settings saved successfully!
          </div>
        )}

        {/* Financial Rules */}
        <div className="space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" /> Financial & Currency Configuration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-neutral-300">Base Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-neutral-300">Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.taxRate}
                onChange={(e) => setForm({ ...form, taxRate: Number(e.target.value) })}
                className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-neutral-300">Free Shipping Threshold ($)</label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                className="w-full mt-1 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Operational Feature Toggles */}
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Operational Feature Toggles
          </h3>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 bg-neutral-950 rounded-2xl border border-neutral-800 cursor-pointer">
              <div>
                <p className="font-bold text-white">3D Real-Time Virtual Try-On</p>
                <p className="text-[10px] text-neutral-400">Enable WebGL Three.js & MediaPipe face mesh landmarks on product pages</p>
              </div>
              <input
                type="checkbox"
                checked={form.enableVirtualTryOn}
                onChange={(e) => setForm({ ...form, enableVirtualTryOn: e.target.checked })}
                className="w-5 h-5 rounded text-amber-500 bg-neutral-900 border-neutral-700"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-neutral-950 rounded-2xl border border-neutral-800 cursor-pointer">
              <div>
                <p className="font-bold text-white">Require Prescription Verification</p>
                <p className="text-[10px] text-neutral-400">Require optometrist verification before placing order in lens crafting queue</p>
              </div>
              <input
                type="checkbox"
                checked={form.requireRxVerification}
                onChange={(e) => setForm({ ...form, requireRxVerification: e.target.checked })}
                className="w-5 h-5 rounded text-amber-500 bg-neutral-900 border-neutral-700"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
};
