import React, { useState, useEffect } from "react";
import FeedbackModal from "../ui/FeedbackModal";
import AppSettings from "../../config/appSettings";
import { jandy as serialJandy } from "../../tools/serial";
import { jandy as modelJandy } from "../../tools/model";
import { evaluateLogic } from "../../engine/flowEngine";
import { useFlow } from "../../context/FlowContext";

// 🧠 Merge helper
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
  const [jumpPrepared, setJumpPrepared] = useState(false);

  const current = flow.nodes[currentId];

  useEffect(() => {
    startFlow(flow.title || "Active Flow");
    return () => endFlow();
  }, []);

  useEffect(() => {
    if (current?.input === "info" && Array.isArray(current.logic) && current.logic.length > 0) {
      const nextNode = evaluateLogic(current, answers);
      if (nextNode) goTo(nextNode);
    }
  }, [currentId]);

  useEffect(() => {
    if (!pendingJump || !flow.nodes[pendingJump]) return;

    if (jumpPrepared) {
      console.log(`🚀 Jumping directly to node: ${pendingJump}`);
      goTo(pendingJump);
      setPendingJump(null);
      setJumpPrepared(false);
    }
  }, [jumpPrepared, pendingJump]);

  function resetLocalUI() {
    setSelectedChoice(null);
    setNumberInput("");
    setTextInput("");
    setMediaToShow(null);
  }

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

  function handleInfoNext() {
    if (processLogic()) return;

    if (current.terminal) {
      const finalAnswers = {
        ...answers,
        result: current.text,
        outcome: current.success ? "Success" : "Failure",
      };

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

  function handleTextNext() {
    const val = textInput.trim().toUpperCase();
    if (!val) return;
    setAnswers((prev) => ({ ...prev, [currentId]: val }));

    if (currentId === "enter_model") {
      const info = modelJandy.decodeJandyJxiModel(val);
      if (!info.valid) {
        if (current.default) return goTo(current.default, val);
        return;
      }

      const merged = mergeEquipmentInfo(answers.serialInfo, info);
      setAnswers((prev) => ({ ...prev, modelInfo: info, equipmentInfo: merged }));

      if (pendingJump) {
        setJumpPrepared(true);
      }

      return goTo("enter_serial", val);
    }

    if (currentId === "enter_serial") {
      const info = serialJandy.decodeJandyJxiSerial(val);
      if (!info.valid) {
        if (current.default) return goTo(current.default, val);
        return;
      }

      const merged = mergeEquipmentInfo(info, answers.modelInfo);
      setAnswers((prev) => ({ ...prev, serialInfo: info, equipmentInfo: merged }));

      if (info.revision === "Rev G or earlier") return goTo("rev_g_start", val);
      if (info.revision === "Rev H or newer") return goTo("rev_h_start", val);
    }

    if (processLogic()) return;
    if (current.default) goTo(current.default, val);
  }

  function handleFeedbackSubmit() {
    alert("✅ Feedback received — thank you!");
    setShowFeedback(false);
    onExit?.();
  }

  if (!current) return <p className="text-red-600">⚠️ Invalid step or missing node.</p>;

  return (
    <div className="p-4 border rounded bg-white shadow text-gray-800">
      <h3 className="font-bold mb-3">{current.text}</h3>

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

      {current.input === "number" && (
        <div className="mb-2">
          <input
            type="number"
            value={numberInput}
            onChange={(e) => setNumberInput(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={handleNumberNext}
            className="w-full px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
          >
            ➡️ Next
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

      {current.input === "text" && (
        <div className="mb-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={handleTextNext}
            className="w-full px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
          >
            ➡️ Next
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

      {mediaToShow && (
        <div id="media-section" className="mt-6">
          {mediaToShow === "image" && current.media?.image && (
            <img
              src={current.media.image}
              alt="Step illustration"
              className="max-w-full rounded border"
            />
          )}
          {mediaToShow === "video" && current.media?.video && (
            <video
              src={current.media.video}
              controls
              className="max-w-full rounded border"
            />
          )}
        </div>
      )}

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