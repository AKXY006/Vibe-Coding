// src/services/reservationService.js
// Table booking service ready for Spring Boot REST API integration (POST /api/reservations)

const RESERVATIONS_STORAGE_KEY = 'savoria_reservations';

export const createReservation = async (reservationData) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const confirmationNumber = 'SAV-' + Math.floor(100000 + Math.random() * 900000);
  const newReservation = {
    id: confirmationNumber,
    ...reservationData,
    createdAt: new Date().toISOString(),
    status: 'CONFIRMED',
  };

  try {
    const existing = JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]');
    existing.push(newReservation);
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save reservation locally:', err);
  }

  return newReservation;
};

export const getStoredReservations = () => {
  try {
    return JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};
