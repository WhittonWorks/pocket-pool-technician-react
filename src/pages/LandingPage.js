// src/pages/LandingPage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/auth";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      navigate("/diagnostics"); // 🔁 Redirect authenticated users
    }
  }, []);

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