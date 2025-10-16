// src/context/AppSettingsContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AppSettings from "../config/appSettings";

// Create a React Context
const AppSettingsContext = createContext();

// Provider component that wraps the app
export function AppSettingsProvider({ children }) {
  // Load defaults from config
  const [settings, setSettings] = useState({
    theme: AppSettings.theme || "light",
    colorScheme: AppSettings.colorScheme || "blue",
    feedbackEnabled: AppSettings.enableFeedback ?? true,
    version: AppSettings.version || "1.0.0",
  });

  // Optional: persist settings (e.g. dark/light mode) in localStorage
  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  // Restore settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  // Helper function to update a specific setting
  function updateSetting(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <AppSettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

// Custom hook for components to use settings easily
export function useAppSettings() {
  return useContext(AppSettingsContext);
}