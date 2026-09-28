import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyC_n3cv6GtwPLJKzoPifJH9T4RQCw-B8tg",
  authDomain: "futurewithfarhan.firebaseapp.com",
  projectId: "futurewithfarhan",
  storageBucket: "futurewithfarhan.firebasestorage.app",
  messagingSenderId: "763151641247",
  appId: "1:763151641247:web:6a25097d11277dfd28d0aa",
};

const app = initializeApp(firebaseConfig);

// ✅ Fix error 1 & 4 — new cache config replaces enableIndexedDbPersistence
export const db = initializeFirestore(app, {
  localCache: {
    kind: "persistent",
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  },
});

// Auth setup
let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  const { initializeAuth, getReactNativePersistence } = require("firebase/auth");
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
export const storage = getStorage(app);
export default app;