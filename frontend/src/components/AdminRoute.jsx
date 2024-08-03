import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  console.log('AdminRoute user:', user); // Debug log

  if (loading) return <div>Loading...</div>;

  return user && user.isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
