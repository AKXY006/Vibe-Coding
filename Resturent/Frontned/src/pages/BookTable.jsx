// src/pages/BookTable.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock, Sparkles, CheckCircle, ArrowRight, ShieldCheck, Plus, Minus } from 'lucide-react';
import { createReservation } from '../services/reservationService';
import { useToast } from '../context/ToastContext';
import './BookTable.css';

const SEATING_AREAS = [
  { id: 'main', label: 'Main Dining Hall', desc: 'Central ambiance with chandelier lighting' },
  { id: 'booth', label: 'Intimate Booth', desc: 'Cozy leather booths ideal for couples' },
  { id: 'garden', label: 'Garden Veranda', desc: 'Lush greenery and soft evening breeze' },
  { id: 'rooftop', label: 'Rooftop Lounge', desc: 'Panoramic city views under the stars' }
];

const LUNCH_SLOTS = ['11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM'];
const DINNER_SLOTS = ['05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'];

const BookTable = () => {
  const { showToast } = useToast();

  // Get tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(defaultDate);
  const [timeSlot, setTimeSlot] = useState('07:00 PM');
  const [seatingArea, setSeatingArea] = useState('Main Dining Hall');
  const [occasion, setOccasion] = useState('Casual Dining');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      showToast('Please fill in your name, email and contact phone.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const reservationData = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        guests,
        date,
        timeSlot,
        seatingArea,
        occasion,
        specialRequests: form.specialRequests
      };

      const result = await createReservation(reservationData);
      setConfirmedReservation(result);
      showToast('Table reservation confirmed!', 'success');
    } catch (err) {
      showToast('Failed to create reservation. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-table-page">
      {/* Hero Header */}
      <section className="book-hero">
        <div className="container">
          <span className="section-badge">
            <Sparkles size={16} /> Table Reservations
          </span>
          <h1 className="book-hero-title">Book Your Dining Experience</h1>
          <p className="book-hero-desc">
            Reserve your table for an evening of exceptional gastronomy. For parties larger than 10, please contact our concierge directly.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {confirmedReservation ? (
            /* Confirmation View */
            <div className="confirmation-card">
              <div className="confirmation-icon">
                <CheckCircle size={40} />
              </div>
              <h2 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>
                Reservation Confirmed!
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                A confirmation email has been dispatched to <strong>{confirmedReservation.email}</strong>.
              </p>

              <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-pill)', border: '1.5px dashed var(--primary)', fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '2rem' }}>
                Booking Ref: {confirmedReservation.id}
              </div>

              <div style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'left', maxWidth: '420px', margin: '0 auto 2rem auto' }}>
                <div className="preview-row">
                  <span>Guest Name:</span>
                  <strong>{confirmedReservation.fullName}</strong>
                </div>
                <div className="preview-row">
                  <span>Guests:</span>
                  <strong>{confirmedReservation.guests} People</strong>
                </div>
                <div className="preview-row">
                  <span>Date:</span>
                  <strong>{confirmedReservation.date}</strong>
                </div>
                <div className="preview-row">
                  <span>Time Slot:</span>
                  <strong>{confirmedReservation.timeSlot}</strong>
                </div>
                <div className="preview-row">
                  <span>Seating Preference:</span>
                  <strong>{confirmedReservation.seatingArea}</strong>
                </div>
                <div className="preview-row">
                  <span>Occasion:</span>
                  <strong>{confirmedReservation.occasion}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/" className="btn btn-outline">
                  <span>Back to Home</span>
                </Link>
                <Link to="/menu" className="btn btn-primary">
                  <span>Explore Menu</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ) : (
            /* Reservation Form Grid */
            <div className="book-layout-grid">
              {/* Form Card */}
              <div className="reservation-form-card">
                <h2 className="reservation-form-title">Reservation Details</h2>

                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  {/* Step 1: Number of Guests */}
                  <div className="form-group">
                    <label>Number of Guests</label>
                    <div className="guests-selector">
                      <div className="details-qty-wrapper">
                        <button
                          type="button"
                          className="details-qty-btn"
                          onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          aria-label="Decrease guests"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="guest-count-box">{guests}</span>
                        <button
                          type="button"
                          className="details-qty-btn"
                          onClick={() => setGuests((g) => Math.min(12, g + 1))}
                          aria-label="Increase guests"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {guests === 1 ? '1 Guest (Solo Diner)' : `${guests} Guests (Table)`}
                      </span>
                    </div>
                  </div>

                  {/* Step 2: Date & Occasion */}
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="res-date">Dining Date *</label>
                      <input
                        type="date"
                        id="res-date"
                        className="form-input"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="res-occasion">Occasion</label>
                      <select
                        id="res-occasion"
                        className="form-select"
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                      >
                        <option value="Casual Dining">Casual Dining</option>
                        <option value="Birthday Celebration">Birthday Celebration</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Business Dinner">Business Dinner</option>
                        <option value="Romantic Date">Romantic Date</option>
                      </select>
                    </div>
                  </div>

                  {/* Step 3: Seating Area */}
                  <div className="form-group">
                    <label>Preferred Seating Area</label>
                    <div className="seating-areas-grid">
                      {SEATING_AREAS.map((area) => (
                        <button
                          key={area.id}
                          type="button"
                          className={`seating-btn ${seatingArea === area.label ? 'active' : ''}`}
                          onClick={() => setSeatingArea(area.label)}
                        >
                          <div>
                            <div>{area.label}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>
                              {area.desc}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Time Slot */}
                  <div className="form-group">
                    <label>Select Arrival Time</label>
                    <div className="time-slots-container">
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Dinner Service
                      </span>
                      <div className="time-slots-row">
                        {DINNER_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`time-slot-btn ${timeSlot === slot ? 'active' : ''}`}
                            onClick={() => setTimeSlot(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>

                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.5rem' }}>
                        Lunch Service
                      </span>
                      <div className="time-slots-row">
                        {LUNCH_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`time-slot-btn ${timeSlot === slot ? 'active' : ''}`}
                            onClick={() => setTimeSlot(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 5: Contact Information */}
                  <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Contact Details</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="res-name">Full Name *</label>
                        <input
                          type="text"
                          id="res-name"
                          name="fullName"
                          className="form-input"
                          placeholder="e.g. Julian Hayes"
                          value={form.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="res-email">Email Address *</label>
                        <input
                          type="email"
                          id="res-email"
                          name="email"
                          className="form-input"
                          placeholder="e.g. julian@example.com"
                          value={form.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label htmlFor="res-phone">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        id="res-phone"
                        name="phone"
                        className="form-input"
                        placeholder="e.g. +1 (555) 345-6789"
                        value={form.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label htmlFor="res-requests">Special Dietary Notes or Seating Requests</label>
                      <textarea
                        id="res-requests"
                        name="specialRequests"
                        rows="3"
                        className="form-textarea"
                        placeholder="Anniversary champagne toast, allergies, high chair for toddler..."
                        value={form.specialRequests}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg btn-full"
                    disabled={isSubmitting}
                  >
                    <Calendar size={18} />
                    <span>{isSubmitting ? 'Confirming Your Reservation...' : 'Confirm Table Reservation'}</span>
                  </button>
                </form>
              </div>

              {/* Right: Live Preview Summary Card */}
              <div className="reservation-preview-card">
                <h3 className="preview-title">Reservation Summary</h3>

                <div className="preview-row">
                  <span>Number of Guests:</span>
                  <strong>{guests} {guests === 1 ? 'Guest' : 'Guests'}</strong>
                </div>

                <div className="preview-row">
                  <span>Selected Date:</span>
                  <strong>{date}</strong>
                </div>

                <div className="preview-row">
                  <span>Time Slot:</span>
                  <strong>{timeSlot}</strong>
                </div>

                <div className="preview-row">
                  <span>Seating Atmosphere:</span>
                  <strong>{seatingArea}</strong>
                </div>

                <div className="preview-row">
                  <span>Occasion:</span>
                  <strong>{occasion}</strong>
                </div>

                <div className="preview-disclaimer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', marginBottom: '0.4rem', fontWeight: 600 }}>
                    <ShieldCheck size={16} />
                    <span>Instant Automated Confirmation</span>
                  </div>
                  We hold reserved tables for 15 minutes past scheduled time before releasing to walk-in diners. Cancellations can be made anytime up to 2 hours prior without penalty.
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookTable;
