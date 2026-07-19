import { db } from "./config";
import {
  doc, setDoc, deleteDoc, getDocs,
  collection, query, where, serverTimestamp,
} from "firebase/firestore";

export async function addBookmark(userId, item) {
  const id = `${userId}_${item.id}`;
  await setDoc(doc(db, "bookmarks", id), {
    userId,
    itemId: item.id,
    type: item.type, // "note" | "mcq" | "paper" | "video" | "scholarship"
    title: item.title,
    category: item.category || "",
    createdAt: serverTimestamp(),
  });
}

export async function removeBookmark(userId, itemId) {
  const id = `${userId}_${itemId}`;
  await deleteDoc(doc(db, "bookmarks", id));
}

export async function getUserBookmarks(userId, type = null) {
  let q;
  if (type) {
    q = query(
      collection(db, "bookmarks"),
      where("userId", "==", userId),
      where("type", "==", type)
    );
  } else {
    q = query(collection(db, "bookmarks"), where("userId", "==", userId));
  }
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function isBookmarked(userId, itemId) {
  const { getDoc } = await import("firebase/firestore");
  const id = `${userId}_${itemId}`;
  const snap = await getDoc(doc(db, "bookmarks", id));
  return snap.exists();
}
