import React, { useState } from "react";
import Footer from "../components/Footer";
import "./LoginPage.css";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    try {
      const res = await axios.post("/auth/forgot-password", { email });

      toast.success(res.data.message || "Password reset link sent!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  };
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" required />
            <button type="submit" className="btn-login">
              Send Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
