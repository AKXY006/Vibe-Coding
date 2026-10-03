// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    login(email, password);
    navigate('/');
  };

  const handleDemoFill = () => {
    setEmail('gourmet.diner@savoria.com');
    setPassword('Savoria123');
    setErrors({});
    showToast('Demo credentials filled!', 'info');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Utensils size={26} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Savoria diner account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              type="email"
              id="login-email"
              className="form-input"
              placeholder="e.g. alexander@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="auth-error-msg">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="auth-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <div className="auth-error-msg">{errors.password}</div>}
          </div>

          {/* Demo Quick Fill */}
          <button
            type="button"
            className="demo-fill-btn"
            onClick={handleDemoFill}
          >
            ⚡ Click here to quick-fill demo account
          </button>

          <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: '0.5rem' }}>
            <LogIn size={18} />
            <span>Sign In</span>
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account yet?
          <Link to="/register">Create an Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
