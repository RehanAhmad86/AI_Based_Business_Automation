import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: 'chart-line',
    color: 'primary',
    title: 'AI Sales Prediction',
    description: 'Use TensorFlow.js machine learning models to predict sales trends and forecast business performance with high accuracy.',
    route: '/sales-predict'
  },
  {
    icon: 'chart-bar',
    color: 'purple', 
    title: 'Sales Analytics Dashboard',
    description: 'View your AI predictions in interactive charts and graphs with intelligent insights from your sales data.',
    route: '/sales-analytics'
  },
  {
    icon: 'file-invoice-dollar',
    color: 'blue',
    title: 'Invoice Generator',
    description: 'Create professional invoices with multiple templates and color options. Download instantly with one click.',
    route: '/invoice-generator'
  },
  {
    icon: 'envelope',
    color: 'green',
    title: 'AI Letter Generator', 
    description: 'Generate professional letters and emails using AI. Download as PDF or copy to clipboard.',
    route: '/tone-email'
  },
  {
    icon: 'camera',
    color: 'orange',
    title: 'Invoice Scanner',
    description: 'Scan and extract data from invoices automatically using OCR technology.',
    route: '/invoice-scanner'
  },
  {
    icon: 'barcode',
    color: 'teal',
    title: 'Barcode Scanner',
    description: 'Scan product barcodes for inventory management and product identification.',
    route: '/barcode-scanner'
  }
];

const colorMap = {
  primary: 'bg-blue-100 text-blue-600',
  purple: 'bg-purple-100 text-purple-600', 
  blue: 'bg-indigo-100 text-indigo-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  teal: 'bg-teal-100 text-teal-600',
};

export default function Features() {
  const navigate = useNavigate();

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <section id="features" className="py-16 bg-gray-50">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="text-center mb-16">
      <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold mb-6 shadow-sm">
        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
        AI-Powered Business Tools
      </div>
      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-6">
        Transform Your Business Operations
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Streamline your workflow with our comprehensive suite of AI-powered tools designed for modern businesses
      </p>
    </div>
            
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div 
          key={index} 
          onClick={() => handleFeatureClick(feature.route)}
          className="group relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200/50 transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer overflow-hidden"
          style={{
            animationDelay: `${index * 100}ms`
          }}
        >
          {/* Gradient Background on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-10 transform rotate-12 translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
            <i className={`fas fa-${feature.icon} text-4xl text-gray-400`}></i>
          </div>

          {/* Icon Container */}
          <div className={`relative w-16 h-16 ${colorMap[feature.color]} rounded-2xl flex items-center justify-center mb-6 border-2 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
            <i className={`fas fa-${feature.icon} text-2xl`}></i>
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
              {feature.description}
            </p>

            {/* CTA Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                <span className="mr-2">Explore Tool</span>
                <i className="fas fa-arrow-right transform group-hover:translate-x-2 transition-transform duration-300"></i>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 transform scale-0 group-hover:scale-100">
                <i className="fas fa-external-link-alt text-white text-xs"></i>
              </div>
            </div>
          </div>

          {/* Hover Border Effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200/50 rounded-2xl transition-all duration-500"></div>
          
          {/* Shine Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Bottom Section */}
    <div className="text-center mt-16">
      <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1 group">
        <i className="fas fa-rocket mr-3 group-hover:animate-bounce"></i>
        Start Your AI Journey Today
        <i className="fas fa-arrow-right ml-3 transform group-hover:translate-x-1 transition-transform duration-300"></i>
      </div>
      <p className="text-gray-500 text-sm mt-4">No credit card required • Free trial available</p>
    </div>
  </div>
</section>
  );
}