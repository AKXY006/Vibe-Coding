package com.restaurant.service.impl;

import com.restaurant.dto.request.FoodRequest;
import com.restaurant.dto.response.FoodResponse;
import com.restaurant.entity.Food;
import com.restaurant.entity.FoodCategory;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.FoodRepository;
import com.restaurant.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {

    @Autowired
    private FoodRepository foodRepository;

    @Override
    @Transactional
    public FoodResponse addFood(FoodRequest request) {
        Food food = Food.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .image(request.getImage())
                .rating(request.getRating() != null ? request.getRating() : 4.5)
                .prepTime(request.getPrepTime())
                .calories(request.getCalories())
                .isVegetarian(request.getIsVegetarian() != null ? request.getIsVegetarian() : false)
                .isSpicy(request.getIsSpicy() != null ? request.getIsSpicy() : false)
                .isPopular(request.getIsPopular() != null ? request.getIsPopular() : false)
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .build();

        Food savedFood = foodRepository.save(food);
        return mapToFoodResponse(savedFood);
    }

    @Override
    @Transactional
    public FoodResponse updateFood(Long id, FoodRequest request) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));

        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setCategory(request.getCategory());
        if (request.getImage() != null) food.setImage(request.getImage());
        if (request.getRating() != null) food.setRating(request.getRating());
        if (request.getPrepTime() != null) food.setPrepTime(request.getPrepTime());
        if (request.getCalories() != null) food.setCalories(request.getCalories());
        if (request.getIsVegetarian() != null) food.setIsVegetarian(request.getIsVegetarian());
        if (request.getIsSpicy() != null) food.setIsSpicy(request.getIsSpicy());
        if (request.getIsPopular() != null) food.setIsPopular(request.getIsPopular());
        if (request.getIsAvailable() != null) food.setIsAvailable(request.getIsAvailable());

        Food updatedFood = foodRepository.save(food);
        return mapToFoodResponse(updatedFood);
    }

    @Override
    @Transactional
    public void deleteFood(Long id) {
        if (!foodRepository.existsById(id)) {
            throw new ResourceNotFoundException("Food item not found with id: " + id);
        }
        foodRepository.deleteById(id);
    }

    @Override
    public FoodResponse getFoodById(Long id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
        return mapToFoodResponse(food);
    }

    @Override
    public List<FoodResponse> getAllFoods(String categoryStr, String search, String sortBy, Boolean isPopular) {
        List<Food> foods = foodRepository.findAll();

        // Filter by category
        if (categoryStr != null && !categoryStr.isBlank() && !categoryStr.equalsIgnoreCase("all")) {
            FoodCategory category = parseCategory(categoryStr);
            if (category != null) {
                foods = foods.stream()
                        .filter(f -> f.getCategory() == category)
                        .collect(Collectors.toList());
            }
        }

        // Filter by search query
        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase().trim();
            foods = foods.stream()
                    .filter(f -> f.getName().toLowerCase().contains(lowerSearch) ||
                            (f.getDescription() != null && f.getDescription().toLowerCase().contains(lowerSearch)))
                    .collect(Collectors.toList());
        }

        // Filter by popular
        if (isPopular != null && isPopular) {
            foods = foods.stream()
                    .filter(f -> Boolean.TRUE.equals(f.getIsPopular()))
                    .collect(Collectors.toList());
        }

        // Sorting
        if (sortBy != null) {
            switch (sortBy.toLowerCase()) {
                case "price-low":
                case "price_asc":
                    foods.sort(Comparator.comparing(Food::getPrice));
                    break;
                case "price-high":
                case "price_desc":
                    foods.sort(Comparator.comparing(Food::getPrice).reversed());
                    break;
                case "rating":
                    foods.sort(Comparator.comparing(Food::getRating, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
                default:
                    // default order
                    break;
            }
        }

        return foods.stream()
                .map(this::mapToFoodResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FoodResponse> getFoodsByCategory(FoodCategory category) {
        return foodRepository.findByCategory(category).stream()
                .map(this::mapToFoodResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FoodResponse> getPopularFoods() {
        return foodRepository.findByIsPopularTrue().stream()
                .map(this::mapToFoodResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> getAllCategories() {
        return Arrays.stream(FoodCategory.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    private FoodCategory parseCategory(String categoryStr) {
        String normalized = categoryStr.trim().replace("-", "_").toUpperCase();
        try {
            return FoodCategory.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private FoodResponse mapToFoodResponse(Food food) {
        return FoodResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .description(food.getDescription())
                .price(food.getPrice())
                .category(food.getCategory())
                .image(food.getImage())
                .rating(food.getRating())
                .prepTime(food.getPrepTime())
                .calories(food.getCalories())
                .isVegetarian(food.getIsVegetarian())
                .isSpicy(food.getIsSpicy())
                .isPopular(food.getIsPopular())
                .isAvailable(food.getIsAvailable())
                .createdAt(food.getCreatedAt())
                .build();
    }
}
