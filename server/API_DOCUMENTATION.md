# Billing Software System — Team 2

## Products, Categories & Inventory Management

A MERN Stack module for managing products, product categories, inventory stock levels, and low-stock detection as part of the Billing Software System.

---

# 1. Project Overview

The Team 2 module provides backend APIs and React frontend screens for:

- Product Management
- Category Management
- Inventory Management
- Stock Adjustment
- Low-Stock Detection
- Product Search and Filtering
- Category Search and Filtering
- Product and Category Relationship
- Validation and Error Handling

The module is developed using the MERN stack.

---

# 2. Technology Stack

| Technology | Purpose |
|---|---|
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| Express.js | Backend API framework |
| Node.js | Backend runtime |
| React.js | Frontend |
| Vite | Frontend development server |
| Postman | API testing |
| Git & GitHub | Version control |

### Backend

```text
Node.js
Express.js
MongoDB
Mongoose
CORS
dotenv
```

### Frontend

```text
React.js
Vite
JavaScript
CSS
```

---

# 3. Module Scope

The Team 2 module contains three major areas:

```text
Products
    |
    ├── Create Product
    ├── View Products
    ├── Update Product
    ├── Delete Product
    ├── Search Product
    ├── Filter Product
    └── Low Stock Detection

Categories
    |
    ├── Create Category
    ├── View Categories
    ├── Update Category
    ├── Deactivate Category
    ├── Search Category
    └── Filter by Status

Inventory
    |
    ├── View Inventory
    ├── View Inventory Summary
    ├── Low Stock Products
    ├── Add Stock
    ├── Subtract Stock
    ├── Set Stock
    ├── Search Inventory
    └── Filter Inventory
```

---

# 4. Project Structure

```text
Billing-Software-System-Team-2/
│
├── server/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   └── inventoryController.js
│   │
│   ├── models/
│   │   ├── category.js
│   │   ├── product.js
│   │   └── inventory.js
│   │
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   └── inventoryRoutes.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── API_DOCUMENTATION.md
│   └── .env
│
├── client/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Products.jsx
│   │   │   ├── Categories.jsx
│   │   │   └── Inventory.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
└── README.md
```

---

# 5. Backend Architecture

The backend follows a basic MVC-style structure.

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Model
   ↓
MongoDB
   ↓
Response
```

### Example

```text
POST /api/products
        ↓
productRoutes.js
        ↓
productController.js
        ↓
Product model
        ↓
MongoDB
```

---

# 6. Server Configuration

The backend server runs on:

```text
http://localhost:5000
```

API base URL:

```text
http://localhost:5000/api
```

The main Express application is configured in:

```text
server/app.js
```

The server is started from:

```text
server/server.js
```

---

# 7. Backend Routes

The application currently exposes:

```text
/api/products
/api/categories
/api/inventory
```

### Product Routes

```text
/api/products
```

### Category Routes

```text
/api/categories
```

### Inventory Routes

```text
/api/inventory
```

---

# 8. Database Models

## 8.1 Product Model

The Product model contains the following fields:

| Field | Type | Required | Validation |
|---|---|---|---|
| productName | String | Yes | Required |
| sku | String | Yes | Unique, uppercase |
| category | ObjectId | Yes | References Category |
| purchasePrice | Number | Yes | Minimum 0 |
| sellingPrice | Number | Yes | Minimum 0 |
| taxRate | Number | No | 0, 5, 12 or 18 |
| stockQuantity | Number | Yes | Minimum 0 |
| minimumStock | Number | Yes | Minimum 0 |
| status | String | No | ACTIVE / INACTIVE |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# 9. Category Model

The Category model contains:

| Field | Type | Required | Validation |
|---|---|---|---|
| name | String | Yes | Unique, 2-50 characters |
| description | String | No | Maximum 200 characters |
| status | String | No | ACTIVE / INACTIVE |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

# 10. Product and Category Relationship

Each product belongs to a category.

The Product model stores the MongoDB ObjectId of the Category.

```text
Category
   |
   | _id
   ↓
