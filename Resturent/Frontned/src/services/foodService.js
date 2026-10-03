// src/services/foodService.js
// Food data service connected with Spring Boot REST API (/api/foods)

import { request } from './api';
import { foodItems as fallbackDishes } from '../data/foodData';

// Helper to normalize backend Food entity into frontend structure
export const normalizeFood = (item) => {
  if (!item) return null;

  // Convert ENUM category (e.g. MAIN_COURSE) to display title (Main Course)
  const formatCategory = (cat) => {
    if (!cat) return 'Starters';
    return cat
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formattedCat = formatCategory(item.category);

  return {
    ...item,
    category: formattedCat,
    categoryKey: item.category,
    isVeg: item.isVegetarian !== undefined ? item.isVegetarian : Boolean(item.isVeg),
    isChefSpecial: item.isPopular !== undefined ? item.isPopular : Boolean(item.isChefSpecial),
    rating: item.rating || 4.8,
    reviewsCount: item.reviewsCount || Math.floor((item.rating || 4.5) * 28),
    prepTime: item.prepTime || '15-20 mins',
    calories: item.calories ? `${item.calories} kcal` : '420 kcal',
    ingredients: item.ingredients || [
      'Artisanal herbs',
      'Cold-pressed virgin olive oil',
      'Flaky sea salt',
      'Organic harvest seasonings'
    ],
    nutrition: item.nutrition || {
      calories: item.calories || 420,
      protein: '18g',
      carbs: '38g',
      fats: '14g'
    },
    allergens: item.allergens || []
  };
};

/**
 * Fetch all food items with optional category, search, and sorting
 * GET /api/foods?category=&search=&sortBy=
 */
export const getFoods = async ({ category = 'all', search = '', sortBy = 'default' } = {}) => {
  try {
    const params = new URLSearchParams();
    if (category && category.toLowerCase() !== 'all') {
      const normalizedCat = category.replace(/\s+/g, '_').toUpperCase();
      params.append('category', normalizedCat);
    }
    if (search && search.trim() !== '') {
      params.append('search', search.trim());
    }
    if (sortBy && sortBy !== 'default') {
      params.append('sortBy', sortBy);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    const apiFoods = await request(`/foods${query}`);

    if (Array.isArray(apiFoods) && apiFoods.length > 0) {
      return apiFoods.map(normalizeFood);
    }
  } catch (error) {
    console.warn('[FoodService] Backend offline, falling back to local dataset:', error.message);
  }

  // Graceful fallback to rich local dataset if backend is currently launching
  let results = [...fallbackDishes];
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
        (item.ingredients && item.ingredients.some((ing) => ing.toLowerCase().includes(term)))
    );
  }
  if (sortBy === 'price-low') {
    results.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    results.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  }
  return results.map(normalizeFood);
};

/**
 * Fetch a single food item by ID
 * GET /api/foods/{id}
 */
export const getFoodById = async (id) => {
  try {
    const apiFood = await request(`/foods/${id}`);
    if (apiFood) {
      return normalizeFood(apiFood);
    }
  } catch (error) {
    console.warn(`[FoodService] Failed to fetch food #${id} from backend, using fallback:`, error.message);
  }

  const numericId = Number(id);
  const found = fallbackDishes.find((item) => item.id === numericId);
  if (!found) {
    throw new Error(`Dish with ID ${id} not found.`);
  }
  return normalizeFood(found);
};

/**
 * Fetch popular / featured dishes
 * GET /api/foods/popular
 */
export const getPopularDishes = async (limit = 6) => {
  try {
    const apiPopular = await request('/foods/popular');
    if (Array.isArray(apiPopular) && apiPopular.length > 0) {
      return apiPopular.slice(0, limit).map(normalizeFood);
    }
  } catch (error) {
    console.warn('[FoodService] Failed to fetch popular dishes from backend, using fallback:', error.message);
  }

  return fallbackDishes.filter((item) => item.isPopular).slice(0, limit).map(normalizeFood);
};
