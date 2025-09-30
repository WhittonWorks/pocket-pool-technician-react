// Auto-import all JSON flows in this folder
const ctx = require.context("./", false, /\.json$/);

const flows = {};

ctx.keys().forEach((key) => {
  const mod = ctx(key);
  const flow = mod.default || mod;

  if (flow && flow.id && flow.brand && flow.equipmentType && flow.model) {
    // Build a consistent key: brand-equipmentType-model
    const keyName = `${flow.brand.toLowerCase()}-${flow.equipmentType.toLowerCase()}-${flow.model
      .toLowerCase()
      .replace(/\s+/g, "")}`;

    flows[keyName] = flow;
  }
});

// Helper to find a flow dynamically
export function findFlow(brand, equipmentType, model) {
  if (!brand || !equipmentType || !model) return null;

  const key = `${brand.toLowerCase()}-${equipmentType.toLowerCase()}-${model
    .toLowerCase()
    .replace(/\s+/g, "")}`;

  return flows[key] || null;
}
console.log("DEBUG FLOWS:", flows);
export default flows;
// Debug: log all available flow keys on startup
console.log("Available diagnostic flows:", Object.keys(flows));