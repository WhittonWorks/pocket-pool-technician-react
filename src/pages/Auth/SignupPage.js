// src/pages/Auth/SignupPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    business: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📝 Signup submitted", form);
    navigate("/login"); // Eventually redirect to dashboard or home
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">🆕 Create Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required className="p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="p-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="p-2 border rounded" />
        <input name="business" placeholder="Business Name (optional)" value={form.business} onChange={handleChange} className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
        <button type="button" onClick={() => navigate("/login")} className="text-sm underline text-gray-500">
          Already have an account? Log in →
        </button>
      </form>
    </div>
  );
};

export default SignupPage;