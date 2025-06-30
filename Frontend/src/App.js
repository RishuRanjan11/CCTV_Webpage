import React, { useEffect } from 'react';
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
import './App.css';
import SignupPage from './pages/SignupPage';
import { useUserStore } from "./stores/useUserStore";

function App() {
  const checkAuth = useUserStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
        {/* About Route */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage/>}/>
      </Routes>
    </>
  );
}

export default App;
