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
