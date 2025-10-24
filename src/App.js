import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import FlowRunner from "./components/containers/FlowRunner";
import FeedbackLog from "./components/containers/FeedbackLog";
import ErrorLookup from "./ErrorLookup";
import SymptomLookup from "./SymptomLookup";
import ManualsPage from "./pages/ManualsPage";
import errors from "./errors";
import symptoms from "./symptoms";
import { findFlow } from "./flows";
import createReportPDF from "./utils/pdf/createReportPDF";
import HomeMenu from "./components/HomeMenu"; // ✅ NEW IMPORT

function App() {
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState("brand");
  const [brand, setBrand] = useState(null);
  const [equipmentType, setEquipmentType] = useState(null);
  const [model, setModel] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
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

  const equipmentTypes = brand ? Object.keys(models[brand]) : [];

  function resetToHome() {
    setMode(null);
    setStep("brand");
    setBrand(null);
    setEquipmentType(null);
    setModel(null);
    setSidebarCollapsed(false);
    sessionStorage.removeItem("jumpToNode");
  }

  function launchFlowFromSymptom(flowTarget) {
    if (!flowTarget) return alert("⚠️ Invalid data.");

    const { brand, equipmentType, model, startNode } = flowTarget;
    const flow = findFlow(brand, equipmentType, model);
    if (!flow) return alert("⚠️ Diagnostic flow not found.");

    sessionStorage.setItem("jumpToNode", startNode || "");

    setBrand(brand);
    setEquipmentType(equipmentType);
    setModel(model);
    setMode("diagnostics");
  }

  function renderSidebar() {
    if (!mode) {
      return null; // Sidebar buttons moved to HomeMenu
    }

    if (mode === "diagnostics") {
      if (step === "brand") {
        return (
          <div>
            <button onClick={() => setMode(null)} style={backStyle}>← Back</button>
            <h3 className="font-bold mb-2">Choose Brand</h3>
            {brands.map((b) => (
              <button key={b} onClick={() => {
                setBrand(b);
                setStep("type");
              }} style={btnStyle}>
                {b}
              </button>
            ))}
          </div>
        );
      }

      if (step === "type") {
        return (
          <div>
            <button onClick={() => setStep("brand")} style={backStyle}>← Back</button>
            <h3 className="font-bold mb-2">{brand} Equipment</h3>
            {equipmentTypes.map((t) => (
              <button key={t} onClick={() => {
                setEquipmentType(t);
                setStep("model");
              }} style={btnStyle}>
                {t}
              </button>
            ))}
          </div>
        );
      }

      if (step === "model") {
        return (
          <div>
            <button onClick={() => setStep("type")} style={backStyle}>← Back</button>
            <h3 className="font-bold mb-2">{brand} {equipmentType}</h3>
            {models[brand][equipmentType].map((m) => (
              <button key={m} onClick={() => {
                setModel(m);
                if (isMobile) setSidebarCollapsed(true);
              }} style={btnStyle}>
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
          <button onClick={() => setMode(null)} style={backStyle}>← Back</button>
          <ErrorLookup errors={errors} onSelectError={launchFlowFromSymptom} />
        </div>
      );
    }

    if (mode === "symptoms") {
      return (
        <div>
          <button onClick={() => setMode(null)} style={backStyle}>← Back</button>
          <SymptomLookup symptoms={symptoms} onSelectSymptom={launchFlowFromSymptom} />
        </div>
      );
    }

    if (mode === "feedback") {
      return (
        <div>
          <button onClick={() => setMode(null)} style={backStyle}>← Back</button>
          <FeedbackLog />
        </div>
      );
    }

    if (mode === "manuals") {
      return (
        <div>
          <button onClick={() => setMode(null)} style={backStyle}>← Back</button>
          <ManualsPage />
        </div>
      );
    }
  }

  return (
    <Routes>
      <Route
        path="/manuals"
        element={
          <Layout>
            <ManualsPage />
          </Layout>
        }
      />
      <Route
        path="*"
        element={
          <Layout sidebar={sidebarCollapsed ? null : renderSidebar()}>
            <h1 className="text-2xl font-bold mb-4">Compact Pool Technicians 🚀</h1>

            {/* ✅ SHOW HOMEPAGE BUTTONS HERE */}
            {!mode && <HomeMenu setMode={setMode} />}

            {mode === "diagnostics" && model && (
              (() => {
                const flow = findFlow(brand, equipmentType, model);
                const jumpNode = sessionStorage.getItem("jumpToNode");
                return flow ? (
                  <FlowRunner
                    key={flow.id}
                    flow={flow}
                    jumpTo={jumpNode || null}
                    onExit={resetToHome}
                    onFinish={(answers) => createReportPDF(answers, flow)}
                  />
                ) : (
                  <p>
                    ✅ You chose <strong>{brand}</strong> → <strong>{equipmentType}</strong> →{" "}
                    <strong>{model}</strong> — but no diagnostic flow exists yet.
                  </p>
                );
              })()
            )}
          </Layout>
        }
      />
    </Routes>
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