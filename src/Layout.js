import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FeedbackButton from "./components/ui/FeedbackButton";
import LoadBar from "./components/ui/LoadBar";

function Layout({ sidebar, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  // 📱 Responsive resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen flex-col md:flex-row relative">
      {/* 🔵 Persistent Load Bar — route debugger */}
      {(() => {
        console.log("🧭 Full path detected:", location.pathname);

        if (location.pathname.match(/flow/i)) {
          console.log("🚀 LoadBar should be visible now");
          return (
            <div className="fixed top-0 left-0 w-full z-50">
              <LoadBar />
              <div
                style={{
                  height: "6px",
                  width: "100%",
                  background: "red", // 🔴 debug: always visible if rendered
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 9999,
                }}
              ></div>
            </div>
          );
        }

        return null;
      })()}

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