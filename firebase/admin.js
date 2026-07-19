import { db } from "./config";
import {
  collection, addDoc, getDocs, getDoc,
  updateDoc, deleteDoc, doc, query,
  orderBy, serverTimestamp, setDoc, limit,
} from "firebase/firestore";

// ─── DASHBOARD STATS ──────────────────────────────────────
export async function getDashboardStats() {
  const cols = ["users","notes","pastPapers","mcqs","videos","scholarships","notifications","universities","community","testResults"];
  const results = await Promise.all(
    cols.map(c => getDocs(query(collection(db, c), limit(1000))).catch(() => ({ size: 0 })))
  );
  return Object.fromEntries(cols.map((c, i) => [c, results[i].size]));
}

// ─── USERS ────────────────────────────────────────────────
export async function getAllUsers() {
  const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc"), limit(200)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function updateUserRole(uid, isAdmin) {
  await updateDoc(doc(db, "users", uid), { isAdmin });
}
export async function deleteUserDoc(uid) {
  await deleteDoc(doc(db, "users", uid));
}

// ─── NOTES ────────────────────────────────────────────────
export async function addNote(data) {
  return await addDoc(collection(db, "notes"), { ...data, createdAt: serverTimestamp(), downloads: 0 });
}
export async function getAllNotes() {
  const snap = await getDocs(query(collection(db, "notes"), orderBy("createdAt", "desc"), limit(100)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function updateNote(id, data) { await updateDoc(doc(db, "notes", id), data); }
export async function deleteNote(id) { await deleteDoc(doc(db, "notes", id)); }

// ─── PAST PAPERS ──────────────────────────────────────────
export async function addPastPaper(data) {
  return await addDoc(collection(db, "pastPapers"), { ...data, createdAt: serverTimestamp(), downloads: 0 });
}
export async function getAllPastPapers() {
  const snap = await getDocs(query(collection(db, "pastPapers"), orderBy("createdAt", "desc"), limit(100)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function updatePastPaper(id, data) { await updateDoc(doc(db, "pastPapers", id), data); }
export async function deletePastPaper(id) { await deleteDoc(doc(db, "pastPapers", id)); }

// ─── MCQs ─────────────────────────────────────────────────
export async function addMCQAdmin(data) {
  return await addDoc(collection(db, "mcqs"), { ...data, createdAt: serverTimestamp() });
}
export async function getAllMCQs() {
  const snap = await getDocs(query(collection(db, "mcqs"), orderBy("createdAt", "desc"), limit(500)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function updateMCQ(id, data) { await updateDoc(doc(db, "mcqs", id), data); }
export async function deleteMCQAdmin(id) { await deleteDoc(doc(db, "mcqs", id)); }

// ─── VIDEOS ───────────────────────────────────────────────
export async function addVideoAdmin(data) {
  return await addDoc(collection(db, "videos"), { ...data, createdAt: serverTimestamp(), views: 0 });
}
export async function getAllVideos() {
  const snap = await getDocs(query(collection(db, "videos"), orderBy("createdAt", "desc"), limit(100)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function deleteVideoAdmin(id) { await deleteDoc(doc(db, "videos", id)); }

// ─── SCHOLARSHIPS ─────────────────────────────────────────
export async function addScholarship(data) {
  return await addDoc(collection(db, "scholarships"), { ...data, createdAt: serverTimestamp() });
}
export async function getAllScholarships() {
  const snap = await getDocs(query(collection(db, "scholarships"), orderBy("createdAt", "desc"), limit(100)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function updateScholarship(id, data) { await updateDoc(doc(db, "scholarships", id), data); }
export async function deleteScholarship(id) { await deleteDoc(doc(db, "scholarships", id)); }

// ─── NOTIFICATIONS ────────────────────────────────────────
export async function addNotification(data) {
  return await addDoc(collection(db, "notifications"), { ...data, createdAt: serverTimestamp() });
}
export async function getAllNotifications() {
  const snap = await getDocs(query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(50)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function deleteNotification(id) { await deleteDoc(doc(db, "notifications", id)); }

// ─── UNIVERSITIES ─────────────────────────────────────────
export async function getAllUniversities() {
  const snap = await getDocs(query(collection(db, "universities"), orderBy("ranking"), limit(100)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
