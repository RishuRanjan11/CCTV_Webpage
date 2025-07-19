import React, { useEffect, useState } from "react";
import "./SignupPage.css";
import Footer from "../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useOtpStore } from "../stores/useOtpStore";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();
  const [tokenValid, setTokenValid] = useState(null);
  useEffect(() => {
    if (!token) return; // ✅ Avoid running when token is undefined

    const validateToken = async () => {
      try {
        const res = await axios.get(`/auth/validate-reset-token/${token}`);
        setTokenValid(res.data.valid); // or just: setTokenValid(true);
      } catch (err) {
        console.error("Token validation failed:", err);
        setTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Clear error
    setError("");

    // Here you would send data to backend
    try {
      const res = await axios.post(`/auth/reset-password/${token}`, {
        newPassword: formData.password,
      });
      toast.success(res.data.message || "Password reset successful");
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  if (tokenValid === null) return <p>🔄 Validating token...</p>;
  if (!tokenValid) return <p>❌ Token is invalid or expired.</p>;

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Reset Password</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div className="show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />{" "}
            Show Passwords
          </div>

          <button type="submit" className="btn-signup">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
