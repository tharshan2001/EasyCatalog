import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

// Pages & Components
import LoginPage from "./Pages/LoginPage.jsx";
import ProductsPage from "./Pages/ProductPage.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import DashboardPage from "./Pages/DashboardPage.jsx";
import ProductListAdmin from "./components/admin/ProductListAdmin.jsx";

const App = () => {
  return (
    <Router>
      {/* Global toast container */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cat" element={<ProductsPage />} />

        {/* Admin-protected routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductListAdmin />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
