import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './admin.css'; 

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-wrapper">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          🎟️ SortMyScene
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin" end className="admin-nav-link">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            Dashboard
          </NavLink>
          <NavLink to="/admin/events/new" className="admin-nav-link">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Create Event
          </NavLink>
        </nav>

        <div className="admin-user-info">
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
            Logged in as
          </div>
          <div style={{ fontWeight: '600', marginBottom: '12px' }}>{user?.name}</div>
          <button 
            onClick={handleLogout} 
            style={{ width: '100%', padding: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>
            Admin Control Panel • v1.0
          </span>
        </header>

        {/* Dynamic Page Content Renders Here */}
        <div className="admin-content">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;