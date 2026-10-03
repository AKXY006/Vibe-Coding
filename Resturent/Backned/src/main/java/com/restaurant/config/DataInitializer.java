package com.restaurant.config;

import com.restaurant.entity.*;
import com.restaurant.repository.CartRepository;
import com.restaurant.repository.FoodRepository;
import com.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedFoods();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@restaurant.com")) {
            User admin = User.builder()
                    .name("Restaurant Admin")
                    .email("admin@restaurant.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+91 98765 43210")
                    .address("101 Gourmet Avenue, Food City")
                    .role(Role.ROLE_ADMIN)
                    .build();
            User savedAdmin = userRepository.save(admin);
            cartRepository.save(Cart.builder().user(savedAdmin).build());
        }

        if (!userRepository.existsByEmail("user@restaurant.com")) {
            User customer = User.builder()
                    .name("Rahul Sharma")
                    .email("user@restaurant.com")
                    .password(passwordEncoder.encode("user123"))
                    .phone("+91 91234 56789")
                    .address("Flat 4B, Green Valley Apartments, Mumbai")
                    .role(Role.ROLE_USER)
                    .build();
            User savedCustomer = userRepository.save(customer);
            cartRepository.save(Cart.builder().user(savedCustomer).build());
        }
    }

    private void seedFoods() {
        if (foodRepository.count() > 0) {
            return;
        }

        List<Food> initialFoods = Arrays.asList(
                // STARTERS
                Food.builder()
                        .name("Crispy Truffle Fries")
                        .description("Hand-cut golden potatoes tossed in black truffle oil, fresh rosemary, and grated aged parmesan.")
                        .price(299.0)
                        .category(FoodCategory.STARTERS)
                        .image("https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80")
                        .rating(4.8)
                        .prepTime("15 mins")
                        .calories(420)
                        .isVegetarian(true)
                        .isSpicy(false)
                        .isPopular(true)
                        .isAvailable(true)
                        .build(),

                Food.builder()
                        .name("Spicy Peri Peri Chicken Wings")
                        .description("Succulent chicken wings glazed in artisanal African birds eye chili sauce and grilled to perfection.")
                        .price(399.0)
                        .category(FoodCategory.STARTERS)
                        .image("https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80")
                        .rating(4.9)
                        .prepTime("20 mins")
                        .calories(540)
                        .isVegetarian(false)
                        .isSpicy(true)
                        .isPopular(true)
                        .isAvailable(true)
                        .build(),

                Food.builder()
                        .name("Paneer Tikka Royale")
                        .description("Tender cottage cheese cubes marinated in tandoori spices and smoked in a clay oven with bell peppers.")
                        .price(349.0)
                        .category(FoodCategory.STARTERS)
                        .image("https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80")
                        .rating(4.7)
                        .prepTime("20 mins")
                        .calories(380)
                        .isVegetarian(true)
                        .isSpicy(true)
                        .isPopular(false)
                        .isAvailable(true)
                        .build(),

                // PIZZA
                Food.builder()
                        .name("Margherita Di Burrata")
                        .description("San Marzano tomato sauce, imported fresh burrata, sweet basil leaves, and cold-pressed extra virgin olive oil.")
                        .price(499.0)
                        .category(FoodCategory.PIZZA)
                        .image("https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80")
                        .rating(4.9)
                        .prepTime("20 mins")
                        .calories(780)
                        .isVegetarian(true)
                        .isSpicy(false)
                        .isPopular(true)
                        .isAvailable(true)
                        .build(),

                Food.builder()
                        .name("Fiery Pepperoni & Jalapeno")
                        .description("Double smoked pepperoni slices, pickled jalapenos, mozzarella, and spicy hot honey drizzle on sourdough crust.")
                        .price(599.0)
                        .category(FoodCategory.PIZZA)
                        .image("https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80")
                        .rating(4.8)
                        .prepTime("25 mins")
                        .calories(890)
                        .isVegetarian(false)
                        .isSpicy(true)
                        .isPopular(true)
                        .isAvailable(true)
                        .build(),

                // PASTA
                Food.builder()
                        .name("Creamy Fettuccine Alfredo")
                        .description("Al dente fettuccine ribbon pasta enveloped in velvety rich garlic parmesan cream sauce and wild mushrooms.")
                        .price(449.0)
                        .category(FoodCategory.PASTA)
                        .image("https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80")
                        .rating(4.7)
                        .prepTime("18 mins")
                        .calories(650)
                        .isVegetarian(true)
                        .isSpicy(false)
                        .isPopular(true)
                        .isAvailable(true)
                        .build(),

                Food.builder()
                        .name("Penne Arbiata Piccante")
                        .description("Classic tube pasta in spicy crushed San Marzano tomato sauce, fresh garlic, red chili flakes, and black olives.")
                        .price(419.0)
                        .category(FoodCategory.PASTA)
                        .image("https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80")
                        .rating(4.6)
                        .prepTime("18 mins")
                        .calories(520)
                        .isVegetarian(true)
                        .isSpicy(true)
                        .isPopular(false)
                        .isAvailable(true)
                        .build(),

                // MAIN COURSE
                Food.builder()
                        .name("Butter Chicken Deluxe with Naan")
                        .description("Succulent tandoor-roasted chicken simmered in rich creamy tomato and cashew nut gravy served with butter naan.")
                        .price(549.0)
                        .category(FoodCategory.MAIN_COURSE)
                        .image("https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80")
                        .rating(5.0)
                        .prepTime("25 mins")
                        .calories(820)
                        .isVegetarian(false)
                        .isSpicy(false)
                        .isPopular(true)
                        .isAvailable(true)
                        .build(),

                Food.builder()
                        .name("Grilled Atlantic Herb Salmon")
                        .description("Pan-seared Atlantic salmon fillet with lemon herb butter sauce, asparagus spears, and garlic mashed potatoes.")
                        .price(799.0)
                        .category(FoodCategory.MAIN_COURSE)
                        .image("https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80")
                        .rating(4.9)
                        .prepTime("25 mins")
                        .calories(610)
                        .isVegetarian(false)
                        .isSpicy(false)
                        .isPopular(true)
                        .isAvailable(true)
                        .build(),

                Food.builder()
                        .name("Dal Makhani & Basmati Rice")
                        .description("Black lentils slow cooked overnight on charcoal embers with butter, cream, and aromatic spices.")
                        .price(399.0)
                        .category(FoodCategory.MAIN_COURSE)
                        .image("https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80")
                        .rating(4.8)
                        .prepTime("20 mins")
                        .calories(580)
                        .isVegetarian(true)
                        .isSpicy(false)
                        .isPopular(false)
                        .isAvailable(true)
                        .build(),

                // DESSERTS
                Food.builder()
                        .name("Belgian Molten Chocolate Lava")
                        .description("Warm dark Belgian chocolate cake with a molten liquid center, served with Madagascan vanilla bean gelato.")
                        .price(299.0)
                        .category(FoodCategory.DESSERTS)
                        .image("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80")
                        .rating(4.9)
                        .prepTime("12 mins")
                        .calories(480)
                        .isVegetarian(true)
                        .isSpicy(false)
                        .isPopular(true)
                        .isAvailable(true)
                        .build(),

                Food.builder()
                        .name("Classic New York Cheesecake")
                        .description("Velvety smooth cream cheese baked over butter graham cracker crust, topped with wild berry compote.")
                        .price(329.0)
                        .category(FoodCategory.DESSERTS)
                        .image("https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80")
                        .rating(4.8)
                        .prepTime("10 mins")
                        .calories(420)
                        .isVegetarian(true)
                        .isSpicy(false)
                        .isPopular(false)
                        .isAvailable(true)
                        .build(),

                // DRINKS
                Food.builder()
                        .name("Berry Basil Sparkler")
                        .description("Fresh muddled blackberries, sweet basil, sparkling tonic, fresh lime juice, and organic agave nectar.")
                        .price(199.0)
                        .category(FoodCategory.DRINKS)
                        .image("https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80")
                        .rating(4.8)
                        .prepTime("5 mins")
                        .calories(120)
                        .isVegetarian(true)
                        .isSpicy(false)
                        .isPopular(true)
                        .isAvailable(true)
                        .build(),

                Food.builder()
                        .name("Iced Caramel Macchiato")
                        .description("Espresso layered over cold vanilla milk, poured over ice and drizzled with buttery salted caramel.")
                        .price(229.0)
                        .category(FoodCategory.DRINKS)
                        .image("https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80")
                        .rating(4.7)
                        .prepTime("5 mins")
                        .calories(190)
                        .isVegetarian(true)
                        .isSpicy(false)
                        .isPopular(false)
                        .isAvailable(true)
                        .build()
        );

        foodRepository.saveAll(initialFoods);
    }
}
