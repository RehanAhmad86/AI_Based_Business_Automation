import * as tf from '@tensorflow/tfjs';
import { getModel } from '../models/salesModel.js';
import { Product } from '../models/productModel.js';

const predictSales = async (req, res) => {
  try {
    const { productId, day, marketingSpend, season } = req.body;

    // Input validation
    if (!productId || day === undefined || marketingSpend === undefined || !season) {
      return res.status(400).json({ error: 'Missing required fields: productId, day, marketingSpend, or season' });
    }

    // Get product from DB
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Normalize inputs for the model
    const input = [
      (day - 1) / 29,                                // Normalize day (0-29 scale)
      marketingSpend / 1000,                         // Normalize marketing spend
      ['winter', 'spring', 'summer', 'fall'].indexOf(season.toLowerCase()) / 3, // Season as numeric
      (product.basePrice - 10) / 190                 // Normalize price (Assumes base price between 10 and 200)
    ];

    const model = await getModel();
    const prediction = model.predict(tf.tensor2d([input]));
    const predictedSales = Math.round(prediction.dataSync()[0] * 100);

    // Respond with meaningful info
    res.json({
      prediction: predictedSales,
      currency: product.currency,
      product: product.name,
      confidence: 0.85 // Placeholder for now
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
};

export default predictSales;
