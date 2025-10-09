import React, { useState } from "react";

function FeedbackModal({ visible, onClose, onSubmit, brand, equipmentType, model, outcome }) {
  const [rating, setRating] = useState(null);
  const [notes, setNotes] = useState("");

  if (!visible) return null;

  const handleSubmit = () => {
    if (!rating) return alert("Please select a rating before submitting.");

    const feedbackEntry = {
      id: Date.now(),
      brand,
      equipmentType,
      model,
      outcome,
      rating,
      notes,
      date: new Date().toLocaleString(),
    };

    const existing = JSON.parse(localStorage.getItem("ppt_feedback") || "[]");
    localStorage.setItem("ppt_feedback", JSON.stringify([...existing, feedbackEntry]));

    onSubmit?.(feedbackEntry);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-md w-11/12">
        <h2 className="text-xl font-bold mb-3 text-gray-800">
          🧠 Diagnostic Feedback
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          How accurate or helpful was this diagnostic flow?
        </p>

        <div className="flex justify-between mb-4">
          {["Accurate", "Needs Work", "Wrong Flow"].map((label) => (
            <button
              key={label}
              onClick={() => setRating(label)}
              className={`flex-1 mx-1 p-2 rounded font-semibold ${
                rating === label
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <textarea
          className="border rounded p-2 w-full mb-3 text-gray-800"
          rows="3"
          placeholder="Add details or suggestions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            ✅ Submit Feedback
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded"
          >
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackModal;