const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const productRoutes = require("./routes/productRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Billing Software Team 2 Backend is running"
    });
});

// Product routes
app.use("/api/products", productRoutes);

module.exports = app;