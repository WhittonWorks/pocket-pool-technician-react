// src/pages/Auth/SignupPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signupWithEmail,
  loginWithGoogle,
  loginWithApple,
} from "../../firebase/auth";

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signupWithEmail(email, password);
      navigate("/"); // redirect to homepage
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAppleSignup = async () => {
    try {
      await loginWithApple();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Create an Account</h2>

      {error && (
        <p className="text-red-600 mb-4 text-sm text-center">{error}</p>
      )}

      <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>

      <div className="my-4 text-center text-gray-500">or</div>

      <button
        onClick={handleGoogleSignup}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 mb-2"
      >
        Continue with Google
      </button>

      <button
        onClick={handleAppleSignup}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Continue with Apple
      </button>
    </div>
  );
};

export default SignupPage;