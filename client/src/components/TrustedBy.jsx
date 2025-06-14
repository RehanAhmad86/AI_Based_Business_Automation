import { SiGoogle, SiAmazon, SiApple, SiSlack } from 'react-icons/si'; 
import { FaMicrosoft } from 'react-icons/fa'; // Correct Microsoft import

const companies = [
  { name: 'Google', icon: <SiGoogle size={40} className="text-gray-600" /> },
  { name: 'Amazon', icon: <SiAmazon size={40} className="text-gray-600" /> },
  { name: 'Apple', icon: <SiApple size={40} className="text-gray-600" /> },
  { name: 'Microsoft', icon: <FaMicrosoft size={40} className="text-gray-600" /> },
  { name: 'Slack', icon: <SiSlack size={40} className="text-gray-600" /> },
];

export default function TrustedBy() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-8">
          TRUSTED BY INNOVATIVE COMPANIES WORLDWIDE
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
          {companies.map((company) => (
            <div
              key={company.name}
              className="flex items-center justify-center opacity-60 hover:opacity-80 transition-opacity"
            >
              {company.icon}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
