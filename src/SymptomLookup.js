import React, { useState } from "react";
import symptoms from "./symptoms/general-symptoms.json"; // change to your actual file

function SymptomLookup() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  // Auto-suggest: filter symptoms by title or meaning
  const suggestions = symptoms.symptoms.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.meaning.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(symptom) {
    setSelected(symptom);
    setSearch(symptom.title); // autofill input
  }

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h2 className="text-xl font-bold mb-2">Symptom Lookup</h2>

      {/* Input */}
      <input
        type="text"
        placeholder="Enter symptom..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelected(null);
        }}
        className="border p-2 rounded w-full"
      />

      {/* Suggestions */}
      {search && suggestions.length > 0 && !selected && (
        <ul className="border rounded bg-white mt-1 shadow max-h-40 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s.id}
              onClick={() => handleSelect(s)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {s.title}
            </li>
          ))}
        </ul>
      )}

      {/* Result Card */}
      {selected && (
        <div className="mt-4 p-3 border rounded bg-white shadow">
          <h3 className="font-bold text-lg">{selected.title}</h3>
          <p><strong>Meaning:</strong> {selected.meaning}</p>
          {selected.fix && <p><strong>Fix:</strong> {selected.fix}</p>}
        </div>
      )}

      {/* No match */}
      {search && suggestions.length === 0 && !selected && (
        <p className="text-red-600 mt-4">❌ No matching symptom found.</p>
      )}
    </div>
  );
}

export default SymptomLookup;