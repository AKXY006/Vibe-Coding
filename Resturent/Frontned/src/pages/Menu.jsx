// src/pages/Menu.jsx
import React, { useState, useMemo } from 'react';
import { Search, RotateCcw, Utensils, SlidersHorizontal } from 'lucide-react';
import CategoryFilter from '../components/CategoryFilter';
import FoodCard from '../components/FoodCard';
import { foodItems } from '../data/foodData';
import './Menu.css';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low', 'price-high', 'rating'
  const [dietaryFilter, setDietaryFilter] = useState('ALL'); // 'ALL', 'VEG', 'SPECIAL'

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: foodItems.length };
    foodItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter & Sort logic
  const filteredDishes = useMemo(() => {
    let result = [...foodItems];

    // 1. Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 2. Search query filter (search by dish name, description or ingredient)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    // 3. Dietary filter
    if (dietaryFilter === 'VEG') {
      result = result.filter((item) => item.isVeg);
    } else if (dietaryFilter === 'SPECIAL') {
      result = result.filter((item) => item.isChefSpecial);
    }

    // 4. Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy, dietaryFilter]);

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
            Explore our curated 20-course portfolio spanning authentic Italian starters, woodfired sourdough pizzas, hand-rolled pastas, artisanal mains, and botanical mixology.
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
                placeholder="Search dishes or ingredients (e.g. Truffle, Lobster, Ribeye)..."
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
        {filteredDishes.length > 0 ? (
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
