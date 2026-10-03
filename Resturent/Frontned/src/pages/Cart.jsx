// src/pages/Cart.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft, Tag, Truck, ShieldCheck, X } from 'lucide-react';
import CartItem from '../components/CartItem';
import CheckoutModal from '../components/CheckoutModal';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './Cart.css';

const Cart = () => {
  const {
    cartItems,
    totalItems,
    subtotal,
    discountAmount,
    deliveryFee,
    isFreeDelivery,
    tax,
    grandTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    clearCart
  } = useCart();

  const { showToast } = useToast();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const res = applyPromoCode(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoInput('');
    }
  };

  // Free shipping threshold calculations ($50)
  const freeThreshold = 50;
  const progressPercent = Math.min(100, (subtotal / freeThreshold) * 100);
  const remainingForFree = Math.max(0, freeThreshold - subtotal);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty-wrapper">
            <div className="cart-empty-icon">
              <ShoppingBag size={38} />
            </div>
            <h2 className="cart-empty-title">Your Cart is Empty</h2>
            <p className="cart-empty-desc">
              Looks like you haven't added any of our delicious culinary dishes to your cart yet.
            </p>
            <Link to="/menu" className="btn btn-primary btn-lg">
              <span>Browse A La Carte Menu</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Title row */}
        <div className="cart-title-row">
          <div>
            <h1 className="cart-main-title">Shopping Cart</h1>
            <span className="cart-item-count-label">
              You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your basket
            </span>
          </div>

          <button
            type="button"
            className="clear-cart-link"
            onClick={clearCart}
          >
            Clear All Items
          </button>
        </div>

        <div className="cart-layout-grid">
          {/* Left Column: Cart Items List */}
          <div>
            {/* Free Delivery Bar */}
            <div className="free-shipping-card">
              <div className="free-shipping-msg">
                <Truck size={18} color="var(--primary)" />
                {isFreeDelivery ? (
                  <span>
                    🎉 <strong>Congratulations!</strong> You've unlocked <strong>Free White-Glove Delivery</strong>!
                  </span>
                ) : (
                  <span>
                    Add <strong>${remainingForFree.toFixed(2)}</strong> more to unlock <strong>Free Express Delivery</strong>
                  </span>
                )}
              </div>
              <div className="free-shipping-bar-bg">
                <div
                  className="free-shipping-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items list */}
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/menu" className="btn btn-outline btn-sm">
                <ArrowLeft size={16} />
                <span>Continue Ordering</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="order-summary-card">
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>Coupon Discount ({appliedPromo?.discount})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong style={{ color: '#059669' }}>FREE</strong>
                  ) : (
                    `$${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="summary-row">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              {/* Promo Code Box */}
              <div className="promo-section">
                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  Have a Promo Code?
                </label>
                <form className="promo-form" onSubmit={handleApplyPromo}>
                  <input
                    type="text"
                    placeholder="e.g. SAVOR20"
                    className="promo-input"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <button type="submit" className="promo-btn">
                    Apply
                  </button>
                </form>

                {promoError && (
                  <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                    {promoError}
                  </p>
                )}

                {appliedPromo && (
                  <div className="applied-promo-tag">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={14} />
                      <strong>{appliedPromo.code}</strong> applied ({appliedPromo.discount})
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      style={{ color: '#dc2626', display: 'flex', alignItems: 'center' }}
                      aria-label="Remove promo code"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="summary-row grand-total">
                <span>Estimated Total</span>
                <span className="total-amount">${grandTotal.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                className="btn btn-primary btn-full btn-lg"
                onClick={() => setIsCheckoutOpen(true)}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '1.25rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <ShieldCheck size={16} color="#059669" />
                <span>Encrypted & Contactless Delivery Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};

export default Cart;
