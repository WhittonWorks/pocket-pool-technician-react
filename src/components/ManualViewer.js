import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles for toolbar, zoom, search, etc.
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ManualViewer = ({ fileUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  );
};

export default ManualViewer;