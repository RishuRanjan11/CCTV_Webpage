import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const ProtectedAdminRoute = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const checkingAuth = useUserStore((state) => state.checkingAuth);

  if (checkingAuth) {
    // You can replace this with a proper loading spinner component
    return <div>Loading...</div>;
  }

  // If auth check is done and there is no user, they should log in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but is not an admin, redirect to home page
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If user is an admin, render the protected component
  return children;
};

export default ProtectedAdminRoute;
