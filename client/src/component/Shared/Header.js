// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Style/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <span className="logo">YourLogo</span>
          </Link>
        </div>
        
        <nav className="nav-menu">
          <input type="checkbox" id="mobile-menu" className="mobile-menu-check" />
          <label htmlFor="mobile-menu" className="mobile-menu-label">
            <span></span>
            <span></span>
            <span></span>
          </label>
          
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/admin/ProductShow" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">About</Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className="nav-link">Services</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
            
            {/* Auth Buttons */}
            <div className="auth-buttons">
              <li className="nav-item">
                <Link to="/login" className="nav-link login-btn">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link get-started-btn">Get Started</Link>
              </li>
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;