import React, { useState } from "react";

function FlowRunner({ flow, onExit }) {
  const [currentId, setCurrentId] = useState(flow.start);
  const [answers, setAnswers] = useState({});
  const [inputValue, setInputValue] = useState(""); // ✅ for number inputs
  const [history, setHistory] = useState([]); // ✅ track step history

  const current = flow.nodes[currentId];

  function handleNext(nextId, value) {
    if (value !== undefined) {
      setAnswers((prev) => ({ ...prev, [currentId]: value }));
    }
    if (flow.nodes[nextId]) {
      setHistory((prev) => [...prev, currentId]); // push current step into history
      setCurrentId(nextId);
      setInputValue(""); // ✅ clear number input when moving forward
    }
  }

  function handleBack() {
    if (history.length > 0) {
      const prev = history[history.length - 1]; // last visited step
      setHistory((h) => h.slice(0, -1)); // remove it from history
      setCurrentId(prev);
    }
  }

  function handleExit() {
    if (window.confirm("Are you sure you want to exit this diagnostic flow?")) {
      onExit && onExit();
    }
  }

  if (!current) return <p>⚠️ Invalid step.</p>;

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      {/* 🔹 Step Text */}
      <h3 className="font-bold mb-2">{current.text}</h3>

      {/* 🔹 Choice Input */}
      {current.input === "choice" &&
        Object.entries(current.choices).map(([label, nextId]) => (
          <button
            key={label}
            onClick={() => handleNext(nextId, label)}
            className="block w-full text-left p-2 mb-2 border rounded bg-green-200 hover:bg-green-300"
          >
            {label}
          </button>
        ))}

      {/* 🔹 Yes/No Input */}
      {current.input === "yesno" && (
        <div>
          <button
            onClick={() => handleNext(current.pass, true)}
            className="block w-full p-2 mb-2 border rounded bg-green-200 hover:bg-green-300"
          >
            ✅ Yes
          </button>
          <button
            onClick={() => handleNext(current.fail, false)}
            className="block w-full p-2 mb-2 border rounded bg-red-200 hover:bg-red-300"
          >
            ❌ No
          </button>
        </div>
      )}

      {/* 🔹 Number Input with Next Button */}
      {current.input === "number" && (
        <div>
          <input
            type="number"
            className="border p-2 rounded w-full mb-2"
            placeholder={`Enter ${current.unit}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            onClick={() => {
              const val = parseFloat(inputValue);
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
            className="block w-full p-2 mb-2 border rounded bg-green-200 hover:bg-green-300"
          >
            ➡️ Next
          </button>
        </div>
      )}

      {/* 🔹 Info Input */}
      {current.input === "info" && (
        <button
          onClick={() =>
            current.terminal ? handleExit() : handleNext(current.pass)
          }
          className="block w-full p-2 mb-2 border rounded bg-green-200 hover:bg-green-300"
        >
          ➡️ Next
        </button>
      )}

      {/* 🔹 Navigation Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleBack}
          disabled={history.length === 0}
          className="flex-1 p-2 border rounded bg-yellow-200 hover:bg-yellow-300 disabled:bg-gray-300"
        >
          🔄 Back
        </button>
        <button
          onClick={handleExit}
          className="flex-1 p-2 border rounded bg-red-200 hover:bg-red-300"
        >
          ⏹ Exit
        </button>
      </div>
    </div>
  );
}

export default FlowRunner;