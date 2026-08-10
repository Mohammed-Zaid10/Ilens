import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { PendingPrescription } from "../../../types/admin";
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  AlertCircle,
  Stethoscope,
  X,
  Send
} from "lucide-react";

export const AdminPrescriptionsView: React.FC = () => {
  const { prescriptions, updatePrescriptionStatus } = useAdmin();
  const [filterStatus, setFilterStatus] = useState<string>("Pending Verification");
  const [selectedRx, setSelectedRx] = useState<PendingPrescription | null>(null);
  const [resubmitNote, setResubmitNote] = useState("");

  const filtered = prescriptions.filter(
    (r) => filterStatus === "all" || r.status === filterStatus
  );

  const handleApprove = (id: string) => {
    updatePrescriptionStatus(id, "Approved");
    if (selectedRx?.id === id) setSelectedRx(null);
  };

  const handleResubmit = (id: string) => {
    updatePrescriptionStatus(id, "Resubmission Requested", resubmitNote || "Please upload a clearer image of your optical prescription.");
    setResubmitNote("");
    if (selectedRx?.id === id) setSelectedRx(null);
  };

  const handleReject = (id: string) => {
    updatePrescriptionStatus(id, "Rejected", "Prescription expired or invalid doctor license.");
    if (selectedRx?.id === id) setSelectedRx(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" /> Optical Prescription Verification Queue ({filtered.length})
          </h2>
          <p className="text-xs text-neutral-400">
            Verify pupil distance (PD), sphere, cylinder & doctor signatures prior to lens surfacing
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-neutral-900/60 border border-neutral-800/80 p-3 rounded-2xl">
        {["Pending Verification", "Approved", "Resubmission Requested", "Rejected", "all"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
              filterStatus === st
                ? "bg-amber-500 text-neutral-950 font-extrabold shadow-md"
                : "bg-neutral-950 text-neutral-400 hover:text-white"
            }`}
          >
            {st === "all" ? "All Prescriptions" : st}
          </button>
        ))}
      </div>

      {/* Prescription Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rx) => (
          <div
            key={rx.id}
            className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="font-extrabold text-white text-base">{rx.customerName}</h3>
                <p className="text-xs text-amber-400 font-mono font-bold mt-0.5">Order: {rx.orderId}</p>
              </div>

              <span
                className={`px-3 py-1 text-[10px] font-extrabold rounded-full border font-mono ${
                  rx.status === "Approved"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : rx.status === "Pending Verification"
                    ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                    : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                }`}
              >
                {rx.status}
              </span>
            </div>

            {/* SPH / CYL / AXIS Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  OD (Right Eye)
                </span>
                <p className="font-mono text-white font-bold">SPH: {rx.odSph}</p>
                <p className="font-mono text-neutral-300">CYL: {rx.odCyl}</p>
                <p className="font-mono text-neutral-300">AXIS: {rx.odAxis}°</p>
                {rx.odAdd && <p className="font-mono text-neutral-400">ADD: {rx.odAdd}</p>}
              </div>

              <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  OS (Left Eye)
                </span>
                <p className="font-mono text-white font-bold">SPH: {rx.osSph}</p>
                <p className="font-mono text-neutral-300">CYL: {rx.osCyl}</p>
                <p className="font-mono text-neutral-300">AXIS: {rx.osAxis}°</p>
                {rx.osAdd && <p className="font-mono text-neutral-400">ADD: {rx.osAdd}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <span className="font-mono font-bold text-white">Pupillary Distance (PD): {rx.pd} mm</span>
              <span>{rx.doctorName || "Self-Reported Rx"}</span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setSelectedRx(rx)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" /> Inspect Document
              </button>

              {rx.status === "Pending Verification" && (
                <>
                  <button
                    onClick={() => handleApprove(rx.id)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1 shadow-md shadow-emerald-500/10"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(rx.id)}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-bold rounded-xl transition-colors border border-red-500/30"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 py-16 text-center text-neutral-500 bg-neutral-900/50 border border-neutral-800 rounded-3xl space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-white">Prescription Queue Clean</h4>
            <p className="text-xs">No optical records matching this filter status.</p>
          </div>
        )}
      </div>

      {/* Inspect Rx Modal */}
      {selectedRx && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-white text-sm">Optical Prescription Audit</h3>
              <button onClick={() => setSelectedRx(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedRx.fileUrl ? (
              <div className="rounded-2xl overflow-hidden border border-neutral-800 max-h-56">
                <img src={selectedRx.fileUrl} alt="Rx Paper" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="p-8 bg-neutral-950 rounded-2xl border border-neutral-800 text-center text-neutral-400 font-mono">
                No uploaded image — Form data input by customer.
              </div>
            )}

            <div className="space-y-2">
              <label className="font-bold text-neutral-300">Request Resubmission Note</label>
              <textarea
                value={resubmitNote}
                onChange={(e) => setResubmitNote(e.target.value)}
                placeholder="Explain why resubmission is needed (e.g., blurry image, missing PD)..."
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white h-16"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => handleResubmit(selectedRx.id)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl"
              >
                Send Resubmission Request
              </button>
              <button
                onClick={() => handleApprove(selectedRx.id)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-xl"
              >
                Approve Rx
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
