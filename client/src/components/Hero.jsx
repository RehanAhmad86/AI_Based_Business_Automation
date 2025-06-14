// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom'; // For internal navigation in React

// export default function Hero() {
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) return null;

//   return (
//     <section className="bg-gradient-to-br from-primary-50 to-white py-16 md:py-24">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
//           <div className="mb-12 lg:mb-0">
//             <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
//               Automate Smarter. <span className="text-primary-600">Grow Faster.</span>
//             </h1>
//             <p className="text-lg text-gray-600 mb-8 max-w-lg">
//               Harness the power of AI to streamline your business workflows, predict sales trends, and gain actionable insights—all without writing a single line of code.
//             </p>
//             <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//               <Link to="#" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-base font-medium transition duration-150 ease-in-out shadow-md text-center">
//                 Start Free Trial
//               </Link>
//               <Link to="#" className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg text-base font-medium transition duration-150 ease-in-out shadow-sm text-center border border-gray-200">
//                 See Demo
//               </Link>
//             </div>
//             <div className="mt-8 flex items-center">
//               <div className="flex -space-x-2">
//                 {['1', '2', '3'].map((item) => (
//                   <img
//                     key={item}
//                     src={`https://randomuser.me/api/portraits/men/${item}.jpg`}
//                     width={40}
//                     height={40}
//                     className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
//                     alt="User"
//                   />
//                 ))}
//               </div>
//               <p className="ml-4 text-sm text-gray-600">
//                 Trusted by <span className="font-semibold">500+</span> businesses worldwide
//               </p>
//             </div>
//           </div>
          
//           <div className="relative">
//             <div className="dashboard-mockup p-4 floating">
//               {/* Dashboard content remains same as original */}
//               <div className="flex justify-between items-center mb-6">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800">Business Dashboard</h3>
//                   <p className="text-sm text-gray-500">Last updated: Just now</p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
//                   <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
//                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
//                 </div>
//               </div>
//               {/* ... rest of dashboard content ... */}
//             </div>
//           </div>
//         </div>
//       </div>
//       <style>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0); }
//           50% { transform: translateY(-10px); }
//         }
//         .floating { animation: float 4s ease-in-out infinite; }
//       `}</style>
//     </section>
//   );
// }

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const floatAnimation = {
  animation: 'float 4s ease-in-out infinite',
};

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section className="bg-gradient-to-br from-primary-50 to-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div className="mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Automate Smarter. <span className="text-primary-600">Grow Faster.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Harness the power of AI to streamline your business workflows, predict sales trends, and gain actionable insights—all without writing a single line of code.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="#" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-base font-medium transition duration-150 ease-in-out shadow-md text-center">
                Start Free Trial
              </Link>
              <Link to="#" className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg text-base font-medium transition duration-150 ease-in-out shadow-sm text-center border border-gray-200">
                See Demo
              </Link>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                {['1', '2', '3'].map((item) => (
                  <img
                    key={item}
                    src={`https://randomuser.me/api/portraits/men/${item}.jpg`}
                    width={40}
                    height={40}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                    alt="User"
                  />
                ))}
              </div>
              <p className="ml-4 text-sm text-gray-600">
                Trusted by <span className="font-semibold">500+</span> businesses worldwide
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="dashboard-mockup p-4" style={floatAnimation}>
              {/* Dashboard content */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Business Dashboard</h3>
                  <p className="text-sm text-gray-500">Last updated: Just now</p>
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add the CSS for the animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
    </section>
  );
}
