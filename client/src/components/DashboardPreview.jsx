export default function DashboardPreview() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Heading Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            AI-Based Business Automation
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A MERN-stack powered solution that integrates AI models 
            (TensorFlow.js & Brain.js) to automate sales forecasting, 
            inventory management, anomaly detection, and business operations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* Sales Prediction */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-gray-800 mb-3">📊 Sales Prediction</h3>
            <p className="text-gray-600 text-sm mb-4">
              TensorFlow.js forecasts upcoming sales.  
              Example: Predicted Sales (Next Month): <span className="font-semibold">$25,000</span>.
            </p>
            <div className="h-32 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center text-indigo-700 font-medium">
              Graph Placeholder
            </div>
          </div>

          {/* Sales Analytics */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-gray-800 mb-3">📈 Sales Analytics</h3>
            <p className="text-gray-600 text-sm mb-4">
              View past predictions, charts, and AI insights for better decision-making.  
              Example: "AI suggests increasing marketing by 12%."
            </p>
            <div className="h-32 bg-gradient-to-r from-teal-100 to-teal-200 rounded-lg flex items-center justify-center text-teal-700 font-medium">
              Chart + Insight
            </div>
          </div>

          {/* Inventory Management */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-gray-800 mb-3">📦 Inventory Management</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage products with CRUD operations. Alerts trigger when stock falls 
              below levels.  
              Example: "Product X is below minimum threshold."
            </p>
            <div className="h-32 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center text-green-700 font-medium">
              Inventory Alert
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-gray-800 mb-3">🛒 Orders</h3>
            <p className="text-gray-600 text-sm mb-4">
              Place supplier orders directly. Nodemailer sends confirmation emails.  
              Example: "Order #1025 placed for 200 units."
            </p>
            <div className="h-32 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center text-yellow-700 font-medium">
              Order Confirmation
            </div>
          </div>

          {/* Anomaly Detection */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-gray-800 mb-3">⚡ Anomaly Detection</h3>
            <p className="text-gray-600 text-sm mb-4">
              Brain.js detects unusual spikes or drops in inventory.  
              Example: "⚠️ Sudden 40% drop in Product Y stock."
            </p>
            <div className="h-32 bg-gradient-to-r from-red-100 to-red-200 rounded-lg flex items-center justify-center text-red-700 font-medium">
              Alert Example
            </div>
          </div>

          {/* DB Mode Chatbot */}
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-bold text-gray-800 mb-3">🤖 DB Mode Chatbot</h3>
            <p className="text-gray-600 text-sm mb-4">
              Predefined DB queries for products, inventory, predictions, and orders.  
              Example: "Show me current inventory levels."
            </p>
            <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-700 font-medium">
              Chat Response
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
