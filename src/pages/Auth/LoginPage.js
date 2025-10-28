// src/pages/Auth/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🔑 Login submitted", form);
    navigate("/"); // In future: go to dashboard or profile
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">🔑 Log In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="p-2 border rounded" />
        <button type="submit" className="bg-gray-800 text-white py-2 rounded hover:bg-gray-900">
          Log In
        </button>
        <button type="button" onClick={() => navigate("/signup")} className="text-sm underline text-gray-500">
          Need an account? Sign up →
        </button>
      </form>
    </div>
  );
};

export default LoginPage;