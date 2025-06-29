import React from 'react';
import './ContactPage.css';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p>Have questions or need assistance? We're here to help you secure your space.</p>
      </header>

      <div className="contact-container">
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input type="tel" placeholder="Your Phone Number" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button><br /><br />
        </form>

        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p><strong>Address:</strong><br />
            Saguna More, Balaji Nagar, New Tarachak, Danapur Nizamat, Patna, Bihar 801503</p>
          <p><strong>Email:</strong><br />
            <a href="mailto:digitalsurveillance93@gmail.com">digitalsurveillance93@gmail.com</a></p>
          <p><strong>Phone:</strong><br />
            <a href="tel:+917488900700">+91 7488900700</a></p>
          <p><strong>WhatsApp:</strong><br />
            <a href="https://wa.me/916203108650">+91 6203108650</a></p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
