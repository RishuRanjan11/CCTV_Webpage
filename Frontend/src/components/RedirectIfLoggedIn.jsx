import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';

const RedirectIfLoggedIn = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const checkingAuth = useUserStore((state) => state.checkingAuth);

  if (checkingAuth) {
    // Show a loading state while we check for a user session
    return <div>Loading...</div>;
  }

  if (user) {
    // If a user is found, redirect them to the homepage
    return <Navigate to="/" replace />;
  }

  // If no user is logged in, render the requested page (e.g., Login or Signup)
  return children;
};

export default RedirectIfLoggedIn;

