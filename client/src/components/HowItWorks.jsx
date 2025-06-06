import { Link } from "react-router-dom"; // For internal navigation in React

const steps = [
  {
    number: 1,
    title: 'Connect Your Data',
    description: 'Easily connect to your existing tools and databases with our secure, one-click integrations.'
  },
  {
    number: 2,
    title: 'Set Up Automation',
    description: 'Use our intuitive interface to create automation workflows with drag-and-drop simplicity.'
  },
  {
    number: 3,
    title: 'Analyze & Optimize',
    description: 'Monitor performance and let our AI suggest optimizations to maximize your results.'
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How AutomaFlow Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get started in minutes with our simple 3-step process. No technical expertise required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-primary-600 text-2xl font-bold">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="#" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition duration-150 ease-in-out">
            See It In Action
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
