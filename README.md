# Billing Software System — Team 2

## Products, Categories & Inventory Management

Team 2 module of the **Billing Software System**, developed using the **MERN Stack**.

This module manages products, categories, inventory stock, stock adjustments, search/filtering, and low-stock detection.

---

## Project Overview

The Team 2 module provides functionality for:

- Product Management
- Category Management
- Inventory Management
- Stock Management
- Low-Stock Detection
- Product Search and Filtering
- Category Search and Filtering
- Product and Category Relationship
- Validation and Error Handling
- React Frontend Integration
- REST API Integration

The module is designed as part of the common Billing Software System and can be integrated with purchase, sales, and dashboard modules.

---

## Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- Mongoose

### Database

- MongoDB

### Tools

- Postman — API Testing
- Git — Version Control
- GitHub — Source Code Management
- VS Code — Development Environment

---

## Project Structure

```text
Billing-Software-System-Team-2/
│
├── client/
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
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   └── inventoryController.js
│   │
│   ├── models/
│   │   ├── product.js
│   │   ├── category.js
│   │   └── inventory.js
│   │
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── inventoryRoutes.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# Features

## 1. Product Management

The product module supports:

- Add product
- View products
- View product by ID
- Update product
- Delete product
- Search products
- Filter products
- Filter by status
- Filter by price
- Filter low-stock products

### Product Fields

```text
Product Name
SKU
Category
Purchase Price
Selling Price
Tax Rate
Stock Quantity
Minimum Stock
Status
```

---

## 2. Category Management

The category module supports:

- Add category
- View categories
- View category by ID
- Update category
- Deactivate category
- Search categories
- Filter categories by status

### Category Fields

```text
Name
Description
Status
Created Date
Updated Date
```

---

## 3. Inventory Management

The inventory module supports:

- View current stock
- Search inventory
- Filter inventory
- View inventory summary
- Add stock
- Subtract stock
- Set stock quantity
- Low-stock detection
- Prevent negative stock

Inventory uses the product stock information:

```text
stockQuantity
minimumStock
```

---

## 4. Low-Stock Detection

A product is considered low stock when:

```text
stockQuantity <= minimumStock
```

Example:

```text
Stock Quantity = 3
Minimum Stock = 5
```

The product will be identified as:

```text
LOW_STOCK
```

This information can also be used by the dashboard module.

---

# API Modules

## Product APIs

```text
GET     /api/products
GET     /api/products/:id
POST    /api/products
PUT     /api/products/:id
DELETE  /api/products/:id
```

### Product Filtering

```text
GET /api/products?search=Laptop
GET /api/products?status=ACTIVE
GET /api/products?minPrice=10000
GET /api/products?maxPrice=50000
GET /api/products?lowStock=true
```

---

## Category APIs

```text
GET     /api/categories
GET     /api/categories/:id
POST    /api/categories
PUT     /api/categories/:id
DELETE  /api/categories/:id
```

### Category Filtering

```text
GET /api/categories?search=Electronics
GET /api/categories?status=ACTIVE
```

---

## Inventory APIs

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

# Database

The module primarily uses the following MongoDB collections:

```text
products
categories
```

### Product and Category Relationship

Each product is associated with a category using the MongoDB ObjectId.

```text
Category
   │
   └── _id
        │
        ▼
Product.category
```

---

# Validation

The application contains validation for important product, category, and inventory fields.

### Product Validation

- Product name is required
- SKU is required
- SKU must be unique
- Category is required
- Purchase price cannot be negative
- Selling price cannot be negative
- Stock quantity cannot be negative
- Minimum stock cannot be negative
- Tax rate supports `0`, `5`, `12`, and `18`
- Status supports `ACTIVE` and `INACTIVE`

### Category Validation

- Category name is required
- Category name must be unique
- Category name must contain 2–50 characters
- Description maximum length is 200 characters
- Status supports `ACTIVE` and `INACTIVE`

### Inventory Validation

- Product ID is required
- Quantity cannot be negative
- Stock cannot become negative
- Stock operation must be valid

---

# Stock Management

## Add Stock

```text
New Stock = Current Stock + Quantity
```

Example:

```text
Current Stock = 10
Added Quantity = 5

