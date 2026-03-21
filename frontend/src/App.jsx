import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import ProductsPage from "./Pages/ProductsPage.jsx";

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
            <Route path="/products" element={<ProductsPage/>} />
            {/* Add more admin pages here */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;