import React, { useState, useEffect } from "react";

function Layout({ sidebar, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Keep track of resize events so it adapts
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Mobile top bar */}
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

      {/* Sidebar */}
      {(menuOpen || !isMobile) && (
        <aside className="w-full md:w-64 bg-gray-900 text-white p-4">
          {sidebar}
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 p-4 bg-gray-100 overflow-auto">{children}</main>
    </div>
  );
}

export default Layout;