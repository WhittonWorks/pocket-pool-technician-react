export function decodeJandyJxiSerial(serial) {
  const clean = serial.trim().toUpperCase();
  const result = {
    valid: false,
    revision: null,
    manufactureDate: null,
    gasType: null,
    hasVersaFlo: false,
    notes: ""
  };

  // -----------------
  // Rev G or earlier (through 2017)
  // -----------------
  if (/^B\d{2}[A-Z][A-Z]\d{4}$/.test(clean)) {
    result.revision = "Rev G or earlier";

    // B13AE0267
    const year = 2000 + parseInt(clean.substring(1, 3)); // 13 = 2013
    const monthCode = clean.substring(4, 5);
    const monthMap = {
      A: "January", B: "February", C: "March", D: "April", E: "May",
      F: "June", G: "July", H: "August", J: "September", K: "October",
      L: "November", M: "December"
    };
    result.manufactureDate = {
      year,
      month: monthMap[monthCode] || "Unknown"
    };

    result.valid = true;
    result.notes = `Rev G or earlier • ${monthMap[monthCode] || "Unknown"} ${year}`;
    return result;
  }

  // -----------------
  // Rev H or newer (2018+)
  // -----------------
  if (clean.startsWith("LB")) {
    result.revision = "Rev H or newer";

    // LBEC02050329180001
    //  Week manufactured: positions 8–9 (05)
    //  Year manufactured: positions 12–15 (2018)
    const week = parseInt(clean.substring(8, 10));  // 05
    const year = parseInt(clean.substring(12, 16)); // 2018

    result.manufactureDate = { year, week };

    // Optional flags
    if (clean.includes("NG")) result.gasType = "Natural Gas";
    else if (clean.includes("LP")) result.gasType = "Propane";
    if (clean.includes("VF")) result.hasVersaFlo = true;

    result.valid = true;
    result.notes = `Rev H or newer • Week ${week}, ${year}`;
    return result;
  }

  return result;
}