import { Inventory } from "../models/Inventory.js"
import { Product } from "../models/productModel.js" // Updated import path
import mongoose from "mongoose"

// Get all inventory items for a user
export const getInventory = async (req, res) => {
  try {
    const { userId } = req.params
    const { category, status, search } = req.query

    const filter = { userId }

    if (category && category !== "all") {
      filter.category = category
    }

    if (status && status !== "all") {
      filter.status = status
    }

    if (search) {
      filter.productName = { $regex: search, $options: "i" }
    }

    const inventory = await Inventory.find(filter).populate("productId", "name category").sort({ lastUpdated: -1 })

    res.json(inventory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get single inventory item
export const getInventoryItem = async (req, res) => {
  try {
    const { id } = req.params
    const inventory = await Inventory.findById(id).populate("productId", "name category")

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" })
    }

    res.json(inventory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create new inventory item
export const createInventory = async (req, res) => {
  try {
    const { userId, productId, initialStock, minimumStock } = req.body

    // Validate input
    if (!userId || !productId || initialStock < 0 || minimumStock < 0) {
      return res.status(400).json({ message: "Invalid input data" })
    }

    // Check if inventory already exists for this product
    const existingInventory = await Inventory.findOne({ userId, productId })
    if (existingInventory) {
      return res.status(400).json({ message: "Inventory already exists for this product" })
    }

    // Get product details
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const inventory = new Inventory({
      userId,
      productId,
      productName: product.name,
      category: product.category,
      initialStock,
      currentStock: initialStock,
      minimumStock,
    })

    await inventory.save()
    await inventory.populate("productId", "name category")

    res.status(201).json(inventory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update inventory item
export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Validate numeric fields
    if (updates.initialStock && updates.initialStock < 0) {
      return res.status(400).json({ message: "Initial stock cannot be negative" })
    }
    if (updates.minimumStock && updates.minimumStock < 0) {
      return res.status(400).json({ message: "Minimum stock cannot be negative" })
    }

    const inventory = await Inventory.findByIdAndUpdate(
      id,
      { ...updates, lastUpdated: Date.now() },
      { new: true, runValidators: true },
    ).populate("productId", "name category")

    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" })
    }

    res.json(inventory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update stock quantity
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params
    const { quantity, operation } = req.body

    // Validate input
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" })
    }

    if (!["add", "subtract"].includes(operation)) {
      return res.status(400).json({ message: "Operation must be 'add' or 'subtract'" })
    }

    const inventory = await Inventory.findById(id)
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" })
    }

    if (operation === "add") {
      inventory.currentStock += quantity
    } else if (operation === "subtract") {
      inventory.currentStock = Math.max(0, inventory.currentStock - quantity)
    }

    inventory.lastUpdated = Date.now()
    await inventory.save()
    await inventory.populate("productId", "name category")

    res.json(inventory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete inventory item
export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params

    const inventory = await Inventory.findByIdAndDelete(id)
    if (!inventory) {
      return res.status(404).json({ message: "Inventory item not found" })
    }

    res.json({ message: "Inventory item deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get low stock items
export const getLowStockItems = async (req, res) => {
  try {
    const { userId } = req.params

    const lowStockItems = await Inventory.find({
      userId,
      status: { $in: ["low-stock", "out-of-stock"] },
    }).populate("productId", "name category")

    res.json(lowStockItems)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get inventory statistics - FIXED mongoose ObjectId usage
export const getInventoryStats = async (req, res) => {
  try {
    const { userId } = req.params

    const stats = await Inventory.aggregate([
      // { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // FIXED: Added 'new'
         { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalStock: { $sum: "$currentStock" },
          lowStockItems: {
            $sum: {
              $cond: [{ $eq: ["$status", "low-stock"] }, 1, 0],
            },
          },
          outOfStockItems: {
            $sum: {
              $cond: [{ $eq: ["$status", "out-of-stock"] }, 1, 0],
            },
          },
          orderedItems: {
            $sum: {
              $cond: [{ $eq: ["$status", "ordered"] }, 1, 0],
            },
          },
        },
      },
    ])

    const categoryStats = await Inventory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalStock: { $sum: "$currentStock" },
        },
      },
    ])

    res.json({
      overview: stats[0] || {
        totalItems: 0,
        totalStock: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        orderedItems: 0,
      },
      categoryBreakdown: categoryStats,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
