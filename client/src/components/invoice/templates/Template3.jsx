import React from 'react';

const Template3 = ({ invoiceData, color }) => {
  // Calculate totals
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal - invoiceData.discount + invoiceData.shipping;
  const balanceDue = total - invoiceData.amountPaid;

  // Function to format currency
  const formatCurrency = (value) => {
    return `${invoiceData.currency.symbol}${value.toFixed(2)}`;
  };

  const generateInvoiceNumber = () => {
  const prefix = 'INV';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000); 
  return `${prefix}-${date}-${random}`;
};

const invoiceNumber = invoiceData.invoiceNumber || generateInvoiceNumber();

  return (
    <div className="bg-white p-10 font-sans">
      {/* Header with colored sidebar */}
      <div className="flex">
        {/* Colored sidebar */}
        <div 
          className="w-1/3 p-8 text-white" 
          style={{ backgroundColor: color }}
        >
          <div className="mb-10">
            {invoiceData.logo ? (
              <img 
                src={invoiceData.logo} 
                alt="Company Logo" 
                className="h-16 mx-auto"
              />
            ) : (
              <div className="bg-white bg-opacity-20 border-2 border-dashed border-white rounded-xl w-32 h-16 mx-auto" />
            )}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{invoiceData.from.name}</h2>
            <p className="text-white text-opacity-90">{invoiceData.from.address}</p>
            <p className="text-white text-opacity-90">{invoiceData.from.city}, {invoiceData.from.state} {invoiceData.from.zip}</p>
            <p className="text-white text-opacity-90">{invoiceData.from.country}</p>
            <p className="text-white text-opacity-90">{invoiceData.from.email}</p>
            <p className="text-white text-opacity-90">{invoiceData.from.phone}</p>
          </div>
          
          <div className="mt-10 pt-6 border-t border-white border-opacity-30">
            <h3 className="text-lg font-bold mb-3">Invoice Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white text-opacity-80">Invoice #:</span>
                <span>{invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white text-opacity-80">Date:</span>
                <span>{new Date(invoiceData.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white text-opacity-80">Due Date:</span>
                <span>{invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white text-opacity-80">PO Number:</span>
                <span>{invoiceData.poNumber || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="w-2/3 p-8">
          <div className="mb-10 text-right">
            <h1 className="text-4xl font-bold mb-2" style={{ color }}>INVOICE</h1>
            <p className="text-gray-500">Payment Terms: {invoiceData.paymentTerms}</p>
          </div>
          
          {/* Bill To / Ship To */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b" style={{ borderColor: color, color }}>Bill To</h3>
              <div className="space-y-1">
                <p className="font-medium">{invoiceData.billTo.name}</p>
                <p className="text-gray-600">{invoiceData.billTo.address}</p>
                <p className="text-gray-600">{invoiceData.billTo.city}, {invoiceData.billTo.state} {invoiceData.billTo.zip}</p>
                <p className="text-gray-600">{invoiceData.billTo.country}</p>
                <p className="text-gray-600">{invoiceData.billTo.email}</p>
                <p className="text-gray-600">{invoiceData.billTo.phone}</p>
              </div>
            </div>
            
            {invoiceData.shipTo.name && (
              <div>
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b" style={{ borderColor: color, color }}>Ship To</h3>
                <div className="space-y-1">
                  <p className="font-medium">{invoiceData.shipTo.name}</p>
                  <p className="text-gray-600">{invoiceData.shipTo.address}</p>
                  <p className="text-gray-600">{invoiceData.shipTo.city}, {invoiceData.shipTo.state} {invoiceData.shipTo.zip}</p>
                  <p className="text-gray-600">{invoiceData.shipTo.country}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Items Table */}
          <div className="mb-10">
            <table className="w-full">
              <thead>
                <tr className="border-b-2" style={{ borderColor: color }}>
                  <th className="text-left py-4 px-4 font-semibold">Description</th>
                  <th className="text-center py-4 px-4 font-semibold">Qty</th>
                  <th className="text-right py-4 px-4 font-semibold">Unit Price</th>
                  <th className="text-right py-4 px-4 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-4 px-4 border-b border-gray-100">{item.description}</td>
                    <td className="py-4 px-4 border-b border-gray-100 text-center">{item.quantity}</td>
                    <td className="py-4 px-4 border-b border-gray-100 text-right">{formatCurrency(item.rate)}</td>
                    <td className="py-4 px-4 border-b border-gray-100 text-right font-medium">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Totals */}
          <div className="ml-auto max-w-md">
            <div className="flex justify-between py-3">
              <span className="font-medium">Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            {invoiceData.discount > 0 && (
              <div className="flex justify-between py-3 border-t border-gray-200">
                <span className="font-medium">Discount:</span>
                <span className="text-red-600">-{formatCurrency(invoiceData.discount)}</span>
              </div>
            )}
            
            {invoiceData.shipping > 0 && (
              <div className="flex justify-between py-3 border-t border-gray-200">
                <span className="font-medium">Shipping:</span>
                <span>+{formatCurrency(invoiceData.shipping)}</span>
              </div>
            )}
            
            <div className="flex justify-between py-4 border-t-2 border-gray-800 mt-2 font-bold text-lg">
              <span>TOTAL:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            
            {invoiceData.amountPaid > 0 && (
              <div className="flex justify-between py-3 border-t border-gray-200 mt-3">
                <span className="font-medium">Amount Paid:</span>
                <span className="text-green-600">-{formatCurrency(invoiceData.amountPaid)}</span>
              </div>
            )}
            
            <div className="flex justify-between py-4 border-t-2 border-gray-800 mt-3 font-bold text-xl">
              <span>BALANCE DUE:</span>
              <span style={{ color }}>{formatCurrency(balanceDue)}</span>
            </div>
          </div>
          
          {/* Notes and Terms */}
          <div className="mt-10 grid grid-cols-2 gap-8">
            {invoiceData.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color }}>Notes</h3>
                <p className="text-gray-600 whitespace-pre-line">{invoiceData.notes}</p>
              </div>
            )}
            
            {invoiceData.terms && (
              <div>
                <h3 className="text-lg font-semibold mb-3" style={{ color }}>Terms & Conditions</h3>
                <p className="text-gray-600 whitespace-pre-line">{invoiceData.terms}</p>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>Thank you for your business. All payments should be made within the specified terms.</p>
            <p className="mt-2">{invoiceData.from.name} • {invoiceData.from.city}, {invoiceData.from.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template3;