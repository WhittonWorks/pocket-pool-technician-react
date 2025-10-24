// src/pages/ManualsPage.jsx
import React, { useEffect, useState } from "react";

function ManualsPage() {
  const [manuals, setManuals] = useState(null);

  useEffect(() => {
    fetch("/manuals/manifest.json")
      .then((res) => res.json())
      .then(setManuals)
      .catch((err) => console.error("Failed to load manuals manifest", err));
  }, []);

  if (!manuals) {
    return <p>📁 Loading manuals...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">📚 Equipment Manuals</h2>
      {Object.entries(manuals).map(([brand, files]) => (
        <div key={brand} className="mb-6">
          <h3 className="text-lg font-bold mb-2">{brand}</h3>
          <ul className="space-y-1">
            {files.map((file) => (
              <li key={file.path}>
                <a
                  href={file.path}
                  className="text-blue-600 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ManualsPage;