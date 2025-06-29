import React from 'react';
import Carousel from '../components/Carousel';
import Products from '../components/Products';
import About from '../components/About';

function HomePage() {
  return (
    <>
      {/* Top Social Links */}
      <div className="social-links top-links">
        <a href="https://www.instagram.com/">
          <img src="https://img.icons8.com/color/30/instagram.png" alt="Instagram" />
        </a>
        <a href="#"><img src="https://img.icons8.com/color/30/facebook-new.png" alt="Facebook" /></a>
      </div>

      {/* Bottom Social Links */}
      <div className="social-links bottom-links">
        <a href="https://wa.me/+916203108650"><img src="https://img.icons8.com/color/30/whatsapp.png" alt="WhatsApp" /></a>
        <a href="tel:+911234567890"><img src="https://img.icons8.com/color/30/phone.png" alt="Call" /></a>
      </div>

      <h1>Welcome to CCTV Digital Surveillance</h1>
      <Carousel />
      <Products />
      <About />
    </>
  );
}

export default HomePage;
