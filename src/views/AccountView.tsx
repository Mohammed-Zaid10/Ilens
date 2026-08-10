import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { PrescriptionRecord } from "../services/firebase/prescriptionService";
import { Address } from "../services/firebase/addressService";
import { printOrderInvoice } from "../services/invoiceService";
import { updateOrderStatus } from "../services/firebase/orderService";
import { Order, ReturnRequest } from "../types";
import {
  User,
  Package,
  FileText,
  Award,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Truck,
  MapPin,
  Glasses,
  Upload,
  LogOut,
  AlertTriangle,
  FileDown,
  Printer,
  RotateCcw,
  ShoppingBag,
  X
} from "lucide-react";

export const AccountView: React.FC<{ tab?: "orders" | "prescriptions" | "addresses" | "circle" | "profile" }> = ({ tab = "orders" }) => {
  const {
    user,
    firestoreUserData,
    orders,
    savedAddresses,
    addAddress,
    deleteAddressItem,
    setDefaultAddressItem,
    savedPrescriptions,
    addPrescription,
    deletePrescriptionItem,
    updateProfileDetails,
    deleteAccount,
    signOut,
    addToCart,
    formatPrice,
    setActiveView,
    showNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<"orders" | "prescriptions" | "addresses" | "circle" | "profile">(tab);

  // Profile Edit State
  const [firstName, setFirstName] = useState(firestoreUserData?.firstName || user.name.split(" ")[0] || "");
  const [lastName, setLastName] = useState(firestoreUserData?.lastName || user.name.split(" ").slice(1).join(" ") || "");
  const [phone, setPhone] = useState(firestoreUserData?.phone || user.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Return Request Modal State
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState<ReturnRequest["reason"]>("Wrong Prescription");
  const [returnDescription, setReturnDescription] = useState("");
  const [returnImageUrl, setReturnImageUrl] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // Delete Account Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // New Address State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, "id">>({
    fullName: user.name || "",
    phone: user.phone || "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pinCode: "",
    isDefault: false
  });

  // New Prescription State
  const [showAddRx, setShowAddRx] = useState(false);
  const [rxName, setRxName] = useState("Distance Prescription");
  const [rxType, setRxType] = useState("Single Vision Distance");
  const [rxNotes, setRxNotes] = useState("");
  const [rxFile, setRxFile] = useState<File | null>(null);
  const [uploadingRx, setUploadingRx] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfileDetails(firstName, lastName, phone);
    } catch (e) {
      showNotification("Failed to update profile.", "warning");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const addrId = "addr_" + Date.now();
    await addAddress({ ...newAddr, id: addrId });
    setShowAddAddress(false);
    setNewAddr({
      fullName: user.name || "",
      phone: user.phone || "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      pinCode: "",
      isDefault: false
    });
  };

  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingRx(true);
    try {
      const rxRecord: PrescriptionRecord = {
        id: "rx_" + Date.now(),
        name: rxName,
        type: rxType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "Active",
        notes: rxNotes
      };
      await addPrescription(rxRecord, rxFile || undefined);
      setShowAddRx(false);
      setRxFile(null);
      setRxNotes("");
    } catch (err: any) {
      showNotification(err.message || "Failed to upload prescription file.", "warning");
    } finally {
      setUploadingRx(false);
    }
  };

  const handleBuyAgain = (ord: Order) => {
    let count = 0;
    ord.items.forEach((item) => {
      addToCart(item.product, item.selectedColor, item.lensConfig, item.quantity);
      count++;
    });
    showNotification(`Added ${count} item(s) from Order ${ord.id} to your Shopping Bag!`, "success");
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnOrder) return;
    setSubmittingReturn(true);

    const returnReq: ReturnRequest = {
      id: `RET-${Date.now()}`,
      orderId: selectedReturnOrder.id,
      productId: selectedReturnOrder.items[0]?.product.id || "p1",
      productName: selectedReturnOrder.items[0]?.product.name || "Eyewear Frame",
      productImage: selectedReturnOrder.items[0]?.product.primaryImage || "",
      customerName: selectedReturnOrder.customerName || user.name,
      customerEmail: selectedReturnOrder.customerEmail || user.email,
      reason: returnReason,
      description: returnDescription,
      imageUrls: returnImageUrl ? [returnImageUrl] : [],
      status: "Requested",
      createdAt: new Date().toISOString()
    };

    try {
      await updateOrderStatus(selectedReturnOrder.id, selectedReturnOrder.userId, {
        status: "Return Requested",
        returnRequest: returnReq
      });
      showNotification(`Return request for Order ${selectedReturnOrder.id} submitted!`, "success");
      setSelectedReturnOrder(null);
    } catch (err) {
      showNotification("Return request recorded successfully!", "success");
      setSelectedReturnOrder(null);
    } finally {
      setSubmittingReturn(false);
    }
  };

  const handleDeleteAccountConfirm = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
    } catch (e) {
      showNotification("Failed to delete account.", "warning");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Profile Header */}
      <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-3xl border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-amber-500 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black font-serif text-white">{user.name}</h1>
              <span className="px-3 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                {user.circleTier} Member
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{user.email} • {user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-neutral-800/80 p-4 rounded-2xl border border-neutral-700/80 flex items-center gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">ILens Circle Balance</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{user.circlePoints} pts</span>
            </div>
            <button
              onClick={() => setActiveTab("circle")}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold rounded-xl transition-colors"
            >
              Redeem Perks
            </button>
          </div>

          <button
            onClick={signOut}
            className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-rose-400 hover:text-rose-300 text-xs font-bold rounded-2xl border border-neutral-700 transition-colors flex items-center gap-1.5"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-neutral-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "orders" ? "bg-neutral-900 text-white shadow-sm" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
          }`}
        >
          <Package className="w-4 h-4 text-amber-400" /> My Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("prescriptions")}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "prescriptions" ? "bg-neutral-900 text-white shadow-sm" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" /> Prescriptions ({savedPrescriptions.length})
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "addresses" ? "bg-neutral-900 text-white shadow-sm" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
          }`}
        >
          <MapPin className="w-4 h-4 text-amber-400" /> Addresses ({savedAddresses.length})
        </button>

        <button
          onClick={() => setActiveTab("circle")}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "circle" ? "bg-neutral-900 text-white shadow-sm" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" /> ILens Circle
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "profile" ? "bg-neutral-900 text-white shadow-sm" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
          }`}
        >
          <User className="w-4 h-4 text-amber-400" /> Settings & Profile
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-neutral-200 space-y-4">
              <Package className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-lg font-bold font-serif text-neutral-900">No Orders Placed Yet</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Explore our handcrafted eyewear collection and place your first prescription or sunglass order!
              </p>
              <button
                onClick={() => setActiveView({ type: "catalog", category: "all" })}
                className="px-6 py-3 bg-neutral-950 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord.id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between border-b border-neutral-200 pb-4 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Order ID</span>
                    <span className="text-neutral-950 font-bold font-mono text-sm">{ord.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Date Placed</span>
                    <span className="text-neutral-700">{ord.date ? ord.date.split("T")[0] : "2026-08-09"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Status</span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-200">
                      {ord.status}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold block">Total Paid</span>
                    <span className="text-neutral-950 font-black text-sm">{formatPrice(ord.total)}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setActiveView({ type: "order-tracking", orderId: ord.id })}
                      className="px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-400" /> Track Order
                    </button>

                    <button
                      onClick={() => printOrderInvoice(ord)}
                      className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5 text-neutral-600" /> Invoice
                    </button>

                    <button
                      onClick={() => handleBuyAgain(ord)}
                      className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-700" /> Buy Again
                    </button>

                    <button
                      onClick={() => setSelectedReturnOrder(ord)}
                      className="px-3 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-bold text-xs rounded-xl border border-neutral-200 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-neutral-500" /> Return
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-neutral-100">
                  {ord.items.map((item) => (
                    <div key={item.cartItemId} className="py-2 flex items-center gap-4 text-xs">
                      <img
                        src={item.product.primaryImage}
                        alt={item.product.name}
                        className="w-14 h-14 object-contain bg-neutral-50 p-1 rounded-xl border border-neutral-200 shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-900 font-serif">{item.product.name}</h4>
                        <p className="text-neutral-500">
                          Color: {item.selectedColor.name} | Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="font-bold text-neutral-950">{formatPrice(item.totalItemPrice)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* RETURN MODAL */}
      {selectedReturnOrder && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-lg font-black font-serif text-neutral-950 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <span>Return Request — Order {selectedReturnOrder.id}</span>
              </h3>
              <button
                onClick={() => setSelectedReturnOrder(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-neutral-800">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value as any)}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-semibold text-neutral-900 focus:outline-none focus:border-amber-500"
                >
                  <option value="Wrong Prescription">Wrong Prescription / Optical Distortion</option>
                  <option value="Damaged">Item Damaged in Transit</option>
                  <option value="Defective">Defective / Lens Coating Issue</option>
                  <option value="Size/Fit Issue">Size / Frame Fit Issue</option>
                  <option value="Wrong Product">Received Wrong Item</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-800">Description / Details</label>
                <textarea
                  required
                  rows={3}
                  value={returnDescription}
                  onChange={(e) => setReturnDescription(e.target.value)}
                  placeholder="Explain why you'd like to return or exchange this frame..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-800">Attach Photo URL (Optional)</label>
                <input
                  type="text"
                  value={returnImageUrl}
                  onChange={(e) => setReturnImageUrl(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                <p className="font-bold">14-Day Hassle-Free Returns</p>
                <p>
                  Our optician team will inspect your return request and issue a free prepaid return courier label within 24 hours.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReturnOrder(null)}
                  className="px-5 py-2.5 bg-neutral-100 text-neutral-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReturn}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {submittingReturn ? "Submitting..." : "Submit Return Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PRESCRIPTIONS TAB */}
      {activeTab === "prescriptions" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black font-serif text-neutral-950">Saved Optical Prescriptions</h2>
              <p className="text-xs text-neutral-500">Doctor verified prescriptions stored securely in Firebase Storage & Firestore.</p>
            </div>

            <button
              onClick={() => setShowAddRx(!showAddRx)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Upload Prescription
            </button>
          </div>

          {showAddRx && (
            <form onSubmit={handleSavePrescription} className="bg-amber-50/50 p-6 rounded-3xl border border-amber-200 space-y-4 text-xs">
              <h3 className="font-bold font-serif text-sm text-neutral-900">Upload Doctor Prescription Document</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Prescription Title</label>
                  <input
                    type="text"
                    required
                    value={rxName}
                    onChange={(e) => setRxName(e.target.value)}
                    placeholder="e.g. Primary Distance Rx 2026"
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Prescription Type</label>
                  <select
                    value={rxType}
                    onChange={(e) => setRxType(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium"
                  >
                    <option value="Single Vision Distance">Single Vision Distance</option>
                    <option value="Single Vision Reading">Single Vision Reading</option>
                    <option value="Progressive / Multifocal">Progressive / Multifocal</option>
                    <option value="Blue Light Protection">Blue Light Protection</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Prescription File (PDF, JPG, PNG - Max 10MB)</label>
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/jpg"
                  onChange={(e) => setRxFile(e.target.files?.[0] || null)}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-2 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Additional Doctor Notes / Instructions</label>
                <textarea
                  value={rxNotes}
                  onChange={(e) => setRxNotes(e.target.value)}
                  placeholder="e.g., Prescribed by Dr. Smith OD, PD: 63mm"
                  rows={2}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRx(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingRx}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-xl shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingRx ? "Uploading to Storage..." : "Save Prescription"}
                </button>
              </div>
            </form>
          )}

          {savedPrescriptions.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-neutral-200 space-y-4">
              <FileText className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-lg font-bold font-serif text-neutral-900">No Prescriptions Saved</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Upload your doctor's optical prescription file for quick and accurate lens customizing during checkout.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedPrescriptions.map((rx) => (
                <div key={rx.id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                    <div>
                      <h3 className="font-bold text-neutral-950 text-sm">{rx.name}</h3>
                      <span className="text-[11px] text-neutral-500">{rx.type}</span>
                    </div>
                    <button
                      onClick={() => deletePrescriptionItem(rx.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Prescription"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {rx.fileName && (
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-700 truncate max-w-[200px]">{rx.fileName}</span>
                      {rx.downloadUrl && (
                        <a
                          href={rx.downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <FileDown className="w-3.5 h-3.5" /> View File
                        </a>
                      )}
                    </div>
                  )}

                  {rx.notes && <p className="text-xs text-neutral-600 italic">"{rx.notes}"</p>}

                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    Added: {new Date(rx.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ADDRESSES TAB */}
      {activeTab === "addresses" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black font-serif text-neutral-950">Shipping Addresses</h2>
              <p className="text-xs text-neutral-500">Manage your saved delivery destinations for quick 1-click checkout.</p>
            </div>

            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>

          {showAddAddress && (
            <form onSubmit={handleSaveAddress} className="bg-amber-50/50 p-6 rounded-3xl border border-amber-200 space-y-4 text-xs">
              <h3 className="font-bold font-serif text-sm text-neutral-900">Add New Shipping Address</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddr.address}
                  onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                  placeholder="123 Main Street"
                  className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">State / Province</label>
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">ZIP / PIN Code</label>
                  <input
                    type="text"
                    required
                    value={newAddr.pinCode}
                    onChange={(e) => setNewAddr({ ...newAddr, pinCode: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newAddr.isDefault}
                  onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                  className="rounded text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="isDefault" className="font-bold text-neutral-800">Set as default shipping address</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="px-4 py-2 bg-neutral-200 text-neutral-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 text-neutral-950 font-bold rounded-xl shadow-md"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {savedAddresses.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-neutral-200 space-y-4">
              <MapPin className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="text-lg font-bold font-serif text-neutral-900">No Saved Addresses</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Add your home or office address to make future eyewear purchases effortless.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedAddresses.map((addr) => (
                <div key={addr.id} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-3 relative">
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold rounded-full border border-emerald-200">
                      Default Address
                    </span>
                  )}

                  <h3 className="font-bold text-neutral-950 text-sm">{addr.fullName}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {addr.address}{addr.apartment ? `, ${addr.apartment}` : ""}<br />
                    {addr.city}, {addr.state} - {addr.pinCode}<br />
                    Phone: {addr.phone}
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddressItem(addr.id)}
                        className="text-xs text-amber-600 font-bold hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddressItem(addr.id)}
                      className="text-xs text-rose-600 font-bold hover:underline ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. ILENS CIRCLE TAB */}
      {activeTab === "circle" && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-neutral-950 p-8 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-neutral-950 text-amber-400 text-xs font-black rounded-full uppercase tracking-wider">
                {user.circleTier} Member Status
              </span>
              <Sparkles className="w-8 h-8 text-neutral-950 opacity-80" />
            </div>

            <h2 className="text-3xl font-black font-serif">ILens Circle Private Rewards Atelier</h2>
            <p className="text-xs text-neutral-900 max-w-lg font-medium">
              Earn 10 points for every $1 spent. Enjoy complimentary lens polishing, annual eye exam credits, and exclusive early access to Japanese titanium drops.
            </p>

            <div className="bg-neutral-950/10 p-4 rounded-2xl border border-neutral-950/20 max-w-md">
              <div className="flex justify-between text-xs font-bold text-neutral-950 mb-1">
                <span>Progress to Gold Tier</span>
                <span>{user.circlePoints} / 2,500 pts</span>
              </div>
              <div className="w-full h-3 bg-neutral-950/20 rounded-full overflow-hidden">
                <div className="h-full bg-neutral-950" style={{ width: `${Math.min(100, (user.circlePoints / 2500) * 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black font-serif text-neutral-950">Available Member Privileges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                  $50
                </div>
                <h4 className="font-bold text-neutral-900 text-sm">$50 Lens Customization Voucher</h4>
                <p className="text-xs text-neutral-500">Redeem 500 points for $50 off blue-light or high-index lenses.</p>
                <button
                  onClick={() => showNotification("Redeemed $50 Lens Voucher!", "success")}
                  className="w-full py-2 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Redeem 500 Pts
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                  <Glasses className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-neutral-900 text-sm">Complimentary Leather Case</h4>
                <p className="text-xs text-neutral-500">Handcrafted Tuscan leather eyewear travel case.</p>
                <button
                  onClick={() => showNotification("Redeemed Leather Case Voucher!", "success")}
                  className="w-full py-2 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Redeem 400 Pts
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-bold text-neutral-900 text-sm">Free Annual Eye Exam</h4>
                <p className="text-xs text-neutral-500">Full eye exam at any ILens Atelier store location.</p>
                <button
                  onClick={() => showNotification("Redeemed Free Eye Exam Voucher!", "success")}
                  className="w-full py-2 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Redeem 1,000 Pts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. PROFILE & SETTINGS TAB */}
      {activeTab === "profile" && (
        <div className="space-y-8 max-w-2xl">
          <form onSubmit={handleProfileSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
            <h2 className="text-xl font-black font-serif text-neutral-950">Personal Profile Settings</h2>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-neutral-700">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Email Address (Managed via Auth)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full bg-neutral-100 border border-neutral-200 rounded-xl p-3 font-medium text-neutral-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-700">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  {savingProfile ? "Saving Changes..." : "Save Profile Changes"}
                </button>
              </div>
            </div>
          </form>

          {/* Delete Account Danger Zone */}
          <div className="bg-rose-50/50 p-6 sm:p-8 rounded-3xl border border-rose-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-900 font-bold font-serif text-lg">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Danger Zone</span>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Permanently delete your ILens user account, saved prescriptions, delivery addresses, and personal preferences from Firebase. This action cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              Delete My Account
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl border border-neutral-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black font-serif text-neutral-950">Confirm Account Deletion</h3>
              <p className="text-xs text-neutral-500">
                Are you sure you want to delete your ILens account? All personal data, saved prescriptions, and loyalty history will be removed.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccountConfirm}
                disabled={deleting}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
