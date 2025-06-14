import express from 'express';
import predictSales from "../controllers/salesController.js";
import { getCountries, getRegions, getCities, getLocation } from '../controllers/locationController.js';

const router = express.Router();

// Product routes
// Note: In a real app, these would be implemented in a products controller
router.get('/products/categories', (req, res) => {
  // Mock categories - in production this would come from the database
  res.json(['Electronics', 'Clothing', 'Home Goods', 'Sports', 'Toys', 'Books', 'Beauty', 'Health', 'Automotive', 'Office']);
});

router.get('/products', (req, res) => {
  // Mock products by category - in production this would come from the database
  const { category } = req.query;
  const products = {
    'Electronics': [
      { _id: 'e1', name: 'Smartphone X', basePrice: 599 },
      { _id: 'e2', name: 'Wireless Earbuds', basePrice: 129 },
      { _id: 'e3', name: 'Smart Watch', basePrice: 249 }
    ],
    'Clothing': [
      { _id: 'c1', name: 'Denim Jeans', basePrice: 79 },
      { _id: 'c2', name: 'Cotton T-Shirt', basePrice: 19 },
      { _id: 'c3', name: 'Winter Jacket', basePrice: 149 }
    ],
    // Add more categories as needed
  };
  
  res.json(products[category] || []);
});

// Location routes
router.get('/locations/countries', getCountries);
router.get('/locations/regions', getRegions);
router.get('/locations/cities', getCities);
router.get('/locations/data', getLocation);

// AI insights route
router.post('/ai/insights', (req, res) => {
  // Mock AI response - in production this would call an AI service
  // This would typically call ChatGPT/OpenAI API or similar
  const { messages } = req.body;
  
  // Generate a simple response based on the input
  // In production, this would be much more sophisticated
  const mockResponse = `🌞 Best Seasonal Use: Perfect for summer outings with moisture-wicking fabric and water resistance.

🎯 Target Customer: Young professionals (25-35) seeking outdoor gear for weekend adventures.

💡 Smart Marketing Tip: Focus on Instagram with action shots showing product in use at outdoor cafes and parks.

💰 Pricing Strategy: Create a weekend bundle with 15% off when purchased with complementary items.

⚠️ Inventory Suggestion: Stock 150 units for the first week of summer—opening weekend drives 45% of seasonal sales.

🤝 Complementary Product: Pair with our lightweight backpack to boost average order value by $45.

🌟 Limited-Time Offer: "Summer Ready" bundle with 20% off when purchased with any shorts or footwear.

✅ Immediate Action: Ensure front-of-store placement during first two weeks of summer season.

❌ What to Avoid: Don't market primarily to older demographics—they're not the core buyer for this product line.

💡 Expert Tip: Feature actual customer photos in your social media to increase engagement rates by 35%.`;

  setTimeout(() => {
    res.json({
      choices: [
        {
          message: {
            content: mockResponse
          }
        }
      ]
    });
  }, 800); // Simulate a slight delay for realism
});

// Prediction route
router.post('/predict-sales', predictSales);

export default router;