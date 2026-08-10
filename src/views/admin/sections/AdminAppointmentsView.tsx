import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, User } from "lucide-react";

export const AdminAppointmentsView: React.FC = () => {
  const { appointments, updateAppointmentStatus } = useAdmin();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filtered = appointments.filter(
    (a) => selectedStatus === "all" || a.status === selectedStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/90 border border-neutral-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" /> In-Store Eye Exam Appointments ({filtered.length})
          </h2>
          <p className="text-xs text-neutral-400">Optometric schedules, contact lens fittings, and digital vision checks</p>
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white"
        >
          <option value="all">All Appointments</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((apt) => (
          <div key={apt.id} className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span className="font-extrabold text-white text-sm">{apt.date} at {apt.timeSlot}</span>
              </div>

              <span
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                  apt.status === "Completed"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : apt.status === "Confirmed"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }`}
              >
                {apt.status}
              </span>
            </div>

            <div className="space-y-1 text-xs text-neutral-300">
              <p className="font-extrabold text-white text-sm">{apt.patientName}</p>
              <p className="text-neutral-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {apt.storeName}</p>
              <p className="text-neutral-400 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-amber-400" /> Optometrist: {apt.optometristName}</p>
              <p className="text-amber-400 font-bold mt-1">Exam Type: {apt.testType}</p>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-end gap-2">
              <button
                onClick={() => updateAppointmentStatus(apt.id, "Completed")}
                className="px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold rounded-lg"
              >
                Mark Completed
              </button>
              <button
                onClick={() => updateAppointmentStatus(apt.id, "Cancelled")}
                className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-bold rounded-lg"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
