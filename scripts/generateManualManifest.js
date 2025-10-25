// scripts/generateManualManifest.js
const fs = require("fs");
const path = require("path");

const manualsDir = path.join(__dirname, "../public/manuals");
const manifest = {};

function getPdfFiles(dirPath, brand, category) {
  const fullDirPath = path.join(manualsDir, brand, category);
  return fs
    .readdirSync(fullDirPath)
    .filter((file) => file.toLowerCase().endsWith(".pdf"))
    .map((file) => ({
      name: file.replace(/_/g, " ").replace(/\.pdf$/, ""),
      path: `/manuals/${brand}/${category}/${file}`,
    }));
}

fs.readdirSync(manualsDir).forEach((brand) => {
  const brandPath = path.join(manualsDir, brand);
  if (!fs.lstatSync(brandPath).isDirectory()) return;

  const categories = fs.readdirSync(brandPath).filter((sub) =>
    fs.lstatSync(path.join(brandPath, sub)).isDirectory()
  );

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

fs.writeFileSync(
  path.join(manualsDir, "manifest.json"),
  JSON.stringify(manifest, null, 2)
);
console.log("✅ manuals/manifest.json updated with brand > category > PDFs");