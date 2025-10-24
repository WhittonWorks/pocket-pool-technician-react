const fs = require("fs");
const path = require("path");

const manualsDir = path.join(__dirname, "../public/manuals");
const manifest = {};

fs.readdirSync(manualsDir, { withFileTypes: true }).forEach((brandDir) => {
  if (brandDir.isDirectory()) {
    const brand = brandDir.name;
    const brandPath = path.join(manualsDir, brand);
    const pdfs = fs
      .readdirSync(brandPath)
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => ({
        name: file.replace(/_/g, " ").replace(/\.pdf$/, ""),
        path: `/manuals/${brand}/${file}`,
      }));

    if (pdfs.length > 0) {
      manifest[brand] = pdfs;
    }
  }
});

fs.writeFileSync(
  path.join(manualsDir, "manifest.json"),
  JSON.stringify(manifest, null, 2)
);

console.log("✅ Manifest updated.");