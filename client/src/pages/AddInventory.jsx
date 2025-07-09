"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Package, Search } from "lucide-react"
import { useSelector } from "react-redux"

const AddInventory = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [formData, setFormData] = useState({
    productId: "",
    initialStock: "",
    minimumStock: "",
  })

  // Mock user ID - replace with actual user ID from auth context
   const user = useSelector((state) => state.user.currentUser);
  const userId = user?._id

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [selectedCategory, searchTerm])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/products/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId,
          initialStock: Number.parseInt(formData.initialStock),
          minimumStock: Number.parseInt(formData.minimumStock),
        }),
      })

      if (response.ok) {
        navigate("/inventory")
      } else {
        const error = await response.json()
        alert(error.message || "Error creating inventory item")
      }
    } catch (error) {
      console.error("Error creating inventory:", error)
      alert("Error creating inventory item")
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

  const selectedProduct = products.find((p) => p._id === formData.productId)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate("/inventory")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Inventory Item</h1>
          <p className="text-gray-600 mt-2">Add a new product to your inventory</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Selection */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Product</h2>

          {/* Search and Filter */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Product List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {products.map((product) => (
              <div
                key={product._id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.productId === product._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setFormData({ ...formData, productId: product._id })}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      checked={formData.productId === product._id}
                      onChange={() => setFormData({ ...formData, productId: product._id })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No products found</p>
            </div>
          )}
        </div>

        {/* Inventory Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Inventory Details</h2>

          {selectedProduct && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900">Selected Product</h3>
              <p className="text-blue-700">{selectedProduct.name}</p>
              <p className="text-sm text-blue-600">{selectedProduct.category}</p>
            </div>
          )}

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
                onClick={() => navigate("/inventory")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.productId}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Adding..." : "Add Inventory"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddInventory
