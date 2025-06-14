import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

export default function DashboardPreview() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/auth/signin");
      return; 
    }

    try {
      const parsedUser = JSON.parse(storedUser); // Parse the user from localStorage
      if (parsedUser.role !== "admin") {
        // If the user is not admin, redirect to unauthorized page
        navigate("/unauthorized");
      } else {
        setUser(parsedUser); // Set the user state if they are admin
      }
    } catch (error) {
      console.error("Invalid JSON in localStorage:", error);
      navigate("/auth/signin");
    } finally {
      setLoading(false); 
    }
  }, [navigate]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="mb-12 lg:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Insights at Your Fingertips</h2>
            <p className="text-lg text-gray-600 mb-6">
              Our intuitive dashboard gives you real-time visibility into your business performance with AI-generated recommendations to help you make better decisions.
            </p>
            <ul className="space-y-4">
              {['Real-time performance monitoring', 'Automated anomaly detection', 
                'Predictive trend analysis', 'Customizable reporting'].map((item, index) => (
                <li key={index} className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
            <div className="dashboard-mockup p-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Sales Performance</h3>
                  <p className="text-sm text-gray-500">Updated in real-time</p>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className="text-xl font-bold text-gray-800">$18,240</p>
                  <p className="text-xs text-green-500">↑ 7.8%</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Forecast</p>
                  <p className="text-xl font-bold text-gray-800">$21,500</p>
                  <p className="text-xs text-blue-500">94% confidence</p>
                </div>
              </div>
              <div className="chart-placeholder h-64 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl"></div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">AI Recommendation: Increase marketing budget by 15%</div>
                <button className="text-xs bg-primary-100 text-primary-800 px-3 py-1 rounded-full">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .dashboard-mockup {
          background: linear-gradient(145deg, #f0f4ff, #ffffff);
          border-radius: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
        }
        .dashboard-mockup::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 0.5rem;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
        }
      `}</style>
    </section>
  );
}
