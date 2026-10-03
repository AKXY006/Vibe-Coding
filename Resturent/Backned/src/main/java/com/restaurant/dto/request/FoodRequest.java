package com.restaurant.dto.request;

import com.restaurant.entity.FoodCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodRequest {

    @NotBlank(message = "Food name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private Double price;

    @NotNull(message = "Category is required")
    private FoodCategory category;

    private String image;

    @Builder.Default
    private Double rating = 4.5;

    private String prepTime;

    private Integer calories;

    @Builder.Default
    private Boolean isVegetarian = false;

    @Builder.Default
    private Boolean isSpicy = false;

    @Builder.Default
    private Boolean isPopular = false;

    @Builder.Default
    private Boolean isAvailable = true;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public FoodCategory getCategory() { return category; }
    public void setCategory(FoodCategory category) { this.category = category; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getPrepTime() { return prepTime; }
    public void setPrepTime(String prepTime) { this.prepTime = prepTime; }
    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }
    public Boolean getIsVegetarian() { return isVegetarian; }
    public void setIsVegetarian(Boolean vegetarian) { isVegetarian = vegetarian; }
    public Boolean getIsSpicy() { return isSpicy; }
    public void setIsSpicy(Boolean spicy) { isSpicy = spicy; }
    public Boolean getIsPopular() { return isPopular; }
    public void setIsPopular(Boolean popular) { isPopular = popular; }
    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean available) { isAvailable = available; }
}
