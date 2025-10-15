// src/engine/flowEngine.js
// ------------------------------------------------------------
// 💡 FlowEngine — centralized logic router for all diagnostic flows
// Handles branching by model, serial, gas type, revision, etc.
// Safe, extensible logic engine with no eval() use.
// Now supports numeric comparisons for advanced logic routing.
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
      // 🧩 Extend here later for Hayward, Pentair, etc.
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
   * 🧠 Safe evaluator for logic rules
   * Replaces eval() with a secure regex-based parser.
   * Supports:
   *  - value.startsWith('...')
   *  - value.includes('...')
   *  - answers.modelInfo.gasType === '...'
   *  - answers.serialInfo.revision.includes('...')
   *  - Numeric comparisons: value >, <, >=, <=
   */
  function safeEvaluate(condition, answers = {}, value = "") {
    try {
      const ctx = {
        answers,
        value:
          typeof value === "string"
            ? value.replaceAll('"', "")
            : String(value ?? ""),
      };

      // Handle numeric context (for number comparisons)
      const numValue = parseFloat(ctx.value);
      const isNum = !isNaN(numValue);

      // Supported pattern tests
      const checks = [
        // Gas type equality
        {
          regex: /answers\.modelInfo\.gasType\s*===\s*['"]([^'"]+)['"]/,
          test: (m) => ctx.answers?.modelInfo?.gasType === m[1],
        },
        // Serial revision includes
        {
          regex: /answers\.serialInfo\.revision\.includes\(['"]([^'"]+)['"]\)/,
          test: (m) => ctx.answers?.serialInfo?.revision?.includes(m[1]),
        },
        // String startsWith
        {
          regex: /value\.startsWith\(['"]([^'"]+)['"]\)/,
          test: (m) => ctx.value.startsWith(m[1]),
        },
        // String includes
        {
          regex: /value\.includes\(['"]([^'"]+)['"]\)/,
          test: (m) => ctx.value.includes(m[1]),
        },
        // --- Numeric comparisons ---
        { regex: /value\s*>\s*(-?\d+(\.\d+)?)/, test: (m) => isNum && numValue > parseFloat(m[1]) },
        { regex: /value\s*<\s*(-?\d+(\.\d+)?)/, test: (m) => isNum && numValue < parseFloat(m[1]) },
        { regex: /value\s*>=\s*(-?\d+(\.\d+)?)/, test: (m) => isNum && numValue >= parseFloat(m[1]) },
        { regex: /value\s*<=\s*(-?\d+(\.\d+)?)/, test: (m) => isNum && numValue <= parseFloat(m[1]) },
        { regex: /value\s*==\s*(-?\d+(\.\d+)?)/, test: (m) => isNum && numValue === parseFloat(m[1]) },
      ];

      for (const { regex, test } of checks) {
        const m = condition.match(regex);
        if (m && test(m)) return true;
      }

      return false;
    } catch (err) {
      console.error("⚠️ safeEvaluate error:", err, condition);
      return false;
    }
  }

  /**
   * Determine the correct next node in a flow.
   * Evaluates using safeEvaluate().
   */
  function findNextNode(logicArray, answers = {}, value = "") {
    if (!Array.isArray(logicArray)) return null;

    for (const rule of logicArray) {
      if (safeEvaluate(rule.if, answers, value)) {
        console.log(`➡️ FlowEngine matched rule: ${rule.if}`);
        return rule.goto;
      }
    }

    return null;
  }

  /**
   * High-level helper for automatic routing
   * (e.g., Rev G vs Rev H, NG vs LP)
   */
  function autoRoute(equipmentInfo) {
    if (!equipmentInfo) return null;

    if (equipmentInfo.brand === "Jandy" && /JXI/.test(equipmentInfo.model)) {
      if (equipmentInfo.revision?.includes("Rev G")) return "rev_g_start";
      if (equipmentInfo.revision?.includes("Rev H")) return "rev_h_start";
      if (equipmentInfo.gasType === "Natural Gas") return "rev_g_ng_pressure";
      if (equipmentInfo.gasType === "Propane") return "rev_g_lp_pressure";
    }

    return null;
  }

  return {
    decodeEquipment,
    findNextNode,
    autoRoute,
    safeEvaluate, // exported for internal tests
  };
}

/**
 * ✅ External entry point for FlowRunner and tests
 * Evaluates a single node’s logic block against answers/value.
 */
export function evaluateLogic(node, answers, value = "") {
  if (!node || !Array.isArray(node.logic)) return null;

  const engine = createFlowEngine();

  for (const rule of node.logic) {
    if (engine.safeEvaluate(rule.if, answers, value)) {
      console.log(`🧠 Logic match: ${rule.if} → ${rule.goto}`);
      return rule.goto;
    }
  }

  if (node.default) {
    console.log(`🔁 Default route → ${node.default}`);
    return node.default;
  }

  return null;
}
