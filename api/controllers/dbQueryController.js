import { Inventory } from "../models/Inventory.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/productModel.js";
import Prediction from "../models/predictionModel.js";
import mongoose from "mongoose";

// Predefined questions and their corresponding queries
const predefinedQuestions = {
  inventory: [
    {
      question: "Show me all my inventory items",
      query: "getAllInventory",
      description: "Get all inventory items for the user",
    },
    {
      question: "Which products are low in stock?",
      query: "getLowStockItems",
      description: "Find items with low stock levels",
    },
    {
      question: "What items are out of stock?",
      query: "getOutOfStockItems",
      description: "Find items that are completely out of stock",
    },
    {
      question: "Show me inventory by category",
      query: "getInventoryByCategory",
      description: "Group inventory items by category",
    },
    {
      question: "What's my total inventory value?",
      query: "getTotalInventoryValue",
      description: "Calculate total value of all inventory",
    },
  ],
  orders: [
    {
      question: "Show me all my orders",
      query: "getAllOrders",
      description: "Get all orders for the user",
    },
    {
      question: "What orders are pending?",
      query: "getPendingOrders",
      description: "Find orders with pending status",
    },
    {
      question: "Show me recent orders",
      query: "getRecentOrders",
      description: "Get orders from the last 30 days",
    },
    {
      question: "Which suppliers do I order from most?",
      query: "getTopSuppliers",
      description: "Find most frequently used suppliers",
    },
    {
      question: "What's my total order value this month?",
      query: "getMonthlyOrderValue",
      description: "Calculate total order value for current month",
    },
  ],
  products: [
    {
      question: "Show me all my products",
      query: "getAllProducts",
      description: "Get all products in the system",
    },
    {
      question: "What are my most expensive products?",
      query: "getMostExpensiveProducts",
      description: "Find products with highest base price",
    },
    {
      question: "Show me products by category",
      query: "getProductsByCategory",
      description: "Group products by category",
    },
    {
      question: "Which products have the best sales history?",
      query: "getBestSellingProducts",
      description: "Find products with highest historical sales",
    },
  ],
  predictions: [
    {
      question: "Show me all my sales predictions",
      query: "getAllPredictions",
      description: "Get all sales predictions for the user",
    },
    {
      question: "What are my highest confidence predictions?",
      query: "getHighConfidencePredictions",
      description: "Find predictions with confidence > 80%",
    },
    {
      question: "Show me predictions by product",
      query: "getPredictionsByProduct",
      description: "Group predictions by product name",
    },
    {
      question: "What's my predicted revenue this month?",
      query: "getPredictedRevenue",
      description: "Calculate total predicted sales revenue",
    },
  ],
};

