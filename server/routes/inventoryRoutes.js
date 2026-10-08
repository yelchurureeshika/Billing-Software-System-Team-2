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



const router = express.Router();

router.get("/summary", getInventorySummary);
router.get("/low-stock", getLowStockItems);
router.get("/",authenticate, getInventoryItems);
router.get("/:id", getInventoryItemById);

router.post("/", createInventoryItem);
router.post("/bulk", createInventoryItems);

router.patch("/adjust", adjustInventory);
router.put("/:id", updateInventoryItem);
router.delete("/:id", deleteInventoryItem);

module.exports = router;
