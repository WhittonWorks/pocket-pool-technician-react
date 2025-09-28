import React, { useState } from "react";

function Layout({ sidebar, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isMobile = window.innerWidth < 768; // crude check

  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: isMobile ? "column" : "row" }}>
      {/* Mobile top bar */}
      {isMobile && (
        <header
          style={{
            background: "#222",
            color: "#fff",
            padding: "10px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold" }}>PPT</span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "#444",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 4,
            }}
          >
            {menuOpen ? "Close Menu" : "Menu"}
          </button>
        </header>
      )}

      {/* Sidebar (desktop) or dropdown (mobile) */}
      {(menuOpen || !isMobile) && (
        <aside
          style={{
            width: isMobile ? "100%" : 240,
            background: "#222",
            color: "#fff",
            padding: 16,
            boxSizing: "border-box",
          }}
        >
          {sidebar}
        </aside>
      )}

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: 16,
          background: "#f5f5f5",
          overflow: "auto",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;