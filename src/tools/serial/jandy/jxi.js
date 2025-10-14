// src/tools/serial/jandy/jxi.js
// Jandy JXi serial decoder — returns manufacturing info only

export function decodeJandyJxiSerial(serial) {
  const clean = serial.trim().toUpperCase(); // normalize input
  const result = {
    valid: false,
    serial: clean,
    revision: null,
    manufactureWeek: null,
    manufactureYear: null,
    unitNumber: null,
    notes: ""
  };

  // -----------------
  // Rev G or earlier (through 2017)
  // -----------------
  if (/^B\d{2}[A-Z][A-Z]\d{4}$/.test(clean)) {
    result.revision = "Rev G or earlier";

    // Example: B13AE0267
    const year = 2000 + parseInt(clean.substring(1, 3)); // 13 → 2013
    const unitNumber = clean.substring(5); // last 4 = unit #
    result.manufactureYear = year;
    result.unitNumber = unitNumber;
    result.notes = `Rev G or earlier • ${year} • Unit ${unitNumber}`;
    result.valid = true;
    return result;
  }

  // -----------------
  // Rev H or newer (2018+)
  // -----------------
  if (clean.startsWith("LB")) {
    result.revision = "Rev H or newer";

    // Example: LBEC02050329180001
    // Week manufactured: positions 8–9 (05)
    // Year manufactured: positions 12–15 (2018)
    // Unit number: last 4 digits (0001)
    const week = parseInt(clean.substring(8, 10));  // 05
    const year = parseInt(clean.substring(12, 16)); // 2018
    const unitNumber = clean.slice(-4);             // 0001

    result.manufactureWeek = week;
    result.manufactureYear = year;
    result.unitNumber = unitNumber;
    result.notes = `Rev H or newer • Week ${week}, ${year} • Unit ${unitNumber}`;
    result.valid = true;
    return result;
  }

  return result;
}