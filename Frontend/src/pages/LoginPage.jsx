import React, { useState } from "react";
import Footer from "../components/Footer";
import "./LoginPage.css";
import { useUserStore } from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useUserStore();
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    login({ email, password }, navigate);
  };
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <h2>Login to Your Account</h2>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" required />
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button type="submit" className="btn-login">
              Login
            </button>
          </form>

          <div className="signup-link">
            <p>
              Don't have an account? <Link to="/signup">Create an Account</Link>
            </p>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
