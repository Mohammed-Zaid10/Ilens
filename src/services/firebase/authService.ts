import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";
import { createOrUpdateUserProfile } from "./userService";

export async function signUpWithEmail(email: string, pass: string, firstName: string, lastName: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;
  const fullName = `${firstName} ${lastName}`.trim();
  
  await updateProfile(user, { displayName: fullName });

  await createOrUpdateUserProfile(user.uid, {
    uid: user.uid,
    firstName,
    lastName,
    email: user.email || email,
    photoURL: user.photoURL || "",
    phone: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return user;
}

export async function signInWithEmail(email: string, pass: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

export async function signInWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;
  const nameParts = (user.displayName || "").split(" ");
  const firstName = nameParts[0] || "User";
  const lastName = nameParts.slice(1).join(" ") || "";

  await createOrUpdateUserProfile(user.uid, {
    uid: user.uid,
    firstName,
    lastName,
    email: user.email || "",
    photoURL: user.photoURL || "",
    phone: user.phoneNumber || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  return user;
}

export async function sendResetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function signOutUser() {
  await signOut(auth);
}
