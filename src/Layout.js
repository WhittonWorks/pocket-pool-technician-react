// src/Layout.js
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FeedbackButton from "./components/ui/FeedbackButton";
import LoadBar from "./components/ui/LoadBar";
import { useFlow } from "./context/FlowContext"; // ✅ NEW — connects to global flow state

function Layout({ sidebar, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ✅ Default to false
  const location = useLocation();
  const { isFlowActive } = useFlow(); // ✅ watch global flow activity

  // 📱 Responsive resize listener (safe)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // ✅ Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen flex-col md:flex-row relative">
      {/* 🔵 Load bar — now tied to global flow activity */}

      {/* 🧭 Debug info */}
      {console.log("🧭 Current route:", location.pathname, "| Flow Active:", isFlowActive)}

      {/* 🧭 Mobile top bar */}
      {isMobile && (
        <header className="bg-gray-900 text-white flex items-center justify-between px-4 py-3">
          <span className="font-bold">PPT</span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
          >
            {menuOpen ? "Close Menu" : "Menu"}
          </button>
        </header>
      )}

      {/* 📋 Sidebar */}
      {(menuOpen || !isMobile) && (
        <aside className="w-full md:w-64 bg-gray-900 text-white p-4">
          {sidebar}
        </aside>
      )}

      {/* 🧩 Main content area */}
      <main className="flex-1 p-4 bg-gray-100 overflow-auto relative">
        {children}
      </main>

      {/* 💬 Global Feedback Button */}
      <FeedbackButton />
    </div>
  );
}

export default Layout;