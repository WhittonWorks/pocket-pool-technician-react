import React, { useEffect, useState } from "react";

/**
 * 🧾 Feedback Log Viewer
 * Displays all saved feedback items stored locally
 * Allows exporting and clearing feedback
 */
function FeedbackLog() {
  const [feedbackList, setFeedbackList] = useState([]);

  // Load feedback from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ppt_feedback") || "[]");
    setFeedbackList(stored);
  }, []);

  // Clear all feedback
  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all feedback?")) {
      localStorage.removeItem("ppt_feedback");
      setFeedbackList([]);
      alert("🧹 All feedback cleared.");
    }
  };

  // Export as JSON
  const handleExport = () => {
    const data = JSON.stringify(feedbackList, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ppt_feedback_${new Date()
      .toISOString()
      .split("T")[0]}.json`;
    link.click();
  };

  return (
    <div className="p-6 bg-white border rounded shadow text-gray-800">
      <h2 className="text-2xl font-bold mb-4">🧠 Feedback Log Viewer</h2>

      {feedbackList.length === 0 ? (
        <p className="text-gray-500">No feedback has been submitted yet.</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Total Feedback: {feedbackList.length}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                💾 Export JSON
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
                      {item.category}{" "}
                      {item.brand && item.model
                        ? `(${item.brand} ${item.model})`
                        : item.brand || ""}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">
                    {item.message}
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