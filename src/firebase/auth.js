// src/firebase/auth.js
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  OAuthProvider
} from "firebase/auth";

import app from "../firebaseConfig"; // ✅ FIXED: import default app instance

// Initialize Auth
const auth = getAuth(app);

// Google Sign-In
const googleProvider = new GoogleAuthProvider();

// Apple Sign-In
const appleProvider = new OAuthProvider("apple.com");

// --- Auth Helpers ---

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signupWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

// ✅ Google Login (detect mobile and redirect if needed)
export const loginWithGoogle = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    return signInWithRedirect(auth, googleProvider);
  } else {
    return signInWithPopup(auth, googleProvider);
  }
};

// ✅ Apple Login (redirect not needed yet since you’re not using it)
export const loginWithApple = () => {
  return signInWithPopup(auth, appleProvider);
};

// ✅ Handle Google login redirect (call this once on app load)
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log("✅ Redirect login success:", result.user);
    }
  } catch (error) {
    console.error("❌ Redirect login failed:", error);
  }
};

// Export the auth instance for access to currentUser, etc.
export { auth };