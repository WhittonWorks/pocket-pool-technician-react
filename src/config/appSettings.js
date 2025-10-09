// src/config/appSettings.js
// Centralized feature toggles and app metadata

const AppSettings = {
  // 🔧 Feature Toggles
  FEEDBACK_MODAL_ENABLED: true,      // Auto-show feedback after diagnostics
  SHOW_TUTORIAL_BUTTON: false,       // Future tutorial page toggle
  DEBUG_MODE: true,                  // Console logging for development
  ENABLE_LOGGING: true,              // Allow in-app diagnostic logs

  // 🧾 Version Info
  VERSION: "v1.0.0",
  BUILD_DATE: new Date().toISOString(),
};

export default AppSettings;