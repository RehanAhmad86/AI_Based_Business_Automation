import React from 'react';

const Template2 = ({ invoiceData, color }) => {
  // Calculate totals
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal - invoiceData.discount + invoiceData.shipping;
  const balanceDue = total - invoiceData.amountPaid;
  const generateInvoiceNumber = () => {
  const prefix = 'INV';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000); 
  return `${prefix}-${date}-${random}`;
};

const invoiceNumber = invoiceData.invoiceNumber || generateInvoiceNumber();

  return (
    <div className="bg-white p-8 font-sans">
      <div className="mb-8 pb-6 border-b" style={{ borderColor: color }}>
        <div className="flex justify-between items-start">
          <div>
            {invoiceData.logo ? (
              <img 
                src={invoiceData.logo} 
                alt="Company Logo" 
                className="h-14 mb-3"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-28 h-14 mb-3" />
            )}
            <h1 className="text-3xl font-bold tracking-tight" style={{ color }}>INVOICE</h1>
          </div>
          
          <div className="text-right">
            <div className="mb-1">
              <span className="font-medium text-gray-600">Invoice #: </span>
              <span>{invoiceNumber}</span>
            </div>
            <div className="mb-1">
              <span className="font-medium text-gray-600">Date: </span>
              <span>{new Date(invoiceData.date).toLocaleDateString()}</span>
            </div>
            <div className="mb-1">
              <span className="font-medium text-gray-600">Due Date: </span>
              <span>{invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">PO Number: </span>
              <span>{invoiceData.poNumber || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* From/To Section - Side by side layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-3 pb-1 border-b" style={{ borderColor: color, color }}>From</h3>
          <div className="space-y-1">
            <p className="font-medium">{invoiceData.from.name}</p>
            <p className="text-gray-600">{invoiceData.from.address}</p>
            <p className="text-gray-600">{invoiceData.from.city}, {invoiceData.from.state} {invoiceData.from.zip}</p>
            <p className="text-gray-600">{invoiceData.from.country}</p>
            <p className="text-gray-600">{invoiceData.from.email}</p>
            <p className="text-gray-600">{invoiceData.from.phone}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 pb-1 border-b" style={{ borderColor: color, color }}>Bill To</h3>
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
            <h3 className="text-lg font-semibold mb-3 pb-1 border-b" style={{ borderColor: color, color }}>Ship To</h3>
            <div className="space-y-1">
              <p className="font-medium">{invoiceData.shipTo.name}</p>
              <p className="text-gray-600">{invoiceData.shipTo.address}</p>
              <p className="text-gray-600">{invoiceData.shipTo.city}, {invoiceData.shipTo.state} {invoiceData.shipTo.zip}</p>
              <p className="text-gray-600">{invoiceData.shipTo.country}</p>
            </div>
          </div>
        )}
      </div>

      {/* Items Table - Minimalist design */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2" style={{ borderColor: color }}>
              <th className="text-left py-3 px-4 font-semibold">Description</th>
              <th className="text-center py-3 px-4 font-semibold">Qty</th>
              <th className="text-right py-3 px-4 font-semibold">Rate</th>
              <th className="text-right py-3 px-4 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-3 px-4 border-b border-gray-100">{item.description}</td>
                <td className="py-3 px-4 border-b border-gray-100 text-center">{item.quantity}</td>
                <td className="py-3 px-4 border-b border-gray-100 text-right">
                  {invoiceData.currency.symbol}{item.rate.toFixed(2)}
                </td>
                <td className="py-3 px-4 border-b border-gray-100 text-right">
                  {invoiceData.currency.symbol}{item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes and Totals - Modern split layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {invoiceData.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color }}>Notes</h3>
              <p className="text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                {invoiceData.notes}
              </p>
            </div>
          )}
          
          {invoiceData.terms && (
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color }}>Terms & Conditions</h3>
              <p className="text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg">
                {invoiceData.terms}
              </p>
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>{invoiceData.currency.symbol}{subtotal.toFixed(2)}</span>
              </div>
              
              {invoiceData.discount > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Discount:</span>
                  <span className="text-red-600">-{invoiceData.currency.symbol}{invoiceData.discount.toFixed(2)}</span>
                </div>
              )}
              
              {invoiceData.shipping > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Shipping:</span>
                  <span>+{invoiceData.currency.symbol}{invoiceData.shipping.toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-300 pt-3 mt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{invoiceData.currency.symbol}{total.toFixed(2)}</span>
              </div>
              
              {invoiceData.amountPaid > 0 && (
                <div className="flex justify-between pt-3 border-t border-gray-300 mt-3">
                  <span className="font-medium">Amount Paid:</span>
                  <span className="text-green-600">-{invoiceData.currency.symbol}{invoiceData.amountPaid.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between pt-3 border-t-2 border-gray-800 mt-3 font-bold text-lg">
                <span>Balance Due:</span>
                <span>{invoiceData.currency.symbol}{balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-gray-500 text-sm">
            <p>Payment Terms: {invoiceData.paymentTerms}</p>
            <p className="mt-1">Please make payment by the due date</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>{invoiceData.from.name} • {invoiceData.from.address}, {invoiceData.from.city}, {invoiceData.from.country}</p>
        <p className="mt-1">{invoiceData.from.email} • {invoiceData.from.phone}</p>
      </div>
    </div>
  );
};

export default Template2;