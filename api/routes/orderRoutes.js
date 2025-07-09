import express from "express"
import { createOrder, getOrders, updateOrderStatus, deleteOrder } from "../controllers/orderController.js"

const router = express.Router()

router.get("/user/:userId", getOrders)

router.post("/", createOrder)

router.patch("/:id/status", updateOrderStatus)

router.delete("/:id", deleteOrder)

export default router
