import { Link } from 'react-router-dom'; // Using React Router for internal navigation

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Integrations", "Updates"]
  },
  {
    title: "Resources",
    links: ["Documentation", "Tutorials", "Blog", "Webinars"]
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Partners"]
  }
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <i className="fas fa-robot text-primary-400 text-2xl mr-2"></i>
              <span className="text-xl font-bold text-white">
                Automa<span className="text-primary-400">Flow</span>
              </span>
            </div>
            <p className="text-sm mb-4">
              AI-powered business automation that helps you work smarter, not harder.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'linkedin', 'youtube'].map((platform) => (
                <a 
                  key={platform} 
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <i className={`fab fa-${platform} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link 
                      to="#" 
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; 2023 AutomaFlow. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="#" className="text-sm hover:text-white">Privacy Policy</Link>
            <Link to="#" className="text-sm hover:text-white">Terms of Service</Link>
            <Link to="#" className="text-sm hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
