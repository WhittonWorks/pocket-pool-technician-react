// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const buttons = [
    { label: "📚 Manuals", path: "/manuals" },
    { label: "🧠 Guided Diagnostics", path: "/diagnostics" },
    { label: "⚠️ Error Code Lookup", path: "/errors" },
    { label: "🩺 Symptom Lookup", path: "/symptoms" },
    { label: "📝 Feedback Log", path: "/feedback" },
  ];

  return (
    <div className="max-w-md mx-auto mt-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center mb-6">Compact Pool Technician</h1>
      {buttons.map((btn) => (
        <button
          key={btn.path}
          onClick={() => navigate(btn.path)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded text-lg shadow"
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default HomePage;