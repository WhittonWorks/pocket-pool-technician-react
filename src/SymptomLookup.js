import React, { useState } from "react";

function SymptomLookup({ symptoms }) {
  const [query, setQuery] = useState("");

  // Flatten all symptom files into one array
  const allSymptoms = Object.values(symptoms).flatMap((file) =>
    file.symptoms.map((s) => ({
      ...s,
      source: file.title, // add where it came from
    }))
  );

  // Filter symptoms by search query
  const filtered = allSymptoms.filter((s) =>
    s.symptom.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Search box */}
      <input
        type="text"
        placeholder="🔍 Search symptoms (e.g. 'low chlorine', 'no flow')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 mb-3 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
      />

      {/* No results */}
      {query && filtered.length === 0 && (
        <p className="text-red-600">❌ No symptoms found.</p>
      )}

      {/* Results */}
      {filtered.map((s, idx) => (
        <div
          key={idx}
          className="mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
        >
          <h3 className="text-lg font-bold mb-2">{s.symptom}</h3>
          <p className="text-sm text-gray-500 mb-2">
            <strong>Source:</strong> {s.source}
          </p>

          {s.causes && (
            <div className="mb-2">
              <strong>Possible Causes:</strong>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                {s.causes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {s.actions && (
            <div className="mb-2">
              <strong>Recommended Actions:</strong>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                {s.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {s.action && (
            <div className="mb-2">
              <strong>Recommended Actions:</strong>
              <ul className="list-disc list-inside ml-4 text-gray-700">
                {s.action.map((a, i) => (
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