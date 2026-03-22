import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore.js";

const AdminRoute = () => {
  const { user, fetchMe, loading } = useAuthStore();
  const [initialized, setInitialized] = useState(false); // track fetchMe completion

  useEffect(() => {
    const init = async () => {
      await fetchMe(); // fetch user from API
      setInitialized(true); // mark as done
    };

    if (!initialized) {
      init();
    }
  }, [initialized, fetchMe]);

  // Show loading while fetching user
  if (!initialized || loading) {
    return (
      <div className="text-center mt-10 text-sm text-slate-500">
        Authenticating...
      </div>
    );
  }

  // redirect if not authenticated or not admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  // render child routes
  return <Outlet />;
};

export default AdminRoute;