// Query execution functions
const queryExecutors = {
  // Inventory queries
  getAllInventory: async (userId) => {
    const items = await Inventory.find({ userId }).sort({ lastUpdated: -1 });
    return {
      message: `You have ${items.length} inventory items`,
      data: items,
      summary: `Total items: ${items.length}, In stock: ${
        items.filter((i) => i.status === "in-stock").length
      }, Low stock: ${
        items.filter((i) => i.status === "low-stock").length
      }, Out of stock: ${
        items.filter((i) => i.status === "out-of-stock").length
      }`,
    };
  },

  getLowStockItems: async (userId) => {
    const items = await Inventory.find({ userId, status: "low-stock" });
    return {
      message: `You have ${items.length} items with low stock`,
      data: items,
      summary:
        items.length > 0
          ? `Items needing restock: ${items
              .map((i) => `${i.productName} (${i.currentStock} left)`)
              .join(", ")}`
          : "All items are well stocked!",
    };
  },

  getOutOfStockItems: async (userId) => {
    const items = await Inventory.find({ userId, status: "out-of-stock" });
    return {
      message: `You have ${items.length} items out of stock`,
      data: items,
      summary:
        items.length > 0
          ? `Out of stock items: ${items.map((i) => i.productName).join(", ")}`
          : "No items are out of stock!",
    };
  },

  getInventoryByCategory: async (userId) => {
    const items = await Inventory.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalStock: { $sum: "$currentStock" },
        },
      },
      { $sort: { count: -1 } },
    ]);
    return {
      message: `Inventory grouped by ${items.length} categories`,
      data: items,
      summary: `Categories: ${items
        .map((i) => `${i._id} (${i.count} items, ${i.totalStock} total stock)`)
        .join(", ")}`,
    };
  },
  getTotalInventoryValue: async (userId) => {
    const result = await Inventory.aggregate([
  { $match: { userId: new mongoose.Types.ObjectId(userId) } },
  { 
    $lookup: {
      from: "products",
      localField: "productId", 
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $group: {
      _id: null,
      totalValue: { 
        $sum: { $multiply: ["$currentStock", "$product.basePrice"] }
      },
      itemCount: { $sum: 1 }
    }
  }
]);
const totalValue = result[0]?.totalValue || 0;
const items = { length: result[0]?.itemCount || 0 };
    return {
      message: `Your total inventory value: $${totalValue.toFixed(2)}`,
      data: { totalValue, itemCount: items.length },
      summary: `Total value: $${totalValue.toFixed(2)} across ${
        items.length
      } items`,
    };
  },

  // Orders queries
  getAllOrders: async (userId) => {
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    return {
      message: `You have ${orders.length} orders`,
      data: orders,
      summary: `Total orders: ${orders.length}, Pending: ${
        orders.filter((o) => o.status === "pending").length
      }, Ordered: ${
        orders.filter((o) => o.status === "ordered").length
      }, Received: ${orders.filter((o) => o.status === "received").length}`,
    };
  },

  getPendingOrders: async (userId) => {
    const orders = await Order.find({ userId, status: "pending" });
    return {
      message: `You have ${orders.length} pending orders`,
      data: orders,
      summary:
        orders.length > 0
          ? `Pending orders: ${orders
              .map((o) => `${o.productName} (${o.quantityOrdered} units)`)
              .join(", ")}`
          : "No pending orders!",
    };
  },

  getRecentOrders: async (userId) => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const orders = await Order.find({
      userId,
      orderDate: { $gte: thirtyDaysAgo },
    });
    return {
      message: `You have ${orders.length} orders in the last 30 days`,
      data: orders,
      summary: `Recent orders: ${
        orders.length
      }, Total quantity: ${orders.reduce(
        (sum, o) => sum + o.quantityOrdered,
        0
      )} units`,
    };
  },

  getTopSuppliers: async (userId) => {
    const suppliers = await Order.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$supplierName",
          orderCount: { $sum: 1 },
          totalQuantity: { $sum: "$quantityOrdered" },
        },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 5 },
    ]);
    return {
      message: `Your top ${suppliers.length} suppliers`,
      data: suppliers,
      summary: `Top suppliers: ${suppliers
        .map((s) => `${s._id} (${s.orderCount} orders)`)
        .join(", ")}`,
    };
  },
  getMonthlyOrderValue: async (userId) => {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const orders = await Order.find({
      userId,
      orderDate: { $gte: currentMonth },
    });
    const result = await Order.aggregate([
  { $match: { userId: new mongoose.Types.ObjectId(userId), orderDate: { $gte: currentMonth } } },
  { $lookup: {
    from: "inventories",
    localField: "inventoryId", 
    foreignField: "_id",
    as: "inventory"
  }},
  { $unwind: "$inventory" },
  { $lookup: {
    from: "products",
    localField: "inventory.productId",
    foreignField: "_id", 
    as: "product"
  }},
  { $unwind: "$product" },
  { $group: {
    _id: null,
    totalValue: { $sum: { $multiply: ["$quantityOrdered", "$product.basePrice"] }},
    orderCount: { $sum: 1 }
  }}
]);
const totalValue = result[0]?.totalValue || 0;
const orderInfo = { length: result[0]?.orderCount || 0 };
    return {
      message: `This month's order value: $${totalValue.toFixed(2)}`,
      data: { totalValue, orderCount: orderInfo.length },
      summary: `Monthly orders: ${
        orders.length
      }, Total value: $${totalValue.toFixed(2)}`,
    };
  },

  // Products queries
  getAllProducts: async (userId) => {
    const products = await Product.find({});
    return {
      message: `There are ${products.length} products in the system`,
      data: products,
      summary: `Total products: ${products.length}, Categories: ${
        [...new Set(products.map((p) => p.category))].length
      }`,
    };
  },

  getMostExpensiveProducts: async (userId) => {
    const products = await Product.find({}).sort({ basePrice: -1 }).limit(10);
    return {
      message: `Top most expensive products`,
      data: products,
      summary: `Highest priced: ${products
        .slice(0, 3)
        .map((p) => `${p.name} ($${p.basePrice})`)
        .join(", ")}`,
    };
  },

  getProductsByCategory: async (userId) => {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$basePrice" },
        },
      },
      { $sort: { count: -1 } },
    ]);
    return {
      message: `Products grouped by ${categories.length} categories`,
      data: categories,
      summary: `Categories: ${categories
        .map(
          (c) =>
            `${c._id} (${c.count} products, avg $${c.avgPrice?.toFixed(2)})`
        )
        .join(", ")}`,
    };
  },
  getBestSellingProducts: async (userId) => {
    const products = await Product.aggregate([
  {
    $addFields: {
      totalSales: {
        $sum: "$historicalSales.unitsSold"
      }
    }
  },
  { $sort: { totalSales: -1 } },
  { $limit: 10 }
]);
    return {
      message: `Top best selling products`,
      data: products,
      summary: `Best sellers: ${products
        .slice(0, 3)
        .map((p) => `${p.name} (${p.totalSales} sold)`)
        .join(", ")}`,
    };
  },

  // Predictions queries
  getAllPredictions: async (userId) => {
    const predictions = await Prediction.find({ user: userId }).sort({
      createdAt: -1,
    });
    return {
      message: `You have ${predictions.length} sales predictions`,
      data: predictions,
      summary: `Total predictions: ${predictions.length}, Avg confidence: ${(
        predictions.reduce((sum, p) => sum + p.confidence, 0) /
        predictions.length
      ).toFixed(1)}%`,
    };
  },

  getHighConfidencePredictions: async (userId) => {
    const predictions = await Prediction.find({
      user: userId,
      confidence: { $gte: 80 },
    });
    return {
      message: `You have ${predictions.length} high confidence predictions`,
      data: predictions,
      summary:
        predictions.length > 0
          ? `High confidence predictions: ${predictions
              .map((p) => `${p.productName} (${p.confidence}%)`)
              .join(", ")}`
          : "No high confidence predictions found",
    };
  },
  getPredictionsByProduct: async (userId) => {
    const predictions = await Prediction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$productName",
          count: { $sum: 1 },
          avgConfidence: { $avg: "$confidence" },
          totalPredicted: { $sum: "$predictedSales" },
        },
      },
      { $sort: { totalPredicted: -1 } },
    ]);
    return {
      message: `Predictions grouped by ${predictions.length} products`,
      data: predictions,
      summary: `Products: ${predictions
        .map(
          (p) =>
            `${p._id} (${p.count} predictions, ${p.avgConfidence.toFixed(
              1
            )}% avg confidence)`
        )
        .join(", ")}`,
    };
  },

  getPredictedRevenue: async (userId) => {
    const predictions = await Prediction.find({ user: userId });
    const totalRevenue = predictions.reduce(
      (sum, p) => sum + p.predictedSales * p.basePrice,
      0
    );
    return {
      message: `Your predicted total revenue: $${totalRevenue.toFixed(2)}`,
      data: { totalRevenue, predictionCount: predictions.length },
      summary: `Based on ${
        predictions.length
      } predictions, estimated revenue: $${totalRevenue.toFixed(2)}`,
    };
  },
};

