import React, { useState } from "react";
import SymptomLookupCard from "./components/SymptomLookupCard";

function SymptomLookup({ symptoms, onSelectSymptom }) {
  const [query, setQuery] = useState("");

  // 🔹 Flatten all symptom files into one searchable list
  const allSymptoms = Object.values(symptoms).flatMap((file) =>
    file.symptoms.map((s) => ({
      ...s,
      source: file.title,
    }))
  );

  // 🔹 Basic synonym map for common technician wording
  const synonymMap = {
    didnt: ["did not", "won't", "wont", "fails to", "no"],
    fire: ["ignite", "light", "burn"],
    ignite: ["fire", "light"],
    heat: ["warm", "burn"],
    flow: ["water flow", "pressure", "circulation"],
    sensor: ["probe", "igniter", "flame sensor"],
    power: ["voltage", "energize"],
  };

  // 🔍 Fuzzy filter that matches any part of the symptom text
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

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      <h2 className="text-xl font-bold mb-2">Symptom Lookup</h2>

      {/* 🔍 Search bar */}
      <input
        type="text"
        placeholder="🔍 Search symptoms (e.g. 'didn't fire', 'no flow', 'sensor')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full bg-white text-gray-900 placeholder-gray-500"
      />

      {/* ⚠️ Feedback messages */}
      {query && filtered.length === 0 && (
        <p className="text-red-600 mt-4">❌ No symptoms found.</p>
      )}
      {!query && allSymptoms.length === 0 && (
        <p className="text-gray-500 mt-4">⚠️ No symptom data loaded.</p>
      )}

      {/* 🩺 Render results using SymptomLookupCard */}
      {filtered.map((s, idx) => (
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
