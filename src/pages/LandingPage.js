// src/pages/LandingPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const LandingPage = () => {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/home"); // ✅ Route to HomePage if logged in
      } else {
        setCheckingAuth(false); // ✅ Show buttons only if no user
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checkingAuth) {
    return (
      <div className="h-[100dvh] flex items-center justify-center">
        <p className="text-lg font-medium">Checking login status...</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center px-6 bg-gray-100 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Compact Pool Technician</h1>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          Log In
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-gray-800 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow hover:bg-gray-900 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LandingPage;