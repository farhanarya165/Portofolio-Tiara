import { useEffect } from 'react';
import { auth } from '../utils/auth';
import Login from '../components/Login';
import AdminDashboard from '../components/AdminDashboard';

const Admin = () => {
  useEffect(() => {
    // Check authentication status on mount
    const isAuth = auth.isAuthenticated();
    console.log('🔐 Admin page - Authentication status:', isAuth);
  }, []);

  const isAuthenticated = auth.isAuthenticated();
  
  return isAuthenticated ? <AdminDashboard /> : <Login />;
};

export default Admin;