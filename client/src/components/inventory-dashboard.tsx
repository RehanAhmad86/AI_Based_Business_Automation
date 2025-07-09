"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Package, AlertTriangle, Mail, Check, Edit, Trash2, X } from "lucide-react"

interface Product {
  _id: string
  name: string
  category: string
}

interface InventoryItem {
  _id: string
  productId: string
  productName: string
  category: string
  initialStock: number
  currentStock: number
  minimumStock: number
  status: "in-stock" | "low-stock" | "ordered" | "out-of-stock"
  lastUpdated: string
}

interface Order {
  _id: string
  productId: string
  productName: string
  category: string
  quantity: number
  supplierEmail: string
  supplierName: string
  orderDate: string
  status: "pending" | "received" | "cancelled"
  notes?: string
}

const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Home & Garden",
  "Sports & Outdoors",
  "Books & Media",
  "Health & Beauty",
  "Automotive",
  "Toys & Games",
  "Office Supplies",
]

export function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [activeTab, setActiveTab] = useState("inventory")

  // Modal states
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [isAddingInventory, setIsAddingInventory] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const [isUpdatingStock, setIsUpdatingStock] = useState(false)
  const [orderingItem, setOrderingItem] = useState<InventoryItem | null>(null)
  const [updatingItem, setUpdatingItem] = useState<InventoryItem | null>(null)

  // Form states
  const [newProduct, setNewProduct] = useState({ name: "", category: "" })
  const [newInventory, setNewInventory] = useState({
    productId: "",
    initialStock: "",
    minimumStock: "",
  })
  const [orderForm, setOrderForm] = useState({
    supplierEmail: "",
    supplierName: "",
    quantity: "",
    notes: "",
  })
  const [stockUpdate, setStockUpdate] = useState("")

  useEffect(() => {
    fetchProducts()
    fetchInventory()
    fetchOrders()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/inventory")
      const data = await response.json()
      setInventory(data)
    } catch (error) {
      console.error("Error fetching inventory:", error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const addProduct = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      })
      if (response.ok) {
        fetchProducts()
        setNewProduct({ name: "", category: "" })
        setIsAddingProduct(false)
      }
    } catch (error) {
      console.error("Error adding product:", error)
    }
  }

  const addInventoryItem = async () => {
    try {
      const product = products.find((p) => p._id === newInventory.productId)
      const inventoryData = {
        ...newInventory,
        productName: product?.name,
        category: product?.category,
        currentStock: Number.parseInt(newInventory.initialStock),
        initialStock: Number.parseInt(newInventory.initialStock),
        minimumStock: Number.parseInt(newInventory.minimumStock),
      }

      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inventoryData),
      })
      if (response.ok) {
        fetchInventory()
        setNewInventory({ productId: "", initialStock: "", minimumStock: "" })
        setIsAddingInventory(false)
      }
    } catch (error) {
      console.error("Error adding inventory:", error)
    }
  }

  const updateStock = async (itemId: string, newStock: number) => {
    try {
      const response = await fetch(`/api/inventory/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStock: newStock }),
      })
      if (response.ok) {
        fetchInventory()
        setIsUpdatingStock(false)
        setUpdatingItem(null)
        setStockUpdate("")
      }
    } catch (error) {
      console.error("Error updating stock:", error)
    }
  }

  const placeOrder = async () => {
    if (!orderingItem) return

    try {
      const orderData = {
        productId: orderingItem.productId,
        productName: orderingItem.productName,
        category: orderingItem.category,
        quantity: Number.parseInt(orderForm.quantity),
        supplierEmail: orderForm.supplierEmail,
        supplierName: orderForm.supplierName,
        notes: orderForm.notes,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        await fetch(`/api/inventory/${orderingItem._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ordered" }),
        })

        fetchInventory()
        fetchOrders()
        setOrderForm({ supplierEmail: "", supplierName: "", quantity: "", notes: "" })
        setIsOrdering(false)
        setOrderingItem(null)
      }
    } catch (error) {
      console.error("Error placing order:", error)
    }
  }

  const markOrderReceived = async (orderId: string, inventoryId: string, quantity: number) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "received" }),
      })

      const inventoryItem = inventory.find((item) => item._id === inventoryId)
      if (inventoryItem) {
        const newStock = inventoryItem.currentStock + quantity
        await fetch(`/api/inventory/${inventoryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentStock: newStock,
            status: newStock > inventoryItem.minimumStock ? "in-stock" : "low-stock",
          }),
        })
      }

      fetchInventory()
      fetchOrders()
    } catch (error) {
      console.error("Error marking order as received:", error)
    }
  }

  const deleteInventoryItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/inventory/${itemId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchInventory()
      }
    } catch (error) {
      console.error("Error deleting inventory item:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800 border-green-200"
      case "low-stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "ordered":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "out-of-stock":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products
  const lowStockItems = inventory.filter((item) => item.status === "low-stock" || item.status === "out-of-stock")

  // Modal Component
  const Modal = ({
    isOpen,
    onClose,
    title,
    children,
  }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Manage your products and inventory efficiently</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddingProduct(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
          <button
            onClick={() => setIsAddingInventory(true)}
            className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Package className="w-4 h-4 mr-2" />
            Add Inventory
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
            <div className="text-yellow-800">
              <p className="font-medium">Low Stock Alert</p>
              <p className="text-sm">
                You have {lowStockItems.length} item(s) with low or out of stock. Consider reordering soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "inventory"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "orders"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Orders
          </button>
        </nav>
      </div>

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          {inventory.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{item.productName}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {item.category}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                      >
                        {item.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-900">Current Stock:</span>
                        <span className="ml-2">{item.currentStock}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Minimum Level:</span>
                        <span className="ml-2">{item.minimumStock}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Initial Stock:</span>
                        <span className="ml-2">{item.initialStock}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    {(item.status === "low-stock" || item.status === "out-of-stock") && (
                      <button
                        onClick={() => {
                          setOrderingItem(item)
                          setIsOrdering(true)
                        }}
                        className="inline-flex items-center px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Order
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setUpdatingItem(item)
                        setStockUpdate(item.currentStock.toString())
                        setIsUpdatingStock(true)
                      }}
                      className="inline-flex items-center px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Update
                    </button>
                    <button
                      onClick={() => deleteInventoryItem(item._id)}
                      className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{order.productName}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {order.category}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : order.status === "received"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-900">Supplier:</span>
                        <span className="ml-2">{order.supplierName}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Email:</span>
                        <span className="ml-2">{order.supplierEmail}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Quantity:</span>
                        <span className="ml-2">{order.quantity}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Order Date:</span>
                        <span className="ml-2">{new Date(order.orderDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {order.notes && (
                      <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium text-gray-900">Notes:</span>
                        <span className="ml-2">{order.notes}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    {order.status === "pending" && (
                      <button
                        onClick={() => {
                          const inventoryItem = inventory.find((item) => item.productId === order.productId)
                          if (inventoryItem) {
                            markOrderReceived(order._id, inventoryItem._id, order.quantity)
                          }
                        }}
                        className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark Received
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal isOpen={isAddingProduct} onClose={() => setIsAddingProduct(false)} title="Add New Product">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select category</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Enter product name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={addProduct}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add Product
          </button>
        </div>
      </Modal>

      {/* Add Inventory Modal */}
      <Modal isOpen={isAddingInventory} onClose={() => setIsAddingInventory(false)} title="Add Inventory Item">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select category</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
            <select
              value={newInventory.productId}
              onChange={(e) => setNewInventory({ ...newInventory, productId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select product</option>
              {filteredProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock</label>
            <input
              type="number"
              value={newInventory.initialStock}
              onChange={(e) => setNewInventory({ ...newInventory, initialStock: e.target.value })}
              placeholder="Enter initial stock"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock Level</label>
            <input
              type="number"
              value={newInventory.minimumStock}
              onChange={(e) => setNewInventory({ ...newInventory, minimumStock: e.target.value })}
              placeholder="Enter minimum stock level"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={addInventoryItem}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add to Inventory
          </button>
        </div>
      </Modal>

      {/* Update Stock Modal */}
      <Modal
        isOpen={isUpdatingStock}
        onClose={() => setIsUpdatingStock(false)}
        title={`Update Stock - ${updatingItem?.productName}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Stock: {updatingItem?.currentStock}
            </label>
            <input
              type="number"
              value={stockUpdate}
              onChange={(e) => setStockUpdate(e.target.value)}
              placeholder="Enter new stock quantity"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => {
              if (updatingItem) {
                updateStock(updatingItem._id, Number.parseInt(stockUpdate))
              }
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Update Stock
          </button>
        </div>
      </Modal>

      {/* Order Modal */}
      <Modal
        isOpen={isOrdering}
        onClose={() => setIsOrdering(false)}
        title={`Place Order - ${orderingItem?.productName}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name</label>
            <input
              type="text"
              value={orderForm.supplierName}
              onChange={(e) => setOrderForm({ ...orderForm, supplierName: e.target.value })}
              placeholder="Enter supplier name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Email</label>
            <input
              type="email"
              value={orderForm.supplierEmail}
              onChange={(e) => setOrderForm({ ...orderForm, supplierEmail: e.target.value })}
              placeholder="Enter supplier email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity to Order</label>
            <input
              type="number"
              value={orderForm.quantity}
              onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
              placeholder="Enter quantity"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={orderForm.notes}
              onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
              placeholder="Additional notes for the supplier"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={placeOrder}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Order Email
          </button>
        </div>
      </Modal>
    </div>
  )
}
