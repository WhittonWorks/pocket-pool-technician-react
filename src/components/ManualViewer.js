// src/components/ManualViewer.js
import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ManualViewer = ({ fileUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <div style={{ flexGrow: 1, minHeight: "500px", height: "calc(100dvh - 64px)" }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
            renderError={(error) => (
              <div style={{ color: "red", padding: "1rem" }}>
                Failed to load PDF: {error?.message || "Unknown error"}
                <br />
                Path tried: {fileUrl}
              </div>
            )}
          />
        </Worker>
      </div>
    </div>
  );
};

export default ManualViewer;