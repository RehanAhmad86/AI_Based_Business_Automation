// import React, { useState, useRef } from 'react';
// import { toPng } from 'html-to-image';
// import { jsPDF } from 'jspdf';
// import InvoicePreview from './InvoicePreview';
// import ColorPicker from './ColorPicker';
// import CurrencySelector from './CurrencySelector';
// import templates from './templates';

// const InvoiceGenerator = () => {
//   const [invoiceData, setInvoiceData] = useState({
//     logo: null,
//     from: {
//       name: '',
//       address: '',
//       city: '',
//       state: '',
//       zip: '',
//       country: '',
//       email: '',
//       phone: ''
//     },
//     billTo: {
//       name: '',
//       address: '',
//       city: '',
//       state: '',
//       zip: '',
//       country: '',
//       email: '',
//       phone: ''
//     },
//     shipTo: {
//       name: '',
//       address: '',
//       city: '',
//       state: '',
//       zip: '',
//       country: ''
//     },
//     date: new Date().toISOString().split('T')[0],
//     paymentTerms: 'Net 30',
//     dueDate: '',
//     poNumber: '',
//     items: [
//       { id: 1, description: '', quantity: 1, rate: 0, amount: 0 }
//     ],
//     notes: '',
//     terms: '',
//     subtotal: 0,
//     discount: 0,
//     shipping: 0,
//     total: 0,
//     amountPaid: 0,
//     balanceDue: 0,
//     currency: { code: 'USD', symbol: '$', name: 'US Dollar' }
//   });

//   const [selectedTemplate, setSelectedTemplate] = useState('template1');
//   const [selectedColor, setSelectedColor] = useState('#3B82F6');
//   const invoiceRef = useRef(null);

//   // Update field values
//   const updateField = (field, value) => {
//     setInvoiceData(prev => ({ ...prev, [field]: value }));
//   };

//   const updateNestedField = (parent, field, value) => {
//     setInvoiceData(prev => ({
//       ...prev,
//       [parent]: {
//         ...prev[parent],
//         [field]: value
//       }
//     }));
//   };

//   // Item management
//   const addItem = () => {
//     setInvoiceData(prev => ({
//       ...prev,
//       items: [
//         ...prev.items,
//         { id: Date.now(), description: '', quantity: 1, rate: 0, amount: 0 }
//       ]
//     }));
//   };

//   const updateItem = (id, field, value) => {
//     setInvoiceData(prev => {
//       const updatedItems = prev.items.map(item => {
//         if (item.id === id) {
//           const updatedItem = { ...item, [field]: value };
          
//           // Calculate amount if quantity or rate changes
//           if (field === 'quantity' || field === 'rate') {
//             updatedItem.amount = updatedItem.quantity * updatedItem.rate;
//           }
          
//           return updatedItem;
//         }
//         return item;
//       });
      
//       // Calculate totals
//       const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0);
//       const total = subtotal - prev.discount + prev.shipping;
//       const balanceDue = total - prev.amountPaid;
      
//       return {
//         ...prev,
//         items: updatedItems,
//         subtotal,
//         total,
//         balanceDue
//       };
//     });
//   };

//   const removeItem = (id) => {
//     if (invoiceData.items.length > 1) {
//       setInvoiceData(prev => ({
//         ...prev,
//         items: prev.items.filter(item => item.id !== id)
//       }));
//     }
//   };

//   // Currency selection
//   const handleCurrencyChange = (currency) => {
//     setInvoiceData(prev => ({ ...prev, currency }));
//   };

//   // Download PDF
//   const downloadPDF = async () => {
//     if (invoiceRef.current) {
//       try {
//         const dataUrl = await toPng(invoiceRef.current, { 
//           backgroundColor: '#ffffff',
//           quality: 0.95 
//         });
        
//         const pdf = new jsPDF('p', 'mm', 'a4');
//         const imgProps = pdf.getImageProperties(dataUrl);
//         const pdfWidth = pdf.internal.pageSize.getWidth();
//         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
//         pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
//         pdf.save(`invoice-${invoiceData.date}.pdf`);
//       } catch (error) {
//         console.error('Error generating PDF:', error);
//       }
//     }
//   };

