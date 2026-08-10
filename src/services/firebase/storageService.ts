import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebaseConfig";

export async function uploadPrescriptionFileToStorage(
  uid: string,
  prescriptionId: string,
  file: File
): Promise<{ storagePath: string; downloadUrl: string }> {
  const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file format. Only PDF, JPG, PNG, and WEBP files are allowed.");
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error("File size exceeds maximum limit of 10MB.");
  }

  const storagePath = `prescriptions/${uid}/${prescriptionId}_${file.name}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);

  return { storagePath, downloadUrl };
}

export async function deleteFileFromStorage(storagePath: string) {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting file from storage:", error);
  }
}
