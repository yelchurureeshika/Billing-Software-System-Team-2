const express = require("express");
const {
    getInventoryItems,
    getInventoryItemById,
    getLowStockItems,
    getInventorySummary,
    createInventoryItem,
    updateInventoryItem,
    adjustInventory,
    deleteInventoryItem
} = require("../controllers/inventoryController");

const router = express.Router();

router.get("/summary", getInventorySummary);
router.get("/low-stock", getLowStockItems);
router.get("/", getInventoryItems);
router.get("/:id", getInventoryItemById);
router.post("/", createInventoryItem);
router.patch("/adjust", adjustInventory);
router.put("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

module.exports = router;
