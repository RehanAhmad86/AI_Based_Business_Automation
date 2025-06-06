// import React, { useState, useEffect } from 'react';
// import { ArrowPathIcon, ChartBarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// const SalesPredictor = () => {

//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [formData, setFormData] = useState({
//     category: '',
//     productId: '',
//     productName: '',
//     day: '',
//     marketingSpend: '',
//     season: 'summer'
//   });
//   const [prediction, setPrediction] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Fetch categories on mount
//   useEffect(() => {
//     fetch('/api/products/categories')
//       .then(res => res.json())
//       .then(data => setCategories(data))
//       .catch(err => console.error("Failed to fetch categories", err));
//   }, []);

//   // Fetch products based on selected category
//   useEffect(() => {
//     if (formData.category) {
//       fetch(`/api/products?category=${formData.category}`)
//         .then(res => res.json())
//         .then(data => setProducts(data))
//         .catch(err => console.error("Failed to fetch products", err));
//     } else {
//       setProducts([]);
//     }

//     // Reset product-related fields on category change
//     setFormData(prev => ({ ...prev, productId: '', productName: '' }));
//     setFilteredProducts([]);
//   }, [formData.category]);

//   // Handle product name input for autocomplete
//   const handleProductNameChange = (e) => {
//     const value = e.target.value;
//     setFormData({ ...formData, productName: value, productId: '' });

//     const filtered = products.filter(p =>
//       p.name.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredProducts(filtered);


//   };

//   // Select product from suggestions
//   const selectProduct = (product) => {
//     setFormData({
//       ...formData,
//       productId: product._id,
//       productName: product.name
//     });
//     setFilteredProducts([]);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setPrediction(null);

