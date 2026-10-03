// src/components/CartItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../assets/images';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item-row">
      <Link to={`/food/${item.id}`}>
        <img
          src={item.image}
          alt={item.name}
          className="cart-item-img"
          onError={handleImageError}
        />
      </Link>

      <div className="cart-item-info">
        <span className="cart-item-category">{item.category}</span>
        <Link to={`/food/${item.id}`} className="cart-item-title">
          {item.name}
        </Link>
        <span className="cart-item-unit-price">${item.price.toFixed(2)} each</span>
      </div>

      <div className="cart-qty-stepper">
        <button
          type="button"
          className="qty-btn"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="qty-number">{item.quantity}</span>
        <button
          type="button"
          className="qty-btn"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="cart-item-total">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      <button
        type="button"
        className="cart-remove-btn"
        onClick={() => removeFromCart(item.id)}
        aria-label={`Remove ${item.name} from cart`}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default CartItem;
