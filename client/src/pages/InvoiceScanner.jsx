
// import ImageUploader from '../components/ImageUploader';
// import { motion } from 'framer-motion';

// const InvoiceScanner = () => (
//   <div className="min-h-screen bg-gray-50 py-10">
//     <motion.h1
//       className="text-3xl font-bold text-center text-gray-800 mb-8"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ delay: 0.2 }}
//     >
//       Invoice Scanning
//     </motion.h1>
//     <ImageUploader type="scan-invoice" />
//   </div>
// );
// export default InvoiceScanner;

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