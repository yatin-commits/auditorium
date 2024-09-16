import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import the custom useAuth hook

export function AdminRoute({ children }) {
  const { currentUser } = useAuth();

  // Admin email for validation
  const adminEmail = 'superadmin@bvicam.in';

  if (!currentUser) {
    // If no user is logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (currentUser.email !== adminEmail) {
    // If the logged-in user is not an admin, redirect to home or show an unauthorized page
    return <Navigate to="/unauthorized" />;
  }

  // If the user is the admin, allow them to access the admin panel
  return children;
}
