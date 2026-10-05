# Billing Software System - Team 2
# Backend API Documentation

## 1. Project Information

**Project:** Billing Software System  
**Module:** Products, Categories & Inventory  
**Technology:** Node.js, Express.js, MongoDB, Mongoose  
**API Testing:** Postman

### Backend Server

`http://localhost:5000`

### API Base URL

`http://localhost:5000/api`

---

# 2. Category APIs

Category APIs are used to create, view, search, update and deactivate product categories.

## Category API Summary

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/categories` | Create category |
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories?search=value` | Search categories |
| GET | `/api/categories?status=ACTIVE` | Filter categories by status |
| GET | `/api/categories/:id` | Get category by ID |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Deactivate category |

---

# 3. Create Category

### Endpoint

`POST /api/categories`

### Full URL

`http://localhost:5000/api/categories`

### Purpose

Creates a new product category.

### Request Header

```text
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Electronics",
  "description": "Electronic products"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| name | String | Yes | Category name |
| description | String | No | Category description |

### Success Response

**Status Code: 201 Created**

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

### Validation

- Category name is required.
- Category name cannot be empty.
- Category name must be unique.
- Category name must contain at least 2 characters.
- Category name cannot exceed 50 characters.
- Description cannot exceed 200 characters.

### Duplicate Category Response

**Status Code: 409 Conflict**

```json
{
  "success": false,
  "message": "Category already exists"
}
```

---

# 4. Get All Categories

### Endpoint

`GET /api/categories`

### Full URL

`http://localhost:5000/api/categories`

### Purpose

Returns all categories stored in the database.

### Success Response

**Status Code: 200 OK**

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

# 5. Search Categories

### Endpoint

`GET /api/categories?search=value`

### Example

`http://localhost:5000/api/categories?search=Electronics`

### Purpose

Searches categories using the category name.

The search is case-insensitive.

### Example

```text
GET /api/categories?search=elect
```

This can return categories such as:

```text
Electronics
Electrical Items
```

### Success Response

**Status Code: 200 OK**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "CATEGORY_ID",
      "name": "Electronics",
      "description": "Electronic products",
      "status": "ACTIVE"
    }
  ]
}
```

---

# 6. Filter Categories by Status

### Endpoint

`GET /api/categories?status=ACTIVE`

### Example

`http://localhost:5000/api/categories?status=ACTIVE`

### Available Status

```text
ACTIVE
INACTIVE
```

### Purpose

Returns categories based on their status.

---

# 7. Get Category by ID

### Endpoint

`GET /api/categories/:id`

### Example

`http://localhost:5000/api/categories/CATEGORY_ID`

### Purpose

Returns a single category using its MongoDB ObjectId.

### Success Response

**Status Code: 200 OK**

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

### Category Not Found

**Status Code: 404 Not Found**

```json
{
  "success": false,
  "message": "Category not found"
}
```

---

# 8. Update Category

### Endpoint

`PUT /api/categories/:id`

### Example

`http://localhost:5000/api/categories/CATEGORY_ID`

### Purpose

Updates an existing category.

### Request Body

```json
{
  "name": "Electronic Items",
  "description": "All electronic products",
  "status": "ACTIVE"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| name | String | No | Updated category name |
| description | String | No | Updated description |
| status | String | No | ACTIVE or INACTIVE |

### Success Response

**Status Code: 200 OK**

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

### Valid Status Values

```text
ACTIVE
INACTIVE
```

---

# 9. Delete / Deactivate Category

### Endpoint

`DELETE /api/categories/:id`

### Example

`http://localhost:5000/api/categories/CATEGORY_ID`

### Purpose

The current implementation uses a **soft delete**.

The category is not permanently removed from MongoDB.

Instead:

```text
ACTIVE → INACTIVE
```

### Success Response

**Status Code: 200 OK**

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

# 10. Product APIs

Product APIs are used to create, view, search, filter, update and delete products.

