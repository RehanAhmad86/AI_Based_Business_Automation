

const features = [
    {
      icon: 'project-diagram',
      color: 'primary',
      title: 'AI Workflow Automation',
      description: 'Automate repetitive tasks and complex workflows with our intelligent automation engine that learns and improves over time.'
    },
    {
      icon: 'chart-line',
      color: 'purple',
      title: 'Sales Prediction',
      description: 'Leverage predictive analytics to forecast sales trends, customer behavior, and inventory needs with 90%+ accuracy.'
    },
    {
      icon: 'robot',
      color: 'blue',
      title: 'Smart ChatBot Support',
      description: 'Our AI-powered chatbots handle customer inquiries 24/7, reducing response times and improving satisfaction.'
    },
    {
      icon: 'chart-pie',
      color: 'green',
      title: 'Visual Business Analytics',
      description: 'Transform complex data into beautiful, interactive visualizations that reveal insights at a glance.'
    },
  ];

  const colorMap = {
    primary: 'bg-primary-100 text-primary-600',
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
  };
  
  export default function Features() {
    return (
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features for Your Business</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform helps you automate repetitive tasks, predict future trends, and make data-driven decisions with confidence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card bg-white p-6 rounded-xl shadow-sm transition duration-300 ease-in-out hover:-translate-y-2">
                <div className={`w-12 h-12 ${colorMap[feature.color]} rounded-lg flex items-center justify-center mb-4`}>
                  <i className={`fas fa-${feature.icon} text-${feature.color}-600 text-xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  