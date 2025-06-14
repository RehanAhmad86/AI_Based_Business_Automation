
import ImageUploader from '../components/ImageUploader';
import { motion } from 'framer-motion';

const QualityChecker = () => (
  <div className="min-h-screen bg-gray-50 py-10">
    <motion.h1
      className="text-3xl font-bold text-center text-gray-800 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      Quality Check
    </motion.h1>
    <ImageUploader type="quality-check" />
  </div>
);

export default QualityChecker;