## Product API Summary

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/products` | Create product |
| GET | `/api/products` | Get all products |
| GET | `/api/products?search=value` | Search products |
| GET | `/api/products?status=ACTIVE` | Filter by status |
| GET | `/api/products?minPrice=value` | Minimum price filter |
| GET | `/api/products?maxPrice=value` | Maximum price filter |
| GET | `/api/products?minPrice=value&maxPrice=value` | Price range |
| GET | `/api/products?lowStock=true` | Get low-stock products |
| GET | `/api/products/:id` | Get product by ID |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

---

# 11. Create Product

### Endpoint

`POST /api/products`

### Full URL

`http://localhost:5000/api/products`

### Purpose

Creates a new product.

### Request Header

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

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| productName | String | Yes | Product name |
| sku | String | Yes | Unique product SKU |
| category | ObjectId | Yes | Category reference |
| purchasePrice | Number | Yes | Product purchase price |
| sellingPrice | Number | Yes | Product selling price |
| taxRate | Number | No | Tax percentage |
| stockQuantity | Number | Yes | Current stock |
| minimumStock | Number | Yes | Minimum stock level |
| status | String | No | ACTIVE or INACTIVE |

### Allowed Tax Rates

```text
0
5
12
18
```

### Success Response

**Status Code: 201 Created**

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

**Status Code: 400 Bad Request**

```json
{
  "message": "SKU already exists"
}
```

---

# 12. Get All Products

### Endpoint

`GET /api/products`

### Full URL

`http://localhost:5000/api/products`

### Purpose

Returns all products stored in the database.

### Success Response

**Status Code: 200 OK**

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

# 13. Search Products

### Endpoint

`GET /api/products?search=value`

### Example

`http://localhost:5000/api/products?search=Laptop`

### Purpose

Searches products using the product name.

The search is case-insensitive.

### Example

```text
GET /api/products?search=lap
```

---

# 14. Filter Products by Status

### Endpoint

`GET /api/products?status=ACTIVE`

### Example

`http://localhost:5000/api/products?status=ACTIVE`

### Available Status

```text
ACTIVE
INACTIVE
```

---

# 15. Filter Products by Minimum Price

### Endpoint

`GET /api/products?minPrice=value`

### Example

`http://localhost:5000/api/products?minPrice=10000`

### Purpose

Returns products whose selling price is greater than or equal to the specified minimum price.

---

# 16. Filter Products by Maximum Price

### Endpoint

`GET /api/products?maxPrice=value`

### Example

`http://localhost:5000/api/products?maxPrice=50000`

### Purpose

Returns products whose selling price is less than or equal to the specified maximum price.

---

# 17. Filter Products by Price Range

### Endpoint

`GET /api/products?minPrice=value&maxPrice=value`

### Example

`http://localhost:5000/api/products?minPrice=10000&maxPrice=50000`

### Purpose

Returns products whose selling price is within the specified price range.

---

# 18. Get Low Stock Products

### Endpoint

`GET /api/products?lowStock=true`

### Full URL

`http://localhost:5000/api/products?lowStock=true`

### Purpose

Returns products where the current stock is less than or equal to the minimum stock level.

### Low Stock Condition

```text
stockQuantity <= minimumStock
```

### Example

```text
stockQuantity = 2
minimumStock = 5
```

Result:

```text
LOW STOCK
```

### Normal Stock Example

```text
stockQuantity = 10
minimumStock = 5
```

Result:

```text
NORMAL STOCK
```

---

# 19. Get Product by ID

### Endpoint

`GET /api/products/:id`

### Example

`http://localhost:5000/api/products/PRODUCT_ID`

### Purpose

Returns a single product using its MongoDB ObjectId.

### Success Response

**Status Code: 200 OK**

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

**Status Code: 404 Not Found**

```json
{
  "message": "Product not found"
}
```

---

# 20. Update Product

### Endpoint

`PUT /api/products/:id`

### Example

`http://localhost:5000/api/products/PRODUCT_ID`

### Purpose

Updates an existing product.

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

**Status Code: 200 OK**

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

# 21. Delete Product

### Endpoint

`DELETE /api/products/:id`

### Example

`http://localhost:5000/api/products/PRODUCT_ID`

### Purpose

Deletes the product from the database.

### Success Response

