// src/config/branding.js
// 🧩 Global company identity config for Compact Pool Technician
// Future-ready for multiple profiles, white-labeling, and auto-branding.

const branding = {
  // --- Core Identity ---
  companyName: "Your Pool Company, LLC",
  tagline: "Professional Pool Service & Diagnostics",
  address: "123 Main Street\nAnytown, USA 12345",
  phone: "(555) 555-5555",
  email: "info@yourpoolcompany.com",
  website: "www.yourpoolcompany.com",

  // --- Visual Branding (for future UI + PDF theming) ---
  logo: "/assets/logos/default-logo.png", // leave blank or replace later
  colors: {
    primary: "#0B73FF",     // accent (buttons, highlights)
    secondary: "#FFD300",   // alternate accent
    background: "#F8F9FA",  // light background
    text: "#212529",        // default text
  },
  fonts: {
    header: "Helvetica",    // can be replaced by branding-specific fonts
    body: "Helvetica",
  },

  // --- Legal / Footer Info ---
  copyright: "© 2025 Your Pool Company — Compact Pool Technician",
  disclaimer:
    "Diagnostic results are based on field observations and may vary by equipment condition or site installation.",

  // --- Future Use (for dynamic business profiles) ---
  profiles: {
    // Example placeholders; can be expanded later
    WhittonWorks: {
      companyName: "Whitton Works, LLC",
      tagline: "Trusted Pool Repair & Diagnostics",
      address: "3811 Poverty Creek Rd\nCrestview, FL 32539",
      phone: "(850) 428-2186",
      email: "Whittonworksllc@gmail.com",
      website: "WhittonWorks.net",
      logo: "/assets/logos/whittonworks.png",
      colors: {
        primary: "#0B73FF",
        secondary: "#FFD300",
        background: "#F9FAFB",
        text: "#333333",
      },
      copyright: "© 2025 Whitton Works — Compact Pool Technician",
    },
  },

  // --- Active profile (can be changed dynamically later) ---
  activeProfile: "WhittonWorks",
};

export default branding;