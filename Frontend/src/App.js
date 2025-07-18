import { Routes, Route } from "react-router-dom";
import Carousel from "./components/Carousel";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import Products from "./components/Products";
import About from "./components/About";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import ProductsPage from "./pages/ProductsPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CartPage from "./pages/CartPage";
import MyAccount from "./pages/MyAccount";
import CheckoutPage from "./pages/CheckoutPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminCoupons from "./pages/Admin/AdminCoupons";
import AdminUsers from "./pages/Admin/AdminUsers";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
import "./App.css";
import { useUserStore } from "./stores/useUserStore";
import OtpVerification from "./components/OtpVerification";
import ForgetPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Layout component for customer-facing pages
const CustomerLayout = () => (
  <>
    <Navbar />
    <Outlet /> {/* Child routes will render here */}
    <Footer />
  </>
);

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
  }, [checkAuth]);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
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
      <Routes>
        {/* Customer Routes with shared layout */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-account"
            element={
              <ProtectedRoute>
                <MyAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn>
                <LoginPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/signup/verify"
            element={
              <RedirectIfLoggedIn>
                <>
                  <OtpVerification />
                </>
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfLoggedIn>
                <>
                  <SignupPage />
                </>
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <>
                <ForgetPassword />
              </>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <>
                <ResetPassword />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <CartPage />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                <CheckoutPage />
              </>
            }
          />
        </Route>

        {/* Admin Routes WITHOUT Customer Navbar/Footer */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedAdminRoute>
              <AdminProducts />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute>
              <AdminOrders />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/coupons"
          element={
            <ProtectedAdminRoute>
              <AdminCoupons />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute>
              <AdminUsers />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