Product.category
```

Example:

### Category

```json
{
  "_id": "CATEGORY_ID",
  "name": "Electronics",
  "description": "Electronic products",
  "status": "ACTIVE"
}
```

### Product

```json
{
  "productName": "Laptop",
  "sku": "LAP-001",
  "category": "CATEGORY_ID",
  "purchasePrice": 40000,
  "sellingPrice": 45000,
  "taxRate": 18,
  "stockQuantity": 10,
  "minimumStock": 2,
  "status": "ACTIVE"
}
```

---

# 11. Product APIs

## Product API Summary

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

---

# 12. Get All Products

### Method

```text
GET
```

### Endpoint

```text
/api/products
```

### Full URL

```text
http://localhost:5000/api/products
```

### Response

```json
[
  {
    "_id": "PRODUCT_ID",
    "productName": "Laptop",
    "sku": "LAP-001",
    "category": "CATEGORY_ID",
    "purchasePrice": 40000,
    "sellingPrice": 45000,
    "taxRate": 18,
    "stockQuantity": 10,
    "minimumStock": 2,
    "status": "ACTIVE"
  }
]
```

---

# 13. Get Product by ID

### Method

```text
GET
```

### Endpoint

```text
/api/products/:id
```

### Example

```text
GET /api/products/PRODUCT_ID
```

### Success

```json
{
  "_id": "PRODUCT_ID",
  "productName": "Laptop",
  "sku": "LAP-001",
  "category": "CATEGORY_ID",
  "purchasePrice": 40000,
  "sellingPrice": 45000,
  "taxRate": 18,
  "stockQuantity": 10,
  "minimumStock": 2,
  "status": "ACTIVE"
}
```

### Product Not Found

```json
{
  "message": "Product not found"
}
```

---

# 14. Create Product

### Method

```text
POST
```

### Endpoint

```text
/api/products
```

### Header

```text
Content-Type: application/json
```

### Request Body

```json
{
  "productName": "Laptop",
  "sku": "LAP-001",
  "category": "CATEGORY_ID",
  "purchasePrice": 40000,
  "sellingPrice": 45000,
  "taxRate": 18,
  "stockQuantity": 10,
  "minimumStock": 2,
  "status": "ACTIVE"
}
```

### Success Response

```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "PRODUCT_ID",
    "productName": "Laptop",
    "sku": "LAP-001",
    "category": "CATEGORY_ID",
    "purchasePrice": 40000,
    "sellingPrice": 45000,
    "taxRate": 18,
    "stockQuantity": 10,
    "minimumStock": 2,
    "status": "ACTIVE"
  }
}
```

### Duplicate SKU

```json
{
  "message": "SKU already exists"
}
```

---

# 15. Update Product

### Method

```text
PUT
```

### Endpoint

```text
/api/products/:id
```

### Example

```text
PUT /api/products/PRODUCT_ID
```

### Request Body

```json
{
  "productName": "Updated Laptop",
  "sellingPrice": 48000,
  "taxRate": 18,
  "stockQuantity": 15,
  "minimumStock": 3,
  "status": "ACTIVE"
}
```

### Success Response

```json
{
  "message": "Product updated successfully",
  "product": {
    "_id": "PRODUCT_ID",
    "productName": "Updated Laptop",
    "sellingPrice": 48000,
    "taxRate": 18,
    "stockQuantity": 15,
    "minimumStock": 3,
    "status": "ACTIVE"
  }
}
```

---

# 16. Delete Product

### Method

```text
DELETE
```

### Endpoint

```text
/api/products/:id
```

### Example

```text
DELETE /api/products/PRODUCT_ID
```

### Success Response

```json
{
  "message": "Product deleted successfully"
}
```

The current implementation performs a database deletion for products.

---

# 17. Product Search and Filtering

The product API supports query parameters.

## Search by Product Name

```text
GET /api/products?search=Laptop
```

The backend performs a case-insensitive search on the product name.

---

## Filter by Status

```text
GET /api/products?status=ACTIVE
```

Available statuses:

```text
ACTIVE
INACTIVE
```

---

## Minimum Selling Price

```text
GET /api/products?minPrice=10000
```

---

## Maximum Selling Price

```text
GET /api/products?maxPrice=50000
```

---

## Price Range

```text
GET /api/products?minPrice=10000&maxPrice=50000
```

---

## Low Stock Products

```text
GET /api/products?lowStock=true
```

This returns products where:

```text
stockQuantity <= minimumStock
```

---

# 18. Category APIs

## Category API Summary

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/categories` | Create category |
| GET | `/api/categories` | Get categories |
| GET | `/api/categories/:id` | Get category by ID |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Deactivate category |

---

# 19. Create Category

### Method

```text
POST
```

### Endpoint

```text
/api/categories
```

### Request Body

```json
{
  "name": "Electronics",
  "description": "Electronic products"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "CATEGORY_ID",
    "name": "Electronics",
    "description": "Electronic products",
    "status": "ACTIVE"
  }
}
```

