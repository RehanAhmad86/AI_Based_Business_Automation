import ImageUploader from '../components/ImageUploader';
import "./../styles/ImageUploader.css"

const InvoiceScanner = () => (
  <div className="scanner-container">
    <h1 className="page-title text-center text-gray-800 font-semibold text-3xl">Invoice Scanning</h1>
    <p className="page-subtitle text-center text-gray-800 font-semibold mb-4 text-lg">
      Upload an invoice image to extract structured data
    </p>
    <ImageUploader type="scan-invoice" />
  </div>
);

export default InvoiceScanner;