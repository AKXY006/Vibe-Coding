// src/components/RatingStars.jsx
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const RatingStars = ({ rating = 5, reviewsCount = null, size = 16, showNumber = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0));

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'inline-flex', color: 'var(--star-color)', alignItems: 'center' }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} fill="currentColor" stroke="none" />
        ))}
        {hasHalf && (
          <StarHalf size={size} fill="currentColor" stroke="none" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} fill="#e2e8f0" stroke="none" />
        ))}
      </div>
      {showNumber && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginLeft: '2px' }}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewsCount !== null && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
