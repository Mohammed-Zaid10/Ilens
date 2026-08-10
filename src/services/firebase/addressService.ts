import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getUserAddresses(uid: string): Promise<Address[]> {
  try {
    const colRef = collection(db, "users", uid, "addresses");
    const snap = await getDocs(colRef);
    const addresses: Address[] = [];
    snap.forEach((d) => addresses.push(d.data() as Address));
    return addresses;
  } catch (error) {
    console.error("Error getting user addresses:", error);
    return [];
  }
}

export async function saveAddress(uid: string, address: Address) {
  try {
    if (address.isDefault) {
      await clearDefaultAddresses(uid);
    }
    const docRef = doc(db, "users", uid, "addresses", address.id);
    await setDoc(docRef, {
      ...address,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving address:", error);
    throw error;
  }
}

export async function deleteAddress(uid: string, addressId: string) {
  try {
    const docRef = doc(db, "users", uid, "addresses", addressId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
}

export async function setDefaultAddress(uid: string, addressId: string) {
  try {
    await clearDefaultAddresses(uid);
    const docRef = doc(db, "users", uid, "addresses", addressId);
    await updateDoc(docRef, { isDefault: true, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
}

async function clearDefaultAddresses(uid: string) {
  const colRef = collection(db, "users", uid, "addresses");
  const snap = await getDocs(colRef);
  const batch = writeBatch(db);
  snap.forEach((d) => {
    if (d.data().isDefault) {
      batch.update(d.ref, { isDefault: false });
    }
  });
  await batch.commit();
}
