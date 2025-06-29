import React, { useState } from 'react';
import Footer from '../components/Footer';
import './LoginPage.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <h2>Login to Your Account</h2>
          <form>
  <input type="email" placeholder="Email" required />
  <div className="password-field">
    <input
      type={showPassword ? 'text' : 'password'}
      placeholder="Password"
      required
    />
    <button
      type="button"
      className="toggle-password"
      onClick={() => setShowPassword((prev) => !prev)}
    >
      {showPassword ? 'Hide' : 'Show'}
    </button>
  </div>
  <button type="submit" className="btn-login">Login</button>
</form>

<div className="signup-link">
  <p>Don't have an account? <a href="/signup">Create an Account</a></p>
</div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
