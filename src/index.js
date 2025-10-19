// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ✅ Context Providers
import { AppSettingsProvider } from './context/AppSettingsContext';
import { FlowProvider } from './context/FlowContext';

// ✅ Enable full PWA offline caching & auto-update
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// ✅ Force browsers to refresh the manifest & icons (cache buster)
const manifestLink = document.querySelector("link[rel='manifest']");
if (manifestLink) {
  manifestLink.href = `${manifestLink.href}?v=${Date.now()}`;
}

// ✅ Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// ✅ Render app wrapped in both providers
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

// ✅ Performance monitoring (optional)
reportWebVitals();

// ✅ Register service worker for offline caching
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    console.log('♻️ New version available. Refresh to update.');
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
  onSuccess: () => {
    console.log('✅ Content cached for offline use.');
  }
});