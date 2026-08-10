import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";
import { deleteUser } from "firebase/auth";

export interface FirestoreUserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  circlePoints?: number;
  circleTier?: "Silver" | "Gold" | "Platinum";
}

export async function getUserProfile(uid: string): Promise<FirestoreUserData | null> {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as FirestoreUserData;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function createOrUpdateUserProfile(uid: string, data: Partial<FirestoreUserData>) {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid,
        firstName: data.firstName || "Member",
        lastName: data.lastName || "",
        email: data.email || "",
        photoURL: data.photoURL || "",
        phone: data.phone || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        circlePoints: 100, // Welcome bonus
        circleTier: "Silver"
      });
    } else {
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
  }
}

export async function deleteUserAccount(uid: string) {
  try {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
    if (auth.currentUser) {
      await deleteUser(auth.currentUser);
    }
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
}
