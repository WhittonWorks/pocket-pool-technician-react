// Auto-import all JSON flows in this folder
const ctx = require.context("./", false, /\.json$/);

const flows = ctx.keys().map((key) => {
  const mod = ctx(key);
  return mod.default || mod;
});

// Only keep valid flows (with brand + equipmentType + title)
export default flows.filter(
  (f) => f && f.brand && f.equipmentType && f.title && f.id
);