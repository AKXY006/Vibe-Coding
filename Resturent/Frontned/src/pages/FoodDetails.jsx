// src/pages/FoodDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, ArrowLeft, ShieldAlert, Check, Loader2 } from 'lucide-react';
import RatingStars from '../components/RatingStars';
import FoodCard from '../components/FoodCard';
import { getFoodById, getFoods } from '../services/foodService';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../assets/images';
import './FoodDetails.css';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();

  const [dish, setDish] = useState(null);
  const [relatedDishes, setRelatedDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Load dish from Spring Boot API
  useEffect(() => {
    let isMounted = true;
    const fetchDishDetails = async () => {
      setLoading(true);
      try {
        const item = await getFoodById(id);
        if (isMounted) {
          setDish(item);
          // Fetch related items from the same category
          if (item && item.category) {
            const allCategoryDishes = await getFoods({ category: item.category });
            if (isMounted) {
              setRelatedDishes(
                allCategoryDishes.filter((r) => r.id !== item.id).slice(0, 3)
              );
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load dish details from server:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
          setQuantity(1);
          setJustAdded(false);
        }
      }
    };

    fetchDishDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
        <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem auto', color: 'var(--primary)' }} />
        <p style={{ color: 'var(--text-muted)' }}>Retrieving culinary details from kitchen server...</p>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Dish Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          The culinary item you are looking for may have been rotated out of the seasonal menu.
        </p>
        <Link to="/menu" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Return to Menu</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(dish, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const currentCartCount = getItemQuantity(dish.id);

  return (
    <div className="food-details-page">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/menu">Menu</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-active">{dish.name}</span>
        </nav>

        {/* Main Details Grid */}
        <div className="food-details-grid">
          {/* Left Column: Image Showcase */}
          <div className="details-image-card">
            <img
              src={dish.image}
              alt={dish.name}
              className="details-main-image"
              onError={handleImageError}
            />
            <div className="details-badges-float">
              {dish.isChefSpecial && (
                <span className="card-pill card-pill-chef">Chef's Signature</span>
              )}
              <span className={`badge ${dish.isVeg ? 'badge-veg' : 'badge-nonveg'}`}>
                {dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
            </div>
          </div>

          {/* Right Column: Culinary Details */}
          <div className="details-info">
            <span className="details-category-tag">{dish.category}</span>
            <h1 className="details-title">{dish.name}</h1>

            <div className="details-rating-row">
              <RatingStars rating={dish.rating} reviewsCount={dish.reviewsCount} size={18} />
              {currentCartCount > 0 && (
                <span className="badge badge-special">
                  <Check size={14} /> {currentCartCount} already in your cart
                </span>
              )}
            </div>

            <div className="details-price-row">
              <span className="details-price">${dish.price.toFixed(2)}</span>
              <span className="details-tax-hint">Inclusive of all local dining taxes</span>
            </div>

            <p className="details-description">
              {dish.longDescription || dish.description}
            </p>

            {/* Quick Specs Bar */}
            <div className="details-specs-bar">
              <div className="details-spec-item">
                <span className="details-spec-label">Preparation</span>
                <span className="details-spec-val">{dish.prepTime || '15 mins'}</span>
              </div>
              <div className="details-spec-item">
                <span className="details-spec-label">Energy</span>
                <span className="details-spec-val">{dish.calories || '450 kcal'}</span>
              </div>
              <div className="details-spec-item">
                <span className="details-spec-label">Dietary</span>
                <span className="details-spec-val">{dish.isVeg ? 'Vegetarian' : 'Non-Veg'}</span>
              </div>
            </div>

            {/* Ingredients */}
            {dish.ingredients && (
              <>
                <h3 className="details-section-heading">Key Ingredients</h3>
                <div className="ingredients-pills">
                  {dish.ingredients.map((ing, i) => (
                    <span key={i} className="ingredient-pill">
                      {ing}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Nutrition Facts */}
            {dish.nutrition && (
              <>
                <h3 className="details-section-heading">Nutritional Profile</h3>
                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="nutrition-val">{dish.nutrition.calories}</span>
                    <span className="nutrition-key">Calories</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-val">{dish.nutrition.protein}</span>
                    <span className="nutrition-key">Protein</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-val">{dish.nutrition.carbs}</span>
                    <span className="nutrition-key">Carbs</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-val">{dish.nutrition.fats}</span>
                    <span className="nutrition-key">Fats</span>
                  </div>
                </div>
              </>
            )}

            {/* Allergen Warning */}
            {dish.allergens && dish.allergens.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <ShieldAlert size={16} />
                <span>Contains allergens: {dish.allergens.join(', ')}</span>
              </div>
            )}

            {/* Action Bar (Quantity Stepper & Add to Cart) */}
            <div className="details-actions-bar">
              <div className="details-qty-wrapper">
                <button
                  type="button"
                  className="details-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="details-qty-input">{quantity}</span>
                <button
                  type="button"
                  className="details-qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg details-add-btn"
                onClick={handleAddToCart}
              >
                {justAdded ? (
                  <>
                    <Check size={20} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    <span>Add to Cart • ${(dish.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Dishes Section */}
        {relatedDishes.length > 0 && (
          <div className="related-dishes-section">
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
              <span className="section-badge">Chef's Pairings</span>
              <h2 className="section-title">You Might Also Savor</h2>
              <p className="section-subtitle">
                Explore complementary dishes from our {dish.category} collection.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {relatedDishes.map((item) => (
                <FoodCard key={item.id} food={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetails;