**Status Code: 200 OK**

```json
{
  "message": "Product deleted successfully"
}
```

---

# 22. Product-Category Relationship

Each product belongs to a category.

The Product schema stores the category MongoDB ObjectId reference.

### Relationship

```text
Category
    |
    | category _id
    |
    ↓
Product
```

### Example Category

```json
{
  "_id": "65abc123",
  "name": "Electronics",
  "description": "Electronic products",
  "status": "ACTIVE"
}
```

### Example Product

```json
{
  "productName": "Laptop",
  "sku": "LAP-001",
  "category": "65abc123",
  "purchasePrice": 40000,
  "sellingPrice": 45000,
  "taxRate": 18,
  "stockQuantity": 10,
  "minimumStock": 2,
  "status": "ACTIVE"
}
```

The product is associated with the **Electronics** category through the category ObjectId.

---

# 23. Category Schema

```text
Category
├── _id
├── name
├── description
├── status
├── createdAt
└── updatedAt
```

### Category Fields

| Field | Type | Required | Validation |
|---|---|---|---|
| name | String | Yes | 2-50 characters, unique |
| description | String | No | Maximum 200 characters |
| status | String | No | ACTIVE / INACTIVE |
| createdAt | Date | Auto | Automatically generated |
| updatedAt | Date | Auto | Automatically generated |

---

# 24. Product Schema

```text
Product
├── _id
├── productName
├── sku
├── category
├── purchasePrice
├── sellingPrice
├── taxRate
├── stockQuantity
├── minimumStock
├── status
├── createdAt
└── updatedAt
```

### Product Fields

| Field | Type | Required | Validation |
|---|---|---|---|
| productName | String | Yes | Product name |
| sku | String | Yes | Unique SKU |
| category | ObjectId | Yes | Category reference |
| purchasePrice | Number | Yes | Minimum 0 |
| sellingPrice | Number | Yes | Minimum 0 |
| taxRate | Number | No | 0, 5, 12, 18 |
| stockQuantity | Number | Yes | Minimum 0 |
| minimumStock | Number | Yes | Minimum 0 |
| status | String | No | ACTIVE / INACTIVE |
| createdAt | Date | Auto | Automatically generated |
| updatedAt | Date | Auto | Automatically generated |

---

# 25. Inventory Logic

The Product collection stores the current stock using:

```text
stockQuantity
```

The minimum required stock is stored using:

```text
minimumStock
```

### Low Stock Condition

```text
stockQuantity <= minimumStock
```

### Example

```text
Stock Quantity = 3
Minimum Stock = 5
```

Result:

```text
LOW STOCK
```

---

# 26. Inventory API Dependencies

Inventory stock changes will be connected with other modules.

## Purchase Module

When a purchase is completed:

```text
New Stock = Current Stock + Purchased Quantity
```

### Example

```text
Current Stock = 10
Purchased Quantity = 5

New Stock = 15
```

## Sales Module

When a sale is completed:

```text
New Stock = Current Stock - Sold Quantity
```

### Example

```text
Current Stock = 10
Sold Quantity = 3

New Stock = 7
```

## Negative Stock Prevention

Stock should never become negative.

### Example

```text
Current Stock = 2
Sold Quantity = 5
```

The operation should not be allowed because:

```text
2 - 5 = -3
```

---

# 27. Common HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 400 | Bad request |
| 404 | Resource not found |
| 409 | Duplicate resource |
| 500 | Internal server error |

---

# 28. Common Error Responses

## Product Not Found

```json
{
  "message": "Product not found"
}
```

## Category Not Found

```json
{
  "success": false,
  "message": "Category not found"
}
```

## Duplicate SKU

```json
{
  "message": "SKU already exists"
}
```

## Duplicate Category

```json
{
  "success": false,
  "message": "Category already exists"
}
```

## Invalid Category Status

```json
{
  "success": false,
  "message": "Status must be ACTIVE or INACTIVE"
}
```

---

# 29. Postman Testing

All APIs can be tested using Postman.

## Step 1: Start Backend

```bash
cd server
node server.js
```

If nodemon is configured:

