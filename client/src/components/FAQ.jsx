import { useState } from 'react';

const faqs = [
  {
    question: "How does the AI automation work?",
    answer: "Our AI automation uses machine learning models to analyze your business processes, identify patterns, and automate repetitive tasks. The system learns from your data and user behavior to continuously improve its automation suggestions."
  },
  {
    question: "What integrations do you support?",
    answer: "AutomaFlow integrates with over 100 popular business tools including Salesforce, Shopify, QuickBooks, Google Workspace, Microsoft 365, Slack, and many more. We also offer a REST API for custom integrations."
  },
  {
    question: "Is my data secure with AutomaFlow?",
    answer: "Security is our top priority. We use enterprise-grade encryption (AES-256) for data at rest and in transit. Our platform is SOC 2 Type II compliant and GDPR ready."
  }
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <button 
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
        <i className={`fas fa-chevron-down text-gray-500 transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`}></i>
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about AutomaFlow. Can't find an answer?{" "}
            <a href="#" className="text-primary-600 hover:text-primary-700">Contact us</a>.
          </p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
