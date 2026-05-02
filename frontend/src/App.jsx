import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import PublicLayout from "./layout/PublicLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";

// Pages & Components
import LoginPage from "./Pages/LoginPage.jsx";
import ProductPage from "./Pages/ProductPage.jsx";
import AboutPage from "./Pages/AboutPage.jsx";
import ContactPage from "./Pages/ContactPage.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import DashboardPage from "./Pages/DashboardPage.jsx";
import ProductListAdmin from "./components/admin/ProductListAdmin.jsx";
import CategoryListAdmin from "./components/admin/CategoryListAdmin.jsx";

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000
        }}
      />

      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />

        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/catalog" element={<ProductPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/products" element={<ProductListAdmin />} />
            <Route path="/admin/categories" element={<CategoryListAdmin />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </Router>
  );
};

export default App;