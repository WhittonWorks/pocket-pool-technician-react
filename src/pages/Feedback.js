import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Feedback() {
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const flowTitle = state?.flowTitle || "Diagnostic Flow";

  const handleSubmit = () => {
    console.log("Feedback submitted:", { flowTitle, text });
    alert("✅ Feedback received — thank you for helping improve the Compact Pool Technician!");
    navigate("/", { replace: true });
  };

  return (
    <main className="flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">Feedback for {flowTitle}</h1>

      <textarea
        className="border p-2 w-full max-w-md h-40 mb-4"
        placeholder="Tell us what worked, what didn’t..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Feedback
      </button>
    </main>
  );
}