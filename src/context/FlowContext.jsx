// src/context/FlowContext.jsx
import React, { createContext, useContext, useState } from "react";

// 💡 Global context for tracking when a diagnostic flow is active
const FlowContext = createContext();

export function FlowProvider({ children }) {
  const [isFlowActive, setIsFlowActive] = useState(false);
  const [activeFlowName, setActiveFlowName] = useState(null); // optional future use

  // Start a flow (e.g. when FlowRunner mounts)
  const startFlow = (name = null) => {
    console.log("🚀 Flow started", name ? `(${name})` : "");
    setIsFlowActive(true);
    if (name) setActiveFlowName(name);
  };

  // End a flow (e.g. when FlowRunner unmounts)
  const endFlow = () => {
    console.log("🏁 Flow ended");
    setIsFlowActive(false);
    setActiveFlowName(null);
  };

  return (
    <FlowContext.Provider
      value={{
        isFlowActive,
        activeFlowName,
        setIsFlowActive,
        startFlow,
        endFlow,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

// Hook used anywhere in the app to access flow state
export function useFlow() {
  return useContext(FlowContext);
}