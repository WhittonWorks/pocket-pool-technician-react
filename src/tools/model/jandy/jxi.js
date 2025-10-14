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

  const btuMatch = clean.match(/JXI(\d{3})/);
  if (btuMatch) result.btu = parseInt(btuMatch[1]) * 1000;

  if (clean.includes("N")) result.gasType = "Natural Gas";
  if (clean.includes("P")) result.gasType = "Propane";
  if (clean.endsWith("K") || clean.includes("NK")) result.hasVersaFlo = true;

  if (clean.includes("NK")) result.exchanger = "Cupronickel";
  else result.exchanger = "Copper";

  if (clean.endsWith("C") || clean.endsWith("S")) result.asme = true;

  result.valid = true;
  result.notes = [
    `${result.btu || ""} BTU`,
    result.gasType,
    result.exchanger,
    result.asme ? "ASME" : "",
    result.hasVersaFlo ? "VersaFlo" : ""
  ]
    .filter(Boolean)
    .join(" • ");

  return result;
}
