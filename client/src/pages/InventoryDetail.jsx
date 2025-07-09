"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Package, AlertTriangle, ShoppingCart, Plus, Minus, Edit, Trash2, Mail } from "lucide-react"
import OrderModal from "../components/OrderModal.jsx"

const InventoryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [inventory, setInventory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [stockUpdate, setStockUpdate] = useState({ quantity: "", operation: "add" })

  useEffect(() => {
    fetchInventory()
  }, [id])

  const fetchInventory = async () => {
    try {
      const response = await fetch(`/api/inventory/${id}`)
      const data = await response.json()
      setInventory(data)
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = async (e) => {
    e.preventDefault()
    if (!stockUpdate.quantity || stockUpdate.quantity <= 0) return

    try {
      const response = await fetch(`/api/inventory/${id}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: Number.parseInt(stockUpdate.quantity),
          operation: stockUpdate.operation,
        }),
      })

      if (response.ok) {
        fetchInventory()
        setStockUpdate({ quantity: "", operation: "add" })
      }
    } catch (error) {
      console.error("Error updating stock:", error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      try {
        await fetch(`/api/inventory/${id}`, { method: "DELETE" })
        navigate("/inventory")
      } catch (error) {
        console.error("Error deleting inventory:", error)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "in-stock":
        return "text-green-800 bg-green-100 border-green-200"
      case "low-stock":
        return "text-yellow-800 bg-yellow-100 border-yellow-200"
      case "out-of-stock":
        return "text-red-800 bg-red-100 border-red-200"
      case "ordered":
        return "text-blue-800 bg-blue-100 border-blue-200"
      default:
        return "text-gray-800 bg-gray-100 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "in-stock":
        return <Package className="w-5 h-5" />
      case "low-stock":
        return <AlertTriangle className="w-5 h-5" />
      case "out-of-stock":
        return <AlertTriangle className="w-5 h-5" />
      case "ordered":
        return <ShoppingCart className="w-5 h-5" />
      default:
        return <Package className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!inventory) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inventory item not found</h3>
          <Link to="/inventory" className="text-blue-600 hover:text-blue-800">
            Back to Inventory
          </Link>
        </div>
      </div>
    )
  }

  const isLowStock = inventory.status === "low-stock" || inventory.status === "out-of-stock"

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/inventory")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{inventory.productName}</h1>
            <p className="text-gray-600 mt-2">{inventory.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/inventory/edit/${inventory._id}`}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-2 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(inventory.status)}`}
              >
                {getStatusIcon(inventory.status)}
                <span className="font-medium capitalize">{inventory.status.replace("-", " ")}</span>
              </div>
            </div>

            {/* Low Stock Alert */}
            {isLowStock && inventory.status !== "ordered" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">
                      {inventory.status === "out-of-stock" ? "Out of Stock!" : "Low Stock Alert!"}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(true)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Order Now
                  </button>
                </div>
                <p className="text-yellow-700 mt-2">
                  Stock level is {inventory.status === "out-of-stock" ? "empty" : "below minimum threshold"}. Consider
                  placing an order.
                </p>
              </div>
            )}

            {inventory.status === "ordered" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Order Placed</span>
                </div>
                <p className="text-blue-700 mt-2">
                  An order has been placed for this item. Check the orders section for details.
                </p>
              </div>
            )}

            {/* Stock Levels */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{inventory.currentStock}</p>
                <p className="text-sm text-gray-600">Current Stock</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{inventory.minimumStock}</p>
                <p className="text-sm text-gray-600">Minimum Stock</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{inventory.initialStock}</p>
                <p className="text-sm text-gray-600">Initial Stock</p>
              </div>
            </div>
          </div>

          {/* Stock Update */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Stock</h2>
            <form onSubmit={handleStockUpdate} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={stockUpdate.quantity}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, quantity: e.target.value })}
                    min="1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                  <select
                    value={stockUpdate.operation}
                    onChange={(e) => setStockUpdate({ ...stockUpdate, operation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="add">Add Stock</option>
                    <option value="subtract">Remove Stock</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {stockUpdate.operation === "add" ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                Update Stock
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Product Name</p>
                <p className="text-gray-900">{inventory.productName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Category</p>
                <p className="text-gray-900">{inventory.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-gray-900">{new Date(inventory.lastUpdated).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Created</p>
                <p className="text-gray-900">{new Date(inventory.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/orders"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                View Orders
              </Link>
              <Link
                to="/inventory"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Package className="w-4 h-4" />
                All Inventory
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <OrderModal
          inventory={inventory}
          onClose={() => setShowOrderModal(false)}
          onSuccess={() => {
            setShowOrderModal(false)
            fetchInventory()
          }}
        />
      )}
    </div>
  )
}

export default InventoryDetail