export const getPredefinedQuestions = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      questions: predefinedQuestions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const executeQuery = async (req, res) => {
  try {
    const { queryType, userId } = req.body;

    if (!queryType || !userId) {
      return res.status(400).json({
        success: false,
        error: "Query type and user ID are required",
      });
    }

    if (!queryExecutors[queryType]) {
      return res.status(400).json({
        success: false,
        error: "Invalid query type",
      });
    }

    const result = await queryExecutors[queryType](userId);

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Query execution error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const processNaturalQuery = async (req, res) => {
  try {
    const { question, userId } = req.body;

    if (!question || !userId) {
      return res.status(400).json({
        success: false,
        error: "Question and user ID are required",
      });
    }

    // Simple keyword matching to determine query type
    const questionLower = question.toLowerCase();
    let queryType = null;

    // Inventory keywords
    if (
      questionLower.includes("inventory") ||
      questionLower.includes("stock")
    ) {
      if (
        questionLower.includes("low") ||
        questionLower.includes("running out")
      ) {
        queryType = "getLowStockItems";
      } else if (
        questionLower.includes("out of stock") ||
        questionLower.includes("empty")
      ) {
        queryType = "getOutOfStockItems";
      } else if (
        questionLower.includes("category") ||
        questionLower.includes("group")
      ) {
        queryType = "getInventoryByCategory";
      } else if (
        questionLower.includes("total") ||
        questionLower.includes("value")
      ) {
        queryType = "getTotalInventoryValue";
      } else {
        queryType = "getAllInventory";
      }
    }
    // Orders keywords
    else if (questionLower.includes("order")) {
      if (
        questionLower.includes("pending") ||
        questionLower.includes("waiting")
      ) {
        queryType = "getPendingOrders";
      } else if (
        questionLower.includes("recent") ||
        questionLower.includes("latest")
      ) {
        queryType = "getRecentOrders";
      } else if (questionLower.includes("supplier")) {
        queryType = "getTopSuppliers";
      } else if (
        questionLower.includes("monthly") ||
        questionLower.includes("month")
      ) {
        queryType = "getMonthlyOrderValue";
      } else {
        queryType = "getAllOrders";
      }
    }
    // Products keywords
    else if (questionLower.includes("product")) {
      if (
        questionLower.includes("expensive") ||
        questionLower.includes("price")
      ) {
        queryType = "getMostExpensiveProducts";
      } else if (questionLower.includes("category")) {
        queryType = "getProductsByCategory";
      } else if (
        questionLower.includes("best") ||
        questionLower.includes("selling")
      ) {
        queryType = "getBestSellingProducts";
      } else {
        queryType = "getAllProducts";
      }
    }
    // Predictions keywords
    else if (
      questionLower.includes("prediction") ||
      questionLower.includes("forecast") ||
      questionLower.includes("sales")
    ) {
      if (
        questionLower.includes("confidence") ||
        questionLower.includes("accurate")
      ) {
        queryType = "getHighConfidencePredictions";
      } else if (
        questionLower.includes("product") ||
        questionLower.includes("by product")
      ) {
        queryType = "getPredictionsByProduct";
      } else if (
        questionLower.includes("revenue") ||
        questionLower.includes("money")
      ) {
        queryType = "getPredictedRevenue";
      } else {
        queryType = "getAllPredictions";
      }
    }

    if (!queryType) {
      return res.status(400).json({
        success: false,
        error:
          "Could not understand your question. Please try using one of the predefined questions.",
      });
    }

    const result = await queryExecutors[queryType](userId);

    res.status(200).json({
      success: true,
      result,
      queryType,
    });
  } catch (error) {
    console.error("Natural query processing error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};