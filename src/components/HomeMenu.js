// src/components/HomeMenu.js
import React from "react";
import createReportPDF from "../utils/pdf/createReportPDF";

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

export default function HomeMenu({ setMode }) {
  return (
    <div className="p-4 space-y-2">
      <button style={btnStyle} onClick={() => setMode("manuals")}>📘 Manuals</button>
      <button style={btnStyle} onClick={() => setMode("diagnostics")}>🧭 Guided Diagnostics</button>
      <button style={btnStyle} onClick={() => setMode("errors")}>⚠️ Error Code Lookup</button>
      <button style={btnStyle} onClick={() => setMode("symptoms")}>🤒 Symptom Lookup</button>
      <button
        style={{ ...btnStyle, background: "#007bff", marginBottom: 16 }}
        onClick={() =>
          createReportPDF(
            {
              enter_serial: "B1234567",
              outcome: "Success",
              result: "Rev G heater operating normally.",
              rev_g_start: "240 V",
              rev_g_240: "220 V",
              rev_g_step2: "22 V (✅ pass)",
              rev_g_flame: "true",
            },
            { brand: "Jandy", model: "JXi" }
          )
        }
      >
        🧾 Generate Test PDF
      </button>
      <button
        style={{ ...btnStyle, background: "#FFD300", color: "#000" }}
        onClick={() => setMode("feedback")}
      >
        ✉️ Feedback Log
      </button>
    </div>
  );
}