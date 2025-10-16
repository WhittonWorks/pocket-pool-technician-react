// src/components/ui/LoadBar.jsx
import React, { useEffect, useState } from "react";

/**
 * 💡 LoadBar — Minimal progress indicator
 * - No numbers or percentage
 * - Moves pixel-by-pixel until complete
 * - Automatically loops until hidden
 */
export default function LoadBar({ active }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    let animation;
    function animate() {
      setProgress((prev) => {
        const next = prev + Math.random() * 2; // small random speed for realism
        return next >= 100 ? 0 : next;
      });
      animation = requestAnimationFrame(animate);
    }

    animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, [active]);

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