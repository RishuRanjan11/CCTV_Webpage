import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <img
            src="/images/logo.png"
            alt="Brand Logo"
            className="footer-logo"
          />
          <p>
            Trusted CCTV suppliers providing premium surveillance equipment
            across the country. Protecting spaces with quality and reliability
            — for homes, offices, and institutions alike!
          </p>
        </div>

        <div className="footer-section">
          <h5>Contact Info</h5>
          <p><strong>Address:</strong><br />
            Saguna More, Balaji Nagar, New Tarachak, Danapur Nizamat, Patna, Danapur, Bihar 801503
          </p>
          <p><strong>Email:</strong> <a href="mailto:digitalsurveillance93@gmail.com">digitalsurveillance93@gmail.com</a></p>
          <p><strong>Phone:</strong> <a href="tel:+917488900700">+917488900700</a></p>
        </div>

        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/services">Services</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Get In Touch</h5>
          <form>
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
            <input type="tel" placeholder="Phone Number" required />
            <textarea placeholder="Message" required rows="3"></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <hr />
      <div className="footer-bottom">
        © 2025 CCTV Digital Surveillance. All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
