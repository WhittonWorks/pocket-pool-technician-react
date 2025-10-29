// src/pages/Auth/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithApple,
  resendVerificationEmail,
} from "../../firebase/auth";
import { auth } from "../../firebase/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);
    try {
      const userCredential = await loginWithEmail(email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("⚠️ Please verify your email address before logging in.");
        setShowResend(true);
        await auth.signOut(); // Optional: auto-logout if unverified
        return;
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      await loginWithGoogle();
      if (!isMobile) navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerificationEmail();
      alert("✅ Verification email sent. Please check your inbox.");
    } catch (err) {
      setError("❌ Failed to resend verification email.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Log In</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {showResend && (
        <button onClick={handleResend} className="text-sm underline text-blue-600 mb-2">
          Resend Verification Email
        </button>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Log In
        </button>
      </form>

      <div className="mt-4 space-y-2">
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Continue with Google
        </button>

        <button
          onClick={async () => {
            try {
              await loginWithApple();
              navigate("/");
            } catch (err) {
              setError(err.message);
            }
          }}
          className="w-full bg-black text-white py-2 rounded"
        >
          Continue with Apple
        </button>
      </div>

      <p className="text-sm text-center mt-4">
        Don’t have an account?{" "}
        <button className="underline text-blue-600" onClick={() => navigate("/signup")}>
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginPage;