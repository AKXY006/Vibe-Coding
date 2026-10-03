// src/services/foodService.js
// Food data service ready for Spring Boot REST API integration (GET /api/foods, GET /api/foods/{id})

import { foodItems } from '../data/foodData';

/**
 * Fetch all food items with optional category and search filters
 * When Spring Boot is ready: return request('/foods' + queryParams);
 */
export const getFoods = async ({ category = 'all', search = '', sortBy = 'default' } = {}) => {
  // Simulate brief network latency for realistic feel
  await new Promise((resolve) => setTimeout(resolve, 80));

  let results = [...foodItems];

  if (category && category.toLowerCase() !== 'all') {
    results = results.filter(
      (item) => item.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase() ||
                item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search && search.trim() !== '') {
    const term = search.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(term))
    );
  }

  // Sorting
  if (sortBy === 'price-low') {
    results.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    results.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  }

  return results;
};

/**
 * Fetch a single food item by ID
 * When Spring Boot is ready: return request(`/foods/${id}`);
 */
export const getFoodById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 60));
  const numericId = Number(id);
  const found = foodItems.find((item) => item.id === numericId);
  if (!found) {
    throw new Error(`Dish with ID ${id} not found.`);
  }
  return found;
};

/**
 * Get popular dishes for homepage showcases
 */
export const getPopularDishes = async (limit = 6) => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return foodItems.filter((item) => item.isPopular).slice(0, limit);
};
