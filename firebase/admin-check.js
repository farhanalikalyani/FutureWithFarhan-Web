import { doc, getDoc } from "firebase/firestore";
import { db } from "./config";

export async function isUserAdmin(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().isAdmin === true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

export async function makeUserAdmin(uid) {
  const { updateDoc, doc } = await import("firebase/firestore");
  await updateDoc(doc(db, "users", uid), { isAdmin: true });
}
