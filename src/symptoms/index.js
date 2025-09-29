// Auto-import all JSON symptom files in this folder
const ctx = require.context("./", false, /\.json$/);

const symptoms = {};

ctx.keys().forEach((key) => {
  const mod = ctx(key);
  const file = mod.default || mod;

  if (file && file.title && file.symptoms) {
    const keyName = file.title.toLowerCase().replace(/\s+/g, "-");
    symptoms[keyName] = file;
  }
});

export default symptoms;