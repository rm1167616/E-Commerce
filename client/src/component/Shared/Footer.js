// components/Footer.js
import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram, FaGlobe } from 'react-icons/fa';
import './Style/Footer.css';

function Footer() {
  const [language, setLanguage] = useState('English');

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Company Info */}
        <div className="footer-column logo-column">
          <div className="footer-logo">
            <img src="https://via.placeholder.com/150x50?text=Your+Logo" alt="Company Logo" />
          </div>
          <p className="company-description">
            Your premium destination for quality products and exceptional service.
          </p>
          <div className="social-icons">
            <a href="#"><FaFacebook className="icon" /></a>
            <a href="#"><FaTwitter className="icon" /></a>
            <a href="#"><FaYoutube className="icon" /></a>
            <a href="#"><FaInstagram className="icon" /></a>
          </div>
        </div>

        {/* Products Column */}
        <div className="footer-column">
          <h3 className="footer-title">Products</h3>
          <ul className="footer-links">
            <li><a href="#">Electronics</a></li>
            <li><a href="#">Clothing</a></li>
            <li><a href="#">Home & Garden</a></li>
            <li><a href="#">Sports</a></li>
            <li><a href="#">Beauty</a></li>
          </ul>
        </div>

        {/* Company Column */}
        <div className="footer-column">
          <h3 className="footer-title">Company</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>

        {/* Features Column */}
        <div className="footer-column">
          <h3 className="footer-title">Features</h3>
          <ul className="footer-links">
            <li><a href="#">Fast Delivery</a></li>
            <li><a href="#">Easy Returns</a></li>
            <li><a href="#">24/7 Support</a></li>
            <li><a href="#">Gift Cards</a></li>
            <li><a href="#">Membership</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-column">
         
          <div className="language-selector">
            <FaGlobe className="language-icon" />
            <select value={language} onChange={handleLanguageChange}>
              <option value="English">English</option>
              <option value="Spanish">Español</option>
              <option value="French">Français</option>
              <option value="German">Deutsch</option>
              <option value="Arabic">العربية</option>
            </select>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          <div className="legal-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;