---

# 20. Category Validation

The following validations are implemented:

- Category name is required.
- Category name cannot be empty.
- Category name must be at least 2 characters.
- Category name cannot exceed 50 characters.
- Category name must be unique.
- Description cannot exceed 200 characters.
- Status must be ACTIVE or INACTIVE.

---

# 21. Get Categories

### Method

```text
GET
```

### Endpoint

```text
/api/categories
```

### Example

```text
GET /api/categories
```

### Response

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "CATEGORY_ID_1",
      "name": "Electronics",
      "description": "Electronic products",
      "status": "ACTIVE"
    },
    {
      "_id": "CATEGORY_ID_2",
      "name": "Furniture",
      "description": "Furniture products",
      "status": "ACTIVE"
    }
  ]
}
```

---

# 22. Get Category by ID

### Method

```text
GET
```

### Endpoint

```text
/api/categories/:id
```

### Example

```text
GET /api/categories/CATEGORY_ID
```

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "CATEGORY_ID",
    "name": "Electronics",
    "description": "Electronic products",
    "status": "ACTIVE"
  }
}
```

---

# 23. Update Category

### Method

```text
PUT
```

### Endpoint

```text
/api/categories/:id
```

### Request Body

```json
{
  "name": "Electronic Items",
  "description": "All electronic products",
  "status": "ACTIVE"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "CATEGORY_ID",
    "name": "Electronic Items",
    "description": "All electronic products",
    "status": "ACTIVE"
  }
}
```

---

# 24. Deactivate Category

### Method

```text
DELETE
```

### Endpoint

```text
/api/categories/:id
```

The current implementation uses a soft-delete/deactivation approach.

Instead of removing the category from MongoDB:

```text
status = INACTIVE
```

### Success Response

```json
{
  "success": true,
  "message": "Category deactivated successfully",
  "data": {
    "_id": "CATEGORY_ID",
    "name": "Electronics",
    "status": "INACTIVE"
  }
}
```

---

# 25. Category Search

Search categories using:

```text
GET /api/categories?search=Electronics
```

The search is case-insensitive.

---

# 26. Category Status Filter

Use:

```text
GET /api/categories?status=ACTIVE
```

or:

```text
GET /api/categories?status=INACTIVE
```

---

# 27. Inventory Management

The inventory functionality manages stock using the Product model.

The following Product fields are used for inventory:

```text
stockQuantity
minimumStock
status
```

The inventory API provides:

- Current stock
- Low-stock detection
- Inventory summary
- Stock addition
- Stock subtraction
- Setting stock quantity
- Inventory search
- Quantity filtering

---

# 28. Inventory APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/inventory` | Get inventory |
| GET | `/api/inventory/:id` | Get inventory item |
| GET | `/api/inventory/low-stock` | Get low-stock products |
| GET | `/api/inventory/summary` | Get inventory summary |
| POST | `/api/inventory` | Create inventory item |
| POST | `/api/inventory/bulk` | Create multiple inventory items |
| PATCH | `/api/inventory/adjust` | Adjust stock |
| PUT | `/api/inventory/:id` | Update inventory item |
| DELETE | `/api/inventory/:id` | Delete inventory item |

---

# 29. Get Inventory

### Method

```text
GET
```

### Endpoint

```text
/api/inventory
```

### Example

```text
GET http://localhost:5000/api/inventory
```

The response contains inventory information derived from products.

Example:

```json
[
  {
    "_id": "PRODUCT_ID",
    "productName": "Laptop",
    "sku": "LAP-001",
    "purchasePrice": 40000,
    "sellingPrice": 45000,
    "taxRate": 18,
    "stockQuantity": 10,
    "minimumStock": 2,
    "status": "ACTIVE",
    "lowStock": false,
    "inventoryStatus": "IN_STOCK"
  }
]
```

---

# 30. Inventory Search

Search inventory by product name:

```text
GET /api/inventory?search=Laptop
```

---

# 31. Inventory Status Filter

```text
GET /api/inventory?status=ACTIVE
```

or:

```text
GET /api/inventory?status=INACTIVE
```

---

# 32. Inventory Quantity Filtering

### Minimum Quantity

```text
GET /api/inventory?minQuantity=5
```

### Maximum Quantity

```text
GET /api/inventory?maxQuantity=50
```

### Quantity Range

```text
GET /api/inventory?minQuantity=5&maxQuantity=50
```

---

