import React, { useState, useEffect } from "react";

function FlowRunner({ flow }) {
  const STORAGE_KEY = "ppt-active-flow";

  // Load saved state if exists
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  const [currentId, setCurrentId] = useState(saved.currentId || flow.start);
  const [history, setHistory] = useState(saved.history || []);
  const [value, setValue] = useState("");
  const [log, setLog] = useState(saved.log || []);

  const node = flow.nodes[currentId];

  // Save state on every change
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentId,
        history,
        log,
      })
    );
  }, [currentId, history, log]);

  function addLog(answer) {
    const entry = {
      stepId: currentId,
      question: node.text,
      input: node.input,
      answer,
      timestamp: new Date().toISOString(),
    };
    setLog([...log, entry]);
  }

  function goNext(nextId, answer) {
    if (!nextId) return;
    addLog(answer);
    setHistory([...history, currentId]);
    setCurrentId(nextId);
    setValue("");
  }

  function goBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentId(prev);
  }

  function resetFlow() {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentId(flow.start);
    setHistory([]);
    setLog([]);
    setValue("");
  }

  function downloadLog() {
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${flow.id || "ppt-flow-log"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!node) {
    return <div className="text-red-600">⚠️ Flow error: node “{currentId}” not found.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{flow.title}</h2>
      <p className="text-lg">{node.text}</p>

      {/* number input */}
      {node.input === "number" && (
        <div className="space-y-2">
          <input
            type="number"
            value={value}
            placeholder={node.unit ? `Enter value (${node.unit})` : "Enter value"}
            onChange={(e) => setValue(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {node.range && (
            <small className="block text-gray-600">
              Expected: {node.range[0]}–{node.range[1]} {node.unit || ""}
            </small>
          )}
          <button
            onClick={() => {
              const num = parseFloat(value);
              if (isNaN(num) || !node.range) return;
              const [min, max] = node.range;
              goNext(num >= min && num <= max ? node.pass : node.fail, num);
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}

      {/* yes/no as buttons */}
      {node.input === "yesno" && (
        <div className="flex gap-4">
          <button
            onClick={() => goNext(node.pass, "Yes")}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Yes
          </button>
          <button
            onClick={() => goNext(node.fail, "No")}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            No
          </button>
        </div>
      )}

      {/* choice as buttons */}
      {node.input === "choice" && node.choices && (
        <div className="flex flex-col gap-2">
          {Object.keys(node.choices).map((label) => (
            <button
              key={label}
              onClick={() => goNext(node.choices[label], label)}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* info / terminal */}
      {node.input === "info" && (
        <div className="p-3 rounded">
          <p>{node.text}</p>
          {node.terminal && (
            node.success ? (
              <p className="text-green-600 font-bold">✅ Success: It Works!</p>
            ) : (
              <p className="text-red-600 font-bold">❌ Failure: Lets Fix The Problem!</p>
            )
          )}
          <div className="mt-4">
            <h3 className="font-bold">Step Log:</h3>
            <ul className="list-disc pl-6 text-sm">
              {log.map((entry, idx) => (
                <li key={idx}>
                  <strong>{entry.question}</strong> → {entry.answer} (
                  {new Date(entry.timestamp).toLocaleTimeString()})
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={resetFlow}
              className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-800"
            >
              Start Over
            </button>
            <button
              onClick={downloadLog}
              className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Download Log (JSON)
            </button>
          </div>
        </div>
      )}

      {/* Back button */}
      {history.length > 0 && (
        <button
          onClick={goBack}
          className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
        >
          ← Back
        </button>
      )}
    </div>
  );
}

export default FlowRunner;