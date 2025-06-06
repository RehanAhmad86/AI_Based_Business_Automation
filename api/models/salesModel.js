// import tf from '@tensorflow/tfjs';

// // Configuration
// const DAYS_RANGE = [1, 30];
// const SALES_RANGE = [5, 65];

// async function createModel() {
//   const model = tf.sequential();
//   console.log('TensorFlow version:', tf.version);
//   model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [1] }));
//   model.add(tf.layers.dense({ units: 1 }));
//   model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

//   // Generate dummy training data
//   const trainingData = Array.from({ length: 30 }, (_, i) => ({
//     day: i + 1,
//     sales: (i + 1) * 2 + Math.random() * 10
//   }));

//   // Normalize data
//   const xs = trainingData.map(d => (d.day - DAYS_RANGE[0]) / (DAYS_RANGE[1] - DAYS_RANGE[0]));
//   const ys = trainingData.map(d => (d.sales - SALES_RANGE[0]) / (SALES_RANGE[1] - SALES_RANGE[0]));

//   // Train model
//   await model.fit(
//     tf.tensor2d(xs, [xs.length, 1]),
//     tf.tensor2d(ys, [ys.length, 1]),
//     { epochs: 100 }
//   );

//   return model;
// }

// let modelPromise = createModel();

// export async function getModel() {
//   return await modelPromise;
// }

import tf from '@tensorflow/tfjs';
import { Product } from './productModel.js';

// Configuration
const FEATURES = {
  day: [1, 30],
  marketingSpend: [0, 1000],
  season: ['winter', 'spring', 'summer', 'fall'],
  basePrice: [10, 200]
};

async function createModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu',
    inputShape: [4] // day, marketing, season, price
  }));
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  
  // Get real product data
  const products = await Product.find().lean();
  const trainingData = products.flatMap(product => 
    product.historicalSales.map(sale => ({
      day: sale.date.getDate(),
      marketing: sale.marketingSpend,
      season: FEATURES.season.indexOf(sale.season),
      price: product.basePrice,
      sales: sale.unitsSold
    }))
  );

  // Normalize data
  const inputs = trainingData.map(d => [
    (d.day - FEATURES.day[0]) / (FEATURES.day[1] - FEATURES.day[0]),
    d.marketing / FEATURES.marketingSpend[1],
    d.season / FEATURES.season.length,
    (d.price - FEATURES.basePrice[0]) / (FEATURES.basePrice[1] - FEATURES.basePrice[0])
  ]);

  const outputs = trainingData.map(d => d.sales / 100); // Scale sales

  await model.fit(
    tf.tensor2d(inputs),
    tf.tensor2d(outputs, [outputs.length, 1]),
    { epochs: 100 }
  );

  return model;
}
let cachedModel = null;
export async function getModel() {
  if (cachedModel) return cachedModel;
  // Your model loading or creation logic
  const model = await createModel(); // or load a saved one
  return model;
}