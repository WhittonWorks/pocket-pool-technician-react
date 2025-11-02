// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import FlowRunner from "./components/containers/FlowRunner";
import FeedbackLog from "./components/containers/FeedbackLog";
import ErrorLookup from "./ErrorLookup";
import SymptomLookup from "./SymptomLookup";
import ManualsPage from "./pages/ManualsPage";
import HomeMenu from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import DiagnosticsPage from "./pages/DiagnosticsPage"; // ✅ NEW
import errors from "./errors";
import symptoms from "./symptoms";
import { findFlow } from "./flows";
import createReportPDF from "./utils/pdf/createReportPDF";

import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import { auth, handleRedirectResult } from "./firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Auth check + Google redirect handler
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      console.log("👤 Firebase user:", user);

      await handleRedirectResult();

      if (sessionStorage.getItem("redirectLoginSuccess") === "true") {
        sessionStorage.removeItem("redirectLoginSuccess");
        navigate("/home"); // ✅ Route to Home
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // ✅ Reset flow state
  function resetToHome() {
    sessionStorage.removeItem("jumpToNode");
    navigate("/home");
  }

  // ✅ Launch from symptom or error lookup
  function launchFlowFromSymptom(flowTarget) {
    if (!flowTarget) return alert("⚠️ Invalid data.");
    const { brand, equipmentType, model, startNode } = flowTarget;
    const flow = findFlow(brand, equipmentType, model);
    if (!flow) return alert("⚠️ Diagnostic flow not found.");
    sessionStorage.setItem("jumpToNode", startNode || "");
    navigate("/diagnostics?brand=" + brand + "&type=" + equipmentType + "&model=" + model);
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/manuals" element={<Layout><ManualsPage /></Layout>} />
      <Route path="/feedback" element={<Layout><FeedbackLog /></Layout>} />
      <Route
        path="/errors"
        element={
          <Layout>
            <ErrorLookup errors={errors} onSelectError={launchFlowFromSymptom} />
          </Layout>
        }
      />
      <Route
        path="/symptoms"
        element={
          <Layout>
            <SymptomLookup symptoms={symptoms} onSelectSymptom={launchFlowFromSymptom} />
          </Layout>
        }
      />
      <Route
        path="/diagnostics"
        element={
          <Layout>
            <DiagnosticsPage
              findFlow={findFlow}
              jumpNode={sessionStorage.getItem("jumpToNode")}
              onFinish={(answers, flow) => createReportPDF(answers, flow)}
              onExit={resetToHome}
            />
          </Layout>
        }
      />
      <Route path="/home" element={<Layout><HomeMenu /></Layout>} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;