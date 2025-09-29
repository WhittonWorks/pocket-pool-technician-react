import React, { useState } from "react";

function FlowRunner({ flow }) {
  const [currentNode, setCurrentNode] = useState(flow.start);
  const [history, setHistory] = useState([]);
  const node = flow.nodes[currentNode];

  function goTo(next) {
    if (!next) return;
    setHistory([...history, currentNode]);
    setCurrentNode(next);
  }

  function resetFlow() {
    setCurrentNode(flow.start);
    setHistory([]);
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{flow.title}</h2>

      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <p className="mb-4 text-gray-800">{node.text}</p>

        {/* Yes/No Input */}
        {node.input === "yesno" && (
          <div className="space-x-2">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => goTo(node.pass)}
            >
              ✅ Yes
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => goTo(node.fail)}
            >
              ❌ No
            </button>
          </div>
        )}

        {/* Number Input */}
        {node.input === "number" && (
          <div>
            <input
              type="number"
              className="border p-2 rounded w-32 mr-2"
              placeholder={`Enter ${node.unit || "value"}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = parseFloat(e.target.value);
                  if (
                    val >= node.range[0] &&
                    val <= node.range[1]
                  ) {
                    goTo(node.pass);
                  } else {
                    goTo(node.fail);
                  }
                }
              }}
            />
            <p className="text-sm text-gray-500">
              Expected: {node.range[0]}–{node.range[1]} {node.unit}
            </p>
          </div>
        )}

        {/* Choice Input */}
        {node.input === "choice" && (
          <div className="space-y-2">
            {Object.entries(node.choices).map(([label, next]) => (
              <button
                key={label}
                className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => goTo(next)}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Info Node */}
        {node.input === "info" && (
          <div>
            <p className="text-gray-700 mb-3">
              ℹ️ {node.text}
            </p>
            {!node.terminal && (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => goTo(node.pass)}
              >
                Continue →
              </button>
            )}
          </div>
        )}

        {/* Terminal Node */}
        {node.terminal && (
          <p
            className={`mt-4 font-bold ${
              node.success ? "text-green-600" : "text-red-600"
            }`}
          >
            {node.text}
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-2">
        {history.length > 0 && (
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => {
              const prev = history.pop();
              setCurrentNode(prev);
              setHistory([...history]);
            }}
          >
            ← Back
          </button>
        )}
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          onClick={resetFlow}
        >
          🔄 Restart
        </button>
      </div>
    </div>
  );
}

export default FlowRunner;