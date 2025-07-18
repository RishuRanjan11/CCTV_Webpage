import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const ProtectedRoute = ({ children }) => {
  const { user, checkingAuth } = useUserStore();

  if (checkingAuth) {
    // You can return a loading spinner or some text while checking auth
    return <div>Loading...</div>;
  }

  if (!user) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child component
  return children;
};

export default ProtectedRoute;

