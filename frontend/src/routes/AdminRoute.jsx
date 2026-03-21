// src/routes/AdminRoute.jsx
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

const AdminRoute = () => {
  const { user, fetchMe, loading } = useAuthStore();

  // fetch user info on mount if not loaded
  useEffect(() => {
    if (!user) {
      fetchMe();
    }
  }, [user, fetchMe]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // redirect if not logged in or not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // render child routes
  return <Outlet />;
};

export default AdminRoute;