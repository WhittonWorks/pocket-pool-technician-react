// src/pages/DiagnosticsPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FlowRunner from "../components/containers/FlowRunner";
import createReportPDF from "../utils/pdf/createReportPDF";
import { findFlow } from "../flows";

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

export default function DiagnosticsPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState("brand");
  const [brand, setBrand] = useState(null);
  const [equipmentType, setEquipmentType] = useState(null);
  const [model, setModel] = useState(null);

  const reset = () => {
    setStep("brand");
    setBrand(null);
    setEquipmentType(null);
    setModel(null);
    sessionStorage.removeItem("jumpToNode");
  };

  const handleBackToHome = () => {
    reset();
    navigate("/home");
  };

  const equipmentTypes = brand ? Object.keys(models[brand]) : [];

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* ✅ Home button always on brand screen */}
      {step === "brand" && (
        <div className="mb-6">
          <button
            onClick={handleBackToHome}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            ⬅️ Go Home
          </button>
        </div>
      )}

      {/* 🔁 Back buttons for other steps */}
      {step === "type" && (
        <div className="mb-6">
          <button
            onClick={() => setStep("brand")}
            className="bg-[#FFD700] text-black px-4 py-2 rounded hover:bg-yellow-500"
          >
            ⬅️ Back to Brand
          </button>
        </div>
      )}
      {step === "model" && (
        <div className="mb-6">
          <button
            onClick={() => setStep("type")}
            className="bg-[#FFD700] text-black px-4 py-2 rounded hover:bg-yellow-500"
          >
            ⬅️ Back to Type
          </button>
        </div>
      )}

      {/* 🧠 Diagnostic Flow or Selection */}
      {model ? (
        (() => {
          const flow = findFlow(brand, equipmentType, model);
          const jumpNode = sessionStorage.getItem("jumpToNode");
          return flow ? (
            <FlowRunner
              key={flow.id}
              flow={flow}
              jumpTo={jumpNode || null}
              onExit={reset}
              onFinish={(answers) => createReportPDF(answers, flow)}
            />
          ) : (
            <p>
              ✅ You chose <strong>{brand}</strong> → <strong>{equipmentType}</strong> →{" "}
              <strong>{model}</strong> — but no diagnostic flow exists yet.
            </p>
          );
        })()
      ) : (
        <div className="space-y-4">
          {step === "brand" && (
            <>
              <h3 className="font-semibold text-lg">Choose a Brand:</h3>
              <div className="flex flex-col gap-4">
                {brands.map((b) => (
                  <button
                    key={b}
                    className="bg-gray-800 text-white py-3 rounded shadow"
                    onClick={() => {
                      setBrand(b);
                      setStep("type");
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "type" && (
            <>
              <h3 className="font-semibold text-lg">Select {brand} Equipment Type:</h3>
              <div className="flex flex-col gap-4">
                {equipmentTypes.map((t) => (
                  <button
                    key={t}
                    className="bg-gray-800 text-white py-3 rounded shadow"
                    onClick={() => {
                      setEquipmentType(t);
                      setStep("model");
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "model" && (
            <>
              <h3 className="font-semibold text-lg">Pick Your {brand} {equipmentType} Model:</h3>
              <div className="flex flex-col gap-4">
                {models[brand][equipmentType].map((m) => (
                  <button
                    key={m}
                    className="bg-gray-800 text-white py-3 rounded shadow"
                    onClick={() => setModel(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}