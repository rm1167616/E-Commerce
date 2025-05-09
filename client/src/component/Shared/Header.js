// components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaUser } from 'react-icons/fa';
import './Style/Header.css';

function Header() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isWishlistActive, setIsWishlistActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleWishlist = () => {
    setIsWishlistActive(!isWishlistActive);
    setWishlistCount(isWishlistActive ? wishlistCount - 1 : wishlistCount + 1);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <span className="logo">YourLogo</span>
          </Link>
        </div>
        
        <nav className="nav-menu">
          <input 
            type="checkbox" 
            id="mobile-menu" 
            className="mobile-menu-check" 
            checked={isMenuOpen}
            onChange={toggleMenu}
          />
          <label htmlFor="mobile-menu" className="mobile-menu-label">
            <span></span>
            <span></span>
            <span></span>
          </label>
          
          <ul className={`nav-list ${isMenuOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <Link to="/admin/ProductShow" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/AboutUs" className="nav-link">About</Link>
            </li>
            <li className="nav-item">
              <Link to="/services" className="nav-link">Services</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
            
            {/* Icons Section */}
            <div className="icon-section">
              <li className="nav-item icon-item">
               <Link 
  to="/WishList" 
  className="wishlist-btn-link"
  aria-label="Wishlist"
  onClick={(e) => {
    // Prevent default link behavior if you want the toggle to work
    // e.preventDefault();
    toggleWishlist();
  }}
>
  {isWishlistActive ? (
    <FaHeart className="wishlist-icon active" />
  ) : (
    <FaRegHeart className="wishlist-icon" />
  )}
  {wishlistCount > 0 && (
    <span className="wishlist-count">{wishlistCount}</span>
  )}
</Link>
              </li>
              <li className="nav-item icon-item">
                <Link to="/cart" className="cart-link" aria-label="Cart">
                  <FaShoppingCart className="cart-icon" />
                  <span className="cart-count">0</span>
                
                </Link>
              </li>
              <li className="nav-item icon-item">
                <Link to="/Profile" className="account-link" aria-label="Account">
                  <FaUser className="account-icon" />


                </Link>
              </li>
            </div>
            
            {/* Auth Buttons */}
            <div className="auth-buttons">
              <li className="nav-item">
                <Link to="/Auth" className="nav-link login-btn">Login</Link>
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