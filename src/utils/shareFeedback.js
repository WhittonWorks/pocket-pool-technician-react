/**
 * shareFeedback.js
 * Shared utility to export local feedback and open email client
 */

export function shareFeedback(feedbackList) {
  if (!feedbackList || feedbackList.length === 0) {
    alert("No feedback found to share.");
    return;
  }

  const dateStr = new Date().toISOString().split("T")[0];

  // --- JSON ---
  const jsonData = JSON.stringify(feedbackList, null, 2);
  const jsonBlob = new Blob([jsonData], { type: "application/json" });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const jsonLink = document.createElement("a");
  jsonLink.href = jsonUrl;
  jsonLink.download = `ppt_feedback_${dateStr}.json`;
  jsonLink.click();

  // --- CSV ---
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
  const csvBlob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const csvUrl = URL.createObjectURL(csvBlob);
  const csvLink = document.createElement("a");
  csvLink.href = csvUrl;
  csvLink.download = `ppt_feedback_${dateStr}.csv`;
  csvLink.click();

  // --- Email ---
  const body = encodeURIComponent(
    `Attached below are exported feedback files (CSV + JSON) from the Compact Pool Technician alpha test.\n\nTotal Entries: ${feedbackList.length}\nDate: ${new Date().toLocaleString()}\n\nThank you for helping us improve the app!`
  );

  window.location.href = `mailto:Whittonworksllc@gmail.com?subject=PPT Alpha Feedback Submission&body=${body}`;
}