import React from "react";
import axios from "axios";
import AuthForm from "./AuthForm";
import { useAuth } from "../context/AuthContext";

// use environment-based backend URL
const API = process.env.REACT_APP_API_URL;

export default function AuthModal({ mode = "login", onClose }) {
  const { login } = useAuth();

  const handleLogin = async (formData) => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      const { user, token } = res.data;

      login(user, token);
      onClose();

      if (user.role === "farmer") window.location.href = "/farmer/dashboard";
      else window.location.href = "/customer/dashboard";

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleRegister = async (formData) => {
    try {
      const res = await axios.post(`${API}/api/auth/register`, formData);
      alert(res.data.message || "Registered successfully. Please login.");
      onClose();

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const onSubmit = mode === "register" ? handleRegister : handleLogin;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all duration-300 ease-out"
        role="dialog"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === "register" ? "Sign up" : "Sign in"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <AuthForm isRegister={mode === "register"} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
