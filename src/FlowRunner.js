import React, { useState } from "react";

function FlowRunner({ flow }) {
  const [currentId, setCurrentId] = useState(flow.start);
  const [answers, setAnswers] = useState({});
  const current = flow.nodes[currentId];

  function handleNext(nextId, value) {
    if (value !== undefined) {
      setAnswers((prev) => ({ ...prev, [currentId]: value }));
    }
    if (flow.nodes[nextId]) {
      setCurrentId(nextId);
    }
  }

  if (!current) return <p>⚠️ Invalid step.</p>;

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      {/* 🔹 Media section (image/video) */}
      {current.media && (
        <div className="mb-4">
          {current.media.image && (
            <img
              src={current.media.image}
              alt="Step illustration"
              className="mb-2 max-w-full rounded border"
            />
          )}
          {current.media.video && (
            <video
              src={current.media.video}
              controls
              className="mb-2 max-w-full rounded border"
            />
          )}
        </div>
      )}

      {/* Step text */}
      <h3 className="font-bold mb-2">{current.text}</h3>

      {/* Input handling */}
      {current.input === "choice" &&
        Object.entries(current.choices).map(([label, nextId]) => (
          <button
            key={label}
            onClick={() => handleNext(nextId, label)}
            className="block w-full text-left p-2 mb-2 border rounded bg-gray-100 hover:bg-gray-200"
          >
            {label}
          </button>
        ))}

      {current.input === "yesno" && (
        <div>
          <button
            onClick={() => handleNext(current.pass, true)}
            className="block w-full p-2 mb-2 border rounded bg-green-100 hover:bg-green-200"
          >
            ✅ Yes
          </button>
          <button
            onClick={() => handleNext(current.fail, false)}
            className="block w-full p-2 mb-2 border rounded bg-red-100 hover:bg-red-200"
          >
            ❌ No
          </button>
        </div>
      )}

      {current.input === "number" && (
        <div>
          <input
            type="number"
            className="border p-2 rounded w-full mb-2"
            placeholder={`Enter ${current.unit}`}
            onBlur={(e) => {
              const val = parseFloat(e.target.value);
              if (
                !isNaN(val) &&
                val >= current.range[0] &&
                val <= current.range[1]
              ) {
                handleNext(current.pass, val);
              } else {
                handleNext(current.fail, val);
              }
            }}
          />
        </div>
      )}

      {current.input === "info" && (
        <button
          onClick={() =>
            current.terminal
              ? console.log("End of flow")
              : handleNext(current.pass)
          }
          className="block w-full p-2 mb-2 border rounded bg-blue-100 hover:bg-blue-200"
        >
          ➡️ Next
        </button>
      )}
    </div>
  );
}

export default FlowRunner;