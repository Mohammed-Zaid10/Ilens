import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { WishlistItem } from "../../types";

export async function getRemoteWishlist(uid: string): Promise<WishlistItem[]> {
  try {
    const wishlistCol = collection(db, "users", uid, "wishlist");
    const snap = await getDocs(wishlistCol);
    const items: WishlistItem[] = [];
    snap.forEach((docSnap) => {
      items.push(docSnap.data() as WishlistItem);
    });
    return items;
  } catch (error) {
    console.error("Error getting remote wishlist:", error);
    return [];
  }
}

export async function saveRemoteWishlist(uid: string, items: WishlistItem[]) {
  try {
    const batch = writeBatch(db);
    const wishlistCol = collection(db, "users", uid, "wishlist");
    const snap = await getDocs(wishlistCol);
    snap.forEach((d) => batch.delete(d.ref));

    items.forEach((item) => {
      const docRef = doc(db, "users", uid, "wishlist", item.product.id);
      batch.set(docRef, item);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error saving remote wishlist:", error);
  }
}

export function mergeWishlists(guestList: WishlistItem[], remoteList: WishlistItem[]): WishlistItem[] {
  const map = new Map<string, WishlistItem>();
  remoteList.forEach((item) => map.set(item.product.id, item));
  guestList.forEach((item) => {
    if (!map.has(item.product.id)) {
      map.set(item.product.id, item);
    }
  });
  return Array.from(map.values());
}
