// src/services/orderService.js
// Online ordering service ready for Spring Boot REST API integration (POST /api/orders)

const ORDERS_STORAGE_KEY = 'savoria_orders';

export const placeOrder = async (orderData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    id: orderId,
    ...orderData,
    placedAt: new Date().toISOString(),
    status: 'PREPARING',
    estimatedTime: '30-40 mins'
  };

  try {
    const existing = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    existing.unshift(newOrder);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save order locally:', err);
  }

  return newOrder;
};

export const getOrderHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};
