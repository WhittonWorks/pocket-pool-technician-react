import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function FlowComplete() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const pdfFileName = state?.pdfFileName;
  const flowTitle = state?.flowTitle || "Compact Pool Technician Report";

  return (
    <main className="flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">✅ Report Created</h1>
      <p className="mb-4">
        {`Your report for “${flowTitle}” has been generated successfully.`}
      </p>

      {pdfFileName && (
        <a
          href={pdfFileName}
          download
          className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        >
          Download PDF
        </a>
      )}

      <button
        onClick={() => navigate("/feedback", { state })}
        className="bg-green-600 text-white px-4 py-2 rounded mb-3 w-48"
      >
        Leave Feedback
      </button>

      <button
        onClick={() => navigate("/home")}
        className="bg-gray-400 text-black px-4 py-2 rounded w-48"
      >
        Return Home
      </button>
    </main>
  );
}