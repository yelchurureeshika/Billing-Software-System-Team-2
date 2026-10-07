const express = require("express");
const {
    getInventoryItems,
    getInventoryItemById,
    getLowStockItems,
    getInventorySummary,
    createInventoryItem,
    createInventoryItems,
    updateInventoryItem,
    adjustInventory,
    deleteInventoryItem
} = require("../controllers/inventoryController");

const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary",authenticate, getInventorySummary);
router.get("/low-stock",authenticate, getLowStockItems);
router.get("/",authenticate, getInventoryItems);
router.get("/:id",authenticate, getInventoryItemById);

router.post("/",authenticate, createInventoryItem);
router.post("/bulk",authenticate, createInventoryItems);

router.patch("/adjust",authenticate, adjustInventory);
router.put("/:id",authenticate, updateInventoryItem);
router.delete("/:id",authenticate, deleteInventoryItem);

module.exports = router;
