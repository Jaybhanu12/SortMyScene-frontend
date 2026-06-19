import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="spinner">Loading...</div>;

  // Check if they are logged in AND their role is admin
  if (isAuthenticated && user?.role === 'admin') {
    return <Outlet />; 
  }

  return <Navigate to="/" replace />;
};

export default AdminRoute;