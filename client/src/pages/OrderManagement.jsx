"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Package, CheckCircle, XCircle, Clock, Mail, Phone, Calendar, Filter } from "lucide-react"
import { useSelector } from "react-redux"

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Mock user ID - replace with actual user ID from auth context
   const user = useSelector((state) => state.user.currentUser);
  const userId = user?._id

  useEffect(() => {
    fetchOrders()
  }, [selectedStatus])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams({
        ...(selectedStatus !== "all" && { status: selectedStatus }),
      })

      const response = await fetch(`/api/orders/user/${userId}?${params}`)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await fetch(`/api/orders/${orderId}`, { method: "DELETE" })
        fetchOrders()
      } catch (error) {
        console.error("Error deleting order:", error)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-800 bg-yellow-100 border-yellow-200"
      case "ordered":
        return "text-blue-800 bg-blue-100 border-blue-200"
      case "received":
        return "text-green-800 bg-green-100 border-green-200"
      case "cancelled":
        return "text-red-800 bg-red-100 border-red-200"
      default:
        return "text-gray-800 bg-gray-100 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "ordered":
        return <ShoppingCart className="w-4 h-4" />
      case "received":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Track and manage your inventory orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {["pending", "ordered", "received", "cancelled"].map((status) => {
          const count = orders.filter((order) => order.status === status).length
          return (
            <div key={status} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                {getStatusIcon(status)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="ordered">Ordered</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{order.productName}</h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600">{order.category}</p>
              </div>

              <div className="flex items-center gap-2">
                {order.status === "ordered" && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, "received")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Received
                  </button>
                )}

                {order.status !== "received" && order.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, "cancelled")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                )}

                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Quantity: {order.quantityOrdered}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{order.supplierEmail}</span>
              </div>

              {order.supplierPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.supplierPhone}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Supplier: {order.supplierName}</p>
                {order.notes && <p className="text-sm text-gray-600 mt-1">Notes: {order.notes}</p>}
              </div>

              {order.receivedDate && (
                <div className="text-right">
                  <p className="text-sm font-medium text-green-700">Received</p>
                  <p className="text-sm text-gray-600">{new Date(order.receivedDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">Orders will appear here when you place them from inventory items.</p>
        </div>
      )}
    </div>
  )
}

export default OrderManagement
