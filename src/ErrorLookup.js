import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";

/**
 * ✅ Auto-import all JSON files from /errors folder dynamically
 *    Each new file dropped in /src/errors will be included automatically.
 */
const errorFiles = require.context("./errors", false, /\.json$/);
const errors = Object.fromEntries(
  errorFiles.keys().map((key) => [
    key.replace("./", "").replace(".json", ""),
    errorFiles(key),
  ])
);

function ErrorLookup({ onSelectError }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedModel, setSelectedModel] = useState("All");

  // 🔹 Flatten error data + normalize brand/type/model
  const allErrors = Object.values(errors).flatMap((file) =>
    file.errors.map((e) => ({
      ...e,
      source: file.title,
      brand: e.brand || e.flowTarget?.brand || file.brand || "Unknown",
      equipmentType:
        e.equipmentType ||
        e.flowTarget?.equipmentType ||
        file.equipmentType ||
        "Unknown",
      model: e.model || e.flowTarget?.model || file.model || "Unknown",
      metadata: e.metadata || {},
    }))
  );

  // 🔹 Create brand/type/model dropdown lists
  const brands = ["All", ...new Set(allErrors.map((e) => e.brand))];
  const types = [
    "All",
    ...new Set(
      allErrors
        .filter((e) => selectedBrand === "All" || e.brand === selectedBrand)
        .map((e) => e.equipmentType)
    ),
  ];
  const models = [
    "All",
    ...new Set(
      allErrors
        .filter(
          (e) =>
            (selectedBrand === "All" || e.brand === selectedBrand) &&
            (selectedType === "All" || e.equipmentType === selectedType)
        )
        .map((e) => e.model)
    ),
  ];

  // 🔹 Synonyms for tech terminology
  const synonymMap = {
    flow: ["circulation", "pressure", "pump", "low flow", "switch", "no flow"],
    ignite: ["fire", "light", "flame", "burn"],
    heat: ["warm", "temperature", "high limit", "burner", "hot"],
    sensor: ["probe", "temperature", "limit", "flame sensor", "thermistor"],
    power: ["voltage", "energize", "relay", "transformer"],
  };

  const expandQuery = (input) => {
    const words = input.toLowerCase().split(/\s+/).filter(Boolean);
    return [...new Set(words.flatMap((w) => [w, ...(synonymMap[w] || [])]))].join(" ");
  };

  // 🔹 Configure Fuse.js
const fuse = useMemo(() => {
  return new Fuse(allErrors, {
    keys: ["code", "title", "meaning", "description", "fix", "source"],
    threshold: 0.4,
    distance: 100,
    minMatchCharLength: 2,
  });
}, [allErrors]);

  // 🔍 Run fuzzy search
  const results = search.trim()
    ? fuse.search(expandQuery(search)).map((r) => r.item)
    : allErrors;

  // 🧹 Deduplicate results by brand/model/code combo
  const dedupedResults = results.filter(
    (v, i, self) =>
      i ===
      self.findIndex(
        (t) =>
          t.code === v.code &&
          t.brand === v.brand &&
          t.model === v.model
      )
  );

  // 🔹 Apply filters
  const filteredResults = dedupedResults.filter((r) => {
    const brandMatch = selectedBrand === "All" || r.brand === selectedBrand;
    const typeMatch = selectedType === "All" || r.equipmentType === selectedType;
    const modelMatch = selectedModel === "All" || r.model === selectedModel;
    return brandMatch && typeMatch && modelMatch;
  });

  // ✅ Select result
  function handleSelect(err) {
    setSelected(err);
    setSearch(err.code || err.title || "");
  }

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      <h2 className="text-xl font-bold mb-2">Error Code Lookup</h2>

      {/* 🔹 Filters: Brand → Equipment Type → Model */}
      <div className="flex flex-wrap gap-2 mb-3">
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedType("All");
            setSelectedModel("All");
          }}
          className="border p-2 rounded bg-white text-gray-900"
        >
          {brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setSelectedModel("All");
          }}
          className="border p-2 rounded bg-white text-gray-900"
        >
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="border p-2 rounded bg-white text-gray-900"
        >
          {models.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

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

      {/* 💡 No results */}
      {search && filteredResults.length === 0 && !selected && (
        <p className="text-red-600 mt-4">❌ No matching errors found.</p>
      )}

      {/* 🧩 Suggestions */}
      {!selected && filteredResults.length > 0 && (
        <ul className="border rounded bg-white mt-2 shadow max-h-60 overflow-y-auto">
          {filteredResults.map((r, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(r)}
              className="p-2 hover:bg-gray-200 cursor-pointer text-gray-800"
            >
              <strong>{r.code}</strong> — {r.title}{" "}
              <span className="text-xs text-gray-500">
                ({r.brand} {r.model})
              </span>
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

          {/* 🧠 Optional metadata display */}
          {selected.metadata && Object.keys(selected.metadata).length > 0 && (
            <div className="text-sm text-gray-700 mt-2">
              {selected.metadata.severity && (
                <p>
                  <strong>Severity:</strong> {selected.metadata.severity}
                </p>
              )}
              {selected.metadata.frequency && (
                <p>
                  <strong>Frequency:</strong> {selected.metadata.frequency}
                </p>
              )}
              {selected.metadata.lastUpdated && (
                <p>
                  <strong>Last Updated:</strong> {selected.metadata.lastUpdated}
                </p>
              )}
            </div>
          )}

          <p className="text-sm text-gray-500 mt-2">
            <em>
              Source: {selected.source} | {selected.brand} {selected.model}
            </em>
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
