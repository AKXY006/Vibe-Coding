// src/pages/Contact.jsx
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Navigation, HelpCircle, Loader2 } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/foodData';
import { sendContactMessage } from '../services/contactService';
import { useToast } from '../context/ToastContext';
import './Contact.css';

const Contact = () => {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast('Please fill in your name, email and message.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await sendContactMessage(form);
      setSubmitted(true);
      showToast('Your message has been sent to our guest relations team!', 'success');
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (err) {
      showToast('Failed to send message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Header */}
      <section className="contact-hero">
        <div className="container">
          <span className="section-badge">Get in Touch</span>
          <h1 className="contact-hero-title">Contact & Directions</h1>
          <p className="contact-hero-desc">
            Have questions regarding private dining, events, or reservations? Our concierge team is here to assist you.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section">
        <div className="container">
          <div className="contact-layout-grid">
            {/* Left: Contact Info Cards */}
            <div className="contact-cards-column">
              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="contact-info-title">Our Location</h3>
                  <p className="contact-info-val">{RESTAURANT_INFO.address}</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '4px' }}>
                    Complimentary valet parking available at front driveway.
                  </p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="contact-info-title">Opening Hours</h3>
                  <p className="contact-info-val">{RESTAURANT_INFO.hours.weekday}</p>
                  <p className="contact-info-val">{RESTAURANT_INFO.hours.weekend}</p>
                  <p className="contact-info-val" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    {RESTAURANT_INFO.hours.brunch}
                  </p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="contact-info-title">Phone Reservations</h3>
                  <p className="contact-info-val">{RESTAURANT_INFO.phone}</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                    Phone lines open daily from 10:00 AM.
                  </p>
                </div>
              </div>

              <div className="contact-info-card">
                <div className="contact-info-icon">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="contact-info-title">Email Inquiries</h3>
                  <p className="contact-info-val">{RESTAURANT_INFO.email}</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                    Typically answered within 2 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Interactive Message Form */}
            <div className="contact-form-card">
              <h2 className="contact-form-title">Send a Direct Message</h2>
              <p className="contact-form-subtitle">
                Fill in the form below and our guest relations manager will follow up with you promptly.
              </p>

              {submitted ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Message Received!</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                    Thank you for reaching out. We have logged your request in our system and our team will get back to you shortly.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form className="contact-form-inner" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-name">Your Full Name *</label>
                      <input
                        type="text"
                        id="contact-name"
                        name="name"
                        className="form-input"
                        placeholder="e.g. Eleanor Vance"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-email">Email Address *</label>
                      <input
                        type="email"
                        id="contact-email"
                        name="email"
                        className="form-input"
                        placeholder="e.g. eleanor@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact-phone">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        id="contact-phone"
                        name="phone"
                        className="form-input"
                        placeholder="e.g. +1 (555) 234-5678"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-subject">Topic / Subject</label>
                      <select
                        id="contact-subject"
                        name="subject"
                        className="form-select"
                        value={form.subject}
                        onChange={handleChange}
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Private Event Booking">Private Event / Banquet</option>
                        <option value="Feedback / Experience">Dining Experience Feedback</option>
                        <option value="Chef Table Request">Chef's Table Special Request</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message">Your Message *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="5"
                      className="form-textarea"
                      placeholder="Please let us know how we can make your culinary visit extraordinary..."
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Sending to Server...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Interactive Map Card */}
          <div className="map-simulation-card">
            <div className="map-mockup-frame">
              <div className="map-grid-pattern" />
              <div className="map-pin-pulse">
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', margin: '0 auto', boxShadow: '0 0 0 10px rgba(230, 81, 0, 0.3)' }}>
                  <MapPin size={32} />
                </div>
                <div className="map-pin-btn">
                  <Navigation size={18} color="var(--primary)" />
                  <span>Savoria Bistro • 428 Gourmet Blvd, NY 10012</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ marginTop: '5rem' }}>
            <div className="section-header">
              <span className="section-badge">Frequently Asked</span>
              <h2 className="section-title">Common Questions</h2>
              <p className="section-subtitle">
                Everything you need to know prior to your arrival.
              </p>
            </div>

            <div className="faq-grid">
              <div className="faq-card">
                <h4><HelpCircle size={18} color="var(--primary)" /> Is there a dress code?</h4>
                <p>We embrace smart casual attire. We kindly request guests refrain from athletic wear, beachwear, or baseball caps in our main dining room during evening dinner service.</p>
              </div>

              <div className="faq-card">
                <h4><HelpCircle size={18} color="var(--primary)" /> Do you accommodate dietary restrictions?</h4>
                <p>Absolutely. Our menu clearly denotes vegetarian, non-vegetarian, dairy, nut, and gluten allergens. Please note any severe allergies in your reservation notes.</p>
              </div>

              <div className="faq-card">
                <h4><HelpCircle size={18} color="var(--primary)" /> Is parking available?</h4>
                <p>Yes, complimentary white-glove valet parking is offered at our main driveway entrance starting at 5:00 PM Tuesday through Sunday.</p>
              </div>

              <div className="faq-card">
                <h4><HelpCircle size={18} color="var(--primary)" /> Can I bring my own wine?</h4>
                <p>We permit up to two 750ml bottles of wine not represented on our current list, subject to a corkage fee of $35 per bottle.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
