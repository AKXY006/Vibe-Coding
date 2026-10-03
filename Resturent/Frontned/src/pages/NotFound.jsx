// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Home, Compass } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
          <Utensils size={34} />
        </div>

        <div className="not-found-badge">404</div>
        <h1 className="not-found-title">This Table Isn't Reserved</h1>
        <p className="not-found-desc">
          We couldn't locate the culinary page you're searching for. It might have moved, or the link may have been mistyped.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            <span>Return to Home</span>
          </Link>
          <Link to="/menu" className="btn btn-outline">
            <Compass size={18} />
            <span>Explore Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
