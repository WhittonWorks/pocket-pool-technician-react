import React, { useState } from "react";

function SymptomLookup({ symptoms }) {
  const [query, setQuery] = useState("");

  const allSymptoms = Object.values(symptoms).flatMap((file) =>
    file.symptoms.map((s) => ({
      ...s,
      source: file.title,
    }))
  );

  console.log("Symptoms loaded:", allSymptoms);

  const filtered = allSymptoms.filter((s) =>
    s.symptom.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      <h2 className="text-xl font-bold mb-2">Symptom Lookup</h2>

      <input
        type="text"
        placeholder="🔍 Search symptoms (e.g. 'low chlorine', 'no flow')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full"
      />

      {query && filtered.length === 0 && (
        <p className="text-red-600 mt-4">❌ No symptoms found.</p>
      )}

      {!query && allSymptoms.length === 0 && (
        <p className="text-gray-500 mt-4">⚠️ No symptom data loaded.</p>
      )}

      {filtered.map((s, idx) => (
        <div key={idx} className="mt-4 p-3 border rounded bg-gray-50 shadow">
          <h3 className="font-bold text-lg">{s.symptom}</h3>
          <p className="text-sm text-gray-500"><em>Source: {s.source}</em></p>

          {s.causes && (
            <>
              <strong>Possible Causes:</strong>
              <ul className="list-disc ml-5">
                {s.causes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </>
          )}

          {s.actions && (
            <>
              <strong>Recommended Actions:</strong>
              <ul className="list-disc ml-5">
                {s.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </>
          )}

          {s.action && (
            <>
              <strong>Recommended Actions:</strong>
              <ul className="list-disc ml-5">
                {s.action.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default SymptomLookup;