// src/tools/model/jandy/jxi.js
// Jandy JXi model decoder — determines gas type, BTU rating, VersaFlo status

export function decodeJandyJxiModel(model) {
  const clean = model.trim().toUpperCase(); // normalize input
  const result = {
    valid: false,
    model: clean,
    gasType: null,
    hasVersaFlo: false,
    btu: null,
    notes: ""
  };

  // Example formats: JXI400N, JXI400P, JXI400NK, JXI400PK
  const btuMatch = clean.match(/JXI(\d{3})/);
  if (btuMatch) result.btu = parseInt(btuMatch[1]) * 1000; // e.g., 400 → 400,000 BTU

  if (clean.includes("N")) result.gasType = "Natural Gas";
  else if (clean.includes("P")) result.gasType = "Propane";

  if (clean.includes("K")) result.hasVersaFlo = true;

  result.valid = !!btuMatch;
  result.notes = [
    result.btu ? `${result.btu.toLocaleString()} BTU` : null,
    result.gasType,
    result.hasVersaFlo ? "VersaFlo" : null
  ]
    .filter(Boolean)
    .join(" • ");

  return result;
}