import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

// Friendly error messages — no more Firebase error codes shown to users
function getFriendlyError(code) {
  const errors = {
    "auth/user-not-found": "No account found with this email address.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
    "auth/network-request-failed": "No internet connection. Please check your network.",
    "auth/invalid-credential": "Incorrect email or password. Please try again.",
    "auth/user-disabled": "This account has been disabled. Please contact support.",
  };
  return errors[code] || "Something went wrong. Please try again.";
}

export async function registerUser(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set display name
    await updateProfile(user, { displayName: name });

    // Send verification email
    await sendEmailVerification(user);

    // Create Firestore profile
    await setDoc(doc(db, "users", user.uid), {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      isAdmin: false,
      isPremium: false,
      createdAt: serverTimestamp(),
      xp: 0,
      streak: 0,
      testsCompleted: 0,
      emailVerified: false,
    });

    return {
      user,
      message: "Account created! Please check your email to verify your account.",
    };
  } catch (error) {
    throw new Error(getFriendlyError(error.code));
  }
}

export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update emailVerified status in Firestore
    if (user.emailVerified) {
      await setDoc(
        doc(db, "users", user.uid),
        { emailVerified: true },
        { merge: true }
      );
    }

    return userCredential;
  } catch (error) {
    throw new Error(getFriendlyError(error.code));
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { message: "Password reset email sent! Check your inbox." };
  } catch (error) {
    throw new Error(getFriendlyError(error.code));
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getFriendlyError(error.code));
  }
}

export async function getUserProfile(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    throw new Error("Failed to load profile.");
  }
}

export async function resendVerificationEmail() {
  try {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      return { message: "Verification email sent!" };
    }
  } catch (error) {
    throw new Error("Could not send verification email. Try again later.");
  }
}
