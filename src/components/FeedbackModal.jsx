import React, { useState } from "react";
import { shareFeedback } from "../utils/shareFeedback";

function FeedbackModal({
  visible,
  onClose,
  onSubmit,
  brand,
  equipmentType,
  model,
  outcome,
}) {
  const [rating, setRating] = useState(null);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [showThankYou, setShowThankYou] = useState(false); // ✅ new state

  if (!visible) return null;

  const handleSubmit = () => {
    if (!rating) {
      alert("Please select a rating before submitting.");
      return;
    }

    const feedbackEntry = {
      id: Date.now(),
      brand,
      equipmentType,
      model,
      outcome,
      rating,
      notes,
      name: name.trim() || "Anonymous",
      contact: contact.trim() || "N/A",
      date: new Date().toLocaleString(),
    };

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem("ppt_feedback") || "[]");
    localStorage.setItem(
      "ppt_feedback",
      JSON.stringify([...existing, feedbackEntry])
    );

    // Show confirmation + prompt to share
    alert(
      "✅ Feedback received — thank you for helping us improve the Compact Pool Technician!"
    );

    const stored = JSON.parse(localStorage.getItem("ppt_feedback") || "[]");
    if (
      window.confirm(
        "Would you like to send this feedback to Whitton Works now?"
      )
    ) {
      shareFeedback(stored);
      // ✅ Show “thank you” screen after email opens
      setShowThankYou(true);
      setTimeout(() => {
        setShowThankYou(false);
        onSubmit?.(feedbackEntry);
        onClose?.();
      }, 4000); // Auto-close after 4 seconds
    } else {
      onSubmit?.(feedbackEntry);
      onClose?.();
    }
  };

  if (showThankYou) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded shadow-lg p-6 max-w-md w-11/12 text-center text-gray-800">
          <h2 className="text-2xl font-bold mb-2 text-green-600">
            ✅ Feedback Sent!
          </h2>
          <p className="text-gray-700 mb-2">
            Thank you for helping us improve the Compact Pool Technician.
          </p>
          <p className="text-sm text-gray-500">
            You can close this window — it will close automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg p-6 max-w-md w-11/12 text-gray-800">
        <h2 className="text-xl font-bold mb-3">🧠 Diagnostic Feedback</h2>
        <p className="text-sm text-gray-600 mb-4">
          How accurate or helpful was this diagnostic flow?
        </p>

        {/* Rating Options */}
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

        {/* Notes */}
        <textarea
          className="border rounded p-2 w-full mb-3 text-gray-800"
          rows="3"
          placeholder="Add details or suggestions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Optional Contact Fields */}
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            className="border rounded p-2 w-full text-gray-800"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">
            Phone or Email (optional)
          </label>
          <input
            type="text"
            className="border rounded p-2 w-full text-gray-800"
            placeholder="Enter phone or email for follow-up"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        {/* Context Info */}
        <div className="bg-gray-50 border rounded p-2 text-sm text-gray-600 mb-4">
          <p>
            <strong>Brand:</strong> {brand || "N/A"}
          </p>
          <p>
            <strong>Model:</strong> {model || "N/A"}
          </p>
          <p>
            <strong>Outcome:</strong> {outcome || "N/A"}
          </p>
          <p>
            <strong>Date:</strong> {new Date().toLocaleString()}
          </p>
        </div>

        {/* Buttons */}
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