```bash
npm run dev
```

## Step 2: Verify Server

Open:

```text
http://localhost:5000
```

## Step 3: Create Category

```http
POST http://localhost:5000/api/categories
```

Body → raw → JSON:

```json
{
  "name": "Electronics",
  "description": "Electronic products"
}
```

## Step 4: Copy Category ID

After creating the category, copy its:

```text
_id
```

This Category ID is required when creating a product.

## Step 5: Create Product

```http
POST http://localhost:5000/api/products
```

Body:

```json
{
  "productName": "Laptop",
  "sku": "LAP-001",
  "category": "COPIED_CATEGORY_ID",
  "purchasePrice": 40000,
  "sellingPrice": 45000,
  "taxRate": 18,
  "stockQuantity": 10,
  "minimumStock": 2,
  "status": "ACTIVE"
}
```

## Step 6: Test Product APIs

```text
GET    /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

## Step 7: Test Product Filters

### Search

```text
GET /api/products?search=Laptop
```

### Status

```text
GET /api/products?status=ACTIVE
```

### Minimum Price

```text
GET /api/products?minPrice=10000
```

### Maximum Price

```text
GET /api/products?maxPrice=50000
```

### Price Range

```text
GET /api/products?minPrice=10000&maxPrice=50000
```

### Low Stock

```text
GET /api/products?lowStock=true
```

---

# 30. API Development Status

## Completed

- MongoDB Atlas database connection
- Category model
- Category creation API
- Category listing API
- Category search API
- Category status filtering
- Category get-by-ID API
- Category update API
- Category soft delete/deactivation API
- Product model
- Product creation API
- Product listing API
- Product get-by-ID API
- Product update API
- Product delete API
- Product search
- Product status filtering
- Product price filtering
- Low-stock filtering
- SKU uniqueness handling
- Product-category relationship
- Postman API testing
- API documentation

## Pending / Integration

- Inventory API
- Purchase stock increase integration
- Sales stock decrease integration
- Negative stock prevention
- Frontend integration
- Dashboard low-stock integration

---

# 31. API Endpoint Quick Reference

## Categories

```text
POST   /api/categories
GET    /api/categories
GET    /api/categories?search=value
GET    /api/categories?status=ACTIVE
GET    /api/categories/:id
PUT    /api/categories/:id
DELETE /api/categories/:id
```

## Products

```text
POST   /api/products
GET    /api/products
GET    /api/products?search=value
GET    /api/products?status=ACTIVE
GET    /api/products?minPrice=value
GET    /api/products?maxPrice=value
GET    /api/products?minPrice=value&maxPrice=value
GET    /api/products?lowStock=true
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

---

# 32. Backend File Structure

```text
server/
│
├── config/
│   └── db.js
│
├── models/
│   ├── Product.js
│   └── Category.js
│
├── controllers/
│   ├── productController.js
│   └── categoryController.js
│
├── routes/
│   ├── productRoutes.js
│   └── categoryRoutes.js
│
├── app.js
├── server.js
├── API_DOCUMENTATION.md
├── package.json
└── .env
```

---

# 33. Repository

GitHub Repository:

```text
https://github.com/yelchurureeshika/Billing-Software-System-Team-2
```

---

# 34. Team 2 Backend Responsibility

The backend and database responsibilities include:

- MongoDB database setup
- Product schema
- Category schema
- Product CRUD APIs
- Category CRUD APIs
- Product-category relationship
- SKU validation
- Product search
- Product filtering
- Category search
- Category filtering
- Inventory management
- Low-stock detection
- Stock validation
- Postman API testing
- Backend API documentation

---

# 35. Conclusion

The Team 2 backend provides APIs for managing products and categories and provides the foundation for inventory management.

The APIs support:

- Product CRUD operations
- Category CRUD operations
- Product-category relationship
- Product search
- Category search
- Product filtering
- Category status filtering
- Price filtering
- Low-stock detection
- SKU uniqueness
- Category deactivation
- MongoDB data management
- Postman testing

The backend APIs can be integrated with the React frontend and other billing system modules.

---

# End of API Documentation