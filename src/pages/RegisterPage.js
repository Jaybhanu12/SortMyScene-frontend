import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient'; // IMPORTED APICLIENT
import './AuthPage.css';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', otp: '' });
  const [errors, setErrors] = useState({});
  
  // States for Inline OTP Management
  const [otpSent, setOtpSent] = useState(false);
  const [otpHashData, setOtpHashData] = useState(null); 
  const [otpUIError, setOtpUIError] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim().match(/^\S+@\S+\.\S+$/)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!isEmailVerified) e.email = 'Please verify your email first';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((err) => ({ ...err, [e.target.name]: '' }));
    setOtpUIError(''); // Clear OTP error on typing
  };

  // Triggered when user clicks "Send OTP" or "Resend"
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!form.email.trim().match(/^\S+@\S+\.\S+$/)) {
      setErrors({ ...errors, email: 'Enter a valid email first' });
      return;
    }

    setSendingOtp(true);
    setOtpUIError('');
    
    try {
      // USING apiClient.post WITH .trim()
      const response = await apiClient.post('/auth/send-otp', {
        email: form.email.trim()
      });
      
      const data = response.data.data || response.data;
      
      setOtpHashData({ hash: data.hash, expiresAt: data.expiresAt });
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to send OTP';
      setErrors({ ...errors, email: errorMsg });
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Triggered when user clicks the small green "Verify" button
  const handleInlineVerify = (e) => {
    e.preventDefault();
    if (!form.otp || form.otp.trim().length < 6) {
      setOtpUIError('Please enter the 6-digit OTP');
      return;
    }
    // Visually mark as verified so they can submit the form
    setIsEmailVerified(true);
    setOtpUIError('');
    toast.success('Looks good! Complete your form.');
  };

  // Final Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Pass the sanitized inputs and secure hash back to AuthContext
    const result = await register({ 
      name: form.name.trim(), 
      email: form.email.trim(), 
      password: form.password,
      otp: form.otp.trim(),
      hash: otpHashData.hash,
      expiresAt: otpHashData.expiresAt
    });

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      // If backend says OTP is wrong/expired, reset the UI
      if (result.message.includes('OTP')) {
        setIsEmailVerified(false);
        setOtpUIError(result.message);
      } else {
        toast.error(result.message);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card slide-up">
        <div className="auth-card__header">
          <div className="auth-card__logo">🎟️</div>
          <h1 className="auth-card__title">Create account</h1>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" type="text" className="form-input" placeholder="Enter your full name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="form-error">⚠ {errors.name}</span>}
          </div>

          {/* Email with Inline OTP Logic */}
          <div className="form-group" style={{ marginBottom: otpSent ? '5px' : '15px' }}>
            <label className="form-label">Email</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                name="email" 
                type="email" 
                className={`form-input ${errors.email ? 'form-input--error' : ''}`} 
                placeholder="you@example.com" 
                value={form.email} 
                onChange={handleChange} 
                readOnly={otpSent} 
                style={{ flex: 1, backgroundColor: otpSent ? '#f5f5f5' : '#fff' }}
              />
              {!otpSent && (
                <button type="button" onClick={handleSendOtp} disabled={sendingOtp} className="btn" style={{ padding: '0 15px', backgroundColor: '#e0e0e0', color: '#333', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                  {sendingOtp ? '...' : 'Send OTP'}
                </button>
              )}
            </div>
            {errors.email && <span className="form-error">⚠ {errors.email}</span>}
          </div>

          {/* The Inline OTP Box */}
          {otpSent && !isEmailVerified && (
            <div style={{ backgroundColor: '#f9f9fa', padding: '12px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 10px 0' }}>Code sent to {form.email}. Expires in 2 min.</p>
              
              {otpUIError && (
                <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                  ⚠ {otpUIError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  name="otp" 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  maxLength="6"
                  value={form.otp} 
                  onChange={handleChange} 
                  style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', letterSpacing: '2px', textAlign: 'center' }}
                />
                
                <button type="button" onClick={handleInlineVerify} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', padding: '0 15px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Verify
                </button>
                
                <button type="button" onClick={handleSendOtp} disabled={sendingOtp} style={{ backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0 10px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Resend
                </button>
              </div>
            </div>
          )}

          {isEmailVerified && (
            <div style={{ color: '#10b981', fontSize: '0.9rem', marginBottom: '15px', fontWeight: 'bold' }}>
              ✅ Email Verified
            </div>
          )}

          {/* Passwords */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" value={form.password} onChange={handleChange} />
            {errors.password && <span className="form-error">⚠ {errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input name="confirm" type="password" className="form-input" value={form.confirm} onChange={handleChange} />
            {errors.confirm && <span className="form-error">⚠ {errors.confirm}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading || !isEmailVerified}>
            {loading ? <><div className="spinner" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login" className="text-accent">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;