New Stock = 15
```

## Subtract Stock

```text
New Stock = Current Stock - Quantity
```

Example:

```text
Current Stock = 10
Sold Quantity = 3

New Stock = 7
```

The system prevents the stock from becoming negative.

---

# Frontend Pages

## Products Page

The Products page provides:

- Product listing
- Add Product
- Edit Product
- Delete Product
- Search
- Status filtering
- Price filtering
- Low-stock filtering
- Category selection

---

## Categories Page

The Categories page provides:

- Category listing
- Add Category
- Edit Category
- Deactivate Category
- Search
- Status filtering
- Clear filters

---

## Inventory Page

The Inventory page provides:

- Total Products
- Total Stock
- Low Stock Count
- In Stock Count
- Product/SKU search
- Status filtering
- Quantity filtering
- Low-stock filtering
- Stock adjustment
- Refresh inventory

---

# Installation and Setup

## Prerequisites

Install the following before running the project:

- Node.js
- npm
- MongoDB / MongoDB Atlas
- Git
- VS Code

---

# Backend Setup

Open a terminal and navigate to the server folder:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` folder.

Example:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
```

Start the backend:

```bash
node server.js
```

Backend URL:

```text
http://localhost:5000
```

---

# Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Testing with Postman

Start the backend before testing the APIs.

### Test Backend

```text
GET http://localhost:5000
```

Expected response:

```json
{
  "message": "Billing Software Team 2 Backend is running"
}
```

### Product API

```text
http://localhost:5000/api/products
```

### Category API

```text
http://localhost:5000/api/categories
```

### Inventory API

```text
http://localhost:5000/api/inventory
```

All CRUD operations, filtering, inventory operations, validation, and error cases can be tested using Postman.

---

# Git Workflow

Team members should work using branches and Pull Requests.

### Create a feature branch

```bash
git checkout -b feature/product-api
```

### Check changes

```bash
git status
```

### Add changes

```bash
git add .
```

### Commit

```bash
git commit -m "Implemented product APIs"
```

### Push branch

```bash
git push origin feature/product-api
```

Create a Pull Request after testing and review the changes before merging.

---

# Integration with Other Teams

Team 2 is part of the common Billing Software System.

### Purchase Integration

When a purchase is completed, inventory stock should increase.

```text
Current Stock + Purchased Quantity
```

### Sales Integration

When a sale is completed, inventory stock should decrease.

```text
Current Stock - Sold Quantity
```

### Dashboard Integration

The dashboard can use inventory data such as:

```text
Total Products
Total Stock
Low Stock Count
In Stock Count
```

The integration should follow the agreed API contracts and shared database structures.

---

# Error Handling

The backend provides meaningful error responses for cases such as:

- Product not found
- Category not found
- Duplicate SKU
- Duplicate category
- Invalid product data
- Invalid category data
- Negative stock
- Invalid stock operation
- Invalid MongoDB ID
- Internal server errors

Common HTTP status codes:

```text
200 - Success
201 - Created
400 - Bad Request
404 - Not Found
409 - Conflict
500 - Internal Server Error
```

---

# Team 2 Responsibilities

The Team 2 module covers:

- Product MongoDB schema
- Category MongoDB schema
- Product CRUD APIs
- Category CRUD APIs
- Inventory APIs
- Stock management
- Low-stock detection
- Product search and filtering
- Category search and filtering
- Product frontend
- Category frontend
- Inventory frontend
- API integration
- Validation
- Error handling
- Postman testing
- API documentation

---

# Current Implementation

### Completed

- Product Management
- Category Management
- Product-Category Relationship
- Product CRUD
- Category CRUD
- Product Search
- Product Filtering
- Category Search
- Category Filtering
- SKU Uniqueness
- Inventory Management
- Stock Adjustment
- Low-Stock Detection
- Negative Stock Prevention
- Inventory Summary
- React Product Page
- React Category Page
- React Inventory Page
- Backend API Integration
- MongoDB Integration
- Postman API Testing

---

# Important Note

The Team 2 project is one module of the overall Billing Software System.

The module should not be treated as a separate application during final integration. API contracts, database fields, authentication requirements, and integration workflows should follow the common project conventions.

---

# Project Status

```text
Team 2 — Products, Categories & Inventory

Status: Development / Integration Ready
```

---

# License

This project was developed as part of the Billing Software System internship project.