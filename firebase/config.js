import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

// Enable offline persistence — works without internet after first load
import { enableIndexedDbPersistence } from "firebase/firestore";
enableIndexedDbPersistence(db).catch(err => {
  if (err.code === "failed-precondition") {
    console.log("Offline persistence: multiple tabs open");
  } else if (err.code === "unimplemented") {
    console.log("Offline persistence: not supported on this browser");
  }
});
