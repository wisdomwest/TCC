import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../auth/AuthService';
import { jwtDecode } from 'jwt-decode';

const RoleBasedRoute = ({ children, requiredRole }) => {
  const currentUser = AuthService.getCurrentUser();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(currentUser.access_token);
    const userRole = decodedToken.role;
    
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/dashboard" />;
    }
    
    return children;
  } catch (error) {
    console.error('Error decoding token:', error);
    return <Navigate to="/login" />;
  }
};

export default RoleBasedRoute;