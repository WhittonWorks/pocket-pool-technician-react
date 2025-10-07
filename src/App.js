import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import FlowRunner from "./FlowRunner";
import ErrorLookup from "./ErrorLookup";
import SymptomLookup from "./SymptomLookup";
import errors from "./errors";
import symptoms from "./symptoms";
import { findFlow } from "./flows";

// 📄 PDF tools
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// 🧾 Handle report creation (logo removed for now)
async function handleFinishReport(answers) {
  const doc = new jsPDF();

  // --- Header ---
  doc.setFontSize(18);
  doc.text("Pool Diagnostic Report", 60, 20);

  doc.setFontSize(12);
  doc.text("Whitton Works, LLC", 60, 30);
  doc.text("3811 Poverty Creek Rd", 60, 36);
  doc.text("Crestview, FL 32539", 60, 42);
  doc.text("Phone: (850) 428-2186", 60, 48);
  doc.text("Email: Whittonworksllc@gmail.com", 60, 54);
  doc.text("Website: WhittonWorks.net", 60, 60);

  // --- Date & Serial ---
  doc.text(`Date: ${new Date().toLocaleString()}`, 10, 70);
  if (answers.enter_serial) {
    doc.text(`Heater Serial Number: ${answers.enter_serial}`, 10, 78);
  }

  // --- Build answers table ---
  const rows = Object.entries(answers).map(([step, value]) => [
    step,
    String(value),
  ]);

  autoTable(doc, {
    startY: 90,
    head: [["Step", "Result"]],
    body: rows,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [11, 115, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  // --- Save file ---
  const timestamp = new Date()
    .toISOString()
    .replace("T", "_")
    .replace(/:/g, "-")
    .split(".")[0];
  const outcome = answers.outcome || "Unknown";
  const fileName = `diagnostic-report_${outcome}_${timestamp}.pdf`;

  doc.save(fileName);
  alert("✅ PDF report generated successfully!");
}

function App() {
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState("brand");
  const [brand, setBrand] = useState(null);
  const [equipmentType, setEquipmentType] = useState(null);
  const [model, setModel] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 🔹 Watch screen size
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
  }

function handleNavigateToFlow(link) {
  // Example: link = { brand: "Jandy", type: "Heaters", model: "JXi" }
  setBrand(link.brand);
  setEquipmentType(link.type);
  setModel(link.model);
  setStep("model"); // optional, helps align sidebar state
  setMode("diagnostics");
  // 🧭 Jump to flow directly from symptom
  function launchFlowFromSymptom(flowTarget) {
    if (!flowTarget) return alert("⚠️ Invalid symptom data.");

    const { brand, equipmentType, model, startNode } = flowTarget;
    const flow = findFlow(brand, equipmentType, model);

    if (!flow) {
      alert("⚠️ Diagnostic flow not found for this symptom.");
      return;
    }

    // override the starting node for this flow
    if (startNode && flow.nodes[startNode]) {
      flow.start = startNode;
    }

    console.log("🚀 Launching flow:", {
      brand,
      equipmentType,
      model,
      startNode,
    });

    setBrand(brand);
    setEquipmentType(equipmentType);
    setModel(model);
    setMode("diagnostics");
  }

  // 🧭 Sidebar navigation
  function renderSidebar() {
    if (!mode) {
      return (
        <div>
          {/* TEMP: PDF test button */}
          <button
            style={{
              ...btnStyle,
              background: "#007bff",
              marginBottom: 16,
            }}
            onClick={() =>
              handleFinishReport({
                enter_serial: "B12345678",
                outcome: "Success",
                result: "Heater operating normally",
                step1: "Power verified",
                step2: "Transformer output 24VAC",
              })
            }
          >
            🧾 Generate Test PDF
          </button>

          <h3 className="font-bold mb-2">Choose Mode</h3>
          <button
            style={btnStyle}
            onClick={() => {
              setMode("diagnostics");
              setSidebarCollapsed(false);
            }}
          >
            🔍 Guided Diagnostics
          </button>
          <button
            style={btnStyle}
            onClick={() => {
              setMode("errors");
              setSidebarCollapsed(false);
            }}
          >
            ⚡ Error Code Lookup
          </button>
          <button
            style={btnStyle}
            onClick={() => {
              setMode("symptoms");
              setSidebarCollapsed(false);
            }}
          >
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
                  if (isMobile) setSidebarCollapsed(true);
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
          <SymptomLookup
            symptoms={symptoms}
            onSelectSymptom={launchFlowFromSymptom}  
          />
        </div>
      );
    }
  }

  // 🧩 Main render
  return (
    <Layout sidebar={sidebarCollapsed ? null : renderSidebar()}>
      <h1 className="text-2xl font-bold mb-4">Pocket Pool Technician 🚀</h1>

      {mode === "diagnostics" && model && (
        <>
          {(() => {
            const flow = findFlow(brand, equipmentType, model);
            if (flow) {
              return (
                <FlowRunner
                  key={flow.id}
                  flow={flow}
                  onExit={resetToHome}
                  onFinish={handleFinishReport}
                />
              );
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

// 🔹 Styling
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