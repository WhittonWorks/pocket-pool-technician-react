// src/pages/ErrorPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorLookup from "../ErrorLookup";

function ErrorPage({ setBrand, setEquipmentType, setModel }) {
  const navigate = useNavigate();

  // ✅ Load decoded values (set during ModelEntryPage)
  const [decodedBrand, setDecodedBrand] = useState("All");
  const [decodedType, setDecodedType] = useState("All");
  const [decodedModel, setDecodedModel] = useState("All");

  useEffect(() => {
    const storedBrand = sessionStorage.getItem("decodedBrand");
    const storedType = sessionStorage.getItem("decodedType");
    const storedModel = sessionStorage.getItem("decodedModel");

    if (storedBrand) setDecodedBrand(storedBrand);
    if (storedType) setDecodedType(storedType);
    if (storedModel) setDecodedModel(storedModel);
  }, []);

  function handleSelectError(flowTarget) {
    if (!flowTarget) return;
    const { brand, equipmentType, model, startNode } = flowTarget;

    // ✅ Set flow context for diagnostics
    setBrand(brand);
    setEquipmentType(equipmentType);
    setModel(model);

    // 🔁 If a jump node exists, store it
    if (startNode) {
      sessionStorage.setItem("jumpToNode", startNode);
    }

    // ✅ Go to diagnostics
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

      {/* ✅ Pass decoded values into ErrorLookup */}
      <ErrorLookup
        onSelectError={handleSelectError}
        initialBrand={decodedBrand}
        initialType={decodedType}
        initialModel={decodedModel}
      />
    </div>
  );
}

export default ErrorPage;