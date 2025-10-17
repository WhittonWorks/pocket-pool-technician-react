import React, { useState, useEffect } from "react";
import FeedbackModal from "../ui/FeedbackModal";
import AppSettings from "../../config/appSettings";
import { jandy as serialJandy } from "../../tools/serial";
import { jandy as modelJandy } from "../../tools/model";
import { evaluateLogic } from "../../engine/flowEngine";
import { useFlow } from "../../context/FlowContext";

// 🧠 Merge helper: unify serial + model data into one equipment object
function mergeEquipmentInfo(serialInfo, modelInfo) {
  return {
    brand: "Jandy",
    equipmentType: "Heater",
    model: modelInfo?.model || null,
    revision: serialInfo?.revision || null,
    manufactureDate: serialInfo?.manufactureDate || null,
    plant: serialInfo?.plant || null,
    line: serialInfo?.line || null,
    unitNumber: serialInfo?.unitNumber || null,
    gasType: modelInfo?.gasType || null,
    btu: modelInfo?.btu || null,
    hasVersaFlo: modelInfo?.hasVersaFlo || false,
    exchanger: modelInfo?.exchanger || null,
    asme: modelInfo?.asme || false,
  };
}

function FlowRunner({ flow, onExit, onFinish, jumpTo, entryMode, errorCode }) {
  const { startFlow, endFlow } = useFlow();

  const [currentId, setCurrentId] = useState(flow.start);
  const [answers, setAnswers] = useState({ model: flow.model });
  const [history, setHistory] = useState([]);
  const [mediaToShow, setMediaToShow] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [numberInput, setNumberInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [pendingJump, setPendingJump] = useState(jumpTo || null);

  const current = flow.nodes[currentId];

  // 🔵 Trigger global "flow active" state
  useEffect(() => {
    startFlow(flow.title || "Active Flow");
    console.log("🟦 FlowRunner mounted — LoadBar ON");

    return () => {
      endFlow();
      console.log("⬜ FlowRunner unmounted — LoadBar OFF");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🧭 Handle auto-routing info-only nodes
  useEffect(() => {
    if (current?.input === "info" && Array.isArray(current.logic) && current.logic.length > 0) {
      const nextNode = evaluateLogic(current, answers);
      if (nextNode) goTo(nextNode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  // 🚀 Handle pending jump *after model verification*
  useEffect(() => {
    if (!pendingJump || !flow.nodes[pendingJump]) return;

    // Wait until we're past the model/serial entry screens
    if (["enter_model", "enter_serial"].includes(currentId)) return;

    console.log(`🚀 Executing scheduled jump to: ${pendingJump}`);
    goTo(pendingJump);
    setPendingJump(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, pendingJump]);

  if (!current) return <p className="text-red-600">⚠️ Invalid step or missing node.</p>;

  // 🧹 Reset UI states
  function resetLocalUI() {
    setSelectedChoice(null);
    setNumberInput("");
    setTextInput("");
    setMediaToShow(null);
  }

  // 🔀 Navigation helpers
  function goTo(nextId, value) {
    if (!flow.nodes[nextId]) return console.warn("❌ Invalid node:", nextId);

    setAnswers((prev) => (value !== undefined ? { ...prev, [currentId]: value } : prev));
    setHistory((prev) => [...prev, { id: currentId, selectedChoice, numberInput, textInput }]);
    setCurrentId(nextId);
    resetLocalUI();
  }

  function goBack() {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setCurrentId(last.id);
    setSelectedChoice(last.selectedChoice || null);
    setNumberInput(last.numberInput || "");
    setTextInput(last.textInput || "");
    setHistory((h) => h.slice(0, -1));
  }

  // ✅ Logic + input handlers
  function handleYesNo(nextId, value) {
    goTo(nextId, value);
  }

  function handleNumberNext() {
    const val = parseFloat(numberInput);
    if (isNaN(val)) return;
    const inRange = Array.isArray(current.range) && val >= current.range[0] && val <= current.range[1];
    const nextId = inRange ? current.pass : current.fail;
    if (nextId) goTo(nextId, val);
  }

  function processLogic() {
    const nextNode = evaluateLogic(current, answers);
    if (nextNode) {
      goTo(nextNode);
      return true;
    }
    return false;
  }

  // ⚙️ Info nodes
  function handleInfoNext() {
    if (processLogic()) return;

    if (current.terminal) {
      const finalAnswers = {
        ...answers,
        result: current.text,
        outcome: current.success ? "Success" : "Failure",
      };

      // Include jump metadata for error/symptom starts
      if (entryMode === "error_jump") {
        finalAnswers.entryMode = "error_jump";
        finalAnswers.errorCode = errorCode || "Unknown";
        finalAnswers.startNode = pendingJump || currentId;
      }

      try {
        if (typeof onFinish === "function") onFinish(finalAnswers);
      } catch (err) {
        console.error("⚠️ Error during onFinish:", err);
      }

      if (AppSettings.FEEDBACK_MODAL_ENABLED) {
        setShowFeedback(true);
      } else {
        onExit?.();
      }
    } else if (current.pass) goTo(current.pass);
  }

  // 🧠 Text handler — model/serial decoding + jump prep
  function handleTextNext() {
    const val = textInput.trim();
    if (!val) return;
    const upperVal = val.toUpperCase();
    setAnswers((prev) => ({ ...prev, [currentId]: upperVal }));

    // SERIAL ENTRY
    if (currentId === "enter_serial") {
      const info = serialJandy.decodeJandyJxiSerial(upperVal);
      if (!info.valid) {
        if (current.default) return goTo(current.default, upperVal);
        return;
      }

      console.log("🧠 Serial decoded:", info);
      const merged = mergeEquipmentInfo(info, answers.modelInfo);
      setAnswers((prev) => ({ ...prev, serialInfo: info, equipmentInfo: merged }));

      // Choose flow start depending on revision
      if (info.revision === "Rev G or earlier") return goTo("rev_g_start", upperVal);
      if (info.revision === "Rev H or newer") return goTo("rev_h_start", upperVal);
    }

    // MODEL ENTRY
    if (currentId === "enter_model") {
      const info = modelJandy.decodeJandyJxiModel(upperVal);
      if (!info.valid) {
        if (current.default) return goTo(current.default, upperVal);
        return;
      }

      console.log("✅ Model verified:", info.model);
      const merged = mergeEquipmentInfo(answers.serialInfo, info);
      setAnswers((prev) => ({ ...prev, modelInfo: info, equipmentInfo: merged }));

      // If a jump target exists, hold it until after serial
      if (pendingJump && flow.nodes[pendingJump]) {
        console.log(`🧩 Model verified — preparing to jump to "${pendingJump}" after serial entry`);
        return goTo("enter_serial", upperVal);
      }

      // Default path
      return goTo("enter_serial", upperVal);
    }

    if (processLogic()) return;
    if (current.default) goTo(current.default, upperVal);
  }

  // 💬 Feedback handling
  function handleFeedbackSubmit() {
    alert("✅ Feedback received — thank you for helping us improve the Compact Pool Technician!");
    setShowFeedback(false);
    onExit?.();
  }

  // ---------------- UI ----------------
  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      <h3 className="font-bold mb-3">{current.text}</h3>

      {/* MEDIA */}
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

      {/* CHOICE */}
      {current.input === "choice" && (
        <div className="mb-2">
          {Object.entries(current.choices).map(([label]) => {
            const active = selectedChoice === label;
            return (
              <button
                key={label}
                onClick={() => setSelectedChoice(label)}
                className={`block w-full text-left p-2 mb-2 border rounded ${
                  active ? "bg-green-200 border-green-500" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            );
          })}
          <button
            onClick={() => goTo(current.choices[selectedChoice], selectedChoice)}
            disabled={!selectedChoice}
            className={`w-full px-4 py-2 mt-2 rounded text-white ${
              selectedChoice
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-300 cursor-not-allowed"
            }`}
          >
            ➡️ Next
          </button>
        </div>
      )}

      {/* NUMBER */}
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
            ➡️ Next
          </button>
        </div>
      )}

      {/* YES/NO */}
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

      {/* TEXT */}
      {current.input === "text" && (
        <div className="mb-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="border p-2 rounded w-full mb-2"
            placeholder={
              currentId === "enter_model"
                ? "Enter model number (e.g., JXI400NK)"
                : "Enter serial number (e.g., B12AE5678)"
            }
          />
          <button
            onClick={handleTextNext}
            className="w-full px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
          >
            ➡️ Next
          </button>
        </div>
      )}

      {/* INFO */}
      {current.input === "info" && (
        <button
          onClick={handleInfoNext}
          className="w-full px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
        >
          ➡️ Next
        </button>
      )}

      {/* NAVIGATION */}
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

      {/* MEDIA PREVIEW */}
      {mediaToShow && (
        <div id="media-section" className="mt-6">
          {mediaToShow === "image" && current.media?.image && (
            <img
              src={current.media.image}
              alt="Step illustration"
              className="max-w-full rounded border"
              onLoad={() =>
                document.getElementById("media-section")?.scrollIntoView({ behavior: "smooth" })
              }
            />
          )}
          {mediaToShow === "video" && current.media?.video && (
            <video
              src={current.media.video}
              controls
              className="max-w-full rounded border"
              onLoadedData={() =>
                document.getElementById("media-section")?.scrollIntoView({ behavior: "smooth" })
              }
            />
          )}
        </div>
      )}

      {/* FEEDBACK */}
      {showFeedback && (
        <FeedbackModal
          visible={showFeedback}
          onClose={() => {
            setShowFeedback(false);
            onExit?.();
          }}
          onSubmit={handleFeedbackSubmit}
          brand={flow.brand || "Unknown"}
          equipmentType={flow.equipmentType || "Unknown"}
          model={flow.model || "Unknown"}
          outcome={answers.outcome || "Unknown"}
        />
      )}
    </div>
  );
}

export default FlowRunner;
