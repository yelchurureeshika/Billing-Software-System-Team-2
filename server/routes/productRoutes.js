const express = require("express");
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/",authenticate, getProducts);
router.get("/:id",authenticate, getProductById);
router.post("/",authenticate, createProduct);
router.put("/:id",authenticate, updateProduct);
router.delete("/:id",authenticate, deleteProduct);

module.exports = router;
