import createSymptomLinkEngine from "./engine/symptomLinkEngine";

const engine = createSymptomLinkEngine();

console.log("✅ SymptomLink Engine Ready");

const testTerms = ["low flow", "no heat", "ignition", "sensor"];

testTerms.forEach(term => {
  const result = engine.findMatch(term);
  console.log(`Search: "${term}" →`, result);
});
