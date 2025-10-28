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
    <div className="w-full max-w-4xl mx-auto px-4 py-2 sm:py-4">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
        📚 Equipment Manuals
      </h1>

      {!selectedFile && (
        <div className="space-y-6">
          {Object.keys(manuals).map((brand) => (
            <div key={brand}>
              <h2 className="text-lg sm:text-xl font-semibold capitalize text-black mb-1">
                {brand}
              </h2>

              {Object.keys(manuals[brand]).map((category) => (
                <div key={category} className="ml-2 sm:ml-4 mb-2">
                  <h3 className="text-md font-medium text-gray-800 capitalize mb-1">
                    {category}
                  </h3>
                  <ul className="space-y-1 pl-4 list-disc">
                    {manuals[brand][category].map((manual) => (
                      <li key={manual.path}>
                        <button
                          onClick={() => setSelectedFile(manual.path)}
                          className="text-base sm:text-lg text-blue-600 hover:underline active:opacity-80 transition"
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
        </div>
      )}

      {selectedFile && (
        <div className="w-full">
          <button
            onClick={() => setSelectedFile(null)}
            className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600 underline"
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