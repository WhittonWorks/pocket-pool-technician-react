import Fuse from "fuse.js";

/**
 * Auto-import all JSON data from symptoms and errors folders
 */
const symptomCtx = require.context("../symptoms", false, /\.json$/);
const errorCtx = require.context("../errors", false, /\.json$/);

const rawSymptoms = symptomCtx.keys().map((key) => symptomCtx(key));
const rawErrors = errorCtx.keys().map((key) => errorCtx(key));

/**
 * Flatten symptom data so each individual symptom becomes a searchable entry
 */
function flattenSymptoms(rawData) {
  const flattened = [];

  rawData.forEach((file) => {
    if (!file.symptoms || !Array.isArray(file.symptoms)) return;

    file.symptoms.forEach((entry) => {
      const flow = entry.flowTarget || {};

      flattened.push({
        type: "symptom",
        symptom: entry.symptom,
        causes: entry.causes || [],
        actions: entry.actions || [],
        brand: flow.brand || file.brand || "",
        equipmentType: flow.equipmentType || "",
        model: flow.model || "",
        flowId: `${(flow.brand || file.brand || "unknown").toLowerCase()}-${(flow.equipmentType || "unknown").toLowerCase()}-${(flow.model || "unknown").toLowerCase()}`,
        startNode: flow.startNode || null,
        synonyms: [entry.symptom.toLowerCase()],
      });
    });
  });

  return flattened;
}

const symptoms = flattenSymptoms(rawSymptoms);
const errors = rawErrors.map((e) => ({
  type: "error",
  ...e,
  synonyms: e.synonyms || [e.description?.toLowerCase(), e.code?.toLowerCase()].filter(Boolean),
}));

/**
 * SymptomLinkEngine
 * Handles fuzzy lookup for both symptom and error data.
 */
function createSymptomLinkEngine() {
  const dataset = [...symptoms, ...errors];

  const fuse = new Fuse(dataset, {
    keys: ["symptom", "description", "synonyms"],
    includeScore: true,
    threshold: 0.4,
  });

  function findMatch(input) {
    if (!input || input.trim().length === 0) return null;

    const results = fuse.search(input);
    if (!results || results.length === 0) return null;

    // Group results by flowId
    const grouped = {};
    results.forEach((r) => {
      const item = r.item;
      if (!grouped[item.flowId]) grouped[item.flowId] = [];
      grouped[item.flowId].push(item);
    });

    const keys = Object.keys(grouped);
    if (keys.length === 1) return grouped[keys[0]][0];
    return keys.map((key) => grouped[key][0]);
  }

  return { findMatch };
}

export default createSymptomLinkEngine;
