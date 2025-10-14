export function decodeJandyJxiModel(model) {
  const clean = model.trim().toUpperCase();

  const result = {
    valid: false,
    model: clean,
    btu: null,
    gasType: null,
    hasVersaFlo: false,
    exchanger: null,
    asme: false,
    notes: ""
  };

  if (!/^JXI/.test(clean)) return result;

  // Extract BTU rating
  const btuMatch = clean.match(/JXI(\d{3})/);
  if (btuMatch) result.btu = parseInt(btuMatch[1]) * 1000;

  // Gas type (N or P immediately after BTU)
  const gasMatch = clean.match(/JXI\d{3}([NP])/);
  if (gasMatch) {
    result.gasType = gasMatch[1] === "N" ? "Natural Gas" : "Propane";
  }

  // VersaFlo detection
  if (clean.endsWith("K") || clean.includes("NK")) result.hasVersaFlo = true;

  // Exchanger type
  result.exchanger = clean.includes("NK") ? "Cupronickel" : "Copper";

  // ASME
  if (/[CS]$/.test(clean)) result.asme = true;

  // Notes
  result.notes = [
    result.btu ? `${result.btu.toLocaleString()} BTU` : "",
    result.gasType,
    result.exchanger,
    result.asme ? "ASME" : "",
    result.hasVersaFlo ? "VersaFlo" : ""
  ]
    .filter(Boolean)
    .join(" • ");

  // Only mark valid if both BTU and gas type exist
  result.valid = !!(result.btu && result.gasType);

  return result;
}
