// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// ✅ Context Providers
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { FlowProvider } from "./context/FlowContext";

// ✅ Service Worker Registration (for offline + auto-update)
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// ✅ Bust browser cache for manifest/icons (ensures new icons and splash show)
const manifestLink = document.querySelector("link[rel='manifest']");
if (manifestLink) {
  manifestLink.href = `${manifestLink.href}?v=${Date.now()}`;
}

// ✅ Create React root
const root = ReactDOM.createRoot(document.getElementById("root"));

// ✅ Render application with both context providers
root.render(
  <React.StrictMode>
    <AppSettingsProvider>
      <FlowProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FlowProvider>
    </AppSettingsProvider>
  </React.StrictMode>
);

// ✅ Report performance metrics (optional)
reportWebVitals();

// ✅ Register the service worker for full offline support
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    console.log("♻️ New version available. Refreshing to update...");
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      window.location.reload();
    }
  },
  onSuccess: () => {
    console.log("✅ App cached for offline use — ready when you are!");
  },
});