// src/Layout.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FeedbackButton from "./components/ui/FeedbackButton";
import { useFlow } from "./context/FlowContext";
import useUser from "./hooks/useUser";
import { logout } from "./firebase/auth"; // ✅ import logout function

function Layout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isFlowActive } = useFlow();
  const user = useUser();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isHome = location.pathname === "/" && !isFlowActive && isMobile;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* 🧭 Debug */}
      {console.log("🧭 Route:", location.pathname, "| Flow Active:", isFlowActive)}

      {/* 📱 Mobile top bar */}
      {isMobile && (
        <header className="bg-gray-900 text-white flex items-center justify-between px-4 py-3">
          <span className="font-bold">CPT</span>

          <div className="flex items-center gap-2 text-sm">
            {user ? (
              <>
                <span className="truncate max-w-[100px] text-gray-300">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-400 underline hover:text-red-200"
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-blue-300 underline hover:text-blue-100"
              >
                Log in
              </button>
            )}
          </div>
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