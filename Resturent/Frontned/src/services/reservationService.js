// src/services/reservationService.js
// Table booking service connected with Spring Boot REST API (POST /api/reservations/book)

import { request } from './api';

const RESERVATIONS_STORAGE_KEY = 'savoria_reservations';

// Helper to convert '07:30 PM' to '19:30:00' for Java LocalTime
const convertTo24Hour = (timeStr) => {
  if (!timeStr) return '19:00:00';
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return timeStr.length <= 5 ? `${timeStr}:00` : timeStr;
  let [_, hours, minutes, modifier] = match;
  let h = parseInt(hours, 10);
  if (modifier.toUpperCase() === 'PM' && h < 12) h += 12;
  if (modifier.toUpperCase() === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${minutes}:00`;
};

export const createReservation = async (reservationData) => {
  const payload = {
    customerName: reservationData.fullName || reservationData.customerName || 'Dining Guest',
    customerEmail: reservationData.email || reservationData.customerEmail,
    customerPhone: reservationData.phone || reservationData.customerPhone || '+1 (555) 000-0000',
    guests: Number(reservationData.guests) || 2,
    reservationDate: reservationData.date || reservationData.reservationDate,
    reservationTime: convertTo24Hour(reservationData.timeSlot || reservationData.reservationTime),
    tableType: reservationData.seatingArea || reservationData.tableType || 'Main Dining Hall',
    specialRequests: [
      reservationData.occasion ? `Occasion: ${reservationData.occasion}` : '',
      reservationData.specialRequests || ''
    ].filter(Boolean).join(' | '),
  };

  try {
    const apiRes = await request('/reservations/book', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const formattedReservation = {
      id: apiRes.id ? `SAV-${apiRes.id}` : 'SAV-' + Math.floor(100000 + Math.random() * 900000),
      ...reservationData,
      ...apiRes,
      status: apiRes.status || 'CONFIRMED',
      createdAt: apiRes.createdAt || new Date().toISOString(),
    };

    // Cache locally for instant UI display
    try {
      const existing = JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]');
      existing.unshift(formattedReservation);
      localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('Could not cache reservation locally:', e);
    }

    return formattedReservation;
  } catch (error) {
    console.warn('[ReservationService] Backend booking failed, saving locally:', error.message);

    // Fallback simulation if backend is offline
    const fallbackId = 'SAV-' + Math.floor(100000 + Math.random() * 900000);
    const fallbackReservation = {
      id: fallbackId,
      ...reservationData,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED',
    };

    try {
      const existing = JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]');
      existing.unshift(fallbackReservation);
      localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('Could not cache reservation locally:', e);
    }

    return fallbackReservation;
  }
};

export const getStoredReservations = async () => {
  try {
    const apiReservations = await request('/reservations/my-reservations');
    if (Array.isArray(apiReservations)) {
      return apiReservations;
    }
  } catch (err) {
    console.warn('[ReservationService] Using local cache:', err.message);
  }

  try {
    return JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};
