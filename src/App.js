import React, { useState } from "react";
import Layout from "./Layout";
import FlowRunner from "./FlowRunner";
import jandyJxiFlow from "./flows/jandy-jxi.json";
import aquapureFlow from "./flows/jandy-aquapure.json";
import ErrorLookup from "./ErrorLookup";

function App() {
  const [step, setStep] = useState("brand"); // brand → type → model
  const [brand, setBrand] = useState(null);
  const [equipmentType, setEquipmentType] = useState(null);
  const [model, setModel] = useState(null);

  const brands = ["Jandy", "Hayward", "Pentair"];

  const models = {
    Jandy: {
      Heaters: ["JXi", "JXiQ", "HI-E2", "VersaTemp"],
      Pumps: ["VS FloPro", "ePump"],
      Filters: ["CL Cartridge", "CV Cartridge"],
      WaterCare: ["AquaPure", "TruDose"],
      Lighting: ["WaterColors LED"],
      Automation: ["AquaLink RS"],
    },
    Hayward: {
      Heaters: ["Universal H-Series", "HeatPro"],
      Pumps: ["TriStar VS", "Super Pump XE"],
      Filters: ["SwimClear Cartridge"],
      WaterCare: ["AquaRite 900"],
      Lighting: ["ColorLogic LED"],
      Automation: ["OmniLogic"],
    },
    Pentair: {
      Heaters: ["MasterTemp", "UltraTemp"],
      Pumps: ["IntelliFlo VSF", "SuperFlo VS"],
      Filters: ["Clean & Clear Plus"],
      WaterCare: ["Intellichlor"],
      Lighting: ["IntelliBrite LED"],
      Automation: ["EasyTouch", "IntelliCenter"],
    },
  };

  const equipmentTypes = brand ? Object.keys(models[brand]) : [];

  function renderSidebar() {
    if (step === "brand") {
      return (
        <div>
          <h3>Choose Brand</h3>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => {
                setBrand(b);
                setStep("type");
              }}
              style={btnStyle}
            >
              {b}
            </button>
          ))}
        </div>
      );
    }

    if (step === "type") {
      return (
        <div>
          <button onClick={() => setStep("brand")} style={backStyle}>
            ← Back
          </button>
          <h3>{brand} Equipment</h3>
          {equipmentTypes.map((t) => (
            <button
              key={t}
              onClick={() => {
                setEquipmentType(t);
                setStep("model");
              }}
              style={btnStyle}
            >
              {t}
            </button>
          ))}
        </div>
      );
    }

    if (step === "model") {
      return (
        <div>
          <button onClick={() => setStep("type")} style={backStyle}>
            ← Back
          </button>
          <h3>
            {brand} {equipmentType}
          </h3>
          {models[brand][equipmentType].map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              style={btnStyle}
            >
              {m}
            </button>
          ))}
        </div>
      );
    }
  }

  return (
    <Layout sidebar={renderSidebar()}>
      <h1>Pocket Pool Technician 🚀</h1>

      {model && (
        <>
          {brand === "Jandy" && equipmentType === "Heaters" && model === "JXi" ? (
            <FlowRunner flow={jandyJxiFlow} />
          ) : brand === "Jandy" && equipmentType === "WaterCare" && model === "AquaPure" ? (
            <div>
              <h2 className="text-xl font-bold">Jandy AquaPure</h2>
              <p>Choose an option:</p>
              <button
                onClick={() => setStep("flow")}
                className="px-4 py-2 bg-green-600 text-white rounded m-2"
              >
                Full Diagnostic Flow
              </button>
              <button
                onClick={() => setStep("errors")}
                className="px-4 py-2 bg-indigo-600 text-white rounded m-2"
              >
                Error Code Lookup
              </button>

              {step === "flow" && <FlowRunner flow={aquapureFlow} />}
              {step === "errors" && <ErrorLookup />}
            </div>
          ) : (
            <p>
              ✅ You chose <strong>{brand}</strong> → <strong>{equipmentType}</strong> →{" "}
              <strong>{model}</strong>
            </p>
          )}
        </>
      )}
    </Layout>
  );
}

const btnStyle = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "8px 10px",
  marginBottom: 8,
  borderRadius: 6,
  border: "none",
  background: "#333",
  color: "#fff",
  cursor: "pointer",
};

const backStyle = {
  ...btnStyle,
  background: "#555",
  marginBottom: 12,
};

export default App;