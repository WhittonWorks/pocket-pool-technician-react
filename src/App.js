import React, { useState } from "react";
import Layout from "./Layout";

function App() {
  const [brand, setBrand] = useState(null);
  const [equipmentType, setEquipmentType] = useState(null);
  const [model, setModel] = useState(null);

  // start with just Jandy data
  const brands = ["Jandy","Hayward","Pentair"];

  const models = {
    Jandy: {
      Heaters: ["JXi","JXiQ","HI-E2", "VersaTemp"], // we’ll start with JXi
      Pumps: ["VS FloPro", "ePump"], // placeholders
      Filters: ["CL Cartridge", "CV Cartridge"],
      WaterCare: ["AquaPure"],
      Lighting: ["WaterColors LED"],
      Automation: ["AquaLink RS"],
    },
  };

  const equipmentTypes = Object.keys(models[brand] || {});

  const sidebar = (
    <div>
      <div style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}>
        PPT
      </div>

      {/* brand buttons */}
      {brands.map((b) => (
        <button
          key={b}
          onClick={() => {
            setBrand(b);
            setEquipmentType(null);
            setModel(null);
          }}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "8px 10px",
            marginBottom: 8,
            borderRadius: 6,
            border: "none",
            background: brand === b ? "#444" : "#333",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {b}
        </button>
      ))}

      {/* equipment types */}
      {brand && (
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>Equipment</div>
          {equipmentTypes.map((t) => (
            <button
              key={t}
              onClick={() => {
                setEquipmentType(t);
                setModel(null);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "6px 10px",
                marginBottom: 6,
                borderRadius: 6,
                border: "none",
                background: equipmentType === t ? "#555" : "#444",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* models */}
      {equipmentType && (
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 8, fontWeight: "bold" }}>Models</div>
          {models[brand][equipmentType].map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "6px 10px",
                marginBottom: 6,
                borderRadius: 6,
                border: "none",
                background: model === m ? "#666" : "#555",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Layout sidebar={sidebar}>
      <h1 style={{ marginTop: 0 }}>Pocket Pool Technician 🚀</h1>

      {!brand ? (
        <p>Select a brand from the left to get started.</p>
      ) : !equipmentType ? (
        <p>
          <strong>{brand}</strong> selected — now choose an equipment type.
        </p>
      ) : !model ? (
        <p>
          <strong>{brand}</strong> → <strong>{equipmentType}</strong> selected —
          now choose a model.
        </p>
      ) : (
        <p>
          You chose <strong>{brand}</strong> → <strong>{equipmentType}</strong>{" "}
          → <strong>{model}</strong>.
        </p>
      )}
    </Layout>
  );
}

export default App;