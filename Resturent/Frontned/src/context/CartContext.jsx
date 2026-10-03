// src/context/CartContext.jsx
// Comprehensive cart context with add, remove, quantity stepper, promo code discounts, and tax/total calculations

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { SPECIAL_OFFERS } from '../data/foodData';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'savoria_cart_items';
const PROMO_STORAGE_KEY = 'savoria_active_promo';

export const CartProvider = ({ children }) => {
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState(() => {
    try {
      const saved = localStorage.getItem(PROMO_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to sync cart to localStorage:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync promo to localStorage:', e);
    }
  }, [appliedPromo]);

  // Add item with specified quantity
  const addToCart = (item, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty
        };
        return updated;
      }
      return [...prev, { ...item, quantity: qty }];
    });

    showToast(`Added ${qty}x ${item.name} to cart!`, 'success');
  };

  // Remove specific item from cart
  const removeFromCart = (id) => {
    const itemToRemove = cartItems.find((i) => i.id === id);
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    if (itemToRemove) {
      showToast(`Removed ${itemToRemove.name} from cart`, 'info');
    }
  };

  // Update item quantity directly
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Clear all items
  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  // Get current quantity of a specific dish
  const getItemQuantity = (id) => {
    const found = cartItems.find((i) => i.id === id);
    return found ? found.quantity : 0;
  };

  // Apply promo code
  const applyPromoCode = (code) => {
    if (!code) return { success: false, message: 'Please enter a coupon code.' };
    const cleanCode = code.trim().toUpperCase();
    const offer = SPECIAL_OFFERS.find((o) => o.code === cleanCode);

    if (offer) {
      setAppliedPromo(offer);
      showToast(`Coupon "${cleanCode}" applied successfully!`, 'success');
      return { success: true, message: `Promo applied: ${offer.discount}!` };
    } else {
      return { success: false, message: 'Invalid or expired coupon code. Try SAVOR20 or WELCOME10' };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    showToast('Coupon removed', 'info');
  };

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Discount computation
  let discountAmount = 0;
  if (appliedPromo && subtotal > 0) {
    if (appliedPromo.discountValue > 0) {
      discountAmount = subtotal * appliedPromo.discountValue;
    }
  }

  // Delivery fee: $4.99 flat, free if subtotal >= 50 or FREESHIP promo
  const isFreeDelivery = subtotal >= 50 || (appliedPromo && appliedPromo.freeDelivery);
  const deliveryFee = subtotal === 0 ? 0 : isFreeDelivery ? 0 : 4.99;

  // Tax: standard 8% on discounted subtotal
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = subtotal === 0 ? 0 : taxableAmount * 0.08;

  // Grand total
  const grandTotal = subtotal === 0 ? 0 : taxableAmount + tax + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        discountAmount,
        deliveryFee,
        isFreeDelivery,
        tax,
        grandTotal,
        appliedPromo,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
