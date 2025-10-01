import React, { useState } from "react";

function FlowRunner({ flow, onExit }) {
  const [currentId, setCurrentId] = useState(flow.start);
  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState([]); // back stack
  const [mediaToShow, setMediaToShow] = useState(null);

  // local UI state for choice/number
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [numberInput, setNumberInput] = useState("");

  const current = flow.nodes[currentId];
  if (!current) return <p>⚠️ Invalid step.</p>;

  function resetLocalUI() {
    setSelectedChoice(null);
    setNumberInput("");
    setMediaToShow(null);
  }

  function goTo(nextId, value) {
    setAnswers((prev) =>
      value !== undefined ? { ...prev, [currentId]: value } : prev
    );
    setHistory((prev) => [...prev, currentId]); // push current step
    setCurrentId(nextId);
    resetLocalUI();
  }

  function goBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentId(prev);
    resetLocalUI();
  }

  function handleYesNo(nextId, value) {
    goTo(nextId, value);
  }

  function handleNumberNext() {
    const val = parseFloat(numberInput);
    if (isNaN(val)) return;
    const inRange =
      Array.isArray(current.range) &&
      val >= current.range[0] &&
      val <= current.range[1];
    const nextId = inRange ? current.pass : current.fail;
    if (nextId) goTo(nextId, val);
  }

  function handleChoiceNext() {
    if (!selectedChoice) return;
    const nextId = current.choices[selectedChoice];
    if (nextId) goTo(nextId, selectedChoice);
  }

  function handleInfoNext() {
    if (current.terminal) {
      onExit?.();
    } else if (current.pass) {
      goTo(current.pass);
    }
  }

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      {/* Step text */}
      <h3 className="font-bold mb-3">{current.text}</h3>

      {/* See Photo / See Video buttons */}
      {current.media && (
        <div className="mb-3">
          {current.media.image && (
            <button
              onClick={() => setMediaToShow("image")}
              className="block w-full p-2 mb-2 border rounded bg-blue-100 hover:bg-blue-200"
            >
              📷 See Photo
            </button>
          )}
          {current.media.video && (
            <button
              onClick={() => setMediaToShow("video")}
              className="block w-full p-2 mb-2 border rounded bg-purple-100 hover:bg-purple-200"
            >
              🎥 See Video
            </button>
          )}
        </div>
      )}

      {/* Inputs */}
      {current.input === "choice" && (
        <div className="mb-2">
          {Object.entries(current.choices).map(([label]) => {
            const active = selectedChoice === label;
            return (
              <button
                key={label}
                onClick={() => setSelectedChoice(label)}
                className={`block w-full text-left p-2 mb-2 border rounded ${
                  active
                    ? "bg-green-200 border-green-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            );
          })}
          <button
            onClick={handleChoiceNext}
            disabled={!selectedChoice}
            className={`w-full px-4 py-2 mt-2 rounded text-white ${
              selectedChoice
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-300 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {current.input === "number" && (
        <div className="mb-2">
          <input
            type="number"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            className="border p-2 rounded w-full mb-2"
            placeholder={`Enter ${current.unit || "value"}`}
          />
          <button
            onClick={handleNumberNext}
            className="w-full px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
          >
            Next
          </button>
        </div>
      )}

      {current.input === "yesno" && (
        <div className="mb-2">
          <button
            onClick={() => handleYesNo(current.pass, true)}
            className="block w-full p-2 mb-2 border rounded bg-green-100 hover:bg-green-200"
          >
            ✅ Yes
          </button>
          <button
            onClick={() => handleYesNo(current.fail, false)}
            className="block w-full p-2 mb-2 border rounded bg-red-100 hover:bg-red-200"
          >
            ❌ No
          </button>
        </div>
      )}

      {current.input === "info" && (
        <button
          onClick={handleInfoNext}
          className="w-full px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
        >
          ➡️ Next
        </button>
      )}

      {/* Bottom nav */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={goBack}
          disabled={history.length === 0}
          className={`flex-1 px-4 py-2 rounded text-white ${
            history.length === 0
              ? "bg-yellow-300 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          ⬅️ Back
        </button>
        <button
          onClick={() => onExit?.()}
          className="flex-1 px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700"
        >
          ⏹ Exit
        </button>
      </div>

      {/* Media viewer */}
      {mediaToShow && (
        <div id="media-section" className="mt-6">
          {mediaToShow === "image" && current.media?.image && (
            <img
              src={current.media.image}
              alt="Step illustration"
              className="max-w-full rounded border"
              onLoad={() =>
                document
                  .getElementById("media-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            />
          )}
          {mediaToShow === "video" && current.media?.video && (
            <video
              src={current.media.video}
              controls
              className="max-w-full rounded border"
              onLoadedData={() =>
                document
                  .getElementById("media-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

export default FlowRunner;