"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Package } from "lucide-react"

const EditInventory = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [inventory, setInventory] = useState(null)
  const [formData, setFormData] = useState({
    initialStock: "",
    minimumStock: "",
  })

  useEffect(() => {
    fetchInventory()
  }, [id])

  const fetchInventory = async () => {
    try {
      const response = await fetch(`/api/inventory/${id}`)
      const data = await response.json()
      setInventory(data)
      setFormData({
        initialStock: data.initialStock,
        minimumStock: data.minimumStock,
      })
    } catch (error) {
      console.error("Error fetching inventory:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initialStock: Number.parseInt(formData.initialStock),
          minimumStock: Number.parseInt(formData.minimumStock),
        }),
      })

      if (response.ok) {
        navigate(`/inventory/${id}`)
      } else {
        const error = await response.json()
        alert(error.message || "Error updating inventory item")
      }
    } catch (error) {
      console.error("Error updating inventory:", error)
      alert("Error updating inventory item")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!inventory) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(`/inventory/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Inventory</h1>
          <p className="text-gray-600 mt-2">Update inventory settings for {inventory.productName}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border">
        {/* Product Info */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-900">{inventory.productName}</h3>
              <p className="text-sm text-gray-600">{inventory.category}</p>
              <p className="text-sm text-gray-500">Current Stock: {inventory.currentStock}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock Quantity *</label>
            <input
              type="number"
              name="initialStock"
              value={formData.initialStock}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter initial stock quantity"
            />
            <p className="text-sm text-gray-500 mt-1">The starting quantity of this product in your inventory</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock Level *</label>
            <input
              type="number"
              name="minimumStock"
              value={formData.minimumStock}
              onChange={handleChange}
              min="0"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter minimum stock level"
            />
            <p className="text-sm text-gray-500 mt-1">You'll be alerted when stock falls below this level</p>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(`/inventory/${id}`)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Updating..." : "Update Inventory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditInventory
