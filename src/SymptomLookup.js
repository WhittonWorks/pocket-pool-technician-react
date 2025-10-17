import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import SymptomLookupCard from "./components/ui/SymptomLookupCard";

/**
 * ✅ Auto-import all JSON files from /symptoms folder dynamically
 */
const symptomFiles = require.context("./symptoms", false, /\.json$/);
const symptoms = Object.fromEntries(
  symptomFiles.keys().map((key) => [
    key.replace("./", "").replace(".json", ""),
    symptomFiles(key),
  ])
);

function SymptomLookup({ onSelectSymptom }) {
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedModel, setSelectedModel] = useState("All");

  // 🔹 Flatten and normalize all symptom data
  const allSymptoms = Object.values(symptoms).flatMap((file) =>
    (file.symptoms || []).map((s) => ({
      ...s,
      source: file.title,
      brand: s.brand || s.flowTarget?.brand || file.brand || "Unknown",
      equipmentType:
        s.equipmentType ||
        s.flowTarget?.equipmentType ||
        file.equipmentType ||
        "Unknown",
      model: s.model || s.flowTarget?.model || file.model || "Unknown",
      metadata: s.metadata || {},
    }))
  );

  // 🔹 Create Brand → Type → Model dropdown lists
  const brands = ["All", ...new Set(allSymptoms.map((s) => s.brand))];
  const types = [
    "All",
    ...new Set(
      allSymptoms
        .filter((s) => selectedBrand === "All" || s.brand === selectedBrand)
        .map((s) => s.equipmentType)
    ),
  ];
  const models = [
    "All",
    ...new Set(
      allSymptoms
        .filter(
          (s) =>
            (selectedBrand === "All" || s.brand === selectedBrand) &&
            (selectedType === "All" || s.equipmentType === selectedType)
        )
        .map((s) => s.model)
    ),
  ];

  // 🔹 Synonym map for technician phrases
  const synonymMap = {
    didnt: ["did not", "won't", "wont", "fails to", "no"],
    fire: ["ignite", "light", "burn"],
    ignite: ["fire", "light", "burn"],
    heat: ["warm", "hot"],
    flow: ["water flow", "pressure", "circulation"],
    sensor: ["probe", "igniter", "flame sensor"],
    power: ["voltage", "energize", "transformer"],
  };

  // 🔹 Expand query using synonyms
  const expandQuery = (input) => {
    const words = input.toLowerCase().split(/\s+/).filter(Boolean);
    return [...new Set(words.flatMap((w) => [w, ...(synonymMap[w] || [])]))].join(" ");
  };

  // ⚙️ Fuse.js fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(allSymptoms, {
      keys: ["symptom", "causes", "actions", "source"],
      threshold: 0.4,
      distance: 100,
      minMatchCharLength: 2,
    });
  }, [symptoms]);

  // 🔍 Run fuzzy search
  const results = query.trim()
    ? fuse.search(expandQuery(query)).map((r) => r.item)
    : allSymptoms;

  // 🧹 Deduplicate results (same brand/model/symptom)
  const dedupedResults = results.filter(
    (v, i, self) =>
      i ===
      self.findIndex(
        (t) =>
          t.symptom === v.symptom &&
          t.brand === v.brand &&
          t.model === v.model
      )
  );

  // 🔹 Apply dropdown filters
  const filteredResults = dedupedResults.filter((s) => {
    const brandMatch = selectedBrand === "All" || s.brand === selectedBrand;
    const typeMatch = selectedType === "All" || s.equipmentType === selectedType;
    const modelMatch = selectedModel === "All" || s.model === selectedModel;
    return brandMatch && typeMatch && modelMatch;
  });

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      <h2 className="text-xl font-bold mb-2">Symptom Lookup</h2>

      {/* 🔹 Brand → Type → Model Filters */}
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

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search symptoms (e.g. 'didn't fire', 'no flow', 'sensor')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full bg-white text-gray-900 placeholder-gray-500"
      />

      {/* ⚠️ Messages */}
      {query && filteredResults.length === 0 && (
        <p className="text-red-600 mt-4">❌ No symptoms found.</p>
      )}
      {!query && allSymptoms.length === 0 && (
        <p className="text-gray-500 mt-4">⚠️ No symptom data loaded.</p>
      )}

      {/* 🩺 Render Results */}
      {filteredResults.map((s, idx) => (
        <SymptomLookupCard
          key={idx}
          symptom={s}
          onSelectSymptom={onSelectSymptom}
        />
      ))}
    </div>
  );
}

export default SymptomLookup;
