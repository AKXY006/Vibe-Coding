// src/components/CheckoutModal.jsx
import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Banknote, Smartphone, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose }) => {
  const { cartItems, grandTotal, clearCart } = useCart();
  const { showToast } = useToast();

  const [step, setStep] = useState('FORM'); // 'FORM' or 'SUCCESS'
  const [completedOrder, setCompletedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: 'New York',
    zip: '',
    paymentMethod: 'CARD', // 'CARD', 'UPI', 'CASH'
    notes: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.street.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: `${formData.street}, ${formData.city} ${formData.zip}`,
        },
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        total: grandTotal,
      };

      const result = await placeOrder(orderPayload);
      setCompletedOrder(result);
      clearCart();
      setStep('SUCCESS');
      showToast('Order placed successfully!', 'success');
    } catch (err) {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('FORM');
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {step === 'FORM' ? 'Complete Your Order' : 'Order Placed!'}
          </h3>
          <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {step === 'FORM' ? (
            <form className="checkout-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-input"
                    placeholder="e.g. Alexander Vance"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    placeholder="e.g. +1 (555) 432-1098"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="street">Delivery Street Address *</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  className="form-input"
                  placeholder="Street address, Apt / Suite number"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="form-input"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zip">ZIP / Postal Code</label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    className="form-input"
                    placeholder="10012"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-methods">
                  <button
                    type="button"
                    className={`payment-method-card ${formData.paymentMethod === 'CARD' ? 'active' : ''}`}
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'CARD' }))}
                  >
                    <CreditCard size={20} />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-card ${formData.paymentMethod === 'UPI' ? 'active' : ''}`}
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'UPI' }))}
                  >
                    <Smartphone size={20} />
                    <span>UPI / App</span>
                  </button>
                  <button
                    type="button"
                    className={`payment-method-card ${formData.paymentMethod === 'CASH' ? 'active' : ''}`}
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'CASH' }))}
                  >
                    <Banknote size={20} />
                    <span>Cash / COD</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Delivery Instructions (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  className="form-textarea"
                  rows="2"
                  placeholder="Ring doorbell, leave with front desk, extra napkins..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Confirming Order...' : `Pay & Place Order ($${grandTotal.toFixed(2)})`}
                </button>
              </div>
            </form>
          ) : (
            <div className="order-success-box">
              <div className="order-success-icon">
                <CheckCircle size={36} />
              </div>
              <h4 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Thank You for Dining With Us!</h4>
              <p style={{ color: 'var(--text-muted)' }}>
                Your order has been received by our kitchen and our chefs have started preparing it.
              </p>

              <div className="order-id-badge">
                Order Ref: {completedOrder?.id}
              </div>

              <div style={{ margin: '1.25rem 0', padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.92rem', marginBottom: '0.25rem' }}>
                  <strong>Estimated Delivery:</strong> {completedOrder?.estimatedTime}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Total Paid: <strong>${completedOrder?.total.toFixed(2)}</strong> via {completedOrder?.paymentMethod}
                </p>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={handleClose}
              >
                <span>Continue Browsing</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
