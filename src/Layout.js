import React from "react";

function Layout({ sidebar, children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          background: "#222",
          color: "#fff",
          padding: 16,
          boxSizing: "border-box",
        }}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: 24,
          background: "#f5f5f5",
          overflow: "auto",
          boxSizing: "border-box",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default Layout;