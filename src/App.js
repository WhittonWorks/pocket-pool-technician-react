import React, { useState } from "react";
import Layout from "./Layout";
import FlowRunner from "./FlowRunner";
import ErrorLookup from "./ErrorLookup";
import SymptomLookup from "./SymptomLookup";
import flows from "./flows";
import errors from "./errors";
import symptoms from "./symptoms";

function App() {
  const [mode, setMode] = useState(null); // "diagnostics" | "errors" | "symptoms"
  const [step, setStep] = useState("brand");
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

  function findFlow(brand, equipmentType, model) {
    return flows.find(
      (f) =>
        f.brand === brand &&
        f.equipmentType === equipmentType &&
        f.model === model
    );
  }

  function renderSidebar() {
    if (!mode) {
      return (
        <div>
          <h3>Choose Mode</h3>
          <button style={btnStyle} onClick={() => setMode("diagnostics")}>
            🔍 Guided Diagnostics
          </button>
          <button style={btnStyle} onClick={() => setMode("errors")}>
            ⚡ Error Code Lookup
          </button>
          <button style={btnStyle} onClick={() => setMode("symptoms")}>
            🩺 Symptom Lookup
          </button>
        </div>
      );
    }

    if (mode === "diagnostics") {
      if (step === "brand") {
        return (
          <div>
            <button onClick={() => setMode(null)} style={backStyle}>
              ← Back
            </button>
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

    if (mode === "errors") {
      return (
        <div>
          <button onClick={() => setMode(null)} style={backStyle}>
            ← Back
          </button>
          <ErrorLookup errors={errors} />
        </div>
      );
    }

    if (mode === "symptoms") {
      return (
        <div>
          <button onClick={() => setMode(null)} style={backStyle}>
            ← Back
          </button>
          <SymptomLookup symptoms={symptoms} />
        </div>
      );
    }
  }

  return (
    <Layout sidebar={renderSidebar()}>
      <h1>Pocket Pool Technician 🚀</h1>

      {mode === "diagnostics" && model && (
        <>
          {(() => {
            const flow = findFlow(brand, equipmentType, model);
            if (flow) {
              return <FlowRunner flow={flow} />;
            }
            return (
              <p>
                ✅ You chose <strong>{brand}</strong> →{" "}
                <strong>{equipmentType}</strong> → <strong>{model}</strong> — but
                no diagnostic flow exists yet.
              </p>
            );
          })()}
        </>
      )}

      {mode === "errors" && <p>Search error codes using the sidebar.</p>}
      {mode === "symptoms" && <p>Search symptoms using the sidebar.</p>}
    </Layout>
  );
}

const btnStyle = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "10px 12px",
  marginBottom: 8,
  borderRadius: 6,
  border: "none",
  background: "#333",
  color: "#fff",
  cursor: "pointer",
  fontSize: "16px",
};

const backStyle = {
  ...btnStyle,
  background: "#555",
  marginBottom: 12,
};

export default App;