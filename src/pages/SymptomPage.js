import React from "react";
import { useNavigate } from "react-router-dom";
import SymptomLookup from "../SymptomLookup";
import { findFlow } from "../flows";

function SymptomPage({ setBrand, setEquipmentType, setModel }) {
  const navigate = useNavigate();

  function handleSelectSymptom(flowTarget) {
    if (!flowTarget) return;
    const { brand, equipmentType, model } = flowTarget;

    // ✅ Set values so Diagnostics page can render the correct flow
    setBrand(brand);
    setEquipmentType(equipmentType);
    setModel(model);

    // 🔁 Jump to node if available
    if (flowTarget.startNode) {
      sessionStorage.setItem("jumpToNode", flowTarget.startNode);
    }

    // ✅ Navigate to diagnostics
    navigate("/diagnostics");
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/home")}
        className="mb-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        ⬅️ Back to Home
      </button>

      <SymptomLookup onSelectSymptom={handleSelectSymptom} />
    </div>
  );
}

export default SymptomPage;