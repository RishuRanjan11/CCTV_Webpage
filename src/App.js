import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel';
import Products from './components/Products';
import About from './components/About';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';           // ✅ ADD THIS
import { CartProvider } from './context/CartContext';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

function App() {
  return (
    <>
      {/* Social Links */}
      <div className="social-links top-links">
        <a href="https://www.instagram.com/"><img src="https://img.icons8.com/color/30/instagram.png" alt="Instagram" /></a>
        <a href="#"><img src="https://img.icons8.com/color/30/facebook-new.png" alt="Facebook" /></a>
      </div>
      <div className="social-links bottom-links">
        <a href="https://wa.me/+916203108650"><img src="https://img.icons8.com/color/30/whatsapp.png" alt="WhatsApp" /></a>
        <a href="tel:+911234567890"><img src="https://img.icons8.com/color/30/phone.png" alt="Call" /></a>
      </div>

      <CartProvider>
        <Navbar />

        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <>
                <Carousel />
                <Products />
                <About />
                <Footer />
              </>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cart" element={<CartPage />} />      {/* ✅ YOUR NEW CART PAGE */}
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>

        <Footer />
      </CartProvider>
    </>
  );
}

export default App;
