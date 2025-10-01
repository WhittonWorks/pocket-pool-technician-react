import React, { useState } from "react";

function FlowRunner({ flow, onExit }) {
  const [currentId, setCurrentId] = useState(flow.start);
  const [answers, setAnswers] = useState({});
  const [mediaToShow, setMediaToShow] = useState(null);

  const current = flow.nodes[currentId];

  function handleNext(nextId, value) {
    if (value !== undefined) {
      setAnswers((prev) => ({ ...prev, [currentId]: value }));
    }
    if (flow.nodes[nextId]) {
      setCurrentId(nextId);
      setMediaToShow(null); // reset media when advancing
    }
  }

  if (!current) return <p>⚠️ Invalid step.</p>;

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      {/* Step text */}
      <h3 className="font-bold mb-2">{current.text}</h3>

      {/* Media buttons */}
      {current.media && (
        <div className="mb-4">
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

      {/* Input handling */}
      {current.input === "choice" &&
        Object.entries(current.choices).map(([label, nextId]) => (
          <button
            key={label}
            onClick={() => handleNext(nextId, label)}
            className="block w-full text-left p-2 mb-2 border rounded bg-green-100 hover:bg-green-200"
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
              e.target.value = ""; // clear after submit
            }}
          />
        </div>
      )}

      {current.input === "info" && (
        <button
          onClick={() =>
            current.terminal ? onExit?.() : handleNext(current.pass)
          }
          className="block w-full p-2 mb-2 border rounded bg-green-100 hover:bg-green-200"
        >
          ➡️ Next
        </button>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() =>
            Object.entries(flow.nodes).find(
              ([, n]) => n.pass === currentId || n.fail === currentId
            )?.[0] && setCurrentId(
              Object.entries(flow.nodes).find(
                ([, n]) => n.pass === currentId || n.fail === currentId
              )[0]
            )
          }
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          ⬅️ Back
        </button>
        <button
          onClick={() => onExit?.()}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          ⏹ Exit
        </button>
      </div>

      {/* Media at bottom */}
      {mediaToShow && (
        <div id="media-section" className="mt-6">
          {mediaToShow === "image" && current.media.image && (
            <img
              src={current.media.image}
              alt="Step illustration"
              className="max-w-full rounded border"
              onLoad={() =>
                document
                  .getElementById("media-section")
                  .scrollIntoView({ behavior: "smooth" })
              }
            />
          )}
          {mediaToShow === "video" && current.media.video && (
            <video
              src={current.media.video}
              controls
              className="max-w-full rounded border"
              onLoadedData={() =>
                document
                  .getElementById("media-section")
                  .scrollIntoView({ behavior: "smooth" })
              }
            />
          )}
        </div>
      )}
    </div>
  );
}

export default FlowRunner;