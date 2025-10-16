// src/engine/flowEngine.js
// ------------------------------------------------------------
// 💡 FlowEngine — centralized logic router for all diagnostic flows
// Handles branching by model, serial, gas type, revision, etc.
// Fully sandboxed, safe, and supports compound logic:
//  - && (AND), || (OR), ! (NOT)
//  - String checks (startsWith, includes)
//  - Numeric comparisons (> < >= <= ==)
// ------------------------------------------------------------

import { jandy as serialJandy } from "../tools/serial";
import { jandy as modelJandy } from "../tools/model";

export default function createFlowEngine() {
  console.log("✅ FlowEngine initialized");

  // 🔹 Decode model + serial and merge metadata
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

  // ------------------------------------------------------------
  // 🧠 Safe evaluator for logic rules
  // Supports:
  //  - value.startsWith('...')
  //  - value.includes('...')
  //  - answers.modelInfo.gasType === '...'
  //  - answers.serialInfo.revision.includes('...')
  //  - value > / < / >= / <= / ==
  //  - Compound logic with &&, ||, and !
  // ------------------------------------------------------------
  function safeEvaluate(condition, answers = {}, value = "") {
    try {
      const ctx = {
        answers,
        value:
          typeof value === "string"
            ? value.trim().toUpperCase()
            : String(value || "").toUpperCase(),
      };

      console.log("🧩 [safeEvaluate] Testing condition:", {
        condition,
        value: ctx.value,
        answers: ctx.answers,
      });

      // Split compound logic (&&, ||)
      const parts = condition.split(/\s*(&&|\|\|)\s*/);
      let result = null;
      let operator = null;

      for (const part of parts) {
        if (part === "&&" || part === "||") {
          operator = part;
          continue;
        }

        const subResult = evaluateSingle(part, ctx);
        console.log("   ↳ Subcondition:", part, "=>", subResult);

        if (result === null) {
          result = subResult;
        } else if (operator === "&&") {
          result = result && subResult;
        } else if (operator === "||") {
          result = result || subResult;
        }
      }

      console.log("✅ [safeEvaluate] Final result:", result);
      return result;
    } catch (err) {
      console.error("⚠️ [safeEvaluate] Error evaluating:", condition, err);
      return false;
    }
  }

  // 🔍 Helper — evaluate a single expression safely
  function evaluateSingle(expression, ctx) {
    expression = expression.trim();

    // Handle NOT (!) prefix
    let negate = false;
    if (expression.startsWith("!")) {
      negate = true;
      expression = expression.slice(1).trim();
    }

    const numValue = parseFloat(ctx.value);
    const isNum = !isNaN(numValue);

    const checks = [
      // String conditions
      {
        regex: /^value\.startsWith\(['"]([^'"]+)['"]\)/,
        test: (m) => ctx.value.startsWith(m[1].toUpperCase()),
      },
      {
        regex: /^value\.includes\(['"]([^'"]+)['"]\)/,
        test: (m) => ctx.value.includes(m[1].toUpperCase()),
      },
      {
        regex: /^answers\.modelInfo\.gasType\s*===\s*['"]([^'"]+)['"]/,
        test: (m) => ctx.answers?.modelInfo?.gasType === m[1],
      },
      {
        regex: /^answers\.serialInfo\.revision\.includes\(['"]([^'"]+)['"]\)/,
        test: (m) => ctx.answers?.serialInfo?.revision?.includes(m[1]),
      },

      // Numeric comparisons
      { regex: /value\s*>\s*(-?\d+(\.\d+)?)/, test: (m) => isNum && numValue > parseFloat(m[1]) },
      { regex: /value\s*<\s*(-?\d+(\.\d+)?)/, test: (m) => isNum && numValue < parseFloat(m[1]) },
      { regex: /value\s*>=\s*(-?\d+(\.\d+)?)/, test: (m) => isNum && numValue >= parseFloat(m[1]) },
      { regex: /value\s*<=\s*(-?\d+(\.\d+)?)/, test: (m) => isNum && numValue <= parseFloat(m[1]) },
      { regex: /value\s*==\s*(-?\d+(\.\d+)?)/, test: (m) => isNum && numValue === parseFloat(m[1]) },
    ];

    for (const { regex, test } of checks) {
      const match = expression.match(regex);
      if (match) {
        const res = test(match);
        return negate ? !res : res;
      }
    }

    return false;
  }

  // ------------------------------------------------------------
  // 🔀 Determine next node in flow
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // 🤖 Auto-routing by brand/model metadata
  // ------------------------------------------------------------
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

  return { decodeEquipment, findNextNode, autoRoute, safeEvaluate };
}

// ------------------------------------------------------------
// ✅ External logic evaluator (for FlowRunner)
// ------------------------------------------------------------
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