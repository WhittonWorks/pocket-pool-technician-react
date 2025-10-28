// src/pages/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const buttons = [
    { label: "📚 Manuals", path: "/manuals", color: "gray" },
    { label: "🧠 Guided Diagnostics", path: "/diagnostics", color: "gray" },
    { label: "⚠️ Error Code Lookup", path: "/errors", color: "gray" },
    { label: "🤒 Symptom Lookup", path: "/symptoms", color: "gray" },
    { label: "🧾 Generate Test PDF", path: "/generate-pdf", color: "blue" },
    { label: "✉️ Feedback Log", path: "/feedback", color: "yellow" },
  ];

  return (
    <div className="max-w-md mx-auto mt-6 px-4 flex flex-col gap-3 sm:gap-4 sm:px-6">
      {buttons.map((btn) => {
        const baseClasses =
          "w-full font-medium text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6 rounded-lg shadow transition";

        let colorClass = "";

        switch (btn.color) {
          case "yellow":
            colorClass = "bg-[#FFD700] text-black hover:bg-yellow-500";
            break;
          case "blue":
            colorClass = "bg-[#0B73FF] text-white hover:bg-blue-700";
            break;
          default:
            colorClass = "bg-[#2e2e2e] text-white hover:bg-[#1f1f1f]";
        }

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