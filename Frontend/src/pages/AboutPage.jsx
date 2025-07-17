import React from 'react';
import './AboutPage.css';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="about-page">
      {/* Page Header */}
      <section className="about-header">
        <div className="about-header-content">
          <h1>About CCTV Digital Surveillance</h1>
          <p>Delivering Premium Surveillance Solutions Since 2015</p>
        </div>
      </section>

      {/* Company Mission Section */}
      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          At CCTV Digital Surveillance, our mission is to make every space safer.
          We supply premium quality surveillance equipment that empowers homes,
          businesses, and institutions with state-of-the-art security solutions. We
          are committed to reliability, service excellence, and seamless integration
          of security in your everyday life.
        </p>
      </section>

      {/* Company Story Section */}
      <section className="about-story">
        <h2>Our Story</h2>
        <p>
          Founded in 2015, CCTV Digital Surveillance started as a small team of passionate
          individuals dedicated to making a difference in the security industry. Today,
          we’ve evolved into one of the leading suppliers of surveillance equipment across
          the country, trusted by hundreds of businesses and homeowners alike.
        </p>
      </section>

      {/* Services Offered Section */}
      <section className="about-services">
        <h2>What We Offer</h2>
        <ul>
          <li>✅ High-Definition CCTV Cameras for Home and Business</li>
          <li>✅ Smart Surveillance Solutions</li>
          <li>✅ 24/7 Monitoring Services</li>
          <li>✅ Installation and Maintenance Services</li>
        </ul>
      </section>

      {/* Our Commitment Section */}
      <section className="about-commitment">
        <h2>Why Choose Us?</h2>
        <p>
          We combine quality, affordability, and trust. Our team is dedicated to providing
          the best CCTV and surveillance services available. Whatever your needs —
          from a single camera to a multi-site security setup — we have the experience
          and technology to help.
        </p>
      </section>

      {/* Contact CTA */}
      <section className="about-contact">
        <h2>Get In Touch</h2>
        <p>Have questions or need help? We’d love to hear from you!</p>
        <a href="/contact" className="about-contact-button">Contact Us</a>
      </section>
      
    </div>
  );
};

export default About;
