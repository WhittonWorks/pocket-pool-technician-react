import React, { useState } from "react";

function FlowRunner({ flow }) {
  const [currentId, setCurrentId] = useState(flow.start);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);

  const current = flow.nodes[currentId];

  function handleNext(value) {
    let nextId = null;

    if (current.input === "number") {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        if (num >= current.range[0] && num <= current.range[1]) {
          nextId = current.pass;
        } else {
          nextId = current.fail;
        }
      }
    } else if (current.input === "yesno") {
      nextId = value ? current.pass : current.fail;
    } else if (current.input === "choice") {
      nextId = current.choices[value];
    } else if (current.pass) {
      nextId = current.pass;
    }

    if (nextId) {
      setHistory([...history, currentId]);
      setCurrentId(nextId);
      setInput(""); // clear input after moving
    }
  }

  function handleBack() {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentId(prev);
      setInput("");
    }
  }

  function handleRestart() {
    setCurrentId(flow.start);
    setHistory([]);
    setInput("");
  }

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      <h2 className="text-xl font-bold mb-2">{flow.title}</h2>
      <p className="mb-4">{current.text}</p>

      {/* Input handling */}
      {current.input === "number" && (
        <div className="space-y-2">
          <input
            type="number"
            value={input || ""}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Enter value (${current.unit || ""})`}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={() => handleNext(parseFloat(input))}
            disabled={input === ""}
            className={`px-4 py-2 rounded ${
              input === ""
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            Next →
          </button>
        </div>
      )}

      {current.input === "yesno" && (
        <div className="space-x-2">
          <button
            onClick={() => handleNext(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            ✅ Yes
          </button>
          <button
            onClick={() => handleNext(false)}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            ❌ No
          </button>
        </div>
      )}

      {current.input === "choice" && (
        <div className="space-y-2">
          {Object.keys(current.choices).map((c) => (
            <button
              key={c}
              onClick={() => handleNext(c)}
              className="bg-blue-600 text-white px-4 py-2 rounded block w-full text-left"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {current.input === "info" && (
        <p className="text-gray-600 italic">ℹ️ {current.text}</p>
      )}

      {/* Terminal nodes */}
      {current.terminal && (
        <p
          className={`font-bold mt-4 ${
            current.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {current.success ? "✅ Success" : "❌ Failure"}
        </p>
      )}

      {/* Controls */}
      <div className="mt-6 space-x-2">
        <button
          onClick={handleBack}
          disabled={history.length === 0}
          className={`px-4 py-2 rounded ${
            history.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-600 text-white"
          }`}
        >
          ← Back
        </button>
        <button
          onClick={handleRestart}
          className="px-4 py-2 rounded bg-red-600 text-white"
        >
          🔄 Restart
        </button>
      </div>
    </div>
  );
}

export default FlowRunner;