import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import branding from "../../config/branding";

// 🧾 Generate professional diagnostic report (modular utility)
export default async function createReportPDF(answers, flow = null) {
  const doc = new jsPDF();

  // --- Load active branding profile ---
  const activeProfile =
    branding.profiles?.[branding.activeProfile] || branding;

  const cleanText = (text) =>
    !text
      ? "—"
      : String(text)
          .replace(/\s+/g, " ")
          .replace(/['"`]+/g, "")
          .replace(/\s*:\s*/g, ": ")
          .trim();

  const prettifyStep = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // --- Filter + normalize diagnostic data ---
  const filtered = Object.entries(answers).filter(
    ([key, val]) =>
      val &&
      !["outcome", "result", "enter_serial", "enter_model"].includes(key) &&
      String(val).trim() !== ""
  );

  const unique = [];
  const seen = new Set();
  for (const [k, v] of filtered) {
    if (!seen.has(k)) {
      seen.add(k);
      unique.push([k, v]);
    }
  }

  // --- Build rows for the diagnostic steps table ---
  const rows = unique.map(([key, val], i) => {
    const node = flow?.nodes?.[key];
    const step = node?.text ? cleanText(node.text) : prettifyStep(key);
    const expected =
      Array.isArray(node?.range) && node.range.length
        ? `${node.range.join(" – ")} ${node.unit || ""}`
        : "—";
    const actual = cleanText(val);
    let result = "—";
    if (/pass|true|success/i.test(actual)) result = "PASS";
    if (/fail|false|error/i.test(actual)) result = "FAIL";
    return [i + 1, step, expected, actual, result];
  });

  // --- Header ---
  doc.setFontSize(18);
  doc.text("Pool Diagnostic Report", 60, 20);

  doc.setFontSize(12);
  let y = 30;

  doc.text(activeProfile.companyName || "Your Pool Company, LLC", 60, y);
  y += 6;

  const addressLines = (activeProfile.address || "123 Main Street\nAnytown, USA 12345").split("\n");
  addressLines.forEach((line) => {
    doc.text(line.trim(), 60, y);
    y += 6;
  });

  doc.text(`Phone: ${activeProfile.phone || "(555) 555-5555"}`, 60, y);
  y += 6;
  doc.text(`Email: ${activeProfile.email || "info@yourpoolcompany.com"}`, 60, y);
  y += 6;
  doc.text(`Website: ${activeProfile.website || "www.yourpoolcompany.com"}`, 60, y);

  // --- Unified Equipment Info section ---
  const eq = answers.equipmentInfo || {};
  const serialInfo = answers.serialInfo || {};
  const modelInfo = answers.modelInfo || {};

  // Merge fallback fields (for older flows that didn’t use mergeEquipmentInfo)
  const mergedEq = {
    brand: eq.brand || flow?.brand || "Unknown",
    model: eq.model || modelInfo.model || "—",
    revision: eq.revision || serialInfo.revision || "—",
    manufactureDate: eq.manufactureDate || {
      week: serialInfo.manufactureWeek,
      year: serialInfo.manufactureYear,
    },
    gasType: eq.gasType || modelInfo.gasType || "—",
    btu: eq.btu || modelInfo.btu || null,
    hasVersaFlo:
      typeof eq.hasVersaFlo === "boolean"
        ? eq.hasVersaFlo
        : modelInfo.hasVersaFlo,
    plant: eq.plant || serialInfo.plant || null,
    line: eq.line || serialInfo.line || null,
    unitNumber: eq.unitNumber || serialInfo.unitNumber || null,
  };

  const yStart = y + 16;
  doc.setFontSize(11);
  doc.text(`Date: ${new Date().toLocaleString()}`, 10, yStart);

  let lineY = yStart + 8;

  doc.text(`Brand: ${cleanText(mergedEq.brand)}`, 10, lineY);
  lineY += 6;
  doc.text(`Model: ${cleanText(mergedEq.model)}`, 10, lineY);
  lineY += 6;
  doc.text(`Revision: ${cleanText(mergedEq.revision)}`, 10, lineY);
  lineY += 6;

  if (mergedEq.btu) {
    doc.text(`BTU: ${mergedEq.btu.toLocaleString()} BTU`, 10, lineY);
    lineY += 6;
  }

  doc.text(`Gas Type: ${cleanText(mergedEq.gasType)}`, 10, lineY);
  lineY += 6;

  if (typeof mergedEq.hasVersaFlo === "boolean") {
    doc.text(
      `VersaFlo: ${mergedEq.hasVersaFlo ? "Included" : "Not Included"}`,
      10,
      lineY
    );
    lineY += 6;
  }

  if (mergedEq.manufactureDate?.year) {
    const wk = mergedEq.manufactureDate.week
      ? `Week ${mergedEq.manufactureDate.week}, `
      : "";
    doc.text(`Manufactured: ${wk}${mergedEq.manufactureDate.year}`, 10, lineY);
    lineY += 6;
  }

  if (mergedEq.plant) {
    doc.text(`Plant: ${mergedEq.plant}`, 10, lineY);
    lineY += 6;
  }

  if (mergedEq.unitNumber) {
    doc.text(`Unit #: ${mergedEq.unitNumber}`, 10, lineY);
    lineY += 10;
  }

  // --- Outcome summary ---
  const outcome = cleanText(answers.outcome || "Unknown");
  const summary = cleanText(answers.result || "No summary provided.");
  const isPass = /pass|success/i.test(outcome);

  doc.setFontSize(13);
  doc.setTextColor(isPass ? 0 : 200, isPass ? 150 : 0, 0);
  doc.text(`Outcome: ${outcome}`, 10, lineY);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Summary: ${summary}`, 10, lineY + 8);

  // --- Results Table ---
  autoTable(doc, {
    startY: lineY + 20,
    head: [["#", "Step / Test", "Expected Range / Condition", "Actual Reading", "Result"]],
    body: rows,
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [11, 115, 255],
      textColor: 255,
      halign: "center",
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 8 },
      1: { cellWidth: 70 },
      2: { cellWidth: 45 },
      3: { cellWidth: 35 },
      4: { halign: "center", cellWidth: 20 },
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 4) {
        const val = String(data.cell.text).toLowerCase();
        if (val.includes("pass")) data.cell.styles.textColor = [0, 128, 0];
        if (val.includes("fail")) data.cell.styles.textColor = [200, 0, 0];
      }
    },
  });

  // --- Footer ---
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(180);
  doc.line(10, pageHeight - 15, 200, pageHeight - 15);
  doc.setFontSize(10);
  doc.text(activeProfile.copyright || branding.copyright, 10, pageHeight - 8);

  // --- Save File ---
  const timestamp = new Date()
    .toISOString()
    .replace("T", "_")
    .replace(/:/g, "-")
    .split(".")[0];
  const fileName = `diagnostic-report_${outcome}_${timestamp}.pdf`;

  doc.save(fileName);
  alert("✅ PDF report generated successfully!");
}
