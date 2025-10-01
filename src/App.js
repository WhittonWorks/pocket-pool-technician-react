import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import FlowRunner from "./FlowRunner";
import ErrorLookup from "./ErrorLookup";
import SymptomLookup from "./SymptomLookup";
import errors from "./errors";
import symptoms from "./symptoms";
import { findFlow } from "./flows";

function App() {
  const [mode, setMode] = useState(null); // "diagnostics" | "errors" | "symptoms"
  const [step, setStep] = useState("brand");
  const [brand, setBrand] = useState(null);
  const [equipmentType, setEquipmentType] = useState(null);
  const [model, setModel] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 🔹 Watch screen size to detect mobile vs desktop
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      Heaters: ["Universal H-Series", "HeatPro"],
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
    }
  };

  const equipmentTypes = brand ? Object.keys(models[brand]) : [];

  function renderSidebar() {
    if (!mode) {
      return (
        <div>
          <h3 className="font-bold mb-2">Choose Mode</h3>
          <button style={btnStyle} onClick={() => { setMode("diagnostics"); setSidebarCollapsed(false); }}>
            🔍 Guided Diagnostics
          </button>
          <button style={btnStyle} onClick={() => { setMode("errors"); setSidebarCollapsed(false); }}>
            ⚡ Error Code Lookup
          </button>
          <button style={btnStyle} onClick={() => { setMode("symptoms"); setSidebarCollapsed(false); }}>
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
            <h3 className="font-bold mb-2">Choose Brand</h3>
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
            <h3 className="font-bold mb-2">{brand} Equipment</h3>
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
            <h3 className="font-bold mb-2">
              {brand} {equipmentType}
            </h3>
            {models[brand][equipmentType].map((m) => (
              <button
                key={m}
                onClick={() => {
                  setModel(m);
                  // 🔹 Auto-collapse on mobile
                  if (isMobile) {
                    setSidebarCollapsed(true);
                  }
                }}
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
    <Layout sidebar={sidebarCollapsed ? null : renderSidebar()}>
      <h1 className="text-2xl font-bold mb-4">Pocket Pool Technician 🚀</h1>

      {mode === "diagnostics" && model && (
        <>
          {(() => {
            const flow = findFlow(brand, equipmentType, model);
            if (flow) {
              return <FlowRunner key={flow.id} flow={flow} />;
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

      {mode === "errors" && (
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          ⚡ Error Code Lookup Mode
        </h2>
      )}

      {mode === "symptoms" && (
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          🩺 Symptom Lookup Mode
        </h2>
      )}
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