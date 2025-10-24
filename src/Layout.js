import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FeedbackButton from "./components/ui/FeedbackButton";
import { useFlow } from "./context/FlowContext";

function Layout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { isFlowActive } = useFlow();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isHome = location.pathname === "/" && !isFlowActive && isMobile;

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* 🧭 Debug */}
      {console.log("🧭 Route:", location.pathname, "| Flow Active:", isFlowActive)}

      {/* 📱 Optional top bar (brand/logo) */}
      {isMobile && (
        <header className="bg-gray-900 text-white flex items-center justify-between px-4 py-3">
          <span className="font-bold">CPT</span>
        </header>
      )}

      {/* 🧩 Main content */}
      <main
        className={`flex-1 overflow-auto p-4 ${
          isHome ? "flex flex-col items-center justify-center text-center" : ""
        }`}
      >
        {children}
      </main>

      {/* 💬 Feedback */}
      <FeedbackButton />
    </div>
  );
}

export default Layout;