import express from 'express';
import { Product } from '../models/productModel.js';

const router = express.Router();

router.get('/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).select('name category basePrice');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/products/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;