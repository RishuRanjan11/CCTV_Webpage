import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Carousel from "./components/Carousel";
import HomePage from "./pages/HomePage";

import Products from "./components/Products";
import About from "./components/About";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ProductsPage from "./pages/ProductsPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import { CartProvider } from "./context/CartContext";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminCoupons from "./pages/Admin/AdminCoupons";
import AdminUsers from "./pages/Admin/AdminUsers";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import "./App.css";
import { useUserStore } from "./stores/useUserStore";
function App() {
  const checkAuth = useUserStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  const handleStorage = (event) => {
      if (event.key === "auth-sync") {
        checkAuth(); // re-check auth status when notified
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);
  return (
    <>
      {/* Social Links */}
      <div className="social-links top-links">
        <a href="https://www.instagram.com/">
          <img
            src="https://img.icons8.com/color/48/instagram-new--v1.png"
            alt="Instagram"
          />
        </a>
        <a href="https://www.facebook.com">
          <img
            src="https://img.icons8.com/fluency/48/facebook-new.png"
            alt="Facebook"
          />
        </a>
      </div>
      <div className="social-links bottom-links">
        <a href="https://wa.me/+916203108650">
          <img
            src="https://img.icons8.com/color/96/whatsapp--v1.png"
            alt="WhatsApp"
          />
        </a>
        <a href="tel:+916203108650">
          <img
            src="https://img.icons8.com/3d-fluency/94/phone.png"
            alt="Call"
          />
        </a>
      </div>

      <CartProvider>
        <Routes>
          {/* Customer Routes with Navbar and Footer */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HomePage />
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <AboutPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/products"
            element={
              <>
                <Navbar />
                <ProductsPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/services"
            element={
              <>
                <Navbar />
                <ServicesPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <ContactPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <LoginPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <Navbar />
                <SignupPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Navbar />
                <CartPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                <Navbar />
                <CheckoutPage />
                <Footer />
              </>
            }
          />

          {/* Admin Routes WITHOUT Customer Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </CartProvider>
    </>
  );
}

export default App;
