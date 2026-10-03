// src/components/CategoryFilter.jsx
import React from 'react';
import {
  UtensilsCrossed,
  Soup,
  Pizza,
  Utensils,
  Beef,
  CakeSlice,
  Wine
} from 'lucide-react';
import { CATEGORIES } from '../data/foodData';
import './CategoryFilter.css';

const ICON_MAP = {
  UtensilsCrossed: UtensilsCrossed,
  Soup: Soup,
  Pizza: Pizza,
  Utensils: Utensils,
  Beef: Beef,
  CakeSlice: CakeSlice,
  Wine: Wine
};

const CategoryFilter = ({ activeCategory, onSelectCategory, counts = {} }) => {
  return (
    <div className="category-filter-bar" role="tablist" aria-label="Food Categories">
      {CATEGORIES.map((cat) => {
        const IconComponent = ICON_MAP[cat.icon] || Utensils;
        const isActive = activeCategory === cat.name || (activeCategory === 'All' && cat.id === 'all');
        const count = counts[cat.name] ?? (cat.id === 'all' ? counts.all : null);

        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`category-pill-btn ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id === 'all' ? 'All' : cat.name)}
          >
            <IconComponent size={17} />
            <span>{cat.name}</span>
            {count !== null && count !== undefined && (
              <span className="category-count">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
