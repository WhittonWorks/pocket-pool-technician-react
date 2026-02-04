// scripts/generateManualManifest.js
const fs = require("fs");
const path = require("path");

const manualsDir = path.join(__dirname, "../public/manuals");
const manifest = {};

function getPdfFiles(dirPath, brand, category) {
  const fullDirPath = path.join(manualsDir, brand, category);

  // Safety: if a category folder is missing, skip it instead of crashing
  if (!fs.existsSync(fullDirPath)) return [];

  return (
    fs
      .readdirSync(fullDirPath)
      .filter((file) => file.toLowerCase().endsWith(".pdf"))
      // Safety: stable ordering so Netlify builds don't reshuffle lists
      .sort((a, b) => a.localeCompare(b))
      .map((file) => ({
        name: file.replace(/_/g, " ").replace(/\.pdf$/i, ""),
        path: `/manuals/${brand}/${category}/${file}`,
      }))
  );
}

fs.readdirSync(manualsDir).forEach((brand) => {
  const brandPath = path.join(manualsDir, brand);
  if (!fs.lstatSync(brandPath).isDirectory()) return;

  const categories = fs
    .readdirSync(brandPath)
    .filter((sub) => fs.lstatSync(path.join(brandPath, sub)).isDirectory())
    .sort((a, b) => a.localeCompare(b));

  const brandEntry = {};
  categories.forEach((category) => {
    const pdfs = getPdfFiles(brandPath, brand, category);
    if (pdfs.length > 0) {
      brandEntry[category] = pdfs;
    }
  });

  if (Object.keys(brandEntry).length > 0) {
    manifest[brand] = brandEntry;
  }
});

// Write PRIMARY manifest used by the app
const primaryOut = path.join(manualsDir, "manifest.json");
fs.writeFileSync(primaryOut, JSON.stringify(manifest, null, 2));

// Safety net: also write FALLBACK manifest (keeps your existing fallback logic valid)
const fallbackOut = path.join(manualsDir, "manuals-manifest.json");
fs.writeFileSync(fallbackOut, JSON.stringify(manifest, null, 2));

console.log("✅ /manuals/manifest.json updated (generated from public/manuals)");
console.log("✅ /manuals/manuals-manifest.json updated (fallback kept in sync)");