//   const TemplateComponent = templates[selectedTemplate];

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Invoice Generator</h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-1 space-y-6">
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h2 className="text-lg font-semibold mb-4">Template & Styling</h2>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Template
//                 </label>
//                 <div className="flex space-x-2">
//                   {Object.keys(templates).map(template => (
//                     <button
//                       key={template}
//                       onClick={() => setSelectedTemplate(template)}
//                       className={`px-3 py-2 rounded-md text-sm ${
//                         selectedTemplate === template
//                           ? 'bg-blue-500 text-white'
//                           : 'bg-gray-200 text-gray-700'
//                       }`}
//                     >
//                       {template.replace('template', 'Template ')}
//                     </button>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Color Scheme
//                 </label>
//                 <ColorPicker 
//                   selectedColor={selectedColor} 
//                   onChange={setSelectedColor} 
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Currency
//                 </label>
//                 <CurrencySelector 
//                   selectedCurrency={invoiceData.currency} 
//                   onChange={handleCurrencyChange} 
//                 />
//               </div>
//             </div>
            
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h2 className="text-lg font-semibold mb-4">Company Details</h2>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Company Logo
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     if (file) {
//                       const reader = new FileReader();
//                       reader.onloadend = () => {
//                         updateField('logo', reader.result);
//                       };
//                       reader.readAsDataURL(file);
//                     }
//                   }}
//                   className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                 />
//               </div>
              
//               {Object.keys(invoiceData.from).map(field => (
//                 <div key={field} className="mb-3">
//                   <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
//                     {field.replace(/([A-Z])/g, ' $1')}
//                   </label>
//                   <input
//                     type="text"
//                     value={invoiceData.from[field]}
//                     onChange={(e) => updateNestedField('from', field, e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           <div className="lg:col-span-2">
//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//               <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Bill To
//                   </label>
//                   {Object.keys(invoiceData.billTo).map(field => (
//                     <div key={field} className="mb-2">
//                       <input
//                         type="text"
//                         placeholder={field.replace(/([A-Z])/g, ' $1')}
//                         value={invoiceData.billTo[field]}
//                         onChange={(e) => updateNestedField('billTo', field, e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   ))}
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Ship To (Optional)
//                   </label>
//                   {Object.keys(invoiceData.shipTo).map(field => (
//                     <div key={field} className="mb-2">
//                       <input
//                         type="text"
//                         placeholder={field.replace(/([A-Z])/g, ' $1')}
//                         value={invoiceData.shipTo[field]}
//                         onChange={(e) => updateNestedField('shipTo', field, e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date
//                   </label>
//                   <input
//                     type="date"
//                     value={invoiceData.date}
//                     onChange={(e) => updateField('date', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Payment Terms
//                   </label>
//                   <select
//                     value={invoiceData.paymentTerms}
//                     onChange={(e) => updateField('paymentTerms', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="Due on Receipt">Due on Receipt</option>
//                     <option value="Net 15">Net 15</option>
//                     <option value="Net 30">Net 30</option>
//                     <option value="Net 60">Net 60</option>
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Due Date
//                   </label>
//                   <input
//                     type="date"
//                     value={invoiceData.dueDate}
//                     onChange={(e) => updateField('dueDate', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
              
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   PO Number
//                 </label>
//                 <input
//                   type="text"
//                   value={invoiceData.poNumber}
//                   onChange={(e) => updateField('poNumber', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
              
//               <div className="mb-4">
//                 <h3 className="text-md font-medium text-gray-700 mb-2">Items</h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
//                         <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Qty</th>
//                         <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
//                         <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
//                         <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {invoiceData.items.map((item) => (
//                         <tr key={item.id}>
//                           <td className="px-3 py-2 whitespace-nowrap">
//                             <input
//                               type="text"
//                               value={item.description}
//                               onChange={(e) => updateItem(item.id, 'description', e.target.value)}
//                               className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           </td>
//                           <td className="px-3 py-2 whitespace-nowrap">
//                             <input
//                               type="number"
//                               min="1"
//                               value={item.quantity}
//                               onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
//                               className="w-full px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           </td>
//                           <td className="px-3 py-2 whitespace-nowrap">
//                             <input
//                               type="number"
//                               min="0"
//                               step="0.01"
//                               value={item.rate}
//                               onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
//                               className="w-full px-2 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           </td>
//                           <td className="px-3 py-2 whitespace-nowrap text-right">
//                             {invoiceData.currency.symbol}{item.amount.toFixed(2)}
//                           </td>
//                           <td className="px-3 py-2 whitespace-nowrap text-center">
//                             <button
//                               onClick={() => removeItem(item.id)}
//                               className="text-red-500 hover:text-red-700"
//                             >
//                               Remove
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <button
//                   onClick={addItem}
//                   className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//                 >
//                   + Add Line Item
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Notes
//                   </label>
//                   <textarea
//                     value={invoiceData.notes}
//                     onChange={(e) => updateField('notes', e.target.value)}
//                     rows="3"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   ></textarea>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Terms & Conditions
//                   </label>
//                   <textarea
//                     value={invoiceData.terms}
//                     onChange={(e) => updateField('terms', e.target.value)}
//                     rows="3"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   ></textarea>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Discount ({invoiceData.currency.symbol})
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={invoiceData.discount}
//                     onChange={(e) => updateField('discount', parseFloat(e.target.value) || 0)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Shipping ({invoiceData.currency.symbol})
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={invoiceData.shipping}
//                     onChange={(e) => updateField('shipping', parseFloat(e.target.value) || 0)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Amount Paid ({invoiceData.currency.symbol})
//                   </label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={invoiceData.amountPaid}
//                     onChange={(e) => updateField('amountPaid', parseFloat(e.target.value) || 0)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex justify-between items-center">
//               <div className="text-lg font-semibold">
//                 Total: {invoiceData.currency.symbol}{invoiceData.total.toFixed(2)}
//               </div>
//               <button
//                 onClick={downloadPDF}
//                 className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
//               >
//                 Download Invoice as PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Invoice Preview */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Invoice Preview</h2>
//         <div className="border border-gray-200 rounded-lg overflow-hidden">
//           <div ref={invoiceRef}>
//             <TemplateComponent 
//               invoiceData={invoiceData} 
//               color={selectedColor} 
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceGenerator;





"use client"

import { useState, useRef } from "react"
import { toPng } from "html-to-image"
import { jsPDF } from "jspdf"
import ColorPicker from "./ColorPicker"
import CurrencySelector from "./CurrencySelector"
import templates from "./templates"

const InvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    logo: null,
    from: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      email: "",
      phone: "",
    },
    billTo: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      email: "",
      phone: "",
    },
    shipTo: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    date: new Date().toISOString().split("T")[0],
    paymentTerms: "Net 30",
    dueDate: "",
    poNumber: "",
    items: [{ id: 1, description: "", quantity: 1, rate: 0, amount: 0 }],
    notes: "",
    terms: "",
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
    amountPaid: 0,
    balanceDue: 0,
    currency: { code: "USD", symbol: "$", name: "US Dollar" },
  })

  const [selectedTemplate, setSelectedTemplate] = useState("template1")
  const [selectedColor, setSelectedColor] = useState("#3B82F6")
  const invoiceRef = useRef(null)

  // Update field values
  const updateField = (field, value) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (parent, field, value) => {
    setInvoiceData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }))
  }

  // Item management
  const addItem = () => {
    setInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), description: "", quantity: 1, rate: 0, amount: 0 }],
    }))
  }

  const updateItem = (id, field, value) => {
    setInvoiceData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Calculate amount if quantity or rate changes
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate
          }

          return updatedItem
        }
        return item
      })

      // Calculate totals
      const subtotal = updatedItems.reduce((sum, item) => sum + item.amount, 0)
      const total = subtotal - prev.discount + prev.shipping
      const balanceDue = total - prev.amountPaid

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        total,
        balanceDue,
      }
    })
  }

  const removeItem = (id) => {
    if (invoiceData.items.length > 1) {
      setInvoiceData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }))
    }
  }

  // Currency selection
  const handleCurrencyChange = (currency) => {
    setInvoiceData((prev) => ({ ...prev, currency }))
  }

  // Download PDF
  const downloadPDF = async () => {
    if (invoiceRef.current) {
      try {
        const dataUrl = await toPng(invoiceRef.current, {
          backgroundColor: "#ffffff",
          quality: 0.95,
        })

        const pdf = new jsPDF("p", "mm", "a4")
        const imgProps = pdf.getImageProperties(dataUrl)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight)
        pdf.save(`invoice-${invoiceData.date}.pdf`)
      } catch (error) {
        console.error("Error generating PDF:", error)
      }
    }
  }

  const TemplateComponent = templates[selectedTemplate]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
            Professional Invoice Generator
          </h1>
          <p className="text-lg text-slate-600 font-medium">Create stunning, professional invoices with ease</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              {/* Template & Styling Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 shadow-lg">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mr-3 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 2h6v2H7V4zm8 4H5v2h10V8zm-10 4h10v2H5v-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Template & Styling
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Choose Template</label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.keys(templates).map((template) => (
                      <button
                        key={template}
                        onClick={() => setSelectedTemplate(template)}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                          selectedTemplate === template
                            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                            : "bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                        }`}
                      >
                        {template.replace("template", "Style ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Color Scheme</label>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <ColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Currency</label>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <CurrencySelector selectedCurrency={invoiceData.currency} onChange={handleCurrencyChange} />
                  </div>
                </div>
              </div>

              {/* Company Details Section */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 shadow-lg">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg mr-3 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Company Details
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Company Logo</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            updateField("logo", reader.result)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="bg-white border-2 border-dashed border-emerald-300 rounded-xl p-6 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300">
                      <svg
                        className="w-8 h-8 text-emerald-500 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm font-semibold text-emerald-700">Upload Company Logo</p>
                      <p className="text-xs text-emerald-600 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>

                {Object.keys(invoiceData.from).map((field) => (
                  <div key={field} className="mb-4">
                    <label className="block text-sm font-bold text-slate-700 capitalize mb-2">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type="text"
                      value={invoiceData.from[field]}
                      onChange={(e) => updateNestedField("from", field, e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 font-medium text-slate-700 placeholder-slate-400"
                      placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              {/* Invoice Details Section */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 shadow-lg mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg mr-3 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Invoice Details
                </h2>

                {/* Bill To & Ship To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 bg-blue-500 rounded-full mr-2"></div>
                      <label className="text-lg font-bold text-slate-800">Bill To</label>
                    </div>
                    {Object.keys(invoiceData.billTo).map((field) => (
                      <div key={field} className="mb-3">
                        <input
                          type="text"
                          placeholder={field.replace(/([A-Z])/g, " $1")}
                          value={invoiceData.billTo[field]}
                          onChange={(e) => updateNestedField("billTo", field, e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium text-slate-700 placeholder-slate-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-6 h-6 bg-slate-400 rounded-full mr-2"></div>
                      <label className="text-lg font-bold text-slate-800">Ship To (Optional)</label>
                    </div>
                    {Object.keys(invoiceData.shipTo).map((field) => (
                      <div key={field} className="mb-3">
                        <input
                          type="text"
                          placeholder={field.replace(/([A-Z])/g, " $1")}
                          value={invoiceData.shipTo[field]}
                          onChange={(e) => updateNestedField("shipTo", field, e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-400/20 transition-all duration-300 font-medium text-slate-700 placeholder-slate-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Invoice Meta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Invoice Date</label>
                    <input
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => updateField("date", e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Payment Terms</label>
                    <select
                      value={invoiceData.paymentTerms}
                      onChange={(e) => updateField("paymentTerms", e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium text-slate-700"
                    >
                      <option value="Due on Receipt">Due on Receipt</option>
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 60">Net 60</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => updateField("dueDate", e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">PO Number</label>
                  <input
                    type="text"
                    value={invoiceData.poNumber}
                    onChange={(e) => updateField("poNumber", e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium text-slate-700 placeholder-slate-500"
                    placeholder="Enter purchase order number"
                  />
                </div>

                {/* Items Table */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800">Line Items</h3>
                    <button
                      onClick={addItem}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 font-semibold shadow-lg shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add Line Item
                    </button>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                              Qty
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                              Rate
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {invoiceData.items.map((item, index) => (
                            <tr
                              key={item.id}
                              className={`${index % 2 === 0 ? "bg-white" : "bg-slate-25"} hover:bg-blue-50 transition-colors duration-200`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-medium text-slate-700"
                                  placeholder="Item description"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)
                                  }
                                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg text-center focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-medium text-slate-700"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.rate}
                                  onChange={(e) => updateItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                                  className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-200 rounded-lg text-right focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 font-medium text-slate-700"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-slate-800 text-lg">
                                {invoiceData.currency.symbol}
                                {item.amount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-300 font-semibold"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Notes</label>
                    <textarea
                      value={invoiceData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium text-slate-700 placeholder-slate-500 resize-none"
                      placeholder="Add any additional notes here..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Terms & Conditions</label>
                    <textarea
                      value={invoiceData.terms}
                      onChange={(e) => updateField("terms", e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium text-slate-700 placeholder-slate-500 resize-none"
                      placeholder="Enter terms and conditions..."
                    ></textarea>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Discount ({invoiceData.currency.symbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={invoiceData.discount}
                      onChange={(e) => updateField("discount", Number.parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 font-medium text-slate-700"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Shipping ({invoiceData.currency.symbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={invoiceData.shipping}
                      onChange={(e) => updateField("shipping", Number.parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 font-medium text-slate-700"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Amount Paid ({invoiceData.currency.symbol})
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={invoiceData.amountPaid}
                      onChange={(e) => updateField("amountPaid", Number.parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 font-medium text-slate-700"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Total and Download */}
              <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-black p-6 rounded-2xl shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Total Invoice Amount</p>
                      <div className="text-4xl font-bold text-white">
                        {invoiceData.currency.symbol}
                        {invoiceData.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={downloadPDF}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 font-bold text-lg shadow-2xl shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300 flex items-center"
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download Invoice PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-4 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              Live Invoice Preview
            </h2>
          </div>
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl overflow-hidden">
            <div ref={invoiceRef}>
              <TemplateComponent invoiceData={invoiceData} color={selectedColor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceGenerator
