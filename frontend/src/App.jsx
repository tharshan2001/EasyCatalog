import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import ProductsPage from "./Pages/ProductPage.jsx";
import Home from "./components/Home.jsx";
import ProductListAdmin from "./components/admin/ProductListAdmin.jsx";
import DashboardPage from "./Pages/DashboardPage.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin-protected routes with layout */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductListAdmin />} />
            {/* Add more admin pages here */}
          </Route>
          <Route path="/cat" element={<ProductsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
