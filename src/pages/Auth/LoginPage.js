// src/pages/Auth/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginWithEmail,
  loginWithGoogle,
  loginWithApple,
} from "../../firebase/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Log In</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Log In
        </button>
      </form>

      <div className="mt-4 space-y-2">
        <button
          onClick={async () => {
            try {
              await loginWithGoogle();
              navigate("/");
            } catch (err) {
              setError(err.message);
            }
          }}
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
        Don't have an account?{" "}
        <button className="underline text-blue-600" onClick={() => navigate("/signup")}>
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginPage;