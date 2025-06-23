import React from 'react';

const InvoicePreview = ({ invoiceData, color }) => {
  // Calculate totals
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal - invoiceData.discount + invoiceData.shipping;
  const balanceDue = total - invoiceData.amountPaid;
  const generateInvoiceNumber = () => {
  const prefix = 'INV';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // e.g. 20250623
  const random = Math.floor(1000 + Math.random() * 9000); // random 4-digit number
  return `${prefix}-${date}-${random}`;
};

const invoiceNumber = invoiceData.invoiceNumber || generateInvoiceNumber();


  return (
    <div className="p-8 bg-white">
      <div className="flex justify-between items-start mb-8">
        <div>
          {invoiceData.logo ? (
            <img 
              src={invoiceData.logo} 
              alt="Company Logo" 
              className="h-16 mb-4"
            />
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-16 mb-4" />
          )}
          
          <div className="space-y-1">
            <h2 className="text-xl font-bold" style={{ color }}>{invoiceData.from.name}</h2>
            <p className="text-gray-600">{invoiceData.from.address}</p>
            <p className="text-gray-600">{invoiceData.from.city}, {invoiceData.from.state} {invoiceData.from.zip}</p>
            <p className="text-gray-600">{invoiceData.from.country}</p>
            <p className="text-gray-600">{invoiceData.from.email}</p>
            <p className="text-gray-600">{invoiceData.from.phone}</p>
          </div>
        </div>
        
        <div className="text-right">
          <h1 className="text-3xl font-bold mb-2" style={{ color }}>INVOICE</h1>
          <div className="space-y-1">
            <p className="text-gray-600">
              <span className="font-medium">Invoice #:</span> {invoiceNumber}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Date:</span> {new Date(invoiceData.date).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Payment Terms:</span> {invoiceData.paymentTerms}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Due Date:</span> {new Date(invoiceData.dueDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">PO Number:</span> {invoiceData.poNumber}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-2" style={{ color }}>Bill To</h3>
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
            <h3 className="text-lg font-semibold mb-2" style={{ color }}>Ship To</h3>
            <div className="space-y-1">
              <p className="font-medium">{invoiceData.shipTo.name}</p>
              <p className="text-gray-600">{invoiceData.shipTo.address}</p>
              <p className="text-gray-600">{invoiceData.shipTo.city}, {invoiceData.shipTo.state} {invoiceData.shipTo.zip}</p>
              <p className="text-gray-600">{invoiceData.shipTo.country}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: color, color: '#fff' }}>
              <th className="text-left py-3 px-4 font-semibold">Description</th>
              <th className="text-center py-3 px-4 font-semibold">Quantity</th>
              <th className="text-right py-3 px-4 font-semibold">Rate</th>
              <th className="text-right py-3 px-4 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="py-3 px-4 border-b border-gray-200">{item.description}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-center">{item.quantity}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-right">
                  {invoiceData.currency.symbol}{item.rate.toFixed(2)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-right">
                  {invoiceData.currency.symbol}{item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2" style={{ color }}>Notes</h3>
            <p className="text-gray-600 whitespace-pre-line">{invoiceData.notes}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2" style={{ color }}>Terms & Conditions</h3>
            <p className="text-gray-600 whitespace-pre-line">{invoiceData.terms}</p>
          </div>
        </div>
        
        <div>
          <div className="ml-auto max-w-xs">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium">Subtotal:</span>
              <span>{invoiceData.currency.symbol}{subtotal.toFixed(2)}</span>
            </div>
            
            {invoiceData.discount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Discount:</span>
                <span>-{invoiceData.currency.symbol}{invoiceData.discount.toFixed(2)}</span>
              </div>
            )}
            
            {invoiceData.shipping > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Shipping:</span>
                <span>+{invoiceData.currency.symbol}{invoiceData.shipping.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between py-2 border-b border-gray-200 font-bold">
              <span>Total:</span>
              <span>{invoiceData.currency.symbol}{total.toFixed(2)}</span>
            </div>
            
            {invoiceData.amountPaid > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Amount Paid:</span>
                <span>-{invoiceData.currency.symbol}{invoiceData.amountPaid.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between py-3 text-lg font-bold">
              <span>Balance Due:</span>
              <span>{invoiceData.currency.symbol}{balanceDue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;