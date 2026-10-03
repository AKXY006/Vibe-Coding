// src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Heart, Leaf, UtensilsCrossed, Calendar, ArrowRight } from 'lucide-react';
import { handleImageError } from '../assets/images';
import './About.css';

const CHEF_TEAM = [
  {
    name: 'Antoine Laurent',
    role: 'Executive Chef & Culinary Director',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80',
    bio: 'Trained under 3-star Michelin luminaries across Lyon and Rome, Chef Laurent brings 20 years of obsessive rigor to modern classical French-Italian gastronomy.'
  },
  {
    name: 'Sophia Benetti',
    role: 'Master Pastry Chef',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=600&q=80',
    bio: 'Celebrated for her delicate architectural desserts, Sophia crafts our famed Venetian Tiramisu and single-origin Valrhona lava compositions.'
  },
  {
    name: 'Mateo Morales',
    role: 'Beverage Director & Master Sommelier',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Curating an award-winning cellar of over 400 biodynamic vintages and pioneering our theatrical botanical cocktail and mocktail pairings.'
  }
];

const AMBIANCE_ITEMS = [
  {
    title: 'The Grand Dining Room',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80'
  },
  {
    title: 'Oak Hearth & Open Kitchen',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80'
  },
  {
    title: 'The Garden Veranda & Lounge',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=700&q=80'
  }
];

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Header */}
      <section className="about-hero">
        <div className="container">
          <span className="section-badge">Our Heritage & Story</span>
          <h1 className="about-hero-title">Culinary Passion, Perfected</h1>
          <p className="about-hero-desc">
            Savoria is a celebration of authentic flavors, seasonal stewardship, and unforgettable hospitality nestled in the heart of the city.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image-card">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
                alt="Chef preparing signature pasta"
                className="story-image"
                onError={handleImageError}
              />
              <div className="story-float-card">
                <div className="story-float-number">12+</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '4px' }}>
                  Years of Artisanal Gastronomic Mastery
                </div>
              </div>
            </div>

            <div>
              <span className="section-badge">Founding Philosophy</span>
              <h2 className="section-title">Rooted in Tradition, Inspired by Modern Elegance</h2>
              <p style={{ marginBottom: '1.25rem', fontSize: '1.05rem', lineHeight: '1.7' }}>
                Established in 2012, Savoria began with a single vision: to create an unpretentious sanctuary where classical culinary techniques and vibrant seasonal harvests converge.
              </p>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                We believe that memorable dining isn’t just about the food on the plate; it is about the sensory symphony of crackling oak hearths, hand-thrown ceramic tableware, warm ambient lighting, and staff who treat you like family.
              </p>
              <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                Every pasta ribbon is rolled fresh by hand every sunrise, every stock is slow-simmered for 24 hours, and every prime cut of Angus beef is aged to perfection in our temperature-controlled aging chambers.
              </p>

              <Link to="/book-table" className="btn btn-primary">
                <Calendar size={18} />
                <span>Reserve Your Table</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Core Values */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Core Pillars</span>
            <h2 className="section-title">The Values That Guide Our Craft</h2>
            <p className="section-subtitle">
              Integrity in every ingredient, precision in every plate.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <Leaf size={28} />
              </div>
              <h3 className="value-title">Farm-to-Table Ethics</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                We partner with certified regenerative family farms, heirloom growers, and sustainable coastal fishermen to source purest seasonal bounty.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <UtensilsCrossed size={28} />
              </div>
              <h3 className="value-title">Obsessive Culinary Craft</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                No shortcuts, no artificial enhancers. From 48-hour fermented doughs to hand-skimmed sauces, time is our secret ingredient.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <Heart size={28} />
              </div>
              <h3 className="value-title">Heartfelt Hospitality</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                We orchestrate every service with grace, warmth, and attention to detail so you leave revitalized and eager to return.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Banner */}
      <div className="container">
        <div className="stats-banner">
          <div className="stats-grid">
            <div>
              <div className="stat-number">14+</div>
              <div className="stat-label">Years of Culinary Excellence</div>
            </div>
            <div>
              <div className="stat-number">4.9★</div>
              <div className="stat-label">Average Guest Rating</div>
            </div>
            <div>
              <div className="stat-number">20+</div>
              <div className="stat-label">Signature Gourmet Dishes</div>
            </div>
            <div>
              <div className="stat-number">180k+</div>
              <div className="stat-label">Delighted Guests Hosted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Culinary Team */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Master Artisans</span>
            <h2 className="section-title">Meet Our Culinary Leaders</h2>
            <p className="section-subtitle">
              The creative minds bringing innovation, passion, and discipline to your dining table.
            </p>
          </div>

          <div className="chefs-grid">
            {CHEF_TEAM.map((chef, idx) => (
              <div key={idx} className="chef-card">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="chef-img"
                  onError={handleImageError}
                />
                <div className="chef-body">
                  <span className="chef-role">{chef.role}</span>
                  <h3 className="chef-name">{chef.name}</h3>
                  <p className="chef-bio">{chef.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dining Ambiance Showcase */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">The Experience</span>
            <h2 className="section-title">Designed for Memorable Evenings</h2>
            <p className="section-subtitle">
              Take a glimpse into the diverse atmospheres waiting for you at Savoria.
            </p>
          </div>

          <div className="ambiance-grid">
            {AMBIANCE_ITEMS.map((item, idx) => (
              <div key={idx} className="ambiance-card">
                <img
                  src={item.image}
                  alt={item.title}
                  className="ambiance-img"
                  onError={handleImageError}
                />
                <div className="ambiance-overlay">
                  <span>{item.title}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/book-table" className="btn btn-primary btn-lg">
              <span>Book Your Table Now</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
