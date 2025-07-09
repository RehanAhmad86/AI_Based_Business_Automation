import mongoose from "mongoose"

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
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
    quantityOrdered: {
      type: Number,
      required: true,
      min: 1,
    },
    supplierEmail: {
      type: String,
      required: true,
    },
    supplierName: {
      type: String,
      required: true,
    },
    supplierPhone: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "ordered", "received", "cancelled"],
      default: "ordered",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    receivedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

export const Order = mongoose.model("Order", orderSchema)
