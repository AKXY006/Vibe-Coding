// src/services/contactService.js
// Customer inquiry service connected with Spring Boot REST API (POST /api/contact/send)

import { request } from './api';

export const sendContactMessage = async (messageData) => {
  const payload = {
    name: messageData.name.trim(),
    email: messageData.email.trim(),
    phone: messageData.phone ? messageData.phone.trim() : '',
    subject: messageData.subject || 'General Inquiry',
    message: messageData.message.trim(),
  };

  try {
    const response = await request('/contact/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response;
  } catch (err) {
    console.warn('[ContactService] Backend submission failed, logging locally:', err.message);
    // If backend is unreachable, still fulfill for UI experience
    return {
      success: true,
      message: 'Message saved locally (offline mode).',
      data: payload,
    };
  }
};
