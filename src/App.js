import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/common/Navbar';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';

// Admin Imports (adjusted to match the paths in your snippet)
import AdminRoute from './api/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './pages/CreateEvent';
// Make sure you created this layout file to hold your sidebar!
import AdminLayout from './components/admin/AdminLayout';
import EventForm from './pages/EventForm';
// Route guard for protected consumer pages
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Redirect logged-in users away from auth pages smartly
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    // If Admin logs in, send to dashboard. If normal user, send to home.
    return user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />;
  }
  return children;
};

// Wrapper to ensure Navbar ONLY shows on consumer pages
const ConsumerLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const AppRoutes = () => (
  <Routes>
    {/* --- ADMIN ROUTES (No Navbar, uses Admin Sidebar Layout) --- */}
    <Route element={<AdminRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Map BOTH routes to the unified EventForm */}
        <Route path="/admin/events/new" element={<EventForm />} />
        <Route path="/admin/events/edit/:id" element={<EventForm />} />
      </Route>
    </Route>

    {/* --- CONSUMER ROUTES (Uses standard Navbar) --- */}
    <Route element={<ConsumerLayout />}>
      <Route path="/" element={<EventListPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route
        path="/my-bookings"
        element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>}
      />
    </Route>

    {/* --- AUTH ROUTES (Clean layout) --- */}
    <Route
      path="/login"
      element={<PublicRoute><LoginPage /></PublicRoute>}
    />
    <Route
      path="/register"
      element={<PublicRoute><RegisterPage /></PublicRoute>}
    />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A24',
            color: '#F0F0F8',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
          duration: 4000,
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);

export default App;