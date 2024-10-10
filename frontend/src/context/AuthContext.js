import React, { createContext, useContext } from 'react';
import useAuth from '../hooks/useAuth'; // Adjust the path as needed

const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
