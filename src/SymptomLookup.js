import React, { useState } from "react";
import SymptomLookupCard from "./components/SymptomLookupCard";

function SymptomLookup({ symptoms, onSelectSymptom }) {
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // 🔹 Flatten all symptom files into one searchable list
  const allSymptoms = Object.values(symptoms).flatMap((file) =>
    file.symptoms.map((s) => ({
      ...s,
      source: file.title,
      brand: s.brand || s.flowTarget?.brand || "Unknown",
      equipmentType: s.equipmentType || s.flowTarget?.equipmentType || "Unknown",
    }))
  );

  // 🔹 Extract unique brands & types
  const brands = ["All", ...new Set(allSymptoms.map((s) => s.brand))];
  const types = ["All", ...new Set(allSymptoms.map((s) => s.equipmentType))];

  // 🔹 Synonym map for technician wording
  const synonymMap = {
    didnt: ["did not", "won't", "wont", "fails to", "no"],
    fire: ["ignite", "light", "burn"],
    ignite: ["fire", "light"],
    heat: ["warm", "burn"],
    flow: ["water flow", "pressure", "circulation"],
    sensor: ["probe", "igniter", "flame sensor"],
    power: ["voltage", "energize"],
  };

  // 🔍 Fuzzy-style filter
  const filtered = allSymptoms.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;

    const terms = q.split(/\s+/).filter(Boolean);
    const searchableText = [
      s.symptom,
      ...(s.causes || []),
      ...(s.actions || []),
    ]
      .join(" ")
      .toLowerCase();

    const expandedTerms = terms.flatMap((t) => [t, ...(synonymMap[t] || [])]);
    return expandedTerms.some((t) => searchableText.includes(t));
  });

  // 🔹 Apply brand and type filters
  const filteredResults = filtered.filter((s) => {
    const brandMatch = selectedBrand === "All" || s.brand === selectedBrand;
    const typeMatch = selectedType === "All" || s.equipmentType === selectedType;
    return brandMatch && typeMatch;
  });

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      <h2 className="text-xl font-bold mb-2">Symptom Lookup</h2>

      {/* 🔹 Brand & Type Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border p-2 rounded bg-white text-gray-900"
        >
          {brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border p-2 rounded bg-white text-gray-900"
        >
          {types.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* 🔍 Search bar */}
      <input
        type="text"
        placeholder="🔍 Search symptoms (e.g. 'didn't fire', 'no flow', 'sensor')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full bg-white text-gray-900 placeholder-gray-500"
      />

      {/* ⚠️ Feedback messages */}
      {query && filteredResults.length === 0 && (
        <p className="text-red-600 mt-4">❌ No symptoms found.</p>
      )}
      {!query && allSymptoms.length === 0 && (
        <p className="text-gray-500 mt-4">⚠️ No symptom data loaded.</p>
      )}

      {/* 🩺 Render results */}
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