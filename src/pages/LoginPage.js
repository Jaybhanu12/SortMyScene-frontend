import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((err) => ({ ...err, [e.target.name]: '' }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validate()) return;
  //   const result = await login(form);
  //   if (result.success) {
  //     toast.success('Welcome back!');
  //     navigate(from, { replace: true });
  //   } else {
  //     toast.error(result.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Call login from AuthContext
    const result = await login({ email: form.email, password: form.password });

    if (result.success) {
      toast.success('Welcome back!');

      // SMART REDIRECT: Send admins to the dashboard, users to the homepage
      if (result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      toast.error(result.message);
    }
  };

  const fillDemo = () => {
    setForm({ email: 'demo@sortmyscene.com', password: 'demo123456' });
    setErrors({});
  };

  return (
    <div className="auth-page">
      <div className="auth-card card slide-up">
        <div className="auth-card__header">
          <div className="auth-card__logo">🎟️</div>
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Sign in to manage your bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="form-error">⚠ {errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={`form-input ${errors.password ? 'form-input--error' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <span className="form-error">⚠ {errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
            {loading ? <><div className="spinner" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="divider">or</div>

        <button className="btn btn-secondary btn-full" onClick={fillDemo} type="button">
          🔑 Use demo account
        </button>

        <p className="auth-card__footer">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
