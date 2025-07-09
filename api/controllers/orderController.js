import { Order } from "../models/Order.js"
import { Inventory } from "../models/Inventory.js"
import { sendOrderEmail } from "../services/emailService.js"

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { userId, inventoryId, quantityOrdered, supplierEmail, supplierName, supplierPhone, notes } = req.body

    // Validate input
    if (!userId || !inventoryId || !quantityOrdered || !supplierEmail || !supplierName) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    if (quantityOrdered <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(supplierEmail)) {
      return res.status(400).json({ message: "Invalid email format" })
    }

    // Get inventory item
    const inventory = await Inventory.findById(inventoryId)
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" })
    }

    // Create order
    const order = new Order({
      userId,
      inventoryId,
      productName: inventory.productName,
      category: inventory.category,
      quantityOrdered,
      supplierEmail: supplierEmail.toLowerCase().trim(), // Sanitize email
      supplierName: supplierName.trim(), // Sanitize name
      supplierPhone: supplierPhone?.trim(),
      notes: notes?.trim(),
    })

    await order.save()

    // Update inventory status
    inventory.status = "ordered"
    await inventory.save()

    // Send email to supplier
    try {
      await sendOrderEmail({
        to: supplierEmail,
        supplierName,
        productName: inventory.productName,
        category: inventory.category,
        quantity: quantityOrdered,
        notes,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Don't fail the order creation if email fails
    }

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all orders for a user
export const getOrders = async (req, res) => {
  try {
    const { userId } = req.params
    const { status } = req.query

    const filter = { userId }
    if (status && status !== "all") {
      filter.status = status
    }

    const orders = await Order.find(filter)
      .populate("inventoryId", "productName category currentStock")
      .sort({ orderDate: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Validate status
    const validStatuses = ["pending", "ordered", "received", "cancelled"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.status = status

    if (status === "received") {
      order.receivedDate = new Date()

      // Update inventory stock
      const inventory = await Inventory.findById(order.inventoryId)
      if (inventory) {
        inventory.currentStock += order.quantityOrdered
        inventory.status = inventory.currentStock > inventory.minimumStock ? "in-stock" : "low-stock"
        await inventory.save()
      }
    } else if (status === "cancelled") {
      // Update inventory status back to low-stock or out-of-stock
      const inventory = await Inventory.findById(order.inventoryId)
      if (inventory) {
        inventory.status = inventory.currentStock <= 0 ? "out-of-stock" : "low-stock"
        await inventory.save()
      }
    }

    await order.save()
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params

    const order = await Order.findByIdAndDelete(id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json({ message: "Order deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
