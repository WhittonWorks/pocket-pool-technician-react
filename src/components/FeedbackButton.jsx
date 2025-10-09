import React, { useState, useEffect } from "react";

/**
 * 🧠 Global floating feedback button + modal
 * Whitton Works branded
 */
function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("Symptom");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [message, setMessage] = useState("");
  const [savedCount, setSavedCount] = useState(0);

  // 🧾 Load existing feedback count from localStorage
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("ppt_feedback") || "[]");
    setSavedCount(existing.length);
  }, []);

  // 💾 Save feedback locally
  const handleSubmit = () => {
    if (!message.trim()) {
      alert("Please enter a short description.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      category,
      brand,
      model,
      message,
    };

    const existing = JSON.parse(localStorage.getItem("ppt_feedback") || "[]");
    existing.push(newEntry);
    localStorage.setItem("ppt_feedback", JSON.stringify(existing));

    setSavedCount(existing.length);
    setIsOpen(false);
    setMessage("");
    setBrand("");
    setModel("");

    alert("✅ Feedback saved locally. It will sync in a later update.");
  };

  return (
    <>
      {/* 🧠 Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 rounded-full shadow-lg text-white font-bold z-50 flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: "#FFD300", // Whitton Yellow
          color: "#333",
          width: "65px",
          height: "65px",
          fontSize: "28px",
          border: "2px solid #0b73ff", // Whitton Blue outline
        }}
        title="Send Feedback"
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0b73ff")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFD300")}
      >
        🧠
      </button>

      {/* 📋 Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-md relative border border-gray-300">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>

            <h2 className="text-xl font-bold mb-3 text-gray-800">
              🧠 Submit Feedback
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            >
              <option>Symptom</option>
              <option>Error</option>
              <option>Diagnostic Flow</option>
              <option>Other</option>
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Brand (optional)
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Jandy"
              className="w-full border rounded p-2 mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model (optional)
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. JXi"
              className="w-full border rounded p-2 mb-3"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Problem Description
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what went wrong or could be improved..."
              className="w-full border rounded p-2 mb-4 h-24"
            />

            <button
              onClick={handleSubmit}
              className="w-full py-2 rounded font-semibold text-white transition-all duration-300"
              style={{
                backgroundColor: "#0b73ff", // Whitton Blue
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#095fce")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#0b73ff")
              }
            >
              Submit Feedback
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              {savedCount} feedback item(s) stored locally
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default FeedbackButton;