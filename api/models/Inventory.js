import mongoose from "mongoose"

const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    initialStock: {
      type: Number,
      required: true,
      min: 0,
    },
    currentStock: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumStock: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["in-stock", "low-stock", "out-of-stock", "ordered"],
      default: "in-stock",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Update status based on stock levels
inventorySchema.pre("save", function (next) {
  if (this.currentStock <= 0) {
    this.status = "out-of-stock"
  } else if (this.currentStock <= this.minimumStock) {
    this.status = "low-stock"
  } else if (this.status !== "ordered") {
    this.status = "in-stock"
  }
  next()
})

export const Inventory = mongoose.model("Inventory", inventorySchema)
