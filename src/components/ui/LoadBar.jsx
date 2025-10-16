// src/components/ui/LoadBar.jsx
import React, { useEffect, useState } from "react";
import { useFlow } from "../../context/FlowContext"; // ✅ pull flow activity globally

/**
 * 💡 LoadBar — Persistent global progress indicator
 * - Auto-shows whenever a flow is active
 * - No numbers or percentage
 * - Moves pixel-by-pixel for subtle motion
 */
export default function LoadBar() {
  const { isFlowActive } = useFlow(); // 👈 read global state
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isFlowActive) {
      setProgress(0);
      return;
    }

    let animation;
    const animate = () => {
      setProgress((prev) => {
        const next = prev + Math.random() * 2; // small random speed for realism
        return next >= 100 ? 0 : next;
      });
      animation = requestAnimationFrame(animate);
    };

    animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, [isFlowActive]);

  // Hide bar completely when inactive
  if (!isFlowActive) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "4px",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#0B73FF", // Whitton Works Blue
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}