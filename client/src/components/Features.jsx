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

const colorConfig = {
  primary: {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    icon: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    text: 'text-blue-700',
    border: 'border-blue-200',
    shadow: 'shadow-blue-500/20',
    hover: 'hover:shadow-blue-500/30'
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
    icon: 'bg-gradient-to-br from-purple-500 to-violet-600',
    text: 'text-purple-700',
    border: 'border-purple-200',
    shadow: 'shadow-purple-500/20',
    hover: 'hover:shadow-purple-500/30'
  },
  blue: {
    bg: 'bg-gradient-to-br from-indigo-50 to-blue-50',
    icon: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    shadow: 'shadow-indigo-500/20',
    hover: 'hover:shadow-indigo-500/30'
  },
  green: {
    bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
    icon: 'bg-gradient-to-br from-emerald-500 to-green-600',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    shadow: 'shadow-emerald-500/20',
    hover: 'hover:shadow-emerald-500/30'
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
    icon: 'bg-gradient-to-br from-orange-500 to-amber-600',
    text: 'text-orange-700',
    border: 'border-orange-200',
    shadow: 'shadow-orange-500/20',
    hover: 'hover:shadow-orange-500/30'
  },
  teal: {
    bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
    icon: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    text: 'text-teal-700',
    border: 'border-teal-200',
    shadow: 'shadow-teal-500/20',
    hover: 'hover:shadow-teal-500/30'
  }
};

export default function Features() {
  const navigate = useNavigate();

  const handleFeatureClick = (route) => {
    navigate(route);
  };

  return (
    <section id="features" className="relative py-12 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-100 via-blue-50 to-indigo-100 border border-slate-200/60 rounded-full text-sm font-semibold text-slate-700 mb-8 shadow-sm backdrop-blur-sm">
            <div className="relative">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI-Powered Business Tools
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
              Transform Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Business Operations
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
            Streamline your workflow with our comprehensive suite of AI-powered tools designed for modern businesses
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const config = colorConfig[feature.color];
            
            return (
              <div 
                key={index} 
                onClick={() => handleFeatureClick(feature.route)}
                className={`group relative bg-white/90 backdrop-blur-sm p-8 lg:p-10 rounded-3xl border border-slate-200/60 transition-all duration-700 ease-out hover:-translate-y-4 hover:scale-[1.02] cursor-pointer ${config.shadow} hover:shadow-2xl ${config.hover}`}
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 ${config.bg} opacity-0 group-hover:opacity-60 transition-all duration-700 rounded-3xl`} />
                
                {/* Decorative Corner Element */}
                <div className="absolute -top-1 -right-1 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <div className={`w-full h-full ${config.icon} rounded-full transform rotate-12 scale-75`} />
                </div>

                {/* Icon Container */}
                <div className="relative mb-8">
                  <div className={`relative w-20 h-20 ${config.icon} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <i className={`fas fa-${feature.icon} text-3xl text-white`}></i>
                    
                    {/* Icon Shine Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  
                  {/* Icon Shadow */}
                  <div className={`absolute top-2 left-2 w-20 h-20 ${config.icon} rounded-2xl opacity-20 blur-lg -z-10 group-hover:blur-xl transition-all duration-500`} />
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-slate-800 transition-colors duration-300 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-lg group-hover:text-slate-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Action Area */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 group-hover:border-slate-200 transition-colors duration-300">
                    <div className={`flex items-center ${config.text} font-semibold text-lg group-hover:gap-3 transition-all duration-300`}>
                      <span>Explore Tool</span>
                      <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-2 transition-transform duration-300"></i>
                    </div>
                    
                    <div className={`w-12 h-12 ${config.icon} rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 transform scale-0 group-hover:scale-100 shadow-lg`}>
                      <i className="fas fa-external-link-alt text-white text-sm"></i>
                    </div>
                  </div>
                </div>

                {/* Border Glow Effect */}
                <div className={`absolute inset-0 ${config.border} border-2 opacity-0 group-hover:opacity-100 rounded-3xl transition-all duration-500`} />
                
                {/* Shine Animation */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1200 delay-200" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Decorative Element */}
        <div className="flex justify-center mt-20">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                style={{
                  animationDelay: `${i * 200}ms`,
                  animation: 'pulse 2s infinite'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}