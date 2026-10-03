// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/foodData';
import { useToast } from '../context/ToastContext';
import './Footer.css';

const Footer = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Thank you for subscribing to Savoria Epicure Club!', 'success');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Col */}
          <div className="footer-brand">
            <Link to="/" className="brand-logo">
              <div className="brand-icon">
                <Utensils size={22} />
              </div>
              <div className="brand-text">
                <span className="brand-name">
                  Savor<span>ia</span>
                </span>
                <span className="brand-tagline">Bistro & Lounge</span>
              </div>
            </Link>
            <p className="footer-desc">
              Where classical culinary heritage meets contemporary gastronomic flair. Join us for unforgettable moments, artisanal flavors, and heartfelt hospitality.
            </p>
            <div className="footer-socials">
              <a href="#instagram" className="social-icon-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#facebook" className="social-icon-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#twitter" className="social-icon-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="footer-link">A La Carte Menu</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">Our Story & Chefs</Link>
              </li>
              <li>
                <Link to="/book-table" className="footer-link">Reserve a Table</Link>
              </li>
              <li>
                <Link to="/cart" className="footer-link">Order Online</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact & Directions</Link>
              </li>
            </ul>
          </div>

          {/* Hours & Contact */}
          <div>
            <h4 className="footer-col-title">Hours & Location</h4>
            <div className="footer-contact-item">
              <MapPin size={18} className="footer-contact-icon" />
              <span>{RESTAURANT_INFO.address}</span>
            </div>
            <div className="footer-contact-item">
              <Clock size={18} className="footer-contact-icon" />
              <div>
                <div>{RESTAURANT_INFO.hours.weekday}</div>
                <div>{RESTAURANT_INFO.hours.weekend}</div>
              </div>
            </div>
            <div className="footer-contact-item">
              <Phone size={18} className="footer-contact-icon" />
              <span>{RESTAURANT_INFO.phone}</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={18} className="footer-contact-icon" />
              <span>{RESTAURANT_INFO.email}</span>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-col-title">Epicure Club</h4>
            <p className="newsletter-desc">
              Subscribe to receive exclusive tasting invites, seasonal secret menus, and special culinary masterclass updates.
            </p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Savoria Bistro & Lounge. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#allergy">Allergen Notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
