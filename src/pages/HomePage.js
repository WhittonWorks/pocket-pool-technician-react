// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const buttons = [
    { label: "📚 Manuals", path: "/manuals", color: "gray" },
    { label: "🧠 Guided Diagnostics", path: "/diagnostics", color: "gray" },
    { label: "⚠️ Error Code Lookup", path: "/errors", color: "gray" },
    { label: "🩺 Symptom Lookup", path: "/symptoms", color: "gray" },
    { label: "📝 Feedback Log", path: "/feedback", color: "yellow" },
  ];

  return (
    <div className="max-w-md mx-auto mt-8 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Compact Pool Technician
      </h1>

      {buttons.map((btn) => {
        const baseClasses =
          "w-full font-semibold py-3 px-6 rounded-lg shadow transition";

        const colorClass =
          btn.color === "yellow"
            ? "bg-yellow-400 text-black hover:bg-yellow-500"
            : "bg-[#2e2e2e] text-white hover:bg-[#1f1f1f]";

        return (
          <button
            key={btn.path}
            onClick={() => navigate(btn.path)}
            className={`${baseClasses} ${colorClass}`}
          >
            {btn.label}
          </button>
        );
      })}
    </div>
  );
};

export default HomePage;