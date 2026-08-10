import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { PrescriptionData } from "../../types";

export interface PrescriptionRecord {
  id: string;
  name: string;
  type: string; // e.g. "Distance", "Reading", "Progressive"
  createdAt: string;
  updatedAt: string;
  status: "Active" | "Expired" | "Pending Review";
  fileName?: string;
  storagePath?: string;
  downloadUrl?: string;
  prescriptionDetails?: PrescriptionData;
  notes?: string;
}

export async function getUserPrescriptions(uid: string): Promise<PrescriptionRecord[]> {
  try {
    const colRef = collection(db, "users", uid, "prescriptions");
    const snap = await getDocs(colRef);
    const records: PrescriptionRecord[] = [];
    snap.forEach((d) => records.push(d.data() as PrescriptionRecord));
    return records;
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return [];
  }
}

export async function saveUserPrescription(uid: string, record: PrescriptionRecord) {
  try {
    const docRef = doc(db, "users", uid, "prescriptions", record.id);
    await setDoc(docRef, {
      ...record,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving prescription:", error);
    throw error;
  }
}

export async function deleteUserPrescription(uid: string, prescriptionId: string) {
  try {
    const docRef = doc(db, "users", uid, "prescriptions", prescriptionId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting prescription:", error);
    throw error;
  }
}
