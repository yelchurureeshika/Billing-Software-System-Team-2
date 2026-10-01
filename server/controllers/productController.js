const Product = require("../models/product");

const getProducts = async (req, res) => {
    try {
        const { search, status, minPrice, maxPrice, lowStock } = req.query;
        const query = {};

        if (search) {
            query.productName = { $regex: search, $options: "i" };
        }

        if (status) {
            query.status = status;
        }

        if (minPrice || maxPrice) {
            query.sellingPrice = {};

            if (minPrice) {
                query.sellingPrice.$gte = Number(minPrice);
            }

            if (maxPrice) {
                query.sellingPrice.$lte = Number(maxPrice);
            }
        }

        if (lowStock === "true") {
            query.$expr = { $lte: ["$stockQuantity", "$minimumStock"] };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch product", error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { productName, sku, purchasePrice, sellingPrice, taxRate, stockQuantity, minimumStock, status } = req.body;

        const product = await Product.create({
            productName,
            sku,
            purchasePrice,
            sellingPrice,
            taxRate,
            stockQuantity,
            minimumStock,
            status
        });

        return res.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "SKU already exists" });
        }

        return res.status(500).json({ message: "Failed to create product", error: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "SKU already exists" });
        }

        return res.status(500).json({ message: "Failed to update product", error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Failed to delete product", error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
