import React, { useState } from "react";
import ErrorLookupCard from "./components/ErrorLookupCard";

function ErrorLookup({ errors, onSelectError }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  // Flatten errors into a single list
  const allErrors = Object.values(errors).flatMap((file) =>
    file.errors.map((e) => ({
      ...e,
      source: file.title,
    }))
  );

  // Filter suggestions by code
  const suggestions = allErrors.filter((e) =>
    e.code.toLowerCase().startsWith(search.trim().toLowerCase())
  );

  function handleSelect(code) {
    const match = allErrors.find((e) => e.code === code);
    setSelected(match);
    setSearch(code);
  }

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      <h2 className="text-xl font-bold mb-2">Error Code Lookup</h2>

      {/* Input */}
      <input
        type="text"
        placeholder="Enter error code..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelected(null);
        }}
        className="border p-2 rounded w-full bg-white text-gray-900 placeholder-gray-500"
      />

      {/* Suggestions */}
      {search && suggestions.length > 0 && !selected && (
        <ul className="border rounded bg-white mt-1 shadow max-h-40 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s.code + s.source}
              onClick={() => handleSelect(s.code)}
              className="p-2 hover:bg-gray-200 cursor-pointer text-gray-800"
            >
              {s.code} — {s.title}{" "}
              <span className="text-xs text-gray-500">({s.source})</span>
            </li>
          ))}
        </ul>
      )}

      {/* Result */}
      {selected && (
        <ErrorLookupCard
          error={selected}
          onStartDiagnosis={onSelectError}
        />
      )}

      {/* No match */}
      {search && suggestions.length === 0 && !selected && (
        <p className="text-red-600 mt-4">❌ No matching error code found.</p>
      )}
    </div>
  );
}

export default ErrorLookup;
