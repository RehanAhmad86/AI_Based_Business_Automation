// import React, { useState } from 'react';
// import { ChevronDown, Search } from 'lucide-react';
// import currencyList from '../../currency'; // Path to your currency.js file

// const CurrencySelector = ({ selectedCurrency, onChange }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredCurrencies = currencyList.filter(
//     currency =>
//       currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       currency.country.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md bg-white"
//       >
//         <div className="flex items-center">
//           <span className="mr-2">{selectedCurrency.symbol}</span>
//           <span>{selectedCurrency.code} - {selectedCurrency.name}</span>
//         </div>
//         <ChevronDown size={16} className="text-gray-500" />
//       </button>

//       {isOpen && (
//         <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
//           <div className="sticky top-0 bg-white p-2 border-b">
//             <div className="relative">
//               <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search currency..."
//                 className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 autoFocus
//               />
//             </div>
//           </div>
//           <ul>
//             {filteredCurrencies.map(currency => (
//               <li key={currency.code}>
//                 <button
//                   className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
//                     selectedCurrency.code === currency.code ? 'bg-blue-50' : ''
//                   }`}
//                   onClick={() => {
//                     onChange(currency);
//                     setIsOpen(false);
//                   }}
//                 >
//                   <div className="flex items-center">
//                     <span className="w-10">{currency.symbol}</span>
//                     <span className="font-medium mr-2">{currency.code}</span>
//                     <span className="text-gray-600 flex-1 truncate">{currency.name}</span>
//                     <span className="text-gray-500 text-sm">{currency.country}</span>
//                   </div>
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CurrencySelector;

import { useState, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import currencyList from "../../currency.js";


const CurrencySelector = ({ selectedCurrency, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurrencies = useMemo(() => {
    if (!searchTerm) return currencyList;
    
    return currencyList.filter(currency => {
      const term = searchTerm.toLowerCase();
      return (
        currency.name.toLowerCase().includes(term) ||
        currency.code.toLowerCase().includes(term) ||
        currency.country.toLowerCase().includes(term)
      );
    });
  }, [searchTerm]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center truncate">
          <span className="mr-2">{selectedCurrency.symbol}</span>
          <span className="truncate">{selectedCurrency.code} - {selectedCurrency.name}</span>
        </div>
        <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="sticky top-0 bg-white p-2 border-b">
            <div className="relative">
              <Search size={16} className="absolute left-2 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search currency..."
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <ul>
            {filteredCurrencies.map(currency => (
              <li key={currency.code}>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center ${
                    selectedCurrency.code === currency.code ? 'bg-blue-50 font-medium' : ''
                  }`}
                  onClick={() => {
                    onChange(currency);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <span className="w-8">{currency.symbol}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-medium truncate mr-2">{currency.code}</span>
                      <span className="text-gray-500 text-sm truncate">{currency.country}</span>
                    </div>
                    <div className="text-gray-600 truncate text-left">{currency.name}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;