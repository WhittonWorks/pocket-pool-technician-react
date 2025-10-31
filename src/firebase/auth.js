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
  OAuthProvider,
  sendEmailVerification,
} from "firebase/auth";

import app from "../firebaseConfig";

// ✅ Initialize Firebase Auth
const auth = getAuth(app);

// ✅ Google Sign-In Provider
const googleProvider = new GoogleAuthProvider();

// ✅ Apple Sign-In Provider
const appleProvider = new OAuthProvider("apple.com");

// 🔐 Login with email/password
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 🔐 Signup with email/password
export const signupWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// 🚪 Log out
export const logout = () => {
  return signOut(auth);
};

// 🔑 Login with Google (detect mobile redirect vs popup)
export const loginWithGoogle = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    return signInWithRedirect(auth, googleProvider);
  } else {
    return signInWithPopup(auth, googleProvider);
  }
};

// 🔑 Login with Apple (popup only for now)
export const loginWithApple = () => {
  return signInWithPopup(auth, appleProvider);
};

// 📩 Resend email verification to the current user
export const resendVerificationEmail = () => {
  const user = auth.currentUser;
  if (user) {
    return sendEmailVerification(user);
  } else {
    throw new Error("No authenticated user.");
  }
};

// ✅ Handle login redirect result from Google Sign-In
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result?.user) {
      console.log("✅ Google redirect login successful:", result.user);
      sessionStorage.setItem("redirectLoginSuccess", "true");
    } else {
      console.log("ℹ️ No user returned from redirect.");
    }
  } catch (error) {
    console.error("❌ Google redirect failed:", error.message);
  }
};

// 🔁 Export auth instance for checking currentUser, etc.
export { auth };