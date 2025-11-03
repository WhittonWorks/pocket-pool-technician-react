// src/pages/ModelEntryPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jandy as modelJandy } from "../tools/model";
import { findFlow } from "../flows";

export default function ModelEntryPage() {
  const navigate = useNavigate();
  const [modelInput, setModelInput] = useState("");
  const [error, setError] = useState("");

  // Context tells us what launched this page: diagnostic | error | symptom
  const context = sessionStorage.getItem("launchContext");

  const handleSubmit = () => {
    const val = modelInput.trim().toUpperCase();
    if (!val) return setError("Please enter a model number.");

    const info = modelJandy.decodeJandyJxiModel(val);

    if (!info.valid) {
      setError("Unrecognized model number. Please double-check it.");
      return;
    }

    console.log("✅ Model decoded:", info);

    // Store decoded metadata for global access
    sessionStorage.setItem("decodedBrand", info.brand || "Jandy");
    sessionStorage.setItem("decodedType", info.equipmentType || "Heaters");
    sessionStorage.setItem("decodedModel", info.model || val);

    // Preload flow data
    const flow = findFlow(info.brand || "Jandy", info.equipmentType || "Heaters", info.model);
    if (!flow) {
      setError("No diagnostic flow found for this model.");
      return;
    }

    // Choose navigation path based on context
    switch (context) {
      case "error":
        navigate("/errors");
        break;
      case "symptom":
        navigate("/symptoms");
        break;
      default:
        navigate("/diagnostics");
        break;
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Enter Your Model Number</h1>
      <p className="text-gray-700 mb-4">
        Type in your equipment’s model number (e.g.{" "}
        <code className="bg-gray-200 px-1 rounded">JXI400NK</code>) to begin diagnostics.
      </p>

      <input
        type="text"
        value={modelInput}
        onChange={(e) => setModelInput(e.target.value)}
        placeholder="Model Number"
        className="border p-2 w-full rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded font-semibold"
      >
        Continue
      </button>

      <button
        onClick={() => navigate("/home")}
        className="mt-4 text-sm underline text-gray-600"
      >
        ← Back to Home
      </button>
    </div>
  );
}