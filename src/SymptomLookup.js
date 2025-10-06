import React, { useState } from "react";

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

    // Split the user’s input into words (ignore punctuation)
    const terms = q.split(/\s+/).filter(Boolean);

    // Combine searchable text from multiple fields
    const searchableText = [
      s.symptom,
      ...(s.causes || []),
      ...(s.actions || []),
    ]
      .join(" ")
      .toLowerCase();

    // Expand each term with its synonyms
    const expandedTerms = terms.flatMap((t) => [t, ...(synonymMap[t] || [])]);

    // ✅ Match if ANY expanded term appears anywhere in the text
    return expandedTerms.some((t) => searchableText.includes(t));
  });

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      <h2 className="text-xl font-bold mb-2">Symptom Lookup</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="🔍 Search symptoms (e.g. 'didn't fire', 'no flow', 'sensor')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full bg-white text-gray-900 placeholder-gray-500"
      />

      {/* Feedback messages */}
      {query && filtered.length === 0 && (
        <p className="text-red-600 mt-4">❌ No symptoms found.</p>
      )}
      {!query && allSymptoms.length === 0 && (
        <p className="text-gray-500 mt-4">⚠️ No symptom data loaded.</p>
      )}

      {/* Symptom results */}
      {filtered.map((s, idx) => (
        <div
          key={idx}
          className="mt-4 p-3 border rounded bg-gray-50 shadow-sm hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            if (s.flowTarget) {
              console.log("🧭 Jumping into flow:", s.flowTarget);
              onSelectSymptom(s.flowTarget);
            } else {
              alert("No linked diagnostic flow for this symptom yet.");
            }
          }}
        >
          <h3 className="font-bold text-lg">{s.symptom}</h3>
          <p className="text-sm text-gray-500 mb-2">
            <em>Source: {s.source}</em>
          </p>

          {s.causes && (
            <div className="mb-2">
              <strong>Possible Causes:</strong>
              <ul className="list-disc ml-5">
                {s.causes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {s.actions && (
            <div>
              <strong>Recommended Actions:</strong>
              <ul className="list-disc ml-5">
                {s.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SymptomLookup;