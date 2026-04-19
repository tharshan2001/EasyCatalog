import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

// Pages & Components
import LoginPage from "./Pages/LoginPage.jsx";
import ProductPage from "./Pages/ProductPage.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
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
        <Route path="/" element={<LoginPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/catalog" element={<ProductPage />} />

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/products" element={<ProductListAdmin />} />
            <Route path="/admin/categories" element={<CategoryListAdmin />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;