# 33. Low Stock API

### Method

```text
GET
```

### Endpoint

```text
/api/inventory/low-stock
```

### Example

```text
GET http://localhost:5000/api/inventory/low-stock
```

The low-stock condition is:

```text
stockQuantity <= minimumStock
```

Example:

```text
stockQuantity = 3
minimumStock = 5
```

Result:

```text
LOW_STOCK
```

---

# 34. Inventory Summary

### Method

```text
GET
```

### Endpoint

```text
/api/inventory/summary
```

### Example

```text
GET http://localhost:5000/api/inventory/summary
```

### Response

```json
{
  "totalProducts": 10,
  "totalStock": 125,
  "lowStockCount": 3,
  "inStockCount": 7
}
```

### Summary Fields

| Field | Description |
|---|---|
| totalProducts | Total number of products |
| totalStock | Sum of stock quantities |
| lowStockCount | Number of products at or below minimum stock |
| inStockCount | Products that are not low stock |

---

# 35. Adjust Inventory

### Method

```text
PATCH
```

### Endpoint

```text
/api/inventory/adjust
```

This endpoint supports:

```text
add
subtract
set
```

---

## Add Stock

Example:

```json
{
  "productId": "PRODUCT_ID",
  "quantity": 5,
  "operation": "add"
}
```

Calculation:

```text
Current Stock + Quantity
```

Example:

```text
Current Stock = 10
Quantity = 5

New Stock = 15
```

---

# 36. Subtract Stock

Example:

```json
{
  "productId": "PRODUCT_ID",
  "quantity": 3,
  "operation": "subtract"
}
```

Calculation:

```text
Current Stock - Quantity
```

Example:

```text
Current Stock = 10
Quantity = 3

New Stock = 7
```

---

# 37. Set Stock

Example:

```json
{
  "productId": "PRODUCT_ID",
  "stockQuantity": 25,
  "operation": "set"
}
```

The stock quantity is directly changed to:

```text
25
```

---

# 38. Negative Stock Prevention

The backend prevents stock from becoming negative.

Example:

```text
Current Stock = 2
Subtract = 5
```

The calculated stock would be:

```text
2 - 5 = -3
```

This operation is rejected.

Response:

```json
{
  "message": "Stock quantity cannot be negative"
}
```

---

# 39. Inventory Status

The inventory controller calculates:

```text
stockQuantity <= minimumStock
```

If true:

```text
lowStock = true
inventoryStatus = "LOW_STOCK"
```

Otherwise:

```text
lowStock = false
inventoryStatus = "IN_STOCK"
```

---

# 40. Inventory Frontend

The React inventory page provides:

- Total Products card
- Total Stock card
- Low Stock card
- In Stock card
- Product/SKU search
- Product status filter
- Minimum quantity filter
- Maximum quantity filter
- Low Stock Only filter
- Clear Filters
- Refresh
- Stock adjustment
- Inventory table

---

# 41. Product Frontend

The Product page provides:

- Add Product
- Edit Product
- Delete Product
- Product listing
- Product search
- Status filtering
- Price filtering
- Low-stock filtering
- Category selection
- Product stock display
- Product status display

---

# 42. Category Frontend

The Category page provides:

- Add Category
- Edit Category
- Deactivate Category
- Category listing
- Search by category name
- Search by description
- Status filtering
- Clear filters
- Created date display

---

# 43. Validation and Error Handling

The backend implements validation for important fields.

### Product

```text
Product name required
SKU required
SKU unique
Category required
Purchase price >= 0
Selling price >= 0
Stock quantity >= 0
Minimum stock >= 0
Tax rate = 0, 5, 12 or 18
Status = ACTIVE or INACTIVE
```

### Category

```text
Name required
Name unique
Name length: 2-50 characters
Description maximum: 200 characters
Status = ACTIVE or INACTIVE
```

### Inventory

```text
Product ID required
Quantity cannot be negative
Stock cannot become negative
Operation must be add, subtract or set
```

---

# 44. HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Bad request / validation error |
| 404 | Resource not found |
| 409 | Duplicate resource |
| 500 | Internal server error |

---

# 45. Common Error Responses

### Product Not Found

```json
{
  "message": "Product not found"
}
```

### Category Not Found

```json
{
  "success": false,
  "message": "Category not found"
}
```

### Duplicate SKU

```json
{
  "message": "SKU already exists"
}
```

### Duplicate Category

```json
{
  "success": false,
  "message": "Category already exists"
}
```

### Negative Stock

