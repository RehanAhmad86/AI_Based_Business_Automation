import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Image from 'react-bootstrap/Image'; // Assuming you're using react-bootstrap for images, else you can use `img` tag

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, Retail Solutions",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    text: "AutomaFlow has transformed our operations. We've automated 80% of our manual processes and seen a 30% increase in productivity within the first two months.",
    stars: 5
  },
  {
    name: "Michael Chen",
    role: "COO, TechStart Inc.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    text: "The sales predictions are incredibly accurate. We've been able to optimize our inventory and reduce waste by 25% while improving customer satisfaction.",
    stars: 5
  },
  {
    name: "David Rodriguez",
    role: "Director, Global Logistics",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80",
    text: "The AI chatbot alone has saved us over $50,000 in customer support costs annually while improving response times. The ROI was immediate.",
    stars: 4.5
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what businesses like yours are saying about AutomaFlow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card bg-gray-50 p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.image}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-4"
                  alt={testimonial.name}
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.text}"</p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => {
                  if (i < Math.floor(testimonial.stars)) {
                    return <FaStar key={i} />;
                  } else if (i < testimonial.stars) {
                    return <FaStarHalfAlt key={i} />;
                  } else {
                    return <FaRegStar key={i} className="text-gray-300" />;
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
