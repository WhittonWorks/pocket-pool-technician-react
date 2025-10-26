// src/pages/ManualsPage.js
import React, { useEffect, useState } from "react";
import ManualViewer from "../components/ManualViewer";

const ManualsPage = () => {
  const [manuals, setManuals] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch("/manuals/manifest.json")
      .then((res) => res.json())
      .then(setManuals)
      .catch((err) => console.error("Failed to load manifest:", err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">📚 Equipment Manuals</h1>

      {!selectedFile && (
        <>
          {Object.keys(manuals).map((brand) => (
            <div key={brand} className="mb-6">
              <h2 className="text-xl font-semibold capitalize text-black mb-2">{brand}</h2>

              {Object.keys(manuals[brand]).map((category) => (
                <div key={category} className="ml-4 mb-4">
                  <h3 className="text-md font-medium text-gray-800 capitalize">{category}</h3>
                  <ul className="list-disc ml-6">
                    {manuals[brand][category].map((manual) => (
                      <li key={manual.path}>
                        <button
                          onClick={() => setSelectedFile(manual.path)}
                          className="text-blue-500 hover:underline"
                        >
                          {manual.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {selectedFile && (
        <div>
          <button
            onClick={() => setSelectedFile(null)}
            className="mb-4 text-sm text-gray-600 underline"
          >
            ← Back to manual list
          </button>
          <ManualViewer fileUrl={selectedFile} />
        </div>
      )}
    </div>
  );
};

export default ManualsPage;