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

  // Must start with JXI
  if (!/^JXI/.test(clean)) return result;

  // --- Parse BTU ---
  const btuMatch = clean.match(/JXI(\d{3})/);
  if (btuMatch) result.btu = parseInt(btuMatch[1]) * 1000;

  // --- Parse gas type (N = Natural, P = Propane) ---
  const gasMatch = clean.match(/JXI\d{3}([NP])/);
  if (gasMatch) {
    result.gasType = gasMatch[1] === "N" ? "Natural Gas" : "Propane";
  }

  // --- VersaFlo detection (K at the end or NK after BTU) ---
  if (/-?NK?$/.test(clean) || clean.includes("NK")) result.hasVersaFlo = true;

  // --- Exchanger ---
  result.exchanger = clean.includes("NK") ? "Cupronickel" : "Copper";

  // --- ASME-rated (C or S at the end) ---
  if (/[CS]$/.test(clean)) result.asme = true;

  // --- Notes ---
  result.notes = [
    result.btu ? `${result.btu.toLocaleString()} BTU` : "",
    result.gasType,
    result.exchanger,
    result.asme ? "ASME" : "",
    result.hasVersaFlo ? "VersaFlo" : ""
  ]
    .filter(Boolean)
    .join(" • ");

  // ✅ Mark valid only if we parsed a BTU and gas type
  result.valid = !!(result.btu && result.gasType);

  return result;
}
