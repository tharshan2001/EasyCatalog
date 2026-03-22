import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

const AdminRoute = () => {
  const { user, fetchMe, loading } = useAuthStore();

  useEffect(() => {
    // fetch user if not loaded yet
    if (!user) {
      fetchMe();
    }
  }, [user, fetchMe]);

  // while checking auth, show loading
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // redirect if not authenticated or not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // render child routes
  return <Outlet />;
};

export default AdminRoute;