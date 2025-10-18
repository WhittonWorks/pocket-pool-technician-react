// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ✅ Context Providers
import { AppSettingsProvider } from './context/AppSettingsContext';
import { FlowProvider } from './context/FlowContext'; // <-- NEW import

// ✅ Force browsers to refresh the manifest & icons
const manifestLink = document.querySelector("link[rel='manifest']");
if (manifestLink) {
  manifestLink.href = `${manifestLink.href}?v=${Date.now()}`;
}
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* ✅ Wrap in both providers (AppSettings → Flow) */}
    <AppSettingsProvider>
      <FlowProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FlowProvider>
    </AppSettingsProvider>
  </React.StrictMode>
);

// Performance monitoring (optional)
reportWebVitals();
