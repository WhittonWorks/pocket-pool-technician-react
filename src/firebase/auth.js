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
export { auth };// src/pages/Auth/SignupPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupWithEmail } from "../../firebase/auth";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase/auth";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    business: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userCred = await signupWithEmail(form.email, form.password);

      // ✅ Send email verification
      await sendEmailVerification(userCred.user);

      setSuccess("Account created. Check your email to verify your account.");
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Navigate after short delay
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">🆕 Create Account</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required className="p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="p-2 border rounded" />
        <input name="business" placeholder="Business Name (optional)" value={form.business} onChange={handleChange} className="p-2 border rounded" />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
        <button type="button" onClick={() => navigate("/login")} className="text-sm underline text-gray-500">
          Already have an account? Log in →
        </button>
      </form>
    </div>
  );
};

export default SignupPage;