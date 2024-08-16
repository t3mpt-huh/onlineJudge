import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  console.log('PrivateRoute user:', user); // Debug log

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/notsignedin" />;
};

export default PrivateRoute;
