// Auto-import all JSON error files in this folder
const ctx = require.context("./", false, /\.json$/);

const errors = {};

ctx.keys().forEach((key) => {
  const mod = ctx(key);
  const file = mod.default || mod;

  if (file && file.errors) {
    // Use filename (without .json) as the key
    const name = key.replace("./", "").replace(".json", "");
    errors[name] = file;
  }
});

export default errors;