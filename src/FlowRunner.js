import React, { useState } from "react";

function FlowRunner({ flow }) {
  const [currentId, setCurrentId] = useState(flow.start);
  const [answers, setAnswers] = useState({});
  const current = flow.nodes[currentId];
  const [tempValue, setTempValue] = useState(null); // for choice/number staging

  function handleNext(nextId, value) {
    if (value !== undefined) {
      setAnswers((prev) => ({ ...prev, [currentId]: value }));
    }
    if (flow.nodes[nextId]) {
      setCurrentId(nextId);
      setTempValue(null); // reset staging value
    }
  }

  function handleBack() {
    // just go to previous node in answers history
    const keys = Object.keys(answers);
    if (keys.length === 0) return;
    const prevId = keys[keys.length - 1];
    setCurrentId(prevId);
  }

  function handleExit() {
    setCurrentId(flow.start);
    setAnswers({});
    setTempValue(null);
  }

  if (!current) return <p>⚠️ Invalid step.</p>;

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      {/* 🔹 Media section */}
      {current.media ? (
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
      ) : null}

      {/* Step text */}
      <h3 className="font-bold mb-2">{current.text}</h3>

      {/* Choice input */}
      {current.input === "choice" && (
        <div>
          {Object.entries(current.choices).map(([label, nextId]) => (
            <button
              key={label}
              onClick={() => setTempValue({ nextId, label })}
              className={`block w-full text-left p-2 mb-2 border rounded ${
                tempValue?.label === label ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleBack}
              className="flex-1 p-2 rounded bg-yellow-500 text-white"
            >
              ⬅ Back
            </button>
            <button
              disabled={!tempValue}
              onClick={() => handleNext(tempValue.nextId, tempValue.label)}
              className={`flex-1 p-2 rounded ${
                tempValue ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
              } text-white`}
            >
              ✅ Next
            </button>
            <button
              onClick={handleExit}
              className="flex-1 p-2 rounded bg-red-600 text-white"
            >
              ⏹ Exit
            </button>
          </div>
        </div>
      )}

      {/* Yes/No input */}
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

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleBack}
              className="flex-1 p-2 rounded bg-yellow-500 text-white"
            >
              ⬅ Back
            </button>
            <button
              onClick={handleExit}
              className="flex-1 p-2 rounded bg-red-600 text-white"
            >
              ⏹ Exit
            </button>
          </div>
        </div>
      )}

      {/* Number input */}
      {current.input === "number" && (
        <div>
          <input
            type="number"
            className="border p-2 rounded w-full mb-2"
            placeholder={`Enter ${current.unit}`}
            value={tempValue ?? ""}
            onChange={(e) => setTempValue(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleBack}
              className="flex-1 p-2 rounded bg-yellow-500 text-white"
            >
              ⬅ Back
            </button>
            <button
              disabled={tempValue === null || tempValue === ""}
              onClick={() => {
                const val = parseFloat(tempValue);
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
              className={`flex-1 p-2 rounded ${
                tempValue ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
              } text-white`}
            >
              ✅ Next
            </button>
            <button
              onClick={handleExit}
              className="flex-1 p-2 rounded bg-red-600 text-white"
            >
              ⏹ Exit
            </button>
          </div>
        </div>
      )}

      {/* Info node */}
      {current.input === "info" && (
        <div className="flex gap-2">
          <button
            onClick={handleBack}
            className="flex-1 p-2 rounded bg-yellow-500 text-white"
          >
            ⬅ Back
          </button>
          <button
            onClick={() =>
              current.terminal
                ? console.log("End of flow")
                : handleNext(current.pass)
            }
            className="flex-1 p-2 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            ✅ Next
          </button>
          <button
            onClick={handleExit}
            className="flex-1 p-2 rounded bg-red-600 text-white"
          >
            ⏹ Exit
          </button>
        </div>
      )}
    </div>
  );
}

export default FlowRunner;