import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";

function ErrorLookup({ errors, onSelectError }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  // 🔹 Flatten all brand error files into a single searchable list
  const allErrors = Object.values(errors).flatMap((file) =>
    file.errors.map((e) => ({
      ...e,
      source: file.title,
    }))
  );

  // 🔹 Synonyms for tech language
  const synonymMap = {
    flow: ["circulation", "pressure", "pump", "low flow", "switch", "no flow"],
    ignite: ["fire", "light", "flame", "burn"],
    heat: ["warm", "temperature", "high limit", "burner", "hot"],
    sensor: ["probe", "temperature", "limit", "flame sensor", "thermistor"],
    power: ["voltage", "energize", "relay", "transformer"],
  };

  // 🔹 Expand query with synonyms
  const expandQuery = (input) => {
    const words = input.toLowerCase().split(/\s+/).filter(Boolean);
    return [...new Set(words.flatMap((w) => [w, ...(synonymMap[w] || [])]))].join(" ");
  };

  // 🔹 Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(allErrors, {
      keys: ["code", "title", "meaning", "description", "fix", "source"],
      threshold: 0.4, // Lower = stricter match
      distance: 100,
      minMatchCharLength: 2,
    });
  }, [errors]);

  // 🔍 Perform fuzzy search
  const results = search.trim()
    ? fuse.search(expandQuery(search)).map((r) => r.item)
    : [];

  // ✅ Select a result (expand details)
  function handleSelect(err) {
    setSelected(err);
    setSearch(err.code || err.title || "");
  }

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      <h2 className="text-xl font-bold mb-2">Error Code Lookup</h2>

      {/* 🔎 Search Bar */}
      <input
        type="text"
        placeholder="Search error code or description..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelected(null);
        }}
        className="border p-2 rounded w-full bg-white text-gray-900 placeholder-gray-500"
      />

      {/* 💡 No search results */}
      {search && results.length === 0 && !selected && (
        <p className="text-red-600 mt-4">❌ No matching errors found.</p>
      )}

      {/* 🧩 Suggestions */}
      {!selected && results.length > 0 && (
        <ul className="border rounded bg-white mt-2 shadow max-h-60 overflow-y-auto">
          {results.map((r, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(r)}
              className="p-2 hover:bg-gray-200 cursor-pointer text-gray-800"
            >
              <strong>{r.code}</strong> — {r.title}{" "}
              <span className="text-xs text-gray-500">({r.source})</span>
            </li>
          ))}
        </ul>
      )}

      {/* 🧾 Expanded result */}
      {selected && (
        <div className="mt-4 p-3 border rounded bg-gray-50 shadow-sm">
          <h3 className="font-bold text-lg">
            {selected.code} — {selected.title}
          </h3>
          {selected.meaning && (
            <p>
              <strong>Meaning:</strong> {selected.meaning}
            </p>
          )}
          {selected.description && (
            <p>
              <strong>Description:</strong> {selected.description}
            </p>
          )}
          {selected.fix && (
            <p>
              <strong>Fix:</strong> {selected.fix}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            <em>Source: {selected.source}</em>
          </p>

          {/* 🚀 Start Flow */}
          {selected.flowTarget ? (
            <button
              onClick={() => onSelectError(selected.flowTarget)}
              className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            >
              ▶️ Start Diagnosis From Here
            </button>
          ) : (
            <p className="text-gray-500 mt-3 italic">
              No linked diagnostic flow for this error yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ErrorLookup;