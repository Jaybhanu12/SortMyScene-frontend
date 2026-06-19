import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginUser, registerUser } from '../api/authApi';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

const ACCESS_KEY = 'sms_access_token';
const REFRESH_KEY = 'sms_refresh_token';
const USER_KEY = 'sms_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Store BOTH tokens and the user
  const persistAuth = (accessToken, refreshToken, userData) => {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const res = await loginUser(credentials);
      // Accessing res.data.data because your backend wraps the payload in "data: result"
      const authData = res.data.data || res.data;
      persistAuth(authData.accessToken, authData.refreshToken, authData.user);
      
      // FIX: Return the user's role so LoginPage.js knows where to redirect them!
      return { success: true, role: authData.user.role }; 
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Login failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const res = await registerUser(formData);
      const authData = res.data.data || res.data;
      
      persistAuth(authData.accessToken, authData.refreshToken, authData.user);
      
      return { success: true, role: authData.user.role }; 
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Registration failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Tell the backend to blacklist the current access token and delete the refresh token
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API failed, forcing local logout.');
    } finally {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      window.location.href = '/login';
    }
  }, []);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};