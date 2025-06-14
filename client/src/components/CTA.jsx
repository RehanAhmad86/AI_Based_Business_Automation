import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business with AI?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of businesses automating smarter and growing faster with AutomaFlow.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/start-trial"
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition duration-150 ease-in-out shadow-md"
          >
            Start Free 14-Day Trial
          </Link>
          <Link 
            to="/schedule-demo"
            className="bg-transparent border-2 border-white hover:bg-white hover:bg-opacity-10 px-8 py-3 rounded-lg text-lg font-semibold transition duration-150 ease-in-out"
          >
            Schedule Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
