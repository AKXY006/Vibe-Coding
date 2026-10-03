# 🍽️ Restaurant Management & Food Ordering Backend

Enterprise-grade RESTful API backend built with **Java 21**, **Spring Boot 3.3.4**, **Spring Data JPA (Hibernate)**, **Spring Security 6 with JWT**, and **MySQL**.

---

## 🚀 Key Features & Highlights

1. **Layered Architecture**: Strict separation of concerns — `Controller` ➔ `Service` / `ServiceImpl` ➔ `Repository` ➔ `Entity`, decoupled via dedicated `DTO`s.
2. **Spring Security & Stateless JWT**: Secure authentication with HMAC-SHA512 tokens, role-based authorization (`ROLE_USER`, `ROLE_ADMIN`).
3. **Menu & Categories**: Full catalog supporting Starters, Pizza, Pasta, Main Course, Desserts, and Drinks with dietary filters (Veg/Spicy/Popular).
4. **Persistent Cart System**: Per-user shopping cart supporting addition, quantity adjustment, deletion, and auto-calculation.
5. **Billing & Order Tracking**: Complete order lifecycle (`PENDING` ➔ `CONFIRMED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` ➔ `CANCELLED`) with automated GST & delivery charges.
6. **Table Reservation System**: Real-time table booking with date, time slot, guest counts, and status tracking.
7. **Contact / Feedback Enquiries**: Customer message management with unread/read state for admins.
8. **Auto Data Initializer**: On first launch, automatically seeds admin (`admin@restaurant.com`), demo customer (`user@restaurant.com`), and 12+ gourmet dishes.
9. **CORS Configured**: Plug-and-play compatibility with Vite / React frontend running on `http://localhost:5173`.

---

## 🗄️ MySQL Database Setup

1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or terminal) and execute:
```sql
CREATE DATABASE IF NOT EXISTS restaurant_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

2. Configure your credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```
*(Hibernate `ddl-auto=update` will automatically generate all tables, foreign keys, and indexes on first launch).*

---

## 🏃 How to Build and Run

