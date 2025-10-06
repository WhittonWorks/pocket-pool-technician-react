// ✅ Auto-import all JSON flow files, including nested subfolders
const ctx = require.context("./", true, /\.json$/);

const flows = {};

// Loop through all found JSON files
ctx.keys().forEach((key) => {
  const mod = ctx(key);
  const flow = mod.default || mod;

  if (flow && flow.id && flow.brand && flow.equipmentType && flow.model) {
    // Build a consistent lookup key
    const keyName = `${flow.brand.toLowerCase()}-${flow.equipmentType
      .toLowerCase()
      .replace(/\s+/g, "")}-${flow.model.toLowerCase().replace(/\s+/g, "")}`;

    flows[keyName] = flow;

    console.log(`✅ Loaded flow: ${keyName} (${flow.title || "Untitled"})`);
  } else {
    console.warn(`⚠️ Skipped invalid flow file: ${key}`);
  }
});

// 🧭 Helper function to locate a flow dynamically
export function findFlow(brand, equipmentType, model) {
  if (!brand || !equipmentType || !model) {
    console.warn("⚠️ Missing key parameter in findFlow:", {
      brand,
      equipmentType,
      model,
    });
    return null;
  }

  const key = `${brand.toLowerCase()}-${equipmentType
    .toLowerCase()
    .replace(/\s+/g, "")}-${model.toLowerCase().replace(/\s+/g, "")}`;

  const flow = flows[key];
  if (!flow) console.warn(`❌ No flow found for key: ${key}`);

  return flow || null;
}

// Debug: log all available flows once
console.log("📘 All available diagnostic flows:", Object.keys(flows));

export default flows;