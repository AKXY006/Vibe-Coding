// src/components/FoodCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, ShoppingBag } from 'lucide-react';
import RatingStars from './RatingStars';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../assets/images';
import './FoodCard.css';

const FoodCard = ({ food }) => {
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  const currentQty = getItemQuantity(food.id);

  const handleCardClick = () => {
    navigate(`/food/${food.id}`);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    addToCart(food, 1);
  };

  return (
    <article className="food-card" onClick={handleCardClick}>
      {/* Food Image Wrapper */}
      <div className="food-card-img-wrapper">
        <img
          src={food.image}
          alt={food.name}
          className="food-card-img"
          loading="lazy"
          onError={handleImageError}
        />
        {/* Floating Badges */}
        <div className="food-card-badges">
          {food.isChefSpecial && (
            <span className="card-pill card-pill-chef">Chef's Special</span>
          )}
          <span className="card-pill card-pill-category">{food.category}</span>
        </div>

        {/* Dietary Tag */}
        <div className="food-card-dietary">
          <span
            className={`dietary-dot ${food.isVeg ? 'veg' : 'non-veg'}`}
            title={food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="food-card-body">
        <div className="food-card-meta">
          <RatingStars rating={food.rating} reviewsCount={food.reviewsCount} size={14} />
          {food.prepTime && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              ⏱ {food.prepTime}
            </span>
          )}
        </div>

        <h3 className="food-card-title" title={food.name}>
          {food.name}
        </h3>

        <p className="food-card-desc">
          {food.description}
        </p>

        {/* Footer */}
        <div className="food-card-footer">
          <div className="food-card-price-box">
            <span className="food-card-price-label">Price</span>
            <span className="food-card-price">${food.price.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className="food-card-add-btn"
            onClick={handleAddClick}
            aria-label={`Add ${food.name} to cart`}
          >
            {currentQty > 0 ? (
              <>
                <Check size={16} />
                <span>{currentQty} in cart</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default FoodCard;
