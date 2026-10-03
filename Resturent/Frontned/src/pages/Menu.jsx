// src/pages/Menu.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search, RotateCcw, Utensils, Loader2 } from 'lucide-react';
import CategoryFilter from '../components/CategoryFilter';
import FoodCard from '../components/FoodCard';
import { getFoods } from '../services/foodService';
import './Menu.css';

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [dietaryFilter, setDietaryFilter] = useState('ALL');

  // Fetch foods from Spring Boot REST API
  useEffect(() => {
    let isMounted = true;
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const data = await getFoods({
          category: selectedCategory,
          search: searchQuery,
          sortBy,
        });
        if (isMounted) {
          setDishes(data);
        }
      } catch (err) {
        console.warn('Failed to load dishes from API:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMenu();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery, sortBy]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: dishes.length };
    dishes.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [dishes]);

  // Client-side dietary filter
  const filteredDishes = useMemo(() => {
    let result = [...dishes];

    if (dietaryFilter === 'VEG') {
      result = result.filter((item) => item.isVeg);
    } else if (dietaryFilter === 'SPECIAL') {
      result = result.filter((item) => item.isChefSpecial);
    }

    return result;
  }, [dishes, dietaryFilter]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('default');
    setDietaryFilter('ALL');
  };

  return (
    <div className="menu-page">
      {/* Hero Header */}
      <section className="menu-hero-header">
        <div className="container">
          <span className="section-badge">Gastronomic Collection</span>
          <h1 className="menu-hero-title">Our Culinary Menu</h1>
          <p className="menu-hero-desc">
            Explore our curated selection spanning authentic Italian starters, woodfired sourdough pizzas, hand-rolled pastas, artisanal mains, and botanical mixology powered live by our Spring Boot database.
          </p>
        </div>
      </section>

      {/* Category Pills Bar */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <CategoryFilter
          activeCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={categoryCounts}
        />
      </div>

      {/* Controls Bar: Search & Sort */}
      <div className="menu-controls-wrapper">
        <div className="container">
          <div className="menu-controls">
            {/* Search Box */}
            <div className="menu-search-box">
              <Search size={18} className="menu-search-icon" />
              <input
                type="text"
                placeholder="Search dishes or ingredients (e.g. Truffle, Wings, Salmon)..."
                className="menu-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Actions */}
            <div className="menu-filter-actions">
              {/* Dietary Toggles */}
              <div className="dietary-filters">
                <button
                  type="button"
                  className={`dietary-btn ${dietaryFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setDietaryFilter('ALL')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`dietary-btn ${dietaryFilter === 'VEG' ? 'active' : ''}`}
                  onClick={() => setDietaryFilter('VEG')}
                >
                  Vegetarian 🌱
                </button>
                <button
                  type="button"
                  className={`dietary-btn ${dietaryFilter === 'SPECIAL' ? 'active' : ''}`}
                  onClick={() => setDietaryFilter('SPECIAL')}
                >
                  Chef's Pick ⭐
                </button>
              </div>

              {/* Sort Select */}
              <div className="menu-sort-wrapper">
                <select
                  className="menu-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort dishes"
                >
                  <option value="default">Sort by: Recommended</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="container">
        {loading ? (
          <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem auto', color: 'var(--primary)' }} />
            <p>Loading dishes from kitchen server...</p>
          </div>
        ) : filteredDishes.length > 0 ? (
          <>
            <div style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing <strong>{filteredDishes.length}</strong> delicious {filteredDishes.length === 1 ? 'dish' : 'dishes'}
            </div>
            <div className="menu-grid">
              {filteredDishes.map((dish) => (
                <FoodCard key={dish.id} food={dish} />
              ))}
            </div>
          </>
        ) : (
          <div className="menu-empty-state">
            <div className="menu-empty-icon">
              <Utensils size={32} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No dishes found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              We couldn't find any dish matching your current search or filters. Try adjusting your search term.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleResetFilters}
            >
              <RotateCcw size={15} />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
