import React, { useState } from "react";
import errors from "./errors/jandy-aquapure-errors.json";

function ErrorLookup() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);

  function handleSearch() {
    const match = errors.errors.find((e) => e.code === search.trim());
    setResult(match || null);
  }

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-bold mb-2">AquaPure Error Code Lookup</h2>
      <input
        type="text"
        placeholder="Enter error code..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Search
      </button>

      {result && (
        <div className="mt-4 p-3 border rounded bg-white">
          <h3 className="font-bold">
            {result.code} — {result.title}
          </h3>
          <p><strong>Meaning:</strong> {result.meaning}</p>
          <p><strong>Fix:</strong> {result.fix}</p>
        </div>
      )}

      {result === null && search && (
        <p className="text-red-600 mt-4">❌ No matching error code found.</p>
      )}
    </div>
  );
}

export default ErrorLookup;