// import * as tf from '@tensorflow/tfjs';
// import { getModel, predictSales as modelPredictSales } from '../models/salesModel.js';
// import { Product } from '../models/productModel.js';

// export const predictSales = async (req, res) => {
//   try {
//     const {
//       productId,
//       productName,
//       category,
//       basePrice,
//       day,
//       marketingSpend,
//       season,
//       brandPresence,
//       location,
//       useLocation
//     } = req.body;

//     // Validate required fields
//     if ((!productId && !productName) || !basePrice || day === undefined || 
//         marketingSpend === undefined || !season || brandPresence === undefined) {
//       return res.status(400).json({
//         error: 'Missing required fields: product information, basePrice, day, marketingSpend, season, or brandPresence'
//       });
//     }

//     // If productId is provided, get product info from database
//     let product = null;
//     if (productId) {
//       product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
//     }

//     // Prepare prediction data
//     const predictionData = {
//       productName: product ? product.name : productName,
//       category: product ? product.category : category,
//       basePrice: product ? product.basePrice : parseFloat(basePrice),
//       day: parseInt(day),
//       marketingSpend: parseFloat(marketingSpend),
//       season: season.toLowerCase(),
//       brandPresence: parseInt(brandPresence),
//       location: useLocation && location ? location : null
//     };

//     // Use the enhanced model for prediction
//     const predictionResult = await modelPredictSales(predictionData);

//     // Shape the response
//     res.json({
//       prediction: predictionResult.predictedSales,
//       currency: product?.currency || 'USD',
//       product: predictionData.productName,
//       confidence: predictionResult.confidence,
//       marketInsights: {
//         marketTier: predictionResult.marketTier,
//         economicImpact: predictionResult.economicImpact,
//         infrastructureImpact: predictionResult.infrastructureImpact,
//         digitalizationImpact: predictionResult.digitalizationImpact,
//         brandImpact: predictionResult.brandImpact
//       }
//     });

//   } catch (error) {
//     console.error('Prediction error:', error);
//     res.status(500).json({ error: 'Prediction failed', details: error.message });
//   }
// };

// export default predictSales;
import { predictSales as modelPredictSales } from '../models/salesModel.js';
import { Product } from '../models/productModel.js';

// Cache for frequently accessed products
const productCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fast product lookup with caching
async function getProductInfo(productId) {
  if (!productId) return null;
  
  // Check cache first
  const cacheKey = `product_${productId}`;
  const cached = productCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const product = await Product.findById(productId);
    
    // Cache the result
    if (product) {
      productCache.set(cacheKey, {
        data: product,
        timestamp: Date.now()
      });
    }
    
    return product;
  } catch (error) {
    console.warn('Product lookup failed:', error);
    return null;
  }
}

// Input validation with early returns for speed
function validateInput(reqBody) {
  const {
    productId,
    productName,
    basePrice,
    day,
    marketingSpend,
    season,
    brandPresence
  } = reqBody;

  // Quick validation checks
  if (!productId && !productName) {
    return { isValid: false, error: 'Product ID or name is required' };
  }
  
  if (basePrice === undefined || basePrice === null) {
    return { isValid: false, error: 'Base price is required' };
  }
  
  if (day === undefined || day === null) {
    return { isValid: false, error: 'Day is required' };
  }
  
  if (marketingSpend === undefined || marketingSpend === null) {
    return { isValid: false, error: 'Marketing spend is required' };
  }
  
  if (!season) {
    return { isValid: false, error: 'Season is required' };
  }
  
  if (brandPresence === undefined || brandPresence === null) {
    return { isValid: false, error: 'Brand presence is required' };
  }

  return { isValid: true };
}

// Optimized data preparation
function preparePredictionData(reqBody, product) {
  const {
    productName,
    category,
    basePrice,
    day,
    marketingSpend,
    season,
    brandPresence,
    location,
    useLocation
  } = reqBody;

  return {
    productName: product?.name || productName,
    category: product?.category || category,
    basePrice: product?.basePrice || parseFloat(basePrice),
    day: parseInt(day),
    marketingSpend: parseFloat(marketingSpend),
    season: season.toLowerCase(),
    brandPresence: parseInt(brandPresence),
    location: useLocation && location ? location : null
  };
}

export const predictSales = async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Fast input validation
    const validation = validateInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const { productId } = req.body;
    
    // Parallel execution: get product info while preparing other data
    const [product] = await Promise.all([
      productId ? getProductInfo(productId) : Promise.resolve(null)
    ]);

    // Check if product exists when productId is provided
    if (productId && !product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Prepare prediction data
    const predictionData = preparePredictionData(req.body, product);

    // Make fast prediction
    const predictionResult = await modelPredictSales(predictionData);

    // Shape the response
    const response = {
      prediction: predictionResult.predictedSales,
      currency: product?.currency || 'USD',
      product: predictionData.productName,
      confidence: predictionResult.confidence,
      processingTime: Date.now() - startTime,
      marketInsights: {
        marketTier: predictionResult.marketTier,
        economicImpact: predictionResult.economicImpact,
        infrastructureImpact: predictionResult.infrastructureImpact,
        digitalizationImpact: predictionResult.digitalizationImpact,
        brandImpact: predictionResult.brandImpact
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Prediction error:', error);
    
    // Provide fallback response instead of failure
    const fallbackResponse = {
      prediction: Math.max(10, Math.round(
        25 + Math.log((req.body.marketingSpend || 0) + 1) * 5
      )),
      currency: 'USD',
      product: req.body.productName || 'Unknown Product',
      confidence: 0.6,
      processingTime: Date.now() - startTime,
      marketInsights: {
        marketTier: 3,
        economicImpact: 1.0,
        infrastructureImpact: 1.0,
        digitalizationImpact: 0.8,
        brandImpact: 1.0
      },
      warning: 'Prediction generated using fallback method'
    };
    
    res.status(200).json(fallbackResponse);
  }
};

// Cleanup cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of productCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      productCache.delete(key);
    }
  }
}, CACHE_DURATION);

export default predictSales;