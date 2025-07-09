import express from "express"
import {
  getInventory,
  getInventoryItem,
  createInventory,
  updateInventory,
  updateStock,
  deleteInventory,
  getLowStockItems,
  getInventoryStats,
} from "../controllers/inventoryController.js"

const router = express.Router()

router.get("/user/:userId", getInventory)

router.get("/user/:userId/stats", getInventoryStats)

router.get("/user/:userId/low-stock", getLowStockItems)

router.get("/:id", getInventoryItem)

router.post("/", createInventory)

router.put("/:id", updateInventory)

router.patch("/:id/stock", updateStock)

router.delete("/:id", deleteInventory)

export default router
