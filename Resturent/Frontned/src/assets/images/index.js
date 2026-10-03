// src/assets/images/index.js
// Reliable fallback image generators and placeholders

export const FOOD_FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%231e293b"><rect width="600" height="400" fill="%231e293b"/><circle cx="300" cy="200" r="100" fill="%23e65100" opacity="0.15"/><path d="M260 200 C260 170 340 170 340 200 L340 240 L260 240 Z" fill="%23e65100"/><text x="300" y="270" font-family="sans-serif" font-size="20" fill="%23cbd5e1" text-anchor="middle" font-weight="600">Savoria Gourmet Dish</text></svg>';

export const CHEF_FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%231e293b"><rect width="400" height="400" fill="%230f172a"/><circle cx="200" cy="160" r="60" fill="%23334155"/><path d="M120 320 C120 250 280 250 280 320 Z" fill="%23334155"/><text x="200" y="360" font-family="sans-serif" font-size="16" fill="%2394a3b8" text-anchor="middle">Savoria Master Chef</text></svg>';

export const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = FOOD_FALLBACK_IMAGE;
};
