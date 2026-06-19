import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">🎟️</span>
          <span className="navbar__name">SortMyScene</span>
        </Link>

        <div className={`navbar__links ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={`navbar__link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Events
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-bookings"
                className={`navbar__link ${isActive('/my-bookings') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                My Bookings
              </Link>
              <div className="navbar__user">
                <span className="navbar__user-name">{user?.name?.split(' ')[0]}</span>
                <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
