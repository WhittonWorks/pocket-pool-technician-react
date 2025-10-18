# Pocket Pool Technician (React Build)

**React-based diagnostic app for pool service technicians — JSON-driven, offline-ready, and built to scale across all pool equipment.**

---

## 📋 Overview
Pocket Pool Technician (PPT) is a diagnostic app designed for **pool service technicians**.  
This version is built in **React**, providing a modern, scalable foundation for growth.  

The app uses **JSON-driven diagnostic flows** to guide technicians step by step through troubleshooting pool equipment including:
- Heaters
- Pumps
- Automation systems
- Filters
- Water care systems
- Lighting

---

## 🚀 Features
- **JSON-driven flows** → Add new equipment by dropping in JSON files.  
- **Reusable React components** → Clean, modular codebase.  
- **Offline support (PWA)** → Works in backyards with no WiFi.  
- **Scalable structure** → Easy to expand for all brands/models.  
- **Future-ready** → Supports App Store/Google Play deployment with Capacitor.  

---

## 📂 Repository Structure

pocket-pool-technician-react/
├── public/                 # Static assets
├── src/                    # App source code
│   ├── flows/              # Guided diagnostic JSON files
│   ├── errors/             # Error code JSON files
│   ├── symptoms/           # Symptom JSON files
│   ├── templates/          # JSON templates (flows, errors, symptoms)
│   ├── App.js              # Main app component
│   ├── Layout.js           # Layout wrapper (sidebar + content)
│   ├── FlowRunner.js       # Handles step-by-step flows
│   ├── ErrorLookup.js      # Error code search
│   ├── SymptomLookup.js    # Symptom search
│   └── index.js            # React entry point
├── package.json
└── README.md

The `/templates` folder contains JSON examples for:
- **Flows** → structure for new guided troubleshooting trees.  
- **Errors** → structure for error code libraries.  
- **Symptoms** → structure for symptom-based troubleshooting.  

When adding new equipment support, copy the matching template, fill in details, and save to the appropriate folder.

---

## 📦 Tech Stack
- [React](https://react.dev/) (UI framework)  
- [TailwindCSS](https://tailwindcss.com/) (styling)  
- [Workbox](https://developer.chrome.com/docs/workbox) (service worker & offline caching)  
- [Capacitor](https://capacitorjs.com/) (for native app packaging — later phase)  

---

## 🛠️ Installation
1. Clone this repository:  
   ```bash
   git clone https://github.com/WhittonWorks/pocket-pool-technician-react.git
   cd pocket-pool-technician-react

	2.	Install dependencies:

npm install


	3.	Start the dev server:

npm start


	4.	Open http://localhost:3000 in your browser.

⸻

Getting Started with Create React App

This project was bootstrapped with Create React App.

Available Scripts

In the project directory, you can run:

npm start

Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

npm test

Launches the test runner in the interactive watch mode.
See the section about running tests for more information.

npm run build

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about deployment for more information.

npm run eject

Note: this is a one-way operation. Once you eject, you can’t go back!

If you aren’t satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except eject will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use eject. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

Learn More

You can learn more in the Create React App documentation.

To learn React, check out the React documentation.

Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

npm run build fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

---