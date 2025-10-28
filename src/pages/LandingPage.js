import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] flex flex-col items-center justify-center px-6 bg-gray-100 text-center">
      {/* 🔧 Optional logo */}
      {/* <img src="/logo512.png" alt="CPT Logo" className="w-24 h-24 mb-4" /> */}

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

      {/* Optional footer */}
      {/* <p className="text-sm text-gray-500 mt-10">v1.0.0 – Whitton Works</p> */}
    </div>
  );
};

export default LandingPage;