### Prerequisites
- **Java JDK 21+** installed and added to `PATH`.
- **Maven 3.8+** installed (or your IDE's embedded Maven).
- **MySQL 8.x+** running on port `3306`.

### Running with Maven
From the `Backned/` directory:
```bash
# Clean and compile
mvn clean compile

# Run the Spring Boot application
mvn spring-boot:run
```

Once started, the backend will be available at:
`http://localhost:8080/api`

---

## 👤 Pre-seeded Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@restaurant.com` | `admin123` | Full admin privileges (Manage Menu, Update Order Status, Manage Reservations) |
| **User** | `user@restaurant.com` | `user123` | Cart, Place Orders, Book Tables, Profile Management |

---

## 📡 Complete REST API Documentation

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile |

#### Request: Register (`POST /api/auth/register`)
```json
{
  "name": "Aarav Patel",
  "email": "aarav@example.com",
  "password": "password123",
  "phone": "+91 9876543210",
  "address": "22 Park Street, Kolkata"
}
```

#### Request: Login (`POST /api/auth/login`)
```json
{
  "email": "user@restaurant.com",
  "password": "user123"
}
```

---

### 2. User Management (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Authenticated | Get profile of logged-in user |
| `GET` | `/api/users/{id}` | Authenticated | Get user details by ID |
| `PUT` | `/api/users/{id}` | Authenticated | Update user name, phone, address |
| `DELETE` | `/api/users/{id}` | Admin | Delete user account |
| `GET` | `/api/users/all` | Admin | Get list of all registered users |

---

### 3. Food & Menu APIs (`/api/foods`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/foods` | Public | List all dishes (supports `?category=PIZZA&search=burrata&sortBy=price-low&isPopular=true`) |
| `GET` | `/api/foods/{id}` | Public | Get food item details by ID |
| `GET` | `/api/foods/category/{category}` | Public | Get items by category (`STARTERS`, `PIZZA`, `PASTA`, `MAIN_COURSE`, `DESSERTS`, `DRINKS`) |
| `GET` | `/api/foods/categories` | Public | Get list of all category names |
| `GET` | `/api/foods/popular` | Public | Get popular/featured dishes |
| `POST` | `/api/foods` | Admin | Add new food item |
| `PUT` | `/api/foods/{id}` | Admin | Update food item details |
| `DELETE` | `/api/foods/{id}` | Admin | Remove food item |

#### Request: Add Food Item (`POST /api/foods`)
```json
{
  "name": "Classic Lasagna Bolognese",
  "description": "Layered pasta sheets with rich slow-cooked beef ragu, creamy bechamel, and melted parmesan.",
  "price": 529.0,
  "category": "PASTA",
  "image": "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80",
  "rating": 4.9,
  "prepTime": "25 mins",
  "calories": 710,
  "isVegetarian": false,
  "isSpicy": false,
  "isPopular": true,
  "isAvailable": true
}
```

---

### 4. Cart APIs (`/api/cart`)
*Headers required: `Authorization: Bearer <jwt_token>`*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Authenticated | Get user's current cart and total |
| `POST` | `/api/cart/add` | Authenticated | Add food item to cart |
| `PUT` | `/api/cart/update` | Authenticated | Update item quantity in cart |
| `DELETE` | `/api/cart/remove/{cartItemId}` | Authenticated | Remove specific item |
| `DELETE` | `/api/cart/clear` | Authenticated | Clear entire cart |

#### Request: Add to Cart (`POST /api/cart/add`)
```json
{
  "foodId": 1,
  "quantity": 2
}
```

#### Request: Update Quantity (`PUT /api/cart/update`)
```json
{
  "cartItemId": 1,
  "quantity": 3
}
```

---

### 5. Orders APIs (`/api/orders`)
*Headers required: `Authorization: Bearer <jwt_token>`*

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders/create` | Authenticated | Place a new order (from cart or custom items) |
| `GET` | `/api/orders/{id}` | Authenticated | Get order details by ID |
| `GET` | `/api/orders/number/{orderNumber}` | Authenticated | Track order by order number |
| `GET` | `/api/orders/my-orders` | Authenticated | Get all orders of current logged-in user |
| `GET` | `/api/orders/user/{userId}` | Authenticated | Get orders of a specific user |
| `GET` | `/api/orders/all` | Admin | Get all restaurant orders |
| `PUT` | `/api/orders/{id}/status` | Admin | Update order status |

#### Request: Place Order (`POST /api/orders/create`)
```json
{
  "customerName": "Rahul Sharma",
  "customerPhone": "+91 9123456789",
  "deliveryAddress": "Flat 4B, Green Valley Apartments, Mumbai",
  "notes": "Ring the bell twice, please provide extra napkins",
  "paymentMethod": "COD",
  "clearCartAfterOrder": true
}
```

#### Request: Update Order Status (`PUT /api/orders/1/status`)
```json
{
  "status": "PREPARING"
}
```
*Valid statuses: `PENDING`, `CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`*

---

### 6. Table Reservation APIs (`/api/reservations`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reservations/book` | Public / Auth | Book a dining table |
| `GET` | `/api/reservations/{id}` | Authenticated | Get reservation by ID |
| `GET` | `/api/reservations/my-reservations` | Authenticated | Get logged-in user's bookings |
| `GET` | `/api/reservations/user/{userId}` | Authenticated | Get bookings for a specific user |
| `GET` | `/api/reservations/all` | Admin | Get all table reservations |
| `PUT` | `/api/reservations/{id}/status` | Admin | Update reservation status |
| `DELETE` | `/api/reservations/{id}` | Authenticated | Cancel reservation |

#### Request: Book Table (`POST /api/reservations/book`)
```json
{
  "customerName": "Pooja Verma",
  "customerEmail": "pooja@example.com",
  "customerPhone": "+91 9811122233",
  "guests": 4,
  "reservationDate": "2026-10-15",
  "reservationTime": "19:30:00",
  "tableType": "Rooftop Romantic",
  "specialRequests": "Anniversary celebration, window table preferred"
}
```

---

### 7. Contact / Customer Enquiry APIs (`/api/contact`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/contact/send` | Public | Submit contact / enquiry form |
| `GET` | `/api/contact/all` | Admin | View all submitted enquiries |
| `PUT` | `/api/contact/{id}/read` | Admin | Mark message as read |
| `DELETE` | `/api/contact/{id}` | Admin | Delete enquiry |

#### Request: Submit Enquiry (`POST /api/contact/send`)
```json
{
  "name": "Karan Malhotra",
  "email": "karan@example.com",
  "phone": "+91 9777788888",
  "subject": "Private Banquet Hall Enquiry",
  "message": "We would like to host a birthday party for 25 people next weekend. Please share package details."
}
```

---

## 🔗 Connecting with the React Frontend

In `Frontned/src/services/api.js`, make sure the base URL points to the backend:
```javascript
export const API_BASE_URL = 'http://localhost:8080/api';
```

When calling authenticated endpoints, pass the JWT token in the `Authorization` header:
```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```