```json
{
  "message": "Stock quantity cannot be negative"
}
```

---

# 46. Running the Backend

Open PowerShell or terminal.

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
node server.js
```

The server runs on:

```text
http://localhost:5000
```

---

# 47. Running the Frontend

Open another terminal.

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

Vite normally runs the frontend on:

```text
http://localhost:5173
```

---

# 48. Environment Configuration

The backend uses a `.env` file for environment configuration.

Example:

```env
PORT=5000
MONGO_URI= your MongoDB URI
```

Do not commit actual MongoDB credentials or passwords to GitHub.

---

# 49. MongoDB Connection

The MongoDB connection is configured in:

```text
server/config/db.js
```

The backend connects to MongoDB before starting normal database operations.

The main database collections used by the module are:

```text
products
categories
```

The project also contains an Inventory model, while the current inventory controller operates directly on Product stock fields.

---

# 50. Postman Testing

All backend APIs can be tested using Postman.

## Step 1 — Start Backend

```bash
cd server
node server.js
```

## Step 2 — Test Server

```text
GET http://localhost:5000
```

Expected response:

```json
{
  "message": "Billing Software Team 2 Backend is running"
}
```

---

# 51. Postman Product Testing

### Create Category First

```text
POST http://localhost:5000/api/categories
```

Body:

```json
{
  "name": "Electronics",
  "description": "Electronic products"
}
```

Copy the returned:

```text
_id
```

---

### Create Product

```text
POST http://localhost:5000/api/products
```

Body:

```json
{
  "productName": "Laptop",
  "sku": "LAP-001",
  "category": "CATEGORY_ID",
  "purchasePrice": 40000,
  "sellingPrice": 45000,
  "taxRate": 18,
  "stockQuantity": 10,
  "minimumStock": 2,
  "status": "ACTIVE"
}
```

---

# 52. Postman Product Test List

```text
GET     /api/products
GET     /api/products/:id
POST    /api/products
PUT     /api/products/:id
DELETE  /api/products/:id
```

### Search

```text
GET /api/products?search=Laptop
```

### Status

```text
GET /api/products?status=ACTIVE
```

### Price

```text
GET /api/products?minPrice=10000&maxPrice=50000
```

### Low Stock

```text
GET /api/products?lowStock=true
```

---

# 53. Postman Category Test List

```text
POST    /api/categories
GET     /api/categories
GET     /api/categories/:id
PUT     /api/categories/:id
DELETE  /api/categories/:id
```

### Search

```text
GET /api/categories?search=Electronics
```

### Status

```text
GET /api/categories?status=ACTIVE
```

---

# 54. Postman Inventory Test List

```text
GET     /api/inventory
GET     /api/inventory/:id
GET     /api/inventory/low-stock
GET     /api/inventory/summary
POST    /api/inventory
POST    /api/inventory/bulk
PATCH   /api/inventory/adjust
PUT     /api/inventory/:id
DELETE  /api/inventory/:id
```

---

# 55. Git and GitHub Workflow

The project follows a branch-based workflow.

Recommended workflow:

```text
Pull latest changes
       ↓
Create / switch to feature branch
       ↓
Develop feature
       ↓
Test locally
       ↓
Commit changes
       ↓
Push branch
       ↓
Create Pull Request
       ↓
Code Review
       ↓
Merge
```

Example:

```bash
git pull origin team2
```

Create a feature branch:

```bash
git checkout -b feature/product-api
```

Check status:

```bash
git status
```

Add changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Implemented product APIs"
```

Push:

```bash
git push origin feature/product-api
```

---

# 61. Definition of Done

The Team 2 module is considered ready when:

- Product CRUD works
- Category CRUD works
- SKU uniqueness is handled
- Inventory reflects stock changes
- Negative stock is prevented
- Low-stock products are identified
- Frontend/API integration is completed
- Postman tests are completed
- GitHub branch is reviewed
- Pull Request is created and merged
- API documentation is maintained

---

# 62. Conclusion

The Team 2 Products, Categories & Inventory module provides the core product catalog and inventory functionality for the Billing Software System.

The implementation provides:

```text
Product Management
        +
Category Management
        +
Inventory Management
        +
Stock Adjustment
        +
Low Stock Detection
        +
Search & Filtering
        +
Validation
        +
React Frontend
        +
REST APIs
        +
MongoDB
```

The module is designed to integrate with the purchase, sales, and dashboard modules of the overall Billing Software System.

---

# End of Team 2 Documentation