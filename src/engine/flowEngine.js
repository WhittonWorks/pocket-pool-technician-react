// src/engine/flowEngine.js
// ------------------------------------------------------------
// 💡 FlowEngine — centralized logic router for all diagnostic flows
// Handles branching by model, serial, gas type, revision, etc.
// Future-proof for all brands: Jandy, Hayward, Pentair, etc.
// ------------------------------------------------------------

import { jandy as serialJandy } from "../tools/serial";
import { jandy as modelJandy } from "../tools/model";

export default function createFlowEngine() {
  console.log("✅ FlowEngine initialized");

  /**
   * Decode both model and serial numbers
   * and merge them into one normalized metadata object.
   */
  function decodeEquipment(brand, modelInput, serialInput) {
    const modelStr = modelInput?.trim()?.toUpperCase() || "";
    const serialStr = serialInput?.trim()?.toUpperCase() || "";

    let modelInfo = {};
    let serialInfo = {};

    switch (brand) {
      case "Jandy":
        modelInfo = modelJandy.decodeJandyJxiModel(modelStr);
        serialInfo = serialJandy.decodeJandyJxiSerial(serialStr);
        break;
      // 🧩 Add other brands here later
      default:
        console.warn(`⚠️ Unsupported brand: ${brand}`);
    }

    const equipmentInfo = {
      brand,
      model: modelInfo?.model || modelStr,
      revision: serialInfo?.revision || "Unknown",
      manufactureDate: serialInfo?.manufactureDate || "Unknown",
      gasType: modelInfo?.gasType || "Unknown",
      hasVersaFlo: modelInfo?.hasVersaFlo || false,
      btu: modelInfo?.btu || null,
      exchanger: modelInfo?.exchanger || null,
      asme: modelInfo?.asme || false,
    };

    return { modelInfo, serialInfo, equipmentInfo };
  }

  /**
   * Determine the correct next node in a flow.
   * Accepts a node’s logic array and the collected answers.
   */
  function findNextNode(logicArray, answers = {}) {
    if (!Array.isArray(logicArray)) return null;

    for (const rule of logicArray) {
      try {
        // Replace variables like "answers.modelInfo.gasType" dynamically
        // eslint-disable-next-line no-eval
        if (eval(rule.if)) {
          console.log(`➡️ FlowEngine matched rule: ${rule.if}`);
          return rule.goto;
        }
      } catch (err) {
        console.error("⚠️ FlowEngine logic error:", err, rule);
      }
    }

    return null;
  }

  /**
   * High-level helper for branching flows automatically
   * (e.g., route to NG vs LP, Rev G vs Rev H, etc.)
   */
  function autoRoute(equipmentInfo) {
    if (!equipmentInfo) return null;

    // Jandy JXi example
    if (equipmentInfo.brand === "Jandy" && /JXI/.test(equipmentInfo.model)) {
      if (equipmentInfo.revision?.includes("Rev G")) return "rev_g_start";
      if (equipmentInfo.revision?.includes("Rev H")) return "rev_h_start";

      if (equipmentInfo.gasType === "Natural Gas") return "rev_g_ng_pressure";
      if (equipmentInfo.gasType === "Propane") return "rev_g_lp_pressure";
    }

    // Default fallback
    return null;
  }

  return {
    decodeEquipment,
    findNextNode,
    autoRoute,
  };
}

/**
 * ✅ Evaluate logic for a node given the current answers.
 * This allows FlowRunner and other systems to run flow logic directly.
 */
export function evaluateLogic(node, answers) {
  if (!node || !Array.isArray(node.logic)) return null;

  for (const rule of node.logic) {
    try {
      // Use sandboxed Function for safety; supports e.g. "answers.modelInfo.gasType === 'Natural Gas'"
     // eslint-disable-next-line no-new-func
const fn = new Function("answers", `return ${rule.if}`); // safe: trusted internal JSON
      if (fn(answers)) {
        console.log(`🧠 Logic match: ${rule.if} → ${rule.goto}`);
        return rule.goto;
      }
    } catch (err) {
      console.error("⚠️ evaluateLogic error:", err, rule.if);
    }
  }

  if (node.default) {
    console.log(`🔁 Default route → ${node.default}`);
    return node.default;
  }

  return null;
}