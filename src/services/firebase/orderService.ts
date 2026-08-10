import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { Order, OrderStatus } from "../../types";

/**
 * Save order both in global `orders/{orderId}` collection
 * and in `users/{uid}/orders/{orderId}` if user is authenticated.
 */
export async function saveUserOrder(uid: string | null | undefined, order: Order): Promise<void> {
  try {
    const orderData = {
      ...order,
      userId: uid || null,
      createdAt: order.date || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Global orders collection (for guest tracking, admin, etc)
    const globalOrderRef = doc(db, "orders", order.id);
    await setDoc(globalOrderRef, orderData, { merge: true });

    // 2. User specific subcollection if logged in
    if (uid) {
      const userOrderRef = doc(db, "users", uid, "orders", order.id);
      await setDoc(userOrderRef, orderData, { merge: true });
    }
  } catch (error) {
    console.error("Error saving order to Firestore:", error);
    // Fallback gracefully so checkout completes even if network is offline
  }
}

/**
 * Fetch orders for a specific logged-in user.
 */
export async function getUserOrders(uid: string): Promise<Order[]> {
  try {
    const ordersCol = collection(db, "users", uid, "orders");
    const q = query(ordersCol, orderBy("date", "desc"));
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach((d) => {
      orders.push(d.data() as Order);
    });
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

/**
 * Fetch a single order by ID from the global collection.
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orderRef = doc(db, "orders", orderId.trim());
    const snap = await getDoc(orderRef);
    if (snap.exists()) {
      return snap.data() as Order;
    }
    return null;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
}

/**
 * Fetch order by ID and verify customer email or phone for guest order tracking.
 */
export async function getOrderByIdAndContact(
  orderId: string,
  emailOrPhone: string
): Promise<{ order: Order | null; error?: string }> {
  try {
    const cleanId = orderId.trim();
    const cleanContact = emailOrPhone.trim().toLowerCase();

    if (!cleanId) return { order: null, error: "Please enter an Order ID." };
    if (!cleanContact) return { order: null, error: "Please enter your Email or Phone number." };

    const order = await getOrderById(cleanId);
    if (!order) {
      return { order: null, error: "Order not found. Please double check your Order Number." };
    }

    const emailMatch = order.customerEmail.toLowerCase() === cleanContact;
    const phoneMatch =
      order.customerPhone &&
      order.customerPhone.replace(/[^0-9]/g, "").endsWith(cleanContact.replace(/[^0-9]/g, ""));

    if (emailMatch || phoneMatch) {
      return { order };
    }

    return {
      order: null,
      error: "The Email/Phone provided does not match the records for this Order Number."
    };
  } catch (error) {
    console.error("Error verifying order contact:", error);
    return { order: null, error: "Unable to retrieve order tracking. Please try again." };
  }
}

/**
 * Fetch all orders across all users for Admin Dashboard.
 */
export async function getAllOrders(): Promise<Order[]> {
  try {
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, orderBy("date", "desc"));
    const snap = await getDocs(q);
    const orders: Order[] = [];
    snap.forEach((d) => {
      orders.push(d.data() as Order);
    });
    return orders;
  } catch (error) {
    console.error("Error fetching all orders for admin:", error);
    return [];
  }
}

/**
 * Update Order status, tracking number, or return request status.
 */
export async function updateOrderStatus(
  orderId: string,
  userId: string | undefined,
  updates: Partial<Order>
): Promise<void> {
  try {
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Update global order
    const globalOrderRef = doc(db, "orders", orderId);
    await updateDoc(globalOrderRef, updateData);

    // Update user subcollection if userId exists
    if (userId) {
      const userOrderRef = doc(db, "users", userId, "orders", orderId);
      await updateDoc(userOrderRef, updateData);
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}
