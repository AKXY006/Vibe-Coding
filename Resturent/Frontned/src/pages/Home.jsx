// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  Flame,
  Truck,
  Copy,
  Check
} from 'lucide-react';
import FoodCard from '../components/FoodCard';
import RatingStars from '../components/RatingStars';
import { SPECIAL_OFFERS, TESTIMONIALS } from '../data/foodData';
import { getPopularDishes } from '../services/foodService';
import { handleImageError } from '../assets/images';
import { useToast } from '../context/ToastContext';
import './Home.css';

const Home = () => {
  const { showToast } = useToast();
  const [copiedCode, setCopiedCode] = useState(null);
  const [popularDishes, setPopularDishes] = useState([]);

  // Fetch live popular dishes from Spring Boot API
  useEffect(() => {
    let isMounted = true;
    const fetchPopular = async () => {
      try {
        const dishes = await getPopularDishes(6);
        if (isMounted) {
          setPopularDishes(dishes);
        }
      } catch (err) {
        console.warn('Failed to fetch popular dishes:', err);
      }
    };

    fetchPopular();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Content */}
            <div className="hero-content">
              <span className="hero-tag">
                <Sparkles size={16} /> Michelin Inspired Dining
              </span>
              <h1 className="hero-title">
                Artisanal Flavor Meets <span>Culinary Soul</span>
              </h1>
              <p className="hero-subtitle">
                Indulge in handcrafted seasonal menus, 48-hour fermented sourdough pizzas, prime dry-aged cuts, and botanical mixology curated by our master chefs.
              </p>

              <div className="hero-cta-group">
                <Link to="/menu" className="btn btn-primary btn-lg">
                  <span>Explore Menu</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/book-table" className="btn btn-secondary btn-lg">
                  <Calendar size={18} />
                  <span>Reserve a Table</span>
                </Link>
              </div>

              {/* Highlights Row */}
              <div className="hero-highlights">
                <div className="hero-highlight-item">
                  <div className="hero-highlight-icon">
                    <Award size={20} />
                  </div>
                  <div className="hero-highlight-text">
                    <strong>4.9 / 5.0 Rating</strong>
                    <span>Over 1,200+ Reviews</span>
                  </div>
                </div>

                <div className="hero-highlight-item">
                  <div className="hero-highlight-icon">
                    <Clock size={20} />
                  </div>
                  <div className="hero-highlight-text">
                    <strong>30 Min Express</strong>
                    <span>Temperature Insulated</span>
                  </div>
                </div>

                <div className="hero-highlight-item">
                  <div className="hero-highlight-icon">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="hero-highlight-text">
                    <strong>100% Organic</strong>
                    <span>Local Farm Sourced</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card with Float Badges */}
            <div className="hero-visual-wrapper">
              <div className="hero-image-backdrop" />
              <div className="hero-main-img-card">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                  alt="Savoria Signature Prime Ribeye"
                  className="hero-main-img"
                  onError={handleImageError}
                />
              </div>

              {/* Float Badge 1 */}
              <div className="hero-float-badge badge-top-left">
                <div className="float-badge-icon">
                  <Flame size={20} />
                </div>
                <div>
                  <div className="float-badge-title">Chef's Signature</div>
                  <div className="float-badge-val">Prime Angus Ribeye</div>
                </div>
              </div>

              {/* Float Badge 2 */}
              <div className="hero-float-badge badge-bottom-right">
                <div className="float-badge-icon">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="float-badge-title">Weekend Tasting</div>
                  <div className="float-badge-val">20% Off With SAVOR20</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RESTAURANT INTRODUCTION / PHILOSOPHY */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="intro-grid">
            <div className="intro-image-grid">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80"
                alt="Savoria Dining Atmosphere"
                className="intro-img-tall"
                onError={handleImageError}
              />
              <div className="intro-img-stack">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=500&q=80"
                  alt="Executive Chef Plating"
                  className="intro-img-square"
                  onError={handleImageError}
                />
                <img
                  src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=500&q=80"
                  alt="Wine Cellar Reserve"
                  className="intro-img-square"
                  onError={handleImageError}
                />
              </div>
            </div>

            <div>
              <span className="section-badge">Our Heritage & Craft</span>
              <h2 className="section-title">Where Tradition Meets Contemporary Gastronomy</h2>
              <p style={{ marginBottom: '1.25rem' }}>
                Founded in 2012 by master culinarians, Savoria was born from a singular vision: to honor timeless European culinary techniques while celebrating vibrant seasonal harvests.
              </p>
              <div className="intro-quote">
                “Every plate should tell a story of provenance, restraint, and obsessive passion for pure flavor.”
              </div>
              <p style={{ marginBottom: '2rem' }}>
                From our 48-hour fermented sourdough crusts baked at 900°F to butter-poached Maine lobster and 35-day dry-aged steaks seared over fragrant oak charcoal, each dish is an intentional masterpiece.
              </p>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/about" className="btn btn-outline">
                  <span>Read Full Story</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/book-table" className="btn btn-primary">
                  <span>Experience Dine-In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR DISHES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Chef's Recommendations</span>
            <h2 className="section-title">Most Loved Delicacies</h2>
            <p className="section-subtitle">
              Hand-selected signature creations that our guests return for time and again.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {popularDishes.map((dish) => (
              <FoodCard key={dish.id} food={dish} />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/menu" className="btn btn-secondary btn-lg">
              <span>View Full Menu</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SPECIAL OFFERS / PROMOTIONS */}
      <section className="section" style={{ backgroundColor: 'var(--bg-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Limited Time Offers</span>
            <h2 className="section-title">Exclusive Dining Perks</h2>
            <p className="section-subtitle">
              Apply these promo codes during checkout or show them to your server at the restaurant.
            </p>
          </div>

          <div className="offers-grid">
            {SPECIAL_OFFERS.map((offer) => (
              <div key={offer.id} className="offer-card">
                <span className="offer-tag">{offer.tag}</span>
                <div className="offer-discount">{offer.discount}</div>
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-desc">{offer.description}</p>
                <div className="offer-code-box">
                  <span className="offer-code">{offer.code}</span>
                  <button
                    type="button"
                    className="copy-code-btn"
                    onClick={() => handleCopyCode(offer.code)}
                  >
                    {copiedCode === offer.code ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Copied
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Copy size={14} /> Copy
                      </span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURES / WHY CHOOSE US */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">The Savoria Standard</span>
            <h2 className="section-title">Why Dine With Us</h2>
            <p className="section-subtitle">
              Every detail is calibrated to offer an exceptional culinary journey.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <Award size={28} />
              </div>
              <h4>Master Chefs</h4>
              <p>Internationally trained culinary artisans passionate about craft, balance, and presentation.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={28} />
              </div>
              <h4>Organic Sourcing</h4>
              <p>Daily deliveries from certified organic local farmers and sustainable seafood docks.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <Flame size={28} />
              </div>
              <h4>Oak-Fired Hearth</h4>
              <p>Authentic 900°F stone ovens giving an unmatched smoky depth of flavor.</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <Truck size={28} />
              </div>
              <h4>White-Glove Delivery</h4>
              <p>Eco-friendly thermal insulated packaging preserving restaurant temperature and texture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Guest Experiences</span>
            <h2 className="section-title">What Diners Are Saying</h2>
            <p className="section-subtitle">
              Authentic reviews from leading gastronomic critics and cherished regulars.
            </p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div>
                  <RatingStars rating={t.rating} size={18} />
                  <p className="testimonial-comment">"{t.comment}"</p>
                </div>
                <div className="testimonial-user">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="testimonial-avatar"
                    onError={handleImageError}
                  />
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-content">
              <h2>Reserve Your Evening at Savoria</h2>
              <p>
                Whether celebrating an intimate anniversary, a family milestone, or looking for a memorable night out, our team is ready to welcome you.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/book-table" className="btn btn-primary btn-lg">
                <Calendar size={18} />
                <span>Reserve a Table</span>
              </Link>
              <Link to="/menu" className="btn btn-outline btn-lg" style={{ color: '#ffffff', borderColor: '#475569' }}>
                <span>Order Takeaway</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
