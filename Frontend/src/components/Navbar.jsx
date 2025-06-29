import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg" style={{ background: '#0d1b2a' }}>
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    {/* ✅ DIRECTLY use the image path from the public directory */}
                    <img
                        src="/images/logo.png"
                        alt="Brand Logo"
                        style={{ height: '75px', width: 'auto' }}
                    />
                    <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', marginLeft: '10px' }}>
                        CCTV Digital Surveillance
                    </span>
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end nav-links" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        <li className="nav-item"><Link to="/" className="nav-link" style={{ color: '#fff' }}>Home</Link></li>
                        <li className="nav-item">
                            <Link to="/about" className="nav-link" style={{ color: '#fff' }}>About Us</Link>
                        </li>
                        <li className="nav-item"><Link to="/services" className="nav-link" style={{ color: '#fff' }}>Our Services</Link></li>
                        <li className="nav-item"><Link to="/products" className="nav-link" style={{ color: '#fff' }}>Products</Link></li>
                        <li className="nav-item"><Link to="/contact" className="nav-link" style={{ color: '#fff' }}>Contact Us</Link></li>
                        <li className="nav-item"><Link to="/login" className="nav-link" style={{ color: '#fff' }}>Login</Link></li>
                        <li className="nav-item"><Link to="/signup" className="nav-link" style={{ padding: '5px 15px', borderRadius: '30px', background: '#f0a500', color: '#0d1b2a' }}>Sign Up</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
