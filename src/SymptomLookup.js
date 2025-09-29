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
    <div>
      <input
        type="text"
        placeholder="🔍 Search symptoms (e.g. 'low chlorine', 'no flow')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={inputStyle}
      />

      {query && filtered.length === 0 && (
        <p style={{ color: "red" }}>No symptoms found.</p>
      )}

      {filtered.map((s, idx) => (
        <div key={idx} style={cardStyle}>
          <h3>{s.symptom}</h3>
          <p>
            <strong>Source:</strong> {s.source}
          </p>
          {s.causes && (
            <>
              <strong>Possible Causes:</strong>
              <ul>
                {s.causes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </>
          )}
          {s.actions && (
            <>
              <strong>Recommended Actions:</strong>
              <ul>
                {s.actions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </>
          )}
          {s.action && (
            <>
              <strong>Recommended Actions:</strong>
              <ul>
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

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "12px",
  marginBottom: "10px",
  background: "#f9f9f9",
};

export default SymptomLookup;;