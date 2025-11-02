// src/pages/DiagnosticsPage.js
import React, { useState } from "react";
import FlowRunner from "../components/containers/FlowRunner";
import { findFlow } from "../flows";
import createReportPDF from "../utils/pdf/createReportPDF";

const brands = ["Jandy", "Hayward", "Pentair"];
const models = {
  Jandy: {
    Heaters: ["JXi", "JXiQ", "HI-E2", "VersaTemp"],
    Pumps: ["VS FloPro", "ePump"],
    Filters: ["CL Cartridge", "CV Cartridge"],
    WaterCare: ["AquaPure", "TruDose"],
    Lighting: ["WaterColors LED"],
    Automation: ["AquaLink RS", "iQ20/iQ30"],
  },
  Hayward: {
    Heaters: ["Universal H-Series", "Universal H-Series Digital (HFDN)", "HeatPro"],
    Pumps: ["TriStar VS", "Super Pump XE"],
    Filters: ["SwimClear Cartridge", "ProGrid DE"],
    WaterCare: ["AquaRite 900", "AquaRite"],
    Lighting: ["ColorLogic LED"],
    Automation: ["OmniLogic", "OmniHub"],
  },
  Pentair: {
    Heaters: ["MasterTemp", "UltraTemp"],
    Pumps: ["IntelliFlo VSF", "SuperFlo VS"],
    Filters: ["Clean & Clear Plus", "Quad DE"],
    WaterCare: ["Intellichlor", "iChlor"],
    Lighting: ["IntelliBrite LED"],
    Automation: ["EasyTouch", "IntelliCenter"],
  },
};

const DiagnosticsPage = () => {
  const [step, setStep] = useState("brand");
  const [brand, setBrand] = useState(null);
  const [equipmentType, setEquipmentType] = useState(null);
  const [model, setModel] = useState(null);

  const equipmentTypes = brand ? Object.keys(models[brand]) : [];

  const resetAll = () => {
    setStep("brand");
    setBrand(null);
    setEquipmentType(null);
    setModel(null);
    sessionStorage.removeItem("jumpToNode");
  };

  const jumpNode = sessionStorage.getItem("jumpToNode");
  const flow = model ? findFlow(brand, equipmentType, model) : null;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* 🔁 Flow active */}
      {flow && (
        <FlowRunner
          key={flow.id}
          flow={flow}
          jumpTo={jumpNode || null}
          onExit={resetAll}
          onFinish={(answers) => createReportPDF(answers, flow)}
        />
      )}

      {/* 🎛️ Selection UI */}
      {!flow && (
        <>
          {step !== "brand" && (
            <button
              onClick={resetAll}
              className="mb-4 px-4 py-2 bg-red-600 text-white rounded"
            >
              ⬅️ Back to Home
            </button>
          )}

          {step === "brand" && (
            <>
              <h2 className="text-lg font-bold mb-2">Choose Brand</h2>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setBrand(b);
                    setStep("type");
                  }}
                  className="block w-full mb-2 p-2 bg-gray-800 text-white rounded"
                >
                  {b}
                </button>
              ))}
            </>
          )}

          {step === "type" && (
            <>
              <button onClick={() => setStep("brand")} className="mb-2 text-sm underline">
                ← Back
              </button>
              <h2 className="text-lg font-bold mb-2">{brand} Equipment Types</h2>
              {equipmentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setEquipmentType(type);
                    setStep("model");
                  }}
                  className="block w-full mb-2 p-2 bg-gray-700 text-white rounded"
                >
                  {type}
                </button>
              ))}
            </>
          )}

          {step === "model" && (
            <>
              <button onClick={() => setStep("type")} className="mb-2 text-sm underline">
                ← Back
              </button>
              <h2 className="text-lg font-bold mb-2">
                {brand} {equipmentType} Models
              </h2>
              {models[brand][equipmentType].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setModel(m);
                  }}
                  className="block w-full mb-2 p-2 bg-gray-600 text-white rounded"
                >
                  {m}
                </button>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DiagnosticsPage;