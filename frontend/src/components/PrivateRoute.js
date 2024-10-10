import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext'; // Adjust the import path accordingly

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  // console.log(isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
