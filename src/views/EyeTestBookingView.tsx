import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MOCK_STORES } from "../data/stores";
import { EyeTestBooking } from "../types";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileText
} from "lucide-react";

export const EyeTestBookingView: React.FC<{ storeId?: string }> = ({ storeId }) => {
  const { user, addEyeTestBooking, setActiveView, formatPrice } = useApp();

  const [selectedStoreId, setSelectedStoreId] = useState<string>(storeId || MOCK_STORES[0].id);
  const selectedStore = MOCK_STORES.find((s) => s.id === selectedStoreId) || MOCK_STORES[0];

  const examTypes = [
    {
      title: "Comprehensive Eye Exam",
      desc: "Full digital retinal topography, glaucoma screening, and precision refraction.",
      price: 120,
      duration: "45 mins"
    },
    {
      title: "Contact Lens Fitting",
      desc: "Corneal curvature mapping, hydration trial, and insertion coaching.",
      price: 150,
      duration: "60 mins"
    },
    {
      title: "Digital Eyestrain Check",
      desc: "Blue-light fatigue testing, accommodation focus check, and workstation optics.",
      price: 80,
      duration: "30 mins"
    }
  ];

  const [selectedExamIndex, setSelectedExamIndex] = useState(0);
  const [selectedOptometrist, setSelectedOptometrist] = useState(selectedStore.optometrists[0]?.name || "Dr. Elena Rostova, OD");
  const [selectedDate, setSelectedDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:30 AM");

  const [patientName, setPatientName] = useState(user.name || "Alexander Mercer");
  const [patientEmail, setPatientEmail] = useState(user.email || "alexander.mercer@example.com");
  const [patientPhone, setPatientPhone] = useState(user.phone || "+1 (555) 234-5678");

  const [bookingConfirmed, setBookingConfirmed] = useState<EyeTestBooking | null>(null);

  const timeSlots = ["09:30 AM", "10:30 AM", "11:45 AM", "02:00 PM", "03:30 PM", "05:00 PM"];

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const exam = examTypes[selectedExamIndex];

    const booking: EyeTestBooking = {
      bookingId: `EXAM-${Math.floor(10000 + Math.random() * 90000)}`,
      store: selectedStore,
      optometristName: selectedOptometrist,
      testType: exam.title as any,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      patientName,
      patientEmail,
      patientPhone,
      status: "Confirmed",
      price: exam.price
    };

    addEyeTestBooking(booking);
    setBookingConfirmed(booking);
  };

  if (bookingConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-neutral-900 text-white p-8 sm:p-12 rounded-3xl border border-neutral-800 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Appointment Confirmed</span>
          <h1 className="text-3xl font-black font-serif">Eye Examination Scheduled!</h1>
          <p className="text-xs sm:text-sm text-neutral-300">
            Booking reference <strong className="text-amber-400 font-mono">{bookingConfirmed.bookingId}</strong>. A calendar invite has been sent to {bookingConfirmed.patientEmail}.
          </p>

          <div className="bg-neutral-800/80 p-6 rounded-2xl border border-neutral-700 text-left text-xs space-y-3 max-w-lg mx-auto mt-4">
            <div className="flex justify-between border-b border-neutral-700 pb-2">
              <span className="text-neutral-400">Atelier Location</span>
              <span className="font-bold text-white">{bookingConfirmed.store.name}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-700 pb-2">
              <span className="text-neutral-400">Exam Type</span>
              <span className="font-bold text-white">{bookingConfirmed.testType}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-700 pb-2">
              <span className="text-neutral-400">Doctor</span>
              <span className="font-bold text-amber-400">{bookingConfirmed.optometristName}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-700 pb-2">
              <span className="text-neutral-400">Date & Time Slot</span>
              <span className="font-bold text-white">{bookingConfirmed.date} at {bookingConfirmed.timeSlot}</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setActiveView({ type: "home" })}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-2xl shadow-md"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-3xl border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">In-Store Clinical Eye Care</span>
          <h1 className="text-3xl font-black font-serif text-white">Schedule an Optometric Exam</h1>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Book a 1:1 clinical exam with our licensed doctors using state-of-the-art corneal topography, phoropter precision refraction, and 3D digital retinal imaging.
          </p>
        </div>
        <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden border border-neutral-700/80 shrink-0 shadow-inner">
          <img
            src="/images/eye_testing_machine.jpg"
            alt="ILens Optometry Clinic Eye Exam Machine"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <form onSubmit={handleSubmitBooking} className="space-y-8">
        {/* 1. Select Store */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black font-serif text-neutral-950 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <span>1. Select ILens Atelier Store Location</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_STORES.map((store) => (
              <div
                key={store.id}
                onClick={() => {
                  setSelectedStoreId(store.id);
                  if (store.optometrists[0]) setSelectedOptometrist(store.optometrists[0].name);
                }}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedStoreId === store.id ? "border-amber-500 bg-amber-50/50" : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <h4 className="font-bold text-xs text-neutral-950">{store.name}</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">{store.address}, {store.city}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Select Exam Type */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black font-serif text-neutral-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>2. Select Exam Type</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {examTypes.map((exam, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedExamIndex(idx)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between h-36 ${
                  selectedExamIndex === idx ? "border-amber-500 bg-amber-50/50" : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-neutral-950">{exam.title}</h4>
                    <span className="text-[10px] text-neutral-400 font-bold">{exam.duration}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">{exam.desc}</p>
                </div>
                <span className="font-black text-amber-600 text-xs mt-2">{formatPrice(exam.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Date, Time & Doctor Selection */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black font-serif text-neutral-950 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" />
            <span>3. Date, Time & Doctor</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Preferred Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Time Slot</label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium"
              >
                {timeSlots.map((ts) => (
                  <option key={ts} value={ts}>{ts}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Select Optometrist</label>
              <select
                value={selectedOptometrist}
                onChange={(e) => setSelectedOptometrist(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium"
              >
                {selectedStore.optometrists.map((doc) => (
                  <option key={doc.name} value={doc.name}>{doc.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. Patient Information */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black font-serif text-neutral-950 flex items-center gap-2">
            <User className="w-5 h-5 text-amber-600" />
            <span>4. Patient Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Patient Full Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Email Address</label>
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-700">Phone Number</label>
              <input
                type="text"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center gap-2"
            >
              <span>Confirm Appointment ({formatPrice(examTypes[selectedExamIndex].price)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
