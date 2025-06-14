import React, { useState } from 'react';
import axios from 'axios';
import './../styles/ImageUploader.css';

// const parseData = (rawData) => {
//   if (typeof rawData === 'string') {
//     try {
//       const cleaned = rawData
//         .replace(/```json|```/g, '')  // remove markdown-style formatting
//         .replace(/\\n/g, '')          // remove escaped newlines (optional)
//         .trim();

//       return JSON.parse(cleaned);
//     } catch (e) {
//       console.error("Failed to parse JSON:", e);
//       return {};
//     }
//   }
//   return rawData;
// };

const parseData = (rawData) => {
  if (typeof rawData === 'string') {
    try {
      // Handle case where JSON is wrapped in text
      const jsonString = rawData.match(/\{.*\}/s)[0];
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Fallback parse attempt failed:", e);
      return { rawData }; // Return original data as fallback
    }
  }
  return rawData;
};

const ImageUploader = ({ type }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await axios.post(`/api/image/${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const parsedData = parseData(data.data);

      setResult({ ...data, data: parsedData });
      console.log('Parsed API Response:', parsedData);
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Response Data:', error.response?.data);
      setResult({ error: error.response?.data?.error || 'Processing failed' });
    } finally {
      setLoading(false);
    }
  };

  const formatResult = () => {
    if (!result || result.error) return null;

    if (type === 'scan-invoice') {
      const invoice = result.data;

      if (!Array.isArray(invoice?.items_purchased)) {
        return (
          <div className="invoice-fallback">
            <pre>{JSON.stringify(invoice, null, 2)}</pre>
          </div>
        );
      }

      const totalAmount = typeof invoice?.total_amount === "string"
  ? parseFloat(invoice.total_amount.replace(/[^0-9.-]+/g, ""))
  : invoice.total_amount;

      return (
        <div className="invoice-result">
          <div className="invoice-header">
            <h3>{invoice.vendor_name || 'Unknown Vendor'}</h3>
            <p>Date: {invoice.date || 'N/A'}</p>
          </div>

          <table className="item-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items_purchased.map((item, index) => (
                <tr key={index}>
                  <td>{item.item_name || 'N/A'}</td>
                  <td>{item.item_description || 'No description'}</td>
                  <td>{item.quantity || 0}</td>
                  <td>${(typeof item.rate === 'number' ? item.rate.toFixed(2) : '0.00')}</td>
                  <td>${(typeof item.amount === 'number' ? item.amount.toFixed(2) : '0.00')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <div className="total-amount">
            Total Amount: ${(invoice?.total_amount?.toFixed(2) || '0.00')}
          </div> */}
          <div className="total-amount">
            Total Amount: ${totalAmount?.toFixed(2) || '0.00'}
          </div>
        </div>
      );
    }

    // Fallback: show full JSON
    return <pre>{JSON.stringify(result.data, null, 2)}</pre>;
  };

  return (
    <div className="upload-card">
      <div className="upload-area">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={loading}
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-label">
          <span className="upload-icon">📁</span>
          {file ? (
            <span>{file.name}</span>
          ) : (
            <span>Click to upload or drag and drop</span>
          )}
        </label>
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={!file || loading}
        className="analyze-btn"
      >
        {loading ? (
          <>
            <span className="loading-spinner">⏳</span>
            Processing...
          </>
        ) : (
          'Analyze Image'
        )}
      </button>

      {result && (
        <div className="results">
          {result.error ? (
            <div className="error-message">⚠️ {result.error}</div>
          ) : (
            formatResult()
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