//     try {
//       const response = await fetch('/api/predict-sales', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();
//       setPrediction(data);
//     } catch (err) {
//       console.error("Prediction error", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex items-center justify-center">
//       <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300">
//         {/* Header */}
//         <div className="mb-8 flex items-center gap-3">
//           <ChartBarIcon className="h-8 w-8 text-blue-600" />
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-[Poppins]">
//             AI-Powered Sales Forecast
//           </h2>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//             {/* Category Select */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
//                 Category
//                 <InformationCircleIcon className="w-4 h-4 text-gray-400" />
//               </label>
//               <select
//                 className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base 
//                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 
//                   transition-all duration-200"
//                 value={formData.category}
//                 onChange={e => setFormData({ ...formData, category: e.target.value })}
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {categories.map(c => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Product Name Autocomplete */}
//             <div className="space-y-2 relative lg:col-span-2">
//               <label className="text-sm font-medium text-gray-700">Product Name</label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
//                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
//                     transition-all duration-200 disabled:opacity-50"
//                   value={formData.productName}
//                   onChange={handleProductNameChange}
//                   disabled={!formData.category}
//                   required
//                 />
//                 {filteredProducts.length > 0 && (
//                   <div className="absolute z-50 w-full mt-1.5 bg-white shadow-xl rounded-lg 
//                     max-h-60 overflow-auto border border-gray-200">
//                     {filteredProducts.map(p => (
//                       <div
//                         key={p._id}
//                         onClick={() => selectProduct(p)}
//                         className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors
//                           text-sm text-gray-700 flex justify-between items-center"
//                       >
//                         <span>{p.name}</span>
//                         <span className="text-blue-600 font-medium">${p.basePrice}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Day of Month */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700">Day of Month</label>
//               <input
//                 type="number"
//                 min="1"
//                 max="31"
//                 className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
//                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
//                   transition-all duration-200"
//                 value={formData.day}
//                 onChange={e => setFormData({ ...formData, day: e.target.value })}
//                 required
//               />
//             </div>

//             {/* Marketing Budget */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
//                 Marketing Budget
//                 <InformationCircleIcon className="w-4 h-4 text-gray-400" />
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
//                 <input
//                   type="number"
//                   min="0"
//                   max="1000"
//                   step="50"
//                   className="w-full bg-gray-100 rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 
//                     text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
//                     hover:border-blue-400 transition-all duration-200"
//                   value={formData.marketingSpend}
//                   onChange={e => setFormData({ ...formData, marketingSpend: e.target.value })}
//                   required
//                 />
//               </div>
//             </div>

//             {/* Season Select */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-gray-700">Season</label>
//               <select
//                 className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
//                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
//                   transition-all duration-200"
//                 value={formData.season}
//                 onChange={e => setFormData({ ...formData, season: e.target.value })}
//               >
//                 {['winter', 'spring', 'summer', 'fall'].map(season => (
//                   <option key={season} value={season}>
//                     {season.charAt(0).toUpperCase() + season.slice(1)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-lg font-medium 
//               hover:bg-blue-700 transition-colors duration-200 disabled:opacity-70 
//               disabled:hover:bg-blue-600 disabled:cursor-not-allowed flex items-center 
//               justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <ArrowPathIcon className="w-5 h-5 animate-spin" />
//                 <span>Analyzing Data...</span>
//               </>
//             ) : (
//               'Generate Forecast'
//             )}
//           </button>
//         </form>

//         {/* Prediction Result */}
//         {prediction && (
//           <div className="mt-8 animate-slide-in">
//             <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-sm">
//               <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
//                 <ChartBarIcon className="w-5 h-5" />
//                 Forecast for {prediction.product}
//               </h3>
//               <p className="text-green-700 mb-4 leading-relaxed">
//                 Expected to sell approximately{' '}
//                 <span className="font-bold text-green-900">{prediction.prediction}</span> units
//                 on the {formData.day}
//                 {['st','nd','rd'][((formData.day+90)%100-10)%10-1] || 'th'}. Confidence level:{' '}
//                 <span className="font-medium text-green-900">
//                   {(prediction.confidence * 100).toFixed(1)}%
//                 </span>
//               </p>
//               <div className="border-t border-green-200 pt-4">
//                 <p className="text-sm font-medium text-green-800 mb-3">Key Influencing Factors:</p>
//                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
//                   {[
//                     'Historical sales performance',
//                     'Seasonal demand trends',
//                     'Marketing ROI analysis',
//                     'Competitive pricing data',
//                     'Economic indicators',
//                     'Consumer behavior patterns'
//                   ].map((factor, index) => (
//                     <li key={index} className="flex items-center gap-2">
//                       <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
//                       {factor}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SalesPredictor;





// import React, { useState, useEffect } from 'react';
// import { ArrowPathIcon, ChartBarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// const SalesPredictor = () => {

//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [formData, setFormData] = useState({
//     category: '',
//     productId: '',
//     productName: '',
//     day: '',
//     marketingSpend: '',
//     season: 'summer'
//   });
//   const [prediction, setPrediction] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [aiInsights, setAiInsights] = useState(null);
//   const [insightsLoading, setInsightsLoading] = useState(false);

//   useEffect(() => {
//     const generateInsights = async () => {
//       if (!prediction) return;
      
//       setInsightsLoading(true);
//       try {
//         const prompt = `As a retail expert, analyze ${prediction.product} (${formData.category}) predicted to sell ${prediction.prediction} units on day ${formData.day} of ${formData.season} with a $${formData.marketingSpend} marketing budget. Provide concise insights on:
//         1. Top 3 season-specific features
//         2. Potential drawbacks and solutions
//         3. Target demographics
//         4. Marketing channel suggestions
//         5. Pricing strategies
//         6. Seasonal considerations
//         7. Competitor differentiation
//         8. Customer retention ideas
//         9. Creative promotions
//         10. Sustainability aspects
//         Provide specific, actionable advice in bullet points.`;

//         const response = await fetch('/api/ai/chat', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             messages: [{ role: 'user', content: prompt }]
//           })
//         });

//         const data = await response.json();
//         setAiInsights(data.choices[0].message.content);
//       } catch (error) {
//         console.error('Insights generation failed:', error);
//         setAiInsights('Failed to generate insights. Please try again.');
//       } finally {
//         setInsightsLoading(false);
//       }
//     };

//     generateInsights();
//   }, [prediction, formData]);
//   useEffect(() => {
//     fetch('/api/products/categories')
//       .then(res => res.json())
//       .then(data => setCategories(data))
//       .catch(err => console.error("Failed to fetch categories", err));
//   }, []);

//   // Fetch products based on selected category
//   useEffect(() => {
//     if (formData.category) {
//       fetch(`/api/products?category=${formData.category}`)
//         .then(res => res.json())
//         .then(data => setProducts(data))
//         .catch(err => console.error("Failed to fetch products", err));
//     } else {
//       setProducts([]);
//     }

//     // Reset product-related fields on category change
//     setFormData(prev => ({ ...prev, productId: '', productName: '' }));
//     setFilteredProducts([]);
//   }, [formData.category]);

//   // Handle product name input for autocomplete
//   const handleProductNameChange = (e) => {
//     const value = e.target.value;
//     setFormData({ ...formData, productName: value, productId: '' });

//     const filtered = products.filter(p =>
//       p.name.toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredProducts(filtered);


//   };

//   // Select product from suggestions
//   const selectProduct = (product) => {
//     setFormData({
//       ...formData,
//       productId: product._id,
//       productName: product.name
//     });
//     setFilteredProducts([]);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setPrediction(null);

//     try {
//       const response = await fetch('/api/predict-sales', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();
//       setPrediction(data);
//     } catch (err) {
//       console.error("Prediction error", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 flex items-center justify-center">
//       <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300">
//         {/* Header */}
//         <div className="mb-8 flex items-center gap-3">
//           <ChartBarIcon className="h-8 w-8 text-blue-600" />
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-[Poppins]">
//             AI-Powered Sales Forecast
//           </h2>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
          // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          //   {/* Category Select */}
          //   <div className="space-y-2">
          //     <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          //       Category
          //       <InformationCircleIcon className="w-4 h-4 text-gray-400" />
          //     </label>
          //     <select
          //       className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base 
          //         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 
          //         transition-all duration-200"
          //       value={formData.category}
          //       onChange={e => setFormData({ ...formData, category: e.target.value })}
          //       required
          //     >
          //       <option value="">Select Category</option>
          //       {categories.map(c => (
          //         <option key={c} value={c}>{c}</option>
          //       ))}
          //     </select>
          //   </div>

          //   {/* Product Name Autocomplete */}
          //   <div className="space-y-2 relative lg:col-span-2">
          //     <label className="text-sm font-medium text-gray-700">Product Name</label>
          //     <div className="relative">
          //       <input
          //         type="text"
          //         className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
          //           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
          //           transition-all duration-200 disabled:opacity-50"
          //         value={formData.productName}
          //         onChange={handleProductNameChange}
          //         disabled={!formData.category}
          //         required
          //       />
          //       {filteredProducts.length > 0 && (
          //         <div className="absolute z-50 w-full mt-1.5 bg-white shadow-xl rounded-lg 
          //           max-h-60 overflow-auto border border-gray-200">
          //           {filteredProducts.map(p => (
          //             <div
          //               key={p._id}
          //               onClick={() => selectProduct(p)}
          //               className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors
          //                 text-sm text-gray-700 flex justify-between items-center"
          //             >
          //               <span>{p.name}</span>
          //               <span className="text-blue-600 font-medium">${p.basePrice}</span>
          //             </div>
          //           ))}
          //         </div>
          //       )}
          //     </div>
          //   </div>

          //   {/* Day of Month */}
          //   <div className="space-y-2">
          //     <label className="text-sm font-medium text-gray-700">Day of Month</label>
          //     <input
          //       type="number"
          //       min="1"
          //       max="31"
          //       className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
          //         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
          //         transition-all duration-200"
          //       value={formData.day}
          //       onChange={e => setFormData({ ...formData, day: e.target.value })}
          //       required
          //     />
          //   </div>

          //   {/* Marketing Budget */}
          //   <div className="space-y-2">
          //     <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          //       Marketing Budget
          //       <InformationCircleIcon className="w-4 h-4 text-gray-400" />
          //     </label>
          //     <div className="relative">
          //       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          //       <input
          //         type="number"
          //         min="0"
          //         max="1000"
          //         step="50"
          //         className="w-full bg-gray-100 rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 
          //           text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          //           hover:border-blue-400 transition-all duration-200"
          //         value={formData.marketingSpend}
          //         onChange={e => setFormData({ ...formData, marketingSpend: e.target.value })}
          //         required
          //       />
          //     </div>
          //   </div>

          //   {/* Season Select */}
          //   <div className="space-y-2">
          //     <label className="text-sm font-medium text-gray-700">Season</label>
          //     <select
          //       className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
          //         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
          //         transition-all duration-200"
          //       value={formData.season}
          //       onChange={e => setFormData({ ...formData, season: e.target.value })}
          //     >
          //       {['winter', 'spring', 'summer', 'fall'].map(season => (
          //         <option key={season} value={season}>
          //           {season.charAt(0).toUpperCase() + season.slice(1)}
          //         </option>
          //       ))}
          //     </select>
          //   </div>
          // </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-3.5 px-6 rounded-lg font-medium 
//               hover:bg-blue-700 transition-colors duration-200 disabled:opacity-70 
//               disabled:hover:bg-blue-600 disabled:cursor-not-allowed flex items-center 
//               justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <ArrowPathIcon className="w-5 h-5 animate-spin" />
//                 <span>Analyzing Data...</span>
//               </>
//             ) : (
//               'Generate Forecast'
//             )}
//           </button>
//         </form>

//         {/* Prediction Result */}
//         {prediction && (
//     <div className="mt-8 animate-slide-in">
//       <div className="bg-green-50 border border-green-200 p-6 rounded-xl shadow-sm">
//         <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
//           <ChartBarIcon className="w-5 h-5" />
//           Forecast for {prediction.product}
//         </h3>
//         <p className="text-green-700 mb-4 leading-relaxed">
//           Expected to sell approximately{' '}
//           <span className="font-bold text-green-900">{prediction.prediction}</span> units
//           on the {formData.day}
//           {['st','nd','rd'][((formData.day+90)%100-10)%10-1] || 'th'}. Confidence level:{' '}
//           <span className="font-medium text-green-900">
//             {(prediction.confidence * 100).toFixed(1)}%
//           </span>
//         </p>
//         <div className="border-t border-green-200 pt-4">
//         {insightsLoading ? (
//               <div className="flex items-center gap-2 text-green-700">
//                 <ArrowPathIcon className="w-4 h-4 animate-spin" />
//                 <span>Generating AI-powered insights...</span>
//               </div>
//             ) : aiInsights ? (
//               <>
//                 <p className="text-sm font-medium text-green-800 mb-3">
//                   AI-Powered Product Intelligence:
//                 </p>
//                 <div className="text-sm text-green-700 whitespace-pre-wrap">
//                   {aiInsights}
//                 </div>
//               </>
//             ) : (
//               <p className="text-sm text-green-700">
//                 Insights generation failed. Please try again.
//               </p>
//             )}
          
//         </div>
//       </div>
//     </div>
//   )}
//       </div>
//     </div>
//   );
// };

// export default SalesPredictor;




import React, { useState, useEffect } from 'react';
import { ArrowPathIcon, ChartBarIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const SalesPredictor = () => {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    productId: '',
    productName: '',
    day: '',
    marketingSpend: '',
    season: 'summer'
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    const generateInsights = async () => {
      if (!prediction) return;
      
      setInsightsLoading(true);
      try {
        const prompt = `As a retail expert, analyze ${prediction.product} (${formData.category}) predicted to sell ${prediction.prediction} units on day ${formData.day} of ${formData.season} with a $${formData.marketingSpend} marketing budget. Provide concise insights on:
        1. Top 3 season-specific features
        2. Potential drawbacks and solutions
        3. Target demographics
        4. Marketing channel suggestions
        5. Pricing strategies
        6. Seasonal considerations
        7. Competitor differentiation
        8. Customer retention ideas
        9. Creative promotions
        10. Sustainability aspects
        Provide specific, actionable advice in bullet points.`;

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: prompt }]
          })
        });

        const data = await response.json();
        setAiInsights(data.choices[0].message.content);
      } catch (error) {
        console.error('Insights generation failed:', error);
        setAiInsights('Failed to generate insights. Please try again.');
      } finally {
        setInsightsLoading(false);
      }
    };

    generateInsights();
  }, [prediction, formData]);
  useEffect(() => {
    fetch('/api/products/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    if (formData.category) {
      fetch(`/api/products?category=${formData.category}`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(err => console.error("Failed to fetch products", err));
    } else {
      setProducts([]);
    }

    // Reset product-related fields on category change
    setFormData(prev => ({ ...prev, productId: '', productName: '' }));
    setFilteredProducts([]);
  }, [formData.category]);

  // Handle product name input for autocomplete
  const handleProductNameChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, productName: value, productId: '' });

    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);


  };

  // Select product from suggestions
  const selectProduct = (product) => {
    setFormData({
      ...formData,
      productId: product._id,
      productName: product.name
    });
    setFilteredProducts([]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const response = await fetch('/api/predict-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error("Prediction error", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8 flex">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left Panel - Input Form */}
        <div className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-2xl shadow-xl p-6 md:p-8 h-fit md:sticky md:top-8 transition-all duration-300">
          <div className="mb-8 flex items-center gap-3">
            <ChartBarIcon className="h-8 w-8 text-blue-600 transform transition-transform duration-500 hover:rotate-12" />
            <h2 className="text-2xl font-bold text-gray-800 font-[Poppins] bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sales Forecast Analyzer
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form inputs remain the same as before */}
            {/* ... existing form fields ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Category Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Category
                <InformationCircleIcon className="w-4 h-4 text-gray-400" />
              </label>
              <select
                className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base 
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 
                  transition-all duration-200"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Product Name Autocomplete */}
            <div className="space-y-2 relative lg:col-span-2">
              <label className="text-sm font-medium text-gray-700">Product Name</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
                    transition-all duration-200 disabled:opacity-50"
                  value={formData.productName}
                  onChange={handleProductNameChange}
                  disabled={!formData.category}
                  required
                />
                {filteredProducts.length > 0 && (
                  <div className="absolute z-50 w-full mt-1.5 bg-white shadow-xl rounded-lg 
                    max-h-60 overflow-auto border border-gray-200">
                    {filteredProducts.map(p => (
                      <div
                        key={p._id}
                        onClick={() => selectProduct(p)}
                        className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors
                          text-sm text-gray-700 flex justify-between items-center"
                      >
                        <span>{p.name}</span>
                        <span className="text-blue-600 font-medium">${p.basePrice}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Day of Month */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Day of Month</label>
              <input
                type="number"
                min="1"
                max="31"
                className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
                  transition-all duration-200"
                value={formData.day}
                onChange={e => setFormData({ ...formData, day: e.target.value })}
                required
              />
            </div>

            {/* Marketing Budget */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Marketing Budget
                <InformationCircleIcon className="w-4 h-4 text-gray-400" />
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="50"
                  className="w-full bg-gray-100 rounded-lg border border-gray-300 pl-8 pr-4 py-2.5 
                    text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    hover:border-blue-400 transition-all duration-200"
                  value={formData.marketingSpend}
                  onChange={e => setFormData({ ...formData, marketingSpend: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Season Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Season</label>
              <select
                className="w-full bg-gray-100 rounded-lg border border-gray-300 px-4 py-2.5 text-base
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400
                  transition-all duration-200"
                value={formData.season}
                onChange={e => setFormData({ ...formData, season: e.target.value })}
              >
                {['winter', 'spring', 'summer', 'fall'].map(season => (
                  <option key={season} value={season}>
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white py-3.5 px-6 rounded-xl font-medium 
                hover:shadow-lg transition-all duration-300 disabled:opacity-70 
                disabled:hover:bg-blue-600 disabled:cursor-not-allowed flex items-center 
                justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin transform group-hover:scale-110" />
                  <span>Analyzing Data...</span>
                </>
              ) : (
                <>
                  <span className="transform transition-transform duration-300 group-hover:scale-105">
                    Generate Forecast
                  </span>
                  <svg className="w-4 h-4 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Panel - Results */}
        <div className="w-full md:w-1/2 lg:w-2/3 flex flex-col gap-8">
          {/* Prediction Card */}
          {prediction && (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 sticky top-8 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                  {prediction.product} Forecast
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {(prediction.confidence * 100).toFixed(1)}% Confidence
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Predicted Sales</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {prediction.prediction}
                      <span className="text-lg text-gray-600 ml-1">units</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {formData.season.charAt(0).toUpperCase() + formData.season.slice(1)} Season
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      Day {formData.day}
                      <sup className="ml-0.5">
                        {['st','nd','rd'][((formData.day+90)%100-10)%10-1] || 'th'}
                      </sup>
                    </p>
                  </div>
                </div>

                {/* AI Insights Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI-Powered Insights
                  </h4>

                  <div className="relative h-[calc(100vh-400px)] overflow-y-auto pr-4">
                    {insightsLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center space-y-4 animate-pulse">
                        <div className="w-full space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded-full w-full" />
                          ))}
                        </div>
                      </div>
                    ) : aiInsights ? (
                      <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                        {aiInsights}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Insights generation failed. Please try again.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!prediction && (
            <div className="h-full flex items-center justify-center bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
              <div className="text-center space-y-4">
                <div className="inline-block p-4 bg-blue-50 rounded-full">
                  <ChartBarIcon className="w-12 h-12 text-blue-600 transform rotate-12" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Generate Your First Forecast
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Enter product details and marketing parameters to get AI-powered sales predictions 
                  and strategic insights.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPredictor;








