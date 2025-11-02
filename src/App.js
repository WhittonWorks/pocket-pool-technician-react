// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import FlowRunner from "./components/containers/FlowRunner";
import FeedbackLog from "./components/containers/FeedbackLog";
import ManualsPage from "./pages/ManualsPage";
import HomeMenu from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";

import DiagnosticsPage from "./pages/DiagnosticsPage";
import ErrorPage from "./pages/ErrorPage";
import SymptomPage from "./pages/SymptomPage";

import errors from "./errors";
import symptoms from "./symptoms";
import { findFlow } from "./flows";
import createReportPDF from "./utils/pdf/createReportPDF";
import { auth, handleRedirectResult } from "./firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [brand, setBrand] = useState(null);
  const [equipmentType, setEquipmentType] = useState(null);
  const [model, setModel] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Auth check + redirect handling
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      console.log("👤 Firebase user:", user);

      await handleRedirectResult();

      if (sessionStorage.getItem("redirectLoginSuccess") === "true") {
        sessionStorage.removeItem("redirectLoginSuccess");
        navigate("/home");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // ✅ Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function resetToHome() {
    setBrand(null);
    setEquipmentType(null);
    setModel(null);
    sessionStorage.removeItem("jumpToNode");
  }

  return (
    <Routes>
      {/* 🔐 Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 📚 Manuals & Feedback */}
      <Route
        path="/manuals"
        element={
          <Layout>
            <ManualsPage />
          </Layout>
        }
      />
      <Route
        path="/feedback"
        element={
          <Layout>
            <FeedbackLog />
          </Layout>
        }
      />

      {/* ⚠️ Error Code Lookup */}
      <Route
        path="/errors"
        element={
          <Layout>
            <ErrorPage
              setBrand={setBrand}
              setEquipmentType={setEquipmentType}
              setModel={setModel}
            />
          </Layout>
        }
      />

      {/* 🤒 Symptom Lookup */}
      <Route
        path="/symptoms"
        element={
          <Layout>
            <SymptomPage
              setBrand={setBrand}
              setEquipmentType={setEquipmentType}
              setModel={setModel}
            />
          </Layout>
        }
      />

      {/* 🧠 Guided Diagnostics */}
      <Route
        path="/diagnostics"
        element={
          <Layout>
            <DiagnosticsPage
              findFlow={findFlow}
              jumpNode={sessionStorage.getItem("jumpToNode")}
              onFinish={(answers, flow) => createReportPDF(answers, flow)}
              onExit={resetToHome}
              brand={brand}
              equipmentType={equipmentType}
              model={model}
              setBrand={setBrand}
              setEquipmentType={setEquipmentType}
              setModel={setModel}
              isMobile={isMobile}
            />
          </Layout>
        }
      />

      {/* 🏠 Home & Landing */}
      <Route
        path="/home"
        element={
          <Layout>
            <HomeMenu />
          </Layout>
        }
      />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

export default App;