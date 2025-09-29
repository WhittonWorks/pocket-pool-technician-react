import React, { useState } from "react";
import Layout from "./Layout";
import FlowRunner from "./FlowRunner";
import ErrorLookup from "./ErrorLookup";
import flows from "./flows"; // auto-load all flows
import errorFiles from "./errors"; // auto-load all error JSONs
import symptomFiles from "./symptoms"; // auto-load all symptom JSONs

function App() {
  const [section, setSection] = useState("home"); // home | flows | errors | symptoms
  const [step, setStep] = useState("brand"); // for flows
  const [brand, setBrand] = useState(null);
  const [equipmentType, setEquipmentType] = useState(null);
  const [model, setModel] = useState(null);

  // Brands and models for flows
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

  // Find the right flow JSON
  function findFlow(brand, equipmentType, model) {
    return flows.find(
      (f) =>
        f.brand === brand &&
        f.equipmentType === equipmentType &&
        f.model === model
    );
  }

  // Home menu
  if (section === "home") {
    return (
      <Layout>
        <h1>Pocket Pool Technician 🚀</h1>
        <button style={btnStyle} onClick={() => setSection("flows")}>
          🔧 Troubleshooting Flows
        </button>
        <button style={btnStyle} onClick={() => setSection("errors")}>
          ❗ Error Code Lookup
        </button>
        <button style={btnStyle} onClick={() => setSection("symptoms")}>
          🧪 Symptom Lookup
        </button>
      </Layout>
    );
  }

  // Flows menu
  if (section === "flows") {
    return (
      <Layout sidebar={renderFlowSidebar()}>
        <h1>🔧 Troubleshooting Flows</h1>
        {model && (() => {
          const flow = findFlow(brand, equipmentType, model);
          return flow ? (
            <FlowRunner flow={flow} />
          ) : (
            <p>
              ⚠️ No diagnostic flow found for <strong>{brand}</strong> →{" "}
              <strong>{equipmentType}</strong> → <strong>{model}</strong>.
            </p>
          );
        })()}
      </Layout>
    );
  }

  // Errors menu
  if (section === "errors") {
    return (
      <Layout>
        <h1>❗ Error Code Lookup</h1>
        <ErrorLookup errors={errorFiles} />
      </Layout>
    );
  }

  // Symptoms menu
  if (section === "symptoms") {
    return (
      <Layout>
        <h1>🧪 Symptom Lookup</h1>
        <p>(Symptom lookup component goes here)</p>
      </Layout>
    );
  }

  // Helper: Flow sidebar
  function renderFlowSidebar() {
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
          <button style={backStyle} onClick={() => setSection("home")}>
            ← Back to Home
          </button>
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
            <button key={m} onClick={() => setModel(m)} style={btnStyle}>
              {m}
            </button>
          ))}
        </div>
      );
    }
  }
}

const btnStyle = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "12px 16px",
  marginBottom: 10,
  borderRadius: 6,
  border: "none",
  background: "#333",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
};

const backStyle = {
  ...btnStyle,
  background: "#555",
  marginTop: 12,
};

export default App;