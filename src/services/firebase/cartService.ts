import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { CartItem } from "../../types";

export async function getRemoteCart(uid: string): Promise<CartItem[]> {
  try {
    const cartCol = collection(db, "users", uid, "cart");
    const snap = await getDocs(cartCol);
    const items: CartItem[] = [];
    snap.forEach((docSnap) => {
      items.push(docSnap.data() as CartItem);
    });
    return items;
  } catch (error) {
    console.error("Error fetching remote cart:", error);
    return [];
  }
}

export async function saveRemoteCart(uid: string, items: CartItem[]) {
  try {
    const batch = writeBatch(db);
    // First clear existing cart docs
    const cartCol = collection(db, "users", uid, "cart");
    const snap = await getDocs(cartCol);
    snap.forEach((d) => batch.delete(d.ref));

    items.forEach((item) => {
      const itemRef = doc(db, "users", uid, "cart", item.cartItemId);
      batch.set(itemRef, item);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error saving remote cart:", error);
  }
}

export function mergeCarts(guestCart: CartItem[], remoteCart: CartItem[]): CartItem[] {
  const merged = [...remoteCart];
  for (const guestItem of guestCart) {
    const existingIndex = merged.findIndex(
      (m) =>
        m.product.id === guestItem.product.id &&
        m.selectedColor.name === guestItem.selectedColor.name &&
        (m.lensConfig?.usage || "no-lens") === (guestItem.lensConfig?.usage || "no-lens")
    );
    if (existingIndex > -1) {
      const updatedQty = merged[existingIndex].quantity + guestItem.quantity;
      const unitPrice = merged[existingIndex].totalItemPrice / merged[existingIndex].quantity;
      merged[existingIndex] = {
        ...merged[existingIndex],
        quantity: updatedQty,
        totalItemPrice: unitPrice * updatedQty
      };
    } else {
      merged.push(guestItem);
    }
  }
  return merged;
}
