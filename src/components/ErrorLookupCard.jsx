import React from "react";

export default function ErrorLookupCard({ error, onStartDiagnosis }) {
  const handleStart = () => {
    if (!error.flowTarget) {
      alert("No diagnostic flow linked for this error yet.");
      return;
    }
    console.log("🧭 Starting diagnosis from error:", error.flowTarget);
    onStartDiagnosis(error.flowTarget);
  };

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50 shadow-sm hover:bg-gray-100 transition">
      <h3 className="font-bold text-lg text-gray-900">
        {error.code} — {error.title}
      </h3>

      {error.meaning && (
        <p className="text-gray-800 mt-2">
          <strong>Meaning:</strong> {error.meaning}
        </p>
      )}

      {error.description && (
        <p className="text-gray-800 mt-2">
          <strong>Description:</strong> {error.description}
        </p>
      )}

      {error.fix && (
        <p className="text-gray-800 mt-2">
          <strong>Fix:</strong> {error.fix}
        </p>
      )}

      <p className="text-sm text-gray-500 mt-2">
        <em>Source: {error.source}</em>
      </p>

      <button
        onClick={handleStart}
        className="w-full mt-3 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
      >
        Start Diagnosis From Here
      </button>
    </div>
  );
}
