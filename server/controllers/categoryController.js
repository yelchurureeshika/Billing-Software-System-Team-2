const Category = require("../models/category");

// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim()
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message
    });
  }
};


// GET ALL CATEGORIES + SEARCH
const getCategories = async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {};

    // Search category by name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    // Filter by status
    if (status) {
      filter.status = status.toUpperCase();
    }

    const categories = await Category.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message
    });
  }
};


// GET SINGLE CATEGORY
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message
    });
  }
};


// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Check duplicate name
    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({
        name: name.trim(),
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(409).json({
          success: false,
          message: "Another category with this name already exists"
        });
      }

      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description;
    }

    if (status !== undefined) {
      if (!["ACTIVE", "INACTIVE"].includes(status.toUpperCase())) {
        return res.status(400).json({
          success: false,
          message: "Status must be ACTIVE or INACTIVE"
        });
      }

      category.status = status.toUpperCase();
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message
    });
  }
};


// DELETE / DEACTIVATE CATEGORY
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    // Soft delete
    category.status = "INACTIVE";

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category deactivated successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to deactivate category",
      error: error.message
    });
  }
};


module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};