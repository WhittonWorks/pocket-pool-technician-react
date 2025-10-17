import React from "react";

export default function SymptomLookupCard({ symptom, onSelectSymptom }) {
  const handleStartDiagnosis = () => {
    if (symptom.flowTarget) {
      console.log("🧭 Starting diagnosis from:", symptom.flowTarget);
      onSelectSymptom(symptom.flowTarget);
    } else {
      alert("No linked diagnostic flow for this symptom yet.");
    }
  };

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50 shadow-sm hover:bg-gray-100 transition">
      {/* 🔹 Title */}
      <h3 className="font-bold text-lg text-gray-900">{symptom.symptom}</h3>

      {/* 🔹 Source */}
      {symptom.source && (
        <p className="text-sm text-gray-500 mb-2">
          <em>Source: {symptom.source}</em>
        </p>
      )}

      {/* 🔹 Possible Causes */}
      {symptom.causes && symptom.causes.length > 0 && (
        <div className="mb-2">
          <strong className="text-gray-800">Possible Causes:</strong>
          <ul className="list-disc ml-5 text-gray-700">
            {symptom.causes.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 Recommended Actions */}
      {symptom.actions && symptom.actions.length > 0 && (
        <div className="mb-3">
          <strong className="text-gray-800">Recommended Actions:</strong>
          <ul className="list-disc ml-5 text-gray-700">
            {symptom.actions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🧠 Metadata (optional, future-proofed) */}
      {symptom.metadata && Object.keys(symptom.metadata).length > 0 && (
        <div className="text-sm text-gray-700 mb-3">
          {symptom.metadata.severity && (
            <p>
              <strong>Severity:</strong> {symptom.metadata.severity}
            </p>
          )}
          {symptom.metadata.frequency && (
            <p>
              <strong>Frequency:</strong> {symptom.metadata.frequency}
            </p>
          )}
          {symptom.metadata.lastUpdated && (
            <p>
              <strong>Last Updated:</strong> {symptom.metadata.lastUpdated}
            </p>
          )}
        </div>
      )}

      {/* 🔹 Brand / Model Summary */}
      <p className="text-sm text-gray-500 mb-2">
        <em>
          {symptom.brand || "Unknown"}{" "}
          {symptom.model ? `— ${symptom.model}` : ""}
        </em>
      </p>

      {/* 🚀 Action Button */}
      {symptom.flowTarget ? (
        <button
          onClick={handleStartDiagnosis}
          className="w-full mt-3 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          ▶️ Start Diagnosis From Here
        </button>
      ) : (
        <p className="text-gray-500 mt-3 italic">
          No linked diagnostic flow for this symptom yet.
        </p>
      )}
    </div>
  );
}
