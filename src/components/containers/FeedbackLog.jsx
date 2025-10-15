import React, { useEffect, useState } from "react";

/**
 * 🧠 Feedback Log Viewer
 * Displays all locally saved feedback
 * Supports export (JSON/CSV) and clearing
 */
function FeedbackLog() {
  const [feedbackList, setFeedbackList] = useState([]);

  // Load feedback on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ppt_feedback") || "[]");
    setFeedbackList(stored);
  }, []);

  // Clear feedback
  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all feedback?")) {
      localStorage.removeItem("ppt_feedback");
      setFeedbackList([]);
      alert("🧹 All feedback cleared.");
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const data = JSON.stringify(feedbackList, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ppt_feedback_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  // Export CSV
  const handleExportCSV = () => {
    if (feedbackList.length === 0) {
      alert("No feedback to export.");
      return;
    }

    const headers = [
      "Date",
      "Brand",
      "Model",
      "Outcome",
      "Rating",
      "Notes",
      "Name",
      "Contact",
    ];

    const csvRows = [
      headers.join(","),
      ...feedbackList.map((item) =>
        [
          item.date || "",
          item.brand || "",
          item.model || "",
          item.outcome || "",
          item.rating || "",
          `"${(item.notes || "").replace(/"/g, '""')}"`,
          item.name || "",
          item.contact || "",
        ].join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ppt_feedback_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Share via email
  const handleShare = () => {
    if (feedbackList.length === 0) {
      alert("No feedback to share.");
      return;
    }

    const body = encodeURIComponent(
      `Attached below is exported feedback from the Compact Pool Technician alpha test.\n\nTotal Entries: ${feedbackList.length}\nDate: ${new Date().toLocaleString()}\n\nPlease find attached the exported file for review.`
    );

    // Opens user’s email app
    window.location.href = `mailto:Whittonworksllc@gmail.com?subject=PPT Alpha Feedback Submission&body=${body}`;
  };

  return (
    <div className="p-6 bg-white border rounded shadow text-gray-800">
      <h2 className="text-2xl font-bold mb-4">🧠 Feedback Log Viewer</h2>

      {feedbackList.length === 0 ? (
        <p className="text-gray-500">No feedback has been submitted yet.</p>
      ) : (
        <>
          {/* Top Bar */}
          <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
            <p className="text-sm text-gray-600">
              Total Feedback: {feedbackList.length}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportJSON}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                💾 Export JSON
              </button>
              <button
                onClick={handleExportCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              >
                📊 Export CSV
              </button>
              <button
                onClick={handleShare}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                📤 Share via Email
              </button>
              <button
                onClick={handleClear}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                🧹 Clear All
              </button>
            </div>
          </div>

          {/* Feedback entries */}
          <div className="overflow-y-auto max-h-[70vh] border-t border-gray-300 pt-3">
            {feedbackList
              .slice()
              .reverse()
              .map((item) => (
                <div
                  key={item.id}
                  className="mb-4 p-3 border rounded bg-gray-50 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold">
                      {item.brand || "Unknown"} {item.model || ""}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {item.date || "—"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Outcome:</strong> {item.outcome || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Rating:</strong> {item.rating || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700 mb-1 whitespace-pre-line">
                    <strong>Notes:</strong> {item.notes || "—"}
                  </p>

                  <hr className="my-2" />

                  <p className="text-xs text-gray-600">
                    <strong>Name:</strong> {item.name || "Anonymous"}{" "}
                    <span className="ml-3">
                      <strong>Contact:</strong> {item.contact || "N/A"}
                    </span>
                  </p>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

export default FeedbackLog;