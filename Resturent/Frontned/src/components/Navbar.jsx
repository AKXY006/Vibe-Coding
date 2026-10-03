// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Utensils, Menu as MenuIcon, X, User, LogOut, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Track window scroll for subtle elevation and blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <nav className="navbar" aria-label="Main Navigation">
            {/* Logo */}
            <Link to="/" className="brand-logo" onClick={closeMobileMenu}>
              <div className="brand-icon">
                <Utensils size={22} strokeWidth={2.4} />
              </div>
              <div className="brand-text">
                <span className="brand-name">
                  Savor<span>ia</span>
                </span>
                <span className="brand-tagline">Bistro & Lounge</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="nav-links">
              <li>
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Menu
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Contact
                </NavLink>
              </li>
            </ul>

            {/* Nav Actions */}
            <div className="nav-actions">
              {/* Cart Button */}
              <Link to="/cart" className="cart-icon-btn" aria-label="View Shopping Cart">
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="cart-badge">{totalItems}</span>
                )}
              </Link>

              {/* User Authentication state */}
              {isAuthenticated ? (
                <div className="user-menu-wrapper" ref={userMenuRef}>
                  <button
                    className="user-profile-btn"
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    aria-label="User Profile Menu"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="user-avatar-small"
                    />
                    <span>{user.name}</span>
                  </button>

                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <span className="dropdown-user-name">{user.name}</span>
                        <div>{user.email}</div>
                      </div>
                      <Link
                        to="/book-table"
                        className="dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Calendar size={16} />
                        <span>Book a Table</span>
                      </Link>
                      <button
                        className="dropdown-item logout"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="login-btn">
                  Login
                </Link>
              )}

              {/* Book Table CTA Button (Desktop) */}
              <Link to="/book-table" className="btn btn-primary btn-sm nav-book-btn">
                <Calendar size={15} />
                <span>Book Table</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="mobile-toggle"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={26} /> : <MenuIcon size={26} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div>
          <div className="mobile-drawer-header">
            <div className="brand-logo">
              <div className="brand-icon">
                <Utensils size={20} />
              </div>
              <span className="brand-name">
                Savor<span>ia</span>
              </span>
            </div>
            <button className="mobile-toggle" onClick={closeMobileMenu}>
              <X size={24} />
            </button>
          </div>

          <ul className="mobile-nav-links">
            <li>
              <NavLink to="/" className="mobile-nav-link" onClick={closeMobileMenu} end>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/menu" className="mobile-nav-link" onClick={closeMobileMenu}>
                Explore Menu
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="mobile-nav-link" onClick={closeMobileMenu}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>
                Contact & Location
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className="mobile-nav-link" onClick={closeMobileMenu}>
                Cart ({totalItems} items)
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="mobile-drawer-footer">
          {isAuthenticated ? (
            <button className="btn btn-outline btn-full" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Log Out ({user.name})</span>
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline btn-full" onClick={closeMobileMenu}>
              <User size={16} />
              <span>Sign In / Register</span>
            </Link>
          )}

          <Link to="/book-table" className="btn btn-primary btn-full" onClick={closeMobileMenu}>
            <Calendar size={16} />
            <span>Book a Table</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
